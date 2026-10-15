import React, { useState } from 'react';
import { Sparkles, Plus, X, Clock, Flame, Users, Bookmark, BookmarkCheck, CheckCircle2, Lightbulb, ChefHat } from 'lucide-react';
import { Recipe } from '../types';
import { generateRecipesWithAI } from '../services/gemini';
import { storage } from '../services/storage';

const QUICK_INGREDIENTS = [
  'Telur', 'Bawang Merah', 'Ayam', 'Tahu', 'Tempe', 
  'Nasi', 'Cabai', 'Kecap Manis', 'Buncis', 'Tomat', 'Mie Instan'
];

interface RecipeSectionProps {
  onGoToMap: () => void;
}

export const RecipeSection: React.FC<RecipeSectionProps> = ({ onGoToMap }) => {
  const [ingredients, setIngredients] = useState<string[]>(['Telur', 'Bawang Merah', 'Cabai']);
  const [inputValue, setInputValue] = useState('');
  const [maxTime, setMaxTime] = useState<string>('');
  const [difficulty, setDifficulty] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [favoriteRecipeIds, setFavoriteRecipeIds] = useState<string[]>(storage.getFavoriteRecipeIds());
  const [notification, setNotification] = useState<string | null>(null);

  const handleAddIngredient = (item: string) => {
    const trimmed = item.trim();
    if (trimmed && !ingredients.some(i => i.toLowerCase() === trimmed.toLowerCase())) {
      setIngredients([...ingredients, trimmed]);
      setInputValue('');
    }
  };

  const handleRemoveIngredient = (item: string) => {
    setIngredients(ingredients.filter(i => i !== item));
  };

  const handleGenerate = async () => {
    if (ingredients.length === 0) {
      alert('Silakan masukkan minimal 1 bahan makanan yang Anda miliki!');
      return;
    }
    setLoading(true);
    try {
      const results = await generateRecipesWithAI(ingredients, { maxTime, difficulty });
      setRecipes(results);
    } catch (err) {
      console.error(err);
      alert('Terjadi kendala saat meracik resep. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = (recipe: Recipe) => {
    const isAdded = storage.toggleFavoriteRecipe(recipe.id);
    setFavoriteRecipeIds(storage.getFavoriteRecipeIds());
    
    // Also store recipe object in sessionStorage so it persists in favorites view
    const allSavedRecipes = JSON.parse(localStorage.getItem('bemas_cached_recipes') || '[]');
    if (isAdded) {
      if (!allSavedRecipes.some((r: Recipe) => r.id === recipe.id)) {
        allSavedRecipes.push(recipe);
        localStorage.setItem('bemas_cached_recipes', JSON.stringify(allSavedRecipes));
      }
      showToast(`Resep "${recipe.title}" berhasil disimpan ke Favorit!`);
    } else {
      showToast(`Resep "${recipe.title}" dihapus dari Favorit.`);
    }
  };

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-sm px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-orange-500 via-amber-500 to-amber-600 text-white p-6 sm:p-10 shadow-lg shadow-orange-500/20">
        <div className="max-w-2xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5 text-amber-200" />
            <span>AI Kitchen Assistant (UC-03)</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white mb-3">
            Punya Bahan Apa di Dapur Hari Ini?
          </h1>
          <p className="text-orange-100 text-sm sm:text-base leading-relaxed mb-6">
            Masukkan sisa bahan di kulkasmu, biarkan kecerdasan buatan BEMAS menyusun resep lezat, takaran pas, dan langkah memasak yang praktis!
          </p>
          
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs text-orange-200">Malas masak hari ini?</span>
            <button
              onClick={onGoToMap}
              className="text-xs font-bold px-3 py-1.5 rounded-lg bg-white text-orange-700 hover:bg-orange-50 transition shadow-xs"
            >
              Cari Beli Makan Terdekat Saja →
            </button>
          </div>
        </div>
      </div>

      {/* Ingredient Input Box */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200/80">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <ChefHat className="w-5 h-5 text-orange-500" />
            Daftar Bahan Makanan Anda
          </h2>
          <span className="text-xs font-medium text-slate-500">
            {ingredients.length} bahan dipilih
          </span>
        </div>

        {/* Selected Tags */}
        <div className="flex flex-wrap gap-2 mb-4 min-h-[44px] p-2.5 rounded-xl bg-slate-50 border border-slate-200">
          {ingredients.length === 0 ? (
            <span className="text-sm text-slate-400 italic self-center">
              Belum ada bahan. Klik bahan cepat di bawah atau ketik sendiri...
            </span>
          ) : (
            ingredients.map(item => (
              <span
                key={item}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-sm font-semibold bg-orange-500 text-white shadow-xs group"
              >
                {item}
                <button
                  type="button"
                  onClick={() => handleRemoveIngredient(item)}
                  className="hover:bg-orange-600 rounded-full p-0.5 transition"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))
          )}
        </div>

        {/* Input Form & Quick Add */}
        <div className="flex gap-2 mb-6">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddIngredient(inputValue);
              }
            }}
            placeholder="Ketik bahan lain (contoh: udang, wortel, keju)..."
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          />
          <button
            type="button"
            onClick={() => handleAddIngredient(inputValue)}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-sm font-semibold flex items-center gap-1.5 transition"
          >
            <Plus className="w-4 h-4" />
            Tambah
          </button>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="mb-6">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
            Pilih Cepat Bahan Dapur Populer:
          </p>
          <div className="flex flex-wrap gap-2">
            {QUICK_INGREDIENTS.map(chip => {
              const isSelected = ingredients.some(i => i.toLowerCase() === chip.toLowerCase());
              return (
                <button
                  key={chip}
                  type="button"
                  onClick={() => isSelected ? handleRemoveIngredient(chip) : handleAddIngredient(chip)}
                  className={`text-xs font-medium px-3 py-1.5 rounded-lg border transition ${
                    isSelected
                      ? 'bg-orange-50 text-orange-700 border-orange-300 font-bold'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-orange-300 hover:text-orange-600'
                  }`}
                >
                  {isSelected ? `✓ ${chip}` : `+ ${chip}`}
                </button>
              );
            })}
          </div>
        </div>

        {/* Filters and CTA */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <select
              value={maxTime}
              onChange={(e) => setMaxTime(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-2 text-slate-700 focus:outline-hidden"
            >
              <option value="">⏱️ Semua Waktu Masak</option>
              <option value="15 Menit">⚡ Cepat (≤ 15 Menit)</option>
              <option value="30 Menit">⏳ Santai (≤ 30 Menit)</option>
            </select>

            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-2 text-slate-700 focus:outline-hidden"
            >
              <option value="">🍳 Semua Tingkat</option>
              <option value="Mudah">Mudah (Pemula)</option>
              <option value="Sedang">Sedang</option>
            </select>
          </div>

          <button
            type="button"
            disabled={loading}
            onClick={handleGenerate}
            className="px-6 py-3 rounded-xl bg-linear-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-sm shadow-md shadow-orange-500/25 flex items-center justify-center gap-2 transition disabled:opacity-50"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>AI Sedang Meracik Resep...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Rekomendasikan Resep Sekarang</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Results Section */}
      {recipes.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Rekomendasi Resep Masakan Anda ({recipes.length})
              </h2>
              <p className="text-xs text-slate-500">
                Disusun cerdas berdasarkan bahan makanan yang Anda pilih.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.map(recipe => {
              const isFav = favoriteRecipeIds.includes(recipe.id);
              return (
                <div
                  key={recipe.id}
                  className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-md transition flex flex-col justify-between"
                >
                  <div className="p-6">
                    {/* Header Card */}
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-amber-100 text-amber-800">
                        {recipe.source === 'AI-Generated' ? '✨ AI Gemini' : '⭐ Terkurasi'}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleToggleFavorite(recipe)}
                        title={isFav ? 'Hapus dari favorit' : 'Simpan ke favorit'}
                        className={`p-1.5 rounded-lg transition ${
                          isFav ? 'text-red-500 bg-red-50' : 'text-slate-400 hover:text-red-500 hover:bg-slate-50'
                        }`}
                      >
                        {isFav ? <BookmarkCheck className="w-5 h-5 fill-current" /> : <Bookmark className="w-5 h-5" />}
                      </button>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 mb-2 leading-snug">
                      {recipe.title}
                    </h3>
                    <p className="text-xs text-slate-600 mb-4 line-clamp-2">
                      {recipe.description}
                    </p>

                    {/* Meta info */}
                    <div className="flex items-center gap-3 text-xs text-slate-500 py-2.5 px-3 rounded-xl bg-slate-50 mb-4">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-orange-500" />
                        <span>{recipe.prepTime}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Flame className="w-3.5 h-3.5 text-amber-500" />
                        <span>{recipe.difficulty}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-blue-500" />
                        <span>{recipe.servings} Porsi</span>
                      </div>
                    </div>

                    {/* Ingredients needed */}
                    <div className="mb-4">
                      <p className="text-xs font-bold text-slate-700 mb-1.5">Bahan yang digunakan:</p>
                      <div className="flex flex-wrap gap-1">
                        {recipe.matchedIngredients.map(ing => (
                          <span key={ing} className="text-[11px] px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-medium">
                            ✓ {ing}
                          </span>
                        ))}
                        {recipe.additionalIngredients?.map(add => (
                          <span key={add} className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                            + {add}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Steps preview */}
                    <div>
                      <p className="text-xs font-bold text-slate-700 mb-2">Langkah Memasak:</p>
                      <ol className="space-y-1.5 text-xs text-slate-600 pl-4 list-decimal">
                        {recipe.steps.map((st, i) => (
                          <li key={i} className="leading-relaxed pl-1">{st}</li>
                        ))}
                      </ol>
                    </div>

                    {/* Chef Tip */}
                    {recipe.tips && (
                      <div className="mt-4 p-3 rounded-xl bg-amber-50/70 border border-amber-100 text-amber-900 text-xs flex items-start gap-2">
                        <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <span><strong>Tips Koki:</strong> {recipe.tips}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
