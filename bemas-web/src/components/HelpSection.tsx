import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, MessageSquarePlus, Sparkles, MapPin, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { User } from '../types';
import { storage } from '../services/storage';

interface HelpSectionProps {
  currentUser: User | null;
  onOpenReportModal: () => void;
}

export const HelpSection: React.FC<HelpSectionProps> = ({ currentUser, onOpenReportModal }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Bagaimana cara kerja Rekomendasi Resep AI di BEMAS?',
      a: 'BEMAS mengintegrasikan model Google Gemini 1.5 Flash. Pengguna cukup memasukkan daftar bahan yang dimiliki atau mengambil foto bahan di kulkas. AI akan memproses teks atau gambar tersebut untuk meracik resep masakan rumahan yang lezat, takaran bahan terperinci, waktu memasak, dan langkah pembuatan step-by-step.'
    },
    {
      q: 'Bagaimana AI mendeteksi foto bahan dan memperkirakan sisa ketahanannya?',
      a: 'Melalui fitur Multimodal Vision AI, Gemini menganalisis visual foto bahan makanan, mengidentifikasi jenis bahan dan tingkat kematangannya, lalu mencocokkannya dengan basis data masa simpan pangan (shelf-life). Sistem juga memberikan saran prioritas bahan mana yang harus segera dimasak untuk mencegah pembusukan (food waste).'
    },
    {
      q: 'Apakah Peta GIS Kuliner memerlukan izin lokasi (GPS)?',
      a: 'Ya, disarankan mengaktifkan izin GPS pada peramban agar sistem dapat menghitung radius dan jarak terdekat ke warung makan. Jika GPS dimatikan, sistem akan menggunakan titik koordinat standar kota Balikpapan (area kampus ITK).'
    },
    {
      q: 'Apa yang harus dilakukan jika menemukan titik lokasi atau jam buka kuliner yang salah?',
      a: 'Pengguna dapat mengirimkan laporan perbaikan melalui tombol "Kirim Laporan / Bug" di halaman ini. Laporan akan langsung diteruskan ke dasbor Administrator untuk diverifikasi dan diperbarui.'
    }
  ];

  return (
    <div className="space-y-6 pb-16">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs text-[#786C68] font-medium">
        <span>Beranda</span>
        <span className="text-[10px] text-[#786C68]">›</span>
        <span className="text-[#FF5722] font-semibold">Bantuan &amp; Panduan</span>
      </div>

      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F0E5E1] shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFEBE6] text-[#FF5722] text-xs font-bold mb-2">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Pusat Bantuan &amp; Panduan (UC-07)</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#1E1715]">
            Ada yang Bisa Kami Bantu?
          </h2>
          <p className="text-xs sm:text-sm text-[#786C68] mt-1">
            Pelajari cara memanfaatkan fitur AI BEMAS atau kirimkan laporan kendala teknis kepada tim admin.
          </p>
        </div>

        <button
          onClick={onOpenReportModal}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#FF5722] hover:bg-[#E64A19] text-white text-xs font-bold transition shadow-xs self-start md:self-center"
        >
          <MessageSquarePlus className="w-4 h-4" />
          <span>Kirim Laporan / Bug</span>
        </button>
      </div>

      {/* Quick Guide Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl p-6 border border-[#F0E5E1] shadow-2xs space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-[#FFEBE6] text-[#FF5722] flex items-center justify-center font-bold">
            🍳
          </div>
          <h3 className="font-extrabold text-[#1E1715] text-sm">1. Racik Resep dari Kulkas</h3>
          <p className="text-xs text-[#786C68] leading-relaxed">
            Ketik bahan yang kamu punya atau foto isi kulkasmu. AI akan merekomendasikan masakan rumahan anti ribet.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-[#F0E5E1] shadow-2xs space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-[#FFEBE6] text-[#FF5722] flex items-center justify-center font-bold">
            📍
          </div>
          <h3 className="font-extrabold text-[#1E1715] text-sm">2. Cari Kuliner Terdekat</h3>
          <p className="text-xs text-[#786C68] leading-relaxed">
            Kalau malas masak, buka peta GIS untuk menemukan tempat makan terdekat di Balikpapan beserta navigasinya.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-[#F0E5E1] shadow-2xs space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-[#FFEBE6] text-[#FF5722] flex items-center justify-center font-bold">
            🛡️
          </div>
          <h3 className="font-extrabold text-[#1E1715] text-sm">3. Tim Admin Tanggap</h3>
          <p className="text-xs text-[#786C68] leading-relaxed">
            Laporan bug atau usulan tempat kuliner baru ditinjau dan dikelola langsung oleh administrator BEMAS.
          </p>
        </div>
      </div>

      {/* FAQ Accordions */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F0E5E1] shadow-2xs space-y-4">
        <h3 className="font-extrabold text-[#1E1715] text-base mb-4">
          Pertanyaan yang Sering Diajukan (FAQ)
        </h3>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div 
                key={idx}
                className="border border-[#F0E5E1] rounded-2xl overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 font-bold text-xs sm:text-sm text-[#1E1715] hover:bg-[#FFF8F6] transition-colors"
                >
                  <span>{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-[#FF5722] shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#786C68] shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <div className="px-5 pb-4 text-xs text-[#786C68] leading-relaxed border-t border-[#F0E5E1] pt-3 bg-[#FFF8F6]/50">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
