import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getUserById } from '@/lib/db';
import SidebarWrapper from './SidebarWrapper';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('session');

  if (!sessionCookie) {
    redirect('/login');
  }

  const session = JSON.parse(sessionCookie.value);
  if (session.role === 'admin') {
    redirect('/admin');
  }

  const user = await getUserById(session.id);
  if (!user) {
    redirect('/login');
  }

  return <SidebarWrapper user={user}>{children}</SidebarWrapper>;
}
