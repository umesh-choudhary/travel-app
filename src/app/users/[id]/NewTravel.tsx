'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewTravel({ userId }: { userId: string }) {
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');
  const [status, setStatus] = useState('upcoming');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

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
        body: JSON.stringify({ destination, date, status }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setDestination('');
        setDate('');
        setStatus('upcoming');
        router.refresh();
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
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl shadow-black/30 backdrop-blur-md relative overflow-hidden transition-all duration-300 hover:border-zinc-700/50">
      {/* Decorative gradient blur background */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

      <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
        <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
        </svg>
        Add New Trip
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="destination" className="block text-sm font-medium text-zinc-300 mb-2">
            Destination
          </label>
          <input
            id="destination"
            type="text"
            required
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="e.g., London, UK"
            className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/25 outline-none transition-all"
          />
        </div>

        <div>
          <label htmlFor="date" className="block text-sm font-medium text-zinc-300 mb-2">
            Departure Date
          </label>
          <input
            id="date"
            type="date"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/25 outline-none transition-all [color-scheme:dark]"
          />
        </div>

        <div>
            <label htmlFor='start-date' className="block text-sm font-medium text-zinc-300 mb-2">
                start date
            </label>
            <input type="date" id="start-date"  className="" />
        </div>

        <div>
            <label htmlFor="end-date" className=''>end date</label>
            <input type="date" id="end-date" className='' />
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-medium text-zinc-300 mb-2">
            Status
          </label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/25 outline-none transition-all cursor-pointer"
          >
            <option value="upcoming" className="bg-zinc-900 text-emerald-400">Upcoming</option>
            <option value="planned" className="bg-zinc-900 text-amber-400">Planned</option>
            <option value="completed" className="bg-zinc-900 text-zinc-400">Completed</option>
          </select>
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
          className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 text-white font-medium shadow-lg shadow-indigo-500/20 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-zinc-900 disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-[1px] active:translate-y-0"
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
