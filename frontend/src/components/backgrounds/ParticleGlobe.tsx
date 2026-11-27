import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface ParticleGlobeProps {
  className?: string;
  size?: number;
  interactive?: boolean;
}

export const ParticleGlobe: React.FC<ParticleGlobeProps> = ({
  className = '',
  size = 620,
  interactive = true
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Dimensions
    const width = container.clientWidth || size;
    const height = container.clientHeight || size;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 240;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    } catch (e) {
      console.warn("WebGL not supported or context error", e);
      return;
    }

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Group for all Earth elements
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    // 1. Particle Sphere (Digital Matrix Earth)
    const particleCount = 2800;
    const radius = 80;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const purpleColor = new THREE.Color(0xA855F7);
    const cyanColor = new THREE.Color(0x22D3EE);
    const blueColor = new THREE.Color(0x2563EB);

    for (let i = 0; i < particleCount; i++) {
      // Fibonacci sphere distribution for uniform particle placement
      const phi = Math.acos(-1 + (2 * i) / particleCount);
      const theta = Math.sqrt(particleCount * Math.PI) * phi;

      const x = radius * Math.cos(theta) * Math.sin(phi);
      const y = radius * Math.sin(theta) * Math.sin(phi);
      const z = radius * Math.cos(phi);

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      // Color variation: higher density of purple & cyan on front hemisphere
      const mixedColor = i % 3 === 0 ? purpleColor : (i % 3 === 1 ? cyanColor : blueColor);
      colors[i * 3] = mixedColor.r;
      colors[i * 3 + 1] = mixedColor.g;
      colors[i * 3 + 2] = mixedColor.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 1.8,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending
    });

    const points = new THREE.Points(geometry, material);
    globeGroup.add(points);

    // 2. Glowing Inner Core
    const coreGeo = new THREE.SphereGeometry(radius * 0.96, 32, 32);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0x0B1020,
      transparent: true,
      opacity: 0.85
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    globeGroup.add(coreMesh);

    // 3. Glowing Atmosphere Halo
    const haloGeo = new THREE.SphereGeometry(radius * 1.05, 32, 32);
    const haloMat = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        void main() {
          float intensity = pow(0.65 - dot(vNormal, vec3(0, 0, 1.0)), 2.0);
          gl_FragColor = vec4(0.48, 0.22, 0.93, 1.0) * intensity * 1.4;
        }
      `,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true
    });
    const haloMesh = new THREE.Mesh(haloGeo, haloMat);
    scene.add(haloMesh);

    // 4. Glowing Hotspots (Key cities: Delhi, Mumbai, Bengaluru, etc.)
    const hotspotCoords = [
      { lat: 28.6139, lon: 77.2090, label: "Delhi" },
      { lat: 19.0760, lon: 72.8777, label: "Mumbai" },
      { lat: 12.9716, lon: 77.5946, label: "Bengaluru" },
      { lat: 22.5726, lon: 88.3639, label: "Kolkata" },
      { lat: 13.0827, lon: 80.2707, label: "Chennai" },
      { lat: 17.3850, lon: 78.4867, label: "Hyderabad" }
    ];

    function latLonToVector3(lat: number, lon: number, r: number) {
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lon + 180) * (Math.PI / 180);
      return new THREE.Vector3(
        -(r * Math.sin(phi) * Math.cos(theta)),
        r * Math.cos(phi),
        r * Math.sin(phi) * Math.sin(theta)
      );
    }

    const hotspotVectors = hotspotCoords.map(h => latLonToVector3(h.lat, h.lon, radius));

    // Hotspot glowing markers
    hotspotVectors.forEach(vec => {
      const pinGeo = new THREE.SphereGeometry(1.8, 16, 16);
      const pinMat = new THREE.MeshBasicMaterial({ color: 0x22D3EE });
      const pinMesh = new THREE.Mesh(pinGeo, pinMat);
      pinMesh.position.copy(vec);
      globeGroup.add(pinMesh);

      // Pulse ring
      const ringGeo = new THREE.RingGeometry(2.0, 3.2, 24);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0xD946EF,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.7
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.position.copy(vec.clone().multiplyScalar(1.02));
      ringMesh.lookAt(vec.clone().multiplyScalar(2));
      globeGroup.add(ringMesh);
    });

    // 5. Connection Arcs between hotspots
    for (let i = 0; i < hotspotVectors.length - 1; i++) {
      const v1 = hotspotVectors[i];
      const v2 = hotspotVectors[i + 1];

      // Bezier curve arched out from Earth surface
      const mid = v1.clone().add(v2).multiplyScalar(0.5);
      const distance = v1.distanceTo(v2);
      mid.setLength(radius + distance * 0.35); // curve elevation

      const curve = new THREE.QuadraticBezierCurve3(v1, mid, v2);
      const curveGeo = new THREE.BufferGeometry().setFromPoints(curve.getPoints(36));
      const curveMat = new THREE.LineBasicMaterial({
        color: i % 2 === 0 ? 0xA855F7 : 0x22D3EE,
        transparent: true,
        opacity: 0.65,
        linewidth: 1.5
      });
      const curveLine = new THREE.Line(curveGeo, curveMat);
      globeGroup.add(curveLine);
    }

    // 6. Orbital Rings
    const orbitGeo = new THREE.RingGeometry(radius * 1.35, radius * 1.365, 64);
    const orbitMat = new THREE.MeshBasicMaterial({
      color: 0x7C3AED,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.35
    });
    const orbitMesh = new THREE.Mesh(orbitGeo, orbitMat);
    orbitMesh.rotation.x = Math.PI / 2.5;
    orbitMesh.rotation.y = Math.PI / 6;
    scene.add(orbitMesh);

    // Initial globe orientation highlighting India
    globeGroup.rotation.y = 1.3;
    globeGroup.rotation.x = 0.35;

    // Mouse Interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / width - 0.5) * 0.8;
      mouseY = ((e.clientY - rect.top) / height - 0.5) * 0.8;
    };

    if (interactive) {
      window.addEventListener('mousemove', onMouseMove);
    }

    // Resize handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || size;
      const h = container.clientHeight || size;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);

      // Smooth auto-rotation
      globeGroup.rotation.y += 0.0025;
      orbitMesh.rotation.z += 0.001;

      // Mouse responsive inertia
      if (interactive) {
        targetX = mouseX * 0.4;
        targetY = mouseY * 0.4;
        globeGroup.rotation.x += (targetY - globeGroup.rotation.x) * 0.05 + 0.0005;
        globeGroup.rotation.y += (targetX) * 0.05;
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      if (interactive) {
        window.removeEventListener('mousemove', onMouseMove);
      }
      geometry.dispose();
      material.dispose();
      coreGeo.dispose();
      coreMat.dispose();
      haloGeo.dispose();
      haloMat.dispose();
      orbitGeo.dispose();
      orbitMat.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [size, interactive]);

  return (
    <div
      ref={mountRef}
      className={`relative flex items-center justify-center select-none ${className}`}
      style={{ width: '100%', height: '100%', minHeight: size }}
    />
  );
};

export default ParticleGlobe;
