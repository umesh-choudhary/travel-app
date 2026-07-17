import { NextResponse } from 'next/server';
import { getUsers, updateUser, Member } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { tripId, name, phone } = await request.json();

    if (!tripId || !name || !phone) {
      return NextResponse.json(
        { success: false, message: 'Trip ID, name, and phone are required' },
        { status: 400 }
      );
    }

    const users = await getUsers();
    let foundUser = null;
    let foundTrip = null;

    for (const u of users) {
      const trips = u.trips || [];
      const t = trips.find((trip) => trip.id === tripId);
      if (t) {
        foundUser = u;
        foundTrip = t;
        break;
      }
    }

    if (!foundUser || !foundTrip) {
      return NextResponse.json(
        { success: false, message: 'Travel group not found' },
        { status: 404 }
      );
    }

    // Initialize members array if not existing
    if (!foundTrip.members) {
      foundTrip.members = [];
    }

    // Add new member
    const newMember: Member = { name, phone };
    foundTrip.members.push(newMember);

    // Save changes to database
    await updateUser(foundUser);

    return NextResponse.json({
      success: true,
      message: 'Joined travel group successfully',
      members: foundTrip.members,
    });
  } catch (error) {
    console.error('Error joining travel group:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
