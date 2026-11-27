"""
GeoIQ REST API Endpoints
All official endpoints implementing geospatial analytics, simulations, maps, and datasets.
"""

import os
import json
import pandas as pd
from typing import Optional, Dict, Any, List
from fastapi import APIRouter, Query, UploadFile, File, HTTPException, Response
from fastapi.responses import JSONResponse, FileResponse
from backend.app.analytics.engine import analytics_engine
from backend.app.recommendations.scorer import RecommendationEngine
from backend.app.recommendations.simulator import ExpansionSimulator
from backend.app.schemas.models import SimulatorRequest, ScoringWeights, ReportGenerateRequest

router = APIRouter(prefix="/api")
scorer = RecommendationEngine(analytics_engine)
simulator = ExpansionSimulator(analytics_engine)

# Resolve data directory safely
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
ROOT_DIR = os.path.abspath(os.path.join(CURRENT_DIR, "..", "..", ".."))
DATA_DIR = os.path.join(ROOT_DIR, "data")
if not os.path.exists(DATA_DIR):
    DATA_DIR = os.path.abspath("data")

@router.get("/health")
def get_health():
    """Health check endpoint required by Render and deployment monitoring."""
    return {"status": "healthy", "service": "GeoIQ"}

@router.get("/overview")
def get_overview(
    region: Optional[str] = Query(None),
    state: Optional[str] = Query(None),
    city: Optional[str] = Query(None),
    category: Optional[str] = Query(None)
):
    """Overview dashboard KPIs, trend lines, regional breakdown, and insights."""
    kpis = analytics_engine.get_overview_kpis(region, state, city, category)
    sales_data = analytics_engine.get_sales_analysis(region, state, category)
    gap_data = analytics_engine.get_market_gap_data(region, state)
    insights = analytics_engine.generate_smart_insights()

    # Top performing states (top 5)
    top_states = sales_data["by_state"][:5]

    # Top expansion opportunities (top 5)
    recs = scorer.compute_recommendations(region=region, state=state)[:5]

    return {
        "kpis": kpis,
        "sales_by_region": sales_data["by_region"],
        "top_performing_states": top_states,
        "top_expansion_opportunities": recs,
        "key_insights": insights,
        "demand_vs_store_presence_count": kpis["high_demand_low_presence_count"]
    }

@router.get("/sales")
def get_sales(
    region: Optional[str] = Query(None),
    state: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
    start_date: Optional[str] = Query(None),
    end_date: Optional[str] = Query(None)
):
    """Geographic sales distribution, state choropleth data, city bubbles, and treemap."""
    return analytics_engine.get_sales_analysis(region, state, category)

@router.get("/demand")
def get_demand(
    region: Optional[str] = Query(None),
    state: Optional[str] = Query(None),
    category: Optional[str] = Query(None)
):
    """Customer demand heatmap points, monthly demand trend, customer segments, city types."""
    return analytics_engine.get_demand_analysis(region, state, category)

@router.get("/stores")
def get_stores(
    region: Optional[str] = Query(None),
    state: Optional[str] = Query(None)
):
    """Existing store markers, coverage radii, capacities, and store type summary."""
    return analytics_engine.get_store_analysis(region, state)

@router.get("/market-gap")
def get_market_gap(
    region: Optional[str] = Query(None),
    state: Optional[str] = Query(None)
):
    """Market gap analysis: 4-quadrant demand vs store presence classification."""
    return analytics_engine.get_market_gap_data(region, state)

@router.get("/competitors")
def get_competitors(
    region: Optional[str] = Query(None),
    state: Optional[str] = Query(None)
):
    """Competitor locations, brand distribution, and clustering density."""
    return analytics_engine.get_competitor_analysis(region, state)

@router.get("/population")
def get_population(
    region: Optional[str] = Query(None),
    state: Optional[str] = Query(None)
):
    """Demographics, population density, purchasing potential, and urban vs rural split."""
    return analytics_engine.get_population_analysis(region, state)

@router.get("/revenue")
def get_revenue(
    region: Optional[str] = Query(None),
    state: Optional[str] = Query(None)
):
    """Regional revenue, gross profit, operating cost comparison, and margins."""
    return analytics_engine.get_revenue_analysis(region, state)

@router.get("/opportunities")
def get_opportunities(
    region: Optional[str] = Query(None),
    state: Optional[str] = Query(None),
    max_investment: Optional[float] = Query(None)
):
    """Ranked expansion opportunities based on multi-factor weighted scoring."""
    recs = scorer.compute_recommendations(region=region, state=state, max_investment=max_investment)
    return {
        "total_opportunities": len(recs),
        "opportunities": recs
    }

