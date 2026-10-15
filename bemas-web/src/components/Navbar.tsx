import React from 'react';
import { ChefHat, MapPin, Heart, ShieldAlert, Key, UserCheck, MessageSquarePlus } from 'lucide-react';
import { User } from '../types';

interface NavbarProps {
  activeTab: 'recipe' | 'map' | 'favorites' | 'admin' | 'reports';
  setActiveTab: (tab: 'recipe' | 'map' | 'favorites' | 'admin' | 'reports') => void;
  currentUser: User | null;
  onSwitchRole: () => void;
  onOpenApiKeyModal: () => void;
  onOpenReportModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  onSwitchRole,
  onOpenApiKeyModal,
  onOpenReportModal
}) => {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-orange-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div 
            onClick={() => setActiveTab('recipe')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-orange-500 to-amber-400 flex items-center justify-center text-white shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform">
              <ChefHat className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight text-slate-900">BEMAS</span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-sm bg-orange-100 text-orange-700">
                  AI & GIS
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-500 hidden sm:block">Beli atau Masak</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setActiveTab('recipe')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'recipe'
                  ? 'bg-orange-50 text-orange-600 shadow-xs'
                  : 'text-slate-600 hover:text-orange-600 hover:bg-slate-50'
              }`}
            >
              <ChefHat className="w-4 h-4" />
              <span>Masak (AI)</span>
            </button>

            <button
              onClick={() => setActiveTab('map')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'map'
                  ? 'bg-orange-50 text-orange-600 shadow-xs'
                  : 'text-slate-600 hover:text-orange-600 hover:bg-slate-50'
              }`}
            >
              <MapPin className="w-4 h-4" />
              <span>Beli (Peta)</span>
            </button>

            <button
              onClick={() => setActiveTab('favorites')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'favorites'
                  ? 'bg-orange-50 text-orange-600 shadow-xs'
                  : 'text-slate-600 hover:text-orange-600 hover:bg-slate-50'
              }`}
            >
              <Heart className="w-4 h-4" />
              <span className="hidden sm:inline">Favorit</span>
            </button>

            {currentUser?.role === 'admin' ? (
              <button
                onClick={() => setActiveTab('admin')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                  activeTab === 'admin'
                    ? 'bg-indigo-50 text-indigo-600 shadow-xs ring-1 ring-indigo-200'
                    : 'text-slate-600 hover:text-indigo-600 hover:bg-indigo-50/50'
                }`}
              >
                <ShieldAlert className="w-4 h-4 text-indigo-600" />
                <span>Admin</span>
              </button>
            ) : null}
          </nav>

          {/* Actions & Role Switcher */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenReportModal}
              title="Kirim Laporan / Feedback Kendala"
              className="p-2 rounded-lg text-slate-500 hover:text-orange-600 hover:bg-orange-50 transition-colors"
            >
              <MessageSquarePlus className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenApiKeyModal}
              title="Pengaturan Google Gemini API Key"
              className="p-2 rounded-lg text-slate-500 hover:text-orange-600 hover:bg-orange-50 transition-colors"
            >
              <Key className="w-4 h-4" />
            </button>

            {/* Quick Demo Role Switcher (Awesome for Presentation!) */}
            <div className="flex items-center pl-2 border-l border-slate-200">
              <button
                onClick={onSwitchRole}
                className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-full border transition-all ${
                  currentUser?.role === 'admin'
                    ? 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100'
                    : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                }`}
                title="Klik untuk beralih peran Akun User / Admin saat presentasi"
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span className="capitalize">{currentUser?.role || 'Guest'}</span>
                <span className="text-[10px] bg-white/80 px-1 py-0.2 rounded text-slate-600">Ganti</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
