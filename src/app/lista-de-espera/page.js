import Image from 'next/image';
import WaitlistForm from './WaitlistForm';

export const metadata = {
  title: 'Lista de Espera 2027 | Marketing Xperience',
  description: 'Únete a la lista de espera para Marketing Xperience 2027 y obtén beneficios exclusivos.',
};

export default function WaitlistPage() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f172a', padding: '60px 20px', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto', backgroundColor: 'rgba(30, 41, 59, 0.7)', borderRadius: '24px', padding: '40px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)', border: '1px solid rgba(255,255,255,0.05)' }}>
        
        <header style={{ textAlign: 'center', marginBottom: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ position: 'relative', width: '200px', height: '100px', marginBottom: '20px' }}>
            <Image 
              src="/logo.png" 
              alt="Marketing Xperience Logo" 
              fill 
              style={{ objectFit: 'contain' }}
              priority
            />
          </div>
          <h1 style={{ color: '#e6b85c', fontSize: '2.5rem', marginBottom: '15px', fontWeight: '800', lineHeight: '1.2' }}>
            Lista de Espera 2027
          </h1>
          <p style={{ color: '#cbd5e1', fontSize: '1.1rem', lineHeight: '1.6' }}>
            Asegura tu lugar para el evento más esperado del próximo año. Al registrarte hoy, garantizas <strong>beneficios exclusivos</strong> y el <strong>mejor precio de todos</strong> cuando abramos inscripciones.
          </p>
        </header>

        <WaitlistForm />
        
        <div style={{ marginTop: '40px', textAlign: 'center', color: '#64748b', fontSize: '0.85rem' }}>
          <p>© {new Date().getFullYear()} Marketing Xperience. Todos los derechos reservados.</p>
        </div>
      </div>
    </div>
  );
}
