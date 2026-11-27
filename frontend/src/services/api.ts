/**
 * GeoIQ API Service Layer
 * Uses relative URLs for clean single-service production deployment on Render.
 */

export const api = {
  async getHealth() {
    const res = await fetch('/api/health');
    return res.json();
  },

  async getOverview(params?: Record<string, string>) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`/api/overview${query ? `?${query}` : ''}`);
    return res.json();
  },

  async getSales(params?: Record<string, string>) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`/api/sales${query ? `?${query}` : ''}`);
    return res.json();
  },

  async getDemand(params?: Record<string, string>) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`/api/demand${query ? `?${query}` : ''}`);
    return res.json();
  },

  async getStores(params?: Record<string, string>) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`/api/stores${query ? `?${query}` : ''}`);
    return res.json();
  },

  async getMarketGap(params?: Record<string, string>) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`/api/market-gap${query ? `?${query}` : ''}`);
    return res.json();
  },

  async getCompetitors(params?: Record<string, string>) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`/api/competitors${query ? `?${query}` : ''}`);
    return res.json();
  },

  async getPopulation(params?: Record<string, string>) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`/api/population${query ? `?${query}` : ''}`);
    return res.json();
  },

  async getRevenue(params?: Record<string, string>) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`/api/revenue${query ? `?${query}` : ''}`);
    return res.json();
  },

  async getOpportunities(params?: Record<string, string>) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`/api/opportunities${query ? `?${query}` : ''}`);
    return res.json();
  },

  async getRecommendations(params?: Record<string, any>) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`/api/recommendations${query ? `?${query}` : ''}`);
    return res.json();
  },

  async getGeoJSON() {
    const res = await fetch('/api/maps/geojson');
    return res.json();
  },

  async getHeatmapPoints(metric = 'demand') {
    const res = await fetch(`/api/maps/heatmap?metric=${metric}`);
    return res.json();
  },

  async getCoverageCircles() {
    const res = await fetch('/api/maps/coverage');
    return res.json();
  },

  async runSimulation(payload: any) {
    const res = await fetch('/api/simulator/calculate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return res.json();
  },

  async getSampleDatasets() {
    const res = await fetch('/api/datasets/sample');
    return res.json();
  },

  async getDatasetPreview(name: string, limit = 25) {
    const res = await fetch(`/api/datasets/preview?name=${encodeURIComponent(name)}&limit=${limit}`);
    return res.json();
  },

  async getDatasetQuality() {
    const res = await fetch('/api/datasets/quality');
    return res.json();
  },

  async uploadDataset(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch('/api/datasets/upload', {
      method: 'POST',
      body: formData
    });
    return res.json();
  },

  async generateReport(payload: any) {
    const res = await fetch('/api/reports/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return res.json();
  },

  // Alias methods used by pages
  async getSalesByState(params?: Record<string, string>) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`/api/sales${query ? `?${query}` : ''}`);
    return res.json();
  },

  async getDemandAnalysis(params?: Record<string, string>) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`/api/demand${query ? `?${query}` : ''}`);
    return res.json();
  },

  async getStoreAnalysis(params?: Record<string, string>) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`/api/stores${query ? `?${query}` : ''}`);
    return res.json();
  },

  async getCompetitorAnalysis(params?: Record<string, string>) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`/api/competitors${query ? `?${query}` : ''}`);
    return res.json();
  },

  async getPopulationAnalysis(params?: Record<string, string>) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`/api/population${query ? `?${query}` : ''}`);
    return res.json();
  },

  async getRevenueAnalysis(params?: Record<string, string>) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`/api/revenue${query ? `?${query}` : ''}`);
    return res.json();
  },

  async getExpansionOpportunities(params?: Record<string, string>) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`/api/opportunities${query ? `?${query}` : ''}`);
    return res.json();
  },

  async runSimulator(payload: any) {
    const res = await fetch('/api/simulator/calculate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return res.json();
  }
};
