import React, { useState, useEffect } from 'react';
import { TravelGroup } from './types';
import { getCityImageUrl } from './cityImageHelper';

interface BookingJoinModalProps {
  selectedGroup: TravelGroup;
  currentUserId: string | null;
  joinName: string;
  setJoinName: (val: string) => void;
  joinPhone: string;
  setJoinPhone: (val: string) => void;
  paymentMode: 'upi' | 'card';
  setPaymentMode: (mode: 'upi' | 'card') => void;
  upiId: string;
  setUpiId: (val: string) => void;
  cardNumber: string;
  setCardNumber: (val: string) => void;
  cardExpiry: string;
  setCardExpiry: (val: string) => void;
  cardCvv: string;
  setCardCvv: (val: string) => void;
  joinLoading: boolean;
  joinSuccess: boolean;
  joinError: string;
  isAlreadyJoined: (group: TravelGroup) => boolean;
  modalOriginImg: string;
  modalDestImg: string;
  onFocusGroup: (group: TravelGroup) => void;
  onClose: () => void;
  onSubmitJoin: (e: React.FormEvent) => void;
}

const getDirectionsUrl = (group: TravelGroup) => {
  return `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(group.origin)}&destination=${encodeURIComponent(group.destination)}`;
};

export default function BookingJoinModal({
  selectedGroup,
  currentUserId,
  joinName,
  setJoinName,
  joinPhone,
  setJoinPhone,
  paymentMode,
  setPaymentMode,
  upiId,
  setUpiId,
  cardNumber,
  setCardNumber,
  cardExpiry,
  setCardExpiry,
  cardCvv,
  setCardCvv,
  joinLoading,
  joinSuccess,
  joinError,
  isAlreadyJoined,
  modalOriginImg,
  modalDestImg,
  onFocusGroup,
  onClose,
  onSubmitJoin
}: BookingJoinModalProps) {
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlideIndex((prev) => (prev === 0 ? 1 : 0));
    }, 3500);
    return () => clearInterval(interval);
  }, []);
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-bg-secondary border border-border-primary rounded-2xl overflow-hidden shadow-[0_0_50px_-12px_rgba(99,102,241,0.25)] relative max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200">
        {/* Ambient background glows */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-accent-color-glow rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-accent-color-glow rounded-full blur-2xl pointer-events-none" />

        {/* Modal Header */}
        <div className="p-6 border-b border-border-primary flex justify-between items-start bg-bg-secondary/50">
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-text-primary mb-0.5">{selectedGroup.name}</h3>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
              <p className="text-xs text-text-secondary flex items-center gap-1.5">
                <span className="text-accent-color font-semibold">Route:</span>
                <span>{selectedGroup.origin} → {selectedGroup.destination}</span>
              </p>
              <button
                type="button"
                onClick={() => onFocusGroup(selectedGroup)}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-accent-color/10 hover:bg-accent-color text-accent-color hover:text-white border border-accent-color/20 hover:border-transparent transition-all duration-200 font-semibold text-[10px] shadow-sm hover:shadow-[0_0_12px_rgba(99,102,241,0.4)] cursor-pointer"
                title="Focus this route on the page map"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span>Show on Map</span>
              </button>
              <a
                href={getDirectionsUrl(selectedGroup)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-bg-tertiary hover:bg-bg-primary text-text-secondary hover:text-text-primary border border-border-primary transition-all duration-200 font-semibold text-[10px] cursor-pointer"
                title="Open turn-by-turn navigation in Google Maps"
              >
                🧭 Google Maps
              </a>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-tertiary transition-colors border border-border-primary cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal Image Slider */}
        <div className="relative h-48 w-full bg-bg-primary overflow-hidden border-b border-border-primary shrink-0">
          <div 
            className="flex h-full transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${activeSlideIndex * 100}%)` }}
          >
            {/* Origin Slide */}
            <div className="w-full h-full shrink-0 relative">
              <img 
                src={modalOriginImg || getCityImageUrl(selectedGroup.origin, true)} 
                alt={selectedGroup.origin}
                className="w-full h-full object-cover select-none"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-4 left-6 space-y-0.5">
                <span className="text-[10px] font-bold text-accent-color uppercase tracking-wider bg-accent-color/10 px-2 py-0.5 rounded-md border border-accent-color/20 backdrop-blur-sm">Origin</span>
                <h4 className="text-lg font-bold text-white leading-tight">{selectedGroup.origin}</h4>
              </div>
            </div>

            {/* Destination Slide */}
            <div className="w-full h-full shrink-0 relative">
              <img 
                src={modalDestImg || getCityImageUrl(selectedGroup.destination, false)} 
                alt={selectedGroup.destination}
                className="w-full h-full object-cover select-none"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-4 left-6 space-y-0.5">
                <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider bg-cyan-400/10 px-2 py-0.5 rounded-md border border-cyan-400/20 backdrop-blur-sm">Destination</span>
                <h4 className="text-lg font-bold text-white leading-tight">{selectedGroup.destination}</h4>
              </div>
            </div>
          </div>

          {/* Left Arrow Button */}
          <button
            type="button"
            onClick={() => setActiveSlideIndex(0)}
            className={`absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 border border-white/10 flex items-center justify-center text-white transition-all cursor-pointer z-10 ${
              activeSlideIndex === 0 ? 'opacity-0 pointer-events-none' : 'opacity-100'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Right Arrow Button */}
          <button
            type="button"
            onClick={() => setActiveSlideIndex(1)}
            className={`absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 border border-white/10 flex items-center justify-center text-white transition-all cursor-pointer z-10 ${
              activeSlideIndex === 1 ? 'opacity-0 pointer-events-none' : 'opacity-100'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Slide Indicators */}
          <div className="absolute bottom-4 right-6 flex gap-1.5 z-10">
            <button 
              type="button"
              onClick={() => setActiveSlideIndex(0)}
              className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                activeSlideIndex === 0 ? 'bg-accent-color w-4' : 'bg-white/40 hover:bg-white/60'
              }`}
            />
            <button 
              type="button"
              onClick={() => setActiveSlideIndex(1)}
              className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                activeSlideIndex === 1 ? 'bg-accent-color w-4' : 'bg-white/40 hover:bg-white/60'
              }`}
            />
          </div>
        </div>

        {/* Modal Content Scroll Area */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Left Side: Ride Details & Active Roster */}
            <div className="space-y-4">
              <div className="bg-bg-primary p-4 rounded-xl border border-border-primary space-y-3 text-sm">
                <h4 className="font-semibold text-text-primary text-xs uppercase tracking-wider">Ride Specifications</h4>
                <p className="flex justify-between">
                  <span className="text-text-secondary">Departure Date:</span>
                  <span className="text-text-primary">{new Date(selectedGroup.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-text-secondary">Leader/Driver:</span>
                  <span className="text-text-primary font-medium">{selectedGroup.driverName}</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-text-secondary">Fees Charge:</span>
                  <span className="text-accent-color font-bold">{selectedGroup.price}</span>
                </p>
              </div>

              <div className="bg-bg-primary p-4 rounded-xl border border-border-primary space-y-3">
                <h4 className="font-semibold text-text-primary text-xs uppercase tracking-wider">
                  Active Members ({selectedGroup.membersCount})
                </h4>
                {(!selectedGroup.membersList || selectedGroup.membersList.length === 0) ? (
                  <p className="text-xs text-text-secondary italic">No members yet. Be the first to join this ride!</p>
                ) : (
                  <div className="space-y-2 max-h-[150px] overflow-y-auto pr-1">
                    {selectedGroup.membersList.map((m, idx) => (
                      <div key={idx} className="flex justify-between items-center text-xs p-2 rounded bg-bg-secondary/60 border border-border-primary/40">
                        <span className="text-text-primary font-medium">{m.name}</span>
                        <span className="text-text-secondary">{m.phone}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right Side: Join Form & Simulated Payments */}
            <div className="space-y-4">
              {selectedGroup.creatorUserId === currentUserId ? (
                <div className="bg-accent-color-glow border border-accent-color/20 text-accent-color p-6 rounded-xl text-center space-y-3 animate-in zoom-in-95 duration-200">
                  <div className="w-12 h-12 rounded-full bg-accent-color-glow flex items-center justify-center mx-auto text-accent-color">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h4 className="font-bold text-lg text-text-primary">Your Travel Group</h4>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    You are the creator and leader of this group. You cannot join your own ride. Other travelers can find and join it from their dashboard.
                  </p>
                </div>
              ) : (joinSuccess || isAlreadyJoined(selectedGroup)) ? (
                <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 p-6 rounded-xl text-center space-y-3 animate-in zoom-in-95 duration-200">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto text-emerald-500 animate-bounce">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h4 className="font-bold text-lg text-text-primary">Joined Successfully!</h4>
                  <p className="text-xs text-text-secondary">Your seat has been reserved. Check details on the left.</p>
                  <button
                    type="button"
                    onClick={onClose}
                    className="mt-2 px-4 py-1.5 bg-bg-tertiary hover:bg-bg-primary text-text-primary rounded-lg text-xs font-semibold border border-border-primary cursor-pointer"
                  >
                    Close Window
                  </button>
                </div>
              ) : (
                <form onSubmit={onSubmitJoin} className="space-y-4">
                  <h4 className="font-semibold text-text-primary text-xs uppercase tracking-wider">Reserve a Seat</h4>
                  
                  <div>
                    <label className="block text-[10px] font-semibold text-text-secondary mb-1.5 uppercase">Your Full Name</label>
                    <input
                      type="text"
                      required
                      value={joinName}
                      onChange={(e) => setJoinName(e.target.value)}
                      placeholder="e.g. Ramesh Kumar"
                      className="w-full px-3 py-2 rounded-lg bg-bg-primary border border-border-primary text-text-primary placeholder-text-secondary/40 focus:border-accent-color outline-none text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold text-text-secondary mb-1.5 uppercase">Phone Number</label>
                    <input
                      type="tel"
                      required
                      value={joinPhone}
                      onChange={(e) => setJoinPhone(e.target.value)}
                      placeholder="e.g. 9876543210"
                      className="w-full px-3 py-2 rounded-lg bg-bg-primary border border-border-primary text-text-primary placeholder-text-secondary/40 focus:border-accent-color outline-none text-xs"
                    />
                  </div>

                  {/* Payment Section (Rendered only if paid trip) */}
                  {selectedGroup.price !== 'Free' && (
                    <div className="bg-bg-primary p-3 rounded-xl border border-border-primary space-y-3 animate-in fade-in duration-200">
                      <label className="block text-[10px] font-bold text-accent-color uppercase">Simulated Payment Checkout</label>
                      <div className="flex gap-4">
                        <label className="flex items-center gap-2 text-xs text-text-primary cursor-pointer">
                          <input
                            type="radio"
                            checked={paymentMode === 'upi'}
                            onChange={() => setPaymentMode('upi')}
                            className="accent-accent-color"
                          />
                          UPI
                        </label>
                        <label className="flex items-center gap-2 text-xs text-text-primary cursor-pointer">
                          <input
                            type="radio"
                            checked={paymentMode === 'card'}
                            onChange={() => setPaymentMode('card')}
                            className="accent-accent-color"
                          />
                          Credit/Debit Card
                        </label>
                      </div>

                      {paymentMode === 'upi' ? (
                        <input
                          type="text"
                          required
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          placeholder="e.g. name@upi"
                          className="w-full px-3 py-2 rounded-lg bg-bg-primary border border-border-primary text-text-primary placeholder-text-secondary/40 focus:border-accent-color outline-none text-xs"
                        />
                      ) : (
                        <div className="space-y-2">
                          <input
                            type="text"
                            required
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value)}
                            placeholder="Card Number (16-digits)"
                            className="w-full px-3 py-2 rounded-lg bg-bg-primary border border-border-primary text-text-primary placeholder-text-secondary/40 focus:border-accent-color outline-none text-xs"
                          />
                          <div className="grid grid-cols-2 gap-2">
                            <input
                              type="text"
                              required
                              value={cardExpiry}
                              onChange={(e) => setCardExpiry(e.target.value)}
                              placeholder="MM/YY"
                              className="w-full px-3 py-2 rounded-lg bg-bg-primary border border-border-primary text-text-primary placeholder-text-secondary/40 focus:border-accent-color outline-none text-xs"
                            />
                            <input
                              type="text"
                              required
                              value={cardCvv}
                              onChange={(e) => setCardCvv(e.target.value)}
                              placeholder="CVV"
                              className="w-full px-3 py-2 rounded-lg bg-bg-primary border border-border-primary text-text-primary placeholder-text-secondary/40 focus:border-accent-color outline-none text-xs"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {joinError && (
                    <p className="text-red-400 text-xs text-center font-medium animate-pulse">{joinError}</p>
                  )}

                  <button
                    type="submit"
                    disabled={joinLoading}
                    className="w-full py-2.5 rounded-xl bg-accent-color hover:bg-accent-color-hover text-white font-semibold text-xs shadow-md transition-all disabled:opacity-50 flex items-center justify-center gap-2 hover:scale-[1.01] cursor-pointer"
                  >
                    {joinLoading ? (
                      <span className="flex items-center gap-1.5">
                        <svg className="animate-spin h-4.5 w-4.5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        {selectedGroup.price !== 'Free' ? 'Processing Payment...' : 'Registering...'}
                      </span>
                    ) : selectedGroup.price !== 'Free' ? (
                      `Pay ${selectedGroup.price} & Join Group`
                    ) : (
                      'Join Travel Group'
                    )}
                  </button>
                </form>
              )}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
