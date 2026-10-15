'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useTheme } from 'next-themes';

export default function SettingsPage() {
  const [profile, setProfile] = useState<any>(null);
  const [fullName, setFullName] = useState('');
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
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
    if (saving) return;
    setSaving(true);
    setNotice(null);
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        setNotice({ type: 'error', text: 'انتهت الجلسة. سجّل الدخول مجددًا.' });
        return;
      }
      const { error } = await supabase.from('profiles').update({ full_name: fullName.trim() }).eq('id', user.id);
      if (error) {
        setNotice({ type: 'error', text: 'تعذر حفظ التغييرات. تحقق من اتصال قاعدة البيانات وصلاحيات الملف الشخصي.' });
        return;
      }
      setProfile((current: any) => current ? { ...current, full_name: fullName.trim() } : current);
      setNotice({ type: 'success', text: 'تم حفظ التغييرات بنجاح.' });
    } catch {
      setNotice({ type: 'error', text: 'حدث خطأ أثناء الحفظ. حاول مرة أخرى.' });
    } finally {
      setSaving(false);
    }
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
        {notice && <p role="status" className={notice.type === 'success' ? 'text-sm text-emerald-600' : 'text-sm text-destructive'}>{notice.text}</p>}
        <button
          type="button"
          onClick={updateProfile}
          disabled={saving}
          className="rounded-xl bg-primary px-5 py-3 font-semibold text-primary-foreground transition hover:opacity-90 disabled:cursor-wait disabled:opacity-50"
        >
          {saving ? 'جارٍ الحفظ...' : 'حفظ التغييرات'}
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