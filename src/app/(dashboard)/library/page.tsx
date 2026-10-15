'use client';

import { FormEvent, useCallback, useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { BookOpen, FileText, PlusCircle, RefreshCw, Download } from 'lucide-react';

type Note = { id: string; content: string; lesson_id: string; updated_at?: string; lessons?: { title?: string } | null };
type UserFile = { id: string; name: string; file_url: string; created_at?: string };
type LessonOption = { id: string; title: string; modules?: { title?: string; courses?: { title?: string } | null } | null };

export default function LibraryPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [files, setFiles] = useState<UserFile[]>([]);
  const [lessons, setLessons] = useState<LessonOption[]>([]);
  const [selectedLesson, setSelectedLesson] = useState('');
  const [noteText, setNoteText] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const load = useCallback(async () => {
    const supabase = createClient();
    setLoading(true);
    setError('');
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      setError('انتهت الجلسة. سجّل الدخول مجددًا لعرض مكتبتك.');
      setLoading(false);
      return;
    }

    const [notesResult, filesResult, lessonsResult] = await Promise.all([
      supabase.from('notes').select('id, content, lesson_id, updated_at, lessons(title)').eq('user_id', user.id).order('updated_at', { ascending: false }),
      supabase.from('user_files').select('id, name, file_url, created_at').eq('user_id', user.id).order('created_at', { ascending: false }),
      supabase.from('lessons').select('id, title, modules(title, courses(title))').order('title', { ascending: true }),
    ]);

    if (notesResult.error) setError('تعذر تحميل الملاحظات. تحقق من جدول notes وصلاحياته في Supabase.');
    else setNotes((notesResult.data ?? []) as unknown as Note[]);

    if (filesResult.error) {
      setError(current => current || 'تعذر تحميل الملفات المحفوظة من قاعدة البيانات.');
    } else setFiles((filesResult.data ?? []) as UserFile[]);

    if (lessonsResult.error) {
      setError(current => current || 'تعذر تحميل قائمة الدروس لإضافة ملاحظة.');
    } else setLessons((lessonsResult.data ?? []) as unknown as LessonOption[]);

    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);

  async function addNote(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!noteText.trim() || !selectedLesson || saving) return;
    const supabase = createClient();
    setSaving(true);
    setError('');
    setNotice('');
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        setError('سجّل الدخول مجددًا قبل حفظ الملاحظة.');
        return;
      }
      const { error: insertError } = await supabase.from('notes').insert({
        user_id: user.id,
        lesson_id: selectedLesson,
        content: noteText.trim(),
      });
      if (insertError) {
        setError('لم تُحفظ الملاحظة. تحقق من أعمدة جدول notes وسياسات صلاحياته في Supabase.');
        return;
      }
      setNoteText('');
      setNotice('تم حفظ الملاحظة بنجاح.');
      await load();
    } catch {
      setError('حدث خطأ أثناء حفظ الملاحظة. حاول مرة أخرى.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8 pb-10">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div><p className="text-sm font-bold text-primary">مساحتك الخاصة</p><h1 className="mt-1 text-3xl font-black">مكتبتي الشخصية</h1><p className="mt-2 text-sm text-muted-foreground">احفظ ملاحظاتك وارجع إلى ملفاتك في أي وقت.</p></div>
        <button type="button" onClick={() => void load()} disabled={loading} className="inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition hover:bg-accent disabled:opacity-50"><RefreshCw size={16} className={loading ? 'animate-spin' : ''} /> تحديث</button>
      </header>

      {error && <p role="alert" className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">{error}</p>}
      {notice && <p role="status" className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4 text-sm text-emerald-700">{notice}</p>}

      <section className="rounded-2xl border bg-card p-5 sm:p-6">
        <div className="mb-5 flex items-center gap-3"><span className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary"><PlusCircle size={21} /></span><div><h2 className="text-xl font-extrabold">إضافة ملاحظة دراسية</h2><p className="mt-1 text-sm text-muted-foreground">اربط ملاحظتك بالدرس لتسهيل الرجوع إليها.</p></div></div>
        <form onSubmit={addNote} className="space-y-4">
          <label className="block space-y-2 text-sm font-semibold">الدرس
            <select required value={selectedLesson} onChange={event => setSelectedLesson(event.target.value)} className="w-full rounded-xl border bg-background px-3 py-3 outline-none focus:border-primary">
              <option value="">اختر درسًا</option>
              {lessons.map(lesson => <option key={lesson.id} value={lesson.id}>{lesson.modules?.courses?.title ? lesson.modules.courses.title + ' — ' : ''}{lesson.modules?.title ? lesson.modules.title + ' — ' : ''}{lesson.title}</option>)}
            </select>
          </label>
          <label className="block space-y-2 text-sm font-semibold">محتوى الملاحظة
            <textarea required value={noteText} onChange={event => setNoteText(event.target.value)} maxLength={10000} rows={4} placeholder="اكتب النقاط المهمة أو ملخص الدرس..." className="w-full resize-y rounded-xl border bg-background px-4 py-3 outline-none focus:border-primary" />
          </label>
          <div className="flex flex-wrap items-center justify-between gap-3"><span className="text-xs text-muted-foreground">{noteText.length}/10000</span><button type="submit" disabled={saving || !selectedLesson || !noteText.trim()} className="rounded-xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50">{saving ? 'جارٍ الحفظ...' : 'حفظ الملاحظة'}</button></div>
          {lessons.length === 0 && !loading && <p className="text-xs text-muted-foreground">تحتاج إلى وجود دروس منشورة أو مضافة في قاعدة البيانات حتى تتمكن من ربط الملاحظة بدرس.</p>}
        </form>
      </section>

      <section className="space-y-4">
        <div className="flex items-center gap-2"><FileText className="text-primary" size={21} /><h2 className="text-xl font-extrabold">ملاحظاتي ({notes.length})</h2></div>
        {loading ? <p className="rounded-xl border p-6 text-center text-sm text-muted-foreground">جارٍ تحميل مكتبتك...</p> : notes.length ? <div className="grid gap-3">{notes.map(note => <article key={note.id} className="rounded-2xl border bg-card p-5"><p className="mb-2 text-xs font-bold text-primary">{note.lessons?.title || 'ملاحظة دراسية'}</p><p className="whitespace-pre-wrap break-words text-sm leading-7">{note.content}</p>{note.updated_at && <p className="mt-3 text-xs text-muted-foreground">آخر تحديث: {new Date(note.updated_at).toLocaleDateString('ar-SA')}</p>}</article>)}</div> : <div className="rounded-2xl border border-dashed p-8 text-center"><FileText className="mx-auto text-muted-foreground" size={28} /><p className="mt-3 font-semibold">لا توجد ملاحظات بعد</p><p className="mt-1 text-sm text-muted-foreground">استخدم النموذج أعلاه لحفظ أول ملاحظة.</p></div>}
      </section>

      <section className="space-y-4">
        <div className="flex items-center gap-2"><BookOpen className="text-primary" size={21} /><h2 className="text-xl font-extrabold">ملفاتي ({files.length})</h2></div>
        {files.length ? <div className="space-y-3">{files.map(file => <article key={file.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-card p-4"><span className="min-w-0 break-all text-sm font-semibold">{file.name}</span><a href={file.file_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold text-primary transition hover:bg-accent"><Download size={15} /> فتح / تحميل</a></article>)}</div> : <div className="rounded-2xl border border-dashed p-7 text-center text-sm text-muted-foreground">لا توجد ملفات محفوظة في مكتبتك.</div>}
      </section>
    </div>
  );
}
