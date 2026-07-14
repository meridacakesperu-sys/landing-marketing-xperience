import CheckinClient from './CheckinClient';
import db from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function CheckinPage() {
  const resultClients = await db.execute('SELECT r.*, t.name as table_name FROM registrations r LEFT JOIN tables t ON r.table_id = t.id ORDER BY r.name ASC');
  const clients = resultClients.rows;

  const resultTables = await db.execute('SELECT id, name FROM tables ORDER BY order_index ASC');
  const tables = resultTables.rows;
  
  return <CheckinClient initialData={clients} tables={tables} />;
}
