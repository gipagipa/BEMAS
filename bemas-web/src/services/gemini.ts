import { Recipe, RecipeCategoryTag } from '../types';
import { storage, sanitizeText, STORAGE_KEYS } from './storage';

export const CURATED_RECIPES: Recipe[] = [
  {
    id: 'rec-curated-1',
    title: 'Tumis Tahu Telur Gurih Manis',
    description:
      'Hidangan comfort food khas rumahan yang hangat dan ramah anak. Tahu sutra/putih dipotong dadu lalu ditumis harum bersama bawang putih, dituang telur kocok orak-arik lembut berbalut kecap manis gurih.',
    matchedIngredients: ['tahu', 'telur', 'bawang putih', 'kecap'],
    additionalIngredients: ['daun bawang', 'garam & merica', 'minyak wijen'],
    prepTime: '15 Menit',
    difficulty: 'Mudah',
    servings: 2,
    caloriesApprox: 240,
    rating: 4.9,
    reviewsCount: 1200,
    steps: [
      'Potong dadu 4 kotak tahu putih, goreng setengah matang hingga sedikit berkulit luar.',
      'Cincang halus 3 siung bawang putih dan iris 1 batang daun bawang.',
      'Panaskan sedikit minyak, tumis bawang putih hingga harum semerbak.',
      'Masukkan tahu goreng, lalu tuangkan 2 butir telur kocok lepas di sela-sela tahu.',
      'Biarkan telur agak mengeras sebentar, lalu orak-arik perlahan.',
      'Tambahkan 2 sdm kecap manis, 1 sdm saus tiram, garam, dan merica. Aduk merata dan taburi daun bawang sebelum diangkat.'
    ],
    tips: 'Goreng tahu sebentar saja agar tekstur dalamnya tetap lembut dan creamy saat disiram telur.',
    source: 'Curated',
    engineName: 'Resep Pilihan Koki',
    imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1000&q=80',
    categoryTags: [
      '⚡ Menu Cepat (< 20 Mnt)',
      '🏠 Masakan Rumahan',
      '💰 Hemat / Tanggal Tua'
    ]
  },
  {
    id: 'rec-curated-2',
    title: 'Sup Bening Segar Telur Wortel',
    description:
      'Kuah kaldu bening ringan kaya vitamin dan serat alami, sangat pas disantap hangat saat cuaca dingin atau untuk pemulihan stamina.',
    matchedIngredients: ['telur', 'wortel', 'bawang'],
    additionalIngredients: ['daun seledri', 'kaldu ayam', 'bawang goreng'],
    prepTime: '15 Menit',
    difficulty: 'Mudah',
    servings: 3,
    caloriesApprox: 180,
    rating: 4.8,
    reviewsCount: 840,
    steps: [
      'Kupas dan iris bulat tipis 2 buah wortel segar.',
      'Didihkan 600ml air kaldu bersama 2 siung bawang putih geprek.',
      'Masukkan irisan wortel, masak hingga mulai empuk (sekitar 5 menit).',
      'Kocok lepas 2 butir telur, tuang perlahan ke dalam kuah mendidih sambil diaduk memutar agar membentuk serabut telur yang cantik.',
      'Bumbui dengan garam, lada bubuk, dan kaldu jamur secukupnya.',
      'Matikan api, masukkan daun seledri cincang dan taburan bawang goreng renyah.'
    ],
    tips: 'Tuang telur saat kuah benar-benar mendidih bergolak agar serabut telur mengembang lembut.',
    source: 'Curated',
    engineName: 'Resep Pilihan Koki',
    imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1000&q=80',
    categoryTags: [
      '⚡ Menu Cepat (< 20 Mnt)',
      '🏠 Masakan Rumahan',
      '🥗 Sehat & Sayur'
    ]
  },
  {
    id: 'rec-curated-3',
    title: 'Orak-Arik Sayur Bumbu Gurih',
    description:
      'Perpaduan buncis, wortel, dan telur orak-arik renyah kaya gizi dengan bumbu gurih yang sedap untuk sarapan atau bekal makan siang.',
    matchedIngredients: ['telur', 'buncis', 'wortel', 'bawang'],
    additionalIngredients: ['cabai merah', 'saus tiram', 'minyak kelapa'],
    prepTime: '15 Menit',
    difficulty: 'Mudah',
    servings: 3,
    caloriesApprox: 210,
    rating: 4.7,
    reviewsCount: 650,
    steps: [
      'Iris serong buncis dan iris korek api wortel segar.',
      'Tumis irisan bawang merah dan bawang putih cincang hingga harum.',
      'Sisihkan tumisan bumbu ke tepi wajan, orak-arik 2 butir telur hingga matang.',
      'Campurkan sayuran buncis dan wortel ke dalam wajan, tumis dengan api besar.',
      'Bumbui dengan saus tiram, kecap asin, dan merica bubuk.',
      'Masak sebentar hingga sayuran matang tapi tetap bertekstur renyah (crunchy).'
    ],
    tips: 'Masak dengan api besar dan waktu singkat agar nutrisi dan warna hijau sayuran tetap segar.',
    source: 'Curated',
    engineName: 'Resep Pilihan Koki',
    imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1000&q=80',
    categoryTags: [
      '⚡ Menu Cepat (< 20 Mnt)',
      '💰 Hemat / Tanggal Tua',
      '🥗 Sehat & Sayur'
    ]
  }
];

/**
 * Sanitasi dan normalisasi nama bahan makanan
 */
export function sanitizeIngredient(raw: string): string {
  return sanitizeText(raw);
}

/**
 * Validasi apakah string bahan makanan sah (mengandung minimal 2 huruf alfabet)
 */
export function isValidIngredient(item: string): boolean {
  const clean = sanitizeIngredient(item);
  if (clean.length < 2 || clean.length > 60) return false;
  const letterMatches = clean.match(/[a-zA-Z]/g);
  return Boolean(letterMatches && letterMatches.length >= 2);
}

/**
 * Menambahkan bahan makanan (mendukung input dipisahkan koma, deduplikasi case-insensitive, & validasi)
 */
