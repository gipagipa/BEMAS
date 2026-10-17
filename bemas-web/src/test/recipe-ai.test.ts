import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  addIngredientsToList,
  filterRecipesByCategory,
  generateRecipesWithAI,
  getRecipeCacheKey,
  isValidIngredient,
  sanitizeIngredient,
  CURATED_RECIPES
} from '../services/gemini';
import { storage } from '../services/storage';

describe('SDD & TDD Suite 2: Rekomendasi Resep Berbasis Bahan AI (FR-03 / UC-03)', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  describe('Validasi, Sanitasi, & Deduplikasi Bahan Makanan', () => {
    it('harus memvalidasi bahan makanan yang sah dan menolak input tidak valid/XSS', () => {
      expect(isValidIngredient('Telur Ayam')).toBe(true);
      expect(isValidIngredient('Tahu')).toBe(true);

      // Edge cases: kosong, angka saja, 1 huruf, simbol saja
      expect(isValidIngredient('')).toBe(false);
      expect(isValidIngredient('   ')).toBe(false);
      expect(isValidIngredient('a')).toBe(false);
      expect(isValidIngredient('12345')).toBe(false);
      expect(isValidIngredient('!@#$%')).toBe(false);

      expect(sanitizeIngredient('<img src=x onerror=alert(1)>Bawang Putih')).toBe('Bawang Putih');
    });

    it('harus mendukung penambahan beberapa bahan sekaligus dengan pemisah koma dan menolak duplikat case-insensitive', () => {
      const initial = ['Telur Ayam'];

      // Tambah beberapa bahan dipisahkan koma
      const multi = addIngredientsToList(initial, 'Tahu Putih, Bawang Putih,  Wortel ');
      expect(multi.error).toBeUndefined();
      expect(multi.added).toEqual(['Tahu Putih', 'Bawang Putih', 'Wortel']);
      expect(multi.updated).toHaveLength(4);

      // Coba tambahkan bahan duplikat dengan huruf kecil/besar berbeda
      const dup = addIngredientsToList(multi.updated, 'tahu putih');
      expect(dup.duplicate).toBe(true);
      expect(dup.added).toHaveLength(0);
      expect(dup.error).toBe('Bahan makanan tersebut sudah ada di dalam daftar');
    });

    it('harus mengembalikan pesan error jika input bahan kosong atau hanya berisi angka', () => {
      const emptyRes = addIngredientsToList(['Telur'], '   ');
      expect(emptyRes.error).toBe('Masukkan nama bahan makanan terlebih dahulu');

      const invalidRes = addIngredientsToList(['Telur'], '99999');
      expect(invalidRes.error).toBe('Nama bahan makanan tidak valid (minimal 2 huruf)');
    });
  });

  describe('UC-03 Normal Flow, Exceptional Flows, & Prompt Caching (SDD 3.3.1)', () => {
    it('Exceptional Flow 1a (Input Kosong): harus menolak pencarian resep jika daftar bahan kosong', async () => {
      await expect(generateRecipesWithAI([])).rejects.toThrow(
        'Silakan masukkan minimal satu bahan makanan'
      );

      await expect(generateRecipesWithAI(['   ', '123'])).rejects.toThrow(
        'Silakan masukkan minimal satu bahan makanan'
      );
    });

    it('Normal Flow (Fallback Cerdas): menghasilkan rekomendasi resep terstruktur sesuai bahan dapur', async () => {
      const recipes = await generateRecipesWithAI(['Tahu Putih', 'Telur Ayam', 'Kecap']);

      expect(recipes.length).toBeGreaterThan(0);
      expect(recipes[0].title).toContain('Tumis Tahu Telur');
      expect(recipes[0].steps.length).toBeGreaterThan(0);
      expect(recipes[0].matchedIngredients).toEqual(['Tahu Putih', 'Telur Ayam', 'Kecap']);
    });

    it('Implementation Issue (Caching SDD 3.3.1): menghasilkan kunci cache identik untuk urutan bahan berbeda dan menyimpan hasil ke cache', async () => {
      const key1 = getRecipeCacheKey(['Telur Ayam', 'Tahu Putih', 'Bawang']);
      const key2 = getRecipeCacheKey(['bawang', 'TELUR AYAM', 'tahu putih', 'telur ayam']);
      expect(key1).toBe(key2);

      storage.setGeminiApiKey('AIzaSyDummyKeyForTest');
      const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          candidates: [
            {
              content: {
                parts: [
                  {
                    text: JSON.stringify([
                      {
                        title: 'Nasi Goreng Telur Spesial AI',
                        description: 'Nasi goreng harum buatan AI.',
                        matchedIngredients: ['Telur Ayam', 'Bawang'],
                        additionalIngredients: ['Garam'],
                        prepTime: '10 Menit',
                        difficulty: 'Mudah',
                        servings: 1,
                        steps: ['Panaskan wajan', 'Masak telur dan bumbu']
                      }
                    ])
                  }
                ]
              }
            }
          ]
        })
      } as Response);

      // Panggilan pertama memanggil API Gemini
      const firstCall = await generateRecipesWithAI(['Telur Ayam', 'Bawang']);
      expect(fetchSpy).toHaveBeenCalledTimes(1);
      expect(firstCall[0].title).toBe('Nasi Goreng Telur Spesial AI');
      expect(firstCall[0].source).toBe('AI-Generated');

      // Panggilan kedua dengan urutan/huruf berbeda harus mengambil langsung dari cache tanpa memanggil API lagi
      const secondCall = await generateRecipesWithAI(['bawang', 'TELUR AYAM']);
      expect(fetchSpy).toHaveBeenCalledTimes(1);
      expect(secondCall[0].title).toBe('Nasi Goreng Telur Spesial AI');
    });

    it('Exceptional Flow 3a (Koneksi API Gagal): menangani error API dengan lemparan error pada strictApi atau fallback lokal', async () => {
      storage.setGeminiApiKey('AIzaSyBrokenKey');
      vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('Network timeout'));

      // Mode strictApi melempar pesan sesuai UC-03 Langkah 3a
      await expect(
        generateRecipesWithAI(['Telur Ayam'], { strictApi: true })
      ).rejects.toThrow(
        'Gagal terhubung ke layanan rekomendasi, silakan coba beberapa saat lagi'
      );

      // Mode standar beralih ke fallback AI engine agar pengguna tetap terlayani
      const fallback = await generateRecipesWithAI(['Telur Ayam', 'Wortel']);
      expect(fallback.length).toBeGreaterThan(0);
      expect(fallback[0].source).toBe('AI-Generated');
      expect(fallback[0].engineName).toBe('BEMAS Generative Culinary Engine');
    });

    it('harus meracik resep olahan Tempe secara dinamis saat pengguna memasukkan bahan Tempe', async () => {
      const tempeRecipes = await generateRecipesWithAI(['Tempe']);

      expect(tempeRecipes.length).toBeGreaterThanOrEqual(3);
      expect(tempeRecipes[0].title).toContain('Orek Tempe');
      expect(tempeRecipes[0].steps.some(st => st.toLowerCase().includes('tempe'))).toBe(true);
      expect(tempeRecipes[0].tips?.toLowerCase()).toContain('tempe');
      expect(tempeRecipes[0].source).toBe('AI-Generated');
      expect(tempeRecipes[0].engineName).toBe('BEMAS Generative Culinary Engine');
      expect(tempeRecipes[1].title).toContain('Tempe Mendoan');
      expect(tempeRecipes[2].title).toContain('Sambal Tempe Penyet');
    });

    it('harus menyusun resep dinamis kontekstual untuk kombinasi bahan bebas apa pun (Universal Synthesizer)', async () => {
      const customRecipes = await generateRecipesWithAI(['Kentang', 'Sosis']);

      expect(customRecipes.length).toBeGreaterThanOrEqual(3);
      expect(customRecipes[0].title).toContain('Kentang');
      expect(customRecipes[0].steps.some(st => st.includes('Kentang'))).toBe(true);
      expect(customRecipes[0].source).toBe('AI-Generated');
    });

    it('harus menyaring resep berdasarkan kategori dengan benar', () => {
      const all = filterRecipesByCategory(CURATED_RECIPES, 'Semua Resep');
      expect(all).toHaveLength(CURATED_RECIPES.length);

      const sehat = filterRecipesByCategory(CURATED_RECIPES, '🥗 Sehat & Sayur');
      expect(sehat.length).toBeGreaterThan(0);
      expect(sehat.every(r => r.categoryTags?.includes('🥗 Sehat & Sayur'))).toBe(true);
    });
  });
});
