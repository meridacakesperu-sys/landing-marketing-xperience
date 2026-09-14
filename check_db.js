const { createClient } = require('@libsql/client');

const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function run() {
  try {
    const regResult = await client.execute("SELECT * FROM registrations WHERE name LIKE '%jesús%' OR name LIKE '%jesus%'");
    console.log("Registrations:", JSON.stringify(regResult.rows, null, 2));
  } catch (err) {
    console.error("Error:", err);
  }
}

run();
