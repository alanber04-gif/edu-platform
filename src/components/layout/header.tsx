'use client';

import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { LogOut, User } from 'lucide-react';

export default function Header({ profile }: { profile: any }) {
  const router = useRouter();
  const supabase = createClient();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  }

  return (
    <header className="h-16 border-b flex items-center justify-between px-6 bg-card">
      <div className="md:hidden">
        {/* Mobile menu trigger would go here */}
      </div>
      <div className="flex items-center gap-4 mr-auto">
        <div className="flex items-center gap-2">
          <User className="h-5 w-5" />
          <span className="text-sm">{profile?.full_name || profile?.email}</span>
        </div>
        <button
          onClick={handleLogout}
          className="p-2 hover:bg-accent rounded-md"
          title="تسجيل الخروج"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}