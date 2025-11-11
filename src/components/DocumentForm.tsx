import React, { useState, useEffect } from 'react';
import { LocalStorageService } from '../services/localStorage';

interface DocumentFormData {
  nomorDokumen: string;
  bulan: string;
  tahun: string;
  nomorSPP: string;
  tanggalSPP: string;
  uraianSPP: string;
  pembayaranKe: string;
  po: string[];
  pr: string[];
  tujuanPembayaran: string;
  kategori: 'Investasi On Farm' | 'Investasi Off Farm' | 'Eksploitasi' | '';
  jenisDokumen: string;
  subJenisDokumen: string;
  nilaiRupiah: string;
}

type FormErrors = {
  [K in keyof DocumentFormData]?: string;
};

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
    tanggalSPP: '',
    uraianSPP: '',
    pembayaranKe: '',
    po: [''],
    pr: [''],
    tujuanPembayaran: '',
    kategori: '',
    jenisDokumen: '',
    subJenisDokumen: '',
    nilaiRupiah: ''
  });

  // Document type options based on category
  const jenisDokumenOptions = {
    'Eksploitasi': [
      'Pemeliharaan Tanaman Menghasilkan',
      'Pemupukan',
      'Aplikasi Pemupukan',
      'Panen & Pengumpulan',
      'Pengangkutan',
      'Pengolahan',
      'Pembelian Bahan Bakar Minyak (BBM)',
      'Biaya Pengiriman ke Pelabuhan',
      'Biaya Sewa Gudang',
      'Biaya Instalasi Pemompaan',
      'Biaya Pelabuhan',
      'Biaya Jasa KPBN',
      'Biaya Pemasaran Lainnya',
      'Biaya Pengangkutan, Perjalan & Penginapan',
      'Biaya Pemeliharaan Bangunan, Mesin, Jalan dan Instalasi',
      'Biaya Pemeliharaan Perlengkapan Kantor',
      'Biaya Pajak dan Retribusi',
      'Biaya Premi Asuransi',
      'Biaya Keamanan',
      'Biaya Mutu (ISO 9000)',
      'Biaya Pengendalian Lingkungan (ISO 14000)',
      'Biaya Sistem Manajemen Kesehatan & Keselamatan Kerja',
      'Biaya Penelitian dan Percobaan',
      'Biaya Sumbangan dan Iuran',
      'Biaya CSR',
      'Biaya Pendidikan dan Pengembangan SDM',
      'Biaya Konsultan',
      'Biaya Audit',
      'Utilities (Air, Listrik, ATK, Brg Umum, Sewa Kantor)',
      'Biaya Distrik',
      'Biaya Institusi Terkait',
      'Biaya Kantor Perwakilan',
      'Biaya Komisaris',
      'Biaya Media',
      'Biaya Rapat',
      'Biaya Telekomunikasi dan Ekspedisi',
      'Lainnya',
      'PPh Badan',
      'PBB',
      'PPH Masa',
      'PPN',
      'BPHTB',
      'PPh Pasal 22, Pasal 23, Pasal 4 ayat (2) & PPh Pasal 15',
      'Iuran BPJS B. Perusahaan',
      'SHT (PPD/Cicilan)',
      'Iuran Dapenbun (Normal)',
      'Iuran Dapenbun (Tambahan)',
      'Penghargaan Masa Kerja',
      'PPh pasal 21'
    ],
    'Investasi On Farm': [
      'Pekerjaan TU,TK,TB.',
      'Pemel TBM Pupuk',
      'Pemel TBM diluar Pupuk',
      'Pembangunan bibitan'
    ],
    'Investasi Off Farm': [
      'Pekerjaan Pembangunan Rumah',
      'Pekerjaan Pembangunan Perusahaan',
      'Pekerjaan Pembangunan Mesin dan Instalasi',
      'Pekerjaan Pembangunan Jalan,jembatan dan Saluran Air',
      'Pekerjaan Alat Angkutan',
      'Pekerjaan Inventaris kecil',
      'Pekerjaan Investasi Off Farm Lainnya'
    ]
  };

  // Auto-generate nomor dokumen saat component mount
  useEffect(() => {
    const nextNumber = LocalStorageService.getNextDocumentNumber();
    setFormData(prev => ({
      ...prev,
      nomorDokumen: nextNumber
    }));
  }, []);

  const [errors, setErrors] = useState<FormErrors>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    // Reset jenisDokumen when kategori changes
    if (name === 'kategori') {
      setFormData(prev => ({
        ...prev,
        kategori: value as DocumentFormData['kategori'],
        jenisDokumen: ''
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      } as DocumentFormData));
    }

    // Clear error when user starts typing
    if (errors[name as keyof DocumentFormData]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleArrayInputChange = (index: number, field: 'po' | 'pr', value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const addField = (field: 'po' | 'pr') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeField = (field: 'po' | 'pr', index: number) => {
    if (formData[field].length > 1) {
      setFormData(prev => ({
        ...prev,
        [field]: prev[field].filter((_, i) => i !== index)
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

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

    if (!formData.tanggalSPP.trim()) {
      newErrors.tanggalSPP = 'Tanggal SPP wajib diisi';
    }

    if (!formData.uraianSPP.trim()) {
      newErrors.uraianSPP = 'Uraian SPP wajib diisi';
    }

    if (!formData.pembayaranKe.trim()) {
      newErrors.pembayaranKe = 'Pembayaran ke wajib diisi';
    }

    if (!formData.tujuanPembayaran.trim()) {
      newErrors.tujuanPembayaran = 'Tujuan pembayaran wajib diisi';
    }

    if (!formData.kategori.trim()) {
      newErrors.kategori = 'Kategori wajib diisi';
    }

    if (!formData.jenisDokumen.trim()) {
      newErrors.jenisDokumen = 'Jenis dokumen wajib diisi';
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

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {/* SPP */}
            <div>
              <label htmlFor="nomorSPP" className="block text-sm font-medium text-gray-700">
                Nomor SPP *
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

            {/* Tanggal SPP */}
            <div>
              <label htmlFor="tanggalSPP" className="block text-sm font-medium text-gray-700">
                Tanggal SPP *
              </label>
              <input
                type="date"
                id="tanggalSPP"
                name="tanggalSPP"
                value={formData.tanggalSPP}
                onChange={handleInputChange}
                className={`mt-1 block w-full border ${
                  errors.tanggalSPP ? 'border-red-500' : 'border-gray-300'
                } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
              />
              {errors.tanggalSPP && (
                <p className="mt-1 text-sm text-red-600">{errors.tanggalSPP}</p>
              )}
            </div>
          </div>

          <div>
            {/* Uraian SPP */}
            <label htmlFor="uraianSPP" className="block text-sm font-medium text-gray-700">
              Uraian SPP *
            </label>
            <textarea
              id="uraianSPP"
              name="uraianSPP"
              rows={3}
              value={formData.uraianSPP}
              onChange={handleInputChange}
              className={`mt-1 block w-full border ${
                errors.uraianSPP ? 'border-red-500' : 'border-gray-300'
              } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
              placeholder="Uraian SPP"
            />
            {errors.uraianSPP && (
              <p className="mt-1 text-sm text-red-600">{errors.uraianSPP}</p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {/* Kategori */}
            <div>
              <label htmlFor="kategori" className="block text-sm font-medium text-gray-700">
                Kategori *
              </label>
              <select
                id="kategori"
                name="kategori"
                value={formData.kategori}
                onChange={handleInputChange}
                className={`mt-1 block w-full border ${
                  errors.kategori ? 'border-red-500' : 'border-gray-300'
                } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
              >
                <option value="">Pilih Kategori</option>
                <option value="Investasi On Farm">Investasi On Farm</option>
                <option value="Investasi Off Farm">Investasi Off Farm</option>
                <option value="Eksploitasi">Eksploitasi</option>
              </select>
              {errors.kategori && (
                <p className="mt-1 text-sm text-red-600">{errors.kategori}</p>
              )}
            </div>

            {/* Pembayaran Ke */}
            <div>
              <label htmlFor="pembayaranKe" className="block text-sm font-medium text-gray-700">
                Pembayaran Ke *
              </label>
              <input
                type="number"
                id="pembayaranKe"
                name="pembayaranKe"
                value={formData.pembayaranKe}
                onChange={handleInputChange}
                className={`mt-1 block w-full border ${
                  errors.pembayaranKe ? 'border-red-500' : 'border-gray-300'
                } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                placeholder="1"
                min="1"
              />
              {errors.pembayaranKe && (
                <p className="mt-1 text-sm text-red-600">{errors.pembayaranKe}</p>
              )}
            </div>
          </div>

          <div>
            {/* Tujuan Pembayaran */}
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

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
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
                disabled={!formData.kategori}
                className={`mt-1 block w-full border ${
                  errors.jenisDokumen ? 'border-red-500' : 'border-gray-300'
                } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                  !formData.kategori ? 'bg-gray-100 cursor-not-allowed' : ''
                }`}
              >
                <option value="">
                  {!formData.kategori ? 'Pilih kategori terlebih dahulu' : 'Pilih Jenis Dokumen'}
                </option>
                {formData.kategori && jenisDokumenOptions[formData.kategori]?.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              {errors.jenisDokumen && (
                <p className="mt-1 text-sm text-red-600">{errors.jenisDokumen}</p>
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

          {/* Dynamic PO Fields */}
          <div className="border-t pt-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              PO (Opsional)
            </label>
            {formData.po.map((po, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={po}
                  onChange={(e) => handleArrayInputChange(index, 'po', e.target.value)}
                  className="flex-1 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder={`Nomor PO ${index + 1}`}
                />
                <button
                  type="button"
                  onClick={() => addField('po')}
                  className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  +
                </button>
                {formData.po.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeField('po', index)}
                    className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    −
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Dynamic PR Fields */}
          <div className="border-t pt-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              PR (Opsional)
            </label>
            {formData.pr.map((pr, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={pr}
                  onChange={(e) => handleArrayInputChange(index, 'pr', e.target.value)}
                  className="flex-1 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder={`Nomor PR ${index + 1}`}
                />
                <button
                  type="button"
                  onClick={() => addField('pr')}
                  className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  +
                </button>
                {formData.pr.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeField('pr', index)}
                    className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    −
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={() => {
                const nextNumber = LocalStorageService.getNextDocumentNumber();
                setFormData({
                  nomorDokumen: nextNumber,
                  bulan: '',
                  tahun: '',
                  nomorSPP: '',
                  tanggalSPP: '',
                  uraianSPP: '',
                  pembayaranKe: '',
                  po: [''],
                  pr: [''],
                  tujuanPembayaran: '',
                  kategori: '',
                  jenisDokumen: '',
                  subJenisDokumen: '',
                  nilaiRupiah: ''
                });
                setErrors({});
              }}
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