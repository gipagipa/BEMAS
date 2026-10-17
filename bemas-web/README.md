# BEMAS (Beli atau Masak) — Prototype Tugas Besar IPPL 2026

**Sistem Informasi Rekomendasi Olahan Makanan dan Lokasi Kuliner Berbasis AI & GIS**  
Disusun oleh: **Giva Asilah Hasna’a Putri (11241034)** — Institut Teknologi Kalimantan (ITK)

---

## 1. Validasi Cakupan Fitur Esensial (Target 30%–40%)

Berdasarkan dokumen spesifikasi [SRS_11241034_B.md](../sdd%20srs/SRS_11241034_B.md) dan [SDD_11241034_B.md](../sdd%20srs/SDD_11241034_B.md), sistem BEMAS memiliki total **11 Kebutuhan Fungsional / Use Case (`FR-01` s.d. `FR-11` / `UC-01` s.d. `UC-11`)**.

Pada tahap prototipe awal ini, implementasi difokuskan secara ketat pada **4 Fitur Esensial Utama**:

$$\text{Progress Fitur} = \frac{4\text{ Fitur Esensial}}{11\text{ Total Fitur SRS/SDD}} \times 100\% = \mathbf{36,36\%}$$

| ID | Use Case | Kategori | Status Prototype (Tahap 30%–40%) |
|---|---|---|---|
| **FR-01** | **UC-01: Registrasi Akun Baru** | Esensial (Autentikasi) | ✅ **Selesai & Teruji (TDD)** |
| **FR-02** | **UC-02: Login Akun** | Esensial (Autentikasi) | ✅ **Selesai & Teruji (TDD)** |
| **FR-03** | **UC-03: Mencari Resep Berdasarkan Bahan (AI)** | Esensial Utama ("Masak") | ✅ **Selesai & Teruji (TDD)** |
| **FR-04** | **UC-04: Mencari Lokasi Kuliner (GIS)** | Esensial Utama ("Beli") | ✅ **Selesai & Teruji (TDD)** |
| FR-05 | UC-05: Menyimpan Resep Favorit | Sekunder | ⏸️ Ditangguhkan ke Tahap >40% |
| FR-06 | UC-06: Menyimpan Lokasi Favorit | Sekunder | ⏸️ Ditangguhkan ke Tahap >40% |
| FR-07 | UC-07: Mengirim Laporan Kendala | Sekunder | ⏸️ Ditangguhkan ke Tahap >40% |
| FR-08 | UC-08: Menambahkan Data Kuliner (Admin) | Administrasi | ⏸️ Ditangguhkan ke Tahap >40% |
| FR-09 | UC-09: Memperbarui Data Kuliner (Admin) | Administrasi | ⏸️ Ditangguhkan ke Tahap >40% |
| FR-10 | UC-10: Menghapus Data Kuliner (Admin) | Administrasi | ⏸️ Ditangguhkan ke Tahap >40% |
| FR-11 | UC-11: Membalas Laporan Kendala (Admin) | Administrasi | ⏸️ Ditangguhkan ke Tahap >40% |

---

## 2. Kepatuhan Spesifikasi (Spec-Driven) & Penutupan Celah Alur (Edge Cases)

- **FR-01 / UC-01 & NFR-03 (Registrasi & Enkripsi Kata Sandi)**:
  - Validasi kelengkapan data, sanitasi injeksi tag HTML/XSS, validasi format email ketat, dan validasi panjang kata sandi minimal 8 karakter (*Exceptional Flow 4b*).
  - Pengecekan keunikan email secara *case-insensitive* dengan penolakan `"Email sudah digunakan"` (*Exceptional Flow 4a*).
  - Pengamanan kata sandi menggunakan fungsi *one-way salted hashing* (`$2b$10$...`) sebelum disimpan (*NFR-03*), serta pengalihan otomatis ke halaman Login setelah pendaftaran berhasil (*Normal Flow Langkah 6*).
- **FR-02 / UC-02, NFR-04, & NFR-05 (Login, Token JWT, & Rate Limiting)**:
  - pencocokan kredensial terhadap *hash* kata sandi yang tersimpan dan pembangkitan token sesi berformat JWT dengan validasi tanda tangan serta waktu kedaluwarsa (*NFR-04*).
  - Pemblokiran sementara otomatis selama 15 menit setelah **5 kali percobaan login gagal berturut-turut** (*NFR-05*).
  - Penghapusan tombol login media sosial (OAuth Google/WhatsApp) agar patuh terhadap batasan produk **SRS 1.3.2**.
- **FR-03 / UC-03 (Mencari Resep Berdasarkan Bahan)**:
  - Validasi dan normalisasi daftar bahan makanan (mendukung input dipisahkan koma, mencegah duplikasi bahan *case-insensitive*, menolak input kosong/angka saja/XSS).
  - *Prompt caching* deterministik berdasarkan kombinasi bahan yang dinormalisasi untuk menghemat kuota pemanggilan API Gemini (**SRS UC-03 Implementation Issue & SDD 3.3.1**).
  - Penanganan *Exceptional Flow 1a* (Input Kosong) dan *Exceptional Flow 3a* (Kegagalan Koneksi API).
- **FR-04 / UC-04 (Mencari Lokasi Kuliner — Peta GIS)**:
  - Pemetaan interaktif berbasis Leaflet.js & OpenStreetMap dengan perhitungan jarak Haversine yang tervalidasi dari koordinat tidak valid (`NaN`/di luar batas bumi).
  - Penanganan penolakan izin GPS dengan pengalihan ke koordinat standar kota Balikpapan (*Exceptional Flow 3a*).
  - Pencarian manual & filter kategori yang otomatis membersihkan *state* detail lokasi terpilih (`selectedPlace`) apabila tidak lagi masuk dalam hasil penyaringan.

---

## 3. Menjalankan Aplikasi & Pengujian (TDD)

```bash
# Menjalankan seluruh suite pengujian otomatis (Vitest + React Testing Library)
npm test

# Memeriksa kualitas kode & tipe TypeScript (tanpa unused locals/parameters)
npm run lint

# Membangun bundel produksi
npm run build

# Menjalankan server pengembangan lokal
npm run dev
```
