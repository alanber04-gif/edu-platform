'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { requireOwner } from '@/lib/owner';

export async function createCourse(formData: FormData) {
  const { supabase, user } = await requireOwner();
  const title = String(formData.get('title') || '').trim();
  const description = String(formData.get('description') || '').trim();
  const category = String(formData.get('category') || '').trim();
  const level = String(formData.get('level') || '').trim();
  const thumbnailUrl = String(formData.get('thumbnail_url') || '').trim();
  const isPublished = formData.get('is_published') === 'on';

  if (!title) redirect('/admin?error=title');

  const { error } = await supabase.from('courses').insert({
    title,
    instructor_id: user.id,
    description: description || null,
    category: category || null,
    level: level || null,
    thumbnail_url: thumbnailUrl || null,
    is_published: isPublished,
  });

  if (error) redirect('/admin?error=save');
  revalidatePath('/admin');
  revalidatePath('/courses');
  revalidatePath('/dashboard');
  redirect('/admin?created=1');
}

export async function toggleCoursePublished(formData: FormData) {
  const { supabase } = await requireOwner();
  const id = String(formData.get('id') || '');
  const published = formData.get('published') === 'true';
  if (!id) redirect('/admin?error=course');

  const { error } = await supabase.from('courses').update({ is_published: !published }).eq('id', id);
  if (error) redirect('/admin?error=save');

  revalidatePath('/admin');
  revalidatePath('/courses');
  revalidatePath('/dashboard');
  redirect('/admin?updated=1');
}

export async function deleteCourse(formData: FormData) {
  const { supabase } = await requireOwner();
  const id = String(formData.get('id') || '');
  if (!id) redirect('/admin?error=course');

  const { error } = await supabase.from('courses').delete().eq('id', id);
  if (error) redirect('/admin?error=delete');

  revalidatePath('/admin');
  revalidatePath('/courses');
  revalidatePath('/dashboard');
  redirect('/admin?deleted=1');
}


export async function createModule(formData: FormData) {
  const { supabase } = await requireOwner();
  const courseId = String(formData.get('course_id') || '').trim();
  const title = String(formData.get('title') || '').trim();
  if (!courseId || !title) redirect('/admin?error=module');

  const { data: existing } = await supabase
    .from('modules')
    .select('order_index')
    .eq('course_id', courseId)
    .order('order_index', { ascending: false })
    .limit(1);
  const orderIndex = (existing?.[0]?.order_index ?? -1) + 1;
  const { error } = await supabase.from('modules').insert({
    course_id: courseId,
    title,
    order_index: orderIndex,
  });
  if (error) redirect('/admin?error=module');
  revalidatePath('/admin');
  revalidatePath('/courses/' + courseId);
  redirect('/admin?moduleCreated=1');
}

export async function createLesson(formData: FormData) {
  const { supabase } = await requireOwner();
  const courseId = String(formData.get('course_id') || '').trim();
  const moduleId = String(formData.get('module_id') || '').trim();
  const title = String(formData.get('title') || '').trim();
  const videoUrl = String(formData.get('video_url') || '').trim();
  const content = String(formData.get('content') || '').trim();
  const description = String(formData.get('description') || '').trim();
  if (!courseId || !moduleId || !title) redirect('/admin?error=lesson');
  if (videoUrl && !/^https?:\/\//i.test(videoUrl)) redirect('/admin?error=video');

  const { data: existing } = await supabase
    .from('lessons')
    .select('order_index')
    .eq('module_id', moduleId)
    .order('order_index', { ascending: false })
    .limit(1);
  const orderIndex = (existing?.[0]?.order_index ?? -1) + 1;
  const { error } = await supabase.from('lessons').insert({
    module_id: moduleId,
    title,
    video_url: videoUrl || null,
    content: content || null,
    description: description || null,
    order_index: orderIndex,
  });
  if (error) redirect('/admin?error=lesson');
  revalidatePath('/admin');
  revalidatePath('/courses/' + courseId);
  redirect('/admin?lessonCreated=1');
}

export async function updateLessonVideo(formData: FormData) {
  const { supabase } = await requireOwner();
  const courseId = String(formData.get('course_id') || '').trim();
  const lessonId = String(formData.get('lesson_id') || '').trim();
  const videoUrl = String(formData.get('video_url') || '').trim();
  if (!courseId || !lessonId) redirect('/admin?error=lesson');
  if (videoUrl && !/^https?:\/\//i.test(videoUrl)) redirect('/admin?error=video');

  const { error } = await supabase.from('lessons').update({
    video_url: videoUrl || null,
  }).eq('id', lessonId);
  if (error) redirect('/admin?error=lesson');
  revalidatePath('/admin');
  revalidatePath('/courses/' + courseId);
  redirect('/admin?videoUpdated=1');
}

export async function grantModerator(formData: FormData) {
  const { supabase, user } = await requireOwner();
  const userId = String(formData.get('user_id') || '').trim();
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(userId)) {
    redirect('/admin?error=moderator');
  }
  if (userId === user.id) redirect('/admin?error=self');

  const { error } = await supabase.from('platform_moderators').upsert({
    user_id: userId,
    granted_by: user.id,
  }, { onConflict: 'user_id' });
  if (error) redirect('/admin?error=moderator');
  revalidatePath('/admin');
  redirect('/admin?moderatorAdded=1');
}

export async function revokeModerator(formData: FormData) {
  const { supabase, user } = await requireOwner();
  const userId = String(formData.get('user_id') || '').trim();
  if (!userId || userId === user.id) redirect('/admin?error=moderator');
  const { error } = await supabase.from('platform_moderators').delete().eq('user_id', userId);
  if (error) redirect('/admin?error=moderator');
  revalidatePath('/admin');
  redirect('/admin?moderatorRemoved=1');
}
