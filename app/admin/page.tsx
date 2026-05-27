'use client';

import { useState } from 'react';
import { Shield, Eye, EyeOff, LayoutDashboard, Home, Users, Settings, LogOut, CheckCircle, Clock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { KOS_DATA, formatRupiah } from '@/lib/data';
import Image from 'next/image';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'ADMIN' && password === 'KOS2026') {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Username atau password salah.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUsername('');
    setPassword('');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="bg-slate-900 p-8 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500 rounded-full blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2" />
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-4 border border-white/20">
                <Shield className="w-8 h-8 text-orange-400" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">Admin Panel</h1>
              <p className="text-slate-400 text-sm">Masuk untuk mengelola sistem JuraganKos</p>
            </div>
          </div>
          
          <div className="p-8">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm font-medium flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-500" />
                {error}
              </div>
            )}
            
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Username</label>
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all font-medium"
                  placeholder="Masukkan username"
                  required
                />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Password</label>
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all font-medium"
                    placeholder="••••••••"
                    required
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              
              <button 
                type="submit"
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg hover:shadow-orange-500/25 active:scale-[0.98] flex items-center justify-center gap-2 mt-4"
              >
                Masuk ke Dashboard
              </button>
            </form>
            
            <div className="mt-8 text-center text-xs text-slate-400">
              <button onClick={() => router.push('/')} className="hover:text-slate-600 transition-colors">
                &larr; Kembali ke Beranda
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex-shrink-0 flex flex-col hidden md:flex">
        <div className="h-16 flex items-center px-6 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2">
            <Image 
              src="https://i.imgur.com/fofZxal.png" 
              alt="JuraganKos Logo" 
              width={120} 
              height={32} 
              className="h-6 w-auto object-contain brightness-0 invert" 
            />
          </div>
        </div>
        
        <div className="px-4 py-6 flex-1">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4 px-2">Menu Utama</p>
          <nav className="space-y-1">
            <a href="#" className="flex items-center gap-3 px-3 py-2.5 bg-orange-500 text-white rounded-lg font-medium text-sm transition-colors">
              <LayoutDashboard className="w-5 h-5" />
              Dashboard
            </a>
            <a href="#" className="flex items-center gap-3 px-3 py-2.5 text-slate-400 hover:bg-slate-800 hover:text-white rounded-lg font-medium text-sm transition-colors">
              <Home className="w-5 h-5" />
              Kelola Kos
            </a>
            <a href="#" className="flex items-center gap-3 px-3 py-2.5 text-slate-400 hover:bg-slate-800 hover:text-white rounded-lg font-medium text-sm transition-colors">
              <Users className="w-5 h-5" />
              Penyewa
            </a>
            <a href="#" className="flex items-center gap-3 px-3 py-2.5 text-slate-400 hover:bg-slate-800 hover:text-white rounded-lg font-medium text-sm transition-colors">
              <Settings className="w-5 h-5" />
              Pengaturan
            </a>
          </nav>
        </div>
        
        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 w-full text-slate-400 hover:bg-slate-800 hover:text-red-400 rounded-lg font-medium text-sm transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Keluar
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 md:justify-end">
          <div className="flex items-center gap-2 md:hidden">
            <Image 
              src="https://i.imgur.com/fofZxal.png" 
              alt="JuraganKos Logo" 
              width={100} 
              height={24} 
              className="h-5 w-auto object-contain" 
            />
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-slate-800">Super Admin</p>
              <p className="text-[10px] text-slate-500">Administrator</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden border-2 border-white shadow-sm">
              <Image src="https://picsum.photos/seed/adminAvatar/100/100" alt="Admin" width={40} height={40} />
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4 sm:p-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 mb-1">Dashboard Ikhtisar</h1>
                <p className="text-sm text-slate-500">Selamat datang kembali! Ini ringkasan sistem hari ini.</p>
              </div>
              <button 
                onClick={() => router.push('/')}
                className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-lg text-sm font-bold shadow-sm transition-colors"
              >
                Kembali ke Situs
              </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[
                { label: 'Total Kos Aktif', value: KOS_DATA.length.toString(), icon: Home, color: 'text-blue-600', bg: 'bg-blue-50' },
                { label: 'Total Penyewa', value: '1,248', icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                { label: 'Pemesanan Baru', value: '24', icon: Clock, color: 'text-orange-500', bg: 'bg-orange-50' },
                { label: 'Pendapatan Bulan Ini', value: 'Rp 45.2M', icon: LayoutDashboard, color: 'text-emerald-600', bg: 'bg-emerald-50' },
              ].map((stat, i) => (
                <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${stat.bg} ${stat.color}`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-slate-900">{stat.value}</h3>
                    <p className="text-xs text-slate-500 font-medium">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Recent Kos Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <h2 className="text-lg font-bold text-slate-900">Kos Terdaftar Baru</h2>
                <button className="text-orange-500 text-sm font-bold hover:text-orange-600">Lihat Semua</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-[11px] uppercase tracking-widest text-slate-500 font-bold">
                      <th className="p-4 px-6 font-semibold">Nama Kos</th>
                      <th className="p-4 font-semibold">Lokasi</th>
                      <th className="p-4 font-semibold">Tipe</th>
                      <th className="p-4 font-semibold">Harga/Bulan</th>
                      <th className="p-4 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {KOS_DATA.map((kos) => (
                      <tr key={kos.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-slate-200">
                              <Image src={kos.images[0]} width={40} height={40} alt={kos.name} className="w-full h-full object-cover" />
                            </div>
                            <div>
                              <p className="font-bold text-sm text-slate-900">{kos.name}</p>
                              <p className="text-xs text-slate-500">{kos.owner.name}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 align-middle">
                          <span className="text-sm text-slate-600">{kos.city}</span>
                        </td>
                        <td className="p-4 align-middle">
                          <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs font-bold uppercase">{kos.type}</span>
                        </td>
                        <td className="p-4 align-middle">
                          <span className="text-sm font-bold text-slate-800">{formatRupiah(kos.price)}</span>
                        </td>
                        <td className="p-4 align-middle">
                          <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full text-[11px] font-bold">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Aktif
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
