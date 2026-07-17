import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getUserById } from '@/lib/db';
import AdminSidebarWrapper from '../admin/AdminSidebarWrapper';

export default async function UsersLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('session');

  if (!sessionCookie) {
    redirect('/login');
  }

  const session = JSON.parse(sessionCookie.value);
  if (session.role !== 'admin') {
    redirect('/dashboard');
  }

  const user = await getUserById(session.id);
  if (!user) {
    redirect('/login');
  }

  return (
    <AdminSidebarWrapper user={user}>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </AdminSidebarWrapper>
  );
}
