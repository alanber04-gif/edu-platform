'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { requireOwner } from '@/lib/owner';

export async function createCourse(formData: FormData) {
  const { supabase } = await requireOwner();
  const title = String(formData.get('title') || '').trim();
  const description = String(formData.get('description') || '').trim();
  const category = String(formData.get('category') || '').trim();
  const level = String(formData.get('level') || '').trim();
  const thumbnailUrl = String(formData.get('thumbnail_url') || '').trim();
  const isPublished = formData.get('is_published') === 'on';

  if (!title) redirect('/admin?error=title');

  const { error } = await supabase.from('courses').insert({
    title,
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
