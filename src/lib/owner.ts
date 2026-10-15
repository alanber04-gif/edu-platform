import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

// Configure OWNER_USER_ID in Vercel with the owner's Supabase Auth user ID.
export async function requireOwner() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) redirect('/login');
  const ownerId = process.env.OWNER_USER_ID;
  if (!ownerId || user.id !== ownerId) redirect('/dashboard');

  return { supabase, user };
}
