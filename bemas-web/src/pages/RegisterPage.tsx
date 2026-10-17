import React, { useState } from 'react';
import { ChefHat, Mail, Lock, User as UserIcon, Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react';
import { storage } from '../services/storage';

interface RegisterPageProps {
  onRegisterSuccess: (registeredEmail: string) => void;
  onNavigateToLogin: () => void;
  onNavigateToHome?: () => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({
  onRegisterSuccess,
  onNavigateToLogin,
  onNavigateToHome
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const result = storage.registerUser({
      name,
      email,
      password,
      confirmPassword,
      agreeTerms
    });

    if (!result.success || !result.user) {
      setErrorMessage(result.error || 'Pendaftaran gagal, periksa kembali data Anda.');
      return;
    }

    // Sesuai SRS UC-01 Langkah 6: Menampilkan notifikasi pendaftaran berhasil dan mengarahkan ke halaman login
    setSuccessMessage('Pendaftaran akun berhasil! Mengarahkan Anda ke halaman login...');
    onRegisterSuccess(result.user.email);
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

      {/* MAIN REGISTER AREA */}
      <main className="max-w-6xl mx-auto w-full px-4 sm:px-8 py-8 lg:py-10 flex items-center justify-center flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch w-full">

          {/* LEFT COLUMN: REGISTER FORM (7 COLS) */}
          <div className="col-span-12 lg:col-span-7 bg-white rounded-3xl p-6 sm:p-9 border border-[#F0E5E1] shadow-sm flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFEBE6] text-[#FF5722] text-xs font-bold mb-3">
                <span>✨ Registrasi Akun Baru (FR-01 / UC-01)</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#1E1715] mb-2">
                Daftar Akun Dapur BEMAS
              </h2>
              <p className="text-xs text-[#786C68] leading-relaxed mb-6">
                Bebaskan diri dari kebingungan harian. Racik bahan kulkas jadi resep lezat atau temukan kuliner autentik Balikpapan dalam hitungan detik.
              </p>

              {errorMessage && (
                <div
                  role="alert"
                  className="mb-4 p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2.5"
                >
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {successMessage && (
                <div
                  role="status"
                  className="mb-4 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2.5"
                >
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span>{successMessage}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate className="space-y-4">
                <div>
                  <label htmlFor="register-name" className="block text-xs font-bold text-[#1E1715] mb-1.5">
                    Nama Lengkap <span className="text-[#FF5722]">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#786C68] pointer-events-none">
                      <UserIcon className="w-4 h-4" />
                    </span>
                    <input
                      id="register-name"
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="Contoh: Giva Asilah"
                      className="w-full bg-[#FFF8F6] border border-[#F0E5E1] rounded-2xl pl-10 pr-4 py-3 text-xs text-[#1E1715] placeholder-[#786C68] focus:outline-hidden focus:border-[#FF5722] focus:bg-white font-medium transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="register-email" className="block text-xs font-bold text-[#1E1715] mb-1.5">
                    Alamat Email Aktif <span className="text-[#FF5722]">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#786C68] pointer-events-none">
                      <Mail className="w-4 h-4" />
                    </span>
                    <input
                      id="register-email"
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="nama@email.com"
                      className="w-full bg-[#FFF8F6] border border-[#F0E5E1] rounded-2xl pl-10 pr-4 py-3 text-xs text-[#1E1715] placeholder-[#786C68] focus:outline-hidden focus:border-[#FF5722] focus:bg-white font-medium transition-all"
                    />
                  </div>
                </div>

                {/* Password Grid (2 Cols) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="register-password" className="block text-xs font-bold text-[#1E1715] mb-1.5">
                      Kata Sandi Baru <span className="text-[#FF5722]">*</span>
                    </label>
                    <div className="relative flex items-center">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#786C68] pointer-events-none">
                        <Lock className="w-4 h-4" />
                      </span>
                      <input
                        id="register-password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="Minimal 8 karakter"
                        className="w-full bg-[#FFF8F6] border border-[#F0E5E1] rounded-2xl pl-9 pr-9 py-3 text-xs text-[#1E1715] placeholder-[#786C68] focus:outline-hidden focus:border-[#FF5722] focus:bg-white font-medium transition-all"
                      />
                      <button
                        type="button"
                        aria-label="Tampilkan Kata Sandi"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#786C68] hover:text-[#1E1715]"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="register-confirm-password" className="block text-xs font-bold text-[#1E1715] mb-1.5">
                      Konfirmasi Kata Sandi <span className="text-[#FF5722]">*</span>
                    </label>
                    <div className="relative flex items-center">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#786C68] pointer-events-none">
                        <Lock className="w-4 h-4" />
                      </span>
                      <input
                        id="register-confirm-password"
                        type={showPassword ? 'text' : 'password'}
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
                    id="register-terms"
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={e => setAgreeTerms(e.target.checked)}
                    className="w-4 h-4 rounded text-[#FF5722] accent-[#FF5722] cursor-pointer"
                  />
                  <label htmlFor="register-terms" className="text-xs text-[#1E1715] cursor-pointer">
                    Saya menyetujui Ketentuan Layanan &amp; Kebijakan Privasi BEMAS
                  </label>
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
                <h4 className="font-extrabold text-sm text-[#1E1715]">Rekomendasi Resep AI (FR-03)</h4>
                <p className="text-xs text-[#786C68] leading-relaxed">
                  Masukkan daftar bahan makanan yang tersedia di dapur, dan sistem menyusun rekomendasi resep beserta takaran dan langkah pembuatannya.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-[#F0E5E1] shadow-2xs space-y-2">
                <span className="text-xl">📍</span>
                <h4 className="font-extrabold text-sm text-[#1E1715]">Pemetaan Kuliner GIS (FR-04)</h4>
                <p className="text-xs text-[#786C68] leading-relaxed">
                  Jelajahi titik lokasi tempat usaha kuliner terdekat di Balikpapan berbasis peta interaktif Leaflet.js dan OpenStreetMap.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-[#F0E5E1] shadow-2xs space-y-2">
                <span className="text-xl">🔒</span>
                <h4 className="font-extrabold text-sm text-[#1E1715]">Keamanan Kredensial (NFR-03)</h4>
                <p className="text-xs text-[#786C68] leading-relaxed">
                  Kata sandi Anda diamankan menggunakan algoritma hashing satu arah sebelum disimpan ke basis data sistem.
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
        <span>SRS &amp; SDD Spec-Driven Prototype</span>
      </footer>
    </div>
  );
};
