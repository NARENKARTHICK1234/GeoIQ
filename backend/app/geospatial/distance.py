"""
GeoIQ Geospatial Distance Module
Implements precise Haversine distance calculations and spatial proximity functions.
"""

import math
from typing import List, Tuple, Dict, Any

EARTH_RADIUS_KM = 6371.0088

def haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """
    Calculates great-circle distance between two points on Earth in kilometers.
    Uses Haversine formula.
    """
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = (math.sin(dlat / 2.0) ** 2 +
         math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) *
         math.sin(dlon / 2.0) ** 2)
    c = 2.0 * math.atan2(math.sqrt(a), math.sqrt(1.0 - a))
    return EARTH_RADIUS_KM * c

def find_nearest(point_lat: float, point_lon: float, candidates: List[Dict[str, Any]], lat_key="latitude", lon_key="longitude") -> Tuple[Dict[str, Any], float]:
    """
    Finds nearest candidate item and returns (candidate, distance_km).
    """
    if not candidates:
        return None, float('inf')
    best_item = None
    min_dist = float('inf')
    for c in candidates:
        d = haversine_distance(point_lat, point_lon, c[lat_key], c[lon_key])
        if d < min_dist:
            min_dist = d
            best_item = c
    return best_item, min_dist

def points_within_radius(center_lat: float, center_lon: float, points: List[Dict[str, Any]], radius_km: float, lat_key="latitude", lon_key="longitude") -> List[Tuple[Dict[str, Any], float]]:
    """
    Finds all points within given radius (km).
    """
    within = []
    for p in points:
        d = haversine_distance(center_lat, center_lon, p[lat_key], p[lon_key])
        if d <= radius_km:
            within.append((p, d))
    return within
