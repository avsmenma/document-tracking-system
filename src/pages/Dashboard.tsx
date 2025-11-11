import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import DocumentForm from '../components/DocumentForm';
import DocumentTable from '../components/DocumentTable';
import { LocalStorageService } from '../services/localStorage';
import { Document } from '../types';

const Dashboard: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const [showDocumentForm, setShowDocumentForm] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [documents, setDocuments] = useState<Document[]>([]);

  // Helper function to get relevant statuses based on user role
  const getRelevantStatuses = (role?: string): string[] => {
    switch (role) {
      case 'Verifikator Awal':
        return ['Menunggu Verifikasi (Ibu B)'];
      case 'Kasubag Dokumen':
        return ['Menunggu Persetujuan (Kasubag Dokumen)'];
      case 'Staf Perpajakan':
        return ['Proses Perpajakan'];
      case 'Kasubag Perpajakan':
        return ['Menunggu Persetujuan (Kasubag Pajak)'];
      case 'Staf Akuntansi':
        return ['Proses Akuntansi'];
      case 'Kasubag Akuntansi':
        return ['Menunggu Persetujuan (Kasubag Akuntansi)'];
      case 'Staf Pencairan':
        return ['Proses Pencairan'];
      default:
        return [];
    }
  };

  // Load documents from localStorage
  useEffect(() => {
    const loadDocuments = () => {
      const allDocs = LocalStorageService.getDocuments();

      // Filter documents based on user role
      let filteredDocs: Document[] = [];

      if (currentUser?.peran === 'Admin') {
        // Admin can see all documents
        filteredDocs = allDocs;
      } else if (currentUser?.peran === 'Staf Input') {
        // Staf Input can only see their own documents
        filteredDocs = LocalStorageService.getDocumentsByCreator(currentUser.nama);
      } else {
        // Other roles can see documents relevant to their workflow
        const relevantStatuses = getRelevantStatuses(currentUser?.peran);
        filteredDocs = allDocs.filter(doc => relevantStatuses.includes(doc.statusSaatIni));
      }

      // Sort by creation date (newest first)
      filteredDocs.sort((a, b) =>
        new Date(b.riwayatProses[0]?.timestamp || 0).getTime() -
        new Date(a.riwayatProses[0]?.timestamp || 0).getTime()
      );

      setDocuments(filteredDocs);
    };

    loadDocuments();
  }, [currentUser]);

  const handleDocumentSubmit = async (formData: any) => {
    setFormLoading(true);
    try {
      console.log('Submitting document:', formData);

      // Create document object for localStorage
      const documentData = {
        nomorDokumen: formData.nomorDokumen,
        bulan: formData.bulan,
        tahun: formData.tahun,
        nomorSPP: formData.nomorSPP,
        po: formData.po,
        pr: formData.pr,
        tujuanPembayaran: formData.tujuanPembayaran,
        kategori: formData.kategori,
        jenisDokumen: formData.jenisDokumen,
        subJenisDokumen: formData.subJenisDokumen,
        nilaiRupiah: Number(formData.nilaiRupiah),
        tanggalInput: new Date(),
        statusSaatIni: 'Menunggu Verifikasi (Ibu B)' as any,
        pembuatDokumen: currentUser?.nama || 'Unknown',
        riwayatProses: [{
          timestamp: new Date(),
          status: 'Dibuat',
          olehUser: currentUser?.nama || 'Unknown',
          catatan: 'Dokumen dibuat oleh Staf Input'
        }],
        isLocked: false
      };

      // Save to localStorage
      LocalStorageService.addDocument(documentData);

      // Refresh documents list
      const allDocs = LocalStorageService.getDocuments();
      let filteredDocs: Document[] = [];

      if (currentUser?.peran === 'Admin') {
        filteredDocs = allDocs;
      } else if (currentUser?.peran === 'Staf Input') {
        filteredDocs = LocalStorageService.getDocumentsByCreator(currentUser.nama);
      } else {
        const relevantStatuses = getRelevantStatuses(currentUser?.peran);
        filteredDocs = allDocs.filter(doc => relevantStatuses.includes(doc.statusSaatIni));
      }

      filteredDocs.sort((a, b) =>
        new Date(b.riwayatProses[0]?.timestamp || 0).getTime() -
        new Date(a.riwayatProses[0]?.timestamp || 0).getTime()
      );

      setDocuments(filteredDocs);

      // Reset form and show success message
      setShowDocumentForm(false);
      alert('Dokumen berhasil disimpan!');
    } catch (error) {
      console.error('Error submitting document:', error);
      alert('Gagal menyimpan dokumen. Silakan coba lagi.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleStatusUpdate = (docId: string, newStatus: string, catatan?: string) => {
    try {
      const updated = LocalStorageService.updateDocumentStatus(
        docId,
        newStatus,
        catatan,
        currentUser?.nama
      );

      if (updated) {
        // Refresh documents list
        const allDocs = LocalStorageService.getDocuments();
        let filteredDocs: Document[] = [];

        if (currentUser?.peran === 'Admin') {
          filteredDocs = allDocs;
        } else if (currentUser?.peran === 'Staf Input') {
          filteredDocs = LocalStorageService.getDocumentsByCreator(currentUser.nama);
        } else {
          const relevantStatuses = getRelevantStatuses(currentUser?.peran);
          filteredDocs = allDocs.filter(doc => relevantStatuses.includes(doc.statusSaatIni));
        }

        filteredDocs.sort((a, b) =>
          new Date(b.riwayatProses[0]?.timestamp || 0).getTime() -
          new Date(a.riwayatProses[0]?.timestamp || 0).getTime()
        );

        setDocuments(filteredDocs);
        alert('Status dokumen berhasil diperbarui!');
      } else {
        alert('Gagal memperbarui status dokumen.');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Terjadi kesalahan saat memperbarui status.');
    }
  };

  const handleDocumentClick = (document: Document) => {
    // TODO: Implement document detail view
    console.log('Document clicked:', document);
    alert(`Detail dokumen ${document.nomorDokumen}\n\n` +
          `Status: ${document.statusSaatIni}\n` +
          `SPP: ${document.nomorSPP}\n` +
          `PO: ${document.po}\n` +
          `PR: ${document.pr}\n` +
          `Tujuan: ${document.tujuanPembayaran}\n` +
          `Nilai: Rp ${document.nilaiRupiah.toLocaleString('id-ID')}`);
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (!currentUser) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                Sistem Pelacakan Dokumen
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                {currentUser.nama} - {currentUser.peran}
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">

          {/* Document Form for Staf Input */}
          {currentUser.peran === 'Staf Input' && (
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Input Dokumen Baru</h2>
                <button
                  onClick={() => setShowDocumentForm(!showDocumentForm)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  {showDocumentForm ? 'Sembunyikan Form' : 'Tambah Dokumen'}
                </button>
              </div>

              {showDocumentForm && (
                <DocumentForm
                  onSubmit={handleDocumentSubmit}
                  loading={formLoading}
                />
              )}
            </div>
          )}

          {/* Dashboard Content */}
          <div className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg leading-6 font-medium text-gray-900">
                  Daftar Dokumen - {currentUser.peran}
                </h2>
                <div className="text-sm text-gray-600">
                  Total: {documents.length} dokumen
                </div>
              </div>

              {/* Documents Table */}
              <DocumentTable
                documents={documents}
                currentUserRole={currentUser.peran}
                onDocumentClick={handleDocumentClick}
                onStatusUpdate={handleStatusUpdate}
              />

              {/* Informasi status dashboard berdasarkan peran */}
              {documents.length === 0 && (
                <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                  <h4 className="text-lg font-semibold text-blue-900 mb-2">Fitur untuk {currentUser.peran}</h4>
                  <div className="text-left text-sm text-blue-800">
                    {currentUser.peran === 'Staf Input' && (
                      <div>
                        <p>✓ Input dokumen baru</p>
                        <p>✓ Lihat status dokumen yang diajukan</p>
                        <p>✓ Edit dokumen yang dikembalikan</p>
                      </div>
                    )}
                    {currentUser.peran === 'Verifikator Awal' && (
                      <div>
                        <p>✓ Verifikasi dokumen dari Staf Input</p>
                        <p>✓ Setujui atau tolak dokumen</p>
                        <p>✓ Monitoring status dokumen</p>
                      </div>
                    )}
                    {currentUser.peran === 'Admin' && (
                      <div>
                        <p>✓ Lihat semua dokumen</p>
                        <p>✓ Kelola user dan sistem</p>
                        <p>✓ Monitor seluruh alur kerja</p>
                        <p>✓ Export laporan</p>
                      </div>
                    )}
                    {currentUser.peran === 'Kasubag Dokumen' && (
                      <div>
                        <p>✓ Review dokumen dari Verifikator Awal</p>
                        <p>✓ Setujui atau kembalikan dokumen</p>
                        <p>✓ Monitor proses perpajakan</p>
                      </div>
                    )}
                    {currentUser.peran === 'Staf Perpajakan' && (
                      <div>
                        <p>✓ Proses perpajakan dokumen</p>
                        <p>✓ Input data pajak</p>
                        <p>✓ Monitor status perpajakan</p>
                      </div>
                    )}
                    {currentUser.peran === 'Kasubag Perpajakan' && (
                      <div>
                        <p>✓ Setujui proses perpajakan</p>
                        <p>✓ Review data pajak</p>
                        <p>✓ Monitor proses akuntansi</p>
                      </div>
                    )}
                    {currentUser.peran === 'Staf Akuntansi' && (
                      <div>
                        <p>✓ Proses akuntansi dokumen</p>
                        <p>✓ Input data akuntansi</p>
                        <p>✓ Monitor status akuntansi</p>
                      </div>
                    )}
                    {currentUser.peran === 'Kasubag Akuntansi' && (
                      <div>
                        <p>✓ Setujui proses akuntansi</p>
                        <p>✓ Review data akuntansi</p>
                        <p>✓ Monitor proses pencairan</p>
                      </div>
                    )}
                    {currentUser.peran === 'Staf Pencairan' && (
                      <div>
                        <p>✓ Proses pencairan dana</p>
                        <p>✓ Input bukti pembayaran</p>
                        <p>✓ Finalisasi pembayaran</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;