import fs from 'fs';
import path from 'path';

export interface Member {
  name: string;
  phone: string;
}

export interface Trip {
  id: string;
  from?: string;
  to?: string;
  destination: string;
  feesType?: 'free' | 'paid';
  feesAmount?: string;
  date: string;
  status: string;
  leader?: string;
  members?: Member[];
}

export interface User {
  id: string;
  email: string;
  password?: string;
  role: 'admin' | 'user';
  name: string;
  trips: Trip[];
  phone?: string;
  age?: string;
  username?: string;
  address?: string;
  resetToken?: string;
  resetTokenExpiry?: number;
}

const dbPath = path.join(process.cwd(), 'data', 'users.jsonl');

export async function getUsers(): Promise<User[]> {
  try {
    const data = await fs.promises.readFile(dbPath, 'utf-8');
    return data
      .trim()
      .split('\n')
      .filter((line) => line.length > 0)
      .map((line) => JSON.parse(line));
  } catch (error) {
    console.error('Error reading DB:', error);
    return [];
  }
}

export async function getUserByEmail(email: string): Promise<User | undefined> {
  const users = await getUsers();
  return users.find((u) => u.email === email);
}

export async function getUserById(id: string): Promise<User | undefined> {
  const users = await getUsers();
  return users.find((u) => u.id === id);
}

export async function saveUsers(users: User[]): Promise<void> {
  const data = users.map((u) => JSON.stringify(u)).join('\n');
  await fs.promises.writeFile(dbPath, data + '\n', 'utf-8');
}

export async function updateUser(updatedUser: User): Promise<void> {
  const users = await getUsers();
  const index = users.findIndex((u) => u.id === updatedUser.id);
  if (index !== -1) {
    users[index] = updatedUser;
    await saveUsers(users);
  }
}

// Map Search & Travel Groups Interfaces
export interface Coordinate {
  lat: number;
  lng: number;
}

export interface TravelGroup {
  id: string;
  name: string;
  stops: string[]; // ["ahmedabad", "vadodara", "surat", "mumbai", "pune"]
  origin: string;
  destination: string;
  routePoints: Coordinate[]; // Coordinates of the stops
  membersCount: number;
  date: string;
  price: string;
  driverName: string;
  creatorUserId?: string;
  membersList?: Member[];
}

// Region mapping for flexible matching (e.g. "Gujarat" matches cities in Gujarat)
const REGION_MAPPING: Record<string, string[]> = {
  gujarat: ['ahmedabad', 'vadodara', 'surat', 'vapi'],
  maharashtra: ['mumbai', 'lonavala', 'pune'],
};

// Mock dataset for Travel Groups
const mockTravelGroups: TravelGroup[] = [
  {
    id: 'g1',
    name: 'Gujarat-Pune Express Ride',
    stops: ['ahmedabad', 'vadodara', 'surat', 'mumbai', 'pune'],
    origin: 'Ahmedabad, Gujarat',
    destination: 'Pune, Maharashtra',
    routePoints: [
      { lat: 23.0225, lng: 72.5714 }, // Ahmedabad
      { lat: 22.3072, lng: 73.1812 }, // Vadodara
      { lat: 21.1702, lng: 72.8311 }, // Surat
      { lat: 19.0760, lng: 72.8777 }, // Mumbai
      { lat: 18.5204, lng: 73.8567 }, // Pune
    ],
    membersCount: 4,
    date: '2026-08-20',
    price: '₹1,200',
    driverName: 'Ramesh Kumar',
  },
  {
    id: 'g2',
    name: 'Surat to Lonavala Weekend Getaway',
    stops: ['surat', 'vapi', 'mumbai', 'lonavala'],
    origin: 'Surat, Gujarat',
    destination: 'Lonavala, Maharashtra',
    routePoints: [
      { lat: 21.1702, lng: 72.8311 }, // Surat
      { lat: 20.3710, lng: 72.9090 }, // Vapi
      { lat: 19.0760, lng: 72.8777 }, // Mumbai
      { lat: 18.7481, lng: 73.4072 }, // Lonavala
    ],
    membersCount: 3,
    date: '2026-08-22',
    price: '₹950',
    driverName: 'Sanjay Shah',
  },
  {
    id: 'g3',
    name: 'Mumbai-Pune Daily Commuters Pool',
    stops: ['mumbai', 'lonavala', 'pune'],
    origin: 'Mumbai, Maharashtra',
    destination: 'Pune, Maharashtra',
    routePoints: [
      { lat: 19.0760, lng: 72.8777 }, // Mumbai
      { lat: 18.7481, lng: 73.4072 }, // Lonavala
      { lat: 18.5204, lng: 73.8567 }, // Pune
    ],
    membersCount: 6,
    date: '2026-08-18',
    price: '₹400',
    driverName: 'Anil Deshmukh',
  },
  {
    id: 'g4',
    name: 'Delhi-Jaipur Sightseeing Pool',
    stops: ['delhi', 'jaipur'],
    origin: 'Delhi, India',
    destination: 'Jaipur, Rajasthan',
    routePoints: [
      { lat: 28.6139, lng: 77.2090 }, // Delhi
      { lat: 26.9124, lng: 75.7873 }, // Jaipur
    ],
    membersCount: 2,
    date: '2026-08-25',
    price: '₹800',
    driverName: 'Amit Sharma',
  },
  {
    id: 'g5',
    name: 'Ahmedabad to Vadodara Quick Shuttle',
    stops: ['ahmedabad', 'vadodara'],
    origin: 'Ahmedabad, Gujarat',
    destination: 'Vadodara, Gujarat',
    routePoints: [
      { lat: 23.0225, lng: 72.5714 }, // Ahmedabad
      { lat: 22.3072, lng: 73.1812 }, // Vadodara
    ],
    membersCount: 5,
    date: '2026-08-19',
    price: '₹300',
    driverName: 'Vijay Patel',
  },
];

