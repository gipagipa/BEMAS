import React from 'react';
import { MapPin, Search, Bell, Key, Scan, ChevronDown } from 'lucide-react';
import { User } from '../types';

interface HeaderProps {
  currentUser: User | null;
  onSwitchRole: () => void;
  onOpenApiKeyModal: () => void;
  onOpenAuthModal: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onLogoClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  onSwitchRole,
  onOpenApiKeyModal,
  onOpenAuthModal,
  searchQuery,
  setSearchQuery,
  onLogoClick
}) => {
  return (
    <header className="bg-white border-b border-[#F0E5E1] px-4 sm:px-8 py-3 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
      {/* Brand & Location Picker (Exact Figma Design) */}
      <div className="flex items-center gap-6 shrink-0">
        {/* Logo Text BEMAS */}
        <div 
          onClick={onLogoClick}
          className="cursor-pointer flex items-center gap-2 select-none group"
        >
          <span className="text-2xl font-black text-[#FF5722] tracking-tight group-hover:scale-105 transition-transform">
            BEMAS
          </span>
        </div>

        {/* Location Dropdown Pill */}
        <div className="hidden sm:flex items-center gap-1.5 bg-white border border-[#E5D7D2] px-3.5 py-1.5 rounded-full text-xs font-semibold text-[#1E1715] hover:border-[#FF5722] transition-colors cursor-pointer shadow-2xs">
          <MapPin className="w-3.5 h-3.5 text-[#FF5722]" />
          <span>Balikpapan, Kaltim</span>
          <ChevronDown className="w-3.5 h-3.5 text-[#786C68]" />
        </div>
      </div>

      {/* Universal Search Bar with Scan Icon (Exact Figma Design) */}
      <div className="flex-1 max-w-xl mx-4 sm:mx-8 relative flex items-center">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#786C68] pointer-events-none flex items-center">
          <Search className="w-4 h-4 text-[#786C68]" />
        </span>
        <input 
          type="text" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari resep, bahan, atau lokasi kuliner..." 
          className="w-full bg-[#FAFAFA] border border-[#E5D7D2] rounded-full pl-10 pr-10 py-2 text-xs text-[#1E1715] placeholder-[#8E827E] focus:outline-hidden focus:border-[#FF5722] focus:bg-white transition-all font-medium"
        />
        {/* Barcode/Scan icon on right */}
        <button
          type="button"
          title="Scan bahan / barcode"
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#786C68] hover:text-[#FF5722] transition-colors"
        >
          <Scan className="w-4 h-4" />
        </button>
      </div>

      {/* Right Side: Key, Notifications, Avatar (Exact Figma) */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Gemini API Key Trigger */}
        <button
          onClick={onOpenApiKeyModal}
          title="Atur Google Gemini API Key"
          className="w-8 h-8 rounded-full bg-[#FFF8F6] border border-[#F0E5E1] flex items-center justify-center text-[#786C68] hover:bg-orange-50 hover:text-[#FF5722] transition-colors"
        >
          <Key className="w-3.5 h-3.5" />
        </button>

        {/* Bell with Badge '0' (Exact Figma) */}
        <div className="relative cursor-pointer p-1.5 text-[#4B5563] hover:text-[#FF5722] transition-colors">
          <Bell className="w-5 h-5 stroke-[1.8]" />
          <span className="absolute top-0 right-0 w-4 h-4 rounded-full bg-transparent text-[11px] font-bold text-[#4B5563] flex items-center justify-center">
            0
          </span>
        </div>

        {/* Orange Circular Avatar 'U' (Exact Figma) */}
        <div 
          onClick={onOpenAuthModal}
          title={`Akun: ${currentUser?.name || 'User'} (${currentUser?.role || 'user'})`}
          className="w-9 h-9 rounded-full bg-[#FF5722] text-white flex items-center justify-center font-black text-sm shadow-xs cursor-pointer hover:scale-105 transition-transform"
        >
          {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
        </div>

        {/* Quick Admin Mode Switcher for presentation */}
        <button
          onClick={onSwitchRole}
          className={`text-[10px] font-bold px-2 py-1 rounded-full border transition-all hidden lg:block ${
            currentUser?.role === 'admin'
              ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
              : 'bg-orange-50 text-[#FF5722] border-orange-200'
          }`}
          title="Klik untuk beralih mode User / Admin"
        >
          {currentUser?.role === 'admin' ? 'Admin' : 'User'}
        </button>
      </div>
    </header>
  );
};
