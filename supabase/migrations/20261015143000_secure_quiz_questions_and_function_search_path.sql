-- Harden trigger function search_path and add least-privilege quiz question access.
-- Published course questions are readable; instructors and platform staff can manage them.
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $function$
begin
  new.updated_at = pg_catalog.now();
  return new;
end;
$function$;

drop policy if exists "Published quiz questions are readable" on public.quiz_questions;
create policy "Published quiz questions are readable"
on public.quiz_questions
for select
to public
using (
  exists (
    select 1
    from public.quizzes q
    join public.lessons l on l.id = q.lesson_id
    join public.modules m on m.id = l.module_id
    join public.courses c on c.id = m.course_id
    where q.id = quiz_questions.quiz_id
      and (
        c.is_published = true
        or c.instructor_id = (select auth.uid())
        or public.is_platform_staff()
      )
  )
);

drop policy if exists "Instructors and platform staff manage quiz questions" on public.quiz_questions;
create policy "Instructors and platform staff manage quiz questions"
on public.quiz_questions
for all
to authenticated
using (
  public.is_platform_staff()
  or exists (
    select 1
    from public.quizzes q
    join public.lessons l on l.id = q.lesson_id
    join public.modules m on m.id = l.module_id
    join public.courses c on c.id = m.course_id
    where q.id = quiz_questions.quiz_id
      and c.instructor_id = (select auth.uid())
  )
)
with check (
  public.is_platform_staff()
  or exists (
    select 1
    from public.quizzes q
    join public.lessons l on l.id = q.lesson_id
    join public.modules m on m.id = l.module_id
    join public.courses c on c.id = m.course_id
    where q.id = quiz_questions.quiz_id
      and c.instructor_id = (select auth.uid())
  )
);
