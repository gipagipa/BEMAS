import React, { useState } from 'react';
import { Heart, Clock, Star, ExternalLink, Trash2, ChefHat, MapPin } from 'lucide-react';
import { CulinaryPlace, Recipe } from '../types';
import { storage } from '../services/storage';

interface FavoritesSectionProps {
  onGoToRecipe: () => void;
  onGoToMap: () => void;
}

export const FavoritesSection: React.FC<FavoritesSectionProps> = ({ onGoToRecipe, onGoToMap }) => {
  const [activeTab, setActiveTab] = useState<'recipes' | 'places'>('recipes');
  
  const favRecipeIds = storage.getFavoriteRecipeIds();
  const cachedRecipes: Recipe[] = JSON.parse(localStorage.getItem('bemas_cached_recipes') || '[]');
  const favoriteRecipes = cachedRecipes.filter(r => favRecipeIds.includes(r.id));

  const favPlaceIds = storage.getFavoritePlaceIds();
  const allPlaces = storage.getPlaces();
  const [favoritePlaces, setFavoritePlaces] = useState<CulinaryPlace[]>(
    allPlaces.filter(p => favPlaceIds.includes(p.id))
  );

  const handleRemovePlace = (placeId: string) => {
    storage.toggleFavoritePlace(placeId);
    setFavoritePlaces(prev => prev.filter(p => p.id !== placeId));
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Breadcrumbs (Figma Exact) */}
      <div className="flex items-center gap-2 text-xs text-[#786C68] font-medium">
        <span>Beranda</span>
        <span className="text-[10px] text-[#786C68]">›</span>
        <span className="text-[#FF5722] font-semibold">Koleksi Favorit</span>
      </div>

      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F0E5E1] shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFEBE6] text-[#FF5722] text-xs font-bold mb-2">
            <Heart className="w-3.5 h-3.5 fill-current" />
            <span>Koleksi Pribadi (UC-05 &amp; UC-06)</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#1E1715]">
            Resep &amp; Tempat Kuliner Favoritmu
          </h2>
          <p className="text-xs sm:text-sm text-[#786C68] mt-1">
            Daftar resep olahan masakan dan titik lokasi kuliner yang telah Anda tandai untuk diakses cepat.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-[#FFF8F6] p-1.5 rounded-2xl border border-[#F0E5E1]">
          <button
            onClick={() => setActiveTab('recipes')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'recipes' 
                ? 'bg-[#FF5722] text-white shadow-xs' 
                : 'text-[#786C68] hover:text-[#1E1715]'
            }`}
          >
            Resep ({favoriteRecipes.length})
          </button>
          <button
            onClick={() => setActiveTab('places')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'places' 
                ? 'bg-[#FF5722] text-white shadow-xs' 
                : 'text-[#786C68] hover:text-[#1E1715]'
            }`}
          >
            Tempat Makan ({favoritePlaces.length})
          </button>
        </div>
      </div>

      {/* Content */}
      {activeTab === 'recipes' && (
        <div>
          {favoriteRecipes.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-[#F0E5E1] shadow-2xs">
              <ChefHat className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="font-bold text-[#1E1715] text-base mb-1">Belum Ada Resep Favorit</h3>
              <p className="text-xs text-[#786C68] max-w-sm mx-auto mb-4">
                Jelajahi fitur rekomendasi AI, lalu klik ikon bookmark untuk menyimpan resep olahan pilihan Anda di sini.
              </p>
              <button
                onClick={onGoToRecipe}
                className="px-5 py-2.5 rounded-2xl bg-[#FF5722] hover:bg-[#E64A19] text-white text-xs font-bold transition shadow-xs"
              >
                Cari Resep Olahan AI Sekarang →
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favoriteRecipes.map(recipe => (
                <div key={recipe.id} className="bg-white rounded-3xl p-6 border border-[#F0E5E1] shadow-2xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-[#FFEBE6] text-[#FF5722]">
                        ⏱ {recipe.prepTime} • {recipe.difficulty}
                      </span>
                      <span className="text-xs font-bold text-red-500 flex items-center gap-1">
                        <Heart className="w-3.5 h-3.5 fill-current" /> Tersimpan
                      </span>
                    </div>
                    <h3 className="font-extrabold text-[#1E1715] text-base mb-1.5">{recipe.title}</h3>
                    <p className="text-xs text-[#786C68] line-clamp-2 mb-3">{recipe.description}</p>
                    
                    <div className="pt-3 border-t border-[#F0E5E1] text-xs text-[#786C68]">
                      <span className="font-bold text-[#1E1715]">Langkah Awal:</span>
                      <p className="mt-1 line-clamp-2">{recipe.steps[0]}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'places' && (
        <div>
          {favoritePlaces.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-[#F0E5E1] shadow-2xs">
              <MapPin className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="font-bold text-[#1E1715] text-base mb-1">Belum Ada Lokasi Kuliner Favorit</h3>
              <p className="text-xs text-[#786C68] max-w-sm mx-auto mb-4">
                Buka peta kuliner dan simpan tempat makan favorit Anda di Balikpapan agar mudah dikunjungi kembali.
              </p>
              <button
                onClick={onGoToMap}
                className="px-5 py-2.5 rounded-2xl bg-[#FF5722] hover:bg-[#E64A19] text-white text-xs font-bold transition shadow-xs"
              >
                Buka Peta Kuliner Sekarang →
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favoritePlaces.map(place => (
                <div key={place.id} className="bg-white rounded-3xl overflow-hidden border border-[#F0E5E1] shadow-2xs flex flex-col justify-between">
                  <div>
                    <img src={place.imageUrl} alt="" className="w-full h-40 object-cover" />
                    <div className="p-5">
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="font-bold text-[#FF5722] bg-[#FFEBE6] px-2.5 py-0.5 rounded-full text-[11px]">
                          {place.category}
                        </span>
                        <div className="flex items-center gap-0.5 text-amber-500 font-bold">
                          <Star className="w-3.5 h-3.5 fill-current" />
                          <span>{place.rating}</span>
                        </div>
                      </div>

                      <h3 className="font-extrabold text-[#1E1715] text-base mt-1">{place.name}</h3>
                      <p className="text-xs text-[#786C68] mt-0.5 line-clamp-1">{place.address}</p>

                      <div className="mt-3 text-xs bg-[#FFF8F6] p-3 rounded-2xl border border-[#F0E5E1]">
                        <span className="font-bold text-[#FF5722]">Menu Unggulan: </span>
                        <span className="text-[#1E1715] font-medium">{place.featuredMenu}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 pt-0 flex items-center justify-between">
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${place.lat},${place.lng}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-bold text-[#FF5722] hover:underline flex items-center gap-1"
                    >
                      Buka Rute Navigasi <ExternalLink className="w-3 h-3" />
                    </a>

                    <button
                      onClick={() => handleRemovePlace(place.id)}
                      className="p-1.5 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition"
                      title="Hapus dari Favorit"
                    >
                      <Trash2 className="w-4 h-4" />
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
