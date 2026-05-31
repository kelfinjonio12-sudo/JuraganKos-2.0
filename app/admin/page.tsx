'use client';

import { useState, useEffect } from 'react';
import { Shield, Eye, EyeOff, LayoutDashboard, Home, Users, LogOut, Clock, Plus, Pencil, Trash2, X, CheckCircle, Check, XCircle, Bell, ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { formatRupiah } from '@/lib/data';
import Image from 'next/image';
import ImageUpload from '@/components/ImageUpload';

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
  is_active: boolean;
  status: string;
};

type KosForm = Omit<Kos, 'id' | 'rating' | 'reviews' | 'is_active' | 'status'>;

const emptyForm: KosForm = {
  name: '', type: 'Campur', city: '', address: '', price: 0,
  facilities: [], images: [''], description: '', owner_name: '', owner_avatar: '',
};

const FACILITIES_LIST = ['AC', 'WiFi', 'Kamar Mandi Dalam', 'Kamar Mandi Luar', 'Kasur', 'Lemari', 'Meja Belajar', 'Dapur Bersama', 'Parkir Motor', 'Parkir Mobil', 'Laundry', 'Water Heater', 'Smart TV', 'CCTV', 'Keamanan 24 Jam'];

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [secretKey, setSecretKey] = useState('');

  const [kosList, setKosList] = useState<Kos[]>([]);
  const [pendingList, setPendingList] = useState<Kos[]>([]);
  const [kosPage, setKosPage] = useState(1);
  const [pendingPage, setPendingPage] = useState(1);
  const ITEMS_PER_PAGE = 10;
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [showModal, setShowModal] = useState(false);
  const [editingKos, setEditingKos] = useState<Kos | null>(null);
  const [form, setForm] = useState<KosForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [confirmModal, setConfirmModal] = useState<{ title: string; message: string; onConfirm: () => void; type: 'danger' | 'warning' } | null>(null);

  const router = useRouter();

  useEffect(() => {
    // Cek admin session terpisah dari user session
    const adminSession = localStorage.getItem('admin_session');
    if (adminSession) {
      const parsed = JSON.parse(adminSession);
      // Session berlaku 8 jam
      if (Date.now() - parsed.timestamp < 8 * 60 * 60 * 1000) {
        setIsAuthenticated(true);
      } else {
        localStorage.removeItem('admin_session');
      }
    }
    setCheckingSession(false);
  }, []);

  useEffect(() => {
    if (isAuthenticated) { fetchKos(); fetchPending(); }
  }, [isAuthenticated]);

  const fetchKos = async () => {
    const { data } = await supabase.from('kos').select('*').eq('status', 'approved').order('created_at', { ascending: false });
    if (data) setKosList(data);
  };

  const fetchPending = async () => {
    const { data } = await supabase.from('kos').select('*').eq('status', 'pending').order('created_at', { ascending: false });
    if (data) setPendingList(data);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Cek secret key dulu
    if (secretKey !== process.env.NEXT_PUBLIC_ADMIN_SECRET) {
      setError('Secret key salah.');
      setIsLoading(false);
      return;
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError('Email atau password salah.');
    } else {
      // Simpan admin session di localStorage terpisah
      localStorage.setItem('admin_session', JSON.stringify({
        user_id: data.user?.id,
        email: data.user?.email,
        timestamp: Date.now(),
      }));
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  };

  const handleLogout = () => {
    // Hanya hapus admin session, tidak logout dari supabase auth user biasa
    localStorage.removeItem('admin_session');
    setIsAuthenticated(false);
    setEmail('');
    setPassword('');
    setSecretKey('');
  };

  const handleApprove = async (kos: Kos) => {
    await supabase.from('kos').update({ status: 'approved', is_active: true }).eq('id', kos.id);
    showSuccess(`"${kos.name}" berhasil disetujui!`);
    fetchKos(); fetchPending();
  };

  const handleReject = (kos: Kos) => {
    setConfirmModal({
      title: 'Tolak Pengajuan',
      message: `Yakin ingin menolak pengajuan "${kos.name}"? Tindakan ini tidak bisa dibatalkan.`,
      type: 'warning',
      onConfirm: async () => {
        await supabase.from('kos').update({ status: 'rejected', is_active: false }).eq('id', kos.id);
        showSuccess(`"${kos.name}" ditolak.`);
        fetchPending();
        setConfirmModal(null);
      },
    });
  };

  const openAddModal = () => { setEditingKos(null); setForm(emptyForm); setShowModal(true); };
  const openEditModal = (kos: Kos) => {
    setEditingKos(kos);
    setForm({ name: kos.name, type: kos.type, city: kos.city, address: kos.address, price: kos.price, facilities: kos.facilities, images: kos.images, description: kos.description, owner_name: kos.owner_name, owner_avatar: kos.owner_avatar });
    setShowModal(true);
  };

  const handleDelete = (id: string, name: string) => {
    setConfirmModal({
      title: 'Hapus Kos',
      message: `Yakin ingin menghapus "${name}"? Data yang dihapus tidak bisa dikembalikan.`,
      type: 'danger',
      onConfirm: async () => {
        await supabase.from('kos').delete().eq('id', id);
        showSuccess('Kos berhasil dihapus!');
        fetchKos();
        setConfirmModal(null);
      },
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const payload = { ...form, images: form.images.filter(img => img.trim() !== '') };
    if (editingKos) {
      await supabase.from('kos').update(payload).eq('id', editingKos.id);
      showSuccess('Kos berhasil diperbarui!');
    } else {
      await supabase.from('kos').insert([{ ...payload, rating: 0, reviews: 0, is_active: true, status: 'approved' }]);
      showSuccess('Kos berhasil ditambahkan!');
    }
    setSaving(false); setShowModal(false); fetchKos();
  };

  const showSuccess = (msg: string) => { setSuccessMsg(msg); setTimeout(() => setSuccessMsg(''), 3000); };
  const toggleFacility = (fac: string) => {
    setForm(prev => ({ ...prev, facilities: prev.facilities.includes(fac) ? prev.facilities.filter(f => f !== fac) : [...prev.facilities, fac] }));
  };

  if (checkingSession) return <div className="min-h-screen flex items-center justify-center"><p className="text-slate-500">Memuat...</p></div>;

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
            {error && <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm font-medium flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-red-500" />{error}</div>}
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all" placeholder="admin@juragankos.com" required />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Password</label>
                <div className="relative">
                  <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all" placeholder="••••••••" required />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">{showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}</button>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Secret Key</label>
                <input
                  type="password"
                  value={secretKey}
                  onChange={(e) => setSecretKey(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
                  placeholder="Masukkan secret key admin"
                  required
                />
              </div>
              <button type="submit" disabled={isLoading} className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg mt-4">
                {isLoading ? 'Memproses...' : 'Masuk ke Dashboard'}
              </button>
            </form>
            <div className="mt-8 text-center text-xs text-slate-400">
              <button onClick={() => router.push('/')} className="hover:text-slate-600 transition-colors">← Kembali ke Beranda</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex-shrink-0 flex-col hidden md:flex">
        <div className="h-16 flex items-center px-6 border-b border-slate-800">
          <span className="text-white font-bold text-lg">JuraganKos Admin</span>
        </div>
        <div className="px-4 py-6 flex-1">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4 px-2">Menu Utama</p>
          <nav className="space-y-1">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
              { id: 'kelola', label: 'Kelola Kos', icon: Home },
              { id: 'pengajuan', label: 'Pengajuan', icon: Bell, badge: pendingList.length },
            ].map(({ id, label, icon: Icon, badge }) => (
              <button key={id} onClick={() => setActiveMenu(id)} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-sm transition-colors ${activeMenu === id ? 'bg-orange-500 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
                <Icon className="w-5 h-5" />
                <span className="flex-1 text-left">{label}</span>
                {badge ? <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{badge}</span> : null}
              </button>
            ))}
          </nav>
        </div>
        <div className="p-4 border-t border-slate-800">
          <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2.5 w-full text-slate-400 hover:bg-slate-800 hover:text-red-400 rounded-lg font-medium text-sm transition-colors">
            <LogOut className="w-5 h-5" /> Keluar
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0">
          <h2 className="font-bold text-slate-800">
            {activeMenu === 'dashboard' ? 'Dashboard' : activeMenu === 'kelola' ? 'Kelola Kos' : 'Pengajuan Kos'}
          </h2>
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

        {successMsg && (
          <div className="fixed top-6 right-6 z-50 bg-emerald-500 text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-2 font-semibold">
            <CheckCircle className="w-5 h-5" /> {successMsg}
          </div>
        )}

        <div className="flex-1 overflow-auto p-4 sm:p-8">
          <div className="max-w-6xl mx-auto">

            {/* DASHBOARD */}
            {activeMenu === 'dashboard' && (
              <>
                <div className="flex justify-between items-end mb-8">
                  <div>
                    <h1 className="text-2xl font-bold text-slate-900 mb-1">Dashboard Ikhtisar</h1>
                    <p className="text-sm text-slate-500">Selamat datang kembali!</p>
                  </div>
                  <button 
                    onClick={async () => {
                      await supabase.auth.signOut();
                      router.push('/');
                    }} 
                    className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-lg text-sm font-bold shadow-sm"
                  >
                    Kembali ke Situs
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                  {[
                    { label: 'Kos Aktif', value: kosList.length.toString(), icon: Home, color: 'text-blue-600', bg: 'bg-blue-50' },
                    { label: 'Menunggu Persetujuan', value: pendingList.length.toString(), icon: Clock, color: 'text-orange-500', bg: 'bg-orange-50' },
                    { label: 'Total Kos', value: (kosList.length + pendingList.length).toString(), icon: LayoutDashboard, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                  ].map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${stat.bg} ${stat.color}`}><stat.icon className="w-6 h-6" /></div>
                      <div><h3 className="text-2xl font-black text-slate-900">{stat.value}</h3><p className="text-xs text-slate-500 font-medium">{stat.label}</p></div>
                    </div>
                  ))}
                </div>

                {/* Pending preview */}
                {pendingList.length > 0 && (
                  <div className="bg-orange-50 border border-orange-200 rounded-2xl p-5 mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Bell className="w-6 h-6 text-orange-500" />
                      <div>
                        <p className="font-bold text-orange-800">Ada {pendingList.length} pengajuan kos baru!</p>
                        <p className="text-sm text-orange-600">Segera tinjau dan setujui atau tolak pengajuan.</p>
                      </div>
                    </div>
                    <button onClick={() => setActiveMenu('pengajuan')} className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl font-bold text-sm transition-colors">Tinjau Sekarang</button>
                  </div>
                )}

                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                    <h2 className="text-lg font-bold text-slate-900">Kos Aktif</h2>
                    <button onClick={() => setActiveMenu('kelola')} className="text-orange-500 text-sm font-bold hover:text-orange-600">Kelola Semua</button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead><tr className="bg-slate-50 text-[11px] uppercase tracking-widest text-slate-500 font-bold"><th className="p-4 px-6">Nama Kos</th><th className="p-4">Lokasi</th><th className="p-4">Tipe</th><th className="p-4">Harga/Bulan</th></tr></thead>
                      <tbody className="divide-y divide-slate-100">
                        {kosList.slice(0, 5).map((kos) => (
                          <tr key={kos.id} className="hover:bg-slate-50/50">
                            <td className="p-4 px-6"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-slate-200">{kos.images?.[0] && <Image src={kos.images[0]} width={40} height={40} alt={kos.name} className="w-full h-full object-cover" />}</div><div><p className="font-bold text-sm text-slate-900">{kos.name}</p><p className="text-xs text-slate-500">{kos.owner_name}</p></div></div></td>
                            <td className="p-4"><span className="text-sm text-slate-600">{kos.city}</span></td>
                            <td className="p-4"><span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs font-bold uppercase">{kos.type}</span></td>
                            <td className="p-4"><span className="text-sm font-bold text-slate-800">{formatRupiah(kos.price)}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}

            {/* KELOLA KOS */}
            {activeMenu === 'kelola' && (
              <>
                <div className="flex justify-between items-center mb-8">
                  <div><h1 className="text-2xl font-bold text-slate-900 mb-1">Kelola Kos</h1><p className="text-sm text-slate-500">Tambah, edit, atau hapus data kos</p></div>
                  <button onClick={openAddModal} className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-xl font-bold shadow transition-colors"><Plus className="w-5 h-5" /> Tambah Kos</button>
                </div>
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead><tr className="bg-slate-50 text-[11px] uppercase tracking-widest text-slate-500 font-bold"><th className="p-4 px-6">Nama Kos</th><th className="p-4">Lokasi</th><th className="p-4">Tipe</th><th className="p-4">Harga/Bulan</th><th className="p-4">Aksi</th></tr></thead>
                      <tbody className="divide-y divide-slate-100">
                        {kosList.slice((kosPage - 1) * ITEMS_PER_PAGE, kosPage * ITEMS_PER_PAGE).map((kos) => (
                          <tr key={kos.id} className="hover:bg-slate-50/50">
                            <td className="p-4 px-6"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-slate-200">{kos.images?.[0] && <Image src={kos.images[0]} width={40} height={40} alt={kos.name} className="w-full h-full object-cover" />}</div><p className="font-bold text-sm text-slate-900">{kos.name}</p></div></td>
                            <td className="p-4"><span className="text-sm text-slate-600">{kos.city}</span></td>
                            <td className="p-4"><span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs font-bold uppercase">{kos.type}</span></td>
                            <td className="p-4"><span className="text-sm font-bold text-slate-800">{formatRupiah(kos.price)}</span></td>
                            <td className="p-4"><div className="flex items-center gap-2"><button onClick={() => openEditModal(kos)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Pencil className="w-4 h-4" /></button><button onClick={() => handleDelete(kos.id, kos.name)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button></div></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                {/* Pagination Kelola */}
                {Math.ceil(kosList.length / ITEMS_PER_PAGE) > 1 && (
                  <div className="flex items-center justify-between mt-4 px-2">
                    <p className="text-sm text-slate-500">
                      Menampilkan {((kosPage - 1) * ITEMS_PER_PAGE) + 1}–{Math.min(kosPage * ITEMS_PER_PAGE, kosList.length)} dari {kosList.length} kos
                    </p>
                    <div className="flex items-center gap-2">
                      <button onClick={() => setKosPage(p => Math.max(1, p - 1))} disabled={kosPage === 1} className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      {Array.from({ length: Math.ceil(kosList.length / ITEMS_PER_PAGE) }, (_, i) => i + 1).map(page => (
                        <button key={page} onClick={() => setKosPage(page)} className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-semibold transition-colors ${kosPage === page ? 'bg-orange-500 text-white' : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'}`}>
                          {page}
                        </button>
                      ))}
                      <button onClick={() => setKosPage(p => Math.min(Math.ceil(kosList.length / ITEMS_PER_PAGE), p + 1))} disabled={kosPage === Math.ceil(kosList.length / ITEMS_PER_PAGE)} className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* PENGAJUAN */}
            {activeMenu === 'pengajuan' && (
              <>
                <div className="mb-8">
                  <h1 className="text-2xl font-bold text-slate-900 mb-1">Pengajuan Kos</h1>
                  <p className="text-sm text-slate-500">Tinjau dan setujui atau tolak pengajuan kos baru</p>
                </div>
                {pendingList.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-16 text-center">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4"><CheckCircle className="w-8 h-8 text-slate-400" /></div>
                    <p className="font-bold text-slate-700 mb-1">Tidak ada pengajuan baru</p>
                    <p className="text-sm text-slate-400">Semua pengajuan sudah ditinjau</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingList.slice((pendingPage - 1) * ITEMS_PER_PAGE, pendingPage * ITEMS_PER_PAGE).map((kos) => (
                      <div key={kos.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                        <div className="flex flex-col md:flex-row gap-6">
                          <div className="w-full md:w-48 h-36 rounded-xl overflow-hidden bg-slate-200 shrink-0">
                            {kos.images?.[0] && <Image src={kos.images[0]} width={192} height={144} alt={kos.name} className="w-full h-full object-cover" />}
                          </div>
                          <div className="flex-1">
                            <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
                              <div>
                                <h3 className="font-bold text-lg text-slate-900">{kos.name}</h3>
                                <p className="text-sm text-slate-500">{kos.city} · {kos.type}</p>
                              </div>
                              <span className="bg-orange-100 text-orange-700 text-xs font-bold px-3 py-1 rounded-full">Menunggu Review</span>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-sm mb-4">
                              <div><span className="text-slate-500">Pemilik:</span> <span className="font-semibold text-slate-800">{kos.owner_name}</span></div>
                              <div><span className="text-slate-500">Harga:</span> <span className="font-semibold text-orange-500">{formatRupiah(kos.price)}/bln</span></div>
                              <div className="col-span-2"><span className="text-slate-500">Alamat:</span> <span className="font-semibold text-slate-800">{kos.address}</span></div>
                            </div>
                            {kos.facilities?.length > 0 && (
                              <div className="flex flex-wrap gap-1 mb-4">
                                {kos.facilities.slice(0, 5).map((f, i) => <span key={i} className="bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded">{f}</span>)}
                                {kos.facilities.length > 5 && <span className="bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded">+{kos.facilities.length - 5}</span>}
                              </div>
                            )}
                            <div className="flex gap-3">
                              <button onClick={() => handleApprove(kos)} className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2 rounded-xl font-bold text-sm transition-colors">
                                <Check className="w-4 h-4" /> Setujui
                              </button>
                              <button onClick={() => handleReject(kos)} className="flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 px-5 py-2 rounded-xl font-bold text-sm transition-colors border border-red-200">
                                <XCircle className="w-4 h-4" /> Tolak
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {/* Pagination Pengajuan */}
                {Math.ceil(pendingList.length / ITEMS_PER_PAGE) > 1 && (
                  <div className="flex items-center justify-between mt-4 px-2">
                    <p className="text-sm text-slate-500">
                      Menampilkan {((pendingPage - 1) * ITEMS_PER_PAGE) + 1}–{Math.min(pendingPage * ITEMS_PER_PAGE, pendingList.length)} dari {pendingList.length} pengajuan
                    </p>
                    <div className="flex items-center gap-2">
                      <button onClick={() => setPendingPage(p => Math.max(1, p - 1))} disabled={pendingPage === 1} className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      {Array.from({ length: Math.ceil(pendingList.length / ITEMS_PER_PAGE) }, (_, i) => i + 1).map(page => (
                        <button key={page} onClick={() => setPendingPage(page)} className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-semibold transition-colors ${pendingPage === page ? 'bg-orange-500 text-white' : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'}`}>
                          {page}
                        </button>
                      ))}
                      <button onClick={() => setPendingPage(p => Math.min(Math.ceil(pendingList.length / ITEMS_PER_PAGE), p + 1))} disabled={pendingPage === Math.ceil(pendingList.length / ITEMS_PER_PAGE)} className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-slate-100 sticky top-0 bg-white z-10">
              <h2 className="text-lg font-bold text-slate-900">{editingKos ? 'Edit Kos' : 'Tambah Kos Baru'}</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-100 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-5">
              <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Nama Kos</label><input required value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500" placeholder="Nama kos..." /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Tipe</label><select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))} className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-orange-500">{['Putra', 'Putri', 'Campur'].map(t => <option key={t}>{t}</option>)}</select></div>
                <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Kota</label><input required value={form.city} onChange={e => setForm(p => ({ ...p, city: e.target.value }))} className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500" placeholder="Kota..." /></div>
              </div>
              <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Alamat Lengkap</label><textarea required value={form.address} onChange={e => setForm(p => ({ ...p, address: e.target.value }))} rows={2} className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 resize-none" placeholder="Alamat..." /></div>
              <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Harga per Bulan (Rp)</label><input required type="number" value={form.price} onChange={e => setForm(p => ({ ...p, price: Number(e.target.value) }))} className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500" placeholder="1500000" /></div>
              <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Deskripsi</label><textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={3} className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 resize-none" placeholder="Deskripsi kos..." /></div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Fasilitas</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {FACILITIES_LIST.map(fac => (
                    <label key={fac} className={`flex items-center gap-2 p-2.5 border rounded-xl cursor-pointer text-sm transition-colors ${form.facilities.includes(fac) ? 'bg-orange-50 border-orange-400 text-orange-700 font-semibold' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                      <input type="checkbox" className="sr-only" checked={form.facilities.includes(fac)} onChange={() => toggleFacility(fac)} />{fac}
                    </label>
                  ))}
                </div>
              </div>
              <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Foto Kos</label><ImageUpload bucket="kos-images" folder="admin" maxFiles={5} existingUrls={form.images.filter((i: string) => i.trim() !== "")} onUploadComplete={(urls: string[]) => setForm((p: any) => ({ ...p, images: urls }))} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Nama Pemilik</label><input value={form.owner_name} onChange={e => setForm(p => ({ ...p, owner_name: e.target.value }))} className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500" placeholder="Nama pemilik..." /></div>
                <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">URL Avatar Pemilik</label><input value={form.owner_avatar} onChange={e => setForm(p => ({ ...p, owner_avatar: e.target.value }))} className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500" placeholder="https://..." /></div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl font-semibold transition-colors">Batal</button>
                <button type="submit" disabled={saving} className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-bold rounded-xl shadow transition-colors">{saving ? 'Menyimpan...' : editingKos ? 'Simpan Perubahan' : 'Tambah Kos'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Modal */}
      {confirmModal && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <div className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 ${confirmModal.type === 'danger' ? 'bg-red-100' : 'bg-orange-100'}`}>
              {confirmModal.type === 'danger'
                ? <Trash2 className="w-7 h-7 text-red-500" />
                : <XCircle className="w-7 h-7 text-orange-500" />}
            </div>
            <h3 className="text-lg font-bold text-slate-900 text-center mb-2">{confirmModal.title}</h3>
            <p className="text-sm text-slate-500 text-center mb-6 leading-relaxed">{confirmModal.message}</p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmModal(null)}
                className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={confirmModal.onConfirm}
                className={`flex-1 px-4 py-2.5 text-white font-bold rounded-xl transition-colors ${confirmModal.type === 'danger' ? 'bg-red-500 hover:bg-red-600' : 'bg-orange-500 hover:bg-orange-600'}`}
              >
                {confirmModal.type === 'danger' ? 'Ya, Hapus' : 'Ya, Tolak'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}