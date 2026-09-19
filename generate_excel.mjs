import { createClient } from '@libsql/client';
import xlsx from 'xlsx';

const db = createClient({
  url: "libsql://mx-database-clean-eduarps9513-blip.aws-us-east-1.turso.io",
  authToken: "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3ODM5ODkzNDEsImlkIjoiMDE5ZjVlMGMtYjQwMS03ZGQ4LTllZGQtY2VmYzA2ZWY4ZGMzIiwia2lkIjoiZXp6Q0MwS0s1eC1FSldzU1VWRUtmendnSlk3VVljZm9hZU5mT0FXV1U5ayIsInJpZCI6ImI1ZDczYjE2LTU2MjAtNDlkYS1iYmZiLWNkZTA3MzEyYjQ1YSJ9.3Z7w_H2BEXwrrCjDmJSbkIZuPWPknl39HCDV9VqeTBi7VjGbj1pgTlo9vo4tLSnO3jxTQP1ziY0E4AlJZTOGDA",
});

const getLifePath = (d) => {
  const sum = (n) => n.toString().split('').reduce((a, b) => parseInt(a) + parseInt(b), 0);
  let total = sum(d.getFullYear()) + sum(d.getMonth() + 1) + sum(d.getDate());
  while (total > 9 && total !== 11 && total !== 22 && total !== 33) {
    total = sum(total);
  }
  return total;
};

