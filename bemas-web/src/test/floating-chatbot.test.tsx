import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { FloatingChatbot } from '../components/FloatingChatbot';
import { getLocalAgentResponse, sendAgentMessage } from '../services/agentChat';

describe('Floating Action Button (FAB) & Dedicated Chat Window Tests', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  describe('1. Floating Action Button (FAB) Rendering & Toggle', () => {
    it('merender tombol FAB obrolan tetap (fixed) di layar dengan ikon obrolan', () => {
      render(<FloatingChatbot />);

      const fabBtn = screen.getByRole('button', { name: /Buka Chat Asisten BEMAS/i });
      expect(fabBtn).toBeInTheDocument();

      // Memastikan jendela chat overlay belum terbuka saat awal
      expect(
        screen.queryByRole('region', { name: /Jendela Chat Asisten AI BEMAS/i })
      ).not.toBeInTheDocument();
    });

    it('membuka panel overlay jendela chat saat FAB diklik', () => {
      render(<FloatingChatbot />);

      const fabBtn = screen.getByRole('button', { name: /Buka Chat Asisten BEMAS/i });
      fireEvent.click(fabBtn);

      // Jendela chat overlay muncul
      const chatWindow = screen.getByRole('region', { name: /Jendela Chat Asisten AI BEMAS/i });
      expect(chatWindow).toBeInTheDocument();

      // Memastikan properti overlay fixed dan z-index tinggi
      expect(chatWindow.className).toContain('fixed');
      expect(chatWindow.className).toContain('z-50');
    });
  });

  describe('2. Header Jendela Chat & Tombol Tutup', () => {
    it('menampilkan identitas agen Chef AI BEMAS dan tombol Tutup (X)', () => {
      render(<FloatingChatbot defaultOpen={true} />);

      // Identitas agen
      expect(screen.getByRole('heading', { name: /Chef AI BEMAS/i })).toBeInTheDocument();
      expect(screen.getByText(/Asisten Kuliner Pribadi • Siap Membantu/i)).toBeInTheDocument();

      // Tombol Tutup
      const closeBtn = screen.getByRole('button', { name: /Tutup Chat/i });
      expect(closeBtn).toBeInTheDocument();

      // Klik tombol tutup
      fireEvent.click(closeBtn);

      // Jendela chat tertutup
      expect(
        screen.queryByRole('region', { name: /Jendela Chat Asisten AI BEMAS/i })
      ).not.toBeInTheDocument();
    });
  });

  describe('3. Area Percakapan & Gelembung Pesan (Chat Bubbles)', () => {
    it('menampilkan riwayat pesan sambutan dan saran pertanyaan cepat', () => {
      render(
        <FloatingChatbot
          defaultOpen={true}
          currentUser={{
            id: 'u-1',
            name: 'Giva Asilah',
            email: 'giva@bemas.com',
            role: 'user',
            createdAt: '2026-10-31'
          }}
        />
      );

      // Pesan sambutan menyebut nama pengguna
      expect(screen.getByText(/Halo Giva Asilah!/i)).toBeInTheDocument();
      expect(screen.getByText(/asisten kuliner pribadi Anda/i)).toBeInTheDocument();

      // Tombol saran pertanyaan cepat
      expect(
        screen.getByRole('button', { name: /Ide resep dari bahan telur & tahu/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /Lebih hemat beli atau masak\?/i })
      ).toBeInTheDocument();
    });

    it('dapat mengirim pesan lewat klik saran pertanyaan dan menampilkan balasan koki', async () => {
      render(<FloatingChatbot defaultOpen={true} />);

      const suggestionBtn = screen.getByRole('button', {
        name: /Ide resep dari bahan telur & tahu/i
      });
      fireEvent.click(suggestionBtn);

      // Pesan user muncul di bubble obrolan
      await waitFor(() => {
        expect(
          screen.getAllByText(/Ide resep dari bahan telur & tahu/i).length
        ).toBeGreaterThanOrEqual(1);
      });

      // Balasan dari agen muncul
      await waitFor(() => {
        expect(
          screen.getByText(/Rekomendasi Resep Spesial/i)
        ).toBeInTheDocument();
      });
    });
  });

  describe('4. Area Input & Tombol Kirim', () => {
    it('terletak di bagian paling bawah dengan input teks dan tombol kirim', async () => {
      render(<FloatingChatbot defaultOpen={true} />);

      const input = screen.getByPlaceholderText(/Tanyakan resep, bahan, gizi, atau tips koki/i);
      const sendBtn = screen.getByRole('button', { name: /Kirim Pesan/i });

      expect(input).toBeInTheDocument();
      expect(sendBtn).toBeInTheDocument();
      // Tombol kirim non-aktif jika input kosong
      expect(sendBtn).toBeDisabled();

      // Ketik pesan
      fireEvent.change(input, {
        target: { value: 'Bagaimana tips menyimpan tahu agar tidak cepat asam?' }
      });
      expect(sendBtn).not.toBeDisabled();

      // Klik tombol Kirim
      fireEvent.click(sendBtn);

      // Input kembali bersih
      expect(input).toHaveValue('');

      // Pesan pertanyaan tampil dalam bubble
      expect(
        screen.getByText('Bagaimana tips menyimpan tahu agar tidak cepat asam?')
      ).toBeInTheDocument();

      // Jawaban agen muncul
      await waitFor(() => {
        expect(
          screen.getByText(/Tips Dapur Praktis dari Chef AI/i)
        ).toBeInTheDocument();
      });
    });

    it('mendukung pengiriman pesan dengan menekan tombol Enter pada keyboard', async () => {
      render(<FloatingChatbot defaultOpen={true} />);

      const input = screen.getByPlaceholderText(/Tanyakan resep, bahan, gizi, atau tips koki/i);

      fireEvent.change(input, {
        target: { value: 'beli atau masak' }
      });

      fireEvent.submit(input.closest('form')!);

      await waitFor(() => {
        expect(screen.getByText('beli atau masak')).toBeInTheDocument();
        expect(screen.getByText(/Analisis Dilema BEMAS/i)).toBeInTheDocument();
      });
    });
  });

  describe('5. Tombol Reset Percakapan', () => {
    it('mengembalikan riwayat percakapan ke kondisi awal saat tombol reset diklik', async () => {
      render(<FloatingChatbot defaultOpen={true} />);

      const input = screen.getByPlaceholderText(/Tanyakan resep, bahan, gizi, atau tips koki/i);
      fireEvent.change(input, { target: { value: 'Halo koki' } });
      fireEvent.submit(input.closest('form')!);

      await waitFor(() => {
        expect(screen.getByText('Halo koki')).toBeInTheDocument();
      });

      // Klik tombol reset obrolan
      const resetBtn = screen.getByRole('button', { name: /Mulai Ulang Obrolan/i });
      fireEvent.click(resetBtn);

      // Pesan user terhapus, hanya menyisakan pesan sambutan awal
      expect(screen.queryByText('Halo koki')).not.toBeInTheDocument();
      expect(screen.getByText(/asisten kuliner pribadi Anda/i)).toBeInTheDocument();
    });
  });

  describe('6. Layanan Agent Chat Unit Testing', () => {
    it('mengembalikan panduan kalori saat ditanya tentang kalori nasi goreng', () => {
      const response = getLocalAgentResponse('berapa kalori nasi goreng?');
      expect(response).toContain('Estimasi Nilai Gizi');
      expect(response).toContain('Nasi Goreng');
      expect(response).toContain('kkal');
    });

    it('mengembalikan pesan penolakan yang sopan jika prompt kosong', async () => {
      const response = await sendAgentMessage('   ');
      expect(response).toContain('Silakan ketik pertanyaan');
    });
  });
});
