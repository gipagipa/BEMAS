import React, { useState } from 'react';
import { ChefHat, Mail, Lock, User as UserIcon, Eye, EyeOff } from 'lucide-react';
import { User } from '../types';
import { storage } from '../services/storage';

interface RegisterPageProps {
  onRegisterSuccess: (user: User) => void;
  onNavigateToLogin: () => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({
  onRegisterSuccess,
  onNavigateToLogin
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      alert('Semua kolom bertanda bintang wajib diisi!');
      return;
    }
    if (password !== confirmPassword) {
      alert('Konfirmasi kata sandi tidak cocok!');
      return;
    }

    const user: User = {
      id: `usr-${Date.now()}`,
      name: name.trim(),
      email: email.trim(),
      role: 'user',
      createdAt: new Date().toISOString()
    };

    storage.setCurrentUser(user);
    onRegisterSuccess(user);
  };

  return (
    <div className="min-h-screen bg-[#FFF8F6] text-[#1E1715] flex flex-col justify-between antialiased">
      {/* TOP MINIMAL NAV (Exact Figma) */}
      <header className="w-full px-6 lg:px-12 py-4 sm:py-5 flex items-center justify-between border-b border-[#F0E5E1] bg-white sticky top-0 z-30 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#FF5722] flex items-center justify-center text-white shadow-md shadow-orange-500/20 shrink-0">
            <ChefHat className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight text-[#FF5722] leading-none">BEMAS</h1>
            <p className="text-[11px] text-[#786C68] font-medium mt-0.5">Beli atau Masak</p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <span className="text-[#786C68] hidden sm:inline">Sudah punya akun dapur?</span>
          <button 
            type="button"
            onClick={onNavigateToLogin}
            className="px-4 py-2 bg-[#FFF8F6] border border-[#F0E5E1] text-[#FF5722] font-bold rounded-xl hover:bg-[#FFEBE6] transition-colors shadow-2xs"
          >
            Masuk ke Akun →
          </button>
        </div>
      </header>

      {/* MAIN REGISTER AREA (Exact Figma 7 Cols + 5 Cols) */}
      <main className="max-w-6xl mx-auto w-full px-4 sm:px-8 py-8 lg:py-10 flex items-center justify-center flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch w-full">

          {/* LEFT COLUMN: REGISTER FORM (7 COLS) */}
          <div className="col-span-12 lg:col-span-7 bg-white rounded-3xl p-6 sm:p-9 border border-[#F0E5E1] shadow-sm flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFEBE6] text-[#FF5722] text-xs font-bold mb-3">
                <span>✨ Mulai Petualangan Masak &amp; Kuliner</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#1E1715] mb-2">
                Daftar Akun Dapur BEMAS
              </h2>
              <p className="text-xs text-[#786C68] leading-relaxed mb-6">
                Bebaskan diri dari kebingungan harian. Racik bahan kulkas jadi resep lezat atau temukan kuliner autentik Balikpapan dalam hitungan detik.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#1E1715] mb-1.5">
                    Nama Lengkap / Panggilan Koki <span className="text-[#FF5722]">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#786C68] pointer-events-none">
                      <UserIcon className="w-4 h-4" />
                    </span>
                    <input 
                      type="text" 
                      required
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="Contoh: Dapur Bu Utami atau Koki Farhan" 
                      className="w-full bg-[#FFF8F6] border border-[#F0E5E1] rounded-2xl pl-10 pr-4 py-3 text-xs text-[#1E1715] placeholder-[#786C68] focus:outline-hidden focus:border-[#FF5722] focus:bg-white font-medium transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1E1715] mb-1.5">
                    Email Aktif atau Nomor WhatsApp <span className="text-[#FF5722]">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#786C68] pointer-events-none">
                      <Mail className="w-4 h-4" />
                    </span>
                    <input 
                      type="text" 
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="name@email.com atau 08123456789" 
                      className="w-full bg-[#FFF8F6] border border-[#F0E5E1] rounded-2xl pl-10 pr-4 py-3 text-xs text-[#1E1715] placeholder-[#786C68] focus:outline-hidden focus:border-[#FF5722] focus:bg-white font-medium transition-all"
                    />
                  </div>
                  <span className="text-[10px] text-[#786C68] mt-1 block">
                    Digunakan untuk notifikasi bahan kulkas kedaluwarsa &amp; sinkronisasi resep.
                  </span>
                </div>

                {/* Password Grid (2 Cols) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#1E1715] mb-1.5">
                      Kata Sandi Baru <span className="text-[#FF5722]">*</span>
                    </label>
                    <div className="relative flex items-center">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#786C68] pointer-events-none">
                        <Lock className="w-4 h-4" />
                      </span>
                      <input 
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="Minimal 8 karakter" 
                        className="w-full bg-[#FFF8F6] border border-[#F0E5E1] rounded-2xl pl-9 pr-4 py-3 text-xs text-[#1E1715] placeholder-[#786C68] focus:outline-hidden focus:border-[#FF5722] focus:bg-white font-medium transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#1E1715] mb-1.5">
                      Konfirmasi Kata Sandi <span className="text-[#FF5722]">*</span>
                    </label>
                    <div className="relative flex items-center">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#786C68] pointer-events-none">
                        <Lock className="w-4 h-4" />
                      </span>
                      <input 
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        placeholder="Ulangi kata sandi" 
                        className="w-full bg-[#FFF8F6] border border-[#F0E5E1] rounded-2xl pl-9 pr-4 py-3 text-xs text-[#1E1715] placeholder-[#786C68] focus:outline-hidden focus:border-[#FF5722] focus:bg-white font-medium transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input 
                    type="checkbox" 
                    checked={agreeTerms}
                    onChange={e => setAgreeTerms(e.target.checked)}
                    className="w-4 h-4 rounded text-[#FF5722] accent-[#FF5722] cursor-pointer"
                  />
                  <span className="text-xs text-[#1E1715]">
                    Saya menyetujui Ketentuan Layanan &amp; Kebijakan Privasi BEMAS
                  </span>
                </div>

                <button 
                  type="submit"
                  className="w-full py-3.5 bg-[#FF5722] hover:bg-[#E64A19] text-white rounded-2xl text-xs font-bold shadow-sm transition-colors flex items-center justify-center gap-2"
                >
                  <span>Daftar Akun Dapur BEMAS</span>
                  <span>➔</span>
                </button>
              </form>
            </div>

            <div className="pt-6 text-center text-xs text-[#786C68]">
              <span>Sudah memiliki akun? </span>
              <button 
                type="button"
                onClick={onNavigateToLogin}
                className="font-bold text-[#FF5722] hover:underline"
              >
                Masuk ke sini ›
              </button>
            </div>
          </div>

          {/* RIGHT COLUMN: BENEFITS & SHOWCASE (5 COLS) */}
          <div className="col-span-12 lg:col-span-5 bg-linear-to-br from-[#FFF1ED] via-[#FFF8F6] to-[#FFEBE6] rounded-3xl p-6 sm:p-8 border border-[#FFD8CF] shadow-sm flex flex-col justify-between">
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-white border border-[#F0E5E1] shadow-2xs space-y-2">
                <span className="text-xl">🍳</span>
                <h4 className="font-extrabold text-sm text-[#1E1715]">Koki Rumahan Cerdas</h4>
                <p className="text-xs text-[#786C68] leading-relaxed">
                  Gabung dengan ribuan pengguna di Balikpapan yang menghemat pengeluaran dapur harian hingga 40% berkat racikan pintar BEMAS.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-[#F0E5E1] shadow-2xs space-y-2">
                <span className="text-xl">📍</span>
                <h4 className="font-extrabold text-sm text-[#1E1715]">Dukungan Penuh UMKM Lokal</h4>
                <p className="text-xs text-[#786C68] leading-relaxed">
                  Semua titik lokasi kuliner dan pasar basah dikurasi langsung untuk membantu memajukan UMKM kuliner di Kalimantan Timur.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-[#F0E5E1] shadow-2xs space-y-2">
                <span className="text-xl">📸</span>
                <h4 className="font-extrabold text-sm text-[#1E1715]">Deteksi Foto AI Vision</h4>
                <p className="text-xs text-[#786C68] leading-relaxed">
                  Tinggal foto isi kulkas, AI langsung memberi tahu sisa hari ketahanan bahan dan menu yang wajib segera dimasak.
                </p>
              </div>
            </div>

            <div className="pt-4 text-center text-[11px] text-[#786C68]">
              BEMAS © 2026 • Institut Teknologi Kalimantan (ITK)
            </div>
          </div>

        </div>
      </main>

      {/* MINIMAL FOOTER */}
      <footer className="w-full px-6 lg:px-12 py-4 border-t border-[#F0E5E1] bg-white text-xs text-[#786C68] flex flex-col sm:flex-row items-center justify-between gap-2">
        <span>© 2026 BEMAS (Beli atau Masak). Hak cipta dilindungi.</span>
        <div className="flex items-center gap-4">
          <span className="hover:underline hover:text-[#FF5722] cursor-pointer">Kebijakan Privasi</span>
          <span className="hover:underline hover:text-[#FF5722] cursor-pointer">Syarat &amp; Ketentuan</span>
        </div>
      </footer>
    </div>
  );
};
