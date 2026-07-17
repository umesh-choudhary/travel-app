import { NextResponse } from 'next/server';
import { getUserById, updateUser, Trip } from '@/lib/db';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { from, to, date, status, feesType, feesAmount, leader, members } = body;

    const resolvedFrom = from || '';
    const resolvedTo = to || '';
    const resolvedDestination = body.destination || `${resolvedFrom} to ${resolvedTo}`;

    if (!resolvedDestination || !date || !status) {
      return NextResponse.json(
        { success: false, message: 'Origin, Destination, Date, and Status are required' },
        { status: 400 }
      );
    }

    const user = await getUserById(id);
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    // Generate a simple unique ID for the new trip
    const newTrip: Trip = {
      id: 't' + Math.random().toString(36).substring(2, 9),
      from: resolvedFrom,
      to: resolvedTo,
      destination: resolvedDestination,
      feesType: feesType || 'free',
      feesAmount: feesAmount || '',
      date,
      status,
      leader: leader || user.name, // Default leader to current user's name
      members: members || [],
    };

    user.trips.push(newTrip);
    await updateUser(user);

    return NextResponse.json({ success: true, trip: newTrip });
  } catch (error) {
    console.error('Error adding trip:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
