'use client';

export default function About() {
  return (
    <section className="relative overflow-hidden py-24 lg:py-32 rounded-3xl mx-4 sm:mx-6 lg:mx-8 my-6 bg-zinc-950 border border-zinc-800 shadow-2xl">
      {/* Background Image Forest Road Path Overlay */}
      <div className="absolute inset-0 z-0 select-none pointer-events-none opacity-20">
        <img
          src="https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=1920&q=80"
          alt="Eco Green Travel Forest Path"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-950 via-zinc-950/70 to-zinc-950" />
      </div>

      {/* Background Ambient Glows */}
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Column: Story */}
          <div className="space-y-6">
            <h2 className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Our Mission</h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Collaborative Commutes for a Greener Tomorrow
            </h3>
            <p className="text-zinc-300 text-sm leading-relaxed">
              TravelApp was built to solve the fragmentation of group carpooling. By combining smart map route calculations with localized passenger registrations, we make it effortless for drivers and travelers to match up.
            </p>
            <p className="text-zinc-300 text-sm leading-relaxed">
              Whether you are planning weekend getaways, office commutes, or highway tours across India, TravelApp reduces fuel expenses, lowers carbon footprint, and transforms solo driving into engaging communal rides.
            </p>
            <div className="flex gap-8 pt-2">
              <div>
                <span className="text-2xl font-bold text-white block">60%</span>
                <span className="text-[10px] text-zinc-400 uppercase font-semibold">Lower Commuting Fees</span>
              </div>
              <div className="border-l border-zinc-800 pl-8">
                <span className="text-2xl font-bold text-emerald-400 block">Zero</span>
                <span className="text-[10px] text-zinc-400 uppercase font-semibold">Booking Commission</span>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Callout (Glassmorphic Card) */}
          <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-8 shadow-xl relative overflow-hidden group hover:border-emerald-500/30 transition-all duration-300">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-colors" />
            <h4 className="text-lg font-bold text-white mb-4">Why TravelApp?</h4>
            <ul className="space-y-3.5 text-xs text-zinc-300">
              <li className="flex items-start gap-2.5">
                <span className="text-emerald-400 shrink-0">✔</span>
                <span>Verify travel routes and NH checkpoints on visual map layouts before booking.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-emerald-400 shrink-0">✔</span>
                <span>Coordinate directly with verified Ride Captains and driver listings.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-emerald-400 shrink-0">✔</span>
                <span>No complex pricing matrices—rides are either completely free or flat-fee paid.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-emerald-400 shrink-0">✔</span>
                <span>Interactive client-side filters to find groups by departure cities.</span>
              </li>
            </ul>
          </div>

        </div>
      </div>
    </section>
  );
}
