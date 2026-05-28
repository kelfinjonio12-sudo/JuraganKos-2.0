'use client';
import Link from 'next/link';
import { PlusCircle, Menu, X, User, LogOut, Heart, ChevronDown } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const pathname = usePathname();
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const navLinks = [
    { name: 'Beranda', path: '/' },
    { name: 'Cari Kos', path: '/search' },
    { name: 'Pusat Bantuan', path: '#' },
  ];

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      if (user) fetchProfile(user.id);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) fetchProfile(session.user.id);
      else setProfile(null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchProfile = async (userId: string) => {
    const { data } = await supabase.from('profiles').select('*').eq('id', userId).single();
    if (data) setProfile(data);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setIsDropdownOpen(false);
    router.push('/');
    router.refresh();
  };

  const avatarUrl = profile?.avatar_url || user?.user_metadata?.avatar_url;
  const displayName = profile?.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';

  return (
    <nav className="bg-white sticky top-0 z-50 border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2 group">
              <Image src="https://i.imgur.com/fofZxal.png" alt="JuraganKos Logo" width={150} height={40} className="h-8 w-auto object-contain" priority />
            </Link>
            <div className="hidden md:ml-10 md:flex md:space-x-8">
              {navLinks.map((link) => (
                <Link key={link.name} href={link.path} className={`inline-flex items-center px-1 font-semibold text-sm transition-all h-16 ${pathname === link.path ? 'border-b-2 border-orange-500 text-orange-500' : 'border-b-2 border-transparent text-gray-600 hover:text-orange-500 hover:border-orange-500'}`}>
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="hidden md:flex md:items-center space-x-4">
            <Link href="/list-property" className="border-2 border-gray-200 px-5 py-2 rounded-full hover:bg-gray-50 transition-all font-semibold text-gray-600 text-sm flex items-center gap-2">
              <PlusCircle className="w-4 h-4" /> Daftarkan Kos
            </Link>

            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-full transition-colors">
                  <div className="w-7 h-7 rounded-full overflow-hidden bg-gradient-to-br from-blue-400 to-orange-400 flex items-center justify-center shrink-0">
                    {avatarUrl ? (
                      <Image src={avatarUrl} alt="Avatar" width={28} height={28} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      <span className="text-white text-xs font-bold">{displayName.charAt(0).toUpperCase()}</span>
                    )}
                  </div>
                  <span className="text-sm font-semibold text-gray-700 max-w-[100px] truncate">{displayName}</span>
                  <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50"
                    >
                      <div className="p-3 border-b border-gray-100">
                        <p className="text-xs text-gray-400">Masuk sebagai</p>
                        <p className="text-sm font-bold text-gray-800 truncate">{displayName}</p>
                      </div>
                      <div className="p-1">
                        <Link href="/profil" onClick={() => setIsDropdownOpen(false)} className="flex items-center gap-3 px-3 py-2.5 text-gray-700 hover:bg-gray-50 rounded-xl text-sm font-medium transition-colors">
                          <User className="w-4 h-4" /> Profil Saya
                        </Link>
                        <Link href="/profil?tab=favorit" onClick={() => setIsDropdownOpen(false)} className="flex items-center gap-3 px-3 py-2.5 text-gray-700 hover:bg-gray-50 rounded-xl text-sm font-medium transition-colors">
                          <Heart className="w-4 h-4" /> Kos Favorit
                        </Link>
                        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 text-red-500 hover:bg-red-50 rounded-xl text-sm font-medium transition-colors">
                          <LogOut className="w-4 h-4" /> Keluar
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link href="/login" className="bg-blue-900 text-white px-6 py-2 rounded-full shadow-lg hover:brightness-110 transition-all font-semibold text-sm flex items-center gap-2">
                <User className="w-4 h-4" /> Masuk / Sign Up
              </Link>
            )}
          </div>

          <div className="flex items-center md:hidden">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none">
              {isMobileMenuOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="md:hidden overflow-hidden border-t border-gray-100 bg-white">
            <div className="pt-2 pb-3 space-y-1">
              {navLinks.map((link) => (
                <Link key={link.name} href={link.path} onClick={() => setIsMobileMenuOpen(false)} className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${pathname === link.path ? 'bg-orange-50 border-orange-500 text-orange-700' : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'}`}>
                  {link.name}
                </Link>
              ))}
              <Link href="/list-property" onClick={() => setIsMobileMenuOpen(false)} className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-blue-600 hover:bg-blue-50">
                Daftarkan Kos
              </Link>
              <div className="px-4 py-3 space-y-2">
                {user ? (
                  <>
                    <Link href="/profil" onClick={() => setIsMobileMenuOpen(false)} className="w-full flex items-center gap-2 border border-gray-200 text-gray-700 px-4 py-2.5 rounded-xl font-medium text-sm">
                      <User className="w-4 h-4" /> Profil Saya
                    </Link>
                    <button onClick={handleLogout} className="w-full flex items-center gap-2 bg-red-50 text-red-500 px-4 py-2.5 rounded-xl font-medium text-sm">
                      <LogOut className="w-4 h-4" /> Keluar
                    </button>
                  </>
                ) : (
                  <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="w-full flex justify-center items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-medium">
                    <User className="w-5 h-5" /> Masuk / Daftar
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}