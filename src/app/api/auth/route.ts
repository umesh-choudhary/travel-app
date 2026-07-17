import { NextResponse } from 'next/server';
import { getUserByEmail } from '@/lib/db';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    const user = await getUserByEmail(email);

    if (user && user.password === password) {
      // In a real app, you would hash passwords and use JWTs.
      // Here we just set a simple cookie with the user ID and role for demonstration.
      const cookieStore = await cookies();
      cookieStore.set('session', JSON.stringify({ id: user.id, role: user.role }), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
      });

      return NextResponse.json({ success: true, role: user.role });
    }

    return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete('session');
  return NextResponse.json({ success: true });
}
