'use client';

import Link from 'next/link';

interface HeroProps {
  isLoggedIn: boolean;
}

export default function Hero({ isLoggedIn }: HeroProps) {
  const handleScrollToFeatures = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const element = document.getElementById('features');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      window.history.pushState(null, '', '#features');
    }
  };

  return (
    <section className="relative overflow-hidden py-28 lg:py-36 flex flex-col items-center text-center rounded-3xl mx-4 sm:mx-6 lg:mx-8 my-6 bg-zinc-950 border border-zinc-800 shadow-2xl">
      {/* Background Image Highway Overlay */}
      <div className="absolute inset-0 z-0 select-none pointer-events-none opacity-40">
        <img
          src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1920&q=80"
          alt="Travel Scenic Highway"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-950 via-zinc-950/70 to-zinc-950" />
      </div>

      {/* Background Ambient Glows */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 relative z-10">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white text-xs font-semibold uppercase tracking-wider animate-bounce">
          <span>✨</span> Next-Gen Social Ride Aggregator
        </div>

        {/* Main Title */}
        <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight">
          Share Journeys. Divide Expenses. <br />
          <span className="bg-gradient-to-r from-red-400 via-indigo-400 to-cyan-400 bg-clip-text text-transparent">
            Explore India Together.
          </span>
        </h1>

        {/* Description */}
        <p className="text-lg text-zinc-300 max-w-2xl mx-auto leading-relaxed">
          Connect with trusted driver captains and co-travelers. Preview highway routes, plan smart NH road trips, and register passenger rosters in seconds.
        </p>

        {/* Actions */}
        <div className="flex flex-wrap justify-center gap-4 pt-4">
          {isLoggedIn ? (
            <Link
              href="/dashboard"
              className="px-8 py-4 rounded-xl bg-accent-color hover:bg-accent-color-hover text-white font-bold text-sm shadow-lg hover:shadow-accent-color/30 transition-all hover:scale-[1.03] cursor-pointer"
            >
              Go to Travel Dashboard ➔
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="px-8 py-4 rounded-xl bg-accent-color hover:bg-accent-color-hover text-white font-bold text-sm shadow-lg hover:shadow-accent-color/30 transition-all hover:scale-[1.03] cursor-pointer"
              >
                Get Started Free
              </Link>
              <a
                href="#features"
                onClick={handleScrollToFeatures}
                className="px-8 py-4 rounded-xl bg-white/10 border border-white/20 text-white font-bold text-sm hover:bg-white/20 transition-all hover:scale-[1.03] cursor-pointer flex items-center justify-center"
              >
                Learn More
              </a>
            </>
          )}
        </div>
      </div>

      {/* Floating Mockup Card */}
      <div className="mt-16 w-full max-w-4xl px-4 sm:px-6 lg:px-8 relative z-10 hover:rotate-1 hover:scale-[1.01] transition-all duration-500">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl relative">
          {/* Glass header */}
          <div className="px-4 py-3 border-b border-zinc-800/50 bg-zinc-950/40 flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
            <div className="h-4 w-40 bg-zinc-850 rounded border border-zinc-800/40 ml-2" />
          </div>
          {/* Visual Simulation Area */}
          <div className="aspect-[16/9] bg-zinc-950 flex flex-col items-center justify-center p-8 text-center relative overflow-hidden">
            {/* Background grid */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.05),transparent_70%)] pointer-events-none" />
            <div className="space-y-4 max-w-md relative z-10">
              <span className="text-3xl">🗺️</span>
              <h3 className="text-lg font-bold text-white">Interactive Route Aggregator Dashboard</h3>
              <p className="text-xs text-zinc-400">
                Search routes, map alternate highways, view distance computations, and coordinate passenger registers dynamically.
              </p>
              <div className="flex gap-2 justify-center text-[10px] font-mono">
                <span className="px-2 py-1 rounded bg-zinc-900 border border-zinc-800 text-zinc-300">AHMEDABAD</span>
                <span className="text-indigo-400 font-bold self-center">➔</span>
                <span className="px-2 py-1 rounded bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">PUNE</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
