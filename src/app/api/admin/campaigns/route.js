import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function POST(request) {
  try {
    const data = await request.json();
    const { title, start_date, end_date, notes } = data;

    if (!title || !start_date || !end_date) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    await db.execute({
      sql: 'INSERT INTO campaign_objectives (title, start_date, end_date, notes) VALUES (?, ?, ?, ?)',
      args: [title, start_date, end_date, notes || '']
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Campaign error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const data = await request.json();
    const { id, title, start_date, end_date, notes, status } = data;

    if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });

    await db.execute({
      sql: 'UPDATE campaign_objectives SET title = ?, start_date = ?, end_date = ?, notes = ?, status = ? WHERE id = ?',
      args: [title, start_date, end_date, notes || '', status || 'Pendiente', id]
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update objective error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });

    await db.execute({
      sql: 'DELETE FROM campaign_objectives WHERE id = ?',
      args: [id]
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete objective error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const result = await db.execute('SELECT * FROM campaign_objectives ORDER BY start_date ASC');
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Get campaigns error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