@router.get("/recommendations")
def get_recommendations(
    w_demand: Optional[float] = Query(0.30),
    w_gap: Optional[float] = Query(0.25),
    w_pop: Optional[float] = Query(0.15),
    w_comp: Optional[float] = Query(0.15),
    w_acc: Optional[float] = Query(0.10),
    w_cost: Optional[float] = Query(0.05),
    region: Optional[str] = Query(None),
    state: Optional[str] = Query(None),
    max_investment: Optional[float] = Query(None)
):
    """Smart location recommendations with user-customizable weights."""
    weights = ScoringWeights(
        demand=w_demand,
        coverage_gap=w_gap,
        population=w_pop,
        low_competition=w_comp,
        accessibility=w_acc,
        cost_attractiveness=w_cost
    )
    recs = scorer.compute_recommendations(weights=weights, region=region, state=state, max_investment=max_investment)
    return {
        "weights_applied": weights.model_dump(),
        "total_recommendations": len(recs),
        "top_three": recs[:3] if len(recs) >= 3 else recs,
        "all_recommendations": recs
    }

@router.get("/maps/geojson")
def get_maps_geojson():
    """Serves simplified GeoJSON boundaries for Indian states."""
    path = os.path.join(DATA_DIR, "geojson", "india_states.json")
    if not os.path.exists(path):
        raise HTTPException(status_code=404, detail="GeoJSON boundary file not found.")
    with open(path, "r", encoding="utf-8") as f:
        data = json.load(f)
    return JSONResponse(content=data)

@router.get("/maps/heatmap")
def get_maps_heatmap(metric: Optional[str] = Query("demand")):
    """Returns coordinate points with intensity weights for map heatmap rendering."""
    if metric == "demand":
        res = analytics_engine.get_demand_analysis()
        points = [{"lat": p["latitude"], "lng": p["longitude"], "weight": p["intensity"], "city": p["city"]} for p in res["demand_points"]]
    elif metric == "competitors":
        comps = analytics_engine.df_competitors
        points = [{"lat": r["latitude"], "lng": r["longitude"], "weight": 0.8, "city": r["competitor_name"]} for _, r in comps.iterrows()]
    else:
        # Default stores
        stores = analytics_engine.df_stores
        points = [{"lat": r["latitude"], "lng": r["longitude"], "weight": 0.9, "city": r["store_name"]} for _, r in stores.iterrows()]

    return {"metric": metric, "count": len(points), "points": points}

@router.get("/maps/coverage")
def get_maps_coverage():
    """Returns store locations with their coverage radius (in meters and km) for circle layers."""
    stores = analytics_engine.df_stores_enriched
    circles = []
    for _, r in stores.iterrows():
        circles.append({
            "store_id": r["store_id"],
            "name": r["store_name"],
            "city": r["city"],
            "lat": r["latitude"],
            "lng": r["longitude"],
            "radius_km": r["coverage_radius_km"],
            "radius_meters": r["coverage_radius_km"] * 1000.0,
            "type": r["store_type"],
            "capacity": r["monthly_capacity"]
        })
    return {"total_stores": len(circles), "stores": circles}

@router.post("/simulator/calculate")
def calculate_simulation(req: SimulatorRequest):
    """Calculates What-If expansion simulator with transparent financials."""
    return simulator.run_simulation(req)

