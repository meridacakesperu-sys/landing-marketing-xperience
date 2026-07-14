import db from '@/lib/db';
import DashboardClient from './DashboardClient';

export const dynamic = 'force-dynamic'; // Ensures this page isn't statically cached so new registrations show up instantly.

export default async function AdminPage() {
  // Fetch registrations from database
  const result = await db.execute('SELECT * FROM registrations ORDER BY createdAt DESC');
  const registrations = result.rows;

  const leadsResult = await db.execute('SELECT COUNT(*) as count FROM reminders WHERE client_id IS NULL');
  const unconvertedLeads = leadsResult.rows[0]?.count || 0;

  let agents = [];
  try {
    const agentsResult = await db.execute('SELECT * FROM sales_agents ORDER BY name ASC');
    agents = agentsResult.rows;
  } catch(e) {}

  return <DashboardClient registrations={registrations} unconvertedLeads={Number(unconvertedLeads)} agents={agents} />;
}
