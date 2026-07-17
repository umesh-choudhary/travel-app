import { NextResponse } from 'next/server';
import { getUsers, updateUser } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { token, password } = await request.json();

    if (!token || !password) {
      return NextResponse.json(
        { success: false, message: 'Token and new password are required' },
        { status: 400 }
      );
    }

    const users = await getUsers();
    const user = users.find((u) => u.resetToken === token);

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Invalid or expired password reset link' },
        { status: 400 }
      );
    }

    // Check token expiry
    const expiry = user.resetTokenExpiry || 0;
    if (Date.now() > expiry) {
      // Clear token to prevent multiple reuse attempts
      user.resetToken = undefined;
      user.resetTokenExpiry = undefined;
      await updateUser(user);

      return NextResponse.json(
        { success: false, message: 'Reset link has expired (3-minute limit)' },
        { status: 400 }
      );
    }

    // Set new password
    user.password = password;
    // Clear reset credentials
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;

    await updateUser(user);

    return NextResponse.json({
      success: true,
      message: 'Password reset successfully',
    });
  } catch (error) {
    console.error('Error during password-reset request:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
