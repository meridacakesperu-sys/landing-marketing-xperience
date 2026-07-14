"use client";

import { useState, useEffect, useRef } from 'react';

export default function CheckinClient({ initialData, tables = [] }) {
  const [clients, setClients] = useState(initialData);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null); // { type: 'success'|'error'|'pending', message, client }
  const [paymentMethod, setPaymentMethod] = useState('Efectivo (Puerta)');
  const [paymentAmount, setPaymentAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  // New Registration State
  const [showNewModal, setShowNewModal] = useState(false);
  const [newClient, setNewClient] = useState({ name: '', email: '', phone: '', birthday: '', plan: 'General', table_id: '' });
  const [isRegistering, setIsRegistering] = useState(false);
  const [activeTab, setActiveTab] = useState('general'); // general, ingresados, faltantes, taquilla
  const [taquillaPayments, setTaquillaPayments] = useState([]);
  const [loadingPayments, setLoadingPayments] = useState(false);
  const scannerRef = useRef(null);

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.phone && c.phone.includes(searchQuery)) ||
    (c.ticket_id && c.ticket_id.includes(searchQuery)) ||
    c.plan.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    if (isScanning) {
      import('html5-qrcode').then(({ Html5QrcodeScanner }) => {
        const scanner = new Html5QrcodeScanner(
          "qr-reader",
          { fps: 10, qrbox: { width: 250, height: 250 } },
          false
        );

        scanner.render((decodedText) => {
          scanner.clear();
          setIsScanning(false);
          handleScan(decodedText);
        }, (error) => {
          // Ignorar errores de frame para no spam
        });

        scannerRef.current = scanner;
      });

      return () => {
        if (scannerRef.current) {
          scannerRef.current.clear().catch(e => console.error("Failed to clear scanner", e));
        }
      };
    }
  }, [isScanning]);

  useEffect(() => {
    if (activeTab === 'taquilla') {
      setLoadingPayments(true);
      fetch('/api/admin/payments', { cache: 'no-store' })
        .then(res => res.json())
        .then(data => {
           const doorPayments = data.filter(p => p.bank === 'Taquilla/Puerta' || p.reference === 'Check-in');
           setTaquillaPayments(doorPayments);
           setLoadingPayments(false);
        }).catch(e => {
           console.error(e);
           setLoadingPayments(false);
        });
    }
  }, [activeTab]);

  const handleScan = (text) => {
    let ticketId = text;
    if (text.includes('/ticket/')) {
      ticketId = text.split('/ticket/')[1].split('/')[0];
    }
    
    const client = clients.find(c => c.ticket_id === ticketId);
    
    if (!client) {
      setScanResult({ type: 'error', message: 'Entrada Inválida' });
      return;
    }

    if (client.status === 'Completado') {
      setScanResult({ type: 'success', message: 'ACCESO PERMITIDO', client });
      markAttendance(client.ticket_id, 1);
    } else {
      const owed = (client.ticket_price || 0) - (client.total_paid || 0);
      setPaymentAmount(owed > 0 ? owed.toString() : '');
      setScanResult({ type: 'pending', message: 'PAGO PENDIENTE', client });
    }
  };

  const markAttendance = async (ticket_id, attended, newStatus = null, newTotalPaid = null) => {
    await fetch('/api/admin/checkin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ticket_id, attended })
    });
    
    setClients(clients.map(c => {
      if (c.ticket_id === ticket_id) {
        return { ...c, attended, status: newStatus || c.status, total_paid: newTotalPaid !== null ? newTotalPaid : c.total_paid };
      }
      return c;
    }));

    if (scanResult && scanResult.client?.ticket_id === ticket_id) {
       setScanResult({ ...scanResult, client: { ...scanResult.client, attended, status: newStatus || scanResult.client.status, total_paid: newTotalPaid !== null ? newTotalPaid : scanResult.client.total_paid } });
    }
  };

  const updateTable = async (clientId, tableId) => {
    try {
      await fetch('/api/admin/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: clientId, table_id: tableId || null })
      });
      const tableName = tableId ? tables.find(t => t.id === Number(tableId))?.name : null;
      setClients(clients.map(c => c.id === clientId ? { ...c, table_id: tableId || null, table_name: tableName } : c));
      if (scanResult && scanResult.client?.id === clientId) {
         setScanResult({ ...scanResult, client: { ...scanResult.client, table_id: tableId || null, table_name: tableName } });
      }
    } catch(e) { console.error(e); }
  };

  const handlePaymentAndCheckin = async (client) => {
    if (isProcessing) return;
    setIsProcessing(true);
    
    const amountToPay = parseFloat(paymentAmount) || 0;
    
    try {
      if (amountToPay > 0) {
        // Register payment
        await fetch('/api/admin/payments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            client_id: client.id,
            amount: amountToPay,
            date: new Date().toISOString(),
            method: paymentMethod,
            bank: 'Taquilla/Puerta',
            reference: 'Check-in',
            status: 'Activo'
          })
        });

        // Determine if they fully paid now
        const totalPaidNow = (client.total_paid || 0) + amountToPay;
        const newStatus = totalPaidNow >= (client.ticket_price || 0) ? 'Completado' : 'Cuotas';

        // Update registration status
        await fetch('/api/admin/update', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: client.id,
            status: newStatus
          })
        });
        
        await markAttendance(client.ticket_id, 1, newStatus, totalPaidNow);
      } else {
        await markAttendance(client.ticket_id, 1);
      }
      
      setScanResult(null);
      setTimeout(() => setIsScanning(true), 300);
    } catch (e) {
      alert('Error al registrar el pago: ' + e.message);
    }
    setIsProcessing(false);
  };

  const handleNewRegistration = async (e) => {
    e.preventDefault();
    if (isRegistering) return;
    setIsRegistering(true);
    
    const amountToPay = parseFloat(newClient.paymentAmount) || 0;
    const ticketPrice = newClient.plan === 'XPERIENCE VIP' ? 120 : 75;
    
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newClient.name,
          email: newClient.email,
          phone: newClient.phone,
          birthday: newClient.birthday,
          plan: newClient.plan,
          ticket_price: ticketPrice
        })
      });
      const data = await res.json();
      
      if (data.success && data.id) {
        let finalStatus = 'Nuevo';
        
        if (amountToPay > 0) {
          await fetch('/api/admin/payments', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              client_id: data.id,
              amount: amountToPay,
              date: new Date().toISOString(),
              method: newClient.paymentMethod,
              bank: 'Taquilla/Puerta',
              reference: newClient.paymentReference || 'Check-in',
              status: 'Activo'
            })
          });
          finalStatus = amountToPay >= ticketPrice ? 'Completado' : 'Cuotas';
        }
        
        // Update table_id and status (total_paid is updated by payments API)
        await fetch('/api/admin/update', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            id: data.id, 
            table_id: newClient.table_id || null,
            status: finalStatus
          })
        });
        
        // Reload page to get new list
        window.location.reload();
      } else {
        alert('Error al registrar: ' + data.error);
      }
    } catch(err) {
      alert('Error de conexión');
    }
    setIsRegistering(false);
  };

  const totalRegistrados = clients.length;
  const totalIngresados = clients.filter(c => c.attended === 1).length;
  const percent = totalRegistrados > 0 ? Math.round((totalIngresados / totalRegistrados) * 100) : 0;
  const totalTaquilla = taquillaPayments.reduce((acc, p) => acc + p.amount, 0);

  let currentList = filteredClients;
  if (activeTab === 'ingresados') currentList = filteredClients.filter(c => c.attended === 1);
  if (activeTab === 'faltantes') currentList = filteredClients.filter(c => !c.attended);

  return (
    <div style={{ padding: '30px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '15px' }}>
        <div>
          <h2 style={{ fontSize: '1.8rem', margin: '0 0 5px 0' }}>Check-in</h2>
          <p style={{ color: '#64748b', margin: 0 }}>Control de acceso y escáner de entradas.</p>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button 
            onClick={() => setShowNewModal(true)}
            style={{ padding: '12px 20px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 4px 10px rgba(59, 130, 246, 0.3)' }}
          >
            ➕ Nuevo
          </button>
          <button 
            onClick={() => setIsScanning(true)}
            style={{ padding: '12px 24px', background: '#0f172a', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 4px 10px rgba(15, 23, 42, 0.2)' }}
          >
            📷 Escanear QR
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 'bold', color: '#0284c7' }}>
            {percent}%
          </div>
          <div>
            <h3 style={{ margin: '0 0 5px 0', fontSize: '1.1rem', color: '#0f172a' }}>Aforo General</h3>
            <p style={{ margin: 0, color: '#64748b' }}>{totalIngresados} de {totalRegistrados} han ingresado</p>
          </div>
        </div>
        {activeTab === 'taquilla' && (
          <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 'bold', color: '#16a34a' }}>
              $
            </div>
            <div>
              <h3 style={{ margin: '0 0 5px 0', fontSize: '1.1rem', color: '#0f172a' }}>Total Recaudado</h3>
              <p style={{ margin: 0, color: '#64748b', fontSize: '1.2rem', fontWeight: 'bold' }}>${totalTaquilla.toFixed(2)} USD</p>
            </div>
          </div>
        )}
      </div>

      <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '30px', overflowX: 'auto' }}>
        
        <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '10px' }}>
          <button 
            onClick={() => setActiveTab('general')}
            style={{ padding: '10px 20px', border: 'none', borderRadius: '8px', background: activeTab === 'general' ? '#0f172a' : '#f1f5f9', color: activeTab === 'general' ? '#fff' : '#475569', fontWeight: 'bold', cursor: 'pointer', whiteSpace: 'nowrap' }}
          >
            Todos ({filteredClients.length})
          </button>
          <button 
            onClick={() => setActiveTab('ingresados')}
            style={{ padding: '10px 20px', border: 'none', borderRadius: '8px', background: activeTab === 'ingresados' ? '#10b981' : '#f1f5f9', color: activeTab === 'ingresados' ? '#fff' : '#475569', fontWeight: 'bold', cursor: 'pointer', whiteSpace: 'nowrap' }}
          >
            Ingresados ({filteredClients.filter(c => c.attended).length})
          </button>
          <button 
            onClick={() => setActiveTab('faltantes')}
            style={{ padding: '10px 20px', border: 'none', borderRadius: '8px', background: activeTab === 'faltantes' ? '#f59e0b' : '#f1f5f9', color: activeTab === 'faltantes' ? '#fff' : '#475569', fontWeight: 'bold', cursor: 'pointer', whiteSpace: 'nowrap' }}
          >
            Faltantes ({filteredClients.filter(c => !c.attended).length})
          </button>
          <button 
            onClick={() => setActiveTab('mesas')}
            style={{ padding: '10px 20px', border: 'none', borderRadius: '8px', background: activeTab === 'mesas' ? '#8b5cf6' : '#f1f5f9', color: activeTab === 'mesas' ? '#fff' : '#475569', fontWeight: 'bold', cursor: 'pointer', whiteSpace: 'nowrap' }}
          >
            Por Mesa
          </button>
          <button 
            onClick={() => setActiveTab('taquilla')}
            style={{ padding: '10px 20px', border: 'none', borderRadius: '8px', background: activeTab === 'taquilla' ? '#3b82f6' : '#f1f5f9', color: activeTab === 'taquilla' ? '#fff' : '#475569', fontWeight: 'bold', cursor: 'pointer', whiteSpace: 'nowrap' }}
          >
            Ingresos Taquilla
          </button>
        </div>

        {activeTab !== 'taquilla' && activeTab !== 'mesas' && (
          <input 
            type="text" 
            placeholder="Buscar por nombre, correo, teléfono, plan o ID de ticket..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: '100%', padding: '12px 15px', borderRadius: '8px', border: '1px solid #cbd5e1', marginBottom: '20px', fontSize: '1rem', outline: 'none' }}
          />
        )}
      </div>

      <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', overflowX: 'auto' }}>
        {activeTab === 'mesas' ? (
          <div style={{ padding: '20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
            {tables.map(table => {
              const tableClients = clients.filter(c => c.table_id === table.id);
              const attended = tableClients.filter(c => c.attended === 1).length;
              const maxCapacity = 10;
              const available = maxCapacity - tableClients.length;
              const isFull = tableClients.length >= maxCapacity;
              const isOver = tableClients.length > maxCapacity;
              
              return (
                <div key={table.id} style={{ background: '#f8fafc', padding: '20px', borderRadius: '12px', border: isOver ? '2px solid #ef4444' : '1px solid #e2e8f0', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                    <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#0f172a' }}>{table.name}</h3>
                    <div style={{ background: isFull ? '#ef4444' : '#8b5cf6', color: '#fff', padding: '4px 8px', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 'bold' }}>
                      {tableClients.length} / {maxCapacity} Asignados
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#64748b', marginBottom: '5px' }}>
                    <span>Han ingresado: <strong style={{ color: '#10b981' }}>{attended}</strong></span>
                    <span>Faltan: <strong style={{ color: '#f59e0b' }}>{tableClients.length - attended}</strong></span>
                  </div>
                  
                  <div style={{ fontSize: '0.85rem', color: available > 0 ? '#3b82f6' : '#ef4444', marginBottom: '12px', fontWeight: 'bold', textAlign: 'right' }}>
                    {available > 0 ? `${available} puestos disponibles` : available === 0 ? 'Mesa Llena' : `¡Sobrecupo de ${Math.abs(available)}!`}
                  </div>
                  
                  <div style={{ width: '100%', height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden', display: 'flex' }}>
                    {/* Attended portion */}
                    <div style={{ width: `${Math.min((attended / maxCapacity) * 100, 100)}%`, height: '100%', background: '#10b981', transition: 'width 0.3s' }}></div>
                    {/* Assigned but missing portion */}
                    <div style={{ width: `${Math.min(((tableClients.length - attended) / maxCapacity) * 100, 100)}%`, height: '100%', background: '#f59e0b', transition: 'width 0.3s' }}></div>
                  </div>
                </div>
              );
            })}
            
            {/* Sin asignar */}
            {(() => {
              const unassigned = clients.filter(c => !c.table_id);
              if (unassigned.length === 0) return null;
              const attended = unassigned.filter(c => c.attended === 1).length;
              return (
                <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px dashed #cbd5e1' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                    <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#64748b' }}>Sin asignar</h3>
                    <div style={{ background: '#94a3b8', color: '#fff', padding: '4px 8px', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 'bold' }}>
                      {unassigned.length} personas
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#64748b', marginBottom: '10px' }}>
                    <span>Han ingresado: <strong style={{ color: '#10b981' }}>{attended}</strong></span>
                    <span>Faltan: <strong style={{ color: '#f59e0b' }}>{unassigned.length - attended}</strong></span>
                  </div>
                  <div style={{ width: '100%', height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${unassigned.length > 0 ? Math.round((attended / unassigned.length) * 100) : 0}%`, height: '100%', background: '#94a3b8', transition: 'width 0.3s' }}></div>
                  </div>
                </div>
              );
            })()}
          </div>
        ) : activeTab === 'taquilla' ? (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '700px' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                <th style={{ padding: '15px 20px', color: '#64748b', fontWeight: '600' }}>Fecha</th>
                <th style={{ padding: '15px 20px', color: '#64748b', fontWeight: '600' }}>Cliente</th>
                <th style={{ padding: '15px 20px', color: '#64748b', fontWeight: '600' }}>Método</th>
                <th style={{ padding: '15px 20px', color: '#64748b', fontWeight: '600' }}>Monto</th>
              </tr>
            </thead>
            <tbody>
              {loadingPayments ? (
                <tr><td colSpan="4" style={{ padding: '20px', textAlign: 'center' }}>Cargando ingresos...</td></tr>
              ) : taquillaPayments.length === 0 ? (
                <tr><td colSpan="4" style={{ padding: '20px', textAlign: 'center', color: '#64748b' }}>No hay ingresos registrados en taquilla.</td></tr>
              ) : taquillaPayments.map(p => (
                <tr key={p.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '12px' }}>{new Date(p.date).toLocaleString()}</td>
                  <td style={{ padding: '12px', fontWeight: 'bold' }}>{clients.find(c => Number(c.id) === Number(p.client_id))?.name || 'Cliente #' + p.client_id}</td>
                  <td style={{ padding: '12px' }}>{p.method}</td>
                  <td style={{ padding: '12px', color: '#10b981', fontWeight: 'bold' }}>${Number(p.amount).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '700px' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                <th style={{ padding: '15px 20px', color: '#64748b', fontWeight: '600' }}>Nombre</th>
                <th style={{ padding: '15px 20px', color: '#64748b', fontWeight: '600' }}>Plan / Ticket</th>
                <th style={{ padding: '15px 20px', color: '#64748b', fontWeight: '600' }}>Estado / Mesa</th>
                <th style={{ padding: '15px 20px', color: '#64748b', fontWeight: '600', textAlign: 'center' }}>Asistencia</th>
              </tr>
            </thead>
            <tbody>
              {currentList.map((client) => (
              <tr key={client.id} style={{ borderBottom: '1px solid #f1f5f9', background: client.attended === 1 ? '#f0fdf4' : '#fff' }}>
                <td style={{ padding: '15px 20px' }}>
                  <div style={{ fontWeight: 'bold', color: '#0f172a' }}>{client.name}</div>
                  <div style={{ fontSize: '0.85rem', color: '#64748b' }}>{client.email || client.phone}</div>
                </td>
                <td style={{ padding: '15px 20px' }}>
                  <div style={{ fontSize: '0.9rem', color: '#3b82f6', fontWeight: 'bold' }}>{client.plan.split('(')[0].trim().toUpperCase()}</div>
                  <div style={{ fontSize: '0.85rem', color: '#94a3b8', fontFamily: 'monospace' }}>{client.ticket_id}</div>
                </td>
                <td style={{ padding: '15px 20px' }}>
                  <div style={{ color: client.status === 'Completado' ? '#10b981' : '#ef4444', fontWeight: 'bold', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: client.status === 'Completado' ? '#10b981' : '#ef4444' }}></div>
                    {client.status === 'Completado' ? 'Pagado' : 'Pendiente'}
                  </div>
                  {client.status !== 'Completado' && (
                    <div style={{ fontSize: '0.85rem', color: '#ef4444', marginTop: '4px', fontWeight: 'bold' }}>
                      Debe: ${((client.ticket_price || 0) - (client.total_paid || 0)).toFixed(2)}
                    </div>
                  )}
                  <div style={{ fontSize: '0.9rem', color: '#475569', marginTop: '8px', fontWeight: 'bold', background: '#f1f5f9', padding: '4px 8px', borderRadius: '6px', display: 'inline-block' }}>
                    {client.table_name ? `📍 ${client.table_name}` : 'Mesa: --'}
                  </div>
                </td>
                <td style={{ padding: '15px 20px', textAlign: 'center' }}>
                  {client.attended ? (
                    <button onClick={() => {
                      if(confirm('¿Deshacer entrada de ' + client.name + '?')) markAttendance(client.ticket_id, 0);
                    }} style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', border: '1px solid #10b981', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 'bold' }}>
                      Entró ✅
                    </button>
                  ) : (
                    <button onClick={() => {
                        if (client.status === 'Completado') {
                          markAttendance(client.ticket_id, 1);
                        } else {
                          const owed = (client.ticket_price || 0) - (client.total_paid || 0);
                          setPaymentAmount(owed > 0 ? owed.toString() : '');
                          setScanResult({ type: 'pending', message: 'PAGO PENDIENTE', client });
                          setIsScanning(false);
                        }
                      }} 
                      style={{ background: client.status === 'Completado' ? '#10b981' : '#f59e0b', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 'bold' }}
                    >
                      {client.status === 'Completado' ? 'Marcar' : 'Cobrar e Ingresar'}
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {currentList.length === 0 && (
              <tr>
                <td colSpan="4" style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
                  No se encontraron contactos que coincidan con la búsqueda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        )}
      </div>

      {isScanning && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.95)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#ffffff', padding: '20px', borderRadius: '16px', width: '95%', maxWidth: '500px', position: 'relative' }}>
            <button onClick={() => setIsScanning(false)} style={{ position: 'absolute', top: '15px', right: '15px', background: '#f1f5f9', border: 'none', width: '30px', height: '30px', borderRadius: '50%', fontSize: '1.2rem', cursor: 'pointer', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>×</button>
            <h3 style={{ margin: '0 0 20px 0', textAlign: 'center', color: '#0f172a' }}>Escanear Código QR</h3>
            <div id="qr-reader" style={{ width: '100%', borderRadius: '8px', overflow: 'hidden' }}></div>
          </div>
        </div>
      )}

      {scanResult && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.95)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ background: '#fff', padding: '40px 20px', borderRadius: '24px', width: '100%', maxWidth: '400px', textAlign: 'center', border: `4px solid ${scanResult.type === 'success' ? '#10b981' : scanResult.type === 'pending' ? '#f59e0b' : '#ef4444'}`, animation: 'scaleIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }}>
            <div style={{ fontSize: '5rem', marginBottom: '10px' }}>
              {scanResult.type === 'success' ? '✅' : scanResult.type === 'pending' ? '⚠️' : '❌'}
            </div>
            <h2 style={{ color: scanResult.type === 'success' ? '#10b981' : scanResult.type === 'pending' ? '#f59e0b' : '#ef4444', margin: '0 0 5px 0', fontSize: '1.8rem', fontWeight: '900' }}>
              {scanResult.message}
            </h2>
            
            {scanResult.client ? (
              <div style={{ marginTop: '20px' }}>
                <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '16px', textAlign: 'left', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '1.3rem', fontWeight: '900', color: '#0f172a', marginBottom: '5px' }}>{scanResult.client.name}</div>
                  <div style={{ color: '#64748b', marginBottom: '15px', fontSize: '0.9rem' }}>{scanResult.client.email}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 'bold', color: scanResult.client.plan.includes('VIP') ? '#c19845' : '#4a89a7', fontSize: '1.1rem' }}>
                      {scanResult.client.plan.split('(')[0].trim().toUpperCase()}
                    </span>
                    <span style={{ background: '#e2e8f0', color: '#475569', padding: '4px 8px', borderRadius: '6px', fontFamily: 'monospace', fontSize: '0.85rem' }}>
                      {scanResult.client.ticket_id}
                    </span>
                  </div>
                  
                  <div style={{ marginTop: '15px', textAlign: 'left', background: '#fff', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', color: '#64748b', marginBottom: '5px', fontWeight: 'bold' }}>📍 Asignar/Cambiar Mesa:</label>
                    <select 
                      value={scanResult.client.table_id || ''}
                      onChange={(e) => updateTable(scanResult.client.id, e.target.value)}
                      style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '1rem', fontWeight: 'bold', color: '#0f172a' }}
                    >
                      <option value="">Sin asignar</option>
                      {tables.map(t => (
                        <option key={t.id} value={t.id}>{t.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                {scanResult.type === 'pending' && (
                  <div style={{ marginTop: '15px', padding: '15px', background: '#fff', border: '2px solid #f59e0b', borderRadius: '12px', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '5px' }}>Deuda Pendiente:</div>
                    <div style={{ fontSize: '2rem', fontWeight: '900', color: '#ef4444', marginBottom: '15px' }}>
                      ${(scanResult.client.ticket_price || 0) - (scanResult.client.total_paid || 0)}
                    </div>
                    
                    <div style={{ textAlign: 'left', marginBottom: '15px' }}>
                      <label style={{ display: 'block', fontSize: '0.85rem', color: '#64748b', marginBottom: '5px', fontWeight: 'bold' }}>Monto a pagar ahora ($):</label>
                      <input 
                        type="number" 
                        value={paymentAmount}
                        onChange={(e) => setPaymentAmount(e.target.value)}
                        placeholder="Ej: 50"
                        style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '1.2rem', fontWeight: 'bold' }}
                      />
                    </div>
                    
                    <select 
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', marginBottom: '15px', fontSize: '1rem' }}
                    >
                      <option value="Efectivo (Puerta)">Efectivo (Puerta)</option>
                      <option value="Punto de Venta">Punto de Venta</option>
                      <option value="Zelle">Zelle</option>
                      <option value="Pago Móvil">Pago Móvil</option>
                    </select>
                    
                    <button 
                      disabled={isProcessing}
                      onClick={() => handlePaymentAndCheckin(scanResult.client)}
                      style={{ width: '100%', padding: '14px', background: '#10b981', color: '#fff', border: 'none', borderRadius: '8px', cursor: isProcessing ? 'not-allowed' : 'pointer', fontWeight: 'bold', fontSize: '1rem', opacity: isProcessing ? 0.7 : 1 }}
                    >
                      {isProcessing ? 'Procesando...' : 'Registrar Pago y Permitir Acceso'}
                    </button>
                    
                    <button 
                      disabled={isProcessing}
                      onClick={() => {
                        if(confirm('¿Forzar la entrada SIN REGISTRAR EL PAGO?')) {
                          markAttendance(scanResult.client.ticket_id, 1);
                          setScanResult(null);
                        }
                      }}
                      style={{ width: '100%', marginTop: '10px', padding: '10px', background: 'transparent', border: 'none', color: '#64748b', textDecoration: 'underline', cursor: 'pointer' }}
                    >
                      Dejar entrar con deuda
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <p style={{ color: '#64748b', marginTop: '10px' }}>No hay información registrada en el sistema con este código.</p>
            )}

            <button 
              onClick={() => {
                setScanResult(null);
                setTimeout(() => setIsScanning(true), 100);
              }}
              style={{ width: '100%', padding: '16px', background: '#0f172a', color: '#fff', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold', marginTop: '20px', fontSize: '1.1rem' }}
            >
              Escanear Otra
            </button>
            
            <button 
              onClick={() => setScanResult(null)}
              style={{ width: '100%', padding: '16px', background: 'transparent', color: '#64748b', border: 'none', cursor: 'pointer', fontWeight: 'bold', marginTop: '5px', fontSize: '1rem' }}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {showNewModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ background: '#fff', padding: '30px', borderRadius: '16px', width: '100%', maxWidth: '500px', position: 'relative', maxHeight: '90vh', overflowY: 'auto' }}>
            <button onClick={() => setShowNewModal(false)} style={{ position: 'absolute', top: '15px', right: '15px', background: 'transparent', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#64748b' }}>×</button>
            <h2 style={{ margin: '0 0 20px 0', color: '#0f172a' }}>Nuevo Registro en Puerta</h2>
            
            <form onSubmit={handleNewRegistration} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#475569' }}>Nombre completo *</label>
                <input required type="text" value={newClient.name} onChange={e => setNewClient({...newClient, name: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#475569' }}>Email *</label>
                <input required type="email" value={newClient.email} onChange={e => setNewClient({...newClient, email: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#475569' }}>Teléfono *</label>
                <input required type="text" value={newClient.phone} onChange={e => setNewClient({...newClient, phone: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#475569' }}>Plan *</label>
                  <select value={newClient.plan} onChange={e => setNewClient({...newClient, plan: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
                    <option value="General">General</option>
                    <option value="XPERIENCE VIP">XPERIENCE VIP</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#475569' }}>Asignar Mesa</label>
                  <select value={newClient.table_id} onChange={e => setNewClient({...newClient, table_id: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
                    <option value="">Sin asignar</option>
                    {tables.map(t => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div style={{ marginTop: '5px', padding: '15px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <h3 style={{ margin: '0 0 15px 0', fontSize: '1.1rem', color: '#0f172a' }}>Pago en Puerta</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#475569' }}>Monto a pagar ($) *</label>
                    <input required type="number" placeholder="Ej: 50" value={newClient.paymentAmount || ''} onChange={e => setNewClient({...newClient, paymentAmount: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#475569' }}>Método de Pago</label>
                    <select value={newClient.paymentMethod || 'Efectivo (Puerta)'} onChange={e => setNewClient({...newClient, paymentMethod: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
                      <option value="Efectivo (Puerta)">Efectivo (Puerta)</option>
                      <option value="Punto de Venta">Punto de Venta</option>
                      <option value="Zelle">Zelle</option>
                      <option value="Pago Móvil">Pago Móvil</option>
                      <option value="Transferencia">Transferencia</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#475569' }}>Referencia (Opcional)</label>
                  <input type="text" placeholder="Ej: 123456" value={newClient.paymentReference || ''} onChange={e => setNewClient({...newClient, paymentReference: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                </div>
              </div>
              
              <button disabled={isRegistering} type="submit" style={{ padding: '15px', background: '#10b981', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer', marginTop: '10px' }}>
                {isRegistering ? 'Guardando...' : 'Registrar'}
              </button>
            </form>
          </div>
        </div>
      )}
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scaleIn {
          from { transform: scale(0.8); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        #qr-reader {
          border: none !important;
        }
        #qr-reader img[alt="Info icon"] {
          display: none;
        }
        #qr-reader__dashboard_section_csr button {
          background: var(--color-accent);
          color: white;
          border: none;
          padding: 10px 15px;
          border-radius: 8px;
          cursor: pointer;
          font-weight: bold;
          margin-top: 10px;
        }
      `}} />
    </div>
  );
}
