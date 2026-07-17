import React from 'react';

const formatDirection = (modifier: string): string => {
  const m = modifier.toLowerCase();
  if (m === 'left') return 'left';
  if (m === 'right') return 'right';
  if (m.includes('slight left')) return 'slight left';
  if (m.includes('slight right')) return 'slight right';
  if (m.includes('sharp left')) return 'sharp left';
  if (m.includes('sharp right')) return 'sharp right';
  if (m.includes('straight')) return 'straight';
  return modifier;
};

export const getInstructionText = (step: any): string => {
  if (!step || !step.maneuver) return 'Continue driving';
  const { type, modifier } = step.maneuver;
  const name = step.name || '';

  const roadLabel = name ? `onto ${name}` : 'on road';

  if (type === 'depart') {
    return `Depart from starting point ${roadLabel}`;
  }
  if (type === 'arrive') {
    return `Arrive at destination ${roadLabel}`;
  }
  if (type === 'merge') {
    return `Merge ${roadLabel}`;
  }
  if (type === 'fork') {
    return `Take the fork ${formatDirection(modifier)} ${roadLabel}`;
  }
  if (type === 'roundabout') {
    return `At the roundabout, take exit ${step.maneuver.exit || '1'} ${roadLabel}`;
  }
  if (type === 'turn') {
    return `Turn ${formatDirection(modifier)} ${roadLabel}`;
  }
  if (type === 'new name' || type === 'continue') {
    return `Continue ${roadLabel}`;
  }

  if (modifier) {
    return `Turn ${formatDirection(modifier)} ${roadLabel}`;
  }
  return name ? `Continue onto ${name}` : 'Continue on road';
};

export const renderManeuverIcon = (type: string, modifier: string) => {
  const mod = modifier || '';
  const t = type || '';

  if (t === 'depart') {
    return (
      <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30 text-[10px] select-none shadow-sm">
        📍
      </span>
    );
  }
  if (t === 'arrive') {
    return (
      <span className="w-5 h-5 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0 border border-rose-500/30 text-[10px] select-none shadow-sm animate-bounce">
        🏁
      </span>
    );
  }

  // Determine rotation based on turn modifier
  let rotation = 'rotate-0';
  if (mod.includes('slight right')) {
    rotation = 'rotate-45';
  } else if (mod.includes('slight left')) {
    rotation = '-rotate-45';
  } else if (mod.includes('sharp right')) {
    rotation = 'rotate-90';
  } else if (mod.includes('sharp left')) {
    rotation = '-rotate-90';
  } else if (mod.includes('right')) {
    rotation = 'rotate-90';
  } else if (mod.includes('left')) {
    rotation = '-rotate-90';
  } else if (mod.includes('uturn')) {
    rotation = 'rotate-180';
  }

  if (t === 'turn' || t === 'fork' || t === 'merge' || t === 'continue' || t === 'new name') {
    return (
      <span className={`w-5 h-5 rounded-lg bg-bg-primary text-text-secondary group-hover:text-emerald-400 group-hover:bg-emerald-500/10 group-hover:border-emerald-500/30 flex items-center justify-center shrink-0 border border-border-primary transition-all duration-200 shadow-sm ${rotation}`}>
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </span>
    );
  }
  if (t === 'roundabout') {
    return (
      <span className="w-5 h-5 rounded-lg bg-bg-primary text-text-secondary group-hover:text-emerald-400 group-hover:bg-emerald-500/10 group-hover:border-emerald-500/30 flex items-center justify-center shrink-0 border border-border-primary transition-all duration-200 shadow-sm select-none text-[10px]">
        🔄
      </span>
    );
  }
  return (
    <span className="w-5 h-5 rounded-lg bg-bg-primary text-text-secondary group-hover:text-emerald-400 group-hover:bg-emerald-500/10 group-hover:border-emerald-500/30 flex items-center justify-center shrink-0 border border-border-primary transition-all duration-200 shadow-sm">
      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 10l7-7m0 0l7 7m-7-7v18" />
      </svg>
    </span>
  );
};
