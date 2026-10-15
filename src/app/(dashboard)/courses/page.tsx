import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { BookOpen, Search, GraduationCap } from 'lucide-react';

export default async function CoursesPage() {
  const supabase = await createClient();
  const { data: courses, error } = await supabase
    .from('courses')
    .select('id, title, description, category, level, thumbnail_url, created_at')
    .eq('is_published', true)
    .order('created_at', { ascending: false });

  return (
    <div className="mx-auto max-w-7xl space-y-7 pb-10">
      <header className="flex flex-col gap-4 rounded-3xl border bg-gradient-to-l from-primary/10 via-card to-card p-6 sm:flex-row sm:items-end sm:justify-between sm:p-8">
        <div>
          <p className="text-sm font-bold text-primary">تعلّم وتقدّم</p>
          <h1 className="mt-2 text-3xl font-black">الدورات التعليمية</h1>
          <p className="mt-2 text-sm leading-7 text-muted-foreground">تصفح الدورات المنشورة وافتح الدورة للوصول إلى محتواها ودروسها.</p>
        </div>
        <Link href="/search" className="inline-flex items-center justify-center gap-2 rounded-xl border bg-card px-4 py-3 text-sm font-bold transition hover:bg-accent"><Search size={17} /> ابحث عن دورة</Link>
      </header>

      {error ? (
        <div role="alert" className="rounded-2xl border border-destructive/30 p-6 text-sm text-destructive">تعذر تحميل الدورات من قاعدة البيانات. تحقق من إعدادات Supabase وصلاحيات القراءة ثم أعد المحاولة.</div>
      ) : courses && courses.length > 0 ? (
        <>
          <p className="text-sm text-muted-foreground">عدد الدورات المتاحة: {courses.length}</p>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <Link key={course.id} href={`/courses/${course.id}`} className="group flex h-full flex-col overflow-hidden rounded-2xl border bg-card transition duration-200 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                <div className="relative flex aspect-[16/9] items-center justify-center overflow-hidden bg-gradient-to-br from-primary/15 via-muted to-primary/5">
                  {course.thumbnail_url ? <img src={course.thumbnail_url} alt={`صورة دورة ${course.title}`} loading="lazy" className="size-full object-cover transition duration-300 group-hover:scale-105" /> : <div className="flex flex-col items-center gap-2 text-primary/70"><GraduationCap size={40} /><span className="text-xs font-semibold">منصة سهم</span></div>}
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <div className="mb-3 flex flex-wrap gap-2">
                    {course.category && <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">{course.category}</span>}
                    {course.level && <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">{course.level}</span>}
                  </div>
                  <h2 className="text-lg font-extrabold transition group-hover:text-primary">{course.title}</h2>
                  <p className="mt-2 line-clamp-3 flex-1 text-sm leading-7 text-muted-foreground">{course.description || 'افتح الدورة للاطلاع على تفاصيلها والدروس المتاحة.'}</p>
                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-primary"><BookOpen size={16} /> عرض الدورة</span>
                </div>
              </Link>
            ))}
          </div>
        </>
      ) : (
        <div className="rounded-3xl border border-dashed px-6 py-14 text-center">
          <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-primary/10 text-primary"><BookOpen size={26} /></span>
          <h2 className="mt-4 text-xl font-extrabold">لا توجد دورات منشورة حاليًا</h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-7 text-muted-foreground">عند نشر الدورات ستظهر هنا. يمكنك البحث عن دورة أو العودة لاحقًا.</p>
          <Link href="/search" className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-bold text-primary-foreground"><Search size={16} /> البحث عن دورة</Link>
        </div>
      )}
    </div>
  );
}
