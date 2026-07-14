'use client';

import { useState } from 'react';

export default function RegistrationModal({ isOpen, onClose, selectedPlan, ticketPrice, purchaseStage, refCode }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    birthday: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          ...formData, 
          plan: selectedPlan,
          ticket_price: ticketPrice,
          purchase_stage: purchaseStage,
          ref_code: refCode
        }),
      });

      if (!response.ok) {
        throw new Error('Error al registrar');
      }

      // Format WhatsApp message
      const text = `Hola, me he registrado para el evento Marketing Xperience 2026.%0A%0ANombre: ${formData.name}%0AEmail: ${formData.email}%0ACumpleaños: ${formData.birthday}%0APlan Seleccionado: ${selectedPlan} ($${ticketPrice})%0A%0AQuiero conocer los métodos de pago.`;
      
      // Redirect to WhatsApp
      window.location.href = `https://wa.me/584123060970?text=${text}`;
      
    } catch (err) {
      setError('Hubo un problema procesando tu registro. Intenta de nuevo.');
      setLoading(false);
    }
  };

  return (
    <div className={`modal-overlay ${isOpen ? 'active' : ''}`} onClick={(e) => {
      if (e.target.className.includes('modal-overlay')) onClose();
    }}>
      <div className="modal-content glass">
        <button className="close-btn" onClick={onClose}>&times;</button>
        <h3 style={{ fontSize: '1.8rem', marginBottom: '10px', color: 'var(--color-accent)' }}>Completa tu registro</h3>
        <p style={{ marginBottom: '20px', color: 'var(--color-text-muted)' }}>
          Plan seleccionado: <strong>{selectedPlan}</strong>
        </p>

        {error && <div style={{ color: '#ff6b6b', marginBottom: '15px' }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nombre y Apellido</label>
            <input 
              type="text" 
              name="name" 
              required 
              value={formData.name} 
              onChange={handleChange} 
              placeholder="Ej. Juan Pérez"
            />
          </div>
          <div className="form-group">
            <label>Fecha de Nacimiento</label>
            <input 
              type="date" 
              name="birthday" 
              required 
              value={formData.birthday} 
              onChange={handleChange} 
              style={{ padding: '12px', borderRadius: '4px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', width: '100%' }}
            />
          </div>
          <div className="form-group">
            <label>Correo Electrónico</label>
            <input 
              type="email" 
              name="email" 
              required 
              value={formData.email} 
              onChange={handleChange} 
              placeholder="tu@email.com"
            />
          </div>
          <div className="form-group">
            <label>Teléfono (WhatsApp)</label>
            <input 
              type="tel" 
              name="phone" 
              required 
              value={formData.phone} 
              onChange={handleChange} 
              placeholder="+58 412..."
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '10px' }} disabled={loading}>
            {loading ? 'Procesando...' : 'Ir a Pagar por WhatsApp'}
          </button>
        </form>
      </div>
    </div>
  );
}
