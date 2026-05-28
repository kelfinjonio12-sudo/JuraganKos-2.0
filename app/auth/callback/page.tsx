'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.push('/');
        router.refresh();
      } else {
        router.push('/login');
      }
    });
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-blue-500 font-bold">Memproses login...</p>
    </div>
  );
}