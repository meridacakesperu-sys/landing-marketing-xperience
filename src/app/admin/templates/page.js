import db from '@/lib/db';
import TemplatesClient from './TemplatesClient';

export const dynamic = 'force-dynamic';

export default async function TemplatesPage() {
  const result = await db.execute('SELECT * FROM templates ORDER BY createdAt DESC');
  
  // Convert BigInts or specialized types if any (usually not an issue, but safe to map)
  const templates = result.rows.map(row => ({
    id: row.id,
    title: row.title,
    content: row.content,
    createdAt: row.createdAt
  }));

  return <TemplatesClient initialTemplates={templates} />;
}
