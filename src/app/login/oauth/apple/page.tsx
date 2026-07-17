'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';

function AppleOAuthContent() {
  const router = useRouter();
  const [emailMode, setEmailMode] = useState<'share' | 'hide'>('share');
  const [oauthLoading, setOauthLoading] = useState(false);
  const [oauthError, setOauthError] = useState('');

  const [account, setAccount] = useState<{ name: string; email: string } | null>(null);
  const [inputName, setInputName] = useState('');
  const [inputEmail, setInputEmail] = useState('');
  const [showInputForm, setShowInputForm] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('apple_oauth_account');
    if (saved) {
      setAccount(JSON.parse(saved));
    } else {
      const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      if (isLocal) {
        const defaultAcc = {
          name: 'Umesh Choudhary',
          email: 'umeshchoudhary.wovvtech@gmail.com',
        };
        setAccount(defaultAcc);
        localStorage.setItem('apple_oauth_account', JSON.stringify(defaultAcc));
      } else {
        setShowInputForm(true);
      }
    }
  }, []);

  const handleContinue = async () => {
    let activeAccount = account;
    if (showInputForm) {
      if (!inputName || !inputEmail) {
        setOauthError('Please enter both name and email');
        return;
      }
      activeAccount = { name: inputName, email: inputEmail };
    }

    if (!activeAccount) return;
    setOauthLoading(true);
    setOauthError('');

    const finalEmail = emailMode === 'share' 
      ? activeAccount.email 
      : 'umesh_relay_9872@privaterelay.appleid.com';

    try {
      const res = await fetch('/api/auth/oauth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: 'apple',
          name: activeAccount.name,
          email: finalEmail,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        // Save to localStorage for device specificity!
        localStorage.setItem('apple_oauth_account', JSON.stringify(activeAccount));

        if (data.role === 'admin') {
          router.push('/admin');
        } else {
          router.push('/dashboard');
        }
      } else {
        setOauthError(data.message || 'Authentication failed');
      }
    } catch (err) {
      setOauthError('An error occurred during authentication.');
    } finally {
      setOauthLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-[#e3e3e3] flex flex-col items-center justify-between p-6 select-none font-sans">
      <div className="flex-1 flex items-center justify-center w-full max-w-[1040px]">
        {/* Main Card Container */}
        <div className="bg-[#1c1c1e] w-full rounded-[28px] p-10 flex flex-col md:flex-row gap-8 shadow-2xl min-h-[460px] border border-[#2c2c2e] relative">
          
          {/* Close button to return to login page */}
          <button
            onClick={() => router.push('/login')}
            className="absolute top-6 right-6 p-2 rounded-full hover:bg-[#2c2c2e] text-[#a1a1a6] hover:text-white transition-colors cursor-pointer z-20"
            title="Go back to login"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* LEFT COLUMN: Apple brand branding */}
          <div className="flex-1 flex flex-col justify-between text-left">
            <div>
              {/* Apple White Logo */}
              <div className="w-12 h-12 flex items-center justify-center mb-6">
                <svg className="w-8 h-8 fill-current text-white" viewBox="0 0 24 24">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.22.67-2.94 1.51-.64.73-1.2 1.87-1.05 2.98 1.12.09 2.27-.56 3-.18-1.43z"/>
                </svg>
              </div>

              {/* Sub-app Logo (TravelApp logo) */}
              <div className="w-8 h-8 rounded bg-[#2c2c2e] flex items-center justify-center mb-6">
                <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </div>

              <h1 className="text-[32px] font-normal leading-tight tracking-tight text-white mb-2">
                Sign in with Apple ID
              </h1>
              <p className="text-[15px] text-[#a1a1a6]">
                Use Apple ID to sign in to <span className="text-white font-medium">TravelApp</span>
              </p>
            </div>
          </div>

          {/* RIGHT COLUMN: Account details & Consent selection */}
          <div className="flex-[1.2] flex flex-col justify-center text-left min-w-0">
            <div className="space-y-6 w-full animate-in fade-in duration-200">
              
              {showInputForm ? (
                /* Manual Input Form */
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-white mb-2">Enter Apple ID Credentials</h3>
                  <div>
                    <label className="block text-xs font-semibold text-[#86868b] mb-2 uppercase tracking-wider">Full Name</label>
                    <input
                      type="text"
                      required
                      value={inputName}
                      onChange={(e) => setInputName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg bg-[#151516] border border-[#2c2c2e] focus:border-white outline-none text-sm text-white placeholder-[#48484a]"
                      placeholder="e.g. Umesh Choudhary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#86868b] mb-2 uppercase tracking-wider">Apple ID (Email)</label>
                    <input
                      type="email"
                      required
                      value={inputEmail}
                      onChange={(e) => setInputEmail(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg bg-[#151516] border border-[#2c2c2e] focus:border-white outline-none text-sm text-white placeholder-[#48484a]"
                      placeholder="name@example.com"
                    />
                  </div>
                </div>
              ) : account ? (
                /* Account Details Box */
                <>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between py-2.5 border-b border-[#2c2c2e] text-[14px]">
                      <span className="text-[#86868b]">Apple ID</span>
                      <span className="font-semibold text-white">{account.email}</span>
                    </div>

                    <div className="flex items-center justify-between py-2.5 border-b border-[#2c2c2e] text-[14px]">
                      <span className="text-[#86868b]">Name</span>
                      <span className="font-semibold text-white">{account.name}</span>
                    </div>
                  </div>

                  {/* Email Sharing Choice Option */}
                  <div className="space-y-3">
                    <p className="text-[12px] font-bold text-[#86868b] uppercase tracking-wider">Email Address</p>
                    
                    <div className="space-y-2">
                      {/* Option 1: Share Email */}
                      <label className="flex items-start gap-4 p-3 rounded-xl border border-[#2c2c2e] bg-[#151516] hover:bg-[#252526] cursor-pointer transition-colors">
                        <input
                          type="radio"
                          name="appleEmail"
                          checked={emailMode === 'share'}
                          onChange={() => setEmailMode('share')}
                          className="mt-1 text-indigo-500 focus:ring-0"
                        />
                        <div>
                          <p className="text-xs text-white font-semibold">Share My Email</p>
                          <p className="text-[11px] text-[#86868b] mt-0.5">{account.email}</p>
                        </div>
                      </label>

                      {/* Option 2: Hide Email */}
                      <label className="flex items-start gap-4 p-3 rounded-xl border border-[#2c2c2e] bg-[#151516] hover:bg-[#252526] cursor-pointer transition-colors">
                        <input
                          type="radio"
                          name="appleEmail"
                          checked={emailMode === 'hide'}
                          onChange={() => setEmailMode('hide')}
                          className="mt-1 text-indigo-500 focus:ring-0"
                        />
                        <div>
                          <p className="text-xs text-white font-semibold">Hide My Email</p>
                          <p className="text-[11px] text-[#86868b] mt-0.5">umesh_relay_9872@privaterelay.appleid.com</p>
                        </div>
                      </label>
                    </div>
                  </div>
                </>
              ) : null}

              <p className="text-[11px] text-[#86868b] leading-relaxed">
                By continuing, Apple will share your name and choice of email with TravelApp to set up your account.
              </p>

              {oauthError && (
                <p className="text-xs text-red-400 font-medium">{oauthError}</p>
              )}

              <div className="flex gap-3 pt-3 border-t border-[#2c2c2e] justify-end">
                <button
                  type="button"
                  onClick={() => router.push('/login')}
                  className="px-6 py-2 rounded-full border border-[#48484a] hover:bg-[#2c2c2e] text-[14px] text-white font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={oauthLoading}
                  onClick={handleContinue}
                  className="px-6 py-2 rounded-full bg-white hover:bg-[#e3e3e3] text-[14px] text-black font-semibold transition-colors flex items-center justify-center min-w-[100px]"
                >
                  {oauthLoading ? 'Signing in...' : 'Continue'}
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Desktop Footer */}
      <div className="w-full max-w-[1040px] flex flex-col sm:flex-row justify-between items-center text-xs text-[#86868b] gap-4 border-t border-[#2c2c2e] pt-4">
        <span>Apple ID & Privacy</span>
        <div className="flex gap-6">
          <span className="hover:text-white cursor-pointer">Support</span>
          <span className="hover:text-white cursor-pointer">Terms & Conditions</span>
        </div>
      </div>
    </div>
  );
}

export default function AppleOAuthPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center text-zinc-500 text-sm">
        Connecting to Apple Services...
      </div>
    }>
      <AppleOAuthContent />
    </Suspense>
  );
}
