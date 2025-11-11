# Sistem Pelacakan Dokumen Perusahaan

Aplikasi web berbasis React untuk mengelola alur kerja verifikasi dan pembayaran dokumen internal perusahaan.

## Fitur Utama

- **Manajemen Dokumen**: Input dan pelacakan dokumen melalui berbagai tahap verifikasi
- **Role-Based Access Control**: Sistem peran dengan hak akses yang berbeda
- **Real-time Updates**: Dashboard yang update secara real-time
- **Deadline Tracking**: Sistem notifikasi untuk tenggat waktu
- **Audit Trail**: Riwayat lengkap perubahan status dokumen

## Peran Pengguna

1. **Staf Input (Ibu A)**: Input dokumen baru, lihat status pengajuan
2. **Verifikator Awal (Ibu B)**: Verifikasi dokumen, setujui/tolak
3. **Pembuat Dokumen**: Edit dokumen yang dikembalikan
4. **Kasubag Dokumen**: Review dan persetujuan dokumen
5. **Staf Perpajakan**: Input data pajak
6. **Kasubag Perpajakan**: Review data pajak
7. **Staf Akuntansi**: Input data akuntansi
8. **Kasubag Akuntansi**: Review data akuntansi
9. **Staf Pencairan**: Persiapkan data pencairan
10. **Kasubag Pencairan**: Persetujuan akhir
11. **Admin**: Monitor semua dokumen dan kelola sistem

## Tech Stack

- **Frontend**: React.js dengan TypeScript
- **State Management**: Context API
- **Database**: Firebase Firestore
- **Authentication**: Firebase Authentication
- **Styling**: Tailwind CSS
- **Backend Functions**: Firebase Cloud Functions
- **Routing**: React Router

## Instalasi

1. Clone repository
```bash
git clone <repository-url>
cd document-tracking-system
```

2. Install dependencies
```bash
npm install
```

3. Konfigurasi Firebase
- Buat project baru di Firebase Console
- Copy konfigurasi ke `src/firebase/config.ts`
- Setup Firestore dan Authentication

4. Jalankan development server
```bash
npm start
```

Aplikasi akan berjalan di http://localhost:3000

## Quick Login (Demo)

Untuk testing, gunakan akun demo berikut:

- **Ibu A (Staf Input)**: `ibu.a@example.com`
- **Ibu B (Verifikator Awal)**: `ibu.b@example.com`
- **Admin**: `admin@example.com`

Password: `password123`

## Struktur Proyek

```
src/
├── components/        # Komponen reusable
├── context/          # Context API untuk state management
├── firebase/         # Konfigurasi Firebase
├── pages/            # Halaman aplikasi
├── types/            # Type definitions
└── utils/            # Utility functions
```

## Alur Kerja

1. **Input**: Staf Input mengajukan dokumen baru
2. **Verifikasi Awal**: Verifikator Awal review kelengkapan dokumen
3. **Perbaikan**: Jika ditolak, Pembuat Dokumen memperbaiki
4. **Persetujuan Kasubag**: Kasubag Dokumen memberikan persetujuan
5. **Proses Perpajakan**: Staf Perpajakan input data pajak
6. **Proses Akuntansi**: Staf Akuntansi input data akuntansi
7. **Pencairan**: Staf Pencairan proses pembayaran
8. **Persetujuan Akhir**: Kasubag Pencairan memberikan persetujuan final

## Development

- **Build untuk production**: `npm run build`
- **Run tests**: `npm test`
- **Linting**: `npm run lint`

## Kontribusi

1. Fork repository
2. Buat branch feature (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## License

MIT License