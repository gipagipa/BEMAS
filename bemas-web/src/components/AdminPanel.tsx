import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  ShieldCheck, 
  MessageSquare, 
  CheckCircle, 
  MapPin, 
  Clock, 
  X,
  ExternalLink,
  Send,
  AlertCircle
} from 'lucide-react';
import { CulinaryPlace, UserReport } from '../types';
import { storage } from '../services/storage';

export const AdminPanel: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'places' | 'reports'>('places');
  const [places, setPlaces] = useState<CulinaryPlace[]>(storage.getPlaces());
  const [reports, setReports] = useState<UserReport[]>(storage.getReports());

  // Form State for Add / Edit Place
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPlaceId, setEditingPlaceId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Warung Makan' as CulinaryPlace['category'],
    address: '',
    lat: -1.1519,
    lng: 116.8617,
    operatingHours: '09:00 - 21:00 WITA',
    phone: '',
    featuredMenu: '',
    priceRange: 'Murah' as CulinaryPlace['priceRange'],
    imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80'
  });

  // Reply State for Reports
  const [replyingReport, setReplyingReport] = useState<UserReport | null>(null);
  const [adminReplyText, setAdminReplyText] = useState('');

  // Mini Map Picker Ref
  const pickerMapRef = useRef<HTMLDivElement>(null);
  const pickerMapInstance = useRef<L.Map | null>(null);
  const pickerMarker = useRef<L.Marker | null>(null);

  // Initialize or re-render map picker when modal opens
  useEffect(() => {
    if (isFormOpen) {
      setTimeout(() => {
        if (!pickerMapRef.current) return;
        if (pickerMapInstance.current) {
          pickerMapInstance.current.remove();
        }

        const map = L.map(pickerMapRef.current).setView([formData.lat, formData.lng], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap'
        }).addTo(map);

        const marker = L.marker([formData.lat, formData.lng], { draggable: true }).addTo(map);
        marker.bindPopup('Klik atau geser pin untuk tentukan koordinat lokasi kuliner').openPopup();

        marker.on('dragend', () => {
          const pos = marker.getLatLng();
          setFormData(prev => ({ ...prev, lat: Math.round(pos.lat * 10000) / 10000, lng: Math.round(pos.lng * 10000) / 10000 }));
        });

        map.on('click', (e) => {
          const { lat, lng } = e.latlng;
          marker.setLatLng([lat, lng]);
          setFormData(prev => ({ ...prev, lat: Math.round(lat * 10000) / 10000, lng: Math.round(lng * 10000) / 10000 }));
        });

        pickerMapInstance.current = map;
        pickerMarker.current = marker;
      }, 200);
    }
  }, [isFormOpen]);

  const handleOpenAdd = () => {
    setEditingPlaceId(null);
    setFormData({
      name: '',
      category: 'Warung Makan',
      address: '',
      lat: -1.1519,
      lng: 116.8617,
      operatingHours: '09:00 - 21:00 WITA',
      phone: '',
      featuredMenu: '',
      priceRange: 'Murah',
      imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80'
    });
    setIsFormOpen(true);
  };

  const handleOpenEdit = (place: CulinaryPlace) => {
    setEditingPlaceId(place.id);
    setFormData({
      name: place.name,
      category: place.category,
      address: place.address,
      lat: place.lat,
      lng: place.lng,
      operatingHours: place.operatingHours,
      phone: place.phone || '',
      featuredMenu: place.featuredMenu,
      priceRange: place.priceRange,
      imageUrl: place.imageUrl
    });
    setIsFormOpen(true);
  };

  const handleDelete = (place: CulinaryPlace) => {
    if (confirm(`Apakah Anda yakin ingin menghapus data tempat kuliner "${place.name}"?`)) {
      storage.deletePlace(place.id);
      setPlaces(storage.getPlaces());
    }
  };

  const handleSavePlace = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.address.trim()) {
      alert('Nama dan alamat tempat kuliner wajib diisi!');
      return;
    }

    const placeToSave: CulinaryPlace = {
      id: editingPlaceId || `place-${Date.now()}`,
      name: formData.name,
      category: formData.category,
      address: formData.address,
      lat: Number(formData.lat),
      lng: Number(formData.lng),
      operatingHours: formData.operatingHours,
      phone: formData.phone,
      featuredMenu: formData.featuredMenu || 'Menu Spesial',
      priceRange: formData.priceRange,
      imageUrl: formData.imageUrl,
      rating: 4.8,
      reviewsCount: 15,
      isVerified: true,
      menuList: [
        { id: 'm-1', name: formData.featuredMenu || 'Menu Utama', price: 20000, isPopular: true }
      ]
    };

    storage.savePlace(placeToSave);
    setPlaces(storage.getPlaces());
    setIsFormOpen(false);
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyingReport || !adminReplyText.trim()) return;

    storage.replyReport(replyingReport.id, adminReplyText);
    setReports(storage.getReports());
    setReplyingReport(null);
    setAdminReplyText('');
    alert('Tanggapan balasan berhasil dikirim dan status diperbarui menjadi Selesai!');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Bar */}
      <div className="bg-linear-to-r from-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold uppercase tracking-wider mb-2">
              <ShieldCheck className="w-4 h-4" />
              <span>Admin Control Center (UC-08, 09, 10, 11)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Dasbor Pengelola BEMAS
            </h1>
            <p className="text-xs text-slate-300 mt-1">
              Kelola master data lokasi kuliner di peta interaktif dan tangani laporan kendala pengguna.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveSubTab('places')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                activeSubTab === 'places'
                  ? 'bg-orange-500 text-white'
                  : 'bg-white/10 text-slate-300 hover:bg-white/20'
              }`}
            >
              Kelola Kuliner ({places.length})
            </button>
            <button
              onClick={() => setActiveSubTab('reports')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                activeSubTab === 'reports'
                  ? 'bg-orange-500 text-white'
                  : 'bg-white/10 text-slate-300 hover:bg-white/20'
              }`}
            >
              Laporan Kendala ({reports.filter(r => r.status === 'Pending').length} Baru)
            </button>
          </div>
        </div>
      </div>

      {/* SUB-TAB 1: PLACES MANAGEMENT */}
      {activeSubTab === 'places' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Daftar Tempat Kuliner Terdaftar</h2>
              <p className="text-xs text-slate-500">Data ini langsung terhubung dan muncul pada Peta GIS Pengguna.</p>
            </div>
            <button
              onClick={handleOpenAdd}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold transition shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Tempat Kuliner Baru (UC-08)</span>
            </button>
          </div>

          {/* Places Table / Grid */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3">Nama Usaha Kuliner</th>
                    <th className="px-4 py-3">Kategori</th>
                    <th className="px-4 py-3">Alamat & Jam Buka</th>
                    <th className="px-4 py-3">Koordinat (Lat, Lng)</th>
                    <th className="px-4 py-3">Menu Unggulan</th>
                    <th className="px-4 py-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {places.map(place => (
                    <tr key={place.id} className="hover:bg-slate-50/70 transition">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={place.imageUrl}
                            alt=""
                            className="w-10 h-10 rounded-lg object-cover shrink-0"
                          />
                          <div>
                            <div className="font-bold text-slate-900">{place.name}</div>
                            <div className="text-[11px] text-amber-600 font-semibold">★ {place.rating} ({place.reviewsCount} review)</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded-md font-bold bg-orange-50 text-orange-700">
                          {place.category}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-600 max-w-xs">
                        <div className="truncate">{place.address}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">{place.operatingHours}</div>
                      </td>
                      <td className="px-4 py-3 font-mono text-[11px] text-slate-500">
                        {place.lat.toFixed(4)}, {place.lng.toFixed(4)}
                      </td>
                      <td className="px-4 py-3 text-slate-700 font-medium">
                        {place.featuredMenu}
                      </td>
                      <td className="px-4 py-3 text-right space-x-1">
                        <button
                          onClick={() => handleOpenEdit(place)}
                          title="Sunting Data (UC-09)"
                          className="p-1.5 rounded-lg text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 transition"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(place)}
                          title="Hapus Data (UC-10)"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: REPORTS MANAGEMENT */}
      {activeSubTab === 'reports' && (
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Daftar Laporan Masalah / Bug Pengguna (UC-11)</h2>
            <p className="text-xs text-slate-500">Tinjau keluhan atau masukan dari pengguna dan berikan tanggapan balasan resmi.</p>
          </div>

          <div className="space-y-3">
            {reports.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 text-center text-slate-400 border border-slate-200">
                Belum ada laporan kendala dari pengguna.
              </div>
            ) : (
              reports.map(rep => (
                <div key={rep.id} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md ${
                        rep.status === 'Selesai' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {rep.status}
                      </span>
                      <span className="text-xs font-bold text-orange-600">{rep.category}</span>
                      <span className="text-xs text-slate-400">• Dari: {rep.userName} ({rep.userEmail})</span>
                    </div>

                    <span className="text-[11px] text-slate-400">
                      {new Date(rep.createdAt).toLocaleDateString('id-ID', { dateStyle: 'medium' })}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm">{rep.title}</h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                    "{rep.description}"
                  </p>

                  {rep.adminReply ? (
                    <div className="mt-3 p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs">
                      <p className="font-bold text-emerald-900 mb-0.5">Balasan Admin BEMAS:</p>
                      <p className="text-emerald-800">{rep.adminReply}</p>
                    </div>
                  ) : (
                    <div className="mt-3 flex justify-end">
                      <button
                        onClick={() => {
                          setReplyingReport(rep);
                          setAdminReplyText('');
                        }}
                        className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 transition"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        Balas & Selesaikan Laporan
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT PLACE (with interactive map coordinate picker) */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-bold text-slate-900 text-lg">
                {editingPlaceId ? 'Perbarui Data Kuliner (UC-09)' : 'Tambah Tempat Kuliner Baru (UC-08)'}
              </h3>
              <button
                onClick={() => setIsFormOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePlace} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Nama Tempat Usaha</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Contoh: RM Torani Km 15"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Kategori</label>
                  <select
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="Warung Makan">Warung Makan</option>
                    <option value="Cafe">Cafe</option>
                    <option value="Restoran">Restoran</option>
                    <option value="Bakso & Mie">Bakso & Mie</option>
                    <option value="Street Food">Street Food</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Alamat Lengkap</label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={e => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Jl. Soekarno Hatta No..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-orange-500"
                />
              </div>

              {/* Interactive Helper Map Coordinate Picker */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="font-bold text-slate-700 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-orange-500" />
                    Pilih Koordinat via Peta Pembantu (Klik / Geser Pin):
                  </label>
                  <span className="font-mono text-slate-500 font-semibold">
                    Lat: {formData.lat}, Lng: {formData.lng}
                  </span>
                </div>
                <div className="w-full h-44 rounded-xl border border-slate-200 overflow-hidden relative">
                  <div ref={pickerMapRef} className="w-full h-full" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Menu Unggulan</label>
                  <input
                    type="text"
                    value={formData.featuredMenu}
                    onChange={e => setFormData({ ...formData, featuredMenu: e.target.value })}
                    placeholder="Contoh: Kepiting Asap Saus Pedas"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Jam Operasional</label>
                  <input
                    type="text"
                    value={formData.operatingHours}
                    onChange={e => setFormData({ ...formData, operatingHours: e.target.value })}
                    placeholder="09:00 - 21:00 WITA"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold shadow-xs"
                >
                  Simpan Data Kuliner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: REPLY REPORT (UC-11) */}
      {replyingReport && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-bold text-slate-900 text-base">
                Kirim Balasan Resmi (UC-11)
              </h3>
              <button
                onClick={() => setReplyingReport(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-4 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200">
              <p className="font-bold text-slate-800">Laporan dari: {replyingReport.userName}</p>
              <p className="text-slate-600 mt-1 italic">"{replyingReport.description}"</p>
            </div>

            <form onSubmit={handleSendReply} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tulis Solusi / Tanggapan Admin:
                </label>
                <textarea
                  required
                  rows={4}
                  value={adminReplyText}
                  onChange={e => setAdminReplyText(e.target.value)}
                  placeholder="Terima kasih atas laporannya. Data jam operasional sudah kami perbaiki..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setReplyingReport(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  Kirim Balasan & Selesai
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
