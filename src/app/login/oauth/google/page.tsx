'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';

interface GoogleAccount {
  name: string;
  email: string;
  avatarText?: string;
  avatarBg?: string;
  avatarImg?: string;
  badge?: string;
}

function GoogleOAuthContent() {
  const router = useRouter();
  const [step, setStep] = useState<'chooser' | 'consent' | 'manual'>('chooser');
  const [selectedAccount, setSelectedAccount] = useState<GoogleAccount | null>(null);
  const [oauthLoading, setOauthLoading] = useState(false);
  const [oauthError, setOauthError] = useState('');

  // Manual inputs
  const [manualName, setManualName] = useState('');
  const [manualEmail, setManualEmail] = useState('');

  const [googleAccounts, setGoogleAccounts] = useState<GoogleAccount[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('google_oauth_accounts');
    if (saved) {
      setGoogleAccounts(JSON.parse(saved));
    } else {
      // Pre-populate with the mock demo accounts for easy testing on any device.
      // Users can prune/remove accounts to configure device-specific lists!
      const defaultList: GoogleAccount[] = [
        { name: 'Umesh Choudhary', email: 'umeshchoudhary.wovvtech@gmail.com', avatarText: 'U', avatarBg: 'bg-emerald-700' },
        { name: 'Umesh Kr', email: 'uk.digi098@gmail.com', avatarText: 'U', avatarBg: 'bg-pink-700' },
        { name: 'Umesh Kr', email: 'ukumar06542@gmail.com', avatarText: 'U', avatarBg: 'bg-amber-800' },
        { name: 'Umesh Kr', email: 'superstar8271@gmail.com', avatarText: 'U', avatarBg: 'bg-rose-700' },
        { name: 'Umesh Choudhary', email: 'uraj06542@gmail.com', avatarText: 'U', avatarBg: 'bg-teal-700' },
        { name: 'Umesh Choudhary', email: 'mail.umeshchoudhary@gmail.com', avatarText: 'U', avatarBg: 'bg-green-900' },
      ];
      setGoogleAccounts(defaultList);
      localStorage.setItem('google_oauth_accounts', JSON.stringify(defaultList));
    }
  }, []);

  const handleRemoveAccount = (emailToRemove: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = googleAccounts.filter(acc => acc.email.toLowerCase() !== emailToRemove.toLowerCase());
    setGoogleAccounts(updated);
    localStorage.setItem('google_oauth_accounts', JSON.stringify(updated));
  };

  const handleAccountSelect = (acc: GoogleAccount) => {
    setSelectedAccount(acc);
    setStep('consent');
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSelectedAccount({ name: manualName, email: manualEmail });
    setStep('consent');
  };

  const handleConsentAllow = async () => {
    if (!selectedAccount) return;
    setOauthLoading(true);
    setOauthError('');

    try {
      const res = await fetch('/api/auth/oauth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: 'google',
          name: selectedAccount.name,
          email: selectedAccount.email,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        // Save account to localStorage for device specificity!
        const saved = localStorage.getItem('google_oauth_accounts');
        let currentList: GoogleAccount[] = saved ? JSON.parse(saved) : [];
        const exists = currentList.some(acc => acc.email.toLowerCase() === selectedAccount.email.toLowerCase());
        if (!exists) {
          const avatarColors = ['bg-emerald-700', 'bg-pink-700', 'bg-amber-800', 'bg-rose-700', 'bg-teal-700', 'bg-green-900'];
          const randomColor = avatarColors[Math.floor(Math.random() * avatarColors.length)];
          const newAccount: GoogleAccount = {
            name: selectedAccount.name,
            email: selectedAccount.email,
            avatarText: selectedAccount.name.charAt(0).toUpperCase(),
            avatarBg: randomColor
          };
          currentList.push(newAccount);
          localStorage.setItem('google_oauth_accounts', JSON.stringify(currentList));
        }

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
    <div className="min-h-screen bg-[#0f0f0f] text-[#e3e3e3] flex flex-col items-center justify-between p-6 select-none font-sans">
      <div className="flex-1 flex items-center justify-center w-full max-w-[1040px]">
        {/* Main Card Container */}
        <div className="bg-[#1f1f1f] w-full rounded-[28px] p-10 flex flex-col md:flex-row gap-8 shadow-2xl min-h-[460px] relative">
          
          {/* Close button to return to login page */}
          <button
            onClick={() => router.push('/login')}
            className="absolute top-6 right-6 p-2 rounded-full hover:bg-[#2d2d2d] text-[#c4c7c5] hover:text-white transition-colors cursor-pointer z-20"
            title="Go back to login"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          {/* LEFT COLUMN: Google brand branding */}
          <div className="flex-1 flex flex-col justify-between text-left">
            <div>
              {/* Google Colored Logo */}
              <div className="w-12 h-12 flex items-center justify-center mb-6">
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                </svg>
              </div>

              {/* Sub-app Logo (GitHub icon replacement / TravelApp logo) */}
              <div className="w-8 h-8 rounded bg-[#2d2d2d] flex items-center justify-center mb-6">
                <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </div>

              {step === 'chooser' && (
                <>
                  <h1 className="text-[32px] font-normal leading-tight tracking-tight text-white mb-2">
                    Choose an account
                  </h1>
                  <p className="text-[15px] text-[#c4c7c5]">
                    to continue to <span className="text-white font-medium">TravelApp</span>
                  </p>
                </>
              )}

              {step === 'consent' && selectedAccount && (
                <>
                  <h1 className="text-[32px] font-normal leading-tight tracking-tight text-white mb-2">
                    TravelApp wants to access your Google Account
                  </h1>
                  <p className="text-[15px] text-[#c4c7c5] truncate max-w-[320px]">
                    {selectedAccount.email}
                  </p>
                </>
              )}

              {step === 'manual' && (
                <>
                  <h1 className="text-[32px] font-normal leading-tight tracking-tight text-white mb-2">
                    Sign in with Google
                  </h1>
                  <p className="text-[15px] text-[#c4c7c5]">
                    to continue to <span className="text-white font-medium">TravelApp</span>
                  </p>
                </>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: Account details list or Consent scopes details */}
          <div className="flex-[1.2] flex flex-col justify-center text-left min-w-0">
            
            {/* VIEW A: CHOOSE ACCOUNT */}
            {step === 'chooser' && (
              <div className="space-y-4 w-full animate-in fade-in duration-200">
                <div className="divide-y divide-[#3c4043] border-b border-[#3c4043] pr-1">
                  {googleAccounts.map((acc, idx) => (
                    <div
                      key={idx}
                      onClick={() => handleAccountSelect(acc)}
                      className="flex items-center gap-4 py-3 px-2 hover:bg-[#2d2d2d] cursor-pointer transition-colors duration-150 first:pt-0 group/row"
                    >
                      {/* Avatar */}
                      {acc.avatarImg ? (
                        <img 
                          src={acc.avatarImg} 
                          alt={acc.name} 
                          className="w-8 h-8 rounded-full object-cover" 
                        />
                      ) : (
                        <div className={`w-8 h-8 rounded-full ${acc.avatarBg} flex items-center justify-center font-semibold text-sm text-white shadow-inner`}>
                          {acc.avatarText}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-[14px] font-medium text-white truncate">{acc.name}</p>
                        <p className="text-[12px] text-[#909090] truncate">{acc.email}</p>
                      </div>

                      {/* Remove account option */}
                      <button
                        onClick={(e) => handleRemoveAccount(acc.email, e)}
                        className="opacity-0 group-hover/row:opacity-100 p-1.5 rounded-lg hover:bg-red-500/10 text-zinc-500 hover:text-red-400 transition-all cursor-pointer z-10"
                        title="Remove account from this device"
                      >
                        <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  ))}

                  {googleAccounts.length === 0 && (
                    <div className="py-4 text-center text-xs text-[#909090]">
                      No Google accounts linked on this device yet.
                    </div>
                  )}

                  {/* Use another account option */}
                  <div
                    onClick={() => setStep('manual')}
                    className="flex items-center gap-4 py-3 px-2 hover:bg-[#2d2d2d] cursor-pointer transition-colors duration-150"
                  >
                    <div className="w-8 h-8 rounded-full bg-[#2d2d2d] flex items-center justify-center text-[#c4c7c5]">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-[14px] font-medium text-white">Use another account</p>
                    </div>
                  </div>
                </div>

                {/* TOS Disclaimer */}
                <p className="text-[12px] text-[#9c9c9c] leading-relaxed pt-2">
                  Before using this app, you can review TravelApp's{' '}
                  <span className="text-[#8ab4f8] hover:underline cursor-pointer">Privacy Policy</span> and{' '}
                  <span className="text-[#8ab4f8] hover:underline cursor-pointer">Terms of Service</span>.
                </p>
              </div>
            )}

            {/* VIEW B: CONSENT PERMISSION SCOPES */}
            {step === 'consent' && selectedAccount && (
              <div className="space-y-5 w-full">
                <div className="space-y-4">
                  <p className="text-[14px] font-medium text-white">This will allow TravelApp to:</p>
                  
                  <div className="space-y-3.5 pl-2">
                    <div className="flex gap-3 items-start">
                      <span className="mt-0.5 text-[#8ab4f8] font-bold text-lg leading-none">✓</span>
                      <div>
                        <p className="text-[14px] text-white font-medium">Associate you with your personal info on Google</p>
                        <p className="text-[12px] text-[#9c9c9c] mt-0.5">Allows the app to read your name and profile settings.</p>
                      </div>
                    </div>

                    <div className="flex gap-3 items-start">
                      <span className="mt-0.5 text-[#8ab4f8] font-bold text-lg leading-none">✓</span>
                      <div>
                        <p className="text-[14px] text-white font-medium">See your primary Google Account email address</p>
                        <p className="text-[12px] text-[#9c9c9c] mt-0.5">Used to log you in and identify your travel profile.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-[#181818] rounded-xl border border-[#2d2d2d] space-y-2 text-[11px] text-[#9c9c9c] leading-relaxed">
                  <p className="font-semibold text-white">Confirm you trust TravelApp</p>
                  <p>
                    By clicking <strong>Allow</strong>, you agree to share your information in accordance with TravelApp's <span className="text-[#8ab4f8] underline cursor-pointer">Terms of Service</span> and <span className="text-[#8ab4f8] underline cursor-pointer">Privacy Policy</span>. You can manage access at any time.
                  </p>
                </div>

                {oauthError && (
                  <p className="text-xs text-red-400 font-medium">{oauthError}</p>
                )}

                <div className="flex gap-3 pt-3 border-t border-[#3c4043] justify-end">
                  <button
                    type="button"
                    onClick={() => setStep('chooser')}
                    className="px-6 py-2 rounded-full border border-[#5f6368] hover:bg-[#2d2d2d] text-[14px] text-[#8ab4f8] font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={oauthLoading}
                    onClick={handleConsentAllow}
                    className="px-6 py-2 rounded-full bg-[#8ab4f8] hover:bg-[#9ec2fa] text-[14px] text-[#202124] font-semibold transition-colors flex items-center justify-center min-w-[100px]"
                  >
                    {oauthLoading ? 'Allowing...' : 'Allow'}
                  </button>
                </div>
              </div>
            )}

            {/* VIEW C: MANUAL ENTRY */}
            {step === 'manual' && (
              <form onSubmit={handleManualSubmit} className="space-y-4 w-full">
                <div>
                  <label className="block text-xs font-semibold text-[#c4c7c5] mb-2 uppercase tracking-wider">Account Full Name</label>
                  <input
                    type="text"
                    required
                    value={manualName}
                    onChange={(e) => setManualName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg bg-[#0f0f0f] border border-[#3c4043] focus:border-[#8ab4f8] outline-none text-sm text-white placeholder-[#5f6368]"
                    placeholder="e.g. Umesh Choudhary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#c4c7c5] mb-2 uppercase tracking-wider">Email Address</label>
                  <input
                    type="email"
                    required
                    value={manualEmail}
                    onChange={(e) => setManualEmail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg bg-[#0f0f0f] border border-[#3c4043] focus:border-[#8ab4f8] outline-none text-sm text-white placeholder-[#5f6368]"
                    placeholder="name@example.com"
                  />
                </div>

                <div className="flex gap-3 pt-3 border-t border-[#3c4043] justify-end">
                  <button
                    type="button"
                    onClick={() => setStep('chooser')}
                    className="px-6 py-2 rounded-full border border-[#5f6368] hover:bg-[#2d2d2d] text-[14px] text-[#8ab4f8] font-medium transition-colors"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-full bg-[#8ab4f8] hover:bg-[#9ec2fa] text-[14px] text-[#202124] font-semibold transition-colors"
                  >
                    Next
                  </button>
                </div>
              </form>
            )}

          </div>

        </div>
      </div>

      {/* Desktop Footer (English, Help, Privacy, Terms) */}
      <div className="w-full max-w-[1040px] flex flex-col sm:flex-row justify-between items-center text-xs text-[#909090] gap-4 border-t border-[#2d2d2d]/30 pt-4">
        <div className="flex items-center gap-2">
          <span>English (United States)</span>
          <svg className="w-3 h-3 text-[#909090]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
        <div className="flex gap-6">
          <span className="hover:text-white cursor-pointer">Help</span>
          <span className="hover:text-white cursor-pointer">Privacy</span>
          <span className="hover:text-white cursor-pointer">Terms</span>
        </div>
      </div>
    </div>
  );
}

export default function GoogleOAuthPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center text-zinc-500 text-sm">
        Connecting to Google services...
      </div>
    }>
      <GoogleOAuthContent />
    </Suspense>
  );
}
