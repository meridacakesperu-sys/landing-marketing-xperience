import Image from 'next/image';

export const metadata = {
  title: 'Clase Gratuita | Marketing Xperience',
  description: 'Disfruta de esta clase exclusiva como bono gratuito de Marketing Xperience.',
};

export default function ClasePage() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f172a', padding: '60px 20px', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        
        {/* Header / Logo */}
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <Image 
            src="/logo.png" 
            alt="Marketing Xperience" 
            width={300} 
            height={100}
            style={{ objectFit: 'contain' }}
            priority
          />
        </div>

        {/* Video Section */}
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h1 style={{ color: '#e6b85c', fontSize: '2.5rem', marginBottom: '15px', fontWeight: '900', lineHeight: '1.2' }}>
            Tus primeros 1000$ al mes con tu talento
          </h1>
          <p style={{ color: '#cbd5e1', fontSize: '1.2rem', marginBottom: '40px', maxWidth: '700px', margin: '0 auto 40px auto' }}>
            Aprende la hoja de ruta exacta para monetizar lo que sabes y llegar a tus primeros $1,000 mensuales.
          </p>

          <div style={{
            backgroundColor: 'rgba(30, 41, 59, 0.7)',
            borderRadius: '20px',
            padding: '20px',
            border: '1px solid rgba(230, 184, 92, 0.2)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
          }}>
            <div style={{ padding: '56.25% 0 0 0', position: 'relative' }}>
              <iframe 
                src="https://player.vimeo.com/video/76979871?h=8272103f6e&title=0&byline=0&portrait=0" 
                style={{ position: 'absolute', top: '0', left: '0', width: '100%', height: '100%' }} 
                frameBorder="0" 
                allow="autoplay; fullscreen; picture-in-picture" 
                allowFullScreen
                title="Clase Gratuita Marketing Xperience"
              ></iframe>
            </div>
            <script src="https://player.vimeo.com/api/player.js"></script>
          </div>

          <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'center' }}>
            <a 
              href="/primeros_1000_al_mes.pdf" 
              download 
              className="btn-download"
              style={{
                backgroundColor: '#e6b85c',
                color: '#0f172a',
                padding: '16px 36px',
                borderRadius: '50px',
                fontWeight: 'bold',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '12px',
                fontSize: '1.2rem',
                boxShadow: '0 10px 25px rgba(230, 184, 92, 0.4)',
                transition: 'all 0.3s ease'
              }}
            >
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
              Descargar PDF de la Clase
            </a>
          </div>
        </div>

        {/* CTA Section (Same as /bonos) */}
        <div style={{
          backgroundColor: '#1e293b',
          borderRadius: '24px',
          padding: '40px',
          display: 'flex',
          alignItems: 'center',
          gap: '40px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
          border: '1px solid rgba(255,255,255,0.05)',
          flexDirection: 'row',
        }} className="cta-container">
          
          <div style={{ flex: 1 }}>
            <h2 style={{ color: 'white', fontSize: '2.2rem', marginBottom: '20px', fontWeight: '800', lineHeight: '1.2' }}>
              ¿Crees que puedes acelerar el crecimiento de tu negocio digital?
            </h2>
            <p style={{ color: '#cbd5e1', fontSize: '1.15rem', marginBottom: '30px', lineHeight: '1.6' }}>
              Implementemos juntos en tu negocio el sistema que me ha funcionado todos estos años en negocios digitales.
            </p>
            <a 
              href="https://wa.me/584123060970?text=Hola%20quiero%20tener%20la%20consultoría%20Xperience" 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn-whatsapp"
              style={{
                backgroundColor: '#25D366',
                color: 'white',
                padding: '16px 30px',
                borderRadius: '50px',
                fontWeight: 'bold',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '12px',
                fontSize: '1.1rem',
                boxShadow: '0 10px 25px rgba(37, 211, 102, 0.4)',
                transition: 'all 0.3s ease'
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>
              Planificar consultoría Xperience con Eduar Peña
            </a>
          </div>

          <div style={{ flexShrink: 0, position: 'relative', width: '350px', height: '350px' }} className="cta-image-wrapper">
            <Image 
              src="/eduar_cta.png"
              alt="Eduar Peña"
              fill
              style={{ objectFit: 'contain' }}
              priority
            />
          </div>
          
        </div>
        
        {/* Footer info */}
        <div style={{ marginTop: '60px', textAlign: 'center', color: '#64748b', fontSize: '0.9rem' }}>
          <p>© {new Date().getFullYear()} Marketing Xperience. Todos los derechos reservados.</p>
        </div>
        
      </div>
      
      {/* Global styles for responsiveness and hover effects */}
      <style dangerouslySetInnerHTML={{__html: `
        .btn-download:hover {
          transform: translateY(-3px);
          box-shadow: 0 15px 35px rgba(230, 184, 92, 0.5) !important;
        }
        .btn-whatsapp:hover {
          transform: translateY(-3px);
          box-shadow: 0 15px 35px rgba(37, 211, 102, 0.5) !important;
        }
        
        /* Mobile styles */
        @media (max-width: 800px) {
          .cta-container {
            flex-direction: column !important;
            text-align: center;
            padding: 20px 20px 40px 20px !important;
          }
          .cta-container h2 {
            font-size: 1.8rem !important;
          }
          .cta-image-wrapper {
            width: 100% !important;
            height: 380px !important;
            order: -1; /* Put image on top on mobile */
            margin-bottom: -10px;
            margin-top: 10px;
          }
          .btn-whatsapp {
            width: 100%;
            justify-content: center;
          }
        }
      `}} />
    </div>
  );
}
