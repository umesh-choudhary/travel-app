'use client';

export default function Footer() {
  const handleScrollToFeatures = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const element = document.getElementById('features');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      window.history.pushState(null, '', '#features');
    }
  };

  return (
    <footer className="bg-bg-primary border-t border-border-primary/80 py-12 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Brand logo */}
        <div className="flex flex-col items-center md:items-start gap-1">
          <span className="text-xl font-extrabold bg-gradient-to-r from-red-400 via-accent-color to-cyan-400 bg-clip-text text-transparent tracking-tight">
            TravelApp
          </span>
          <p className="text-[10px] text-text-secondary">
            Next-Gen Collaborative Journey Planner
          </p>
        </div>

        {/* Links */}
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-xs text-text-secondary">
          <a href="#features" onClick={handleScrollToFeatures} className="hover:text-accent-color transition-colors cursor-pointer">Features</a>
          <a href="/login" className="hover:text-accent-color transition-colors">Find Rides</a>
          <a href="/register" className="hover:text-accent-color transition-colors">Register</a>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-accent-color transition-colors">GitHub</a>
        </div>

        {/* Copyright */}
        <div className="text-[10px] text-text-secondary/80">
          &copy; {new Date().getFullYear()} TravelApp Inc. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
