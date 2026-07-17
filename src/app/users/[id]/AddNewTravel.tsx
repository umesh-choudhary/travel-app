'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function NewTravel({ userId, onSuccess }: { userId: string; onSuccess?: () => void }) {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [date, setDate] = useState('');
  const [status, setStatus] = useState('upcoming');
  const [feesType, setFeesType] = useState<'free' | 'paid'>('free');
  const [feesAmount, setFeesAmount] = useState('');
  const [leader, setLeader] = useState('');
  const [members, setMembers] = useState<{ name: string; phone: string }[]>([]);

  // Autocomplete states
  const [fromSuggestions, setFromSuggestions] = useState<string[]>([]);
  const [toSuggestions, setToSuggestions] = useState<string[]>([]);
  const [showFromSuggestions, setShowFromSuggestions] = useState(false);
  const [showToSuggestions, setShowToSuggestions] = useState(false);

  const fromTimeoutRef = useRef<any>(null);
  const toTimeoutRef = useRef<any>(null);

  // Clear timeouts on unmount
  useEffect(() => {
    return () => {
      if (fromTimeoutRef.current) clearTimeout(fromTimeoutRef.current);
      if (toTimeoutRef.current) clearTimeout(toTimeoutRef.current);
    };
  }, []);

  const handleFromChange = (val: string) => {
    setFrom(val);
    if (fromTimeoutRef.current) clearTimeout(fromTimeoutRef.current);

    if (val.trim().length < 3) {
      setFromSuggestions([]);
      return;
    }

    fromTimeoutRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(val)}&limit=10&accept-language=en&viewbox=68.1,6.8,97.4,35.5`);
        if (!res.ok) return;
        const data = await res.json();
        const list = data.map((item: any) => item.display_name);
        setFromSuggestions(list);
      } catch (err) {
        console.error(err);
      }
    }, 450);
  };

  const handleToChange = (val: string) => {
    setTo(val);
    if (toTimeoutRef.current) clearTimeout(toTimeoutRef.current);

    if (val.trim().length < 3) {
      setToSuggestions([]);
      return;
    }

    toTimeoutRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(val)}&limit=10&accept-language=en&viewbox=68.1,6.8,97.4,35.5`);
        if (!res.ok) return;
        const data = await res.json();
        const list = data.map((item: any) => item.display_name);
        setToSuggestions(list);
      } catch (err) {
        console.error(err);
      }
    }, 450);
  };

  const parsePlace = (displayName: string) => {
    const parts = displayName.split(',');
    const main = parts[0]?.trim() || '';
    const sub = parts.slice(1).join(',').trim();
    return { main, sub };
  };

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleAddMember = () => {
    setMembers([...members, { name: '', phone: '' }]);
  };

  const handleRemoveMember = (index: number) => {
    setMembers(members.filter((_, i) => i !== index));
  };

  const handleMemberChange = (index: number, field: 'name' | 'phone', value: string) => {
    const updated = [...members];
    updated[index][field] = value;
    setMembers(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError('');

    try {
      const response = await fetch(`/api/users/${userId}/trips`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from,
          to,
          destination: `${from} to ${to}`,
          date,
          status,
          feesType,
          feesAmount: feesType === 'paid' ? feesAmount : '',
          leader: leader.trim(),
          members,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setFrom('');
        setTo('');
        setDate('');
        setStatus('upcoming');
        setFeesType('free');
        setFeesAmount('');
        setLeader('');
        setMembers([]);
        router.refresh();
        if (onSuccess) onSuccess();
        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError(data.message || 'Failed to add travel plan.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-bg-secondary border border-border-primary rounded-2xl p-6 shadow-xl relative transition-all duration-300">
      {/* Decorative gradient blur background */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-accent-color-glow rounded-full blur-2xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-accent-color-glow rounded-full blur-2xl pointer-events-none" />

      <h2 className="text-xl font-semibold text-text-primary mb-6 flex items-center gap-2">
        <svg className="w-5 h-5 text-accent-color animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
        </svg>
        Add New Trip
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Route: From & To */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <label htmlFor="from" className="block text-xs font-semibold text-text-secondary mb-2 uppercase tracking-wider">
              From (Origin)
            </label>
            <input
              id="from"
              type="text"
              required
              value={from}
              onChange={(e) => handleFromChange(e.target.value)}
              onFocus={() => setShowFromSuggestions(true)}
              onBlur={() => setTimeout(() => setShowFromSuggestions(false), 200)}
              placeholder="e.g., Gujarat"
              autoComplete="off"
              className="w-full px-4 py-3 rounded-xl bg-bg-primary border border-border-primary text-text-primary placeholder-text-secondary/40 focus:border-accent-color focus:ring-4 focus:ring-accent-color-glow outline-none transition-all duration-200 text-sm"
            />
            {showFromSuggestions && fromSuggestions.length > 0 && (
              <div className="absolute top-full left-0 z-50 mt-1 max-h-60 w-[320px] md:w-[380px] max-w-[calc(100vw-32px)] overflow-y-auto rounded-xl bg-bg-secondary border border-border-primary shadow-2xl divide-y divide-border-primary/50">
                {fromSuggestions.map((suggestion) => {
                  const { main, sub } = parsePlace(suggestion);
                  return (
                    <button
                      key={suggestion}
                      type="button"
                      onMouseDown={() => {
                        setFrom(suggestion);
                        setShowFromSuggestions(false);
                      }}
                      className="w-full px-4 py-3 hover:bg-bg-tertiary/80 transition-colors duration-150 block text-left cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-bg-primary border border-border-primary flex items-center justify-center text-text-secondary flex-shrink-0 shadow-sm">
                          <svg className="w-4 h-4 text-accent-color" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-text-primary truncate">{main}</p>
                          {sub && <p className="text-xs text-text-secondary truncate mt-0.5">{sub}</p>}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
          <div className="relative">
            <label htmlFor="to" className="block text-xs font-semibold text-text-secondary mb-2 uppercase tracking-wider">
              To (Destination)
            </label>
            <input
              id="to"
              type="text"
              required
              value={to}
              onChange={(e) => handleToChange(e.target.value)}
              onFocus={() => setShowToSuggestions(true)}
              onBlur={() => setTimeout(() => setShowToSuggestions(false), 200)}
              placeholder="e.g., Pune"
              autoComplete="off"
              className="w-full px-4 py-3 rounded-xl bg-bg-primary border border-border-primary text-text-primary placeholder-text-secondary/40 focus:border-accent-color focus:ring-4 focus:ring-accent-color-glow outline-none transition-all duration-200 text-sm"
            />
            {showToSuggestions && toSuggestions.length > 0 && (
              <div className="absolute top-full right-0 z-50 mt-1 max-h-60 w-[320px] md:w-[380px] max-w-[calc(100vw-32px)] overflow-y-auto rounded-xl bg-bg-secondary border border-border-primary shadow-2xl divide-y divide-border-primary/50">
                {toSuggestions.map((suggestion) => {
                  const { main, sub } = parsePlace(suggestion);
                  return (
                    <button
                      key={suggestion}
                      type="button"
                      onMouseDown={() => {
                        setTo(suggestion);
                        setShowToSuggestions(false);
                      }}
                      className="w-full px-4 py-3 hover:bg-bg-tertiary/80 transition-colors duration-150 block text-left cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-bg-primary border border-border-primary flex items-center justify-center text-text-secondary flex-shrink-0 shadow-sm">
                          <svg className="w-4 h-4 text-accent-color" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-text-primary truncate">{main}</p>
                          {sub && <p className="text-xs text-text-secondary truncate mt-0.5">{sub}</p>}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Fees Segment */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="feesType" className="block text-xs font-semibold text-text-secondary mb-2 uppercase tracking-wider">
              Fees
            </label>
            <select
              id="feesType"
              value={feesType}
              onChange={(e) => setFeesType(e.target.value as 'free' | 'paid')}
              className="w-full px-4 py-3 rounded-xl bg-bg-primary border border-border-primary text-text-primary focus:border-accent-color focus:ring-4 focus:ring-accent-color-glow outline-none transition-all duration-200 text-sm cursor-pointer"
            >
              <option value="free" className="bg-bg-primary text-emerald-500 font-medium">Free Ride</option>
              <option value="paid" className="bg-bg-primary text-accent-color font-medium">Paid Ride</option>
            </select>
          </div>
          {feesType === 'paid' && (
            <div className="animate-in fade-in slide-in-from-left duration-200">
              <label htmlFor="feesAmount" className="block text-xs font-semibold text-text-secondary mb-2 uppercase tracking-wider">
                Fee Amount (₹)
              </label>
              <input
                id="feesAmount"
                type="text"
                required
                value={feesAmount}
                onChange={(e) => setFeesAmount(e.target.value)}
                placeholder="e.g., 500"
                className="w-full px-4 py-3 rounded-xl bg-bg-primary border border-border-primary text-text-primary placeholder-text-secondary/40 focus:border-accent-color focus:ring-4 focus:ring-accent-color-glow outline-none transition-all duration-200 text-sm"
              />
            </div>
          )}
        </div>

        {/* Ride Captain / Leader */}
        <div>
          <label htmlFor="leader" className="block text-xs font-semibold text-text-secondary mb-2 uppercase tracking-wider">
            Ride Captain / Leader
          </label>
          <input
            id="leader"
            type="text"
            value={leader}
            onChange={(e) => setLeader(e.target.value)}
            placeholder="Defaults to your profile name"
            className="w-full px-4 py-3 rounded-xl bg-bg-primary border border-border-primary text-text-primary placeholder-text-secondary/40 focus:border-accent-color focus:ring-4 focus:ring-accent-color-glow outline-none transition-all duration-200 text-sm"
          />
        </div>

        {/* Departure Date & Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="date" className="block text-xs font-semibold text-text-secondary mb-2 uppercase tracking-wider">
              Departure Date
            </label>
            <input
              id="date"
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-bg-primary border border-border-primary text-text-primary focus:border-accent-color focus:ring-4 focus:ring-accent-color-glow outline-none transition-all duration-200 text-sm"
            />
          </div>

          <div>
            <label htmlFor="status" className="block text-xs font-semibold text-text-secondary mb-2 uppercase tracking-wider">
              Status
            </label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-bg-primary border border-border-primary text-text-primary focus:border-accent-color focus:ring-4 focus:ring-accent-color-glow outline-none transition-all duration-200 text-sm cursor-pointer"
            >
              <option value="upcoming" className="bg-bg-primary text-emerald-500">Upcoming</option>
              <option value="planned" className="bg-bg-primary text-amber-500">Planned</option>
              <option value="completed" className="bg-bg-primary text-text-secondary">Completed</option>
            </select>
          </div>
        </div>

        {/* Members details list */}
        <div className="pt-2 space-y-4">
          <div className="flex items-center justify-between border-t border-border-primary pt-4">
            <span className="text-xs font-bold text-text-secondary uppercase tracking-wider">
              Members List (Optional)
            </span>
            <button
              type="button"
              onClick={handleAddMember}
              className="text-xs font-semibold text-accent-color hover:text-accent-color-hover transition-colors flex items-center gap-1 bg-accent-color-glow border border-accent-color/20 rounded-lg px-2.5 py-1"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Member
            </button>
          </div>

          {members.length === 0 ? (
            <p className="text-xs text-text-secondary italic">No members added yet.</p>
          ) : (
            <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
              {members.map((member, index) => (
                <div key={index} className="grid grid-cols-1 sm:grid-cols-12 gap-3 p-3 rounded-xl bg-bg-primary border border-border-primary relative group animate-in slide-in-from-top-2 duration-200">
                  <div className="sm:col-span-6">
                    <input
                      type="text"
                      required
                      value={member.name}
                      onChange={(e) => handleMemberChange(index, 'name', e.target.value)}
                      placeholder="Name"
                      className="w-full px-3 py-2 rounded-lg bg-bg-secondary border border-border-primary text-text-primary placeholder-text-secondary/40 focus:border-accent-color focus:ring-2 focus:ring-accent-color-glow outline-none transition-all text-xs"
                    />
                  </div>
                  <div className="sm:col-span-5">
                    <input
                      type="tel"
                      required
                      value={member.phone}
                      onChange={(e) => handleMemberChange(index, 'phone', e.target.value)}
                      placeholder="Phone"
                      className="w-full px-3 py-2 rounded-lg bg-bg-secondary border border-border-primary text-text-primary placeholder-text-secondary/40 focus:border-accent-color focus:ring-2 focus:ring-accent-color-glow outline-none transition-all text-xs"
                    />
                  </div>
                  <div className="sm:col-span-1 flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => handleRemoveMember(index)}
                      className="p-1 rounded bg-bg-secondary hover:bg-red-500/10 border border-border-primary hover:border-red-500/20 text-text-secondary hover:text-red-400 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center animate-pulse">
            {error}
          </div>
        )}

        {success && (
          <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm text-center flex items-center justify-center gap-2">
            <svg className="w-4 h-4 text-emerald-400 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Trip details saved successfully!
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 rounded-xl bg-accent-color hover:bg-accent-color-hover text-white font-semibold shadow-lg shadow-accent-color-glow transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Saving Trip...
            </span>
          ) : (
            'Add Trip'
          )}
        </button>
      </form>
    </div>
  );
}
