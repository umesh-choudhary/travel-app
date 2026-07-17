export interface Coordinate {
  lat: number;
  lng: number;
}

export interface Member {
  name: string;
  phone: string;
}

export interface TravelGroup {
  id: string;
  name: string;
  origin: string;
  destination: string;
  date: string;
  price: string;
  driverName: string;
  driverPhone?: string;
  membersCount: number;
  maxMembers?: number;
  creatorUserId?: string;
  membersList?: Member[];
  status?: string;
  stops: string[];
  routePoints: Coordinate[];
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
  name: string;
  role: 'admin' | 'user';
  trips: Trip[];
}

export interface JoinedGroup {
  id: string;
  name: string;
  origin: string;
  destination: string;
  date: string;
  price: string;
  driverName: string;
  membersList?: Member[];
}
