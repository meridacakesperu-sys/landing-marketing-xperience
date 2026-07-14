"use client";

import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';

export default function DashboardClient({ registrations, unconvertedLeads = 0, agents = [] }) {
  // --- Data Processing ---
  
  // 1. Registrations over time (Area Chart)
  const regsByDateMap = {};
  // Create an array of the last 14 days
  for (let i = 13; i >= 0; i--) {
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

  // 2. VIP vs General (Donut Chart)
  const totalVIP = registrations.filter(r => r.plan.includes('VIP')).length;
  const totalGeneral = registrations.length - totalVIP;
  const pieData = [
    { name: 'VIP', value: totalVIP },
    { name: 'General', value: totalGeneral }
  ];
  const COLORS = ['#c19845', '#4a89a7']; // Gold, Blue

  // 3. Status Distribution (Bar Chart)
  const statusCounts = { Nuevo: 0, Contactado: 0, Pagado: 0, Cancelado: 0 };
  registrations.forEach(r => {
    if (statusCounts[r.status] !== undefined) statusCounts[r.status] += 1;
  });
  const barData = Object.keys(statusCounts).map(status => ({ status, count: statusCounts[status] }));

  // 4. Revenue Calculation
  const actualRevenue = registrations.reduce((acc, r) => acc + (r.total_paid || 0), 0);

  // 5. Conversion Rate
  const validRegistrations = registrations.filter(r => r.status !== 'Invitado');
  const totalConversions = validRegistrations.length;
  const totalLeads = unconvertedLeads; // Todos los leads (recordatorios sin cliente asociado)
  const conversionRate = totalLeads > 0 ? ((totalConversions / totalLeads) * 100).toFixed(1) : 0;

  // 6. Agent Metrics
  const agentMetrics = agents.map(agent => {
    const agentRegs = validRegistrations.filter(r => r.agent_id === agent.id);
    const agentSalesCount = agentRegs.length;
    const agentRevenue = agentRegs.reduce((acc, r) => acc + (r.total_paid || 0), 0);
    return { name: agent.name, sales: agentSalesCount, revenue: agentRevenue };
  });

  // --- Styles ---
  const cardStyle = { background: '#ffffff', borderRadius: '12px', padding: '24px', border: '1px solid #e2e8f0' };
  const cardTitle = { fontSize: '1.1rem', fontWeight: '600', color: '#0f172a', marginBottom: '8px' };
  const cardSubtitle = { fontSize: '0.8rem', color: '#64748b', marginBottom: '24px' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Top Row: Area Chart & Donut Chart */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        
        {/* Area Chart */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h3 style={cardTitle}>Registros en el Tiempo</h3>
              <p style={cardSubtitle}>Últimos 14 días</p>
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--color-accent)' }}>
              {registrations.length} Total
            </div>
          </div>
          
          <div style={{ width: '100%', height: '250px' }}>
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
                <Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px' }} itemStyle={{ color: '#0f172a' }} />
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
                <Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px' }} itemStyle={{ color: '#0f172a' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '10px' }}>
            <div style={{ border: '1px solid #e2e8f0', padding: '10px', borderRadius: '8px' }}>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>VIP</div>
              <div style={{ fontWeight: 'bold', color: COLORS[0] }}>{totalVIP} <span style={{ fontSize: '0.7rem', color: '#64748b' }}>/ {registrations.length}</span></div>
            </div>
            <div style={{ border: '1px solid #e2e8f0', padding: '10px', borderRadius: '8px' }}>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>General</div>
              <div style={{ fontWeight: 'bold', color: COLORS[1] }}>{totalGeneral} <span style={{ fontSize: '0.7rem', color: '#64748b' }}>/ {registrations.length}</span></div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1.5fr', gap: '24px' }}>
        
        {/* Simple Revenue Card */}
        <div style={cardStyle}>
          <h3 style={cardTitle}>Ingreso Neto</h3>
          <p style={cardSubtitle}>Basado en pagos reales</p>
          <div style={{ height: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ fontSize: '3rem', fontWeight: 'bold', color: '#4a89a7', textShadow: '0 0 20px rgba(74, 137, 167, 0.2)' }}>
              ${actualRevenue}
            </div>
          </div>
        </div>

        {/* Conversion Rate Card */}
        <div style={cardStyle}>
          <h3 style={cardTitle}>Tasa de Conversión</h3>
          <p style={cardSubtitle}>Leads vs Contactos</p>
          <div style={{ height: '150px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--color-accent)' }}>
              {conversionRate}%
            </div>
            <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '10px' }}>
              {totalConversions} contactos de {totalLeads} leads
            </div>
          </div>
        </div>

        {/* Status Bar Chart */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h3 style={cardTitle}>Estado de CRM</h3>
              <p style={cardSubtitle}>Embudo de ventas</p>
            </div>
          </div>
          <div style={{ width: '100%', height: '150px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <XAxis dataKey="status" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip cursor={{ fill: 'rgba(0,0,0,0.05)' }} contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px' }} itemStyle={{ color: '#0f172a' }} />
                <Bar dataKey="count" fill="#4a89a7" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Small Contacts Table */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={cardTitle}>Últimos Contactos</h3>
            <a href="/admin/contacts" style={{ fontSize: '0.8rem', color: 'var(--color-primary)', textDecoration: 'none' }}>Ver todos</a>
          </div>
          
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {registrations.slice(0, 5).map(r => (
              <li key={r.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '12px', borderBottom: '1px solid #e2e8f0' }}>
                <div>
                  <div style={{ fontWeight: 'bold', color: '#0f172a' }}>{r.name}</div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{r.plan} - {new Date(r.createdAt).toLocaleDateString()}</div>
                </div>
                <div style={{ fontSize: '0.8rem', background: 'rgba(230, 184, 92, 0.1)', color: '#c19845', padding: '4px 8px', borderRadius: '12px', fontWeight: 'bold' }}>
                  {r.status}
                </div>
              </li>
            ))}
            {registrations.length === 0 && <li style={{ color: '#64748b', fontSize: '0.8rem' }}>No hay registros.</li>}
          </ul>
        </div>

      </div>

      {/* Sales Team Metrics Row */}
      {agents.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
          <div style={cardStyle}>
            <h3 style={cardTitle}>Métricas por Asesor</h3>
            <p style={cardSubtitle}>Rendimiento del equipo de ventas</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '16px' }}>
              {agentMetrics.map((am, i) => (
                <div key={i} style={{ padding: '16px', border: '1px solid #e2e8f0', borderRadius: '8px', background: '#f8fafc' }}>
                  <div style={{ fontWeight: 'bold', fontSize: '1.1rem', color: '#0f172a', marginBottom: '8px' }}>{am.name}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b', fontSize: '0.9rem' }}>
                    <span>Ventas cerradas:</span>
                    <span style={{ fontWeight: 'bold', color: '#0f172a' }}>{am.sales}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b', fontSize: '0.9rem', marginTop: '4px' }}>
                    <span>Ingreso generado:</span>
                    <span style={{ fontWeight: 'bold', color: '#4a89a7' }}>${am.revenue}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
