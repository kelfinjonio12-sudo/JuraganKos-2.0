export interface Kost {
  id: string;
  name: string;
  type: 'Putra' | 'Putri' | 'Campur';
  city: string;
  address: string;
  price: number;
  rating: number;
  reviews: number;
  facilities: string[];
  images: string[];
  description: string;
  owner: {
    name: string;
    avatar: string;
  };
}

export const KOS_DATA: Kost[] = [
  {
    id: '1',
    name: 'Kos Eksklusif Melati Emas',
    type: 'Putri',
    city: 'Pangkalpinang',
    address: 'Jl. Depati Hamzah No. 12, Semabung Lama, Pangkalpinang',
    price: 1500000,
    rating: 4.8,
    reviews: 124,
    facilities: ['AC', 'WiFi', 'Kamar Mandi Dalam', 'Kasur', 'Lemari', 'Dapur Bersama'],
    images: [
      'https://picsum.photos/seed/kos1a/800/600',
      'https://picsum.photos/seed/kos1b/800/600',
      'https://picsum.photos/seed/kos1c/800/600',
    ],
    description: 'Kos putri eksklusif dengan fasilitas lengkap di pusat kota Pangkalpinang. Keamanan 24 jam dengan CCTV, akses kunci sidik jari, dan parkir luas.',
    owner: {
      name: 'Ibu Ratna',
      avatar: 'https://picsum.photos/seed/owner1/100/100',
    }
  },
  {
    id: '2',
    name: 'Kos Harmoni Sungailiat',
    type: 'Campur',
    city: 'Sungailiat',
    address: 'Jl. Sudirman No. 88, Sungailiat, Bangka',
    price: 1200000,
    rating: 4.6,
    reviews: 89,
    facilities: ['AC', 'WiFi', 'Kamar Mandi Dalam', 'Parkir Mobil', 'Pembersihan Kamar', 'Laundry'],
    images: [
      'https://picsum.photos/seed/kos2a/800/600',
      'https://picsum.photos/seed/kos2b/800/600',
    ],
    description: 'Kos nyaman untuk pekerja dan mahasiswa. Lokasi strategis dekat dengan pusat perkantoran dan fasilitas umum di Sungailiat.',
    owner: {
      name: 'Bapak Sudirman',
      avatar: 'https://picsum.photos/seed/owner2/100/100',
    }
  },
  {
    id: '3',
    name: 'Griya Singgah Laskar',
    type: 'Putra',
    city: 'Belinyu',
    address: 'Jl. Jenderal Sudirman KM 2, Belinyu',
    price: 800000,
    rating: 4.9,
    reviews: 210,
    facilities: ['WiFi', 'Kamar Mandi Luar', 'Kasur Springbed', 'Dapur Bersama', 'Parkir Motor'],
    images: [
      'https://picsum.photos/seed/kos3a/800/600',
      'https://picsum.photos/seed/kos3b/800/600',
    ],
    description: 'Kos murah meriah dengan fasilitas internet super cepat. Berada di lokasi yang tenang dan dekat dengan pusat perbelanjaan lokal.',
    owner: {
      name: 'Mas Bayu',
      avatar: 'https://picsum.photos/seed/owner3/100/100',
    }
  },
  {
    id: '4',
    name: 'Koba Executive Kost',
    type: 'Campur',
    city: 'Koba',
    address: 'Jl. Kenanga No. 45, Koba, Bangka Tengah',
    price: 2000000,
    rating: 4.7,
    reviews: 56,
    facilities: ['AC', 'WiFi', 'Kamar Mandi Dalam', 'Water Heater', 'Smart TV', 'Laundry'],
    images: [
      'https://picsum.photos/seed/kos4a/800/600',
      'https://picsum.photos/seed/kos4b/800/600',
    ],
    description: 'Kos premium standar hotel untuk eksekutif muda di Bangka Tengah. Dilengkapi dengan cleaning service harian dan keamanan berlapis.',
    owner: {
      name: 'PT Koba Properti',
      avatar: 'https://picsum.photos/seed/owner4/100/100',
    }
  },
  {
    id: '5',
    name: 'Kos Pelangi Mentok',
    type: 'Putri',
    city: 'Mentok',
    address: 'Jl. RA Kartini No. 10, Mentok, Bangka Barat',
    price: 1100000,
    rating: 4.5,
    reviews: 142,
    facilities: ['AC', 'WiFi', 'Kamar Mandi Dalam', 'Meja Belajar', 'Dapur Bersama', 'Parkir Motor'],
    images: [
      'https://picsum.photos/seed/kos5a/800/600',
      'https://picsum.photos/seed/kos5b/800/600',
    ],
    description: 'Aman, nyaman, dan tenang. Sangat cocok untuk pekerja di area Mentok. Terdapat area jemur yang luas dan ruang komunal.',
    owner: {
      name: 'Ibu Listia',
      avatar: 'https://picsum.photos/seed/owner5/100/100',
    }
  },
  {
    id: '6',
    name: 'Toboali Residence',
    type: 'Campur',
    city: 'Toboali',
    address: 'Jl. Jend. Sudirman, Toboali, Bangka Selatan',
    price: 1300000,
    rating: 4.9,
    reviews: 320,
    facilities: ['AC', 'WiFi', 'Kamar Mandi Dalam', 'Coworking Space', 'Pembersihan Kamar'],
    images: [
      'https://picsum.photos/seed/kos6a/800/600',
      'https://picsum.photos/seed/kos6b/800/600',
    ],
    description: 'Pilihan terbaik di Bangka Selatan. Bangunan baru dengan fasilitas lengkap dan dekat dengan pusat perbelanjaan dan wisata pantai daerah.',
    owner: {
      name: 'Bapak Joni',
      avatar: 'https://picsum.photos/seed/owner6/100/100',
    }
  }
];

export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}
