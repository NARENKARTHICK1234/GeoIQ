"""
GeoIQ Pydantic Schemas
"""

from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class FilterParams(BaseModel):
    region: Optional[str] = None
    state: Optional[str] = None
    city: Optional[str] = None
    category: Optional[str] = None
    store_type: Optional[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    radius_km: Optional[float] = None

class ScoringWeights(BaseModel):
    demand: float = Field(0.30, ge=0.0, le=1.0)
    coverage_gap: float = Field(0.25, ge=0.0, le=1.0)
    population: float = Field(0.15, ge=0.0, le=1.0)
    low_competition: float = Field(0.15, ge=0.0, le=1.0)
    accessibility: float = Field(0.10, ge=0.0, le=1.0)
    cost_attractiveness: float = Field(0.05, ge=0.0, le=1.0)

class SimulatorRequest(BaseModel):
    budget: float = Field(15000000.0, ge=1000000.0, description="Total capital expansion budget in INR")
    proposed_stores: int = Field(5, ge=1, le=25, description="Number of proposed store openings")
    coverage_radius_km: float = Field(10.0, ge=3.0, le=30.0, description="Effective radius per store in km")
    demand_growth: float = Field(0.12, ge=-0.2, le=0.5, description="Annual market demand growth rate")
    expected_capture_rate: float = Field(0.18, ge=0.02, le=0.60, description="Estimated addressable demand capture rate")
    avg_transaction_value: Optional[float] = Field(None, description="Average transaction value override")
    weights: Optional[ScoringWeights] = None

class ReportGenerateRequest(BaseModel):
    report_type: str = Field("executive", description="Report type: executive, sales, demand, stores, market_gap, competitors, recommendations, simulation")
    format: str = Field("json", description="json, csv, or summary")
    region: Optional[str] = None
    state: Optional[str] = None
