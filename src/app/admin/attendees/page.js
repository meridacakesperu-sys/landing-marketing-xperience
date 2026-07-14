import db from '@/lib/db';
import AttendeesClient from './AttendeesClient';

export default async function AttendeesPage() {
  // Fetch only attendees with status 'Completado'
  const registrationsResult = await db.execute({
    sql: 'SELECT * FROM registrations WHERE status = ?',
    args: ['Completado']
  });
  const registrations = registrationsResult.rows;

  const tablesResult = await db.execute('SELECT * FROM tables ORDER BY order_index ASC');
  const tables = tablesResult.rows;

  const leadersResult = await db.execute('SELECT * FROM leaders ORDER BY name ASC');
  const leaders = leadersResult.rows;

  const timelineResult = await db.execute('SELECT * FROM timeline_events ORDER BY day ASC, order_index ASC, id ASC');
  const timelineEvents = timelineResult.rows;

  const materialsResult = await db.execute('SELECT * FROM materials ORDER BY createdAt DESC');
  const materials = materialsResult.rows;

  return <AttendeesClient initialRegistrations={registrations} initialTables={tables} initialLeaders={leaders} initialTimeline={timelineEvents} initialMaterials={materials} />;
}
