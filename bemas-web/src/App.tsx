import { useState } from 'react';
import { Sidebar, EssentialTab } from './components/Sidebar';
import { Header } from './components/Header';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { RecipeSection } from './components/RecipeSection';
import { MapSection } from './components/MapSection';
import { ApiKeyModal } from './components/ApiKeyModal';
import { storage } from './services/storage';
import { User } from './types';
import { ChefHat, MapPin, Home, LogIn } from 'lucide-react';

export function App() {
  // Page Routing: 'app' | 'login' | 'register'
  const [currentView, setCurrentView] = useState<'app' | 'login' | 'register'>('app');

  // Essential Tabs inside 'app': 'home' | 'recipe' (FR-03) | 'map' (FR-04)
  const [activeTab, setActiveTab] = useState<EssentialTab>('home');
  const [currentUser, setCurrentUser] = useState<User | null>(() => storage.getCurrentUser());
  const [searchQuery, setSearchQuery] = useState('');

  // Post-registration state for UC-01 Step 6 -> Redirect to Login with registered email
  const [registeredEmail, setRegisteredEmail] = useState<string>('');
  const [registrationSuccessNotice, setRegistrationSuccessNotice] = useState(false);

  // Gemini API Key Modal
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    setRegistrationSuccessNotice(false);
    setCurrentView('app');
    setActiveTab('home');
  };

  const handleRegisterSuccess = (email: string) => {
    setRegisteredEmail(email);
    setRegistrationSuccessNotice(true);
    setCurrentView('login');
  };

  const handleLogout = () => {
    storage.logoutUser();
    setCurrentUser(null);
    setActiveTab('home');
  };

  const handleGlobalSearchSubmit = (query: string) => {
    setSearchQuery(query);
    if (activeTab !== 'map') {
      setActiveTab('map');
    }
  };

  // 1. DEDICATED LOGIN PAGE (FR-02 / UC-02)
  if (currentView === 'login') {
    return (
      <LoginPage
        onLoginSuccess={handleLoginSuccess}
        onNavigateToRegister={() => {
          setRegistrationSuccessNotice(false);
          setCurrentView('register');
        }}
        onNavigateToHome={() => setCurrentView('app')}
        initialEmail={registeredEmail}
        registrationSuccessNotice={registrationSuccessNotice}
      />
    );
  }

  // 2. DEDICATED REGISTER PAGE (FR-01 / UC-01)
  if (currentView === 'register') {
    return (
      <RegisterPage
        onRegisterSuccess={handleRegisterSuccess}
        onNavigateToLogin={() => {
          setRegistrationSuccessNotice(false);
          setCurrentView('login');
        }}
        onNavigateToHome={() => setCurrentView('app')}
      />
    );
  }

  // 3. MAIN PROTOTYPE DASHBOARD VIEW
  return (
    <div className="min-h-screen bg-[#FFF8F6] text-[#1E1715] flex flex-col antialiased selection:bg-[#FF5722] selection:text-white">
      <Header
        currentUser={currentUser}
        onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
        onNavigateToLogin={() => {
          setRegistrationSuccessNotice(false);
          setCurrentView('login');
        }}
        onNavigateToRegister={() => {
          setRegistrationSuccessNotice(false);
          setCurrentView('register');
        }}
        onLogout={handleLogout}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearchSubmit={handleGlobalSearchSubmit}
        onLogoClick={() => setActiveTab('home')}
      />

      <div className="flex-1 flex w-full max-w-[1440px] mx-auto px-4 sm:px-8">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          currentUser={currentUser}
          onNavigateToLogin={() => {
            setRegistrationSuccessNotice(false);
            setCurrentView('login');
          }}
          onLogout={handleLogout}
        />

        <div className="flex-1 flex flex-col min-w-0">
          <main className="py-6 sm:py-8 space-y-6 w-full flex-1">
            {activeTab === 'home' && (
              <HomePage
                onNavigateToRecipe={() => setActiveTab('recipe')}
                onNavigateToMap={() => setActiveTab('map')}
              />
            )}

            {activeTab === 'recipe' && (
              <RecipeSection
                onGoToMap={() => setActiveTab('map')}
                onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
              />
            )}

            {activeTab === 'map' && (
              <MapSection
                onGoToRecipe={() => setActiveTab('recipe')}
                externalSearchQuery={searchQuery}
              />
            )}
          </main>

          {/* Academic Footer */}
          <footer className="px-8 py-6 border-t border-[#F0E5E1] bg-white/60 text-xs text-[#786C68] flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
            <div>
              <span className="font-extrabold text-[#1E1715]">BEMAS (Beli atau Masak)</span> — Prototype Tugas Besar IPPL 2026 (Progress Esensial: 4/11 Fitur = 36,36%)
            </div>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => {
                  setRegistrationSuccessNotice(false);
                  setCurrentView('login');
                }}
                className="hover:text-[#FF5722] font-semibold"
              >
                Halaman Login (UC-02)
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => {
                  setRegistrationSuccessNotice(false);
                  setCurrentView('register');
                }}
                className="hover:text-[#FF5722] font-semibold"
              >
                Halaman Daftar (UC-01)
              </button>
              <span>•</span>
              <span className="font-semibold text-[#FF5722]">
                Giva Asilah Hasna’a Putri (11241034)
              </span>
            </div>
          </footer>
        </div>
      </div>

      {/* MOBILE BOTTOM NAVIGATION BAR */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#F0E5E1] flex items-center justify-around py-2.5 px-3 md:hidden shadow-lg">
        <button
          type="button"
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center gap-1 text-[10px] font-bold ${
            activeTab === 'home' ? 'text-[#FF5722]' : 'text-[#786C68]'
          }`}
        >
          <Home className="w-5 h-5" />
          <span>Beranda</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('recipe')}
          className={`flex flex-col items-center gap-1 text-[10px] font-bold ${
            activeTab === 'recipe' ? 'text-[#FF5722]' : 'text-[#786C68]'
          }`}
        >
          <ChefHat className="w-5 h-5" />
          <span>Resep AI</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('map')}
          className={`flex flex-col items-center gap-1 text-[10px] font-bold ${
            activeTab === 'map' ? 'text-[#FF5722]' : 'text-[#786C68]'
          }`}
        >
          <MapPin className="w-5 h-5" />
          <span>Kuliner</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setRegistrationSuccessNotice(false);
            setCurrentView('login');
          }}
          className="flex flex-col items-center gap-1 text-[10px] font-bold text-[#786C68]"
        >
          <LogIn className="w-5 h-5" />
          <span>{currentUser ? 'Akun' : 'Masuk'}</span>
        </button>
      </nav>

      {/* GEMINI API KEY MODAL */}
      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
      />
    </div>
  );
}

export default App;
