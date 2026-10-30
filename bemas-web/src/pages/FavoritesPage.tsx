import React, { useState, useEffect, useRef } from 'react';
import { ChefHat, MapPin, Heart, ArrowRight, Search, CheckCircle2 } from 'lucide-react';
import { User, Recipe, CulinaryPlace } from '../types';
import { storage } from '../services/storage';

interface FavoritesPageProps {
  currentUser: User | null;
  onNavigateToLogin: () => void;
  onNavigateToRecipe: () => void;
  onNavigateToMap: () => void;
}

export const FavoritesPage: React.FC<FavoritesPageProps> = ({
  currentUser,
  onNavigateToLogin,
  onNavigateToRecipe,
  onNavigateToMap
}) => {
  const [activeTab, setActiveTab] = useState<'recipes' | 'places'>('recipes');
  const [favoriteRecipes, setFavoriteRecipes] = useState<Recipe[]>([]);
  const [favoritePlaces, setFavoritePlaces] = useState<CulinaryPlace[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const loadFavorites = () => {
    if (currentUser) {
      setFavoriteRecipes(storage.getFavoriteRecipes(currentUser.id));
      setFavoritePlaces(storage.getFavoritePlaces(currentUser.id));
    } else {
      setFavoriteRecipes([]);
      setFavoritePlaces([]);
    }
  };

  useEffect(() => {
    loadFavorites();
  }, [currentUser]);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, []);

  const showToast = (msg: string) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToastMessage(msg);
    toastTimerRef.current = setTimeout(() => setToastMessage(null), 3000);
  };

  const handleRemoveRecipe = (recipe: Recipe) => {
    if (!currentUser) return;
    storage.removeFavoriteRecipe(currentUser.id, recipe.id);
    loadFavorites();
    showToast(`"${recipe.title}" dihapus dari favorit`);
  };

  const handleRemovePlace = (place: CulinaryPlace) => {
    if (!currentUser) return;
    storage.removeFavoritePlace(currentUser.id, place.id);
    loadFavorites();
    showToast(`"${place.name}" dihapus dari favorit`);
  };

  if (!currentUser) {
    return (
      <div className="py-12 max-w-xl mx-auto text-center space-y-6">
        <div className="w-20 h-20 bg-rose-50 border border-rose-200 text-rose-500 rounded-full flex items-center justify-center mx-auto shadow-sm">
          <Heart className="w-10 h-10 fill-rose-100" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-[#1E1715]">Daftar Favorit Terkunci</h2>
          <p className="text-xs sm:text-sm text-[#786C68] max-w-md mx-auto leading-relaxed">
            Sesuai spesifikasi SRS (UC-05 &amp; UC-06), Anda perlu masuk ke akun Dapur BEMAS untuk menyimpan dan melihat koleksi resep pilihan serta tempat kuliner favorit Anda.
          </p>
        </div>
        <div>
          <button
            type="button"
            onClick={onNavigateToLogin}
            className="px-6 py-3 bg-[#FF5722] hover:bg-[#E64A19] text-white rounded-2xl text-xs font-bold transition shadow-sm inline-flex items-center gap-2"
          >
            <span>Masuk ke Akun Sekarang</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  const cleanQuery = searchQuery.trim().toLowerCase();

  const filteredRecipes = favoriteRecipes.filter(r => {
    const title = (r.title || '').toLowerCase();
    const ingredients = Array.isArray(r.matchedIngredients) ? r.matchedIngredients : [];
    return title.includes(cleanQuery) || ingredients.some(i => (i || '').toLowerCase().includes(cleanQuery));
  });

  const filteredPlaces = favoritePlaces.filter(p => {
    const name = (p.name || '').toLowerCase();
    const address = (p.address || '').toLowerCase();
    const category = (p.category || '').toLowerCase();
    return name.includes(cleanQuery) || address.includes(cleanQuery) || category.includes(cleanQuery);
  });

  return (
    <div className="space-y-6 pb-16">
      {/* Toast */}
      {toastMessage && (
        <div
          role="status"
          className="fixed bottom-6 right-6 z-50 bg-[#1E1715] text-white text-xs px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 animate-bounce-subtle"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F0E5E1] shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-600 text-xs font-bold w-fit mb-2 border border-rose-100">
              <Heart className="w-3.5 h-3.5 fill-rose-500" />
              <span>Koleksi Favorit Pribadi (FR-05 &amp; FR-06)</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1E1715] tracking-tight">
              Favorit Pilihan {currentUser.name}
            </h2>
            <p className="text-xs sm:text-sm text-[#786C68] mt-1">
              Akses cepat ke resep masakan dan tempat kuliner yang telah Anda tandai.
            </p>
          </div>

          {/* Search in favorites */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#786C68]" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Cari dalam koleksi favorit..."
              className="w-full bg-[#FFF8F6] border border-[#F0E5E1] rounded-2xl pl-10 pr-4 py-2.5 text-xs text-[#1E1715] focus:outline-hidden focus:border-[#FF5722] font-medium"
            />
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center gap-2 border-t border-[#F0E5E1] pt-4">
          <button
            type="button"
            onClick={() => setActiveTab('recipes')}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'recipes'
                ? 'bg-[#FF5722] text-white shadow-2xs'
                : 'bg-white hover:bg-orange-50 text-[#786C68] border border-[#F0E5E1]'
            }`}
          >
            <ChefHat className="w-4 h-4" />
            <span>Resep Favorit (FR-05 / UC-05)</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                activeTab === 'recipes' ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-700'
              }`}
            >
              {favoriteRecipes.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('places')}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'places'
                ? 'bg-[#FF5722] text-white shadow-2xs'
                : 'bg-white hover:bg-orange-50 text-[#786C68] border border-[#F0E5E1]'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Kuliner Favorit (FR-06 / UC-06)</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                activeTab === 'places' ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-700'
              }`}
            >
              {favoritePlaces.length}
            </span>
          </button>
        </div>
      </div>

      {/* RECIPES TAB CONTENT */}
      {activeTab === 'recipes' && (
        <div>
          {filteredRecipes.length === 0 ? (
            <div className="bg-white rounded-3xl p-10 text-center border border-[#F0E5E1] space-y-4 shadow-2xs">
              <div className="w-16 h-16 rounded-2xl bg-orange-50 border border-orange-100 text-[#FF5722] flex items-center justify-center mx-auto">
                <ChefHat className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-[#1E1715]">
                  {searchQuery ? 'Tidak ada resep yang cocok dengan pencarian' : 'Belum Ada Resep yang Disimpan'}
                </h3>
                <p className="text-xs text-[#786C68] max-w-md mx-auto">
                  Jelajahi racikan resep AI berdasarkan bahan makanan di kulkas Anda, lalu klik ikon hati untuk menyimpannya ke sini.
                </p>
              </div>
              <button
                type="button"
                onClick={onNavigateToRecipe}
                className="px-5 py-2.5 bg-[#FF5722] hover:bg-[#E64A19] text-white rounded-xl text-xs font-bold transition inline-flex items-center gap-1.5 shadow-2xs"
              >
                <span>Jelajahi Resep AI</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRecipes.map(rec => (
                <div
                  key={rec.id}
                  className="bg-white rounded-3xl p-5 border border-[#F0E5E1] shadow-2xs hover:shadow-md transition flex flex-col justify-between group"
                >
                  <div>
                    <div className="relative h-44 w-full rounded-2xl overflow-hidden mb-3 bg-gray-100">
                      <img
                        src={rec.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80'}
                        alt={rec.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <button
                        type="button"
                        title="Hapus dari Favorit"
                        onClick={() => handleRemoveRecipe(rec)}
                        className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 text-rose-500 hover:bg-rose-50 flex items-center justify-center shadow-md transition"
                      >
                        <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
                      </button>
                    </div>

                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FFEBE6] text-[#FF5722]">
                        ⏱ {rec.prepTime}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
                        🍳 {rec.difficulty}
                      </span>
                    </div>

                    <h3 className="font-bold text-sm text-[#1E1715] mb-1 line-clamp-1">{rec.title}</h3>
                    <p className="text-xs text-[#786C68] line-clamp-2 mb-3">{rec.description}</p>
                  </div>

                  <div className="pt-3 border-t border-[#F0E5E1] flex items-center justify-between">
                    <span className="text-[11px] text-[#786C68] truncate max-w-[150px]">
                      {rec.matchedIngredients.join(', ')}
                    </span>
                    <button
                      type="button"
                      onClick={onNavigateToRecipe}
                      className="text-xs font-bold text-[#FF5722] hover:underline flex items-center gap-1"
                    >
                      <span>Masak Resep Ini</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* PLACES TAB CONTENT */}
      {activeTab === 'places' && (
        <div>
          {filteredPlaces.length === 0 ? (
            <div className="bg-white rounded-3xl p-10 text-center border border-[#F0E5E1] space-y-4 shadow-2xs">
              <div className="w-16 h-16 rounded-2xl bg-orange-50 border border-orange-100 text-[#FF5722] flex items-center justify-center mx-auto">
                <MapPin className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-[#1E1715]">
                  {searchQuery ? 'Tidak ada tempat kuliner yang cocok' : 'Belum Ada Lokasi Kuliner yang Disimpan'}
                </h3>
                <p className="text-xs text-[#786C68] max-w-md mx-auto">
                  Buka Peta Kuliner GIS untuk menemukan kuliner lezat di Balikpapan, lalu tandai sebagai favorit Anda.
                </p>
              </div>
              <button
                type="button"
                onClick={onNavigateToMap}
                className="px-5 py-2.5 bg-[#FF5722] hover:bg-[#E64A19] text-white rounded-xl text-xs font-bold transition inline-flex items-center gap-1.5 shadow-2xs"
              >
                <span>Buka Peta Kuliner GIS</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPlaces.map(place => (
                <div
                  key={place.id}
                  className="bg-white rounded-3xl p-5 border border-[#F0E5E1] shadow-2xs hover:shadow-md transition flex flex-col justify-between group"
                >
                  <div>
                    <div className="relative h-44 w-full rounded-2xl overflow-hidden mb-3 bg-gray-100">
                      <img
                        src={place.imageUrl}
                        alt={place.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <button
                        type="button"
                        title="Hapus dari Favorit"
                        onClick={() => handleRemovePlace(place)}
                        className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 text-rose-500 hover:bg-rose-50 flex items-center justify-center shadow-md transition"
                      >
                        <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                        {place.category}
                      </span>
                      <span className="text-xs font-bold text-yellow-600 flex items-center gap-0.5">
                        ★ {place.rating}
                      </span>
                    </div>

                    <h3 className="font-bold text-sm text-[#1E1715] mb-1">{place.name}</h3>
                    <p className="text-xs text-[#786C68] line-clamp-1 mb-2">{place.address}</p>
                    <p className="text-[11px] text-[#FF5722] font-semibold line-clamp-1">
                      Menu Unggulan: {place.featuredMenu}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#F0E5E1] flex items-center justify-between mt-3">
                    <span className="text-[11px] text-[#786C68] font-medium">
                      {place.operatingHours}
                    </span>
                    <button
                      type="button"
                      onClick={onNavigateToMap}
                      className="text-xs font-bold text-[#FF5722] hover:underline flex items-center gap-1"
                    >
                      <span>Lihat di Peta</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
