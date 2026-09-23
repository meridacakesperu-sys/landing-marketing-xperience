import Image from 'next/image';

export const metadata = {
  title: 'Bonos Exclusivos | Marketing Xperience',
  description: 'Descarga tus bonos exclusivos por asistir a Marketing Xperience.',
};

export default function BonosPage() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f172a', padding: '60px 20px', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        
        <header style={{ textAlign: 'center', marginBottom: '60px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ position: 'relative', width: '250px', height: '120px', marginBottom: '20px' }}>
            <Image 
              src="/logo.png" 
              alt="Marketing Xperience Logo" 
              fill 
              style={{ objectFit: 'contain' }}
              priority
            />
          </div>
          <h1 style={{ color: '#e6b85c', fontSize: '3rem', marginBottom: '15px', fontWeight: '800', letterSpacing: '-0.02em' }}>
            Tus Bonos Exclusivos
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '1.25rem', maxWidth: '600px', margin: '0 auto', lineHeight: '1.6' }}>
            Lo prometido es deuda. Gracias por ser parte de Marketing Xperience. Aquí tienes acceso inmediato a tus recursos especiales.
          </p>
        </header>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
          gap: '40px',
          justifyContent: 'center'
        }}>
          
          {/* Bono 1 */}
          <div style={{
            backgroundColor: 'rgba(30, 41, 59, 0.7)',
            borderRadius: '20px',
            padding: '30px',
            border: '1px solid rgba(230, 184, 92, 0.2)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
            transition: 'transform 0.3s ease',
          }}
          className="bono-card"
          >
            <div style={{ position: 'relative', width: '100%', aspectRatio: '3/4', marginBottom: '25px', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}>
              <Image 
                src="/bono_15_ideas.png"
                alt="15 Ideas de Negocios Digitales"
                fill
                style={{ objectFit: 'cover' }}
                priority
              />
            </div>
            <h2 style={{ color: 'white', fontSize: '1.5rem', marginBottom: '10px', textAlign: 'center', fontWeight: 'bold' }}>
              15 Ideas de Negocios Digitales
            </h2>
            <p style={{ color: '#cbd5e1', textAlign: 'center', marginBottom: '25px', flexGrow: 1, fontSize: '0.95rem', lineHeight: '1.5' }}>
              Descubre modelos probados para emprender en el mundo digital y generar nuevas fuentes de ingresos.
            </p>
            <a 
              href="/15_ideas_de_negocios_digitales.pdf" 
              download 
              className="btn-download"
              style={{
                backgroundColor: '#e6b85c',
                color: '#0f172a',
                padding: '14px 30px',
                borderRadius: '50px',
                fontWeight: 'bold',
                textDecoration: 'none',
                width: '100%',
                textAlign: 'center',
                fontSize: '1.1rem',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '10px',
                boxShadow: '0 4px 15px rgba(230, 184, 92, 0.3)',
                transition: 'all 0.2s ease'
              }}
            >
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
              Descargar PDF
            </a>
          </div>

          {/* Bono 2 */}
          <div style={{
            backgroundColor: 'rgba(30, 41, 59, 0.7)',
            borderRadius: '20px',
            padding: '30px',
            border: '1px solid rgba(230, 184, 92, 0.2)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
            transition: 'transform 0.3s ease',
          }}
          className="bono-card"
          >
            <div style={{ position: 'relative', width: '100%', aspectRatio: '3/4', marginBottom: '25px', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}>
              <Image 
                src="/bono_25_estrategias.png"
                alt="25 Estrategias de Fidelización"
                fill
                style={{ objectFit: 'cover' }}
                priority
              />
            </div>
            <h2 style={{ color: 'white', fontSize: '1.5rem', marginBottom: '10px', textAlign: 'center', fontWeight: 'bold' }}>
              25 Estrategias de Fidelización
            </h2>
            <p style={{ color: '#cbd5e1', textAlign: 'center', marginBottom: '25px', flexGrow: 1, fontSize: '0.95rem', lineHeight: '1.5' }}>
              Aprende las mejores tácticas para retener a tus clientes, aumentar su valor de por vida y convertirlos en embajadores de tu marca.
            </p>
            <a 
              href="/25_estrategias_de_fidelizacion.pdf" 
              download 
              className="btn-download"
              style={{
                backgroundColor: '#e6b85c',
                color: '#0f172a',
                padding: '14px 30px',
                borderRadius: '50px',
                fontWeight: 'bold',
                textDecoration: 'none',
                width: '100%',
                textAlign: 'center',
                fontSize: '1.1rem',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '10px',
                boxShadow: '0 4px 15px rgba(230, 184, 92, 0.3)',
                transition: 'all 0.2s ease'
              }}
            >
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
              Descargar PDF
            </a>
          </div>

        </div>
        
        {/* Footer info */}
        <div style={{ marginTop: '60px', textAlign: 'center', color: '#64748b', fontSize: '0.9rem' }}>
          <p>© {new Date().getFullYear()} Marketing Xperience. Todos los derechos reservados.</p>
        </div>
        
      </div>
      
      {/* Global styles for hover effects */}
      <style dangerouslySetInnerHTML={{__html: `
        .bono-card:hover {
          transform: translateY(-5px);
          border-color: rgba(230, 184, 92, 0.5) !important;
        }
        .btn-download:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(230, 184, 92, 0.5) !important;
        }
      `}} />
    </div>
  );
}
