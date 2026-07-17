import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getUserById, getUserByEmail, updateUser, getUsers } from '@/lib/db';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session');

    if (!sessionCookie) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const session = JSON.parse(sessionCookie.value);
    const userId = session.id;

    const user = await getUserById(userId);
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session');

    if (!sessionCookie) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const session = JSON.parse(sessionCookie.value);
    const userId = session.id;

    const body = await request.json();
    const { name, email, phone, age, username, password, address } = body;

    if (!name || !email) {
      return NextResponse.json(
        { success: false, message: 'Name and email are required' },
        { status: 400 }
      );
    }

    const users = await getUsers();
    const user = users.find((u) => u.id === userId);
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    // If email is being changed, verify it's not taken by another user
    if (email !== user.email) {
      const existingUser = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
      if (existingUser && existingUser.id !== userId) {
        return NextResponse.json(
          { success: false, message: 'Email address is already in use' },
          { status: 400 }
        );
      }
    }

    // If username is being changed, verify it's not taken by another user
    if (username && username !== user.username) {
      const existingUser = users.find(
        (u) => u.username?.toLowerCase() === username.toLowerCase()
      );
      if (existingUser && existingUser.id !== userId) {
        return NextResponse.json(
          { success: false, message: 'Username is already in use' },
          { status: 400 }
        );
      }
    }

    // Update fields
    user.name = name;
    user.email = email;
    user.phone = phone || '';
    user.age = age || '';
    user.username = username || '';
    user.address = address || '';
    if (password) {
      user.password = password;
    }

    await updateUser(user);

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        age: user.age,
        username: user.username,
        address: user.address,
      },
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
