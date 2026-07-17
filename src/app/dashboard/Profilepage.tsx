'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

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

interface ProfilepageProps {
  user: User;
  onClose: () => void;
}

type ThemeMode = 'light' | 'dark';
type AccentTheme = 'indigo' | 'emerald' | 'violet' | 'orange' | 'rose';

export default function Profilepage({ user, onClose }: ProfilepageProps) {
  const [activeTab, setActiveTab] = useState<'profile' | 'theme'>('profile');

  // Profile Inputs
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone || '');
  const [age, setAge] = useState(user.age || '');
  const [username, setUsername] = useState(user.username || '');
  const [password, setPassword] = useState('');
  const [address, setAddress] = useState(user.address || '');

  // Theme states
  const [activeTheme, setActiveTheme] = useState<ThemeMode>('dark');
  const [activeAccent, setActiveAccent] = useState<AccentTheme>('indigo');

  // Status
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const router = useRouter();

  // Load theme configuration from document element
  useEffect(() => {
    const theme = localStorage.getItem('theme') as ThemeMode || 'dark';
    const accent = localStorage.getItem('accent') as AccentTheme || 'indigo';
    setActiveTheme(theme);
    setActiveAccent(accent);
  }, []);

  const handleThemeChange = (newTheme: ThemeMode) => {
    setActiveTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(newTheme);
  };

  const handleAccentChange = (newAccent: AccentTheme) => {
    setActiveAccent(newAccent);
    localStorage.setItem('accent', newAccent);
    document.documentElement.setAttribute('data-accent', newAccent);
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, phone, age, username, password, address }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        router.refresh();
        setTimeout(() => {
          onClose();
          setSuccess(false);
        }, 1500);
      } else {
        setError(data.message || 'Failed to update profile.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const accentOptions = [
    { id: 'indigo' as AccentTheme, name: 'Indigo', colorBg: 'bg-indigo-500' },
    { id: 'emerald' as AccentTheme, name: 'Emerald', colorBg: 'bg-emerald-500' },
    { id: 'violet' as AccentTheme, name: 'Violet', colorBg: 'bg-violet-500' },
    { id: 'orange' as AccentTheme, name: 'Orange', colorBg: 'bg-orange-500' },
    { id: 'rose' as AccentTheme, name: 'Rose', colorBg: 'bg-rose-500' },
  ];

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-bg-secondary border border-border-primary rounded-2xl p-6 shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Ambient background glows */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-accent-color-glow rounded-full blur-2xl pointer-events-none transition-colors duration-300" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-accent-color-glow rounded-full blur-2xl pointer-events-none transition-colors duration-300" />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-tertiary transition-colors border border-border-primary z-10"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Tab Header View */}
        <div className="flex gap-4 border-b border-border-primary mb-6">
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`pb-3 text-sm font-semibold border-b-2 transition-all duration-200 ${
              activeTab === 'profile'
                ? 'border-accent-color text-accent-color'
                : 'border-transparent text-text-secondary hover:text-text-primary'
            }`}
          >
            Profile Settings
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('theme')}
            className={`pb-3 text-sm font-semibold border-b-2 transition-all duration-200 ${
              activeTab === 'theme'
                ? 'border-accent-color text-accent-color'
                : 'border-transparent text-text-secondary hover:text-text-primary'
            }`}
          >
            Appearance & Theme
          </button>
        </div>

        {/* TAB 1: PROFILE FORM */}
        {activeTab === 'profile' && (
          <form onSubmit={handleProfileUpdate} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-2 uppercase tracking-wider">Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-bg-primary border border-border-primary text-text-primary focus:border-accent-color focus:ring-4 focus:ring-accent-color-glow outline-none transition-all duration-200 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-2 uppercase tracking-wider">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-bg-primary border border-border-primary text-text-primary focus:border-accent-color focus:ring-4 focus:ring-accent-color-glow outline-none transition-all duration-200 text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-2 uppercase tracking-wider">Phone</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 9876543210"
                  className="w-full px-4 py-2.5 rounded-xl bg-bg-primary border border-border-primary text-text-primary focus:border-accent-color focus:ring-4 focus:ring-accent-color-glow outline-none transition-all duration-200 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-2 uppercase tracking-wider">Age</label>
                <input
                  type="text"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="e.g. 25"
                  className="w-full px-4 py-2.5 rounded-xl bg-bg-primary border border-border-primary text-text-primary focus:border-accent-color focus:ring-4 focus:ring-accent-color-glow outline-none transition-all duration-200 text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-2 uppercase tracking-wider">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. johndoe"
                  className="w-full px-4 py-2.5 rounded-xl bg-bg-primary border border-border-primary text-text-primary focus:border-accent-color focus:ring-4 focus:ring-accent-color-glow outline-none transition-all duration-200 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-2 uppercase tracking-wider">New Password (Optional)</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Leave blank to keep same"
                  className="w-full px-4 py-2.5 rounded-xl bg-bg-primary border border-border-primary text-text-primary focus:border-accent-color focus:ring-4 focus:ring-accent-color-glow outline-none transition-all duration-200 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-2 uppercase tracking-wider">Address</label>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Your physical address details"
                rows={2}
                className="w-full px-4 py-2.5 rounded-xl bg-bg-primary border border-border-primary text-text-primary focus:border-accent-color focus:ring-4 focus:ring-accent-color-glow outline-none transition-all duration-200 text-sm resize-none"
              />
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
                {error}
              </div>
            )}

            {success && (
              <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm text-center">
                Profile updated successfully!
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 px-4 rounded-xl bg-bg-tertiary hover:bg-bg-primary hover:text-text-primary font-medium border border-border-primary transition-all duration-200 text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-3 px-4 rounded-xl bg-accent-color hover:bg-accent-color-hover text-white font-semibold shadow-lg shadow-accent-color-glow transition-all duration-300 disabled:opacity-50 text-sm hover:scale-[1.01] active:scale-[0.99]"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        )}

        {/* TAB 2: APPEARANCE & THEMES */}
        {activeTab === 'theme' && (
          <div className="space-y-6 py-2">
            
            {/* Theme Selector */}
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider">Choose Theme</label>
              <div className="grid grid-cols-2 gap-4">
                {/* Dark Mode Option */}
                <button
                  type="button"
                  onClick={() => handleThemeChange('dark')}
                  className={`flex items-center justify-between p-4 rounded-xl border text-sm font-semibold transition-all duration-200 text-left ${
                    activeTheme === 'dark'
                      ? 'bg-zinc-950 border-accent-color text-white shadow-lg'
                      : 'bg-zinc-950/20 border-border-primary text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">🌙</span>
                    <div>
                      <p className="font-bold">Dark Theme</p>
                      <p className="text-[10px] text-zinc-500 mt-0.5">Saves battery and eye strain</p>
                    </div>
                  </div>
                  {activeTheme === 'dark' && (
                    <span className="w-2.5 h-2.5 rounded-full bg-accent-color" />
                  )}
                </button>

                {/* Light Mode Option */}
                <button
                  type="button"
                  onClick={() => handleThemeChange('light')}
                  className={`flex items-center justify-between p-4 rounded-xl border text-sm font-semibold transition-all duration-200 text-left ${
                    activeTheme === 'light'
                      ? 'bg-white border-accent-color text-zinc-900 shadow-lg'
                      : 'bg-zinc-50 border-border-primary text-zinc-500 hover:text-zinc-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">☀️</span>
                    <div>
                      <p className="font-bold">Light Theme</p>
                      <p className="text-[10px] text-zinc-400 mt-0.5">High contrast and bright</p>
                    </div>
                  </div>
                  {activeTheme === 'light' && (
                    <span className="w-2.5 h-2.5 rounded-full bg-accent-color" />
                  )}
                </button>
              </div>
            </div>

            {/* Accent Theme Colors */}
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider">Accent Accent Color</label>
              <div className="grid grid-cols-5 gap-3">
                {accentOptions.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => handleAccentChange(opt.id)}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all duration-200 gap-2 ${
                      activeAccent === opt.id
                        ? 'bg-bg-tertiary border-accent-color text-text-primary shadow-inner scale-[1.03]'
                        : 'bg-bg-primary border-border-primary text-text-secondary hover:text-text-primary'
                    }`}
                  >
                    <span className={`w-6 h-6 rounded-full ${opt.colorBg} flex items-center justify-center shadow-inner`}>
                      {activeAccent === opt.id && (
                        <span className="w-2 h-2 rounded-full bg-white shadow-sm" />
                      )}
                    </span>
                    <span className="text-[10px] font-bold">{opt.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Preview Box */}
            <div className="p-4 bg-bg-primary border border-border-primary rounded-xl space-y-2 text-center select-none">
              <p className="text-xs text-text-secondary">Accent Theme Preview</p>
              <div className="flex justify-center gap-3">
                <button type="button" className="px-3 py-1.5 rounded-lg bg-accent-color text-white text-xs font-semibold shadow-md">
                  Active Button
                </button>
                <button type="button" className="px-3 py-1.5 rounded-lg border border-accent-color text-accent-color text-xs font-semibold">
                  Outline Button
                </button>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-border-primary">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-accent-color hover:bg-accent-color-hover text-white text-sm font-semibold shadow"
              >
                Close & Apply
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
