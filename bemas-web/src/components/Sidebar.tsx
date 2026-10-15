import React from 'react';
import { Home, ChefHat, MapPin, Bookmark, HelpCircle, Shield, LogIn } from 'lucide-react';
import { User } from '../types';

interface SidebarProps {
  activeTab: 'home' | 'recipe' | 'map' | 'favorites' | 'admin' | 'help';
  setActiveTab: (tab: 'home' | 'recipe' | 'map' | 'favorites' | 'admin' | 'help') => void;
  currentUser: User | null;
  onNavigateToLogin: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  onNavigateToLogin
}) => {
  const menuItems = [
    {
      id: 'home' as const,
      label: 'Home',
      icon: Home
    },
    {
      id: 'recipe' as const,
      label: 'Resep',
      icon: ChefHat
    },
    {
      id: 'map' as const,
      label: 'Kuliner',
      icon: MapPin
    },
    {
      id: 'favorites' as const,
      label: 'Favorit',
      icon: Bookmark
    },
    {
      id: 'help' as const,
      label: 'Bantuan',
      icon: HelpCircle
    }
  ];

  return (
    <aside className="w-[180px] sm:w-[200px] min-w-[180px] sm:min-w-[200px] bg-transparent py-6 pr-4 flex flex-col justify-between shrink-0 hidden md:flex">
      {/* Exact 5 Navigation Menu Items */}
      <nav className="space-y-1.5">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-sm transition-all text-left ${
                isActive
                  ? 'bg-[#FDEEE9] text-[#FF5722]'
                  : 'text-[#4B5563] hover:text-[#1E1715] hover:bg-orange-50/60 font-semibold'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-[#FF5722] stroke-[2.2]' : 'text-[#5E5856] stroke-[1.8]'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}

        {/* Admin Tab (Only when admin role is active) */}
        {currentUser?.role === 'admin' && (
          <button
            onClick={() => setActiveTab('admin')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-sm transition-all text-left mt-3 ${
              activeTab === 'admin'
                ? 'bg-indigo-50 text-indigo-700'
                : 'text-[#4B5563] hover:text-indigo-700 hover:bg-indigo-50/50 font-semibold'
            }`}
          >
            <Shield className="w-5 h-5 text-indigo-600 stroke-[1.8]" />
            <span>Admin</span>
          </button>
        )}
      </nav>

      {/* Subtle Link to Switch Account / Auth */}
      <div className="pt-4 border-t border-[#F0E5E1]/60">
        <button
          onClick={onNavigateToLogin}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-[#786C68] hover:text-[#FF5722] transition-colors"
        >
          <LogIn className="w-4 h-4" />
          <span>Ganti Akun</span>
        </button>
      </div>
    </aside>
  );
};
