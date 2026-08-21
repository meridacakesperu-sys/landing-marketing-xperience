'use client';

import { useState } from 'react';

const CATEGORIES = [
  'Mensajes principales',
  'Tipo de publico',
  'Recordatorios',
  'Pagos',
  'Objeciones'
];

export default function TemplatesClient({ initialTemplates }) {
  const [templates, setTemplates] = useState(initialTemplates);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState(CATEGORIES[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddTemplate = async (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) {
      alert('El título y el contenido son obligatorios');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/admin/templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTitle, content: newContent, category: newCategory })
      });

      if (res.ok) {
        const data = await res.json();
        const newTemplate = {
          id: data.id,
          title: newTitle,
          content: newContent,
          category: newCategory,
          createdAt: new Date().toISOString()
        };
        setTemplates([newTemplate, ...templates]);
        setNewTitle('');
        setNewContent('');
        setNewCategory(CATEGORIES[0]);
        setShowAddForm(false);
        alert('Plantilla guardada exitosamente');
      } else {
        alert('Error al guardar la plantilla');
      }
    } catch (error) {
      console.error(error);
      alert('Error de red al guardar');
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
        alert('Plantilla eliminada');
      } else {
        alert('Error al eliminar');
      }
    } catch (error) {
      console.error(error);
      alert('Error al eliminar');
    }
  };

  const handleCopy = (content) => {
    navigator.clipboard.writeText(content).then(() => {
      alert('Texto copiado al portapapeles');
    }).catch(err => {
      console.error('Failed to copy', err);
      alert('Error al copiar el texto');
    });
  };

  // Agrupar plantillas por categoría
  const groupedTemplates = CATEGORIES.reduce((acc, cat) => {
    acc[cat] = templates.filter(t => t.category === cat);
    return acc;
  }, {});

  return (
    <div style={{ color: '#0f172a', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ margin: 0 }}>Respuestas Rápidas / Plantillas</h2>
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
        <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '10px', marginBottom: '30px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
          <form onSubmit={handleAddTemplate}>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Categoría</label>
              <select 
                value={newCategory}
                onChange={e => setNewCategory(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #cbd5e1', background: '#fff', color: '#0f172a' }}
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Título (ej: Confirmación de pago)</label>
              <input 
                type="text" 
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #cbd5e1', background: '#fff', color: '#0f172a' }}
                placeholder="Identificador de la plantilla"
              />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Contenido / Mensaje</label>
              <textarea 
                value={newContent}
                onChange={e => setNewContent(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #cbd5e1', background: '#fff', color: '#0f172a', minHeight: '120px' }}
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
        <p style={{ color: '#64748b' }}>No tienes plantillas guardadas aún. Crea tu primera respuesta rápida.</p>
      ) : (
        <div>
          {CATEGORIES.map(category => (
            groupedTemplates[category].length > 0 && (
              <div key={category} style={{ marginBottom: '40px' }}>
                <h3 style={{ borderBottom: '2px solid #e2e8f0', paddingBottom: '10px', color: '#334155', marginBottom: '20px' }}>
                  {category}
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                  {groupedTemplates[category].map(template => (
                    <div key={template.id} style={{ 
                      background: '#fef3c7', // Cream note color
                      padding: '20px', 
                      borderRadius: '8px', 
                      display: 'flex', 
                      flexDirection: 'column',
                      boxShadow: '2px 4px 10px rgba(0,0,0,0.05)',
                      borderLeft: '4px solid #f59e0b'
                    }}>
                      <h4 style={{ margin: '0 0 10px 0', color: '#b45309', fontSize: '1.1rem' }}>{template.title}</h4>
                      <div style={{ 
                        background: '#fffbeb', 
                        padding: '15px', 
                        borderRadius: '5px', 
                        whiteSpace: 'pre-wrap', 
                        fontSize: '0.95rem', 
                        flexGrow: 1, 
                        marginBottom: '15px',
                        color: '#334155',
                        border: '1px solid #fde68a'
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
                            cursor: 'pointer',
                            fontWeight: 'bold'
                          }}
                          title="Eliminar"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          ))}
        </div>
      )}
    </div>
  );
}
