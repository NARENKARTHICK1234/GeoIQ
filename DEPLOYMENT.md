# GeoIQ – Deployment & Production Operations Guide

This guide details how to deploy **GeoIQ** as a single Render Web Service with one public URL, as well as containerized deployment using Docker.

---

## 📦 Architecture Overview

GeoIQ uses a **Single-Service Full-Stack Architecture**:
- **Stage 1 (Build):** The React + TypeScript frontend is compiled with Vite into static web assets (`frontend/dist/`).
- **Stage 2 (Runtime):** A lightweight Python 3.12 container runs FastAPI with Uvicorn.
  - API routes are mounted at `/api/*`.
  - Static frontend assets are mounted at `/assets/*`.
  - All other client-side routes fallback to `frontend/dist/index.html` (supporting React Router browser navigation without 404s).

---

## 🐳 Option 1: Docker Deployment (Recommended for Local / VPS)

### Build the Docker Image
```bash
docker build -t geoiq:latest .
```

### Run the Container
```bash
docker run -d -p 8000:8000 --name geoiq-app geoiq:latest
```

Access the application at `http://localhost:8000`.

---

## ☁️ Option 2: Render Cloud Deployment (Free Tier)

### Step 1: Push Code to Your GitHub Repository
Ensure your repository is initialized and pushed to GitHub:
```bash
git init
git add .
git commit -m "feat: GeoIQ v1.0 complete production release"
git branch -M main
git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/geoiq.git
git push -u origin main
```

*(Note: Push only when you have created your repository on GitHub).*

### Step 2: Deploy on Render via Blueprint (Easiest)
1. Sign in to your [Render Dashboard](https://dashboard.render.com).
2. Click **New +** and select **Blueprint**.
3. Connect your `geoiq` GitHub repository.
4. Render will automatically detect `render.yaml` in the root directory:
   - **Service Name:** `geoiq`
   - **Runtime:** `docker`
   - **Region:** `singapore` (or closest to you)
   - **Plan:** `Free`
   - **Health Check Path:** `/api/health`
5. Click **Apply**. Render will automatically build the multi-stage Docker image and deploy your web service.

### Step 3: Manual Deployment on Render (Alternative)
If creating the Web Service manually:
1. In Render, select **New + > Web Service**.
2. Select your connected repository.
3. Configure the settings:
   - **Name:** `geoiq`
   - **Region:** `Singapore` (or `Frankfurt`/`Oregon`)
   - **Branch:** `main`
   - **Runtime:** `Docker`
   - **Dockerfile Path:** `./Dockerfile`
   - **Docker Context:** `.`
   - **Instance Type:** `Free`
4. Under **Advanced Settings**:
   - Add Environment Variable: `PYTHONUNBUFFERED` = `1`
   - Health Check Path: `/api/health`
5. Click **Create Web Service**.

---

## 🔍 Post-Deployment Verification Checklist

Once Render reports `Service is live`:

1. **Health Check:**
   - Navigate to `https://<YOUR_RENDER_URL>/api/health`
   - Response: `{"status": "healthy", "service": "GeoIQ"}`
2. **Landing Page:**
   - Navigate to `https://<YOUR_RENDER_URL>/`
   - Verify 3D particle digital Earth, hero CTA buttons, and floating metrics.
3. **Interactive Maps:**
   - Open `/dashboard` and `/sales`.
   - Verify Leaflet dark map tiles and neon location pins load properly.
4. **Simulator Calculations:**
   - Open `/simulator` and adjust budget/store count.
   - Verify real-time scenario calculations.
5. **Direct Page Refresh:**
   - Refresh on `/recommendations` or `/market-gap`.
   - Ensure the SPA router reloads the page without 404 errors.

---

## 🛠️ Environment Variables Reference

| Variable | Default | Purpose |
|---|---|---|
| `PORT` | `8000` | Port on which FastAPI listens (automatically injected by Render) |
| `PYTHONUNBUFFERED` | `1` | Forces unbuffered stdout/stderr logging in Docker |
