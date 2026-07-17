import { cookies } from 'next/headers';
import { getUserById, getTravelGroups } from '@/lib/db';
import DashboardContent from './DashboardContent';

export default async function UserDashboard() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('session')!;
  const session = JSON.parse(sessionCookie.value);

  const user = await getUserById(session.id);
  
  // Fetch all travel groups and filter for those the user has joined as passenger
  const allGroups = await getTravelGroups();
  const joinedGroups = allGroups.filter((g) => {
    // Exclude trips that this user created (already under user.trips)
    if (g.creatorUserId === session.id) return false;
    
    // Check if the user is a registered member by matching name or phone
    const isMember = g.membersList?.some(
      (m) =>
        m.name.toLowerCase() === user?.name.toLowerCase() ||
        (user?.phone && m.phone === user.phone)
    );
    return isMember;
  });

  return <DashboardContent user={user!} joinedGroups={joinedGroups} />;
}
