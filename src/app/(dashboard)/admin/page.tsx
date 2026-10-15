import { requireOwner } from '@/lib/owner';
import { createCourse, deleteCourse, toggleCoursePublished } from './actions';
import { BookOpen, PlusCircle, ShieldCheck } from 'lucide-react';

type AdminPageProps = {
  searchParams: Promise<{ error?: string; created?: string; updated?: string; deleted?: string }>;
};

export default async function AdminPage({ searchParams }: AdminPageProps) {
  const { supabase, user } = await requireOwner();
  const params = await searchParams;
  const { data: courses, error: coursesError } = await supabase
    .from('courses')
    .select('id, title, description, category, level, is_published, created_at')
    .order('created_at', { ascending: false });

  const messages: Record<string, string> = {
    title: 'أدخل اسم الدورة أولاً.',
    save: 'تعذر حفظ التغييرات. تحقق من صلاحيات قاعدة البيانات.',
    course: 'لم يتم تحديد الدورة.',
    delete: 'تعذر حذف الدورة. قد تكون مرتبطة بدروس أو تسجيلات.',
  };

  return (
    <div className="mx-auto max-w-6xl space-y-8 pb-10">
      <header className="rounded-3xl border bg-gradient-to-l from-primary/15 via-card to-card p-6 sm:p-8">
        <div className="flex items-start gap-4">
          <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-primary text-primary-foreground"><ShieldCheck size={27} /></span>
          <div><p className="text-sm font-bold text-primary">مساحة المالك</p><h1 className="mt-1 text-2xl font-black sm:text-3xl">إدارة منصة سهم</h1><p className="mt-2 text-sm leading-7 text-muted-foreground">إدارة الدورات والتحكم في نشرها. الحساب الحالي: {user.email}</p></div>
        </div>
      </header>

      {params.error && <p role="alert" className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">{messages[params.error] || 'حدث خطأ غير متوقع.'}</p>}
      {params.created && <p className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4 text-sm">تمت إضافة الدورة بنجاح.</p>}
      {params.updated && <p className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4 text-sm">تم تحديث حالة النشر.</p>}
      {params.deleted && <p className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4 text-sm">تم حذف الدورة.</p>}

      <section className="rounded-2xl border bg-card p-5 sm:p-7">
        <div className="mb-6 flex items-center gap-3"><PlusCircle className="text-primary" size={22} /><div><h2 className="text-xl font-extrabold">إضافة دورة جديدة</h2><p className="mt-1 text-sm text-muted-foreground">أدخل بيانات الدورة ثم انشرها أو اتركها مسودة.</p></div></div>
        <form action={createCourse} className="grid gap-5 md:grid-cols-2">
          <label className="space-y-2 text-sm font-semibold">اسم الدورة *
            <input name="title" required maxLength={180} className="w-full rounded-xl border bg-background px-4 py-3 outline-none focus:border-primary" placeholder="اسم الدورة" />
          </label>
          <label className="space-y-2 text-sm font-semibold">التصنيف
            <input name="category" maxLength={100} className="w-full rounded-xl border bg-background px-4 py-3 outline-none focus:border-primary" placeholder="التصنيف" />
          </label>
          <label className="space-y-2 text-sm font-semibold">المستوى
            <select name="level" defaultValue="مبتدئ" className="w-full rounded-xl border bg-background px-4 py-3 outline-none focus:border-primary"><option>مبتدئ</option><option>متوسط</option><option>متقدم</option><option>جميع المستويات</option></select>
          </label>
          <label className="space-y-2 text-sm font-semibold">رابط صورة الدورة (اختياري)
            <input name="thumbnail_url" type="url" className="w-full rounded-xl border bg-background px-4 py-3 outline-none focus:border-primary" placeholder="https://..." />
          </label>
          <label className="space-y-2 text-sm font-semibold md:col-span-2">وصف الدورة
            <textarea name="description" rows={4} maxLength={5000} className="w-full resize-y rounded-xl border bg-background px-4 py-3 outline-none focus:border-primary" placeholder="ماذا سيتعلم المتدرب في هذه الدورة؟" />
          </label>
          <label className="flex items-center gap-3 text-sm font-semibold md:col-span-2"><input type="checkbox" name="is_published" className="size-4 accent-primary" /> نشر الدورة فور الحفظ</label>
          <div className="md:col-span-2"><button className="rounded-xl bg-primary px-6 py-3 font-bold text-primary-foreground transition hover:opacity-90">حفظ الدورة</button></div>
        </form>
      </section>

      <section className="space-y-4">
        <div className="flex items-center gap-3"><BookOpen className="text-primary" size={22} /><h2 className="text-xl font-extrabold">الدورات الحالية ({courses?.length ?? 0})</h2></div>
        {coursesError ? <p className="rounded-xl border p-5 text-sm text-muted-foreground">تعذر تحميل الدورات. تحقق من إعداد قاعدة البيانات وصلاحياتها.</p> : courses && courses.length ? (
          <div className="space-y-3">{courses.map((course) => (
            <article key={course.id} className="flex flex-col gap-4 rounded-2xl border bg-card p-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><h3 className="font-extrabold">{course.title}</h3><span className={course.is_published ? 'rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-bold text-emerald-700' : 'rounded-full bg-muted px-2.5 py-1 text-xs font-bold text-muted-foreground'}>{course.is_published ? 'منشورة' : 'مسودة'}</span></div><p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{course.description || 'لا يوجد وصف'}</p><p className="mt-2 text-xs text-muted-foreground">{course.category || 'بدون تصنيف'} · {course.level || 'غير محدد'}</p></div>
              <div className="flex shrink-0 flex-wrap gap-2">
                <form action={toggleCoursePublished}><input type="hidden" name="id" value={course.id} /><input type="hidden" name="published" value={String(course.is_published)} /><button className="rounded-lg border px-3 py-2 text-sm font-semibold hover:bg-muted">{course.is_published ? 'إلغاء النشر' : 'نشر الدورة'}</button></form>
                <form action={deleteCourse}><input type="hidden" name="id" value={course.id} /><button className="rounded-lg border border-destructive/30 px-3 py-2 text-sm font-semibold text-destructive hover:bg-destructive/5">حذف</button></form>
              </div>
            </article>
          ))}</div>
        ) : <div className="rounded-2xl border border-dashed p-10 text-center text-sm text-muted-foreground">لا توجد دورات في قاعدة البيانات بعد. أضف أول دورة من النموذج أعلاه.</div>}
      </section>
    </div>
  );
}
