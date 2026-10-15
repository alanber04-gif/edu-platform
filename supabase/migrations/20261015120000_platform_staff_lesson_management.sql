-- Owner-controlled moderator roles and course lesson management.
-- Safe to run more than once; does not delete course or user data.

create table if not exists public.platform_moderators (
  user_id uuid primary key references auth.users(id) on delete cascade,
  granted_by uuid not null references auth.users(id),
  created_at timestamptz not null default now()
);

alter table public.platform_moderators enable row level security;

drop policy if exists "Owner manages platform moderators" on public.platform_moderators;
create policy "Owner manages platform moderators"
on public.platform_moderators for all to authenticated
using (auth.uid() = 'd54740aa-f0fe-42bd-b2e2-4d2393cc8015'::uuid)
with check (auth.uid() = 'd54740aa-f0fe-42bd-b2e2-4d2393cc8015'::uuid);

drop policy if exists "Users read own moderator role" on public.platform_moderators;
create policy "Users read own moderator role"
on public.platform_moderators for select to authenticated
using (auth.uid() = user_id);

create or replace function public.is_platform_staff()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select (select auth.uid()) = 'd54740aa-f0fe-42bd-b2e2-4d2393cc8015'::uuid
    or exists (
      select 1 from public.platform_moderators
      where user_id = (select auth.uid())
    );
$$;

revoke all on function public.is_platform_staff() from public;
grant execute on function public.is_platform_staff() to authenticated;

drop policy if exists "Platform staff manage modules" on public.modules;
create policy "Platform staff manage modules"
on public.modules for all to authenticated
using (public.is_platform_staff())
with check (public.is_platform_staff());

drop policy if exists "Platform staff manage lessons" on public.lessons;
create policy "Platform staff manage lessons"
on public.lessons for all to authenticated
using (public.is_platform_staff())
with check (public.is_platform_staff());
