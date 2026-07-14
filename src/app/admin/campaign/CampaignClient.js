"use client";

import { useState } from 'react';

export default function CampaignClient({ initialObjectives }) {
  const [objectives, setObjectives] = useState(initialObjectives);
  const [showModal, setShowModal] = useState(false);
  const [editingObj, setEditingObj] = useState(null);
  const [formData, setFormData] = useState({ title: '', start_date: '', end_date: '', notes: '', status: 'Pendiente' });

  const STAGES = [
    { name: 'Pre-venta', start: '2026-07-01', end: '2026-08-10', color: '#ccecf6' },
    { name: 'Etapa 1', start: '2026-08-11', end: '2026-09-05', color: '#4a89a7' },
    { name: 'Última Etapa', start: '2026-09-06', end: '2026-09-19', color: 'var(--color-accent)' }
  ];

  const openNew = () => {
    setEditingObj(null);
    setFormData({ title: '', start_date: '', end_date: '', notes: '', status: 'Pendiente' });
    setShowModal(true);
  };

  const openEdit = (obj) => {
    setEditingObj(obj);
    setFormData({ title: obj.title, start_date: obj.start_date, end_date: obj.end_date, notes: obj.notes || '', status: obj.status || 'Pendiente' });
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const isEdit = !!editingObj;
      const url = '/api/admin/campaigns';
      const method = isEdit ? 'PUT' : 'POST';
      const payload = isEdit ? { ...formData, id: editingObj.id } : formData;

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (res.ok) {
        if (isEdit) {
          setObjectives(prev => prev.map(o => o.id === editingObj.id ? { ...o, ...formData } : o));
        } else {
          // fetch to get the real ID, but for simplicity we can just refresh or append with a temp id
          const refreshRes = await fetch('/api/admin/campaigns');
          const data = await refreshRes.json();
          setObjectives(data);
        }
        setShowModal(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Seguro que deseas eliminar este objetivo?')) return;
    try {
      const res = await fetch(`/api/admin/campaigns?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setObjectives(prev => prev.filter(o => o.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const toggleStatus = async (obj) => {
    const newStatus = obj.status === 'Completado' ? 'Pendiente' : 'Completado';
    try {
      const res = await fetch('/api/admin/campaigns', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...obj, status: newStatus })
      });
      if (res.ok) {
        setObjectives(prev => prev.map(o => o.id === obj.id ? { ...o, status: newStatus } : o));
      } else {
        const err = await res.text();
        alert('Error: ' + err);
      }
    } catch (err) {
      console.error(err);
      alert('Network error: ' + err.message);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', height: '100%', overflowY: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', color: '#0f172a', margin: 0 }}>Gestión de Campaña</h2>
          <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>Control de etapas y objetivos del lanzamiento</p>
        </div>
        <button onClick={openNew} style={{ background: 'var(--color-accent)', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
          + Añadir Objetivo
        </button>
      </div>

      {/* Static Stages Timeline */}
      <div style={{ background: '#ffffff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
        <h3 style={{ color: '#0f172a', marginBottom: '20px' }}>Fases Oficiales</h3>
        <div style={{ display: 'flex', gap: '10px', width: '100%' }}>
          {STAGES.map((stage, idx) => (
            <div key={idx} style={{ flex: 1, background: stage.color, padding: '16px', borderRadius: '8px', color: '#0f172a', position: 'relative' }}>
              <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{stage.name}</div>
              <div style={{ fontSize: '0.8rem', opacity: 0.8, marginTop: '8px' }}>
                {stage.start.split('-').reverse().join('/')} - {stage.end.split('-').reverse().join('/')}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Objectives List */}
      <div style={{ background: '#ffffff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0', flex: 1 }}>
        <h3 style={{ color: '#0f172a', marginBottom: '20px' }}>Tus Objetivos</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {objectives.length === 0 ? (
            <div style={{ color: '#64748b' }}>No hay objetivos registrados.</div>
          ) : (
            objectives.map(obj => (
              <div key={obj.id} style={{ background: '#f8fafc', borderLeft: `4px solid ${obj.status === 'Completado' ? '#10b981' : 'var(--color-accent)'}`, padding: '16px', borderRadius: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', opacity: obj.status === 'Completado' ? 0.7 : 1 }}>
                <div style={{ flex: 1, paddingRight: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <input 
                      type="checkbox" 
                      checked={obj.status === 'Completado'} 
                      onChange={() => toggleStatus(obj)} 
                      style={{ transform: 'scale(1.5)', cursor: 'pointer', accentColor: 'var(--color-accent)' }} 
                      title="Marcar como completado"
                    />
                    <div style={{ color: '#0f172a', fontWeight: 'bold', fontSize: '1.1rem', textDecoration: obj.status === 'Completado' ? 'line-through' : 'none' }}>{obj.title}</div>
                    <div style={{ background: obj.status === 'Completado' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(193, 152, 69, 0.2)', color: obj.status === 'Completado' ? '#10b981' : 'var(--color-accent)', padding: '2px 8px', borderRadius: '12px', fontSize: '0.7rem', fontWeight: 'bold' }}>
                      {obj.status || 'Pendiente'}
                    </div>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '8px', marginLeft: '32px' }}>
                    🗓️ Del {obj.start_date.split('-').reverse().join('/')} al {obj.end_date.split('-').reverse().join('/')}
                  </div>
                  {obj.notes && (
                    <div style={{ marginTop: '10px', marginLeft: '32px', background: '#ffffff', padding: '10px', borderRadius: '6px', color: '#334155', fontSize: '0.9rem', fontStyle: 'italic', borderLeft: '2px solid #334155', whiteSpace: 'pre-wrap' }}>
                      {obj.notes}
                    </div>
                  )}
                </div>
                
                {/* Actions */}
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => openEdit(obj)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }} title="Editar">✏️</button>
                  <button onClick={() => handleDelete(obj.id)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }} title="Eliminar">🗑️</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal for Objectives */}
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ background: '#ffffff', padding: '30px', borderRadius: '12px', width: '95%', maxWidth: '500px', border: '1px solid #e2e8f0', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ color: '#0f172a', margin: 0 }}>{editingObj ? 'Editar Objetivo' : 'Añadir Objetivo'}</h3>
              <button onClick={() => setShowModal(false)} style={{ background: 'transparent', border: 'none', color: '#64748b', fontSize: '1.2rem', cursor: 'pointer' }}>✖</button>
            </div>
            
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div>
                <label style={{ color: '#64748b', fontSize: '0.8rem', display: 'block', marginBottom: '4px' }}>Título del Objetivo *</label>
                <input required placeholder="Ej. Vender 10 entradas VIP" value={formData.title} onChange={e=>setFormData({...formData, title: e.target.value})} style={{ width: '100%', padding: '10px', background: '#f8fafc', border: '1px solid #e2e8f0', color: '#0f172a', borderRadius: '6px' }} />
              </div>
              
              <div style={{ display: 'flex', gap: '15px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ color: '#64748b', fontSize: '0.8rem', display: 'block', marginBottom: '4px' }}>Fecha de Inicio *</label>
                  <input type="date" required value={formData.start_date} onChange={e=>setFormData({...formData, start_date: e.target.value})} style={{ width: '100%', padding: '10px', background: '#f8fafc', border: '1px solid #e2e8f0', color: '#0f172a', borderRadius: '6px' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ color: '#64748b', fontSize: '0.8rem', display: 'block', marginBottom: '4px' }}>Fecha de Fin *</label>
                  <input type="date" required value={formData.end_date} onChange={e=>setFormData({...formData, end_date: e.target.value})} style={{ width: '100%', padding: '10px', background: '#f8fafc', border: '1px solid #e2e8f0', color: '#0f172a', borderRadius: '6px' }} />
                </div>
              </div>

              <div>
                <label style={{ color: '#64748b', fontSize: '0.8rem', display: 'block', marginBottom: '4px' }}>Notas adicionales (Bloc de notas)</label>
                <textarea 
                  placeholder="Detalles, estrategias, o cualquier anotación sobre este objetivo..." 
                  value={formData.notes} 
                  onChange={e=>setFormData({...formData, notes: e.target.value})} 
                  style={{ width: '100%', padding: '12px', background: '#fdfbf7', border: '1px solid #e2e8f0', color: '#334155', borderRadius: '6px', minHeight: '120px', resize: 'vertical', fontFamily: 'monospace', fontSize: '0.9rem', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)' }} 
                />
              </div>

              {editingObj && (
                <div>
                  <label style={{ color: '#64748b', fontSize: '0.8rem', display: 'block', marginBottom: '4px' }}>Estado</label>
                  <select value={formData.status} onChange={e=>setFormData({...formData, status: e.target.value})} style={{ width: '100%', padding: '10px', background: '#f8fafc', border: '1px solid #e2e8f0', color: '#0f172a', borderRadius: '6px' }}>
                    <option value="Pendiente">Pendiente</option>
                    <option value="Completado">Completado</option>
                  </select>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button type="button" onClick={() => setShowModal(false)} style={{ padding: '10px 20px', background: 'transparent', color: '#64748b', border: '1px solid #e2e8f0', borderRadius: '6px', cursor: 'pointer' }}>Cancelar</button>
                <button type="submit" style={{ padding: '10px 20px', background: 'var(--color-bg)', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>{editingObj ? 'Guardar Cambios' : 'Crear Objetivo'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
