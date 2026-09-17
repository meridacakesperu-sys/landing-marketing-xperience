import db from '@/lib/db';
import DownloadCertButton from './DownloadCertButton';

export const dynamic = 'force-dynamic';

export default async function CertificadoPage({ params }) {
  const resolvedParams = await params;
  const { ticket_id } = resolvedParams;
  
  const result = await db.execute({
    sql: 'SELECT * FROM registrations WHERE ticket_id = ?',
    args: [ticket_id]
  });
  const client = result.rows[0];

  if (!client) {
    return (
      <div style={{ minHeight: '100vh', background: '#020617', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f8fafc' }}>
        <div style={{ background: 'rgba(30, 41, 59, 0.7)', padding: '40px', borderRadius: '16px', textAlign: 'center', border: '1px solid #ef4444' }}>
          <h1 style={{ color: '#ef4444', marginBottom: '10px' }}>❌ Certificado no encontrado</h1>
          <p style={{ color: '#94a3b8' }}>Este código no pertenece a ninguna entrada registrada.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#020617', 
      padding: '40px 20px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      <h1 style={{ color: '#f8fafc', marginBottom: '30px', textAlign: 'center' }}>
        Certificado de Participación
      </h1>
      
      {/* Scrollable container for mobile */}
      <div style={{ width: '100%', maxWidth: '100vw', overflowX: 'auto', display: 'flex', justifyContent: 'center' }}>
        
        {/* Certificate Canvas */}
        <div 
          id="certificate-canvas"
          style={{
            position: 'relative',
            width: '1024px',
            height: '791px',
            minWidth: '1024px', // Force size for consistent generation
            backgroundImage: 'url(/certificado_bg.png)',
            backgroundSize: '1024px 791px',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundColor: '#fff',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          }}
        >
          {/* Dynamic Name */}
          <div style={{
            position: 'absolute',
            top: '49%', // Approximated position under "CERTIFICADO A"
            left: '0',
            width: '100%',
            textAlign: 'center',
            fontSize: '38px',
            fontWeight: 'bold',
            fontFamily: '"Times New Roman", Times, serif', // Looks like a formal serif font is appropriate
            color: '#0f172a',
            letterSpacing: '2px',
            textTransform: 'uppercase'
          }}>
            {client.name}
          </div>
        </div>

      </div>

      <DownloadCertButton targetId="certificate-canvas" userName={client.name} />
      
    </div>
  );
}
