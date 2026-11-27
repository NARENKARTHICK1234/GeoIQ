import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, GeoJSON, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Maximize2, Minimize2, RotateCcw } from 'lucide-react';

// Custom neon icon generator
const createNeonIcon = (color: string) => {
  return L.divIcon({
    className: 'custom-neon-marker',
    html: `
      <div style="position:relative;width:22px;height:22px;display:flex;align-items:center;justify-content:center;">
        <div style="position:absolute;width:100%;height:100%;border-radius:50%;background:${color};opacity:0.3;animation:ping 2s cubic-bezier(0,0,0.2,1) infinite;"></div>
        <div style="width:12px;height:12px;border-radius:50%;background:${color};border:2px solid #050509;box-shadow:0 0 10px ${color};"></div>
      </div>
    `,
    iconSize: [22, 22],
    iconAnchor: [11, 11]
  });
};

const storeIcon = createNeonIcon('#22D3EE');
const competitorIcon = createNeonIcon('#F43F5E');
const candidateIcon = createNeonIcon('#A855F7');
const highDemandIcon = createNeonIcon('#D946EF');
const recommendedIcon = createNeonIcon('#10B981');

// Synthetic store data for India
const INDIA_STORES = [
  { id: 1, lat: 19.076, lng: 72.877, title: 'Mumbai Flagship', subtitle: 'Maharashtra', metric: '₹4.8 Cr revenue', type: 'store' as const, radiusKm: 10 },
  { id: 2, lat: 12.972, lng: 77.594, title: 'Bangalore Central', subtitle: 'Karnataka', metric: '₹4.1 Cr revenue', type: 'store' as const, radiusKm: 8 },
  { id: 3, lat: 13.082, lng: 80.270, title: 'Chennai Prime', subtitle: 'Tamil Nadu', metric: '₹3.8 Cr revenue', type: 'store' as const, radiusKm: 8 },
  { id: 4, lat: 28.613, lng: 77.209, title: 'Delhi NCR', subtitle: 'Delhi', metric: '₹3.3 Cr revenue', type: 'store' as const, radiusKm: 10 },
  { id: 5, lat: 17.385, lng: 78.487, title: 'Hyderabad Hub', subtitle: 'Telangana', metric: '₹3.5 Cr revenue', type: 'store' as const, radiusKm: 8 },
  { id: 6, lat: 22.572, lng: 88.363, title: 'Kolkata Central', subtitle: 'West Bengal', metric: '₹2.9 Cr revenue', type: 'store' as const, radiusKm: 8 },
  { id: 7, lat: 23.022, lng: 72.571, title: 'Ahmedabad Store', subtitle: 'Gujarat', metric: '₹2.4 Cr revenue', type: 'store' as const, radiusKm: 8 },
  { id: 8, lat: 26.912, lng: 75.787, title: 'Jaipur Store', subtitle: 'Rajasthan', metric: '₹2.1 Cr revenue', type: 'store' as const, radiusKm: 8 },
  { id: 9, lat: 22.718, lng: 75.858, title: 'Indore Store', subtitle: 'Madhya Pradesh', metric: '₹1.8 Cr revenue', type: 'store' as const, radiusKm: 8 },
  { id: 10, lat: 30.733, lng: 76.779, title: 'Chandigarh Store', subtitle: 'Punjab', metric: '₹1.6 Cr revenue', type: 'store' as const, radiusKm: 8 },
];

const CANDIDATES = [
  { id: 'c1', lat: 11.004, lng: 76.966, title: 'Coimbatore', subtitle: 'Tamil Nadu – Score: 96.4', metric: 'Est. Revenue: ₹8.4 Cr', type: 'candidate' as const },
  { id: 'c2', lat: 17.686, lng: 83.218, title: 'Visakhapatnam', subtitle: 'Andhra Pradesh – Score: 94.1', metric: 'Est. Revenue: ₹7.8 Cr', type: 'candidate' as const },
  { id: 'c3', lat: 21.145, lng: 79.088, title: 'Nagpur', subtitle: 'Maharashtra – Score: 92.7', metric: 'Est. Revenue: ₹6.9 Cr', type: 'candidate' as const },
  { id: 'c4', lat: 26.846, lng: 80.946, title: 'Lucknow', subtitle: 'Uttar Pradesh – Score: 91.2', metric: 'Est. Revenue: ₹6.4 Cr', type: 'candidate' as const },
  { id: 'c5', lat: 20.296, lng: 85.824, title: 'Bhubaneswar', subtitle: 'Odisha – Score: 89.8', metric: 'Est. Revenue: ₹5.8 Cr', type: 'candidate' as const },
];

