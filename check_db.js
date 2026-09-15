const { createClient } = require('@libsql/client');

const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function run() {
  try {
    const regResult = await client.execute("SELECT id, name, email, phone, createdAt FROM registrations WHERE name LIKE '%mariangel%' OR name LIKE '%briceño%' OR name LIKE '%briceno%' COLLATE NOCASE");
    console.log("Registrations:", regResult.rows);

    const leadResult = await client.execute("SELECT id, name, email, phone, createdAt FROM leaders WHERE name LIKE '%mariangel%' OR name LIKE '%briceño%' OR name LIKE '%briceno%' COLLATE NOCASE");
    console.log("Leaders:", leadResult.rows);

  } catch (err) {
    console.error("Error:", err);
  }
}

run();
