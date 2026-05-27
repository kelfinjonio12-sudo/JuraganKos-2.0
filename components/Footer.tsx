import Link from 'next/link';
import { Home, Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 pt-16 pb-8 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand & Intro */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 group">
              <Image 
                src="https://i.imgur.com/fofZxal.png" 
                alt="JuraganKos Logo" 
                width={150} 
                height={40} 
                className="h-8 w-auto object-contain brightness-0 invert" 
              />
            </Link>
            <p className="text-slate-400 text-xs leading-relaxed mt-4 max-w-xs">
              Platform pencarian dan sewa kos nomor satu. Cari kos idamanmu, dekat kampus atau kantor, dengan harga terbaik dan informasi paling akurat.
            </p>
            <div className="flex gap-4 pt-2">
              <a href="#" className="w-8 h-8 rounded bg-slate-800 flex items-center justify-center hover:bg-orange-500 hover:text-white transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded bg-slate-800 flex items-center justify-center hover:bg-orange-500 hover:text-white transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded bg-slate-800 flex items-center justify-center hover:bg-orange-500 hover:text-white transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded bg-slate-800 flex items-center justify-center hover:bg-orange-500 hover:text-white transition-colors">
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-[10px] uppercase tracking-widest font-bold text-orange-500 mb-4">Perusahaan</h3>
            <ul className="text-xs space-y-2 text-slate-400">
              <li><a href="#" className="hover:text-white hover:underline underline-offset-4 transition-colors">Tentang Kami</a></li>
              <li><a href="#" className="hover:text-white hover:underline underline-offset-4 transition-colors">Karir</a></li>
              <li><a href="#" className="hover:text-white hover:underline underline-offset-4 transition-colors">Blog JuraganKos</a></li>
              <li><a href="#" className="hover:text-white hover:underline underline-offset-4 transition-colors">Pusat Bantuan</a></li>
              <li><a href="#" className="hover:text-white hover:underline underline-offset-4 transition-colors">Syarat & Ketentuan</a></li>
              <li><a href="#" className="hover:text-white hover:underline underline-offset-4 transition-colors">Kebijakan Privasi</a></li>
            </ul>
          </div>

          {/* Kota Populer */}
          <div>
            <h3 className="text-[10px] uppercase tracking-widest font-bold text-orange-500 mb-4">Kota Populer</h3>
            <ul className="text-xs space-y-2 text-slate-400">
              <li><Link href="/search?q=Pangkalpinang" className="hover:text-white hover:underline underline-offset-4 transition-colors">Kos Pangkalpinang</Link></li>
              <li><Link href="/search?q=Sungailiat" className="hover:text-white hover:underline underline-offset-4 transition-colors">Kos Sungailiat</Link></li>
              <li><Link href="/search?q=Belinyu" className="hover:text-white hover:underline underline-offset-4 transition-colors">Kos Belinyu</Link></li>
              <li><Link href="/search?q=Koba" className="hover:text-white hover:underline underline-offset-4 transition-colors">Kos Koba</Link></li>
              <li><Link href="/search?q=Mentok" className="hover:text-white hover:underline underline-offset-4 transition-colors">Kos Mentok</Link></li>
              <li><Link href="/search?q=Toboali" className="hover:text-white hover:underline underline-offset-4 transition-colors">Kos Toboali</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-[10px] uppercase tracking-widest font-bold text-orange-500 mb-4">Hubungi Kami</h3>
            <ul className="text-xs space-y-3 text-slate-400">
              <li className="flex gap-2">
                <MapPin className="w-4 h-4 text-orange-500 shrink-0" />
                <span>Gedung JuraganKos<br/>Jl. Depati Hamzah, Pangkalpinang 33149</span>
              </li>
              <li className="flex gap-2 items-center">
                <Phone className="w-4 h-4 text-orange-500 shrink-0" />
                <span>021 - 5050 - 4040</span>
              </li>
              <li className="flex gap-2 items-center">
                <Mail className="w-4 h-4 text-orange-500 shrink-0" />
                <span>cs@juragankos.com</span>
              </li>
              <li className="mt-4">
                <Link href="/admin" className="inline-flex items-center gap-2 bg-slate-800 hover:bg-orange-500 text-slate-300 hover:text-white px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-colors">
                  <span className="w-2 h-2 rounded-full bg-orange-500"></span> Admin Panel
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-[10px] text-center md:text-left">
            © {new Date().getFullYear()} JuraganKos. Hak Cipta Dilindungi Undang-Undang.
          </p>
          <div className="flex gap-2">
            <span className="bg-slate-800 text-slate-400 text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-wider">🇮🇩 Buatan Indonesia</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
