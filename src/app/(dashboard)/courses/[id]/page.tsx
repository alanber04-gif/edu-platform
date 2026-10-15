import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import CourseComments from '@/components/course-comments';

export default async function CoursePage({ params }: { params: { id: string } }) {
  const supabase = await createClient();
  const { data: course } = await supabase
    .from('courses')
    .select(`
      *,
      modules (
        *,
        lessons (*)
      )
    `)
    .eq('id', params.id)
    .single();

  if (!course) notFound();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{course.title}</h1>
        <p className="text-muted-foreground mt-2">{course.description}</p>
      </div>

      <div className="space-y-4">
        {course.modules?.map((module: any) => (
          <div key={module.id} className="bg-card rounded-xl border p-4">
            <h2 className="font-semibold text-lg mb-3">{module.title}</h2>
            <div className="space-y-2">
              {module.lessons?.map((lesson: any) => (
                <Link
                  key={lesson.id}
                  href={`/courses/${course.id}/lessons/${lesson.id}`}
                  className="block p-3 rounded-md hover:bg-accent transition"
                >
                  <div className="flex items-center justify-between">
                    <span>{lesson.title}</span>
                    {lesson.duration && (
                      <span className="text-xs text-muted-foreground">
                        {Math.floor(lesson.duration / 60)} د
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      <CourseComments courseId={course.id} />
    </div>
  );
}