'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, Building, Upload, Home, Info, DollarSign, MapPin } from 'lucide-react';

export default function ListProperty() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
    } else {
      // Simulate form submission
      setTimeout(() => {
        setIsSuccess(true);
      }, 800);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl shadow-xl p-8 md:p-12 max-w-lg w-full text-center"
        >
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-12 h-12 text-green-500" />
          </div>
          <h2 className="text-3xl font-display font-bold text-gray-900 mb-4">Pengajuan Berhasil!</h2>
          <p className="text-gray-600 mb-8 leading-relaxed">
            Terima kasih telah mendaftarkan properti Anda. Tim kurator JuraganKos akan segera meninjau detail informasi dan menghubungi Anda dalam 1x24 jam untuk proses validasi.
          </p>
          <button 
            onClick={() => router.push('/')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl transition-colors"
          >
            Kembali ke Beranda
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-blue-900 mb-4">Daftarkan Properti Anda</h1>
          <p className="text-gray-600 text-lg">Hasilkan pemasukan maksimal dari kamar kosong Anda.</p>
        </div>

        {/* Stepper Progress */}
        <div className="mb-8 relative">
          <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -translate-y-1/2 rounded-full z-0"></div>
          <div 
            className="absolute top-1/2 left-0 h-1 bg-orange-500 -translate-y-1/2 rounded-full z-0 transition-all duration-500"
            style={{ width: `${((step - 1) / 2) * 100}%` }}
          ></div>
          
          <div className="relative z-10 flex justify-between">
            {[1, 2, 3].map((num) => (
              <div 
                key={num} 
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors duration-300 ${
                  step >= num ? 'bg-orange-500 text-white shadow-md' : 'bg-gray-200 text-gray-500'
                }`}
              >
                {step > num ? <CheckCircle2 className="w-5 h-5" /> : num}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 px-1 text-xs font-semibold text-gray-500">
            <span>Info Dasar</span>
            <span>Fasilitas & Harga</span>
            <span>Foto & Kontak</span>
          </div>
        </div>

        {/* Form Form */}
        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
          <form onSubmit={handleSubmit} className="p-6 md:p-10">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div 
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-2 mb-6 text-blue-800 pb-2 border-b">
                    <Info className="w-5 h-5" />
                    <h2 className="text-xl font-bold">Informasi Dasar Properti</h2>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Nama Kos/Properti</label>
                    <input type="text" required placeholder="Cth: Kos Melati Eksklusif" className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Tipe Kos</label>
                    <div className="grid grid-cols-3 gap-4">
                      {['Putra', 'Putri', 'Campur'].map((type) => (
                        <label key={type} className="cursor-pointer">
                          <input type="radio" name="property_type" className="peer sr-only" defaultChecked={type === 'Campur'} />
                          <div className="text-center py-3 border border-gray-300 rounded-xl peer-checked:bg-orange-50 peer-checked:border-orange-500 peer-checked:text-orange-700 font-medium transition-colors">
                            {type}
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Alamat Lengkap</label>
                    <textarea required rows={3} placeholder="Masukkan alamat lengkap beserta patokan..." className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 resize-none"></textarea>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Kota</label>
                      <input type="text" required placeholder="Cth: Jakarta Selatan" className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Kode Pos</label>
                      <input type="text" required placeholder="12345" className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div 
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-2 mb-6 text-blue-800 pb-2 border-b">
                    <DollarSign className="w-5 h-5" />
                    <h2 className="text-xl font-bold">Harga & Fasilitas</h2>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Harga Sewa Per Bulan (Rp)</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">Rp</span>
                      <input type="number" required placeholder="1500000" className="w-full border border-gray-300 rounded-xl pl-12 pr-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Fasilitas Kamar</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {['Kasur', 'Lemari Pakaian', 'Meja Belajar', 'Kursi', 'AC', 'Kipas Angin', 'Kamar Mandi Dalam', 'Water Heater', 'Smart TV'].map((fac) => (
                        <label key={fac} className="flex items-center gap-3 p-3 border rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                          <input type="checkbox" className="w-4 h-4 text-orange-600 rounded border-gray-300 focus:ring-orange-500" />
                          <span className="text-sm font-medium text-gray-700">{fac}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Fasilitas Umum</label>
                    <div className="grid grid-cols-2 gap-3">
                      {['WiFi', 'Dapur Bersama', 'Parkir Motor', 'Parkir Mobil', 'Ruang Santai', 'Laundry', 'Keamanan 24 Jam', 'CCTV'].map((fac) => (
                        <label key={fac} className="flex items-center gap-3 p-3 border rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                          <input type="checkbox" className="w-4 h-4 text-orange-600 rounded border-gray-300 focus:ring-orange-500" />
                          <span className="text-sm font-medium text-gray-700">{fac}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div 
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-2 mb-6 text-blue-800 pb-2 border-b">
                    <Upload className="w-5 h-5" />
                    <h2 className="text-xl font-bold">Foto & Data Diri</h2>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Upload Foto Properti</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-2xl p-10 text-center hover:bg-blue-50 hover:border-blue-300 transition-colors cursor-pointer group">
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                        <Upload className="w-8 h-8 text-blue-600" />
                      </div>
                      <p className="font-semibold text-gray-900 mb-1">Klik untuk upload foto</p>
                      <p className="text-sm text-gray-500">Maks. 5 foto (Format: JPG, PNG), landscape lebih baik.</p>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                    <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><Home className="w-4 h-4" /> Data Pemilik</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Nama Pemilik/Pengelola</label>
                        <input type="text" required placeholder="Nama lengkap Anda..." className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Nomor WhatsApp</label>
                          <input type="tel" required placeholder="081234567890" className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                          <input type="email" required placeholder="email@contoh.com" className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-10 flex justify-between items-center pt-6 border-t">
              {step > 1 ? (
                <button 
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="px-6 py-3 font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  Kembali
                </button>
              ) : (
                <div></div>
              )}
              
              <button 
                type="submit"
                className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-3.5 rounded-xl shadow-lg transition-all active:scale-95 flex items-center gap-2"
              >
                {step === 3 ? 'Kirim Pendaftaran' : 'Lanjut'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
