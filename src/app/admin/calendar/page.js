import db from '@/lib/db';
import CalendarClient from './CalendarClient';

export const dynamic = 'force-dynamic';

export default async function CalendarPage() {
  const result = await db.execute(`
    SELECT r.*, c.name as client_name 
    FROM reminders r 
    LEFT JOIN registrations c ON r.client_id = c.id 
    ORDER BY r.date ASC
  `);
  const reminders = result.rows;

  const clientsResult = await db.execute('SELECT * FROM registrations ORDER BY createdAt DESC');
  const clients = clientsResult.rows;

  return <CalendarClient reminders={reminders} clients={clients} />;
}
