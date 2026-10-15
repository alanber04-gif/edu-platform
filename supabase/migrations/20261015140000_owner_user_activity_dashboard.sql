-- Owner-only user directory and moderator management for Sahm.
-- Uses the actual owner ID enforced by src/lib/owner.ts.
drop policy if exists "Owner manages platform moderators" on public.platform_moderators;
create policy "Owner manages platform moderators"
on public.platform_moderators for all to authenticated
using (auth.uid() = '221467c5-d827-4058-88e7-46fe4966815a'::uuid)
with check (auth.uid() = '221467c5-d827-4058-88e7-46fe4966815a'::uuid);

create or replace function public.owner_list_platform_users()
returns table (
  user_id uuid,
  email text,
  full_name text,
  registered_at timestamptz,
  last_sign_in_at timestamptz,
  is_moderator boolean
)
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  if (select auth.uid()) is distinct from '221467c5-d827-4058-88e7-46fe4966815a'::uuid then
    raise exception 'not authorized';
  end if;

  return query
    select
      u.id,
      u.email::text,
      p.full_name,
      u.created_at,
      u.last_sign_in_at,
      exists (
        select 1 from public.platform_moderators pm where pm.user_id = u.id
      )
    from auth.users u
    left join public.profiles p on p.id = u.id
    order by u.created_at desc;
end;
$$;

revoke all on function public.owner_list_platform_users() from public, anon;
grant execute on function public.owner_list_platform_users() to authenticated;
