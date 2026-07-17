'use client';

import { useState, useEffect } from 'react';
import { getCityImageUrl, fetchWikiImage } from './cityImageHelper';

interface CardImageSliderProps {
  from: string;
  to: string;
  heightClass?: string;
}

export default function CardImageSlider({ 
  from, 
  to, 
  heightClass = 'h-24' 
}: CardImageSliderProps) {
  const [slideIdx, setSlideIdx] = useState(0);
  const [originImg, setOriginImg] = useState<string>(getCityImageUrl(from, true));
  const [destImg, setDestImg] = useState<string>(getCityImageUrl(to, false));

  useEffect(() => {
    let active = true;
    async function loadImages() {
      const oImg = await fetchWikiImage(from);
      if (oImg && active) setOriginImg(oImg);
      const dImg = await fetchWikiImage(to);
      if (dImg && active) setDestImg(dImg);
    }
    loadImages();
    return () => { active = false; };
  }, [from, to]);

  useEffect(() => {
    const interval = setInterval(() => {
      setSlideIdx((prev) => (prev === 0 ? 1 : 0));
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  const cleanFrom = from.split(',')[0].trim();
  const cleanTo = to.split(',')[0].trim();

  return (
    <div className={`relative ${heightClass} w-full overflow-hidden border-b border-border-primary/50 shrink-0`}>
      {/* Slider track */}
      <div 
        className="flex h-full transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${slideIdx * 100}%)` }}
      >
        {/* Origin */}
        <div className="w-full h-full shrink-0 relative">
          <img 
            src={originImg} 
            alt={cleanFrom} 
            className="w-full h-full object-cover select-none"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-transparent to-transparent" />
          <span className="absolute bottom-1.5 left-3.5 text-[8px] font-bold px-1.5 py-0.5 rounded bg-black/60 text-white/80 uppercase tracking-wider backdrop-blur-sm">
            From: {cleanFrom}
          </span>
        </div>
        {/* Destination */}
        <div className="w-full h-full shrink-0 relative">
          <img 
            src={destImg} 
            alt={cleanTo} 
            className="w-full h-full object-cover select-none"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-transparent to-transparent" />
          <span className="absolute bottom-1.5 left-3.5 text-[8px] font-bold px-1.5 py-0.5 rounded bg-accent-color/90 text-white uppercase tracking-wider shadow-sm shadow-accent-color/30">
            To: {cleanTo}
          </span>
        </div>
      </div>

      {/* Toggle button */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setSlideIdx(slideIdx === 0 ? 1 : 0);
        }}
        className="absolute bottom-1.5 right-3.5 w-4 h-4 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center text-[9px] border border-white/10 shadow cursor-pointer transition-all hover:scale-105 select-none"
        title="Slide Image"
      >
        ⇆
      </button>

      {/* Progress dot pills */}
      <div className="absolute top-1.5 right-3.5 flex gap-1 z-10">
        <span className={`w-1.5 h-1.5 rounded-full transition-all ${slideIdx === 0 ? 'bg-white w-3' : 'bg-white/40'}`} />
        <span className={`w-1.5 h-1.5 rounded-full transition-all ${slideIdx === 1 ? 'bg-white w-3' : 'bg-white/40'}`} />
      </div>
    </div>
  );
}
