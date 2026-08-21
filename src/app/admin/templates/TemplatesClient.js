'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';

export default function TemplatesClient({ initialTemplates }) {
  const [templates, setTemplates] = useState(initialTemplates);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddTemplate = async (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) {
      toast.error('El título y el contenido son obligatorios');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/admin/templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTitle, content: newContent })
      });

      if (res.ok) {
        const data = await res.json();
        const newTemplate = {
          id: data.id,
          title: newTitle,
          content: newContent,
          createdAt: new Date().toISOString()
        };
        setTemplates([newTemplate, ...templates]);
        setNewTitle('');
        setNewContent('');
        setShowAddForm(false);
        toast.success('Plantilla guardada exitosamente');
      } else {
        toast.error('Error al guardar la plantilla');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error de red al guardar');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Seguro que deseas eliminar esta plantilla?')) return;

    try {
      const res = await fetch(`/api/admin/templates?id=${id}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        setTemplates(templates.filter(t => t.id !== id));
        toast.success('Plantilla eliminada');
      } else {
        toast.error('Error al eliminar');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error al eliminar');
    }
  };

  const handleCopy = (content) => {
    navigator.clipboard.writeText(content).then(() => {
      toast.success('Texto copiado al portapapeles');
    }).catch(err => {
      console.error('Failed to copy', err);
      toast.error('Error al copiar el texto');
    });
  };

  return (
    <div style={{ color: '#fff' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Respuestas Rápidas / Plantillas</h2>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          style={{
            padding: '10px 20px',
            background: showAddForm ? '#dc3545' : '#00b0ff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          {showAddForm ? 'Cancelar' : '+ Nueva Plantilla'}
        </button>
      </div>

      {showAddForm && (
        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '10px', marginBottom: '20px' }}>
          <form onSubmit={handleAddTemplate}>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>Título (ej: Confirmación de pago)</label>
              <input 
                type="text" 
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #444', background: '#222', color: '#fff' }}
                placeholder="Identificador de la plantilla"
              />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>Contenido / Mensaje</label>
              <textarea 
                value={newContent}
                onChange={e => setNewContent(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #444', background: '#222', color: '#fff', minHeight: '120px' }}
                placeholder="Escribe aquí el texto que se copiará..."
              />
            </div>
            <button 
              type="submit" 
              disabled={isSubmitting}
              style={{
                padding: '10px 20px',
                background: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                fontWeight: 'bold'
              }}
            >
              {isSubmitting ? 'Guardando...' : 'Guardar Plantilla'}
            </button>
          </form>
        </div>
      )}

      {templates.length === 0 ? (
        <p style={{ color: '#ccc' }}>No tienes plantillas guardadas aún. Crea tu primera respuesta rápida.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {templates.map(template => (
            <div key={template.id} style={{ background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '10px', display: 'flex', flexDirection: 'column' }}>
              <h3 style={{ marginTop: '0', color: '#00b0ff', fontSize: '1.2rem', marginBottom: '10px' }}>{template.title}</h3>
              <div style={{ 
                background: '#111', 
                padding: '15px', 
                borderRadius: '5px', 
                whiteSpace: 'pre-wrap', 
                fontSize: '0.9rem', 
                flexGrow: 1, 
                marginBottom: '15px',
                borderLeft: '3px solid #00b0ff'
              }}>
                {template.content}
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button 
                  onClick={() => handleCopy(template.content)}
                  style={{
                    flex: 1,
                    padding: '10px',
                    background: '#00b0ff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}
                >
                  📋 Copiar
                </button>
                <button 
                  onClick={() => handleDelete(template.id)}
                  style={{
                    padding: '10px 15px',
                    background: 'transparent',
                    color: '#dc3545',
                    border: '1px solid #dc3545',
                    borderRadius: '5px',
                    cursor: 'pointer'
                  }}
                  title="Eliminar"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
