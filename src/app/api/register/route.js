import { NextResponse } from 'next/server';
import db from '@/lib/db';
import crypto from 'crypto';

export async function POST(request) {
  try {
    const data = await request.json();
    const { name, email, phone, plan, birthday, ticket_price, purchase_stage, ref_code } = data;

    if (!name || !email || !phone || !plan) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    let agent_id = null;
    if (ref_code) {
      const result = await db.execute({
        sql: 'SELECT id FROM sales_agents WHERE ref_code = ?',
        args: [ref_code]
      });
      const agent = result.rows[0];
      if (agent) {
        agent_id = agent.id;
      }
    }

    const ticket_id = crypto.randomBytes(4).toString('hex');

    const result = await db.execute({
      sql: 'INSERT INTO registrations (name, email, phone, plan, status, total_paid, birthday, ticket_price, purchase_stage, agent_id, ticket_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      args: [name, email, phone, plan, 'Nuevo', 0, birthday || '', ticket_price || 0, purchase_stage || 'Pre-venta', agent_id, ticket_id]
    });

    return NextResponse.json({ success: true, id: Number(result.lastInsertRowid) });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
