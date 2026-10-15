import React from 'react';
import { ChefHat, MapPin, Sparkles, Navigation, Heart, ArrowRight, Clock, Star, Flame } from 'lucide-react';
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
  return (
    <div className="space-y-8 pb-16">
      {/* Top Welcome Banner */}
      <div className="bg-linear-to-r from-orange-500 via-[#FF5722] to-amber-500 text-white rounded-3xl p-6 sm:p-10 shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-xs font-bold uppercase tracking-wider mb-3">
            <span>✨ Solusi Lapar Harian Balikpapan</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white mb-3">
            Halo, {currentUser?.name || 'Dapur Utami'}! Mau Masak atau Beli Makan Hari Ini?
          </h1>
          <p className="text-orange-100 text-xs sm:text-sm leading-relaxed mb-6">
            BEMAS siap membantu menjawab kebingungan harianmu. Pilih opsi masak praktis berbasis bahan kulkas atau temukan rekomendasi tempat makan lezat terdekat.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onNavigateToRecipe}
              className="px-5 py-2.5 rounded-2xl bg-white text-[#FF5722] font-bold text-xs hover:bg-orange-50 transition shadow-xs flex items-center gap-2"
            >
              <ChefHat className="w-4 h-4" />
              <span>Masak Sendiri (Resep AI)</span>
            </button>
            <button
              onClick={onNavigateToMap}
              className="px-5 py-2.5 rounded-2xl bg-black/25 text-white border border-white/30 font-bold text-xs hover:bg-black/35 transition flex items-center gap-2"
            >
              <MapPin className="w-4 h-4" />
              <span>Beli Jadi (Peta Kuliner)</span>
            </button>
          </div>
        </div>

        <div className="absolute right-[-20px] bottom-[-20px] opacity-15 hidden lg:block text-[180px] pointer-events-none select-none">
          🍲
        </div>
      </div>

      {/* 2 MAIN GATEWAY TILES (Figma Core Dilema) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Gateway 1: Masak */}
        <div 
          onClick={onNavigateToRecipe}
          className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F0E5E1] shadow-2xs hover:border-[#FF5722] transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="w-12 h-12 rounded-2xl bg-[#FFEBE6] text-[#FF5722] flex items-center justify-center text-xl mb-4 group-hover:scale-105 transition-transform">
              🍳
            </div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF5722] bg-[#FFEBE6] px-2 py-0.5 rounded-full">
                Fitur AI Resep
              </span>
              <span className="text-xs text-[#786C68]">• Siap 15 Menit</span>
            </div>
            <h3 className="text-xl font-extrabold text-[#1E1715] mb-2 group-hover:text-[#FF5722] transition-colors">
              Punya Bahan di Kulkas? Racik Resepnya
            </h3>
            <p className="text-xs text-[#786C68] leading-relaxed mb-6">
              Ketik sisa telur, tahu, wortel, atau upload foto kulkasmu. AI Gemini akan mendeteksi bahan, mengukur ketahanan pangan, dan menyusun resep lezat.
            </p>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-[#F0E5E1] text-xs font-bold text-[#FF5722]">
            <span>Mulai Racik Resep Sekarang</span>
            <span className="group-hover:translate-x-1 transition-transform">➔</span>
          </div>
        </div>

        {/* Gateway 2: Beli */}
        <div 
          onClick={onNavigateToMap}
          className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F0E5E1] shadow-2xs hover:border-[#FF5722] transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="w-12 h-12 rounded-2xl bg-[#FFF1ED] text-[#FF5722] flex items-center justify-center text-xl mb-4 group-hover:scale-105 transition-transform">
              📍
            </div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                Peta GIS GPS
              </span>
              <span className="text-xs text-[#786C68]">• Radius &lt; 2 km</span>
            </div>
            <h3 className="text-xl font-extrabold text-[#1E1715] mb-2 group-hover:text-[#FF5722] transition-colors">
              Lagi Malas Masak? Cari Kuliner Terdekat
            </h3>
            <p className="text-xs text-[#786C68] leading-relaxed mb-6">
              Buka radar kuliner Balikpapan di sekitar ITK dan Balikpapan Utara. Dapatkan info jam buka, menu unggulan, dan rute navigasi instan.
            </p>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-[#F0E5E1] text-xs font-bold text-[#FF5722]">
            <span>Buka Peta Kuliner Interaktif</span>
            <span className="group-hover:translate-x-1 transition-transform">➔</span>
          </div>
        </div>
      </div>

      {/* Quick Insights Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-3xl border border-[#F0E5E1] shadow-2xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#FFEBE6] text-[#FF5722] flex items-center justify-center font-bold text-xl shrink-0">
            🧊
          </div>
          <div>
            <span className="text-[11px] text-[#786C68] block">Stok Bahan Terdata</span>
            <strong className="text-sm font-bold text-[#1E1715]">4 Bahan di Kulkas</strong>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-[#F0E5E1] shadow-2xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#FFF1ED] text-[#FF5722] flex items-center justify-center font-bold text-xl shrink-0">
            🧭
          </div>
          <div>
            <span className="text-[11px] text-[#786C68] block">Radar Kuliner Balikpapan</span>
            <strong className="text-sm font-bold text-[#1E1715]">12+ Gerai Terpetakan</strong>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-[#F0E5E1] shadow-2xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xl shrink-0">
            💰
          </div>
          <div>
            <span className="text-[11px] text-[#786C68] block">Estimasi Hemat Masak</span>
            <strong className="text-sm font-bold text-emerald-700">Hingga 50% / Porsi</strong>
          </div>
        </div>
      </div>
    </div>
  );
};
