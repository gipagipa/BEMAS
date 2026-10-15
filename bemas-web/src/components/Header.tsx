import React from 'react';
import { MapPin, Search, Bell, Key, UserCheck, Shield, Menu } from 'lucide-react';
import { User } from '../types';

interface HeaderProps {
  currentUser: User | null;
  onSwitchRole: () => void;
  onOpenApiKeyModal: () => void;
  onOpenAuthModal: () => void;
  onToggleMobileMenu?: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  onSwitchRole,
  onOpenApiKeyModal,
  onOpenAuthModal,
  searchQuery,
  setSearchQuery
}) => {
  return (
    <header className="bg-white border-b border-[#F0E5E1] px-4 sm:px-8 py-3.5 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
      {/* Location Picker (Figma Style) */}
      <div className="flex items-center gap-2 bg-[#FFF8F6] border border-[#F0E5E1] px-3.5 py-1.5 rounded-full text-xs font-semibold text-[#1E1715] cursor-pointer hover:border-orange-300 transition-colors shrink-0">
        <MapPin className="w-3.5 h-3.5 text-[#FF5722]" />
        <span>Balikpapan, Kaltim</span>
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#786C68" strokeWidth="2.5">
          <path d="m6 9 6 6 6-6"></path>
        </svg>
      </div>

      {/* Universal Search Bar (Figma Style) */}
      <div className="flex-1 max-w-xl mx-4 sm:mx-8 relative flex items-center">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#786C68] pointer-events-none flex items-center">
          <Search className="w-4 h-4 text-[#786C68]" />
        </span>
        <input 
          type="text" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari resep praktis, sayur, atau bahan dapur..." 
          className="w-full bg-[#FFF8F6] border border-[#F0E5E1] rounded-full pl-10 pr-12 py-2 text-xs text-[#1E1715] placeholder-[#786C68] focus:outline-hidden focus:border-[#FF5722] focus:bg-white transition-all font-medium"
        />
        <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] text-[#786C68] border border-[#F0E5E1] px-1.5 py-0.5 rounded bg-white font-mono pointer-events-none hidden sm:block">
          ⌘K
        </span>
      </div>

      {/* Actions, User & Settings */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Gemini API Key Setting */}
        <button
          onClick={onOpenApiKeyModal}
          title="Pengaturan Kunci API Gemini"
          className="w-9 h-9 rounded-full bg-[#FFF8F6] flex items-center justify-center text-[#786C68] hover:bg-orange-50 hover:text-[#FF5722] transition-colors"
        >
          <Key className="w-4 h-4" />
        </button>

        {/* Notification Bell */}
        <div className="w-9 h-9 rounded-full bg-[#FFF8F6] flex items-center justify-center text-[#786C68] relative cursor-pointer hover:bg-orange-50 hover:text-[#FF5722] transition-colors">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#FF5722]"></span>
        </div>

        {/* User Profile & Role Switcher */}
        <div 
          onClick={onOpenAuthModal}
          className="flex items-center gap-2 pl-2 border-l border-[#F0E5E1] cursor-pointer group"
          title="Klik untuk melihat akun / ganti profil"
        >
          <div className="w-9 h-9 rounded-full bg-[#FF5722] text-white flex items-center justify-center font-bold text-xs shadow-xs group-hover:scale-105 transition-transform">
            {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'G'}
          </div>
          <div className="leading-tight hidden sm:block text-left">
            <span className="block text-xs font-bold text-[#1E1715] group-hover:text-[#FF5722] transition-colors">
              {currentUser?.name || 'Dapur Utami'}
            </span>
            <span className="text-[10px] text-[#786C68] capitalize">
              {currentUser?.role === 'admin' ? '🛡️ Administrator' : 'Koki Rumahan'}
            </span>
          </div>
        </div>

        {/* Quick Role Toggle (Awesome for Presentations) */}
        <button
          onClick={onSwitchRole}
          className={`text-[10px] font-bold px-2.5 py-1 rounded-full border transition-all ${
            currentUser?.role === 'admin'
              ? 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100'
              : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
          }`}
          title="Beralih peran User / Admin"
        >
          {currentUser?.role === 'admin' ? 'Mode: Admin' : 'Mode: User'}
        </button>
      </div>
    </header>
  );
};
