import { createClient } from '@libsql/client';
import fs from 'fs';
import path from 'path';

const db = createClient({
  url: "libsql://mx-database-clean-eduarps9513-blip.aws-us-east-1.turso.io",
  authToken: "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3ODM5ODkzNDEsImlkIjoiMDE5ZjVlMGMtYjQwMS03ZGQ4LTllZGQtY2VmYzA2ZWY4ZGMzIiwia2lkIjoiZXp6Q0MwS0s1eC1FSldzU1VWRUtmendnSlk3VVljZm9hZU5mT0FXV1U5ayIsInJpZCI6ImI1ZDczYjE2LTU2MjAtNDlkYS1iYmZiLWNkZTA3MzEyYjQ1YSJ9.3Z7w_H2BEXwrrCjDmJSbkIZuPWPknl39HCDV9VqeTBi7VjGbj1pgTlo9vo4tLSnO3jxTQP1ziY0E4AlJZTOGDA",
});

async function run() {
  const result = await db.execute("SELECT name, occupation, business, business_details, social_media FROM registrations ORDER BY name ASC");
  const records = result.rows;

  let report = "# Lista de Contactos (Nombres, Ocupación, Negocio, Instagram)\n\n";
  report += "| Nombre | Ocupación | Negocio | Instagram |\n";
  report += "|---|---|---|---|\n";

  let occupationsMap = {};
  let businessMap = {};

  records.forEach(r => {
    let name = r.name || 'Sin nombre';
    let occupation = r.occupation || 'No especificada';
    let businessStr = r.business ? r.business : (r.business_details || 'Sin negocio');
    let ig = r.social_media || '-';

    report += `| ${name} | ${occupation} | ${businessStr} | ${ig} |\n`;

    // Process occupations for summary (normalize slightly)
    if (r.occupation && r.occupation.trim().length > 0) {
      let occNormalized = r.occupation.trim().toLowerCase();
      // Capitalize first letter for display
      occNormalized = occNormalized.charAt(0).toUpperCase() + occNormalized.slice(1);
      occupationsMap[occNormalized] = (occupationsMap[occNormalized] || 0) + 1;
    }
    
    // Process business for summary (normalize slightly)
    if (businessStr !== 'Sin negocio' && businessStr.trim().length > 0) {
      let bizNormalized = businessStr.trim().toLowerCase();
      bizNormalized = bizNormalized.charAt(0).toUpperCase() + bizNormalized.slice(1);
      businessMap[bizNormalized] = (businessMap[bizNormalized] || 0) + 1;
    }
  });

  report += "\n## Resumen de Ocupaciones Más Comunes\n\n";
  const occSorted = Object.entries(occupationsMap).sort((a, b) => b[1] - a[1]);
  occSorted.slice(0, 10).forEach(([occ, count]) => {
    if (count > 1) {
      report += `- **${occ}**: ${count} personas\n`;
    }
  });
  
  if(occSorted.length > 0 && occSorted[0][1] <= 1) {
    report += "No hay ocupaciones repetidas.\n";
  }

  report += "\n## Resumen de Tipos de Negocio Más Comunes\n\n";
  // Since business inputs can be messy (e.g. "Tienda de ropa", "Ropa", etc.), 
  // exact matching might not group everything perfectly, but it's a good estimate.
  const bizSorted = Object.entries(businessMap).sort((a, b) => b[1] - a[1]);
  bizSorted.slice(0, 10).forEach(([biz, count]) => {
    if (count > 1) {
      report += `- **${biz}**: ${count} personas\n`;
    }
  });

  if(bizSorted.length > 0 && bizSorted[0][1] <= 1) {
    report += "No hay negocios repetidos de forma exacta.\n";
  }

  const outPath = '/Users/eduarantoniopenasosa/.gemini/antigravity/brain/0fe5c7af-bee7-4ae1-95ab-dd238ddb8f2e/Contactos_Ocupacion.md';
  fs.writeFileSync(outPath, report, 'utf8');
  console.log('Report saved to', outPath);
}
run();
