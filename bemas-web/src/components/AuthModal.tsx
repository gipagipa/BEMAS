import React, { useState } from 'react';
import { X, Lock, Mail, User as UserIcon, Shield, CheckCircle } from 'lucide-react';
import { User, UserRole } from '../types';
import { storage, DEFAULT_USERS } from '../services/storage';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('user');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      alert('Email dan kata sandi wajib diisi!');
      return;
    }

    const user: User = {
      id: `usr-${Date.now()}`,
      name: name.trim() || (role === 'admin' ? 'Administrator' : 'Pengguna Baru'),
      email: email.trim(),
      role,
      createdAt: new Date().toISOString()
    };

    storage.setCurrentUser(user);
    onLoginSuccess(user);
    onClose();
  };

  const handleQuickDemoLogin = (selectedUser: User) => {
    storage.setCurrentUser(selectedUser);
    onLoginSuccess(selectedUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute right-5 top-5 p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-4">
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-orange-100 text-orange-700">
            {isRegister ? 'Registrasi Akun Baru (UC-01)' : 'Login Akun (UC-02)'}
          </span>
          <h3 className="text-xl font-extrabold text-slate-900 mt-1">
            {isRegister ? 'Daftar Akun BEMAS' : 'Masuk ke Akun Anda'}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Gunakan akun pengguna untuk menyimpan resep dan tempat kuliner favorit.
          </p>
        </div>

        {/* Quick Demo Accounts for Video Presentation */}
        <div className="mb-4 p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
          <p className="font-bold text-slate-700 mb-2">⚡ Masuk Cepat Akun Demo (Untuk Presentasi):</p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemoLogin(DEFAULT_USERS[0])}
              className="p-2 rounded-xl border border-orange-200 bg-white hover:bg-orange-50/50 text-left transition"
            >
              <div className="font-bold text-slate-800 text-[11px]">Mahasiswa / User</div>
              <div className="text-[10px] text-slate-400 truncate">giva@student.itk.ac.id</div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemoLogin(DEFAULT_USERS[1])}
              className="p-2 rounded-xl border border-indigo-200 bg-white hover:bg-indigo-50/50 text-left transition"
            >
              <div className="font-bold text-indigo-900 text-[11px]">Admin Sistem</div>
              <div className="text-[10px] text-slate-400 truncate">admin@bemas.id</div>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          {isRegister && (
            <div>
              <label className="font-bold text-slate-700 block mb-1">Nama Lengkap</label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Giva Asilah"
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>
          )}

          <div>
            <label className="font-bold text-slate-700 block mb-1">Alamat Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="nama@email.com"
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Kata Sandi (Password)</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          {isRegister && (
            <div>
              <label className="font-bold text-slate-700 block mb-1">Pilihan Peran (Role)</label>
              <select
                value={role}
                onChange={e => setRole(e.target.value as UserRole)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-orange-500"
              >
                <option value="user">Pengguna Umum (User)</option>
                <option value="admin">Administrator (Admin)</option>
              </select>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-md shadow-orange-500/20 transition mt-2"
          >
            {isRegister ? 'Daftar Akun Sekarang' : 'Masuk ke Sistem'}
          </button>
        </form>

        <div className="mt-4 pt-3 border-t border-slate-100 text-center text-xs text-slate-500">
          {isRegister ? (
            <span>
              Sudah punya akun?{' '}
              <button
                type="button"
                onClick={() => setIsRegister(false)}
                className="font-bold text-orange-600 hover:underline"
              >
                Masuk di sini
              </button>
            </span>
          ) : (
            <span>
              Belum memiliki akun?{' '}
              <button
                type="button"
                onClick={() => setIsRegister(true)}
                className="font-bold text-orange-600 hover:underline"
              >
                Daftar akun baru
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
