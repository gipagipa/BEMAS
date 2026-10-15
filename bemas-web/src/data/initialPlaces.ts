import { CulinaryPlace } from '../types';

export const INITIAL_PLACES: CulinaryPlace[] = [
  {
    id: 'place-1',
    name: 'Waroeng Bambu Kampus ITK',
    category: 'Warung Makan',
    address: 'Jl. Soekarno Hatta Km 15, Karang Joang, Balikpapan Utara',
    lat: -1.1534,
    lng: 116.8625,
    operatingHours: '09:00 - 21:00 WITA',
    phone: '0812-3456-7890',
    rating: 4.8,
    reviewsCount: 142,
    imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
    featuredMenu: 'Ayam Goreng Sambal Bawang & Sayur Asem',
    priceRange: 'Murah',
    isVerified: true,
    menuList: [
      { id: 'm1-1', name: 'Paket Ayam Goreng Kremes', price: 18000, isPopular: true },
      { id: 'm1-2', name: 'Nasi Pecel Lele Bakar', price: 16000, isPopular: true },
      { id: 'm1-3', name: 'Sayur Asem Segar', price: 5000 },
      { id: 'm1-4', name: 'Es Teh Manis Jumbo', price: 4000 }
    ]
  },
  {
    id: 'place-2',
    name: 'Kopi & Teman Nongkrong Km 11',
    category: 'Cafe',
    address: 'Jl. Soekarno Hatta Km 11, Graha Indah, Balikpapan',
    lat: -1.1872,
    lng: 116.8681,
    operatingHours: '10:00 - 23:00 WITA',
    phone: '0821-9876-5432',
    rating: 4.7,
    reviewsCount: 98,
    imageUrl: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=600&q=80',
    featuredMenu: 'Kopi Susu Aren Gula Asli & Roti Bakar Coklat Keju',
    priceRange: 'Sedang',
    isVerified: true,
    menuList: [
      { id: 'm2-1', name: 'Es Kopi Susu Aren Bemas', price: 18000, isPopular: true },
      { id: 'm2-2', name: 'Matcha Latte Dingin', price: 22000 },
      { id: 'm2-3', name: 'Roti Bakar Srikaya Keju', price: 15000, isPopular: true },
      { id: 'm2-4', name: 'French Fries Saus Barbeque', price: 16000 }
    ]
  },
  {
    id: 'place-3',
    name: 'Rumah Makan Torani Balikpapan',
    category: 'Restoran',
    address: 'Jl. Jenderal Sudirman No. 73, Stal Kuda, Balikpapan Selatan',
    lat: -1.2689,
    lng: 116.8795,
    operatingHours: '10:00 - 22:00 WITA',
    phone: '0811-541-2000',
    rating: 4.9,
    reviewsCount: 384,
    imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80',
    featuredMenu: 'Kepiting Saus Lada Hitam & Ikan Bakar Bandeng Tanpa Duri',
    priceRange: 'Mahal',
    isVerified: true,
    menuList: [
      { id: 'm3-1', name: 'Kepiting Asap Saus Spesial', price: 135000, isPopular: true },
      { id: 'm3-2', name: 'Bandeng Bakar Tanpa Duri', price: 48000, isPopular: true },
      { id: 'm3-3', name: 'Cah Kangkung Terasi Balikpapan', price: 22000 },
      { id: 'm3-4', name: 'Es Kelapa Jeruk Segar', price: 18000 }
    ]
  },
  {
    id: 'place-4',
    name: 'Bakso & Mie Ayam Podomoro Pasar Segar',
    category: 'Bakso & Mie',
    address: 'Komp. Pasar Segar Blok RB No. 5, Jl. Sungai Ampal, Balikpapan',
    lat: -1.2405,
    lng: 116.8690,
    operatingHours: '11:00 - 22:30 WITA',
    phone: '0852-7711-2233',
    rating: 4.6,
    reviewsCount: 215,
    imageUrl: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=600&q=80',
    featuredMenu: 'Bakso Urat Jumbo Pedas & Mie Ayam Jamur Pangsit',
    priceRange: 'Murah',
    isVerified: true,
    menuList: [
      { id: 'm4-1', name: 'Bakso Beranak Tetelan Pedas', price: 25000, isPopular: true },
      { id: 'm4-2', name: 'Mie Ayam Pangsit Komplit', price: 18000, isPopular: true },
      { id: 'm4-3', name: 'Bakso Halus Kuah Sumsum', price: 20000 },
      { id: 'm4-4', name: 'Es Jeruk Nipis Madu', price: 8000 }
    ]
  },
  {
    id: 'place-5',
    name: 'Soto Banjar Kuah Susu Ny. Maryam',
    category: 'Warung Makan',
    address: 'Jl. MT Haryono No. 12, Damai, Balikpapan Kota',
    lat: -1.2471,
    lng: 116.8612,
    operatingHours: '07:30 - 16:00 WITA',
    phone: '0813-4455-6677',
    rating: 4.8,
    reviewsCount: 176,
    imageUrl: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=600&q=80',
    featuredMenu: 'Soto Banjar Komplit Ketupat & Telur Bebek',
    priceRange: 'Sedang',
    isVerified: true,
    menuList: [
      { id: 'm5-1', name: 'Soto Banjar Ayam Kampung Komplit', price: 28000, isPopular: true },
      { id: 'm5-2', name: 'Soto Banjar Perkedel Spesial', price: 24000 },
      { id: 'm5-3', name: 'Sate Ayam Bumbu Manis (5 Tusuk)', price: 18000, isPopular: true },
      { id: 'm5-4', name: 'Es Blewah Gula Merah', price: 10000 }
    ]
  },
  {
    id: 'place-6',
    name: 'Pisang Gapit & Street Treats Melawai',
    category: 'Street Food',
    address: 'Kawasan Pantai Melawai, Jl. Pelabuhan Semayang, Balikpapan',
    lat: -1.2821,
    lng: 116.8205,
    operatingHours: '16:00 - 24:00 WITA',
    phone: '0819-2233-4455',
    rating: 4.7,
    reviewsCount: 290,
    imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80',
    featuredMenu: 'Pisang Gapit Kuah Kinca Nangka & Salome Bakar Pedas Manis',
    priceRange: 'Murah',
    isVerified: true,
    menuList: [
      { id: 'm6-1', name: 'Pisang Gapit Keju Kinca Nangka', price: 15000, isPopular: true },
      { id: 'm6-2', name: 'Salome Bakar Saus Kacang Pedas', price: 12000, isPopular: true },
      { id: 'm6-3', name: 'Jagung Bakar Serut Manis Pedas', price: 10000 },
      { id: 'm6-4', name: 'Es Kelapa Muda Batok Asli', price: 15000 }
    ]
  }
];
