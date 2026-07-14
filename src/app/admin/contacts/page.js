import db from '@/lib/db';
import ContactsClient from './ContactsClient';

export const dynamic = 'force-dynamic';

export default async function ContactsPage() {
  const result = await db.execute('SELECT * FROM registrations ORDER BY createdAt DESC');
  const registrations = result.rows;

  let agents = [];
  try {
    const agentsResult = await db.execute('SELECT * FROM sales_agents ORDER BY name ASC');
    agents = agentsResult.rows;
  } catch(e) {}

  return <ContactsClient initialData={registrations} agents={agents} />;
}
