import { NextResponse } from 'next/server';
import { getUserByEmail, getUsers, saveUsers } from '@/lib/db';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const code = url.searchParams.get('code');

    if (!code) {
      return NextResponse.json({ success: false, message: 'Authorization code is missing' }, { status: 400 });
    }

    // Determine the dynamic redirect URI matching the request host (localhost vs vercel.app)
    const host = request.headers.get('host') || 'localhost:3000';
    const protocol = host.includes('localhost') ? 'http' : 'https';
    const redirectUri = `${protocol}://${host}/api/auth/callback/google`;

    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

    // Exchange authorization code for token
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    });

    const tokenData = await tokenRes.json();

    if (!tokenRes.ok) {
      console.error('Google token exchange error:', tokenData);
      return NextResponse.redirect(new URL('/login?error=token_exchange_failed', request.url));
    }

    // Fetch user info from Google
    const userInfoRes = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${tokenData.access_token}`);
    const userInfo = await userInfoRes.json();

    if (!userInfoRes.ok) {
      console.error('Google userInfo error:', userInfo);
      return NextResponse.redirect(new URL('/login?error=user_info_failed', request.url));
    }

    const { name, email } = userInfo;

    if (!email) {
      return NextResponse.redirect(new URL('/login?error=email_not_shared', request.url));
    }

    let user = await getUserByEmail(email);

    // If account doesn't exist, create a new profile via Google OAuth
    if (!user) {
      const users = await getUsers();
      user = {
        id: 'u_' + Math.random().toString(36).substring(2, 11),
        email: email.toLowerCase(),
        name: name || 'Google User',
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

    // Determine target page based on role and redirect
    const targetUrl = user.role === 'admin' ? '/admin' : '/dashboard';
    return NextResponse.redirect(new URL(targetUrl, request.url));

  } catch (error) {
    console.error('Error in Google OAuth Callback:', error);
    return NextResponse.redirect(new URL('/login?error=internal_error', request.url));
  }
}