const coordsCache: Record<string, Coordinate> = {};

export async function getTravelGroups(): Promise<TravelGroup[]> {
  const users = await getUsers();
  const userGroups: TravelGroup[] = [];

  const getCoords = async (city: string): Promise<Coordinate> => {
    const clean = city.trim().toLowerCase();
    const CITY_COORDINATES: Record<string, [number, number]> = {
      ahmedabad: [23.0225, 72.5714],
      vadodara: [22.3072, 73.1812],
      surat: [21.1702, 72.8311],
      vapi: [20.3710, 72.9090],
      mumbai: [19.0760, 72.8777],
      lonavala: [18.7481, 73.4072],
      pune: [18.5204, 73.8567],
      delhi: [28.6139, 77.2090],
      jaipur: [26.9124, 75.7873],
      gujarat: [23.0225, 72.5714],
      pune_maharashtra: [18.5204, 73.8567],
    };

    // 1. Check hardcoded dictionary
    for (const key of Object.keys(CITY_COORDINATES)) {
      if (clean.includes(key) || key.includes(clean)) {
        return { lat: CITY_COORDINATES[key][0], lng: CITY_COORDINATES[key][1] };
      }
    }

    // 2. Check local module cache
    if (coordsCache[clean]) {
      return coordsCache[clean];
    }

    // 3. Try to fetch from Nominatim Geocoding API
    try {
      let coords = null;
      const runLookup = async (q: string) => {
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&limit=1&accept-language=en`);
        if (res.ok) {
          const data = await res.json();
          if (data && data.length > 0) {
            return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
          }
        }
        return null;
      };

      coords = await runLookup(clean);
      if (!coords) {
        const cleaned = clean
          .replace(/\b(metro|station|stop|bus|train|terminal|airport|landmark)\b/gi, '')
          .replace(/\s+/g, ' ')
          .trim();
        if (cleaned && cleaned !== clean) {
          coords = await runLookup(cleaned);
        }
      }

      if (coords) {
        coordsCache[clean] = coords;
        return coords;
      }
    } catch (error) {
      console.error(`Geocoding lookup failed for ${clean}:`, error);
    }

    // 4. Stable hash fallback (Nashik/Maharashtra bounding box)
    let hash = 0;
    for (let i = 0; i < clean.length; i++) {
      hash = clean.charCodeAt(i) + ((hash << 5) - hash);
    }
    const lat = 18.5 + (Math.abs(hash % 100) / 100) * 4;
    const lng = 73.8 + (Math.abs((hash >> 8) % 100) / 100) * 4;
    return { lat, lng };
  };

  for (const u of users) {
    const trips = u.trips || [];
    for (const trip of trips) {
      const fromLoc = trip.from || 'Ahmedabad';
      const toLoc = trip.to || 'Pune';
      
      const fromCoords = await getCoords(fromLoc);
      const toCoords = await getCoords(toLoc);

      userGroups.push({
        id: trip.id,
        name: `${trip.leader || u.name}'s Ride to ${toLoc}`,
        stops: [fromLoc.toLowerCase(), toLoc.toLowerCase()],
        origin: fromLoc,
        destination: toLoc,
        routePoints: [fromCoords, toCoords],
        membersCount: (trip.members || []).length,
        date: trip.date,
        price: trip.feesType === 'paid' ? `₹${trip.feesAmount}` : 'Free',
        driverName: trip.leader || u.name,
        creatorUserId: u.id,
        membersList: trip.members || [],
      });
    }
  }

  return [...userGroups, ...mockTravelGroups];
}

export function findMatchingGroups(from: string, to: string, groups: TravelGroup[]): TravelGroup[] {
  const fromClean = from.trim().toLowerCase();
  const toClean = to.trim().toLowerCase();

  const matchesQuery = (stopName: string, query: string): boolean => {
    const stop = stopName.toLowerCase();
    if (stop.includes(query) || query.includes(stop)) return true;
    
    // Check region mapping (e.g. "gujarat" -> matches cities like "ahmedabad", "surat")
    if (REGION_MAPPING[query]?.includes(stop)) return true;
    
    return false;
  };

  return groups.filter((group) => {
    const fromIndex = group.stops.findIndex((stop) => matchesQuery(stop, fromClean));
    const toIndex = group.stops.findIndex((stop) => matchesQuery(stop, toClean));

    return fromIndex !== -1 && toIndex !== -1 && fromIndex < toIndex;
  });
}

