import { describe, it, expect, beforeEach } from 'vitest';
import {
  calculateDistance,
  filterPlaces,
  isValidCoordinate,
  storage
} from '../services/storage';
import { INITIAL_PLACES } from '../data/initialPlaces';

describe('SDD & TDD Suite 3: Pemetaan Lokasi Kuliner GIS (FR-04 / UC-04)', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('Validasi Koordinat & Perhitungan Jarak Spasial Haversine', () => {
    it('harus memvalidasi batas koordinat bumi (-90..90, -180..180)', () => {
      expect(isValidCoordinate(-1.1519, 116.8617)).toBe(true);
      expect(isValidCoordinate(0, 0)).toBe(true);

      // Edge cases koordinat di luar batas atau NaN
      expect(isValidCoordinate(-95, 116.8617)).toBe(false);
      expect(isValidCoordinate(91, 116.8617)).toBe(false);
      expect(isValidCoordinate(-1.1519, 185)).toBe(false);
      expect(isValidCoordinate(NaN, 116.8617)).toBe(false);
      expect(isValidCoordinate(Infinity, 116.8617)).toBe(false);
    });

    it('harus menghitung jarak dengan akurat dan mengembalikan 0 untuk titik identik atau koordinat tidak valid (tanpa NaN)', () => {
      // Titik identik
      expect(calculateDistance(-1.1519, 116.8617, -1.1519, 116.8617)).toBe(0);

      // Jarak ITK Karang Joang ke Ayam Bakar Salwa (~0.2 km)
      const distNear = calculateDistance(-1.1519, 116.8617, -1.1520, 116.8635);
      expect(distNear).toBeGreaterThanOrEqual(0.1);
      expect(distNear).toBeLessThanOrEqual(0.5);

      // Edge case koordinat rusak tidak boleh menghasilkan NaN
      expect(calculateDistance(NaN, 116.8, -1.15, 116.8)).toBe(0);
      expect(calculateDistance(-100, 200, -1.15, 116.8)).toBe(0);
    });
  });

  describe('UC-04 Normal Flow & Alternative Flow 4a: Pencarian Manual & Filter Kategori Kuliner', () => {
    it('harus memuat data kuliner awal Balikpapan dengan lengkap', () => {
      const places = storage.getPlaces();
      expect(places.length).toBe(INITIAL_PLACES.length);
      expect(places[0].name).toBe('Ayam Bakar Salwa');
    });

    it('harus menyaring tempat kuliner berdasarkan kata kunci nama, alamat, atau menu unggulan (case-insensitive)', () => {
      const byMenu = filterPlaces(INITIAL_PLACES, 'kepiting', 'Semua');
      expect(byMenu).toHaveLength(1);
      expect(byMenu[0].name).toContain('Torani');

      const byAddress = filterPlaces(INITIAL_PLACES, '  melawai ', 'Semua');
      expect(byAddress).toHaveLength(1);
      expect(byAddress[0].name).toContain('Pisang Gapit');
    });

    it('harus menyaring tempat kuliner berdasarkan kombinasi kategori dan kata kunci', () => {
      const cafes = filterPlaces(INITIAL_PLACES, '', 'Cafe');
      expect(cafes).toHaveLength(1);
      expect(cafes[0].category).toBe('Cafe');

      const mismatch = filterPlaces(INITIAL_PLACES, 'kepiting', 'Cafe');
      expect(mismatch).toHaveLength(0);
    });

    it('Edge Case: menangani input array kosong atau kata kunci dengan tag HTML dengan aman', () => {
      expect(filterPlaces([], 'ayam', 'Semua')).toEqual([]);
      const sanitizedSearch = filterPlaces(INITIAL_PLACES, '<b>Torani</b>', 'Semua');
      expect(sanitizedSearch).toHaveLength(1);
    });
  });
});
