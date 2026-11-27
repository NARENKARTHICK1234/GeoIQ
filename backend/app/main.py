"""
GeoIQ Main Application
FastAPI server serving API endpoints and production React single-page frontend.
"""

import os
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse
from backend.app.routes.api import router as api_router

app = FastAPI(
    title="GeoIQ – Geospatial Business Expansion Intelligence Platform",
    description="Enterprise geospatial analytics REST API for market gap analysis, sales distribution, and smart location recommendations.",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 1. Mount API Router FIRST
app.include_router(api_router)

# 2. Custom 404 handler for API routes to never return HTML on broken /api calls
@app.exception_handler(404)
async def custom_404_handler(request: Request, exc: HTTPException):
    if request.url.path.startswith("/api/"):
        return JSONResponse(status_code=404, content={"error": "API route not found", "path": request.url.path})
    # For non-API routes, check if index.html exists
    index_file = os.path.join(STATIC_DIR, "index.html")
    if os.path.exists(index_file):
        return FileResponse(index_file)
    return JSONResponse(status_code=404, content={"error": "Not Found"})

# 3. Serve Frontend Build in Production
STATIC_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "frontend", "dist")
ASSETS_DIR = os.path.join(STATIC_DIR, "assets")

if os.path.exists(ASSETS_DIR):
    app.mount("/assets", StaticFiles(directory=ASSETS_DIR), name="assets")

# Root & SPA catch-all fallback for React Router navigation
@app.get("/{full_path:path}")
async def serve_spa(full_path: str):
    # Reject /api paths here if they didn't match an endpoint
    if full_path.startswith("api/"):
        raise HTTPException(status_code=404, detail="API route not found")

    # If specific static file exists in dist (e.g. favicon, vite.svg)
    file_path = os.path.join(STATIC_DIR, full_path)
    if os.path.isfile(file_path):
        return FileResponse(file_path)

    # Otherwise return React index.html
    index_path = os.path.join(STATIC_DIR, "index.html")
    if os.path.exists(index_path):
        return FileResponse(index_path)

    # In development mode when frontend/dist isn't built yet
    return {
        "status": "online",
        "service": "GeoIQ Backend API",
        "message": "Production frontend is not built yet. Access /docs for Swagger API documentation.",
        "api_health": "/api/health",
        "api_overview": "/api/overview"
    }

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("backend.app.main:app", host="0.0.0.0", port=port, reload=False)
