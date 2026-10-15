"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type CourseComment = {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
};

export default function CourseComments({ courseId }: { courseId: string }) {
  const [comments, setComments] = useState<CourseComment[]>([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadComments = useCallback(async () => {
    const supabase = createClient();
    setLoading(true);
    setError(null);

    const { data: authData } = await supabase.auth.getUser();
    setUserId(authData.user?.id ?? null);

    const { data, error: queryError } = await supabase
      .from("course_comments")
      .select("id, content, created_at, user_id")
      .eq("course_id", courseId)
      .order("created_at", { ascending: true });

    if (queryError) {
      setError(
        "تعذر تحميل التعليقات. تأكد من إعداد جدول course_comments وصلاحيات الوصول في Supabase."
      );
      setComments([]);
    } else {
      setComments((data ?? []) as CourseComment[]);
    }

    setLoading(false);
  }, [courseId]);

  useEffect(() => {
    void loadComments();
  }, [loadComments]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const content = text.trim();
    if (!content || sending) return;

    const supabase = createClient();
    setSending(true);
    setError(null);

    const { data: authData } = await supabase.auth.getUser();
    if (!authData.user) {
      setError("سجّل الدخول أولاً لإضافة تعليق.");
      setSending(false);
      return;
    }

    const { error: insertError } = await supabase.from("course_comments").insert({
      course_id: courseId,
      user_id: authData.user.id,
      content,
    });

    if (insertError) {
      setError(
        "تعذرت إضافة التعليق. تحقق من وجود جدول course_comments وسياسات RLS في Supabase."
      );
    } else {
      setText("");
      await loadComments();
    }

    setSending(false);
  }

  return (
    <section className="space-y-4 rounded-xl border bg-card p-5" dir="rtl">
      <div>
        <h2 className="text-xl font-bold">التعليقات والمناقشة</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          شارك سؤالك أو استفادتك من هذه الدورة.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <label htmlFor="course-comment" className="sr-only">
          اكتب تعليقك
        </label>
        <textarea
          id="course-comment"
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder={userId ? "اكتب تعليقك هنا..." : "سجّل الدخول للمشاركة في النقاش"}
          disabled={!userId || sending}
          maxLength={3000}
          rows={3}
          className="w-full resize-y rounded-lg border bg-background p-3 text-sm outline-none focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-60"
        />
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs text-muted-foreground">{text.length}/3000</span>
          <button
            type="submit"
            disabled={!userId || !text.trim() || sending}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {sending ? "جارٍ الإرسال..." : "إضافة تعليق"}
          </button>
        </div>
      </form>

      {error && (
        <p role="alert" className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
          {error}
        </p>
      )}

      <div className="space-y-3">
        {loading ? (
          <p className="py-4 text-center text-sm text-muted-foreground">جارٍ تحميل التعليقات...</p>
        ) : comments.length === 0 ? (
          <p className="py-4 text-center text-sm text-muted-foreground">لا توجد تعليقات بعد. كن أول من يشارك.</p>
        ) : (
          comments.map((comment) => (
            <article key={comment.id} className="rounded-lg border p-4">
              <p className="whitespace-pre-wrap break-words text-sm leading-7">{comment.content}</p>
              <p className="mt-2 text-xs text-muted-foreground">
                {new Date(comment.created_at).toLocaleString("ar-SA", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
                {comment.user_id === userId ? " · تعليقك" : ""}
              </p>
            </article>
          ))
        )}
      </div>
    </section>
  );
}