@router.post("/datasets/upload")
async def upload_dataset(file: UploadFile = File(...), dataset_type: str = Query("transactions")):
    """Handles dataset upload with schema validation and coordinate bounds checking."""
    if not file.filename.endswith((".csv", ".xlsx", ".json")):
        raise HTTPException(status_code=400, detail="Only CSV, Excel, and JSON files are supported.")

    content = await file.read()
    if len(content) > 15 * 1024 * 1024:  # 15MB limit
        raise HTTPException(status_code=400, detail="File size exceeds maximum 15MB limit.")

    try:
        if file.filename.endswith(".csv"):
            import io
            df = pd.read_csv(io.BytesIO(content))
        elif file.filename.endswith(".xlsx"):
            import io
            df = pd.read_excel(io.BytesIO(content))
        else:
            df = pd.read_json(io.BytesIO(content))
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to parse uploaded dataset: {str(e)}")

    # Coordinate validation if latitude & longitude exist
    coord_issues = 0
    if "latitude" in df.columns and "longitude" in df.columns:
        invalid_coords = df[(df["latitude"] < 6.0) | (df["latitude"] > 38.0) | (df["longitude"] < 68.0) | (df["longitude"] > 98.0)]
        coord_issues = len(invalid_coords)

    missing_cells = int(df.isnull().sum().sum())
    dup_rows = int(df.duplicated().sum())

    quality_score = max(20, 100 - (coord_issues * 2) - (missing_cells // 10) - (dup_rows * 5))

    return {
        "status": "success",
        "filename": file.filename,
        "rows": len(df),
        "columns": list(df.columns),
        "missing_cells": missing_cells,
        "duplicate_rows": dup_rows,
        "invalid_coordinates_detected": coord_issues,
        "quality_score": quality_score,
        "message": "Dataset uploaded and validated successfully."
    }

@router.get("/datasets/sample")
def get_sample_datasets():
    """Lists available pre-loaded synthetic datasets with record counts."""
    return {
        "datasets": [
            {"name": "sales_transactions.csv", "records": len(analytics_engine.df_transactions), "description": "12,500 retail sales transactions across 2024"},
            {"name": "locations.csv", "records": len(analytics_engine.df_locations), "description": "117 cities across 13 Indian states with population and tiers"},
            {"name": "stores.csv", "records": len(analytics_engine.df_stores), "description": "121 operational stores with capacities and types"},
            {"name": "customer_demand.csv", "records": len(analytics_engine.df_demand), "description": "7,020 monthly customer demand estimates across product categories"},
            {"name": "competitors.csv", "records": len(analytics_engine.df_competitors), "description": "294 competitor locations with brand and capacity"},
            {"name": "expansion_candidates.csv", "records": len(analytics_engine.df_candidates), "description": "97 expansion candidates with rent, setup cost and capacity"}
        ]
    }

@router.get("/datasets/preview")
def get_dataset_preview(name: str = Query("sales_transactions.csv"), limit: int = Query(25)):
    """Previews top rows from specified dataset."""
    name = os.path.basename(name)
    path = os.path.join(DATA_DIR, name)
    if not os.path.exists(path):
        raise HTTPException(status_code=404, detail="Dataset not found.")
    df = pd.read_csv(path)
    preview_rows = df.head(min(limit, 100)).fillna("").to_dict("records")
    return {
        "filename": name,
        "total_rows": len(df),
        "columns": list(df.columns),
        "data": preview_rows
    }

@router.get("/datasets/quality")
def get_dataset_quality():
    """Returns data quality metrics across all loaded datasets."""
    metrics = []
    for name, df in [
        ("sales_transactions.csv", analytics_engine.df_transactions),
        ("locations.csv", analytics_engine.df_locations),
        ("stores.csv", analytics_engine.df_stores),
        ("customer_demand.csv", analytics_engine.df_demand),
        ("competitors.csv", analytics_engine.df_competitors),
        ("expansion_candidates.csv", analytics_engine.df_candidates)
    ]:
        missing = int(df.isnull().sum().sum())
        dups = int(df.duplicated().sum())
        completeness = round(((df.size - missing) / df.size * 100.0) if df.size > 0 else 100.0, 1)
        score = 100 if (missing == 0 and dups == 0) else max(70, 100 - missing - dups)
        metrics.append({
            "name": name,
            "rows": len(df),
            "columns": len(df.columns),
            "completeness_pct": completeness,
            "missing_values": missing,
            "duplicates": dups,
            "quality_score": score
        })
    return {"quality_metrics": metrics}

@router.get("/datasets/download")
def download_dataset(name: str = Query("sales_transactions.csv")):
    """Provides secure download of standard sample CSV datasets."""
    name = os.path.basename(name)
    path = os.path.join(DATA_DIR, name)
    if not os.path.exists(path):
        raise HTTPException(status_code=404, detail="Dataset not found.")
    return FileResponse(path, filename=name, media_type="text/csv")

@router.post("/reports/generate")
def generate_report(req: ReportGenerateRequest):
    """Generates comprehensive business report data formatted for download / PDF printing."""
    kpis = analytics_engine.get_overview_kpis(req.region, req.state)
    sales = analytics_engine.get_sales_analysis(req.region, req.state)
    gap = analytics_engine.get_market_gap_data(req.region, req.state)
    recs = scorer.compute_recommendations(region=req.region, state=req.state)[:10]

    report = {
        "title": f"GeoIQ {req.report_type.capitalize()} Analytics Report",
        "generated_at": pd.Timestamp.now().strftime("%Y-%m-%d %H:%M:%S"),
        "geography_scope": f"Region: {req.region or 'National'}, State: {req.state or 'All'}",
        "executive_summary": {
            "total_revenue": f"₹{kpis['total_revenue_cr']} Cr",
            "total_stores": kpis["total_stores"],
            "total_customers": kpis["total_customers"],
            "market_coverage": f"{kpis['market_coverage']}%",
            "unserved_gap_regions": kpis["high_demand_low_presence_count"]
        },
        "top_performing_states": sales["by_state"][:5],
        "market_gap_priority_markets": gap["high_demand_low_presence"][:5],
        "top_expansion_recommendations": recs,
        "methodology": "Weighted Multi-Factor Spatial Scoring & Geodesic Buffer Analysis (Haversine model).",
        "disclaimer": "All analytics figures are computed using synthetic demonstration datasets for GeoIQ."
    }
    return report
