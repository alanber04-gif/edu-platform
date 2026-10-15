-- Run this script in the Supabase SQL Editor to enable course comments.
create table if not exists public.course_comments (
  id uuid primary key default gen_random_uuid(),
  course_id text not null,
  user_id uuid not null references auth.users(id) on delete cascade,
  content text not null check (char_length(trim(content)) between 1 and 3000),
  created_at timestamptz not null default now()
);

create index if not exists course_comments_course_created_idx
  on public.course_comments (course_id, created_at);

alter table public.course_comments enable row level security;

drop policy if exists "Anyone can read course comments" on public.course_comments;
create policy "Anyone can read course comments"
  on public.course_comments
  for select
  using (true);

drop policy if exists "Authenticated users can add their own course comments" on public.course_comments;
create policy "Authenticated users can add their own course comments"
  on public.course_comments
  for insert
  to authenticated
  with check (auth.uid() = user_id);
