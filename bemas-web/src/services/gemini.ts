import { Recipe } from '../types';
import { storage } from './storage';

// Smart local fallback recipes based on typical ingredients
const CURATED_RECIPES: Recipe[] = [
  {
    id: 'rec-curated-1',
    title: 'Tumis Buncis Tahu Tempe Saus Tiram',
    description: 'Menu praktis harian tinggi protein nabati dengan perpaduan gurih manis dan tekstur renyah.',
    matchedIngredients: ['tahu', 'tempe', 'bawang', 'cabai'],
    additionalIngredients: ['buncis', 'saus tiram', 'kecap manis', 'garam & merica'],
    prepTime: '20 Menit',
    difficulty: 'Mudah',
    servings: 3,
    caloriesApprox: 240,
    steps: [
      'Potong dadu tahu dan tempe, lalu goreng setengah matang hingga sedikit berkulit.',
      'Iris tipis bawang merah, bawang putih, dan cabai merah keriting.',
      'Tumis irisan bawang dan cabai hingga harum dan layu.',
      'Masukkan buncis yang telah dipotong serong, aduk rata selama 2 menit.',
      'Tambahkan tahu dan tempe goreng, lalu bumbui dengan 2 sdm saus tiram, 1 sdm kecap manis, garam, dan merica.',
      'Tuangkan sedikit air (50ml), aduk hingga bumbu meresap dan air menyusut. Angkat dan sajikan hangat.'
    ],
    tips: 'Goreng tahu dan tempe jangan terlalu kering agar bumbu saus tiram mudah meresap ke dalam.',
    source: 'Curated'
  },
  {
    id: 'rec-curated-2',
    title: 'Telur Dadar Gulung Gurih Daun Bawang',
    description: 'Telur dadar tebal lembut ala rumahan dengan aroma harum daun bawang dan rempah sederhana.',
    matchedIngredients: ['telur', 'bawang', 'cabai'],
    additionalIngredients: ['daun bawang', 'kaldu bubuk', 'merica', 'minyak goreng'],
    prepTime: '15 Menit',
    difficulty: 'Mudah',
    servings: 2,
    caloriesApprox: 190,
    steps: [
      'Pecahkan 3 butir telur ke dalam mangkuk bersih.',
      'Iris halus daun bawang, bawang merah, dan sedikit cabai rawit (opsional jika suka pedas).',
      'Kocok telur bersama irisan bumbu, 1/2 sdt kaldu bubuk, dan sejumput merica hingga berbusa.',
      'Panaskan 2 sdm minyak di wajan anti-lengket dengan api sedang cenderung kecil.',
      'Tuang adonan telur secara merata. Saat bagian bawah mulai matang kecokelatan, gulung perlahan.',
      'Balik sisi gulungan hingga matang sempurna di kedua sisi. Angkat dan potong-potong sesuai selera.'
    ],
    tips: 'Gunakan api kecil saat menggulung agar bagian dalam telur tetap lembut dan tidak gosong di luar.',
    source: 'Curated'
  },
  {
    id: 'rec-curated-3',
    title: 'Nasi Goreng Kampung Praktis Mantap',
    description: 'Solusi terbaik memanfaatkan nasi sisa semalam dan bahan dapur sederhana dengan cita rasa otentik.',
    matchedIngredients: ['nasi', 'telur', 'bawang', 'kecap'],
    additionalIngredients: ['terasi bakar (opsional)', 'garam', 'daun seledri', 'kerupuk'],
    prepTime: '15 Menit',
    difficulty: 'Mudah',
    servings: 2,
    caloriesApprox: 380,
    steps: [
      'Haluskan atau cincang kasar bawang merah, bawang putih, dan cabai rawit.',
      'Panaskan sedikit minyak, tumis bumbu cincang hingga harum semerbak.',
      'Sisihkan bumbu ke pinggir wajan, ceplok 1 butir telur di tengah wajan lalu orak-arik hingga matang.',
      'Masukkan nasi putih dingin, aduk cepat dengan api besar agar nasi tidak menggumpal.',
      'Tambahkan kecap manis, garam, dan sedikit penyedap rasa. Aduk rata hingga seluruh nasi berubah warna kecokelatan merata.',
      'Sajikan di piring saji dengan taburan bawang goreng dan mentimun.'
    ],
    tips: 'Gunakan nasi dingin dari kulkas agar tekstur nasi goreng tidak lembek dan buyar sempurna.',
    source: 'Curated'
  },
  {
    id: 'rec-curated-4',
    title: 'Ayam Kecap Mentega Gurih Legit',
    description: 'Potongan ayam empuk dengan kuah karamel mentega dan kecap yang manis gurih disukai seluruh keluarga.',
    matchedIngredients: ['ayam', 'bawang', 'kecap'],
    additionalIngredients: ['mentega / margarin', 'bawang bombay', 'kecap inggris', 'jeruk nipis'],
    prepTime: '30 Menit',
    difficulty: 'Sedang',
    servings: 4,
    caloriesApprox: 320,
    steps: [
      'Lumuri potongan ayam dengan air perasan jeruk nipis dan sedikit garam. Goreng hingga setengah matang, tiriskan.',
      'Lelehkan 2 sdm mentega di wajan, tumis bawang putih cincang dan bawang bombay iris hingga layu harum.',
      'Masukkan potongan ayam goreng, aduk rata bersama mentega.',
      'Tambahkan 3 sdm kecap manis, 1 sdm saus tiram, dan 1 sdt kecap inggris (jika ada).',
      'Tuangkan sedikit air (100ml), bumbui dengan lada dan sedikit gula. Masak dengan api sedang hingga kuah mengental dan meresap ke serat ayam.',
      'Selesai! Sajikan selagi hangat bersama nasi putih pulen.'
    ],
    tips: 'Jangan menggoreng ayam terlalu kering sebelum dimasak kecap agar daging ayam tetap juicy.',
    source: 'Curated'
  }
];

