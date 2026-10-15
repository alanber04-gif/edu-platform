import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Clock3, GraduationCap, Sparkles } from 'lucide-react';

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const [{ data: progress }, { data: courses }] = await Promise.all([
    supabase.from('lesson_progress').select('*, lessons(title, modules(courses(title)))').eq('user_id', user?.id).order('updated_at', { ascending: false }).limit(5),
    supabase.from('courses').select('*').eq('is_published', true).order('created_at', { ascending: false }).limit(6),
  ]);

  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'متعلّم';
  const courseCount = courses?.length ?? 0;
  const recentLesson = progress?.[0]?.lessons?.title;

  return (
    <div className="mx-auto max-w-7xl space-y-8 pb-8">
      <section className="relative overflow-hidden rounded-3xl bg-primary px-6 py-8 text-primary-foreground shadow-xl shadow-primary/15 sm:px-9 sm:py-10">
        <div className="absolute -left-10 -top-20 size-64 rounded-full bg-white/10 blur-3xl" />
        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold"><Sparkles size={14} /> مساحتك التعليمية</div>
            <h1 className="text-2xl font-black sm:text-3xl">أهلًا {displayName} 👋</h1>
            <p className="mt-3 max-w-xl text-sm leading-7 text-primary-foreground/80 sm:text-base">واصل رحلتك التعليمية خطوة بخطوة. اختر دورة، تعلّم شيئًا جديدًا، وتابع نشاطك من مكان واحد.</p>
          </div>
          <Link href="/courses" className="inline-flex shrink-0 items-center justify-center gap-2 self-start rounded-xl bg-white px-5 py-3 text-sm font-bold text-slate-900 transition hover:-translate-y-0.5 hover:bg-white/90">استكشف الدورات <ArrowLeft size={16} /></Link>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border bg-card p-5 shadow-sm sm:p-6">
          <div className="flex items-start justify-between"><span className="text-sm font-semibold text-muted-foreground">الدورات المنشورة</span><span className="grid size-11 place-items-center rounded-xl bg-primary/10 text-primary"><BookOpen size={21} /></span></div>
          <p className="mt-4 text-3xl font-black tracking-tight">{courseCount}</p>
          <p className="mt-1 text-sm text-muted-foreground">دورات متاحة حاليًا في المنصة</p>
        </div>
        <div className="rounded-2xl border bg-card p-5 shadow-sm sm:p-6">
          <div className="flex items-start justify-between"><span className="text-sm font-semibold text-muted-foreground">آخر درس تابعتَه</span><span className="grid size-11 place-items-center rounded-xl bg-amber-500/10 text-amber-600"><Clock3 size={21} /></span></div>
          <p className="mt-4 line-clamp-1 text-xl font-extrabold">{recentLesson || 'لم يبدأ النشاط بعد'}</p>
          <p className="mt-1 text-sm text-muted-foreground">{recentLesson ? 'يمكنك متابعة رحلتك التعليمية' : 'ابدأ دورة لتظهر أنشطتك هنا'}</p>
        </div>
      </section>

      <section>
        <div className="mb-5 flex items-end justify-between gap-3">
          <div><p className="text-xs font-bold tracking-wide text-primary">اكتشف وتعلّم</p><h2 className="mt-1 text-xl font-black sm:text-2xl">الدورات المتاحة</h2><p className="mt-1 text-sm text-muted-foreground">محتوى منشور من قاعدة بيانات المنصة</p></div>
          <Link href="/courses" className="inline-flex items-center gap-1 whitespace-nowrap text-sm font-bold text-primary hover:underline">عرض الكل <ArrowLeft size={15} /></Link>
        </div>
        {courses && courses.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {courses.map((course) => (
              <Link key={course.id} href={`/courses/${course.id}`} className="group overflow-hidden rounded-2xl border bg-card transition duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-900/5">
                <div className="relative flex aspect-[16/7] items-center justify-center overflow-hidden bg-gradient-to-br from-primary/15 via-muted to-primary/5">
                  {course.thumbnail_url ? <img src={course.thumbnail_url} alt="" className="size-full object-cover transition duration-500 group-hover:scale-105" /> : <GraduationCap size={42} className="text-primary/60" />}
                  {course.category && <span className="absolute right-3 top-3 rounded-full border border-white/40 bg-card/90 px-3 py-1 text-xs font-bold backdrop-blur">{course.category}</span>}
                </div>
                <div className="p-5">
                  <div className="mb-2 flex items-center justify-between gap-2"><span className="text-xs font-semibold text-muted-foreground">{course.level || 'دورة تعليمية'}</span><ArrowLeft size={16} className="text-muted-foreground transition group-hover:-translate-x-1 group-hover:text-primary" /></div>
                  <h3 className="line-clamp-1 text-lg font-extrabold">{course.title}</h3>
                  <p className="mt-2 line-clamp-2 min-h-12 text-sm leading-6 text-muted-foreground">{course.description || 'اكتشف محتوى هذه الدورة وتفاصيلها.'}</p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed bg-card px-5 py-12 text-center">
            <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-muted text-muted-foreground"><BookOpen size={24} /></span>
            <h3 className="mt-4 font-bold">لا توجد دورات منشورة حاليًا</h3>
            <p className="mt-2 text-sm text-muted-foreground">عند نشر دورة في قاعدة البيانات ستظهر هنا تلقائيًا.</p>
          </div>
        )}
      </section>
    </div>
  );
}