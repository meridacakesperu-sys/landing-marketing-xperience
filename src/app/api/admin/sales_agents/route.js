import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  try {
    const result = await db.execute('SELECT * FROM sales_agents ORDER BY createdAt DESC');
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching sales agents:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { name, ref_code } = await request.json();

    if (!name || !ref_code) {
      return NextResponse.json({ error: 'Name and ref_code are required' }, { status: 400 });
    }

    // Check if ref_code already exists
    const existingResult = await db.execute({
      sql: 'SELECT * FROM sales_agents WHERE ref_code = ?',
      args: [ref_code]
    });
    
    if (existingResult.rows.length > 0) {
      return NextResponse.json({ error: 'Referral code already exists' }, { status: 400 });
    }

    const result = await db.execute({
      sql: 'INSERT INTO sales_agents (name, ref_code) VALUES (?, ?)',
      args: [name, ref_code]
    });

    return NextResponse.json({ success: true, id: Number(result.lastInsertRowid) });
  } catch (error) {
    console.error('Error creating sales agent:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    }

    await db.execute({
      sql: 'DELETE FROM sales_agents WHERE id = ?',
      args: [id]
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting sales agent:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
