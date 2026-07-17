'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import LogoutButton from '../LogoutButton';
import Profilepage from '../dashboard/Profilepage';

interface Trip {
  id: string;
  destination: string;
  date: string;
  status: string;
}

interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  trips: Trip[];
  phone?: string;
  age?: string;
  username?: string;
  address?: string;
}

export default function AdminSidebarWrapper({
  user,
  children,
}: {
  user: User;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>('dark');

  const pathname = usePathname();

  const handleLogout = async () => {
    await fetch('/api/auth', { method: 'DELETE' });
    router.push('/login');
    router.refresh();
  };

  useEffect(() => {
    const theme = localStorage.getItem('theme') as 'light' | 'dark' || 'dark';
    setCurrentTheme(theme);
  }, []);

  const toggleTheme = () => {
    const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setCurrentTheme(nextTheme);
    localStorage.setItem('theme', nextTheme);
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(nextTheme);
  };

  const menuItems = [
    {
      name: 'Admin Dashboard',
      href: '/admin',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      ),
    },
    {
      name: 'All Group Trips',
      href: '/admin/trips',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L16 4m0 13V4m0 0L9 7" />
        </svg>
      ),
    },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full justify-between">
      <div className="space-y-8">
        {/* Brand */}
        <div className="flex items-center gap-2">
          <span className="text-2xl font-extrabold bg-gradient-to-r from-red-400 via-accent-color to-cyan-400 bg-clip-text text-transparent tracking-tight">
            TravelApp Admin
          </span>
        </div>

        {/* Navigation Tabs */}
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-accent-color/10 border border-accent-color/20 text-accent-color shadow-md shadow-accent-color-glow font-semibold'
                    : 'text-text-secondary hover:text-text-primary hover:bg-bg-tertiary/60 border border-transparent'
                }`}
              >
                {item.icon}
                {item.name}
              </Link>
            );
          })}
        </nav>

        <hr className="border-border-primary" />

        {/* Quick Actions */}
        <div className="space-y-2">
          <button
            onClick={() => {
              setIsMobileMenuOpen(false);
              setIsProfileOpen(true);
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-text-secondary hover:text-accent-color hover:bg-accent-color-glow border border-transparent hover:border-accent-color/20 transition-all duration-200"
          >
            <svg className="w-5 h-5 text-accent-color" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Profile Settings
          </button>
        </div>
      </div>

      {/* User Session Footer */}
      <div className="pt-4 border-t border-border-primary space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-red-500 to-accent-color flex items-center justify-center font-bold text-white text-sm shadow-inner flex-shrink-0">
              {user.name.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <h4 className="text-sm font-medium text-text-primary truncate">{user.name}</h4>
              <p className="text-xs text-text-secondary truncate">{user.email}</p>
            </div>
          </div>

          {/* Quick Theme Switcher */}
          <button
            onClick={toggleTheme}
            type="button"
            className="p-2 rounded-xl border border-border-primary bg-bg-primary hover:bg-bg-tertiary text-text-secondary hover:text-text-primary transition-all duration-200 flex-shrink-0"
            title="Toggle Light/Dark Theme"
          >
            {currentTheme === 'dark' ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
        </div>
        <LogoutButton />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary selection:bg-accent-color-glow transition-colors duration-200">
      {/* Mobile Header Bar */}
      <header className="md:hidden flex items-center justify-between px-6 h-16 border-b border-border-primary bg-bg-secondary/80 backdrop-blur-md fixed top-0 w-full z-40">
        <span className="text-xl font-bold bg-gradient-to-r from-red-400 to-accent-color bg-clip-text text-transparent">
          Admin Panel
        </span>
        
        {/* Quick Theme Switcher on Mobile Header */}
        <button
          onClick={toggleTheme}
          type="button"
          className="p-2 rounded-xl border border-border-primary bg-bg-primary hover:bg-bg-tertiary text-text-secondary hover:text-text-primary transition-all duration-200"
          title="Toggle Light/Dark Theme"
        >
          {currentTheme === 'dark' ? (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          )}
        </button>
      </header>

      {/* Desktop Sidebar (Permanent) */}
      <aside className="hidden md:block fixed inset-y-0 left-0 w-64 bg-bg-secondary/60 backdrop-blur-md border-r border-border-primary/60 p-6 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Sticky Bottom Tab Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-bg-secondary/90 backdrop-blur-md border-t border-border-primary h-16 flex items-center justify-around pb-safe shadow-lg">
        {/* Tab 1: Admin Dashboard */}
        <Link
          href="/admin"
          className={`flex flex-col items-center justify-center flex-1 h-full py-1 text-[10px] font-bold tracking-tight transition-colors ${
            pathname === '/admin' ? 'text-accent-color' : 'text-text-secondary'
          }`}
        >
          <svg className="w-5 h-5 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
          <span>Admin</span>
        </Link>

        {/* Tab 2: All Group Trips */}
        <Link
          href="/admin/trips"
          className={`flex flex-col items-center justify-center flex-1 h-full py-1 text-[10px] font-bold tracking-tight transition-colors ${
            pathname === '/admin/trips' ? 'text-accent-color' : 'text-text-secondary'
          }`}
        >
          <svg className="w-5 h-5 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L16 4m0 13V4m0 0L9 7" />
          </svg>
          <span>Trips</span>
        </Link>

        {/* Tab 3: Profile Settings */}
        <button
          onClick={() => setIsProfileOpen(true)}
          className="flex flex-col items-center justify-center flex-1 h-full py-1 text-[10px] font-bold tracking-tight text-text-secondary hover:text-accent-color cursor-pointer"
        >
          <svg className="w-5 h-5 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span>Profile</span>
        </button>

        {/* Tab 4: Logout */}
        <button
          onClick={handleLogout}
          className="flex flex-col items-center justify-center flex-1 h-full py-1 text-[10px] font-bold tracking-tight text-text-secondary hover:text-red-400 cursor-pointer"
        >
          <svg className="w-5 h-5 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span>Exit</span>
        </button>
      </div>

      {/* Main Content Area */}
      <div className="pl-0 md:pl-64 pt-16 pb-20 md:pb-0 md:pt-0 min-h-screen flex flex-col justify-between">
        <div className="flex-1">{children}</div>
      </div>

      {/* Global Edit Profile Modal */}
      {isProfileOpen && (
        <Profilepage 
          user={user} 
          onClose={() => setIsProfileOpen(false)} 
        />
      )}
    </div>
  );
}
