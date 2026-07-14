"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function RegistroClient() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    birthday: '',
    plan: 'General',
    occupation: '',
    has_business: '',
    business_details: '',
    social_media: '',
    sales_type: '',
    main_goal: '',
    main_struggle: '',
    marketing_level: '',
    ai_level: '',
    sales_level: ''
  });
  
  // Custom inputs for "Otro" options
  const [others, setOthers] = useState({
    has_business: '',
    sales_type: '',
    main_struggle: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [refCode, setRefCode] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get('ref');
    if (ref) setRefCode(ref);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleOtherChange = (e) => {
    setOthers({ ...others, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    // Merge "Otro" values if selected
    const finalData = { ...formData };
    if (formData.has_business === 'Otro') finalData.has_business = others.has_business || 'Otro';
    if (formData.sales_type === 'Otro') finalData.sales_type = others.sales_type || 'Otro';
    if (formData.main_struggle === 'Otro') finalData.main_struggle = others.main_struggle || 'Otro';
    if (refCode) finalData.ref_code = refCode;

    try {
      const res = await fetch('/api/public/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalData)
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(true);
      } else {
        setErrorMsg(data.error || 'Ocurrió un error al enviar el formulario.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Error de conexión. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '14px',
    background: 'rgba(15, 23, 42, 0.6)',
    border: '1px solid rgba(148, 163, 184, 0.2)',
    color: '#f8fafc',
    borderRadius: '8px',
    fontSize: '1rem',
    outline: 'none',
    transition: 'all 0.3s ease',
    backdropFilter: 'blur(10px)'
  };

  const labelStyle = {
    display: 'block',
    color: '#cbd5e1',
    fontSize: '0.9rem',
    marginBottom: '8px',
    fontWeight: '500'
  };

  if (success) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#020617', padding: '20px' }}>
        <div style={{ background: 'rgba(30, 41, 59, 0.7)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)', padding: '50px 40px', borderRadius: '24px', textAlign: 'center', maxWidth: '500px', width: '100%', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}>
          <div style={{ width: '80px', height: '80px', background: 'var(--color-accent)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', fontSize: '2rem' }}>
            🎉
          </div>
          <h2 style={{ color: '#f8fafc', fontSize: '2rem', marginBottom: '16px' }}>¡Registro Exitoso!</h2>
          <p style={{ color: '#94a3b8', fontSize: '1.1rem', lineHeight: '1.6' }}>
            Gracias por completar tu registro. Tus datos han sido guardados correctamente en nuestro sistema. ¡Nos vemos en el evento!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: '#020617', position: 'relative', overflow: 'hidden' }}>
      
      {/* Background Decorations */}
      <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '500px', height: '500px', background: 'var(--color-accent)', filter: 'blur(150px)', opacity: 0.15, borderRadius: '50%', pointerEvents: 'none' }}></div>
      <div style={{ position: 'absolute', bottom: '-10%', right: '-10%', width: '500px', height: '500px', background: '#4a89a7', filter: 'blur(150px)', opacity: 0.15, borderRadius: '50%', pointerEvents: 'none' }}></div>

      <div style={{ width: '100%', maxWidth: '650px', margin: 'auto', padding: '40px 20px', position: 'relative', zIndex: 10 }}>
        
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <Image src="/logo.png" alt="Marketing Xperience Logo" width={250} height={100} style={{ objectFit: 'contain', margin: '0 auto 20px' }} />
          <h1 style={{ color: '#f8fafc', fontSize: '2rem', fontWeight: '800', marginBottom: '10px' }}>Completa tu Registro</h1>
        </div>

        <div style={{ background: 'rgba(30, 41, 59, 0.5)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.05)', padding: '40px', borderRadius: '24px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}>
          
          {errorMsg && (
            <div style={{ background: 'rgba(239, 68, 68, 0.1)', borderLeft: '4px solid #ef4444', padding: '16px', borderRadius: '8px', color: '#fca5a5', marginBottom: '24px' }}>
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            <h3 style={{ color: 'var(--color-accent)', margin: '10px 0 0 0', fontSize: '1.2rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>Datos Personales</h3>

            <div>
              <label style={labelStyle}>Nombre Completo *</label>
              <input required type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Ej. Juan Pérez" style={inputStyle} />
            </div>

            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: '200px' }}>
                <label style={labelStyle}>Correo Electrónico *</label>
                <input required type="email" name="email" value={formData.email} onChange={handleChange} placeholder="juan@correo.com" style={inputStyle} />
              </div>
              <div style={{ flex: 1, minWidth: '200px' }}>
                <label style={labelStyle}>Teléfono / WhatsApp *</label>
                <input required type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+58 412 1234567" style={inputStyle} />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: '200px' }}>
                <label style={labelStyle}>Fecha de Cumpleaños</label>
                <input type="date" name="birthday" value={formData.birthday} onChange={handleChange} style={inputStyle} />
              </div>
              <div style={{ flex: 1, minWidth: '200px' }}>
                <label style={labelStyle}>Tipo de Entrada *</label>
                <select required name="plan" value={formData.plan} onChange={handleChange} style={{ ...inputStyle, cursor: 'pointer' }}>
                  <option value="General">Entrada General</option>
                  <option value="VIP">Entrada VIP</option>
                </select>
              </div>
            </div>

            <div>
              <label style={labelStyle}>¿Cuál es tu ocupación actual? *</label>
              <input required type="text" name="occupation" value={formData.occupation} onChange={handleChange} placeholder="Ej. Arquitecto, Estudiante, etc." style={inputStyle} />
            </div>

            <h3 style={{ color: 'var(--color-accent)', margin: '20px 0 0 0', fontSize: '1.2rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>Perfil de Negocio</h3>

            <div>
              <label style={labelStyle}>¿Tienes un negocio actualmente? *</label>
              <select required name="has_business" value={formData.has_business} onChange={handleChange} style={inputStyle}>
                <option value="">Selecciona una opción</option>
                <option value="Tengo negocio fisico">Tengo negocio físico</option>
                <option value="Tengo negocio online">Tengo negocio online</option>
                <option value="Tengo una idea de negocio">Tengo una idea de negocio</option>
                <option value="Otro">Otro</option>
              </select>
              {formData.has_business === 'Otro' && (
                <input required type="text" name="has_business" value={others.has_business} onChange={handleOtherChange} placeholder="Por favor, especifica" style={{ ...inputStyle, marginTop: '10px' }} />
              )}
            </div>

            <div>
              <label style={labelStyle}>Si tienes negocio o una idea de negocio ¿Cuéntame brevemente de qué trata?</label>
              <textarea name="business_details" value={formData.business_details} onChange={handleChange} placeholder="Detalles de tu negocio..." style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }} />
            </div>

            <div>
              <label style={labelStyle}>¿Cuál es el nombre de la cuenta de @Instagram, @tiktok o @facebook de tu negocio?</label>
              <input type="text" name="social_media" value={formData.social_media} onChange={handleChange} placeholder="Ej. @minegocio" style={inputStyle} />
            </div>

            <div>
              <label style={labelStyle}>¿Vendes productos, servicios o infoproductos? *</label>
              <select required name="sales_type" value={formData.sales_type} onChange={handleChange} style={inputStyle}>
                <option value="">Selecciona una opción</option>
                <option value="Productos fisicos">Productos físicos</option>
                <option value="Infoproductos">Infoproductos</option>
                <option value="Servicios">Servicios</option>
                <option value="Otro">Otro</option>
              </select>
              {formData.sales_type === 'Otro' && (
                <input required type="text" name="sales_type" value={others.sales_type} onChange={handleOtherChange} placeholder="Por favor, especifica" style={{ ...inputStyle, marginTop: '10px' }} />
              )}
            </div>

            <h3 style={{ color: 'var(--color-accent)', margin: '20px 0 0 0', fontSize: '1.2rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>Metas y Desafíos</h3>

            <div>
              <label style={labelStyle}>Solo puedes elegir una opción, la más importante ¿Qué es lo que más quisieras lograr con este curso? *</label>
              <select required name="main_goal" value={formData.main_goal} onChange={handleChange} style={inputStyle}>
                <option value="">Selecciona tu meta principal</option>
                <option value="Mas ventas">Más ventas</option>
                <option value="Atraer clientes">Atraer clientes</option>
                <option value="Automatizar">Automatizar</option>
                <option value="Marca personal">Marca personal</option>
                <option value="Aumentar mi presencia digital">Aumentar mi presencia digital</option>
                <option value="Iniciar mi negocio">Iniciar mi negocio</option>
                <option value="Ser freelance">Ser freelance</option>
                <option value="Aprender mucho mas">Aprender mucho más</option>
                <option value="Ser asesor de marketing, ventas o IA">Ser asesor de marketing, ventas o IA</option>
              </select>
            </div>

            <div>
              <label style={labelStyle}>¿Qué es lo que más te está costando hoy en tu negocio o redes sociales? *</label>
              <select required name="main_struggle" value={formData.main_struggle} onChange={handleChange} style={inputStyle}>
                <option value="">Selecciona tu mayor desafío</option>
                <option value="Conseguir clientes">Conseguir clientes</option>
                <option value="No tengo tiempo">No tengo tiempo</option>
                <option value="Me cuesta crear contenido">Me cuesta crear contenido</option>
                <option value="No se por donde empezar">No sé por dónde empezar</option>
                <option value="Otro">Otro</option>
              </select>
              {formData.main_struggle === 'Otro' && (
                <input required type="text" name="main_struggle" value={others.main_struggle} onChange={handleOtherChange} placeholder="Por favor, especifica" style={{ ...inputStyle, marginTop: '10px' }} />
              )}
            </div>

            <h3 style={{ color: 'var(--color-accent)', margin: '20px 0 0 0', fontSize: '1.2rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>Nivel de Conocimiento</h3>

            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: '200px' }}>
                <label style={labelStyle}>Sobre marketing digital *</label>
                <select required name="marketing_level" value={formData.marketing_level} onChange={handleChange} style={inputStyle}>
                  <option value="">Selecciona</option>
                  <option value="Cero">Cero</option>
                  <option value="Lo basico">Lo básico</option>
                  <option value="Un poco mas que basico">Un poco más que básico</option>
                  <option value="Experto">Experto</option>
                </select>
              </div>
              <div style={{ flex: 1, minWidth: '200px' }}>
                <label style={labelStyle}>Sobre Inteligencia artificial *</label>
                <select required name="ai_level" value={formData.ai_level} onChange={handleChange} style={inputStyle}>
                  <option value="">Selecciona</option>
                  <option value="Cero">Cero</option>
                  <option value="Lo basico">Lo básico</option>
                  <option value="Un poco mas que basico">Un poco más que básico</option>
                  <option value="Experto">Experto</option>
                </select>
              </div>
              <div style={{ flex: 1, minWidth: '200px' }}>
                <label style={labelStyle}>Sobre ventas *</label>
                <select required name="sales_level" value={formData.sales_level} onChange={handleChange} style={inputStyle}>
                  <option value="">Selecciona</option>
                  <option value="Cero">Cero</option>
                  <option value="Lo basico">Lo básico</option>
                  <option value="Un poco mas que basico">Un poco más que básico</option>
                  <option value="Experto">Experto</option>
                </select>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              style={{ 
                marginTop: '30px',
                width: '100%', 
                padding: '16px', 
                background: 'var(--color-accent)', 
                color: '#fff', 
                border: 'none', 
                borderRadius: '8px', 
                fontSize: '1.2rem', 
                fontWeight: 'bold', 
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
                transition: 'transform 0.2s',
                boxShadow: '0 4px 14px 0 rgba(193, 152, 69, 0.39)'
              }}
            >
              {loading ? 'Procesando...' : 'Completar Registro'}
            </button>
            <p style={{ textAlign: 'center', fontSize: '0.8rem', color: '#64748b', marginTop: '10px' }}>
              Al registrarte confirmas que ya realizaste el pago de tu entrada.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