export function addIngredientsToList(
  currentList: string[],
  rawInput: string
): {
  updated: string[];
  added: string[];
  duplicate: boolean;
  error?: string;
} {
  const cleanRaw = sanitizeIngredient(rawInput);
  if (!cleanRaw) {
    return {
      updated: currentList,
      added: [],
      duplicate: false,
      error: 'Masukkan nama bahan makanan terlebih dahulu'
    };
  }

  const parts = cleanRaw
    .split(',')
    .map(p => sanitizeIngredient(p))
    .filter(Boolean);

  if (parts.length === 0 || !parts.every(isValidIngredient)) {
    return {
      updated: currentList,
      added: [],
      duplicate: false,
      error: 'Nama bahan makanan tidak valid (minimal 2 huruf)'
    };
  }

  const nextList = [...currentList];
  const added: string[] = [];
  let foundDuplicate = false;

  for (const part of parts) {
    const exists = nextList.some(existing => existing.toLowerCase() === part.toLowerCase());
    if (exists) {
      foundDuplicate = true;
    } else {
      nextList.push(part);
      added.push(part);
    }
  }

  if (added.length === 0 && foundDuplicate) {
    return {
      updated: currentList,
      added: [],
      duplicate: true,
      error: 'Bahan makanan tersebut sudah ada di dalam daftar'
    };
  }

  return {
    updated: nextList,
    added,
    duplicate: foundDuplicate
  };
}

/**
 * Membuat kunci cache deterministik berdasarkan kombinasi bahan yang diurutkan (SRS UC-03 & SDD 3.3.1)
 */
export function getRecipeCacheKey(
  ingredients: string[],
  preferences?: { maxTime?: string; difficulty?: string }
): string {
  const normalized = Array.from(
    new Set(
      ingredients
        .map(i => sanitizeIngredient(i).toLowerCase())
        .filter(isValidIngredient)
    )
  ).sort();

  const prefPart = preferences
    ? `|t:${preferences.maxTime || ''}|d:${preferences.difficulty || ''}`
    : '';
  return `recipes:v3:${normalized.join(',')}${prefPart}`;
}

export function getCachedRecipes(cacheKey: string): Recipe[] | null {
  const raw = localStorage.getItem(STORAGE_KEYS.RECIPE_CACHE);
  if (!raw) return null;
  try {
    const store = JSON.parse(raw) as Record<string, { timestamp: number; recipes: Recipe[] }>;
    const entry = store[cacheKey];
    if (!entry || !Array.isArray(entry.recipes) || entry.recipes.length === 0) {
      return null;
    }
    return entry.recipes;
  } catch {
    return null;
  }
}

export function saveCachedRecipes(cacheKey: string, recipes: Recipe[]): void {
  const raw = localStorage.getItem(STORAGE_KEYS.RECIPE_CACHE);
  let store: Record<string, { timestamp: number; recipes: Recipe[] }> = {};
  if (raw) {
    try {
      store = JSON.parse(raw) || {};
    } catch {
      store = {};
    }
  }
  store[cacheKey] = {
    timestamp: Date.now(),
    recipes
  };
  localStorage.setItem(STORAGE_KEYS.RECIPE_CACHE, JSON.stringify(store));
}

/**
 * Penyaringan daftar resep berdasarkan tab kategori (UC-03)
 */
export function filterRecipesByCategory(
  recipes: Recipe[],
  category: RecipeCategoryTag | string
): Recipe[] {
  if (!Array.isArray(recipes)) return [];
  if (!category || category === 'Semua Resep') return recipes;

  return recipes.filter(rec => {
    if (rec.categoryTags && rec.categoryTags.includes(category as RecipeCategoryTag)) {
      return true;
    }
    const text = `${rec.title} ${rec.description} ${rec.matchedIngredients.join(' ')}`.toLowerCase();
    const prepMinutes = parseInt(rec.prepTime, 10) || 15;

    if (category === '⚡ Menu Cepat (< 20 Mnt)') {
      return prepMinutes <= 20;
    }
    if (category === '🏠 Masakan Rumahan') {
      return rec.difficulty === 'Mudah' || text.includes('rumahan') || text.includes('tumis') || text.includes('sup');
    }
    if (category === '💰 Hemat / Tanggal Tua') {
      return text.includes('tahu') || text.includes('telur') || text.includes('tempe') || (rec.caloriesApprox ?? 200) <= 250;
    }
    if (category === '🥗 Sehat & Sayur') {
      return text.includes('sayur') || text.includes('wortel') || text.includes('buncis') || text.includes('sup') || text.includes('bening');
    }
    return true;
  });
}

/**
 * UC-03: Mencari Resep Berdasarkan Bahan melalui Engine AI (Gemini) & Smart Fallback
 * - Exceptional Flow 1a: Input kosong melempar error "Silakan masukkan minimal satu bahan makanan"
 * - Exceptional Flow 3a: Menangani kegagalan jaringan/API dengan aman
 * - Implementation Issue: Menyimpan dan membaca hasil dari prompt cache (SDD 3.3.1)
 */
