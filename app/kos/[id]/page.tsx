'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { formatRupiah } from '@/lib/data';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';
import { MapPin, Star, Share2, Heart, CheckCircle2, Navigation, MessageSquare, AlertCircle, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type Kos = {
  id: string;
  name: string;
  type: string;
  city: string;
  address: string;
  price: number;
  rating: number;
  reviews: number;
  facilities: string[];
  images: string[];
  description: string;
  owner_name: string;
  owner_avatar: string;
};

type Ulasan = {
  id: string;
  nama: string;
  rating: number;
  komentar: string;
  created_at: string;
};

export default function KostDetail() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [kos, setKos] = useState<Kos | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [isBookingMode, setIsBookingMode] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Booking form
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [duration, setDuration] = useState('1 Bulan');
  const [startDate, setStartDate] = useState('');

  // Ulasan
  const [ulasanList, setUlasanList] = useState<Ulasan[]>([]);
  const [showUlasanForm, setShowUlasanForm] = useState(false);
  const [ulasanNama, setUlasanNama] = useState('');
  const [ulasanRating, setUlasanRating] = useState(0);
  const [ulasanHoverRating, setUlasanHoverRating] = useState(0);
  const [ulasanKomentar, setUlasanKomentar] = useState('');
  const [submittingUlasan, setSubmittingUlasan] = useState(false);
  const [ulasanSuccess, setUlasanSuccess] = useState(false);

  useEffect(() => {
    fetchKos();
    fetchUlasan();
  }, [id]);

  const fetchKos = async () => {
    const { data } = await supabase.from('kos').select('*').eq('id', id).single();
    setKos(data);
    setLoading(false);
  };

  const fetchUlasan = async () => {
    const { data } = await supabase
      .from('ulasan')
      .select('*')
      .eq('kos_id', id)
      .order('created_at', { ascending: false });
    if (data) setUlasanList(data);
  };

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    setTimeout(() => setBookingSuccess(true), 800);
  };

  const handleSubmitUlasan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (ulasanRating === 0) return alert('Pilih rating dulu ya!');
    setSubmittingUlasan(true);
    await supabase.from('ulasan').insert([{
      kos_id: id,
      nama: ulasanNama,
      rating: ulasanRating,
      komentar: ulasanKomentar,
    }]);
    setSubmittingUlasan(false);
    setUlasanSuccess(true);
    setUlasanNama('');
    setUlasanRating(0);
    setUlasanKomentar('');
    setShowUlasanForm(false);
    // Refresh ulasan dan rating kos
    fetchUlasan();
    fetchKos();
    setTimeout(() => setUlasanSuccess(false), 3000);
  };

  const formatTanggal = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const ratingDistribution = (star: number) => {
    if (ulasanList.length === 0) return 0;
    const count = ulasanList.filter(u => u.rating === star).length;
    return Math.round((count / ulasanList.length) * 100);
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <p className="text-blue-500 font-bold">Memuat detail kos...</p>
      </div>
    );
  }

  if (!kos) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-4 text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Kos Tidak Ditemukan</h1>
        <button onClick={() => router.push('/search')} className="bg-blue-600 text-white px-6 py-2 rounded-xl">Kembali ke Pencarian</button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">

      {/* Success toast */}
      {ulasanSuccess && (
        <div className="fixed top-6 right-6 z-50 bg-emerald-500 text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-2 font-semibold">
          <CheckCircle2 className="w-5 h-5" /> Ulasan berhasil dikirim!
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-8">

        {/* Left Content */}
        <div className="lg:w-2/3">

          {/* Gallery */}
          <div className="relative bg-black rounded-2xl overflow-hidden aspect-[4/3] md:aspect-video mb-4 shadow-sm">
            <Image src={kos.images[activeImage]} alt="Kos Gallery" fill className="object-cover transition-opacity duration-300" referrerPolicy="no-referrer" />
            <div className="absolute top-4 left-4 z-10">
              <span className="bg-white/90 backdrop-blur px-3 py-1.5 rounded-lg text-sm font-bold shadow text-gray-800">{kos.type}</span>
            </div>
            <div className="absolute top-4 right-4 z-10 flex gap-2">
              <button className="bg-white/90 backdrop-blur w-10 h-10 flex items-center justify-center rounded-full hover:bg-orange-50 hover:text-orange-500 transition shadow text-gray-600"><Share2 className="w-5 h-5" /></button>
              <button className="bg-white/90 backdrop-blur w-10 h-10 flex items-center justify-center rounded-full hover:bg-red-50 hover:text-red-500 transition shadow text-gray-600"><Heart className="w-5 h-5" /></button>
            </div>
          </div>

          {/* Thumbnails */}
          <div className="flex gap-2 lg:gap-4 overflow-x-auto pb-4">
            {kos.images.map((img, i) => (
              <button key={i} onClick={() => setActiveImage(i)} className={`relative w-24 h-24 shrink-0 rounded-xl overflow-hidden border-2 transition-all ${activeImage === i ? 'border-orange-500 shadow-md' : 'border-transparent opacity-70 hover:opacity-100'}`}>
                <Image src={img} alt={`Thumbnail ${i}`} fill className="object-cover" referrerPolicy="no-referrer" />
              </button>
            ))}
          </div>

          <div className="mt-8">
            {/* Title */}
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">{kos.name}</h1>
                <p className="text-gray-500 flex items-center gap-2 text-lg"><MapPin className="w-5 h-5 text-gray-400" />{kos.address}</p>
              </div>
              <div className="bg-blue-50 text-blue-700 px-3 py-2 rounded-xl flex items-center gap-2 border border-blue-100 shrink-0">
                <Star className="w-5 h-5 fill-current" />
                <span className="font-bold">{kos.rating ?? 0}</span>
                <span className="text-sm font-normal text-blue-600/70">({kos.reviews ?? 0})</span>
              </div>
            </div>

            <div className="my-8 border-t border-gray-100"></div>

            {/* Fasilitas */}
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

            {/* Deskripsi */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Deskripsi</h2>
              <p className="text-gray-600 leading-relaxed bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">{kos.description}</p>
            </div>

            {/* Owner */}
            <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row items-center gap-6 mb-8 text-center md:text-left">
              <div className="relative w-20 h-20 rounded-full overflow-hidden shrink-0">
                <Image src={kos.owner_avatar || `https://picsum.photos/seed/${kos.owner_name}/100/100`} alt={kos.owner_name} fill className="object-cover" referrerPolicy="no-referrer" />
              </div>
              <div className="flex-1">
                <p className="text-gray-500 text-sm mb-1">Dikelola oleh</p>
                <h3 className="font-bold text-xl text-gray-900">{kos.owner_name}</h3>
                <div className="flex items-center gap-2 mt-2 justify-center md:justify-start">
                  <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-semibold">Telah Terverifikasi</span>
                  <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs">Respon Cepat</span>
                </div>
              </div>
              <button className="bg-white border rounded-full border-blue-600 text-blue-600 hover:bg-blue-50 px-6 py-2.5 font-semibold transition-colors flex items-center gap-2 shrink-0">
                <MessageSquare className="w-4 h-4" /> Tanya Pemilik
              </button>
            </div>

            {/* Lokasi */}
            <div className="bg-orange-50 border border-orange-100 p-6 rounded-2xl flex items-start gap-4 mb-8">
              <AlertCircle className="w-6 h-6 text-orange-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-orange-800 mb-1">Lokasi Akurat</h4>
                <p className="text-orange-700/80 text-sm mb-3">Titik koordinat persis akan diinformasikan setelah Anda melakukan booking untuk menjaga keamanan penghuni.</p>
                <button className="text-orange-600 font-semibold text-sm flex items-center gap-1 hover:text-orange-700"><Navigation className="w-4 h-4" /> Buka Peta Sekitar</button>
              </div>
            </div>

            {/* ===== RATING & ULASAN ===== */}
            <div className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Rating & Ulasan</h2>
                <button
                  onClick={() => setShowUlasanForm(!showUlasanForm)}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl font-semibold text-sm transition-colors"
                >
                  {showUlasanForm ? 'Batal' : '+ Tulis Ulasan'}
                </button>
              </div>

              {/* Ringkasan Rating */}
              <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm mb-6">
                <div className="flex flex-col md:flex-row gap-6 items-center">
                  <div className="text-center shrink-0">
                    <p className="text-6xl font-black text-gray-900">{kos.rating ?? 0}</p>
                    <div className="flex items-center justify-center gap-1 my-2">
                      {[1,2,3,4,5].map(s => (
                        <Star key={s} className={`w-5 h-5 ${s <= Math.round(kos.rating ?? 0) ? 'text-yellow-400 fill-current' : 'text-gray-200 fill-current'}`} />
                      ))}
                    </div>
                    <p className="text-sm text-gray-500">{kos.reviews ?? 0} ulasan</p>
                  </div>
                  <div className="flex-1 w-full space-y-2">
                    {[5,4,3,2,1].map(star => (
                      <div key={star} className="flex items-center gap-3">
                        <span className="text-sm text-gray-600 w-4 shrink-0">{star}</span>
                        <Star className="w-4 h-4 text-yellow-400 fill-current shrink-0" />
                        <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                          <div className="bg-yellow-400 h-2 rounded-full transition-all duration-500" style={{ width: `${ratingDistribution(star)}%` }} />
                        </div>
                        <span className="text-xs text-gray-400 w-8 text-right">{ratingDistribution(star)}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Form Ulasan */}
              <AnimatePresence>
                {showUlasanForm && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="bg-blue-50 border border-blue-100 rounded-2xl p-6 mb-6"
                  >
                    <h3 className="font-bold text-gray-900 mb-4">Tulis Ulasanmu</h3>
                    <form onSubmit={handleSubmitUlasan} className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Nama</label>
                        <input required value={ulasanNama} onChange={e => setUlasanNama(e.target.value)} className="w-full border border-gray-300 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" placeholder="Nama kamu..." />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Rating</label>
                        <div className="flex gap-2">
                          {[1,2,3,4,5].map(s => (
                            <button
                              key={s}
                              type="button"
                              onClick={() => setUlasanRating(s)}
                              onMouseEnter={() => setUlasanHoverRating(s)}
                              onMouseLeave={() => setUlasanHoverRating(0)}
                              className="transition-transform hover:scale-110"
                            >
                              <Star className={`w-8 h-8 transition-colors ${s <= (ulasanHoverRating || ulasanRating) ? 'text-yellow-400 fill-current' : 'text-gray-300 fill-current'}`} />
                            </button>
                          ))}
                          {ulasanRating > 0 && (
                            <span className="ml-2 text-sm font-semibold text-gray-600 self-center">
                              {['', 'Sangat Buruk', 'Buruk', 'Cukup', 'Bagus', 'Sangat Bagus'][ulasanRating]}
                            </span>
                          )}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Komentar</label>
                        <textarea required rows={3} value={ulasanKomentar} onChange={e => setUlasanKomentar(e.target.value)} className="w-full border border-gray-300 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none" placeholder="Bagikan pengalamanmu tinggal di sini..." />
                      </div>
                      <button type="submit" disabled={submittingUlasan} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-bold px-6 py-2.5 rounded-xl transition-colors">
                        <Send className="w-4 h-4" /> {submittingUlasan ? 'Mengirim...' : 'Kirim Ulasan'}
                      </button>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Daftar Ulasan */}
              {ulasanList.length === 0 ? (
                <div className="text-center py-12 bg-white border border-gray-100 rounded-2xl">
                  <Star className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                  <p className="font-semibold text-gray-500">Belum ada ulasan</p>
                  <p className="text-sm text-gray-400 mt-1">Jadilah yang pertama memberi ulasan!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {ulasanList.map((ulasan) => (
                    <div key={ulasan.id} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-blue-500 flex items-center justify-center text-white font-bold text-sm shrink-0">
                            {ulasan.nama.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-gray-900">{ulasan.nama}</p>
                            <p className="text-xs text-gray-400">{formatTanggal(ulasan.created_at)}</p>
                          </div>
                        </div>
                        <div className="flex gap-0.5">
                          {[1,2,3,4,5].map(s => (
                            <Star key={s} className={`w-4 h-4 ${s <= ulasan.rating ? 'text-yellow-400 fill-current' : 'text-gray-200 fill-current'}`} />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm leading-relaxed">{ulasan.komentar}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Right - Booking Sidebar */}
        <div className="lg:w-1/3">
          <div className="sticky top-24 bg-white border border-gray-200 shadow-xl rounded-3xl p-6">
            <AnimatePresence mode="wait">
              {!isBookingMode ? (
                <motion.div key="pricing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="flex flex-col">
                  <div className="mb-6">
                    <p className="text-gray-500 mb-1">Harga mulai</p>
                    <div className="flex items-end gap-1">
                      <span className="text-3xl font-bold text-gray-900">{formatRupiah(kos.price)}</span>
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
                  <button onClick={() => setIsBookingMode(true)} className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold text-lg py-4 rounded-2xl shadow-lg shadow-orange-200 transition-all active:scale-95">Ajukan Sewa</button>
                  <p className="text-center text-xs text-gray-400 mt-4">Anda belum dikenakan biaya apapun.</p>
                </motion.div>
              ) : bookingSuccess ? (
                <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center text-center py-8">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6"><CheckCircle2 className="w-10 h-10 text-green-500" /></div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Pengajuan Terkirim!</h3>
                  <p className="text-gray-600 mb-8">Pemilik kos akan segera menghubungi Anda untuk proses selanjutnya.</p>
                  <button onClick={() => router.push('/')} className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl">Kembali ke Beranda</button>
                </motion.div>
              ) : (
                <motion.form key="form" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} onSubmit={handleBooking} className="flex flex-col">
                  <div className="flex items-center gap-3 mb-6">
                    <button type="button" onClick={() => setIsBookingMode(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600">←</button>
                    <h3 className="font-bold text-lg text-gray-900">Form Pengajuan</h3>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Nama Lengkap</label>
                      <input type="text" required value={name} onChange={e => setName(e.target.value)} className="w-full border border-gray-300 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" placeholder="Cth: Budi Santoso" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Nomor WhatsApp</label>
                      <input type="tel" required value={phone} onChange={e => setPhone(e.target.value)} className="w-full border border-gray-300 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" placeholder="081234567890" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Tanggal Masuk</label>
                      <input type="date" required value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full border border-gray-300 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Durasi Sewa</label>
                      <select value={duration} onChange={e => setDuration(e.target.value)} className="w-full border border-gray-300 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
                        <option>1 Bulan</option>
                        <option>3 Bulan</option>
                        <option>6 Bulan</option>
                        <option>1 Tahun</option>
                      </select>
                    </div>
                    <div className="pt-4 mt-2 border-t border-gray-100">
                      <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg py-3.5 rounded-2xl shadow-lg transition-all active:scale-95">Kirim Pengajuan</button>
                    </div>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>

      </div>
    </div>
  );
} 