import { NextResponse } from 'next/server';
import { getUserByEmail, updateUser } from '@/lib/db';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Email address is required' },
        { status: 400 }
      );
    }

    const user = await getUserByEmail(email);
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'No user account found with this email' },
        { status: 404 }
      );
    }

    // Generate token and 3 minutes expiry (180,000 milliseconds)
    const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const expiry = Date.now() + 3 * 60 * 1000; // current time + 3 minutes

    user.resetToken = token;
    user.resetTokenExpiry = expiry;

    await updateUser(user);

    // Load SMTP configurations
    const host = process.env.SMTP_HOST || 'smtp.gmail.com';
    const port = parseInt(process.env.SMTP_PORT || '465');
    const secure = process.env.SMTP_SECURE === 'true';
    const smtpUser = process.env.SMTP_USER || '';
    const smtpPass = process.env.SMTP_PASS || '';

    // Check if configuration exists and is not placeholders
    if (
      !smtpUser ||
      !smtpPass ||
      smtpUser.includes('your-email') ||
      smtpPass.includes('your-gmail-app-password')
    ) {
      return NextResponse.json(
        {
          success: false,
          message: 'SMTP settings not configured. Please fill SMTP_USER and SMTP_PASS in your root .env.local file.',
        },
        { status: 500 }
      );
    }

    // Construct nodemailer transporter
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    const origin = request.headers.get('origin') || 'http://localhost:3000';
    const resetUrl = `${origin}/login?resetToken=${token}`;

    // Send the real email
    await transporter.sendMail({
      from: `"TravelApp Help" <${smtpUser}>`,
      to: email,
      subject: 'Reset Password Request - TravelApp',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 12px; background-color: #ffffff;">
          <h2 style="color: #6366f1; margin-bottom: 16px; font-size: 22px; font-weight: bold;">Password Reset Link</h2>
          <p style="color: #374151; font-size: 15px; line-height: 1.6; margin-bottom: 24px;">
            You requested to reset your password. Click the button below to choose a new password. This link is valid for exactly <strong>3 minutes</strong>:
          </p>
          <div style="margin: 28px 0; text-align: center;">
            <a href="${resetUrl}" style="background-color: #6366f1; color: #ffffff; padding: 12px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; font-size: 14px; box-shadow: 0 4px 6px -1px rgba(99, 102, 241, 0.2);">
              Reset Password
            </a>
          </div>
          <p style="color: #ef4444; font-size: 12px; margin-top: 24px; font-weight: 500;">
            Note: This link will expire in 3 minutes.
          </p>
          <hr style="border: 0; border-top: 1px solid #f3f4f6; margin: 24px 0;" />
          <p style="color: #9ca3af; font-size: 11px; text-align: center;">
            If you did not request this, you can safely ignore this email.
          </p>
        </div>
      `,
    });

    return NextResponse.json({
      success: true,
      message: 'Password reset link sent to your email. Please check your inbox.',
    });
  } catch (error: any) {
    console.error('Error during forgot-password request:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
