'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, use } from 'react';
import { KOS_DATA, formatRupiah } from '@/lib/data';
import Image from 'next/image';
import { MapPin, Star, Share2, Heart, CheckCircle2, Navigation, MessageSquare, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function KostDetail() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const kos = KOS_DATA.find(k => k.id === id);

  const [activeImage, setActiveImage] = useState(0);
  const [isBookingMode, setIsBookingMode] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [duration, setDuration] = useState('1 Bulan');
  const [startDate, setStartDate] = useState('');

  if (!kos) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-4 text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Kos Tidak Ditemukan</h1>
        <button onClick={() => router.push('/search')} className="bg-blue-600 text-white px-6 py-2 rounded-xl">Kembali ke Pencarian</button>
      </div>
    );
  }

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate booking process
    setTimeout(() => {
      setBookingSuccess(true);
    }, 800);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Left Content - Details */}
        <div className="lg:w-2/3">
          {/* Main Gallery */}
          <div className="relative bg-black rounded-2xl overflow-hidden aspect-[4/3] md:aspect-video mb-4 shadow-sm group">
            <Image 
              src={kos.images[activeImage]} 
              alt="Kos Gallery" 
              fill 
              className="object-cover transition-opacity duration-300"
              referrerPolicy="no-referrer"
            />
            <div className="absolute top-4 left-4 z-10 flex gap-2">
              <span className="bg-white/90 backdrop-blur px-3 py-1.5 rounded-lg text-sm font-bold shadow text-gray-800">
                {kos.type}
              </span>
            </div>
            <div className="absolute top-4 right-4 z-10 flex gap-2">
              <button className="bg-white/90 backdrop-blur w-10 h-10 flex items-center justify-center rounded-full hover:bg-orange-50 hover:text-orange-500 transition shadow text-gray-600">
                <Share2 className="w-5 h-5" />
              </button>
              <button className="bg-white/90 backdrop-blur w-10 h-10 flex items-center justify-center rounded-full hover:bg-red-50 hover:text-red-500 transition shadow text-gray-600">
                <Heart className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          {/* Thumbnails */}
          <div className="flex gap-2 lg:gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {kos.images.map((img, i) => (
              <button 
                key={i} 
                onClick={() => setActiveImage(i)}
                className={`relative w-24 h-24 shrink-0 rounded-xl overflow-hidden border-2 transition-all ${
                  activeImage === i ? 'border-orange-500 shadow-md' : 'border-transparent opacity-70 hover:opacity-100'
                }`}
              >
                <Image src={img} alt={`Thumbnail ${i}`} fill className="object-cover" referrerPolicy="no-referrer" />
              </button>
            ))}
          </div>

          {/* Details Section */}
          <div className="mt-8">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-3xl lg:text-4xl font-display font-bold text-gray-900 mb-2">{kos.name}</h1>
                <p className="text-gray-500 flex items-center gap-2 text-lg">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  {kos.address}
                </p>
              </div>
              <div className="bg-blue-50 text-blue-700 px-3 py-2 rounded-xl flex items-center gap-2 border border-blue-100">
                <Star className="w-5 h-5 fill-current" />
                <span className="font-bold">{kos.rating}</span>
                <span className="text-sm font-normal text-blue-600/70">({kos.reviews})</span>
              </div>
            </div>

            <div className="divider my-8 border-t border-gray-100"></div>

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Fasilitas Kos</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {kos.facilities.map((fac, idx) => (
                  <div key={idx} className="flex items-center gap-3 bg-gray-50/80 p-3 rounded-xl border border-gray-100">
                    <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                    <span className="text-gray-700">{fac}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Deskripsi</h2>
              <p className="text-gray-600 leading-relaxed bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                {kos.description}
              </p>
            </div>

            {/* Owner info */}
            <div className="bg-white border text-center md:text-left border-gray-200 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row items-center gap-6 mb-8">
              <div className="relative w-20 h-20 rounded-full overflow-hidden shrink-0">
                <Image src={kos.owner.avatar} alt={kos.owner.name} fill className="object-cover" referrerPolicy="no-referrer" />
              </div>
              <div className="flex-1">
                <p className="text-gray-500 text-sm mb-1">Dikelola oleh</p>
                <h3 className="font-bold text-xl text-gray-900">{kos.owner.name}</h3>
                <div className="flex items-center gap-2 mt-2 justify-center md:justify-start">
                  <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-semibold">Telah Terverifikasi</span>
                  <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs">Respon Cepat</span>
                </div>
              </div>
              <button className="bg-white border rounded-full border-blue-600 text-blue-600 hover:bg-blue-50 px-6 py-2.5 font-semibold transition-colors flex items-center gap-2 shrink-0">
                <MessageSquare className="w-4 h-4" /> Tanya Pemilik
              </button>
            </div>

            {/* Location Map Warning */}
            <div className="bg-orange-50 border border-orange-100 p-6 rounded-2xl flex items-start gap-4 mb-8">
              <AlertCircle className="w-6 h-6 text-orange-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-orange-800 mb-1">Lokasi Akurat</h4>
                <p className="text-orange-700/80 text-sm mb-3">Titik koordinat persis akan diinformasikan setelah Anda melakukan booking untuk menjaga keamanan penghuni.</p>
                <button className="text-orange-600 font-semibold text-sm flex items-center gap-1 hover:text-orange-700">
                  <Navigation className="w-4 h-4" /> Buka Peta Sekitar
                </button>
              </div>
            </div>

            {/* Rating & Ulasan */}
            <div className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Rating & Ulasan</h2>
                <div className="flex items-center gap-2">
                  <Star className="w-6 h-6 text-yellow-400 fill-current" />
                  <span className="text-2xl font-bold text-gray-900">{kos.rating}</span>
                  <span className="text-gray-500">({kos.reviews} Ulasan)</span>
                </div>
              </div>
              
              <div className="space-y-6">
                {[
                  { name: 'Diana R.', date: '2 Minggu lalu', rating: 5, comment: 'Kosnya bersih banget, ibu kosnya ramah. Fasilitas sesuai sama yang ada di deskripsi. Dekat juga buat cari makan.' },
                  { name: 'Rizky P.', date: '1 Bulan lalu', rating: 4, comment: 'Suasananya tenang, cocok buat nugas atau wfh. Cuma kadang wifi agak lambat kalau hujan, tapi overall oke banget.' },
                  { name: 'Siti A.', date: '3 Bulan lalu', rating: 5, comment: 'Aman banget ada CCTV dan gerbang dikunci malam. Kamar mandi dalam juga bersih dan air lancar.' }
                ].map((review, i) => (
                  <div key={i} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold">
                          {review.name.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900 text-sm">{review.name}</h4>
                          <span className="text-xs text-gray-500">{review.date}</span>
                        </div>
                      </div>
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed">{review.comment}</p>
                  </div>
                ))}
              </div>
              
              <button className="w-full mt-6 py-3 border border-gray-200 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
                Lihat Semua Ulasan
              </button>
            </div>
          </div>
        </div>

        {/* Right Content - Sticky Sidebar Booking */}
        <div className="lg:w-1/3">
          <div className="sticky top-24 bg-white border border-gray-200 shadow-xl rounded-3xl p-6">
            <AnimatePresence mode="wait">
              {!isBookingMode ? (
                <motion.div 
                  key="pricing"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex flex-col"
                >
                  <div className="mb-6">
                    <p className="text-gray-500 mb-1">Harga mulai</p>
                    <div className="flex items-end gap-1">
                      <span className="text-3xl font-display font-bold text-gray-900">{formatRupiah(kos.price)}</span>
                      <span className="text-gray-500 mb-1">/Bulan</span>
                    </div>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between items-center bg-gray-50 p-3 rounded-xl">
                      <span className="text-gray-600">Sedia Kamar</span>
                      <span className="font-semibold text-green-600">3 Kamar Kosong</span>
                    </div>
                    <div className="flex justify-between items-center bg-gray-50 p-3 rounded-xl">
                      <span className="text-gray-600">Minimal Sewa</span>
                      <span className="font-semibold text-gray-900">1 Bulan</span>
                    </div>
                  </div>

                  <button 
                    onClick={() => setIsBookingMode(true)}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold text-lg py-4 rounded-2xl shadow-lg shadow-orange-200 transition-all active:scale-95"
                  >
                    Ajukan Sewa
                  </button>
                  <p className="text-center text-xs text-gray-400 mt-4">Anda belum dikenakan biaya apapun.</p>
                </motion.div>
              ) : bookingSuccess ? (
                <motion.div 
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center text-center py-8"
                >
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle2 className="w-10 h-10 text-green-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Pengajuan Terkirim!</h3>
                  <p className="text-gray-600 mb-8">Pemilik kos akan segera menghubungi Anda untuk proses selanjutnya.</p>
                  <button 
                    onClick={() => router.push('/')}
                    className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl"
                  >
                    Kembali ke Beranda
                  </button>
                </motion.div>
              ) : (
                <motion.div 
                  key="form"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <button 
                      onClick={() => setIsBookingMode(false)}
                      className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600"
                    >
                      ←
                    </button>
                    <h3 className="font-bold text-lg text-gray-900">Form Pengajuan</h3>
                  </div>

                  <form onSubmit={handleBooking} className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Nama Lengkap</label>
                      <input 
                        type="text" 
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full border border-gray-300 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        placeholder="Cth: Budi Santoso"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Nomor WhatsApp</label>
                      <input 
                        type="tel" 
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full border border-gray-300 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        placeholder="081234567890"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Tanggal Masuk</label>
                      <input 
                        type="date" 
                        required
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full border border-gray-300 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Durasi Sewa</label>
                      <select 
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                        className="w-full border border-gray-300 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      >
                        <option>1 Bulan</option>
                        <option>3 Bulan</option>
                        <option>6 Bulan</option>
                        <option>1 Tahun</option>
                      </select>
                    </div>

                    <div className="pt-4 mt-4 border-t border-gray-100">
                      <button 
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg py-3.5 rounded-2xl shadow-lg transition-all active:scale-95"
                      >
                        Kirim Pengajuan
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

      </div>
    </div>
  );
}
