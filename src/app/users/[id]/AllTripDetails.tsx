import { User } from '@/lib/db';
import Link from 'next/link';
import NewTravel from './AddNewTravel';
import CardImageSlider from '../../dashboard/groups/CardImageSlider';

interface AllTripDetailsProps {
  user: User;
}

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

export default function AllTripDetails({ user }: AllTripDetailsProps) {
  // Sort trips by date (upcoming first)
  const sortedTrips = [...user.trips].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const nextTrip = sortedTrips.find(t => new Date(t.date) >= new Date());

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="flex items-center gap-4">
        <Link href="/admin" className="p-2 rounded-lg bg-bg-secondary border border-border-primary hover:bg-bg-tertiary text-text-secondary hover:text-text-primary transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-text-primary mb-1">{user.name}</h1>
          <p className="text-text-secondary text-sm">{user.email}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column: Trips and plans */}
        <div className="lg:col-span-2 space-y-8">
          {nextTrip && (
            (() => {
              const { from: nextFrom, to: nextTo } = parseRoute(nextTrip.destination);
              return (
                <div className="rounded-2xl bg-bg-secondary border border-border-primary shadow-xl overflow-hidden flex flex-col justify-between relative group">
                  <CardImageSlider from={nextFrom} to={nextTo} heightClass="h-32" />
                  
                  <div className="p-6">
                    <h2 className="text-[10px] font-bold text-accent-color mb-3 uppercase tracking-wider">Next Upcoming Trip</h2>
                    
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                      <div>
                        <p className="text-xl font-bold text-text-primary mb-1">{nextTrip.destination}</p>
                        <p className="text-text-secondary text-xs mb-3">
                          {new Date(nextTrip.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                        <div className="flex items-center gap-4 text-[10px] text-text-secondary">
                          {nextTrip.leader && (
                            <p>
                              Captain: <span className="text-text-primary font-medium">{nextTrip.leader}</span>
                            </p>
                          )}
                          {nextTrip.feesType && (
                            <p>
                              Fees: <span className="text-text-primary font-medium">{nextTrip.feesType === 'paid' ? `₹${nextTrip.feesAmount}` : 'Free'}</span>
                            </p>
                          )}
                          {nextTrip.members && nextTrip.members.length > 0 && (
                            <p>
                              Members: <span className="text-text-primary font-medium">{nextTrip.members.length}</span>
                            </p>
                          )}
                        </div>
                      </div>
                      <div>
                        <span className="px-3 py-1 rounded-full bg-accent-color/10 text-accent-color text-[10px] font-semibold border border-accent-color/20 shadow-sm uppercase tracking-wider text-xs">
                          {nextTrip.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()
          )}

          <div className="bg-bg-secondary rounded-2xl border border-border-primary overflow-hidden shadow-xl">
            <div className="px-6 py-4 border-b border-border-primary flex justify-between items-center bg-bg-secondary/50">
              <h2 className="text-lg font-medium text-text-primary">All Travel Plans</h2>
              <span className="text-xs text-text-secondary">{user.trips.length} total trips</span>
            </div>
            
            {user.trips.length === 0 ? (
              <div className="p-12 text-center text-text-secondary">
                No travel plans found for this user.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
                {sortedTrips.map(trip => {
                  const { from: tripFrom, to: tripTo } = parseRoute(trip.destination);
                  return (
                    <div key={trip.id} className="rounded-xl bg-bg-primary border border-border-primary hover:border-accent-color/50 transition-all duration-300 hover:shadow-lg hover:shadow-accent-color/5 group relative overflow-hidden flex flex-col justify-between">
                      <div>
                        {/* Sliding Image Banner */}
                        <CardImageSlider from={tripFrom} to={tripTo} heightClass="h-32" />

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
                          </div>
                          
                          <h3 className="text-base font-bold text-text-primary mb-1 group-hover:text-accent-color transition-colors line-clamp-2">
                            {trip.destination}
                          </h3>
                          <p className="text-text-secondary text-xs mb-4">
                            {new Date(trip.date).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                          </p>
                        </div>
                      </div>

                      {/* Details Section */}
                      {(trip.leader || (trip.members && trip.members.length > 0)) && (
                        <div className="border-t border-border-primary px-5 pb-5 pt-3 space-y-1.5 text-xs bg-bg-secondary/40">
                          {trip.leader && (
                            <p className="flex items-center gap-1.5">
                              <span className="text-accent-color/80">Leader/Captain:</span>
                              <span className="text-text-primary font-medium">{trip.leader}</span>
                            </p>
                          )}
                          {trip.members && trip.members.length > 0 && (
                            <p className="flex items-center gap-1.5">
                              <span className="text-emerald-400/80 font-medium">Members ({trip.members.length}):</span>
                              <span className="text-text-primary truncate font-medium">
                                {trip.members.map(m => m.name).join(', ')}
                              </span>
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Add New Trip Form */}
        <div className="lg:col-span-1">
          <NewTravel userId={user.id} />
        </div>
      </div>
    </div>
  );
}
