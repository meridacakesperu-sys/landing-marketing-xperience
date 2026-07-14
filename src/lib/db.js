import { createClient } from '@libsql/client';
import path from 'path';

// If no TURSO URL is provided, fallback to the local file for development.
// Note: In Vercel, the local file will not be persistent.
const url = process.env.TURSO_DATABASE_URL || 'file:' + path.join(process.cwd(), 'data', 'registrations.db');
const authToken = process.env.TURSO_AUTH_TOKEN;

const db = createClient({
  url,
  authToken,
});

export default db;
