import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  try {
    const result = await db.execute('SELECT * FROM tables ORDER BY order_index ASC');
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Fetch tables error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const data = await request.json();
    const { id, name, leader_id } = data;
    
    if (!id || !name) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await db.execute({
      sql: 'UPDATE tables SET name = ?, leader_id = ? WHERE id = ?',
      args: [name, leader_id || null, id]
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update table error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