const zodiacData = [
  {
    match: (m, d) => (m === 3 && d >= 21) || (m === 4 && d <= 19),
    sign: 'Aries ♈',
    work: 'Líderes innatos, proactivos y competitivos. Prefieren dirigir e iniciar proyectos.',
    social: 'Directos, entusiastas y el alma de la fiesta. Son amigos leales pero impacientes.',
    internal: 'Poseen un fuego interno de valentía, aunque a veces temen el estancamiento o la dependencia.',
    money: 'Excelentes para generar ingresos rápidamente, pero propensos a gastos impulsivos.',
    family: 'Protectores e intensos. Fomentan la independencia en su núcleo familiar.'
  },
  {
    match: (m, d) => (m === 4 && d >= 20) || (m === 5 && d <= 20),
    sign: 'Tauro ♉',
    work: 'Trabajadores incansables, metódicos y sumamente confiables. Buscan estabilidad.',
    social: 'Tranquilos, disfrutan de grupos pequeños y placeres sensoriales (buena comida, arte).',
    internal: 'Valoran profundamente la seguridad. Son resilientes pero muy testarudos ante el cambio.',
    money: 'Excelentes administradores. Acumulan riqueza a paso seguro y evitan riesgos innecesarios.',
    family: 'Proveedores tradicionales, afectuosos y constantes. Buscan crear un hogar confortable.'
  },
  {
    match: (m, d) => (m === 5 && d >= 21) || (m === 6 && d <= 20),
    sign: 'Géminis ♊',
    work: 'Adaptables, excelentes comunicadores y rápidos para aprender. Brillan en multitareas.',
    social: 'Carismáticos, curiosos y muy sociables. Se llevan bien con todo tipo de personas.',
    internal: 'Mente hiperactiva, siempre buscando estímulo intelectual. Pueden sufrir de ansiedad.',
    money: 'Saben hacer dinero con su intelecto y redes, pero sus finanzas pueden fluctuar por aburrimiento.',
    family: 'Divertidos y poco convencionales. Prefieren una relación intelectual y libre con los suyos.'
  },
  {
    match: (m, d) => (m === 6 && d >= 21) || (m === 7 && d <= 22),
    sign: 'Cáncer ♋',
    work: 'Empáticos y cuidadores. Excelentes en recursos humanos, psicología o negocios familiares.',
    social: 'Selectivos. Prefieren reuniones íntimas con personas en las que confían ciegamente.',
    internal: 'Profundamente emocionales e intuitivos. Usan una coraza para proteger su enorme sensibilidad.',
    money: 'Ahorrativos y precavidos. Ven el dinero como seguridad emocional para el futuro.',
    family: 'La familia lo es todo. Son el pilar emocional, extremadamente protectores y maternales/paternales.'
  },
  {
    match: (m, d) => (m === 7 && d >= 23) || (m === 8 && d <= 22),
    sign: 'Leo ♌',
    work: 'Creativos, carismáticos y nacidos para liderar. Necesitan reconocimiento y brillar en su área.',
    social: 'Generosos, leales y el centro de atención. Aman el drama, pero tienen un corazón de oro.',
    internal: 'Poseen un profundo sentido del honor, aunque su ego puede ser su mayor vulnerabilidad.',
    money: 'Saben atraer riqueza pero también gastan en lujos. Les gusta demostrar su éxito material.',
    family: 'Son los "reyes" del hogar. Extremadamente cálidos, generosos, pero exigen respeto absoluto.'
  },
  {
    match: (m, d) => (m === 8 && d >= 23) || (m === 9 && d <= 22),
    sign: 'Virgo ♍',
    work: 'Perfeccionistas, analíticos y sumamente eficientes. Detectan los detalles que los demás ignoran.',
    social: 'Serviciales y discretos. Muestran su afecto haciendo favores más que con palabras.',
    internal: 'Críticos consigo mismos y con los demás. Les cuesta soltar el control y relajarse.',
    money: 'Prudentes y organizados. Nunca toman riesgos financieros sin un análisis detallado previo.',
    family: 'Se encargan de que todo funcione perfectamente. Suelen ser el sostén práctico de la familia.'
  },
  {
    match: (m, d) => (m === 9 && d >= 23) || (m === 10 && d <= 22),
    sign: 'Libra ♎',
    work: 'Diplomáticos y excelentes mediadores. Trabajan mejor en equipo y buscan el equilibrio estético.',
    social: 'Encantadores, sociables y evitan el conflicto a toda costa. Son el "pegamento" de su grupo.',
    internal: 'Buscan paz y armonía absoluta. Les cuesta tomar decisiones por miedo a equivocarse.',
    money: 'Gastan en cosas hermosas, diseño y arte. Atraen dinero a través de alianzas y socios.',
    family: 'Conciliadores del hogar. Buscan que todos se lleven bien y el ambiente sea estéticamente pacífico.'
  },
  {
    match: (m, d) => (m === 10 && d >= 23) || (m === 11 && d <= 21),
    sign: 'Escorpio ♏',
    work: 'Estratégicos, intensos y enfocados. Ideales para investigaciones, finanzas o resolver crisis.',
    social: 'Misteriosos y magnéticos. Tienen pocos amigos pero sus lealtades son a muerte.',
    internal: 'Viven en los extremos (todo o nada). Experimentan transformaciones emocionales muy profundas.',
    money: 'Muy instintivos. Tienen capacidad para amasar poder económico y gestionar dinero ajeno.',
    family: 'Extremadamente protectores y celosos de su intimidad. Leen lo que nadie dice en la mesa.'
  },
  {
    match: (m, d) => (m === 11 && d >= 22) || (m === 12 && d <= 21),
    sign: 'Sagitario ♐',
    work: 'Visionarios, optimistas y maestros naturales. Necesitan libertad y odian la rutina.',
    social: 'Aventureros, filosóficos y divertidos. Tienen amigos en cada rincón del mundo.',
    internal: 'Buscadores incansables de la verdad. A veces evaden el dolor mediante el optimismo excesivo.',
    money: 'La suerte suele acompañarlos. Ven el dinero como un pasaje para experiencias, no para acumular.',
    family: 'Inspiradores pero desapegados. Animan a su familia a explorar el mundo y pensar en grande.'
  },
  {
    match: (m, d) => (m === 12 && d >= 22) || (m === 1 && d <= 19),
    sign: 'Capricornio ♑',
    work: 'Ambiciosos, estructurados y responsables. Alcanzan la cima gracias a su disciplina de hierro.',
    social: 'Selectivos y un poco formales. Prefieren contactos que aporten valor a sus objetivos.',
    internal: 'Se exigen demasiado. A veces sienten que cargan el peso del mundo sobre sus hombros.',
    money: 'Excelentes inversores a largo plazo. Respetan el dinero y lo usan para consolidar su estatus.',
    family: 'Los proveedores responsables. Establecen reglas claras y son el ancla de estabilidad familiar.'
  },
  {
    match: (m, d) => (m === 1 && d >= 20) || (m === 2 && d <= 18),
    sign: 'Acuario ♒',
    work: 'Innovadores, originales y tecnológicos. Prefieren trabajar por ideales y causas sociales.',
    social: 'Altruistas, amigables pero desapegados. Aman a la humanidad pero valoran su espacio personal.',
    internal: 'Mentes brillantes que a menudo se sienten incomprendidas. Viven en el futuro.',
    money: 'Impredecibles. Pueden hacerse ricos con ideas disruptivas o desinteresarse por completo del capital.',
    family: 'Padres/Hijos poco convencionales. Promueven la libertad absoluta y el pensamiento crítico.'
  },
  {
    match: (m, d) => (m === 2 && d >= 19) || (m === 3 && d <= 20),
    sign: 'Piscis ♓',
    work: 'Artísticos, sanadores e intuitivos. Destacan en profesiones creativas, espirituales o de ayuda.',
    social: 'Compasivos y empáticos. Tienden a absorber las emociones de quienes los rodean.',
    internal: 'Tienen una conexión mística. Viven entre la fantasía y la realidad; extremadamente soñadores.',
    money: 'Desapegados de lo material. Confían en que el universo proveerá y suelen tener suerte oculta.',
    family: 'Devotos y sacrificados. Conectan con su familia a un nivel espiritual profundo y sin juicios.'
  }
];

