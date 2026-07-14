const fs = require('fs');
const path = require('path');

const files = [
  'src/app/admin/attendees/AttendeesClient.js',
  'src/app/admin/calendar/CalendarClient.js',
  'src/app/admin/campaign/CampaignClient.js',
  'src/app/admin/contacts/ContactsClient.js'
];

files.forEach(f => {
  const filePath = path.join(__dirname, f);
  if (!fs.existsSync(filePath)) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Replace width: '400px'
  content = content.replace(/width:\s*'400px'/g, "width: '95%', maxWidth: '400px'");
  // Replace width: '500px'
  content = content.replace(/width:\s*'500px'/g, "width: '95%', maxWidth: '500px'");
  
  // Also fix the mistake in AttendeesClient.js
  content = content.replace(/\{showMaterialModal && \(\n\s*<div style=\{\{ position: 'fixed',/g, "{showEventModal && (\n        <div style={{ position: 'fixed',");

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated ${f}`);
});
