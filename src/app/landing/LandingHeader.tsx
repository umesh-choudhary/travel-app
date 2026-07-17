'use client';

import Link from 'next/link';

interface LandingHeaderProps {
  isLoggedIn: boolean;
}

export default function LandingHeader({ isLoggedIn }: LandingHeaderProps) {
  const handleScrollToFeatures = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const element = document.getElementById('features');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      // Update hash in URL
      window.history.pushState(null, '', '#features');
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border-primary/50 bg-bg-secondary/40 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
        <Link href="/" className="text-xl font-extrabold bg-gradient-to-r from-red-400 via-accent-color to-cyan-400 bg-clip-text text-transparent tracking-tight cursor-pointer">
          TravelApp
        </Link>
        <nav className="flex items-center gap-4 sm:gap-6">
          <a
            href="#features"
            onClick={handleScrollToFeatures}
            className="text-xs font-semibold text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
          >
            Features
          </a>
          {isLoggedIn ? (
            <Link
              href="/dashboard"
              className="px-4 py-2 rounded-lg bg-accent-color text-white text-xs font-bold shadow-md hover:bg-accent-color-hover transition-colors cursor-pointer"
            >
              Dashboard
            </Link>
          ) : (
            <Link
              href="/login"
              className="px-4 py-2 rounded-lg bg-accent-color text-white text-xs font-bold shadow-md hover:bg-accent-color-hover transition-colors cursor-pointer"
            >
              Sign In
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
