'use client';
import Link from 'next/link';
import { Home, Search, PlusCircle, Menu, X, User } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { name: 'Beranda', path: '/' },
    { name: 'Cari Kos', path: '/search' },
    { name: 'Pusat Bantuan', path: '#' },
  ];

  return (
    <nav className="bg-white sticky top-0 z-50 border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2 group">
              <Image 
                src="https://i.imgur.com/fofZxal.png" 
                alt="JuraganKos Logo" 
                width={150} 
                height={40} 
                className="h-8 w-auto object-contain"
                priority
              />
            </Link>
            
            <div className="hidden md:ml-10 md:flex md:space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.path}
                  className={`inline-flex items-center px-1 font-semibold text-sm transition-all h-16 ${
                    pathname === link.path
                      ? 'border-b-2 border-orange-500 text-orange-500'
                      : 'border-b-2 border-transparent text-gray-600 hover:text-orange-500 hover:border-orange-500'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
          <div className="hidden md:flex md:items-center space-x-6">
            <Link 
              href="/list-property"
              className="border-2 border-gray-200 px-5 py-2 rounded-full hover:bg-gray-50 transition-all font-semibold text-gray-600 text-sm flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Daftarkan Kos</span>
            </Link>
            <button className="bg-blue-900 text-white px-6 py-2 rounded-full shadow-lg hover:brightness-110 transition-all font-semibold text-sm flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>Masuk / Sign Up</span>
            </button>
          </div>
          
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
            >
              <span className="sr-only">Buka menu uama</span>
              {isMobileMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden border-t border-gray-100 bg-white"
          >
            <div className="pt-2 pb-3 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                    pathname === link.path
                      ? 'bg-orange-50 border-orange-500 text-orange-700'
                      : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <Link
                href="/list-property"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-blue-600 hover:bg-blue-50 hover:text-blue-800"
              >
                Daftarkan Kos
              </Link>
              <div className="px-4 py-3">
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full flex justify-center items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-medium"
                >
                  <User className="w-5 h-5" />
                  Masuk / Daftar
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
