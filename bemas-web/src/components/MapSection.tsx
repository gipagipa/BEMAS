import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { 
  MapPin, 
  Navigation, 
  Search, 
  Star, 
  Clock, 
  Bookmark, 
  BookmarkCheck, 
  ExternalLink, 
  CheckCircle2, 
  Utensils,
  Share2
} from 'lucide-react';
import { CulinaryPlace } from '../types';
import { storage } from '../services/storage';

interface MapSectionProps {
  onGoToRecipe: () => void;
}

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

export const MapSection: React.FC<MapSectionProps> = ({ onGoToRecipe }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  
  // Balikpapan default center coordinates: -1.1519, 116.8617 (ITK Area)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number }>({
    lat: -1.1519,
    lng: 116.8617
  });
  const [places, setPlaces] = useState<CulinaryPlace[]>(storage.getPlaces());
  const [selectedPlace, setSelectedPlace] = useState<CulinaryPlace | null>(null);
  const [favoritePlaceIds, setFavoritePlaceIds] = useState<string[]>(storage.getFavoritePlaceIds());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current).setView([userLocation.lat, userLocation.lng], 13);
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    // User GPS pulsing pin
    const userIcon = L.divIcon({
      html: `
        <div class="relative flex items-center justify-center w-8 h-8">
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
          <span class="relative inline-flex rounded-full h-5 w-5 bg-blue-600 border-2 border-white shadow-md"></span>
        </div>
      `,
      className: 'user-gps-marker',
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });

    const userMarker = L.marker([userLocation.lat, userLocation.lng], { icon: userIcon })
      .addTo(map)
      .bindPopup('<b>Lokasi Anda</b><br/>Posisi Anda saat ini (Balikpapan).');
    markersRef.current.push(userMarker);

    // Filtered culinary places pins
    const filtered = getFilteredPlaces();
    filtered.forEach(place => {
      const placeIcon = L.divIcon({
        html: `
          <div class="flex items-center justify-center w-9 h-9 rounded-full bg-[#FF5722] text-white shadow-lg border-2 border-white hover:scale-110 transition-transform cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/></svg>
          </div>
        `,
        className: 'custom-culinary-pin',
        iconSize: [36, 36],
        iconAnchor: [18, 36]
      });

      const dist = calculateDistance(userLocation.lat, userLocation.lng, place.lat, place.lng);

      const marker = L.marker([place.lat, place.lng], { icon: placeIcon })
        .addTo(map)
        .bindPopup(`
          <div style="font-family: inherit; font-size: 13px; max-width: 230px;">
            <b style="font-size: 14px; color: #1E1715;">${place.name}</b>
            <div style="color: #FF5722; font-size: 12px; margin-top: 2px;">★ ${place.rating} (${place.reviewsCount} ulasan) • ${dist} km</div>
            <div style="color: #786C68; font-size: 11px; margin-top: 4px;">${place.address}</div>
            <div style="margin-top: 6px; font-weight: 600; color: #FF5722;">Menu: ${place.featuredMenu}</div>
          </div>
        `);

      marker.on('click', () => {
        setSelectedPlace(place);
      });

      markersRef.current.push(marker);
    });
  }, [userLocation, places, searchQuery, selectedCategory]);

  const requestGpsLocation = () => {
    if (navigator.geolocation) {
      showToast('Mencari koordinat GPS perangkat Anda...');
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const newPos = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setUserLocation(newPos);
          if (mapInstanceRef.current) {
            mapInstanceRef.current.flyTo([newPos.lat, newPos.lng], 14, { duration: 1.5 });
          }
          showToast('Lokasi GPS berhasil diperbarui!');
        },
        () => {
          showToast('GPS tidak diizinkan, menggunakan titik default Balikpapan (ITK).');
        }
      );
    } else {
      alert('Browser tidak mendukung GPS geolokasi.');
    }
  };

  const handleToggleFavoritePlace = (place: CulinaryPlace) => {
    const isAdded = storage.toggleFavoritePlace(place.id);
    setFavoritePlaceIds(storage.getFavoritePlaceIds());
    if (isAdded) {
      showToast(`Tempat "${place.name}" berhasil disimpan ke Favorit!`);
    } else {
      showToast(`Tempat "${place.name}" dihapus dari Favorit.`);
    }
  };

  const getFilteredPlaces = () => {
    return places.filter(place => {
      const matchQuery = place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        place.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        place.featuredMenu.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCat = selectedCategory === 'Semua' || place.category === selectedCategory;
      return matchQuery && matchCat;
    });
  };

  const focusOnPlace = (place: CulinaryPlace) => {
    setSelectedPlace(place);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([place.lat, place.lng], 15, { duration: 1.2 });
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const categories = [
    'Semua', 
    'Warung Makan', 
    'Cafe', 
    'Restoran', 
    'Bakso & Mie', 
    'Street Food'
  ];
  const filteredPlaces = getFilteredPlaces();

  return (
    <div className="space-y-6 pb-16">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1E1715] text-white text-xs px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Breadcrumbs (Figma Exact) */}
      <div className="flex items-center gap-2 text-xs text-[#786C68] font-medium">
        <span>Beranda</span>
        <span className="text-[10px] text-[#786C68]">›</span>
        <span className="text-[#FF5722] font-semibold">Kuliner (Peta GIS)</span>
      </div>

      {/* Header Bar */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F0E5E1] shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFEBE6] text-[#FF5722] text-xs font-bold mb-2">
            <MapPin className="w-3.5 h-3.5" />
            <span>Peta Interaktif GIS (UC-04)</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#1E1715]">
            Eksplorasi Tempat Kuliner Sekitarmu
          </h2>
          <p className="text-xs sm:text-sm text-[#786C68] mt-1">
            Temukan tempat makan di sekitar Balikpapan dan kampus ITK dengan navigasi rute otomatis.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={requestGpsLocation}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-[#FF5722] hover:bg-[#E64A19] text-white text-xs font-bold transition shadow-xs"
          >
            <Navigation className="w-4 h-4" />
            <span>Gunakan GPS Saya</span>
          </button>
          
          <button
            onClick={onGoToRecipe}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-[#FFF1ED] hover:bg-[#FFE0D6] border border-[#FFD8CF] text-[#FF5722] text-xs font-bold transition"
          >
            <Utensils className="w-4 h-4" />
            <span>Mau Masak Saja</span>
          </button>
        </div>
      </div>

      {/* Search & Category Filter Chips */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#786C68] absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari soto, kepiting, bakso, cafe..."
            className="w-full pl-9 pr-4 py-2 rounded-2xl border border-[#F0E5E1] text-xs bg-white focus:outline-hidden focus:border-[#FF5722]"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full pb-1 sm:pb-0 no-scrollbar">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`text-xs px-4 py-2 rounded-full font-bold whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-[#FF5722] text-white shadow-2xs'
                  : 'bg-white text-[#786C68] border border-[#F0E5E1] hover:text-[#1E1715] hover:bg-orange-50/50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Map & Places */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Leaflet Map Box (7 Cols) */}
        <div className="lg:col-span-7 bg-white p-3 rounded-3xl border border-[#F0E5E1] shadow-2xs flex flex-col h-[540px]">
          <div className="flex items-center justify-between px-3 py-2 text-xs text-[#786C68] border-b border-[#F0E5E1] mb-2">
            <span className="flex items-center gap-2 font-bold text-[#1E1715]">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Peta GIS OpenStreetMap Aktif
            </span>
            <span className="text-[11px] bg-[#FFF8F6] px-2.5 py-1 rounded-full border border-[#F0E5E1]">
              {filteredPlaces.length} Tempat Terpetakan
            </span>
          </div>

          <div className="flex-1 w-full rounded-2xl overflow-hidden relative">
            <div ref={mapContainerRef} className="w-full h-full" />
          </div>
        </div>

        {/* Places List (5 Cols) */}
        <div className="lg:col-span-5 space-y-4 max-h-[540px] overflow-y-auto pr-1 no-scrollbar">
          {/* Selected Place Card Highlight */}
          {selectedPlace && (
            <div className="bg-[#FFF4F0] border border-[#FFD8CF] rounded-3xl p-5 shadow-2xs">
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-[#FFEBE6] text-[#FF5722]">
                  Lokasi Terpilih
                </span>
                <button
                  onClick={() => setSelectedPlace(null)}
                  className="text-xs text-[#786C68] hover:text-[#FF5722] font-bold"
                >
                  Tutup ✕
                </button>
              </div>

              <h3 className="font-extrabold text-[#1E1715] text-base">{selectedPlace.name}</h3>
              <p className="text-xs text-[#786C68] mt-1">{selectedPlace.address}</p>
              
              <div className="mt-3 p-3 rounded-2xl bg-white border border-[#FFD8CF] text-xs">
                <p className="font-bold text-[#FF5722] mb-0.5">Menu Unggulan Rekomendasi:</p>
                <p className="text-[#1E1715] font-medium">{selectedPlace.featuredMenu}</p>
              </div>

              <div className="mt-3 flex items-center justify-between pt-2 border-t border-[#FFD8CF]/60">
                <span className="text-xs font-bold text-[#1E1715]">
                  Jarak: {calculateDistance(userLocation.lat, userLocation.lng, selectedPlace.lat, selectedPlace.lng)} km
                </span>
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${selectedPlace.lat},${selectedPlace.lng}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#FF5722] hover:underline"
                >
                  Rute Google Maps <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          )}

          {/* Place Cards */}
          {filteredPlaces.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 text-center text-[#786C68] border border-[#F0E5E1]">
              Tidak ada kuliner yang cocok dengan kata kunci "{searchQuery}".
            </div>
          ) : (
            filteredPlaces.map(place => {
              const isFav = favoritePlaceIds.includes(place.id);
              const dist = calculateDistance(userLocation.lat, userLocation.lng, place.lat, place.lng);

              return (
                <div
                  key={place.id}
                  onClick={() => focusOnPlace(place)}
                  className={`bg-white rounded-3xl p-4 border transition-all cursor-pointer hover:border-[#FF5722] shadow-2xs ${
                    selectedPlace?.id === place.id ? 'border-[#FF5722] ring-2 ring-orange-200' : 'border-[#F0E5E1]'
                  }`}
                >
                  <div className="flex gap-3.5">
                    <img
                      src={place.imageUrl}
                      alt={place.name}
                      className="w-20 h-20 rounded-2xl object-cover shrink-0"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-1">
                        <span className="text-[10px] font-bold text-[#FF5722] bg-[#FFEBE6] px-2.5 py-0.5 rounded-full">
                          {place.category}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleFavoritePlace(place);
                          }}
                          className={`p-1 rounded-md transition ${
                            isFav ? 'text-red-500' : 'text-slate-300 hover:text-red-500'
                          }`}
                        >
                          {isFav ? <BookmarkCheck className="w-4 h-4 fill-current" /> : <Bookmark className="w-4 h-4" />}
                        </button>
                      </div>

                      <h4 className="font-bold text-[#1E1715] text-sm truncate mt-1">
                        {place.name}
                      </h4>

                      <div className="flex items-center gap-2 text-xs text-[#786C68] mt-1">
                        <div className="flex items-center gap-0.5 text-amber-500 font-bold">
                          <Star className="w-3 h-3 fill-current" />
                          <span>{place.rating}</span>
                        </div>
                        <span>•</span>
                        <span className="text-[#FF5722] font-bold">{dist} km</span>
                        <span>•</span>
                        <span>{place.priceRange}</span>
                      </div>

                      <div className="flex items-center gap-1 text-[11px] text-[#786C68] mt-1.5 truncate">
                        <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                        <span>{place.operatingHours}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
