import { NextResponse } from 'next/server';
import { getUserByEmail, getUsers, saveUsers, User } from '@/lib/db';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, message: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'Email address is already in use' },
        { status: 400 }
      );
    }

    const users = await getUsers();

    const newUser: User = {
      id: 'u_' + Math.random().toString(36).substring(2, 11),
      email: email.toLowerCase(),
      password,
      role: 'user',
      name,
      trips: [],
    };

    users.push(newUser);
    await saveUsers(users);

    // Create session cookie
    const cookieStore = await cookies();
    cookieStore.set('session', JSON.stringify({ id: newUser.id, role: newUser.role }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });

    return NextResponse.json({ success: true, role: newUser.role });
  } catch (error) {
    console.error('Error during registration:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
