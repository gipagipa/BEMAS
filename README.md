# BEMAS (Beli atau Masak)

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

## 🚀 2. Matriks Progres Fitur (Tahap Evaluasi 30%–40%)

Berdasarkan dokumen spesifikasi formal [SRS_11241034_B.md](sdd%20srs/SRS_11241034_B.md) dan [SDD_11241034_B.md](sdd%20srs/SDD_11241034_B.md), sistem BEMAS memiliki total **11 Kebutuhan Fungsional / Use Case (`FR-01` s.d. `FR-11`)**.

Sesuai kriteria evaluasi tugas besar (*minimal 30% dari jumlah fitur esensial dan tidak melebihi 40%*), prototipe ini mengimplementasikan **4 Fitur Esensial Utama**:

$$\text{Progress Fitur} = \frac{4\text{ Fitur Esensial}}{11\text{ Total Use Case SRS/SDD}} \times 100\% = \mathbf{36,36\%}$$

| No | Kode SRS | Nama Fitur / Modul | Aktor | Status Prototype (Tahap 30%–40%) |
| :---: | :---: | :--- | :---: | :---: |
| 1 | **FR-01 (UC-01)** | **Registrasi Akun Baru** (Enkripsi Salted Hash & Validasi) | Pengguna | ✅ **Selesai & Teruji (TDD)** |
| 2 | **FR-02 (UC-02)** | **Login Akun** (Token JWT & Lockout Security 5x Gagal) | Pengguna | ✅ **Selesai & Teruji (TDD)** |
| 3 | **FR-03 (UC-03)** | **Rekomendasi Resep AI** (BEMAS Generative Culinary Engine) | Pengguna | ✅ **Selesai & Teruji (TDD)** |
| 4 | **FR-04 (UC-04)** | **Pencarian Kuliner GIS** (Leaflet OSM, Jarak Haversine) | Pengguna | ✅ **Selesai & Teruji (TDD)** |
| 5 | FR-05 (UC-05) | Menyimpan Resep ke Daftar Favorit | Pengguna | ⏸️ Ditangguhkan ke Tahap > 40% |
| 6 | FR-06 (UC-06) | Menyimpan Lokasi Kuliner ke Daftar Favorit | Pengguna | ⏸️ Ditangguhkan ke Tahap > 40% |
| 7 | FR-07 (UC-07) | Mengirim Formulir Laporan Kendala / Bug | Pengguna | ⏸️ Ditangguhkan ke Tahap > 40% |
| 8 | FR-08 (UC-08) | Menambahkan Data Kuliner Baru (Admin) | Admin | ⏸️ Ditangguhkan ke Tahap > 40% |
| 9 | FR-09 (UC-09) | Memperbarui Informasi Data Kuliner (Admin) | Admin | ⏸️ Ditangguhkan ke Tahap > 40% |
| 10 | FR-10 (UC-10) | Menghapus Data Kuliner dari Sistem (Admin) | Admin | ⏸️ Ditangguhkan ke Tahap > 40% |
| 11 | FR-11 (UC-11) | Membalas & Menyelesaikan Laporan Kendala (Admin) | Admin | ⏸️ Ditangguhkan ke Tahap > 40% |

> **Catatan Kepatuhan Evaluasi**: Fitur sekunder dan administrasi sengaja ditangguhkan agar prototipe tetap fokus pada kualitas fitur esensial tanpa melebihi batas 40% (*anti-overkill*), serta diperkuat dengan pengujian otomatis menyeluruh (33 unit test lulus 100%).

---

## 🛠️ 3. Teknologi yang Digunakan (Tech Stack)

* **Frontend**: React 19, TypeScript, Tailwind CSS
* **Map & GIS**: Leaflet.js + OpenStreetMap (OSM) Tiles dengan kalkulasi jarak Haversine
* **AI Culinary Engine**: 
  - Dual Mode: *Google Gemini API (`gemini-1.5-flash`)* & *BEMAS Generative Culinary AI Engine* (Offline Dynamic AI Synthesizer)
  - Caching cerdas deterministik berbasis variasi kombinasi bahan makanan (SDD 3.3.1)
* **Security & Auth**: One-way Salted Hashing (NFR-03), JWT Session Token (NFR-04), dan Lockout Protection 15 menit setelah 5x gagal berturut-turut (NFR-05)
* **Testing Framework**: Vitest + React Testing Library (33 tests passed 100%)
* **Build Tool**: Vite v6

---

## 💻 4. Panduan Menjalankan Aplikasi & Pengujian

### Prasyarat:
* Node.js (v18 atau lebih baru)
* NPM

### Langkah-langkah:
1. **Clone repository ini:**
   ```bash
   git clone https://github.com/gipagipa/BEMAS.git
   cd BEMAS/bemas-web
   ```
2. **Install dependensi:**
   ```bash
   npm install
   ```
3. **Jalankan pengujian otomatis (TDD):**
   ```bash
   npm test
   ```
4. **Jalankan type-check & linter:**
   ```bash
   npm run lint
   ```
5. **Jalankan development server lokal:**
   ```bash
   npm run dev
   ```
6. Buka peramban (browser) di: `http://localhost:5173`

---

### 🐳 Menjalankan Menggunakan Docker (Production Ready)

Aplikasi BEMAS telah dilengkapi konfigurasi **Multi-Stage Build Docker** dan web server **Nginx** dengan kompresi gzip serta routing SPA:

```bash
# 1. Bangun citra (image) dan jalankan kontainer di latar belakang
docker compose up -d --build

# 2. Buka peramban di:
http://localhost:3000

# 3. Untuk melihat log kontainer:
docker compose logs -f

# 4. Untuk menghentikan kontainer:
docker compose down
```

---

## 📂 5. Struktur Direktori Proyek

```
ippl/
├── Diagram/               # Diagram Perancangan (Use Case, Activity, Sequence, DFD)
├── sdd srs/               # Dokumen Formal SRS & SDD (PDF & Markdown)
├── bemas-web/             # Source Code Prototype Aplikasi Web BEMAS
│   ├── src/
│   │   ├── components/    # Komponen RecipeSection, MapSection, Header, Sidebar, dsb.
│   │   ├── data/          # Seed data kuliner Balikpapan & sekitarnya
│   │   ├── services/      # Service Gemini AI & Local Storage
│   │   ├── test/          # 4 Suite Pengujian Otomatis (33 Tests Vitest)
│   │   ├── types/         # TypeScript Domain Models
│   │   └── App.tsx        # Main application router & state
│   ├── Dockerfile         # Multi-stage Docker build (Node.js 20 + Nginx Alpine)
│   ├── nginx.conf         # Konfigurasi Nginx (SPA routing fallback & gzip)
│   └── package.json
├── docker-compose.yml     # Konfigurasi Orkestrasi Docker Compose (Port 3000:80)
└── README.md
```
