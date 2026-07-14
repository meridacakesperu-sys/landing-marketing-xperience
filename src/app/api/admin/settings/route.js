import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  try {
    const result = await db.execute('SELECT * FROM settings');
    const config = {};
    result.rows.forEach(s => config[s.key] = s.value);
    return NextResponse.json(config);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    
    for (const [key, value] of Object.entries(data)) {
      await db.execute({
        sql: 'UPDATE settings SET value = ? WHERE key = ?',
        args: [value, key]
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
