'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { formatRupiah } from '@/lib/data';
import Image from 'next/image';
import Link from 'next/link';
import { User, Phone, Mail, Heart, LogOut, Save, MapPin, Star, Camera, Loader2 } from 'lucide-react';

type Profile = { id: string; full_name: string; avatar_url: string; phone: string; };
type FavoriteKos = { id: string; kos: { id: string; name: string; city: string; price: number; images: string[]; type: string; rating: number; }; };

export default function ProfilPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [favorites, setFavorites] = useState<FavoriteKos[]>([]);
  const [activeTab, setActiveTab] = useState('profil');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const avatarInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { router.push('/login'); return; }
      setUser(user);
      fetchProfile(user.id);
      fetchFavorites(user.id);
      setLoading(false);
    });
  }, []);

  const fetchProfile = async (userId: string) => {
    const { data } = await supabase.from('profiles').select('*').eq('id', userId).single();
    if (data) {
      setProfile(data);
      setFullName(data.full_name || '');
      setPhone(data.phone || '');
      setAvatarUrl(data.avatar_url || '');
    }
  };

  const fetchFavorites = async (userId: string) => {
    const { data } = await supabase
      .from('favorites')
      .select('id, kos:kos_id(id, name, city, price, images, type, rating)')
      .eq('user_id', userId);
    if (data) setFavorites(data as any);
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      alert('Format harus JPG, PNG, atau WebP');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('Ukuran file maksimal 5MB');
      return;
    }
    setUploadingAvatar(true);
    const ext = file.name.split('.').pop();
    const fileName = `${user.id}/avatar.${ext}`;
    const { data, error } = await supabase.storage.from('avatars').upload(fileName, file, { upsert: true });
    if (error) { alert('Gagal upload: ' + error.message); setUploadingAvatar(false); return; }
    const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(data.path);
    await supabase.from('profiles').update({ avatar_url: publicUrl }).eq('id', user.id);
    setAvatarUrl(publicUrl);
    setUploadingAvatar(false);
    showSuccess('Foto profil berhasil diperbarui!');
  };

  const handleSaveProfil = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await supabase.from('profiles').update({ full_name: fullName, phone }).eq('id', user.id);
    showSuccess('Profil berhasil disimpan!');
    setSaving(false);
  };

  const handleUnfavorite = async (favoriteId: string) => {
    await supabase.from('favorites').delete().eq('id', favoriteId);
    setFavorites(prev => prev.filter(f => f.id !== favoriteId));
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const displayAvatar = avatarUrl || user?.user_metadata?.avatar_url;
  const displayName = fullName || user?.email || 'U';

  if (loading) return <div className="min-h-[70vh] flex items-center justify-center"><p className="text-blue-500 font-bold">Memuat...</p></div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">

      {successMsg && (
        <div className="fixed top-6 right-6 z-50 bg-emerald-500 text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-2 font-semibold">
          <Save className="w-5 h-5" /> {successMsg}
        </div>
      )}

      {/* Header Profil */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6 flex flex-col sm:flex-row items-center gap-6">
        <div className="relative">
          <div className="w-20 h-20 rounded-full overflow-hidden bg-gradient-to-br from-blue-400 to-orange-400 flex items-center justify-center shrink-0">
            {displayAvatar ? (
              <Image src={displayAvatar} alt="Avatar" width={80} height={80} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            ) : (
              <span className="text-white text-2xl font-bold">{displayName.charAt(0).toUpperCase()}</span>
            )}
          </div>
          {/* Tombol ganti foto */}
          <button
            onClick={() => avatarInputRef.current?.click()}
            disabled={uploadingAvatar}
            className="absolute -bottom-1 -right-1 w-7 h-7 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center shadow-lg transition-colors"
          >
            {uploadingAvatar ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Camera className="w-3.5 h-3.5" />}
          </button>
          <input ref={avatarInputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleAvatarUpload} />
        </div>
        <div className="flex-1 text-center sm:text-left">
          <h1 className="text-xl font-bold text-gray-900">{displayName}</h1>
          <p className="text-gray-500 text-sm">{user?.email}</p>
          <p className="text-xs text-gray-400 mt-1">Klik ikon kamera untuk ganti foto profil</p>
          <div className="flex items-center gap-4 mt-2 justify-center sm:justify-start text-sm text-gray-500">
            <span className="flex items-center gap-1"><Heart className="w-4 h-4 text-red-400" /> {favorites.length} Favorit</span>
          </div>
        </div>
        <button onClick={handleLogout} className="flex items-center gap-2 text-red-500 hover:bg-red-50 px-4 py-2 rounded-xl font-semibold text-sm transition-colors border border-red-100">
          <LogOut className="w-4 h-4" /> Keluar
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 bg-gray-100 p-1 rounded-xl">
        {[
          { id: 'profil', label: 'Edit Profil', icon: User },
          { id: 'favorit', label: 'Favorit', icon: Heart },
        ].map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setActiveTab(id)} className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg font-semibold text-sm transition-colors ${activeTab === id ? 'bg-white shadow text-blue-700' : 'text-gray-500 hover:text-gray-700'}`}>
            <Icon className="w-4 h-4" /> {label}
          </button>
        ))}
      </div>

      {/* Tab: Edit Profil */}
      {activeTab === 'profil' && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-bold text-gray-900 text-lg mb-6">Informasi Pribadi</h2>
          <form onSubmit={handleSaveProfil} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Nama Lengkap</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input value={fullName} onChange={e => setFullName(e.target.value)} className="w-full border border-gray-200 rounded-xl pl-11 pr-4 py-3 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" placeholder="Nama lengkap kamu" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input value={user?.email} disabled className="w-full border border-gray-200 rounded-xl pl-11 pr-4 py-3 outline-none bg-gray-50 text-gray-400 cursor-not-allowed" />
              </div>
              <p className="text-xs text-gray-400 mt-1">Email tidak bisa diubah</p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Nomor WhatsApp</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} className="w-full border border-gray-200 rounded-xl pl-11 pr-4 py-3 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" placeholder="081234567890" />
              </div>
            </div>
            <button type="submit" disabled={saving} className="flex items-center gap-2 bg-blue-900 hover:bg-blue-800 disabled:opacity-60 text-white font-bold px-6 py-3 rounded-xl transition-colors">
              <Save className="w-4 h-4" /> {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
          </form>
        </div>
      )}

      {/* Tab: Favorit */}
      {activeTab === 'favorit' && (
        <div>
          {favorites.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-16 text-center">
              <Heart className="w-12 h-12 text-gray-200 mx-auto mb-4" />
              <p className="font-bold text-gray-500 mb-1">Belum ada kos favorit</p>
              <p className="text-sm text-gray-400 mb-6">Simpan kos yang kamu suka untuk dilihat nanti</p>
              <Link href="/search" className="bg-blue-900 text-white font-bold px-6 py-2.5 rounded-xl hover:bg-blue-800 transition-colors">Cari Kos</Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {favorites.map((fav) => (
                <div key={fav.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden group">
                  <div className="relative h-40 bg-gray-200">
                    {fav.kos?.images?.[0] && <Image src={fav.kos.images[0]} alt={fav.kos.name} fill className="object-cover group-hover:scale-105 transition-transform duration-300" referrerPolicy="no-referrer" />}
                    <button onClick={() => handleUnfavorite(fav.id)} className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow hover:bg-red-50 transition-colors">
                      <Heart className="w-4 h-4 text-red-500 fill-current" />
                    </button>
                    <span className="absolute top-3 left-3 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-lg">{fav.kos?.type}</span>
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-1">
                      <Link href={`/kos/${fav.kos?.id}`} className="font-bold text-gray-900 hover:text-blue-600 transition-colors line-clamp-1">{fav.kos?.name}</Link>
                      <div className="flex items-center gap-1 text-sm text-blue-700 font-bold shrink-0 ml-2">
                        <Star className="w-3.5 h-3.5 fill-current" /> {fav.kos?.rating}
                      </div>
                    </div>
                    <p className="text-gray-500 text-sm flex items-center gap-1 mb-3"><MapPin className="w-3.5 h-3.5" />{fav.kos?.city}</p>
                    <p className="font-bold text-orange-500">{formatRupiah(fav.kos?.price)}<span className="text-xs font-normal text-gray-400">/bln</span></p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}