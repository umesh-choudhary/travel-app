'use client';

import React from 'react';
import CardImageSlider from './groups/CardImageSlider';

interface Member {
  name: string;
  phone: string;
}

interface TripDetailsModalProps {
  from: string;
  to: string;
  date: string;
  leader: string;
  price: string;
  members: Member[];
  onClose: () => void;
}

export default function TripDetailsModal({
  from,
  to,
  date,
  leader,
  price,
  members,
  onClose,
}: TripDetailsModalProps) {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-bg-secondary border border-border-primary rounded-2xl overflow-hidden shadow-2xl relative max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200">
        
        {/* Ambient background glows */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-accent-color-glow rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-accent-color-glow rounded-full blur-2xl pointer-events-none" />

        {/* Modal Header */}
        <div className="p-6 border-b border-border-primary flex justify-between items-center bg-bg-secondary/50 relative z-10">
          <div>
            <h3 className="text-xl font-bold text-text-primary">Trip Details</h3>
            <p className="text-xs text-text-secondary mt-0.5">Route Information & Registered Passenger Roster</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg border border-border-primary bg-bg-primary hover:bg-bg-tertiary text-text-secondary hover:text-text-primary transition-all cursor-pointer"
            title="Close modal"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal Content Wrapper */}
        <div className="overflow-y-auto flex-1">
          {/* Edge-to-edge Slidable Image Banner */}
          <CardImageSlider from={from} to={to} heightClass="h-48" />

          {/* Core Route Specs and Passengers */}
          <div className="p-6 space-y-6">
            
            {/* Route tags */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-text-primary bg-bg-primary px-3 py-1 rounded-lg border border-border-primary shadow-sm">{from}</span>
              <span className="text-accent-color font-extrabold animate-pulse">➔</span>
              <span className="text-xs font-bold text-accent-color bg-accent-color/10 px-3 py-1 rounded-lg border border-accent-color/20 shadow-sm">{to}</span>
            </div>

            {/* Ride specifications list */}
            <div className="bg-bg-primary/50 border border-border-primary/50 rounded-xl p-4 space-y-3">
              <h4 className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Ride Specifications</h4>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <p className="text-text-secondary font-medium">Driver Captain</p>
                  <p className="text-text-primary font-bold mt-0.5">👤 {leader}</p>
                </div>
                <div>
                  <p className="text-text-secondary font-medium">Departure Date</p>
                  <p className="text-text-primary font-bold mt-0.5">📅 {new Date(date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                </div>
                <div>
                  <p className="text-text-secondary font-medium">Fare Price</p>
                  <p className="text-accent-color font-extrabold mt-0.5">₹ {price}</p>
                </div>
                <div>
                  <p className="text-text-secondary font-medium">Total Passengers</p>
                  <p className="text-text-primary font-bold mt-0.5">👥 {members.length} registered</p>
                </div>
              </div>
            </div>

            {/* Passenger Roster */}
            <div className="space-y-3">
              <h4 className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Registered Passenger Roster</h4>
              {members.length === 0 ? (
                <p className="text-xs text-text-secondary italic text-center py-6 bg-bg-primary/20 border border-dashed border-border-primary/60 rounded-xl">
                  No other passenger members registered yet.
                </p>
              ) : (
                <div className="space-y-2">
                  {members.map((member, mIdx) => (
                    <div
                      key={mIdx}
                      className="flex justify-between items-center text-xs p-3 rounded-xl bg-bg-primary/40 border border-border-primary/30 hover:border-accent-color/20 transition-all"
                    >
                      <span className="text-text-primary font-semibold flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        {member.name}
                      </span>
                      <span className="text-text-secondary font-mono text-[10px]">{member.phone}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
