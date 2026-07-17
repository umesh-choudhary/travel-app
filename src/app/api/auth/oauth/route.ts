import { NextResponse } from 'next/server';
import { getUserByEmail, getUsers, saveUsers, User } from '@/lib/db';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const { provider, name, email } = await request.json();

    if (!provider || !email || !name) {
      return NextResponse.json(
        { success: false, message: 'Provider, name, and email are required' },
        { status: 400 }
      );
    }

    let user = await getUserByEmail(email);

    // If account doesn't exist, create a new profile via OAuth
    if (!user) {
      const users = await getUsers();
      user = {
        id: 'u_' + Math.random().toString(36).substring(2, 11),
        email: email.toLowerCase(),
        name,
        role: 'user',
        trips: [],
      };
      users.push(user);
      await saveUsers(users);
    }

    // Set session cookie
    const cookieStore = await cookies();
    cookieStore.set('session', JSON.stringify({ id: user.id, role: user.role }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });

    return NextResponse.json({ success: true, role: user.role });
  } catch (error) {
    console.error('Error during OAuth login:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
