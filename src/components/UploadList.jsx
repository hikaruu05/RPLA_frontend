import React, { useState } from 'react';
import './UploadList.css'
import { 
  FileText, 
  Upload, 
  Save, 
  Edit, 
  Trash2, 
  Plus,
  X 
} from 'lucide-react';

const AdminFormatLaporan = () => {
  const [templates, setTemplates] = useState([
    {
      id: 1,
      nama: 'Laporan Keuangan Bulanan',
      terakhirDiubah: '15 Des 2024',
      versi: '2.1',
      tipe: 'Keuangan'
    },
    {
      id: 2, 
      nama: 'Laporan Proyek',
      terakhirDiubah: '10 Des 2024',
      versi: '1.5',
      tipe: 'Manajemen'
    }
  ]);

  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    nama: '',
    tipe: '',
    file: null
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    setFormData(prev => ({
      ...prev,
      file: file
    }));
  };

  const handleSubmit = () => {
    if (selectedTemplate) {
      // Logic for updating existing template
      const updatedTemplates = templates.map(template => 
        template.id === selectedTemplate.id 
          ? { ...template, ...formData } 
          : template
      );
      setTemplates(updatedTemplates);
    } else {
      // Logic for adding new template
      const newTemplate = {
        id: templates.length + 1,
        ...formData,
        terakhirDiubah: new Date().toLocaleDateString('id-ID'),
        versi: '1.0'
      };
      setTemplates([...templates, newTemplate]);
    }
    
    // Reset form and close modal
    setFormData({ nama: '', tipe: '', file: null });
    setModalOpen(false);
    setSelectedTemplate(null);
  };

  const handleDeleteTemplate = (id) => {
    const updatedTemplates = templates.filter(template => template.id !== id);
    setTemplates(updatedTemplates);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto bg-white shadow-lg rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center">
            <FileText className="mr-3" /> 
            Manajemen Format Laporan
          </h1>
          
          <button 
            onClick={() => {
              setSelectedTemplate(null);
              setModalOpen(true);
            }}
            className="bg-green-500 text-white px-4 py-2 rounded-md flex items-center hover:bg-green-600 transition"
          >
            <Plus className="mr-2" /> Tambah Template Baru
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-3 text-left" style={{ color: 'black' }}>Nama Template</th>
                <th className="p-3 text-left" style={{ color: 'black' }}>Tipe</th>
                <th className="p-3 text-left" style={{ color: 'black' }}>Terakhir Diubah</th>
                <th className="p-3 text-left" style={{ color: 'black' }}>Versi</th>
                <th className="p-3 text-center" style={{ color: 'black' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {templates.map(template => (
                <tr 
                  key={template.id} 
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="p-3" style={{ color: 'black' }}>{template.nama}</td>
                  <td className="p-3" style={{ color: 'black' }}>{template.tipe}</td>
                  <td className="p-3" style={{ color: 'black' }}>{template.terakhirDiubah}</td>
                  <td className="p-3" style={{ color: 'black' }}>{template.versi}</td>
                  <td className="p-3 flex justify-center space-x-2">
                    <button 
                      onClick={() => {
                        setSelectedTemplate(template);
                        setFormData({
                          nama: template.nama,
                          tipe: template.tipe
                        });
                        setModalOpen(true);
                      }}
                      className="text-blue-500 hover:text-blue-700 transition"
                    >
                      <Edit size={20} />
                    </button>
                    <button 
                      className="text-red-500 hover:text-red-700 transition"
                      onClick={() => handleDeleteTemplate(template.id)}
                    >
                      <Trash2 size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal Tambah/Edit Template */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items--center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg w-[500px] p-6 relative">
              <button 
                onClick={() => {
                  setModalOpen(false);
                  setSelectedTemplate(null);
                  setFormData({ nama: '', tipe: '', file: null });
                }}
                className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
              >
                <X size={24} />
              </button>

              <h2 className="text-xl font-semibold mb-6 text-center" style={{ color: 'black' }}>
                {selectedTemplate ? 'Edit Template' : 'Tambah Template Baru'}
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block mb-2 text-sm font-medium" style={{ color: 'black' }}>Nama Template</label>
                  <input 
                    type="text"
                    name="nama"
                    value={formData.nama}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Masukkan nama template"
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium" style={{ color: 'black' }}>Tipe Laporan</label>
                  <select
                    name="tipe"
                    value={formData.tipe}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Pilih Tipe Laporan</option>
                    <option value="Keuangan">Keuangan</option>
                    <option value="Proyek">Proyek</option>
                    <option value="SDM">SDM</option>
                    <option value="Operasional">Operasional</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium" style={{ color: 'black' }}>Unggah Template</label>
                  <div className="border-2 border-dashed p-4 text-center">
                    <input
                      type="file"
                      id="templateFile"
                      onChange={handleFileUpload}
                      className="hidden"
                      accept=".docx,.pdf,.xlsx"
                    />
                    <label 
                      htmlFor="templateFile" 
                      className="cursor-pointer flex items--center justify-center text-blue-600 hover:text-blue-800"
                    >
                      <Upload className="mr-2" />
                      {formData.file ? formData.file.name : 'Pilih File Template'}
                    </label>
                  </div>
                </div>

                <div className="flex justify-end space-x-4 mt-6">
                  <button 
                    onClick={() => {
                      setModalOpen(false);
                      setSelectedTemplate(null);
                      setFormData({ nama: '', tipe: '', file: null });
                    }}
                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition"
                  >
                    Batal
                  </button>
                  <button 
                    onClick={handleSubmit}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition flex items--center"
                  >
                    <Save className="mr-2" />
                    Simpan
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminFormatLaporan;