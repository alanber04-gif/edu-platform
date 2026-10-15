'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { LogOut, User, Menu, X, Home, BookOpen, Search, Library, Settings, ShieldCheck } from 'lucide-react';

const links = [
  { href: '/dashboard', label: 'لوحة التحكم', icon: Home },
  { href: '/courses', label: 'الدورات التعليمية', icon: BookOpen },
  { href: '/search', label: 'البحث عن دورة', icon: Search },
  { href: '/library', label: 'مكتبتي', icon: Library },
  { href: '/settings', label: 'الإعدادات', icon: Settings },
];

export default function Header({ profile, isOwner = false }: { profile: any; isOwner?: boolean }) {
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const supabase = createClient();
  const navLinks = isOwner ? [...links, { href: '/admin', label: 'إدارة المنصة', icon: ShieldCheck }] : links;

  async function handleLogout() {
    if (loggingOut) return;
    setLoggingOut(true);
    const { error } = await supabase.auth.signOut();
    if (error) {
      setLoggingOut(false);
      return;
    }
    router.replace('/login');
    router.refresh();
  }

  return (
    <>
      <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between border-b border-border bg-card/95 px-4 backdrop-blur sm:px-6">
        <button type="button" onClick={() => setMenuOpen(v => !v)} aria-label={menuOpen ? 'إغلاق القائمة' : 'فتح القائمة'} aria-expanded={menuOpen} className="grid size-10 place-items-center rounded-xl border hover:bg-accent md:hidden">
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
        <div className="mr-auto flex items-center gap-3">
          <div className="flex max-w-[55vw] items-center gap-2 truncate">
            <User className="size-5 shrink-0 text-primary" />
            <span className="truncate text-sm font-semibold">{profile?.full_name || profile?.email || 'حسابي'}</span>
            {isOwner && <span className="hidden rounded-full bg-primary/10 px-2 py-1 text-xs font-bold text-primary sm:inline">المالك</span>}
          </div>
          <button type="button" onClick={handleLogout} disabled={loggingOut} className="flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-semibold transition hover:bg-accent disabled:opacity-50" title="تسجيل الخروج">
            <LogOut size={16} /><span className="hidden sm:inline">{loggingOut ? 'جارٍ الخروج...' : 'خروج'}</span>
          </button>
        </div>
      </header>
      {menuOpen && <button type="button" aria-label="إغلاق القائمة" onClick={() => setMenuOpen(false)} className="fixed inset-16 z-30 bg-black/20 md:hidden" />}
      <nav aria-label="التنقل على الجوال" className={`fixed inset-x-0 top-16 z-40 border-b bg-card p-3 shadow-xl transition md:hidden ${menuOpen ? 'visible translate-y-0 opacity-100' : 'invisible -translate-y-2 opacity-0 pointer-events-none'}`}>
        <div className="space-y-1">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href || pathname.startsWith(item.href + '/');
            return <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)} className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold ${active ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'}`}><Icon size={18} />{item.label}</Link>;
          })}
        </div>
      </nav>
    </>
  );
}
