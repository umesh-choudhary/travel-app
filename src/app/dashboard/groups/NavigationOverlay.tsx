'use client';

import React from 'react';
import { getInstructionText, renderManeuverIcon } from './maneuverHelpers';

interface NavigationOverlayProps {
  navigationSteps: any[] | null;
  navigationStats: { distance: string; duration: string } | null;
  navigationLoading: boolean;
  availableRoutes: any[] | null;
  activeRouteIndex: number;
  selectRouteIndex: (idx: number) => void;
  onCloseNavigation: () => void;
  onStepClick: (step: any) => void;
}

export default function NavigationOverlay({
  navigationSteps,
  navigationStats,
  navigationLoading,
  availableRoutes,
  activeRouteIndex,
  selectRouteIndex,
  onCloseNavigation,
  onStepClick
}: NavigationOverlayProps) {
  return (
    <div className="absolute bottom-4 left-4 right-4 md:right-auto md:w-80 z-20 bg-bg-secondary/90 border border-border-primary backdrop-blur-md rounded-2xl p-4 shadow-2xl max-h-[450px] flex flex-col animate-in slide-in-from-bottom-5 duration-300">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h4 className="font-bold text-text-primary text-xs tracking-wide uppercase">Navigation</h4>
          {navigationStats && (
            <p className="text-[10px] text-emerald-400 font-bold mt-0.5 uppercase tracking-wider">
              {navigationStats.distance} • {navigationStats.duration}
            </p>
          )}
        </div>
        <button
          onClick={onCloseNavigation}
          className="p-1 rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-tertiary transition-colors border border-border-primary cursor-pointer"
          title="Exit Navigation"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Route Alternatives Selection (Preview / Details) */}
      {availableRoutes && availableRoutes.length > 1 && (
        <div className="mb-3 space-y-1.5 animate-in fade-in duration-200">
          <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider block">Route Options</span>
          <div className="grid grid-cols-2 gap-2">
            {availableRoutes.map((route, rIdx) => {
              const distanceKm = (route.distance / 1000).toFixed(0);
              const hours = Math.floor(route.duration / 3600);
              const minutes = Math.round((route.duration % 3600) / 60);
              const timeStr = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
              const routeLabel = route.routeName || `Option ${rIdx + 1}`;
              const isActive = activeRouteIndex === rIdx;

              return (
                <button
                  key={rIdx}
                  type="button"
                  onClick={() => selectRouteIndex(rIdx)}
                  className={`p-2 rounded-xl text-left border transition-all text-xs cursor-pointer ${
                    isActive
                      ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400 font-semibold shadow-sm'
                      : 'bg-bg-primary border-border-primary text-text-secondary hover:text-text-primary hover:bg-bg-tertiary/50'
                  }`}
                >
                  <p className="font-bold truncate text-[10px]">{routeLabel}</p>
                  <p className="text-[9px] mt-0.5 opacity-80">{timeStr} • {distanceKm} km</p>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {navigationLoading ? (
        <div className="py-8 flex flex-col items-center justify-center gap-2">
          <svg className="animate-spin h-5 w-5 text-accent-color" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span className="text-xs text-text-secondary font-medium">Calculating route...</span>
        </div>
      ) : (
        <div className="overflow-y-auto pr-1.5 flex-1 space-y-3 mt-2 scrollbar-thin max-h-[300px] pb-2">
          {navigationSteps?.map((step, idx) => {
            const modifier = step.maneuver.modifier || '';
            const type = step.maneuver.type || '';
            const instruction = getInstructionText(step);

            return (
              <div 
                key={idx} 
                className="relative flex gap-3.5 p-2 rounded-xl hover:bg-bg-tertiary/60 border border-transparent hover:border-border-primary transition-all duration-200 cursor-pointer group"
                onClick={() => onStepClick(step)}
              >
                {/* Timeline connector line */}
                {idx < navigationSteps.length - 1 && (
                  <div className="absolute left-[18px] top-[30px] bottom-[-18px] w-[1.5px] bg-border-primary group-hover:bg-emerald-500/30 transition-colors" />
                )}

                {renderManeuverIcon(type, modifier)}

                <div className="flex-1 min-w-0">
                  <p className="text-text-primary leading-snug font-semibold text-xs group-hover:text-emerald-400 transition-colors duration-200">
                    {instruction}
                  </p>
                  {step.distance > 0 && (
                    <p className="text-[10px] text-text-secondary mt-0.5 font-bold flex items-center gap-1 opacity-80">
                      <span>📏</span>
                      <span>
                        {step.distance > 1000 
                          ? `${(step.distance / 1000).toFixed(1)} km` 
                          : `${Math.round(step.distance)} m`}
                      </span>
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
