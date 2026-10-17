import React, { useState } from 'react';
import { CheckCircle2, AlertCircle, Lightbulb, Sparkles } from 'lucide-react';
import { Recipe, RecipeCategoryTag } from '../types';
import { storage } from '../services/storage';
import {
  generateRecipesWithAI,
  addIngredientsToList,
  filterRecipesByCategory,
  CURATED_RECIPES
} from '../services/gemini';

interface RecipeSectionProps {
  onGoToMap: () => void;
  onOpenApiKeyModal?: () => void;
}

export const RecipeSection: React.FC<RecipeSectionProps> = ({ onGoToMap, onOpenApiKeyModal }) => {
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
  const [recipes, setRecipes] = useState<Recipe[]>(CURATED_RECIPES);
  const [selectedRecipeId, setSelectedRecipeId] = useState<string>(CURATED_RECIPES[0].id);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

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

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

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
      const results = await generateRecipesWithAI(activeIngredients);
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

  const filteredRecipes = filterRecipesByCategory(recipes, activeCategory);
  const featuredRecipe: Recipe | undefined =
    filteredRecipes.find(r => r.id === selectedRecipeId) || filteredRecipes[0];
  const secondaryRecipes: Recipe[] = featuredRecipe
    ? filteredRecipes.filter(r => r.id !== featuredRecipe.id)
    : [];

  return (
    <div className="space-y-6 pb-16">
      {/* Toast Alert */}
      {toastMessage && (
        <div
          role="status"
          className="fixed bottom-6 right-6 z-50 bg-[#1E1715] text-white text-xs px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2.5"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs text-[#786C68] font-medium">
        <span>Beranda</span>
        <span className="text-[10px] text-[#786C68]">›</span>
        <span className="text-[#FF5722] font-semibold">Rekomendasi Resep AI (UC-03)</span>
      </div>

      {/* HERO BANNER INPUT BAHAN MAKANAN */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F0E5E1] shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFEBE6] text-[#FF5722] text-xs font-bold w-fit">
            <span>🍳</span>
            <span>Rekomendasi Resep Berdasarkan Bahan (FR-03 / UC-03)</span>
          </div>
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#1E1715] mb-2">
          Punya bahan apa di kulkas hari ini?
        </h2>

        <p className="text-xs sm:text-sm text-[#786C68] mb-4">
          Masukkan daftar bahan makanan yang tersedia di dapur Anda, lalu biarkan Engine AI menyusun rekomendasi resep beserta takaran dan langkah memasaknya.
        </p>

        {/* Indikator Status Engine AI Aktif */}
        <div className="flex flex-wrap items-center gap-2 mb-6 text-xs">
          {storage.getGeminiApiKey() ? (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>AI Engine: Google Gemini 1.5 Flash (Online Realtime)</span>
              {onOpenApiKeyModal && (
                <button
                  type="button"
                  onClick={onOpenApiKeyModal}
                  className="text-[11px] text-emerald-700 underline hover:text-emerald-900 ml-1 cursor-pointer font-bold"
                >
                  Ganti Kunci
                </button>
              )}
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-50 text-orange-950 border border-orange-200 font-semibold shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-[#FF5722]" />
              <span>AI Engine: BEMAS Generative Culinary AI (Aktif Dinamis)</span>
              {onOpenApiKeyModal && (
                <button
                  type="button"
                  onClick={onOpenApiKeyModal}
                  className="text-[11px] text-[#FF5722] underline hover:text-[#E64A19] ml-1 font-bold cursor-pointer"
                >
                  + Hubungkan Google Gemini API
                </button>
              )}
            </div>
          )}
        </div>

        {/* Pesan Error Validasi / Input Kosong (UC-03 Langkah 1a & 3a) */}
        {errorMessage && (
          <div
            role="alert"
            className="mb-4 p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2.5"
          >
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Input Bar & Racik Resep CTA */}
        <div className="flex flex-col sm:flex-row items-center gap-2 mb-4">
          <div className="relative flex-1 w-full flex items-center">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#FF5722] font-bold text-base pointer-events-none">
              +
            </span>
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
              placeholder="Ketik bahan (contoh: Tempe, Sawi, Bawang Merah)..."
              className="w-full bg-[#FFF8F6] border border-[#F0E5E1] rounded-2xl pl-9 pr-4 py-3 text-xs text-[#1E1715] placeholder-[#786C68] focus:outline-hidden focus:border-[#FF5722] focus:bg-white transition-all font-medium"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => handleAddIngredient(inputVal)}
              className="px-4 py-3 bg-[#FFF1ED] hover:bg-orange-100 text-[#FF5722] border border-[#FFD8CF] rounded-2xl text-xs font-bold transition-colors shrink-0"
            >
              + Tambah
            </button>
            <button
              type="button"
              onClick={handleGenerate}
              disabled={loading}
              className="flex-1 sm:flex-none px-6 py-3 bg-[#FF5722] hover:bg-[#E64A19] text-white rounded-2xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-colors shrink-0 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Meracik Resep...</span>
                </>
              ) : (
                <>
                  <span>✨</span>
                  <span>Racik Resep AI</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Active Chips */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-[#786C68] uppercase tracking-wider">
              BAHAN YANG SIAP DIGUNAKAN ({activeIngredients.length} BAHAN)
            </span>
            {activeIngredients.length > 0 && (
              <button
                type="button"
                onClick={handleClearIngredients}
                className="text-xs text-red-500 font-semibold cursor-pointer hover:underline"
              >
                Hapus Semua
              </button>
            )}
          </div>

          {activeIngredients.length === 0 ? (
            <p className="text-xs text-[#786C68] italic py-1">
              Belum ada bahan yang dipilih. Tambahkan minimal satu bahan makanan di atas.
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {activeIngredients.map(item => (
                <span
                  key={item}
                  className="inline-flex items-center gap-2 bg-[#FFF8F6] border border-[#F0E5E1] px-3.5 py-1.5 rounded-full text-xs font-semibold"
                >
                  <span>{item}</span>
                  <button
                    type="button"
                    aria-label={`Hapus ${item}`}
                    onClick={() => handleRemoveIngredient(item)}
                    className="text-[#786C68] hover:text-red-500 cursor-pointer text-[10px] ml-0.5"
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Suggestion tags */}
        <div className="flex flex-wrap items-center gap-2 text-xs pt-1">
          <span className="text-[#786C68] font-medium text-[11px]">Saran bumbu &amp; pelengkap cepat:</span>
          {quickSuggestions.map(sug => (
            <button
              key={sug}
              type="button"
              onClick={() => handleAddIngredient(sug)}
              className="px-2.5 py-1 bg-white hover:bg-orange-50 border border-[#F0E5E1] rounded-full text-[#1E1715] font-medium cursor-pointer transition-colors"
            >
              + {sug}
            </button>
          ))}
        </div>
      </div>

      {/* CATEGORY TABS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {categories.map(cat => (
          <button
            key={cat}
            type="button"
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${
              activeCategory === cat
                ? 'bg-[#FF5722] text-white shadow-2xs'
                : 'bg-white hover:bg-orange-50 border border-[#F0E5E1] text-[#786C68] hover:text-[#1E1715]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* EMPTY FILTER STATE */}
      {!featuredRecipe ? (
        <div className="bg-white rounded-3xl p-8 text-center border border-[#F0E5E1] space-y-3">
          <p className="text-sm font-bold text-[#1E1715]">
            Tidak ada resep yang cocok pada kategori "{activeCategory}".
          </p>
          <button
            type="button"
            onClick={() => setActiveCategory('Semua Resep')}
            className="px-4 py-2 rounded-xl bg-[#FF5722] text-white text-xs font-bold"
          >
            Tampilkan Semua Resep
          </button>
        </div>
      ) : (
        /* MAIN 2-COLUMN GRID (7 Cols Featured + 5 Cols Alternatives) */
        <div className="grid grid-cols-12 gap-8 items-start">
          {/* LEFT COLUMN: FEATURED HERO RECIPE (7 COLS) */}
          <div className="col-span-12 lg:col-span-7 space-y-6">
            <div className="bg-white rounded-3xl border border-[#F0E5E1] shadow-2xs overflow-hidden">
              <div className="relative h-72 w-full overflow-hidden">
                <img
                  src={
                    featuredRecipe.imageUrl ||
                    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1000&q=80'
                  }
                  alt={featuredRecipe.title}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/20 to-transparent"></div>

                <div className="absolute top-4 left-4 bg-[#FF5722] text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-md">
                  <span>✨</span>
                  <span>
                    {featuredRecipe.engineName
                      ? `Diracik oleh ${featuredRecipe.engineName}`
                      : featuredRecipe.source === 'AI-Generated'
                      ? 'Rekomendasi AI BEMAS'
                      : 'Resep Pilihan Koki (Siap Masak)'}
                  </span>
                </div>

                <div className="absolute bottom-5 left-6 right-6 text-white">
                  <div className="flex items-center gap-3 text-xs text-orange-100 mb-1.5 flex-wrap">
                    <span>⏱ {featuredRecipe.prepTime}</span>
                    <span>•</span>
                    <span>👥 {featuredRecipe.servings} Porsi</span>
                    <span>•</span>
                    <span>🍳 {featuredRecipe.difficulty}</span>
                    <span>•</span>
                    <span className="text-yellow-400 font-bold">★ {featuredRecipe.rating || 4.9}</span>
                  </div>
                  <h3 className="text-2xl font-black tracking-tight leading-snug">
                    {featuredRecipe.title}
                  </h3>
                </div>
              </div>

              <div className="p-6 space-y-5">
                <p className="text-xs text-[#786C68] leading-relaxed">
                  {featuredRecipe.description}
                </p>

                {/* Solusi BEMAS Box (Dilema Beli vs Masak) */}
                <div className="bg-[#FFF4F0] rounded-2xl p-4 border border-[#FFD8CF] flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[#FF5722] text-white flex items-center justify-center shrink-0 text-base font-bold shadow-2xs">
                    ⚖️
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-[#1E1715]">Dilema: Mau Masak Sendiri atau Beli Jadi?</span>
                      <span className="text-[10px] bg-white border border-[#FFD8CF] text-[#FF5722] font-bold px-2 py-0.5 rounded-full">
                        Solusi BEMAS
                      </span>
                    </div>
                    <p className="text-xs text-[#786C68] leading-relaxed mb-3">
                      Jika sedang lelah memasak, BEMAS menyediakan peta interaktif untuk menemukan <strong className="text-[#1E1715]">warung makan terdekat</strong> di sekitarmu.
                    </p>
                    <div className="flex flex-wrap items-center gap-3">
                      <button
                        type="button"
                        onClick={onGoToMap}
                        className="px-3 py-1.5 bg-white border border-[#FFD8CF] text-[#FF5722] rounded-xl text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer hover:bg-orange-50 transition-colors shadow-2xs"
                      >
                        📍 Lihat Warung Terdekat (Peta GIS)
                      </button>
                      <span className="text-[11px] text-[#786C68]">Est. Beli: Rp 16.000 vs Masak: Rp 8.000</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Step by Step Cooking Card */}
            <div className="bg-white rounded-3xl p-6 border border-[#F0E5E1] shadow-2xs space-y-5">
              <div className="flex items-center justify-between border-b border-[#F0E5E1] pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[#FFEBE6] text-[#FF5722] flex items-center justify-center text-sm font-bold">
                    📋
                  </div>
                  <h4 className="font-bold text-base text-[#1E1715]">Bahan &amp; Langkah Memasak Cepat</h4>
                </div>
                <span className="text-xs bg-emerald-50 text-emerald-700 font-bold px-3 py-1 rounded-full border border-emerald-200">
                  Siap dalam {featuredRecipe.prepTime}
                </span>
              </div>

              {/* Takaran Bahan Checklist */}
              <div>
                <h5 className="text-xs font-bold text-[#1E1715] uppercase tracking-wider mb-2.5">
                  Takaran Bahan Praktis:
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {featuredRecipe.matchedIngredients.map((m, i) => (
                    <div
                      key={`${m}-${i}`}
                      className="flex items-center gap-2.5 p-2.5 bg-[#FFF8F6] rounded-xl border border-[#F0E5E1] text-xs font-medium"
                    >
                      <span className="text-[#FF5722] font-bold">✓</span>
                      <span>{m}</span>
                    </div>
                  ))}
                  {featuredRecipe.additionalIngredients?.map((add, i) => (
                    <div
                      key={`${add}-${i}`}
                      className="flex items-center gap-2.5 p-2.5 bg-white rounded-xl border border-[#F0E5E1] text-xs text-[#786C68]"
                    >
                      <span className="text-slate-400 font-bold">+</span>
                      <span>{add}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Langkah-langkah */}
              <div>
                <h5 className="text-xs font-bold text-[#1E1715] uppercase tracking-wider mb-2.5">
                  Urutan Langkah Memasak:
                </h5>
                <ol className="space-y-2 text-xs text-[#1E1715] pl-4 list-decimal">
                  {featuredRecipe.steps.map((st, i) => (
                    <li key={i} className="leading-relaxed pl-1">
                      {st}
                    </li>
                  ))}
                </ol>
              </div>

              {/* Tips Koki */}
              {featuredRecipe.tips && (
                <div className="p-3.5 rounded-2xl bg-[#FFF8F6] border border-[#F0E5E1] text-xs text-[#786C68] flex items-start gap-2">
                  <Lightbulb className="w-4 h-4 text-[#FF5722] shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-[#1E1715]">Tips Koki BEMAS:</strong> {featuredRecipe.tips}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: ALTERNATIVE RECIPES (5 COLS) */}
          <div className="col-span-12 lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-sm text-[#1E1715] flex items-center gap-2">
                <span>🍲</span>
                <span>Pilihan Olahan Lainnya</span>
              </h4>
              <span className="text-xs text-[#786C68]">{secondaryRecipes.length} Pilihan</span>
            </div>

            {secondaryRecipes.map(sec => (
              <div
                key={sec.id}
                className="bg-white rounded-3xl p-5 border border-[#F0E5E1] shadow-2xs hover:border-[#FF5722] transition-colors"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-[10px] font-bold text-[#FF5722] bg-[#FFEBE6] px-2 py-0.5 rounded-full">
                    ⏱ {sec.prepTime} • {sec.difficulty}
                  </span>
                </div>

                <h4 className="font-bold text-sm text-[#1E1715] mb-1">{sec.title}</h4>
                <p className="text-xs text-[#786C68] line-clamp-2 mb-3">{sec.description}</p>

                <div className="flex items-center justify-between pt-2 border-t border-[#F0E5E1] text-xs">
                  <span className="text-[11px] text-[#786C68]">
                    Bahan: {sec.matchedIngredients.join(', ')}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedRecipeId(sec.id);
                      window.scrollTo({ top: 300, behavior: 'smooth' });
                    }}
                    className="font-bold text-[#FF5722] hover:underline cursor-pointer flex items-center gap-1"
                  >
                    Lihat Resep →
                  </button>
                </div>
              </div>
            ))}

            {/* Quick GIS Map Promo Card */}
            <div className="bg-linear-to-br from-[#FFEBE6] to-[#FFF1ED] rounded-3xl p-6 border border-[#FFD8CF] text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#FF5722] text-white flex items-center justify-center mx-auto text-xl shadow-xs">
                📍
              </div>
              <h4 className="font-extrabold text-sm text-[#1E1715]">Malas Masak Sendiri?</h4>
              <p className="text-xs text-[#786C68] leading-relaxed">
                Buka Peta GIS Kuliner untuk mencari warung makan atau resto di sekitar Balikpapan secara instan.
              </p>
              <button
                type="button"
                onClick={onGoToMap}
                className="w-full py-2.5 bg-[#FF5722] hover:bg-[#E64A19] text-white rounded-xl text-xs font-bold transition shadow-xs"
              >
                Jelajahi Peta Kuliner Sekarang
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
