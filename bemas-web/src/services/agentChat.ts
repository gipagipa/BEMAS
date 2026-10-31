import { ChatMessage } from '../types';
import { storage } from './storage';
import { CURATED_RECIPES } from './gemini';

/**
 * Pertanyaan saran awal untuk mempermudah pengguna berinteraksi dengan agen
 */
export const INITIAL_CHAT_SUGGESTIONS = [
  '💡 Ide resep dari bahan telur & tahu',
  '⚖️ Lebih hemat beli atau masak?',
  '🥗 Berapa estimasi kalori seporsi nasi goreng?',
  '❄️ Tips simpan sayuran agar tetap segar',
  '⏱️ Resep praktis bawah 15 menit'
];

/**
 * Helper untuk format waktu pesan obrolan (HH:mm)
 */
export function formatChatTime(date: Date = new Date()): string {
  return date.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
}

/**
 * Mesin lokal cerdas (Smart Fallback Knowledge Engine)
 * Memastikan agen selalu dapat menjawab pertanyaan kuliner pengguna dengan cepat dan akurat
 * meskipun sedang offline atau belum memiliki Gemini API Key.
 */
export function getLocalAgentResponse(prompt: string): string {
  const cleanPrompt = prompt.toLowerCase().trim();

  // 1. Sapaan & Identitas
  if (
    cleanPrompt.includes('halo') ||
    cleanPrompt.includes('hai') ||
    cleanPrompt.includes('hei') ||
    cleanPrompt.includes('pagi') ||
    cleanPrompt.includes('siang') ||
    cleanPrompt.includes('malam') ||
    cleanPrompt.includes('siapa kamu') ||
    cleanPrompt.includes('bantuan')
  ) {
    return (
      'Halo! Saya **Chef AI BEMAS** 🍳, asisten kuliner pribadi Anda di aplikasi BEMAS (Beli atau Masak).\n\n' +
      'Saya siap membantu Anda dengan:\n' +
      '• 🥘 **Rekomendasi Resep**: Ketik bahan yang ada di kulkas Anda (contoh: *telur, tahu, wortel*).\n' +
      '• ⚖️ **Dilema Masak vs Beli**: Analisis perbandingan biaya dan waktu.\n' +
      '• 🥗 **Informasi Gizi & Kalori**: Estimasi nutrisi hidangan favorit.\n' +
      '• 💡 **Tips Dapur Praktis**: Trik memasak dan cara menyimpan bahan makanan.\n\n' +
      'Apa yang ingin Anda masak atau ketahui hari ini?'
    );
  }

  // 2. Dilema Masak vs Beli (BEMAS Core Concept)
  if (
    cleanPrompt.includes('beli atau masak') ||
    cleanPrompt.includes('masak atau beli') ||
    cleanPrompt.includes('lebih hemat') ||
    cleanPrompt.includes('hemat mana') ||
    cleanPrompt.includes('dilema') ||
    cleanPrompt.includes('murah mana') ||
    cleanPrompt.includes('budget')
  ) {
    return (
      '⚖️ **Analisis Dilema BEMAS: Masak Sendiri vs Beli Jadi**\n\n' +
      'Berikut adalah panduan pertimbangannya:\n\n' +
      '1. **Kapan Lebih Hemat Masak Sendiri?**\n' +
      '   • Saat memasak untuk 2-4 porsi atau untuk stok makan seharian (bisa hemat **40% - 60%**).\n' +
      '   • Memakai bahan dasar fleksibel seperti telur, tahu, tempe, dan sayuran hijau.\n' +
      '   • Higienitas, takaran garam, dan minyak bisa Anda kontrol penuh.\n\n' +
      '2. **Kapan Lebih Bijak Beli di Luar?**\n' +
      '   • Saat porsi makan hanya 1 orang untuk hidangan berbumbu kompleks (misal: Rawon, Rendang, Soto Betawi) di mana membeli bumbu satuan justru lebih mahal.\n' +
      '   • Saat Anda memiliki tenggat waktu padat dan waktu memasak + mencuci alat makan bernilai lebih tinggi dari selisih harga makanan.\n\n' +
      '💡 *Tips BEMAS:* Cek tab **Kuliner** kami untuk menemukan warung makan terdekat yang terjangkau, atau tab **Resep AI** untuk meracik bahan yang sudah ada di rumah!'
    );
  }

  // 3. Kalori & Nutrisi
  if (
    cleanPrompt.includes('kalori') ||
    cleanPrompt.includes('gizi') ||
    cleanPrompt.includes('nutrisi') ||
    cleanPrompt.includes('diet') ||
    cleanPrompt.includes('protein') ||
    cleanPrompt.includes('sehat')
  ) {
    if (cleanPrompt.includes('nasi goreng')) {
      return (
        '🥗 **Estimasi Nilai Gizi: Seporsi Nasi Goreng (±250g)**\n\n' +
        '• **Kalori:** ± 380 - 450 kkal (tergantung pemakaian minyak & topping)\n' +
        '• **Protein:** 12 - 15 g (dengan 1 butir telur & suwiran ayam)\n' +
        '• **Karbohidrat:** 50 - 58 g\n' +
        '• **Lemak:** 14 - 18 g\n\n' +
        '💡 *Tips Lebih Sehat:* Kurangi pemakaian minyak saat menumis bumbu, gunakan wajan anti-lengket, dan tambahkan irisan sawi atau timun/tomat segar untuk meningkatkan asupan serat!'
      );
    }
    return (
      '🥗 **Panduan Ringkas Gizi & Kalori Bahan Populer:**\n\n' +
      '• **Telur Ayam (1 butir):** ± 74 kkal | Protein: 6.3 g | Lemak: 5 g\n' +
      '• **Tahu Putih (100g):** ± 78 kkal | Protein: 8 g | Karbohidrat: 2 g\n' +
      '• **Tempe Kedelai (100g):** ± 192 kkal | Protein: 19 g | Serat: 1.4 g\n' +
      '• **Dada Ayam Fillet (100g):** ± 165 kkal | Protein: 31 g | Lemak: 3.6 g\n' +
      '• **Nasi Putih (1 centong / 100g):** ± 130 kkal | Karbohidrat: 28 g\n\n' +
      '💡 Ingin resep seimbang dengan takaran gizi terukur? Coba menu cepat kami seperti *Tumis Tahu Telur* atau *Sup Ayam Bening*!'
    );
  }

  // 4. Tips Dapur & Penyimpanan
  if (
    cleanPrompt.includes('simpan') ||
    cleanPrompt.includes('awet') ||
    cleanPrompt.includes('tahan lama') ||
    cleanPrompt.includes('meletup') ||
    cleanPrompt.includes('tips') ||
    cleanPrompt.includes('trik')
  ) {
    return (
      '💡 **Tips Dapur Praktis dari Chef AI:**\n\n' +
      '1. **Menyimpan Tahu:** Rendam tahu dalam wadah berisi air matang bersih yang menutupi seluruh permukaan tahu. Simpan di kulkas dan ganti airnya tiap 1-2 hari agar tidak asam.\n' +
      '2. **Sayuran Hijau Awet:** Jangan dicuci sebelum masuk kulkas. Bungkus sayuran dengan kertas atau tisu dapur lalu simpan di kantong berlubang di laci kulkas bawah.\n' +
      '3. **Menggoreng Ikan/Ayam Tanpa Meletup:** Taburkan 1/2 sendok teh tepung terigu ke dalam minyak panas sebelum memasukkan ikan, atau pastikan permukaan bahan kering dari sisa air cuci.\n' +
      '4. **Mengupas Bawang Lebih Cepat:** Rendam bawang merah dalam air hangat selama 5-10 menit sebelum dikupas, kulit ari akan lepas dengan sangat mudah.'
    );
  }

  // 5. Pencocokan Resep berdasarkan kata kunci bahan
  const matchedRecipes = CURATED_RECIPES.filter(recipe => {
    const combined = `${recipe.title} ${recipe.matchedIngredients.join(' ')} ${recipe.description}`.toLowerCase();
    const words = cleanPrompt.split(/\s+/);
    return words.some(w => w.length > 2 && combined.includes(w));
  });

  if (matchedRecipes.length > 0) {
    const topRecipe = matchedRecipes[0];
    const ingrList = topRecipe.detailedIngredients
      ? topRecipe.detailedIngredients.map(i => `  • ${i.name} (${i.amount})`).join('\n')
      : topRecipe.matchedIngredients.map(i => `  • ${i}`).join('\n');

    return (
      `🍳 **Rekomendasi Resep Spesial: ${topRecipe.title}**\n\n` +
      `${topRecipe.description}\n\n` +
      `⏱️ **Waktu Persiapan:** ${topRecipe.prepTime} | 📊 **Kesulitan:** ${topRecipe.difficulty}\n\n` +
      `📋 **Bahan Utama & Takaran:**\n${ingrList}\n\n` +
      `🔥 **Langkah Singkat:**\n` +
      topRecipe.steps.slice(0, 3).map((s, idx) => `  ${idx + 1}. ${s}`).join('\n') +
      `\n\n💡 *Tips Koki:* ${topRecipe.tips || 'Masak dengan api sedang agar matang merata.'}\n\n` +
      (topRecipe.nutritionFacts
        ? `🥗 *Nilai Gizi:* ${topRecipe.nutritionFacts.calories} kkal | Protein ${topRecipe.nutritionFacts.protein} | Karbohidrat ${topRecipe.nutritionFacts.carbs}`
        : '')
    );
  }

  // 6. Tanggapan Umum Relevan
  return (
    `Terima kasih atas pertanyaannya! 👩‍🍳\n\n` +
    `Untuk pertanyaan mengenai: *"${prompt}"*,\n` +
    `Saya dapat membantu merekomendasikan variasi menu, langkah memasak, atau perbandingan budget belanja bahan vs membeli di warung/restoran.\n\n` +
    `Coba sebutkan bahan masakan yang sedang Anda miliki di rumah (misal: *telur, bawang putih, kecap, cabai*), dan saya akan siapkan resep terbaik untuk Anda!`
  );
}

