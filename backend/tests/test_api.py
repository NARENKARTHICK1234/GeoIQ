"""
GeoIQ Backend Test Suite
Validates API endpoints, calculations, and financial simulation logic.
"""

import pytest
from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["service"] == "GeoIQ"

def test_overview_endpoint():
    response = client.get("/api/overview")
    assert response.status_code == 200
    data = response.json()
    assert "kpis" in data
    assert data["kpis"]["total_revenue"] > 0
    assert data["kpis"]["total_stores"] > 0
    assert "sales_by_region" in data

def test_sales_endpoint():
    response = client.get("/api/sales")
    assert response.status_code == 200
    data = response.json()
    assert "by_state" in data
    assert len(data["by_state"]) > 0

def test_demand_endpoint():
    response = client.get("/api/demand")
    assert response.status_code == 200
    data = response.json()
    assert "total_demand_units" in data
    assert data["total_demand_units"] > 0

def test_stores_endpoint():
    response = client.get("/api/stores")
    assert response.status_code == 200
    data = response.json()
    assert "total_stores" in data
    assert len(data["stores_list"]) > 0

def test_market_gap_endpoint():
    response = client.get("/api/market-gap")
    assert response.status_code == 200
    data = response.json()
    assert "high_demand_low_presence" in data
    assert len(data["high_demand_low_presence"]) > 0

def test_recommendations_endpoint():
    response = client.get("/api/recommendations")
    assert response.status_code == 200
    data = response.json()
    assert "all_recommendations" in data
    assert len(data["all_recommendations"]) > 0
    top = data["all_recommendations"][0]
    assert "opportunity_score" in top
    assert 0 <= top["opportunity_score"] <= 100

def test_spa_root_serving():
    response = client.get("/")
    assert response.status_code == 200
    assert "text/html" in response.headers.get("content-type", "")

def test_spa_client_routing():
    response = client.get("/dashboard")
    assert response.status_code == 200
    assert "text/html" in response.headers.get("content-type", "")

def test_simulation_calculation():
    payload = {
        "budget": 20000000.0,
        "proposed_stores": 5,
        "coverage_radius_km": 10.0,
        "demand_growth": 0.15,
        "expected_capture_rate": 0.20
    }
    response = client.post("/api/simulator/calculate", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "allocated_budget" in data
    assert data["allocated_budget"] <= 20000000.0
    assert "scenarios" in data
    assert "base" in data["scenarios"]
    assert data["scenarios"]["base"]["monthly_revenue"] > 0

def test_geojson_endpoint():
    response = client.get("/api/maps/geojson")
    assert response.status_code == 200
    data = response.json()
    assert data["type"] == "FeatureCollection"
    assert len(data["features"]) > 0

def test_api_404():
    response = client.get("/api/nonexistent_route")
    assert response.status_code == 404
    assert response.json()["error"] == "API route not found"
