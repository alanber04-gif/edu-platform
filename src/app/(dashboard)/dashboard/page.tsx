import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: progress } = await supabase
    .from('lesson_progress')
    .select('*, lessons(title, modules(courses(title)))')
    .eq('user_id', user?.id)
    .order('updated_at', { ascending: false })
    .limit(5);

  const { data: courses } = await supabase
    .from('courses')
    .select('*')
    .eq('is_published', true)
    .limit(6);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">مرحباً بك</h1>
        <p className="text-muted-foreground">تابع تقدمك التعليمي</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="bg-card p-6 rounded-xl border">
          <h3 className="font-semibold mb-2">الدورات المتاحة</h3>
          <p className="text-3xl font-bold">{courses?.length || 0}</p>
        </div>
        <div className="bg-card p-6 rounded-xl border">
          <h3 className="font-semibold mb-2">آخر نشاط</h3>
          <p className="text-sm text-muted-foreground">
            {progress?.[0]?.lessons?.title || 'لا يوجد نشاط بعد'}
          </p>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">دورات مقترحة</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {courses?.map((course) => (
            <Link
              key={course.id}
              href={`/courses/${course.id}`}
              className="bg-card p-4 rounded-xl border hover:shadow-md transition"
            >
              <h3 className="font-medium">{course.title}</h3>
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {course.description}
              </p>
            </Link>
          )) || <p>لا توجد دورات حالياً</p>}
        </div>
      </div>
    </div>
  );
}