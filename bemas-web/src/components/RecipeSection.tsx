import React, { useState, useEffect, useRef } from 'react';
import {
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  Sparkles,
  Heart,
  Plus,
  MapPin,
  Clock,
  CheckSquare,
  Square,
  Key,
  RotateCcw
} from 'lucide-react';
import { Recipe, RecipeCategoryTag, User } from '../types';
import { storage } from '../services/storage';
import {
  generateRecipesWithAI,
  addIngredientsToList,
  filterRecipesByCategory,
  ensureRecipeDetails,
  CURATED_RECIPES
} from '../services/gemini';

interface RecipeSectionProps {
  onGoToMap: () => void;
  onOpenApiKeyModal?: () => void;
  currentUser?: User | null;
  onRequireLogin?: () => void;
}

export const RecipeSection: React.FC<RecipeSectionProps> = ({
  onGoToMap,
  onOpenApiKeyModal,
  currentUser,
  onRequireLogin
}) => {
  // Daftar Bahan Makanan di Dapur (UC-03 Langkah 1)
  const [activeIngredients, setActiveIngredients] = useState<string[]>([
    'Telur Ayam',
    'Tahu Putih',
    'Bawang Putih',
    'Wortel Segar'
  ]);
  const [inputVal, setInputVal] = useState('');
  const [activeCategory, setActiveCategory] = useState<RecipeCategoryTag>('Semua Resep');

  // State Hasil Resep & Pesan Umpan Balik (NFR-09)
  const [loading, setLoading] = useState(false);
  const [recipes, setRecipes] = useState<Recipe[]>(() =>
    CURATED_RECIPES.map(ensureRecipeDetails)
  );
  const [selectedRecipeId, setSelectedRecipeId] = useState<string>(CURATED_RECIPES[0].id);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // State Checklist Bahan Interaktif
  const [checkedIngredients, setCheckedIngredients] = useState<Record<string, boolean>>({});

  // State Favorit (FR-05 / UC-05)
  const [favoriteIds, setFavoriteIds] = useState<string[]>(() => {
    if (!currentUser) return [];
    return storage.getFavoriteRecipes(currentUser.id).map(r => r.id);
  });

  useEffect(() => {
    if (currentUser) {
      setFavoriteIds(storage.getFavoriteRecipes(currentUser.id).map(r => r.id));
    } else {
      setFavoriteIds([]);
    }
  }, [currentUser]);

  const isFavorited = (id: string) => favoriteIds.includes(id);

  const handleToggleFavorite = (recipe: Recipe) => {
    if (!currentUser) {
      setErrorMessage('Silakan login terlebih dahulu untuk menyimpan resep favorit');
      if (onRequireLogin) onRequireLogin();
      return;
    }
    try {
      const res = storage.toggleFavoriteRecipe(currentUser.id, recipe);
      setFavoriteIds(storage.getFavoriteRecipes(currentUser.id).map(r => r.id));
      showToast(res.favorited ? 'Resep berhasil disimpan ke favorit!' : 'Resep dihapus dari favorit');
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Gagal menyimpan resep ke favorit');
    }
  };

  const quickSuggestions = [
    'Tempe',
    'Daun Bawang',
    'Cabai Rawit',
    'Kecap Manis',
    'Buncis',
    'Tomat'
  ];

  const categories: RecipeCategoryTag[] = [
    'Semua Resep',
    '⚡ Menu Cepat (< 20 Mnt)',
    '🏠 Masakan Rumahan',
    '💰 Hemat / Tanggal Tua',
    '🥗 Sehat & Sayur'
  ];

  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const showToast = (msg: string) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToastMessage(msg);
    toastTimerRef.current = setTimeout(() => setToastMessage(null), 3500);
  };

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, []);

  const handleAddIngredient = (rawItem: string) => {
    setErrorMessage(null);
    const result = addIngredientsToList(activeIngredients, rawItem);
    if (result.error) {
      setErrorMessage(result.error);
      return;
    }
    setActiveIngredients(result.updated);
    setInputVal('');
  };

  const handleRemoveIngredient = (itemToRemove: string) => {
    setErrorMessage(null);
    setActiveIngredients(prev => prev.filter(i => i !== itemToRemove));
  };

  const handleClearIngredients = () => {
    setErrorMessage(null);
    setActiveIngredients([]);
  };

  const handleGenerate = async () => {
    setErrorMessage(null);

    // UC-03 Exceptional Flow 1a (Input Kosong)
    if (activeIngredients.length === 0) {
      setErrorMessage('Silakan masukkan minimal satu bahan makanan');
      return;
    }

    setLoading(true);
    try {
      const rawResults = await generateRecipesWithAI(activeIngredients);
      const results = rawResults.map(ensureRecipeDetails);
      setRecipes(results);
      if (results.length > 0) {
        setSelectedRecipeId(results[0].id);
      }
      setActiveCategory('Semua Resep');
      showToast('Rekomendasi resep berhasil disusun berdasarkan bahan Anda!');
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : 'Gagal terhubung ke layanan rekomendasi, silakan coba beberapa saat lagi';
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  const toggleIngredientCheck = (name: string) => {
    setCheckedIngredients(prev => ({
      ...prev,
      [name]: !prev[name]
    }));
  };

  const filteredRecipes = filterRecipesByCategory(recipes, activeCategory);
  const rawFeaturedRecipe: Recipe | undefined =
    filteredRecipes.find(r => r.id === selectedRecipeId) || filteredRecipes[0];
  const featuredRecipe: Recipe | undefined = rawFeaturedRecipe
    ? ensureRecipeDetails(rawFeaturedRecipe)
    : undefined;

  // Daftar rekomendasi resep lainnya (ditempatkan tepat di bawah bagian nilai gizi)
  const secondaryRecipes: Recipe[] = featuredRecipe
    ? filteredRecipes.filter(r => r.id !== featuredRecipe.id).map(ensureRecipeDetails)
    : [];

  return (
    <div className="space-y-6 pb-16 max-w-5xl mx-auto">
      {/* Toast Alert */}
      {toastMessage && (
        <div
          role="status"
          className="fixed bottom-6 right-6 z-50 bg-[#1E1715] text-white text-xs px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 animate-bounce-subtle"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs text-[#786C68] font-medium">
        <span>Beranda</span>
        <span className="text-[10px] text-[#786C68]">›</span>
        <span className="text-[#FF5722] font-semibold">Rekomendasi Resep Berdasarkan Bahan (UC-03)</span>
      </div>

      {/* HEADER HERO */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#F0E5E1] shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFEBE6] text-[#FF5722] text-xs font-bold w-fit mb-1.5">
            <span>🍳</span>
            <span>Rekomendasi Resep Berdasarkan Bahan (UC-03)</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-[#1E1715] tracking-tight">
            Punya bahan apa di kulkas hari ini?
          </h1>
          <p className="text-xs text-[#786C68] mt-1">
            Masukkan daftar bahan makanan yang Anda miliki untuk meracik resep lezat dengan takaran pasti &amp; nilai gizi.
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          {onOpenApiKeyModal && (
            <button
              type="button"
              onClick={onOpenApiKeyModal}
              title="Atur Gemini API Key"
              className="px-3 py-2 rounded-2xl bg-[#FFF8F6] border border-[#F0E5E1] text-[#786C68] hover:text-[#FF5722] text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Key className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Kunci API</span>
            </button>
          )}

          <button
            type="button"
            onClick={onGoToMap}
            className="px-3.5 py-2 rounded-2xl bg-[#FFF1ED] hover:bg-[#FFE0D6] border border-[#FFD8CF] text-[#FF5722] text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Mau Beli Jadi?</span>
          </button>
        </div>
      </div>

      {/* INPUT & ACTIVE INGREDIENTS CONSOLE */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 border border-[#F0E5E1] shadow-2xs space-y-4">
        {/* Error Message Alert */}
        {errorMessage && (
          <div
            role="alert"
            className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2.5 animate-shake"
          >
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Input & Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-2.5">
          <div className="relative flex-1 w-full">
            <input
              type="text"
              aria-label="Input bahan makanan"
              value={inputVal}
              onChange={e => setInputVal(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddIngredient(inputVal);
                }
              }}
              placeholder="Ketik nama bahan (contoh: telur, tahu, wortel, tempe)..."
              className="w-full bg-[#FFF8F6] border border-[#F0E5E1] rounded-2xl px-4 py-3 text-xs sm:text-sm text-[#1E1715] placeholder-[#786C68] focus:outline-hidden focus:border-[#FF5722] focus:bg-white font-medium transition-all"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => handleAddIngredient(inputVal)}
              className="px-4 py-3 bg-[#FFF1ED] hover:bg-orange-100 text-[#FF5722] border border-[#FFD8CF] rounded-2xl text-xs font-bold transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ Tambah</span>
            </button>

            <button
              type="button"
              onClick={handleGenerate}
              disabled={loading}
              aria-label="Cari Resep / Rekomendasikan (Racik Resep AI)"
              title="Cari Resep / Rekomendasikan (SRS UC-03)"
              className="flex-1 sm:flex-none px-5 py-3 bg-[#FF5722] hover:bg-[#E64A19] text-white rounded-2xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-colors shrink-0 disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Meracik Resep...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Cari Resep / Racik Resep AI</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Active Ingredients Chips List */}
        <div className="pt-2 border-t border-[#F0E5E1]/60">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-[#786C68] uppercase tracking-wider">
              Bahan di Dapur Anda ({activeIngredients.length} Bahan)
            </span>
            {activeIngredients.length > 0 && (
              <button
                type="button"
                onClick={handleClearIngredients}
                className="text-xs text-red-500 font-bold hover:underline cursor-pointer flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Hapus Semua</span>
              </button>
            )}
          </div>

          {activeIngredients.length === 0 ? (
            <p className="text-xs text-[#786C68] italic py-1">
              Belum ada bahan yang dipilih. Silakan ketik dan tambahkan bahan di atas.
            </p>
          ) : (
            <div className="flex flex-wrap gap-2 pt-1">
              {activeIngredients.map(item => (
                <span
                  key={item}
                  className="inline-flex items-center gap-1.5 bg-[#FFF1ED] border border-[#FFD8CF] px-3.5 py-1.5 rounded-full text-xs font-bold text-[#1E1715] shadow-2xs"
                >
                  <span>{item}</span>
                  <button
                    type="button"
                    aria-label={`Hapus ${item}`}
                    onClick={() => handleRemoveIngredient(item)}
                    className="text-[#786C68] hover:text-red-500 cursor-pointer text-xs font-black ml-0.5"
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Quick Suggestions */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-[#F0E5E1]/60 text-xs">
          <span className="text-[#786C68] font-medium text-[11px] mr-1">Saran cepat:</span>
          {quickSuggestions.map(sug => (
            <button
              key={sug}
              type="button"
              onClick={() => handleAddIngredient(sug)}
              className="px-2.5 py-1 bg-white hover:bg-orange-50 border border-[#F0E5E1] rounded-full text-[#1E1715] text-[11px] font-medium cursor-pointer transition-colors"
            >
              + {sug}
            </button>
          ))}
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pt-2 no-scrollbar border-t border-[#F0E5E1]/60">
          {categories.map(cat => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                activeCategory === cat
                  ? 'bg-[#FF5722] text-white shadow-2xs'
                  : 'bg-[#FFF8F6] hover:bg-orange-50 border border-[#F0E5E1] text-[#786C68] hover:text-[#1E1715]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* SINGLE-COLUMN RECIPE DETAIL CARD */}
      {!featuredRecipe ? (
        <div className="bg-white rounded-3xl p-8 text-center border border-[#F0E5E1] space-y-3">
          <p className="text-sm font-bold text-[#1E1715]">
            Tidak ada resep yang cocok pada kategori "{activeCategory}".
          </p>
          <button
            type="button"
            onClick={() => setActiveCategory('Semua Resep')}
            className="px-4 py-2 rounded-xl bg-[#FF5722] text-white text-xs font-bold cursor-pointer"
          >
            Tampilkan Semua Resep
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-[#F0E5E1] shadow-sm overflow-hidden space-y-6">

                {/* Hero Image & Headline */}
                <div className="relative h-64 sm:h-80 w-full overflow-hidden">
                  <img
                    src={
                      featuredRecipe.imageUrl ||
                      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1000&q=80'
                    }
                    alt={featuredRecipe.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent"></div>

                  {/* Engine Badge */}
                  <div className="absolute top-4 left-4 bg-[#FF5722] text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-md">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>
                      {featuredRecipe.engineName
                        ? `Diracik oleh ${featuredRecipe.engineName}`
                        : featuredRecipe.source === 'AI-Generated'
                        ? 'Rekomendasi AI BEMAS'
                        : 'Resep Pilihan Koki'}
                    </span>
                  </div>

                  {/* Favorite Heart Button */}
                  <button
                    type="button"
                    title={isFavorited(featuredRecipe.id) ? 'Hapus dari Favorit' : 'Simpan Resep Favorit'}
                    aria-label={isFavorited(featuredRecipe.id) ? 'Hapus dari Favorit' : 'Simpan Resep Favorit'}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleFavorite(featuredRecipe);
                    }}
                    className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-rose-500 flex items-center justify-center shadow-lg transition active:scale-95 cursor-pointer"
                  >
                    <Heart className={`w-5 h-5 ${isFavorited(featuredRecipe.id) ? 'fill-rose-500 text-rose-500' : 'text-[#786C68]'}`} />
                  </button>

                  {/* Title & Metadata Overlay */}
                  <div className="absolute bottom-5 left-5 right-5 sm:left-6 sm:right-6 text-white">
                    <div className="flex items-center gap-3 text-xs text-orange-100 mb-2 flex-wrap">
                      <span className="flex items-center gap-1 font-semibold">
                        <Clock className="w-3.5 h-3.5 text-orange-300" />
                        {featuredRecipe.prepTime}
                      </span>
                      <span>•</span>
                      <span>👥 {featuredRecipe.servings} Porsi</span>
                      <span>•</span>
                      <span>🍳 Tingkat: {featuredRecipe.difficulty}</span>
                      <span>•</span>
                      <span className="text-yellow-400 font-bold">★ {featuredRecipe.rating || 4.9}</span>
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-black tracking-tight leading-snug">
                      {featuredRecipe.title}
                    </h3>
                  </div>
                </div>

                <div className="px-5 sm:px-8 pb-8 space-y-6">
                  {/* Description */}
                  <p className="text-xs sm:text-sm text-[#5E5856] leading-relaxed">
                    {featuredRecipe.description}
                  </p>

                  {/* Dilema Masak vs Beli (Solusi BEMAS) */}
                  <div className="bg-[#FFF4F0] rounded-2xl p-4 sm:p-5 border border-[#FFD8CF] flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-[#FF5722] text-white flex items-center justify-center shrink-0 text-lg font-bold shadow-2xs">
                      ⚖️
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-xs sm:text-sm font-bold text-[#1E1715]">
                          Dilema: Mau Masak Sendiri atau Beli Jadi?
                        </span>
                        <span className="text-[10px] bg-white border border-[#FFD8CF] text-[#FF5722] font-bold px-2 py-0.5 rounded-full">
                          Solusi BEMAS
                        </span>
                      </div>
                      <p className="text-xs text-[#786C68] leading-relaxed mb-3">
                        Jika kamu sedang lelah atau tidak sempat memasak, BEMAS menyediakan peta interaktif untuk menemukan tempat kuliner terdekat di sekitarmu.
                      </p>
                      <button
                        type="button"
                        onClick={onGoToMap}
                        className="px-3.5 py-2 bg-white border border-[#FFD8CF] text-[#FF5722] hover:bg-orange-50 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs"
                      >
                        <MapPin className="w-3.5 h-3.5" />
                        <span>Lihat Tempat Kuliner Terdekat (Peta GIS)</span>
                      </button>
                    </div>
                  </div>

                  {/* SECTION 1: DETAIL BAHAN DENGAN TAKARAN PASTI */}
                  <div className="bg-[#FFF8F6] rounded-2xl p-5 sm:p-6 border border-[#F0E5E1] space-y-4">
                    <div className="flex items-center justify-between border-b border-[#F0E5E1] pb-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-[#FFEBE6] text-[#FF5722] flex items-center justify-center text-sm font-bold">
                          🥄
                        </div>
                        <div>
                          <h4 className="font-extrabold text-sm sm:text-base text-[#1E1715]">
                            Detail Bahan Masakan &amp; Takaran Pasti
                          </h4>
                          <p className="text-[11px] text-[#786C68]">
                            Takaran spesifik untuk {featuredRecipe.servings} porsi penyajian
                          </p>
                        </div>
                      </div>
                      <span className="text-xs text-[#FF5722] font-bold hidden sm:inline">
                        {featuredRecipe.detailedIngredients?.length || 0} Bahan Rinci
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {featuredRecipe.detailedIngredients?.map((item, idx) => {
                        const isChecked = Boolean(checkedIngredients[item.name]);
                        return (
                          <div
                            key={`${item.name}-${idx}`}
                            onClick={() => toggleIngredientCheck(item.name)}
                            className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer select-none ${
                              isChecked
                                ? 'bg-emerald-50/60 border-emerald-200 text-emerald-900'
                                : 'bg-white border-[#F0E5E1] text-[#1E1715] hover:border-[#FF5722]/40'
                            }`}
                          >
                            <button
                              type="button"
                              aria-label={`Centang ${item.name}`}
                              className="mt-0.5 text-[#FF5722] shrink-0"
                            >
                              {isChecked ? (
                                <CheckSquare className="w-4 h-4 text-emerald-600" />
                              ) : (
                                <Square className="w-4 h-4 text-[#786C68]" />
                              )}
                            </button>
                            <div className="flex-1 text-xs">
                              <div className="flex items-center justify-between gap-2">
                                <span className={`font-bold ${isChecked ? 'line-through text-emerald-800' : 'text-[#1E1715]'}`}>
                                  {item.name}
                                </span>
                                {item.isMain && (
                                  <span className="text-[9px] uppercase font-extrabold px-1.5 py-0.2 rounded-md bg-[#FFEBE6] text-[#FF5722]">
                                    Utama
                                  </span>
                                )}
                              </div>
                              <p className={`text-[11px] font-semibold mt-0.5 ${isChecked ? 'text-emerald-700' : 'text-[#FF5722]'}`}>
                                Takaran: {item.amount}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* SECTION 2: LANGKAH MEMASAK BERTAHAP */}
                  <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#F0E5E1] space-y-4">
                    <div className="flex items-center justify-between border-b border-[#F0E5E1] pb-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-[#FFEBE6] text-[#FF5722] flex items-center justify-center text-sm font-bold">
                          🍳
                        </div>
                        <h4 className="font-extrabold text-sm sm:text-base text-[#1E1715]">
                          Urutan Langkah Memasak
                        </h4>
                      </div>
                      <span className="text-xs bg-emerald-50 text-emerald-700 font-bold px-3 py-1 rounded-full border border-emerald-200">
                        {featuredRecipe.steps.length} Langkah
                      </span>
                    </div>

                    <ol className="space-y-3 text-xs sm:text-sm text-[#1E1715]">
                      {featuredRecipe.steps.map((st, i) => (
                        <li key={i} className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-[#FFF8F6] transition-colors">
                          <span className="w-6 h-6 rounded-full bg-[#FFEBE6] text-[#FF5722] font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                            {i + 1}
                          </span>
                          <span className="leading-relaxed flex-1 text-[#4B5563]">
                            {st}
                          </span>
                        </li>
                      ))}
                    </ol>

                    {/* Tips Koki */}
                    {featuredRecipe.tips && (
                      <div className="p-4 rounded-2xl bg-[#FFF8F6] border border-[#F0E5E1] text-xs text-[#786C68] flex items-start gap-2.5 mt-2">
                        <Lightbulb className="w-4 h-4 text-[#FF5722] shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-[#1E1715]">Tips Koki BEMAS:</strong>{' '}
                          <span>{featuredRecipe.tips}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* SECTION 3: INFORMASI NILAI GIZI (NUTRITION FACTS) */}
                  <div className="bg-[#FFFDF9] rounded-2xl p-5 sm:p-6 border border-amber-200/80 shadow-2xs space-y-4">
                    <div className="flex items-center justify-between border-b border-amber-100 pb-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center text-sm font-bold">
                          🥗
                        </div>
                        <div>
                          <h4 className="font-extrabold text-sm sm:text-base text-[#1E1715]">
                            Informasi Nilai Gizi
                          </h4>
                          <p className="text-[11px] text-[#786C68]">
                            Estimasi kandungan nutrisi per porsi penyajian
                          </p>
                        </div>
                      </div>
                      <span className="text-[11px] bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-0.5 rounded-full font-bold">
                        Nutrisi Seimbang
                      </span>
                    </div>

                    {/* 5-Metric Nutrition Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                      <div className="p-3 bg-white rounded-xl border border-amber-100 text-center shadow-2xs">
                        <div className="text-[10px] uppercase font-bold text-[#786C68]">Energi</div>
                        <div className="text-base sm:text-lg font-black text-[#FF5722] mt-0.5">
                          {featuredRecipe.nutritionFacts?.calories || featuredRecipe.caloriesApprox || 240}
                        </div>
                        <div className="text-[10px] text-[#786C68] font-medium">kkal</div>
                      </div>

                      <div className="p-3 bg-white rounded-xl border border-amber-100 text-center shadow-2xs">
                        <div className="text-[10px] uppercase font-bold text-[#786C68]">Protein</div>
                        <div className="text-base sm:text-lg font-black text-[#1E1715] mt-0.5">
                          {featuredRecipe.nutritionFacts?.protein || '14 g'}
                        </div>
                        <div className="text-[10px] text-[#786C68] font-medium">pembentukan otot</div>
                      </div>

                      <div className="p-3 bg-white rounded-xl border border-amber-100 text-center shadow-2xs">
                        <div className="text-[10px] uppercase font-bold text-[#786C68]">Karbohidrat</div>
                        <div className="text-base sm:text-lg font-black text-[#1E1715] mt-0.5">
                          {featuredRecipe.nutritionFacts?.carbs || '12 g'}
                        </div>
                        <div className="text-[10px] text-[#786C68] font-medium">sumber tenaga</div>
                      </div>

                      <div className="p-3 bg-white rounded-xl border border-amber-100 text-center shadow-2xs">
                        <div className="text-[10px] uppercase font-bold text-[#786C68]">Lemak</div>
                        <div className="text-base sm:text-lg font-black text-[#1E1715] mt-0.5">
                          {featuredRecipe.nutritionFacts?.fat || '16 g'}
                        </div>
                        <div className="text-[10px] text-[#786C68] font-medium">lemak sehat</div>
                      </div>

                      <div className="p-3 bg-white rounded-xl border border-amber-100 text-center col-span-2 sm:col-span-1 shadow-2xs">
                        <div className="text-[10px] uppercase font-bold text-[#786C68]">Serat</div>
                        <div className="text-base sm:text-lg font-black text-emerald-600 mt-0.5">
                          {featuredRecipe.nutritionFacts?.fiber || '2.5 g'}
                        </div>
                        <div className="text-[10px] text-[#786C68] font-medium">pencernaan</div>
                      </div>
                    </div>
                  </div>

                  {/* SECTION 4: POSISI REKOMENDASI RESEP LAINNYA (TEPAT DI BAWAH NILAI GIZI) */}
                  <div className="pt-4 border-t border-[#F0E5E1] space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-base">🍲</span>
                        <div>
                          <h4 className="font-extrabold text-sm sm:text-base text-[#1E1715]">
                            Rekomendasi Resep Lainnya dari Bahan Ini
                          </h4>
                          <p className="text-[11px] text-[#786C68]">
                            Pilihan variasi masakan lain yang bisa kamu racik
                          </p>
                        </div>
                      </div>
                      <span className="text-xs bg-[#FFF8F6] border border-[#F0E5E1] text-[#786C68] font-bold px-3 py-1 rounded-full">
                        {secondaryRecipes.length} Alternatif
                      </span>
                    </div>

                    {secondaryRecipes.length === 0 ? (
                      <p className="text-xs text-[#786C68] italic py-2">
                        Belum ada resep alternatif lain pada filter ini.
                      </p>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {secondaryRecipes.map(sec => (
                          <div
                            key={sec.id}
                            className="bg-[#FFF8F6] rounded-2xl p-4 border border-[#F0E5E1] hover:border-[#FF5722] transition-all space-y-3 flex flex-col justify-between"
                          >
                            <div>
                              <div className="flex items-start justify-between gap-2 mb-2">
                                <span className="text-[10px] font-bold text-[#FF5722] bg-white border border-[#FFD8CF] px-2 py-0.5 rounded-full">
                                  ⏱ {sec.prepTime} • {sec.difficulty}
                                </span>
                                <button
                                  type="button"
                                  title={isFavorited(sec.id) ? 'Hapus dari Favorit' : 'Simpan Resep Favorit'}
                                  aria-label={isFavorited(sec.id) ? 'Hapus dari Favorit' : 'Simpan Resep Favorit'}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleToggleFavorite(sec);
                                  }}
                                  className="p-1 rounded-full text-rose-500 hover:bg-rose-50 transition cursor-pointer"
                                >
                                  <Heart className={`w-4 h-4 ${isFavorited(sec.id) ? 'fill-rose-500 text-rose-500' : 'text-[#786C68]'}`} />
                                </button>
                              </div>

                              <h5 className="font-bold text-sm text-[#1E1715] mb-1">
                                {sec.title}
                              </h5>
                              <p className="text-xs text-[#786C68] line-clamp-2 leading-relaxed">
                                {sec.description}
                              </p>
                            </div>

                            <div className="pt-2 border-t border-[#F0E5E1] flex items-center justify-between text-xs">
                              <span className="text-[11px] text-[#786C68] font-semibold">
                                {sec.nutritionFacts?.calories || sec.caloriesApprox || 200} kkal
                              </span>
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedRecipeId(sec.id);
                                  window.scrollTo({ top: 380, behavior: 'smooth' });
                                }}
                                className="font-bold text-[#FF5722] hover:underline cursor-pointer inline-flex items-center gap-1"
                              >
                                <span>Lihat Resep Ini</span>
                                <span>→</span>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
    </div>
  );
};
