import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { RecipeSection } from './components/RecipeSection';
import { MapSection } from './components/MapSection';
import { FavoritesPage } from './pages/FavoritesPage';

import { HelpSection } from './components/HelpSection';
import { AdminPanel } from './components/AdminPanel';
import { ApiKeyModal } from './components/ApiKeyModal';
import { ReportModal } from './components/ReportModal';
import { storage, DEFAULT_USERS } from './services/storage';
import { User } from './types';
import { ChefHat, MapPin, Heart, HelpCircle, Shield, Home } from 'lucide-react';

export function App() {
  // Page Routing: 'app' | 'login' | 'register'
  const [currentView, setCurrentView] = useState<'app' | 'login' | 'register'>('app');
  
  // Tabs inside 'app': 'home' | 'recipe' | 'map' | 'favorites' | 'admin' | 'help'
  const [activeTab, setActiveTab] = useState<'home' | 'recipe' | 'map' | 'favorites' | 'admin' | 'help'>('home');
  const [currentUser, setCurrentUser] = useState<User | null>(storage.getCurrentUser());
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  // Quick switch role between user and admin
  const handleSwitchRole = () => {
    if (currentUser?.role === 'admin') {
      const regularUser = DEFAULT_USERS[0];
      storage.setCurrentUser(regularUser);
      setCurrentUser(regularUser);
      if (activeTab === 'admin') setActiveTab('home');
    } else {
      const adminUser = DEFAULT_USERS[1];
      storage.setCurrentUser(adminUser);
      setCurrentUser(adminUser);
      setActiveTab('admin');
    }
  };

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    setCurrentView('app');
    setActiveTab('home');
  };

  // 1. DEDICATED LOGIN PAGE (Matches login.html)
  if (currentView === 'login') {
    return (
      <LoginPage
        onLoginSuccess={handleLoginSuccess}
        onNavigateToRegister={() => setCurrentView('register')}
        onNavigateToHelp={() => {
          setCurrentView('app');
          setActiveTab('help');
        }}
      />
    );
  }

  // 2. DEDICATED REGISTER PAGE (Matches daftar-akun.html)
  if (currentView === 'register') {
    return (
      <RegisterPage
        onRegisterSuccess={handleLoginSuccess}
        onNavigateToLogin={() => setCurrentView('login')}
      />
    );
  }

  // 3. MAIN DASHBOARD VIEW (Sidebar + Header + Page Content)
  return (
    <div className="flex min-h-screen bg-[#FFF8F6] text-[#1E1715] antialiased justify-center selection:bg-[#FF5722] selection:text-white">
      {/* WRAPPER UTAMA (Maksimal 1440px sesuai desain Figma) */}
      <div className="flex w-full max-w-[1440px] min-h-screen">
        
        {/* SIDEBAR (260px Sticky) */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          currentUser={currentUser}
          onNavigateToLogin={() => setCurrentView('login')}
        />

        {/* MAIN AREA */}
        <div className="flex-1 flex flex-col min-w-0">
          
          {/* HEADER TOP BAR */}
          <Header
            currentUser={currentUser}
            onSwitchRole={handleSwitchRole}
            onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
            onOpenAuthModal={() => setCurrentView('login')}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />

          {/* CONTENT BODY */}
          <main className="p-4 sm:p-8 space-y-6 max-w-7xl w-full flex-1">
            {activeTab === 'home' && (
              <HomePage
                currentUser={currentUser}
                onNavigateToRecipe={() => setActiveTab('recipe')}
                onNavigateToMap={() => setActiveTab('map')}
                onNavigateToFavorites={() => setActiveTab('favorites')}
              />
            )}

            {activeTab === 'recipe' && (
              <RecipeSection onGoToMap={() => setActiveTab('map')} />
            )}

            {activeTab === 'map' && (
              <MapSection onGoToRecipe={() => setActiveTab('recipe')} />
            )}

            {activeTab === 'favorites' && (
              <FavoritesPage
                onGoToRecipe={() => setActiveTab('recipe')}
                onGoToMap={() => setActiveTab('map')}
              />
            )}


            {activeTab === 'help' && (
              <HelpSection
                currentUser={currentUser}
                onOpenReportModal={() => setIsReportModalOpen(true)}
              />
            )}

            {activeTab === 'admin' && (
              <AdminPanel />
            )}
          </main>

          {/* Academic Footer */}
          <footer className="px-8 py-6 border-t border-[#F0E5E1] bg-white/60 text-xs text-[#786C68] flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
            <div>
              <span className="font-extrabold text-[#1E1715]">BEMAS (Beli atau Masak)</span> — Tugas Besar IPPL 2026 • ITK Balikpapan
            </div>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setCurrentView('login')}
                className="hover:text-[#FF5722] font-semibold"
              >
                Halaman Login
              </button>
              <span>•</span>
              <button 
                onClick={() => setCurrentView('register')}
                className="hover:text-[#FF5722] font-semibold"
              >
                Halaman Daftar
              </button>
              <span>•</span>
              <span className="font-semibold text-[#FF5722]">
                Giva Asilah Hasna’a Putri (11241034)
              </span>
            </div>
          </footer>
        </div>
      </div>

      {/* MOBILE BOTTOM NAVIGATION BAR (for small screens) */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#F0E5E1] flex items-center justify-around py-2.5 px-3 md:hidden shadow-lg">
        <button
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center gap-1 text-[10px] font-bold ${
            activeTab === 'home' ? 'text-[#FF5722]' : 'text-[#786C68]'
          }`}
        >
          <Home className="w-5 h-5" />
          <span>Beranda</span>
        </button>

        <button
          onClick={() => setActiveTab('recipe')}
          className={`flex flex-col items-center gap-1 text-[10px] font-bold ${
            activeTab === 'recipe' ? 'text-[#FF5722]' : 'text-[#786C68]'
          }`}
        >
          <ChefHat className="w-5 h-5" />
          <span>Resep</span>
        </button>

        <button
          onClick={() => setActiveTab('map')}
          className={`flex flex-col items-center gap-1 text-[10px] font-bold ${
            activeTab === 'map' ? 'text-[#FF5722]' : 'text-[#786C68]'
          }`}
        >
          <MapPin className="w-5 h-5" />
          <span>Kuliner</span>
        </button>

        <button
          onClick={() => setActiveTab('favorites')}
          className={`flex flex-col items-center gap-1 text-[10px] font-bold ${
            activeTab === 'favorites' ? 'text-[#FF5722]' : 'text-[#786C68]'
          }`}
        >
          <Heart className="w-5 h-5" />
          <span>Favorit</span>
        </button>

        <button
          onClick={() => setActiveTab('help')}
          className={`flex flex-col items-center gap-1 text-[10px] font-bold ${
            activeTab === 'help' ? 'text-[#FF5722]' : 'text-[#786C68]'
          }`}
        >
          <HelpCircle className="w-5 h-5" />
          <span>Bantuan</span>
        </button>

        {currentUser?.role === 'admin' && (
          <button
            onClick={() => setActiveTab('admin')}
            className={`flex flex-col items-center gap-1 text-[10px] font-bold ${
              activeTab === 'admin' ? 'text-indigo-600' : 'text-[#786C68]'
            }`}
          >
            <Shield className="w-5 h-5" />
            <span>Admin</span>
          </button>
        )}
      </nav>

      {/* MODALS */}

      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
      />

      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        currentUser={currentUser}
      />
    </div>
  );
}

export default App;
