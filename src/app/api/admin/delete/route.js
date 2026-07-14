import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function POST(request) {
  try {
    const data = await request.json();
    const { id } = data;

    if (!id) {
      return NextResponse.json({ error: 'Missing registration ID' }, { status: 400 });
    }

    const result = await db.execute({
      sql: 'DELETE FROM registrations WHERE id = ?',
      args: [id]
    });

    if (result.rowsAffected === 0) {
      return NextResponse.json({ error: 'Registration not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
