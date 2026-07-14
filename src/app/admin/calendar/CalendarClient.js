"use client";

import { useState } from 'react';
import { ClientDetailModal } from '../contacts/ContactsClient';

export default function CalendarClient({ reminders: initialReminders, clients = [] }) {
  const [reminders, setReminders] = useState(initialReminders);
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Client Detail Modal
  const [selectedClient, setSelectedClient] = useState(null);

  // Quick Add Reminder Modal
  const [showQuickReminder, setShowQuickReminder] = useState(false);
  const [quickReminderDate, setQuickReminderDate] = useState('');
  const [quickReminderClientId, setQuickReminderClientId] = useState('');
  const [quickReminderDesc, setQuickReminderDesc] = useState('');
  const [clientSearch, setClientSearch] = useState('');

  const [isLead, setIsLead] = useState(false);
  const [quickReminderLeadName, setQuickReminderLeadName] = useState('');
  const [quickReminderLeadPhone, setQuickReminderLeadPhone] = useState('');
  const [quickReminderTag, setQuickReminderTag] = useState('Pendiente de pago');

  // Day Reminders Modal
  const [dayRemindersModal, setDayRemindersModal] = useState(null); // stores date string

  const [activeTab, setActiveTab] = useState('calendar'); // 'calendar' o 'conversion'
  // Global List Filters
  const [globalSearch, setGlobalSearch] = useState('');
  const [tagFilter, setTagFilter] = useState('');

  // Edit Reminder Modal
  const [editingReminder, setEditingReminder] = useState(null);
  const [editReminderDate, setEditReminderDate] = useState('');
  const [editReminderDesc, setEditReminderDesc] = useState('');
  const [editReminderLeadName, setEditReminderLeadName] = useState('');
  const [editReminderLeadPhone, setEditReminderLeadPhone] = useState('');
  const [editReminderTag, setEditReminderTag] = useState('');

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 (Sun) to 6 (Sat)
  
  // Adjust so Monday is 0
  const startOffset = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanksArray = Array.from({ length: startOffset }, (_, i) => i);

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

  const openClientDetails = (clientId) => {
    const client = clients.find(c => c.id === clientId);
    if (client) setSelectedClient(client);
  };

  const openQuickReminder = (dateStr) => {
    setQuickReminderDate(dateStr);
    setQuickReminderClientId('');
    setQuickReminderDesc('');
    setClientSearch('');
    setIsLead(true);
    setQuickReminderLeadName('');
    setQuickReminderLeadPhone('');
    setQuickReminderTag('Pendiente de pago');
    setShowQuickReminder(true);
  };

  const handleQuickReminderSubmit = async (e) => {
    e.preventDefault();
    if (isLead) {
      if (!quickReminderLeadName || !quickReminderLeadPhone || !quickReminderDate) return;
    } else {
      if (!quickReminderClientId || !quickReminderDate) return;
    }
    
    await fetch('/api/admin/reminders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        client_id: isLead ? null : quickReminderClientId, 
        lead_name: isLead ? quickReminderLeadName : null,
        lead_phone: isLead ? quickReminderLeadPhone : null,
        tag: isLead ? quickReminderTag : null,
        description: quickReminderDesc, 
        date: quickReminderDate 
      })
    });
    
    // Fetch updated reminders without reloading the page
    const res = await fetch('/api/admin/reminders');
    const updatedReminders = await res.json();
    setReminders(updatedReminders);
    
    setShowQuickReminder(false);
  };

  const toggleReminderStatus = async (e, rem) => {
    e.stopPropagation();
    const newCompleted = rem.completed ? 0 : 1;
    await fetch('/api/admin/reminders', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: rem.id, completed: newCompleted })
    });
    setReminders(reminders.map(r => r.id === rem.id ? { ...r, completed: newCompleted } : r));
  };

  const toggleConvertedStatus = async (e, rem) => {
    e.stopPropagation();
    const newConverted = rem.converted ? 0 : 1;
    await fetch('/api/admin/reminders', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: rem.id, converted: newConverted })
    });
    setReminders(reminders.map(r => r.id === rem.id ? { ...r, converted: newConverted } : r));
  };

  const handleQuickDateChange = async (e, rem) => {
    e.stopPropagation();
    const newDate = e.target.value;
    if (!newDate) return;
    await fetch('/api/admin/reminders', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: rem.id, date: newDate })
    });
    setReminders(reminders.map(r => r.id === rem.id ? { ...r, date: newDate } : r));
  };

  const deleteReminder = async (e, rem) => {
    e.stopPropagation();
    if (!confirm('¿Seguro que deseas eliminar este recordatorio?')) return;
    await fetch(`/api/admin/reminders?id=${rem.id}`, { method: 'DELETE' });
    setReminders(reminders.filter(r => r.id !== rem.id));
  };

  const openEditReminder = (rem) => {
    setEditingReminder(rem);
    setEditReminderDate(rem.date);
    setEditReminderDesc(rem.description || '');
    setEditReminderLeadName(rem.lead_name || '');
    setEditReminderLeadPhone(rem.lead_phone || '');
    setEditReminderTag(rem.tag || 'Pendiente de pago');
  };

  const handleEditReminderSubmit = async (e) => {
    e.preventDefault();
    const isRemLead = !editingReminder.client_id && editingReminder.lead_name;
    if (isRemLead && (!editReminderLeadName || !editReminderLeadPhone)) return;
    if (!editReminderDate) return;

    await fetch('/api/admin/reminders', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        id: editingReminder.id,
        date: editReminderDate,
        description: editReminderDesc,
        lead_name: isRemLead ? editReminderLeadName : null,
        lead_phone: isRemLead ? editReminderLeadPhone : null,
        tag: isRemLead ? editReminderTag : null
      })
    });
    
    const res = await fetch('/api/admin/reminders');
    const updatedReminders = await res.json();
    setReminders(updatedReminders);
    
    setEditingReminder(null);
  };

  const renderReminderCard = (rem) => {
    const isRemLead = !rem.client_id && rem.lead_name;
    const tagColors = {
      'Pendiente de pago': '#0f172a', // Removed ugly red, using dark blue/slate
      'Interesado': '#0ea5e9', // Light blue
      'Cuota': '#8b5cf6',
      'Otro': '#64748b'
    };
    const leadBg = isRemLead && rem.tag ? tagColors[rem.tag] || '#64748b' : 'var(--color-accent)';
    
    // Un recordatorio se considera finalizado si está completado o convertido
    const isFinalized = rem.completed === 1 || rem.converted === 1;

    return (
      <div 
        key={rem.id} 
        style={{ background: leadBg, color: '#fff', padding: '8px 12px', borderRadius: '6px', fontSize: '0.85rem', display: 'flex', alignItems: 'flex-start', gap: '12px', opacity: isFinalized ? 0.6 : 1, marginBottom: '6px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }} 
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '2px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', fontSize: '0.75rem' }} title="Marcar como completado">
            <input type="checkbox" checked={rem.completed === 1} onChange={(e) => toggleReminderStatus(e, rem)} />
            Completado
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', fontSize: '0.75rem' }} title="Marcar como convertido (venta cerrada)">
            <input type="checkbox" checked={rem.converted === 1} onChange={(e) => toggleConvertedStatus(e, rem)} />
            Convertido
          </label>
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <strong 
              style={{ textDecoration: isFinalized ? 'line-through' : 'none', cursor: !isRemLead ? 'pointer' : 'default' }}
              onClick={() => !isRemLead && openClientDetails(rem.client_id)}
              title={!isRemLead ? "Ver Detalles del Cliente" : ""}
            >
              {isRemLead ? rem.lead_name : rem.client_name}
            </strong>
            <div style={{ display: 'flex', gap: '4px' }}>
              <button 
                onClick={(e) => { e.stopPropagation(); openEditReminder(rem); }} 
                style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', border: 'none', borderRadius: '4px', padding: '2px 6px', fontSize: '0.7rem', cursor: 'pointer' }}
              >
                Editar
              </button>
              <button 
                onClick={(e) => deleteReminder(e, rem)} 
                style={{ background: '#ef4444', color: '#fff', border: 'none', borderRadius: '4px', padding: '2px 6px', fontSize: '0.7rem', cursor: 'pointer' }}
                title="Eliminar"
              >
                ✕
              </button>
            </div>
          </div>
          <div style={{ textDecoration: isFinalized ? 'line-through' : 'none' }}>
            {isRemLead && `(${rem.tag}) `}{rem.description}
          </div>
          {isRemLead && rem.lead_phone && (
            <div style={{ fontSize: '0.75rem', marginTop: '2px' }}>📞 {rem.lead_phone}</div>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
            📅 
            <input 
              type="date" 
              value={rem.date} 
              onChange={(e) => handleQuickDateChange(e, rem)} 
              onClick={e => e.stopPropagation()} 
              style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '4px', fontSize: '0.7rem', padding: '2px', cursor: 'pointer' }} 
            />
          </div>
        </div>
      </div>
    );
  };

  return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', color: '#0f172a', margin: 0 }}>Calendario de Seguimiento</h2>
          <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>Tus recordatorios y métricas</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <div style={{ display: 'flex', background: '#e2e8f0', padding: '4px', borderRadius: '8px' }}>
            <button onClick={() => setActiveTab('calendar')} style={{ background: activeTab === 'calendar' ? '#fff' : 'transparent', color: activeTab === 'calendar' ? '#0f172a' : '#64748b', border: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '0.85rem', cursor: 'pointer', fontWeight: activeTab === 'calendar' ? 'bold' : 'normal', boxShadow: activeTab === 'calendar' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none' }}>Calendario</button>
            <button onClick={() => setActiveTab('conversion')} style={{ background: activeTab === 'conversion' ? '#fff' : 'transparent', color: activeTab === 'conversion' ? '#0f172a' : '#64748b', border: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '0.85rem', cursor: 'pointer', fontWeight: activeTab === 'conversion' ? 'bold' : 'normal', boxShadow: activeTab === 'conversion' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none' }}>Conversión</button>
          </div>
          <button onClick={openQuickReminder} style={{ background: 'var(--color-accent)', color: '#fff', border: 'none', borderRadius: '8px', padding: '8px 16px', fontSize: '0.9rem', cursor: 'pointer', fontWeight: 'bold' }}>
            + Nuevo Recordatorio
          </button>
        </div>
      </div>

      {activeTab === 'calendar' && (
        <>
          <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px' }}>
              <button onClick={prevMonth} style={{ background: '#ffffff', border: '1px solid #e2e8f0', color: '#64748b', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer' }}>&lt;</button>
              <span style={{ fontSize: '1.2rem', fontWeight: 'bold', minWidth: '150px', textAlign: 'center' }}>
                {monthNames[month]} {year}
              </span>
              <button onClick={nextMonth} style={{ background: '#ffffff', border: '1px solid #e2e8f0', color: '#64748b', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer' }}>&gt;</button>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
              {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map(day => (
                <div key={day} style={{ padding: '12px', textAlign: 'center', color: '#64748b', fontWeight: 'bold', fontSize: '0.9rem' }}>
                  {day}
                </div>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', flex: 1, autoRows: 'minmax(120px, 1fr)' }}>
              {blanksArray.map(b => (
                <div key={`blank-${b}`} style={{ borderRight: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0', background: '#f8fafc', opacity: 0.5 }}></div>
              ))}
              {daysArray.map(day => {
                const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                const dayReminders = reminders.filter(r => r.date === dateStr);
                const isToday = new Date().toISOString().split('T')[0] === dateStr;

                return (
                  <div key={day} style={{ borderRight: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0', padding: '8px', display: 'flex', flexDirection: 'column', gap: '8px', background: isToday ? 'rgba(74, 137, 167, 0.05)' : 'transparent' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <button 
                        onClick={() => openQuickReminder(dateStr)}
                        style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '1.2rem', padding: '0 4px', borderRadius: '4px' }}
                      >
                        +
                      </button>
                      <div style={{ textAlign: 'right', fontWeight: 'bold', color: isToday ? 'var(--color-accent)' : '#64748b', fontSize: '1.1rem' }}>
                        {day}
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', overflowY: 'auto' }}>
                      {(() => {
                        const pendingCount = dayReminders.filter(r => !r.completed && !r.converted).length;
                        if (pendingCount > 0) {
                          return (
                            <div 
                              onClick={() => setDayRemindersModal(dateStr)}
                              style={{ background: 'var(--color-accent)', color: '#fff', padding: '6px', borderRadius: '6px', fontSize: '0.8rem', textAlign: 'center', cursor: 'pointer', fontWeight: 'bold' }}
                            >
                              {pendingCount} {pendingCount === 1 ? 'pendiente' : 'pendientes'}
                            </div>
                          );
                        } else if (dayReminders.length > 0) {
                          return (
                            <div 
                              onClick={() => setDayRemindersModal(dateStr)}
                              style={{ background: '#94a3b8', color: '#fff', padding: '6px', borderRadius: '6px', fontSize: '0.8rem', textAlign: 'center', cursor: 'pointer', fontWeight: 'bold' }}
                            >
                              Completados
                            </div>
                          );
                        }
                        return null;
                      })()}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
              <h3 style={{ margin: 0, color: '#0f172a' }}>Todos los Recordatorios</h3>
              <div style={{ display: 'flex', gap: '10px' }}>
                <select 
                  value={tagFilter} 
                  onChange={(e) => setTagFilter(e.target.value)} 
                  style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#f8fafc', color: '#0f172a', minWidth: '150px' }}
                >
                  <option value="">Todas las etiquetas</option>
                  <option value="Pendiente de pago">Pendiente de pago</option>
                  <option value="Interesado">Interesado</option>
                  <option value="Cuota">Cuota</option>
                  <option value="Otro">Otro</option>
                </select>
                <input 
                  type="text" 
                  placeholder="Buscar por nombre o número..." 
                  value={globalSearch} 
                  onChange={(e) => setGlobalSearch(e.target.value)} 
                  style={{ width: '250px', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#f8fafc', color: '#0f172a' }}
                />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '12px' }}>
              {reminders
                .filter(r => {
                  let matchesSearch = true;
                  if (globalSearch) {
                    const term = globalSearch.toLowerCase();
                    const name = (r.lead_name || r.client_name || '').toLowerCase();
                    const phone = (r.lead_phone || '').toLowerCase();
                    matchesSearch = name.includes(term) || phone.includes(term);
                  }
                  
                  let matchesTag = true;
                  if (tagFilter) {
                    const tag = r.tag || '';
                    matchesTag = tag === tagFilter;
                  }
                  
                  return matchesSearch && matchesTag;
                })
                .sort((a, b) => new Date(a.date) - new Date(b.date))
                .map(rem => renderReminderCard(rem))}
            </div>
          </div>
        </>
      )}

      {activeTab === 'conversion' && (
        <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '30px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <h3 style={{ margin: 0, color: '#0f172a' }}>Tasa de Conversión General</h3>
          <div style={{ display: 'flex', gap: '20px' }}>
            {(() => {
              const total = reminders.length;
              const convertedCount = reminders.filter(r => r.converted === 1).length;
              const rate = total > 0 ? ((convertedCount / total) * 100).toFixed(1) : 0;
              return (
                <>
                  <div style={{ flex: 1, background: '#f8fafc', padding: '20px', borderRadius: '12px', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#0f172a' }}>{total}</div>
                    <div style={{ fontSize: '0.9rem', color: '#64748b' }}>Recordatorios Totales</div>
                  </div>
                  <div style={{ flex: 1, background: '#f0fdf4', padding: '20px', borderRadius: '12px', textAlign: 'center', border: '1px solid #bbf7d0' }}>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#166534' }}>{convertedCount}</div>
                    <div style={{ fontSize: '0.9rem', color: '#166534' }}>Convertidos</div>
                  </div>
                  <div style={{ flex: 1, background: '#eff6ff', padding: '20px', borderRadius: '12px', textAlign: 'center', border: '1px solid #bfdbfe' }}>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1e40af' }}>{rate}%</div>
                    <div style={{ fontSize: '0.9rem', color: '#1e40af' }}>Tasa de Éxito</div>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}

      {/* Quick Reminder Modal */}
      {showQuickReminder && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ background: '#ffffff', padding: '30px', borderRadius: '12px', width: '95%', maxWidth: '400px' }}>
            <h3 style={{ color: '#0f172a', marginBottom: '20px' }}>Recordatorio Rápido</h3>
            <form onSubmit={handleQuickReminderSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: '#64748b' }}>Fecha</label>
                <input required type="date" value={quickReminderDate} onChange={e => setQuickReminderDate(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '4px', background: '#f8fafc', border: '1px solid #e2e8f0', color: '#0f172a' }} />
              </div>
              
              <div style={{ display: 'flex', gap: '10px', marginBottom: '8px' }}>
                <button type="button" onClick={() => setIsLead(false)} style={{ flex: 1, padding: '8px', background: !isLead ? 'var(--color-accent)' : '#f8fafc', color: !isLead ? '#fff' : '#64748b', border: '1px solid #e2e8f0', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Cliente Registrado</button>
                <button type="button" onClick={() => setIsLead(true)} style={{ flex: 1, padding: '8px', background: isLead ? 'var(--color-accent)' : '#f8fafc', color: isLead ? '#fff' : '#64748b', border: '1px solid #e2e8f0', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Nuevo Lead</button>
              </div>

              {!isLead ? (
                <div>
                  <label style={{ fontSize: '0.8rem', color: '#64748b' }}>Cliente</label>
                  <input 
                    type="text" 
                    placeholder="Buscar nombre o correo..." 
                    value={clientSearch} 
                    onChange={e => setClientSearch(e.target.value)} 
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '4px', background: '#f8fafc', border: '1px solid #e2e8f0', color: '#0f172a', marginBottom: '8px' }} 
                  />
                  <select required={!isLead} value={quickReminderClientId} onChange={e => setQuickReminderClientId(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '4px', background: '#f8fafc', border: '1px solid #e2e8f0', color: '#0f172a' }}>
                    <option value="">Seleccionar Cliente</option>
                    {clients
                      .filter(c => c.name.toLowerCase().includes(clientSearch.toLowerCase()) || c.email.toLowerCase().includes(clientSearch.toLowerCase()))
                      .map(c => <option key={c.id} value={c.id}>{c.name} ({c.email})</option>)
                    }
                  </select>
                </div>
              ) : (
                <>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: '#64748b' }}>Nombre del Lead</label>
                    <input required={isLead} placeholder="Ej. Juan Pérez" value={quickReminderLeadName} onChange={e => setQuickReminderLeadName(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '4px', background: '#f8fafc', border: '1px solid #e2e8f0', color: '#0f172a' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: '#64748b' }}>Teléfono</label>
                    <input required={isLead} placeholder="Ej. +34 600..." value={quickReminderLeadPhone} onChange={e => setQuickReminderLeadPhone(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '4px', background: '#f8fafc', border: '1px solid #e2e8f0', color: '#0f172a' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: '#64748b' }}>Etiqueta</label>
                    <select required={isLead} value={quickReminderTag} onChange={e => setQuickReminderTag(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '4px', background: '#f8fafc', border: '1px solid #e2e8f0', color: '#0f172a' }}>
                      <option value="Pendiente de pago">Pendiente de pago</option>
                      <option value="Interesado">Interesado</option>
                      <option value="Cuota">Cuota</option>
                      <option value="Otro">Otro</option>
                    </select>
                  </div>
                </>
              )}

              <div>
                <label style={{ fontSize: '0.8rem', color: '#64748b' }}>Descripción (Opcional)</label>
                <input placeholder="Escribir nota..." value={quickReminderDesc} onChange={e => setQuickReminderDesc(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '4px', background: '#f8fafc', border: '1px solid #e2e8f0', color: '#0f172a' }} />
              </div>
              
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button type="button" onClick={() => setShowQuickReminder(false)} style={{ flex: 1, padding: '10px', background: '#334155', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Cancelar</button>
                <button type="submit" style={{ flex: 1, padding: '10px', background: 'var(--color-accent)', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {selectedClient && (
        <ClientDetailModal 
          client={selectedClient} 
          initialTab="reminders"
          onClose={() => setSelectedClient(null)} 
          onUpdate={() => {}} // Not updating parent list in calendar view to keep things simple
        />
      )}

      {/* Day Reminders Modal */}
      {dayRemindersModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ background: '#ffffff', padding: '30px', borderRadius: '12px', width: '95%', maxWidth: '500px', maxHeight: '80vh', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ color: '#0f172a', margin: 0 }}>Recordatorios: {dayRemindersModal}</h3>
              <button onClick={() => setDayRemindersModal(null)} style={{ background: 'transparent', border: 'none', color: '#0f172a', fontSize: '1.5rem', cursor: 'pointer' }}>×</button>
            </div>
            <div style={{ overflowY: 'auto', flex: 1, paddingRight: '8px' }}>
              {reminders.filter(r => r.date === dayRemindersModal).map(rem => renderReminderCard(rem))}
            </div>
            <div style={{ marginTop: '20px' }}>
              <button onClick={() => setDayRemindersModal(null)} style={{ width: '100%', padding: '12px', background: '#334155', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Cerrar</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Reminder Modal */}
      {editingReminder && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 110 }}>
          <div style={{ background: '#ffffff', padding: '30px', borderRadius: '12px', width: '95%', maxWidth: '400px' }}>
            <h3 style={{ color: '#0f172a', marginBottom: '20px' }}>Editar Recordatorio</h3>
            <form onSubmit={handleEditReminderSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: '#64748b' }}>Fecha</label>
                <input required type="date" value={editReminderDate} onChange={e => setEditReminderDate(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '4px', background: '#f8fafc', border: '1px solid #e2e8f0', color: '#0f172a' }} />
              </div>
              
              {(!editingReminder.client_id && editingReminder.lead_name) && (
                <>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: '#64748b' }}>Nombre del Lead</label>
                    <input required placeholder="Ej. Juan Pérez" value={editReminderLeadName} onChange={e => setEditReminderLeadName(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '4px', background: '#f8fafc', border: '1px solid #e2e8f0', color: '#0f172a' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: '#64748b' }}>Teléfono</label>
                    <input required placeholder="Ej. +34 600..." value={editReminderLeadPhone} onChange={e => setEditReminderLeadPhone(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '4px', background: '#f8fafc', border: '1px solid #e2e8f0', color: '#0f172a' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: '#64748b' }}>Etiqueta</label>
                    <select required value={editReminderTag} onChange={e => setEditReminderTag(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '4px', background: '#f8fafc', border: '1px solid #e2e8f0', color: '#0f172a' }}>
                      <option value="Pendiente de pago">Pendiente de pago</option>
                      <option value="Interesado">Interesado</option>
                      <option value="Cuota">Cuota</option>
                      <option value="Otro">Otro</option>
                    </select>
                  </div>
                </>
              )}

              <div>
                <label style={{ fontSize: '0.8rem', color: '#64748b' }}>Descripción (Opcional)</label>
                <input placeholder="Escribir nota..." value={editReminderDesc} onChange={e => setEditReminderDesc(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '4px', background: '#f8fafc', border: '1px solid #e2e8f0', color: '#0f172a' }} />
              </div>
              
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button type="button" onClick={() => setEditingReminder(null)} style={{ flex: 1, padding: '10px', background: '#334155', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Cancelar</button>
                <button type="submit" style={{ flex: 1, padding: '10px', background: 'var(--color-accent)', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Guardar Cambios</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
