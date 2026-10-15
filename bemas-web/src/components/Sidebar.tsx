import React from 'react';
import { ChefHat, MapPin, Heart, HelpCircle, Sparkles, Shield, Home } from 'lucide-react';
import { User } from '../types';

interface SidebarProps {
  activeTab: 'recipe' | 'map' | 'favorites' | 'admin' | 'help';
  setActiveTab: (tab: 'recipe' | 'map' | 'favorites' | 'admin' | 'help') => void;
  currentUser: User | null;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  currentUser
}) => {
  return (
    <aside className="w-[260px] min-w-[260px] bg-white border-r border-[#F0E5E1] flex flex-col justify-between shrink-0 h-screen sticky top-0 z-40 overflow-y-auto no-scrollbar hidden md:flex">
      <div>
        {/* Brand Logo - Exact Figma Design */}
        <div 
          onClick={() => setActiveTab('recipe')}
          className="p-6 flex items-center gap-3 border-b border-[#F0E5E1]/70 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-2xl bg-[#FF5722] flex items-center justify-center text-white shadow-md shadow-orange-500/20 shrink-0 group-hover:scale-105 transition-transform">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 2v6a3 3 0 0 1-3 3 3 3 0 0 1-3-3V2"></path>
              <path d="M15 2v10"></path>
              <path d="M15 12a3 3 0 0 1 3 3v7"></path>
              <path d="M6 2v20"></path>
              <path d="M6 7h4a2 2 0 0 0 2-2V2"></path>
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight text-[#FF5722] leading-none">BEMAS</h1>
            <p className="text-xs text-[#786C68] font-medium mt-1">Beli atau Masak</p>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="p-4 space-y-1.5">
          <button
            onClick={() => setActiveTab('recipe')}
            className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl font-bold text-sm transition-colors text-left ${
              activeTab === 'recipe'
                ? 'bg-[#FFEBE6] text-[#FF5722]'
                : 'text-[#786C68] hover:text-[#1E1715] hover:bg-orange-50/50 font-semibold'
            }`}
          >
            <ChefHat className="w-[18px] h-[18px]" />
            <span>Resep Dapur (AI)</span>
          </button>

          <button
            onClick={() => setActiveTab('map')}
            className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl font-bold text-sm transition-colors text-left ${
              activeTab === 'map'
                ? 'bg-[#FFEBE6] text-[#FF5722]'
                : 'text-[#786C68] hover:text-[#1E1715] hover:bg-orange-50/50 font-semibold'
            }`}
          >
            <MapPin className="w-[18px] h-[18px]" />
            <span>Kuliner (Peta GIS)</span>
          </button>

          <button
            onClick={() => setActiveTab('favorites')}
            className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl font-bold text-sm transition-colors text-left ${
              activeTab === 'favorites'
                ? 'bg-[#FFEBE6] text-[#FF5722]'
                : 'text-[#786C68] hover:text-[#1E1715] hover:bg-orange-50/50 font-semibold'
            }`}
          >
            <Heart className="w-[18px] h-[18px]" />
            <span>Resep & Lokasi Favorit</span>
          </button>

          <button
            onClick={() => setActiveTab('help')}
            className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl font-bold text-sm transition-colors text-left ${
              activeTab === 'help'
                ? 'bg-[#FFEBE6] text-[#FF5722]'
                : 'text-[#786C68] hover:text-[#1E1715] hover:bg-orange-50/50 font-semibold'
            }`}
          >
            <HelpCircle className="w-[18px] h-[18px]" />
            <span>Bantuan & Lapor Bug</span>
          </button>

          {/* Admin Tab (Only when admin role or switcher is active) */}
          {currentUser?.role === 'admin' && (
            <button
              onClick={() => setActiveTab('admin')}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl font-bold text-sm transition-colors text-left ${
                activeTab === 'admin'
                  ? 'bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200'
                  : 'text-[#786C68] hover:text-indigo-700 hover:bg-indigo-50/50 font-semibold'
              }`}
            >
              <Shield className="w-[18px] h-[18px] text-indigo-600" />
              <span>Dasbor Admin</span>
            </button>
          )}
        </nav>
      </div>

      {/* Tips Dapur Card - Exact Figma Design */}
      <div className="p-4 m-4 rounded-2xl bg-[#FFF1ED] border border-[#FFD8CF]">
        <div className="w-8 h-8 rounded-full bg-white text-[#FF5722] flex items-center justify-center mb-2 shadow-xs font-bold text-xs">
          💡
        </div>
        <h4 className="text-xs font-bold text-[#1E1715] mb-1">Tips Dapur Hari Ini</h4>
        <p className="text-[11px] text-[#786C68] leading-relaxed mb-2">
          Bawang putih cincang tahan lebih awet & wangi jika direndam sedikit minyak kelapa dalam wadah kaca.
        </p>
        <span 
          onClick={() => setActiveTab('recipe')}
          className="text-[11px] text-[#FF5722] font-bold cursor-pointer hover:underline"
        >
          Cek daya tahan bahan lain →
        </span>
      </div>
    </aside>
  );
};
