import { getUsers } from '@/lib/db';
import CardImageSlider from '../../dashboard/groups/CardImageSlider';

export default async function AdminTripsPage() {
  const users = await getUsers();
  
  // Aggregate all user trips into a single array
  interface AggregatedTrip {
    id: string;
    from: string;
    to: string;
    date: string;
    status: string;
    feesType: 'free' | 'paid';
    feesAmount: string;
    leader: string;
    creatorName: string;
    creatorEmail: string;
    membersList: { name: string; phone: string }[];
  }

  const allTrips: AggregatedTrip[] = [];

  users.forEach((u) => {
    const trips = u.trips || [];
    trips.forEach((t) => {
      allTrips.push({
        id: t.id,
        from: t.from || 'Ahmedabad',
        to: t.to || 'Pune',
        date: t.date,
        status: t.status,
        feesType: t.feesType || 'free',
        feesAmount: t.feesAmount || '0',
        leader: t.leader || u.name,
        creatorName: u.name,
        creatorEmail: u.email,
        membersList: t.members || [],
      });
    });
  });

  // Calculate admin summary statistics
  const totalTrips = allTrips.length;
  const paidTrips = allTrips.filter((t) => t.feesType === 'paid');
  const freeTripsCount = totalTrips - paidTrips.length;

  const totalMembers = allTrips.reduce((acc, t) => acc + t.membersList.length, 0);

  const totalRevenue = allTrips.reduce((acc, t) => {
    if (t.feesType === 'paid') {
      const amount = parseFloat(t.feesAmount.replace(/[^0-9.]/g, '')) || 0;
      return acc + amount * t.membersList.length;
    }
    return acc;
  }, 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div>
        <h1 className="text-3xl font-bold text-text-primary mb-2">All Group Trips</h1>
        <p className="text-text-secondary">View and manage travel group rosters, driver captains, and registration rosters.</p>
      </div>

      {/* Admin stats dashboard banner */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="p-6 rounded-2xl bg-bg-secondary border border-border-primary shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-accent-color/5 rounded-full blur-xl" />
          <h3 className="text-text-secondary text-xs font-semibold uppercase tracking-wider mb-1">Total Active Trips</h3>
          <p className="text-3xl font-bold text-text-primary">{totalTrips}</p>
        </div>
        <div className="p-6 rounded-2xl bg-bg-secondary border border-border-primary shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-accent-color/5 rounded-full blur-xl" />
          <h3 className="text-text-secondary text-xs font-semibold uppercase tracking-wider mb-1">Total Passengers</h3>
          <p className="text-3xl font-bold text-accent-color">{totalMembers}</p>
        </div>
        <div className="p-6 rounded-2xl bg-bg-secondary border border-border-primary shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-accent-color/5 rounded-full blur-xl" />
          <h3 className="text-text-secondary text-xs font-semibold uppercase tracking-wider mb-1">Free vs Paid Trips</h3>
          <p className="text-xl font-bold text-accent-color">
            {freeTripsCount} Free / {paidTrips.length} Paid
          </p>
        </div>
        <div className="p-6 rounded-2xl bg-bg-secondary border border-border-primary shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-accent-color/5 rounded-full blur-xl" />
          <h3 className="text-text-secondary text-xs font-semibold uppercase tracking-wider mb-1">Est. Paid Volume</h3>
          <p className="text-3xl font-bold text-accent-color">₹{totalRevenue.toLocaleString()}</p>
        </div>
      </div>

      {/* Trips list grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {allTrips.length === 0 ? (
          <div className="col-span-full p-12 text-center bg-bg-secondary rounded-2xl border border-border-primary text-text-secondary">
            No trips have been planned by any users yet.
          </div>
        ) : (
          allTrips.map((trip) => {
            const tripRevenue = trip.feesType === 'paid' 
              ? (parseFloat(trip.feesAmount.replace(/[^0-9.]/g, '')) || 0) * trip.membersList.length
              : 0;            return (
              <div 
                key={trip.id} 
                className="bg-bg-secondary border border-border-primary rounded-2xl shadow-xl hover:shadow-2xl hover:shadow-accent-color/5 hover:-translate-y-1 relative overflow-hidden hover:border-accent-color/30 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <CardImageSlider from={trip.from} to={trip.to} heightClass="h-32" />
                  
                  <div className="p-6">
                    {/* Card Header */}
                    <div className="flex justify-between items-start mb-5 border-b border-border-primary/50 pb-4">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-bold text-text-primary bg-bg-primary px-2 py-0.5 rounded border border-border-primary shadow-sm">{trip.from}</span>
                          <span className="text-accent-color font-extrabold animate-pulse">➔</span>
                          <span className="text-xs font-bold text-accent-color bg-accent-color/10 px-2 py-0.5 rounded border border-accent-color/20 shadow-sm">{trip.to}</span>
                        </div>
                        <p className="text-[10px] text-text-secondary mt-2.5">
                          Creator: <span className="text-text-primary font-semibold">{trip.creatorName}</span> • <span className="opacity-70">{trip.creatorEmail}</span>
                        </p>
                      </div>
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border uppercase tracking-wider shadow-sm shrink-0 ${
                        trip.feesType === 'paid' 
                          ? 'bg-accent-color/10 border-accent-color/20 text-accent-color' 
                          : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500'
                      }`}>
                        {trip.feesType === 'paid' ? `Paid (₹${trip.feesAmount})` : 'Free Ride'}
                      </span>
                    </div>

                    {/* Details Section */}
                    <div className="grid grid-cols-2 gap-4 text-xs mb-5 bg-bg-primary/30 p-4 rounded-xl border border-border-primary/50">
                      <div>
                        <p className="text-[10px] text-text-secondary font-bold uppercase tracking-wider">Ride Captain</p>
                        <p className="text-text-primary font-bold text-sm mt-1 flex items-center gap-1.5">
                          <span>👤</span>
                          <span className="truncate">{trip.leader}</span>
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] text-text-secondary font-bold uppercase tracking-wider">Departure</p>
                        <p className="text-text-primary font-bold text-sm mt-1 flex items-center gap-1.5">
                          <span>📅</span>
                          <span>{new Date(trip.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] text-text-secondary font-bold uppercase tracking-wider">Registry Size</p>
                        <p className="text-text-primary font-bold text-sm mt-1 flex items-center gap-1.5">
                          <span>👥</span>
                          <span>{trip.membersList.length} passenger{trip.membersList.length === 1 ? '' : 's'}</span>
                        </p>
                      </div>
                      {trip.feesType === 'paid' && (
                        <div>
                          <p className="text-[10px] text-text-secondary font-bold uppercase tracking-wider">Trip Collection</p>
                          <p className="text-accent-color font-extrabold text-sm mt-1 flex items-center gap-1">
                            <span>₹</span>
                            <span>{tripRevenue.toLocaleString()}</span>
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Passenger Registry Dropdown/List */}
                    <div className="bg-bg-primary/50 border border-border-primary/50 rounded-xl p-4">
                      <h4 className="text-[10px] font-bold text-text-secondary uppercase tracking-wider mb-3">
                        Registered Passenger Members List
                      </h4>
                      {trip.membersList.length === 0 ? (
                        <p className="text-xs text-text-secondary italic text-center py-4 bg-bg-secondary/40 border border-dashed border-border-primary/60 rounded-lg">
                          No passenger members registered yet.
                        </p>
                      ) : (
                        <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                          {trip.membersList.map((member, mIdx) => (
                            <div 
                              key={mIdx} 
                              className="flex justify-between items-center text-xs p-2 rounded-lg bg-bg-secondary/60 border border-border-primary/30 hover:border-accent-color/20 hover:bg-bg-secondary transition-all"
                            >
                              <span className="text-text-primary font-semibold flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                {member.name}
                              </span>
                              <span className="text-text-secondary font-mono text-[10px]">{member.phone}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
