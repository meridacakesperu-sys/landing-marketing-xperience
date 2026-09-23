"use client";

import { useState } from 'react';

export default function WaitlistForm() {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: ''
  });
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('');

    try {
      const res = await fetch('/api/public/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (data.success) {
        setStatus('success');
        setMessage(data.message);
        setFormData({ full_name: '', email: '', phone: '' });
      } else {
        setStatus('error');
        setMessage(data.message || 'Error al procesar tu solicitud');
      }
    } catch (error) {
      console.error(error);
      setStatus('error');
      setMessage('Hubo un problema de conexión. Intenta nuevamente.');
    }
  };

  if (status === 'success') {
    return (
      <div style={{ textAlign: 'center', padding: '30px 20px', backgroundColor: 'rgba(37, 211, 102, 0.1)', borderRadius: '16px', border: '1px solid rgba(37, 211, 102, 0.3)' }}>
        <div style={{ fontSize: '3rem', marginBottom: '15px' }}>🎉</div>
        <h3 style={{ color: '#25D366', fontSize: '1.5rem', marginBottom: '10px' }}>¡Estás en la lista!</h3>
        <p style={{ color: '#cbd5e1', lineHeight: '1.5' }}>{message}</p>
        <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '20px' }}>Mantente atento a tu correo para las próximas novedades.</p>
        <button 
          onClick={() => setStatus('idle')}
          style={{ marginTop: '25px', backgroundColor: 'transparent', color: '#e6b85c', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
        >
          Registrar a alguien más
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {status === 'error' && (
        <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '15px', borderRadius: '8px', border: '1px solid rgba(239, 68, 68, 0.3)', textAlign: 'center', fontSize: '0.95rem' }}>
          {message}
        </div>
      )}

      <div>
        <label htmlFor="full_name" style={{ display: 'block', color: '#94a3b8', marginBottom: '8px', fontSize: '0.95rem' }}>Nombre Completo</label>
        <input 
          type="text" 
          id="full_name" 
          required 
          value={formData.full_name}
          onChange={(e) => setFormData({...formData, full_name: e.target.value})}
          style={{ width: '100%', padding: '14px', borderRadius: '12px', backgroundColor: '#0f172a', border: '1px solid #334155', color: 'white', fontSize: '1rem', outline: 'none', transition: 'border-color 0.2s' }}
          placeholder="Ej: María Pérez"
          onFocus={(e) => e.target.style.borderColor = '#e6b85c'}
          onBlur={(e) => e.target.style.borderColor = '#334155'}
        />
      </div>

      <div>
        <label htmlFor="email" style={{ display: 'block', color: '#94a3b8', marginBottom: '8px', fontSize: '0.95rem' }}>Correo Electrónico</label>
        <input 
          type="email" 
          id="email" 
          required 
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          style={{ width: '100%', padding: '14px', borderRadius: '12px', backgroundColor: '#0f172a', border: '1px solid #334155', color: 'white', fontSize: '1rem', outline: 'none', transition: 'border-color 0.2s' }}
          placeholder="ejemplo@correo.com"
          onFocus={(e) => e.target.style.borderColor = '#e6b85c'}
          onBlur={(e) => e.target.style.borderColor = '#334155'}
        />
      </div>

      <div>
        <label htmlFor="phone" style={{ display: 'block', color: '#94a3b8', marginBottom: '8px', fontSize: '0.95rem' }}>Número de Teléfono / WhatsApp</label>
        <input 
          type="tel" 
          id="phone" 
          required 
          value={formData.phone}
          onChange={(e) => setFormData({...formData, phone: e.target.value})}
          style={{ width: '100%', padding: '14px', borderRadius: '12px', backgroundColor: '#0f172a', border: '1px solid #334155', color: 'white', fontSize: '1rem', outline: 'none', transition: 'border-color 0.2s' }}
          placeholder="+58 412 123 4567"
          onFocus={(e) => e.target.style.borderColor = '#e6b85c'}
          onBlur={(e) => e.target.style.borderColor = '#334155'}
        />
      </div>

      <button 
        type="submit" 
        disabled={status === 'loading'}
        style={{
          marginTop: '10px',
          backgroundColor: '#e6b85c',
          color: '#0f172a',
          padding: '16px',
          borderRadius: '50px',
          fontWeight: 'bold',
          fontSize: '1.1rem',
          border: 'none',
          cursor: status === 'loading' ? 'not-allowed' : 'pointer',
          opacity: status === 'loading' ? 0.7 : 1,
          boxShadow: '0 4px 15px rgba(230, 184, 92, 0.3)',
          transition: 'transform 0.2s, box-shadow 0.2s',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
        onMouseEnter={(e) => { if(status!=='loading') { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(230, 184, 92, 0.5)'; } }}
        onMouseLeave={(e) => { if(status!=='loading') { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 15px rgba(230, 184, 92, 0.3)'; } }}
      >
        {status === 'loading' ? 'Procesando...' : 'Unirme a la lista de espera'}
      </button>

    </form>
  );
}
