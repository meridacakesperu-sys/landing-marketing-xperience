import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  try {
    const result = await db.execute('SELECT * FROM timeline_events ORDER BY day ASC, order_index ASC, id ASC');
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Fetch timeline error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const { day, time, title, duration, description, order_index } = data;
    
    if (!day || !time || !title) {
      return NextResponse.json({ error: 'Day, time and title are required' }, { status: 400 });
    }

    const result = await db.execute({
      sql: 'INSERT INTO timeline_events (day, time, title, duration, description, order_index) VALUES (?, ?, ?, ?, ?, ?)',
      args: [day, time, title, duration || '', description || '', order_index || 0]
    });

    return NextResponse.json({ success: true, id: Number(result.lastInsertRowid) });
  } catch (error) {
    console.error('Create timeline event error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const data = await request.json();
    const { id, day, time, title, duration, description, order_index } = data;
    
    if (!id || !day || !time || !title) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await db.execute({
      sql: 'UPDATE timeline_events SET day = ?, time = ?, title = ?, duration = ?, description = ?, order_index = ? WHERE id = ?',
      args: [day, time, title, duration || '', description || '', order_index || 0, id]
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update timeline event error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    await db.execute({
      sql: 'DELETE FROM timeline_events WHERE id = ?',
      args: [id]
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete timeline event error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
