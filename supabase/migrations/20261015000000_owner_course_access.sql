-- Run this migration in the Supabase SQL Editor for the existing project.
-- Owner access is restricted to the authenticated owner's immutable user ID.
alter table public.courses enable row level security;

drop policy if exists "Platform owner manages all courses" on public.courses;
create policy "Platform owner manages all courses"
on public.courses
for all
to authenticated
using (auth.uid() = 'd54740aa-f0fe-42bd-b2e2-4d2393cc8015'::uuid)
with check (auth.uid() = 'd54740aa-f0fe-42bd-b2e2-4d2393cc8015'::uuid);
