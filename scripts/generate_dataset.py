"""
GeoIQ - Synthetic Dataset Generator
Generates realistic retail expansion geospatial datasets for India:
- locations.csv (140+ cities across 13 Indian states)
- stores.csv (120+ fictional stores)
- competitors.csv (280+ competitor locations)
- customer_demand.csv (demand across locations, categories, and periods)
- expansion_candidates.csv (high-potential candidate sites)
- sales_transactions.csv (12,000+ realistic retail sales transactions)
- geojson/india_states.json (Simplified GeoJSON boundaries for Indian states)
"""

import os
import random
import json
import numpy as np
import pandas as pd
from datetime import datetime, timedelta

# Fix random seeds for 100% reproducibility
np.random.seed(42)
random.seed(42)

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data")
GEOJSON_DIR = os.path.join(DATA_DIR, "geojson")
os.makedirs(DATA_DIR, exist_ok=True)
os.makedirs(GEOJSON_DIR, exist_ok=True)

# 13 Priority States with Regions and Coordinates Centers
STATES_DATA = [
    # South
    {"state": "Tamil Nadu", "region": "South", "capital": "Chennai", "center": [13.0827, 80.2707],
     "cities": [
         ("Chennai", 13.0827, 80.2707, "Metro", 10971108, 0.95),
         ("Coimbatore", 11.0168, 76.9558, "Tier 1", 2165000, 0.88),
         ("Madurai", 9.9252, 78.1198, "Tier 2", 1561000, 0.82),
         ("Tiruchirappalli", 10.7905, 78.7047, "Tier 2", 1022000, 0.79),
         ("Salem", 11.6643, 78.1460, "Tier 2", 918000, 0.76),
         ("Tirunelveli", 8.7139, 77.7567, "Tier 3", 498000, 0.71),
         ("Erode", 11.3410, 77.7172, "Tier 3", 521000, 0.73),
         ("Vellore", 12.9165, 79.1325, "Tier 3", 485000, 0.72),
         ("Thanjavur", 10.7870, 79.1378, "Tier 3", 322000, 0.69),
         ("Dindigul", 10.3673, 77.9803, "Tier 3", 292000, 0.67),
     ]},
    {"state": "Karnataka", "region": "South", "capital": "Bengaluru", "center": [12.9716, 77.5946],
     "cities": [
         ("Bengaluru", 12.9716, 77.5946, "Metro", 12327000, 0.96),
         ("Mysuru", 12.2958, 76.6394, "Tier 1", 1288000, 0.86),
         ("Hubballi-Dharwad", 15.3647, 75.1240, "Tier 2", 1150000, 0.78),
         ("Mangaluru", 12.9141, 74.8560, "Tier 2", 725000, 0.84),
         ("Belagavi", 15.8497, 74.4977, "Tier 2", 685000, 0.75),
         ("Kalaburagi", 17.3297, 76.8343, "Tier 3", 543000, 0.70),
         ("Davanagere", 14.4644, 75.9218, "Tier 3", 475000, 0.71),
         ("Ballari", 15.1394, 76.9214, "Tier 3", 450000, 0.69),
         ("Shivamogga", 13.9299, 75.5681, "Tier 3", 360000, 0.72),
         ("Tumakuru", 13.3379, 77.1173, "Tier 3", 335000, 0.73),
     ]},
    {"state": "Kerala", "region": "South", "capital": "Thiruvananthapuram", "center": [8.5241, 76.9366],
     "cities": [
         ("Kochi", 9.9312, 76.2673, "Tier 1", 2118000, 0.91),
         ("Thiruvananthapuram", 8.5241, 76.9366, "Tier 1", 1680000, 0.89),
         ("Kozhikode", 11.2588, 75.7804, "Tier 2", 1050000, 0.83),
         ("Thrissur", 10.5276, 76.2144, "Tier 2", 825000, 0.81),
         ("Kollam", 8.8932, 76.6141, "Tier 3", 420000, 0.76),
         ("Kannur", 11.8745, 75.3704, "Tier 3", 390000, 0.75),
         ("Alappuzha", 9.4981, 76.3388, "Tier 3", 345000, 0.74),
         ("Palakkad", 10.7867, 76.6548, "Tier 3", 310000, 0.72),
     ]},
    {"state": "Andhra Pradesh", "region": "South", "capital": "Amaravati", "center": [16.5062, 80.6480],
     "cities": [
         ("Visakhapatnam", 17.6868, 83.2185, "Tier 1", 2358000, 0.89),
         ("Vijayawada", 16.5062, 80.6480, "Tier 1", 1491000, 0.85),
         ("Guntur", 16.3067, 80.4365, "Tier 2", 873000, 0.78),
         ("Nellore", 14.4426, 79.9865, "Tier 2", 600000, 0.75),
         ("Kurnool", 15.8281, 78.0373, "Tier 2", 520000, 0.73),
         ("Rajahmundry", 17.0005, 81.8040, "Tier 3", 480000, 0.74),
         ("Tirupati", 13.6288, 79.4192, "Tier 2", 460000, 0.82),
         ("Kakinada", 16.9891, 82.2475, "Tier 3", 440000, 0.73),
         ("Anantapur", 14.6819, 77.6006, "Tier 3", 360000, 0.70),
     ]},
    {"state": "Telangana", "region": "South", "capital": "Hyderabad", "center": [17.3850, 78.4867],
     "cities": [
         ("Hyderabad", 17.3850, 78.4867, "Metro", 10534000, 0.95),
         ("Warangal", 17.9689, 79.5941, "Tier 2", 950000, 0.79),
         ("Nizamabad", 18.6725, 78.0941, "Tier 3", 380000, 0.71),
         ("Karimnagar", 18.4386, 79.1288, "Tier 3", 360000, 0.73),
         ("Khammam", 17.2473, 80.1514, "Tier 3", 330000, 0.70),
         ("Ramagundam", 18.7557, 79.5126, "Tier 3", 295000, 0.68),
         ("Mahbubnagar", 16.7488, 77.9846, "Tier 3", 260000, 0.67),
     ]},
    # West
    {"state": "Maharashtra", "region": "West", "capital": "Mumbai", "center": [19.0760, 72.8777],
     "cities": [
         ("Mumbai", 19.0760, 72.8777, "Metro", 20961000, 0.98),
         ("Pune", 18.5204, 73.8567, "Metro", 6987000, 0.94),
         ("Nagpur", 21.1458, 79.0882, "Tier 1", 2893000, 0.86),
         ("Nashik", 19.9975, 73.7898, "Tier 2", 1890000, 0.83),
         ("Chhatrapati Sambhajinagar", 19.8762, 75.3433, "Tier 2", 1450000, 0.78),
         ("Solapur", 17.6599, 75.9064, "Tier 2", 1120000, 0.74),
         ("Thane", 19.2183, 72.9781, "Metro", 2200000, 0.93),
         ("Amravati", 20.9320, 77.7523, "Tier 3", 720000, 0.71),
         ("Kolhapur", 16.7050, 74.2433, "Tier 2", 650000, 0.77),
         ("Navi Mumbai", 19.0330, 73.0297, "Metro", 1450000, 0.92),
         ("Jalgaon", 21.0077, 75.5626, "Tier 3", 510000, 0.70),
     ]},
    {"state": "Gujarat", "region": "West", "capital": "Gandhinagar", "center": [23.0225, 72.5714],
     "cities": [
         ("Ahmedabad", 23.0225, 72.5714, "Metro", 8450000, 0.94),
         ("Surat", 21.1702, 72.8311, "Metro", 6564000, 0.92),
         ("Vadodara", 22.3072, 73.1812, "Tier 1", 2240000, 0.88),
         ("Rajkot", 22.3039, 70.8022, "Tier 1", 1650000, 0.84),
         ("Bhavnagar", 21.7645, 72.1519, "Tier 2", 710000, 0.75),
         ("Jamnagar", 22.4707, 70.0577, "Tier 2", 680000, 0.76),
         ("Gandhinagar", 23.2156, 72.6369, "Tier 2", 420000, 0.87),
         ("Junagadh", 21.5222, 70.4579, "Tier 3", 380000, 0.71),
         ("Anand", 22.5645, 72.9289, "Tier 3", 340000, 0.79),
     ]},
    {"state": "Rajasthan", "region": "North", "capital": "Jaipur", "center": [26.9124, 75.7873],
     "cities": [
         ("Jaipur", 26.9124, 75.7873, "Tier 1", 3910000, 0.90),
         ("Jodhpur", 26.2389, 73.0243, "Tier 2", 1400000, 0.81),
         ("Kota", 25.2138, 75.8648, "Tier 2", 1180000, 0.80),
         ("Bikaner", 28.0229, 73.3119, "Tier 2", 740000, 0.74),
         ("Ajmer", 26.4499, 74.6399, "Tier 2", 620000, 0.76),
         ("Udaipur", 24.5854, 73.7125, "Tier 2", 560000, 0.83),
         ("Bhilwara", 25.3407, 74.6313, "Tier 3", 440000, 0.72),
         ("Alwar", 27.5530, 76.6346, "Tier 3", 410000, 0.75),
     ]},
    # North
    {"state": "Delhi", "region": "North", "capital": "New Delhi", "center": [28.6139, 77.2090],
     "cities": [
         ("Central Delhi", 28.6139, 77.2090, "Metro", 2800000, 0.98),
         ("South Delhi", 28.5434, 77.1983, "Metro", 3400000, 0.97),
         ("North Delhi", 28.7188, 77.1706, "Metro", 2950000, 0.92),
         ("East Delhi", 28.6279, 77.2954, "Metro", 2750000, 0.91),
         ("West Delhi", 28.6534, 77.1150, "Metro", 3100000, 0.93),
         ("Dwarka", 28.5921, 77.0460, "Metro", 1600000, 0.92),
         ("Rohini", 28.7495, 77.0565, "Metro", 1850000, 0.90),
         ("Noida Extension (NCR)", 28.5833, 77.4333, "Metro", 1200000, 0.88),
         ("Gurugram DLF (NCR)", 28.4595, 77.0266, "Metro", 1950000, 0.96),
     ]},
    {"state": "Uttar Pradesh", "region": "North", "capital": "Lucknow", "center": [26.8467, 80.9462],
     "cities": [
         ("Lucknow", 26.8467, 80.9462, "Tier 1", 3650000, 0.90),
         ("Kanpur", 26.4499, 80.3319, "Tier 1", 3180000, 0.84),
         ("Ghaziabad", 28.6692, 77.4538, "Metro", 2370000, 0.91),
         ("Agra", 27.1767, 78.0081, "Tier 1", 2040000, 0.82),
         ("Varanasi", 25.3176, 82.9739, "Tier 1", 1620000, 0.85),
         ("Prayagraj", 25.4358, 81.8463, "Tier 2", 1430000, 0.80),
         ("Meerut", 28.9845, 77.7064, "Tier 2", 1520000, 0.81),
         ("Bareilly", 28.3670, 79.4304, "Tier 2", 1020000, 0.74),
         ("Aligarh", 27.8974, 78.0880, "Tier 2", 980000, 0.73),
         ("Moradabad", 28.8350, 78.7732, "Tier 2", 950000, 0.72),
         ("Gorakhpur", 26.7606, 83.3732, "Tier 2", 820000, 0.73),
         ("Noida", 28.5355, 77.3910, "Metro", 1100000, 0.95),
     ]},
    # East
    {"state": "West Bengal", "region": "East", "capital": "Kolkata", "center": [22.5726, 88.3639],
     "cities": [
         ("Kolkata", 22.5726, 88.3639, "Metro", 14850000, 0.96),
         ("Howrah", 22.5958, 88.2636, "Tier 1", 1320000, 0.87),
         ("Durgapur", 23.5204, 87.3119, "Tier 2", 670000, 0.80),
         ("Asansol", 23.6739, 86.9524, "Tier 2", 640000, 0.76),
         ("Siliguri", 26.7271, 88.3953, "Tier 2", 590000, 0.82),
         ("Bardhaman", 23.2324, 87.8615, "Tier 3", 380000, 0.72),
         ("Kharagpur", 22.3460, 87.2320, "Tier 3", 330000, 0.74),
         ("Haldia", 22.0667, 88.0698, "Tier 3", 260000, 0.75),
     ]},
    {"state": "Odisha", "region": "East", "capital": "Bhubaneswar", "center": [20.2961, 85.8245],
     "cities": [
         ("Bhubaneswar", 20.2961, 85.8245, "Tier 1", 1210000, 0.88),
         ("Cuttack", 20.4625, 85.8828, "Tier 2", 730000, 0.81),
         ("Rourkela", 22.2604, 84.8536, "Tier 2", 620000, 0.77),
         ("Berhampur", 19.3150, 84.7941, "Tier 3", 410000, 0.72),
         ("Sambalpur", 21.4669, 83.9812, "Tier 3", 360000, 0.71),
         ("Puri", 19.8135, 85.8312, "Tier 3", 240000, 0.79),
         ("Balasore", 21.4934, 86.9135, "Tier 3", 220000, 0.69),
     ]},
    # Central
    {"state": "Madhya Pradesh", "region": "Central", "capital": "Bhopal", "center": [23.2599, 77.4126],
     "cities": [
         ("Indore", 22.7196, 75.8577, "Tier 1", 3250000, 0.91),
         ("Bhopal", 23.2599, 77.4126, "Tier 1", 2430000, 0.87),
         ("Jabalpur", 23.1815, 79.9864, "Tier 2", 1480000, 0.78),
         ("Gwalior", 26.2183, 78.1828, "Tier 2", 1290000, 0.79),
         ("Ujjain", 23.1765, 75.7885, "Tier 2", 610000, 0.76),
         ("Sagar", 23.8388, 78.7378, "Tier 3", 390000, 0.70),
         ("Dewas", 22.9676, 76.0534, "Tier 3", 340000, 0.74),
         ("Satna", 24.6005, 80.8322, "Tier 3", 320000, 0.69),
         ("Ratlam", 23.3315, 75.0367, "Tier 3", 310000, 0.71),
     ]},
]

