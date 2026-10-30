import { describe, it, expect, beforeEach } from 'vitest';
import { storage, STORAGE_KEYS } from '../services/storage';
import { Recipe, CulinaryPlace } from '../types';
import { INITIAL_PLACES } from '../data/initialPlaces';
import { CURATED_RECIPES } from '../services/gemini';

describe('SDD & TDD Suite 5: Manajemen Favorit (FR-05 / UC-05 & FR-06 / UC-06)', () => {
  const userA = { id: 'usr-test-a', name: 'User A', email: 'usera@example.com', role: 'user' as const, createdAt: new Date().toISOString() };
  const userB = { id: 'usr-test-b', name: 'User B', email: 'userb@example.com', role: 'user' as const, createdAt: new Date().toISOString() };

  beforeEach(() => {
    localStorage.clear();
    storage.setCurrentUser(userA);
  });

  describe('FR-05 / UC-05: Menyimpan Resep Favorit', () => {
    const sampleRecipe: Recipe = CURATED_RECIPES[0];

    it('Normal Flow: pengguna terdaftar berhasil menyimpan resep ke daftar favorit', () => {
      expect(storage.isRecipeFavorited(userA.id, sampleRecipe.id)).toBe(false);

      const result = storage.toggleFavoriteRecipe(userA.id, sampleRecipe);
      expect(result.favorited).toBe(true);
      expect(result.recipe.id).toBe(sampleRecipe.id);

      expect(storage.isRecipeFavorited(userA.id, sampleRecipe.id)).toBe(true);

      const favorites = storage.getFavoriteRecipes(userA.id);
      expect(favorites).toHaveLength(1);
      expect(favorites[0].id).toBe(sampleRecipe.id);
      expect(favorites[0].title).toBe(sampleRecipe.title);
    });

    it('Alternative Flow 1a: membatalkan simpan resep favorit saat ditekan kembali', () => {
      // Simpan pertama kali
      storage.toggleFavoriteRecipe(userA.id, sampleRecipe);
      expect(storage.isRecipeFavorited(userA.id, sampleRecipe.id)).toBe(true);

      // Tekan kedua kali (unfavorite)
      const unFavResult = storage.toggleFavoriteRecipe(userA.id, sampleRecipe);
      expect(unFavResult.favorited).toBe(false);
      expect(storage.isRecipeFavorited(userA.id, sampleRecipe.id)).toBe(false);

      const favorites = storage.getFavoriteRecipes(userA.id);
      expect(favorites).toHaveLength(0);
    });

    it('Exceptional Flow 2a: menolak penyimpanan jika pengguna belum login', () => {
      expect(() => {
        storage.toggleFavoriteRecipe('', sampleRecipe);
      }).toThrow('Silakan login terlebih dahulu untuk menyimpan resep favorit');

      expect(() => {
        // @ts-expect-error testing invalid type
        storage.toggleFavoriteRecipe(null, sampleRecipe);
      }).toThrow('Silakan login terlebih dahulu untuk menyimpan resep favorit');
    });

    it('harus mampu menyimpan resep dinamis hasil AI beserta seluruh langkah & bahannya secara utuh', () => {
      const dynamicRecipe: Recipe = {
        id: 'rec-ai-dynamic-999',
        title: 'Orek Tempe Kemangi Spesial AI',
        description: 'Resep kreasi cerdas AI BEMAS.',
        matchedIngredients: ['Tempe', 'Kemangi'],
        additionalIngredients: ['Kecap Manis', 'Bawang'],
        prepTime: '15 Menit',
        difficulty: 'Mudah',
        servings: 2,
        steps: ['Potong tempe', 'Goreng setengah matang', 'Tumis bumbu dan kemangi'],
        tips: 'Goreng tempe sebentar saja',
        source: 'AI-Generated',
        engineName: 'BEMAS Generative Culinary Engine',
        categoryTags: ['⚡ Menu Cepat (< 20 Mnt)', '🏠 Masakan Rumahan']
      };

      const res = storage.toggleFavoriteRecipe(userA.id, dynamicRecipe);
      expect(res.favorited).toBe(true);

      const savedList = storage.getFavoriteRecipes(userA.id);
      expect(savedList).toHaveLength(1);
      expect(savedList[0].id).toBe('rec-ai-dynamic-999');
      expect(savedList[0].steps).toEqual(dynamicRecipe.steps);
      expect(savedList[0].engineName).toBe('BEMAS Generative Culinary Engine');
    });
  });

  describe('FR-06 / UC-06: Menyimpan Tempat Kuliner Favorit', () => {
    const samplePlace: CulinaryPlace = INITIAL_PLACES[0];

    it('Normal Flow: pengguna terdaftar berhasil menyimpan tempat kuliner ke daftar favorit', () => {
      expect(storage.isPlaceFavorited(userA.id, samplePlace.id)).toBe(false);

      const result = storage.toggleFavoritePlace(userA.id, samplePlace);
      expect(result.favorited).toBe(true);
      expect(result.place.id).toBe(samplePlace.id);

      expect(storage.isPlaceFavorited(userA.id, samplePlace.id)).toBe(true);

      const places = storage.getFavoritePlaces(userA.id);
      expect(places).toHaveLength(1);
      expect(places[0].id).toBe(samplePlace.id);
      expect(places[0].name).toBe(samplePlace.name);
    });

    it('Alternative Flow 2a: membatalkan simpan tempat favorit saat ditekan kembali', () => {
      storage.toggleFavoritePlace(userA.id, samplePlace);
      expect(storage.isPlaceFavorited(userA.id, samplePlace.id)).toBe(true);

      const unFavResult = storage.toggleFavoritePlace(userA.id, samplePlace);
      expect(unFavResult.favorited).toBe(false);
      expect(storage.isPlaceFavorited(userA.id, samplePlace.id)).toBe(false);

      const places = storage.getFavoritePlaces(userA.id);
      expect(places).toHaveLength(0);
    });

    it('Exceptional Flow 3a: menolak penyimpanan tempat jika pengguna belum login', () => {
      expect(() => {
        storage.toggleFavoritePlace('', samplePlace);
      }).toThrow('Silakan login terlebih dahulu untuk menyimpan lokasi favorit');

      expect(() => {
        // @ts-expect-error testing invalid type
        storage.toggleFavoritePlace(null, samplePlace);
      }).toThrow('Silakan login terlebih dahulu untuk menyimpan lokasi favorit');
    });
  });

  describe('Isolasi Data Antar Pengguna & Edge Cases Ketahanan Data', () => {
    it('memastikan daftar favorit Pengguna A dan Pengguna B terisolasi penuh', () => {
      // User A menyimpan resep 1 & tempat 1
      storage.toggleFavoriteRecipe(userA.id, CURATED_RECIPES[0]);
      storage.toggleFavoritePlace(userA.id, INITIAL_PLACES[0]);

      // User B menyimpan resep 2 & tempat 2
      storage.setCurrentUser(userB);
      storage.toggleFavoriteRecipe(userB.id, CURATED_RECIPES[1]);
      storage.toggleFavoritePlace(userB.id, INITIAL_PLACES[1]);

      const favRecipesA = storage.getFavoriteRecipes(userA.id);
      const favRecipesB = storage.getFavoriteRecipes(userB.id);

      expect(favRecipesA).toHaveLength(1);
      expect(favRecipesA[0].id).toBe(CURATED_RECIPES[0].id);

      expect(favRecipesB).toHaveLength(1);
      expect(favRecipesB[0].id).toBe(CURATED_RECIPES[1].id);

      const favPlacesA = storage.getFavoritePlaces(userA.id);
      const favPlacesB = storage.getFavoritePlaces(userB.id);

      expect(favPlacesA).toHaveLength(1);
      expect(favPlacesA[0].id).toBe(INITIAL_PLACES[0].id);

      expect(favPlacesB).toHaveLength(1);
      expect(favPlacesB[0].id).toBe(INITIAL_PLACES[1].id);
    });

    it('kebal terhadap kerusakan data JSON di localStorage (graceful fallback tanpa crash)', () => {
      localStorage.setItem(STORAGE_KEYS.FAVORITE_RECIPES, '{ bukan json valid -- crash test }');
      localStorage.setItem(STORAGE_KEYS.FAVORITE_PLACES, 'null');

      expect(storage.getFavoriteRecipes(userA.id)).toEqual([]);
      expect(storage.getFavoritePlaces(userA.id)).toEqual([]);
      expect(storage.isRecipeFavorited(userA.id, 'any-id')).toBe(false);
      expect(storage.isPlaceFavorited(userA.id, 'any-id')).toBe(false);
    });

    it('menolak payload resep atau tempat kuliner yang tidak memiliki ID valid', () => {
      // @ts-expect-error testing invalid recipe
      expect(() => storage.toggleFavoriteRecipe(userA.id, { title: 'Tanpa ID' })).toThrow('Data resep tidak valid');
      // @ts-expect-error testing invalid place
      expect(() => storage.toggleFavoritePlace(userA.id, { name: 'Tanpa ID' })).toThrow('Data tempat kuliner tidak valid');
    });
  });
});
