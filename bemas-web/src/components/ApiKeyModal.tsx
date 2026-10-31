import React, { useState } from 'react';
import { X, Key, Check, ExternalLink, Sparkles, AlertCircle, CheckCircle2, RefreshCw } from 'lucide-react';
import { storage, STORAGE_KEYS } from '../services/storage';
import { validateGeminiApiKey } from '../services/gemini';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose }) => {
  const [apiKey, setApiKey] = useState(storage.getGeminiApiKey());
  const [isSaved, setIsSaved] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<{
    valid: boolean;
    message: string;
  } | null>(null);

  if (!isOpen) return null;

  const handleTestKey = async () => {
    setValidationResult(null);
    setIsValidating(true);
    try {
      const res = await validateGeminiApiKey(apiKey);
      setValidationResult(res);
    } catch (err) {
      setValidationResult({
        valid: false,
        message: err instanceof Error ? err.message : 'Gagal menghubungi server Google Gemini'
      });
    } finally {
      setIsValidating(false);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    storage.setGeminiApiKey(apiKey);
    // Hapus cache resep lama agar resep berikutnya langsung di-generate live dari API Gemini baru
    try {
      localStorage.removeItem(STORAGE_KEYS.RECIPE_CACHE);
    } catch {
      // ignore
    }
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
          className="absolute right-5 top-5 p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
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
            <div className="flex items-center justify-between mb-1">
              <label className="font-bold text-slate-700">Kunci API Gemini</label>
              <button
                type="button"
                onClick={handleTestKey}
                disabled={!apiKey.trim() || isValidating}
                className="text-[11px] text-[#FF5722] hover:text-[#E64A19] font-bold hover:underline disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 cursor-pointer"
              >
                {isValidating ? (
                  <>
                    <RefreshCw className="w-3 h-3 animate-spin" />
                    <span>Menguji...</span>
                  </>
                ) : (
                  <span>⚡ Uji Validitas Kunci</span>
                )}
              </button>
            </div>
            <input
              type="password"
              value={apiKey}
              onChange={e => {
                setApiKey(e.target.value);
                setValidationResult(null);
              }}
              placeholder="AIzaSy..."
              className="w-full px-3 py-2.5 rounded-xl border border-slate-300 font-mono focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {/* Validation Result Alert */}
          {validationResult && (
            <div
              className={`p-3 rounded-xl border flex items-start gap-2 text-[11px] leading-relaxed animate-in fade-in ${
                validationResult.valid
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : 'bg-red-50 border-red-200 text-red-800'
              }`}
            >
              {validationResult.valid ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <p className="font-bold mb-0.5">
                  {validationResult.valid ? 'Kunci API Valid & Aktif!' : 'Kunci API Gagal / Tidak Aktif'}
                </p>
                <p>{validationResult.message}</p>
              </div>
            </div>
          )}

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
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold flex items-center gap-1.5 shadow-xs transition cursor-pointer"
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
