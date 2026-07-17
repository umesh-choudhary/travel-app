'use client';

import React from 'react';

const parsePlace = (displayName: string) => {
  const parts = displayName.split(',');
  const main = parts[0]?.trim() || '';
  const sub = parts.slice(1).join(',').trim();
  return { main, sub };
};

interface SearchRoutesFormProps {
  fromQuery: string;
  toQuery: string;
  loading: boolean;
  onFromChange: (val: string) => void;
  onToChange: (val: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  fromSuggestions: string[];
  toSuggestions: string[];
  showFromSuggestions: boolean;
  showToSuggestions: boolean;
  setShowFromSuggestions: (val: boolean) => void;
  setShowToSuggestions: (val: boolean) => void;
  setFromQuery: (val: string) => void;
  setToQuery: (val: string) => void;
}

export default function SearchRoutesForm({
  fromQuery,
  toQuery,
  loading,
  onFromChange,
  onToChange,
  onSubmit,
  fromSuggestions,
  toSuggestions,
  showFromSuggestions,
  showToSuggestions,
  setShowFromSuggestions,
  setShowToSuggestions,
  setFromQuery,
  setToQuery
}: SearchRoutesFormProps) {
  return (
    <div className="bg-bg-secondary border border-border-primary rounded-2xl p-6 shadow-xl relative">
      <div className="absolute top-0 right-0 w-24 h-24 bg-accent-color-glow rounded-full blur-xl pointer-events-none" />
      <h2 className="text-lg font-medium text-text-primary mb-4">Search Routes</h2>
      <form onSubmit={onSubmit} className="space-y-4">
        {/* From Field */}
        <div className="relative">
          <label className="block text-xs font-medium text-text-secondary mb-1.5 uppercase tracking-wider">From Destination</label>
          <input
            id="from-input"
            type="text"
            required
            value={fromQuery}
            onChange={(e) => onFromChange(e.target.value)}
            onFocus={() => setShowFromSuggestions(true)}
            onBlur={() => setTimeout(() => setShowFromSuggestions(false), 200)}
            placeholder="e.g. Gujarat or Ahmedabad"
            autoComplete="off"
            className="w-full px-4 py-2.5 rounded-xl bg-bg-primary border border-border-primary text-text-primary placeholder-text-secondary/40 focus:border-accent-color focus:ring-1 focus:ring-accent-color outline-none text-sm transition-all"
          />
          {showFromSuggestions && fromSuggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 z-50 mt-1 max-h-60 overflow-y-auto rounded-xl bg-bg-secondary border border-border-primary shadow-xl divide-y divide-border-primary/50">
              {fromSuggestions.map((suggestion) => {
                const { main, sub } = parsePlace(suggestion);
                return (
                  <button
                    key={suggestion}
                    type="button"
                    onMouseDown={() => {
                      setFromQuery(suggestion);
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

        {/* To Field */}
        <div className="relative">
          <label className="block text-xs font-medium text-text-secondary mb-1.5 uppercase tracking-wider">To Destination</label>
          <input
            type="text"
            required
            value={toQuery}
            onChange={(e) => onToChange(e.target.value)}
            onFocus={() => setShowToSuggestions(true)}
            onBlur={() => setTimeout(() => setShowToSuggestions(false), 200)}
            placeholder="e.g. Pune"
            autoComplete="off"
            className="w-full px-4 py-2.5 rounded-xl bg-bg-primary border border-border-primary text-text-primary placeholder-text-secondary/40 focus:border-accent-color focus:ring-1 focus:ring-accent-color outline-none text-sm transition-all"
          />
          {showToSuggestions && toSuggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 z-50 mt-1 max-h-60 overflow-y-auto rounded-xl bg-bg-secondary border border-border-primary shadow-xl divide-y divide-border-primary/50">
              {toSuggestions.map((suggestion) => {
                const { main, sub } = parsePlace(suggestion);
                return (
                  <button
                    key={suggestion}
                    type="button"
                    onMouseDown={() => {
                      setToQuery(suggestion);
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

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 rounded-xl bg-accent-color hover:bg-accent-color-hover text-white font-medium text-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
        >
          {loading ? (
            <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          ) : (
            'Search Groups'
          )}
        </button>
      </form>
    </div>
  );
}
