# BEMAS (Beli atau Masak) 🍳📍

> **Sistem Informasi Rekomendasi Olahan Makanan dan Lokasi Kuliner Berbasis AI & GIS**  
> Tugas Besar Mata Kuliah **Implementasi Perancangan Perangkat Lunak (IPPL)**  
> **Program Studi Informatika — Institut Teknologi Kalimantan (ITK)**  
> **Pengembang**: Giva Asilah Hasna’a Putri (NIM: **11241034**)

---

## 📌 1. Gambaran Umum Proyek
**BEMAS** adalah aplikasi cerdas yang dirancang untuk menjawab dilema harian masyarakat: *"Hari ini enaknya masak sendiri atau beli makan di luar?"*

* **Fitur Masak (AI Recipe Engine)**: Pengguna memasukkan bahan makanan yang ada di kulkas/dapur $\rightarrow$ AI (*Google Gemini API*) otomatis meracik rekomendasi resep masakan nusantara yang terstruktur (takaran, waktu masak, tingkat kesulitan, dan langkah pembuatan).
* **Fitur Beli (Peta GIS Kuliner)**: Pengguna yang malas memasak dapat mengeksplorasi warung makan & restoran terdekat berbasis peta interaktif (*Leaflet.js + OpenStreetMap*) dan GPS perangkat dengan kalkulasi jarak otomatis.
* **Fitur Pendukung**:
  * Simpan resep favorit & lokasi kuliner pilihan (*Bookmark*).
  * Pengiriman laporan kendala / bug oleh pengguna.
  * Dasbor Admin untuk manajemen master data kuliner (*CRUD + Interactive Pin Map Picker*) dan merespons laporan kendala.

---

## 🚀 2. Matriks Progres Fitur (UTS Progress > 50%)

Sesuai dokumen spesifikasi **SRS & SDD**, berikut status implementasi dari 11 Use Case:

| No | Kode Use Case | Nama Fitur / Modul | Aktor | Status Progres UTS |
| :---: | :---: | :--- | :---: | :---: |
| 1 | **UC-01** | Registrasi Akun Baru | User | ✅ **Selesai (100%)** |
| 2 | **UC-02** | Login Akun (Sesi & Peran Akun) | User, Admin | ✅ **Selesai (100%)** |
| 3 | **UC-03** | Rekomendasi Resep Berdasarkan Bahan (Gemini AI) | User | ✅ **Selesai (100%)** |
| 4 | **UC-04** | Pencarian & Eksplorasi Lokasi Kuliner (GIS Leaflet) | User | ✅ **Selesai (100%)** |
| 5 | **UC-05** | Menyimpan Resep ke Daftar Favorit | User | ✅ **Selesai (100%)** |
| 6 | **UC-06** | Menyimpan Lokasi Kuliner ke Daftar Favorit | User | ✅ **Selesai (100%)** |
| 7 | **UC-07** | Mengirim Formulir Laporan Kendala / Bug | User | ✅ **Selesai (100%)** |
| 8 | **UC-08** | Menambahkan Data Kuliner Baru (Interactive Pin) | Admin | ✅ **Selesai (100%)** |
| 9 | **UC-09** | Memperbarui Informasi Data Kuliner | Admin | ✅ **Selesai (100%)** |
| 10 | **UC-10** | Menghapus Data Kuliner dari Sistem | Admin | ✅ **Selesai (100%)** |
| 11 | **UC-11** | Membalas & Menyelesaikan Laporan Kendala | Admin | ✅ **Selesai (100%)** |

> **Capaian UTS**: Dari target minimal **30% (4 fitur)**, prototype ini telah mengimplementasikan **seluruh fitur esensial dan pendukung utama (11 Use Case)** dalam keadaan aktif dan dapat diuji secara interaktif.

---

## 🛠️ 3. Teknologi yang Digunakan (Tech Stack)

* **Frontend**: React (TypeScript) + Tailwind CSS
* **Map & GIS**: Leaflet.js + OpenStreetMap (OSM) Tiles
* **AI Integration**: Google Gemini API (`gemini-1.5-flash`) dengan *Smart Curated Fallback Engine*
* **Icons**: Lucide Icons
* **Persistence & State**: LocalStorage Engine terstruktur (CRUD Data Tempat Kuliner, Autentikasi, Bookmark, dan Tiket Laporan)
* **Build Tool**: Vite v6

---

## 💻 4. Panduan Menjalankan Aplikasi Secara Lokal

### Prasyarat:
* Node.js (v18 atau lebih baru)
* NPM

### Langkah-langkah:
1. **Clone repository ini:**
   ```bash
   git clone <URL_REPO_GITHUB_ANDA>
   cd ippl/bemas-web
   ```
2. **Install dependensi:**
   ```bash
   npm install
   ```
3. **Jalankan development server:**
   ```bash
   npm run dev
   ```
4. Buka peramban (browser) di: `http://localhost:5173`

---

## 📂 5. Struktur Direktori Proyek

```
ippl/
├── Diagram/               # Diagram Perancangan (Use Case, Activity, Sequence, DFD)
├── sdd srs/               # Dokumen Formal SRS & SDD (PDF)
├── bemas-web/             # Source Code Prototype Aplikasi Web BEMAS
│   ├── src/
│   │   ├── components/    # Komponen Navbar, RecipeSection, MapSection, AdminPanel, dsb.
│   │   ├── data/          # Seed data kuliner Balikpapan & sekitarnya
│   │   ├── services/      # Service Gemini AI & Local Storage
│   │   ├── types/         # TypeScript Domain Models
│   │   ├── App.tsx        # Main application router & state
│   │   └── index.css      # Styling Tailwind & Leaflet
│   └── package.json
└── README.md
```
