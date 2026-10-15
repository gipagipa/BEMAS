import { ChefHat } from 'lucide-react';


export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-slate-200 mt-16 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="space-y-1.5">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <div className="w-7 h-7 rounded-lg bg-orange-500 text-white flex items-center justify-center">
                <ChefHat className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-base tracking-tight text-slate-900">BEMAS</span>
              <span className="text-xs text-slate-400">| Beli atau Masak</span>
            </div>
            <p className="text-xs text-slate-500 max-w-md">
              Sistem Informasi Rekomendasi Olahan Makanan & Lokasi Kuliner Berbasis AI (Gemini) dan GIS (Leaflet OpenStreetMap).
            </p>
          </div>

          <div className="text-xs text-slate-500 space-y-1">
            <div className="font-semibold text-slate-700">Tugas Besar IPPL (Implementasi Perancangan Perangkat Lunak)</div>
            <div>Institut Teknologi Kalimantan (ITK) • Balikpapan</div>
            <div className="text-orange-600 font-bold">Giva Asilah Hasna’a Putri (11241034)</div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
          <div>
            &copy; 2026 BEMAS Project. Memenuhi spesifikasi SRS & SDD (11 Use Cases).
          </div>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-600 cursor-pointer">SRS Document v1.0</span>
            <span>•</span>
            <span className="hover:text-slate-600 cursor-pointer">SDD Architecture</span>
            <span>•</span>
            <span className="hover:text-slate-600 cursor-pointer">Leaflet GIS & Gemini AI</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
