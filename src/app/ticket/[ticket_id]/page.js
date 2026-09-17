import { headers } from 'next/headers';
import db from '@/lib/db';
import DownloadButton from './DownloadButton';

export const dynamic = 'force-dynamic';

export default async function TicketPage({ params }) {
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
          <h1 style={{ color: '#ef4444', marginBottom: '10px' }}>❌ Entrada Inválida</h1>
          <p style={{ color: '#94a3b8' }}>Este código no pertenece a ninguna entrada registrada.</p>
        </div>
      </div>
    );
  }

  const isVIP = client.plan.includes('VIP');
  
  const headersList = await headers();
  const host = headersList.get('host') || 'localhost:3000';
  const protocol = headersList.get('x-forwarded-proto') || 'https';
  const ticketUrl = `${protocol}://${host}/ticket/${client.ticket_id}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(ticketUrl)}`;

  return (
    <div style={{ minHeight: '100vh', background: '#020617', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div id="ticket-card" style={{ width: '100%', maxWidth: '400px', background: 'rgba(30, 41, 59, 0.8)', border: `1px solid ${isVIP ? '#c19845' : '#4a89a7'}`, borderRadius: '24px', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }}>
        
        <div style={{ background: isVIP ? 'linear-gradient(135deg, #c19845, #d4af37)' : 'linear-gradient(135deg, #4a89a7, #3b82f6)', padding: '30px 20px', textAlign: 'center' }}>
          <h2 style={{ color: '#0f172a', margin: 0, fontSize: '1.5rem', fontWeight: '800' }}>Marketing Xperience</h2>
          <div style={{ background: 'rgba(255,255,255,0.2)', display: 'inline-block', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold', color: '#0f172a', marginTop: '10px' }}>
            ENTRADA {client.plan.split('(')[0].trim().toUpperCase()}
          </div>
        </div>

        <div style={{ padding: '30px', textAlign: 'center' }}>
          <div style={{ background: '#fff', display: 'inline-block', padding: '15px', borderRadius: '16px', marginBottom: '20px' }}>
            <img src={qrUrl} alt="QR Code" style={{ width: '200px', height: '200px', display: 'block' }} />
          </div>
          <h1 style={{ color: '#f8fafc', fontSize: '1.8rem', margin: '0 0 5px 0' }}>{client.name}</h1>
          <p style={{ color: '#94a3b8', margin: '0 0 20px 0' }}>{client.email}</p>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', background: 'rgba(15, 23, 42, 0.5)', padding: '15px', borderRadius: '12px', marginBottom: '20px', textAlign: 'left' }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>ESTADO</div>
              <div style={{ color: '#10b981', fontWeight: 'bold' }}>{client.status === 'Completado' ? 'Pagado' : client.status}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>TICKET ID</div>
              <div style={{ color: '#cbd5e1', fontWeight: 'bold', fontFamily: 'monospace' }}>{client.ticket_id}</div>
            </div>
          </div>

          <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '20px' }}>
            Entrada Válida para el Evento.
          </div>

          <DownloadButton targetId="ticket-card" fileName={`Entrada_${client.ticket_id}.png`} isVIP={isVIP} />
        </div>

      </div>
    </div>
  );
}
