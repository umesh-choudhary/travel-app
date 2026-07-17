'use client';

import { useEffect, useRef, useState } from 'react';

// Dynamically import Leaflet CSS inside component
import 'leaflet/dist/leaflet.css';

// Modular Imports
import { Coordinate, TravelGroup, Member } from './types';
import { getCityImageUrl, fetchWikiImage } from './cityImageHelper';
import SearchRoutesForm from './SearchRoutesForm';
import MatchingGroupsList from './MatchingGroupsList';
import NavigationOverlay from './NavigationOverlay';
import BookingJoinModal from './BookingJoinModal';

const cleanSearchQuery = (query: string): string => {
  return query
    .replace(/\b(metro|station|stop|bus|train|terminal|airport|landmark)\b/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
};

export default function GroupMapSearch() {
  const [fromQuery, setFromQuery] = useState('');
  const [toQuery, setToQuery] = useState('');
  const [groups, setGroups] = useState<TravelGroup[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Fetch profile on mount to distinguish trip creators from participants
  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch('/api/profile');
        const data = await res.json();
        if (data.success) {
          setCurrentUserId(data.user.id);
          setCurrentUser(data.user);
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
      }
    }
    fetchProfile();
  }, []);

  // Joining group states
  const [selectedGroup, setSelectedGroup] = useState<TravelGroup | null>(null);

  const [allIndiaCities, setAllIndiaCities] = useState<string[]>([]);
  const [modalOriginImg, setModalOriginImg] = useState<string>('');
  const [modalDestImg, setModalDestImg] = useState<string>('');

  useEffect(() => {
    async function fetchIndiaCities() {
      try {
        const res = await fetch('https://countriesnow.space/api/v0.1/countries/cities/q?country=India');
        if (res.ok) {
          const json = await res.json();
          if (json.data) {
            setAllIndiaCities(json.data);
          }
        }
      } catch (err) {
        console.error('Error fetching India cities list:', err);
      }
    }
    fetchIndiaCities();
  }, []);

  useEffect(() => {
    if (!selectedGroup) return;
    const group = selectedGroup;
    setModalOriginImg(getCityImageUrl(group.origin, true));
    setModalDestImg(getCityImageUrl(group.destination, false));
    
    let active = true;
    async function loadModalImages() {
      const oImg = await fetchWikiImage(group.origin);
      if (oImg && active) setModalOriginImg(oImg);
      const dImg = await fetchWikiImage(group.destination);
      if (dImg && active) setModalDestImg(dImg);
    }
    loadModalImages();
    return () => { active = false; };
  }, [selectedGroup]);

  const [joinName, setJoinName] = useState('');
  const [joinPhone, setJoinPhone] = useState('');
  const [paymentMode, setPaymentMode] = useState<'upi' | 'card'>('upi');
  const [upiId, setUpiId] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [joinLoading, setJoinLoading] = useState(false);
  const [joinSuccess, setJoinSuccess] = useState(false);
  const [joinError, setJoinError] = useState('');

  // References for Leaflet map
  const mapRef = useRef<any>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const leafletLibRef = useRef<any>(null);
  const layerGroupRef = useRef<any>(null);
  const tileLayerRef = useRef<any>(null);

  const [mapTheme, setMapTheme] = useState<'dark' | 'light'>('light');
  const [focusedGroupId, setFocusedGroupId] = useState<string | null>(null);
  
  // Navigation States for Turn-by-Turn
  const [navigationSteps, setNavigationSteps] = useState<any[] | null>(null);
  const [navigationStats, setNavigationStats] = useState<{ distance: string; duration: string } | null>(null);
  const [navigatingRouteGeometry, setNavigatingRouteGeometry] = useState<Coordinate[] | null>(null);
  const [navigationLoading, setNavigationLoading] = useState<boolean>(false);
  const [availableRoutes, setAvailableRoutes] = useState<any[] | null>(null);
  const [activeRouteIndex, setActiveRouteIndex] = useState<number>(0);

  // Autocomplete states
  const [fromSuggestions, setFromSuggestions] = useState<string[]>([]);
  const [toSuggestions, setToSuggestions] = useState<string[]>([]);
  const [showFromSuggestions, setShowFromSuggestions] = useState(false);
  const [showToSuggestions, setShowToSuggestions] = useState(false);

  const fromTimeoutRef = useRef<any>(null);
  const toTimeoutRef = useRef<any>(null);

  // Clear timeouts on unmount
  useEffect(() => {
    return () => {
      if (fromTimeoutRef.current) clearTimeout(fromTimeoutRef.current);
      if (toTimeoutRef.current) clearTimeout(toTimeoutRef.current);
    };
  }, []);

  const handleFromChange = (val: string) => {
    setFromQuery(val);
    if (fromTimeoutRef.current) clearTimeout(fromTimeoutRef.current);

    if (val.trim().length < 3) {
      setFromSuggestions([]);
      return;
    }

    fromTimeoutRef.current = setTimeout(async () => {
      try {
        const cleaned = cleanSearchQuery(val);
        const urls = [
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(val)}&limit=10&accept-language=en&viewbox=68.1,6.8,97.4,35.5`
        ];
        if (cleaned && cleaned.toLowerCase() !== val.toLowerCase()) {
          urls.push(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(cleaned)}&limit=10&accept-language=en&viewbox=68.1,6.8,97.4,35.5`);
        }

        const results = await Promise.all(
          urls.map(async (url) => {
            try {
              const res = await fetch(url);
              if (res.ok) return await res.json();
            } catch (e) {
              console.error(e);
            }
            return [];
          })
        );

        const localMatches = allIndiaCities
          .filter(city => city.toLowerCase().startsWith(val.toLowerCase()) || city.toLowerCase().includes(val.toLowerCase()))
          .slice(0, 10)
          .map(city => `${city}, India`);

        const merged = [...localMatches, ...results.flat().map((item: any) => item?.display_name).filter(Boolean)];
        const seen = new Set();
        const uniqueList: string[] = [];
        merged.forEach((name: string) => {
          if (!seen.has(name)) {
            seen.add(name);
            uniqueList.push(name);
          }
        });

        setFromSuggestions(uniqueList.slice(0, 10));
      } catch (err) {
        console.error(err);
      }
    }, 450);
  };

  const handleToChange = (val: string) => {
    setToQuery(val);
    if (toTimeoutRef.current) clearTimeout(toTimeoutRef.current);

    if (val.trim().length < 3) {
      setToSuggestions([]);
      return;
    }

    toTimeoutRef.current = setTimeout(async () => {
      try {
        const cleaned = cleanSearchQuery(val);
        const urls = [
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(val)}&limit=10&accept-language=en&viewbox=68.1,6.8,97.4,35.5`
        ];
        if (cleaned && cleaned.toLowerCase() !== val.toLowerCase()) {
          urls.push(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(cleaned)}&limit=10&accept-language=en&viewbox=68.1,6.8,97.4,35.5`);
        }

        const results = await Promise.all(
          urls.map(async (url) => {
            try {
              const res = await fetch(url);
              if (res.ok) return await res.json();
            } catch (e) {
              console.error(e);
            }
            return [];
          })
        );

        const localMatches = allIndiaCities
          .filter(city => city.toLowerCase().startsWith(val.toLowerCase()) || city.toLowerCase().includes(val.toLowerCase()))
          .slice(0, 10)
          .map(city => `${city}, India`);

        const merged = [...localMatches, ...results.flat().map((item: any) => item?.display_name).filter(Boolean)];
        const seen = new Set();
        const uniqueList: string[] = [];
        merged.forEach((name: string) => {
          if (!seen.has(name)) {
            seen.add(name);
            uniqueList.push(name);
          }
        });

        setToSuggestions(uniqueList.slice(0, 10));
      } catch (err) {
        console.error(err);
      }
    }, 450);
  };



  // Load Leaflet and initialize map on Client-side
  useEffect(() => {
    let active = true;

    async function initMap() {
      if (typeof window === 'undefined') return;
      const L = (await import('leaflet')).default;
      leafletLibRef.current = L;

      if (!active) return;
      if (!mapContainerRef.current) return;

      // Initialize map instance centered on Western India
      const map = L.map(mapContainerRef.current).setView([20.5937, 78.9629], 5);
      mapRef.current = map;

      // Add OpenStreetMap tile layer based on mapTheme
      const tileUrl = mapTheme === 'dark'
        ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
        : 'https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}';

      const tileLayer = L.tileLayer(tileUrl, {
        attribution: mapTheme === 'dark' 
          ? '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          : '&copy; Google Maps',
        subdomains: 'abcd',
        maxZoom: 20
      }).addTo(map);
      tileLayerRef.current = tileLayer;

      // Create a LayerGroup to hold dynamic markers and lines
      layerGroupRef.current = L.layerGroup().addTo(map);

      // Fetch all groups initially
      fetchGroups('', '');
    }

    initMap();

    return () => {
      active = false;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Sync map tile layers when mapTheme state changes
  useEffect(() => {
    const map = mapRef.current;
    const L = leafletLibRef.current;
    if (!map || !L) return;

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    const tileUrl = mapTheme === 'dark'
      ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
      : 'https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}';

    const newTileLayer = L.tileLayer(tileUrl, {
      attribution: mapTheme === 'dark'
        ? '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        : '&copy; Google Maps',
      subdomains: 'abcd',
      maxZoom: 20
    }).addTo(map);

    tileLayerRef.current = newTileLayer;
  }, [mapTheme]);

  const fetchGroups = async (fromVal: string, toVal: string) => {
    setLoading(true);
    try {
      const url = fromVal && toVal 
        ? `/api/groups?from=${encodeURIComponent(fromVal)}&to=${encodeURIComponent(toVal)}`
        : `/api/groups`;
      
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setGroups(data.groups);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearched(true);
    setFocusedGroupId(null);
    setNavigationSteps(null);
    setNavigationStats(null);
    setNavigatingRouteGeometry(null);
    fetchGroups(fromQuery, toQuery);
  };

  useEffect(() => {
    updateMap(groups, focusedGroupId, navigatingRouteGeometry);
  }, [groups, focusedGroupId, navigatingRouteGeometry]);

  const selectRouteIndex = (index: number, routesList: any[] | null = null) => {
    const list = routesList || availableRoutes;
    if (!list || !list[index]) return;
    
    const route = list[index];
    const geometryCoords = route.geometry.coordinates 
      ? route.geometry.coordinates.map((coord: [number, number]) => ({
          lat: coord[1],
          lng: coord[0]
        }))
      : route.geometry;
    
    const allSteps: any[] = [];
    if (route.legs) {
      route.legs.forEach((leg: any) => {
        if (leg.steps) {
          leg.steps.forEach((step: any) => {
            allSteps.push(step);
          });
        }
      });
    } else {
      allSteps.push(...route.steps);
    }

    const distanceKm = (route.distance / 1000).toFixed(1);
    const hours = Math.floor(route.duration / 3600);
    const minutes = Math.round((route.duration % 3600) / 60);
    const durationStr = hours > 0 ? `${hours}h ${minutes}m` : `${minutes} mins`;

    setNavigatingRouteGeometry(geometryCoords);
    setNavigationSteps(allSteps);
    setNavigationStats({
      distance: `${distanceKm} km`,
      duration: durationStr
    });
    setActiveRouteIndex(index);
  };

  const fetchOSRMRoute = async (group: TravelGroup) => {
    if (!group.routePoints || group.routePoints.length < 2) return;
    
    setNavigationLoading(true);
    setNavigationSteps([]);
    setNavigationStats(null);
    setNavigatingRouteGeometry(null);
    setAvailableRoutes(null);
    setActiveRouteIndex(0);

    const getLocalSimulation = () => {
      const startPt = group.routePoints[0];
      const endPt = group.routePoints[group.routePoints.length - 1];
      
      const R = 6371; // km
      const dLat = ((endPt.lat - startPt.lat) * Math.PI) / 180;
      const dLng = ((endPt.lng - startPt.lng) * Math.PI) / 180;
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((startPt.lat * Math.PI) / 180) *
          Math.cos((endPt.lat * Math.PI) / 180) *
          Math.sin(dLng / 2) *
          Math.sin(dLng / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const directDistance = R * c;

      const makeRouteOption = (factor: number, speed: number, bend: number, name: string) => {
        const roadDistance = directDistance * factor;
        const durationHours = roadDistance / speed;
        const hours = Math.floor(durationHours);
        const minutes = Math.round((durationHours - hours) * 60);
        const durationStr = hours > 0 ? `${hours}h ${minutes}m` : `${minutes} mins`;

        const simulatedGeom: Coordinate[] = [];
        for (let segment = 0; segment < group.routePoints.length - 1; segment++) {
          const segStart = group.routePoints[segment];
          const segEnd = group.routePoints[segment + 1];
          const numSegPoints = 40;
          
          for (let i = 0; i <= numSegPoints; i++) {
            if (segment > 0 && i === 0) continue;
            
            const t = i / numSegPoints;
            let lat = segStart.lat + t * (segEnd.lat - segStart.lat);
            let lng = segStart.lng + t * (segEnd.lng - segStart.lng);
            
            const segmentDist = Math.sqrt(Math.pow(segEnd.lat - segStart.lat, 2) + Math.pow(segEnd.lng - segStart.lng, 2));
            const angle = Math.atan2(segEnd.lat - segStart.lat, segEnd.lng - segStart.lng) + Math.PI / 2;
            const wave = Math.sin(t * Math.PI * bend) * (segmentDist * 0.08);
            lat += Math.sin(angle) * wave;
            lng += Math.cos(angle) * wave;
            
            simulatedGeom.push({ lat, lng });
          }
        }

        const originName = group.origin.split(',')[0].trim();
        const destName = group.destination.split(',')[0].trim();
        const isAhmedabadToPune = 
          originName.toLowerCase().includes('ahmedabad') && 
          destName.toLowerCase().includes('pune');

        let steps: any[] = [];
        if (isAhmedabadToPune) {
          if (name.includes("NE-4") || name.includes("NE 4")) {
            steps = [
              { maneuver: { instruction: `Depart from Ahmedabad, Gujarat`, type: 'depart', location: [72.5714, 23.0225] }, distance: 1200 },
              { maneuver: { instruction: `Merge onto NE-1 (Ahmedabad-Vadodara Expressway)`, modifier: 'straight', location: [72.6000, 22.9500] }, distance: 95000 },
              { maneuver: { instruction: `At Vadodara, continue onto NH-48 toward Surat`, modifier: 'straight', location: [73.1812, 22.3072] }, distance: 150000 },
              { maneuver: { instruction: `Pass through Surat bypass on NH-48`, modifier: 'straight', location: [72.8311, 21.1702] }, distance: 130000 },
              { maneuver: { instruction: `Take exit onto Mumbai-Pune Expressway (Toll Road)`, modifier: 'left', location: [72.8777, 19.0760] }, distance: 94000 },
              { maneuver: { instruction: `Navigate through Lonavala / Khandala ghat section`, modifier: 'straight', location: [73.4072, 18.7481] }, distance: 15000 },
              { maneuver: { instruction: `Arrive at Pune, Maharashtra`, type: 'arrive', location: [73.8567, 18.5204] }, distance: 0 }
            ];
          } else {
            steps = [
              { maneuver: { instruction: `Depart from Ahmedabad via city bypass`, type: 'depart', location: [72.5714, 23.0225] }, distance: 2000 },
              { maneuver: { instruction: `Turn right onto NH-64 toward Anand`, modifier: 'right', location: [72.7000, 22.7500] }, distance: 85000 },
              { maneuver: { instruction: `At Anand, turn onto NH-48 toward Surat`, modifier: 'straight', location: [72.9500, 22.4500] }, distance: 160000 },
              { maneuver: { instruction: `Keep right to stay on Mumbai Highway (NH-48)`, modifier: 'straight', location: [72.8311, 21.1702] }, distance: 220000 },
              { maneuver: { instruction: `Merge onto Mumbai-Pune Expressway (Toll Road)`, modifier: 'straight', location: [72.8777, 19.0760] }, distance: 94000 },
              { maneuver: { instruction: `Arrive at Pune, Maharashtra`, type: 'arrive', location: [73.8567, 18.5204] }, distance: 0 }
            ];
          }
        } else {
          steps.push({ maneuver: { instruction: `Depart from ${group.origin}`, type: 'depart', location: [startPt.lng, startPt.lat] }, distance: 800 });
          steps.push({ maneuver: { instruction: `Merge onto National Highway toward ${destName}`, modifier: 'straight', location: [startPt.lng + 0.15 * (endPt.lng - startPt.lng), startPt.lat + 0.15 * (endPt.lat - startPt.lat)] }, distance: roadDistance * 0.45 * 1000 });
          steps.push({ maneuver: { instruction: `Keep right to stay on Express Highway`, modifier: 'right', location: [startPt.lng + 0.5 * (endPt.lng - startPt.lng), startPt.lat + 0.5 * (endPt.lat - startPt.lat)] }, distance: roadDistance * 0.45 * 1000 });
          steps.push({ maneuver: { instruction: `Arrive at ${group.destination}`, type: 'arrive', location: [endPt.lng, endPt.lat] }, distance: 0 });
        }

        return {
          geometry: simulatedGeom,
          distance: roadDistance * 1000,
          duration: durationHours * 3600,
          routeName: name,
          steps
        };
      };

      const opt1 = makeRouteOption(1.25, 75, 1, "via NE 4 and NH 48");
      const opt2 = makeRouteOption(1.32, 68, 2, "via NH64 and NH 48");
      return [opt1, opt2];
    };

    try {
      const coordsQuery = group.routePoints
        .map((pt) => `${pt.lng},${pt.lat}`)
        .join(';');
      
      const url = `https://routing.openstreetmap.de/routed-car/route/v1/driving/${coordsQuery}?overview=full&geometries=geojson&steps=true&alternatives=true`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('OSM DE routing request failed');
      const data = await res.json();
      
      if (data.code === 'Ok' && data.routes && data.routes.length > 0) {
        const routes = data.routes.map((r: any, idx: number) => {
          let name = `Route Option ${idx + 1}`;
          if (r.legs && r.legs[0] && r.legs[0].steps) {
            const roadsUsed = r.legs[0].steps
              .map((s: any) => s.name)
              .filter((n: string) => n && n.length > 2 && !n.includes('Road') && !n.includes('Connector'));
            if (roadsUsed.length > 0) {
              name = `via ${roadsUsed[0]}`;
              if (roadsUsed.length > 1 && roadsUsed[1] !== roadsUsed[0]) {
                name += ` & ${roadsUsed[1]}`;
              }
            }
          }
          return {
            ...r,
            routeName: name
          };
        });
        
        setAvailableRoutes(routes);
        selectRouteIndex(0, routes);
      } else {
        throw new Error('No routes found');
      }
    } catch (err) {
      console.warn('Primary OSM DE routing failed, trying secondary OSRM demo server:', err);
      try {
        const coordsQuery = group.routePoints
          .map((pt) => `${pt.lng},${pt.lat}`)
          .join(';');
        const url = `https://router.projectosrm.org/route/v1/driving/${coordsQuery}?overview=full&geometries=geojson&steps=true&alternatives=true`;
        const res = await fetch(url);
        if (!res.ok) throw new Error('OSRM request failed');
        const data = await res.json();
        
        if (data.code === 'Ok' && data.routes && data.routes.length > 0) {
          const routes = data.routes.map((r: any, idx: number) => {
            let name = `Route Option ${idx + 1}`;
            if (r.legs && r.legs[0] && r.legs[0].steps) {
              const roadsUsed = r.legs[0].steps
                .map((s: any) => s.name)
                .filter((n: string) => n && n.length > 2 && !n.includes('Road') && !n.includes('Connector'));
              if (roadsUsed.length > 0) {
                name = `via ${roadsUsed[0]}`;
              }
            }
            return {
              ...r,
              routeName: name
            };
          });
          
          setAvailableRoutes(routes);
          selectRouteIndex(0, routes);
        } else {
          throw new Error('No routes found');
        }
      } catch (err2) {
        console.warn('All external georouting endpoints failed (CORS, Brave Shields or rate-limited), loading local high-fidelity simulation alternatives:', err2);
        const simulated = getLocalSimulation();
        if (simulated) {
          setAvailableRoutes(simulated);
          selectRouteIndex(0, simulated);
        }
      }
    } finally {
      setNavigationLoading(false);
    }
  };

  const handleFocusGroup = (group: TravelGroup) => {
    setFocusedGroupId(group.id);
    setSelectedGroup(null);
    fetchOSRMRoute(group);
  };

  const updateMap = (
    matchingGroups: TravelGroup[],
    focusId: string | null = null,
    navigatingGeom: Coordinate[] | null = null
  ) => {
    const L = leafletLibRef.current;
    const map = mapRef.current;
    const layerGroup = layerGroupRef.current;

    if (!L || !map || !layerGroup) return;

    // Clear previous markers & polylines
    layerGroup.clearLayers();

    if (matchingGroups.length === 0) return;

    const bounds: any[] = [];
    const isAnyFocused = focusId !== null;

    // Define custom pin icons
    const markerIcon = L.divIcon({
      className: 'custom-div-icon',
      html: `<div class="w-3.5 h-3.5 bg-indigo-500 border-2 border-white rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)]"></div>`,
      iconSize: [14, 14],
      iconAnchor: [7, 7]
    });

    const focusedMarkerIcon = L.divIcon({
      className: 'custom-div-icon-focused',
      html: `
        <div class="relative flex items-center justify-center animate-in zoom-in-50 duration-300">
          <div class="absolute w-5 h-5 bg-emerald-500/30 rounded-full animate-ping"></div>
          <div class="w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full shadow-[0_0_12px_rgba(16,185,129,0.6)] z-10"></div>
        </div>
      `,
      iconSize: [20, 20],
      iconAnchor: [10, 10]
    });

    matchingGroups.forEach((group) => {
      const isCurrentFocused = focusId === group.id;
      
      let polylineColor = '#6366f1';
      let polylineOpacity = 0.8;
      let polylineWeight = 5;
      let lineClassName = '';

      if (isAnyFocused) {
        if (isCurrentFocused) {
          polylineColor = '#10b981'; // Emerald
          polylineOpacity = 1.0;
          polylineWeight = 6;
          lineClassName = 'focused-polyline';
        } else {
          polylineOpacity = 0.15;
          polylineWeight = 3;
        }
      }

      let latlngs = group.routePoints.map((pt) => [pt.lat, pt.lng]);
      if (isCurrentFocused && navigatingGeom && navigatingGeom.length > 0) {
        latlngs = navigatingGeom.map((pt) => [pt.lat, pt.lng]);
      }

      if (!isAnyFocused || isCurrentFocused) {
        latlngs.forEach((latlng) => bounds.push(latlng));
      }

      // Draw polyline connecting stops (gradient blue-cyan effect)
      const polyline = L.polyline(latlngs, {
        color: polylineColor,
        weight: polylineWeight,
        opacity: polylineOpacity,
        lineJoin: 'round',
        className: lineClassName
      }).addTo(layerGroup);

      // On polyline click, set selected group to open joining details modal!
      polyline.on('click', () => {
        openJoinModal(group);
      });

      // Bind dynamic popup to polyline
      polyline.bindPopup(`
        <div class="text-zinc-950 p-1">
          <h4 class="font-bold text-sm mb-1">${group.name}</h4>
          <p class="text-xs text-zinc-500 mb-1">Driver/Leader: ${group.driverName}</p>
          <p class="text-xs text-zinc-500">Price: <b>${group.price}</b></p>
          <p class="text-[10px] text-indigo-600 mt-1 font-semibold">Click route to view details & join</p>
        </div>
      `);

      // Add markers for stops (hide non-focused stops when focus is active to reduce clutter)
      if (!isAnyFocused || isCurrentFocused) {
        group.routePoints.forEach((pt, index) => {
          const stopName = group.stops[index];
          const formattedStop = stopName.charAt(0).toUpperCase() + stopName.slice(1);
          const currentIcon = isCurrentFocused ? focusedMarkerIcon : markerIcon;
          
          const marker = L.marker([pt.lat, pt.lng], { icon: currentIcon }).addTo(layerGroup);
          marker.on('click', () => {
            openJoinModal(group);
          });
          
          marker.bindPopup(`
            <div class="text-zinc-950 p-1">
              <h4 class="font-bold text-xs">${formattedStop}</h4>
              <span class="text-[10px] text-zinc-400">Stop ${index + 1} on ${group.name}</span>
            </div>
          `);
        });
      }
    });

    // Auto-fit map zoom to contain all active routes
    if (bounds.length > 0) {
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  };

  const isAlreadyJoined = (group: TravelGroup): boolean => {
    if (!currentUser) return false;
    return (group.membersList || []).some(
      (m) =>
        m.name.toLowerCase() === currentUser.name.toLowerCase() ||
        (currentUser.phone && m.phone === currentUser.phone)
    );
  };

  const openJoinModal = (group: TravelGroup) => {
    setSelectedGroup(group);
    setJoinName(currentUser?.name || '');
    setJoinPhone(currentUser?.phone || '');
    setUpiId('');
    setCardNumber('');
    setCardExpiry('');
    setCardCvv('');
    setJoinSuccess(false);
    setJoinError('');
  };

  const handleJoinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGroup) return;

    setJoinLoading(true);
    setJoinError('');
    setJoinSuccess(false);

    try {
      // Simulate payment delay if paid
      if (selectedGroup.price !== 'Free') {
        await new Promise((resolve) => setTimeout(resolve, 1500));
      }

      const response = await fetch('/api/groups/join', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tripId: selectedGroup.id,
          name: joinName,
          phone: joinPhone,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setJoinSuccess(true);
        
        // Dynamic state update so modal and map count reflect booking immediately
        const updatedMembers = [...(selectedGroup.membersList || []), { name: joinName, phone: joinPhone }];
        setSelectedGroup({
          ...selectedGroup,
          membersCount: updatedMembers.length,
          membersList: updatedMembers,
        });

        // Refresh all groups list in background
        fetchGroups(fromQuery, toQuery);
      } else {
        setJoinError(data.message || 'Failed to join group.');
      }
    } catch (err) {
      setJoinError('An error occurred. Please try again.');
    } finally {
      setJoinLoading(false);
    }
  };

  const getDirectionsUrl = (group: TravelGroup) => {
    const origin = encodeURIComponent(group.origin);
    const destination = encodeURIComponent(group.destination);
    
    if (group.stops && group.stops.length > 2) {
      const intermediateStops = group.stops.slice(1, -1);
      const waypoints = intermediateStops
        .map(stop => encodeURIComponent(stop.charAt(0).toUpperCase() + stop.slice(1)))
        .join('|');
      return `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&waypoints=${waypoints}&travelmode=driving`;
    }
    
    return `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=driving`;
  };

  return (
    <div className="p-6 md:p-10 space-y-8 animate-in fade-in duration-300">
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes route-flow {
          to {
            stroke-dashoffset: -20;
          }
        }
        .focused-polyline {
          stroke-dasharray: 8, 8;
          animation: route-flow 1.2s linear infinite !important;
        }
      `}} />
      <div className="mb-2">
        <h1 className="text-3xl font-bold text-text-primary mb-2">Find Travel Groups</h1>
        <p className="text-text-secondary">Search routes and view active travel groups along the way.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left panel: Search Form and Results */}
        <div className="space-y-6 lg:col-span-1">
          <SearchRoutesForm
            fromQuery={fromQuery}
            toQuery={toQuery}
            loading={loading}
            onFromChange={handleFromChange}
            onToChange={handleToChange}
            onSubmit={handleSearch}
            fromSuggestions={fromSuggestions}
            toSuggestions={toSuggestions}
            showFromSuggestions={showFromSuggestions}
            showToSuggestions={showToSuggestions}
            setShowFromSuggestions={setShowFromSuggestions}
            setShowToSuggestions={setShowToSuggestions}
            setFromQuery={setFromQuery}
            setToQuery={setToQuery}
          />

          <MatchingGroupsList
            groups={groups}
            searched={searched}
            focusedGroupId={focusedGroupId}
            currentUserId={currentUserId}
            onFocusGroup={handleFocusGroup}
            openJoinModal={openJoinModal}
            isAlreadyJoined={isAlreadyJoined}
          />
        </div>

        {/* Right panel: Leaflet Map */}
        <div className="lg:col-span-2">
          <div className="bg-bg-secondary border border-border-primary rounded-2xl overflow-hidden shadow-2xl h-[600px] relative">
            <div ref={mapContainerRef} className="w-full h-full z-10" id="map" />

            {focusedGroupId && (navigationSteps || navigationLoading) && (
              <NavigationOverlay
                navigationSteps={navigationSteps}
                navigationStats={navigationStats}
                navigationLoading={navigationLoading}
                availableRoutes={availableRoutes}
                activeRouteIndex={activeRouteIndex}
                selectRouteIndex={selectRouteIndex}
                onCloseNavigation={() => {
                  setFocusedGroupId(null);
                  setNavigationSteps(null);
                  setNavigationStats(null);
                  setNavigatingRouteGeometry(null);
                  setAvailableRoutes(null);
                  setActiveRouteIndex(0);
                  if (mapRef.current && groups.length > 0) {
                    const allBounds: any[] = [];
                    groups.forEach(g => g.routePoints.forEach(pt => allBounds.push([pt.lat, pt.lng])));
                    if (allBounds.length > 0) {
                      mapRef.current.fitBounds(allBounds, { padding: [50, 50] });
                    }
                  }
                }}
                onStepClick={(step) => {
                  if (mapRef.current && step.maneuver.location) {
                    mapRef.current.setView([step.maneuver.location[1], step.maneuver.location[0]], 16);
                  }
                }}
              />
            )}

            {/* Map Control Floating Overlay */}
            <div className="absolute top-4 right-4 z-20 flex gap-2">
              {focusedGroupId && (
                <button
                  onClick={() => {
                    setFocusedGroupId(null);
                    setNavigationSteps(null);
                    setNavigationStats(null);
                    setNavigatingRouteGeometry(null);
                    setAvailableRoutes(null);
                    setActiveRouteIndex(0);
                    if (mapRef.current && groups.length > 0) {
                      const allBounds: any[] = [];
                      groups.forEach(g => g.routePoints.forEach(pt => allBounds.push([pt.lat, pt.lng])));
                      if (allBounds.length > 0) {
                        mapRef.current.fitBounds(allBounds, { padding: [50, 50] });
                      }
                    }
                  }}
                  type="button"
                  className="px-3 py-1.5 rounded-lg bg-emerald-500/90 hover:bg-emerald-600 border border-emerald-400 text-white transition-all duration-200 shadow-md font-semibold text-xs flex items-center gap-1.5 cursor-pointer backdrop-blur-sm animate-in fade-in slide-in-from-top-2"
                  title="Show All Routes"
                >
                  <span>👁️</span>
                  <span>Show All Routes</span>
                </button>
              )}
              <button
                onClick={() => setMapTheme(mapTheme === 'dark' ? 'light' : 'dark')}
                type="button"
                className="px-3 py-1.5 rounded-lg bg-bg-secondary/90 border border-border-primary text-text-primary hover:bg-bg-tertiary transition-all duration-200 shadow-md font-semibold text-xs flex items-center gap-1.5 cursor-pointer backdrop-blur-sm"
                title="Toggle Map Style"
              >
                {mapTheme === 'dark' ? (
                  <>
                    <span>☀️</span>
                    <span>Light Map</span>
                  </>
                ) : (
                  <>
                    <span>🌙</span>
                    <span>Dark Map</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Global Group Details & Join Modal */}
      {selectedGroup && (
        <BookingJoinModal
          selectedGroup={selectedGroup}
          currentUserId={currentUserId}
          joinName={joinName}
          setJoinName={setJoinName}
          joinPhone={joinPhone}
          setJoinPhone={setJoinPhone}
          paymentMode={paymentMode}
          setPaymentMode={setPaymentMode}
          upiId={upiId}
          setUpiId={setUpiId}
          cardNumber={cardNumber}
          setCardNumber={setCardNumber}
          cardExpiry={cardExpiry}
          setCardExpiry={setCardExpiry}
          cardCvv={cardCvv}
          setCardCvv={setCardCvv}
          joinLoading={joinLoading}
          joinSuccess={joinSuccess}
          joinError={joinError}
          isAlreadyJoined={isAlreadyJoined}
          modalOriginImg={modalOriginImg}
          modalDestImg={modalDestImg}
          onFocusGroup={handleFocusGroup}
          onClose={() => setSelectedGroup(null)}
          onSubmitJoin={handleJoinSubmit}
        />
      )}

    </div>
  );
}
