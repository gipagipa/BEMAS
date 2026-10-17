export type UserRole = 'user' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  createdAt: string;
}

export interface StoredUser extends User {
  passwordHash: string;
}

export interface AuthResult {
  success: boolean;
  user?: User;
  token?: string;
  error?: string;
  remainingAttempts?: number;
  lockedUntil?: number;
}

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  description?: string;
  isPopular?: boolean;
}

export interface CulinaryPlace {
  id: string;
  name: string;
  category: 'Warung Makan' | 'Cafe' | 'Restoran' | 'Street Food' | 'Bakso & Mie';
  address: string;
  lat: number;
  lng: number;
  operatingHours: string;
  phone?: string;
  rating: number;
  reviewsCount: number;
  imageUrl: string;
  featuredMenu: string;
  menuList: MenuItem[];
  priceRange: 'Murah' | 'Sedang' | 'Mahal';
  isVerified?: boolean;
}

export type RecipeCategoryTag =
  | 'Semua Resep'
  | '⚡ Menu Cepat (< 20 Mnt)'
  | '🏠 Masakan Rumahan'
  | '💰 Hemat / Tanggal Tua'
  | '🥗 Sehat & Sayur';

export interface Recipe {
  id: string;
  title: string;
  description: string;
  matchedIngredients: string[];
  additionalIngredients: string[];
  prepTime: string;
  difficulty: 'Mudah' | 'Sedang' | 'Sulit';
  servings: number;
  caloriesApprox?: number;
  steps: string[];
  tips?: string;
  source: 'AI-Generated' | 'Curated';
  rating?: number;
  reviewsCount?: number;
  categoryTags?: RecipeCategoryTag[];
  imageUrl?: string;
  engineName?: string;
}

