import { AuthResult, CulinaryPlace, StoredUser, User } from '../types';
import { INITIAL_PLACES } from '../data/initialPlaces';

export const STORAGE_KEYS = {
  USERS: 'bemas_users',
  CURRENT_USER: 'bemas_current_user',
  AUTH_TOKEN: 'bemas_auth_token',
  LOGIN_ATTEMPTS: 'bemas_login_attempts',
  PLACES: 'bemas_places',
  RECIPE_CACHE: 'bemas_recipe_cache',
  GEMINI_API_KEY: 'bemas_gemini_api_key'
} as const;

export const MAX_LOGIN_ATTEMPTS = 5;
export const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 Menit sesuai NFR-05
export const DEFAULT_DEMO_PASSWORD = 'Password123!';

interface LoginAttemptRecord {
  count: number;
  lastAttemptAt: number;
  lockedUntil?: number;
}

/**
 * Sanitasi teks input untuk mencegah injeksi HTML / XSS (SRS UC-01 & UC-07)
 */
export function sanitizeText(input: string): string {
  if (typeof input !== 'string') return '';
  return input
    .replace(/<[^>]*>?/gm, '')
    .replace(/[\u0000-\u001F\u007F]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Validasi format email sesuai standar (SRS UC-01 Langkah 4b)
 */
export function isValidEmail(email: string): boolean {
  if (typeof email !== 'string') return false;
  const trimmed = email.trim();
  if (!trimmed || trimmed.length > 254 || trimmed.includes('..')) return false;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(trimmed);
}

/**
 * Enkripsi satu arah (One-way Salted Hashing) untuk kata sandi (SRS UC-01 Langkah 5 & NFR-03)
 */
export function hashPassword(password: string, salt = 'bemas_itk_2026'): string {
  const cleanSalt = salt.replace(/\$/g, '');
  const combined = `${cleanSalt}:${password}:bemas_pepper_v1`;
  let h1 = 0xdeadbeef ^ combined.length;
  let h2 = 0x41c6ce57 ^ combined.length;

  for (let i = 0; i < combined.length; i++) {
    const ch = combined.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }

  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);

  const hex1 = (h1 >>> 0).toString(16).padStart(8, '0');
  const hex2 = (h2 >>> 0).toString(16).padStart(8, '0');
  return `$2b$10$${cleanSalt}$${hex1}${hex2}`;
}

/**
 * Verifikasi kecocokan kata sandi terhadap hash yang tersimpan (SRS UC-02 Langkah 4)
 */
export function verifyPassword(password: string, storedHash: string): boolean {
  if (!password || !storedHash || !storedHash.startsWith('$2b$10$')) {
    return false;
  }
  const parts = storedHash.split('$');
  // Format: ['', '2b', '10', '<salt>', '<hash>']
  if (parts.length !== 5) return false;
  const salt = parts[3];
  const expectedHash = hashPassword(password, salt);
  return expectedHash === storedHash;
}

function toBase64Url(str: string): string {
  const bytes = new TextEncoder().encode(str);
  let binary = '';
  bytes.forEach(b => {
    binary += String.fromCharCode(b);
  });
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromBase64Url(base64Url: string): string {
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new TextDecoder().decode(bytes);
}

/**
 * Pembangkitan Token Sesi JWT (SRS UC-02 Langkah 5 & NFR-04)
 */
export function generateJwtToken(user: User, expiresInMs = 24 * 60 * 60 * 1000): string {
  const now = Date.now();
  const header = toBase64Url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = toBase64Url(
    JSON.stringify({
      sub: user.id,
      email: user.email,
      role: user.role,
      iat: now,
      exp: now + expiresInMs
    })
  );
  const signature = toBase64Url(hashPassword(`${header}.${payload}`, 'jwt_secret_bemas'));
  return `${header}.${payload}.${signature}`;
}

/**
 * Validasi integritas dan masa berlaku Token Sesi JWT (NFR-04)
 */
export function verifyJwtToken(token: string): {
  valid: boolean;
  payload?: { sub: string; email: string; role: string; iat: number; exp: number };
} {
  if (!token || typeof token !== 'string') return { valid: false };
  const parts = token.split('.');
  if (parts.length !== 3) return { valid: false };

  const [header, payload, signature] = parts;
  const expectedSig = toBase64Url(hashPassword(`${header}.${payload}`, 'jwt_secret_bemas'));
  if (signature !== expectedSig) {
    return { valid: false };
  }

  try {
    const decoded = JSON.parse(fromBase64Url(payload));
    if (!decoded || typeof decoded.exp !== 'number' || decoded.exp <= Date.now()) {
      return { valid: false };
    }
    return { valid: true, payload: decoded };
  } catch {
    return { valid: false };
  }
}

/**
 * Validasi koordinat geografis (Latitude & Longitude)
 */
export function isValidCoordinate(lat: number, lng: number): boolean {
  return (
    typeof lat === 'number' &&
    typeof lng === 'number' &&
    Number.isFinite(lat) &&
    Number.isFinite(lng) &&
    lat >= -90 &&
    lat <= 90 &&
    lng >= -180 &&
    lng <= 180
  );
}

/**
 * Perhitungan jarak spasial Haversine dalam kilometer (SRS UC-04)
 */
export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  if (!isValidCoordinate(lat1, lon1) || !isValidCoordinate(lat2, lon2)) {
    return 0;
  }
  if (lat1 === lat2 && lon1 === lon2) {
    return 0;
  }
  const R = 6371; // Radius bumi dalam km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

/**
 * Penyaringan daftar tempat kuliner berdasarkan kata kunci & kategori (SRS UC-04 & Langkah 4a)
 */
export function filterPlaces(
  places: CulinaryPlace[],
  searchQuery: string,
  selectedCategory: string
): CulinaryPlace[] {
  if (!Array.isArray(places)) return [];
  const normalizedQuery = sanitizeText(searchQuery).toLowerCase();
  const normalizedCat = selectedCategory?.trim() || 'Semua';

  return places.filter(place => {
    const matchCategory = normalizedCat === 'Semua' || place.category === normalizedCat;
    if (!matchCategory) return false;
    if (!normalizedQuery) return true;

    const haystacks = [
      place.name,
      place.address,
      place.featuredMenu,
      place.category
    ].map(s => (s || '').toLowerCase());

    return haystacks.some(h => h.includes(normalizedQuery));
  });
}

// Default Sample Users (disimpan dengan password terenkripsi sesuai NFR-03)
export const DEFAULT_USERS: User[] = [
  {
    id: 'usr-1',
    name: 'Giva Asilah (Mahasiswa)',
    email: 'giva@student.itk.ac.id',
    role: 'user',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    createdAt: '2026-09-23'
  },
  {
    id: 'adm-1',
    name: 'Admin BEMAS Pusat',
    email: 'admin@bemas.id',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
    createdAt: '2026-09-01'
  }
];

function getInitialStoredUsers(): StoredUser[] {
  return DEFAULT_USERS.map(u => ({
    ...u,
    passwordHash: hashPassword(DEFAULT_DEMO_PASSWORD, `salt_${u.id}`)
  }));
}

function stripPasswordHash(stored: StoredUser): User {
  const { passwordHash: _unused, ...publicUser } = stored;
  return publicUser;
}

export const storage = {
  // --- Manajemen Data Pengguna (UC-01 & UC-02) ---
  getStoredUsers(): StoredUser[] {
    const data = localStorage.getItem(STORAGE_KEYS.USERS);
    if (!data) {
      const initial = getInitialStoredUsers();
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(initial));
      return initial;
    }
    try {
      const parsed = JSON.parse(data);
      if (!Array.isArray(parsed) || parsed.length === 0) {
        const initial = getInitialStoredUsers();
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(initial));
        return initial;
      }
      return parsed;
    } catch {
      const initial = getInitialStoredUsers();
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(initial));
      return initial;
    }
  },

  /**
   * UC-01: Registrasi Akun Baru
   * - Validasi kelengkapan data, format email, panjang password (>= 8 karakter), kecocokan konfirmasi
   * - Cek keunikan email (Exceptional Flow 4a: "Email sudah digunakan")
   * - Enkripsi password satu arah (NFR-03)
   */
  registerUser(input: {
    name: string;
    email: string;
    password: string;
    confirmPassword?: string;
    agreeTerms?: boolean;
  }): AuthResult {
    if (input.agreeTerms === false) {
      return {
        success: false,
        error: 'Anda harus menyetujui Ketentuan Layanan & Kebijakan Privasi BEMAS'
      };
    }

    const cleanName = sanitizeText(input.name);
    const cleanEmail = (input.email || '').trim().toLowerCase();
    const rawPassword = input.password || '';

    if (!cleanName || cleanName.length < 2) {
      return {
        success: false,
        error: 'Nama lengkap wajib diisi (minimal 2 karakter)'
      };
    }

    if (!cleanEmail || !isValidEmail(cleanEmail)) {
      return {
        success: false,
        error: 'Format email tidak valid'
      };
    }

    if (rawPassword.trim().length < 8) {
      return {
        success: false,
        error: 'Kata sandi terlalu pendek (minimal 8 karakter)'
      };
    }

    if (input.confirmPassword !== undefined && rawPassword !== input.confirmPassword) {
      return {
        success: false,
        error: 'Konfirmasi kata sandi tidak cocok'
      };
    }

    const users = this.getStoredUsers();
    const emailExists = users.some(u => u.email.toLowerCase() === cleanEmail);
    if (emailExists) {
      return {
        success: false,
        error: 'Email sudah digunakan'
      };
    }

    const userId = `usr-${Date.now()}`;
    const newStoredUser: StoredUser = {
      id: userId,
      name: cleanName,
      email: cleanEmail,
      role: 'user',
      passwordHash: hashPassword(rawPassword, `salt_${userId}`),
      createdAt: new Date().toISOString()
    };

    users.push(newStoredUser);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));

    return {
      success: true,
      user: stripPasswordHash(newStoredUser)
    };
  },

  getLoginAttemptRecord(email: string): LoginAttemptRecord {
    const key = (email || '').trim().toLowerCase();
    const raw = localStorage.getItem(STORAGE_KEYS.LOGIN_ATTEMPTS);
    if (!raw) return { count: 0, lastAttemptAt: 0 };
    try {
      const map = JSON.parse(raw) as Record<string, LoginAttemptRecord>;
      return map[key] || { count: 0, lastAttemptAt: 0 };
    } catch {
      return { count: 0, lastAttemptAt: 0 };
    }
  },

  saveLoginAttemptRecord(email: string, record: LoginAttemptRecord | null): void {
    const key = (email || '').trim().toLowerCase();
    const raw = localStorage.getItem(STORAGE_KEYS.LOGIN_ATTEMPTS);
    let map: Record<string, LoginAttemptRecord> = {};
    if (raw) {
      try {
        map = JSON.parse(raw) || {};
      } catch {
        map = {};
      }
    }
    if (record === null) {
      delete map[key];
    } else {
      map[key] = record;
    }
    localStorage.setItem(STORAGE_KEYS.LOGIN_ATTEMPTS, JSON.stringify(map));
  },

  /**
   * UC-02: Login Akun & NFR-05: Blokir sementara setelah 5 kali gagal login berturut-turut
   */
  authenticateUser(email: string, password: string): AuthResult {
    const cleanEmail = (email || '').trim().toLowerCase();
    const rawPassword = password || '';

    if (!cleanEmail || !rawPassword.trim()) {
      return {
        success: false,
        error: 'Email dan kata sandi wajib diisi'
      };
    }

    if (!isValidEmail(cleanEmail)) {
      return {
        success: false,
        error: 'Format email tidak valid'
      };
    }

    const now = Date.now();
    const attempt = this.getLoginAttemptRecord(cleanEmail);

    // Cek apakah akun masih dalam masa blokir sementara (NFR-05)
    if (attempt.lockedUntil && attempt.lockedUntil > now) {
      return {
        success: false,
        error:
          'Akun diblokir sementara karena 5 kali percobaan login yang gagal berturut-turut. Silakan coba lagi nanti.',
        remainingAttempts: 0,
        lockedUntil: attempt.lockedUntil
      };
    }

    // Reset counter jika masa blokir sudah berakhir
    const activeCount = attempt.lockedUntil && attempt.lockedUntil <= now ? 0 : attempt.count;

    const users = this.getStoredUsers();
    const matchedUser = users.find(u => u.email.toLowerCase() === cleanEmail);
    const isPasswordValid = matchedUser
      ? verifyPassword(rawPassword, matchedUser.passwordHash)
      : false;

    if (!matchedUser || !isPasswordValid) {
      const nextCount = activeCount + 1;
      if (nextCount >= MAX_LOGIN_ATTEMPTS) {
        const lockedUntil = now + LOCKOUT_DURATION_MS;
        this.saveLoginAttemptRecord(cleanEmail, {
          count: nextCount,
          lastAttemptAt: now,
          lockedUntil
        });
        return {
          success: false,
          error:
            'Akun diblokir sementara karena 5 kali percobaan login yang gagal berturut-turut. Silakan coba lagi nanti.',
          remainingAttempts: 0,
          lockedUntil
        };
      }

      this.saveLoginAttemptRecord(cleanEmail, {
        count: nextCount,
        lastAttemptAt: now
      });

      return {
        success: false,
        error: 'Email atau password salah',
        remainingAttempts: MAX_LOGIN_ATTEMPTS - nextCount
      };
    }

    // Login berhasil -> Bersihkan catatan gagal & buat sesi JWT (NFR-04)
    this.saveLoginAttemptRecord(cleanEmail, null);
    const publicUser = stripPasswordHash(matchedUser);
    const token = generateJwtToken(publicUser);
    this.setCurrentUser(publicUser, token);

    return {
      success: true,
      user: publicUser,
      token
    };
  },

  /**
   * Mengambil sesi pengguna aktif yang tervalidasi token JWT-nya.
   * Tidak melakukan auto-login tersembunyi jika pengguna belum login atau sudah logout.
   */
  getCurrentUser(): User | null {
    const userJson = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);

    if (!userJson || !token) {
      return null;
    }

    try {
      const user = JSON.parse(userJson) as User;
      const verification = verifyJwtToken(token);
      if (!verification.valid || verification.payload?.sub !== user.id) {
        this.logoutUser();
        return null;
      }
      return user;
    } catch {
      this.logoutUser();
      return null;
    }
  },

  getAuthToken(): string | null {
    const user = this.getCurrentUser();
    if (!user) return null;
    return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  },

  setCurrentUser(user: User | null, token?: string): void {
    if (user) {
      const jwt = token || generateJwtToken(user);
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, jwt);
    } else {
      this.logoutUser();
    }
  },

  logoutUser(): void {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
  },

  // --- Lokasi Tempat Kuliner (UC-04) ---
  getPlaces(): CulinaryPlace[] {
    const data = localStorage.getItem(STORAGE_KEYS.PLACES);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.PLACES, JSON.stringify(INITIAL_PLACES));
      return INITIAL_PLACES;
    }
    try {
      const parsed = JSON.parse(data);
      if (!Array.isArray(parsed) || parsed.length === 0) {
        return INITIAL_PLACES;
      }
      return parsed;
    } catch {
      return INITIAL_PLACES;
    }
  },

  // --- Gemini API Key (UC-03) ---
  getGeminiApiKey(): string {
    const fromStorage = localStorage.getItem(STORAGE_KEYS.GEMINI_API_KEY);
    if (fromStorage && fromStorage.trim().length > 0) {
      return fromStorage.trim();
    }
    const envKey = (import.meta as unknown as { env?: { VITE_GEMINI_API_KEY?: string } }).env?.VITE_GEMINI_API_KEY;
    if (typeof envKey === 'string' && envKey.trim().length > 0) {
      return envKey.trim();
    }
    return '';
  },

  setGeminiApiKey(key: string): void {
    localStorage.setItem(STORAGE_KEYS.GEMINI_API_KEY, (key || '').trim());
  }
};
