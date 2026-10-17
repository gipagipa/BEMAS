import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  storage,
  hashPassword,
  verifyPassword,
  generateJwtToken,
  verifyJwtToken,
  isValidEmail,
  sanitizeText,
  DEFAULT_USERS,
  DEFAULT_DEMO_PASSWORD,
  LOCKOUT_DURATION_MS
} from '../services/storage';

describe('SDD & TDD Suite 1: Manajemen Akun & Keamanan (FR-01 / UC-01 & FR-02 / UC-02)', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.useRealTimers();
  });

  describe('NFR-03 & Sanitasi Input: Password Hashing & XSS Prevention', () => {
    it('harus mengenkripsi kata sandi secara satu arah (tidak menyimpan plaintext)', () => {
      const raw = 'RahasiaDapur123!';
      const hashed = hashPassword(raw, 'salt_test');

      expect(hashed).not.toBe(raw);
      expect(hashed.startsWith('$2b$10$salt_test$')).toBe(true);
      expect(verifyPassword(raw, hashed)).toBe(true);
      expect(verifyPassword('SalahPassword123', hashed)).toBe(false);
    });

    it('harus menolak verifikasi pada format hash yang rusak atau kosong', () => {
      expect(verifyPassword('', '')).toBe(false);
      expect(verifyPassword('Password123!', 'bukan-format-hash')).toBe(false);
      expect(verifyPassword('Password123!', '$2b$10$hanya_tiga_bagian')).toBe(false);
    });

    it('harus membersihkan tag HTML/XSS dari input teks pengguna', () => {
      const dirty = '  <script>alert("xss")</script>Giva   <b>Asilah</b>  ';
      expect(sanitizeText(dirty)).toBe('alert("xss")Giva Asilah');
    });

    it('harus memvalidasi format email secara ketat (UC-01 Langkah 4b)', () => {
      expect(isValidEmail('giva@student.itk.ac.id')).toBe(true);
      expect(isValidEmail('user.name+tag@bemas.id')).toBe(true);

      // Edge cases format email salah
      expect(isValidEmail('')).toBe(false);
      expect(isValidEmail('bukan-email')).toBe(false);
      expect(isValidEmail('user@')).toBe(false);
      expect(isValidEmail('@bemas.id')).toBe(false);
      expect(isValidEmail('user@domain')).toBe(false);
      expect(isValidEmail('user..double@bemas.id')).toBe(false);
    });
  });

  describe('FR-01 / UC-01: Registrasi Akun Baru', () => {
    it('Normal Flow: berhasil mendaftarkan akun baru yang valid dan mengenkripsi password', () => {
      const res = storage.registerUser({
        name: 'Budi Santoso',
        email: 'Budi.Santoso@Example.com ',
        password: 'PasswordAman123',
        confirmPassword: 'PasswordAman123',
        agreeTerms: true
      });

      expect(res.success).toBe(true);
      expect(res.user).toBeDefined();
      expect(res.user?.name).toBe('Budi Santoso');
      expect(res.user?.email).toBe('budi.santoso@example.com');
      expect((res.user as unknown as Record<string, unknown>).passwordHash).toBeUndefined();

      // Pastikan tersimpan terenkripsi di basis data localStorage
      const storedUsers = storage.getStoredUsers();
      const saved = storedUsers.find(u => u.email === 'budi.santoso@example.com');
      expect(saved).toBeDefined();
      expect(saved?.passwordHash).not.toBe('PasswordAman123');
      expect(verifyPassword('PasswordAman123', saved!.passwordHash)).toBe(true);

      // Pastikan registrasi tidak langsung meloginkan sesi tanpa melewati halaman Login (UC-01 Langkah 6)
      expect(storage.getCurrentUser()).toBeNull();
    });

    it('Exceptional Flow 4a: menolak pendaftaran jika email sudah terdaftar (case-insensitive)', () => {
      const res = storage.registerUser({
        name: 'Giva Duplikat',
        email: 'GIVA@STUDENT.ITK.AC.ID',
        password: 'PasswordBaru123',
        confirmPassword: 'PasswordBaru123',
        agreeTerms: true
      });

      expect(res.success).toBe(false);
      expect(res.error).toBe('Email sudah digunakan');
    });

    it('Exceptional Flow 4b: menolak pendaftaran jika format email salah atau password < 8 karakter', () => {
      const badEmail = storage.registerUser({
        name: 'User Test',
        email: 'email-tidak-valid',
        password: 'Password123',
        confirmPassword: 'Password123'
      });
      expect(badEmail.success).toBe(false);
      expect(badEmail.error).toBe('Format email tidak valid');

      const shortPass = storage.registerUser({
        name: 'User Test',
        email: 'valid@example.com',
        password: '1234567',
        confirmPassword: '1234567'
      });
      expect(shortPass.success).toBe(false);
      expect(shortPass.error).toBe('Kata sandi terlalu pendek (minimal 8 karakter)');

      const spacePass = storage.registerUser({
        name: 'User Test',
        email: 'valid@example.com',
        password: '         ',
        confirmPassword: '         '
      });
      expect(spacePass.success).toBe(false);
      expect(spacePass.error).toBe('Kata sandi terlalu pendek (minimal 8 karakter)');
    });

    it('Edge Case: menolak pendaftaran jika nama kosong/hanya tag HTML, konfirmasi password beda, atau syarat tidak disetujui', () => {
      const emptyName = storage.registerUser({
        name: '<script></script> ',
        email: 'baru@example.com',
        password: 'Password123',
        confirmPassword: 'Password123'
      });
      expect(emptyName.success).toBe(false);
      expect(emptyName.error).toContain('Nama lengkap wajib diisi');

      const mismatch = storage.registerUser({
        name: 'User Baru',
        email: 'baru@example.com',
        password: 'Password123',
        confirmPassword: 'PasswordBeda123'
      });
      expect(mismatch.success).toBe(false);
      expect(mismatch.error).toBe('Konfirmasi kata sandi tidak cocok');

      const noTerms = storage.registerUser({
        name: 'User Baru',
        email: 'baru@example.com',
        password: 'Password123',
        confirmPassword: 'Password123',
        agreeTerms: false
      });
      expect(noTerms.success).toBe(false);
      expect(noTerms.error).toContain('Ketentuan Layanan');
    });
  });

  describe('FR-02 / UC-02, NFR-04 & NFR-05: Login Akun, Token JWT, & Proteksi Brute-Force', () => {
    it('Normal Flow: berhasil login dengan kredensial valid dan membuat sesi JWT (NFR-04)', () => {
      const loginRes = storage.authenticateUser(DEFAULT_USERS[0].email, DEFAULT_DEMO_PASSWORD);

      expect(loginRes.success).toBe(true);
      expect(loginRes.user?.email).toBe(DEFAULT_USERS[0].email);
      expect(loginRes.token).toBeDefined();

      const jwtCheck = verifyJwtToken(loginRes.token!);
      expect(jwtCheck.valid).toBe(true);
      expect(jwtCheck.payload?.sub).toBe(DEFAULT_USERS[0].id);

      expect(storage.getCurrentUser()?.id).toBe(DEFAULT_USERS[0].id);
    });

    it('Exceptional Flow 4a: menolak login jika password salah atau email belum terdaftar', () => {
      const wrongPass = storage.authenticateUser(DEFAULT_USERS[0].email, 'PasswordSalah999');
      expect(wrongPass.success).toBe(false);
      expect(wrongPass.error).toBe('Email atau password salah');
      expect(wrongPass.remainingAttempts).toBe(4);

      const unknownEmail = storage.authenticateUser('tidakada@bemas.id', DEFAULT_DEMO_PASSWORD);
      expect(unknownEmail.success).toBe(false);
      expect(unknownEmail.error).toBe('Email atau password salah');
    });

    it('NFR-05: memblokir akun sementara setelah 5 kali percobaan login gagal berturut-turut', () => {
      vi.useFakeTimers();
      const targetEmail = DEFAULT_USERS[0].email;

      for (let i = 1; i <= 4; i++) {
        const res = storage.authenticateUser(targetEmail, `SalahKe-${i}`);
        expect(res.success).toBe(false);
        expect(res.error).toBe('Email atau password salah');
        expect(res.remainingAttempts).toBe(5 - i);
      }

      // Percobaan gagal ke-5 -> Memicu pemblokiran akun sementara
      const fifthAttempt = storage.authenticateUser(targetEmail, 'SalahKe-5');
      expect(fifthAttempt.success).toBe(false);
      expect(fifthAttempt.remainingAttempts).toBe(0);
      expect(fifthAttempt.lockedUntil).toBeDefined();
      expect(fifthAttempt.error).toContain('Akun diblokir sementara');

      // Edge Case: Meskipun memasukkan password yang BENAR saat masa blokir, tetap harus ditolak!
      const attemptDuringLockout = storage.authenticateUser(targetEmail, DEFAULT_DEMO_PASSWORD);
      expect(attemptDuringLockout.success).toBe(false);
      expect(attemptDuringLockout.error).toContain('Akun diblokir sementara');

      // Setelah masa blokir 15 menit berakhir, pengguna dapat login kembali dengan password benar
      vi.advanceTimersByTime(LOCKOUT_DURATION_MS + 1000);
      const afterUnlock = storage.authenticateUser(targetEmail, DEFAULT_DEMO_PASSWORD);
      expect(afterUnlock.success).toBe(true);
      expect(afterUnlock.user?.email).toBe(targetEmail);
    });

    it('Edge Case Sesi & Token: mencegah kebocoran sesi jika token kadaluarsa atau dimanipulasi', () => {
      // Pastikan state awal bersih tanpa auto-login tersembunyi
      expect(storage.getCurrentUser()).toBeNull();

      // Buat token yang sudah kadaluarsa (-1000ms)
      const expiredToken = generateJwtToken(DEFAULT_USERS[0], -1000);
      storage.setCurrentUser(DEFAULT_USERS[0], expiredToken);

      expect(verifyJwtToken(expiredToken).valid).toBe(false);
      expect(storage.getCurrentUser()).toBeNull();

      // Buat token yang dimanipulasi signature-nya
      const validToken = generateJwtToken(DEFAULT_USERS[0], 60000);
      const tamperedToken = `${validToken}tampered`;
      storage.setCurrentUser(DEFAULT_USERS[0], tamperedToken);

      expect(storage.getCurrentUser()).toBeNull();
    });
  });
});
