"""
GeoIQ Location Recommendation Engine
Computes transparent, explainable, multi-factor opportunity scores for candidate locations.
"""

import numpy as np
import pandas as pd
from typing import List, Dict, Any, Optional
from backend.app.schemas.models import ScoringWeights
from backend.app.geospatial.distance import haversine_distance

class RecommendationEngine:
    def __init__(self, analytics_engine):
        self.ae = analytics_engine

    def compute_recommendations(self, weights: Optional[ScoringWeights] = None,
                                region: Optional[str] = None, state: Optional[str] = None,
                                max_investment: Optional[float] = None) -> List[Dict[str, Any]]:
        """
        Dynamically computes opportunity scores and financial projections for candidate sites.
        """
        if weights is None:
            weights = ScoringWeights()

        # Validate weights sum to 1.0 (with slight float tolerance)
        total_w = (weights.demand + weights.coverage_gap + weights.population +
                   weights.low_competition + weights.accessibility + weights.cost_attractiveness)
        if abs(total_w - 1.0) > 0.01:
            # Re-normalize
            w_demand = weights.demand / total_w
            w_gap = weights.coverage_gap / total_w
            w_pop = weights.population / total_w
            w_comp = weights.low_competition / total_w
            w_acc = weights.accessibility / total_w
            w_cost = weights.cost_attractiveness / total_w
        else:
            w_demand = weights.demand
            w_gap = weights.coverage_gap
            w_pop = weights.population
            w_comp = weights.low_competition
            w_acc = weights.accessibility
            w_cost = weights.cost_attractiveness

        df_cand = self.ae.df_candidates.copy()
        df_cand = df_cand.merge(
            self.ae.df_locations[["location_id", "city", "state", "region", "city_category", "population_estimate"]],
            on="location_id",
            how="left"
        )

        if region and region not in ["All", "All Regions"]:
            df_cand = df_cand[df_cand["region"] == region]
        if state and state not in ["All", "All States"]:
            df_cand = df_cand[df_cand["state"] == state]

        if len(df_cand) == 0:
            return []

        # Location aggregate metrics
        dem_map = self.ae.df_demand.groupby("location_id")["estimated_demand_units"].sum().to_dict()
        store_cap_map = self.ae.df_stores.groupby("location_id")["monthly_capacity"].sum().to_dict()
        comp_count_map = self.ae.df_competitors.groupby("location_id")["competitor_id"].count().to_dict()

        # Prepare raw metric vectors for safe 0-100 normalization
        raw_demand = []
        raw_gap = []
        raw_pop = []
        raw_comp = []
        raw_acc = []
        raw_cost = []

        for idx, row in df_cand.iterrows():
            loc_id = row["location_id"]
            pop = row["population_estimate"]
            dem = dem_map.get(loc_id, 0)
            existing_annual_cap = store_cap_map.get(loc_id, 0) * 12
            gap = max(0, dem - existing_annual_cap)
            comp_count = comp_count_map.get(loc_id, 0)
            acc = row["accessibility_score"]
            setup_cost = row["estimated_setup_cost"]

            raw_demand.append(dem)
            raw_gap.append(gap)
            raw_pop.append(pop)
            raw_comp.append(comp_count)
            raw_acc.append(acc)
            raw_cost.append(setup_cost)

        def normalize(vals, invert=False):
            arr = np.array(vals, dtype=float)
            min_v, max_v = np.min(arr), np.max(arr)
            if max_v == min_v:
                return np.full_like(arr, 50.0)
            norm = (arr - min_v) / (max_v - min_v) * 100.0
            return (100.0 - norm) if invert else norm

        score_demand = normalize(raw_demand)
        score_gap = normalize(raw_gap)
        score_pop = normalize(raw_pop)
        score_low_comp = normalize(raw_comp, invert=True)  # Lower competition -> higher score
        score_acc = normalize(raw_acc)
        score_cost = normalize(raw_cost, invert=True)      # Lower setup cost -> higher score

        recommendations = []
        for i, (idx, row) in enumerate(df_cand.iterrows()):
            s_dem = float(score_demand[i])
            s_gap = float(score_gap[i])
            s_pop = float(score_pop[i])
            s_comp = float(score_low_comp[i])
            s_acc = float(score_acc[i])
            s_cst = float(score_cost[i])

            opportunity_score = round(
                w_demand * s_dem +
                w_gap * s_gap +
                w_pop * s_pop +
                w_comp * s_comp +
                w_acc * s_acc +
                w_cost * s_cst,
                1
            )

            # Financial estimates for candidate store
            # Monthly addressable demand
            m_demand = raw_demand[i] / 12.0
            capture_rate = 0.16 # Baseline capture rate
            captured_units = m_demand * capture_rate
            # Average revenue per unit ~ Rs 1,450
            avg_rev_per_unit = 1450.0
            monthly_revenue = round(captured_units * avg_rev_per_unit, 2)

            # Cost of goods sold: ~ 65% of revenue
            monthly_cogs = round(monthly_revenue * 0.65, 2)
            monthly_op_cost = row["estimated_monthly_operating_cost"] + row["estimated_rent"]
            monthly_op_profit = round(monthly_revenue - monthly_cogs - monthly_op_cost, 2)

            investment = row["estimated_setup_cost"]
            if max_investment and investment > max_investment:
                continue

            # Payback period in months
            if monthly_op_profit > 0:
                payback_months = round(investment / monthly_op_profit, 1)
            else:
                payback_months = None

            # Risk level categorization
            if s_comp < 35 or s_gap < 30 or monthly_op_profit <= 0:
                risk_level = "High"
            elif s_comp < 60 or payback_months is None or payback_months > 36:
                risk_level = "Moderate"
            else:
                risk_level = "Low"

            # Dynamic explanation generator
            explanation_parts = []
            if s_gap >= 70:
                explanation_parts.append(f"Major retail coverage void with {round(raw_gap[i]/1000.0, 1)}K unfulfilled units.")
            if s_comp >= 70:
                explanation_parts.append("Low competitor saturation provides prime first-mover advantage.")
            elif s_comp <= 35:
                explanation_parts.append("Competitive market with established retail chains present.")
            if s_acc >= 75:
                explanation_parts.append("High accessibility and transit connectivity.")
            explanation = " ".join(explanation_parts) if explanation_parts else "Balanced market fundamentals for standard format deployment."

            recommendations.append({
                "candidate_id": row["candidate_id"],
                "location_id": row["location_id"],
                "city": row["city"],
                "state": row["state"],
                "region": row["region"],
                "latitude": row["latitude"],
                "longitude": row["longitude"],
                "opportunity_score": opportunity_score,
                "score_breakdown": {
                    "demand_score": round(s_dem, 1),
                    "coverage_gap_score": round(s_gap, 1),
                    "population_score": round(s_pop, 1),
                    "low_competition_score": round(s_comp, 1),
                    "accessibility_score": round(s_acc, 1),
                    "cost_attractiveness_score": round(s_cst, 1)
                },
                "customer_demand": int(raw_demand[i]),
                "coverage_gap_units": int(raw_gap[i]),
                "competition_count": int(raw_comp[i]),
                "estimated_investment": float(investment),
                "estimated_investment_lakhs": round(investment / 100000.0, 2),
                "estimated_monthly_revenue": monthly_revenue,
                "estimated_monthly_revenue_lakhs": round(monthly_revenue / 100000.0, 2),
                "estimated_monthly_operating_profit": monthly_op_profit,
                "estimated_monthly_profit_lakhs": round(monthly_op_profit / 100000.0, 2),
                "estimated_payback_months": payback_months,
                "risk_level": risk_level,
                "explanation": explanation
            })

        # Sort dynamically by opportunity score descending
        recommendations = sorted(recommendations, key=lambda x: x["opportunity_score"], reverse=True)
        return recommendations
