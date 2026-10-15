import React, { useState } from 'react';
import { X, Send, AlertCircle, CheckCircle2 } from 'lucide-react';
import { User, UserReport } from '../types';
import { storage } from '../services/storage';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
}

export const ReportModal: React.FC<ReportModalProps> = ({ isOpen, onClose, currentUser }) => {
  const [category, setCategory] = useState<UserReport['category']>('Bug Teknis');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      alert('Judul dan deskripsi kendala wajib diisi!');
      return;
    }

    storage.addReport({
      userId: currentUser?.id || 'guest-1',
      userName: currentUser?.name || 'Pengguna BEMAS',
      userEmail: currentUser?.email || 'user@bemas.id',
      category,
      title,
      description
    });

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setTitle('');
      setDescription('');
      onClose();
    }, 1800);
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

        {submitted ? (
          <div className="py-8 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto animate-bounce" />
            <h3 className="text-lg font-bold text-slate-900">Laporan Berhasil Terkirim!</h3>
            <p className="text-xs text-slate-600 max-w-xs mx-auto">
              Terima kasih atas laporannya. Laporan Anda sudah masuk ke Inbox Panel Admin BEMAS.
            </p>
          </div>
        ) : (
          <>
            <div className="mb-4">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-orange-100 text-orange-700">
                Lapor Kendala (UC-07)
              </span>
              <h3 className="text-lg font-bold text-slate-900 mt-1">Formulir Laporan / Bug</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Laporkan masalah teknis, saran resep masakan, atau data tempat kuliner yang tidak akurat.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Kategori Masalah</label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-orange-500"
                >
                  <option value="Bug Teknis">Bug Teknis Sistem</option>
                  <option value="Data Kuliner Salah">Data Lokasi / Jam Buka Kuliner Salah</option>
                  <option value="Saran Resep AI">Saran Fitur Rekomendasi Resep</option>
                  <option value="Lainnya">Pertanyaan / Saran Lainnya</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Judul Laporan</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="Contoh: Titik marker warung tidak akurat"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Deskripsi Detail Kendala</label>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Jelaskan secara singkat kendala yang Anda alami..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold flex items-center gap-1.5 shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  Kirim Laporan
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};
