import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    redirect('/dashboard');
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 bg-gradient-to-br from-background to-muted">
      <div className="max-w-2xl text-center space-y-6">
        <h1 className="text-5xl font-bold tracking-tight">منصة التعلم الاحترافية</h1>
        <p className="text-xl text-muted-foreground">
          منصة تعليمية متكاملة بتصميم عصري وتجربة استخدام فخمة
        </p>
        <div className="flex gap-4 justify-center pt-4">
          <a
            href="/login"
            className="px-8 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition"
          >
            تسجيل الدخول
          </a>
          <a
            href="/register"
            className="px-8 py-3 border border-border rounded-lg font-medium hover:bg-accent transition"
          >
            إنشاء حساب
          </a>
        </div>
      </div>
    </main>
  );
}