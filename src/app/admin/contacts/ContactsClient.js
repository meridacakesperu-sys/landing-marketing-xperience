"use client";

import { useState, useEffect, useRef } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, Legend } from 'recharts';
import { QRCodeSVG } from 'qrcode.react';
import * as htmlToImage from 'html-to-image';

export const COLUMNS = [
  { id: 'Nuevo', title: 'Nuevos', color: '#64748b' },
  { id: 'Cuotas', title: 'Cuotas', color: '#8b5cf6' },
  { id: 'Completado', title: 'Completado', color: '#10b981' },
  { id: 'Invitado', title: 'Invitados', color: '#f59e0b' },
  { id: 'Cancelado', title: 'Cancelado', color: '#475569' }
];

export default function ContactsClient({ initialData, agents = [] }) {
  const [registrations, setRegistrations] = useState(initialData);
  const [selectedClient, setSelectedClient] = useState(null);
  const [initialModalTab, setInitialModalTab] = useState('info');
  const [showAddModal, setShowAddModal] = useState(false);
  const [mainTab, setMainTab] = useState('kanban'); // 'kanban' | 'survey'

  const [settings, setSettings] = useState({});

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/admin/settings');
        const data = await res.json();
        setSettings(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchSettings();
  }, []);

  // Filters State
  const [searchName, setSearchName] = useState('');
  const [filterPlan, setFilterPlan] = useState('Todos');
  const [filterDate, setFilterDate] = useState('');
  const [filterCuotas, setFilterCuotas] = useState(false);
  const [chartRange, setChartRange] = useState(14);

  // New Client Form State
  const [newClient, setNewClient] = useState({ 
    name: '', email: '', phone: '', plan: 'General', business: '', ticket_price: 75, purchase_stage: 'Pre-venta', birthday: '', agent_id: '' 
  });

  // Update Status in DB
  const updateStatus = async (id, newStatus) => {
    try {
      await fetch('/api/admin/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus })
      });
    } catch (err) {
      console.error(err);
    }
  };

  // Handle Drag & Drop
  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const newStatus = destination.droppableId;
    const clientId = parseInt(draggableId);

    setRegistrations(regs => regs.map(r => r.id === clientId ? { ...r, status: newStatus } : r));
    updateStatus(clientId, newStatus);
  };

  // Add Client
  const handleAddClient = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newClient)
      });
      const data = await res.json();
      if (data.success) {
        setRegistrations([{ ...newClient, id: data.id, status: 'Nuevo', total_paid: 0, createdAt: new Date().toISOString() }, ...registrations]);
        setShowAddModal(false);
        setNewClient({ name: '', email: '', phone: '', plan: 'General', business: '', birthday: '', ticket_price: '', purchase_stage: 'Pre-venta' });
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Open Modal Helpers
  const openDetail = (client) => {
    setInitialModalTab('info');
    setSelectedClient(client);
  };

  const openReminder = (e, client) => {
    e.stopPropagation(); // Prevent opening the detail modal normally
    setInitialModalTab('reminders');
    setSelectedClient(client);
  };

  // Filter Logic
  const filteredRegistrations = registrations.filter(reg => {
    const matchesSearch = searchName === '' || 
      reg.name.toLowerCase().includes(searchName.toLowerCase()) || 
      reg.email.toLowerCase().includes(searchName.toLowerCase());
    
    const matchesPlan = filterPlan === 'Todos' || reg.plan.includes(filterPlan);
    const matchesDate = filterDate === '' || reg.createdAt.startsWith(filterDate);
    const matchesCuotas = !filterCuotas || reg.status === 'Cuotas' || (reg.total_paid && reg.total_paid > 0);

    return matchesSearch && matchesPlan && matchesDate && matchesCuotas;
  });

  // --- Chart Data Processing ---
  const regsByDateMap = {};
  for (let i = chartRange - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    regsByDateMap[d.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })] = 0;
  }
  
  registrations.forEach(r => {
    const d = new Date(r.createdAt).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' });
    if (regsByDateMap[d] !== undefined) {
      regsByDateMap[d] += 1;
    }
  });
  const areaData = Object.keys(regsByDateMap).map(date => ({ date, count: regsByDateMap[date] }));

  const totalVIP = registrations.filter(r => r.plan && r.plan.includes('VIP')).length;
  const totalGeneral = registrations.length - totalVIP;
  const pieData = [
    { name: 'VIP', value: totalVIP },
    { name: 'General', value: totalGeneral }
  ];
  const COLORS = ['#c19845', '#4a89a7']; // Gold, Blue

  // --- Survey Metrics Data ---
  const calculateDistribution = (key) => {
    const dist = {};
    registrations.forEach(r => {
      if (!r[key]) return;
      // Truncate long 'Otro' texts or keep them as 'Otro/Personalizado'
      const val = (r[key].length > 30) ? 'Otro' : r[key];
      dist[val] = (dist[val] || 0) + 1;
    });
    return Object.keys(dist).map(name => ({ name, value: dist[name] })).sort((a,b) => b.value - a.value);
  };
  
  const marketingLevelData = calculateDistribution('marketing_level');
  const aiLevelData = calculateDistribution('ai_level');
  const salesLevelData = calculateDistribution('sales_level');
  const mainGoalData = calculateDistribution('main_goal');
  const mainStruggleData = calculateDistribution('main_struggle');
  const salesTypeData = calculateDistribution('sales_type');

  const COLORS_SURVEY = ['#c19845', '#4a89a7', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#64748b', '#3b82f6', '#14b8a6', '#f43f5e'];

  const cardStyle = { background: '#ffffff', borderRadius: '12px', padding: '24px', border: '1px solid #e2e8f0', flex: 1 };
  const cardTitle = { fontSize: '1.1rem', fontWeight: '600', color: '#0f172a', marginBottom: '8px' };
  const cardSubtitle = { fontSize: '0.8rem', color: '#64748b', marginBottom: '24px' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflowY: 'auto' }}>
      
      {/* Top Charts */}
      <div style={{ display: 'flex', gap: '24px', marginBottom: '24px' }}>
        
        {/* Area Chart */}
        <div style={{ ...cardStyle, flex: 2 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h3 style={cardTitle}>Registros en el Tiempo</h3>
              <select 
                value={chartRange} 
                onChange={(e) => setChartRange(Number(e.target.value))}
                style={{ padding: '4px 8px', borderRadius: '6px', background: '#f8fafc', color: '#64748b', border: '1px solid #e2e8f0', outline: 'none', fontSize: '0.8rem', marginBottom: '24px' }}
              >
                <option value={14}>Últimos 14 días</option>
                <option value={30}>Último Mes</option>
                <option value={90}>Últimos 3 Meses</option>
              </select>
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--color-accent)' }}>
              {registrations.length} Total
            </div>
          </div>
          
          <div style={{ width: '100%', height: '200px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={areaData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-accent)" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="var(--color-accent)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #e2e8f0', borderRadius: '8px' }} itemStyle={{ color: '#0f172a' }} />
                <Area type="monotone" dataKey="count" stroke="var(--color-accent)" strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Donut Chart */}
        <div style={cardStyle}>
          <h3 style={cardTitle}>Entradas por Plan</h3>
          <p style={cardSubtitle}>Distribución General vs VIP</p>
          
          <div style={{ width: '100%', height: '180px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '8px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '10px' }}>
            {pieData.map((entry, index) => (
              <div key={`legend-${index}`} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: COLORS[index % COLORS.length] }}></div>
                <span style={{ color: '#0f172a', fontSize: '0.85rem' }}>{entry.name} ({entry.value})</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
        <button 
          onClick={() => setMainTab('kanban')}
          style={{ flex: 1, padding: '16px', borderRadius: '12px', background: mainTab === 'kanban' ? 'var(--color-accent)' : '#1e293b', color: '#fff', border: 'none', fontWeight: 'bold', cursor: 'pointer', fontSize: '1.1rem', transition: 'all 0.2s' }}
        >
          Tablero Kanban
        </button>
        <button 
          onClick={() => setMainTab('survey')}
          style={{ flex: 1, padding: '16px', borderRadius: '12px', background: mainTab === 'survey' ? 'var(--color-accent)' : '#1e293b', color: '#fff', border: 'none', fontWeight: 'bold', cursor: 'pointer', fontSize: '1.1rem', transition: 'all 0.2s' }}
        >
          Métricas de Encuesta
        </button>
      </div>

      {mainTab === 'kanban' ? (
        <>
          {/* Header and Filters */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px', background: '#ffffff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2 style={{ fontSize: '1.5rem', color: '#0f172a', margin: 0 }}>Tablero Kanban</h2>
                <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>Filtra y gestiona tus clientes</p>
              </div>
              <button 
                onClick={() => setShowAddModal(true)}
                style={{ background: 'var(--color-accent)', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}
              >
                + Nuevo Cliente
              </button>
            </div>

        {/* Filters Row */}
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <input 
            type="text" 
            placeholder="🔍 Buscar nombre o email..." 
            value={searchName} 
            onChange={(e) => setSearchName(e.target.value)} 
            style={{ flex: 1, minWidth: '200px', padding: '10px 14px', borderRadius: '6px', background: '#f8fafc', border: '1px solid #e2e8f0', color: '#0f172a' }} 
          />
          <select 
            value={filterPlan} 
            onChange={(e) => setFilterPlan(e.target.value)}
            style={{ padding: '10px 14px', borderRadius: '6px', background: '#f8fafc', color: '#0f172a', border: '1px solid #e2e8f0', outline: 'none' }}
          >
            <option value="Todos">Todos los Planes</option>
            <option value="VIP">VIP</option>
            <option value="General">General</option>
          </select>
          <input 
            type="date" 
            title="Fecha de Creación"
            value={filterDate} 
            onChange={(e) => setFilterDate(e.target.value)} 
            style={{ padding: '10px 14px', borderRadius: '6px', background: '#f8fafc', border: '1px solid #e2e8f0', color: '#0f172a' }} 
          />
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#0f172a', cursor: 'pointer', background: '#f8fafc', padding: '0 14px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
            <input 
              type="checkbox" 
              checked={filterCuotas} 
              onChange={(e) => setFilterCuotas(e.target.checked)} 
              style={{ cursor: 'pointer' }}
            />
            Con abonos/cuotas
          </label>
        </div>
      </div>

      {/* Kanban Board */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div style={{ display: 'flex', gap: '16px', overflowX: 'auto', paddingBottom: '20px', flex: 1, alignItems: 'flex-start', minHeight: '600px' }}>
          {COLUMNS.map(col => {
            const columnRegs = filteredRegistrations.filter(r => (r.status || 'Nuevo') === col.id);
            return (
              <div key={col.id} style={{ minWidth: '280px', background: '#f1f5f9', borderRadius: '8px', display: 'flex', flexDirection: 'column', maxHeight: '100%' }}>
                <div style={{ padding: '12px 16px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ fontSize: '0.9rem', color: '#1e293b', margin: 0 }}>{col.title}</h3>
                  <span style={{ background: '#e2e8f0', color: '#64748b', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem' }}>{columnRegs.length}</span>
                </div>

                <Droppable droppableId={col.id}>
                  {(provided, snapshot) => (
                    <div 
                      ref={provided.innerRef} 
                      {...provided.droppableProps}
                      style={{ padding: '12px', flex: 1, overflowY: 'auto', minHeight: '150px', background: snapshot.isDraggingOver ? '#e2e8f0' : 'transparent', transition: 'background 0.2s' }}
                    >
                      {columnRegs.map((reg, index) => {
                        const currentStatusObj = COLUMNS.find(c => c.id === (reg.status || 'Nuevo'));
                        
                        return (
                          <Draggable key={reg.id.toString()} draggableId={reg.id.toString()} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                onClick={() => openDetail(reg)}
                                style={{
                                  userSelect: 'none',
                                  padding: '16px',
                                  margin: '0 0 12px 0',
                                  minHeight: '50px',
                                  backgroundColor: snapshot.isDragging ? '#f1f5f9' : '#ffffff',
                                  color: '#0f172a',
                                  borderRadius: '6px',
                                  borderLeft: `4px solid ${reg.plan.includes('VIP') ? 'var(--color-accent)' : 'var(--color-bg)'}`,
                                  border: '1px solid #e2e8f0',
                                  cursor: 'pointer',
                                  position: 'relative',
                                  ...provided.draggableProps.style,
                                }}
                              >
                                {/* Name and Colored Tag */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', paddingRight: '24px', flexWrap: 'wrap' }}>
                                  <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>{reg.name}</div>
                                  <div style={{ fontSize: '0.65rem', padding: '2px 6px', borderRadius: '4px', background: currentStatusObj.color + '33', color: currentStatusObj.color, border: `1px solid ${currentStatusObj.color}66` }}>
                                    {currentStatusObj.title}
                                  </div>
                                  <div style={{ width: '100%', fontSize: '0.75rem', color: '#64748b' }}>
                                    {reg.purchase_stage || 'Pre-venta'} | ${reg.ticket_price || 0}
                                  </div>
                                </div>
                                
                                {/* Quick Reminder Button */}
                                <button 
                                  onClick={(e) => openReminder(e, reg)}
                                  title="Agregar Recordatorio"
                                  style={{ position: 'absolute', top: '12px', right: '12px', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1.2rem', padding: '4px', borderRadius: '4px' }}
                                  onMouseOver={e => e.currentTarget.style.background = '#e2e8f0'}
                                  onMouseOut={e => e.currentTarget.style.background = 'transparent'}
                                >
                                  ⏰
                                </button>

                                <div style={{ fontSize: '0.75rem', color: '#64748b', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                  <span style={{ background: reg.plan.includes('VIP') ? 'rgba(193,152,69,0.2)' : 'rgba(74,137,167,0.2)', color: reg.plan.includes('VIP') ? 'var(--color-accent)' : 'var(--color-bg)', padding: '2px 6px', borderRadius: '4px' }}>
                                    {reg.plan}
                                  </span>
                                  <span>${reg.total_paid || 0} pagado</span>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        )
                      })}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </div>
          </DragDropContext>
        </>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', paddingBottom: '40px' }}>
          
          <div style={cardStyle}>
            <h3 style={cardTitle}>Nivel en Marketing Digital</h3>
            <div style={{ height: '250px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={marketingLevelData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" label>
                    {marketingLevelData.map((e, i) => <Cell key={i} fill={COLORS_SURVEY[i % COLORS_SURVEY.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none' }} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div style={cardStyle}>
            <h3 style={cardTitle}>Nivel en IA</h3>
            <div style={{ height: '250px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={aiLevelData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" label>
                    {aiLevelData.map((e, i) => <Cell key={i} fill={COLORS_SURVEY[i % COLORS_SURVEY.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none' }} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div style={cardStyle}>
            <h3 style={cardTitle}>Nivel en Ventas</h3>
            <div style={{ height: '250px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={salesLevelData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" label>
                    {salesLevelData.map((e, i) => <Cell key={i} fill={COLORS_SURVEY[i % COLORS_SURVEY.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none' }} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div style={{ ...cardStyle, gridColumn: '1 / -1' }}>
            <h3 style={cardTitle}>Meta Principal del Curso</h3>
            <div style={{ height: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mainGoalData} margin={{ left: 0, right: 0, top: 20, bottom: 40 }}>
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} angle={-25} textAnchor="end" interval={0} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none' }} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                  <Bar dataKey="value" fill="var(--color-accent)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div style={{ ...cardStyle, gridColumn: '1 / -1' }}>
            <h3 style={cardTitle}>Mayor Desafío (Lo que más cuesta)</h3>
            <div style={{ height: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mainStruggleData} margin={{ left: 0, right: 0, top: 20, bottom: 40 }}>
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} angle={-25} textAnchor="end" interval={0} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none' }} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                  <Bar dataKey="value" fill="#4a89a7" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      )}

      {/* Add Client Modal */}
      {showAddModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, backdropFilter: 'blur(5px)' }}>
          <div className="responsive-modal" style={{ background: '#f8fafc', padding: '30px', borderRadius: '16px', width: '95%', maxWidth: '500px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', maxHeight: '90vh' }}>
            <h3 style={{ color: '#0f172a', marginBottom: '20px' }}>Añadir Cliente Manual</h3>
            <form onSubmit={handleAddClient} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <input required placeholder="Nombre" value={newClient.name} onChange={e => setNewClient({...newClient, name: e.target.value})} style={{ padding: '10px', borderRadius: '4px', background: '#f8fafc', border: '1px solid #e2e8f0', color: '#0f172a' }} />
              <input type="email" placeholder="Email" value={newClient.email} onChange={e => setNewClient({...newClient, email: e.target.value})} style={{ padding: '10px', borderRadius: '4px', background: '#f8fafc', border: '1px solid #e2e8f0', color: '#0f172a' }} />
              <input placeholder="Teléfono" value={newClient.phone} onChange={e => setNewClient({...newClient, phone: e.target.value})} style={{ padding: '10px', borderRadius: '4px', background: '#f8fafc', border: '1px solid #e2e8f0', color: '#0f172a' }} />
              <div style={{ display: 'flex', gap: '10px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '0.8rem', color: '#64748b' }}>Cumpleaños</label>
                  <input type="date" value={newClient.birthday} onChange={e => setNewClient({...newClient, birthday: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '4px', background: '#f8fafc', border: '1px solid #e2e8f0', color: '#0f172a' }} />
                </div>
              </div>
              <input placeholder="Negocio / Empresa" value={newClient.business} onChange={e => setNewClient({...newClient, business: e.target.value})} style={{ padding: '10px', borderRadius: '4px', background: '#f8fafc', border: '1px solid #e2e8f0', color: '#0f172a' }} />
              {newClient.birthday && getZodiacInfo(newClient.birthday) && (
                <div style={{ background: 'rgba(74, 137, 167, 0.1)', border: '1px solid var(--color-accent)', padding: '12px', borderRadius: '8px' }}>
                  <div style={{ fontWeight: 'bold', color: 'var(--color-bg)', marginBottom: '8px' }}>
                    Signo: {getZodiacInfo(newClient.birthday).sign} | Camino de Vida (Numerología): {getZodiacInfo(newClient.birthday).numerology}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#cbd5e1', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div><strong style={{color: '#64748b'}}>En el Trabajo:</strong> {getZodiacInfo(newClient.birthday).work}</div>
                    <div><strong style={{color: '#64748b'}}>En lo Social:</strong> {getZodiacInfo(newClient.birthday).social}</div>
                    <div><strong style={{color: '#64748b'}}>En lo Interno:</strong> {getZodiacInfo(newClient.birthday).internal}</div>
                    <div><strong style={{color: '#64748b'}}>Con el Dinero:</strong> {getZodiacInfo(newClient.birthday).money}</div>
                    <div><strong style={{color: '#64748b'}}>Con su Familia:</strong> {getZodiacInfo(newClient.birthday).family}</div>
                  </div>
                </div>
              )}
              <div style={{ display: 'flex', gap: '10px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '0.8rem', color: '#64748b' }}>Precio Entrada ($)</label>
                  <input type="number" value={newClient.ticket_price} onChange={e => setNewClient({...newClient, ticket_price: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '4px', background: '#f8fafc', border: '1px solid #e2e8f0', color: '#0f172a' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '0.8rem', color: '#64748b' }}>Etapa</label>
                  <select 
                    value={newClient.purchase_stage} 
                    onChange={e => {
                      const stage = e.target.value;
                      const plan = newClient.plan;
                      let price = newClient.ticket_price;
                      
                      const stageKey = stage.toLowerCase().replace(/ |-/g, '');
                      const priceKey = plan === 'VIP' ? `price_vip_${stageKey}` : `price_general_${stageKey}`;
                      if (settings[priceKey]) {
                        price = settings[priceKey];
                      } else if (stage === 'Pre-venta') {
                        price = plan === 'VIP' ? 120 : 75;
                      }
                      
                      setNewClient({...newClient, purchase_stage: stage, ticket_price: price});
                    }} 
                    style={{ width: '100%', padding: '10px', borderRadius: '4px', background: '#f8fafc', border: '1px solid #e2e8f0', color: '#0f172a' }}
                  >
                    <option value="Pre-venta">Pre-venta</option>
                    <option value="Etapa 1">Etapa 1</option>
                    <option value="Etapa 2">Etapa 2</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '0.8rem', color: '#64748b' }}>Asesor de Ventas</label>
                  <select 
                    value={newClient.agent_id} 
                    onChange={e => setNewClient({...newClient, agent_id: e.target.value})} 
                    style={{ width: '100%', padding: '10px', borderRadius: '4px', background: '#f8fafc', border: '1px solid #e2e8f0', color: '#0f172a' }}
                  >
                    <option value="">Sin Asesor</option>
                    {agents.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '0.8rem', color: '#64748b' }}>Negocio / Empresa</label>
                  <input placeholder="Ej: Agencia" value={newClient.business} onChange={e => setNewClient({...newClient, business: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '4px', background: '#f8fafc', border: '1px solid #e2e8f0', color: '#0f172a' }} />
                </div>
              </div>
              <select 
                value={newClient.plan} 
                onChange={e => {
                  const plan = e.target.value;
                  const stage = newClient.purchase_stage;
                  let price = newClient.ticket_price;
                  
                  const stageKey = stage.toLowerCase().replace(/ |-/g, '');
                  const priceKey = plan === 'VIP' ? `price_vip_${stageKey}` : `price_general_${stageKey}`;
                  if (settings[priceKey]) {
                    price = settings[priceKey];
                  } else if (stage === 'Pre-venta') {
                    price = plan === 'VIP' ? 120 : 75;
                  }
                  
                  setNewClient({...newClient, plan, ticket_price: price});
                }} 
                style={{ padding: '10px', borderRadius: '4px', background: '#f8fafc', border: '1px solid #e2e8f0', color: '#0f172a' }}
              >
                <option value="General">General</option>
                <option value="VIP">VIP</option>
              </select>
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button type="button" onClick={() => setShowAddModal(false)} style={{ flex: 1, padding: '10px', background: '#334155', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Cancelar</button>
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
          initialTab={initialModalTab}
          agents={agents}
          onClose={() => setSelectedClient(null)} 
          onUpdate={(updatedClient) => setRegistrations(regs => regs.map(r => r.id === updatedClient.id ? updatedClient : r))} 
          onDelete={(id) => {
            setRegistrations(regs => regs.filter(r => r.id !== id));
            setSelectedClient(null);
          }}
        />
      )}
    </div>
  );
}

export const getZodiacInfo = (dateStr) => {
  if (!dateStr) return null;
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return null;
  const day = date.getDate();
  const month = date.getMonth() + 1;
  
  const getLifePath = (d) => {
    const sum = (n) => n.toString().split('').reduce((a, b) => parseInt(a) + parseInt(b), 0);
    let total = sum(d.getFullYear()) + sum(d.getMonth() + 1) + sum(d.getDate());
    while (total > 9 && total !== 11 && total !== 22 && total !== 33) {
      total = sum(total);
    }
    return total;
  };
  const lifePath = getLifePath(date);

  const zodiacData = [
    {
      match: (m, d) => (m === 3 && d >= 21) || (m === 4 && d <= 19),
      sign: 'Aries ♈',
      work: 'Líderes innatos, proactivos y competitivos. Prefieren dirigir e iniciar proyectos.',
      social: 'Directos, entusiastas y el alma de la fiesta. Son amigos leales pero impacientes.',
      internal: 'Poseen un fuego interno de valentía, aunque a veces temen el estancamiento o la dependencia.',
      money: 'Excelentes para generar ingresos rápidamente, pero propensos a gastos impulsivos.',
      family: 'Protectores e intensos. Fomentan la independencia en su núcleo familiar.'
    },
    {
      match: (m, d) => (m === 4 && d >= 20) || (m === 5 && d <= 20),
      sign: 'Tauro ♉',
      work: 'Trabajadores incansables, metódicos y sumamente confiables. Buscan estabilidad.',
      social: 'Tranquilos, disfrutan de grupos pequeños y placeres sensoriales (buena comida, arte).',
      internal: 'Valoran profundamente la seguridad. Son resilientes pero muy testarudos ante el cambio.',
      money: 'Excelentes administradores. Acumulan riqueza a paso seguro y evitan riesgos innecesarios.',
      family: 'Proveedores tradicionales, afectuosos y constantes. Buscan crear un hogar confortable.'
    },
    {
      match: (m, d) => (m === 5 && d >= 21) || (m === 6 && d <= 20),
      sign: 'Géminis ♊',
      work: 'Adaptables, excelentes comunicadores y rápidos para aprender. Brillan en multitareas.',
      social: 'Carismáticos, curiosos y muy sociables. Se llevan bien con todo tipo de personas.',
      internal: 'Mente hiperactiva, siempre buscando estímulo intelectual. Pueden sufrir de ansiedad.',
      money: 'Saben hacer dinero con su intelecto y redes, pero sus finanzas pueden fluctuar por aburrimiento.',
      family: 'Divertidos y poco convencionales. Prefieren una relación intelectual y libre con los suyos.'
    },
    {
      match: (m, d) => (m === 6 && d >= 21) || (m === 7 && d <= 22),
      sign: 'Cáncer ♋',
      work: 'Empáticos y cuidadores. Excelentes en recursos humanos, psicología o negocios familiares.',
      social: 'Selectivos. Prefieren reuniones íntimas con personas en las que confían ciegamente.',
      internal: 'Profundamente emocionales e intuitivos. Usan una coraza para proteger su enorme sensibilidad.',
      money: 'Ahorrativos y precavidos. Ven el dinero como seguridad emocional para el futuro.',
      family: 'La familia lo es todo. Son el pilar emocional, extremadamente protectores y maternales/paternales.'
    },
    {
      match: (m, d) => (m === 7 && d >= 23) || (m === 8 && d <= 22),
      sign: 'Leo ♌',
      work: 'Creativos, carismáticos y nacidos para brillar. Destacan en puestos directivos o creativos.',
      social: 'Generosos, magnéticos y anfitriones espectaculares. Les gusta ser el centro de atención.',
      internal: 'Corazón noble y gran orgullo. Necesitan validación y amor constante para sentirse seguros.',
      money: 'Aman el lujo y gastan con generosidad, pero saben cómo atraer abundancia con su confianza.',
      family: 'Defensores feroces de los suyos. Son padres/hijos juguetones, leales y muy orgullosos de su clan.'
    },
    {
      match: (m, d) => (m === 8 && d >= 23) || (m === 9 && d <= 22),
      sign: 'Virgo ♍',
      work: 'Perfeccionistas, analíticos y orientados al servicio. Los mejores para optimizar procesos.',
      social: 'Amables pero reservados. Observan antes de actuar y ofrecen consejos muy prácticos.',
      internal: 'Mente crítica, constantemente buscan mejorar. Pueden ser muy duros consigo mismos.',
      money: 'Austeros y calculadores. Rara vez malgastan; cada centavo tiene un propósito planificado.',
      family: 'Demuestran amor a través del servicio y actos útiles más que con grandes gestos emocionales.'
    },
    {
      match: (m, d) => (m === 9 && d >= 23) || (m === 10 && d <= 22),
      sign: 'Libra ♎',
      work: 'Diplomáticos y excelentes mediadores. Trabajan mejor en equipo y buscan el equilibrio estético.',
      social: 'Encantadores, sociables y evitan el conflicto a toda costa. Son el "pegamento" de su grupo.',
      internal: 'Buscan paz y armonía absoluta. Les cuesta tomar decisiones por miedo a equivocarse.',
      money: 'Gastan en cosas hermosas, diseño y arte. Atraen dinero a través de alianzas y socios.',
      family: 'Conciliadores del hogar. Buscan que todos se lleven bien y el ambiente sea estéticamente pacífico.'
    },
    {
      match: (m, d) => (m === 10 && d >= 23) || (m === 11 && d <= 21),
      sign: 'Escorpio ♏',
      work: 'Estratégicos, intensos y enfocados. Ideales para investigaciones, finanzas o resolver crisis.',
      social: 'Misteriosos y magnéticos. Tienen pocos amigos pero sus lealtades son a muerte.',
      internal: 'Viven en los extremos (todo o nada). Experimentan transformaciones emocionales muy profundas.',
      money: 'Muy instintivos. Tienen capacidad para amasar poder económico y gestionar dinero ajeno.',
      family: 'Extremadamente protectores y celosos de su intimidad. Leen lo que nadie dice en la mesa.'
    },
    {
      match: (m, d) => (m === 11 && d >= 22) || (m === 12 && d <= 21),
      sign: 'Sagitario ♐',
      work: 'Visionarios, optimistas y maestros naturales. Necesitan libertad y odian la rutina.',
      social: 'Aventureros, filosóficos y divertidos. Tienen amigos en cada rincón del mundo.',
      internal: 'Buscadores incansables de la verdad. A veces evaden el dolor mediante el optimismo excesivo.',
      money: 'La suerte suele acompañarlos. Ven el dinero como un pasaje para experiencias, no para acumular.',
      family: 'Inspiradores pero desapegados. Animan a su familia a explorar el mundo y pensar en grande.'
    },
    {
      match: (m, d) => (m === 12 && d >= 22) || (m === 1 && d <= 19),
      sign: 'Capricornio ♑',
      work: 'Ambiciosos, estructurados y responsables. Alcanzan la cima gracias a su disciplina de hierro.',
      social: 'Selectivos y un poco formales. Prefieren contactos que aporten valor a sus objetivos.',
      internal: 'Se exigen demasiado. A veces sienten que cargan el peso del mundo sobre sus hombros.',
      money: 'Excelentes inversores a largo plazo. Respetan el dinero y lo usan para consolidar su estatus.',
      family: 'Los proveedores responsables. Establecen reglas claras y son el ancla de estabilidad familiar.'
    },
    {
      match: (m, d) => (m === 1 && d >= 20) || (m === 2 && d <= 18),
      sign: 'Acuario ♒',
      work: 'Innovadores, originales y tecnológicos. Prefieren trabajar por ideales y causas sociales.',
      social: 'Altruistas, amigables pero desapegados. Aman a la humanidad pero valoran su espacio personal.',
      internal: 'Mentes brillantes que a menudo se sienten incomprendidas. Viven en el futuro.',
      money: 'Impredecibles. Pueden hacerse ricos con ideas disruptivas o desinteresarse por completo del capital.',
      family: 'Padres/Hijos poco convencionales. Promueven la libertad absoluta y el pensamiento crítico.'
    },
    {
      match: (m, d) => (m === 2 && d >= 19) || (m === 3 && d <= 20),
      sign: 'Piscis ♓',
      work: 'Artísticos, sanadores e intuitivos. Destacan en profesiones creativas, espirituales o de ayuda.',
      social: 'Compasivos y empáticos. Tienden a absorber las emociones de quienes los rodean.',
      internal: 'Tienen una conexión mística. Viven entre la fantasía y la realidad; extremadamente soñadores.',
      money: 'Desapegados de lo material. Confían en que el universo proveerá y suelen tener suerte oculta.',
      family: 'Devotos y sacrificados. Conectan con su familia a un nivel espiritual profundo y sin juicios.'
    }
  ];

  const signInfo = zodiacData.find(z => z.match(month, day));
  if (!signInfo) return null;

  return { ...signInfo, numerology: lifePath };
};

// Separate component for the Modal to keep things clean
export function ClientDetailModal({ client, initialTab, onClose, onUpdate, onDelete, hideExtraTabs, agents = [] }) {
  const ticketRef = useRef(null);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [activeTab, setActiveTab] = useState(initialTab || 'info');
  const [agentId, setAgentId] = useState(client.agent_id || '');
  const [business, setBusiness] = useState(client.business || '');
  const [notes, setNotes] = useState(client.notes || '');
  const [status, setStatus] = useState(client.status || 'Nuevo');
  const [birthday, setBirthday] = useState(client.birthday || '');
  const [ticketPrice, setTicketPrice] = useState(client.ticket_price || 0);
  const [purchaseStage, setPurchaseStage] = useState(client.purchase_stage || 'Pre-venta');
  const [isEditingPrice, setIsEditingPrice] = useState(false);
  
  // Payment States
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Transferencia');
  const [paymentBank, setPaymentBank] = useState('');
  const [paymentReference, setPaymentReference] = useState('');
  const [editingPayment, setEditingPayment] = useState(null);

  const [reminderDesc, setReminderDesc] = useState('');
  const [reminderDate, setReminderDate] = useState('');

  const [payments, setPayments] = useState([]);
  const [reminders, setReminders] = useState([]);

  useEffect(() => {
    fetch(`/api/admin/payments?client_id=${client.id}`).then(r => r.json()).then(setPayments);
    fetch(`/api/admin/reminders?client_id=${client.id}`).then(r => r.json()).then(setReminders);
  }, [client.id]);

  const saveDetails = async () => {
    await fetch('/api/admin/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: client.id, business, notes, status, birthday, ticket_price: ticketPrice, agent_id: agentId })
    });
    onUpdate({ ...client, business, notes, status, birthday, ticket_price: ticketPrice, agent_id: agentId });
    alert('Guardado');
  };

  const savePayment = async (e) => {
    e.preventDefault();
    if (editingPayment) {
      const res = await fetch('/api/admin/payments', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingPayment.id,
          amount: parseFloat(paymentAmount),
          date: new Date().toISOString(),
          method: paymentMethod,
          bank: paymentBank,
          reference: paymentReference
        })
      });
      const data = await res.json();
      if (data.success) {
        const newTotalPaid = (client.total_paid || 0) + data.diff;
        const updatedClient = { ...client, total_paid: newTotalPaid };

        if (newTotalPaid >= (client.ticket_price || 0) && client.status !== 'Completado') {
          updatedClient.status = 'Completado';
          await fetch('/api/admin/update', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              id: client.id, 
              status: 'Completado',
              business: client.business,
              notes: client.notes,
              birthday: client.birthday,
              ticket_price: client.ticket_price
            })
          });
        }

        onUpdate(updatedClient);
        setEditingPayment(null);
        setPaymentAmount('');
        setPaymentBank('');
        setPaymentReference('');
        fetch(`/api/admin/payments?client_id=${client.id}`).then(r => r.json()).then(setPayments);
      }
    } else {
      await fetch('/api/admin/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_id: client.id,
          amount: parseFloat(paymentAmount),
          date: new Date().toISOString(),
          method: paymentMethod,
          bank: paymentBank,
          reference: paymentReference
        })
      });
      const newTotalPaid = (client.total_paid || 0) + parseFloat(paymentAmount);
      const updatedClient = { ...client, total_paid: newTotalPaid };

      if (newTotalPaid >= (client.ticket_price || 0) && client.status !== 'Completado') {
        updatedClient.status = 'Completado';
        await fetch('/api/admin/update', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            id: client.id, 
            status: 'Completado',
            business: client.business,
            notes: client.notes,
            birthday: client.birthday,
            ticket_price: client.ticket_price
          })
        });
      }

      onUpdate(updatedClient);
      setPaymentAmount('');
      setPaymentBank('');
      setPaymentReference('');
      fetch(`/api/admin/payments?client_id=${client.id}`).then(r => r.json()).then(setPayments);
    }
  };

  const deleteContact = async () => {
    if (!confirm('¿Estás SEGURO de que deseas eliminar este contacto y todos sus pagos y recordatorios? Esta acción no se puede deshacer.')) return;
    try {
      const res = await fetch(`/api/admin/contacts?id=${client.id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        if (onDelete) onDelete(client.id);
      } else {
        alert('Error: ' + data.error);
      }
    } catch (err) {
      console.error(err);
      alert('Error al eliminar');
    }
  };

  const deletePayment = async (p) => {
    if (!confirm('¿Seguro que deseas ANULAR este pago? Quedará en el historial.')) return;
    try {
      const res = await fetch(`/api/admin/payments?id=${p.id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setPayments(prev => prev.map(payment => payment.id === p.id ? { ...payment, status: data.newStatus, history: data.newHistory } : payment));
        onUpdate({ ...client, total_paid: (client.total_paid || 0) - data.removedAmount });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const addReminder = async (e) => {
    e.preventDefault();
    await fetch('/api/admin/reminders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ client_id: client.id, description: reminderDesc, date: reminderDate })
    });
    setReminderDesc('');
    setReminderDate('');
    fetch(`/api/admin/reminders?client_id=${client.id}`).then(r => r.json()).then(setReminders);
  };

  const toggleReminder = async (rem) => {
    const newCompleted = rem.completed ? 0 : 1;
    await fetch('/api/admin/reminders', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: rem.id, completed: newCompleted })
    });
    setReminders(reminders.map(r => r.id === rem.id ? { ...r, completed: newCompleted } : r));
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-end', zIndex: 100 }}>
      <div style={{ background: '#f8fafc', width: '95%', maxWidth: '500px', height: '100%', padding: '30px', overflowY: 'auto', borderLeft: '1px solid #e2e8f0', animation: 'slideIn 0.3s forwards' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <h2 style={{ color: '#0f172a', margin: 0 }}>{client.name}</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', background: 'rgba(255,255,255,0.1)', padding: '4px 10px', borderRadius: '20px' }}>
              <span style={{ color: '#e6b85c', fontWeight: 'bold' }}>$</span>
              {isEditingPrice ? (
                <input 
                  autoFocus
                  type="number" 
                  value={ticketPrice} 
                  onChange={e => setTicketPrice(e.target.value)} 
                  onBlur={() => { setIsEditingPrice(false); saveDetails(); }}
                  onKeyDown={(e) => { if(e.key === 'Enter') { setIsEditingPrice(false); saveDetails(); } }}
                  style={{ width: '60px', background: 'transparent', border: 'none', color: '#0f172a', borderBottom: '1px solid #e6b85c', outline: 'none' }} 
                />
              ) : (
                <>
                  <span style={{ color: '#0f172a', fontWeight: 'bold' }}>{ticketPrice}</span>
                  <button onClick={() => setIsEditingPrice(true)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: '0 0 0 5px', fontSize: '0.8rem' }}>✏️</button>
                </>
              )}
            </div>
          </div>
          <div style={{ display: 'flex', gap: '15px' }}>
            <button onClick={deleteContact} style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid #ef4444', borderRadius: '8px', cursor: 'pointer', padding: '6px 12px', fontWeight: 'bold' }}>🗑️ Eliminar</button>
            <button onClick={onClose} style={{ background: 'transparent', color: '#0f172a', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>×</button>
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px', flexWrap: 'wrap' }}>
          <button onClick={() => setActiveTab('info')} style={{ background: 'transparent', color: activeTab==='info'?'var(--color-accent)':'#94a3b8', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>Info</button>
          <button onClick={() => setActiveTab('survey')} style={{ background: 'transparent', color: activeTab==='survey'?'var(--color-accent)':'#94a3b8', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>Encuesta</button>
          <button onClick={() => setActiveTab('ticket')} style={{ background: 'transparent', color: activeTab==='ticket'?'var(--color-accent)':'#94a3b8', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>Entrada</button>
          {!hideExtraTabs && <button onClick={() => setActiveTab('payments')} style={{ background: 'transparent', color: activeTab==='payments'?'var(--color-accent)':'#94a3b8', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>Pagos</button>}
          {!hideExtraTabs && <button onClick={() => setActiveTab('reminders')} style={{ background: 'transparent', color: activeTab==='reminders'?'var(--color-accent)':'#94a3b8', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>Recordatorios</button>}
        </div>

        {activeTab === 'info' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div><strong style={{ color: '#64748b' }}>Email:</strong> <div style={{ color: '#0f172a' }}>{client.email}</div></div>
            <div><strong style={{ color: '#64748b' }}>Teléfono:</strong> <div style={{ color: '#0f172a' }}>{client.phone}</div></div>
            <div><strong style={{ color: '#64748b' }}>Plan:</strong> <div style={{ color: 'var(--color-accent)' }}>{client.plan}</div></div>
            <div><strong style={{ color: '#64748b' }}>Registrado:</strong> <div style={{ color: '#0f172a' }}>{new Date(client.createdAt).toLocaleDateString()}</div></div>
            
            <div>
              <strong style={{ color: '#64748b' }}>Cumpleaños:</strong>
              <input type="date" value={birthday} onChange={e=>setBirthday(e.target.value)} style={{ width: '100%', padding: '8px', background: '#ffffff', border: '1px solid #e2e8f0', color: '#0f172a', borderRadius: '4px', marginTop: '4px' }} />
            </div>

            <div>
              <strong style={{ color: '#64748b' }}>Estado (Etiqueta Kanban):</strong>
              <select value={status} onChange={e=>setStatus(e.target.value)} style={{ width: '100%', padding: '8px', background: '#ffffff', border: '1px solid #e2e8f0', color: '#0f172a', borderRadius: '4px', marginTop: '4px' }}>
                {COLUMNS.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
              </select>
            </div>

            <div>
              <strong style={{ color: '#64748b' }}>Etapa de Compra:</strong>
              <div style={{ color: '#0f172a' }}>{purchaseStage}</div>
            </div>

            <div>
              <strong style={{ color: '#64748b' }}>Tipo de Negocio:</strong>
              <input value={business} onChange={e=>setBusiness(e.target.value)} placeholder="Ej. Agencia de Marketing" style={{ width: '100%', padding: '8px', background: '#ffffff', border: '1px solid #e2e8f0', color: '#0f172a', borderRadius: '4px', marginTop: '4px' }} />
            </div>

            <div>
              <strong style={{ color: '#64748b' }}>Asesor de Ventas:</strong>
              <select value={agentId} onChange={e=>setAgentId(e.target.value)} style={{ width: '100%', padding: '8px', background: '#ffffff', border: '1px solid #e2e8f0', color: '#0f172a', borderRadius: '4px', marginTop: '4px' }}>
                <option value="">Sin Asesor</option>
                {agents.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
              </select>
            </div>

            {birthday && getZodiacInfo(birthday) && (
              <div style={{ background: 'rgba(74, 137, 167, 0.1)', border: '1px solid var(--color-accent)', padding: '12px', borderRadius: '8px', marginTop: '10px' }}>
                <div style={{ fontWeight: 'bold', color: 'var(--color-bg)', marginBottom: '8px' }}>
                  Signo: {getZodiacInfo(birthday).sign} | Camino de Vida (Numerología): {getZodiacInfo(birthday).numerology}
                </div>
                <div style={{ fontSize: '0.85rem', color: '#334155', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div><strong style={{color: '#64748b'}}>En el Trabajo:</strong> {getZodiacInfo(birthday).work}</div>
                  <div><strong style={{color: '#64748b'}}>En lo Social:</strong> {getZodiacInfo(birthday).social}</div>
                  <div><strong style={{color: '#64748b'}}>En lo Interno:</strong> {getZodiacInfo(birthday).internal}</div>
                  <div><strong style={{color: '#64748b'}}>Con el Dinero:</strong> {getZodiacInfo(birthday).money}</div>
                  <div><strong style={{color: '#64748b'}}>Con su Familia:</strong> {getZodiacInfo(birthday).family}</div>
                </div>
              </div>
            )}
            
            <div>
              <strong style={{ color: '#64748b' }}>Notas Internas:</strong>
              <textarea value={notes} onChange={e=>setNotes(e.target.value)} rows="4" style={{ width: '100%', padding: '8px', background: '#ffffff', border: '1px solid #e2e8f0', color: '#0f172a', borderRadius: '4px', marginTop: '4px' }} />
            </div>
            
            <button onClick={saveDetails} style={{ background: '#334155', color: '#fff', border: 'none', padding: '10px', borderRadius: '4px', cursor: 'pointer' }}>Guardar Cambios</button>
          </div>
        )}

        {activeTab === 'survey' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h3 style={{ fontSize: '1.2rem', color: '#0f172a', margin: 0, borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>Perfil Profesional</h3>
            
            <div><strong style={{ color: '#64748b' }}>Ocupación:</strong> <div style={{ color: '#0f172a', marginTop: '4px' }}>{client.occupation || 'No especificada'}</div></div>
            <div><strong style={{ color: '#64748b' }}>Tipo de Negocio:</strong> <div style={{ color: '#0f172a', marginTop: '4px' }}>{client.has_business || 'No especificado'}</div></div>
            {client.business_details && (
              <div><strong style={{ color: '#64748b' }}>Detalles del Negocio:</strong> <div style={{ color: '#cbd5e1', marginTop: '4px', fontStyle: 'italic' }}>&quot;{client.business_details}&quot;</div></div>
            )}
            <div><strong style={{ color: '#64748b' }}>Redes Sociales:</strong> <div style={{ color: 'var(--color-accent)', marginTop: '4px' }}>{client.social_media || 'No especificadas'}</div></div>
            <div><strong style={{ color: '#64748b' }}>Lo que Vende:</strong> <div style={{ color: '#0f172a', marginTop: '4px' }}>{client.sales_type || 'No especificado'}</div></div>

            <h3 style={{ fontSize: '1.2rem', color: '#0f172a', margin: '10px 0 0', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>Metas y Desafíos</h3>
            <div><strong style={{ color: '#64748b' }}>Principal Meta:</strong> <div style={{ color: '#10b981', marginTop: '4px', fontWeight: 'bold' }}>{client.main_goal || 'No especificada'}</div></div>
            <div><strong style={{ color: '#64748b' }}>Mayor Desafío:</strong> <div style={{ color: '#ef4444', marginTop: '4px', fontWeight: 'bold' }}>{client.main_struggle || 'No especificado'}</div></div>

            <h3 style={{ fontSize: '1.2rem', color: '#0f172a', margin: '10px 0 0', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>Nivel de Conocimientos</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div style={{ background: '#ffffff', padding: '10px', borderRadius: '8px' }}>
                <div style={{ color: '#64748b', fontSize: '0.8rem' }}>Marketing Digital</div>
                <div style={{ color: '#0f172a', fontWeight: 'bold', marginTop: '4px' }}>{client.marketing_level || 'N/A'}</div>
              </div>
              <div style={{ background: '#ffffff', padding: '10px', borderRadius: '8px' }}>
                <div style={{ color: '#64748b', fontSize: '0.8rem' }}>Inteligencia Artificial</div>
                <div style={{ color: '#0f172a', fontWeight: 'bold', marginTop: '4px' }}>{client.ai_level || 'N/A'}</div>
              </div>
              <div style={{ background: '#ffffff', padding: '10px', borderRadius: '8px', gridColumn: '1 / -1' }}>
                <div style={{ color: '#64748b', fontSize: '0.8rem' }}>Ventas</div>
                <div style={{ color: '#0f172a', fontWeight: 'bold', marginTop: '4px' }}>{client.sales_level || 'N/A'}</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'ticket' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center' }}>
            
            <div 
              ref={ticketRef}
              style={{ 
                width: '100%', 
                maxWidth: '350px', 
                background: client.plan.includes('VIP') ? 'linear-gradient(135deg, #1e293b, #0f172a)' : '#0f172a', 
                border: `2px solid ${client.plan.includes('VIP') ? '#c19845' : '#4a89a7'}`, 
                borderRadius: '16px', 
                overflow: 'hidden', 
                color: '#fff',
                fontFamily: 'Arial, sans-serif'
              }}
            >
              <div style={{ background: client.plan.includes('VIP') ? '#c19845' : '#4a89a7', padding: '15px', textAlign: 'center', fontWeight: 'bold', fontSize: '1.2rem' }}>
                Marketing Xperience
              </div>
              <div style={{ padding: '20px', textAlign: 'center' }}>
                <h3 style={{ margin: '0 0 5px 0', fontSize: '1.4rem' }}>{client.name}</h3>
                <p style={{ margin: '0 0 20px 0', color: '#94a3b8', fontSize: '0.9rem' }}>{client.plan.split('(')[0].trim().toUpperCase()}</p>
                
                <div style={{ background: '#fff', padding: '15px', display: 'inline-block', borderRadius: '12px' }}>
                  <QRCodeSVG 
                    value={`${window.location.origin}/ticket/${client.ticket_id}`} 
                    size={150}
                  />
                </div>
                
                <div style={{ marginTop: '20px', fontSize: '0.8rem', color: '#64748b', fontFamily: 'monospace' }}>
                  ID: {client.ticket_id}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', width: '100%' }}>
              <button 
                onClick={async () => {
                  if (ticketRef.current) {
                    const dataUrl = await htmlToImage.toPng(ticketRef.current);
                    const link = document.createElement('a');
                    link.download = `Entrada_${client.name.replace(/\s+/g, '_')}.png`;
                    link.href = dataUrl;
                    link.click();
                  }
                }}
                style={{ flex: 1, padding: '12px', background: 'var(--color-bg)', border: '1px solid var(--color-accent)', color: 'var(--color-accent)', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                ⬇️ Descargar
              </button>

              <button 
                disabled={sendingEmail}
                onClick={async () => {
                  setSendingEmail(true);
                  try {
                    const res = await fetch('/api/admin/ticket/send', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ id: client.id })
                    });
                    const data = await res.json();
                    if (data.success) {
                      alert('Correo enviado exitosamente.');
                    } else {
                      alert('Error: ' + data.error);
                    }
                  } catch(e) {
                    alert('Error al enviar correo.');
                  }
                  setSendingEmail(false);
                }}
                style={{ flex: 1, padding: '12px', background: 'var(--color-accent)', border: 'none', color: '#fff', borderRadius: '8px', cursor: sendingEmail ? 'not-allowed' : 'pointer', fontWeight: 'bold', opacity: sendingEmail ? 0.7 : 1 }}
              >
                {sendingEmail ? 'Enviando...' : '📧 Enviar por Correo'}
              </button>
            </div>
            
          </div>
        )}

        {activeTab === 'payments' && (
          <div>
            <div style={{ background: '#ffffff', padding: '16px', borderRadius: '8px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ color: '#64748b' }}>Total Pagado</div>
                <div style={{ fontSize: '2rem', color: '#4ade80', fontWeight: 'bold' }}>${client.total_paid || 0}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ color: '#64748b' }}>Costo Entrada: ${ticketPrice}</div>
                {((client.total_paid || 0) >= ticketPrice && ticketPrice > 0) ? (
                  <div style={{ marginTop: '5px', padding: '4px 10px', background: 'rgba(74, 222, 128, 0.2)', color: '#4ade80', borderRadius: '20px', fontWeight: 'bold', display: 'inline-block', fontSize: '0.9rem' }}>
                    ✅ Pago completado
                  </div>
                ) : (
                  <div style={{ marginTop: '5px', color: '#ef4444', fontWeight: 'bold', fontSize: '1.1rem' }}>
                    Falta: ${Math.max(0, ticketPrice - (client.total_paid || 0))}
                  </div>
                )}
              </div>
            </div>

            <form onSubmit={savePayment} style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px', background: '#ffffff', padding: '16px', borderRadius: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h4 style={{ margin: 0, color: '#0f172a' }}>{editingPayment ? 'Editar Pago' : 'Registrar Pago'}</h4>
                {editingPayment && (
                  <button type="button" onClick={() => {
                    setEditingPayment(null);
                    setPaymentAmount('');
                    setPaymentBank('');
                    setPaymentReference('');
                    setPaymentMethod('Transferencia');
                  }} style={{ background: 'transparent', color: '#64748b', border: 'none', cursor: 'pointer', fontSize: '0.8rem' }}>Cancelar</button>
                )}
              </div>
              
              <input type="number" required placeholder="Monto $" value={paymentAmount} onChange={e=>setPaymentAmount(e.target.value)} style={{ padding: '8px', background: '#f8fafc', border: '1px solid #e2e8f0', color: '#0f172a', borderRadius: '4px' }} />
              
              <select required value={paymentMethod} onChange={e=>setPaymentMethod(e.target.value)} style={{ padding: '8px', background: '#f8fafc', border: '1px solid #e2e8f0', color: '#0f172a', borderRadius: '4px' }}>
                <option value="Transferencia">Transferencia</option>
                <option value="Pago móvil">Pago móvil</option>
                <option value="Binance">Binance</option>
                <option value="Efectivo $">Efectivo $</option>
                <option value="Zelle">Zelle</option>
                <option value="Tarjeta de débito">Tarjeta de débito</option>
                <option value="Tarjeta de crédito">Tarjeta de crédito</option>
              </select>

              {(paymentMethod === 'Transferencia' || paymentMethod === 'Pago móvil') && (
                <select value={paymentBank} onChange={e=>setPaymentBank(e.target.value)} style={{ padding: '8px', background: '#f8fafc', border: '1px solid #e2e8f0', color: '#0f172a', borderRadius: '4px' }}>
                  <option value="">Seleccionar Banco (Opcional)</option>
                  <option value="Provincial">Provincial</option>
                  <option value="Mercantil">Mercantil</option>
                  <option value="Venezuela">Venezuela</option>
                  <option value="Banesco">Banesco</option>
                  <option value="Otro">Otro</option>
                </select>
              )}

              <input type="text" placeholder="Nro de referencia (Opcional)" value={paymentReference} onChange={e=>setPaymentReference(e.target.value)} style={{ padding: '8px', background: '#f8fafc', border: '1px solid #e2e8f0', color: '#0f172a', borderRadius: '4px' }} />
              
              <button type="submit" style={{ background: editingPayment ? 'var(--color-accent)' : '#4ade80', color: editingPayment ? '#fff' : '#000', border: 'none', padding: '8px 16px', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }}>
                {editingPayment ? 'Guardar Cambios' : 'Añadir Pago'}
              </button>
            </form>

            <h3 style={{ fontSize: '1rem', color: '#0f172a', marginBottom: '10px' }}>Historial</h3>
            {payments.map(p => (
              <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', borderBottom: '1px solid #e2e8f0', color: p.status === 'Anulado' ? '#64748b' : '#0f172a', alignItems: 'center', opacity: p.status === 'Anulado' ? 0.7 : 1 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 'bold', fontSize: '1.1rem', textDecoration: p.status === 'Anulado' ? 'line-through' : 'none' }}>
                    ${p.amount} {p.status === 'Anulado' && <span style={{ color: '#ef4444', fontSize: '0.8rem', marginLeft: '5px', border: '1px solid #ef4444', padding: '2px 6px', borderRadius: '12px' }}>ANULADO</span>}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: p.status === 'Anulado' ? '#64748b' : '#94a3b8' }}>
                    {p.method} {p.bank ? `(${p.bank})` : ''} 
                    {p.reference ? ` - Ref: ${p.reference}` : ''}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{new Date(p.date).toLocaleString()}</div>
                  {p.history && (
                    <div style={{ fontSize: '0.75rem', color: '#eab308', marginTop: '6px', fontStyle: 'italic', background: 'rgba(234, 179, 8, 0.1)', padding: '6px', borderRadius: '4px' }}>
                      <span style={{ fontWeight: 'bold' }}>Historial:</span> {p.history}
                    </div>
                  )}
                </div>
                {p.status !== 'Anulado' && (
                  <div style={{ display: 'flex', gap: '5px', marginLeft: '10px' }}>
                    <button onClick={() => {
                      setEditingPayment(p);
                      setPaymentAmount(p.amount);
                      setPaymentMethod(p.method || 'Transferencia');
                      setPaymentBank(p.bank || '');
                      setPaymentReference(p.reference || '');
                    }} style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '1.2rem' }} title="Editar">✏️</button>
                    <button onClick={() => deletePayment(p)} style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '1.2rem' }} title="Anular">🗑️</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'reminders' && (
          <div>
            <form onSubmit={addReminder} style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
              <input type="date" required value={reminderDate} onChange={e=>setReminderDate(e.target.value)} style={{ padding: '8px', background: '#ffffff', border: '1px solid #e2e8f0', color: '#0f172a', borderRadius: '4px' }} />
              <input required placeholder="Descripción del recordatorio" value={reminderDesc} onChange={e=>setReminderDesc(e.target.value)} style={{ padding: '8px', background: '#ffffff', border: '1px solid #e2e8f0', color: '#0f172a', borderRadius: '4px' }} />
              <button type="submit" style={{ background: 'var(--color-bg)', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>Programar</button>
            </form>

            <h3 style={{ fontSize: '1rem', color: '#0f172a', marginBottom: '10px' }}>Próximos</h3>
            {reminders.map(r => (
              <div key={r.id} style={{ padding: '10px', background: '#ffffff', borderRadius: '6px', marginBottom: '10px', borderLeft: '3px solid var(--color-bg)', display: 'flex', alignItems: 'flex-start', gap: '10px', opacity: r.completed ? 0.6 : 1 }}>
                <input 
                  type="checkbox" 
                  checked={r.completed === 1} 
                  onChange={() => toggleReminder(r)} 
                  style={{ cursor: 'pointer', marginTop: '4px', transform: 'scale(1.2)' }} 
                  title="Marcar como completado"
                />
                <div style={{ flex: 1, textDecoration: r.completed ? 'line-through' : 'none' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-bg)', fontWeight: 'bold', marginBottom: '4px' }}>{new Date(r.date).toLocaleDateString()}</div>
                  <div style={{ color: '#0f172a', fontSize: '0.9rem' }}>{r.description}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
