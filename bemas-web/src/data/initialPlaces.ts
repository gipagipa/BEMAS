import { CulinaryPlace } from '../types';

export const INITIAL_PLACES: CulinaryPlace[] = [
  {
    id: 'place-salwa',
    name: 'Ayam Bakar Salwa',
    category: 'Warung Makan',
    address: 'Jl. Sei Wain, Karang Joang, Kec. Balikpapan Utara, Balikpapan',
    lat: -1.1520,
    lng: 116.8635,
    operatingHours: '10:00 - 21:30 WITA',
    phone: '0812-4455-8899',
    rating: 4.7,
    reviewsCount: 168,
    imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80',
    featuredMenu: 'Ayam Bakar Madu Spesial Sambal Terasi',
    priceRange: 'Murah',
    isVerified: true,
    menuList: [
      { id: 'ms-1', name: 'Paket Ayam Bakar Salwa + Es Teh', price: 22000, isPopular: true },
      { id: 'ms-2', name: 'Ayam Penyet Sambal Korek', price: 20000, isPopular: true },
      { id: 'ms-3', name: 'Tahu & Tempe Bacem', price: 6000 },
      { id: 'ms-4', name: 'Sayur Lalapan Segar', price: 4000 }
    ]
  },
  {
    id: 'place-fatim',
    name: 'Pawon Bu Fatim',
    category: 'Warung Makan',
    address: 'Jl. Soekarno Hatta Km 15, Karang Joang, Balikpapan Utara',
    lat: -1.1545,
    lng: 116.8610,
    operatingHours: '08:30 - 21:00 WITA',
    phone: '0813-9876-1234',
    rating: 4.5,
    reviewsCount: 112,
    imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80',
    featuredMenu: 'Nasi Rames Masakan Jawa & Soto Segar',
    priceRange: 'Murah',
    isVerified: true,
    menuList: [
      { id: 'mf-1', name: 'Nasi Campur Pawon Bu Fatim', price: 18000, isPopular: true },
      { id: 'mf-2', name: 'Soto Daging Bening', price: 20000, isPopular: true },
      { id: 'mf-3', name: 'Perkedel Kentang Rumahan', price: 3000 },
      { id: 'mf-4', name: 'Es Jeruk Peras', price: 5000 }
    ]
  },
  {
    id: 'place-rahmad',
    name: 'Waroeng Rahmad',
    category: 'Warung Makan',
    address: 'Jl. Sei Wain Dekat ITK, Karang Joang, Balikpapan Utara',
    lat: -1.1510,
    lng: 116.8640,
    operatingHours: '09:00 - 22:00 WITA',
    phone: '0852-1122-3344',
    rating: 4.6,
    reviewsCount: 145,
    imageUrl: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=600&q=80',
    featuredMenu: 'Nasi Goreng Mawut & Mie Dok-Dok Spesial',
    priceRange: 'Murah',
    isVerified: true,
    menuList: [
      { id: 'mr-1', name: 'Nasi Goreng Mawut Telur', price: 15000, isPopular: true },
      { id: 'mr-2', name: 'Mie Dok-Dok Kuah Kental', price: 15000, isPopular: true },
      { id: 'mr-3', name: 'Kopi Hitam Tubruk', price: 4000 },
      { id: 'mr-4', name: 'Es Teh Manis', price: 3000 }
    ]
  },
  {
    id: 'place-nay',
    name: 'Nay chicken geprek',
    category: 'Warung Makan',
    address: 'Jl. Soekarno Hatta Km 14, Karang Joang, Balikpapan Utara',
    lat: -1.1570,
    lng: 116.8665,
    operatingHours: '10:00 - 22:00 WITA',
    phone: '0821-5544-7788',
    rating: 4.8,
    reviewsCount: 220,
    imageUrl: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=600&q=80',
    featuredMenu: 'Ayam Geprek Sambal Bawang Level 1-10',
    priceRange: 'Murah',
    isVerified: true,
    menuList: [
      { id: 'mn-1', name: 'Paket Geprek Keju Leleh', price: 19000, isPopular: true },
      { id: 'mn-2', name: 'Paket Geprek Original Sambal Bawang', price: 16000, isPopular: true },
      { id: 'mn-3', name: 'Kulit Ayam Crispy', price: 8000 },
      { id: 'mn-4', name: 'Es Nutrisari Jeruk', price: 4000 }
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