/**
 * Mengirim pesan ke Chef AI (dengan integrasi Gemini API jika API key tersedia,
 * atau Smart Fallback jika offline/kunci belum diset).
 */
export async function sendAgentMessage(
  userPrompt: string,
  _history: ChatMessage[] = []
): Promise<string> {
  const trimmed = userPrompt.trim();
  if (!trimmed) {
    return 'Silakan ketik pertanyaan atau bahan makanan yang ingin Anda tanyakan.';
  }

  const apiKey = storage.getGeminiApiKey();

  // Jika ada Gemini API Key, gunakan model Gemini Flash untuk respon interaktif dinamis
  if (apiKey) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
      const payload = {
        contents: [
          {
            role: 'user',
            parts: [
              {
                text:
                  `Anda adalah "Chef AI BEMAS", asisten kuliner pribadi cerdas dan ramah dalam aplikasi BEMAS (Beli atau Masak).\n` +
                  `Jawablah dengan gaya bahasa Indonesia yang ramah, santun, jelas, dan berorientasi pada kemudahan memasak di rumah, pemilihan kuliner lokal, perbandingan belanja vs masak (dilema BEMAS), serta kesehatan/nilai gizi.\n\n` +
                  `Pertanyaan Pengguna: "${trimmed}"`
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 600
        }
      };

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const data = await response.json();
        const candidateText =
          data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (candidateText && typeof candidateText === 'string') {
          return candidateText.trim();
        }
      }
    } catch {
      // Jika terjadi error jaringan / API rate limit, alihkan mulus ke local knowledge engine
    }
  }

  // Gunakan Smart Knowledge Engine lokal yang handal
  return getLocalAgentResponse(trimmed);
}
