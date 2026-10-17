import React from 'react';
import { MapPin, Search, Key, LogOut, LogIn, UserPlus } from 'lucide-react';
import { User } from '../types';

interface HeaderProps {
  currentUser: User | null;
  onOpenApiKeyModal: () => void;
  onNavigateToLogin: () => void;
  onNavigateToRegister: () => void;
  onLogout: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onSearchSubmit?: (q: string) => void;
  onLogoClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  onOpenApiKeyModal,
  onNavigateToLogin,
  onNavigateToRegister,
  onLogout,
  searchQuery,
  setSearchQuery,
  onSearchSubmit,
  onLogoClick
}) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onSearchSubmit) {
      e.preventDefault();
      onSearchSubmit(searchQuery);
    }
  };

  return (
    <header className="bg-white border-b border-[#F0E5E1] px-4 sm:px-8 py-3 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
      {/* Brand & Location Badge */}
      <div className="flex items-center gap-6 shrink-0">
        <div
          onClick={onLogoClick}
          className="cursor-pointer flex items-center gap-2 select-none group"
        >
          <span className="text-2xl font-black text-[#FF5722] tracking-tight group-hover:scale-105 transition-transform">
            BEMAS
          </span>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 bg-white border border-[#E5D7D2] px-3.5 py-1.5 rounded-full text-xs font-semibold text-[#1E1715] shadow-2xs">
          <MapPin className="w-3.5 h-3.5 text-[#FF5722]" />
          <span>Balikpapan, Kaltim</span>
        </div>
      </div>

      {/* Universal Search Bar */}
      <div className="flex-1 max-w-xl mx-4 sm:mx-8 relative flex items-center">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#786C68] pointer-events-none flex items-center">
          <Search className="w-4 h-4 text-[#786C68]" />
        </span>
        <input
          type="text"
          aria-label="Pencarian cepat kuliner"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Cari lokasi kuliner atau menu (tekan Enter)..."
          className="w-full bg-[#FAFAFA] border border-[#E5D7D2] rounded-full pl-10 pr-4 py-2 text-xs text-[#1E1715] placeholder-[#8E827E] focus:outline-hidden focus:border-[#FF5722] focus:bg-white transition-all font-medium"
        />
      </div>

      {/* Right Side: Gemini API Key & Auth Controls */}
      <div className="flex items-center gap-2.5 shrink-0">
        <button
          type="button"
          onClick={onOpenApiKeyModal}
          title="Atur Google Gemini API Key"
          aria-label="Atur Google Gemini API Key"
          className="w-8 h-8 rounded-full bg-[#FFF8F6] border border-[#F0E5E1] flex items-center justify-center text-[#786C68] hover:bg-orange-50 hover:text-[#FF5722] transition-colors"
        >
          <Key className="w-3.5 h-3.5" />
        </button>

        {currentUser ? (
          <div className="flex items-center gap-2">
            <div
              title={`Akun: ${currentUser.name} (${currentUser.role})`}
              className="flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-full bg-[#FFF8F6] border border-[#F0E5E1]"
            >
              <div className="w-7 h-7 rounded-full bg-[#FF5722] text-white flex items-center justify-center font-black text-xs shadow-xs">
                {currentUser.name.charAt(0).toUpperCase()}
              </div>
              <span className="text-xs font-bold text-[#1E1715] hidden md:inline max-w-[120px] truncate">
                {currentUser.name}
              </span>
            </div>

            <button
              type="button"
              onClick={onLogout}
              title="Keluar dari sesi akun"
              className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-xs font-bold transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Keluar</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onNavigateToLogin}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FFF8F6] hover:bg-[#FFEBE6] text-[#FF5722] border border-[#FFD8CF] text-xs font-bold transition-colors"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Masuk</span>
            </button>
            <button
              type="button"
              onClick={onNavigateToRegister}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FF5722] hover:bg-[#E64A19] text-white text-xs font-bold transition-colors shadow-2xs"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Daftar</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
