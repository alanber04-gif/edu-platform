'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useTheme } from 'next-themes';

export default function SettingsPage() {
  const [profile, setProfile] = useState<any>(null);
  const [fullName, setFullName] = useState('');
  const { theme, setTheme } = useTheme();
  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        setProfile(data);
        setFullName(data?.full_name || '');
      }
    }
    load();
  }, []);

  async function updateProfile() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from('profiles').update({ full_name: fullName }).eq('id', user.id);
  }

  return (
    <div className="max-w-2xl space-y-8">
      <h1 className="text-3xl font-bold">الإعدادات</h1>

      <div className="bg-card p-6 rounded-xl border space-y-4">
        <h2 className="font-semibold">الملف الشخصي</h2>
        <div>
          <label className="block text-sm mb-1">الاسم الكامل</label>
          <input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full px-3 py-2 border rounded-md bg-background"
          />
        </div>
        <button
          onClick={updateProfile}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
        >
          حفظ التغييرات
        </button>
      </div>

      <div className="bg-card p-6 rounded-xl border space-y-4">
        <h2 className="font-semibold">المظهر</h2>
        <div className="flex gap-2">
          {['light', 'dark', 'system'].map((t) => (
            <button
              key={t}
              onClick={() => setTheme(t)}
              className={`px-4 py-2 rounded-md border ${theme === t ? 'bg-primary text-primary-foreground' : ''}`}
            >
              {t === 'light' ? 'فاتح' : t === 'dark' ? 'داكن' : 'تلقائي'}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}