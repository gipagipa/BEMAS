import React from 'react';
import { Home, ChefHat, MapPin, Heart, LogIn, LogOut } from 'lucide-react';
import { User } from '../types';

export type EssentialTab = 'home' | 'recipe' | 'map' | 'favorites';

interface SidebarProps {
  activeTab: EssentialTab;
  setActiveTab: (tab: EssentialTab) => void;
  currentUser: User | null;
  onNavigateToLogin: () => void;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  onNavigateToLogin,
  onLogout
}) => {
  const menuItems: { id: EssentialTab; label: string; icon: typeof Home }[] = [
    {
      id: 'home',
      label: 'Home',
      icon: Home
    },
    {
      id: 'recipe',
      label: 'Resep AI',
      icon: ChefHat
    },
    {
      id: 'map',
      label: 'Kuliner GIS',
      icon: MapPin
    },
    {
      id: 'favorites',
      label: 'Favorit Saya',
      icon: Heart
    }
  ];

  return (
    <aside className="w-[180px] sm:w-[200px] min-w-[180px] sm:min-w-[200px] bg-transparent py-6 pr-4 flex flex-col justify-between shrink-0 hidden md:flex">
      {/* Navigation Menu Items (Prototype ~50% Scope: 6/11 Use Cases = 54.55%) */}
      <nav aria-label="Menu Utama" className="space-y-1.5">
        {menuItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-sm transition-all text-left ${
                isActive
                  ? 'bg-[#FDEEE9] text-[#FF5722]'
                  : 'text-[#4B5563] hover:text-[#1E1715] hover:bg-orange-50/60 font-semibold'
              }`}
            >
              <Icon
                className={`w-5 h-5 ${
                  isActive ? 'text-[#FF5722] stroke-[2.2]' : 'text-[#5E5856] stroke-[1.8]'
                }`}
              />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Account Session Action */}
      <div className="pt-4 border-t border-[#F0E5E1]/60">
        {currentUser ? (
          <div className="space-y-2">
            <div className="px-3 py-2 rounded-xl bg-[#FFF8F6] border border-[#F0E5E1] text-[11px]">
              <div className="font-bold text-[#1E1715] truncate">{currentUser.name}</div>
              <div className="text-[10px] text-[#FF5722] font-semibold uppercase">
                {currentUser.role === 'admin' ? 'Admin' : currentUser.role === 'mitra' ? 'Mitra Kuliner' : 'User'}
              </div>
            </div>
            <button
              type="button"
              onClick={onLogout}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-red-600 hover:bg-red-50 font-semibold transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Keluar Akun</span>
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={onNavigateToLogin}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-[#786C68] hover:text-[#FF5722] font-semibold transition-colors"
          >
            <LogIn className="w-4 h-4" />
            <span>Masuk Akun</span>
          </button>
        )}
      </div>
    </aside>
  );
};
