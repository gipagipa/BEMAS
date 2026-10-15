export type UserRole = 'user' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  createdAt: string;
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
  source: 'AI-Generated' | 'Curated' | 'AI-Vision';
  rating?: number;
  reviewsCount?: number;
}

export interface IngredientShelfLife {
  name: string;
  shelfLife: string;
  freshnessStatus: 'Segar' | 'Perlu Cepat Diolah' | 'Tahan Lama';
  storageTip: string;
  estimatedDaysLeft: number;
}

export interface PhotoAnalysisResult {
  detectedIngredients: string[];
  shelfLifeList: IngredientShelfLife[];
  urgentCookAdvice?: string;
  recipes: Recipe[];
}

export interface UserReport {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  category: 'Bug Teknis' | 'Data Kuliner Salah' | 'Saran Resep AI' | 'Lainnya';
  title: string;
  description: string;
  status: 'Pending' | 'Selesai';
  adminReply?: string;
  createdAt: string;
  repliedAt?: string;
}