PRODUCT_CATEGORIES = [
    {"name": "Electronics", "unit_price_range": (3500, 48000), "margin": 0.18, "weight": 0.28},
    {"name": "Fashion & Apparel", "unit_price_range": (799, 4999), "margin": 0.38, "weight": 0.24},
    {"name": "Grocery & Food", "unit_price_range": (120, 1800), "margin": 0.14, "weight": 0.22},
    {"name": "Home & Living", "unit_price_range": (850, 14500), "margin": 0.28, "weight": 0.15},
    {"name": "Health & Beauty", "unit_price_range": (299, 3200), "margin": 0.32, "weight": 0.11},
]

STORE_TYPES = [
    {"type": "Flagship", "radius": 15, "capacity": 18000, "cost": 550000, "setup": 4500000},
    {"type": "Standard", "radius": 10, "capacity": 10000, "cost": 320000, "setup": 2500000},
    {"type": "Express", "radius": 5, "capacity": 4500, "cost": 160000, "setup": 1200000},
    {"type": "Franchise", "radius": 8, "capacity": 7000, "cost": 220000, "setup": 1800000},
]

COMPETITOR_BRANDS = [
    "NexusMart", "ApexRetail", "MetroSphere", "ZenithStores", "OmniHub", "UrbanTrend", "PrimeBazaar"
]


