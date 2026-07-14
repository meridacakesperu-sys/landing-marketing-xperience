import db from '@/lib/db';
import CampaignClient from './CampaignClient';

export const dynamic = 'force-dynamic';

export default async function CampaignPage() {
  const result = await db.execute('SELECT * FROM campaign_objectives ORDER BY start_date ASC');
  const objectives = result.rows;

  return <CampaignClient initialObjectives={objectives} />;
}