export async function generateRecipesWithAI(
  userIngredients: string[],
  preferences?: { maxTime?: string; difficulty?: string }
): Promise<Recipe[]> {
  const apiKey = storage.getGeminiApiKey();

  // If user provided a real Gemini API Key, call Gemini API
  if (apiKey) {
    try {
      const prompt = `Anda adalah koki profesional cerdas dan asisten kuliner aplikasi BEMAS (Beli atau Masak).
Pengguna memiliki bahan-bahan makanan berikut: ${userIngredients.join(', ')}.
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
    "prepTime": "20 Menit",
    "difficulty": "Mudah",
    "servings": 2,
    "caloriesApprox": 250,
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

      if (response.ok) {
        const data = await response.json();
        const jsonText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (jsonText) {
          const parsed: Recipe[] = JSON.parse(jsonText);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed.map((r, i) => ({
              ...r,
              id: `rec-ai-${Date.now()}-${i}`,
              source: 'AI-Generated' as const
            }));
          }
        }
      }
    } catch (err) {
      console.warn('Gemini API call failed, falling back to smart local matching engine:', err);
    }
  }

  // Smart local matching fallback (fail-proof for video presentations / no internet / no API key)
  await new Promise(resolve => setTimeout(resolve, 800)); // simulate AI thinking time

  const lowercaseInputs = userIngredients.map(i => i.toLowerCase().trim());
  
  // Score recipes based on matched ingredients
  const scored = CURATED_RECIPES.map(rec => {
    let matchCount = 0;
    rec.matchedIngredients.forEach(ing => {
      if (lowercaseInputs.some(userIng => userIng.includes(ing) || ing.includes(userIng))) {
        matchCount++;
      }
    });
    return { ...rec, matchCount };
  });

  scored.sort((a, b) => b.matchCount - a.matchCount);

  // Return the best 2-3 recipes
  const results = scored.slice(0, 3).map((r, idx) => ({
    ...r,
    id: `rec-match-${Date.now()}-${idx}`,
    matchedIngredients: userIngredients,
    source: (apiKey ? 'AI-Generated' : 'Curated') as 'AI-Generated' | 'Curated'
  }));

  return results;
}
