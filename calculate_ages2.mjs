import { createClient } from '@libsql/client';

const db = createClient({
  url: "libsql://mx-database-clean-eduarps9513-blip.aws-us-east-1.turso.io",
  authToken: "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3ODM5ODkzNDEsImlkIjoiMDE5ZjVlMGMtYjQwMS03ZGQ4LTllZGQtY2VmYzA2ZWY4ZGMzIiwia2lkIjoiZXp6Q0MwS0s1eC1FSldzU1VWRUtmendnSlk3VVljZm9hZU5mT0FXV1U5ayIsInJpZCI6ImI1ZDczYjE2LTU2MjAtNDlkYS1iYmZiLWNkZTA3MzEyYjQ1YSJ9.3Z7w_H2BEXwrrCjDmJSbkIZuPWPknl39HCDV9VqeTBi7VjGbj1pgTlo9vo4tLSnO3jxTQP1ziY0E4AlJZTOGDA",
});

async function run() {
  const result = await db.execute("SELECT name, birthday FROM registrations");
  const records = result.rows;

  const today = new Date('2026-09-18');
  let cleanAges = [];

  records.forEach(r => {
    if (r.birthday) {
      const birthDate = new Date(r.birthday);
      if (!isNaN(birthDate.getTime())) {
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }
        
        if (age >= 10 && age <= 100) {
            cleanAges.push(age);
        } else {
            console.log("Anomalous age calculated for:", r.name, "Birthday entered:", r.birthday, "-> Age:", age);
        }
      }
    }
  });

  let ageRanges = {
    "18-24": 0,
    "25-34": 0,
    "35-44": 0,
    "45-54": 0,
    "55+": 0,
    "Menores de 18": 0
  };

  cleanAges.forEach(age => {
        if (age < 18) ageRanges["Menores de 18"]++;
        else if (age >= 18 && age <= 24) ageRanges["18-24"]++;
        else if (age >= 25 && age <= 34) ageRanges["25-34"]++;
        else if (age >= 35 && age <= 44) ageRanges["35-44"]++;
        else if (age >= 45 && age <= 54) ageRanges["45-54"]++;
        else if (age >= 55) ageRanges["55+"]++;
  });

  console.log("Valid age calculations:", cleanAges.length);
  console.log("Age Ranges:", ageRanges);

  if (cleanAges.length > 0) {
    const minAge = Math.min(...cleanAges);
    const maxAge = Math.max(...cleanAges);
    const avgAge = cleanAges.reduce((a, b) => a + b, 0) / cleanAges.length;
    console.log(`Min: ${minAge}, Max: ${maxAge}, Avg: ${avgAge.toFixed(1)}`);
  }
}
run();
