export interface User {
  uid: string;
  email: string;
  nama: string;
  peran: UserRole;
  departemen: string;
}

export type UserRole =
  | 'Staf Input'
  | 'Verifikator Awal'
  | 'Pembuat Dokumen'
  | 'Kasubag Dokumen'
  | 'Staf Perpajakan'
  | 'Kasubag Perpajakan'
  | 'Staf Akuntansi'
  | 'Kasubag Akuntansi'
  | 'Staf Pencairan'
  | 'Kasubag Pencairan'
  | 'Admin';

export interface Document {
  docId: string;
  nomorDokumen: string;
  bulan: string;
  tahun: string;
  nomorSPP: string;
  po: string;
  pr: string;
  tujuanPembayaran: string;
  kategori: string;
  jenisDokumen: 'Investasi' | 'Eksploitasi';
  subJenisDokumen: string;
  nilaiRupiah: number;
  statusSaatIni: DocumentStatus;
  pembuatDokumen: string;
  riwayatProses: ProcessHistory[];
  dataPajak?: TaxData;
  dataAkuntansi?: AccountingData;
  dataPencairan?: DisbursementData;
  tenggatWaktu?: Date;
  isLocked: boolean;
}

export type DocumentStatus =
  | 'Menunggu Verifikasi (Ibu B)'
  | 'Menunggu Persetujuan (Kasubag Dokumen)'
  | 'Ditolak (Menunggu Perbaikan)'
  | 'Proses Perpajakan'
  | 'Menunggu Persetujuan (Kasubag Pajak)'
  | 'Proses Akuntansi'
  | 'Menunggu Persetujuan (Kasubag Akuntansi)'
  | 'Proses Pencairan'
  | 'Selesai Dibayar'
  | 'Ditolak Final';

export interface ProcessHistory {
  timestamp: Date;
  status: string;
  olehUser: string;
  catatan?: string;
}

export interface TaxData {
  noPO: string;
  noFaktur: string;
  tanggalFaktur: Date;
  jenisPPh: string;
  dppPPh: number;
  pphTerhutang: number;
  tanggalMasuk?: Date;
}

export interface AccountingData {
  noMiro: string;
}

export interface DisbursementData {
  statusPersetujuanAkhir: 'Pending' | 'Iya' | 'Tidak';
  tanggalBayar?: Date;
  buktiPembayaran?: string;
}

export interface Rejection {
  rejectionId: string;
  docIdRef: string;
  tanggalTolak: Date;
  ditolakOleh: string;
  dikembalikanKe: string;
  alasan: string;
  jumlahLembar: number;
  estimasiHariPerbaikan: number;
  statusPerbaikan: 'Pending' | 'Selesai Diperbaiki';
}