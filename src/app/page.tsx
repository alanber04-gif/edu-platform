import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, BookOpen, CheckCircle2, GraduationCap, Layers3, Sparkles } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) redirect('/dashboard');

  return (
    <main className="min-h-screen overflow-hidden bg-background text-foreground">
      <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
        <Link href="/" className="flex items-center gap-3" aria-label="منصة سهم - الرئيسية">
          <span className="grid size-11 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20"><GraduationCap size={24} /></span>
          <span className="text-lg font-extrabold tracking-tight">منصة <span className="text-primary">سهم</span></span>
        </Link>
        <nav className="flex items-center gap-2 sm:gap-3">
          <Link href="/login" className="rounded-xl px-4 py-2.5 text-sm font-semibold text-muted-foreground transition hover:bg-muted hover:text-foreground">تسجيل الدخول</Link>
          <Link href="/register" className="rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/15 transition hover:-translate-y-0.5 hover:opacity-90">ابدأ التعلّم <ArrowLeft className="mr-1 inline" size={15} /></Link>
        </nav>
      </header>

      <section className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 pb-20 pt-14 sm:px-8 sm:pb-28 sm:pt-20 lg:grid-cols-[1.08fr_.92fr] lg:gap-20">
        <div className="pointer-events-none absolute -right-28 top-10 size-80 rounded-full bg-primary/10 blur-3xl" />
        <div className="relative">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-4 py-2 text-sm font-semibold text-primary"><Sparkles size={16} /> تعلّم بتركيز، وتقدّم بثقة</div>
          <h1 className="max-w-2xl text-4xl font-black leading-[1.25] tracking-tight sm:text-5xl lg:text-6xl">طوّر مهاراتك،<br /><span className="text-primary">واصنع خطوتك القادمة.</span></h1>
          <p className="mt-6 max-w-xl text-base leading-8 text-muted-foreground sm:text-lg">منصة سهم مساحة تعليمية تجمع الدورات والدروس ومتابعة التقدّم في تجربة واحدة واضحة، مصممة لتجعل رحلتك في التعلّم أسهل وأكثر تنظيمًا.</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link href="/register" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-4 font-bold text-primary-foreground shadow-xl shadow-primary/20 transition hover:-translate-y-0.5 hover:opacity-90">أنشئ حسابك الآن <ArrowLeft size={18} /></Link>
            <Link href="/login" className="inline-flex items-center justify-center rounded-2xl border border-border bg-card px-6 py-4 font-bold transition hover:bg-muted">لدي حساب بالفعل</Link>
          </div>
          <div className="mt-8 flex flex-wrap gap-x-5 gap-y-3 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-2"><CheckCircle2 size={17} className="text-primary" /> تابع تقدّمك</span>
            <span className="inline-flex items-center gap-2"><CheckCircle2 size={17} className="text-primary" /> تعلّم حسب وقتك</span>
            <span className="inline-flex items-center gap-2"><CheckCircle2 size={17} className="text-primary" /> تجربة عربية</span>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-xl">
          <div className="absolute -left-5 -top-5 size-28 rounded-3xl border border-primary/15 bg-primary/5" />
          <div className="absolute -bottom-7 -right-5 size-32 rounded-full bg-primary/10 blur-2xl" />
          <div className="relative rounded-[2rem] border border-border/80 bg-card p-4 shadow-2xl shadow-slate-900/10 sm:p-6">
            <div className="flex items-center justify-between border-b border-border pb-5">
              <div><p className="text-xs font-semibold text-muted-foreground">مساحة التعلّم</p><h2 className="mt-1 text-lg font-extrabold">خطتك تبدأ هنا</h2></div>
              <span className="grid size-12 place-items-center rounded-2xl bg-primary/10 text-primary"><Layers3 size={23} /></span>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-muted/70 p-4"><span className="grid size-10 place-items-center rounded-xl bg-card text-primary shadow-sm"><BookOpen size={20} /></span><p className="mt-4 font-bold">دوراتك</p><p className="mt-1 text-sm leading-6 text-muted-foreground">اكتشف المحتوى المتاح وابدأ من حيث يناسبك.</p></div>
              <div className="rounded-2xl bg-primary p-4 text-primary-foreground"><span className="grid size-10 place-items-center rounded-xl bg-white/15"><CheckCircle2 size={20} /></span><p className="mt-4 font-bold">تقدّم واضح</p><p className="mt-1 text-sm leading-6 text-primary-foreground/75">تابع إنجازك وارجع إلى دروسك بسهولة.</p></div>
            </div>
            <div className="mt-3 rounded-2xl border border-border p-4">
              <div className="flex items-center gap-3"><span className="grid size-11 place-items-center rounded-xl bg-muted text-primary"><GraduationCap size={22} /></span><div><p className="font-bold">تعلّم على طريقتك</p><p className="mt-1 text-sm text-muted-foreground">واجهة منظمة على الجوال والكمبيوتر</p></div></div>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-muted"><div className="h-full w-2/3 rounded-full bg-primary" /></div>
              <p className="mt-2 text-xs text-muted-foreground">ابدأ بتسجيل الدخول للوصول إلى مساحتك التعليمية</p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-muted/35">
        <div className="mx-auto grid max-w-7xl gap-6 px-5 py-10 sm:grid-cols-3 sm:px-8 sm:py-12">
          {[{icon:BookOpen,title:'محتوى منظّم',text:'انتقل بين الدورات والوحدات والدروس بسهولة.'},{icon:CheckCircle2,title:'متابعة مستمرة',text:'ارجع إلى نشاطك وتابع تعلّمك من لوحة واحدة.'},{icon:Sparkles,title:'تجربة بسيطة',text:'واجهة عربية واضحة تركز على ما تحتاجه.'}].map((item) => <div key={item.title} className="flex gap-4"><span className="grid size-12 shrink-0 place-items-center rounded-2xl border border-border bg-card text-primary shadow-sm"><item.icon size={22} /></span><div><h3 className="font-extrabold">{item.title}</h3><p className="mt-1 text-sm leading-6 text-muted-foreground">{item.text}</p></div></div>)}
        </div>
      </section>
      <footer className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-7 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-8"><span>© {new Date().getFullYear()} منصة سهم</span><span>رحلتك التعليمية تبدأ بخطوة</span></footer>
    </main>
  );
}