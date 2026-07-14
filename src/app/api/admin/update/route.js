import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function POST(request) {
  try {
    const data = await request.json();
    const { id, status, notes, business, birthday, ticket_price, table_id, agent_id } = data;

    if (!id) {
      return NextResponse.json({ error: 'Missing registration ID' }, { status: 400 });
    }

    let updates = [];
    let params = [];

    if (status !== undefined) { updates.push('status = ?'); params.push(status); }
    if (notes !== undefined) { updates.push('notes = ?'); params.push(notes); }
    if (business !== undefined) { updates.push('business = ?'); params.push(business); }
    if (birthday !== undefined) { updates.push('birthday = ?'); params.push(birthday); }
    if (ticket_price !== undefined) { updates.push('ticket_price = ?'); params.push(ticket_price); }
    if (table_id !== undefined) { updates.push('table_id = ?'); params.push(table_id); }
    if (agent_id !== undefined) { updates.push('agent_id = ?'); params.push(agent_id); }

    if (updates.length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
    }

    const query = `UPDATE registrations SET ${updates.join(', ')} WHERE id = ?`;
    params.push(id);

    const result = await db.execute({
      sql: query,
      args: params
    });

    if (result.rowsAffected === 0) {
      return NextResponse.json({ error: 'Registration not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
