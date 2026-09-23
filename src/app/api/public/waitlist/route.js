import { NextResponse } from 'next/server';
import db from '../../../../lib/db'; // adjust path if needed

export async function POST(request) {
  try {
    const { full_name, email, phone } = await request.json();

    if (!full_name || !email || !phone) {
      return NextResponse.json({ success: false, message: 'Todos los campos son obligatorios' }, { status: 400 });
    }

    // Check if email already exists
    const existing = await db.execute({
      sql: 'SELECT id FROM waitlist2027 WHERE email = ?',
      args: [email]
    });

    if (existing.rows.length > 0) {
      return NextResponse.json({ success: false, message: 'Este correo ya está en la lista de espera' }, { status: 400 });
    }

    await db.execute({
      sql: 'INSERT INTO waitlist2027 (full_name, email, phone) VALUES (?, ?, ?)',
      args: [full_name, email, phone]
    });

    return NextResponse.json({ success: true, message: '¡Te has registrado con éxito a la lista de espera!' }, { status: 201 });
  } catch (error) {
    console.error('Waitlist API Error:', error);
    return NextResponse.json({ success: false, message: 'Hubo un error al procesar tu solicitud' }, { status: 500 });
  }
}