def generate_all_datasets():
    print("Generating GeoIQ Synthetic Datasets...")

    # 1. Generate Locations (locations.csv)
    locations = []
    loc_counter = 1
    for state_info in STATES_DATA:
        state = state_info["state"]
        region = state_info["region"]
        for city_tuple in state_info["cities"]:
            city, lat, lng, city_cat, pop, acc_base = city_tuple
            postal_prefix = int(100000 + (lat * 2000 + lng * 3000) % 800000)
            urban_type = "Urban" if city_cat in ["Metro", "Tier 1"] else ("Semi-Urban" if city_cat == "Tier 2" else "Emerging")
            accessibility = round(min(0.99, max(0.40, acc_base + np.random.normal(0, 0.03))), 2)

            locations.append({
                "location_id": f"LOC-{loc_counter:04d}",
                "country": "India",
                "state": state,
                "district": city,
                "city": city,
                "postal_code": str(postal_prefix),
                "latitude": round(lat, 5),
                "longitude": round(lng, 5),
                "region": region,
                "city_category": city_cat,
                "urban_rural_type": urban_type,
                "population_estimate": pop,
                "accessibility_score": accessibility
            })
            loc_counter += 1

    df_locations = pd.DataFrame(locations)
    df_locations.to_csv(os.path.join(DATA_DIR, "locations.csv"), index=False)
    print(f"Generated {len(df_locations)} locations -> locations.csv")

    # 2. Generate Stores (stores.csv)
    # We assign 124 stores across existing locations, higher presence in top metros
    stores = []
    store_counter = 1
    base_date = datetime(2021, 1, 15)

    for idx, row in df_locations.iterrows():
        # Metro: 2-4 stores; Tier 1: 1-2 stores; Tier 2: 0-1 store; Tier 3: mostly 0 (creating gap opportunities!)
        if row["city_category"] == "Metro":
            num_stores = random.randint(2, 4)
        elif row["city_category"] == "Tier 1":
            num_stores = random.randint(1, 2)
        elif row["city_category"] == "Tier 2":
            num_stores = 1 if random.random() < 0.55 else 0
        else:
            num_stores = 1 if random.random() < 0.20 else 0

        for s_i in range(num_stores):
            st_type_choice = random.choices(
                STORE_TYPES,
                weights=[0.20 if row["city_category"] == "Metro" else 0.05, 0.45, 0.30, 0.15]
            )[0]
            # Small jitter for multiple stores in same city
            jitter_lat = row["latitude"] + (np.random.normal(0, 0.02) if s_i > 0 else 0)
            jitter_lng = row["longitude"] + (np.random.normal(0, 0.02) if s_i > 0 else 0)
            open_dt = base_date + timedelta(days=random.randint(0, 1300))

            stores.append({
                "store_id": f"STR-{store_counter:04d}",
                "store_name": f"GeoIQ {row['city']} {st_type_choice['type']} #{s_i+1}",
                "location_id": row["location_id"],
                "latitude": round(jitter_lat, 5),
                "longitude": round(jitter_lng, 5),
                "store_type": st_type_choice["type"],
                "opening_date": open_dt.strftime("%Y-%m-%d"),
                "coverage_radius_km": st_type_choice["radius"],
                "monthly_capacity": st_type_choice["capacity"],
                "monthly_operating_cost": st_type_choice["cost"],
                "estimated_setup_cost": st_type_choice["setup"]
            })
            store_counter += 1

    df_stores = pd.DataFrame(stores)
    df_stores.to_csv(os.path.join(DATA_DIR, "stores.csv"), index=False)
    print(f"Generated {len(df_stores)} stores -> stores.csv")

    # 3. Generate Competitors (competitors.csv)
    # 280+ competitor locations
    competitors = []
    comp_counter = 1
    for idx, row in df_locations.iterrows():
        # High competition in metros, medium in Tier 1, lower in Tier 2/3
        if row["city_category"] == "Metro":
            num_comp = random.randint(4, 7)
        elif row["city_category"] == "Tier 1":
            num_comp = random.randint(2, 4)
        elif row["city_category"] == "Tier 2":
            num_comp = random.randint(1, 3)
        else:
            num_comp = random.randint(0, 2)

        for c_i in range(num_comp):
            c_brand = random.choice(COMPETITOR_BRANDS)
            c_lat = row["latitude"] + np.random.normal(0, 0.025)
            c_lng = row["longitude"] + np.random.normal(0, 0.025)
            c_type = random.choice(["Hypermarket", "Superstore", "Specialty Retail", "Discount Hub"])
            c_cap = random.choice([8000, 12000, 16000, 22000])

            competitors.append({
                "competitor_id": f"CMP-{comp_counter:04d}",
                "competitor_name": f"{c_brand} - {row['city']} Unit {c_i+1}",
                "location_id": row["location_id"],
                "latitude": round(c_lat, 5),
                "longitude": round(c_lng, 5),
                "competitor_type": c_type,
                "estimated_capacity": c_cap
            })
            comp_counter += 1

    df_competitors = pd.DataFrame(competitors)
    df_competitors.to_csv(os.path.join(DATA_DIR, "competitors.csv"), index=False)
    print(f"Generated {len(df_competitors)} competitors -> competitors.csv")

    # 4. Generate Customer Demand (customer_demand.csv)
    # Monthly periods over 2024
    periods = [f"2024-{m:02d}" for m in range(1, 13)]
    demand_records = []
    demand_counter = 1

    segments = ["Budget Buyers", "Value Seekers", "Premium Shoppers", "Tech Enthusiasts", "Family Household"]

    for idx, row in df_locations.iterrows():
        pop = row["population_estimate"]
        # Base per capita monthly demand factor
        base_demand_factor = 0.008 if row["city_category"] == "Metro" else (
            0.006 if row["city_category"] == "Tier 1" else 0.0045
        )

        for p_idx, period in enumerate(periods):
            # Seasonality: Diwali in Oct/Nov (month 10, 11), Summer sale in May (month 5), Year end in Dec (month 12)
            month_num = p_idx + 1
            seasonal_mult = 1.0
            if month_num in [10, 11]:
                seasonal_mult = 1.45  # Festive peak
            elif month_num in [5, 12]:
                seasonal_mult = 1.25  # Holiday & vacation peak
            elif month_num in [1, 2]:
                seasonal_mult = 0.90  # Post festive dip

            growth_rate = round(0.08 + (0.15 - 0.08) * (pop / 20000000) + np.random.normal(0, 0.02), 3)

            for cat in PRODUCT_CATEGORIES:
                cat_weight = cat["weight"]
                cat_demand_units = int(pop * base_demand_factor * cat_weight * seasonal_mult * (1 + np.random.uniform(-0.1, 0.15)))
                cat_demand_units = max(120, cat_demand_units)
                est_customers = int(cat_demand_units / random.uniform(1.8, 3.2))
                avg_val = round(random.uniform(cat["unit_price_range"][0] * 1.1, cat["unit_price_range"][1] * 0.45), 2)
                seg = random.choice(segments)

                demand_records.append({
                    "demand_id": f"DMD-{demand_counter:06d}",
                    "location_id": row["location_id"],
                    "period": period,
                    "product_category": cat["name"],
                    "estimated_demand_units": cat_demand_units,
                    "estimated_customer_count": est_customers,
                    "average_transaction_value": avg_val,
                    "demand_growth_rate": growth_rate,
                    "customer_segment": seg
                })
                demand_counter += 1

    df_demand = pd.DataFrame(demand_records)
    df_demand.to_csv(os.path.join(DATA_DIR, "customer_demand.csv"), index=False)
    print(f"Generated {len(df_demand)} customer demand records -> customer_demand.csv")

    # 5. Generate Expansion Candidates (expansion_candidates.csv)
    # High-demand candidate spots (especially in high demand, underserved Tier 1/2/3 cities)
    candidates = []
    cand_counter = 1
    # Check locations with 0 or 1 stores
    store_counts_by_loc = df_stores["location_id"].value_counts().to_dict()

    for idx, row in df_locations.iterrows():
        s_count = store_counts_by_loc.get(row["location_id"], 0)
        # Cities with low presence relative to population are prime candidates
        if s_count == 0 or (s_count <= 2 and row["city_category"] in ["Metro", "Tier 1"]):
            # Generate 1 to 2 potential candidate locations
            cand_count = 2 if row["city_category"] in ["Metro", "Tier 1"] else 1
            for c_i in range(cand_count):
                cand_lat = row["latitude"] + np.random.normal(0, 0.015)
                cand_lng = row["longitude"] + np.random.normal(0, 0.015)

                # Cost calculations based on city tier
                if row["city_category"] == "Metro":
                    rent = round(random.uniform(180000, 320000), 2)
                    setup = round(random.uniform(3200000, 5000000), 2)
                    m_op_cost = round(random.uniform(350000, 580000), 2)
                elif row["city_category"] == "Tier 1":
                    rent = round(random.uniform(120000, 220000), 2)
                    setup = round(random.uniform(2200000, 3500000), 2)
                    m_op_cost = round(random.uniform(250000, 420000), 2)
                else:
                    rent = round(random.uniform(70000, 140000), 2)
                    setup = round(random.uniform(1500000, 2400000), 2)
                    m_op_cost = round(random.uniform(180000, 290000), 2)

                access = round(min(0.98, max(0.60, row["accessibility_score"] + np.random.normal(0, 0.04))), 2)
                avail_cap = random.choice([8000, 10000, 12000, 15000, 18000])

                candidates.append({
                    "candidate_id": f"CND-{cand_counter:04d}",
                    "location_id": row["location_id"],
                    "latitude": round(cand_lat, 5),
                    "longitude": round(cand_lng, 5),
                    "estimated_rent": rent,
                    "estimated_setup_cost": setup,
                    "estimated_monthly_operating_cost": m_op_cost,
                    "accessibility_score": access,
                    "available_capacity": avail_cap
                })
                cand_counter += 1

    df_candidates = pd.DataFrame(candidates)
    df_candidates.to_csv(os.path.join(DATA_DIR, "expansion_candidates.csv"), index=False)
    print(f"Generated {len(df_candidates)} expansion candidates -> expansion_candidates.csv")

    # 6. Generate Sales Transactions (sales_transactions.csv)
    # Requirement: At least 10,000 records. Let's generate 12,500 records.
    print("Generating 12,500 sales transactions across 2024...")
    transactions = []
    store_rows = df_stores.to_dict("records")
    payment_methods = ["UPI", "Credit Card", "Debit Card", "Net Banking", "Cash"]
    pay_weights = [0.45, 0.25, 0.15, 0.10, 0.05]

    cat_names = [c["name"] for c in PRODUCT_CATEGORIES]
    cat_weights = [c["weight"] for c in PRODUCT_CATEGORIES]

    start_date = datetime(2024, 1, 1)
    days_range = 365

    for tx_id in range(1, 12501):
        # Pick random store (flagships have higher probability)
        st = random.choice(store_rows)
        # Transaction date
        day_offset = random.randint(0, days_range - 1)
        tx_date = start_date + timedelta(days=day_offset)

        # Pick category
        cat_obj = random.choices(PRODUCT_CATEGORIES, weights=cat_weights)[0]
        category = cat_obj["name"]

        # Quantity and prices
        qty = random.choices([1, 2, 3, 4, 5, 8], weights=[0.55, 0.25, 0.12, 0.05, 0.02, 0.01])[0]
        min_p, max_p = cat_obj["unit_price_range"]
        # Skew toward lower-to-middle of range
        unit_price = round(np.random.triangular(min_p, min_p * 1.5, max_p), 2)
        # Seasonal discounts (higher during Diwali Oct/Nov)
        if tx_date.month in [10, 11]:
            discount_pct = random.choice([0.10, 0.15, 0.20, 0.25])
        else:
            discount_pct = random.choices([0.0, 0.05, 0.10, 0.15], weights=[0.40, 0.30, 0.20, 0.10])[0]

        gross_rev = qty * unit_price
        discount = round(gross_rev * discount_pct, 2)
        sales_revenue = round(gross_rev - discount, 2)

        # Cost: unit cost based on margin
        cost_ratio = 1.0 - cat_obj["margin"]
        product_cost = round(gross_rev * cost_ratio, 2)
        gross_profit = round(sales_revenue - product_cost, 2)

        payment_method = random.choices(payment_methods, weights=pay_weights)[0]
        cust_id = f"CUST-{(tx_id % 4500) + 1:05d}"

        transactions.append({
            "transaction_id": f"TXN-{tx_id:06d}",
            "transaction_date": tx_date.strftime("%Y-%m-%d"),
            "store_id": st["store_id"],
            "customer_id": cust_id,
            "location_id": st["location_id"],
            "product_category": category,
            "quantity": qty,
            "unit_price": unit_price,
            "discount": discount,
            "sales_revenue": sales_revenue,
            "product_cost": product_cost,
            "gross_profit": gross_profit,
            "payment_method": payment_method
        })

    df_transactions = pd.DataFrame(transactions)
    df_transactions.to_csv(os.path.join(DATA_DIR, "sales_transactions.csv"), index=False)
    print(f"Generated {len(df_transactions)} transactions -> sales_transactions.csv")

    # 7. Generate India States GeoJSON
    generate_india_states_geojson()

    print("\nAll GeoIQ synthetic datasets generated successfully with 100% referential integrity!")


