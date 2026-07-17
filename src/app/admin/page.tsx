import { getUsers } from '@/lib/db';
import Link from 'next/link';

export default async function AdminDashboard() {
  const users = await getUsers();
  const totalUsers = users.length;
  const regularUsers = users.filter(u => u.role === 'user');
  const totalTrips = regularUsers.reduce((acc, user) => acc + user.trips.length, 0);

  const colors = [
    'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    'bg-amber-500/10 text-amber-400 border-amber-500/20',
    'bg-rose-500/10 text-rose-400 border-rose-500/20'
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div>
        <h1 className="text-3xl font-bold text-text-primary mb-2">Admin Dashboard</h1>
        <p className="text-text-secondary">Manage users and view their travel plans.</p>
      </div>

      {/* Summary statistics cards with ambient light glows */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-bg-secondary border border-border-primary shadow-xl hover:shadow-accent-color/5 hover:border-accent-color/20 relative overflow-hidden transition-all duration-300 group hover:scale-[1.02] cursor-default">
          <div className="absolute top-0 right-0 w-24 h-24 bg-accent-color-glow rounded-full blur-xl pointer-events-none opacity-40 group-hover:opacity-100 transition-opacity" />
          <h3 className="text-text-secondary text-xs font-semibold uppercase tracking-wider mb-1">Total Accounts</h3>
          <p className="text-4xl font-bold text-text-primary mt-1">{totalUsers}</p>
        </div>
        <div className="p-6 rounded-2xl bg-bg-secondary border border-border-primary shadow-xl hover:shadow-accent-color/5 hover:border-accent-color/20 relative overflow-hidden transition-all duration-300 group hover:scale-[1.02] cursor-default">
          <div className="absolute top-0 right-0 w-24 h-24 bg-accent-color-glow rounded-full blur-xl pointer-events-none opacity-40 group-hover:opacity-100 transition-opacity" />
          <h3 className="text-text-secondary text-xs font-semibold uppercase tracking-wider mb-1">Regular Users</h3>
          <p className="text-4xl font-bold text-accent-color mt-1">{regularUsers.length}</p>
        </div>
        <div className="p-6 rounded-2xl bg-bg-secondary border border-border-primary shadow-xl hover:shadow-accent-color/5 hover:border-accent-color/20 relative overflow-hidden transition-all duration-300 group hover:scale-[1.02] cursor-default">
          <div className="absolute top-0 right-0 w-24 h-24 bg-accent-color-glow rounded-full blur-xl pointer-events-none opacity-40 group-hover:opacity-100 transition-opacity" />
          <h3 className="text-text-secondary text-xs font-semibold uppercase tracking-wider mb-1">Total Trips Planned</h3>
          <p className="text-4xl font-bold text-accent-color mt-1">{totalTrips}</p>
        </div>
      </div>

      {/* Directory Table Wrapper */}
      <div className="bg-bg-secondary rounded-2xl border border-border-primary overflow-hidden shadow-xl">
        <div className="px-6 py-5 border-b border-border-primary bg-bg-secondary/50 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold text-text-primary">Users Directory</h2>
            <p className="text-xs text-text-secondary mt-0.5">Manage registered accounts and detailed trip files.</p>
          </div>
        </div>
        <div className="divide-y divide-border-primary">
          {regularUsers.map(user => {
            const initial = user.name ? user.name.charAt(0).toUpperCase() : '?';
            const colorClass = colors[user.name.charCodeAt(0) % colors.length];

            return (
              <div 
                key={user.id} 
                className="p-6 flex items-center justify-between hover:bg-bg-tertiary/20 transition-all duration-200 group/item"
              >
                <div className="flex items-center gap-4 min-w-0">
                  {/* Dynamic Colored Initial Avatar */}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border shrink-0 shadow-sm transition-transform duration-300 group-hover/item:scale-105 ${colorClass}`}>
                    {initial}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="font-bold text-text-primary truncate text-sm">{user.name}</h3>
                      <span className="px-2 py-0.5 text-[10px] font-semibold rounded bg-bg-primary text-text-secondary border border-border-primary/50 shrink-0">
                        {user.trips.length} trip{user.trips.length === 1 ? '' : 's'}
                      </span>
                    </div>
                    <p className="text-xs text-text-secondary truncate">{user.email}</p>
                  </div>
                </div>
                <Link 
                  href={`/users/${user.id}`}
                  className="px-4 py-2 rounded-xl bg-accent-color hover:bg-accent-color-hover text-white text-xs font-semibold shadow-md hover:shadow-accent-color/30 transition-all flex items-center gap-1.5 cursor-pointer shrink-0 hover:scale-[1.02]"
                >
                  <span>View Details</span>
                  <span className="transition-transform group-hover/item:translate-x-0.5">➔</span>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
