export const CITY_IMAGES: Record<string, string> = {
  ahmedabad: 'https://images.unsplash.com/photo-1603258797960-934bd04183d2?auto=format&fit=crop&w=800&q=80',
  gujarat: 'https://images.unsplash.com/photo-1599830806140-580bbd9c7333?auto=format&fit=crop&w=800&q=80',
  gujurat: 'https://images.unsplash.com/photo-1599830806140-580bbd9c7333?auto=format&fit=crop&w=800&q=80',
  pune: 'https://images.unsplash.com/photo-1601932371988-7ab1354bb5ff?auto=format&fit=crop&w=800&q=80',
  kolkata: 'https://images.unsplash.com/photo-1558431382-27e303142255?auto=format&fit=crop&w=800&q=80',
  delhi: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=800&q=80',
  new_delhi: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=800&q=80',
  noida: 'https://images.unsplash.com/photo-1595954421407-ad5e012b25e5?auto=format&fit=crop&w=800&q=80',
  mumbai: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=800&q=80',
  jaipur: 'https://images.unsplash.com/photo-1477584305359-0d39b85a0659?auto=format&fit=crop&w=800&q=80',
  new_york: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=800&q=80',
  default_origin: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
  default_dest: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80'
};

export const getCityImageUrl = (cityName: string, isOrigin: boolean): string => {
  const clean = cityName.trim().toLowerCase();
  
  if (clean.includes('ahmedabad')) return CITY_IMAGES.ahmedabad;
  if (clean.includes('gujarat') || clean.includes('gujurat')) return CITY_IMAGES.gujarat;
  if (clean.includes('pune')) return CITY_IMAGES.pune;
  if (clean.includes('kolkata')) return CITY_IMAGES.kolkata;
  if (clean.includes('new delhi') || clean.includes('delhi')) return CITY_IMAGES.delhi;
  if (clean.includes('noida')) return CITY_IMAGES.noida;
  if (clean.includes('mumbai')) return CITY_IMAGES.mumbai;
  if (clean.includes('jaipur')) return CITY_IMAGES.jaipur;
  if (clean.includes('new york') || clean.includes('york')) return CITY_IMAGES.new_york;
  
  return isOrigin ? CITY_IMAGES.default_origin : CITY_IMAGES.default_dest;
};

const imageCache: Record<string, string> = {};

export async function fetchWikiImage(cityName: string): Promise<string | null> {
  const clean = cityName.trim().split(',')[0].trim();
  if (!clean) return null;
  const cacheKey = clean.toLowerCase();
  if (imageCache[cacheKey]) return imageCache[cacheKey];

  try {
    const formatted = clean
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join('_');
      
    const res = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(formatted)}`);
    if (!res.ok) return null;
    const data = await res.json();
    if (data.originalimage && data.originalimage.source) {
      imageCache[cacheKey] = data.originalimage.source;
      return data.originalimage.source;
    }
  } catch (err) {
    console.error('Error fetching wiki image for', clean, err);
  }
  return null;
}
