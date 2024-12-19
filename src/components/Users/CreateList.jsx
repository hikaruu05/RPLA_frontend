import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import { FileText, Save, Edit, Trash2, Plus, Download, X } from 'lucide-react';

const AdminFormatLaporan = () => {
  const [laporan, setLaporan] = useState([]); // Menyimpan semua laporan
  const [selectedLaporan, setSelectedLaporan] = useState(null); // Indeks laporan yang dipilih untuk edit
  const [modalOpen, setModalOpen] = useState(false); // Status modal terbuka/tutup
  const [formData, setFormData] = useState({
    judul: '',
    tujuan: '',
    alatBahan: '',
    prosedur: '',
    hasil: '',
  });

  // Fungsi menangani input perubahan form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Fungsi membuat file PDF
  const generatePDF = (data) => {
    const doc = new jsPDF();
    doc.setTextColor(0, 0, 0); // Set teks menjadi hitam
    doc.setFontSize(14);
    doc.text('Laporan Praktikum', 105, 20, { align: 'center' });
    doc.setFontSize(12);

    // Menulis data laporan di PDF
    let y = 40; // Koordinat awal y
    doc.text(`Judul: ${data.judul}`, 10, y);
    doc.text(`Tujuan:`, 10, y + 10);
    doc.text(data.tujuan, 20, y + 20, { maxWidth: 170 });

    doc.text(`Alat/Bahan:`, 10, y + 40);
    doc.text(data.alatBahan, 20, y + 50, { maxWidth: 170 });

    doc.text(`Prosedur:`, 10, y + 70);
    doc.text(data.prosedur, 20, y + 80, { maxWidth: 170 });

    doc.text(`Hasil:`, 10, y + 100);
    doc.text(data.hasil, 20, y + 110, { maxWidth: 170 });

    doc.save(`${data.judul}.pdf`);
  };

  // Fungsi menyimpan laporan
  const handleSubmit = () => {
    if (selectedLaporan !== null) {
      // Edit laporan yang sudah ada
      const updatedLaporan = laporan.map((item, index) =>
        index === selectedLaporan ? { ...formData } : item
      );
      setLaporan(updatedLaporan);
    } else {
      // Tambahkan laporan baru
      setLaporan([...laporan, formData]);
    }

    // Reset form dan tutup modal
    setFormData({ judul: '', tujuan: '', alatBahan: '', prosedur: '', hasil: '' });
    setModalOpen(false);
    setSelectedLaporan(null);
  };

  // Fungsi hapus laporan
  const handleDelete = (index) => {
    const updatedLaporan = laporan.filter((_, i) => i !== index);
    setLaporan(updatedLaporan);
  };

  // Fungsi edit laporan
  const handleEdit = (index) => {
    setSelectedLaporan(index);
    setFormData(laporan[index]);
    setModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Card Utama */}
      <div className="bg-white shadow-lg rounded-md p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold flex items-center">
            <FileText className="mr-2" /> Laporan Praktikum
          </h1>
          <button
            onClick={() => {
              setModalOpen(true);
              setSelectedLaporan(null);
              setFormData({ judul: '', tujuan: '', alatBahan: '', prosedur: '', hasil: '' });
            }}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex items-center"
          >
            <Plus className="mr-2" /> Tambah Laporan
          </button>
        </div>

        {/* Tabel Riwayat Laporan */}
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 text-left">Judul</th>
              <th className="p-2 text-left">Tujuan</th>
              <th className="p-2 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {laporan.map((item, index) => (
              <tr key={index} className="border-b hover:bg-gray-50">
                <td className="p-2">{item.judul}</td>
                <td className="p-2">{item.tujuan}</td>
                <td className="p-2 flex justify-center space-x-2">
                  <button onClick={() => handleEdit(index)} className="text-blue-500 hover:text-blue-700">
                    <Edit />
                  </button>
                  <button onClick={() => handleDelete(index)} className="text-red-500 hover:text-red-700">
                    <Trash2 />
                  </button>
                  <button onClick={() => generatePDF(item)} className="text-green-500 hover:text-green-700">
                    <Download />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Input Form */}
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-md p-6 w-[500px] relative">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
            >
              <X />
            </button>
            <h2 className="text-xl font-bold mb-4">
              {selectedLaporan !== null ? 'Edit Laporan' : 'Tambah Laporan'}
            </h2>
            <div className="space-y-2">
              {['judul', 'tujuan', 'alatBahan', 'prosedur', 'hasil'].map((field) => (
                <textarea
                  key={field}
                  name={field}
                  value={formData[field]}
                  onChange={handleInputChange}
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                  className="w-full p-2 border rounded"
                />
              ))}
            </div>
            <div className="flex justify-end mt-4 space-x-2">
              <button onClick={() => setModalOpen(false)} className="px-4 py-2 bg-gray-300 rounded">
                Batal
              </button>
              <button onClick={handleSubmit} className="px-4 py-2 bg-blue-500 text-white rounded flex items-center">
                <Save className="mr-1" size={16} /> Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminFormatLaporan;
