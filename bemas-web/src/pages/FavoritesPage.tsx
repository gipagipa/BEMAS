import React, { useState } from 'react';
import { Share2, Plus, Search, Heart, Clock, MapPin, ChefHat } from 'lucide-react';
import { Recipe, CulinaryPlace } from '../types';
import { storage } from '../services/storage';

interface FavoritesPageProps {
  onGoToRecipe: () => void;
  onGoToMap: () => void;
}

export const FavoritesPage: React.FC<FavoritesPageProps> = ({ onGoToRecipe, onGoToMap }) => {
  const [activeTab, setActiveTab] = useState<'resep' | 'kuliner'>('resep');
  const [activeTag, setActiveTag] = useState('Semua Favorit');
  const [searchQuery, setSearchQuery] = useState('');

  const filterTags = [
    'Semua Favorit',
    '● Bahan Siap di Kulkas (3)',
    '⚡ Sarapan Kilat (<15 mnt)',
    '👨‍👩‍👧 Keluarga & Anak',
    '💸 Hemat Budget (<Rp 20k)'
  ];

  return (
    <div className="space-y-6 pb-16">
      {/* BANNER / TITLE SECTION (Exact Figma Favorit.html) */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFEBE6] text-[#FF5722] text-xs font-bold mb-2">
            <span>♡ Tersimpan di Dapur &amp; Perjalanan</span>
            <span>•</span>
            <span className="text-emerald-700 font-medium">Sinkron otomatis dengan kulkasmu</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#1E1715] mb-1">
            Koleksi Rasa Favoritmu
          </h2>
          <p className="text-xs sm:text-sm text-[#786C68] max-w-2xl leading-relaxed">
            Kumpulan racikan resep rumahan andalan dan spot kuliner langganan Balikpapan yang siap kamu buat atau kunjungi lagi kapan saja.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button 
            onClick={onGoToRecipe}
            className="px-5 py-2.5 bg-[#FF5722] hover:bg-[#E64A19] text-white rounded-2xl text-xs font-bold flex items-center gap-2 shadow-2xs transition-colors"
          >
            <span>+ Catat Resep Sendiri</span>
          </button>
          <button 
            aria-label="Share" 
            onClick={() => alert('Link koleksi favorit disalin!')}
            className="w-10 h-10 rounded-2xl bg-white hover:bg-orange-50 border border-[#F0E5E1] text-[#786C68] hover:text-[#FF5722] flex items-center justify-center text-xs transition-colors shadow-2xs"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* DUAL PILL SWITCHER & QUICK SEARCH (Exact Figma Favorit.html) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="p-1 bg-[#FFF1ED] rounded-2xl flex items-center gap-1 border border-[#FFD8CF] overflow-x-auto no-scrollbar">
          <button 
            onClick={() => setActiveTab('resep')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold shadow-2xs flex items-center gap-2 whitespace-nowrap transition-all ${
              activeTab === 'resep'
                ? 'bg-[#FF5722] text-white'
                : 'text-[#786C68] hover:text-[#1E1715]'
            }`}
          >
            <span>🍲</span>
            <span>Resep Masakan (8 Resep)</span>
          </button>

          <button 
            onClick={() => setActiveTab('kuliner')}
            className={`px-5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 whitespace-nowrap transition-all ${
              activeTab === 'kuliner'
                ? 'bg-[#FF5722] text-white shadow-2xs'
                : 'text-[#786C68] hover:text-[#1E1715]'
            }`}
          >
            <span>🏪</span>
            <span>Spot Kuliner Langganan (5 Tempat)</span>
          </button>
        </div>

        <div className="relative w-full sm:w-72 flex items-center">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#786C68] text-xs pointer-events-none">
            🔍
          </span>
          <input 
            type="text" 
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Cari nama resep, bahan, resto..." 
            className="w-full bg-white border border-[#F0E5E1] rounded-2xl pl-9 pr-3 py-2.5 text-xs text-[#1E1715] placeholder-[#786C68] focus:outline-hidden focus:border-[#FF5722] font-medium transition-all"
          />
        </div>
      </div>

      {/* FILTER TAGS (Exact Figma Favorit.html) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {filterTags.map(tag => (
          <button
            key={tag}
            onClick={() => setActiveTag(tag)}
            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTag === tag
                ? 'bg-[#FF5722] text-white font-bold shadow-2xs'
                : 'bg-white hover:bg-orange-50 border border-[#F0E5E1] text-[#786C68] hover:text-[#1E1715]'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* MAIN CONTENT: 2 COLUMNS (8 COLS RECIPES, 4 COLS STATS & SHORTCUTS) */}
      <div className="grid grid-cols-12 gap-8 items-start">

        {/* LEFT (8 COLS): GRID RECIPE CARDS */}
        <div className="col-span-12 lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between text-xs">
            <div>
              <h3 className="font-bold text-base text-[#1E1715]">
                {activeTab === 'resep' ? 'Resep Siap Eksekusi' : 'Spot Kuliner Balikpapan'}
              </h3>
              <span className="text-[#786C68]">Diurutkan berdasarkan ketersediaan bahan di kulkas</span>
            </div>
            <div className="text-xs text-[#786C68] flex items-center gap-1.5">
              <span>Sortir:</span>
              <span className="font-bold text-[#FF5722] bg-white border border-[#F0E5E1] px-2.5 py-1 rounded-lg cursor-pointer">
                Kulkas Ready ▾
              </span>
            </div>
          </div>

          {activeTab === 'resep' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* RECIPE CARD 1: Tumis Tahu Telur Gurih Manis */}
              <div className="bg-white rounded-3xl border border-[#F0E5E1] p-4 shadow-2xs space-y-3 hover:border-orange-200 transition-colors flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="relative h-44 rounded-2xl overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=500&q=80" 
                      alt="Tumis Tahu Telur" 
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-2.5 left-2.5 bg-emerald-700 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-xs">
                      ✓ Bahan Lengkap di Kulkas
                    </span>
                    <span className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-white/90 text-red-500 flex items-center justify-center text-xs shadow-xs cursor-pointer hover:bg-white">
                      ♥
                    </span>
                    <span className="absolute bottom-2.5 left-2.5 bg-black/60 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                      ★ 4.9 (142)
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-[11px] text-[#786C68] mb-1 flex-wrap">
                      <span>⏱ 15 Menit</span>
                      <span>•</span>
                      <span>Tingkat: Sangat Mudah</span>
                      <span>•</span>
                      <span className="font-bold text-[#1E1715]">Est. Rp 14.500</span>
                    </div>
                    <h4 className="font-bold text-sm text-[#1E1715] mb-1">
                      Tumis Tahu Telur Gurih Manis
                    </h4>
                    <p className="text-[11px] text-[#786C68] line-clamp-2 leading-relaxed mb-3">
                      Tahu putih lembut digoreng setengah matang, dipadukan orak-arik telur segar dan karamelisasi kecap manis.
                    </p>
                    <div className="flex flex-wrap gap-1.5 text-[10px] text-[#786C68]">
                      <span className="bg-[#FFF8F6] border border-[#F0E5E1] px-2 py-0.5 rounded">2 Tahu Sutra</span>
                      <span className="bg-[#FFF8F6] border border-[#F0E5E1] px-2 py-0.5 rounded">2 Butir Telur</span>
                      <span className="bg-[#FFF8F6] border border-[#F0E5E1] px-2 py-0.5 rounded">Kecap Manis</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-1.5 pt-2">
                  <button 
                    onClick={onGoToRecipe}
                    className="w-full py-2.5 bg-[#FF5722] hover:bg-[#E64A19] text-white rounded-xl text-xs font-bold transition-colors shadow-2xs"
                  >
                    Mulai Masak Sekarang
                  </button>
                  <button 
                    onClick={onGoToMap}
                    className="w-full py-1.5 text-[11px] text-[#FF5722] font-semibold hover:underline flex items-center justify-center gap-1"
                  >
                    <span>📍 Malas Masak? Cek Warung Tahu Tek (380m)</span>
                  </button>
                </div>
              </div>

              {/* RECIPE CARD 2: Sup Wortel Tahu Kuah Bening */}
              <div className="bg-white rounded-3xl border border-[#F0E5E1] p-4 shadow-2xs space-y-3 hover:border-orange-200 transition-colors flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="relative h-44 rounded-2xl overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=500&q=80" 
                      alt="Sup Wortel Tahu" 
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-2.5 left-2.5 bg-amber-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-xs">
                      🔔 Kurang 1 Bahan (Daun Bawang)
                    </span>
                    <span className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-white/90 text-red-500 flex items-center justify-center text-xs shadow-xs cursor-pointer hover:bg-white">
                      ♥
                    </span>
                    <span className="absolute bottom-2.5 left-2.5 bg-black/60 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                      ★ 4.8 (98)
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-[11px] text-[#786C68] mb-1 flex-wrap">
                      <span>⏱ 20 Menit</span>
                      <span>•</span>
                      <span>Sehat &amp; Hangat</span>
                      <span>•</span>
                      <span className="font-bold text-[#1E1715]">Est. Rp 11.000</span>
                    </div>
                    <h4 className="font-bold text-sm text-[#1E1715] mb-1">
                      Sup Wortel Tahu Kuah Bening
                    </h4>
                    <p className="text-[11px] text-[#786C68] line-clamp-2 leading-relaxed mb-3">
                      Kaldu ayam bening kaya aroma bawang putih goreng dan lada putih geprek, menyegarkan di musim hujan.
                    </p>
                    <div className="p-2 rounded-xl bg-[#FFF4F0] border border-[#FFD8CF] flex items-center justify-between text-[10px]">
                      <span className="text-[#786C68]">3/4 Bahan di Kulkas</span>
                      <span className="text-[#FF5722] font-bold">Sayur Segar Jl. Minyak (~400m)</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 pt-2">
                  <button 
                    onClick={onGoToRecipe}
                    className="flex-1 py-2.5 bg-[#FFF8F6] hover:bg-orange-50 border border-[#F0E5E1] text-[#1E1715] rounded-xl text-xs font-bold transition-colors"
                  >
                    Buka Resep
                  </button>
                  <button 
                    onClick={onGoToMap}
                    className="flex-1 py-2.5 bg-white hover:bg-orange-50 border border-[#FFD8CF] text-[#FF5722] rounded-xl text-xs font-bold transition-colors"
                  >
                    Beli Daun Bawang
                  </button>
                </div>
              </div>

              {/* RECIPE CARD 3: Ayam Goreng Lengkuas */}
              <div className="bg-white rounded-3xl border border-[#F0E5E1] p-4 shadow-2xs space-y-3 hover:border-orange-200 transition-colors flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="relative h-44 rounded-2xl overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=500&q=80" 
                      alt="Ayam Goreng Lengkuas" 
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-2.5 left-2.5 bg-[#1E1715]/80 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-xs">
                      🍱 Menu Andalan Akhir Pekan
                    </span>
                    <span className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-white/90 text-red-500 flex items-center justify-center text-xs shadow-xs cursor-pointer hover:bg-white">
                      ♥
                    </span>
                    <span className="absolute bottom-2.5 left-2.5 bg-black/60 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                      ★ 4.9 (210)
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-[11px] text-[#786C68] mb-1 flex-wrap">
                      <span>⏱ 35 Menit</span>
                      <span>•</span>
                      <span>Porsi Keluarga (4 Org)</span>
                      <span>•</span>
                      <span className="font-bold text-[#1E1715]">Est. Rp 38.000</span>
                    </div>
                    <h4 className="font-bold text-sm text-[#1E1715] mb-1">
                      Ayam Goreng Lengkuas Renyah
                    </h4>
                    <p className="text-[11px] text-[#786C68] line-clamp-2 leading-relaxed mb-3">
                      Bumbu ungkep meresap hingga ke tulang dengan serundeng lengkuas parut renyah gurih.
                    </p>
                    <div className="flex flex-wrap gap-1.5 text-[10px] text-[#786C68]">
                      <span className="bg-[#FFF8F6] border border-[#F0E5E1] px-2 py-0.5 rounded">1/2 Ekor Ayam</span>
                      <span className="bg-[#FFF8F6] border border-[#F0E5E1] px-2 py-0.5 rounded">150g Lengkuas</span>
                      <span className="bg-[#FFF8F6] border border-[#F0E5E1] px-2 py-0.5 rounded">Kunyit &amp; Ketumbar</span>
                    </div>
                  </div>
                </div>
                <div className="pt-2">
                  <button 
                    onClick={onGoToRecipe}
                    className="w-full py-2.5 bg-[#FFF8F6] hover:bg-orange-50 border border-[#F0E5E1] text-[#1E1715] rounded-xl text-xs font-bold transition-colors"
                  >
                    Buka Resep &amp; Langkah
                  </button>
                </div>
              </div>

              {/* RECIPE CARD 4: Telur Dadar Sayur Tebal */}
              <div className="bg-white rounded-3xl border border-[#F0E5E1] p-4 shadow-2xs space-y-3 hover:border-orange-200 transition-colors flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="relative h-44 rounded-2xl overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=500&q=80" 
                      alt="Telur Dadar Sayur" 
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-2.5 left-2.5 bg-emerald-700 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-xs">
                      ✓ Bahan Siap di Kulkas
                    </span>
                    <span className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-white/90 text-red-500 flex items-center justify-center text-xs shadow-xs cursor-pointer hover:bg-white">
                      ♥
                    </span>
                    <span className="absolute bottom-2.5 left-2.5 bg-black/60 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                      ★ 4.9 (185)
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-[11px] text-[#786C68] mb-1 flex-wrap">
                      <span>⏱ 15 Menit</span>
                      <span>•</span>
                      <span>Tinggi Protein</span>
                      <span>•</span>
                      <span className="font-bold text-[#1E1715]">Est. Rp 9.500</span>
                    </div>
                    <h4 className="font-bold text-sm text-[#1E1715] mb-1">
                      Telur Dadar Sayur Tebal Padang
                    </h4>
                    <p className="text-[11px] text-[#786C68] line-clamp-2 leading-relaxed mb-3">
                      Renyah di luar dan empuk tebal di dalam dengan paduan daun bawang, cabai merah keriting, dan telur bebek.
                    </p>
                    <div className="flex flex-wrap gap-1.5 text-[10px] text-[#786C68]">
                      <span className="bg-[#FFF8F6] border border-[#F0E5E1] px-2 py-0.5 rounded">3 Telur Bebek</span>
                      <span className="bg-[#FFF8F6] border border-[#F0E5E1] px-2 py-0.5 rounded">Daun Bawang</span>
                      <span className="bg-[#FFF8F6] border border-[#F0E5E1] px-2 py-0.5 rounded">Bawang Merah</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-1.5 pt-2">
                  <button 
                    onClick={onGoToRecipe}
                    className="w-full py-2.5 bg-[#FF5722] hover:bg-[#E64A19] text-white rounded-xl text-xs font-bold transition-colors shadow-2xs"
                  >
                    Mulai Masak Sekarang
                  </button>
                  <span className="block text-center text-[10px] text-[#786C68]">
                    Ada di RM Padang Simpang Tiga (620m)
                  </span>
                </div>
              </div>
            </div>
          ) : (
            /* SPOT KULINER TAB */
            <div className="space-y-4">
              <div className="bg-white rounded-3xl p-5 border border-[#F0E5E1] shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-[#1E1715] text-sm">Tahu Telur &amp; Tahu Tek Cak Man</h4>
                  <span className="text-yellow-500 font-bold text-xs">★ 4.8</span>
                </div>
                <p className="text-xs text-[#786C68]">Jl. Soekarno Hatta Km 5, Balikpapan Utara • 380m</p>
                <div className="flex items-center justify-between pt-2 border-t border-[#F0E5E1]">
                  <span className="text-xs font-bold text-[#FF5722]">Rp 15.000 - Rp 20.000</span>
                  <button onClick={onGoToMap} className="px-4 py-2 bg-[#FF5722] text-white rounded-xl text-xs font-bold">
                    Lihat di Peta GIS →
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT (4 COLS): STATISTIK & SPOT KULINER LANGGANAN (Exact Figma Favorit.html) */}
        <div className="col-span-12 lg:col-span-4 space-y-5">

          {/* STATISTIK DAPUR CERIA */}
          <div className="bg-white rounded-3xl p-5 border border-[#F0E5E1] shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#F0E5E1] pb-3">
              <h4 className="font-bold text-sm text-[#1E1715] flex items-center gap-2">
                <span>📈</span>
                <span>Statistik Dapur Ceria</span>
              </h4>
              <span className="text-[10px] bg-[#FFF1ED] text-[#FF5722] font-bold px-2 py-0.5 rounded-full">
                Bulan Ini
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-3 rounded-2xl bg-[#FFF8F6] border border-[#F0E5E1]">
                <span className="text-[10px] text-[#786C68] block">Sering Dimasak</span>
                <span className="text-xl font-extrabold text-[#FF5722]">14</span>
                <span className="text-[10px] text-emerald-700 block font-semibold">+4 dari bulan lalu</span>
              </div>
              <div className="p-3 rounded-2xl bg-[#FFF8F6] border border-[#F0E5E1]">
                <span className="text-[10px] text-[#786C68] block">Est. Hemat Masak</span>
                <span className="text-xl font-extrabold text-emerald-700">Rp 142k</span>
                <span className="text-[10px] text-[#786C68] block">vs Beli di luar</span>
              </div>
            </div>
            <div className="p-3 rounded-2xl bg-[#FFF4F0] border border-[#FFD8CF] text-[11px] space-y-1">
              <div className="flex justify-between font-bold">
                <span className="text-[#1E1715]">Rasio Memasak (68% Masak Sendiri)</span>
                <span className="text-[#FF5722]">Hebat!</span>
              </div>
              <div className="w-full bg-white h-2 rounded-full overflow-hidden border border-[#FFD8CF]">
                <div className="bg-[#FF5722] h-full rounded-full" style={{ width: '68%' }}></div>
              </div>
              <div className="flex justify-between text-[10px] text-[#786C68] pt-1">
                <span>● Masak (14x)</span>
                <span>● Beli Kuliner (6x)</span>
              </div>
            </div>
          </div>

          {/* SPOT KULINER LANGGANAN SHORTCUT */}
          <div className="bg-white rounded-3xl p-5 border border-[#F0E5E1] shadow-2xs space-y-3.5">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-sm text-[#1E1715] flex items-center gap-2">
                <span>📍</span>
                <span>Spot Kuliner Langganan</span>
              </h4>
              <button onClick={onGoToMap} className="text-[11px] font-bold text-[#FF5722] hover:underline">
                Peta GIS
              </button>
            </div>
            <p className="text-[11px] text-[#786C68]">Dekat posisimu saat ini (Balikpapan)</p>

            {/* Spot 1 */}
            <div 
              onClick={onGoToMap}
              className="flex items-center gap-3 p-2.5 rounded-2xl hover:bg-[#FFF8F6] border border-[#F0E5E1] transition-colors cursor-pointer"
            >
              <img 
                src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=150&q=80" 
                alt="Tahu Cak Man" 
                className="w-12 h-12 rounded-xl object-cover shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between text-[11px]">
                  <h5 className="font-bold text-xs text-[#1E1715] truncate">Tahu Telur Cak Man</h5>
                  <span className="text-yellow-500 font-bold">★ 4.8</span>
                </div>
                <span className="text-[10px] text-[#786C68] block truncate">380m • Jl. Ahmad Yani</span>
                <span className="text-[10px] text-emerald-700 font-medium">✓ Pernah dikunjungi 3x</span>
              </div>
              <span className="w-7 h-7 rounded-lg bg-white border border-[#F0E5E1] text-[#FF5722] flex items-center justify-center text-xs shrink-0">
                ➔
              </span>
            </div>

            {/* Spot 2 */}
            <div 
              onClick={onGoToMap}
              className="flex items-center gap-3 p-2.5 rounded-2xl hover:bg-[#FFF8F6] border border-[#F0E5E1] transition-colors cursor-pointer"
            >
              <img 
                src="https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=150&q=80" 
                alt="Ayam Salwa" 
                className="w-12 h-12 rounded-xl object-cover shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between text-[11px]">
                  <h5 className="font-bold text-xs text-[#1E1715] truncate">Ayam Bakar Salwa</h5>
                  <span className="text-yellow-500 font-bold">★ 4.7</span>
                </div>
                <span className="text-[10px] text-[#786C68] block truncate">460m • Pasar Segar Bpp</span>
                <span className="text-[10px] text-[#FF5722] font-medium">🍱 Langganan Makan Malam</span>
              </div>
              <span className="w-7 h-7 rounded-lg bg-white border border-[#F0E5E1] text-[#FF5722] flex items-center justify-center text-xs shrink-0">
                ➔
              </span>
            </div>

            <button 
              onClick={onGoToMap}
              className="w-full py-2 bg-[#FFF8F6] border border-[#F0E5E1] text-[#1E1715] rounded-xl text-xs font-bold hover:bg-[#FFEBE6] hover:text-[#FF5722] transition-colors"
            >
              Buka Semua Spot di Peta Balikpapan
            </button>
          </div>

          {/* PROMPT CATATAN KELUARGA */}
          <div className="p-4 rounded-3xl bg-linear-to-br from-[#FFF4F0] to-[#FFEBE6] border border-[#FFD8CF] space-y-2">
            <div className="w-8 h-8 rounded-xl bg-[#FF5722] text-white flex items-center justify-center text-sm font-bold shadow-2xs">
              📝
            </div>
            <h5 className="text-xs font-extrabold text-[#1E1715]">Punya Resep Rahasia Keluarga?</h5>
            <p className="text-[11px] text-[#786C68] leading-relaxed">
              Simpan takaran bumbu warisan ibu atau resep kreasi sendiri agar tidak lupa dan bisa disesuaikan otomatis dengan stok kulkasmu.
            </p>
            <button 
              onClick={onGoToRecipe}
              className="w-full py-2 bg-[#FF5722] hover:bg-[#E64A19] text-white rounded-xl text-xs font-bold mt-1 transition-colors shadow-2xs"
            >
              + Buat Catatan Resep Baru
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
