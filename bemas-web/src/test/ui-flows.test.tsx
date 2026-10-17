import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '../App';
import { RecipeSection } from '../components/RecipeSection';
import { MapSection } from '../components/MapSection';

describe('SDD & TDD Suite 4: Integrasi Antarmuka & Edge Case Flow (UC-01 s.d. UC-04)', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('Flow End-to-End UC-01 -> UC-02: Registrasi akun baru -> diarahkan ke Login -> Login berhasil -> Logout bersih', async () => {
    render(<App />);

    // 1. Klik tombol Daftar di Header
    const registerBtn = screen.getByRole('button', { name: /^Daftar$/i });
    fireEvent.click(registerBtn);

    expect(
      screen.getByRole('heading', { name: /Daftar Akun Dapur BEMAS/i })
    ).toBeInTheDocument();

    // 2. Uji validasi form kosong pada Registrasi (Exceptional Flow 4b)
    const submitRegisterBtn = screen.getByRole('button', { name: /Daftar Akun Dapur BEMAS/i });
    fireEvent.click(submitRegisterBtn);
    expect(screen.getByRole('alert')).toHaveTextContent(/Nama lengkap wajib diisi/i);

    // 3. Isi data registrasi valid
    fireEvent.change(screen.getByLabelText(/Nama Lengkap/i), {
      target: { value: 'Farhan Pratama' }
    });
    fireEvent.change(screen.getByLabelText(/Alamat Email Aktif/i), {
      target: { value: 'farhan@student.itk.ac.id' }
    });
    fireEvent.change(screen.getByLabelText(/Kata Sandi Baru/i), {
      target: { value: 'RahasiaFarhan123' }
    });
    fireEvent.change(screen.getByLabelText(/Konfirmasi Kata Sandi/i), {
      target: { value: 'RahasiaFarhan123' }
    });

    fireEvent.click(submitRegisterBtn);

    // 4. Sesuai UC-01 Langkah 6: Diarahkan ke halaman Login dengan notifikasi pendaftaran berhasil & email terisi
    expect(
      screen.getByRole('heading', { name: /Masuk ke Akun Dapurmu/i })
    ).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent(/Pendaftaran berhasil!/i);
    expect(screen.getByLabelText(/Alamat Email/i)).toHaveValue('farhan@student.itk.ac.id');

    // 5. Uji password salah terlebih dahulu (UC-02 Exceptional Flow 4a)
    fireEvent.change(screen.getByLabelText(/^Kata Sandi$/i), {
      target: { value: 'PasswordSalah123' }
    });
    fireEvent.click(screen.getByRole('button', { name: /Masuk ke Dapur BEMAS/i }));
    expect(screen.getByRole('alert')).toHaveTextContent('Email atau password salah');

    // 6. Masukkan password yang benar (UC-02 Normal Flow)
    fireEvent.change(screen.getByLabelText(/^Kata Sandi$/i), {
      target: { value: 'RahasiaFarhan123' }
    });
    fireEvent.click(screen.getByRole('button', { name: /Masuk ke Dapur BEMAS/i }));

    // 7. Berhasil masuk ke halaman utama dengan nama pengguna tampil di Header
    expect(screen.getByText('Farhan Pratama')).toBeInTheDocument();

    // 8. Uji Logout bersih (tidak ada sesi bocor)
    fireEvent.click(screen.getByRole('button', { name: /^Keluar$/i }));
    expect(screen.queryByText('Farhan Pratama')).not.toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /Masuk/i }).length).toBeGreaterThan(0);
  });

  it('Flow NFR-05 pada LoginPage: memblokir akun di UI setelah 5 kali gagal login berturut-turut', () => {
    render(<App />);

    // Buka halaman Login
    fireEvent.click(screen.getAllByRole('button', { name: /^Masuk$/i })[0]);

    const passInput = screen.getByLabelText(/^Kata Sandi$/i);
    const submitBtn = screen.getByRole('button', { name: /Masuk ke Dapur BEMAS/i });

    for (let i = 1; i <= 4; i++) {
      fireEvent.change(passInput, { target: { value: `SalahTerus-${i}` } });
      fireEvent.click(submitBtn);
      expect(screen.getByRole('alert')).toHaveTextContent(
        `Sisa percobaan login sebelum akun diblokir sementara: ${5 - i}x`
      );
    }

    // Percobaan ke-5 memicu pesan blokir NFR-05 di UI
    fireEvent.change(passInput, { target: { value: 'SalahTerus-5' } });
    fireEvent.click(submitBtn);
    expect(screen.getByRole('alert')).toHaveTextContent(
      /Akun diblokir sementara karena 5 kali percobaan login yang gagal berturut-turut/i
    );
  });

  it('Flow Pencarian Cepat Header -> Sinkronisasi otomatis ke Peta Kuliner GIS (UC-04)', () => {
    render(<App />);

    const headerSearch = screen.getByLabelText(/Pencarian cepat kuliner/i);
    fireEvent.change(headerSearch, { target: { value: 'Torani' } });
    fireEvent.keyDown(headerSearch, { key: 'Enter', code: 'Enter' });

    // Harus berpindah ke tab Peta Kuliner dan menampilkan hasil pencarian Torani
    expect(screen.getByText(/Rumah Makan Torani Balikpapan/i)).toBeInTheDocument();
    expect(screen.getByText('1 Tempat Terpetakan')).toBeInTheDocument();
  });

  it('Flow UC-03 (RecipeSection): menangani input bahan kosong, penolakan duplikat, racik resep AI, dan filter kategori', async () => {
    const onGoToMap = vi.fn();
    render(<RecipeSection onGoToMap={onGoToMap} />);

    // 1. Hapus semua bahan lalu klik Racik Resep AI -> Harus tampil alert Exceptional Flow 1a
    fireEvent.click(screen.getByRole('button', { name: /Hapus Semua/i }));
    fireEvent.click(screen.getByRole('button', { name: /Racik Resep AI/i }));

    expect(screen.getByRole('alert')).toHaveTextContent(
      'Silakan masukkan minimal satu bahan makanan'
    );

    // 2. Tambahkan bahan baru melalui input
    const input = screen.getByLabelText(/Input bahan makanan/i);
    fireEvent.change(input, { target: { value: 'Telur Ayam, Wortel' } });
    fireEvent.click(screen.getByRole('button', { name: /\+ Tambah/i }));

    expect(screen.getByText('Telur Ayam')).toBeInTheDocument();
    expect(screen.getByText('Wortel')).toBeInTheDocument();

    // 3. Coba tambahkan bahan duplikat (case-insensitive) -> Harus ditolak dengan alert
    fireEvent.change(input, { target: { value: 'telur ayam' } });
    fireEvent.click(screen.getByRole('button', { name: /\+ Tambah/i }));
    expect(screen.getByRole('alert')).toHaveTextContent(
      'Bahan makanan tersebut sudah ada di dalam daftar'
    );

    // 4. Klik Racik Resep AI
    fireEvent.click(screen.getByRole('button', { name: /Racik Resep AI/i }));
    await waitFor(() => {
      expect(screen.getByRole('status')).toHaveTextContent(
        /Rekomendasi resep berhasil disusun/i
      );
    });

    // 5. Uji perpindahan tab kategori resep
    fireEvent.click(screen.getByRole('button', { name: /🥗 Sehat & Sayur/i }));
    expect(screen.getByText(/Sup Bening Segar Telur Wortel/i)).toBeInTheDocument();
  });

  it('Flow UC-04 (MapSection): mencegah kebocoran selectedPlace saat filter berubah & menangani penolakan izin GPS (Exceptional Flow 3a)', () => {
    const onGoToRecipe = vi.fn();
    render(<MapSection onGoToRecipe={onGoToRecipe} />);

    // 1. Pilih salah satu tempat kuliner (Ayam Bakar Salwa)
    fireEvent.click(screen.getByText('Ayam Bakar Salwa'));
    expect(screen.getByTestId('selected-place-detail')).toHaveTextContent('Ayam Bakar Salwa');

    // 2. Ubah filter kategori ke "Cafe" di mana Ayam Bakar Salwa tidak termasuk di dalamnya
    fireEvent.click(screen.getByRole('button', { name: 'Cafe' }));

    // Pastikan kartu detail Ayam Bakar Salwa tidak bocor (otomatis tertutup)
    expect(screen.queryByTestId('selected-place-detail')).not.toBeInTheDocument();
    expect(screen.getByText(/Kopi & Teman Nongkrong Km 11/i)).toBeInTheDocument();

    // 3. Uji pencarian yang tidak ditemukan dan tombol Reset Pencarian
    const searchInput = screen.getByLabelText(/Cari lokasi atau menu kuliner/i);
    fireEvent.change(searchInput, { target: { value: 'KulinerTidakAda999' } });
    expect(screen.getByText(/Tidak ada kuliner yang cocok/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Reset Pencarian/i }));
    expect(screen.getByText('Ayam Bakar Salwa')).toBeInTheDocument();

    // 4. Uji Exceptional Flow 3a: Pengguna menolak izin GPS
    const mockGeolocation = {
      getCurrentPosition: vi.fn((_success, error) => {
        if (error) error(new Error('Permission denied'));
      })
    };
    Object.defineProperty(globalThis.navigator, 'geolocation', {
      value: mockGeolocation,
      configurable: true
    });

    fireEvent.click(screen.getByRole('button', { name: /Gunakan GPS Saya/i }));
    expect(screen.getByRole('status')).toHaveTextContent(
      /Izin lokasi GPS ditolak, menggunakan lokasi standar kota Balikpapan/i
    );
  });
});
