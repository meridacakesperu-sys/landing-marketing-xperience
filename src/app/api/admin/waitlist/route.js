import { NextResponse } from 'next/server';
import db from '../../../../lib/db'; // Make sure this path is correct

export async function GET(request) {
  try {
    const result = await db.execute('SELECT * FROM waitlist2027 ORDER BY created_at DESC');
    return NextResponse.json({ success: true, waitlist: result.rows }, { status: 200 });
  } catch (error) {
    console.error('API Waitlist error:', error);
    return NextResponse.json({ success: false, message: 'Error interno del servidor' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, message: 'ID no proporcionado' }, { status: 400 });
    }

    await db.execute({
      sql: 'DELETE FROM waitlist2027 WHERE id = ?',
      args: [id]
    });

    return NextResponse.json({ success: true, message: 'Eliminado correctamente' }, { status: 200 });
  } catch (error) {
    console.error('API Delete Waitlist error:', error);
    return NextResponse.json({ success: false, message: 'Error interno del servidor' }, { status: 500 });
  }
}
