import React, { useState } from 'react';
import { ChefHat, Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle2, Info } from 'lucide-react';
import { User } from '../types';
import { storage, DEFAULT_USERS, DEFAULT_DEMO_PASSWORD } from '../services/storage';

interface LoginPageProps {
  onLoginSuccess: (user: User) => void;
  onNavigateToRegister: () => void;
  onNavigateToHome?: () => void;
  initialEmail?: string;
  registrationSuccessNotice?: boolean;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onLoginSuccess,
  onNavigateToRegister,
  onNavigateToHome,
  initialEmail = '',
  registrationSuccessNotice = false
}) => {
  const [email, setEmail] = useState(initialEmail || DEFAULT_USERS[0].email);
  const [password, setPassword] = useState(initialEmail ? '' : DEFAULT_DEMO_PASSWORD);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [remainingAttempts, setRemainingAttempts] = useState<number | null>(null);
  const [forgotPasswordNotice, setForgotPasswordNotice] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setForgotPasswordNotice(false);

    const result = storage.authenticateUser(email, password);
    if (!result.success || !result.user) {
      setErrorMessage(result.error || 'Email atau password salah');
      setRemainingAttempts(result.remainingAttempts ?? null);
      return;
    }

    setRemainingAttempts(null);
    onLoginSuccess(result.user);
  };

  const handleQuickLogin = (demoUser: User) => {
    setErrorMessage(null);
    setForgotPasswordNotice(false);
    setEmail(demoUser.email);
    setPassword(DEFAULT_DEMO_PASSWORD);

    const result = storage.authenticateUser(demoUser.email, DEFAULT_DEMO_PASSWORD);
    if (result.success && result.user) {
      onLoginSuccess(result.user);
    } else {
      setErrorMessage(result.error || 'Gagal masuk dengan akun demo');
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF8F6] text-[#1E1715] flex flex-col justify-between antialiased">
      {/* TOP MINIMAL NAV */}
      <header className="w-full px-6 lg:px-12 py-4 sm:py-5 flex items-center justify-between border-b border-[#F0E5E1] bg-white sticky top-0 z-30 shadow-2xs">
        <div
          onClick={onNavigateToHome}
          className="flex items-center gap-3 cursor-pointer"
        >
          <div className="w-10 h-10 rounded-2xl bg-[#FF5722] flex items-center justify-center text-white shadow-md shadow-orange-500/20 shrink-0">
            <ChefHat className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight text-[#FF5722] leading-none">BEMAS</h1>
            <p className="text-[11px] text-[#786C68] font-medium mt-0.5">Beli atau Masak</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-[#786C68]">
          {onNavigateToHome && (
            <button
              type="button"
              onClick={onNavigateToHome}
              className="px-3.5 py-2 rounded-xl border border-[#F0E5E1] text-[#1E1715] hover:border-[#FF5722] font-bold transition-colors"
            >
              ← Kembali ke Beranda
            </button>
          )}
        </div>
      </header>

      {/* MAIN LOGIN AREA */}
      <main className="max-w-6xl mx-auto w-full px-4 sm:px-8 py-8 lg:py-10 flex items-center justify-center flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch w-full">

          {/* LEFT COLUMN: LOGIN FORM (6 COLS) */}
          <div className="col-span-12 lg:col-span-6 bg-white rounded-3xl p-6 sm:p-10 border border-[#F0E5E1] shadow-sm flex flex-col justify-between">
            <div>
              {/* Welcoming Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFEBE6] text-[#FF5722] text-xs font-bold mb-4">
                <span>🍲</span>
                <span>Otentikasi Pengguna (FR-02 / UC-02)</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#1E1715] mb-2">
                Masuk ke Akun Dapurmu
              </h2>
              <p className="text-xs text-[#786C68] leading-relaxed mb-6">
                Masuk menggunakan kredensial email dan kata sandi terdaftar untuk mengakses fitur rekomendasi resep AI dan pemetaan kuliner GIS.
              </p>

              {/* Notifikasi Sukses Registrasi (UC-01 Langkah 6) */}
              {registrationSuccessNotice && (
                <div
                  role="status"
                  className="mb-4 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2.5"
                >
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span>Pendaftaran berhasil! Silakan masuk menggunakan akun yang baru Anda daftarkan.</span>
                </div>
              )}

              {/* Pesan Error Kredensial / Lockout NFR-05 */}
              {errorMessage && (
                <div
                  role="alert"
                  className="mb-4 p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold space-y-1"
                >
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                    <span>{errorMessage}</span>
                  </div>
                  {remainingAttempts !== null && remainingAttempts > 0 && (
                    <p className="text-[11px] text-red-600 pl-6">
                      Sisa percobaan login sebelum akun diblokir sementara: {remainingAttempts}x
                    </p>
                  )}
                </div>
              )}

              {/* Info Lupa Kata Sandi (Alternative Flow UC-02 Langkah 2a) */}
              {forgotPasswordNotice && (
                <div
                  role="status"
                  className="mb-4 p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5"
                >
                  <Info className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
                  <div>
                    <span className="font-bold block">Pemulihan Kata Sandi (UC-02 Langkah 2a):</span>
                    <span>Silakan gunakan kredensial akun demo terdaftar atau daftarkan akun baru pada tahap prototipe ini.</span>
                  </div>
                </div>
              )}

              {/* Quick Preset Buttons for Demo */}
              <div className="mb-5 p-3 rounded-2xl bg-[#FFF8F6] border border-[#F0E5E1] text-xs">
                <span className="font-bold text-[#1E1715] block mb-1.5">⚡ Masuk Cepat Akun Terdaftar (Demo):</span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleQuickLogin(DEFAULT_USERS[0])}
                    className="p-2 rounded-xl bg-white border border-[#FFD8CF] text-left hover:bg-orange-50 transition"
                  >
                    <span className="font-bold text-[#FF5722] block text-[11px]">Pengguna Umum</span>
                    <span className="text-[10px] text-[#786C68]">{DEFAULT_USERS[0].email}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickLogin(DEFAULT_USERS[1])}
                    className="p-2 rounded-xl bg-white border border-indigo-200 text-left hover:bg-indigo-50 transition"
                  >
                    <span className="font-bold text-indigo-700 block text-[11px]">Admin Sistem</span>
                    <span className="text-[10px] text-[#786C68]">{DEFAULT_USERS[1].email}</span>
                  </button>
                </div>
              </div>

              {/* Input Fields Form */}
              <form onSubmit={handleSubmit} noValidate className="space-y-4">
                <div>
                  <label htmlFor="login-email" className="block text-xs font-bold text-[#1E1715] mb-1.5">
                    Alamat Email
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#786C68] pointer-events-none">
                      <Mail className="w-4 h-4" />
                    </span>
                    <input
                      id="login-email"
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="contoh: giva@student.itk.ac.id"
                      className="w-full bg-[#FFF8F6] border border-[#F0E5E1] rounded-2xl pl-10 pr-4 py-3 text-xs text-[#1E1715] placeholder-[#786C68] focus:outline-hidden focus:border-[#FF5722] focus:bg-white font-medium transition-all"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label htmlFor="login-password" className="text-xs font-bold text-[#1E1715]">
                      Kata Sandi
                    </label>
                    <button
                      type="button"
                      onClick={() => setForgotPasswordNotice(!forgotPasswordNotice)}
                      className="text-[11px] font-bold text-[#FF5722] hover:underline cursor-pointer"
                    >
                      Lupa Kata Sandi?
                    </button>
                  </div>
                  <div className="relative flex items-center">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#786C68] pointer-events-none">
                      <Lock className="w-4 h-4" />
                    </span>
                    <input
                      id="login-password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="Masukkan kata sandi"
                      className="w-full bg-[#FFF8F6] border border-[#F0E5E1] rounded-2xl pl-10 pr-10 py-3 text-xs text-[#1E1715] placeholder-[#786C68] focus:outline-hidden focus:border-[#FF5722] focus:bg-white font-medium transition-all"
                    />
                    <button
                      type="button"
                      aria-label="Tampilkan Kata Sandi"
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
                    <span className="text-xs text-[#1E1715] font-medium">Ingat sesi di perangkat ini</span>
                  </label>
                  <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                    <span>🔐</span> Proteksi Token JWT (NFR-04)
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
            </div>

            <div className="pt-6 text-center text-xs text-[#786C68] border-t border-[#F0E5E1] mt-6">
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

          {/* RIGHT COLUMN: CULINARY SHOWCASE & VALUE PROPOSITION (6 COLS) */}
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

              {/* 3 Essential Capabilities matching SRS 1.3 */}
              <div className="space-y-2.5">
                <div className="flex items-center gap-3 p-3 bg-white rounded-2xl border border-[#F0E5E1]">
                  <div className="w-8 h-8 rounded-xl bg-[#FFF1ED] text-[#FF5722] flex items-center justify-center font-bold text-xs shrink-0">
                    🍳
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-[#1E1715]">Rekomendasi Resep Berbasis AI (FR-03)</h5>
                    <p className="text-[10px] text-[#786C68]">Olahan resep praktis berdasarkan ketersediaan bahan makanan di dapur.</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-white rounded-2xl border border-[#F0E5E1]">
                  <div className="w-8 h-8 rounded-xl bg-[#E8F5E9] text-emerald-700 flex items-center justify-center font-bold text-xs shrink-0">
                    🧭
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-[#1E1715]">Peta Interaktif Lokasi Kuliner (FR-04)</h5>
                    <p className="text-[10px] text-[#786C68]">Pemetaan GIS lokasi tempat makan terdekat di Balikpapan secara real-time.</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-white rounded-2xl border border-[#F0E5E1]">
                  <div className="w-8 h-8 rounded-xl bg-[#FFEBE6] text-[#FF5722] flex items-center justify-center font-bold text-xs shrink-0">
                    🛡️
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-[#1E1715]">Proteksi Keamanan Sesi &amp; Rate Limiting (NFR-05)</h5>
                    <p className="text-[10px] text-[#786C68]">Otentikasi terenkripsi dengan proteksi otomatis terhadap percobaan login berulang.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Privacy Guarantee */}
            <div className="pt-4 flex items-center gap-2 text-[11px] text-[#786C68]">
              <span className="text-emerald-600 font-bold text-xs">🛡️</span>
              <span>Sesuai batasan produk SRS 1.3.2: Login menggunakan email &amp; kata sandi terenkripsi tanpa OAuth pihak ketiga.</span>
            </div>
          </div>

        </div>
      </main>

      {/* MINIMAL FOOTER */}
      <footer className="w-full px-6 lg:px-12 py-4 border-t border-[#F0E5E1] bg-white text-xs text-[#786C68] flex flex-col sm:flex-row items-center justify-between gap-2">
        <span>© 2026 BEMAS (Beli atau Masak). Hak cipta dilindungi.</span>
        <span>SRS &amp; SDD Spec-Driven Prototype</span>
      </footer>
    </div>
  );
};
