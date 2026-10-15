import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { Star, ArrowRight, Sparkles, MapPin, Search } from 'lucide-react';
import { User } from '../types';

interface HomePageProps {
  currentUser: User | null;
  onNavigateToRecipe: () => void;
  onNavigateToMap: () => void;
  onNavigateToFavorites: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  currentUser,
  onNavigateToRecipe,
  onNavigateToMap,
  onNavigateToFavorites
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  // 4 Culinary spots from exact Figma design
  const nearbySpots = [
    {
      id: 'place-salwa',
      name: 'Ayam Bakar Salwa',
      rating: 4.7,
      distance: '460m',
      status: 'Buka sekarang',
      imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=400&q=80',
      lat: -1.1520,
      lng: 116.8635
    },
    {
      id: 'place-fatim',
      name: 'Pawon Bu Fatim',
      rating: 4.5,
      distance: '920m',
      status: 'Buka sekarang',
      imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=400&q=80',
      lat: -1.1545,
      lng: 116.8610
    },
    {
      id: 'place-rahmad',
      name: 'Waroeng Rahmad',
      rating: 4.6,
      distance: '210m',
      status: 'Buka sekarang',
      imageUrl: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=400&q=80',
      lat: -1.1510,
      lng: 116.8640
    },
    {
      id: 'place-nay',
      name: 'Nay chicken geprek',
      rating: 4.8,
      distance: '1.1km',
      status: 'Buka sekarang',
      imageUrl: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=400&q=80',
      lat: -1.1570,
      lng: 116.8665
    }
  ];

  // Initialize satellite map preview
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Center on Karang Joang / Sei Wain ITK area
      const map = L.map(mapContainerRef.current, {
        zoomControl: false,
        attributionControl: false
      }).setView([-1.1525, 116.8635], 15);

