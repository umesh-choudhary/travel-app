import { getUserById } from '@/lib/db';
import { notFound } from 'next/navigation';
import AllTripDetails from './AllTripDetails';

export default async function UserDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getUserById(id);

  if (!user) {
    notFound();
  }

  return <AllTripDetails user={user} />;
}
