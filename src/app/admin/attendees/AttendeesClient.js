"use client";

import { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { ClientDetailModal, getZodiacInfo, COLUMNS } from '../contacts/ContactsClient';

export default function AttendeesClient({ initialRegistrations, initialTables, initialLeaders, initialTimeline, initialMaterials }) {
  const [activeTab, setActiveTab] = useState('mesas'); // 'mesas' | 'cronograma' | 'materiales'

  // --- MESAS STATE ---
  const [registrations, setRegistrations] = useState(initialRegistrations);
  const [tables, setTables] = useState(initialTables);
  const [leaders, setLeaders] = useState(initialLeaders || []);
  const [editingTable, setEditingTable] = useState(null);
  const [editTableName, setEditTableName] = useState('');
  const [editTableLeaderId, setEditTableLeaderId] = useState('');
  const [showLeadersModal, setShowLeadersModal] = useState(false);
  const [newLeader, setNewLeader] = useState({ name: '', email: '', phone: '', business: '', birthday: '', notes: '' });
  const [selectedClient, setSelectedClient] = useState(null);

  // --- TIMELINE STATE ---
  const [timelineEvents, setTimelineEvents] = useState(initialTimeline || []);
  const [timelineDay, setTimelineDay] = useState(1);
  const [editingEvent, setEditingEvent] = useState(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [editEventForm, setEditEventForm] = useState({ day: 1, time: '', title: '', duration: '', description: '', order_index: 0 });

  // --- MATERIALS STATE ---
  const [materials, setMaterials] = useState(initialMaterials || []);
  const [uploading, setUploading] = useState(false);

  // --- MESAS LOGIC ---
  const handleDragEnd = async (result) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    const regId = parseInt(draggableId.replace('reg-', ''), 10);
    const destTableId = destination.droppableId === 'unassigned' ? null : parseInt(destination.droppableId.replace('table-', ''), 10);

    setRegistrations(prev => prev.map(r => r.id === regId ? { ...r, table_id: destTableId } : r));

    try {
      await fetch('/api/admin/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: regId, table_id: destTableId })
      });
    } catch (err) {
      console.error("Error updating table assignment", err);
      window.location.reload();
    }
  };

  const openEditTable = (table) => {
    setEditingTable(table.id);
    setEditTableName(table.name);
    setEditTableLeaderId(table.leader_id || '');
  };

  const handleSaveTable = async (e) => {
    e.preventDefault();
    try {
      await fetch('/api/admin/tables', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editingTable, name: editTableName, leader_id: editTableLeaderId || null })
      });
      setTables(prev => prev.map(t => t.id === editingTable ? { ...t, name: editTableName, leader_id: editTableLeaderId || null } : t));
      setEditingTable(null);
    } catch (err) {
      console.error("Error saving table", err);
    }
  };

  const handleCreateLeader = async (e) => {
    e.preventDefault();
    if (!newLeader.name) return;
    try {
      const res = await fetch('/api/admin/leaders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newLeader)
      });
      const data = await res.json();
      if (data.success) {
        setLeaders([{ ...newLeader, id: data.id, createdAt: new Date().toISOString() }, ...leaders]);
        setNewLeader({ name: '', email: '', phone: '', business: '', birthday: '', notes: '' });
      }
    } catch (err) {
      console.error("Error creating leader", err);
    }
  };

  const unassigned = registrations.filter(r => !r.table_id);
  const getTableRegistrations = (tableId) => registrations.filter(r => r.table_id === tableId);


  // --- TIMELINE LOGIC ---
  const openEditEvent = (ev) => {
    setEditingEvent(ev.id);
    setEditEventForm(ev);
    setShowEventModal(true);
  };

  const openNewEvent = () => {
    setEditingEvent(null);
    setEditEventForm({ day: timelineDay, time: '', title: '', duration: '', description: '', order_index: 0 });
    setShowEventModal(true);
  };

  const handleSaveEvent = async (e) => {
    e.preventDefault();
    const isNew = !editingEvent;
    try {
      const res = await fetch('/api/admin/timeline', {
        method: isNew ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editEventForm)
      });
      const data = await res.json();
      if (data.success) {
        if (isNew) {
          setTimelineEvents([...timelineEvents, { ...editEventForm, id: data.id }]);
        } else {
          setTimelineEvents(prev => prev.map(ev => ev.id === editingEvent ? editEventForm : ev));
        }
        setShowEventModal(false);
      }
    } catch (err) {
      console.error("Error saving event", err);
    }
  };

  const handleDeleteEvent = async (id) => {
    if (!confirm('¿Seguro que deseas eliminar este evento del cronograma?')) return;
    try {
      await fetch(`/api/admin/timeline?id=${id}`, { method: 'DELETE' });
      setTimelineEvents(prev => prev.filter(ev => ev.id !== id));
    } catch (err) {
      console.error("Error deleting event", err);
    }
  };

  const currentTimeline = timelineEvents.filter(ev => ev.day === timelineDay).sort((a, b) => a.order_index - b.order_index || a.id - b.id);

  // --- MATERIALS LOGIC ---
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setUploading(true);
    try {
      const res = await fetch('/api/admin/materials', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setMaterials([{ id: data.id, name: data.original_name, original_name: data.original_name, path: data.path, createdAt: data.createdAt }, ...materials]);
      }
    } catch (err) {
      console.error("Error uploading file", err);
    } finally {
      setUploading(false);
      e.target.value = null; // reset input
    }
  };

  const handleDeleteMaterial = async (id) => {
    if (!confirm('¿Seguro que deseas eliminar este material?')) return;
    try {
      const res = await fetch(`/api/admin/materials?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setMaterials(prev => prev.filter(m => m.id !== id));
      }
    } catch (err) {
      console.error("Error deleting material", err);
    }
  };

  const renderAttendeeCard = (reg, provided, snapshot) => {
    const currentStatusObj = COLUMNS?.find(c => c.id === (reg.status || 'Nuevo')) || { title: reg.status, color: '#64748b' };
    
    return (
      <div
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        onClick={() => setSelectedClient(reg)}
        style={{
          userSelect: 'none',
          padding: '16px',
          margin: '0 0 12px 0',
          backgroundColor: snapshot.isDragging ? '#f1f5f9' : '#ffffff',
          color: '#0f172a',
          borderRadius: '6px',
          borderLeft: `4px solid ${reg.plan?.includes('VIP') ? 'var(--color-accent)' : 'var(--color-bg)'}`,
          border: '1px solid #e2e8f0',
          boxShadow: snapshot.isDragging ? '0 5px 10px rgba(0,0,0,0.1)' : '0 1px 2px rgba(0,0,0,0.05)',
          cursor: 'pointer',
          position: 'relative',
          ...provided.draggableProps.style,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
          <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>{reg.name}</div>
          <div style={{ fontSize: '0.65rem', padding: '2px 6px', borderRadius: '4px', background: currentStatusObj.color + '33', color: currentStatusObj.color, border: `1px solid ${currentStatusObj.color}66` }}>
            {currentStatusObj.title}
          </div>
          <div style={{ width: '100%', fontSize: '0.75rem', color: '#64748b' }}>
            {reg.purchase_stage || 'Pre-venta'} | ${reg.ticket_price || 0}
          </div>
        </div>

        <div style={{ fontSize: '0.75rem', color: '#64748b', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ background: reg.plan?.includes('VIP') ? 'rgba(193,152,69,0.2)' : 'rgba(74,137,167,0.2)', color: reg.plan?.includes('VIP') ? 'var(--color-accent)' : 'var(--color-bg)', padding: '2px 6px', borderRadius: '4px' }}>
            {reg.plan || 'General'}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* HEADER & TABS */}
      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', color: '#0f172a', margin: 0 }}>Organización del Evento</h2>
          <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '4px 0 16px 0' }}>Gestiona las mesas, líderes y el cronograma del evento.</p>
          
          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              onClick={() => setActiveTab('mesas')} 
              style={{ padding: '8px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: 'bold', background: activeTab === 'mesas' ? 'var(--color-accent)' : '#1e293b', color: activeTab === 'mesas' ? '#fff' : '#94a3b8' }}
            >
              Distribución de Mesas
            </button>
            <button 
              onClick={() => setActiveTab('cronograma')} 
              style={{ padding: '8px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: 'bold', background: activeTab === 'cronograma' ? 'var(--color-accent)' : '#1e293b', color: activeTab === 'cronograma' ? '#fff' : '#94a3b8' }}
            >
              Cronograma
            </button>
            <button 
              onClick={() => setActiveTab('materiales')} 
              style={{ padding: '8px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: 'bold', background: activeTab === 'materiales' ? 'var(--color-accent)' : '#1e293b', color: activeTab === 'materiales' ? '#fff' : '#94a3b8' }}
            >
              Material para líderes
            </button>
          </div>
        </div>

        {activeTab === 'mesas' && (
          <button onClick={() => setShowLeadersModal(true)} style={{ background: '#334155', color: '#fff', border: '1px solid #475569', padding: '10px 20px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
            Gestión de Líderes
          </button>
        )}
      </div>

      {activeTab === 'mesas' && (
        <DragDropContext onDragEnd={handleDragEnd}>
          <div style={{ display: 'flex', gap: '20px', overflowX: 'auto', paddingBottom: '20px', flex: 1, alignItems: 'flex-start' }}>
            
            <div style={{ minWidth: '300px', background: '#ffffff', borderRadius: '8px', padding: '16px', display: 'flex', flexDirection: 'column', maxHeight: '100%', border: '1px solid #e2e8f0' }}>
              <h3 style={{ fontSize: '1.1rem', color: '#0f172a', marginBottom: '16px', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px' }}>
                Sin Mesa ({unassigned.length})
              </h3>
              <Droppable droppableId="unassigned">
                {(provided, snapshot) => (
                  <div 
                    ref={provided.innerRef} 
                    {...provided.droppableProps}
                    style={{ flex: 1, overflowY: 'auto', padding: '4px', minHeight: '150px', background: snapshot.isDraggingOver ? 'rgba(255,255,255,0.05)' : 'transparent', borderRadius: '4px' }}
                  >
                    {unassigned.map((reg, index) => (
                      <Draggable key={`reg-${reg.id}`} draggableId={`reg-${reg.id}`} index={index}>
                        {(provided, snapshot) => renderAttendeeCard(reg, provided, snapshot)}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>

            {tables.map(table => {
              const tableRegs = getTableRegistrations(table.id);
              const tableLeader = leaders.find(l => l.id == table.leader_id);
              return (
                <div key={table.id} style={{ minWidth: '300px', background: '#ffffff', borderRadius: '8px', padding: '16px', display: 'flex', flexDirection: 'column', maxHeight: '100%', border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px', marginBottom: '16px' }}>
                    <div>
                      <h3 style={{ fontSize: '1.1rem', color: '#0f172a', margin: 0 }}>
                        {table.name} ({tableRegs.length})
                      </h3>
                      <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '4px' }}>
                        Líder: <strong style={{ color: 'var(--color-bg)' }}>{tableLeader ? tableLeader.name : 'Sin asignar'}</strong>
                      </div>
                    </div>
                    <button 
                      onClick={() => openEditTable(table)}
                      style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '1.2rem' }}
                      title="Editar mesa"
                    >
                      ✏️
                    </button>
                  </div>

                  <Droppable droppableId={`table-${table.id}`}>
                    {(provided, snapshot) => (
                      <div 
                        ref={provided.innerRef} 
                        {...provided.droppableProps}
                        style={{ flex: 1, overflowY: 'auto', padding: '4px', minHeight: '150px', background: snapshot.isDraggingOver ? 'rgba(255,255,255,0.05)' : 'transparent', borderRadius: '4px' }}
                      >
                        {tableRegs.map((reg, index) => (
                          <Draggable key={`reg-${reg.id}`} draggableId={`reg-${reg.id}`} index={index}>
                            {(provided, snapshot) => renderAttendeeCard(reg, provided, snapshot)}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              );
            })}
          </div>
        </DragDropContext>
      )}
      
      {activeTab === 'cronograma' && (
        <div style={{ flex: 1, overflowY: 'auto', paddingRight: '10px' }}>
          {/* TIMELINE UI */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '30px', gap: '20px' }}>
            <button 
              onClick={() => setTimelineDay(1)}
              style={{ padding: '10px 30px', borderRadius: '30px', border: 'none', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', background: timelineDay === 1 ? 'var(--color-accent)' : '#1e293b', color: timelineDay === 1 ? '#fff' : '#94a3b8' }}
            >
              DÍA 1
            </button>
            <button 
              onClick={() => setTimelineDay(2)}
              style={{ padding: '10px 30px', borderRadius: '30px', border: 'none', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', background: timelineDay === 2 ? 'var(--color-accent)' : '#1e293b', color: timelineDay === 2 ? '#fff' : '#94a3b8' }}
            >
              DÍA 2
            </button>
          </div>

          <div style={{ position: 'relative', maxWidth: '800px', margin: '0 auto', padding: '20px 0' }}>
            {/* The vertical line */}
            <div style={{ position: 'absolute', top: 0, bottom: 0, left: '50%', width: '4px', background: '#334155', transform: 'translateX(-50%)', borderRadius: '2px' }}></div>
            
            {currentTimeline.map((ev, index) => {
              const isLeft = index % 2 === 0;
              return (
                <div key={ev.id} style={{ display: 'flex', justifyContent: isLeft ? 'flex-start' : 'flex-end', alignItems: 'center', width: '100%', marginBottom: '40px', position: 'relative' }}>
                  
                  {/* Central Dot */}
                  <div style={{ position: 'absolute', left: '50%', width: '20px', height: '20px', background: 'var(--color-accent)', borderRadius: '50%', transform: 'translateX(-50%)', border: '4px solid #0f172a', zIndex: 2 }}></div>
                  
                  {/* Content Box */}
                  <div style={{ width: '45%', position: 'relative' }}>
                    <div style={{ 
                      background: '#ffffff', 
                      padding: '20px', 
                      borderRadius: '12px', 
                      border: '1px solid #e2e8f0',
                      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)',
                      textAlign: isLeft ? 'right' : 'left',
                      position: 'relative'
                    }}>
                      
                      {/* Connection Line (Arrow) */}
                      <div style={{
                        position: 'absolute',
                        top: '20px',
                        [isLeft ? 'right' : 'left']: '-10px',
                        width: '0',
                        height: '0',
                        borderTop: '10px solid transparent',
                        borderBottom: '10px solid transparent',
                        [isLeft ? 'borderLeft' : 'borderRight']: '10px solid #1e293b',
                      }}></div>

                      {/* Editing Actions */}
                      <div style={{ position: 'absolute', top: '10px', [isLeft ? 'left' : 'right']: '10px', display: 'flex', gap: '5px' }}>
                        <button onClick={() => openEditEvent(ev)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1rem', opacity: 0.7 }} title="Editar">✏️</button>
                        <button onClick={() => handleDeleteEvent(ev.id)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1rem', opacity: 0.7 }} title="Eliminar">🗑️</button>
                      </div>

                      <div style={{ color: 'var(--color-bg)', fontWeight: 'bold', fontSize: '1.2rem', marginBottom: '8px' }}>
                        {ev.time}
                      </div>
                      <h4 style={{ color: '#0f172a', fontSize: '1.1rem', margin: '0 0 8px 0' }}>{ev.title}</h4>
                      {ev.description && (
                        <p style={{ color: '#334155', fontSize: '0.9rem', margin: '0 0 10px 0', lineHeight: 1.5 }}>
                          {ev.description}
                        </p>
                      )}
                      {ev.duration && (
                        <div style={{ display: 'inline-block', background: 'rgba(74, 137, 167, 0.2)', color: 'var(--color-bg)', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                          ⏱ {ev.duration}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '40px', position: 'relative', zIndex: 3 }}>
              <button onClick={openNewEvent} style={{ background: 'var(--color-accent)', color: '#fff', border: 'none', borderRadius: '30px', padding: '12px 24px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 15px rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.2rem' }}>+</span> Añadir Evento
              </button>
            </div>

          </div>
        </div>
      )}

      {activeTab === 'materiales' && (
        <div style={{ flex: 1, overflowY: 'auto', paddingRight: '10px' }}>
          <div style={{ background: '#ffffff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '20px' }}>
            <h3 style={{ color: '#0f172a', margin: '0 0 10px 0' }}>Subir Material</h3>
            <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '15px' }}>Sube guías, PDFs o imágenes para los líderes. Estos archivos se guardarán directamente en la plataforma.</p>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <input 
                type="file" 
                onChange={handleFileUpload} 
                disabled={uploading}
                style={{ color: '#0f172a', background: '#f8fafc', padding: '10px', borderRadius: '6px', border: '1px dashed #4a89a7', flex: 1 }} 
              />
              {uploading && <div style={{ color: 'var(--color-accent)', fontWeight: 'bold' }}>Subiendo... ⏳</div>}
            </div>
          </div>

          <h3 style={{ color: '#0f172a', marginBottom: '15px' }}>Materiales Disponibles ({materials.length})</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {materials.length === 0 && <div style={{ color: '#64748b', fontStyle: 'italic' }}>No hay materiales subidos aún.</div>}
            
            {materials.map(m => (
              <div key={m.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <div style={{ fontSize: '2rem' }}>📄</div>
                  <div>
                    <div style={{ color: '#0f172a', fontWeight: 'bold', fontSize: '1.1rem' }}>{m.original_name}</div>
                    <div style={{ color: '#64748b', fontSize: '0.8rem' }}>Subido el {new Date(m.createdAt).toLocaleDateString()}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <a href={m.path} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', background: 'var(--color-accent)', color: '#fff', padding: '8px 16px', borderRadius: '6px', fontWeight: 'bold' }}>⬇️ Descargar</a>
                  <button onClick={() => handleDeleteMaterial(m.id)} style={{ background: '#334155', border: 'none', color: '#fff', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>🗑️ Eliminar</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Edit Table Modal */}
      {editingTable && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ background: '#ffffff', padding: '30px', borderRadius: '12px', width: '95%', maxWidth: '400px' }}>
            <h3 style={{ color: '#0f172a', marginBottom: '20px' }}>Editar Mesa</h3>
            <form onSubmit={handleSaveTable} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: '#64748b', display: 'block', marginBottom: '8px' }}>Nombre de la mesa</label>
                <input required type="text" value={editTableName} onChange={e => setEditTableName(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '4px', background: '#f8fafc', border: '1px solid #e2e8f0', color: '#0f172a' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', color: '#64748b', display: 'block', marginBottom: '8px' }}>Líder de la mesa</label>
                <select value={editTableLeaderId} onChange={e => setEditTableLeaderId(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '4px', background: '#f8fafc', border: '1px solid #e2e8f0', color: '#0f172a' }}>
                  <option value="">-- Sin asignar --</option>
                  {leaders.map(l => (
                    <option key={l.id} value={l.id}>{l.name}</option>
                  ))}
                </select>
              </div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button type="button" onClick={() => setEditingTable(null)} style={{ flex: 1, padding: '10px', background: '#334155', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Cancelar</button>
                <button type="submit" style={{ flex: 1, padding: '10px', background: 'var(--color-accent)', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Leaders Management Modal */}
      {showLeadersModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ background: '#ffffff', padding: '30px', borderRadius: '12px', width: '800px', maxHeight: '90vh', overflowY: 'auto', display: 'flex', gap: '30px' }}>
            <div style={{ flex: 1 }}>
              <h3 style={{ color: '#0f172a', marginBottom: '20px' }}>Lista de Líderes</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {leaders.length === 0 && <div style={{ color: '#64748b' }}>No hay líderes registrados.</div>}
                {leaders.map(l => (
                  <div key={l.id} style={{ background: '#f8fafc', padding: '12px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontWeight: 'bold', color: '#0f172a' }}>{l.name}</div>
                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{l.email || 'Sin email'} • {l.phone || 'Sin tel'}</div>
                    {l.birthday && getZodiacInfo(l.birthday) && (
                      <div style={{ fontSize: '0.8rem', color: 'var(--color-bg)', marginTop: '4px' }}>
                        {getZodiacInfo(l.birthday).sign} (Camino: {getZodiacInfo(l.birthday).numerology})
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div style={{ flex: 1, borderLeft: '1px solid #e2e8f0', paddingLeft: '30px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ color: '#0f172a', margin: 0 }}>Crear Nuevo Líder</h3>
                <button onClick={() => setShowLeadersModal(false)} style={{ background: 'transparent', border: 'none', color: '#0f172a', fontSize: '1.5rem', cursor: 'pointer' }}>×</button>
              </div>
              <form onSubmit={handleCreateLeader} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <input required placeholder="Nombre Completo" value={newLeader.name} onChange={e => setNewLeader({...newLeader, name: e.target.value})} style={{ padding: '10px', borderRadius: '4px', background: '#f8fafc', border: '1px solid #e2e8f0', color: '#0f172a' }} />
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input type="email" placeholder="Correo" value={newLeader.email} onChange={e => setNewLeader({...newLeader, email: e.target.value})} style={{ flex: 1, padding: '10px', borderRadius: '4px', background: '#f8fafc', border: '1px solid #e2e8f0', color: '#0f172a' }} />
                  <input placeholder="Teléfono" value={newLeader.phone} onChange={e => setNewLeader({...newLeader, phone: e.target.value})} style={{ flex: 1, padding: '10px', borderRadius: '4px', background: '#f8fafc', border: '1px solid #e2e8f0', color: '#0f172a' }} />
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: '0.8rem', color: '#64748b', display: 'block', marginBottom: '4px' }}>Cumpleaños</label>
                    <input type="date" value={newLeader.birthday} onChange={e => setNewLeader({...newLeader, birthday: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '4px', background: '#f8fafc', border: '1px solid #e2e8f0', color: '#0f172a' }} />
                  </div>
                </div>
                <input placeholder="Negocio / Empresa" value={newLeader.business} onChange={e => setNewLeader({...newLeader, business: e.target.value})} style={{ padding: '10px', borderRadius: '4px', background: '#f8fafc', border: '1px solid #e2e8f0', color: '#0f172a' }} />
                
                {newLeader.birthday && getZodiacInfo(newLeader.birthday) && (
                  <div style={{ background: 'rgba(74, 137, 167, 0.1)', border: '1px solid var(--color-accent)', padding: '12px', borderRadius: '8px' }}>
                    <div style={{ fontWeight: 'bold', color: 'var(--color-bg)', marginBottom: '8px' }}>
                      Signo: {getZodiacInfo(newLeader.birthday).sign} | Numerología: {getZodiacInfo(newLeader.birthday).numerology}
                    </div>
                  </div>
                )}
                
                <textarea placeholder="Notas Internas..." value={newLeader.notes} onChange={e => setNewLeader({...newLeader, notes: e.target.value})} rows="3" style={{ padding: '10px', borderRadius: '4px', background: '#f8fafc', border: '1px solid #e2e8f0', color: '#0f172a' }} />
                
                <button type="submit" style={{ padding: '12px', background: 'var(--color-accent)', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', marginTop: '10px' }}>Guardar Líder</button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Timeline Event Modal */}
      {showEventModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div className="responsive-modal" style={{ background: '#ffffff', padding: '30px', borderRadius: '12px', width: '95%', maxWidth: '400px' }}>
            <h3 style={{ color: '#0f172a', marginBottom: '20px' }}>{editingEvent ? 'Editar Evento' : 'Añadir Evento al Cronograma'}</h3>
            <form onSubmit={handleSaveEvent} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', gap: '10px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '0.8rem', color: '#64748b', display: 'block', marginBottom: '8px' }}>Día</label>
                  <select required value={editEventForm.day} onChange={e => setEditEventForm({...editEventForm, day: parseInt(e.target.value)})} style={{ width: '100%', padding: '10px', borderRadius: '4px', background: '#f8fafc', border: '1px solid #e2e8f0', color: '#0f172a' }}>
                    <option value={1}>Día 1</option>
                    <option value={2}>Día 2</option>
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '0.8rem', color: '#64748b', display: 'block', marginBottom: '8px' }}>Hora (Ej: 09:30 AM)</label>
                  <input required type="text" placeholder="09:30 AM" value={editEventForm.time} onChange={e => setEditEventForm({...editEventForm, time: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '4px', background: '#f8fafc', border: '1px solid #e2e8f0', color: '#0f172a' }} />
                </div>
              </div>
              
              <div>
                <label style={{ fontSize: '0.8rem', color: '#64748b', display: 'block', marginBottom: '8px' }}>Título</label>
                <input required type="text" placeholder="Ej: Inicio con energía" value={editEventForm.title} onChange={e => setEditEventForm({...editEventForm, title: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '4px', background: '#f8fafc', border: '1px solid #e2e8f0', color: '#0f172a' }} />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: '#64748b', display: 'block', marginBottom: '8px' }}>Duración (Ej: 60min)</label>
                <input type="text" placeholder="60min" value={editEventForm.duration} onChange={e => setEditEventForm({...editEventForm, duration: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '4px', background: '#f8fafc', border: '1px solid #e2e8f0', color: '#0f172a' }} />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: '#64748b', display: 'block', marginBottom: '8px' }}>Descripción (Opcional)</label>
                <textarea rows="3" placeholder="Detalles de la actividad..." value={editEventForm.description} onChange={e => setEditEventForm({...editEventForm, description: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '4px', background: '#f8fafc', border: '1px solid #e2e8f0', color: '#0f172a' }} />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: '#64748b', display: 'block', marginBottom: '8px' }}>Orden (opcional, para forzar orden cronológico)</label>
                <input type="number" value={editEventForm.order_index} onChange={e => setEditEventForm({...editEventForm, order_index: parseInt(e.target.value) || 0})} style={{ width: '100%', padding: '10px', borderRadius: '4px', background: '#f8fafc', border: '1px solid #e2e8f0', color: '#0f172a' }} />
              </div>
              
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button type="button" onClick={() => setShowEventModal(false)} style={{ flex: 1, padding: '10px', background: '#334155', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Cancelar</button>
                <button type="submit" style={{ flex: 1, padding: '10px', background: 'var(--color-accent)', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Guardar Evento</button>
              </div>
            </form>
          </div>
        </div>
      )}


      {/* Detail Modal */}
      {selectedClient && (
        <ClientDetailModal 
          client={selectedClient} 
          initialTab="info"
          hideExtraTabs={true}
          onClose={() => setSelectedClient(null)} 
          onUpdate={(updatedData) => {
            setRegistrations(prev => prev.map(r => r.id === updatedData.id ? updatedData : r));
            setSelectedClient(updatedData);
          }} 
        />
      )}
    </div>
  );
}
