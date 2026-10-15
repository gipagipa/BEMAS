import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { RecipeSection } from './components/RecipeSection';
import { MapSection } from './components/MapSection';
import { FavoritesSection } from './components/FavoritesSection';
import { AdminPanel } from './components/AdminPanel';
import { AuthModal } from './components/AuthModal';
import { ApiKeyModal } from './components/ApiKeyModal';
import { ReportModal } from './components/ReportModal';
import { Footer } from './components/Footer';
import { storage, DEFAULT_USERS } from './services/storage';
import { User } from './types';

export function App() {
  const [activeTab, setActiveTab] = useState<'recipe' | 'map' | 'favorites' | 'admin' | 'reports'>('recipe');
  const [currentUser, setCurrentUser] = useState<User | null>(storage.getCurrentUser());

  // Modals
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  // Quick switch role between user and admin (great for video demos!)
  const handleSwitchRole = () => {
    if (currentUser?.role === 'admin') {
      const regularUser = DEFAULT_USERS[0];
      storage.setCurrentUser(regularUser);
      setCurrentUser(regularUser);
      if (activeTab === 'admin') setActiveTab('recipe');
    } else {
      const adminUser = DEFAULT_USERS[1];
      storage.setCurrentUser(adminUser);
      setCurrentUser(adminUser);
      setActiveTab('admin');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col selection:bg-orange-500 selection:text-white">
      {/* Top Banner indicating Prototype progress for UTS */}
      <div className="bg-slate-900 text-slate-300 text-[11px] py-1.5 px-4 text-center border-b border-slate-800 flex items-center justify-center gap-2">
        <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        <span className="font-semibold text-white">BEMAS Prototype UTS IPPL</span>
        <span className="text-slate-400">| Status: 11 / 11 Use Case Siap Diuji (Progress &gt; 50%)</span>
        <button
          onClick={() => setIsAuthModalOpen(true)}
          className="ml-2 text-orange-400 hover:text-orange-300 font-bold underline"
        >
          {currentUser ? `Akun: ${currentUser.name}` : 'Login / Ganti Akun'}
        </button>
      </div>

      {/* Main Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        onSwitchRole={handleSwitchRole}
        onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
        onOpenReportModal={() => setIsReportModalOpen(true)}
      />

      {/* Body Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {activeTab === 'recipe' && (
          <RecipeSection onGoToMap={() => setActiveTab('map')} />
        )}

        {activeTab === 'map' && (
          <MapSection onGoToRecipe={() => setActiveTab('recipe')} />
        )}

        {activeTab === 'favorites' && (
          <FavoritesSection
            onGoToRecipe={() => setActiveTab('recipe')}
            onGoToMap={() => setActiveTab('map')}
          />
        )}

        {activeTab === 'admin' && (
          <AdminPanel />
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Modals */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={(user) => setCurrentUser(user)}
      />

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
