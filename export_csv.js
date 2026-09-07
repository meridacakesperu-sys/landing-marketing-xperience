const { createClient } = require('@libsql/client');
const fs = require('fs');

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

    const headers = Object.keys(rows[0]);
    let csvContent = '\uFEFF' + headers.join(',') + '\n';
    
    rows.forEach(row => {
      const rowValues = headers.map(header => {
        let val = row[header];
        if (val === null || val === undefined) val = '';
        val = String(val).replace(/"/g, '""');
        return `"${val}"`;
      });
      csvContent += rowValues.join(',') + '\n';
    });
    
    const fileName = 'Contactos_Marketing_Xperience.csv';
    fs.writeFileSync(fileName, csvContent);
    console.log(`Successfully exported ${rows.length} contacts to ${fileName}`);
  } catch (err) {
    console.error('Error:', err);
  }
}

run();
