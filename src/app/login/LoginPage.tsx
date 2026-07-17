'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

function LoginContent() {
  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot' | 'reset'>('signin');
  
  // Inputs
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Status
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Theme state
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>('dark');

  const router = useRouter();
  const searchParams = useSearchParams();
  const tokenFromUrl = searchParams.get('resetToken');

  // Load theme preference on mount
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

  // Automatically switch to reset mode if token present in URL
  useEffect(() => {
    if (tokenFromUrl) {
      setMode('reset');
      setError('');
      setSuccessMsg('');
    }
  }, [tokenFromUrl]);

  const resetForm = () => {
    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setError('');
    setSuccessMsg('');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        if (data.role === 'admin') {
          router.push('/admin');
        } else {
          router.push('/dashboard');
        }
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        router.push('/dashboard');
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccessMsg(data.message || 'Password reset link sent to your email.');
      } else {
        setError(data.message || 'Failed to send reset link');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: tokenFromUrl, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccessMsg('Password has been reset successfully! Redirecting...');
        setTimeout(() => {
          resetForm();
          router.push('/login');
          setMode('signin');
        }, 2500);
      } else {
        setError(data.message || 'Failed to reset password');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-primary text-text-primary selection:bg-accent-color-glow p-4 relative overflow-hidden transition-colors duration-200">
      
      {/* Back to Home Button at Top Left */}
      <div className="absolute top-6 left-6 z-10">
        <Link
          href="/"
          className="p-2.5 rounded-xl border border-border-primary bg-bg-secondary hover:bg-bg-tertiary text-text-secondary hover:text-text-primary transition-all duration-200 shadow-sm flex items-center gap-2 text-xs font-semibold cursor-pointer"
          title="Back to Home"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Back to Home</span>
        </Link>
      </div>

      {/* Floating Theme Switcher at Top Right */}
      <div className="absolute top-6 right-6 z-10">
        <button
          onClick={toggleTheme}
          type="button"
          className="p-2.5 rounded-xl border border-border-primary bg-bg-secondary hover:bg-bg-tertiary text-text-secondary hover:text-text-primary transition-all duration-200 shadow-sm"
          title="Toggle Light/Dark Theme"
        >
          {currentTheme === 'dark' ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          )}
        </button>
      </div>

      {/* Background glowing rings */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-color-glow rounded-full blur-3xl pointer-events-none transition-colors duration-300" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-color-glow rounded-full blur-3xl pointer-events-none transition-colors duration-300" />

      <div className="w-full max-w-md p-8 rounded-2xl bg-bg-secondary border border-border-primary shadow-2xl relative overflow-hidden font-sans">
        {/* Subtle glass glow border */}
        <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-accent-color to-transparent" />

        {/* 1. SIGN IN VIEW */}
        {mode === 'signin' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="text-center mb-6">
              <h1 className="text-3xl font-extrabold bg-gradient-to-r from-accent-color to-cyan-400 bg-clip-text text-transparent tracking-tight">
                Welcome Back
              </h1>
              <p className="text-text-secondary mt-1.5 text-xs">Enter your credentials to access your account</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wider">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-bg-primary border border-border-primary focus:border-accent-color focus:ring-1 focus:ring-accent-color outline-none transition-all text-sm text-text-primary placeholder-text-secondary/40"
                  placeholder="name@example.com"
                  required
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider">Password</label>
                  <span
                    onClick={() => { resetForm(); setMode('forgot'); }}
                    className="text-xs text-accent-color hover:text-accent-color-hover transition-colors font-semibold cursor-pointer"
                  >
                    Forgot Password?
                  </span>
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-bg-primary border border-border-primary focus:border-accent-color focus:ring-1 focus:ring-accent-color outline-none transition-all text-sm text-text-primary placeholder-text-secondary/40"
                  placeholder="••••••••"
                  required
                />
              </div>

              {error && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center font-medium">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-xl bg-accent-color hover:bg-accent-color-hover text-white font-semibold text-sm shadow-lg shadow-accent-color-glow transition-all active:scale-[0.99] disabled:opacity-50 cursor-pointer"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            {/* Social Logins Section */}
            <div className="space-y-4">
              <div className="relative flex items-center justify-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border-primary"></div>
                </div>
                <div className="relative bg-bg-secondary px-3 text-[10px] font-bold uppercase tracking-wider text-text-secondary">
                  Or continue with
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => router.push('/login/oauth/google')}
                  className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-bg-primary hover:bg-bg-tertiary text-text-primary border border-border-primary transition-all font-semibold text-xs hover:scale-[1.01] cursor-pointer"
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                  </svg>
                  Google
                </button>

                <button
                  type="button"
                  onClick={() => router.push('/login/oauth/apple')}
                  className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-bg-primary hover:bg-bg-tertiary text-text-primary border border-border-primary transition-all font-semibold text-xs hover:scale-[1.01] cursor-pointer"
                >
                  <svg className="w-3.5 h-3.5 fill-current text-text-primary" viewBox="0 0 24 24">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.22.67-2.94 1.51-.64.73-1.2 1.87-1.05 2.98 1.12.09 2.27-.56 3-.18-1.43z"/>
                  </svg>
                  Apple
                </button>
              </div>
            </div>

            <div className="text-center text-xs text-text-secondary pt-2 border-t border-border-primary">
              Don't have an account?{' '}
              <span
                onClick={() => { resetForm(); setMode('signup'); }}
                className="text-accent-color hover:text-accent-color-hover transition-colors font-bold cursor-pointer"
              >
                Sign Up
              </span>
            </div>
          </div>
        )}

        {/* 2. SIGN UP VIEW */}
        {mode === 'signup' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="text-center mb-6">
              <h1 className="text-3xl font-extrabold bg-gradient-to-r from-accent-color to-cyan-400 bg-clip-text text-transparent tracking-tight">
                Create Account
              </h1>
              <p className="text-text-secondary mt-1.5 text-xs">Register a new rider profile to start sharing trips</p>
            </div>

            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wider">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-bg-primary border border-border-primary focus:border-accent-color focus:ring-1 focus:ring-accent-color outline-none transition-all text-sm text-text-primary placeholder-text-secondary/40"
                  placeholder="e.g. Jane Smith"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wider">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-bg-primary border border-border-primary focus:border-accent-color focus:ring-1 focus:ring-accent-color outline-none transition-all text-sm text-text-primary placeholder-text-secondary/40"
                  placeholder="name@example.com"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wider">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-bg-primary border border-border-primary focus:border-accent-color focus:ring-1 focus:ring-accent-color outline-none transition-all text-sm text-text-primary placeholder-text-secondary/40"
                  placeholder="Create password"
                  required
                />
              </div>

              {error && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center font-medium">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-xl bg-accent-color hover:bg-accent-color-hover text-white font-semibold text-sm shadow-lg shadow-accent-color-glow transition-all active:scale-[0.99] disabled:opacity-50 cursor-pointer"
              >
                {loading ? 'Registering...' : 'Sign Up'}
              </button>
            </form>

            <div className="text-center text-xs text-text-secondary pt-2 border-t border-border-primary">
              Already have an account?{' '}
              <span
                onClick={() => { resetForm(); setMode('signin'); }}
                className="text-accent-color hover:text-accent-color-hover transition-colors font-bold cursor-pointer"
              >
                Sign In
              </span>
            </div>
          </div>
        )}

        {/* 3. FORGOT PASSWORD VIEW */}
        {mode === 'forgot' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="text-center mb-6">
              <h1 className="text-3xl font-extrabold bg-gradient-to-r from-accent-color to-cyan-400 bg-clip-text text-transparent tracking-tight">
                Reset Password
              </h1>
              <p className="text-text-secondary mt-1.5 text-xs">Enter your email to receive a password reset link</p>
            </div>

            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wider">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-bg-primary border border-border-primary focus:border-accent-color focus:ring-1 focus:ring-accent-color outline-none transition-all text-sm text-text-primary placeholder-text-secondary/40"
                  placeholder="name@example.com"
                  required
                />
              </div>

              {error && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center font-medium">
                  {error}
                </div>
              )}

              {successMsg && (
                <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs text-center font-medium">
                  {successMsg}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-xl bg-accent-color hover:bg-accent-color-hover text-white font-semibold text-sm shadow-lg shadow-accent-color-glow transition-all active:scale-[0.99] disabled:opacity-50 cursor-pointer"
              >
                {loading ? 'Sending link...' : 'Send Reset Link'}
              </button>
            </form>

            <div className="text-center text-xs text-text-secondary pt-2 border-t border-border-primary">
              <span
                onClick={() => { resetForm(); setMode('signin'); }}
                className="text-accent-color hover:text-accent-color-hover transition-colors font-bold cursor-pointer"
              >
                Back to Sign In
              </span>
            </div>
          </div>
        )}

        {/* 4. RESET PASSWORD VIEW */}
        {mode === 'reset' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="text-center mb-6">
              <h1 className="text-3xl font-extrabold bg-gradient-to-r from-accent-color to-cyan-400 bg-clip-text text-transparent tracking-tight">
                New Password
              </h1>
              <p className="text-text-secondary mt-1.5 text-xs">Choose a secure new password for your account</p>
            </div>

            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wider">New Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-bg-primary border border-border-primary focus:border-accent-color focus:ring-1 focus:ring-accent-color outline-none transition-all text-sm text-text-primary placeholder-text-secondary/40"
                  placeholder="Enter new password"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wider">Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-bg-primary border border-border-primary focus:border-accent-color focus:ring-1 focus:ring-accent-color outline-none transition-all text-sm text-text-primary placeholder-text-secondary/40"
                  placeholder="Confirm new password"
                  required
                />
              </div>

              {error && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center font-medium">
                  {error}
                </div>
              )}

              {successMsg && (
                <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs text-center font-medium">
                  {successMsg}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-xl bg-accent-color hover:bg-accent-color-hover text-white font-semibold text-sm shadow-lg shadow-accent-color-glow transition-all active:scale-[0.99] disabled:opacity-50 cursor-pointer"
              >
                {loading ? 'Saving password...' : 'Save New Password'}
              </button>
            </form>

            <div className="text-center text-xs text-text-secondary pt-2 border-t border-border-primary">
              <span
                onClick={() => { resetForm(); setMode('signin'); }}
                className="text-accent-color hover:text-accent-color-hover transition-colors font-bold cursor-pointer"
              >
                Back to Sign In
              </span>
            </div>
          </div>
        )}

        {/* Demo login tags */}
        {mode === 'signin' && (
          <div className="mt-6 text-center text-[10px] text-text-secondary flex flex-col gap-1 border-t border-border-primary pt-4">
            <p>Demo Admin: admin@example.com / admin</p>
            <p>Demo User: user@example.com / user</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-bg-primary text-text-secondary text-sm">
        Loading Login System...
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
