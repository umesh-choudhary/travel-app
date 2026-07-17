'use client';

import { useState, useEffect } from 'react';

interface Member {
  name: string;
  phone: string;
}

interface Trip {
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

interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  trips: Trip[];
}

interface JoinedGroup {
  id: string;
  name: string;
  origin: string;
  destination: string;
  date: string;
  price: string;
  driverName: string;
  membersList?: Member[];
}

import CardImageSlider from './groups/CardImageSlider';
import TripDetailsModal from './TripDetailsModal';

const parseRoute = (title: string, defaultFrom = 'Gujarat') => {
  if (title.includes(' to ')) {
    const parts = title.split(' to ');
    return { from: parts[0], to: parts[1] };
  }
  if (title.includes(' → ')) {
    const parts = title.split(' → ');
    return { from: parts[0], to: parts[1] };
  }
  return { from: defaultFrom, to: title };
};

export default function DashboardContent({ 
  user,
  joinedGroups = [],
}: { 
  user: User;
  joinedGroups?: JoinedGroup[];
}) {
  const sortedTrips = [...user.trips].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  const [modalData, setModalData] = useState<{
    from: string;
    to: string;
    date: string;
    leader: string;
    price: string;
    members: Member[];
  } | null>(null);

  return (
    <div className="p-6 md:p-10 space-y-8 animate-in fade-in duration-300">
      {/* Welcome Header */}
      <div className="relative p-8 rounded-2xl bg-bg-secondary border border-border-primary shadow-xl overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent-color-glow rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent-color-glow rounded-full blur-3xl pointer-events-none" />
        
        <h1 className="text-4xl font-bold text-text-primary mb-2 relative z-10">
          Welcome, {user.name.split(' ')[0]}!
        </h1>
        <p className="text-text-secondary text-lg relative z-10">
          Your next adventure awaits. Explore active travel groups or add a new trip to get started.
        </p>
      </div>

      {/* Travel Plans */}
      <div className="bg-bg-secondary rounded-2xl border border-border-primary overflow-hidden shadow-xl">
        <div className="px-6 py-4 border-b border-border-primary flex justify-between items-center bg-bg-secondary/50">
          <div>
            <h2 className="text-lg font-medium text-text-primary">Your Travel Plans</h2>
            <p className="text-xs text-text-secondary mt-0.5">{user.trips.length} total trips</p>
          </div>
        </div>
        
        {user.trips.length === 0 ? (
          <div className="p-16 text-center text-text-secondary">
            You don't have any trips planned yet. Click "New Trip" in the sidebar to add your first trip!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {sortedTrips.map(trip => {
              const fromLoc = trip.from || parseRoute(trip.destination).from;
              const toLoc = trip.to || parseRoute(trip.destination).to;

              return (
                <div 
                  key={trip.id} 
                  onClick={() => {
                    setModalData({
                      from: fromLoc,
                      to: toLoc,
                      date: trip.date,
                      leader: trip.leader || user.name,
                      price: trip.feesType === 'paid' ? `${trip.feesAmount}` : '0 (Free)',
                      members: trip.members || [],
                    });
                  }}
                  className="rounded-xl bg-bg-primary border border-border-primary hover:border-accent-color/50 transition-all duration-300 hover:shadow-lg hover:shadow-accent-color/5 group relative overflow-hidden flex flex-col justify-between cursor-pointer hover:-translate-y-1"
                >
                  <div>
                    {/* Sliding Image Banner */}
                    <CardImageSlider from={fromLoc} to={toLoc} heightClass="h-32" />

                    <div className="p-5">
                      <div className="flex justify-between items-start mb-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border uppercase tracking-wider ${
                          trip.status === 'upcoming' 
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            : trip.status === 'completed'
                            ? 'bg-bg-tertiary text-text-secondary border-border-primary'
                            : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        }`}>
                          {trip.status}
                        </span>
                        <span className="text-xs font-semibold text-text-secondary">
                          {trip.feesType === 'paid' ? `₹${trip.feesAmount}` : 'Free Ride'}
                        </span>
                      </div>
                      
                      <h3 className="text-lg font-bold text-text-primary mb-1 group-hover:text-accent-color transition-colors line-clamp-2">
                        {trip.destination}
                      </h3>
                      <p className="text-text-secondary text-xs mb-4">
                        {new Date(trip.date).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>
                  </div>

                  {/* Extra details (Captain & Members) */}
                  {(trip.leader || (trip.members && trip.members.length > 0)) && (
                    <div className="border-t border-border-primary px-5 pb-5 pt-3 space-y-1.5 text-xs">
                      {trip.leader && (
                        <p className="flex items-center gap-1.5">
                          <span className="text-accent-color/80">Leader/Captain:</span>
                          <span className="text-text-primary font-medium">{trip.leader}</span>
                        </p>
                      )}
                      {trip.members && trip.members.length > 0 && (
                        <div className="flex flex-col gap-1">
                          <p className="flex items-center gap-1.5">
                            <span className="text-emerald-400/80 font-medium">Members ({trip.members.length}):</span>
                            <span className="text-text-primary truncate font-medium">
                              {trip.members.map(m => m.name).join(', ')}
                            </span>
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Joined Travel Groups */}
      <div className="bg-bg-secondary rounded-2xl border border-border-primary overflow-hidden shadow-xl">
        <div className="px-6 py-4 border-b border-border-primary flex justify-between items-center bg-bg-secondary/50">
          <div>
            <h2 className="text-lg font-medium text-text-primary">Joined Rides</h2>
            <p className="text-xs text-text-secondary mt-0.5">{joinedGroups.length} active bookings</p>
          </div>
        </div>
        
        {joinedGroups.length === 0 ? (
          <div className="p-16 text-center text-text-secondary">
            You haven't joined any travel groups yet. Go to "Search Groups" to find and join rides.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {joinedGroups.map(group => (
              <div 
                key={group.id} 
                onClick={() => {
                  setModalData({
                    from: group.origin,
                    to: group.destination,
                    date: group.date,
                    leader: group.driverName,
                    price: group.price,
                    members: group.membersList || [],
                  });
                }}
                className="rounded-xl bg-bg-primary border border-border-primary hover:border-accent-color/50 transition-all duration-300 hover:shadow-lg hover:shadow-accent-color/5 group relative overflow-hidden flex flex-col justify-between cursor-pointer hover:-translate-y-1"
              >
                <div>
                  {/* Sliding Image Banner */}
                  <CardImageSlider from={group.origin} to={group.destination} heightClass="h-32" />

                  <div className="p-5">
                    <div className="flex justify-between items-start mb-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold border uppercase tracking-wider bg-accent-color/10 text-accent-color border-accent-color/20">
                        Joined
                      </span>
                      <span className="text-xs font-semibold text-text-secondary">
                        {group.price}
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-bold text-text-primary mb-1 group-hover:text-accent-color transition-colors line-clamp-2">
                      {group.origin} → {group.destination}
                    </h3>
                    <p className="text-text-secondary text-xs mb-4">
                      {new Date(group.date).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                </div>

                <div className="border-t border-border-primary px-5 pb-5 pt-3 space-y-1.5 text-xs">
                  <p className="flex items-center gap-1.5">
                    <span className="text-accent-color/80">Leader/Captain:</span>
                    <span className="text-text-primary font-medium">{group.driverName}</span>
                  </p>
                  {group.membersList && group.membersList.length > 0 && (
                    <div className="flex flex-col gap-1">
                      <p className="flex items-center gap-1.5">
                        <span className="text-emerald-400/80 font-medium">Co-travelers ({group.membersList.length}):</span>
                        <span className="text-text-primary truncate font-medium">
                          {group.membersList.map(m => m.name).join(', ')}
                        </span>
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {modalData && (
        <TripDetailsModal
          from={modalData.from}
          to={modalData.to}
          date={modalData.date}
          leader={modalData.leader}
          price={modalData.price}
          members={modalData.members}
          onClose={() => setModalData(null)}
        />
      )}
    </div>
  );
}
