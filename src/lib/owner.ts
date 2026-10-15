import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

const PLATFORM_OWNER_ID = '221467c5-d827-4058-88e7-46fe4966815a';

// Keep the primary owner identity enforced on the server.
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
