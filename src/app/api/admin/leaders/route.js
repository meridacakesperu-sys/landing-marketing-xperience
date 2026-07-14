import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  try {
    const result = await db.execute('SELECT * FROM leaders ORDER BY id DESC');
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Fetch leaders error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const { name, email, phone, business, birthday, notes } = data;
    
    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const result = await db.execute({
      sql: 'INSERT INTO leaders (name, email, phone, business, birthday, notes) VALUES (?, ?, ?, ?, ?, ?)',
      args: [name, email || '', phone || '', business || '', birthday || '', notes || '']
    });

    return NextResponse.json({ success: true, id: Number(result.lastInsertRowid) });
  } catch (error) {
    console.error('Create leader error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const data = await request.json();
    const { id, name, email, phone, business, birthday, notes } = data;
    
    if (!id || !name) {
      return NextResponse.json({ error: 'ID and Name are required' }, { status: 400 });
    }

    await db.execute({
      sql: 'UPDATE leaders SET name = ?, email = ?, phone = ?, business = ?, birthday = ?, notes = ? WHERE id = ?',
      args: [name, email || '', phone || '', business || '', birthday || '', notes || '', id]
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update leader error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
