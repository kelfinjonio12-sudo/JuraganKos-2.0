'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { Search, MapPin, Building, ShieldCheck, Clock, Wallet, Star, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react';
import Link from 'next/link';
import { KOS_DATA, formatRupiah } from '@/lib/data';
import Image from 'next/image';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    } else {
      router.push('/search');
    }
  };

  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const features = [
    {
      icon: <ShieldCheck className="w-8 h-8 text-orange-500" />,
      title: 'Aman & Terverifikasi',
      description: 'Semua listing kos telah disurvei dan diverifikasi keamanannya oleh tim JuraganKos.',
    },
    {
      icon: <Clock className="w-8 h-8 text-orange-500" />,
      title: 'Booking Instan',
      description: 'Proses penyewaan yang cepat tanpa ribet dengan fitur booking langsung dari platform.',
    },
    {
      icon: <Wallet className="w-8 h-8 text-orange-500" />,
      title: 'Harga Jujur',
      description: 'Tidak ada biaya tersembunyi. Harga yang tertera adalah harga yang pasti Anda bayar.',
    },
  ];

  const popularCities = ['Pangkalpinang', 'Sungailiat', 'Belinyu', 'Koba', 'Mentok', 'Toboali'];

  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative bg-blue-900 overflow-hidden pt-20 pb-28 sm:pt-28 sm:pb-36 px-4">
        {/* Abstract background circles matching theme */}
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-blue-400 rounded-full opacity-20 z-0"></div>
        <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-orange-500 rounded-full opacity-10 z-0"></div>
        
        <div className="absolute inset-0 z-0 opacity-10">
          <Image 
            src="https://picsum.photos/seed/bgcity/1920/1080" 
            alt="City overview" 
            fill 
            className="object-cover"
            priority
            referrerPolicy="no-referrer"
          />
        </div>
        
        <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4 tracking-tight leading-tight">
              Cari Kos di Bangka Belitung <br className="hidden md:block" />
              <span className="text-orange-500 italic relative whitespace-nowrap">
                Makin Gampang!
              </span>
            </h1>
            <p className="text-sm md:text-base text-blue-100 max-w-2xl mx-auto mb-8 opacity-90">
              Temukan pilihan kos terbaik di seluruh penjuru Bangka Belitung dengan harga jujur dan informasi lengkap.
            </p>
          </motion.div>

          {/* Search Box */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="w-full max-w-xl bg-white p-2 rounded-2xl shadow-2xl flex flex-col md:flex-row items-center gap-2"
          >
            <form onSubmit={handleSearch} className="flex-1 flex flex-col md:flex-row items-center w-full">
              <div className="flex-1 flex items-center w-full pl-4 pr-2 py-2">
                <Search className="w-5 h-5 text-gray-400 mr-2 shrink-0" />
                <input 
                  type="text" 
                  className="w-full text-sm outline-none text-gray-700 placeholder-gray-400 bg-transparent p-2"
                  placeholder="Masukkan nama lokasi, area, atau alamat..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="h-10 w-[1px] bg-gray-100 hidden sm:block"></div>
              <button 
                type="submit"
                className="w-full md:w-auto bg-orange-500 hover:bg-orange-600 hover:scale-105 active:scale-95 text-white rounded-xl px-8 py-3 font-bold text-sm transition-all shadow-lg ml-0 md:ml-2 mt-2 md:mt-0"
              >
                Cari Sekarang
              </button>
            </form>
          </motion.div>

          {/* Quick city links */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8 flex flex-wrap justify-center gap-2 items-center text-sm text-blue-200"
          >
            <span className="mr-2">Pencarian Populer:</span>
            {popularCities.map((city) => (
              <Link 
                key={city} 
                href={`/search?q=${city}`}
                className="px-3 py-1 rounded-full bg-blue-800/50 hover:bg-orange-500 hover:text-white transition-colors cursor-pointer"
              >
                {city}
              </Link>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Recommended Section */}
      <section className="py-12 px-10 bg-gray-50 flex-grow">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h2 className="text-xl font-bold text-gray-800">Rekomendasi Terdekat</h2>
              <p className="text-xs text-gray-500">Pilihan terbaik untuk kenyamanan istirahatmu</p>
            </div>
            <div className="flex gap-2 text-xs">
              <button className="bg-white border border-gray-200 px-4 py-1.5 rounded-full font-semibold text-gray-600 hover:bg-gray-50 transition-colors">Murah</button>
              <button className="bg-white border border-gray-200 px-4 py-1.5 rounded-full font-semibold text-gray-600 hover:bg-gray-50 transition-colors">AC & WiFi</button>
              <button className="bg-blue-900 text-white px-4 py-1.5 rounded-full font-semibold hover:brightness-110 transition-colors">Populer</button>
            </div>
          </div>

          <div className="flex overflow-x-auto gap-6 pb-8 pt-4 snap-x snap-mandatory scrollbar-hide">
            {KOS_DATA.slice(0, 8).map((kos) => (
              <motion.div 
                key={kos.id}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                className="bg-white rounded-2xl overflow-hidden shadow-[0_10px_25px_-5px_rgba(0,0,0,0.05)] border border-gray-100 flex flex-col group cursor-pointer shrink-0 w-72 sm:w-80 snap-start relative"
              >
                <Link href={`/kos/${kos.id}`} className="absolute inset-0 z-10" aria-label={`Lihat detail ${kos.name}`} />
                <div className="relative h-40 w-full overflow-hidden bg-gray-200">
                  <Image 
                    src={kos.images[0]} 
                    alt={kos.name} 
                    fill 
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-2 left-2 bg-white/90 backdrop-blur px-2 py-1 rounded text-[10px] font-bold text-orange-500 shadow-sm z-20">
                    {kos.type.toUpperCase()}
                  </div>
                  <div className="absolute bottom-2 right-2 bg-blue-600 text-white text-[10px] px-2 py-1 rounded-md shadow-sm z-20">
                    Booking Langsung
                  </div>
                </div>
                <div className="p-4 flex-1 flex flex-col relative z-20 pointer-events-none">
                  <div className="flex items-center gap-1 mb-1">
                    <span className="text-yellow-400 text-xs">★</span>
                    <span className="text-[10px] text-gray-500 font-medium">{kos.rating} ({kos.reviews} Review)</span>
                  </div>
                  <h3 className="font-bold text-base text-gray-800 line-clamp-1 group-hover:text-orange-500 transition-colors">
                    {kos.name}
                  </h3>
                  <p className="text-xs text-gray-400 mb-3 line-clamp-1">
                    {kos.city} • {kos.facilities.slice(0, 3).join(', ')}
                  </p>
                  
                  <div className="flex items-end justify-between mt-auto pt-4 border-t border-gray-50">
                    <div>
                      <p className="text-[10px] text-gray-400 mb-0.5">Mulai dari</p>
                      <div className="flex items-end gap-1">
                        <span className="text-orange-500 font-black text-base">{formatRupiah(kos.price)}</span>
                        <span className="text-[10px] text-gray-400 mb-0.5">/ bln</span>
                      </div>
                    </div>
                    <span className="bg-orange-50 text-orange-500 text-xs font-bold px-3 py-1.5 rounded-lg">Detail</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-4 text-center">
            <Link 
              href="/search"
              className="inline-block bg-white text-orange-500 border-2 border-orange-100 hover:border-orange-500 hover:bg-orange-50 px-8 py-3 rounded-full font-bold transition-all shadow-sm group"
            >
              Lihat Lebih Banyak <span className="inline-block transform group-hover:translate-x-1 transition-transform ml-1">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">Kenapa Pilih JuraganKos?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">Kami mendedikasikan platform ini untuk mempermudah pencarian hunian idaman Anda tanpa khawatir tertipu.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {features.map((feature, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center p-8 rounded-3xl bg-blue-50/50 border border-blue-100/50 hover:bg-white hover:shadow-xl hover:border-blue-100 transition-all"
              >
                <div className="mx-auto w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Owner CTA Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto bg-gradient-to-r from-orange-500 to-orange-600 rounded-3xl p-8 md:p-16 flex flex-col md:flex-row items-center gap-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3"></div>
          
          <div className="md:w-2/3 relative z-10">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4 leading-tight">
              Punya Properti Kos Nganggur? <br />
              <span className="text-orange-200">Biar Kami Bantu Penuhinya.</span>
            </h2>
            <p className="text-orange-100 text-lg mb-8 max-w-xl">
              Gabung dengan ribuan pemilik kos lainnya. Daftarkan properti Anda secara gratis dan jangkau jutaan pencari kos di seluruh Indonesia.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                href="/list-property"
                className="bg-white text-orange-600 hover:bg-gray-50 px-8 py-4 rounded-xl font-bold text-lg transition-colors flex items-center justify-center gap-2 shadow-lg"
              >
                <Building className="w-5 h-5" />
                Daftarkan Kos Sekarang
              </Link>
            </div>
          </div>
          
          <div className="md:w-1/3 relative z-10 w-full aspect-square max-w-sm hidden md:block">
            <div className="relative w-full h-full bg-white/10 backdrop-blur-sm rounded-3xl border border-white/20 p-4 transform rotate-3 shadow-2xl flex items-center justify-center">
              <div className="absolute -top-4 -right-4 bg-blue-600 text-white font-bold px-4 py-2 rounded-xl text-sm transform rotate-12 shadow-xl border-2 border-white">
                100% Gratis!
              </div>
              <Image 
                src="https://picsum.photos/seed/ownerpromo/400/400" 
                alt="Promo Pemilik Kos" 
                width={300} 
                height={300} 
                className="rounded-2xl object-cover shadow-inner w-full h-full"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Booking Steps Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">Gampang Banget Sewa Kos</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">Hanya butuh beberapa langkah mudah untuk mendapatkan kamar idamanmu.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            <div className="hidden md:block absolute top-12 left-[10%] right-[10%] h-0.5 bg-gray-200 z-0"></div>
            
            {[
              { step: 1, title: 'Cari Lokasi', desc: 'Masukkan nama daerah kampus atau kota di Bangka Belitung.' },
              { step: 2, title: 'Pilih Kamar', desc: 'Saring berdasarkan harga dan fasilitas yang kamu mau.' },
              { step: 3, title: 'Booking & Bayar', desc: 'Lakukan pembayaran dengan metode yang dijamin aman.' },
              { step: 4, title: 'Tinggal Masuk', desc: 'Konfirmasi instan, langsung bawa koper ke kos barumu!' }
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative z-10 flex flex-col items-center text-center"
              >
                <div className="w-24 h-24 rounded-full bg-blue-50 border-4 border-white shadow-xl flex items-center justify-center text-3xl font-black text-orange-500 mb-6 relative">
                  {item.step}
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-blue-900 text-white flex items-center justify-center">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">Kata Mereka Tentang Kami</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">Pengalaman nyata dari penyewa kos di seluruh Bangka Belitung.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: 'Diana R.', role: 'Mahasiswa UBB', quote: 'Sangat ngebantu buat maba kayak aku yang baru ke Pangkalpinang. Dapet kos putri aman dan murah lewat sini.', img: 't1' },
              { name: 'Johan S.', role: 'Karyawan Swasta', quote: 'Pindah tugas ke Sungailiat gak perlu pusing lagi cari kosan. Tinggal search, bayar, langsung masuk. Mantap!', img: 't2' },
              { name: 'Putri', role: 'Pegawai Bank', quote: 'Aman banget pembayarannya, gak takut ketipu kosan bodong. Info di aplikasi sama aslinya 100% sama.', img: 't3' },
              { name: 'Fikri M.', role: 'Freelancer', quote: 'Filter Wi-Fi nya beneran akurat. Sekarang dapet coliving space asyik di Muntok buat kerja jarak jauh.', img: 't4' },
            ].map((t, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col"
              >
                <div className="flex text-yellow-400 mb-4">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                </div>
                <p className="text-gray-700 italic mb-6 flex-grow text-sm leading-relaxed">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <Image src={`https://picsum.photos/seed/${t.img}/100/100`} width={40} height={40} alt={t.name} className="rounded-full" />
                  <div>
                    <h4 className="font-bold text-sm text-gray-900">{t.name}</h4>
                    <p className="text-xs text-gray-500">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">Pertanyaan Seputar JuraganKos</h2>
            <p className="text-gray-600">Jawaban cepat untuk beberapa pertanyaan yang sering diajukan.</p>
          </div>
          
          <div className="space-y-4">
            {[
              { q: 'Apakah harga kos di JuraganKos transparan?', a: 'Ya, harga yang ditampilkan di aplikasi adalah harga final tanpa ada biaya tersembunyi. Kamu tidak perlu khawatir dengan tambahan biaya tak terduga saat akan menyewa.' },
              { q: 'Bagaimana cara memastikan kos yang saya sewa aman?', a: 'Tim kami selalu melakukan verifikasi terhadap setiap pemilik kos dan memastikan kos memiliki fasilitas keamanan yang memadai sebelum menampilkannya di platform.' },
              { q: 'Apakah bisa survei langsung ke lokasi sebelum bayar?', a: 'Tentu. Kamu bisa menggunakan fitur kontak pemilik kos di halaman properti untuk menanyakan waktu yang tepat untuk melakukan survei lokasi.' },
              { q: 'Apa metode pembayaran yang tersedia?', a: 'Kami menerima berbagai metode pembayaran seperti Transfer Bank (BCA, Mandiri, BRI, BNI), E-Wallet (GoPay, OVO, Dana), maupun melalui minimarket terdekat.' }
            ].map((faq, i) => (
              <div key={i} className="border border-gray-200 rounded-2xl overflow-hidden hover:border-orange-500 transition-colors">
                <button 
                  onClick={() => setOpenFaqIndex(openFaqIndex === i ? null : i)}
                  className="w-full flex justify-between items-center p-5 bg-white font-bold text-left text-gray-800"
                >
                  <span>{faq.q}</span>
                  {openFaqIndex === i ? <ChevronUp className="w-5 h-5 text-orange-500 shrink-0" /> : <ChevronDown className="w-5 h-5 text-gray-400 shrink-0" />}
                </button>
                <AnimatePresence>
                  {openFaqIndex === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-5 pb-5 text-gray-600 text-sm leading-relaxed"
                    >
                      {faq.a}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
