import { CulinaryPlace, Recipe, User, UserReport } from '../types';
import { INITIAL_PLACES } from '../data/initialPlaces';

const KEYS = {
  CURRENT_USER: 'bemas_current_user',
  PLACES: 'bemas_places',
  FAV_RECIPES: 'bemas_fav_recipes',
  FAV_PLACES: 'bemas_fav_places',
  REPORTS: 'bemas_reports',
  GEMINI_API_KEY: 'bemas_gemini_api_key'
};

// Default Sample Users (for demo)
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

export const storage = {
  // --- Auth / User ---
  getCurrentUser(): User | null {
    const data = localStorage.getItem(KEYS.CURRENT_USER);
    if (!data) {
      // Default to regular user for quick demo
      const defaultUser = DEFAULT_USERS[0];
      this.setCurrentUser(defaultUser);
      return defaultUser;
    }
    try {
      return JSON.parse(data);
    } catch {
      return null;
    }
  },

  setCurrentUser(user: User | null): void {
    if (user) {
      localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(KEYS.CURRENT_USER);
    }
  },

  // --- Culinary Places ---
  getPlaces(): CulinaryPlace[] {
    const data = localStorage.getItem(KEYS.PLACES);
    if (!data) {
      localStorage.setItem(KEYS.PLACES, JSON.stringify(INITIAL_PLACES));
      return INITIAL_PLACES;
    }
    try {
      return JSON.parse(data);
    } catch {
      return INITIAL_PLACES;
    }
  },

  savePlace(place: CulinaryPlace): void {
    const places = this.getPlaces();
    const existingIndex = places.findIndex(p => p.id === place.id);
    if (existingIndex >= 0) {
      places[existingIndex] = place;
    } else {
      places.unshift(place);
    }
    localStorage.setItem(KEYS.PLACES, JSON.stringify(places));
  },

  deletePlace(placeId: string): void {
    const places = this.getPlaces().filter(p => p.id !== placeId);
    localStorage.setItem(KEYS.PLACES, JSON.stringify(places));
  },

  // --- Favorites ---
  getFavoriteRecipeIds(): string[] {
    const data = localStorage.getItem(KEYS.FAV_RECIPES);
    try {
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  toggleFavoriteRecipe(recipeId: string): boolean {
    const favs = this.getFavoriteRecipeIds();
    const index = favs.indexOf(recipeId);
    let isAdded = false;
    if (index >= 0) {
      favs.splice(index, 1);
      isAdded = false;
    } else {
      favs.push(recipeId);
      isAdded = true;
    }
    localStorage.setItem(KEYS.FAV_RECIPES, JSON.stringify(favs));
    return isAdded;
  },

  getFavoritePlaceIds(): string[] {
    const data = localStorage.getItem(KEYS.FAV_PLACES);
    try {
      return data ? JSON.parse(data) : ['place-1'];
    } catch {
      return ['place-1'];
    }
  },

  toggleFavoritePlace(placeId: string): boolean {
    const favs = this.getFavoritePlaceIds();
    const index = favs.indexOf(placeId);
    let isAdded = false;
    if (index >= 0) {
      favs.splice(index, 1);
      isAdded = false;
    } else {
      favs.push(placeId);
      isAdded = true;
    }
    localStorage.setItem(KEYS.FAV_PLACES, JSON.stringify(favs));
    return isAdded;
  },

  // --- Reports (Kendala) ---
  getReports(): UserReport[] {
    const data = localStorage.getItem(KEYS.REPORTS);
    if (!data) {
      const initialReports: UserReport[] = [
        {
          id: 'rep-1',
          userId: 'usr-1',
          userName: 'Giva Asilah',
          userEmail: 'giva@student.itk.ac.id',
          category: 'Data Kuliner Salah',
          title: 'Jam Buka Waroeng Bambu Berubah',
          description: 'Mohon update jam buka waroeng bambu Km 15 hari minggu tutup jam 20.00 WITA.',
          status: 'Pending',
          createdAt: new Date(Date.now() - 3600000 * 24).toISOString()
        }
      ];
      localStorage.setItem(KEYS.REPORTS, JSON.stringify(initialReports));
      return initialReports;
    }
    try {
      return JSON.parse(data);
    } catch {
      return [];
    }
  },

  addReport(report: Omit<UserReport, 'id' | 'createdAt' | 'status'>): UserReport {
    const reports = this.getReports();
    const newReport: UserReport = {
      ...report,
      id: `rep-${Date.now()}`,
      status: 'Pending',
      createdAt: new Date().toISOString()
    };
    reports.unshift(newReport);
    localStorage.setItem(KEYS.REPORTS, JSON.stringify(reports));
    return newReport;
  },

  replyReport(reportId: string, reply: string): void {
    const reports = this.getReports().map(r => {
      if (r.id === reportId) {
        return {
          ...r,
          status: 'Selesai' as const,
          adminReply: reply,
          repliedAt: new Date().toISOString()
        };
      }
      return r;
    });
    localStorage.setItem(KEYS.REPORTS, JSON.stringify(reports));
  },

  // --- Gemini API Key ---
  getGeminiApiKey(): string {
    return localStorage.getItem(KEYS.GEMINI_API_KEY) || '';
  },

  setGeminiApiKey(key: string): void {
    localStorage.setItem(KEYS.GEMINI_API_KEY, key.trim());
  }
};