async function run() {
  const result = await db.execute("SELECT * FROM registrations ORDER BY name ASC");
  
  const formattedData = result.rows.map(row => {
    let numerology = 'No calculado';
    let signName = 'No calculado';
    let work = '';
    let social = '';
    let internal = '';
    let money = '';
    let family = '';
    
    if (row.birthday) {
      const d = new Date(row.birthday);
      if (!isNaN(d.getTime())) {
        numerology = getLifePath(d);
        const month = d.getMonth() + 1;
        const day = d.getDate();
        const signInfo = zodiacData.find(z => z.match(month, day));
        if (signInfo) {
          signName = signInfo.sign;
          work = signInfo.work;
          social = signInfo.social;
          internal = signInfo.internal;
          money = signInfo.money;
          family = signInfo.family;
        }
      }
    }
    
    return {
      "Nombre": row.name,
      "Email": row.email,
      "Teléfono": row.phone,
      "Fecha de Nacimiento": row.birthday || '',
      "Ocupación": row.occupation || '',
      "Negocio": row.business || row.business_details || '',
      "Instagram": row.social_media || '',
      "Tipo de Venta": row.sales_type || '',
      "Objetivo Principal": row.main_goal || '',
      "Mayor Desafío": row.main_struggle || '',
      "Nivel Marketing": row.marketing_level || '',
      "Nivel IA": row.ai_level || '',
      "Nivel Ventas": row.sales_level || '',
      "Signo Zodiacal": signName,
      "Numerología (Camino de la Vida)": numerology,
      "Perfil Zodiacal: Trabajo": work,
      "Perfil Zodiacal: Social": social,
      "Perfil Zodiacal: Interno": internal,
      "Perfil Zodiacal: Dinero": money,
      "Perfil Zodiacal: Familia": family,
    };
  });
  
  const worksheet = xlsx.utils.json_to_sheet(formattedData);
  const workbook = xlsx.utils.book_new();
  xlsx.utils.book_append_sheet(workbook, worksheet, "Contactos y Numerología");
  
  const outPath = '/Users/eduarantoniopenasosa/.gemini/antigravity/brain/0fe5c7af-bee7-4ae1-95ab-dd238ddb8f2e/Contactos_Encuesta_Numerologia.xlsx';
  xlsx.writeFile(workbook, outPath);
  console.log('Excel file generated successfully at', outPath);
}
run();
