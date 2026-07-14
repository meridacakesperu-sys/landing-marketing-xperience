import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import db from '@/lib/db';
import crypto from 'crypto';

export async function POST(request) {
  try {
    const data = await request.json();
    const { name, email, phone, plan, business, status, notes, birthday, ticket_price, purchase_stage, agent_id } = data;

    if (!name || !plan) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const ticket_id = crypto.randomBytes(4).toString('hex');

    const result = await db.execute({
      sql: `
        INSERT INTO registrations (name, email, phone, plan, business, status, notes, birthday, ticket_price, purchase_stage, agent_id, ticket_id) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      args: [name, email || '', phone || '', plan, business || '', status || 'Nuevo', notes || '', birthday || '', ticket_price || 0, purchase_stage || 'Pre-venta', agent_id || null, ticket_id]
    });

    revalidatePath('/admin', 'layout');
    return NextResponse.json({ success: true, id: Number(result.lastInsertRowid) });
  } catch (error) {
    console.error('Contact creation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });

    await db.execute({ sql: 'DELETE FROM payments WHERE client_id = ?', args: [id] });
    await db.execute({ sql: 'DELETE FROM reminders WHERE client_id = ?', args: [id] });
    await db.execute({ sql: 'DELETE FROM registrations WHERE id = ?', args: [id] });

    revalidatePath('/admin', 'layout');
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Contact deletion error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
