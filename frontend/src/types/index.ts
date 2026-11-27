export interface OverviewKPIs {
  total_revenue: number;
  total_revenue_cr: number;
  total_sales_units: number;
  total_stores: number;
  total_customers: number;
  avg_revenue_per_store: number;
  profit_margin: number;
  market_coverage: number;
  high_demand_low_presence_count: number;
  expansion_opportunities_count: number;
  monthly_trend: Array<{ month: string; sales_revenue: number; revenue_cr: number }>;
  growth_rates: {
    revenue_yoy: number;
    stores_yoy: number;
    customers_yoy: number;
    avg_sales_yoy: number;
    market_coverage_change: number;
  };
}

export interface SmartInsight {
  title: string;
  supporting_metric: string;
  geographic_location: string;
  explanation: string;
  recommended_action: string;
  priority: 'High' | 'Medium' | 'Low';
  assumptions?: string;
}

export interface RecommendationItem {
  candidate_id: string;
  location_id: string;
  city: string;
  state: string;
  region: string;
  latitude: number;
  longitude: number;
  opportunity_score: number;
  score_breakdown: {
    demand_score: number;
    coverage_gap_score: number;
    population_score: number;
    low_competition_score: number;
    accessibility_score: number;
    cost_attractiveness_score: number;
  };
  customer_demand: number;
  coverage_gap_units: number;
  competition_count: number;
  estimated_investment: number;
  estimated_investment_lakhs: number;
  estimated_monthly_revenue: number;
  estimated_monthly_revenue_lakhs: number;
  estimated_monthly_operating_profit: number;
  estimated_monthly_profit_lakhs: number;
  estimated_payback_months: number | null;
  risk_level: 'Low' | 'Moderate' | 'High';
  explanation: string;
}

export interface StoreItem {
  store_id: string;
  store_name: string;
  location_id: string;
  city: string;
  state: string;
  region: string;
  latitude: number;
  longitude: number;
  store_type: string;
  opening_date: string;
  coverage_radius_km: number;
  monthly_capacity: number;
  revenue?: number;
  revenue_lakhs?: number;
}

export interface CompetitorItem {
  competitor_id: string;
  competitor_name: string;
  location_id: string;
  city: string;
  state: string;
  region: string;
  latitude: number;
  longitude: number;
  competitor_type: string;
  estimated_capacity: number;
}

export interface FilterState {
  region: string;
  state: string;
  city: string;
  category: string;
  storeType: string;
  dateRange: string;
}
