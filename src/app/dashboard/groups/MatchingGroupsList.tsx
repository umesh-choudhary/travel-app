'use client';

import React from 'react';
import { TravelGroup } from './types';
import CardImageSlider from './CardImageSlider';

interface MatchingGroupsListProps {
  groups: TravelGroup[];
  searched: boolean;
  focusedGroupId: string | null;
  currentUserId: string | null;
  onFocusGroup: (group: TravelGroup) => void;
  openJoinModal: (group: TravelGroup) => void;
  isAlreadyJoined: (group: TravelGroup) => boolean;
}

export default function MatchingGroupsList({
  groups,
  searched,
  focusedGroupId,
  currentUserId,
  onFocusGroup,
  openJoinModal,
  isAlreadyJoined
}: MatchingGroupsListProps) {
  return (
    <div className="bg-bg-secondary border border-border-primary rounded-2xl overflow-hidden shadow-xl">
      <div className="px-6 py-4 border-b border-border-primary bg-bg-secondary/50">
        <h3 className="text-sm font-medium text-text-primary">Matching Travel Groups ({groups.length})</h3>
      </div>
      <div className="divide-y divide-border-primary max-h-[400px] overflow-y-auto">
        {groups.length === 0 ? (
          <div className="p-8 text-center text-text-secondary text-sm">
            {searched ? 'No travel groups found for this route.' : 'Enter route endpoints above to search.'}
          </div>
        ) : (
          groups.map((group) => (
            <div 
              key={group.id} 
              className="hover:bg-bg-tertiary/10 transition-colors cursor-pointer overflow-hidden flex flex-col"
              onClick={() => openJoinModal(group)}
            >
              <CardImageSlider from={group.origin} to={group.destination} />
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-text-primary text-sm leading-snug">{group.name}</h4>
                  <span className="text-xs font-semibold text-accent-color shrink-0">{group.price}</span>
                </div>
                <div className="space-y-1 text-xs text-text-secondary mb-3">
                  <p className="flex items-center gap-2 flex-wrap">
                    <span>Route: {group.origin} → {group.destination}</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onFocusGroup(group);
                      }}
                      className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded transition-all text-[9px] font-semibold cursor-pointer ${
                        focusedGroupId === group.id
                          ? 'bg-emerald-500 border border-emerald-400 text-white animate-pulse'
                          : 'bg-accent-color/10 hover:bg-accent-color text-accent-color hover:text-white border border-accent-color/10 hover:border-transparent'
                      }`}
                      title="Focus this route on the map"
                    >
                      🧭 Map
                    </button>
                  </p>
                  <p>Date: {new Date(group.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                  <p>Leader: {group.driverName}</p>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] bg-accent-color-glow border border-accent-color/20 text-accent-color px-2 py-0.5 rounded-full font-medium">
                    {group.membersCount} members active
                  </span>
                  {group.creatorUserId === currentUserId ? (
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        openJoinModal(group);
                      }}
                      className="text-xs px-3 py-1 bg-bg-tertiary hover:bg-bg-primary text-text-secondary hover:text-text-primary rounded-lg transition-colors border border-border-primary cursor-pointer"
                    >
                      Details
                    </button>
                  ) : isAlreadyJoined(group) ? (
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        openJoinModal(group);
                      }}
                      className="text-xs px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-lg font-medium transition-all cursor-pointer"
                    >
                      Joined
                    </button>
                  ) : (
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        openJoinModal(group);
                      }}
                      className="text-xs px-3 py-1 bg-bg-tertiary hover:bg-accent-color hover:text-white rounded-lg transition-colors border border-border-primary hover:border-accent-color cursor-pointer"
                    >
                      Join Group
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
