const { createClient } = require('@libsql/client');
const fs = require('fs');
const XLSX = require('xlsx');

const envFile = fs.readFileSync('.env.local', 'utf8');
const env = {};
envFile.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) env[match[1]] = match[2];
});

const db = createClient({
  url: env.TURSO_DATABASE_URL,
  authToken: env.TURSO_AUTH_TOKEN,
});

async function run() {
  try {
    const result = await db.execute('SELECT * FROM registrations ORDER BY createdAt DESC');
    const rows = result.rows;
    
    if (rows.length === 0) {
      console.log('No records found.');
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Contactos");
    
    const fileName = 'Contactos_CRM.xlsx';
    XLSX.writeFile(workbook, fileName);
    console.log(`Successfully exported ${rows.length} contacts to ${fileName}`);
  } catch (err) {
    console.error('Error:', err);
  }
}

run();