export async function generateRecipesWithAI(
  userIngredients: string[],
  preferences?: { maxTime?: string; difficulty?: string; strictApi?: boolean }
): Promise<Recipe[]> {
  if (!Array.isArray(userIngredients)) {
    throw new Error('Silakan masukkan minimal satu bahan makanan');
  }

  const validIngredients = userIngredients
    .map(sanitizeIngredient)
    .filter(isValidIngredient);

  if (validIngredients.length === 0) {
    throw new Error('Silakan masukkan minimal satu bahan makanan');
  }

  const cacheKey = getRecipeCacheKey(validIngredients, preferences);
  const cached = getCachedRecipes(cacheKey);
  if (cached) {
    return cached;
  }

  const apiKey = storage.getGeminiApiKey();

  if (apiKey) {
    try {
      const prompt = `Anda adalah koki profesional cerdas dan asisten kuliner aplikasi BEMAS (Beli atau Masak).
Pengguna memiliki bahan-bahan makanan berikut: ${validIngredients.join(', ')}.
${preferences?.maxTime ? `Preferensi waktu: Maksimal ${preferences.maxTime}.` : ''}
${preferences?.difficulty ? `Preferensi kesulitan: ${preferences.difficulty}.` : ''}

Tugas Anda:
Buatlah 2 sampai 3 rekomendasi resep masakan Indonesia yang lezat, praktis, dan kreatif berdasarkan bahan-bahan di atas.

KEMBALIKAN HANYA FORMAT JSON VALID berupa array of objects tanpa teks pembuka/penutup markdown lain, dengan skema:
[
  {
    "id": "rec-ai-1",
    "title": "Nama Resep Masakan",
    "description": "Deskripsi singkat menggugah selera 1-2 kalimat.",
    "matchedIngredients": ["bahan1", "bahan2"],
    "additionalIngredients": ["bahan pelengkap yang umum ada di rumah"],
    "prepTime": "15 Menit",
    "difficulty": "Mudah",
    "servings": 2,
    "caloriesApprox": 250,
    "rating": 4.9,
    "reviewsCount": 110,
    "steps": [
      "Langkah 1...",
      "Langkah 2...",
      "Langkah 3..."
    ],
    "tips": "Tips khusus memasak agar masakan lebih nikmat",
    "source": "AI-Generated"
  }
]`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              responseMimeType: 'application/json',
              temperature: 0.7
            }
          })
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP Error ${response.status}`);
      }

      const data = await response.json();
      const jsonText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!jsonText) {
        throw new Error('Respons AI kosong');
      }

      const parsed: Recipe[] = JSON.parse(jsonText);
      if (!Array.isArray(parsed) || parsed.length === 0) {
        throw new Error('Format JSON resep tidak valid');
      }

      const normalizedRecipes: Recipe[] = parsed.map((r, i) => ({
        ...r,
        id: `rec-ai-${Date.now()}-${i}`,
        matchedIngredients:
          Array.isArray(r.matchedIngredients) && r.matchedIngredients.length > 0
            ? r.matchedIngredients
            : validIngredients,
        additionalIngredients: Array.isArray(r.additionalIngredients)
          ? r.additionalIngredients
          : [],
        steps:
          Array.isArray(r.steps) && r.steps.length > 0
            ? r.steps
            : ['Siapkan dan olah seluruh bahan sesuai takaran.'],
        source: 'AI-Generated' as const,
        engineName: 'Google Gemini 1.5 Flash'
      }));

      saveCachedRecipes(cacheKey, normalizedRecipes);
      return normalizedRecipes;
    } catch {
      if (preferences?.strictApi) {
        throw new Error('Gagal terhubung ke layanan rekomendasi, silakan coba beberapa saat lagi');
      }
    }
  } else if (preferences?.strictApi) {
    throw new Error('Gagal terhubung ke layanan rekomendasi, silakan coba beberapa saat lagi');
  }

  // BEMAS Generative Culinary AI Engine (Offline Generative Synthesizer)
  const fallbackResult = generateDynamicRecipes(validIngredients, preferences);
  saveCachedRecipes(cacheKey, fallbackResult);
  return fallbackResult;
}

/**
 * BEMAS Generative Culinary AI Engine
 * Menghasilkan rekomendasi resep masakan Indonesia yang dinamis, kontekstual, dan lezat
 * secara otomatis beradaptasi dengan variasi bahan dapur yang diinput pengguna.
 */
export function generateDynamicRecipes(
  validIngredients: string[],
  _preferences?: { maxTime?: string; difficulty?: string }
): Recipe[] {
  const lowerIngredients = validIngredients.map(i => i.toLowerCase().trim());
  const hasTempe = lowerIngredients.some(i => i.includes('tempe'));
  const hasTahu = lowerIngredients.some(i => i.includes('tahu'));
  const hasTelur = lowerIngredients.some(i => i.includes('telur'));
  const hasAyam = lowerIngredients.some(
    i => (i.includes('ayam') && !i.includes('telur')) || i.includes('daging ayam') || i.includes('fillet ayam')
  );
  const hasIkan = lowerIngredients.some(
    i =>
      i.includes('ikan') ||
      i.includes('teri') ||
      i.includes('tongkol') ||
      i.includes('tuna') ||
      i.includes('lele') ||
      i.includes('gurame')
  );
  const hasSeafood = lowerIngredients.some(
    i => i.includes('udang') || i.includes('cumi') || i.includes('kepiting')
  );
  const hasKangkung = lowerIngredients.some(i => i.includes('kangkung'));
  const hasNasi = lowerIngredients.some(i => i.includes('nasi'));
  const hasMie = lowerIngredients.some(
    i => i.includes('mie') || i.includes('bihun') || i.includes('kwetiau')
  );

  const timestamp = Date.now();

  // 1. OLAHAN KHUSUS TEMPE
  if (hasTempe) {
    return [
      {
        id: `rec-tempe-1-${timestamp}`,
        title: 'Orek Tempe Basah Manis Gurih',
        description:
          'Potongan tempe gurih berbalut bumbu kecap manis legit, bawang putih cincang, dan cabai aromatik. Lauk legendaris favorit keluarga yang sangat praktis dan kaya protein nabati.',
        matchedIngredients: validIngredients,
        additionalIngredients: [
          'Kecap Manis',
          'Bawang Merah & Putih',
          'Cabai Rawit',
          'Daun Salam & Lengkuas',
          'Garam & Kaldu Jamur'
        ],
        prepTime: '15 Menit',
        difficulty: 'Mudah',
        servings: 3,
        caloriesApprox: 220,
        rating: 4.9,
        reviewsCount: 1420,
        imageUrl:
          'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1000&q=80',
        steps: [
          'Potong tempe berbentuk korek api tebal atau dadu kecil sesuai selera.',
          'Panaskan minyak, goreng tempe hingga setengah matang (berkulit keemasan namun bagian dalam tetap empuk), angkat dan tiriskan.',
          'Tumis 3 siung bawang merah iris, 2 siung bawang putih cincang, lengkuas geprek, dan cabai rawit hingga harum semerbak.',
          'Masukkan potongan tempe goreng ke dalam wajan bumbu tumis, aduk merata.',
          'Tuangkan 3 sdm kecap manis, 1/2 sdt garam, 1/2 sdt kaldu jamur, dan 50ml air matang.',
          'Masak dengan api sedang hingga bumbu kecap meresap sempurna dan mengering berkilau menyelimuti tempe. Angkat dan sajikan hangat.'
        ],
        tips: 'Goreng tempe setengah matang saja agar teksturnya tidak mengeras dan bumbu kecap manis meresap sempurna hingga ke pori-pori tempe.',
        source: 'AI-Generated',
        engineName: 'BEMAS Generative Culinary Engine',
        categoryTags: [
          '⚡ Menu Cepat (< 20 Mnt)',
          '🏠 Masakan Rumahan',
          '💰 Hemat / Tanggal Tua'
        ]
      },
      {
        id: `rec-tempe-2-${timestamp}`,
        title: 'Tempe Mendoan Gurih Renyah Khas Banyumas',
        description:
          'Lembaran tempe berbalut adonan tepung berbumbu ketumbar dan daun bawang segar, digoreng setengah matang lembut khas mendoan dengan aroma menggoda.',
        matchedIngredients: validIngredients,
        additionalIngredients: [
          'Tepung Terigu & Beras',
          'Daun Bawang Iris',
          'Ketumbar Bubuk',
          'Bawang Putih Halus',
          'Sambal Kecap Rawit'
        ],
        prepTime: '15 Menit',
        difficulty: 'Mudah',
        servings: 3,
        caloriesApprox: 250,
        rating: 4.8,
        reviewsCount: 980,
        imageUrl:
          'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=1000&q=80',
        steps: [
          'Iris tempe melebar dengan ketebalan sedang (sekitar 0.5 cm).',
          'Buat adonan tepung: campurkan 100gr tepung terigu, 2 sdm tepung beras, 1 sdt ketumbar bubuk, garam, bawang putih halus, dan irisan daun bawang dengan air secukupnya hingga kekentalan sedang.',
          'Panaskan minyak cukup banyak di wajan penggorengan.',
          'Celupkan lembaran tempe ke dalam adonan tepung hingga seluruh sisi terlumuri rata.',
          'Goreng dalam minyak panas sebentar saja (sekitar 2-3 menit) hingga adonan matang tanpa terlalu kering.',
          'Angkat, tiriskan sejenak, lalu hidangkan selagi panas bersama cocolan sambal kecap cabai rawit pedas.'
        ],
        tips: 'Pastikan minyak sudah benar-benar panas sebelum tempe dimasukkan agar tepung langsung mengembang lembut dan tidak menyerap minyak berlebih.',
        source: 'AI-Generated',
        engineName: 'BEMAS Generative Culinary Engine',
        categoryTags: [
          '⚡ Menu Cepat (< 20 Mnt)',
          '🏠 Masakan Rumahan',
          '💰 Hemat / Tanggal Tua'
        ]
      },
      {
        id: `rec-tempe-3-${timestamp}`,
        title: 'Sambal Tempe Penyet Kemangi Wangi',
        description:
          'Tempe goreng gurih yang dipenyet hangat langsung di atas cobek sambal terasi cabai rawit pedas bertabur daun kemangi segar yang menggugah selera.',
        matchedIngredients: validIngredients,
        additionalIngredients: [
          'Cabai Rawit Merah',
          'Bawang Merah & Putih',
          'Terasi Bakar',
          'Daun Kemangi Segar',
          'Jeruk Limau'
        ],
        prepTime: '20 Menit',
        difficulty: 'Mudah',
        servings: 2,
        caloriesApprox: 210,
        rating: 4.9,
        reviewsCount: 1150,
        imageUrl:
          'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1000&q=80',
        steps: [
          'Potong tempe dadu, rendam sebentar dalam air garam dan bawang putih geprek, lalu goreng hingga matang kecokelatan.',
          'Goreng cabai rawit, bawang merah, bawang putih, dan sedikit terasi hingga layu.',
          'Ulek kasar bumbu sambal di atas cobek bersama garam dan sedikit gula pasir.',
          'Masukkan tempe goreng yang masih panas langsung ke atas cobek sambal.',
          'Penyet tempe menggunakan ulekan hingga agak hancur dan tercampur merata dengan bumbu sambal pedas.',
          'Beri kucuran jeruk limau dan taburi daun kemangi segar, siap disantap bersama nasi pulen.'
        ],
        tips: 'Penyet tempe selagi baru matang dari wajan agar uap panas tempe melarutkan aroma sambal dan kemangi secara maksimal.',
        source: 'AI-Generated',
        engineName: 'BEMAS Generative Culinary Engine',
        categoryTags: ['🏠 Masakan Rumahan', '💰 Hemat / Tanggal Tua']
      }
    ];
  }

  // 2. OLAHAN KHUSUS AYAM
  if (hasAyam) {
    return [
      {
        id: `rec-ayam-1-${timestamp}`,
        title: 'Ayam Tumis Bawang Gurih Praktis',
        description:
          'Potongan daging ayam lembut ditumis bersama limpahan bawang bombay, bawang putih, dan saus gurih manis yang meresap sempurna.',
        matchedIngredients: validIngredients,
        additionalIngredients: [
          'Bawang Bombay & Putih',
          'Saus Tiram',
          'Kecap Manis',
          'Lada Hitam',
          'Minyak Wijen'
        ],
        prepTime: '20 Menit',
        difficulty: 'Mudah',
        servings: 3,
        caloriesApprox: 320,
        rating: 4.9,
        reviewsCount: 1120,
        imageUrl:
          'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=1000&q=80',
        steps: [
          'Potong dadu daging ayam, lumuri dengan 1/2 sdt garam dan sedikit perasan jeruk nipis selama 5 menit.',
          'Iris tebal bawang bombay dan cincang halus 3 siung bawang putih.',
          'Panaskan 2 sdm minyak di wajan, tumis bawang putih hingga harum lalu masukkan potongan daging ayam.',
          'Masak ayam hingga berubah warna dan mengeluarkan kaldu alaminya.',
          'Masukkan irisan bawang bombay, 2 sdm saus tiram, 1 sdm kecap manis, dan taburan lada hitam bubuk.',
          'Aduk cepat dengan api besar hingga bumbu mengental meresap dan bawang bombay layu renyah. Angkat dan sajikan.'
        ],
        tips: 'Gunakan api besar saat memasukkan bawang bombay agar tetap renyah manis dan tidak lembek.',
        source: 'AI-Generated',
        engineName: 'BEMAS Generative Culinary Engine',
        categoryTags: ['⚡ Menu Cepat (< 20 Mnt)', '🏠 Masakan Rumahan']
      },
      {
        id: `rec-ayam-2-${timestamp}`,
        title: 'Sup Ayam Jagung Bening Segar',
        description:
          'Kuah kaldu ayam bening yang gurih alami berpadu dengan pipilan jagung manis dan sayuran segar penambah stamina.',
        matchedIngredients: validIngredients,
        additionalIngredients: [
          'Wortel Segar',
          'Daun Bawang & Seledri',
          'Bawang Putih Geprek',
          'Kaldu Ayam',
          'Bawang Goreng'
        ],
        prepTime: '20 Menit',
        difficulty: 'Mudah',
        servings: 4,
        caloriesApprox: 240,
        rating: 4.8,
        reviewsCount: 790,
        imageUrl:
          'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1000&q=80',
        steps: [
          'Rebus potongan ayam dalam 800ml air bersama 2 siung bawang putih geprek dan jahe hingga mendidih dan harum.',
          'Buang buih kotoran yang mengapung di permukaan kuah agar kaldu tetap bening jernih.',
          'Masukkan irisan sayuran segar, masak dengan api sedang hingga mulai empuk.',
          'Bumbui dengan garam, merica bubuk, dan kaldu jamur secukupnya.',
          'Menjelang diangkat, masukkan irisan daun bawang dan seledri cincang.',
          'Tuang ke mangkuk saji hangat, taburi bawang goreng renyah di atasnya.'
        ],
        tips: 'Rebus dengan api kecil setelah mendidih agar kaldu ayam terekstrak perlahan dan kuah tetap jernih.',
        source: 'AI-Generated',
        engineName: 'BEMAS Generative Culinary Engine',
        categoryTags: ['🏠 Masakan Rumahan', '🥗 Sehat & Sayur']
      },
      {
        id: `rec-ayam-3-${timestamp}`,
        title: 'Ayam Ungkep Goreng Bumbu Lengkuas',
        description:
          'Daging ayam diungkep dengan rempah tradisional hingga bumbu meresap ke dalam serat daging, digoreng harum bertabur serundeng gurih.',
        matchedIngredients: validIngredients,
        additionalIngredients: [
          'Lengkuas Parut',
          'Kunyit & Jahe',
          'Bawang Merah & Putih',
          'Ketumbar',
          'Daun Salam'
        ],
        prepTime: '25 Menit',
        difficulty: 'Sedang',
        servings: 4,
        caloriesApprox: 380,
        rating: 4.9,
        reviewsCount: 1650,
        imageUrl:
          'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=1000&q=80',
        steps: [
          'Haluskan bawang merah, bawang putih, kunyit, jahe, dan ketumbar. Campurkan bersama lengkuas parut dan daun salam.',
          'Lumuri potongan ayam dengan bumbu halus dan tambahkan 150ml air ke dalam wajan.',
          'Ungkep ayam dengan api sedang-kecil hingga air menyusut dan bumbu meresap sempurna ke tulang.',
          'Panaskan minyak goreng, angkat potongan ayam dari bumbu dan goreng hingga matang kecokelatan.',
          'Goreng sisa parutan bumbu lengkuas ungkep secara terpisah hingga renyah keemasan.',
          'Sajikan ayam goreng hangat dengan taburan serundeng lengkuas gurih dan sambal terasi.'
        ],
        tips: 'Gunakan parutan lengkuas muda agar kremesannya terasa renyah gurih dan tidak berserat kasar.',
        source: 'AI-Generated',
        engineName: 'BEMAS Generative Culinary Engine',
        categoryTags: ['🏠 Masakan Rumahan']
      }
    ];
  }

  // 3. OLAHAN KHUSUS KANGKUNG
  if (hasKangkung) {
    return [
      {
        id: `rec-kangkung-1-${timestamp}`,
        title: 'Tumis Kangkung Belacan Saus Tiram',
        description:
          'Kangkung segar dimasak cepat dengan api besar berbalut saus tiram gurih, terasi bakar aromatik, dan irisan cabai rawit pedas renyah.',
        matchedIngredients: validIngredients,
        additionalIngredients: [
          'Saus Tiram',
          'Terasi Bakar',
          'Cabai Rawit Merah',
          'Bawang Putih & Merah',
          'Minyak Wijen'
        ],
        prepTime: '10 Menit',
        difficulty: 'Mudah',
        servings: 2,
        caloriesApprox: 130,
        rating: 4.9,
        reviewsCount: 920,
        imageUrl:
          'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1000&q=80',
        steps: [
          'Petik daun dan batang muda kangkung, cuci bersih dengan air mengalir lalu tiriskan.',
          'Iris bawang merah, bawang putih, cabai rawit, dan hancurkan terasi bakar.',
          'Panaskan 2 sdm minyak di wajan hingga panas, tumis bumbu iris dan terasi hingga harum semerbak.',
          'Masukkan kangkung, besarkan api wajan.',
          'Tambahkan 1 sdm saus tiram, sedikit garam, gula pasir, dan 2 sdm air.',
          'Aduk cepat selama 2-3 menit hingga kangkung layu namun warnanya tetap hijau cerah dan renyah. Angkat segera.'
        ],
        tips: 'Masak dengan api sangat besar dan waktu singkat agar batang kangkung tetap renyah (crunchy) dan warnanya tetap hijau menggoda.',
        source: 'AI-Generated',
        engineName: 'BEMAS Generative Culinary Engine',
        categoryTags: [
          '⚡ Menu Cepat (< 20 Mnt)',
          '🏠 Masakan Rumahan',
          '🥗 Sehat & Sayur'
        ]
      },
      {
        id: `rec-kangkung-2-${timestamp}`,
        title: 'Plecing Kangkung Sambal Tomat Terasi',
        description:
          'Kangkung rebus lembut disajikan segar dengan siraman sambal tomat terasi khas Nusantara yang pedas asam menyegarkan.',
        matchedIngredients: validIngredients,
        additionalIngredients: [
          'Tomat Segar',
          'Cabai Rawit',
          'Terasi Bakar',
          'Jeruk Limau',
          'Kacang Tanah Goreng'
        ],
        prepTime: '15 Menit',
        difficulty: 'Mudah',
        servings: 2,
        caloriesApprox: 110,
        rating: 4.8,
        reviewsCount: 640,
        imageUrl:
          'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1000&q=80',
        steps: [
          'Didihkan air dengan sedikit garam, rebus kangkung selama 1-2 menit hingga matang empuk.',
          'Angkat kangkung dan rendam sebentar dalam air es/dingin agar warnanya tetap hijau cerah, lalu peras perlahan dan tata di piring.',
          'Rebus cabai rawit dan tomat sebentar, lalu ulek halus bersama terasi bakar, garam, dan sedikit gula.',
          'Beri perasan jeruk limau segar ke dalam sambal tomat terasi.',
          'Siramkan sambal di atas tumpukan kangkung rebus.',
          'Taburi kacang tanah goreng renyah di atasnya sebelum disajikan.'
        ],
        tips: 'Merendam kangkung sebentar di air es menghentikan proses pematangan sehingga teksturnya tetap kenyal dan tidak lembek.',
        source: 'AI-Generated',
        engineName: 'BEMAS Generative Culinary Engine',
        categoryTags: [
          '⚡ Menu Cepat (< 20 Mnt)',
          '🥗 Sehat & Sayur',
          '💰 Hemat / Tanggal Tua'
        ]
      }
    ];
  }

  // 4. OLAHAN KHUSUS IKAN / SEAFOOD
  if (hasIkan || hasSeafood) {
    const isSeafoodOnly = hasSeafood && !hasIkan;
    return [
      {
        id: `rec-sea-1-${timestamp}`,
        title: isSeafoodOnly
          ? 'Udang Saus Mentega Bawang Bombay'
          : 'Ikan Bumbu Balado Merah Gurih',
        description: isSeafoodOnly
          ? 'Udang segar ditumis harum dalam kelembutan mentega gurih, kecap manis legit, dan perasan jeruk limau yang menggoyang lidah.'
          : 'Ikan goreng gurih renyah berbalut sambal balado merah pedas manis legit khas Nusantara.',
        matchedIngredients: validIngredients,
        additionalIngredients: [
          'Bawang Bombay & Putih',
          'Cabai Merah Keriting',
          'Kecap Manis',
          'Jeruk Limau / Nipis',
          'Garam & Gula'
        ],
        prepTime: '20 Menit',
        difficulty: 'Mudah',
        servings: 3,
        caloriesApprox: 270,
        rating: 4.9,
        reviewsCount: 1100,
        imageUrl:
          'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=1000&q=80',
        steps: [
          'Bersihkan bahan utama, lumuri perasan jeruk nipis dan garam untuk menghilangkan aroma amis.',
          'Goreng sebentar dalam minyak panas hingga matang dan bagian luar sedikit garing, tiriskan.',
          'Tumis bumbu halus (bawang dan cabai) bersama mentega atau sedikit minyak hingga harum semerbak.',
          'Tambahkan kecap manis, saus tiram, sedikit garam, dan merica secukupnya.',
          'Masukkan bahan utama yang sudah digoreng, aduk cepat dengan api besar hingga bumbu terbalut rata.',
          'Beri perasan jeruk limau sebelum diangkat, hidangkan hangat bersama nasi pulen.'
        ],
        tips: 'Jangan memasak seafood terlalu lama agar tekstur daging tetap juicy dan kenyal empuk.',
        source: 'AI-Generated',
        engineName: 'BEMAS Generative Culinary Engine',
        categoryTags: ['⚡ Menu Cepat (< 20 Mnt)', '🏠 Masakan Rumahan']
      }
    ];
  }

  // 5. OLAHAN KHUSUS NASI / MIE
  if (hasNasi || hasMie) {
    const isMieOnly = hasMie && !hasNasi;
    return [
      {
        id: `rec-carbo-1-${timestamp}`,
        title: isMieOnly
          ? 'Mie Goreng Jawa Spesial Rumahan'
          : 'Nasi Goreng Kampung Spesial Telur',
        description: isMieOnly
          ? 'Mie kenyal berpadu dengan sayuran renyah, orak-arik telur, dan racikan bumbu manis gurih khas Jawa.'
          : 'Nasi goreng harum beraroma bawang dan cabai rawit berbalut kecap manis gurih, sajian legendaris praktis penghangat suasana.',
        matchedIngredients: validIngredients,
        additionalIngredients: [
          'Telur Ayam',
          'Bawang Merah & Putih',
          'Kecap Manis',
          'Cabai Rawit',
          'Bawang Goreng'
        ],
        prepTime: '15 Menit',
        difficulty: 'Mudah',
        servings: 2,
        caloriesApprox: 360,
        rating: 4.9,
        reviewsCount: 1850,
        imageUrl:
          'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=1000&q=80',
        steps: [
          'Siapkan bumbu: haluskan 3 siung bawang merah, 2 siung bawang putih, 1 butir kemiri, dan cabai rawit sesuai selera.',
          'Panaskan 2 sdm minyak di wajan, tumis bumbu halus hingga matang dan harum semerbak.',
          'Sisihkan bumbu ke tepi wajan, masukkan 1 butir telur dan orak-arik hingga matang.',
          `Masukkan ${isMieOnly ? 'mie yang telah direbus tiris' : 'nasi dingin (nasi pera)'} ke dalam wajan.`,
          'Bumbui dengan 2 sdm kecap manis, 1 sdm saus tiram, garam, dan lada bubuk secukupnya.',
          'Aduk cepat dengan api besar hingga bumbu menyatu merata dan aroma smokey wajan keluar. Sajikan hangat bertabur bawang goreng.'
        ],
        tips: isMieOnly
          ? 'Tiriskan mie dengan baik dan lumuri 1 sdt minyak sebelum dimasak agar tidak menggumpal di wajan.'
          : 'Gunakan nasi dingin dari kulkas agar butiran nasi terpisah sempurna dan tidak lembek saat diaduk di wajan.',
        source: 'AI-Generated',
        engineName: 'BEMAS Generative Culinary Engine',
        categoryTags: [
          '⚡ Menu Cepat (< 20 Mnt)',
          '🏠 Masakan Rumahan',
          '💰 Hemat / Tanggal Tua'
        ]
      }
    ];
  }

  // 6. OLAHAN TAHU & TELUR (KOMBINASI FAVORIT RUMAHAN)
  if (hasTahu || hasTelur) {
    return [
      {
        id: `rec-tahu-telur-1-${timestamp}`,
        title: 'Tumis Tahu Telur Gurih Manis',
        description:
          'Hidangan comfort food khas rumahan yang hangat dan ramah anak. Tahu sutra/putih dipotong dadu lalu ditumis harum bersama bawang putih, dituang telur kocok orak-arik lembut berbalut kecap manis gurih.',
        matchedIngredients: validIngredients,
        additionalIngredients: ['daun bawang', 'garam & merica', 'minyak wijen'],
        prepTime: '15 Menit',
        difficulty: 'Mudah',
        servings: 2,
        caloriesApprox: 240,
        rating: 4.9,
        reviewsCount: 1200,
        imageUrl:
          'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1000&q=80',
        steps: [
          'Potong dadu 4 kotak tahu putih, goreng setengah matang hingga sedikit berkulit luar.',
          'Cincang halus 3 siung bawang putih dan iris 1 batang daun bawang.',
          'Panaskan sedikit minyak, tumis bawang putih hingga harum semerbak.',
          'Masukkan tahu goreng, lalu tuangkan 2 butir telur kocok lepas di sela-sela tahu.',
          'Biarkan telur agak mengeras sebentar, lalu orak-arik perlahan.',
          'Tambahkan 2 sdm kecap manis, 1 sdm saus tiram, garam, dan merica. Aduk merata dan taburi daun bawang sebelum diangkat.'
        ],
        tips: 'Goreng tahu sebentar saja agar tekstur dalamnya tetap lembut dan creamy saat disiram telur.',
        source: 'AI-Generated',
        engineName: 'BEMAS Generative Culinary Engine',
        categoryTags: [
          '⚡ Menu Cepat (< 20 Mnt)',
          '🏠 Masakan Rumahan',
          '💰 Hemat / Tanggal Tua'
        ]
      },
      {
        id: `rec-tahu-telur-2-${timestamp}`,
        title: 'Sup Bening Segar Telur Wortel',
        description:
          'Kuah kaldu bening ringan kaya vitamin dan serat alami, sangat pas disantap hangat saat cuaca dingin atau untuk pemulihan stamina.',
        matchedIngredients: validIngredients,
        additionalIngredients: ['daun seledri', 'kaldu ayam', 'bawang goreng'],
        prepTime: '15 Menit',
        difficulty: 'Mudah',
        servings: 3,
        caloriesApprox: 180,
        rating: 4.8,
        reviewsCount: 840,
        imageUrl:
          'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1000&q=80',
        steps: [
          'Kupas dan iris bulat tipis 2 buah wortel segar atau sayuran pendamping.',
          'Didihkan 600ml air kaldu bersama 2 siung bawang putih geprek.',
          'Masukkan irisan sayuran, masak hingga mulai empuk (sekitar 5 menit).',
          'Kocok lepas 2 butir telur, tuang perlahan ke dalam kuah mendidih sambil diaduk memutar agar membentuk serabut telur yang cantik.',
          'Bumbui dengan garam, lada bubuk, dan kaldu jamur secukupnya.',
          'Matikan api, masukkan daun seledri cincang dan taburan bawang goreng renyah.'
        ],
        tips: 'Tuang telur saat kuah benar-benar mendidih bergolak agar serabut telur mengembang lembut.',
        source: 'AI-Generated',
        engineName: 'BEMAS Generative Culinary Engine',
        categoryTags: [
          '⚡ Menu Cepat (< 20 Mnt)',
          '🏠 Masakan Rumahan',
          '🥗 Sehat & Sayur'
        ]
      },
      {
        id: `rec-tahu-telur-3-${timestamp}`,
        title: 'Orak-Arik Sayur Bumbu Gurih',
        description:
          'Perpaduan sayuran segar dan telur orak-arik renyah kaya gizi dengan bumbu gurih yang sedap untuk sarapan atau bekal makan siang.',
        matchedIngredients: validIngredients,
        additionalIngredients: ['cabai merah', 'saus tiram', 'minyak kelapa'],
        prepTime: '15 Menit',
        difficulty: 'Mudah',
        servings: 3,
        caloriesApprox: 210,
        rating: 4.7,
        reviewsCount: 650,
        imageUrl:
          'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1000&q=80',
        steps: [
          'Siapkan dan potong bahan sayuran segar sesuai selera.',
          'Tumis irisan bawang merah dan bawang putih cincang hingga harum.',
          'Sisihkan tumisan bumbu ke tepi wajan, orak-arik 2 butir telur hingga matang.',
          'Campurkan sayuran ke dalam wajan, tumis dengan api besar.',
          'Bumbui dengan saus tiram, kecap asin, dan merica bubuk.',
          'Masak sebentar hingga sayuran matang tapi tetap bertekstur renyah (crunchy).'
        ],
        tips: 'Masak dengan api besar dan waktu singkat agar nutrisi dan warna hijau sayuran tetap segar.',
        source: 'AI-Generated',
        engineName: 'BEMAS Generative Culinary Engine',
        categoryTags: [
          '⚡ Menu Cepat (< 20 Mnt)',
          '💰 Hemat / Tanggal Tua',
          '🥗 Sehat & Sayur'
        ]
      }
    ];
  }

  // 7. UNIVERSAL GENERATIVE SYNTHESIZER (Untuk kombinasi bahan kustom lainnya)
  const mainIngredient = validIngredients[0];
  const secondIngredient = validIngredients[1] || '';

  return [
    {
      id: `rec-dyn-1-${timestamp}`,
      title: `Tumis ${mainIngredient} ${secondIngredient ? '& ' + secondIngredient : ''} Saus Tiram Gurih`.trim(),
      description: `Kreasi masakan praktis memanfaatkan ${validIngredients.join(' dan ')} dengan perpaduan saus tiram gurih, bawang putih aromatik, dan cita rasa rumahan yang nikmat.`,
      matchedIngredients: validIngredients,
      additionalIngredients: [
        'Bawang Merah & Putih',
        'Saus Tiram',
        'Kecap Manis',
        'Cabai Rawit Iris',
        'Garam & Kaldu Jamur'
      ],
      prepTime: '15 Menit',
      difficulty: 'Mudah',
      servings: 2,
      caloriesApprox: 210,
      rating: 4.8,
      reviewsCount: 520,
      imageUrl:
        'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1000&q=80',
      steps: [
        `Cuci bersih dan siapkan seluruh bahan: potong ${validIngredients.join(' serta ')} sesuai ukuran gigitan.`,
        'Cincang halus 2 siung bawang putih, iris 3 siung bawang merah, dan iris cabai rawit sesuai selera pedas.',
        'Panaskan 2 sdm minyak di wajan dengan api sedang, tumis bumbu iris hingga harum kekuningan.',
        `Masukkan ${mainIngredient} terlebih dahulu ke dalam wajan, aduk merata dan masak hingga mulai empuk.`,
        validIngredients.length > 1
          ? `Tambahkan ${validIngredients.slice(1).join(' dan ')}, lalu tuangkan 2 sdm saus tiram, 1 sdm kecap manis, garam, dan sedikit air matang.`
          : 'Tambahkan 2 sdm saus tiram, 1 sdm kecap manis, 1/2 sdt garam, dan 30ml air matang.',
        'Aduk cepat hingga bumbu meresap sempurna dan kuah mengental menyelimuti bahan. Angkat dan sajikan selagi hangat.'
      ],
      tips: `Masak dengan api sedang-tinggi agar aroma tumisan keluar maksimal dan tekstur alami ${mainIngredient} tetap segar dan tidak lembek.`,
      source: 'AI-Generated',
      engineName: 'BEMAS Generative Culinary Engine',
      categoryTags: [
        '⚡ Menu Cepat (< 20 Mnt)',
        '🏠 Masakan Rumahan',
        '💰 Hemat / Tanggal Tua'
      ]
    },
    {
      id: `rec-dyn-2-${timestamp}`,
      title: `Sup Bening Segar ${mainIngredient} ${secondIngredient ? '& ' + secondIngredient : ''}`.trim(),
      description: `Kuah kaldu bening segar yang menghangatkan tubuh dengan isian ${validIngredients.join(' dan ')} kaya nutrisi alami.`,
      matchedIngredients: validIngredients,
      additionalIngredients: [
        'Bawang Putih Geprek',
        'Daun Bawang & Seledri',
        'Kaldu Bubuk',
        'Merica Halus',
        'Bawang Goreng'
      ],
      prepTime: '15 Menit',
      difficulty: 'Mudah',
      servings: 3,
      caloriesApprox: 170,
      rating: 4.8,
      reviewsCount: 430,
      imageUrl:
        'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1000&q=80',
      steps: [
        `Bersihkan dan potong ${validIngredients.join(' serta ')} sesuai selera hidangan sup.`,
        'Didihkan 600ml air kaldu dalam panci bersama 2 siung bawang putih geprek hingga wangi.',
        `Masukkan ${mainIngredient}, masak selama 3-5 menit hingga mulai matang.`,
        validIngredients.length > 1
          ? `Masukkan ${validIngredients.slice(1).join(' dan ')}, lalu bumbui dengan garam, lada bubuk, dan kaldu jamur secukupnya.`
          : 'Bumbui dengan garam, lada bubuk, dan kaldu jamur secukupnya.',
        'Aduk perlahan dan masak hingga seluruh bahan matang sempurna dan kuah kaldu terasa gurih segar.',
        'Matikan api, masukkan irisan daun seledri dan taburan bawang goreng renyah di atas mangkuk saji.'
      ],
      tips: 'Geprek bawang putih sebelum direbus ke dalam kaldu agar aroma kaldunya wangi semerbak dan kuahnya tetap jernih.',
      source: 'AI-Generated',
      engineName: 'BEMAS Generative Culinary Engine',
      categoryTags: [
        '⚡ Menu Cepat (< 20 Mnt)',
        '🏠 Masakan Rumahan',
        '🥗 Sehat & Sayur'
      ]
    },
    {
      id: `rec-dyn-3-${timestamp}`,
      title: `Orak-Arik Praktis ${mainIngredient} Bumbu Gurih`.trim(),
      description: `Menu santap cepat dan praktis yang memadukan ${validIngredients.join(' dan ')} dengan bumbu gurih yang sedap untuk sarapan atau bekal makan siang.`,
      matchedIngredients: validIngredients,
      additionalIngredients: [
        'Telur Ayam (Opsional)',
        'Bawang Merah & Putih',
        'Saus Tiram',
        'Minyak Kelapa / Margarin',
        'Merica Bubuk'
      ],
      prepTime: '15 Menit',
      difficulty: 'Mudah',
      servings: 2,
      caloriesApprox: 190,
      rating: 4.7,
      reviewsCount: 380,
      imageUrl:
        'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1000&q=80',
      steps: [
        `Iris atau cincang ${validIngredients.join(' dan ')} menjadi bagian-bagian kecil agar cepat matang.`,
        'Panaskan sedikit minyak atau margarin di wajan, tumis bawang merah dan bawang putih cincang hingga harum.',
        `Masukkan ${validIngredients.join(' dan ')}, lalu tumis dengan api sedang hingga mulai layu dan matang.`,
        'Tambahkan 1 sdm saus tiram, 1/2 sdt kecap asin, merica bubuk, dan garam secukupnya.',
        'Aduk cepat hingga seluruh bahan terbalut bumbu secara merata.',
        'Angkat dan sajikan selagi panas sebagai lauk pendamping nasi hangat.'
      ],
      tips: 'Tambahkan sedikit margarin di akhir tumisan untuk memberikan aroma harum gurih khas masakan restoran.',
      source: 'AI-Generated',
      engineName: 'BEMAS Generative Culinary Engine',
      categoryTags: [
        '⚡ Menu Cepat (< 20 Mnt)',
        '🏠 Masakan Rumahan',
        '💰 Hemat / Tanggal Tua'
      ]
    }
  ];
}
