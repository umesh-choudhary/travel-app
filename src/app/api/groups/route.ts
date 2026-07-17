import { NextResponse } from 'next/server';
import { getTravelGroups, findMatchingGroups } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const from = searchParams.get('from');
    const to = searchParams.get('to');

    const groups = await getTravelGroups();

    if (from && to) {
      const filtered = findMatchingGroups(from, to, groups);
      return NextResponse.json({ success: true, groups: filtered });
    }

    return NextResponse.json({ success: true, groups });
  } catch (error) {
    console.error('Error fetching travel groups:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
