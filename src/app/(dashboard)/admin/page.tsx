'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function AdminPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const supabase = createClient();

  useEffect(() => {
    loadCourses();
  }, []);

  async function loadCourses() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase
      .from('courses')
      .select('*')
      .eq('instructor_id', user.id);
    setCourses(data || []);
  }

  async function createCourse(e: React.FormEvent) {
    e.preventDefault();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from('courses').insert({
      title,
      description,
      instructor_id: user.id,
      is_published: false,
    });
    setTitle('');
    setDescription('');
    loadCourses();
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">إدارة المحتوى</h1>

      <div className="bg-card p-6 rounded-xl border">
        <h2 className="font-semibold mb-4">إنشاء دورة جديدة</h2>
        <form onSubmit={createCourse} className="space-y-4">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="عنوان الدورة"
            className="w-full px-3 py-2 border rounded-md bg-background"
            required
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="وصف الدورة"
            className="w-full px-3 py-2 border rounded-md bg-background min-h-[100px]"
          />
          <button type="submit" className="px-4 py-2 bg-primary text-primary-foreground rounded-md">
            إنشاء الدورة
          </button>
        </form>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">دوراتي</h2>
        <div className="space-y-3">
          {courses.map((course) => (
            <div key={course.id} className="bg-card p-4 rounded-xl border flex justify-between items-center">
              <div>
                <h3 className="font-medium">{course.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {course.is_published ? 'منشورة' : 'مسودة'}
                </p>
              </div>
            </div>
          ))}
          {courses.length === 0 && <p className="text-muted-foreground">لم تنشئ أي دورات بعد</p>}
        </div>
      </div>
    </div>
  );
}