import React, { useState } from 'react';
import { ChefHat, Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { User } from '../types';
import { storage, DEFAULT_USERS } from '../services/storage';

interface LoginPageProps {
  onLoginSuccess: (user: User) => void;
  onNavigateToRegister: () => void;
  onNavigateToHelp: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onLoginSuccess,
  onNavigateToRegister,
  onNavigateToHelp
}) => {
  const [email, setEmail] = useState('utami@gmail.com');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    // Check if admin email or regular
    const isAdmin = email.toLowerCase().includes('admin');
    const user: User = isAdmin ? DEFAULT_USERS[1] : {
      id: `usr-${Date.now()}`,
      name: email.split('@')[0] || 'Dapur Utami',
      email: email,
      role: 'user',
      createdAt: new Date().toISOString()
    };

    storage.setCurrentUser(user);
    onLoginSuccess(user);
  };

  const handleQuickLogin = (user: User) => {
    storage.setCurrentUser(user);
    onLoginSuccess(user);
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

        <div className="flex items-center gap-2 text-xs text-[#786C68]">
          <span>Butuh bantuan?</span>
          <button 
            type="button"
            onClick={onNavigateToHelp} 
            className="text-[#FF5722] font-bold hover:underline"
          >
            Pusat Bantuan
          </button>
        </div>
      </header>

      {/* MAIN LOGIN AREA (Exact Figma 6 Cols + 6 Cols) */}
      <main className="max-w-6xl mx-auto w-full px-4 sm:px-8 py-8 lg:py-10 flex items-center justify-center flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch w-full">

          {/* LEFT COLUMN: LOGIN FORM (6 COLS) */}
          <div className="col-span-12 lg:col-span-6 bg-white rounded-3xl p-6 sm:p-10 border border-[#F0E5E1] shadow-sm flex flex-col justify-between">
            <div>
              {/* Welcoming Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFEBE6] text-[#FF5722] text-xs font-bold mb-4">
                <span>🍲</span>
                <span>Selamat Datang Kembali di Dapur BEMAS</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#1E1715] mb-2">
                Masuk ke Akun Dapurmu
              </h2>
              <p className="text-xs text-[#786C68] leading-relaxed mb-6">
                Kelola stok kulkas, simpan racikan resep AI, dan jelajahi peta kuliner Balikpapan tanpa batas.
              </p>

              {/* Quick Preset Buttons for Demo */}
              <div className="mb-5 p-3 rounded-2xl bg-[#FFF8F6] border border-[#F0E5E1] text-xs">
                <span className="font-bold text-[#1E1715] block mb-1.5">⚡ Masuk Cepat Demo:</span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleQuickLogin(DEFAULT_USERS[0])}
                    className="p-2 rounded-xl bg-white border border-[#FFD8CF] text-left hover:bg-orange-50 transition"
                  >
                    <span className="font-bold text-[#FF5722] block text-[11px]">Koki Dapur Utami</span>
                    <span className="text-[10px] text-[#786C68]">giva@student.itk.ac.id</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickLogin(DEFAULT_USERS[1])}
                    className="p-2 rounded-xl bg-white border border-indigo-200 text-left hover:bg-indigo-50 transition"
                  >
                    <span className="font-bold text-indigo-700 block text-[11px]">Admin Sistem</span>
                    <span className="text-[10px] text-[#786C68]">admin@bemas.id</span>
                  </button>
                </div>
              </div>

              {/* Input Fields Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#1E1715] mb-1.5">Email atau Nomor WhatsApp</label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#786C68] pointer-events-none">
                      <Mail className="w-4 h-4" />
                    </span>
                    <input 
                      type="text" 
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="contoh: utami@gmail.com atau 0812xxxx" 
                      className="w-full bg-[#FFF8F6] border border-[#F0E5E1] rounded-2xl pl-10 pr-4 py-3 text-xs text-[#1E1715] placeholder-[#786C68] focus:outline-hidden focus:border-[#FF5722] focus:bg-white font-medium transition-all"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-[#1E1715]">Kata Sandi</label>
                    <span className="text-[11px] font-bold text-[#FF5722] hover:underline cursor-pointer">Lupa Kata Sandi?</span>
                  </div>
                  <div className="relative flex items-center">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#786C68] pointer-events-none">
                      <Lock className="w-4 h-4" />
                    </span>
                    <input 
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="Masukkan kata sandi amanmu" 
                      className="w-full bg-[#FFF8F6] border border-[#F0E5E1] rounded-2xl pl-10 pr-10 py-3 text-xs text-[#1E1715] placeholder-[#786C68] focus:outline-hidden focus:border-[#FF5722] focus:bg-white font-medium transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#786C68] hover:text-[#1E1715]"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={rememberMe} 
                      onChange={e => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded text-[#FF5722] accent-[#FF5722] cursor-pointer"
                    />
                    <span className="text-xs text-[#1E1715] font-medium">Ingat saya di perangkat ini</span>
                  </label>
                  <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                    <span>🔄</span> Sinkron otomatis kulkas &amp; GPS
                  </span>
                </div>

                <button 
                  type="submit"
                  className="w-full py-3.5 bg-[#FF5722] hover:bg-[#E64A19] text-white rounded-2xl text-xs font-bold shadow-sm transition-colors flex items-center justify-center gap-2"
                >
                  <span>Masuk ke Dapur BEMAS</span>
                  <span>➔</span>
                </button>
              </form>

              {/* Divider */}
              <div className="relative my-6 text-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#F0E5E1]"></div>
                </div>
                <span className="relative bg-white px-3 text-[11px] text-[#786C68]">
                  atau masuk lebih cepat dengan
                </span>
              </div>

              {/* Social Login Buttons (Exact Figma) */}
              <div className="grid grid-cols-2 gap-3">
                <button 
                  type="button"
                  onClick={() => handleQuickLogin(DEFAULT_USERS[0])}
                  className="flex items-center justify-center gap-2 py-2.5 px-3 bg-[#FFF8F6] border border-[#F0E5E1] rounded-2xl text-xs font-bold text-[#1E1715] hover:border-gray-400 transition-colors"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.14Z"></path>
                    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.24v3.15C3.26 21.41 7.34 24 12 24Z"></path>
                    <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.24C.45 8.16 0 9.97 0 12s.45 3.84 1.24 5.42l4.04-3.15Z"></path>
                    <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.59 1.24 6.58l4.04 3.15c.95-2.83 3.6-4.98 6.72-4.98Z"></path>
                  </svg>
                  <span>Akun Google</span>
                </button>
                <button 
                  type="button"
                  onClick={() => handleQuickLogin(DEFAULT_USERS[0])}
                  className="flex items-center justify-center gap-2 py-2.5 px-3 bg-[#FFF8F6] border border-[#F0E5E1] rounded-2xl text-xs font-bold text-[#1E1715] hover:border-emerald-500 transition-colors"
                >
                  <span className="text-emerald-600 font-bold text-sm">💬</span>
                  <span>Akun WhatsApp</span>
                </button>
              </div>
            </div>

            <div className="pt-6 text-center text-xs text-[#786C68]">
              <span>Belum punya akun dapur? </span>
              <button 
                type="button"
                onClick={onNavigateToRegister} 
                className="font-bold text-[#FF5722] hover:underline"
              >
                Daftar Sekarang Gratis ›
              </button>
            </div>
          </div>

          {/* RIGHT COLUMN: CULINARY SHOWCASE & VALUE PROPOSITION (Exact Figma) */}
          <div className="col-span-12 lg:col-span-6 bg-linear-to-br from-[#FFF1ED] via-[#FFF8F6] to-[#FFEBE6] rounded-3xl p-6 sm:p-8 border border-[#FFD8CF] shadow-sm flex flex-col justify-between">
            <div className="space-y-5">
              <div className="relative h-56 sm:h-60 rounded-3xl overflow-hidden shadow-md">
                <img 
                  src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80" 
                  alt="BEMAS Kuliner & Resep" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent"></div>
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-xs px-3 py-1 rounded-full text-xs font-bold text-[#1E1715] flex items-center gap-1.5 shadow-2xs">
                  <span className="text-[#FF5722]">★</span>
                  <span>Balikpapan Food Radar 4.9</span>
                </div>
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-orange-200 block mb-0.5">
                    Solusi Sehari-hari
                  </span>
                  <h3 className="text-base sm:text-lg font-extrabold leading-snug">
                    "Bingung mau beli atau masak? BEMAS beri jawaban dalam sekejap."
                  </h3>
                </div>
              </div>

              {/* User Testimonial Card */}
              <div className="bg-white rounded-2xl p-4 border border-[#F0E5E1] shadow-2xs space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1 text-amber-500 font-bold">★★★★★</div>
                  <span className="text-[10px] text-[#786C68]">Ibu Maya • Sepinggan, Balikpapan</span>
                </div>
                <p className="text-xs text-[#1E1715] leading-relaxed italic">
                  "Penyelamat lapar harian keluarga di Balikpapan! Bahan di kulkas tinggal tempe &amp; kangkung langsung jadi menu resto berkat racikan pintar BEMAS."
                </p>
              </div>

              {/* 3 Benefits List */}
              <div className="space-y-2.5">
                <div className="flex items-center gap-3 p-3 bg-white rounded-2xl border border-[#F0E5E1]">
                  <div className="w-8 h-8 rounded-xl bg-[#FFEBE6] text-[#FF5722] flex items-center justify-center font-bold text-xs shrink-0">
                    🧊
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-[#1E1715]">Peringatan Kulkas Cerdas</h5>
                    <p className="text-[10px] text-[#786C68]">Simpan stok bahan &amp; dapatkan notifikasi kedaluwarsa tepat waktu.</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-white rounded-2xl border border-[#F0E5E1]">
                  <div className="w-8 h-8 rounded-xl bg-[#FFF1ED] text-[#FF5722] flex items-center justify-center font-bold text-xs shrink-0">
                    🍳
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-[#1E1715]">500+ Resep Cepat Saji</h5>
                    <p className="text-[10px] text-[#786C68]">Kreasi instan lezat siap saji dalam 15 menit dengan racikan bumbu lokal.</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-white rounded-2xl border border-[#F0E5E1]">
                  <div className="w-8 h-8 rounded-xl bg-[#E8F5E9] text-emerald-700 flex items-center justify-center font-bold text-xs shrink-0">
                    🧭
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-[#1E1715]">Radar UMKM Balikpapan</h5>
                    <p className="text-[10px] text-[#786C68]">Peta navigasi 120+ gerai kuliner khas &amp; warung sayur segar terdekat.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Privacy Guarantee */}
            <div className="pt-4 flex items-center gap-2 text-[11px] text-[#786C68]">
              <span className="text-emerald-600 font-bold text-xs">🛡️</span>
              <span>Data dapur, preferensi kuliner, dan lokasi GPS kamu dienkripsi serta terlindungi dengan standar privasi tinggi.</span>
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
