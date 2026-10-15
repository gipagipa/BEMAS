import React, { useState } from 'react';
import { Heart, BookmarkCheck, Clock, MapPin, Star, ExternalLink, Trash2, Utensils, ChefHat } from 'lucide-react';
import { CulinaryPlace, Recipe } from '../types';
import { storage } from '../services/storage';

interface FavoritesSectionProps {
  onGoToRecipe: () => void;
  onGoToMap: () => void;
}

export const FavoritesSection: React.FC<FavoritesSectionProps> = ({ onGoToRecipe, onGoToMap }) => {
  const [activeTab, setActiveTab] = useState<'recipes' | 'places'>('recipes');
  
  // Get favorites from storage
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
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-red-50 text-red-600 text-xs font-bold uppercase mb-1">
            <Heart className="w-3.5 h-3.5 fill-current" />
            <span>Bookmark Center (UC-05 & UC-06)</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">
            Koleksi Favorit Tersimpan
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Daftar resep olahan masakan dan titik lokasi kuliner yang telah Anda tandai.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('recipes')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              activeTab === 'recipes' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
            }`}
          >
            Resep Favorit ({favoriteRecipes.length})
          </button>
          <button
            onClick={() => setActiveTab('places')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              activeTab === 'places' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
            }`}
          >
            Tempat Kuliner ({favoritePlaces.length})
          </button>
        </div>
      </div>

      {/* Content */}
      {activeTab === 'recipes' && (
        <div>
          {favoriteRecipes.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-xs">
              <ChefHat className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="font-bold text-slate-700 text-base mb-1">Belum Ada Resep Favorit</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
                Jelajahi fitur rekomendasi AI, lalu klik ikon bookmark untuk menyimpan resep favorit Anda di sini.
              </p>
              <button
                onClick={onGoToRecipe}
                className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold transition shadow-xs"
              >
                Cari Resep Olahan AI Sekarang →
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favoriteRecipes.map(recipe => (
                <div key={recipe.id} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-amber-100 text-amber-800">
                      {recipe.prepTime} • {recipe.difficulty}
                    </span>
                    <span className="text-xs font-bold text-red-500 flex items-center gap-1">
                      <Heart className="w-3.5 h-3.5 fill-current" /> Tersimpan
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-base mb-1.5">{recipe.title}</h3>
                  <p className="text-xs text-slate-600 line-clamp-2 mb-3">{recipe.description}</p>
                  
                  <div className="pt-3 border-t border-slate-100 text-xs text-slate-500">
                    <span className="font-semibold text-slate-700">Langkah Memasak:</span>
                    <p className="mt-1 line-clamp-3">{recipe.steps[0]}</p>
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
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-xs">
              <MapPin className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="font-bold text-slate-700 text-base mb-1">Belum Ada Lokasi Kuliner Favorit</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
                Buka peta kuliner dan simpan tempat makan favorit Anda agar mudah dikunjungi kembali.
              </p>
              <button
                onClick={onGoToMap}
                className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold transition shadow-xs"
              >
                Buka Peta Kuliner Sekarang →
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favoritePlaces.map(place => (
                <div key={place.id} className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-xs flex flex-col justify-between">
                  <div>
                    <img src={place.imageUrl} alt="" className="w-full h-36 object-cover" />
                    <div className="p-4">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md">
                          {place.category}
                        </span>
                        <div className="flex items-center gap-0.5 text-amber-500 font-bold">
                          <Star className="w-3.5 h-3.5 fill-current" />
                          <span>{place.rating}</span>
                        </div>
                      </div>

                      <h3 className="font-bold text-slate-900 text-base mt-1">{place.name}</h3>
                      <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{place.address}</p>

                      <div className="mt-2 text-xs bg-slate-50 p-2 rounded-lg">
                        <span className="font-semibold text-slate-700">Menu Unggulan: </span>
                        <span className="text-slate-600">{place.featuredMenu}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 pt-0 flex items-center justify-between">
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${place.lat},${place.lng}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-bold text-orange-600 hover:underline flex items-center gap-1"
                    >
                      Buka Rute Navigasi <ExternalLink className="w-3 h-3" />
                    </a>

                    <button
                      onClick={() => handleRemovePlace(place.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition"
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
