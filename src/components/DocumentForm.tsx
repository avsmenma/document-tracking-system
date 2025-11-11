import React, { useState, useEffect } from 'react';
import { LocalStorageService } from '../services/localStorage';

interface DocumentFormData {
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
  nilaiRupiah: string;
}

interface DocumentFormProps {
  onSubmit: (data: DocumentFormData) => void;
  loading?: boolean;
}

const DocumentForm: React.FC<DocumentFormProps> = ({ onSubmit, loading = false }) => {
  const [formData, setFormData] = useState<DocumentFormData>({
    nomorDokumen: '0001',
    bulan: '',
    tahun: '',
    nomorSPP: '',
    po: '',
    pr: '',
    tujuanPembayaran: '',
    kategori: '',
    jenisDokumen: 'Investasi',
    subJenisDokumen: '',
    nilaiRupiah: ''
  });

  // Auto-generate nomor dokumen saat component mount
  useEffect(() => {
    const nextNumber = LocalStorageService.getNextDocumentNumber();
    setFormData(prev => ({
      ...prev,
      nomorDokumen: nextNumber
    }));
  }, []);

  const [errors, setErrors] = useState<Partial<DocumentFormData>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name as keyof DocumentFormData]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<DocumentFormData> = {};

    if (!formData.nomorDokumen.trim()) {
      newErrors.nomorDokumen = 'Nomor dokumen wajib diisi';
    }

    if (!formData.bulan.trim()) {
      newErrors.bulan = 'Bulan wajib diisi';
    }

    if (!formData.tahun.trim()) {
      newErrors.tahun = 'Tahun wajib diisi';
    }

    if (!formData.nomorSPP.trim()) {
      newErrors.nomorSPP = 'Nomor SPP wajib diisi';
    }

    if (!formData.po.trim()) {
      newErrors.po = 'Nomor PO wajib diisi';
    }

    if (!formData.pr.trim()) {
      newErrors.pr = 'Nomor PR wajib diisi';
    }

    if (!formData.tujuanPembayaran.trim()) {
      newErrors.tujuanPembayaran = 'Tujuan pembayaran wajib diisi';
    }

    if (!formData.kategori.trim()) {
      newErrors.kategori = 'Kategori wajib diisi';
    }

    if (!formData.subJenisDokumen.trim()) {
      newErrors.subJenisDokumen = 'Sub jenis dokumen wajib diisi';
    }

    if (!formData.nilaiRupiah.trim() || isNaN(Number(formData.nilaiRupiah))) {
      newErrors.nilaiRupiah = 'Nilai rupiah harus berupa angka yang valid';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <div className="bg-white shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
          Input Dokumen Baru
        </h3>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {/* Nomor Dokumen */}
            <div>
              <label htmlFor="nomorDokumen" className="block text-sm font-medium text-gray-700">
                Nomor Dokumen *
              </label>
              <input
                type="text"
                id="nomorDokumen"
                name="nomorDokumen"
                value={formData.nomorDokumen}
                onChange={handleInputChange}
                readOnly
                className={`mt-1 block w-full border ${
                  errors.nomorDokumen ? 'border-red-500' : 'border-gray-300'
                } rounded-md shadow-sm py-2 px-3 bg-gray-50 text-gray-700 sm:text-sm`}
                placeholder="Auto-generated"
              />
              {errors.nomorDokumen && (
                <p className="mt-1 text-sm text-red-600">{errors.nomorDokumen}</p>
              )}
            </div>

            {/* Bulan */}
            <div>
              <label htmlFor="bulan" className="block text-sm font-medium text-gray-700">
                Bulan *
              </label>
              <select
                id="bulan"
                name="bulan"
                value={formData.bulan}
                onChange={handleInputChange}
                className={`mt-1 block w-full border ${
                  errors.bulan ? 'border-red-500' : 'border-gray-300'
                } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
              >
                <option value="">Pilih Bulan</option>
                <option value="01">Januari</option>
                <option value="02">Februari</option>
                <option value="03">Maret</option>
                <option value="04">April</option>
                <option value="05">Mei</option>
                <option value="06">Juni</option>
                <option value="07">Juli</option>
                <option value="08">Agustus</option>
                <option value="09">September</option>
                <option value="10">Oktober</option>
                <option value="11">November</option>
                <option value="12">Desember</option>
              </select>
              {errors.bulan && (
                <p className="mt-1 text-sm text-red-600">{errors.bulan}</p>
              )}
            </div>

            {/* Tahun */}
            <div>
              <label htmlFor="tahun" className="block text-sm font-medium text-gray-700">
                Tahun *
              </label>
              <input
                type="number"
                id="tahun"
                name="tahun"
                value={formData.tahun}
                onChange={handleInputChange}
                className={`mt-1 block w-full border ${
                  errors.tahun ? 'border-red-500' : 'border-gray-300'
                } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                placeholder="Contoh: 2025"
              />
              {errors.tahun && (
                <p className="mt-1 text-sm text-red-600">{errors.tahun}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {/* PO */}
            <div>
              <label htmlFor="po" className="block text-sm font-medium text-gray-700">
                PO *
              </label>
              <input
                type="text"
                id="po"
                name="po"
                value={formData.po}
                onChange={handleInputChange}
                className={`mt-1 block w-full border ${
                  errors.po ? 'border-red-500' : 'border-gray-300'
                } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                placeholder="Nomor PO"
              />
              {errors.po && (
                <p className="mt-1 text-sm text-red-600">{errors.po}</p>
              )}
            </div>

            {/* PR */}
            <div>
              <label htmlFor="pr" className="block text-sm font-medium text-gray-700">
                PR *
              </label>
              <input
                type="text"
                id="pr"
                name="pr"
                value={formData.pr}
                onChange={handleInputChange}
                className={`mt-1 block w-full border ${
                  errors.pr ? 'border-red-500' : 'border-gray-300'
                } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                placeholder="Nomor PR"
              />
              {errors.pr && (
                <p className="mt-1 text-sm text-red-600">{errors.pr}</p>
              )}
            </div>

            {/* SPP */}
            <div>
              <label htmlFor="nomorSPP" className="block text-sm font-medium text-gray-700">
                SPP *
              </label>
              <input
                type="text"
                id="nomorSPP"
                name="nomorSPP"
                value={formData.nomorSPP}
                onChange={handleInputChange}
                className={`mt-1 block w-full border ${
                  errors.nomorSPP ? 'border-red-500' : 'border-gray-300'
                } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                placeholder="Nomor SPP"
              />
              {errors.nomorSPP && (
                <p className="mt-1 text-sm text-red-600">{errors.nomorSPP}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {/* Tujuan Pembayaran */}
            <div>
              <label htmlFor="tujuanPembayaran" className="block text-sm font-medium text-gray-700">
                Tujuan Pembayaran *
              </label>
              <input
                type="text"
                id="tujuanPembayaran"
                name="tujuanPembayaran"
                value={formData.tujuanPembayaran}
                onChange={handleInputChange}
                className={`mt-1 block w-full border ${
                  errors.tujuanPembayaran ? 'border-red-500' : 'border-gray-300'
                } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                placeholder="Tujuan pembayaran"
              />
              {errors.tujuanPembayaran && (
                <p className="mt-1 text-sm text-red-600">{errors.tujuanPembayaran}</p>
              )}
            </div>

            {/* Kategori */}
            <div>
              <label htmlFor="kategori" className="block text-sm font-medium text-gray-700">
                Kategori *
              </label>
              <input
                type="text"
                id="kategori"
                name="kategori"
                value={formData.kategori}
                onChange={handleInputChange}
                className={`mt-1 block w-full border ${
                  errors.kategori ? 'border-red-500' : 'border-gray-300'
                } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                placeholder="Kategori"
              />
              {errors.kategori && (
                <p className="mt-1 text-sm text-red-600">{errors.kategori}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {/* Jenis Dokumen */}
            <div>
              <label htmlFor="jenisDokumen" className="block text-sm font-medium text-gray-700">
                Jenis Dokumen *
              </label>
              <select
                id="jenisDokumen"
                name="jenisDokumen"
                value={formData.jenisDokumen}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="">Pilih Jenis</option>
                <option value="Investasi">Investasi</option>
                <option value="Eksploitasi">Eksploitasi</option>
              </select>
            </div>

            {/* Sub Jenis Dokumen */}
            <div>
              <label htmlFor="subJenisDokumen" className="block text-sm font-medium text-gray-700">
                Sub Jenis Dokumen *
              </label>
              <select
                id="subJenisDokumen"
                name="subJenisDokumen"
                value={formData.subJenisDokumen}
                onChange={handleInputChange}
                className={`mt-1 block w-full border ${
                  errors.subJenisDokumen ? 'border-red-500' : 'border-gray-300'
                } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
              >
                <option value="">Pilih Sub Jenis</option>
                {formData.jenisDokumen === 'Investasi' ? (
                  <>
                    <option value="Investasi Barang">Investasi Barang</option>
                    <option value="Investasi Jasa">Investasi Jasa</option>
                    <option value="Investasi Tanah">Investasi Tanah</option>
                    <option value="Investasi Gedung">Investasi Gedung</option>
                  </>
                ) : formData.jenisDokumen === 'Eksploitasi' ? (
                  <>
                    <option value="Operasional">Operasional</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Raw Material">Raw Material</option>
                    <option value="Marketing">Marketing</option>
                  </>
                ) : null}
              </select>
              {errors.subJenisDokumen && (
                <p className="mt-1 text-sm text-red-600">{errors.subJenisDokumen}</p>
              )}
            </div>

            {/* Nilai Rupiah */}
            <div>
              <label htmlFor="nilaiRupiah" className="block text-sm font-medium text-gray-700">
                Nilai Rupiah *
              </label>
              <input
                type="number"
                id="nilaiRupiah"
                name="nilaiRupiah"
                value={formData.nilaiRupiah}
                onChange={handleInputChange}
                className={`mt-1 block w-full border ${
                  errors.nilaiRupiah ? 'border-red-500' : 'border-gray-300'
                } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                placeholder="Contoh: 10000000"
              />
              {errors.nilaiRupiah && (
                <p className="mt-1 text-sm text-red-600">{errors.nilaiRupiah}</p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={() => setFormData({
                nomorDokumen: '0001',
                bulan: '',
                tahun: '',
                nomorSPP: '',
                po: '',
                pr: '',
                tujuanPembayaran: '',
                kategori: '',
                jenisDokumen: 'Investasi',
                subJenisDokumen: '',
                nilaiRupiah: ''
              })}
            >
              Reset
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? 'Menyimpan...' : 'Simpan Dokumen'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DocumentForm;