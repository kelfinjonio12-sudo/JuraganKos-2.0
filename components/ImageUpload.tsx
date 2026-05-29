'use client';

import { useState, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';
import { Upload, X, Loader2 } from 'lucide-react';

type Props = {
  bucket: string;
  folder?: string;
  existingUrls?: string[];
  onUploadComplete: (urls: string[]) => void;
  maxFiles?: number;
  className?: string;
};

export default function ImageUpload({ bucket, folder = '', existingUrls = [], onUploadComplete, maxFiles = 5, className = '' }: Props) {
  const [previews, setPreviews] = useState<string[]>(existingUrls);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList) => {
    setError('');
    const validFiles = Array.from(files).filter(f => {
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(f.type)) {
        setError('Format harus JPG, PNG, atau WebP');
        return false;
      }
      if (f.size > 5 * 1024 * 1024) {
        setError('Ukuran file maksimal 5MB');
        return false;
      }
      return true;
    });

    if (previews.length + validFiles.length > maxFiles) {
      setError(`Maksimal ${maxFiles} foto`);
      return;
    }

    setUploading(true);
    const uploadedUrls: string[] = [];

    for (const file of validFiles) {
      const ext = file.name.split('.').pop();
      const fileName = `${folder ? folder + '/' : ''}${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { data, error } = await supabase.storage.from(bucket).upload(fileName, file, { upsert: true });
      if (error) {
        setError('Gagal upload: ' + error.message);
        continue;
      }
      const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(data.path);
      uploadedUrls.push(publicUrl);
    }

    const newPreviews = [...previews, ...uploadedUrls];
    setPreviews(newPreviews);
    onUploadComplete(newPreviews);
    setUploading(false);
  };

  const handleRemove = async (url: string, index: number) => {
    // Hapus dari storage kalau bukan URL eksternal
    if (url.includes('supabase')) {
      const path = url.split(`${bucket}/`)[1];
      if (path) await supabase.storage.from(bucket).remove([path]);
    }
    const newPreviews = previews.filter((_, i) => i !== index);
    setPreviews(newPreviews);
    onUploadComplete(newPreviews);
  };

  return (
    <div className={className}>
      {/* Preview Grid */}
      {previews.length > 0 && (
        <div className="grid grid-cols-3 gap-3 mb-3">
          {previews.map((url, i) => (
            <div key={i} className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 group">
              <Image src={url} alt={`Preview ${i + 1}`} fill className="object-cover" referrerPolicy="no-referrer" />
              <button
                type="button"
                onClick={() => handleRemove(url, i)}
                className="absolute top-1.5 right-1.5 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow"
              >
                <X className="w-3.5 h-3.5" />
              </button>
              {i === 0 && <span className="absolute bottom-1.5 left-1.5 bg-orange-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">Utama</span>}
            </div>
          ))}
        </div>
      )}

      {/* Upload Area */}
      {previews.length < maxFiles && (
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={e => e.preventDefault()}
          onDrop={e => { e.preventDefault(); handleFiles(e.dataTransfer.files); }}
          className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:bg-blue-50 hover:border-blue-300 transition-colors cursor-pointer"
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
              <p className="text-sm text-blue-600 font-semibold">Mengupload...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Upload className="w-6 h-6 text-blue-500" />
              </div>
              <p className="font-semibold text-gray-700 text-sm">Klik atau drag foto ke sini</p>
              <p className="text-xs text-gray-400">JPG, PNG, WebP · Maks. 5MB · {previews.length}/{maxFiles} foto</p>
            </div>
          )}
        </div>
      )}

      <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" multiple className="hidden" onChange={e => e.target.files && handleFiles(e.target.files)} />

      {error && <p className="text-red-500 text-xs mt-2 font-medium">{error}</p>}
    </div>
  );
}