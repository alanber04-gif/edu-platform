import Link from 'next/link';
import { requireOwner } from '@/lib/owner';
import { grantModerator, revokeModerator } from '../actions';
import { ArrowRight, ShieldCheck, ShieldOff, Users, UserRoundCheck, Clock3 } from 'lucide-react';

type PlatformUser = {
  user_id: string;
  email: string | null;
  full_name: string | null;
  registered_at: string;
  last_sign_in_at: string | null;
  is_moderator: boolean;
};

type Props = {
  searchParams: Promise<{ error?: string; moderatorAdded?: string; moderatorRemoved?: string }>;
};

function formatDate(value: string | null) {
  if (!value) return 'لم يسجل دخوله بعد';
  return new Date(value).toLocaleString('ar-SA', {
    timeZone: 'Asia/Riyadh',
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

export default async function AdminUsersPage({ searchParams }: Props) {
  const { supabase, user } = await requireOwner();
  const params = await searchParams;
  const { data, error } = await supabase.rpc('owner_list_platform_users');
  const users = (data ?? []) as PlatformUser[];
  const moderatorCount = users.filter((item) => item.is_moderator).length;
  const loggedInCount = users.filter((item) => Boolean(item.last_sign_in_at)).length;

  return (
    <div dir="rtl" className="mx-auto max-w-6xl space-y-7 pb-10">
      <header className="rounded-3xl border bg-gradient-to-l from-primary/15 via-card to-card p-6 sm:p-8">
        <Link href="/admin" className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition hover:text-foreground">
          <ArrowRight size={16} /> العودة لإدارة المنصة
        </Link>
        <div className="flex items-start gap-4">
          <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-primary text-primary-foreground"><Users size={27} /></span>
          <div>
            <p className="text-sm font-bold text-primary">صلاحيات المالك فقط</p>
            <h1 className="mt-1 text-2xl font-black sm:text-3xl">المستخدمون والإشراف</h1>
            <p className="mt-2 text-sm leading-7 text-muted-foreground">تابع الحسابات المسجلة وآخر دخول، وامنح صلاحية الإشراف أو اسحبها. أنت مسجل الدخول بالحساب {user.email}.</p>
          </div>
        </div>
      </header>

      {params.error && <p role="alert" className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
        {params.error === 'moderator' ? 'تعذر تغيير الصلاحية. حاول مرة أخرى وتأكد أن الحساب مسجل.' : params.error === 'self' ? 'لا يمكن تغيير صلاحية حساب المالك.' : 'حدث خطأ أثناء تنفيذ العملية.'}
      </p>}
      {params.moderatorAdded && <p role="status" className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4 text-sm">تم منح صلاحية الإشراف بنجاح.</p>}
      {params.moderatorRemoved && <p role="status" className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4 text-sm">تم إلغاء صلاحية الإشراف.</p>}

      <section className="grid gap-4 sm:grid-cols-3">
        <article className="rounded-2xl border bg-card p-5">
          <div className="flex items-center justify-between"><span className="text-sm font-semibold text-muted-foreground">إجمالي الحسابات</span><Users className="text-primary" size={20} /></div>
          <p className="mt-3 text-3xl font-black tabular-nums">{users.length}</p>
          <p className="mt-1 text-xs text-muted-foreground">حساب مسجل في المنصة</p>
        </article>
        <article className="rounded-2xl border bg-card p-5">
          <div className="flex items-center justify-between"><span className="text-sm font-semibold text-muted-foreground">سبق لهم تسجيل الدخول</span><Clock3 className="text-primary" size={20} /></div>
          <p className="mt-3 text-3xl font-black tabular-nums">{loggedInCount}</p>
          <p className="mt-1 text-xs text-muted-foreground">بحسب سجل المصادقة في Supabase</p>
        </article>
        <article className="rounded-2xl border bg-card p-5">
          <div className="flex items-center justify-between"><span className="text-sm font-semibold text-muted-foreground">المشرفون</span><UserRoundCheck className="text-primary" size={20} /></div>
          <p className="mt-3 text-3xl font-black tabular-nums">{moderatorCount}</p>
          <p className="mt-1 text-xs text-muted-foreground">لديهم صلاحية إدارة محتوى الدروس</p>
        </article>
      </section>

      <section className="overflow-hidden rounded-2xl border bg-card">
        <div className="border-b p-5 sm:p-6">
          <h2 className="text-lg font-extrabold">قائمة الحسابات</h2>
          <p className="mt-1 text-sm text-muted-foreground">تاريخ التسجيل وآخر دخول محفوظين في Supabase. قد يكون اسم الحساب غير متوفر إذا لم يضفه المستخدم.</p>
        </div>
        {error ? (
          <div role="alert" className="p-6 text-sm text-destructive">تعذر تحميل الحسابات. تحقق من تطبيق تحديث قاعدة البيانات ثم أعد المحاولة.</div>
        ) : users.length === 0 ? (
          <div className="p-10 text-center text-sm text-muted-foreground">لا توجد حسابات مسجلة حتى الآن.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-right text-sm">
              <thead className="bg-muted/50 text-xs text-muted-foreground">
                <tr>
                  <th className="px-5 py-4 font-bold">المستخدم</th>
                  <th className="px-5 py-4 font-bold">تاريخ التسجيل</th>
                  <th className="px-5 py-4 font-bold">آخر دخول</th>
                  <th className="px-5 py-4 font-bold">الصلاحية</th>
                  <th className="px-5 py-4 font-bold">إجراء</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {users.map((item) => {
                  const isCurrentOwner = item.user_id === user.id;
                  return (
                    <tr key={item.user_id} className="align-middle">
                      <td className="px-5 py-4">
                        <p className="font-bold">{item.full_name || item.email || 'حساب بدون اسم'}</p>
                        <p className="mt-1 text-xs text-muted-foreground">{item.email || 'لا يوجد بريد إلكتروني'}</p>
                        {isCurrentOwner && <span className="mt-2 inline-flex rounded-full bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary">المالك</span>}
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 text-muted-foreground">{formatDate(item.registered_at)}</td>
                      <td className="whitespace-nowrap px-5 py-4 text-muted-foreground">{formatDate(item.last_sign_in_at)}</td>
                      <td className="px-5 py-4">
                        {isCurrentOwner ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary"><ShieldCheck size={14} /> مالك المنصة</span>
                        ) : item.is_moderator ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1.5 text-xs font-bold text-emerald-700"><ShieldCheck size={14} /> مشرف</span>
                        ) : (
                          <span className="rounded-full bg-muted px-3 py-1.5 text-xs font-semibold text-muted-foreground">مستخدم</span>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        {!isCurrentOwner && (item.is_moderator ? (
                          <form action={revokeModerator}>
                            <input type="hidden" name="user_id" value={item.user_id} />
                            <button className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-bold transition hover:bg-muted"><ShieldOff size={14} /> إلغاء الإشراف</button>
                          </form>
                        ) : (
                          <form action={grantModerator}>
                            <input type="hidden" name="user_id" value={item.user_id} />
                            <button className="inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-xs font-bold text-primary-foreground transition hover:opacity-90"><ShieldCheck size={14} /> تعيين مشرف</button>
                          </form>
                        ))}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
      <p className="text-xs leading-6 text-muted-foreground">ملاحظة: «آخر دخول» يعني آخر تسجيل دخول ناجح مسجل لدى Supabase، وليس تتبعًا لحظيًا لكل صفحة فتحها المستخدم.</p>
    </div>
  );
}
