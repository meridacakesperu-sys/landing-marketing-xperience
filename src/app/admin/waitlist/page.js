"use client";

import { useState, useEffect } from 'react';

export default function AdminWaitlist() {
  const [waitlist, setWaitlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWaitlist();
  }, []);

  const fetchWaitlist = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/waitlist');
      const data = await res.json();
      if (data.success) {
        setWaitlist(data.waitlist);
      } else {
        alert(data.message || 'Error al cargar');
      }
    } catch (err) {
      console.error(err);
      alert('Error de conexión');
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Seguro que deseas eliminar este registro?')) return;
    try {
      const res = await fetch(`/api/admin/waitlist?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setWaitlist(prev => prev.filter(w => w.id !== id));
      } else {
        alert(data.message || 'Error al eliminar');
      }
    } catch (err) {
      console.error(err);
      alert('Error de conexión');
    }
  };

  const exportToCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "ID,Nombre,Email,Teléfono,Fecha Registro\n";
    
    waitlist.forEach(w => {
      const date = new Date(w.created_at).toLocaleString();
      const row = `${w.id},"${w.full_name}","${w.email}","${w.phone}","${date}"`;
      csvContent += row + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "Lista_de_Espera_2027.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ fontSize: '1.8rem', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
          ⏳ Lista de Espera 2027
        </h1>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            onClick={fetchWaitlist} 
            style={{ padding: '8px 16px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
          >
            Actualizar
          </button>
          <button 
            onClick={exportToCSV} 
            style={{ padding: '8px 16px', background: '#10b981', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}
          >
            Exportar CSV
          </button>
        </div>
      </div>

      <div style={{ background: '#1e293b', borderRadius: '12px', padding: '20px', border: '1px solid #334155' }}>
        <p style={{ marginBottom: '20px', color: '#94a3b8' }}>Total de registrados: <strong>{waitlist.length}</strong></p>

        {loading ? (
          <p>Cargando lista de espera...</p>
        ) : waitlist.length === 0 ? (
          <p style={{ color: '#94a3b8' }}>Aún no hay registros en la lista de espera.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #334155', textAlign: 'left', color: '#94a3b8' }}>
                  <th style={{ padding: '12px' }}>ID</th>
                  <th style={{ padding: '12px' }}>Nombre</th>
                  <th style={{ padding: '12px' }}>Correo Electrónico</th>
                  <th style={{ padding: '12px' }}>Teléfono</th>
                  <th style={{ padding: '12px' }}>Fecha de Registro</th>
                  <th style={{ padding: '12px', textAlign: 'right' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {waitlist.map((item) => (
                  <tr key={item.id} style={{ borderBottom: '1px solid #334155', transition: 'background-color 0.2s' }}>
                    <td style={{ padding: '12px' }}>#{item.id}</td>
                    <td style={{ padding: '12px', fontWeight: 'bold' }}>{item.full_name}</td>
                    <td style={{ padding: '12px', color: '#38bdf8' }}>{item.email}</td>
                    <td style={{ padding: '12px' }}>{item.phone}</td>
                    <td style={{ padding: '12px', color: '#94a3b8' }}>
                      {new Date(item.created_at).toLocaleString()}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'right' }}>
                      <button 
                        onClick={() => handleDelete(item.id)}
                        style={{ padding: '6px 10px', background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem' }}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
