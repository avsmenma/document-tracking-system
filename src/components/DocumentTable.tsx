import React from 'react';
import { Document } from '../types';

interface DocumentTableProps {
  documents: Document[];
  currentUserRole: string;
  onDocumentClick?: (document: Document) => void;
  onStatusUpdate?: (docId: string, newStatus: string, catatan?: string) => void;
}

const DocumentTable: React.FC<DocumentTableProps> = ({
  documents,
  currentUserRole,
  onDocumentClick,
  onStatusUpdate
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Menunggu Verifikasi (Ibu B)':
        return 'bg-yellow-100 text-yellow-800';
      case 'Menunggu Persetujuan (Kasubag Dokumen)':
        return 'bg-blue-100 text-blue-800';
      case 'Ditolak (Menunggu Perbaikan)':
        return 'bg-red-100 text-red-800';
      case 'Proses Perpajakan':
        return 'bg-purple-100 text-purple-800';
      case 'Proses Akuntansi':
        return 'bg-indigo-100 text-indigo-800';
      case 'Proses Pencairan':
        return 'bg-green-100 text-green-800';
      case 'Selesai Dibayar':
        return 'bg-emerald-100 text-emerald-800';
      case 'Ditolak Final':
        return 'bg-red-200 text-red-900';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getAvailableActions = (document: Document) => {
    const actions: { label: string; status: string }[] = [];

    switch (currentUserRole) {
      case 'Verifikator Awal':
        if (document.statusSaatIni === 'Menunggu Verifikasi (Ibu B)') {
          actions.push(
            { label: 'Setujui', status: 'Menunggu Persetujuan (Kasubag Dokumen)' },
            { label: 'Kembalikan', status: 'Ditolak (Menunggu Perbaikan)' }
          );
        }
        break;

      case 'Kasubag Dokumen':
        if (document.statusSaatIni === 'Menunggu Persetujuan (Kasubag Dokumen)') {
          actions.push(
            { label: 'Setujui', status: 'Proses Perpajakan' },
            { label: 'Kembalikan', status: 'Ditolak (Menunggu Perbaikan)' }
          );
        }
        break;

      case 'Staf Perpajakan':
        if (document.statusSaatIni === 'Proses Perpajakan') {
          actions.push(
            { label: 'Selesai Pajak', status: 'Menunggu Persetujuan (Kasubag Pajak)' }
          );
        }
        break;

      case 'Kasubag Perpajakan':
        if (document.statusSaatIni === 'Menunggu Persetujuan (Kasubag Pajak)') {
          actions.push(
            { label: 'Setujui', status: 'Proses Akuntansi' },
            { label: 'Kembalikan', status: 'Proses Perpajakan' }
          );
        }
        break;

      case 'Staf Akuntansi':
        if (document.statusSaatIni === 'Proses Akuntansi') {
          actions.push(
            { label: 'Selesai Akuntansi', status: 'Menunggu Persetujuan (Kasubag Akuntansi)' }
          );
        }
        break;

      case 'Kasubag Akuntansi':
        if (document.statusSaatIni === 'Menunggu Persetujuan (Kasubag Akuntansi)') {
          actions.push(
            { label: 'Setujui', status: 'Proses Pencairan' },
            { label: 'Kembalikan', status: 'Proses Akuntansi' }
          );
        }
        break;

      case 'Staf Pencairan':
        if (document.statusSaatIni === 'Proses Pencairan') {
          actions.push(
            { label: 'Selesai Dibayar', status: 'Selesai Dibayar' }
          );
        }
        break;
    }

    return actions;
  };

  const handleStatusUpdate = (docId: string, newStatus: string) => {
    const catatan = prompt('Masukkan catatan (opsional):');
    if (onStatusUpdate) {
      onStatusUpdate(docId, newStatus, catatan || undefined);
    }
  };

  if (documents.length === 0) {
    return (
      <div className="text-center py-8 bg-white rounded-lg shadow">
        <div className="text-gray-500">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">Tidak ada dokumen</h3>
          <p className="mt-1 text-sm text-gray-500">Belum ada dokumen yang tersedia.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      <ul className="divide-y divide-gray-200">
        {documents.map((document) => (
          <li key={document.docId}>
            <div className="px-4 py-4 sm:px-6 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-blue-600 truncate">
                      {document.nomorDokumen}
                    </p>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(document.statusSaatIni)}`}>
                      {document.statusSaatIni}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">SPP:</span> {document.nomorSPP}
                    </div>
                    <div>
                      <span className="font-medium">PO:</span> {document.po}
                    </div>
                    <div>
                      <span className="font-medium">PR:</span> {document.pr}
                    </div>
                    <div>
                      <span className="font-medium">Tujuan:</span> {document.tujuanPembayaran}
                    </div>
                    <div>
                      <span className="font-medium">Kategori:</span> {document.kategori}
                    </div>
                    <div>
                      <span className="font-medium">Nilai:</span> {formatCurrency(document.nilaiRupiah)}
                    </div>
                    <div className="md:col-span-3">
                      <span className="font-medium">Dibuat:</span> {formatDate(document.riwayatProses[0]?.timestamp || new Date())}
                      <span className="ml-4 font-medium">Oleh:</span> {document.riwayatProses[0]?.olehUser}
                    </div>
                  </div>

                  <div className="mt-3 flex items-center space-x-2">
                    <button
                      onClick={() => onDocumentClick?.(document)}
                      className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-xs leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Lihat Detail
                    </button>

                    {getAvailableActions(document).map((action) => (
                      <button
                        key={action.status}
                        onClick={() => handleStatusUpdate(document.docId, action.status)}
                        className={`inline-flex items-center px-3 py-1 border border-transparent text-xs leading-4 font-medium rounded-md text-white ${
                          action.label.includes('Kembalikan') || action.label.includes('Tolak')
                            ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
                            : 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
                        } focus:outline-none focus:ring-2 focus:ring-offset-2`}
                      >
                        {action.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DocumentTable;