import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(request) {
  try {
    const result = await db.execute(`
      SELECT 
        r.id, r.name, r.email, r.phone, r.plan, r.status, r.ticket_id, r.attended,
        r.ticket_price, r.total_paid,
        t.name as table_name
      FROM registrations r
      LEFT JOIN tables t ON r.table_id = t.id
      ORDER BY r.name ASC
    `);
    return NextResponse.json(result.rows);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { ticket_id, attended } = await request.json();
    if (!ticket_id) return NextResponse.json({ error: 'Missing ticket_id' }, { status: 400 });

    await db.execute({
      sql: 'UPDATE registrations SET attended = ? WHERE ticket_id = ?',
      args: [attended ? 1 : 0, ticket_id]
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
