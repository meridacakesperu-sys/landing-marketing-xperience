'use client';

import { useState, useEffect } from 'react';

export default function SettingsClient({ initialSettings }) {
  const [settings, setSettings] = useState(initialSettings || {});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  
  // Sales Agents
  const [agents, setAgents] = useState([]);
  const [newAgentName, setNewAgentName] = useState('');
  const [newAgentRef, setNewAgentRef] = useState('');

  useEffect(() => {
    fetch('/api/admin/sales_agents').then(r => r.json()).then(data => {
      if(Array.isArray(data)) setAgents(data);
    });
  }, []);

  const handleAddAgent = async (e) => {
    e.preventDefault();
    if (!newAgentName || !newAgentRef) return;
    const res = await fetch('/api/admin/sales_agents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newAgentName, ref_code: newAgentRef })
    });
    const data = await res.json();
    if (data.success) {
      setAgents([{ id: data.id, name: newAgentName, ref_code: newAgentRef, createdAt: new Date() }, ...agents]);
      setNewAgentName('');
      setNewAgentRef('');
    } else {
      alert(data.error || 'Error al añadir asesor');
    }
  };

  const handleDeleteAgent = async (id) => {
    if (!confirm('¿Seguro que deseas eliminar este asesor? Las ventas anteriores seguirán registradas pero ya no podrá usar el enlace.')) return;
    const res = await fetch(`/api/admin/sales_agents?id=${id}`, { method: 'DELETE' });
    if (res.ok) {
      setAgents(agents.filter(a => a.id !== id));
    }
  };

  const copyLink = (refCode) => {
    const url = `${window.location.origin}/registro?ref=${refCode}`;
    navigator.clipboard.writeText(url);
    alert('Link copiado: ' + url);
  };

  const handleChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    setMessage('');
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      if (res.ok) {
        setMessage('Configuración guardada exitosamente.');
      } else {
        setMessage('Error al guardar la configuración.');
      }
    } catch (err) {
      setMessage('Error de conexión.');
    }
    setLoading(false);
  };

  const sectionStyle = {
    background: '#ffffff',
    padding: '24px',
    borderRadius: '12px',
    border: '1px solid rgba(255,255,255,0.1)',
    marginBottom: '24px'
  };

  const labelStyle = { display: 'block', marginBottom: '8px', color: '#334155', fontSize: '0.9rem' };
  const inputStyle = { width: '100%', padding: '12px', borderRadius: '6px', background: '#f8fafc', border: '1px solid #e2e8f0', color: '#0f172a', fontSize: '1rem' };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ margin: 0, fontSize: '1.8rem' }}>Configuración General</h1>
        <button 
          onClick={handleSave} 
          disabled={loading}
          style={{ 
            background: 'var(--color-accent)', 
            color: '#0f172a', 
            border: 'none', 
            padding: '12px 24px', 
            borderRadius: '6px', 
            fontWeight: 'bold', 
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1
          }}
        >
          {loading ? 'Guardando...' : 'Guardar Cambios'}
        </button>
      </div>

      {message && (
        <div style={{ padding: '12px', background: message.includes('Error') ? '#ef4444' : '#10b981', color: '#0f172a', borderRadius: '6px', marginBottom: '24px' }}>
          {message}
        </div>
      )}

      {/* Etapa Actual */}
      <div style={sectionStyle}>
        <h2 style={{ fontSize: '1.2rem', marginBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>
          Etapa del Evento
        </h2>
        <div style={{ marginBottom: '16px' }}>
          <label style={labelStyle}>Etapa Actual (Determina los precios automáticos de los nuevos registros)</label>
          <select 
            value={settings.current_stage || 'Pre-venta'} 
            onChange={(e) => handleChange('current_stage', e.target.value)}
            style={inputStyle}
          >
            <option value="Pre-venta">Pre-venta</option>
            <option value="Etapa 1">Etapa 1</option>
            <option value="Etapa 2">Etapa 2</option>
          </select>
        </div>
      </div>

      {/* Precios */}
      <div style={sectionStyle}>
        <h2 style={{ fontSize: '1.2rem', marginBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>
          Precios de Entradas ($)
        </h2>
        
        <h3 style={{ fontSize: '1rem', color: '#64748b', margin: '16px 0 8px' }}>Pre-venta</h3>
        <div style={{ display: 'flex', gap: '20px', marginBottom: '16px' }}>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>General</label>
            <input type="number" value={settings.price_general_preventa || ''} onChange={e => handleChange('price_general_preventa', e.target.value)} style={inputStyle} />
          </div>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>VIP</label>
            <input type="number" value={settings.price_vip_preventa || ''} onChange={e => handleChange('price_vip_preventa', e.target.value)} style={inputStyle} />
          </div>
        </div>

        <h3 style={{ fontSize: '1rem', color: '#64748b', margin: '16px 0 8px' }}>Etapa 1</h3>
        <div style={{ display: 'flex', gap: '20px', marginBottom: '16px' }}>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>General</label>
            <input type="number" value={settings.price_general_etapa1 || ''} onChange={e => handleChange('price_general_etapa1', e.target.value)} style={inputStyle} />
          </div>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>VIP</label>
            <input type="number" value={settings.price_vip_etapa1 || ''} onChange={e => handleChange('price_vip_etapa1', e.target.value)} style={inputStyle} />
          </div>
        </div>

        <h3 style={{ fontSize: '1rem', color: '#64748b', margin: '16px 0 8px' }}>Etapa 2</h3>
        <div style={{ display: 'flex', gap: '20px' }}>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>General</label>
            <input type="number" value={settings.price_general_etapa2 || ''} onChange={e => handleChange('price_general_etapa2', e.target.value)} style={inputStyle} />
          </div>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>VIP</label>
            <input type="number" value={settings.price_vip_etapa2 || ''} onChange={e => handleChange('price_vip_etapa2', e.target.value)} style={inputStyle} />
          </div>
        </div>
      </div>

      {/* Equipo de Ventas */}
      <div style={sectionStyle}>
        <h2 style={{ fontSize: '1.2rem', marginBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>
          Equipo de Ventas (Afiliados / Asesores)
        </h2>
        <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '16px' }}>Crea asesores para generar links únicos. Cuando un cliente se registre usando su link, la venta se le asignará automáticamente.</p>
        
        <form onSubmit={handleAddAgent} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <div style={{ flex: 2 }}>
            <input placeholder="Nombre del asesor" value={newAgentName} onChange={e => setNewAgentName(e.target.value)} style={inputStyle} required />
          </div>
          <div style={{ flex: 1 }}>
            <input placeholder="Código link (ej: juan123)" value={newAgentRef} onChange={e => setNewAgentRef(e.target.value)} style={inputStyle} required />
          </div>
          <button type="submit" style={{ background: 'var(--color-accent)', color: '#0f172a', border: 'none', padding: '0 20px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>Añadir</button>
        </form>

        <div>
          {agents.length === 0 && <div style={{ color: '#64748b', fontSize: '0.9rem' }}>No hay asesores registrados.</div>}
          {agents.map(a => (
            <div key={a.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', marginBottom: '8px' }}>
              <div>
                <div style={{ fontWeight: 'bold', color: '#0f172a' }}>{a.name}</div>
                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Código: <span style={{ color: 'var(--color-accent)', fontWeight: 'bold' }}>{a.ref_code}</span></div>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="button" onClick={() => copyLink(a.ref_code)} style={{ background: '#334155', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}>Copiar Link</button>
                <button type="button" onClick={() => handleDeleteAgent(a.id)} style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}>Eliminar</button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
