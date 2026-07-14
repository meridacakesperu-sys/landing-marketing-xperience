import { NextResponse } from 'next/server';
import db from '@/lib/db';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const result = await db.execute('SELECT * FROM materials ORDER BY createdAt DESC');
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Fetch materials error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Save locally
    const originalName = file.name;
    const safeName = Date.now() + '-' + originalName.replace(/[^a-zA-Z0-9.\-_]/g, '');
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, safeName);
    fs.writeFileSync(filePath, buffer);

    const publicPath = `/uploads/${safeName}`;

    const result = await db.execute({
      sql: 'INSERT INTO materials (name, original_name, path) VALUES (?, ?, ?)',
      args: [safeName, originalName, publicPath]
    });

    return NextResponse.json({ success: true, id: Number(result.lastInsertRowid), path: publicPath, original_name: originalName, createdAt: new Date().toISOString() });
  } catch (error) {
    console.error('Upload material error:', error);
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

    const getResult = await db.execute({
      sql: 'SELECT * FROM materials WHERE id = ?',
      args: [id]
    });
    const material = getResult.rows[0];

    if (material) {
      const filePath = path.join(process.cwd(), 'public', material.path);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      await db.execute({
        sql: 'DELETE FROM materials WHERE id = ?',
        args: [id]
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete material error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
