import React, { useState } from 'react';
import { X, Key, Check, ExternalLink, Sparkles } from 'lucide-react';
import { storage } from '../services/storage';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose }) => {
  const [apiKey, setApiKey] = useState(storage.getGeminiApiKey());
  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    storage.setGeminiApiKey(apiKey);
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 1200);
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

        <div className="flex items-center gap-2.5 mb-3">
          <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
            <Key className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Google Gemini API Key</h3>
            <p className="text-[11px] text-slate-500">Integrasi Kecerdasan Buatan BEMAS</p>
          </div>
        </div>

        <p className="text-xs text-slate-600 mb-4 leading-relaxed">
          Kunci API ini digunakan untuk memanggil model <code>gemini-1.5-flash</code> secara real-time saat pengguna meminta rekomendasi resep masakan.
        </p>

        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div>
            <label className="font-bold text-slate-700 block mb-1">Kunci API Gemini</label>
            <input
              type="password"
              value={apiKey}
              onChange={e => setApiKey(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full px-3 py-2.5 rounded-xl border border-slate-300 font-mono focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div className="p-3 rounded-xl bg-amber-50 border border-amber-100 text-amber-900 text-[11px] leading-relaxed">
            <p className="font-bold flex items-center gap-1 text-amber-800 mb-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              Catatan Demo:
            </p>
            Jika API key dikosongkan, sistem tetap berjalan normal menggunakan <em>Smart Curated Fallback Engine</em>, sehingga demo Anda saat video presentasi tetap dijamin 100% lancar!
          </div>

          <div className="flex items-center justify-between pt-2">
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noreferrer"
              className="text-orange-600 hover:underline flex items-center gap-1 font-semibold"
            >
              Dapatkan API Key Gratis <ExternalLink className="w-3 h-3" />
            </a>

            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold flex items-center gap-1.5 shadow-xs transition"
            >
              {isSaved ? <Check className="w-4 h-4 text-emerald-400" /> : null}
              <span>{isSaved ? 'Tersimpan!' : 'Simpan Kunci'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
