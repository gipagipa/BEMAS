import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  storage,
  escapeHtml,
  safeSetItem,
  sanitizeText,
  isValidCoordinate,
  calculateDistance,
  STORAGE_KEYS
} from '../services/storage';
import { addIngredientsToList, sanitizeImageUrl } from '../services/gemini';
import { CURATED_RECIPES } from '../services/gemini';
import { INITIAL_PLACES } from '../data/initialPlaces';
import { User } from '../types';

describe('SDD & TDD Suite 6: Extreme Edge Cases & Bug Hunting Hardening', () => {
  const mockUser: User = {
    id: 'usr-extreme-1',
    name: '👨‍🍳 Chef Nusantara',
    email: 'chef@bemas.itk.ac.id',
    role: 'user',
    createdAt: new Date().toISOString()
  };

  beforeEach(() => {
    localStorage.clear();
    storage.setCurrentUser(mockUser);
    vi.restoreAllMocks();
  });

  describe('1. Keamanan XSS, DOM Injection, & Skema URI', () => {
    it('escapeHtml harus menetralkan seluruh karakter berbahaya untuk injeksi Leaflet bindPopup', () => {
      const malicious = '<img src=x onerror="alert(\'pwned\')">&<b class="test">"Halo"</b>';
      const escaped = escapeHtml(malicious);

      expect(escaped).not.toContain('<');
      expect(escaped).not.toContain('>');
      expect(escaped).not.toContain('"');
      expect(escaped).not.toContain("'");
      expect(escaped).toContain('&lt;img');
      expect(escaped).toContain('&amp;');
      expect(escaped).toContain('&quot;');
      expect(escaped).toContain('&#39;');
    });

    it('sanitizeText harus membersihkan nested HTML tags recursively dan skema protokol berbahaya', () => {
      // Nested script tag removal
      const nested = '<<SCRIPT>alert("xss");//<</SCRIPT>Nasi Goreng';
      expect(sanitizeText(nested)).toBe('alert("xss");//Nasi Goreng');

      // javascript: URI scheme
      const uri = 'javascript: alert(1);   Tahu Tempe';
      expect(sanitizeText(uri)).toBe('alert(1); Tahu Tempe');

      // Zero-width space injection
      const zeroWidth = 'Tempe\u200B\uFEFF Goreng';
      expect(sanitizeText(zeroWidth)).toBe('Tempe Goreng');
    });

    it('sanitizeImageUrl harus menolak skema non-http(s) seperti javascript: atau data: URI', () => {
      expect(sanitizeImageUrl('javascript:alert(1)')).toContain('images.unsplash.com');
      expect(sanitizeImageUrl('data:image/svg+xml,<svg onload=alert(1)>')).toContain('images.unsplash.com');
      expect(sanitizeImageUrl('https://res.cloudinary.com/makanan.jpg')).toBe('https://res.cloudinary.com/makanan.jpg');
      expect(sanitizeImageUrl('')).toContain('images.unsplash.com');
    });
  });

  describe('2. Ketahanan terhadap Prototype Pollution & Key Poisoning', () => {
    it('tidak boleh mencemari Object.prototype saat input email berupa __proto__ atau constructor', () => {
      storage.saveLoginAttemptRecord('__proto__', { count: 3, lastAttemptAt: Date.now() });
      storage.saveLoginAttemptRecord('constructor', { count: 2, lastAttemptAt: Date.now() });

      // @ts-expect-error verifying no pollution on prototype
      expect(Object.prototype.count).toBeUndefined();

      const recordProto = storage.getLoginAttemptRecord('__proto__');
      expect(recordProto.count).toBe(0);

      const recordNormal = storage.getLoginAttemptRecord('toString');
      expect(recordNormal.count).toBe(0);
    });
  });

  describe('3. Pemulihan Otomatis Kuota Penuh (QuotaExceededError Recovery)', () => {
    it('safeSetItem harus membersihkan cache resep non-esensial dan berhasil menyimpan jika terjadi QuotaExceededError', () => {
      localStorage.setItem(STORAGE_KEYS.RECIPE_CACHE, JSON.stringify({ huge: 'data'.repeat(1000) }));

      const originalSetItem = localStorage.setItem.bind(localStorage);
      let quotaThrownOnce = false;

      vi.spyOn(Storage.prototype, 'setItem').mockImplementation(function (this: Storage, key: string, value: string) {
        if (!quotaThrownOnce && key === STORAGE_KEYS.USERS) {
          quotaThrownOnce = true;
          const err = new DOMException('QuotaExceededError', 'QuotaExceededError');
          throw err;
        }
        return originalSetItem(key, value);
      });

      const success = safeSetItem(STORAGE_KEYS.USERS, JSON.stringify([{ id: 'test' }]));
      expect(success).toBe(true);
      // Cache resep harus dibersihkan untuk memberi ruang
      expect(localStorage.getItem(STORAGE_KEYS.RECIPE_CACHE)).toBeNull();
      expect(localStorage.getItem(STORAGE_KEYS.USERS)).toContain('test');
    });
  });

  describe('4. Idempotensi Penghapusan Favorit & Kekebalan Double Click', () => {
    it('removeFavoriteRecipe harus bersifat idempotent dan tidak membalikkan status saat dipanggil berulang kali', () => {
      const recipe = CURATED_RECIPES[0];
      storage.toggleFavoriteRecipe(mockUser.id, recipe);
      expect(storage.isRecipeFavorited(mockUser.id, recipe.id)).toBe(true);

      // Panggilan pertama berhasil menghapus
      const firstRemove = storage.removeFavoriteRecipe(mockUser.id, recipe.id);
      expect(firstRemove).toBe(true);
      expect(storage.isRecipeFavorited(mockUser.id, recipe.id)).toBe(false);

      // Panggilan kedua (simulasi double-click cepat) tetap menghasilkan false tanpa menambahkan item kembali
      const secondRemove = storage.removeFavoriteRecipe(mockUser.id, recipe.id);
      expect(secondRemove).toBe(false);
      expect(storage.isRecipeFavorited(mockUser.id, recipe.id)).toBe(false);
      expect(storage.getFavoriteRecipes(mockUser.id)).toHaveLength(0);
    });

    it('removeFavoritePlace harus bersifat idempotent dan aman', () => {
      const place = INITIAL_PLACES[0];
      storage.toggleFavoritePlace(mockUser.id, place);
      expect(storage.isPlaceFavorited(mockUser.id, place.id)).toBe(true);

      expect(storage.removeFavoritePlace(mockUser.id, place.id)).toBe(true);
      expect(storage.removeFavoritePlace(mockUser.id, place.id)).toBe(false);
      expect(storage.getFavoritePlaces(mockUser.id)).toHaveLength(0);
    });
  });

  describe('5. Koordinat Fleksibel & Ketahanan Haversine', () => {
    it('isValidCoordinate & calculateDistance harus menerima koordinat bertipe string angka tanpa crash', () => {
      expect(isValidCoordinate('-1.1520', '116.8635')).toBe(true);
      expect(isValidCoordinate(' -1.2500 ', ' 116.8800 ')).toBe(true);

      const dist = calculateDistance('-1.1519', '116.8617', '-1.1520', '116.8635');
      expect(dist).toBeGreaterThanOrEqual(0.1);
      expect(dist).toBeLessThanOrEqual(0.5);

      // Non-numeric string harus ditolak tanpa NaN
      expect(isValidCoordinate('invalid', '116.8635')).toBe(false);
      expect(calculateDistance('invalid', '116.8635', '-1.1520', '116.8635')).toBe(0);
    });
  });

  describe('6. Batasan Panjang Input (Anti-ReDoS & Layout Protection)', () => {
    it('registerUser harus menolak nama lebih dari 70 karakter dan kata sandi lebih dari 128 karakter', () => {
      const longName = 'A'.repeat(71);
      const resName = storage.registerUser({
        name: longName,
        email: 'longname@example.com',
        password: 'Password123!',
        confirmPassword: 'Password123!',
        agreeTerms: true
      });
      expect(resName.success).toBe(false);
      expect(resName.error).toContain('Nama lengkap terlalu panjang');

      const longPass = 'P'.repeat(129);
      const resPass = storage.registerUser({
        name: 'User Normal',
        email: 'longpass@example.com',
        password: longPass,
        confirmPassword: longPass,
        agreeTerms: true
      });
      expect(resPass.success).toBe(false);
      expect(resPass.error).toContain('Kata sandi terlalu panjang');
    });

    it('addIngredientsToList harus membatasi maksimal 30 bahan makanan', () => {
      const current30 = Array.from({ length: 30 }, (_, i) => `Bahan${i}`);
      const res = addIngredientsToList(current30, 'BahanTambahanBaru');

      expect(res.error).toContain('Batas maksimal 30 bahan makanan telah tercapai');
      expect(res.updated).toHaveLength(30);
    });
  });

  describe('7. Emoji Multi-byte Character Handling', () => {
    it('dapat mengekstrak karakter awal avatar yang diawali emoji tanpa surrogate pair truncation', () => {
      const emojiName = '👨‍🍳 Budi Santoso';
      const initial = Array.from(emojiName)[0];
      // Array.from mengekstrak full unicode character '👨' tanpa merusak surrogate pair (bukan \uD83D)
      expect(initial).toBe('👨');
      expect(emojiName.charAt(0)).not.toBe('👨'); // charAt menghasilkan pecahan surrogate pair
      expect(initial.length).toBe(2); // 2 UTF-16 code units, tetapi 1 full code point
    });
  });
});
