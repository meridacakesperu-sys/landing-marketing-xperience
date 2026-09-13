'use client';
import { useState } from 'react';
import Image from 'next/image';

export default function RegistroLider() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    business: '',
    birthday: '',
    notes: ''
  });
  const [status, setStatus] = useState({ loading: false, success: false, error: null });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, success: false, error: null });

    try {
      const response = await fetch('/api/admin/leaders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Error al registrar');

      setStatus({ loading: false, success: true, error: null });
      setFormData({ name: '', email: '', phone: '', business: '', birthday: '', notes: '' });
    } catch (error) {
      setStatus({ loading: false, success: false, error: error.message });
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f172a', color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px 20px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <div style={{ marginBottom: '30px', textAlign: 'center' }}>
        <Image src="/logo.png" alt="Marketing Xperience" width={200} height={45} style={{ objectFit: 'contain' }} />
        <h1 style={{ marginTop: '20px', fontSize: '2rem', color: '#e6b85c' }}>Registro de Líderes</h1>
        <p style={{ opacity: 0.8, marginTop: '10px' }}>Completa el formulario para unirte como líder del evento.</p>
      </div>

      <div style={{ background: '#1e293b', padding: '40px', borderRadius: '16px', width: '100%', maxWidth: '600px', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}>
        {status.success ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🎉</div>
            <h2 style={{ color: '#10b981', marginBottom: '15px' }}>¡Registro Exitoso!</h2>
            <p style={{ opacity: 0.8 }}>Tus datos han sido guardados correctamente en el sistema.</p>
            <button 
              onClick={() => setStatus({ loading: false, success: false, error: null })}
              style={{ marginTop: '30px', padding: '12px 24px', background: 'transparent', border: '1px solid #e6b85c', color: '#e6b85c', borderRadius: '8px', cursor: 'pointer' }}
            >
              Registrar otro líder
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.9rem', color: '#cbd5e1' }}>Nombre Completo *</label>
              <input required type="text" name="name" value={formData.name} onChange={handleChange} style={{ padding: '12px 16px', borderRadius: '8px', border: '1px solid #334155', background: '#0f172a', color: '#fff', outline: 'none' }} placeholder="Ej. Yissel Carpio" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '0.9rem', color: '#cbd5e1' }}>Correo</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} style={{ padding: '12px 16px', borderRadius: '8px', border: '1px solid #334155', background: '#0f172a', color: '#fff', outline: 'none' }} placeholder="correo@gmail.com" />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '0.9rem', color: '#cbd5e1' }}>Teléfono</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} style={{ padding: '12px 16px', borderRadius: '8px', border: '1px solid #334155', background: '#0f172a', color: '#fff', outline: 'none' }} placeholder="+58 412..." />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '0.9rem', color: '#cbd5e1' }}>Cumpleaños</label>
                <input type="date" name="birthday" value={formData.birthday} onChange={handleChange} style={{ padding: '12px 16px', borderRadius: '8px', border: '1px solid #334155', background: '#0f172a', color: '#fff', outline: 'none' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '0.9rem', color: '#cbd5e1' }}>Negocio / Empresa</label>
                <input type="text" name="business" value={formData.business} onChange={handleChange} style={{ padding: '12px 16px', borderRadius: '8px', border: '1px solid #334155', background: '#0f172a', color: '#fff', outline: 'none' }} placeholder="Tu empresa" />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.9rem', color: '#cbd5e1' }}>Notas Internas (Opcional)</label>
              <textarea name="notes" value={formData.notes} onChange={handleChange} style={{ padding: '12px 16px', borderRadius: '8px', border: '1px solid #334155', background: '#0f172a', color: '#fff', outline: 'none', minHeight: '100px', resize: 'vertical' }} placeholder="Comentarios adicionales..."></textarea>
            </div>

            {status.error && (
              <div style={{ color: '#ef4444', fontSize: '0.9rem', padding: '10px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px' }}>
                {status.error}
              </div>
            )}

            <button 
              type="submit" 
              disabled={status.loading}
              style={{ 
                marginTop: '10px', 
                padding: '16px', 
                background: status.loading ? '#94a3b8' : '#e6b85c', 
                color: status.loading ? '#475569' : '#000', 
                fontWeight: 'bold', 
                fontSize: '1.1rem', 
                borderRadius: '8px', 
                border: 'none', 
                cursor: status.loading ? 'not-allowed' : 'pointer',
                transition: 'background 0.2s'
              }}
            >
              {status.loading ? 'Enviando...' : 'Guardar Líder'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
