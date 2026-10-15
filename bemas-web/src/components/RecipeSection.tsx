import React, { useState, useRef } from 'react';
import { 
  Camera, 
  Upload, 
  Sparkles, 
  Clock, 
  Users, 
  Flame, 
  Bookmark, 
  BookmarkCheck, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  Lightbulb, 
  X, 
  Utensils, 
  Layers, 
  ArrowRight,
  Info
} from 'lucide-react';
import { Recipe, PhotoAnalysisResult, IngredientShelfLife } from '../types';
import { generateRecipesWithAI, analyzeFoodPhotoWithAI } from '../services/gemini';
import { storage } from '../services/storage';

interface RecipeSectionProps {
  onGoToMap: () => void;
}

export const RecipeSection: React.FC<RecipeSectionProps> = ({ onGoToMap }) => {
  // Input Bahan Manual
  const [activeIngredients, setActiveIngredients] = useState<string[]>([
    'Telur Ayam (3 butir)',
    'Tahu Putih (4 kotak)',
    'Bawang Putih (4 siung)',
    'Wortel Segar (2 buah)'
  ]);
  const [inputVal, setInputVal] = useState('');
  const [activeCategory, setActiveCategory] = useState('Semua Resep');

  // Photo Vision State
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isAnalyzingPhoto, setIsAnalyzingPhoto] = useState(false);
  const [visionResult, setVisionResult] = useState<PhotoAnalysisResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Recipes State
  const [loading, setLoading] = useState(false);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [favoriteRecipeIds, setFavoriteRecipeIds] = useState<string[]>(storage.getFavoriteRecipeIds());
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const quickSuggestions = [
    'Tempe', 'Daun Bawang', 'Cabai Rawit', 'Kecap Manis', 'Sawi Hijau', 'Tomat'
  ];

  const categories = [
    'Semua Resep',
    '⚡ Menu Cepat (< 20 Mnt)',
    '🏠 Masakan Rumahan',
    '💰 Hemat / Tanggal Tua',
    '🥗 Sehat & Sayur'
  ];

  const handleAddIngredient = (item: string) => {
    const trimmed = item.trim();
    if (trimmed && !activeIngredients.includes(trimmed)) {
      setActiveIngredients([...activeIngredients, trimmed]);
      setInputVal('');
    }
  };

  const handleRemoveIngredient = (item: string) => {
    setActiveIngredients(activeIngredients.filter(i => i !== item));
  };

  const handleGenerate = async () => {
    if (activeIngredients.length === 0) {
      alert('Silakan masukkan minimal 1 bahan makanan di dapur Anda!');
      return;
    }
    setLoading(true);
    try {
      const results = await generateRecipesWithAI(activeIngredients);
      setRecipes(results);
      showToast('Resep olahan berhasil diracik oleh AI!');
    } catch (err) {
      console.error(err);
      alert('Gagal meracik resep. Silakan coba kembali.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Photo Upload & Vision AI Analysis
  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = reader.result as string;
        setPhotoPreview(base64);
        setIsAnalyzingPhoto(true);
        try {
          const res = await analyzeFoodPhotoWithAI(base64, file.type);
          setVisionResult(res);
          // Auto add detected ingredients to active tags
          if (res.detectedIngredients.length > 0) {
            setActiveIngredients(res.detectedIngredients);
          }
          if (res.recipes.length > 0) {
            setRecipes(res.recipes);
          }
          showToast('Foto berhasil dianalisis! Bahan & estimasi ketahanan terdeteksi.');
        } catch (err) {
          console.error(err);
          alert('Gagal menganalisis foto.');
        } finally {
          setIsAnalyzingPhoto(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleToggleFavorite = (recipe: Recipe) => {
    const isAdded = storage.toggleFavoriteRecipe(recipe.id);
    setFavoriteRecipeIds(storage.getFavoriteRecipeIds());
    
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
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // If no recipes generated yet, use the featured one from user's Figma
  const featuredRecipe: Recipe = recipes[0] || {
    id: 'rec-featured-default',
    title: 'Tumis Tahu Telur Gurih Manis',
    description: 'Hidangan comfort food khas rumahan yang hangat dan ramah anak. Tahu sutra/putih dipotong dadu lalu ditumis harum bersama bawang putih, dituang telur kocok orak-arik lembut berbalut kecap manis gurih.',
    matchedIngredients: ['Tahu Putih', 'Telur Ayam', 'Bawang Putih', 'Wortel'],
    additionalIngredients: ['Kecap Manis', 'Minyak Goreng', 'Garam & Merica', 'Daun Bawang'],
    prepTime: '15 Menit',
    difficulty: 'Mudah' as const,
    servings: 2,
    caloriesApprox: 240,
    rating: 4.9,
    reviewsCount: 1200,
    steps: [
      'Potong dadu tahu putih, goreng setengah matang hingga sedikit berkulit luar.',
      'Cincang halus bawang putih dan iris serong wortel serta daun bawang.',
      'Panaskan sedikit minyak, tumis bawang putih hingga harum semerbak.',
      'Masukkan potongan wortel dan tahu goreng, tuangkan telur kocok lepas di sela-sela tahu.',
      'Biarkan telur agak mengeras sebentar, lalu orak-arik perlahan.',
      'Tambahkan 2 sdm kecap manis, garam, dan merica. Aduk merata dan sajikan hangat.'
    ],
    tips: 'Goreng tahu jangan terlalu kering agar tekstur dalamnya tetap lembut dan bumbu kecap manis mudah meresap.',
    source: 'Curated' as const
  };

  const secondaryRecipes: Recipe[] = recipes.length > 1 ? recipes.slice(1) : [
    {
      id: 'rec-sec-1',
      title: 'Sup Bening Segar Telur Wortel',
      description: 'Kuah kaldu bening ringan kaya vitamin dan serat alami, sangat pas disantap hangat saat cuaca dingin.',
      matchedIngredients: ['Telur Ayam', 'Wortel Segar', 'Bawang Putih'],
      additionalIngredients: ['Seledri', 'Bawang Goreng'],
      prepTime: '15 Menit',
      difficulty: 'Mudah' as const,
      servings: 3,
      rating: 4.8,
      reviewsCount: 840,
      steps: ['Didihkan air kaldu dengan bawang putih geprek...', 'Tuang telur kocok perlahan sambil diaduk...'],
      source: 'Curated' as const
    },
    {
      id: 'rec-sec-2',
      title: 'Orak-Arik Sayur Bumbu Gurih',
      description: 'Perpaduan wortel dan telur orak-arik renyah kaya gizi dengan bumbu gurih yang sedap untuk sarapan.',
      matchedIngredients: ['Telur Ayam', 'Wortel', 'Bawang Putih'],
      additionalIngredients: ['Saus Tiram', 'Kecap Asin'],
      prepTime: '15 Menit',
      difficulty: 'Mudah' as const,
      servings: 2,
      rating: 4.7,
      reviewsCount: 650,
      steps: ['Tumis bumbu halus...', 'Orak-arik telur dan sayuran hingga matang renyah...'],
      source: 'Curated' as const
    }
  ];


  return (
    <div className="space-y-6 pb-16">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1E1715] text-white text-xs px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Breadcrumbs (Exact Figma) */}
      <div className="flex items-center gap-2 text-xs text-[#786C68] font-medium">
        <span>Beranda</span>
        <span className="text-[10px] text-[#786C68]">›</span>
        <span className="text-[#FF5722] font-semibold">Inspirasi Masak Harian</span>
      </div>

      {/* HERO BANNER (Exact Figma Design + Vision AI Trigger) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F0E5E1] shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFEBE6] text-[#FF5722] text-xs font-bold w-fit">
            <span>❤️</span>
            <span>Teman Setia Masak Rumahan</span>
          </div>

          {/* Tombol Fitur Baru: FOTO BAHAN DENGAN KAMERA / UPLOAD */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-4 py-2 bg-[#FFF1ED] hover:bg-[#FFE0D6] border border-[#FFD8CF] text-[#FF5722] rounded-2xl text-xs font-bold transition-all shadow-2xs w-fit"
          >
            <Camera className="w-4 h-4 text-[#FF5722]" />
            <span>📸 Foto Bahan di Kulkas (Cek Daya Tahan & Resep)</span>
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handlePhotoSelect}
            accept="image/*"
            className="hidden"
          />
        </div>
        
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#1E1715] mb-2">
          Punya bahan apa di kulkas hari ini?
        </h2>
        
        <p className="text-xs sm:text-sm text-[#786C68] mb-6">
          Ketik bahan atau foto isi kulkasmu, temukan hidangan lezat rumahan yang hangat, bergizi, dan ketahui berapa lama bahanmu bisa bertahan.
        </p>

        {/* Input Bar & Racik Resep CTA */}
        <div className="flex flex-col sm:flex-row items-center gap-2 mb-4">
          <div className="relative flex-1 w-full flex items-center">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#FF5722] font-bold text-base pointer-events-none">+</span>
            <input 
              type="text" 
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={(e) => {
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
              onClick={() => handleAddIngredient(inputVal)}
              className="px-4 py-3 bg-[#FFF1ED] hover:bg-orange-100 text-[#FF5722] border border-[#FFD8CF] rounded-2xl text-xs font-bold transition-colors shrink-0"
            >
              + Tambah
            </button>
            <button 
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

        {/* Active Chips (Figma Exact) */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-[#786C68] uppercase tracking-wider">
              BAHAN YANG SIAP DIGUNAKAN ({activeIngredients.length} BAHAN)
            </span>
            {activeIngredients.length > 0 && (
              <span 
                onClick={() => setActiveIngredients([])}
                className="text-xs text-red-500 font-semibold cursor-pointer hover:underline"
              >
                Hapus Semua
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {activeIngredients.map((item) => (
              <span 
                key={item}
                className="inline-flex items-center gap-2 bg-[#FFF8F6] border border-[#F0E5E1] px-3.5 py-1.5 rounded-full text-xs font-semibold"
              >
                <span>{item}</span>
                <span 
                  onClick={() => handleRemoveIngredient(item)}
                  className="text-[#786C68] hover:text-red-500 cursor-pointer text-[10px] ml-0.5"
                >
                  ✕
                </span>
              </span>
            ))}
          </div>
        </div>

        {/* Suggestion tags (Figma Exact) */}
        <div className="flex flex-wrap items-center gap-2 text-xs pt-1">
          <span className="text-[#786C68] font-medium text-[11px]">Saran bumbu &amp; pelengkap cepat:</span>
          {quickSuggestions.map(sug => (
            <span 
              key={sug}
              onClick={() => handleAddIngredient(sug)}
              className="px-2.5 py-1 bg-white hover:bg-orange-50 border border-[#F0E5E1] rounded-full text-[#1E1715] font-medium cursor-pointer transition-colors"
            >
              + {sug}
            </span>
          ))}
        </div>
      </div>

      {/* ============================================================== */}
      {/* FITUR BARU: HASIL ANALISIS FOTO & ESTIMASI KETAHANAN / FOOD EXPIRY */}
      {/* ============================================================== */}
      {isAnalyzingPhoto && (
        <div className="bg-white rounded-3xl p-8 border border-[#FFD8CF] shadow-xs text-center space-y-4 animate-pulse">
          <div className="w-14 h-14 rounded-2xl bg-[#FFEBE6] text-[#FF5722] flex items-center justify-center mx-auto text-2xl font-bold">
            📸
          </div>
          <h3 className="text-lg font-bold text-[#1E1715]">
            AI Gemini Sedang Memindai Foto Bahan Makanan Anda...
          </h3>
          <p className="text-xs text-[#786C68] max-w-md mx-auto">
            Mendeteksi jenis bahan, memperkirakan tingkat kesegaran, serta menghitung sisa waktu layak konsumsi (shelf-life).
          </p>
        </div>
      )}

      {visionResult && !isAnalyzingPhoto && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#FFD8CF] shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F0E5E1] pb-4">
            <div className="flex items-center gap-3">
              {photoPreview && (
                <img 
                  src={photoPreview} 
                  alt="Bahan difoto" 
                  className="w-14 h-14 rounded-2xl object-cover border border-[#F0E5E1] shadow-2xs" 
                />
              )}
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                  ✓ Berhasil Terdeteksi oleh Vision AI
                </span>
                <h3 className="text-lg font-extrabold text-[#1E1715] mt-1">
                  Hasil Pemindaian Bahan &amp; Estimasi Daya Tahan
                </h3>
              </div>
            </div>

            <button
              onClick={() => setVisionResult(null)}
              className="text-xs text-[#786C68] hover:text-red-500 font-bold self-start sm:self-center"
            >
              Tutup Hasil Pindai ✕
            </button>
          </div>

          {/* Urgent Food Waste Advice */}
          {visionResult.urgentCookAdvice && (
            <div className="p-4 rounded-2xl bg-[#FFF4F0] border border-[#FFD8CF] flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-[#FF5722] shrink-0 mt-0.5" />
              <div className="text-xs">
                <span className="font-bold text-[#1E1715] block mb-0.5">Saran Prioritas Memasak (Anti Food Waste):</span>
                <p className="text-[#786C68] leading-relaxed">{visionResult.urgentCookAdvice}</p>
              </div>
            </div>
          )}

          {/* Shelf Life Cards Grid */}
          <div>
            <h4 className="text-xs font-bold text-[#1E1715] uppercase tracking-wider mb-3">
              Kondisi &amp; Perkiraan Masa Simpan Bahan:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              {visionResult.shelfLifeList.map((item, idx) => {
                const isUrgent = item.freshnessStatus === 'Perlu Cepat Diolah';
                return (
                  <div 
                    key={idx} 
                    className={`p-4 rounded-2xl border transition-all ${
                      isUrgent 
                        ? 'bg-orange-50/60 border-orange-200' 
                        : 'bg-[#FFF8F6] border-[#F0E5E1]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-xs text-[#1E1715] truncate">{item.name}</span>
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                        isUrgent 
                          ? 'bg-amber-100 text-amber-800' 
                          : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {item.freshnessStatus}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#FF5722] mb-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{item.shelfLife}</span>
                    </div>

                    <p className="text-[11px] text-[#786C68] leading-relaxed">
                      💡 {item.storageTip}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* CATEGORY TABS (Exact Figma) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
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

      {/* MAIN 2-COLUMN GRID (Exact Figma: 7 Cols Featured + 5 Cols Alternatives) */}
      <div className="grid grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: FEATURED HERO RECIPE (7 COLS) */}
        <div className="col-span-12 lg:col-span-7 space-y-6">
          <div className="bg-white rounded-3xl border border-[#F0E5E1] shadow-2xs overflow-hidden">
            <div className="relative h-72 w-full overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1000&q=80" 
                alt={featuredRecipe.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/20 to-transparent"></div>
              
              <div className="absolute top-4 left-4 bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                <span>✓</span>
                <span>Bahan Lengkap &amp; Siap Masak</span>
              </div>
              
              <button
                type="button"
                onClick={() => handleToggleFavorite(featuredRecipe)}
                className={`absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center text-xs shadow-md transition-colors ${
                  favoriteRecipeIds.includes(featuredRecipe.id)
                    ? 'bg-red-50 text-red-500'
                    : 'bg-white/90 text-[#786C68] hover:bg-white hover:text-red-500'
                }`}
              >
                {favoriteRecipeIds.includes(featuredRecipe.id) ? (
                  <BookmarkCheck className="w-4 h-4 fill-current" />
                ) : (
                  <Bookmark className="w-4 h-4" />
                )}
              </button>
              
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

              {/* Solusi BEMAS Box (Exact Figma Design: Dilema Beli vs Masak) */}
              <div className="bg-[#FFF4F0] rounded-2xl p-4 border border-[#FFD8CF] flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#FF5722] text-white flex items-center justify-center shrink-0 text-base font-bold shadow-2xs">
                  ⚖️
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-[#1E1715]">Dilema: Mau Masak Sendiri atau Beli Jadi?</span>
                    <span className="text-[10px] bg-white border border-[#FFD8CF] text-[#FF5722] font-bold px-2 py-0.5 rounded-full">Solusi BEMAS</span>
                  </div>
                  <p className="text-xs text-[#786C68] leading-relaxed mb-3">
                    Bahan di dapurmu sudah 100% lengkap! Tapi jika lagi lelah atau malas cuci wajan, ada <strong className="text-[#1E1715]">warung makan olahan serupa</strong> di sekitarmu (mulai radius 400m).
                  </p>
                  <div className="flex flex-wrap items-center gap-3">
                    <button 
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

          {/* Step by Step Cooking Card (Exact Figma) */}
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
                  <div key={i} className="flex items-center gap-2.5 p-2.5 bg-[#FFF8F6] rounded-xl border border-[#F0E5E1] text-xs font-medium">
                    <span className="text-[#FF5722] font-bold">✓</span>
                    <span>{m}</span>
                  </div>
                ))}
                {featuredRecipe.additionalIngredients?.map((add, i) => (
                  <div key={i} className="flex items-center gap-2.5 p-2.5 bg-white rounded-xl border border-[#F0E5E1] text-xs text-[#786C68]">
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
                  <li key={i} className="leading-relaxed pl-1">{st}</li>
                ))}
              </ol>
            </div>

            {/* Tips Koki */}
            {featuredRecipe.tips && (
              <div className="p-3.5 rounded-2xl bg-[#FFF8F6] border border-[#F0E5E1] text-xs text-[#786C68] flex items-start gap-2">
                <Lightbulb className="w-4 h-4 text-[#FF5722] shrink-0 mt-0.5" />
                <span><strong className="text-[#1E1715]">Tips Koki BEMAS:</strong> {featuredRecipe.tips}</span>
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
                <button
                  type="button"
                  onClick={() => handleToggleFavorite(sec)}
                  className={`p-1 rounded-md transition ${
                    favoriteRecipeIds.includes(sec.id) ? 'text-red-500' : 'text-slate-300 hover:text-red-500'
                  }`}
                >
                  <Bookmark className="w-4 h-4" />
                </button>
              </div>

              <h4 className="font-bold text-sm text-[#1E1715] mb-1">{sec.title}</h4>
              <p className="text-xs text-[#786C68] line-clamp-2 mb-3">{sec.description}</p>

              <div className="flex items-center justify-between pt-2 border-t border-[#F0E5E1] text-xs">
                <span className="text-[11px] text-[#786C68]">Bahan: {sec.matchedIngredients.join(', ')}</span>
                <span 
                  onClick={() => {
                    setRecipes([sec, featuredRecipe]);
                    window.scrollTo({ top: 300, behavior: 'smooth' });
                  }}
                  className="font-bold text-[#FF5722] hover:underline cursor-pointer flex items-center gap-1"
                >
                  Lihat Resep →
                </span>
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
              onClick={onGoToMap}
              className="w-full py-2.5 bg-[#FF5722] hover:bg-[#E64A19] text-white rounded-xl text-xs font-bold transition shadow-xs"
            >
              Jelajahi Peta Kuliner Sekarang
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
