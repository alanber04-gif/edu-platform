'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BookOpen, Library, Settings, GraduationCap, Search, Sparkles, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/dashboard', label: 'لوحة التحكم', icon: Home },
  { href: '/courses', label: 'الدورات التعليمية', icon: BookOpen },
  { href: '/search', label: 'البحث', icon: Search },
  { href: '/library', label: 'مكتبتي', icon: Library },
  { href: '/settings', label: 'الإعدادات', icon: Settings },
];

export default function Sidebar({ isOwner = false }: { isOwner?: boolean }) {
  const pathname = usePathname();
  const items = isOwner ? [...navItems, { href: '/admin', label: 'إدارة المنصة', icon: ShieldCheck }] : navItems;

  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-l border-border/80 bg-card/95 backdrop-blur md:flex">
      <Link href="/dashboard" className="flex items-center gap-3 border-b border-border/80 px-5 py-6">
        <span className="grid size-11 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20"><GraduationCap size={24} /></span>
        <span><span className="block text-base font-black tracking-tight">منصة سهم</span><span className="mt-0.5 block text-xs text-muted-foreground">مساحتك التعليمية</span></span>
      </Link>
      <div className="px-4 pt-7"><p className="mb-3 px-3 text-[11px] font-extrabold tracking-widest text-muted-foreground">القائمة الرئيسية</p>
        <nav className="space-y-1.5">
          {items.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href || pathname.startsWith(item.href + '/');
            return <Link key={item.href} href={item.href} aria-current={active ? 'page' : undefined} className={cn('group flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-semibold transition-all', active ? 'bg-primary text-primary-foreground shadow-md shadow-primary/15' : 'text-muted-foreground hover:bg-muted hover:text-foreground')}><Icon size={18} className={cn('shrink-0 transition-transform group-hover:scale-105', active ? 'text-primary-foreground' : 'text-muted-foreground')} />{item.label}{active && <span className="mr-auto size-1.5 rounded-full bg-primary-foreground" />}</Link>;
          })}
        </nav>
      </div>
      <div className="mt-auto p-4"><div className="rounded-2xl border border-primary/10 bg-primary/5 p-4"><span className="grid size-9 place-items-center rounded-xl bg-primary/10 text-primary"><Sparkles size={18} /></span><p className="mt-3 text-sm font-extrabold">خطوة جديدة كل يوم</p><p className="mt-1 text-xs leading-5 text-muted-foreground">خصص وقتًا للتعلّم وواصل التقدّم نحو أهدافك.</p></div><p className="px-1 pt-4 text-center text-[11px] text-muted-foreground">منصة سهم · التعلّم مستمر</p></div>
    </aside>
  );
}