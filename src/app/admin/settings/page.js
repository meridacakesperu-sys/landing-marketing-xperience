import db from '@/lib/db';
import SettingsClient from './SettingsClient';

export default async function SettingsPage() {
  const result = await db.execute('SELECT * FROM settings');
  const config = {};
  result.rows.forEach(s => config[s.key] = s.value);

  return <SettingsClient initialSettings={config} />;
}
