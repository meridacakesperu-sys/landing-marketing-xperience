import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function POST(request) {
  try {
    const data = await request.json();
    const { client_id, description, date, lead_name, lead_phone, tag } = data;

    if ((!client_id && (!lead_name || !lead_phone)) || !date) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    await db.execute({
      sql: 'INSERT INTO reminders (client_id, description, date, lead_name, lead_phone, tag) VALUES (?, ?, ?, ?, ?, ?)',
      args: [client_id || null, description || '', date, lead_name || null, lead_phone || null, tag || null]
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Reminder error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const client_id = searchParams.get('client_id');
    
    if (client_id) {
      const result = await db.execute({
        sql: 'SELECT * FROM reminders WHERE client_id = ? ORDER BY date ASC',
        args: [client_id]
      });
      return NextResponse.json(result.rows);
    }
    
    // To get all reminders with client names
    const result = await db.execute(`
      SELECT r.*, c.name as client_name 
      FROM reminders r 
      LEFT JOIN registrations c ON r.client_id = c.id 
      ORDER BY r.date ASC
    `);
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Fetch reminders error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const data = await request.json();
    const { id, ...fields } = data;
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    
    const allowedFields = ['completed', 'converted', 'date', 'description', 'lead_name', 'lead_phone', 'tag'];
    const updateKeys = Object.keys(fields).filter(k => allowedFields.includes(k));
    
    if (updateKeys.length > 0) {
      const setClause = updateKeys.map(k => `${k} = ?`).join(', ');
      const values = updateKeys.map(k => {
        // Boolean to integer conversion if needed
        if (typeof fields[k] === 'boolean') return fields[k] ? 1 : 0;
        return fields[k];
      });
      
      await db.execute({
        sql: `UPDATE reminders SET ${setClause} WHERE id = ?`,
        args: [...values, id]
      });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update reminder error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

    await db.execute({
      sql: 'DELETE FROM reminders WHERE id = ?',
      args: [id]
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete reminder error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
