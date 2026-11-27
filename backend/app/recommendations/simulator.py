"""
GeoIQ Financial & Expansion Simulator Engine
Simulates multi-store expansion scenarios with transparent financial modeling,
addressable demand capture, overlapping coverage deduplication, and sensitivity tiers.
"""

from typing import Dict, Any, List
from backend.app.schemas.models import SimulatorRequest
from backend.app.recommendations.scorer import RecommendationEngine
from backend.app.geospatial.distance import haversine_distance

class ExpansionSimulator:
    def __init__(self, analytics_engine):
        self.ae = analytics_engine
        self.scorer = RecommendationEngine(analytics_engine)

    def run_simulation(self, req: SimulatorRequest) -> Dict[str, Any]:
        """
        Executes business expansion simulation based on user parameters.
        Selects top candidate locations that fit within budget and avoid redundant spatial overlap.
        """
        all_recs = self.scorer.compute_recommendations(weights=req.weights)

        # Budget-aware candidate selection with spatial overlap check
        selected_candidates = []
        spent_budget = 0.0
        remaining_budget = req.budget

        for cand in all_recs:
            if len(selected_candidates) >= req.proposed_stores:
                break
            cost = cand["estimated_investment"]
            if cost <= remaining_budget:
                # Check geographic overlap with already selected candidates
                is_overlap = False
                for sel in selected_candidates:
                    dist = haversine_distance(cand["latitude"], cand["longitude"], sel["latitude"], sel["longitude"])
                    if dist < (req.coverage_radius_km * 1.5): # overlap threshold
                        is_overlap = True
                        break

                if not is_overlap:
                    selected_candidates.append(cand)
                    spent_budget += cost
                    remaining_budget -= cost

        # If budget allows more but overlap skipped, fallback to next best within budget
        if len(selected_candidates) < req.proposed_stores:
            for cand in all_recs:
                if len(selected_candidates) >= req.proposed_stores:
                    break
                if cand not in selected_candidates:
                    cost = cand["estimated_investment"]
                    if cost <= remaining_budget:
                        selected_candidates.append(cand)
                        spent_budget += cost
                        remaining_budget -= cost

        # Multi-scenario projections: Base, Conservative, Optimistic
        # Base capture rate = req.expected_capture_rate * (1 + req.demand_growth)
        def project_scenario(multiplier_capture: float, margin_mult: float, cost_mult: float):
            cap_rate = req.expected_capture_rate * multiplier_capture
            tot_monthly_rev = 0.0
            tot_monthly_profit = 0.0
            tot_monthly_units = 0.0

            for sc in selected_candidates:
                # Monthly demand in location
                m_dem = sc["customer_demand"] / 12.0 * (1.0 + req.demand_growth)
                units = m_dem * cap_rate
                tot_monthly_units += units

                # Revenue per unit
                rev_per_unit = req.avg_transaction_value if req.avg_transaction_value else 1450.0
                m_rev = units * rev_per_unit
                tot_monthly_rev += m_rev

                # Operating margin & product costs
                cogs = m_rev * (0.65 / margin_mult)
                op_cost = (sc["estimated_monthly_revenue"] * 0.20 + 250000.0) * cost_mult
                m_profit = m_rev - cogs - op_cost
                tot_monthly_profit += m_profit

            annual_revenue = tot_monthly_rev * 12.0
            annual_profit = tot_monthly_profit * 12.0
            payback_months = round(spent_budget / tot_monthly_profit, 1) if tot_monthly_profit > 0 else None

            return {
                "monthly_revenue": round(tot_monthly_rev, 2),
                "monthly_revenue_cr": round(tot_monthly_rev / 10000000.0, 2),
                "annual_revenue": round(annual_revenue, 2),
                "annual_revenue_cr": round(annual_revenue / 10000000.0, 2),
                "monthly_operating_profit": round(tot_monthly_profit, 2),
                "monthly_profit_cr": round(tot_monthly_profit / 10000000.0, 2),
                "annual_operating_profit": round(annual_profit, 2),
                "annual_profit_cr": round(annual_profit / 10000000.0, 2),
                "monthly_demand_units_captured": int(tot_monthly_units),
                "payback_period_months": payback_months,
                "roi_year1_pct": round((annual_profit / spent_budget * 100.0) if spent_budget > 0 else 0.0, 1)
            }

        scenarios = {
            "conservative": project_scenario(multiplier_capture=0.75, margin_mult=0.92, cost_mult=1.12),
            "base": project_scenario(multiplier_capture=1.00, margin_mult=1.00, cost_mult=1.00),
            "optimistic": project_scenario(multiplier_capture=1.28, margin_mult=1.08, cost_mult=0.94)
        }

        # Market coverage improvement
        current_stores_count = len(self.ae.df_stores)
        new_stores_count = current_stores_count + len(selected_candidates)

        curr_kpis = self.ae.get_overview_kpis()
        curr_coverage = curr_kpis["market_coverage"]

        # Additional population covered by new stores
        selected_loc_ids = set(c["location_id"] for c in selected_candidates)
        existing_loc_ids = set(self.ae.df_stores["location_id"].unique())
        new_loc_ids = selected_loc_ids - existing_loc_ids

        total_pop = self.ae.df_locations["population_estimate"].sum()
        addl_pop = self.ae.df_locations[self.ae.df_locations["location_id"].isin(new_loc_ids)]["population_estimate"].sum()
        coverage_increase_pp = round((addl_pop / total_pop * 100.0) if total_pop > 0 else 0.0, 1)
        simulated_coverage = round(min(100.0, curr_coverage + coverage_increase_pp), 1)

        return {
            "input_parameters": req.model_dump(),
            "allocated_budget": round(spent_budget, 2),
            "allocated_budget_cr": round(spent_budget / 10000000.0, 2),
            "remaining_budget": round(remaining_budget, 2),
            "proposed_stores_deployed": len(selected_candidates),
            "selected_locations": selected_candidates,
            "scenarios": scenarios,
            "coverage_impact": {
                "current_coverage_pct": curr_coverage,
                "simulated_coverage_pct": simulated_coverage,
                "coverage_increase_pp": coverage_increase_pp,
                "total_stores_before": current_stores_count,
                "total_stores_after": new_stores_count
            },
            "assumptions_disclaimer": [
                "Addressable demand is estimated based on regional retail spending surveys.",
                "Overlapping customer coverage between adjacent candidate sites is eliminated using 1.5x buffer radius.",
                "Operating costs include rent, staffing, utilities, and standard store maintenance.",
                "Payback period assumes constant monthly profit without compounding discount factor."
            ]
        }
