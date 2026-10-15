import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

const PLATFORM_OWNER_ID = 'd54740aa-f0fe-42bd-b2e2-4d2393cc8015';

// The owner ID is fixed server-side; OWNER_USER_ID may still be configured for the UI.
export async function requireOwner() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) redirect('/login');
  if (user.id !== PLATFORM_OWNER_ID) redirect('/dashboard');

  return { supabase, user };
}

export async function requirePlatformStaff() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) redirect('/login');
  if (user.id === PLATFORM_OWNER_ID) return { supabase, user, isOwner: true };

  const { data: role, error: roleError } = await supabase
    .from('platform_moderators')
    .select('user_id')
    .eq('user_id', user.id)
    .maybeSingle();

  if (roleError || !role) redirect('/dashboard');
  return { supabase, user, isOwner: false };
}