def generate_india_states_geojson():
    """Generates simplified GeoJSON boundary polygons for the 13 Indian states for the choropleth maps."""
    # Approximate simplified bounding polygons for Indian states
    STATE_POLYGONS = {
        "Tamil Nadu": [
            [[77.0, 8.1], [77.7, 8.5], [78.2, 9.2], [79.2, 9.3], [79.9, 10.3], [79.8, 11.8], [80.3, 13.3],
             [79.8, 13.5], [78.5, 12.8], [77.5, 12.2], [76.9, 11.5], [76.7, 10.5], [77.0, 9.3], [77.0, 8.1]]
        ],
        "Karnataka": [
            [[74.1, 14.8], [74.2, 15.0], [74.8, 15.8], [75.5, 17.5], [76.8, 17.8], [77.6, 18.0], [77.3, 16.5],
             [77.7, 15.0], [78.3, 13.8], [77.7, 12.7], [76.8, 11.8], [75.8, 12.0], [74.8, 13.0], [74.1, 14.8]]
        ],
        "Kerala": [
            [[75.0, 12.8], [75.8, 12.0], [76.7, 11.5], [76.7, 10.5], [77.0, 9.3], [77.5, 8.3], [77.0, 8.1],
             [76.5, 8.8], [76.2, 9.8], [75.7, 11.3], [75.0, 12.8]]
        ],
        "Andhra Pradesh": [
            [[77.0, 14.0], [77.7, 15.0], [78.5, 16.0], [80.0, 16.5], [81.5, 17.0], [83.0, 18.0], [84.5, 19.1],
             [83.5, 17.8], [82.2, 16.9], [80.8, 15.8], [80.0, 13.8], [79.5, 13.3], [78.5, 13.5], [77.0, 14.0]]
        ],
        "Telangana": [
            [[77.3, 16.5], [77.5, 17.5], [77.8, 18.5], [78.5, 19.8], [79.8, 19.5], [80.8, 18.2], [81.0, 17.5],
             [80.0, 16.8], [78.5, 16.0], [77.3, 16.5]]
        ],
        "Maharashtra": [
            [[72.6, 18.8], [72.8, 20.0], [73.5, 21.4], [75.0, 21.5], [77.5, 21.7], [79.5, 21.8], [80.8, 21.3],
             [80.3, 19.5], [78.5, 19.8], [77.8, 18.5], [75.5, 17.5], [73.8, 16.0], [73.3, 15.8], [72.8, 17.0], [72.6, 18.8]]
        ],
        "Gujarat": [
            [[68.2, 23.8], [70.5, 24.5], [72.5, 24.5], [73.5, 23.5], [74.2, 22.0], [73.5, 21.4], [72.8, 20.5],
             [72.5, 21.5], [71.5, 20.8], [69.8, 21.5], [69.0, 22.5], [70.2, 23.0], [68.5, 23.2], [68.2, 23.8]]
        ],
        "Rajasthan": [
            [[69.5, 27.0], [71.0, 28.5], [73.5, 30.0], [75.5, 28.8], [77.0, 27.8], [77.5, 26.8], [76.8, 25.0],
             [75.5, 24.0], [74.2, 23.5], [72.5, 24.5], [70.5, 24.5], [69.5, 27.0]]
        ],
        "Delhi": [
            [[76.84, 28.40], [77.34, 28.40], [77.34, 28.88], [76.84, 28.88], [76.84, 28.40]]
        ],
        "Uttar Pradesh": [
            [[77.0, 27.8], [77.5, 29.5], [78.5, 30.2], [80.5, 28.8], [82.5, 28.0], [84.2, 27.3], [84.5, 26.0],
             [83.5, 24.5], [82.5, 24.0], [80.5, 25.0], [78.5, 25.0], [77.5, 26.8], [77.0, 27.8]]
        ],
        "West Bengal": [
            [[86.0, 22.5], [86.8, 23.5], [87.5, 24.5], [88.0, 26.5], [88.8, 27.2], [88.8, 26.0], [88.2, 24.5],
             [88.8, 22.5], [89.0, 21.5], [87.5, 21.5], [86.0, 22.5]]
        ],
        "Odisha": [
            [[82.5, 18.0], [83.0, 19.5], [83.8, 20.8], [85.0, 22.0], [86.5, 22.2], [87.5, 21.5], [86.5, 19.8],
             [85.0, 19.2], [84.5, 19.1], [83.0, 18.0], [82.5, 18.0]]
        ],
        "Madhya Pradesh": [
            [[74.2, 22.0], [74.5, 23.5], [75.5, 24.0], [76.8, 25.0], [78.5, 26.5], [80.5, 25.0], [82.0, 24.5],
             [82.8, 23.5], [81.5, 21.8], [79.5, 21.8], [77.5, 21.7], [75.0, 21.5], [74.2, 22.0]]
        ]
    }

    features = []
    for state_name, coords in STATE_POLYGONS.items():
        feature = {
            "type": "Feature",
            "properties": {
                "name": state_name,
                "state": state_name
            },
            "geometry": {
                "type": "Polygon",
                "coordinates": coords
            }
        }
        features.append(feature)

    geojson_data = {
        "type": "FeatureCollection",
        "features": features
    }

    geojson_path = os.path.join(GEOJSON_DIR, "india_states.json")
    with open(geojson_path, "w", encoding="utf-8") as f:
        json.dump(geojson_data, f, indent=2)

    print(f"Generated GeoJSON for {len(features)} Indian states -> india_states.json")


if __name__ == "__main__":
    generate_all_datasets()
