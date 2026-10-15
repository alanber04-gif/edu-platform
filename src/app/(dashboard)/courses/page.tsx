import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';

export default async function CoursesPage() {
  const supabase = await createClient();
  const { data: courses } = await supabase
    .from('courses')
    .select('*')
    .eq('is_published', true)
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">الدورات التعليمية</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {courses?.map((course) => (
          <Link
            key={course.id}
            href={`/courses/${course.id}`}
            className="group bg-card rounded-xl border overflow-hidden hover:shadow-lg transition"
          >
            {course.thumbnail_url && (
              <div className="aspect-video bg-muted">
              </div>
            )}
            <div className="p-4">
              <h3 className="font-semibold group-hover:text-primary transition">
                {course.title}
              </h3>
              <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                {course.description}
              </p>
              <div className="mt-3 text-xs text-muted-foreground">
                {course.level} • {course.category}
              </div>
            </div>
          </Link>
        )) || (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            لا توجد دورات متاحة حالياً
          </div>
        )}
      </div>
    </div>
  );
}