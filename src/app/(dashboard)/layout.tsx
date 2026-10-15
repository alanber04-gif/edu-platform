import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Sidebar from '@/components/layout/sidebar';
import Header from '@/components/layout/header';

const PLATFORM_OWNER_ID = 'd54740aa-f0fe-42bd-b2e2-4d2393cc8015';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  const isOwner = user.id === PLATFORM_OWNER_ID;

  return (
    <div className="flex min-h-screen">
      <Sidebar isOwner={isOwner} />
      <div className="flex-1 flex flex-col">
        <Header profile={profile} isOwner={isOwner} />
        <main className="min-w-0 flex-1 overflow-auto p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
