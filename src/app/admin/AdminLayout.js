"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminLayout({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const pathname = usePathname();

  const [role, setRole] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false); // To prevent hydration mismatch

  // Check session on mount
  useEffect(() => {
    try {
      const savedRole = localStorage.getItem('crm_role');
      if (savedRole) {
        setRole(savedRole);
        setIsAuthenticated(true);
      }
    } catch (e) {
      console.warn('localStorage is blocked or unavailable:', e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Close sidebar when navigating on mobile
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  const handleLogin = (e) => {
    e.preventDefault();
    let newRole = null;
    if (password === 'xperience2026') {
      newRole = 'admin';
    } else if (password === 'ventas2026') {
      newRole = 'ventas';
    } else if (password === 'lideres2026') {
      newRole = 'lideres';
    } else {
      alert('Contraseña incorrecta');
      return;
    }
    
    setIsAuthenticated(true);
    setRole(newRole);
    try {
      localStorage.setItem('crm_role', newRole);
    } catch (e) {}
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setRole(null);
    setPassword('');
    try {
      localStorage.removeItem('crm_role');
    } catch(e) {}
  };

  if (!isLoaded) return null; // Wait for localStorage check

  if (!isAuthenticated) {
    return (
      <div className="login-split-container">
        
        {/* Left Panel */}
        <div className="login-left-panel">
          
          <div className="login-left-content" style={{ zIndex: 10, position: 'relative', margin: 'auto 0' }}>
            <img src="/logo.png" alt="Marketing Xperience Logo" style={{ maxHeight: '70px', maxWidth: '250px', marginBottom: '30px', objectFit: 'contain' }} />
            <h1 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '20px', lineHeight: 1.2 }}>
              ¡Hola<br/>Team Xperience! 👋
            </h1>
            <p className="login-left-desc" style={{ fontSize: '1.1rem', opacity: 0.8, maxWidth: '400px', lineHeight: 1.6 }}>
              Gestiona tus ventas, campañas y el registro del evento desde un solo lugar. Ahorra tiempo con nuestras herramientas.
            </p>
          </div>
          <div className="login-copyright" style={{ fontSize: '0.85rem', opacity: 0.5, zIndex: 10, position: 'absolute', bottom: '40px', left: '60px' }}>
            © 2026 Marketing Xperience. Todos los derechos reservados.
          </div>
        </div>

        {/* Right Panel */}
        <div className="login-right-panel">
          <div className="login-right-brand">
            <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 'bold', color: '#0f172a', opacity: 0.7 }}>Sistema único de Marketing Xperience</h2>
          </div>
          <form onSubmit={handleLogin} style={{ width: '100%', maxWidth: '350px', padding: '20px' }}>
            <h2 style={{ fontSize: '2.2rem', color: '#0f172a', marginBottom: '10px', fontWeight: 'bold' }}>¡Bienvenido!</h2>
            <p style={{ color: '#64748b', marginBottom: '40px', fontSize: '0.95rem' }}>
              Ingresa tu contraseña de equipo para acceder al sistema y continuar con tu trabajo.
            </p>

            <div style={{ marginBottom: '24px', position: 'relative' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: '#334155', fontSize: '0.9rem', fontWeight: '600' }}>Contraseña</label>
              <div style={{ position: 'relative' }}>
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ width: '100%', padding: '14px 45px 14px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#f8fafc', color: '#0f172a', fontSize: '1rem', outline: 'none', transition: 'border 0.2s' }}
                  onFocus={(e) => e.target.style.borderColor = 'var(--color-bg)'}
                  onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: '#94a3b8', padding: '0 5px' }}
                  title={showPassword ? "Ocultar contraseña" : "Ver contraseña"}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            <button type="submit" style={{ width: '100%', padding: '16px', background: '#0f172a', border: 'none', borderRadius: '8px', color: '#fff', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem', transition: 'background 0.2s' }} onMouseOver={e => e.currentTarget.style.background = '#1e293b'} onMouseOut={e => e.currentTarget.style.background = '#0f172a'}>
              Entrar al CRM
            </button>
          </form>
        </div>

      </div>
    );
  }

  const allNavItems = [
    { label: 'Dashboard', path: '/admin', icon: '📊', roles: ['admin'] },
    { label: 'Contactos', path: '/admin/contacts', icon: '👥', roles: ['admin', 'ventas'] },
    { label: 'Calendario', path: '/admin/calendar', icon: '📅', roles: ['admin', 'ventas'] },
    { label: 'Campaña', path: '/admin/campaign', icon: '📈', roles: ['admin', 'ventas', 'lideres'] },
    { label: 'Evento', path: '/admin/attendees', icon: '🎟️', roles: ['admin', 'ventas', 'lideres'] },
    { label: 'Check-in', path: '/admin/checkin', icon: '✅', roles: ['admin', 'lideres'] },
    { label: 'Configuración', path: '/admin/settings', icon: '⚙️', roles: ['admin'] },
  ];

  const navItems = allNavItems.filter(item => item.roles.includes(role));

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', background: 'var(--color-bg)', color: '#fff', fontFamily: 'sans-serif', overflow: 'hidden' }}>
      
      {/* Mobile Overlay */}
      <div 
        className={`admin-overlay ${isSidebarOpen ? 'open' : ''}`} 
        onClick={() => setIsSidebarOpen(false)}
      ></div>

      {/* Sidebar */}
      <div className={`admin-sidebar ${isSidebarOpen ? 'open' : ''}`} style={{ width: '250px', background: 'rgba(0, 0, 0, 0.25)', padding: '20px 0', display: 'flex', flexDirection: 'column', borderRight: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)' }}>
        <div style={{ padding: '0 20px', marginBottom: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img src="/logo.png" alt="Marketing Xperience" style={{ maxWidth: '100%', height: 'auto', maxHeight: '50px' }} />
        </div>
        
        <div style={{ flex: 1 }}>
          <div style={{ padding: '0 20px', fontSize: '0.75rem', color: '#cce0eb', textTransform: 'uppercase', marginBottom: '10px', fontWeight: 'bold' }}>Menu</div>
          {navItems.map((item, idx) => {
            const isActive = pathname === item.path;
            return (
              <Link key={idx} href={item.path} style={{ textDecoration: 'none' }}>
                <div style={{ 
                  padding: '12px 20px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '12px',
                  color: isActive ? '#fff' : '#cce0eb',
                  background: isActive ? 'rgba(0, 0, 0, 0.3)' : 'transparent',
                  borderLeft: isActive ? '3px solid var(--color-accent)' : '3px solid transparent',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}>
                  <span>{item.icon}</span>
                  <span style={{ fontWeight: isActive ? '600' : '400' }}>{item.label}</span>
                </div>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: '#f8fafc', color: '#0f172a' }}>
        {/* Topbar */}
        <div style={{ height: '70px', padding: '0 30px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', background: '#ffffff', zIndex: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <button className="admin-hamburger" onClick={() => setIsSidebarOpen(true)}>☰</button>
            <h1 style={{ fontSize: '1.3rem', margin: 0, fontWeight: '600' }}>{navItems.find(n => n.path === pathname)?.label || 'Dashboard'}</h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div style={{ textAlign: 'right', display: 'none' }} className="d-sm-block">
                <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Usuario</div>
                <div style={{ fontWeight: 'bold', textTransform: 'capitalize' }}>{role}</div>
              </div>
              <div style={{ width: '35px', height: '35px', borderRadius: '50%', background: 'var(--color-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#fff' }}>
                {role ? role.charAt(0).toUpperCase() : 'A'}
              </div>
            </div>
            <button 
              onClick={handleLogout}
              style={{ background: 'transparent', border: '1px solid #ef4444', color: '#ef4444', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 'bold' }}
              title="Cerrar sesión"
            >
              Salir
            </button>
          </div>
        </div>
        
        {/* Page Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '30px' }}>
          {children}
        </div>
      </div>
    </div>
  );
}