      // Satellite tile layer (Esri World Imagery)
      L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 18
      }).addTo(map);

      // Boundaries & Roads overlay
      L.tileLayer('https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 18
      }).addTo(map);

      // Custom orange marker icons
      const customIcon = L.divIcon({
        className: 'custom-div-icon',
        html: `
          <div style="background-color: #FF5722; color: white; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(0,0,0,0.3); border: 2px solid white; font-weight: bold; font-size: 14px;">
            🍗
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      // Add pins for the nearby spots
      nearbySpots.forEach((spot) => {
        const marker = L.marker([spot.lat, spot.lng], { icon: customIcon }).addTo(map);
        marker.bindPopup(`
          <div style="font-family: inherit; font-size: 12px; padding: 2px;">
            <strong style="color: #FF5722; font-size: 13px;">${spot.name}</strong><br/>
            <span>★ ${spot.rating} • ${spot.distance}</span><br/>
            <span style="color: #10B981; font-weight: 600;">${spot.status}</span>
          </div>
        `);
      });

      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div className="space-y-8 pb-12">
      {/* 1. TOP HERO BANNER (Exact Figma Design) */}
      <div className="bg-[#FF5722] rounded-3xl p-8 sm:p-12 relative overflow-hidden text-white shadow-sm flex flex-col md:flex-row items-center justify-between min-h-[300px]">
        {/* Subtle decorative circles in background matching Figma */}
        <div className="absolute right-[-80px] top-[-80px] w-96 h-96 rounded-full border-[30px] border-white/10 pointer-events-none" />
        <div className="absolute right-[80px] bottom-[-120px] w-80 h-80 rounded-full border-[25px] border-white/10 pointer-events-none" />

        {/* Left Text & CTA */}
        <div className="relative z-10 max-w-lg mb-8 md:mb-0">
          <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight mb-4 tracking-tight">
            Bingung mau masak<br />apa hari ini?
          </h1>
          <p className="text-white/95 text-xs sm:text-sm leading-relaxed mb-8 max-w-md">
            Cari resep praktis dari bahan yang ada di kulkasmu, lengkap dengan takaran dan langkah memasak step-by-step!
          </p>

          <button
            onClick={onNavigateToRecipe}
            className="inline-flex items-center gap-2 bg-white text-[#FF5722] font-bold text-xs sm:text-sm px-6 py-3 rounded-full hover:bg-orange-50 transition shadow-sm active:scale-95"
          >
            <span>Coba AI Resep</span>
            <span className="text-sm font-black">➔</span>
          </button>
        </div>

        {/* Right High-res Food Bowl (Exact Figma Visual) */}
        <div className="relative z-10 shrink-0 flex items-center justify-center">
          {/* Main Top-Down Salad Bowl */}
          <div className="w-56 h-56 sm:w-72 sm:h-72 rounded-full overflow-hidden shadow-2xl border-4 border-white/20 relative group">
            <img
              src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80"
              alt="Salad Bowl Sehat Bemas"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>

          {/* Floating Crispy Chicken Tender Bits (Top Right) */}
          <div className="absolute -top-4 -right-2 sm:-top-6 sm:-right-4 w-20 h-20 sm:w-24 sm:h-24 pointer-events-none drop-shadow-xl animate-pulse">
            <img
              src="https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=300&q=80"
              alt="Crispy Chicken"
              className="w-full h-full object-cover rounded-full border-2 border-white/60"
            />
          </div>
        </div>
      </div>

      {/* 2. SECTION: RESEP AI UNTUKMU */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl sm:text-2xl font-black text-[#1E1715] tracking-tight">
            Resep AI Untukmu
          </h2>
          <button
            onClick={onNavigateToRecipe}
            className="text-[#FF5722] hover:text-[#E64A19] font-bold text-xs sm:text-sm inline-flex items-center gap-1.5 transition"
          >
            <span>Lihat Semua</span>
            <span>➔</span>
          </button>
        </div>

        {/* 3 Figma Recipe Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1: Salad Bowl Sehat */}
          <div 
            onClick={onNavigateToRecipe}
            className="bg-white rounded-2xl p-4 border border-[#F0E5E1] shadow-2xs hover:shadow-md hover:border-[#FF5722]/50 transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="w-full h-44 sm:h-48 rounded-xl overflow-hidden mb-3.5 bg-gray-100">
                <img
                  src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80"
                  alt="Salad Bowl Sehat"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h3 className="font-bold text-base text-[#1E1715] mb-1 group-hover:text-[#FF5722] transition-colors">
                Salad Bowl Sehat
              </h3>
              <p className="text-xs text-[#786C68] mb-4">
                Ayam • Sayur • Telur
              </p>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[#F8EFEA]">
              <span className="bg-[#FFF0EB] text-[#FF5722] text-xs font-bold px-3 py-1 rounded-full">
                30 menit
              </span>
              <div className="flex items-center gap-1 text-xs font-bold text-[#FF5722]">
                <Star className="w-3.5 h-3.5 fill-[#FF5722] text-[#FF5722]" />
                <span>4.8</span>
              </div>
            </div>
          </div>

          {/* Card 2: Ayam Goreng Crispy */}
          <div 
            onClick={onNavigateToRecipe}
            className="bg-white rounded-2xl p-4 border border-[#F0E5E1] shadow-2xs hover:shadow-md hover:border-[#FF5722]/50 transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="w-full h-44 sm:h-48 rounded-xl overflow-hidden mb-3.5 bg-gray-50 flex items-center justify-center p-2">
                <img
                  src="https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=600&q=80"
                  alt="Ayam Goreng Crispy"
                  className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h3 className="font-bold text-base text-[#1E1715] mb-1 group-hover:text-[#FF5722] transition-colors">
                Ayam Goreng Crispy
              </h3>
              <p className="text-xs text-[#786C68] mb-4">
                Ayam • Tepung • Bumbu
              </p>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[#F8EFEA]">
              <span className="bg-[#FFF0EB] text-[#FF5722] text-xs font-bold px-3 py-1 rounded-full">
                45 menit
              </span>
              <div className="flex items-center gap-1 text-xs font-bold text-[#FF5722]">
                <Star className="w-3.5 h-3.5 fill-[#FF5722] text-[#FF5722]" />
                <span>4.6</span>
              </div>
            </div>
          </div>

          {/* Card 3: Nasi Goreng Spesial */}
          <div 
            onClick={onNavigateToRecipe}
            className="bg-white rounded-2xl p-4 border border-[#F0E5E1] shadow-2xs hover:shadow-md hover:border-[#FF5722]/50 transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="w-full h-44 sm:h-48 rounded-xl overflow-hidden mb-3.5 bg-gray-100">
                <img
                  src="https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=600&q=80"
                  alt="Nasi Goreng Spesial"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h3 className="font-bold text-base text-[#1E1715] mb-1 group-hover:text-[#FF5722] transition-colors">
                Nasi Goreng Spesial
              </h3>
              <p className="text-xs text-[#786C68] mb-4">
                Nasi • Telur • Kecap
              </p>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[#F8EFEA]">
              <span className="bg-[#FFF0EB] text-[#FF5722] text-xs font-bold px-3 py-1 rounded-full">
                20 menit
              </span>
              <div className="flex items-center gap-1 text-xs font-bold text-[#FF5722]">
                <Star className="w-3.5 h-3.5 fill-[#FF5722] text-[#FF5722]" />
                <span>4.9</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. SECTION: 2 DARK ACTION TILES (Exact Figma Design) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Tile 1: Racik Resep dengan AI */}
        <div className="bg-[#18181A] rounded-2xl p-6 sm:p-7 text-white flex items-center justify-between relative overflow-hidden group shadow-md">
          <div className="relative z-10 max-w-[65%]">
            <h3 className="text-lg sm:text-xl font-bold mb-2 text-white">
              Racik Resep dengan AI
            </h3>
            <p className="text-xs text-gray-300 leading-relaxed mb-5">
              Masukkan bahan yang ada di kulkasmu dan biarkan AI kami merancang resep terbaik lengkap dengan tutorial memasak!
            </p>
            <button
              onClick={onNavigateToRecipe}
              className="inline-flex items-center gap-2 bg-white text-[#FF5722] font-bold text-xs px-5 py-2.5 rounded-full hover:bg-orange-50 transition shadow-sm active:scale-95"
            >
              <span>Mulai Sekarang</span>
              <span>➔</span>
            </button>
          </div>

          <div className="relative z-10 shrink-0">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-2 border-white/20 shadow-lg group-hover:scale-105 transition-transform">
              <img
                src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=300&q=80"
                alt="AI Recipe"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Tile 2: Jelajahi Hidden Gem Disekitarmu */}
        <div className="bg-[#18181A] rounded-2xl p-6 sm:p-7 text-white flex items-center justify-between relative overflow-hidden group shadow-md">
          <div className="relative z-10 max-w-[65%]">
            <h3 className="text-lg sm:text-xl font-bold mb-2 text-white">
              Jelajahi Hidden Gem Disekitarmu
            </h3>
            <p className="text-xs text-gray-300 leading-relaxed mb-5">
              Temukan spot kuliner unik dengan rating tertinggi di sekitarmu yang wajib dicoba.
            </p>
            <button
              onClick={onNavigateToMap}
              className="inline-flex items-center gap-2 bg-white text-[#FF5722] font-bold text-xs px-5 py-2.5 rounded-full hover:bg-orange-50 transition shadow-sm active:scale-95"
            >
              <span>Mulai Sekarang</span>
              <span>➔</span>
            </button>
          </div>

          <div className="relative z-10 shrink-0">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-2 border-white/20 shadow-lg group-hover:scale-105 transition-transform">
              <img
                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=300&q=80"
                alt="Kuliner Map"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 4. SECTION: KULINER TERDEKAT (Satellite Map + 2x2 Grid) */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl sm:text-2xl font-black text-[#1E1715] flex items-center gap-2 tracking-tight">
            <span className="text-[#FF5722]">📍</span>
            <span>Kuliner Terdekat</span>
          </h2>
          <button
            onClick={onNavigateToMap}
            className="text-[#FF5722] hover:text-[#E64A19] font-bold text-xs sm:text-sm inline-flex items-center gap-1.5 transition"
          >
            <span>Buka peta lengkap</span>
            <span>➔</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left: Satellite Map Container */}
          <div className="lg:col-span-7 rounded-2xl border border-[#F0E5E1] overflow-hidden relative shadow-xs bg-gray-900 min-h-[300px] h-[340px] flex flex-col">
            {/* Top Bar Location Badge (Exact Figma Overlay) */}
            <div className="absolute top-3 left-3 right-3 z-20 flex items-center justify-between bg-black/80 backdrop-blur-xs text-white px-3.5 py-2 rounded-xl text-xs shadow-md border border-white/10">
              <span className="truncate pr-2 text-[11px] font-medium text-gray-200">
                Jl. Sei Wain, Karang Joang, Kec. Balikpapan Utara, Kota Balikpapan, Kalimantan Timur 76127
              </span>
              <span className="bg-[#FF5722] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shrink-0 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                <span>Contoh lokasi</span>
              </span>
            </div>

            {/* Leaflet Satellite Map View */}
            <div ref={mapContainerRef} className="w-full h-full z-10" />

            {/* Bottom Quick Overlay */}
            <div className="absolute bottom-3 left-3 z-20">
              <button
                onClick={onNavigateToMap}
                className="bg-white/90 hover:bg-white text-[#1E1715] text-[11px] font-bold px-3 py-1.5 rounded-lg shadow-md backdrop-blur-xs transition flex items-center gap-1.5"
              >
                <span>🔍 Telusuri Area Ini</span>
              </button>
            </div>
          </div>

          {/* Right: 2x2 Grid of 4 Nearby Places (Exact Figma Design) */}
          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {nearbySpots.map((spot) => (
              <div
                key={spot.id}
                className="bg-white rounded-2xl p-3 border border-[#F0E5E1] shadow-2xs hover:shadow-md hover:border-[#FF5722]/50 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="w-full h-24 rounded-xl overflow-hidden mb-2.5 bg-gray-100">
                    <img
                      src={spot.imageUrl}
                      alt={spot.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <h4 className="font-bold text-xs sm:text-sm text-[#1E1715] mb-1 truncate group-hover:text-[#FF5722] transition-colors">
                    {spot.name}
                  </h4>
                  <p className="text-[11px] text-[#786C68] mb-3">
                    ★ {spot.rating} • {spot.distance} • <span className="text-emerald-600 font-medium">{spot.status}</span>
                  </p>
                </div>

                <button
                  onClick={onNavigateToMap}
                  className="text-left text-xs font-bold text-[#FF5722] hover:underline flex items-center gap-1"
                >
                  <span>Lihat di Peta</span>
                  <span className="text-[10px]">➔</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
