import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { 
  MapPin, 
  Navigation, 
  Search, 
  Star, 
  Phone, 
  Clock, 
  Bookmark, 
  BookmarkCheck, 
  ExternalLink, 
  CheckCircle2, 
  Utensils 
} from 'lucide-react';
import { CulinaryPlace } from '../types';
import { storage } from '../services/storage';

interface MapSectionProps {
  onGoToRecipe: () => void;
}

// Haversine formula to compute distance between two lat/lng coordinates in km
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
  
  // ITK Balikpapan default center coordinates: -1.1519, 116.8617
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number }>({
    lat: -1.1519,
    lng: 116.8617
  });
  const [hasRealGps, setHasRealGps] = useState(false);
  const [places, setPlaces] = useState<CulinaryPlace[]>(storage.getPlaces());
  const [selectedPlace, setSelectedPlace] = useState<CulinaryPlace | null>(null);
  const [favoritePlaceIds, setFavoritePlaceIds] = useState<string[]>(storage.getFavoritePlaceIds());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current).setView([userLocation.lat, userLocation.lng], 13);
      
      // OpenStreetMap tiles (100% free, no credit card or billing required!)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    return () => {
      // Cleanup on unmount
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Markers on places or location change
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear existing markers
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    // Custom icon for user location
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
      .bindPopup('<b>Lokasi Anda</b><br/>Posisi GPS saat ini.');
    markersRef.current.push(userMarker);

    // Place markers for filtered places
    const filtered = getFilteredPlaces();
    filtered.forEach(place => {
      const placeIcon = L.divIcon({
        html: `
          <div class="flex items-center justify-center w-9 h-9 rounded-full bg-orange-600 text-white shadow-lg border-2 border-white hover:scale-110 transition-transform cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/></svg>
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
          <div style="font-family: inherit; font-size: 13px; max-width: 220px;">
            <b style="font-size: 14px; color: #1e293b;">${place.name}</b>
            <div style="color: #f97316; font-size: 12px; margin-top: 2px;">★ ${place.rating} (${place.reviewsCount} ulasan) • ${dist} km</div>
            <div style="color: #64748b; font-size: 11px; margin-top: 4px;">${place.address}</div>
            <div style="margin-top: 6px; font-weight: 600; color: #0f172a;">Menu: ${place.featuredMenu}</div>
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
      showToast('Mencari sinyal GPS perangkat Anda...');
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const newPos = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setUserLocation(newPos);
          setHasRealGps(true);
          if (mapInstanceRef.current) {
            mapInstanceRef.current.flyTo([newPos.lat, newPos.lng], 14, { duration: 1.5 });
          }
          showToast('Lokasi GPS berhasil diperbarui!');
        },
        (err) => {
          console.warn('GPS Error / Denied:', err);
          showToast('GPS tidak diizinkan, menggunakan titik simulasi ITK Balikpapan.');
        }
      );
    } else {
      alert('Browser tidak mendukung geolokasi GPS.');
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

  const categories = ['Semua', 'Warung Makan', 'Cafe', 'Restoran', 'Bakso & Mie', 'Street Food'];
  const filteredPlaces = getFilteredPlaces();

  return (
    <div className="space-y-6 pb-12">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-sm px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-700 text-xs font-bold uppercase mb-1">
            <MapPin className="w-3.5 h-3.5" />
            <span>GIS Map Engine (UC-04)</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">
            Eksplorasi Kuliner Terdekat
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Menampilkan tempat makan di sekitar kampus ITK & Balikpapan berbasis GPS.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={requestGpsLocation}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold transition shadow-xs"
          >
            <Navigation className="w-4 h-4" />
            <span>Gunakan GPS Saya</span>
          </button>
          
          <button
            onClick={onGoToRecipe}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition"
          >
            <Utensils className="w-4 h-4 text-orange-500" />
            <span>Mau Masak Saja</span>
          </button>
        </div>
      </div>

      {/* Search & Category Filter */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari warung, soto, kepiting, kopi..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-300 text-xs bg-white focus:outline-hidden focus:ring-2 focus:ring-orange-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full pb-1 sm:pb-0">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`text-xs px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Interactive Map + Places List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Leaflet Map Box (7 Cols) */}
        <div className="lg:col-span-7 bg-white p-2 rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden flex flex-col h-[520px]">
          <div className="flex items-center justify-between px-3 py-2 text-xs text-slate-500 border-b border-slate-100">
            <span className="flex items-center gap-1.5 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Peta Interaktif OpenStreetMap (Balikpapan)
            </span>
            <span>{filteredPlaces.length} Tempat Ditampilkan</span>
          </div>

          <div className="flex-1 w-full rounded-xl overflow-hidden relative">
            <div ref={mapContainerRef} className="w-full h-full" />
          </div>
        </div>

        {/* Places List & Details (5 Cols) */}
        <div className="lg:col-span-5 space-y-4 max-h-[520px] overflow-y-auto pr-1">
          {/* If a place is selected, show highlight card */}
          {selectedPlace && (
            <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 shadow-xs">
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-amber-200 text-amber-900">
                  Tempat Terpilih
                </span>
                <button
                  onClick={() => setSelectedPlace(null)}
                  className="text-xs text-amber-800 font-semibold hover:underline"
                >
                  Tutup
                </button>
              </div>

              <h3 className="font-bold text-slate-900 text-base">{selectedPlace.name}</h3>
              <p className="text-xs text-slate-600 mt-1">{selectedPlace.address}</p>
              
              <div className="mt-3 p-2.5 rounded-xl bg-white border border-amber-200/60 text-xs">
                <p className="font-bold text-orange-600 mb-1">Menu Unggulan:</p>
                <p className="text-slate-800">{selectedPlace.featuredMenu}</p>
              </div>

              <div className="mt-3 flex items-center justify-between pt-2 border-t border-amber-200/50">
                <span className="text-xs font-semibold text-slate-700">
                  Jarak: {calculateDistance(userLocation.lat, userLocation.lng, selectedPlace.lat, selectedPlace.lng)} km
                </span>
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${selectedPlace.lat},${selectedPlace.lng}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-bold text-orange-600 hover:text-orange-700 hover:underline"
                >
                  Rute Google Maps <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          )}

          {/* Place Cards */}
          {filteredPlaces.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center text-slate-400 border border-slate-200">
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
                  className={`bg-white rounded-2xl p-4 border transition-all cursor-pointer hover:border-orange-400 hover:shadow-sm ${
                    selectedPlace?.id === place.id ? 'border-orange-500 ring-2 ring-orange-200' : 'border-slate-200/80'
                  }`}
                >
                  <div className="flex gap-3.5">
                    <img
                      src={place.imageUrl}
                      alt={place.name}
                      className="w-20 h-20 rounded-xl object-cover shrink-0"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-1">
                        <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md">
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

                      <h4 className="font-bold text-slate-900 text-sm truncate mt-1">
                        {place.name}
                      </h4>

                      <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                        <div className="flex items-center gap-0.5 text-amber-500 font-bold">
                          <Star className="w-3 h-3 fill-current" />
                          <span>{place.rating}</span>
                        </div>
                        <span>•</span>
                        <span className="text-orange-600 font-semibold">{dist} km</span>
                        <span>•</span>
                        <span>{place.priceRange}</span>
                      </div>

                      <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-1.5 truncate">
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
