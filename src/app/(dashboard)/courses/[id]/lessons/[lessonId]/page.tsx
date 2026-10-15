import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, BookOpen, Clock3, FileText } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';

type Lesson = {
  id: string;
  title: string;
  duration?: number | null;
  content?: string | null;
  video_url?: string | null;
  description?: string | null;
  order_index?: number | null;
};

export default async function LessonPage({
  params,
}: {
  params: Promise<{ id: string; lessonId: string }>;
}) {
  const { id, lessonId } = await params;
  const supabase = await createClient();
  const { data: course } = await supabase
    .from('courses')
    .select('id, title, modules(id, title, lessons(*))')
    .eq('id', id)
    .single();

  if (!course) notFound();

  const modules = (course.modules ?? []) as Array<{
    id: string;
    title: string;
    lessons: Lesson[] | null;
  }>;
  const lessonModule = modules.find((module) =>
    (module.lessons ?? []).some((lesson) => lesson.id === lessonId)
  );
  const lesson = lessonModule?.lessons?.find((item) => item.id === lessonId);
  if (!lesson) notFound();

  const videoUrl = lesson.video_url?.trim();
  const isDirectVideo = Boolean(videoUrl && /\.(mp4|webm|ogg)(\?.*)?$/i.test(videoUrl));

  return (
    <article className="mx-auto max-w-4xl space-y-6 pb-10">
      <Link href={`/courses/${course.id}`} className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-muted-foreground transition hover:bg-accent hover:text-foreground">
        <ArrowRight size={17} /> العودة إلى الدورة
      </Link>

      <header className="rounded-3xl border bg-card p-6 sm:p-8">
        <p className="text-sm font-semibold text-primary">{course.title}</p>
        <h1 className="mt-3 text-2xl font-black leading-relaxed sm:text-3xl">{lesson.title}</h1>
        <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-2"><BookOpen size={16} />{lessonModule.title}</span>
          {lesson.duration ? <span className="inline-flex items-center gap-2"><Clock3 size={16} />{Math.max(1, Math.round(lesson.duration / 60))} دقيقة</span> : null}
        </div>
      </header>

      {videoUrl && isDirectVideo && (
        <div className="overflow-hidden rounded-2xl border bg-black">
          <video className="max-h-[70vh] w-full" controls preload="metadata" src={videoUrl}>
            عذرًا، لا يدعم متصفحك تشغيل هذا الفيديو.
          </video>
        </div>
      )}

      {videoUrl && !isDirectVideo && (
        <section className="rounded-2xl border bg-card p-5">
          <h2 className="font-bold">رابط الدرس</h2>
          <p className="mt-2 break-all text-sm text-muted-foreground">يوجد رابط خارجي لمحتوى هذا الدرس.</p>
          <a href={videoUrl} target="_blank" rel="noreferrer" className="mt-4 inline-flex rounded-xl bg-primary px-4 py-3 font-semibold text-primary-foreground transition hover:opacity-90">فتح محتوى الدرس</a>
        </section>
      )}

      {(lesson.content || lesson.description) ? (
        <section className="rounded-2xl border bg-card p-5 sm:p-7">
          <div className="mb-4 flex items-center gap-2"><FileText className="text-primary" size={20} /><h2 className="text-lg font-extrabold">محتوى الدرس</h2></div>
          <div className="whitespace-pre-wrap break-words text-sm leading-8 text-foreground/90">{lesson.content || lesson.description}</div>
        </section>
      ) : !videoUrl ? (
        <section className="rounded-2xl border border-dashed p-8 text-center">
          <BookOpen className="mx-auto text-muted-foreground" size={30} />
          <h2 className="mt-3 font-bold">محتوى هذا الدرس لم يُضف بعد</h2>
          <p className="mt-2 text-sm text-muted-foreground">يمكنك العودة إلى الدورة واختيار درس آخر متاح.</p>
        </section>
      ) : null}

      <div className="flex justify-start">
        <Link href={`/courses/${course.id}`} className="inline-flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition hover:bg-accent"><ArrowRight size={16} /> العودة إلى قائمة الدروس</Link>
      </div>
    </article>
  );
}