const COMPETITORS = [
  { id: 'comp1', lat: 19.08, lng: 72.9, title: 'Competitor A – Mumbai', subtitle: 'Brand A', metric: 'Modern Retail', type: 'competitor' as const },
  { id: 'comp2', lat: 12.9, lng: 77.5, title: 'Competitor B – Bangalore', subtitle: 'Brand B', metric: 'Modern Retail', type: 'competitor' as const },
  { id: 'comp3', lat: 28.6, lng: 77.1, title: 'Competitor C – Delhi', subtitle: 'Brand C', metric: 'E-commerce Hub', type: 'competitor' as const },
  { id: 'comp4', lat: 13.0, lng: 80.2, title: 'Competitor D – Chennai', subtitle: 'Brand A', metric: 'Modern Retail', type: 'competitor' as const },
  { id: 'comp5', lat: 22.5, lng: 88.3, title: 'Competitor E – Kolkata', subtitle: 'Brand D', metric: 'Traditional', type: 'competitor' as const },
];

const MapController: React.FC<{ center: [number, number]; zoom: number; resetTrigger: number }> = ({ center, zoom, resetTrigger }) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, { duration: 1.2 });
  }, [resetTrigger, map, center, zoom]);
  return null;
};

interface MapPoint {
  id: string | number;
  lat: number;
  lng: number;
  title: string;
  type?: 'store' | 'competitor' | 'candidate' | 'demand';
  subtitle?: string;
  metric?: string;
  radiusKm?: number;
}

interface InteractiveMapProps {
  points?: MapPoint[];
  geoJsonData?: any;
  showCoverageRadius?: boolean;
  showCoverage?: boolean;
  mode?: 'stores' | 'choropleth' | 'heatmap' | 'competitors' | 'marketgap' | 'revenue' | 'opportunities' | 'recommendations' | 'simulator';
  activeLayer?: string;
  height?: string;
  className?: string;
}

