import { createClient } from '@libsql/client';

const db = createClient({
  url: "libsql://mx-database-clean-eduarps9513-blip.aws-us-east-1.turso.io",
  authToken: "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3ODM5ODkzNDEsImlkIjoiMDE5ZjVlMGMtYjQwMS03ZGQ4LTllZGQtY2VmYzA2ZWY4ZGMzIiwia2lkIjoiZXp6Q0MwS0s1eC1FSldzU1VWRUtmendnSlk3VVljZm9hZU5mT0FXV1U5ayIsInJpZCI6ImI1ZDczYjE2LTU2MjAtNDlkYS1iYmZiLWNkZTA3MzEyYjQ1YSJ9.3Z7w_H2BEXwrrCjDmJSbkIZuPWPknl39HCDV9VqeTBi7VjGbj1pgTlo9vo4tLSnO3jxTQP1ziY0E4AlJZTOGDA",
});

async function run() {
  const result = await db.execute("SELECT name FROM sqlite_master WHERE type='table'");
  console.log("Tables:", result.rows.map(r => r.name));
  
  const leadersInfo = await db.execute("PRAGMA table_info(leaders)");
  console.log("Leaders Columns:", leadersInfo.rows.map(r => r.name));
}
run();
