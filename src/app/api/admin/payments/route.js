import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import db from '@/lib/db';

export async function POST(request) {
  try {
    const data = await request.json();
    const { client_id, amount, date, method, bank, reference } = data;

    if (!client_id || !amount || !date) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    await db.execute({
      sql: 'INSERT INTO payments (client_id, amount, date, method, bank, reference) VALUES (?, ?, ?, ?, ?, ?)',
      args: [client_id, amount, date, method || '', bank || '', reference || '']
    });

    await db.execute({
      sql: 'UPDATE registrations SET total_paid = total_paid + ? WHERE id = ?',
      args: [amount, client_id]
    });

    revalidatePath('/admin', 'layout');
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Payment error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const client_id = searchParams.get('client_id');
    
    if (client_id) {
      const result = await db.execute({
        sql: 'SELECT * FROM payments WHERE client_id = ? ORDER BY date DESC',
        args: [client_id]
      });
      return NextResponse.json(result.rows);
    }
    
    const result = await db.execute('SELECT * FROM payments ORDER BY date DESC');
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Payment fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const data = await request.json();
    const { id, amount, date, method, bank, reference } = data;

    if (!id || !amount || !date) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    // Get old amount
    const getOldResult = await db.execute({
      sql: 'SELECT amount, client_id, status, history, method, bank, reference FROM payments WHERE id = ?',
      args: [id]
    });
    const oldPayment = getOldResult.rows[0];
    
    if (!oldPayment) return NextResponse.json({ error: 'Payment not found' }, { status: 404 });

    // Append to history
    const oldInfo = `[$${oldPayment.amount} via ${oldPayment.method}${oldPayment.bank ? ' '+oldPayment.bank : ''}]`;
    const newHistory = `Editado el ${new Date().toLocaleString()}: Antes ${oldInfo}. ${oldPayment.history || ''}`;

    // Update payment
    await db.execute({
      sql: 'UPDATE payments SET amount = ?, date = ?, method = ?, bank = ?, reference = ?, history = ? WHERE id = ?',
      args: [amount, date, method || '', bank || '', reference || '', newHistory, id]
    });

    // Update registration total only if it wasn't Anulado
    let diff = 0;
    if (oldPayment.status !== 'Anulado') {
      diff = amount - oldPayment.amount;
      if (diff !== 0) {
        await db.execute({
          sql: 'UPDATE registrations SET total_paid = total_paid + ? WHERE id = ?',
          args: [diff, oldPayment.client_id]
        });
      }
    }

    return NextResponse.json({ success: true, diff });
  } catch (error) {
    console.error('Update payment error:', error);
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

    // Get old amount
    const getOldResult = await db.execute({
      sql: 'SELECT amount, client_id, status, history FROM payments WHERE id = ?',
      args: [id]
    });
    const oldPayment = getOldResult.rows[0];
    if (!oldPayment) return NextResponse.json({ error: 'Payment not found' }, { status: 404 });

    if (oldPayment.status === 'Anulado') {
      // Already anulado, do nothing or actually delete
      return NextResponse.json({ success: true, removedAmount: 0 });
    }

    // Mark as Anulado instead of DELETE
    const newHistory = `Anulado el ${new Date().toLocaleString()}. ${oldPayment.history || ''}`;
    
    await db.execute({
      sql: "UPDATE payments SET status = 'Anulado', history = ? WHERE id = ?",
      args: [newHistory, id]
    });

    // Update registration total
    await db.execute({
      sql: 'UPDATE registrations SET total_paid = total_paid - ? WHERE id = ?',
      args: [oldPayment.amount, oldPayment.client_id]
    });

    return NextResponse.json({ success: true, removedAmount: oldPayment.amount, newStatus: 'Anulado', newHistory });
  } catch (error) {
    console.error('Delete payment error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