const InteractiveMap: React.FC<InteractiveMapProps> = ({
  points,
  geoJsonData = null,
  showCoverageRadius = false,
  showCoverage = true,
  mode = 'stores',
  height = '480px',
  className = ''
}) => {
  const [resetCount, setResetCount] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [localGeoJSON, setLocalGeoJSON] = useState<any>(null);
  const defaultCenter: [number, number] = [21.8, 79.5];
  const defaultZoom = 4.5;

  // Load GeoJSON for India states
  useEffect(() => {
    if (!geoJsonData) {
      fetch('/api/maps/geojson')
        .then(r => r.json())
        .then(d => setLocalGeoJSON(d))
        .catch(() => {});
    }
  }, [geoJsonData]);

  const activeGeoJSON = geoJsonData || localGeoJSON;

  // Determine what points to show based on mode
  const getPoints = (): MapPoint[] => {
    if (points && points.length > 0) return points;
    switch (mode) {
      case 'competitors':
        return [...INDIA_STORES.slice(0, 5), ...COMPETITORS];
      case 'opportunities':
      case 'marketgap':
        return [...INDIA_STORES.slice(0, 5), ...CANDIDATES];
      case 'recommendations':
        return CANDIDATES.map(c => ({ ...c, type: 'candidate' as const }));
      case 'simulator':
        return [...INDIA_STORES, ...CANDIDATES.slice(0, 3)];
      case 'stores':
      case 'revenue':
        return INDIA_STORES;
      case 'choropleth':
        return INDIA_STORES.slice(0, 6);
      case 'heatmap':
        return [
          { id: 'h1', lat: 19.076, lng: 72.877, title: 'Mumbai', subtitle: 'High Demand', metric: 'Demand: 92K units', type: 'demand' },
          { id: 'h2', lat: 12.972, lng: 77.594, title: 'Bangalore', subtitle: 'High Demand', metric: 'Demand: 88K units', type: 'demand' },
          { id: 'h3', lat: 11.004, lng: 76.966, title: 'Coimbatore', subtitle: 'Very High Demand', metric: 'Demand: 94K units', type: 'demand' },
          { id: 'h4', lat: 28.613, lng: 77.209, title: 'Delhi', subtitle: 'High Demand', metric: 'Demand: 85K units', type: 'demand' },
          { id: 'h5', lat: 17.686, lng: 83.218, title: 'Visakhapatnam', subtitle: 'High Demand', metric: 'Demand: 91K units', type: 'demand' },
        ];
      default:
        return INDIA_STORES;
    }
  };

  const getMarkerIcon = (type?: string) => {
    switch (type) {
      case 'competitor': return competitorIcon;
      case 'candidate': return mode === 'recommendations' ? recommendedIcon : candidateIcon;
      case 'demand': return highDemandIcon;
      default: return storeIcon;
    }
  };

  const geoJsonStyle = {
    fillColor: '#7C3AED',
    weight: 1.2,
    opacity: 0.8,
    color: '#A855F7',
    dashArray: '3',
    fillOpacity: 0.12
  };

  const onEachFeature = (feature: any, layer: any) => {
    if (feature.properties?.name) {
      layer.bindTooltip(
        `<div style="background:#11162B;color:#e2e8f0;padding:4px 8px;border-radius:6px;border:1px solid rgba(124,58,237,0.3);font-size:11px;font-weight:600;">${feature.properties.name}</div>`,
        { permanent: false, direction: 'center', className: 'glass-tooltip' }
      );
      layer.on({
        mouseover: (e: any) => { e.target.setStyle({ fillColor: '#22D3EE', fillOpacity: 0.3, weight: 2, color: '#22D3EE' }); },
        mouseout: (e: any) => { e.target.setStyle(geoJsonStyle); }
      });
    }
  };

  const displayPoints = getPoints();

  return (
    <div
      className={`relative overflow-hidden ${isFullscreen ? 'fixed inset-4 z-50' : ''} ${className}`}
      style={{ height: isFullscreen ? 'calc(100vh - 2rem)' : height }}
    >
      {/* Map Controls */}
      <div className="absolute top-3 right-3 z-[1000] flex items-center gap-2">
        <button onClick={() => setResetCount(c => c + 1)}
          className="p-1.5 rounded-lg bg-[#0B1020]/90 border border-purple-500/30 text-slate-300 hover:text-cyan-300 transition-colors shadow-lg" title="Reset View">
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
        <button onClick={() => setIsFullscreen(!isFullscreen)}
          className="p-1.5 rounded-lg bg-[#0B1020]/90 border border-purple-500/30 text-slate-300 hover:text-cyan-300 transition-colors shadow-lg" title="Fullscreen">
          {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
        </button>
      </div>

      <MapContainer center={defaultCenter} zoom={defaultZoom} scrollWheelZoom={true} className="w-full h-full">
        <MapController center={defaultCenter} zoom={defaultZoom} resetTrigger={resetCount} />

        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a> &copy; <a href="https://openstreetmap.org">OSM</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          maxZoom={19}
        />

        {/* India GeoJSON overlay */}
        {activeGeoJSON && (
          <GeoJSON data={activeGeoJSON} style={geoJsonStyle} onEachFeature={onEachFeature} />
        )}

        {/* Data Points */}
        {displayPoints.map((pt) => (
          <React.Fragment key={pt.id}>
            <Marker position={[pt.lat, pt.lng]} icon={getMarkerIcon(pt.type)}>
              <Popup>
                <div style={{ background: '#11162B', border: '1px solid rgba(124,58,237,0.3)', borderRadius: 8, padding: '8px 12px', minWidth: 140 }}>
                  <div style={{ color: '#22D3EE', fontWeight: 700, fontSize: 13 }}>{pt.title}</div>
                  {pt.subtitle && <div style={{ color: '#94a3b8', fontSize: 11, marginTop: 2 }}>{pt.subtitle}</div>}
                  {pt.metric && <div style={{ color: '#A855F7', fontSize: 11, marginTop: 4, paddingTop: 4, borderTop: '1px solid rgba(124,58,237,0.2)' }}>{pt.metric}</div>}
                </div>
              </Popup>
            </Marker>
            {showCoverage && pt.radiusKm && pt.type === 'store' && (
              <Circle center={[pt.lat, pt.lng]} radius={pt.radiusKm * 1000}
                pathOptions={{ color: '#22D3EE', fillColor: '#7C3AED', fillOpacity: 0.08, weight: 1, dashArray: '4 4' }}
              />
            )}
          </React.Fragment>
        ))}
      </MapContainer>
    </div>
  );
};

export default InteractiveMap;
