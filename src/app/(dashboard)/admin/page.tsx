import { requirePlatformStaff } from '@/lib/owner';
import { createCourse, deleteCourse, toggleCoursePublished, createModule, createLesson, updateLessonVideo, grantModerator, revokeModerator } from './actions';
import Link from 'next/link';
import { BookOpen, PlusCircle, ShieldCheck, Users } from 'lucide-react';

type AdminPageProps = {
  searchParams: Promise<{ error?: string; created?: string; updated?: string; deleted?: string; moduleCreated?: string; lessonCreated?: string; videoUpdated?: string; moderatorAdded?: string; moderatorRemoved?: string }>;
};

export default async function AdminPage({ searchParams }: AdminPageProps) {
  const { supabase, user, isOwner } = await requirePlatformStaff();
  const params = await searchParams;
  const { data: courses, error: coursesError } = await supabase
    .from('courses')
    .select('id, title, description, category, level, is_published, created_at, modules(id, title, lessons(id, title, video_url))')
    .order('created_at', { ascending: false });

  const { data: moderators } = await supabase.from('platform_moderators').select('user_id, created_at').order('created_at', { ascending: false });

  const messages: Record<string, string> = {
    title: 'أدخل اسم الدورة أولاً.',
    save: 'تعذر حفظ التغييرات. تحقق من صلاحيات قاعدة البيانات.',
    course: 'لم يتم تحديد الدورة.',
    delete: 'تعذر حذف الدورة. قد تكون مرتبطة بدروس أو تسجيلات.',
    module: 'تعذر إضافة الوحدة. تحقق من إعداد قاعدة البيانات.',
    lesson: 'تعذر إضافة الدرس أو تحديثه. تحقق من إعداد قاعدة البيانات.',
    video: 'رابط الفيديو يجب أن يبدأ بـ https:// أو http://.',
    moderator: 'تعذر تغيير الصلاحية. تأكد من صحة معرّف المستخدم وأنه مسجل في المنصة.',
    self: 'لا يمكنك تغيير صلاحية حساب المالك نفسه.',
  };

  return (
    <div className="mx-auto max-w-6xl space-y-8 pb-10">
      <header className="rounded-3xl border bg-gradient-to-l from-primary/15 via-card to-card p-6 sm:p-8">
        <div className="flex items-start gap-4">
          <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-primary text-primary-foreground"><ShieldCheck size={27} /></span>
          <div><p className="text-sm font-bold text-primary">مساحة المالك</p><h1 className="mt-1 text-2xl font-black sm:text-3xl">إدارة منصة سهم</h1><p className="mt-2 text-sm leading-7 text-muted-foreground">{isOwner ? 'إدارة الدورات والصلاحيات ومحتوى الدروس.' : 'إدارة محتوى الدروس والفيديوهات.'} الحساب الحالي: {user.email}</p>{isOwner && <Link href="/admin/users" className="mt-4 inline-flex items-center gap-2 rounded-xl border bg-background px-4 py-2.5 text-sm font-bold transition hover:bg-muted"><Users size={17} /> المستخدمون وصلاحيات الإشراف</Link>}</div>
        </div>
      </header>

      {params.error && <p role="alert" className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">{messages[params.error] || 'حدث خطأ غير متوقع.'}</p>}
      {params.created && <p className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4 text-sm">تمت إضافة الدورة بنجاح.</p>}
      {params.updated && <p className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4 text-sm">تم تحديث حالة النشر.</p>}
      {params.deleted && <p className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4 text-sm">تم حذف الدورة.</p>}
      {(params.moduleCreated || params.lessonCreated || params.videoUpdated || params.moderatorAdded || params.moderatorRemoved) && <p className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4 text-sm">تم حفظ التغيير بنجاح.</p>}

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

      <section className="rounded-2xl border bg-card p-5 sm:p-7">
        <h2 className="text-xl font-extrabold">إدارة الدروس والفيديوهات</h2>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">أضف وحدة للدورة، ثم أضف الدروس وروابط الفيديو أو عدّل الروابط الحالية.</p>
        <div className="mt-5 space-y-5">
          {courses?.map((course: any) => (
            <article key={course.id} className="rounded-xl border p-4">
              <h3 className="font-bold">{course.title}</h3>
              <form action={createModule} className="mt-3 flex flex-col gap-2 sm:flex-row">
                <input type="hidden" name="course_id" value={course.id} />
                <input name="title" required className="min-w-0 flex-1 rounded-lg border bg-background px-3 py-2 text-sm" placeholder="اسم الوحدة الجديدة" />
                <button className="rounded-lg border px-4 py-2 text-sm font-bold">إضافة وحدة</button>
              </form>
              {(course.modules ?? []).map((module: any) => (
                <div key={module.id} className="mt-4 rounded-lg bg-muted/40 p-3">
                  <h4 className="font-semibold">{module.title}</h4>
                  {(module.lessons ?? []).map((lesson: any) => (
                    <form key={lesson.id} action={updateLessonVideo} className="mt-3 grid gap-2 sm:grid-cols-[1fr_2fr_auto]">
                      <input type="hidden" name="course_id" value={course.id} />
                      <input type="hidden" name="lesson_id" value={lesson.id} />
                      <span className="self-center text-sm">{lesson.title}</span>
                      <input name="video_url" type="url" defaultValue={lesson.video_url ?? ''} className="min-w-0 rounded-lg border bg-background px-3 py-2 text-sm" placeholder="رابط الفيديو https://..." />
                      <button className="rounded-lg border px-3 py-2 text-sm font-semibold">حفظ الرابط</button>
                    </form>
                  ))}
                  <form action={createLesson} className="mt-4 grid gap-3 md:grid-cols-2">
                    <input type="hidden" name="course_id" value={course.id} />
                    <input type="hidden" name="module_id" value={module.id} />
                    <input name="title" required className="rounded-lg border bg-background px-3 py-2 text-sm" placeholder="اسم الدرس الجديد" />
                    <input name="video_url" type="url" className="rounded-lg border bg-background px-3 py-2 text-sm" placeholder="رابط الفيديو (اختياري)" />
                    <textarea name="description" rows={2} className="rounded-lg border bg-background px-3 py-2 text-sm" placeholder="وصف الدرس (اختياري)" />
                    <textarea name="content" rows={2} className="rounded-lg border bg-background px-3 py-2 text-sm" placeholder="محتوى الدرس (اختياري)" />
                    <button className="rounded-lg bg-primary px-4 py-2 text-sm font-bold text-primary-foreground md:col-span-2">إضافة الدرس</button>
                  </form>
                </div>
              ))}
              {!(course.modules ?? []).length && <p className="mt-3 text-sm text-muted-foreground">أضف وحدة أولًا لتتمكن من إضافة الدروس.</p>}
            </article>
          ))}
        </div>
      </section>

      {isOwner && <section className="rounded-2xl border bg-card p-5 sm:p-7">
        <h2 className="text-xl font-extrabold">منح صلاحية المشرف</h2>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">أدخل معرّف المستخدم (User ID) من Supabase Auth. المشرف يستطيع إدارة الدروس والفيديوهات، ولا يحصل على ملكية المنصة.</p>
        <form action={grantModerator} className="mt-4 flex flex-col gap-3 sm:flex-row">
          <input name="user_id" required className="min-w-0 flex-1 rounded-lg border bg-background px-3 py-3 text-sm" placeholder="UUID لحساب المستخدم" />
          <button className="rounded-lg bg-primary px-5 py-3 text-sm font-bold text-primary-foreground">منح الصلاحية</button>
        </form>
        <div className="mt-5 space-y-2">
          <h3 className="text-sm font-bold">المشرفون الحاليون</h3>
          {moderators?.length ? moderators.map((item) => (
            <form key={item.user_id} action={revokeModerator} className="flex flex-col gap-2 rounded-lg border p-3 sm:flex-row sm:items-center sm:justify-between">
              <input type="hidden" name="user_id" value={item.user_id} />
              <span className="break-all text-xs text-muted-foreground">{item.user_id}</span>
              <button className="self-start rounded-lg border border-destructive/30 px-3 py-2 text-xs font-bold text-destructive">سحب الصلاحية</button>
            </form>
          )) : <p className="text-sm text-muted-foreground">لا يوجد مشرفون، أو لم يُطبّق إعداد قاعدة البيانات بعد.</p>}
        </div>
      </section>}

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
