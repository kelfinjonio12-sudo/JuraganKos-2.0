'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, Upload, Home, Info, DollarSign } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const FACILITIES_KAMAR = ['Kasur', 'Lemari Pakaian', 'Meja Belajar', 'Kursi', 'AC', 'Kipas Angin', 'Kamar Mandi Dalam', 'Water Heater', 'Smart TV'];
const FACILITIES_UMUM = ['WiFi', 'Dapur Bersama', 'Parkir Motor', 'Parkir Mobil', 'Ruang Santai', 'Laundry', 'Keamanan 24 Jam', 'CCTV'];

export default function ListProperty() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Form data
  const [name, setName] = useState('');
  const [type, setType] = useState('Campur');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [facilitiesKamar, setFacilitiesKamar] = useState<string[]>([]);
  const [facilitiesUmum, setFacilitiesUmum] = useState<string[]>([]);
  const [imageUrls, setImageUrls] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [ownerPhone, setOwnerPhone] = useState('');
  const [ownerEmail, setOwnerEmail] = useState('');

  const toggleFacility = (fac: string, list: string[], setList: (v: string[]) => void) => {
    setList(list.includes(fac) ? list.filter(f => f !== fac) : [...list, fac]);
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(step + 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    const allFacilities = [...facilitiesKamar, ...facilitiesUmum];
    const images = imageUrls.split('\n').map(u => u.trim()).filter(u => u !== '');

    const { error: supabaseError } = await supabase.from('kos').insert([{
      name,
      type,
      address,
      city,
      price: parseInt(price),
      description,
      facilities: allFacilities,
      images: images.length > 0 ? images : ['https://picsum.photos/seed/newkos/800/600'],
      owner_name: ownerName,
      owner_avatar: `https://picsum.photos/seed/${ownerName}/100/100`,
      rating: 0,
      reviews: 0,
      is_active: false,
      status: 'pending',
    }]);

    setIsSubmitting(false);

    if (supabaseError) {
      setError('Terjadi kesalahan. Coba lagi ya!');
      console.error(supabaseError);
    } else {
      setIsSuccess(true);
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
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Pengajuan Terkirim!</h2>
          <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 mb-6 text-left">
            <p className="text-orange-800 font-semibold text-sm mb-1">⏳ Menunggu Persetujuan Admin</p>
            <p className="text-orange-700 text-sm leading-relaxed">
              Properti kamu sedang ditinjau oleh tim JuraganKos. Proses verifikasi memakan waktu 1x24 jam. Kami akan menghubungi kamu melalui WhatsApp atau email setelah disetujui.
            </p>
          </div>
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
          <h1 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">Daftarkan Properti Anda</h1>
          <p className="text-gray-600 text-lg">Hasilkan pemasukan maksimal dari kamar kosong Anda.</p>
        </div>

        {/* Stepper */}
        <div className="mb-8 relative">
          <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -translate-y-1/2 rounded-full z-0"></div>
          <div
            className="absolute top-1/2 left-0 h-1 bg-orange-500 -translate-y-1/2 rounded-full z-0 transition-all duration-500"
            style={{ width: `${((step - 1) / 2) * 100}%` }}
          ></div>
          <div className="relative z-10 flex justify-between">
            {[1, 2, 3].map((num) => (
              <div key={num} className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors duration-300 ${step >= num ? 'bg-orange-500 text-white shadow-md' : 'bg-gray-200 text-gray-500'}`}>
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

        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
          <AnimatePresence mode="wait">

            {/* STEP 1 */}
            {step === 1 && (
              <motion.form key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} onSubmit={handleNext} className="p-6 md:p-10 space-y-6">
                <div className="flex items-center gap-2 mb-6 text-blue-800 pb-2 border-b">
                  <Info className="w-5 h-5" />
                  <h2 className="text-xl font-bold">Informasi Dasar Properti</h2>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Nama Kos/Properti</label>
                  <input required value={name} onChange={e => setName(e.target.value)} placeholder="Cth: Kos Melati Eksklusif" className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Tipe Kos</label>
                  <div className="grid grid-cols-3 gap-4">
                    {['Putra', 'Putri', 'Campur'].map((t) => (
                      <label key={t} className="cursor-pointer">
                        <input type="radio" name="type" className="peer sr-only" checked={type === t} onChange={() => setType(t)} />
                        <div className={`text-center py-3 border rounded-xl font-medium transition-colors ${type === t ? 'bg-orange-50 border-orange-500 text-orange-700' : 'border-gray-300 text-gray-600'}`}>{t}</div>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Alamat Lengkap</label>
                  <textarea required rows={3} value={address} onChange={e => setAddress(e.target.value)} placeholder="Masukkan alamat lengkap beserta patokan..." className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 resize-none" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Kota</label>
                    <input required value={city} onChange={e => setCity(e.target.value)} placeholder="Cth: Pangkalpinang" className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Kode Pos</label>
                    <input value={postalCode} onChange={e => setPostalCode(e.target.value)} placeholder="33100" className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Deskripsi Singkat</label>
                  <textarea rows={3} value={description} onChange={e => setDescription(e.target.value)} placeholder="Ceritakan keunggulan kos kamu..." className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 resize-none" />
                </div>
                <div className="flex justify-end pt-4 border-t">
                  <button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-3.5 rounded-xl shadow-lg transition-all">Lanjut</button>
                </div>
              </motion.form>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <motion.form key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} onSubmit={handleNext} className="p-6 md:p-10 space-y-6">
                <div className="flex items-center gap-2 mb-6 text-blue-800 pb-2 border-b">
                  <DollarSign className="w-5 h-5" />
                  <h2 className="text-xl font-bold">Harga & Fasilitas</h2>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Harga Sewa Per Bulan (Rp)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">Rp</span>
                    <input required type="number" value={price} onChange={e => setPrice(e.target.value)} placeholder="1500000" className="w-full border border-gray-300 rounded-xl pl-12 pr-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Fasilitas Kamar</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {FACILITIES_KAMAR.map((fac) => (
                      <label key={fac} className={`flex items-center gap-3 p-3 border rounded-xl cursor-pointer transition-colors ${facilitiesKamar.includes(fac) ? 'bg-orange-50 border-orange-400 text-orange-700 font-semibold' : 'hover:bg-gray-50'}`}>
                        <input type="checkbox" className="w-4 h-4 accent-orange-500" checked={facilitiesKamar.includes(fac)} onChange={() => toggleFacility(fac, facilitiesKamar, setFacilitiesKamar)} />
                        <span className="text-sm">{fac}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Fasilitas Umum</label>
                  <div className="grid grid-cols-2 gap-3">
                    {FACILITIES_UMUM.map((fac) => (
                      <label key={fac} className={`flex items-center gap-3 p-3 border rounded-xl cursor-pointer transition-colors ${facilitiesUmum.includes(fac) ? 'bg-orange-50 border-orange-400 text-orange-700 font-semibold' : 'hover:bg-gray-50'}`}>
                        <input type="checkbox" className="w-4 h-4 accent-orange-500" checked={facilitiesUmum.includes(fac)} onChange={() => toggleFacility(fac, facilitiesUmum, setFacilitiesUmum)} />
                        <span className="text-sm">{fac}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="flex justify-between pt-4 border-t">
                  <button type="button" onClick={() => setStep(1)} className="px-6 py-3 font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">Kembali</button>
                  <button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-3.5 rounded-xl shadow-lg transition-all">Lanjut</button>
                </div>
              </motion.form>
            )}

            {/* STEP 3 */}
            {step === 3 && (
              <motion.form key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} onSubmit={handleSubmit} className="p-6 md:p-10 space-y-6">
                <div className="flex items-center gap-2 mb-6 text-blue-800 pb-2 border-b">
                  <Upload className="w-5 h-5" />
                  <h2 className="text-xl font-bold">Foto & Data Diri</h2>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">URL Foto Properti (satu per baris, maks. 5)</label>
                  <textarea
                    rows={4}
                    value={imageUrls}
                    onChange={e => setImageUrls(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 resize-none font-mono text-sm"
                    placeholder={"https://contoh.com/foto1.jpg\nhttps://contoh.com/foto2.jpg"}
                  />
                  <p className="text-xs text-gray-400 mt-1">Kosongkan jika belum punya, kami akan pakai foto placeholder sementara.</p>
                </div>
                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                  <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><Home className="w-4 h-4" /> Data Pemilik</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Nama Pemilik/Pengelola</label>
                      <input required value={ownerName} onChange={e => setOwnerName(e.target.value)} placeholder="Nama lengkap Anda..." className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Nomor WhatsApp</label>
                        <input required type="tel" value={ownerPhone} onChange={e => setOwnerPhone(e.target.value)} placeholder="081234567890" className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                        <input required type="email" value={ownerEmail} onChange={e => setOwnerEmail(e.target.value)} placeholder="email@contoh.com" className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
                      </div>
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm font-medium">{error}</div>
                )}

                <div className="flex justify-between pt-4 border-t">
                  <button type="button" onClick={() => setStep(2)} className="px-6 py-3 font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">Kembali</button>
                  <button type="submit" disabled={isSubmitting} className="bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-bold px-8 py-3.5 rounded-xl shadow-lg transition-all flex items-center gap-2">
                    {isSubmitting ? 'Mengirim...' : 'Kirim Pendaftaran'}
                  </button>
                </div>
              </motion.form>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}