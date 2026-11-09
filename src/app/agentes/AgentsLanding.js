'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

// Datos de Ari (Coordinadora que está arriba de todos)
const COORDINATOR = {
  id: 'ari',
  name: 'Ari',
  role: 'Coordinadora General & Directora de Operaciones',
  department: 'Orquestación & Estrategia',
  badge: '🧠 Mente Maestra 24/7',
  cover: '/agentes/ari-cover.jpg',
  avatar: '/agentes/ari-avatar.jpg',
  color: 'from-amber-500 to-indigo-600',
  description: 'Recibe tus metas de negocio en notas de voz o texto. Desglosa la estrategia mensual, asigna automáticamente las tareas a los 11 especialistas y supervisa cada entrega para que nunca te detengas.',
  connectedTo: 'Enlace directo con los 11 especialistas',
  status: 'Orquestando equipo',
  sampleMessage: '🎯 Campaña de diciembre orquestada: Guiones asignados a Marco, creativos con Dalia y montaje de video con Tomás. El calendario avanza en automático.',
  time: '10:05 AM',
};

// Los 11 Agentes Especialistas que van en el carrusel en movimiento
const AGENTS = [
  {
    id: 'sofia',
    name: 'Sofia',
    role: 'Community Manager',
    category: 'Comunidad & Ventas',
    gradient: 'from-purple-500 to-pink-500',
    coverBg: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
    avatarBg: '#9333ea',
    initials: 'SO',
    description: 'Monitorea tus redes sociales, responde comentarios con tono humano y clasifica prospectos en mensajes directos para agendar llamadas o ventas.',
    connectedTo: 'Ari & Audiencia',
    sampleMessage: '💬 Respondí 48 comentarios en Instagram y clasifiqué a 9 personas interesadas listas para WhatsApp.',
    time: '10:18 AM'
  },
  {
    id: 'dalia',
    name: 'Dalia',
    role: 'Diseñadora Gráfica',
    category: 'Identidad & Creativos',
    gradient: 'from-emerald-500 to-teal-500',
    coverBg: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
    avatarBg: '#059669',
    initials: 'DA',
    description: 'Diseña portadas llamativas, carruseles de alto valor y piezas publicitarias consistentes con la paleta de colores y tipografía de tu marca.',
    connectedTo: 'Ari & Pluma',
    sampleMessage: '🎨 5 portadas de reels y 2 carruseles listos con la tipografía bold y contraste para el post de hoy.',
    time: '10:24 AM'
  },
  {
    id: 'nova',
    name: 'Nova',
    role: 'Investigador de Contenido',
    category: 'Tendencias & Nicho',
    gradient: 'from-cyan-500 to-blue-600',
    coverBg: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
    avatarBg: '#0284c7',
    initials: 'NO',
    description: 'Rastrea en tiempo real qué formatos y temas están explotando en tu nicho en TikTok, Instagram y YouTube para no improvisar nunca.',
    connectedTo: 'Ari & Valeria',
    sampleMessage: '🔍 Analicé 45 videos virales de tu sector: este ángulo de automatización tiene 3.8x más engagement.',
    time: '10:31 AM'
  },
  {
    id: 'valeria',
    name: 'Valeria',
    role: 'Adaptador de Contenido y Ganchos Virales',
    category: 'Retención & Hooks',
    gradient: 'from-amber-500 to-orange-600',
    coverBg: 'linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)',
    avatarBg: '#d97706',
    initials: 'VA',
    description: 'Transforma cualquier idea en ganchos psicológicos de alta retención para atrapar la atención en los primeros 3 segundos del video.',
    connectedTo: 'Nova & Marco',
    sampleMessage: '⚡ Creé 10 variaciones de ganchos de alta curiosidad negativa para el guion de Nova. Recomiendo el #2.',
    time: '10:45 AM'
  },
  {
    id: 'marco',
    name: 'Marco',
    role: 'Guionista',
    category: 'Estructura & Storytelling',
    gradient: 'from-blue-600 to-indigo-700',
    coverBg: 'linear-gradient(135deg, #2563eb 0%, #4338ca 100%)',
    avatarBg: '#1d4ed8',
    initials: 'MA',
    description: 'Redacta los guiones completos palabra por palabra listos para leer en teleprónter o cámara: apertura, cuerpo dinámico y llamado a la acción.',
    connectedTo: 'Valeria & Pluma',
    sampleMessage: '📝 Guion de 48 segundos terminado: estructura de 3 puntos sin rodeos y CTA claro al enlace.',
    time: '10:52 AM'
  },
  {
    id: 'pluma',
    name: 'Pluma',
    role: 'Copywriting',
    category: 'Persuasión & Captions',
    gradient: 'from-fuchsia-600 to-pink-600',
    coverBg: 'linear-gradient(135deg, #c026d3 0%, #db2777 100%)',
    avatarBg: '#a21caf',
    initials: 'PL',
    description: 'Escribe los copies de publicaciones, descripciones de videos y secuencias de emails con fórmulas de persuasión que motivan a tomar acción.',
    connectedTo: 'Marco & Sofia',
    sampleMessage: '✍️ Copy del post listo con la técnica PAS y llamado a comentar "EQUIPO" para enviar el bono.',
    time: '11:02 AM'
  },
  {
    id: 'martin',
    name: 'Martin',
    role: 'Montaje para Edición',
    category: 'Corte & Ritmo',
    gradient: 'from-sky-500 to-indigo-500',
    coverBg: 'linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%)',
    avatarBg: '#0369a1',
    initials: 'MR',
    description: 'Limpia el video en crudo: elimina silencios, muletillas y pausas para lograr un ritmo ágil y continuo que evita que la gente se vaya.',
    connectedTo: 'Marco & Tomás',
    sampleMessage: '✂️ Eliminé 18 segundos de pausas y tomas falsas. La estructura quedó limpia y con ritmo rápido.',
    time: '11:15 AM'
  },
  {
    id: 'tomas',
    name: 'Tomas',
    role: 'Montaje de Video',
    category: 'Efectos & Dinamismo',
    gradient: 'from-indigo-600 to-violet-700',
    coverBg: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
    avatarBg: '#4338ca',
    initials: 'TO',
    description: 'Aplica zooms de énfasis (punch-ins), transiciones cinematográficas y movimientos de cámara en sincronía con el tono de voz.',
    connectedTo: 'Martin & Rita',
    sampleMessage: '🎥 Zooms dinámicos y transiciones sincronizadas con los cambios de argumento del audio.',
    time: '11:28 AM'
  },
  {
    id: 'rita',
    name: 'Rita',
    role: 'Movimiento',
    category: 'Motion & Subtítulos',
    gradient: 'from-yellow-500 to-amber-600',
    coverBg: 'linear-gradient(135deg, #eab308 0%, #d97706 100%)',
    avatarBg: '#ca8a04',
    initials: 'RI',
    description: 'Crea subtítulos animados palabra por palabra estilo viral, destaca palabras clave con colores llamativos y añade stickers cinéticos.',
    connectedTo: 'Tomas & Lucas',
    sampleMessage: '✨ Subtítulos animados aplicados con tracking preciso y palabras clave en amarillo y blanco.',
    time: '11:39 AM'
  },
  {
    id: 'lucas',
    name: 'Lucas',
    role: 'Tomas de Apoyo',
    category: 'B-Roll & Visuales',
    gradient: 'from-emerald-600 to-green-600',
    coverBg: 'linear-gradient(135deg, #059669 0%, #16a34a 100%)',
    avatarBg: '#047857',
    initials: 'LU',
    description: 'Selecciona e inserta clips de apoyo (B-rolls), capturas y metáforas visuales cada 3-4 segundos para que el video mantenga el interés visual.',
    connectedTo: 'Rita & Sara',
    sampleMessage: '🎞️ 6 tomas de apoyo B-Roll en alta definición insertadas en los momentos clave del concepto.',
    time: '11:47 AM'
  },
  {
    id: 'sara',
    name: 'Sara',
    role: 'Acabado',
    category: 'Color, Audio & Master',
    gradient: 'from-rose-500 to-red-600',
    coverBg: 'linear-gradient(135deg, #f43f5e 0%, #dc2626 100%)',
    avatarBg: '#be123c',
    initials: 'SA',
    description: 'Realiza el pulido final de audio (ecualización y reducción de ruido), gradación de color cinematográfico y exporta en 4K listo para publicar.',
    connectedTo: 'Lucas & Ari',
    sampleMessage: '🎬 Audio calibrado a -14 LUFS con música de fondo sutil. Video exportado y listo para programar.',
    time: '11:58 AM'
  }
];

export default function AgentsLanding() {
  const [isPaused, setIsPaused] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const marqueeRef = useRef(null);

  const whatsappUrl = "https://wa.me/584123060970?text=" + encodeURIComponent(
    "Hola Eduar, quiero empezar en diciembre y tener mi asistente de IA y equipo de marketing en marcha."
  );

  return (
    <div className="agents-page-wrapper">
      
      {/* Estilos embebidos ultra-limpios para máxima compatibilidad */}
      <style jsx>{`
        .agents-page-wrapper {
          min-height: 100vh;
          background-color: #fafbfc;
          color: #0f172a;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
          overflow-x: hidden;
          position: relative;
        }

        /* Navbar */
        .agents-nav {
          position: sticky;
          top: 0;
          z-index: 50;
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(226, 232, 240, 0.8);
          padding: 16px 24px;
        }
        .nav-inner {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        /* Pill Badge */
        .pill-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          padding: 6px 14px;
          border-radius: 9999px;
          font-size: 0.875rem;
          font-weight: 600;
          color: #334155;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
        }
        .pill-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #10b981;
          box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.2);
          animation: pulse 2s infinite;
        }

        /* Hero */
        .hero-section {
          max-width: 1000px;
          margin: 0 auto;
          padding: 70px 20px 40px 20px;
          text-align: center;
        }
        .hero-title {
          font-size: clamp(2.3rem, 5.5vw, 4.2rem);
          font-weight: 850;
          line-height: 1.12;
          letter-spacing: -0.04em;
          color: #09090b;
          margin-top: 24px;
          margin-bottom: 24px;
        }
        .hero-title .highlight {
          background: linear-gradient(135deg, #1e293b 0%, #475569 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .hero-desc {
          font-size: clamp(1.1rem, 2.2vw, 1.35rem);
          color: #475569;
          line-height: 1.6;
          max-width: 780px;
          margin: 0 auto 36px auto;
          font-weight: 400;
        }

        /* Buttons */
        .btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: #09090b;
          color: #ffffff;
          padding: 16px 34px;
          border-radius: 9999px;
          font-size: 1.05rem;
          font-weight: 600;
          text-decoration: none;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.25);
          transition: all 0.25s ease;
        }
        .btn-primary:hover {
          background: #1e293b;
          transform: translateY(-2px);
          box-shadow: 0 15px 30px -5px rgba(0, 0, 0, 0.35);
        }

        /* Coordinator Section */
        .coordinator-wrapper {
          max-width: 820px;
          margin: 40px auto 20px auto;
          padding: 0 20px;
          position: relative;
        }
        .coordinator-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 28px;
          overflow: hidden;
          box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.07), 0 0 0 1px rgba(0, 0, 0, 0.02);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          position: relative;
        }
        .coordinator-card:hover {
          box-shadow: 0 25px 50px -15px rgba(0, 0, 0, 0.12);
        }
        .coord-cover {
          height: 140px;
          background: linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #4338ca 100%);
          position: relative;
          display: flex;
          align-items: flex-end;
          padding: 20px;
        }
        .coord-cover-pattern {
          position: absolute;
          inset: 0;
          opacity: 0.15;
          background-image: radial-gradient(#ffffff 1px, transparent 1px);
          background-size: 16px 16px;
        }
        .coord-body {
          padding: 24px 32px 32px 32px;
          position: relative;
        }
        .coord-avatar-row {
          display: flex;
          align-items: flex-end;
          gap: 20px;
          margin-top: -65px;
          margin-bottom: 20px;
          position: relative;
          z-index: 2;
        }
        .coord-avatar {
          width: 90px;
          height: 90px;
          border-radius: 50%;
          border: 4px solid #ffffff;
          background: linear-gradient(135deg, #6366f1, #a855f7);
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          font-weight: 800;
          box-shadow: 0 10px 20px rgba(99, 102, 241, 0.3);
          flex-shrink: 0;
          overflow: hidden;
        }

        /* Lines connecting to carousel */
        .connection-connector {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin: 15px 0 30px 0;
        }
        .connector-line {
          width: 2px;
          height: 40px;
          background: linear-gradient(to bottom, #6366f1, #94a3b8);
        }
        .connector-badge {
          background: #ffffff;
          border: 1px solid #cbd5e1;
          color: #475569;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          padding: 4px 12px;
          border-radius: 9999px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
        }

        /* Carousel Section (Vilma.ai style) */
        .marquee-container {
          width: 100%;
          overflow: hidden;
          position: relative;
          padding: 20px 0 50px 0;
          mask-image: linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%);
          -webkit-mask-image: linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%);
        }
        .marquee-track {
          display: flex;
          gap: 24px;
          width: max-content;
          animation: marqueeScroll 45s linear infinite;
        }
        .marquee-track.paused {
          animation-play-state: paused;
        }

        @keyframes marqueeScroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.5;
            transform: scale(1.15);
          }
        }

        /* Agent Card (Like Vilma.ai screenshot) */
        .agent-card {
          width: 380px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05);
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          display: flex;
          flex-direction: column;
          flex-shrink: 0;
          cursor: pointer;
        }
        .agent-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 35px -5px rgba(0, 0, 0, 0.1);
          border-color: #cbd5e1;
        }

        /* Card Cover (ready for uploaded images) */
        .card-cover {
          height: 105px;
          width: 100%;
          position: relative;
          display: flex;
          align-items: flex-end;
          padding: 12px 16px;
        }
        .card-cover-pattern {
          position: absolute;
          inset: 0;
          opacity: 0.12;
          background-image: radial-gradient(#ffffff 1px, transparent 1px);
          background-size: 14px 14px;
        }
        .card-category-pill {
          position: relative;
          z-index: 2;
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(4px);
          padding: 3px 10px;
          border-radius: 9999px;
          font-size: 0.72rem;
          font-weight: 700;
          color: #0f172a;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        /* Card Body */
        .card-body {
          padding: 16px 20px 22px 20px;
          display: flex;
          flex-direction: column;
          flex: 1;
        }
        .card-avatar-row {
          display: flex;
          align-items: flex-end;
          gap: 14px;
          margin-top: -46px;
          margin-bottom: 12px;
          position: relative;
          z-index: 2;
        }
        .card-avatar {
          width: 62px;
          height: 62px;
          border-radius: 50%;
          border: 3px solid #ffffff;
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.25rem;
          font-weight: 700;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
          flex-shrink: 0;
          overflow: hidden;
        }
        .avatar-online-dot {
          position: absolute;
          bottom: 2px;
          right: 2px;
          width: 14px;
          height: 14px;
          background: #10b981;
          border: 2px solid #ffffff;
          border-radius: 50%;
        }

        /* Slack/Zoom Style Bubble (Vilma.ai reference) */
        .chat-bubble-container {
          background: #f8fafc;
          border: 1px solid #edf2f7;
          border-radius: 16px;
          padding: 12px 14px;
          margin-top: 14px;
        }
        .chat-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 6px;
          font-size: 0.75rem;
        }
        .chat-user {
          font-weight: 700;
          color: #0284c7;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .chat-time {
          color: #94a3b8;
          font-size: 0.7rem;
        }
        .chat-bubble {
          font-size: 0.85rem;
          color: #334155;
          line-height: 1.45;
          font-style: italic;
        }

        /* Pipeline / Workflow section */
        .pipeline-section {
          max-width: 1100px;
          margin: 60px auto 40px auto;
          padding: 0 20px;
        }
        .pipeline-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 20px;
          margin-top: 30px;
        }
        .pipeline-step {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 20px;
          padding: 24px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.02);
        }
        .step-num {
          width: 34px;
          height: 34px;
          border-radius: 10px;
          background: #0f172a;
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 0.95rem;
          margin-bottom: 16px;
        }

        /* Responsive tweaks */
        @media (max-width: 768px) {
          .hero-section {
            padding: 40px 16px 20px 16px;
          }
          .agent-card {
            width: 320px;
          }
          .coord-body {
            padding: 20px;
          }
        }
      `}</style>

      {/* Top Navbar */}
      <header className="agents-nav">
        <div className="nav-inner">
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <Image 
              src="/logo.png" 
              alt="Marketing Xperience" 
              width={160} 
              height={45}
              style={{ objectFit: 'contain' }}
              priority
            />
            <span style={{ 
              background: '#f1f5f9', 
              color: '#475569', 
              fontSize: '0.75rem', 
              fontWeight: '700', 
              padding: '4px 10px', 
              borderRadius: '9999px',
              border: '1px solid #e2e8f0',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <span>⚡</span> AI Team
            </span>
          </div>

          <a 
            href={whatsappUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="btn-primary"
            style={{ padding: '10px 22px', fontSize: '0.9rem' }}
          >
            Hablar por WhatsApp
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <main>
        <section className="hero-section">
          {/* Badge */}
          <div className="pill-badge">
            <span className="pill-dot"></span>
            <span>Ecosistema de 12 Agentes de IA Interconectados</span>
          </div>

          {/* Titular exacto solicitado */}
          <h1 className="hero-title">
            Empieza en diciembre y llega a enero con tu asistente de IA y tu equipo de marketing en marcha
          </h1>

          {/* Descripción exacta solicitada */}
          <p className="hero-desc">
            Ahora podrás tener ideas ilimitadas, guiones comprobados listos, un equipo de editores, y vas a poder comunicar en automatico.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <a 
              href={whatsappUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn-primary"
            >
              <span>Activar mi Equipo de IA</span>
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
              </svg>
            </a>

            <button 
              onClick={() => {
                const el = document.getElementById('agentes-carrusel');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              style={{
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                color: '#334155',
                padding: '16px 28px',
                borderRadius: '9999px',
                fontSize: '1.05rem',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <span>Ver cómo trabajan juntos</span>
              <span>↓</span>
            </button>
          </div>
        </section>

        {/* 1. COORDINADORA (ARRIBA DE TODOS: ARI) */}
        <section className="coordinator-wrapper">
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <span style={{ 
              color: '#6366f1', 
              fontSize: '0.85rem', 
              fontWeight: '800', 
              textTransform: 'uppercase', 
              letterSpacing: '0.08em' 
            }}>
              Liderazgo & Orquestación
            </span>
            <h2 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#0f172a', marginTop: '6px' }}>
              Primero: La mente maestra que dirige todo
            </h2>
          </div>

          <div className="coordinator-card">
            {/* Foto de portada placeholder (listo para la imagen de portada de Ari) */}
            <div className="coord-cover">
              <div className="coord-cover-pattern"></div>
              <div style={{ position: 'relative', zIndex: 2, display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                <span style={{ 
                  background: 'rgba(255, 255, 255, 0.95)', 
                  color: '#1e1b4b', 
                  fontSize: '0.8rem', 
                  fontWeight: '800', 
                  padding: '4px 12px', 
                  borderRadius: '9999px' 
                }}>
                  {COORDINATOR.badge}
                </span>

                <span style={{ 
                  color: '#ffffff', 
                  fontSize: '0.85rem', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '6px',
                  background: 'rgba(0,0,0,0.3)',
                  padding: '4px 12px',
                  borderRadius: '9999px'
                }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#4ade80' }}></span>
                  {COORDINATOR.status}
                </span>
              </div>
            </div>

            {/* Cuerpo de la card de Ari */}
            <div className="coord-body">
              <div className="coord-avatar-row">
                <div className="coord-avatar" style={{ position: 'relative' }}>
                  {/* Avatar con foto o iniciales */}
                  <span>AR</span>
                  <div className="avatar-online-dot"></div>
                </div>

                <div>
                  <h3 style={{ fontSize: '1.6rem', fontWeight: '800', color: '#09090b', lineHeight: '1.2' }}>
                    {COORDINATOR.name} <span style={{ fontSize: '1rem', fontWeight: '600', color: '#6366f1' }}>• La Coordinadora</span>
                  </h3>
                  <p style={{ color: '#64748b', fontSize: '0.95rem', fontWeight: '500' }}>
                    {COORDINATOR.role}
                  </p>
                </div>
              </div>

              <p style={{ color: '#334155', fontSize: '1.05rem', lineHeight: '1.6', marginBottom: '18px' }}>
                {COORDINATOR.description}
              </p>

              {/* Chat bubble como en el pantallazo de Slack/Vilma */}
              <div className="chat-bubble-container" style={{ borderLeft: '4px solid #6366f1' }}>
                <div className="chat-header">
                  <span className="chat-user">
                    <span>👑</span> Ari a Todo el Equipo
                  </span>
                  <span className="chat-time">{COORDINATOR.time}</span>
                </div>
                <div className="chat-bubble">
                  {COORDINATOR.sampleMessage}
                </div>
              </div>
            </div>
          </div>

          {/* Conector visual hacia los 11 agentes */}
          <div className="connection-connector">
            <div className="connector-line"></div>
            <div className="connector-badge">
              ↓ Interconectados en tiempo real con 11 especialistas ↓
            </div>
            <div className="connector-line"></div>
          </div>
        </section>

        {/* 2. CARRUSEL EN MOVIMIENTO (LOS 11 AGENTES - ESTILO VILMA.AI) */}
        <section id="agentes-carrusel" style={{ padding: '20px 0 60px 0' }}>
          <div style={{ maxWidth: '1000px', margin: '0 auto 24px auto', padding: '0 20px', textAlign: 'center' }}>
            <div className="pill-badge" style={{ marginBottom: '12px' }}>
              <span>♡</span>
              <span>Especialistas en Movimiento</span>
            </div>
            <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)', fontWeight: '850', color: '#09090b', letterSpacing: '-0.03em' }}>
              Tu equipo de marketing en marcha
            </h2>
            <p style={{ color: '#64748b', fontSize: '1.1rem', maxWidth: '650px', margin: '0 auto' }}>
              Cada agente domina su rol al 100% y se pasan los entregables entre ellos de forma instantánea.
            </p>
            
            {/* Controles para pausar o explorar */}
            <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px' }}>
              <button
                onClick={() => setIsPaused(!isPaused)}
                style={{
                  background: isPaused ? '#0f172a' : '#ffffff',
                  color: isPaused ? '#ffffff' : '#475569',
                  border: '1px solid #cbd5e1',
                  borderRadius: '9999px',
                  padding: '6px 14px',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <span>{isPaused ? '▶ Reanudar movimiento' : '⏸ Pausar para leer'}</span>
              </button>
              <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                (Pasa el cursor por encima para pausar automáticamente)
              </span>
            </div>
          </div>

          {/* Track en movimiento infinito */}
          <div 
            className="marquee-container"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <div 
              ref={marqueeRef}
              className={`marquee-track ${isPaused ? 'paused' : ''}`}
            >
              {/* Duplicamos la lista para crear el bucle infinito sin saltos */}
              {[...AGENTS, ...AGENTS].map((agent, index) => (
                <div 
                  key={`${agent.id}-${index}`} 
                  className="agent-card"
                  onClick={() => setSelectedAgent(agent)}
                >
                  {/* Foto de portada de cada agente (listo para conectar sus fotos) */}
                  <div 
                    className="card-cover"
                    style={{ background: agent.coverBg }}
                  >
                    <div className="card-cover-pattern"></div>
                    <span className="card-category-pill">
                      {agent.category}
                    </span>
                  </div>

                  {/* Cuerpo del perfil del agente */}
                  <div className="card-body">
                    <div className="card-avatar-row">
                      <div 
                        className="card-avatar"
                        style={{ background: agent.avatarBg, position: 'relative' }}
                      >
                        <span>{agent.initials}</span>
                        <div className="avatar-online-dot"></div>
                      </div>

                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <h4 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f172a' }}>
                            {agent.name}
                          </h4>
                          <span style={{ 
                            fontSize: '0.68rem', 
                            color: '#10b981', 
                            fontWeight: '700',
                            background: '#ecfdf5',
                            padding: '2px 8px',
                            borderRadius: '9999px',
                            border: '1px solid #a7f3d0'
                          }}>
                            Activo 24/7
                          </span>
                        </div>
                        <p style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: '600' }}>
                          {agent.role}
                        </p>
                      </div>
                    </div>

                    {/* Descripción del agente */}
                    <p style={{ color: '#334155', fontSize: '0.92rem', lineHeight: '1.5', flex: 1 }}>
                      {agent.description}
                    </p>

                    {/* Conexión */}
                    <div style={{ 
                      marginTop: '12px', 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '6px',
                      fontSize: '0.75rem',
                      color: '#6366f1',
                      fontWeight: '700'
                    }}>
                      <span>🔗</span>
                      <span>Conectado con: {agent.connectedTo}</span>
                    </div>

                    {/* Chat de entregable en vivo (estilo Vilma.ai) */}
                    <div className="chat-bubble-container">
                      <div className="chat-header">
                        <span className="chat-user">
                          {agent.name} a Todos
                        </span>
                        <span className="chat-time">{agent.time}</span>
                      </div>
                      <div className="chat-bubble">
                        "{agent.sampleMessage}"
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 3. CÓMO FUNCIONA EL FLUJO INTERCONECTADO */}
        <section className="pipeline-section">
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <span style={{ color: '#0284c7', fontSize: '0.85rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Flujo de Trabajo Automatizado
            </span>
            <h3 style={{ fontSize: '2rem', fontWeight: '850', color: '#0f172a', marginTop: '6px' }}>
              Así se conectan tus agentes de principio a fin
            </h3>
          </div>

          <div className="pipeline-grid">
            <div className="pipeline-step">
              <div className="step-num">1</div>
              <h4 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#0f172a', marginBottom: '8px' }}>
                1. Instrucción & Estrategia
              </h4>
              <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: '1.5' }}>
                Le hablas a <strong>Ari</strong>. Ella activa a <strong>Nova</strong> y <strong>Valeria</strong> para encontrar las ideas más virales y definir ganchos psicológicos.
              </p>
            </div>

            <div className="pipeline-step">
              <div className="step-num">2</div>
              <h4 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#0f172a', marginBottom: '8px' }}>
                2. Redacción & Creativos
              </h4>
              <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: '1.5' }}>
                <strong>Marco</strong> escribe los guiones listos para cámara. <strong>Pluma</strong> redacta copys de alta respuesta y <strong>Dalia</strong> diseña los recursos visuales.
              </p>
            </div>

            <div className="pipeline-step">
              <div className="step-num">3</div>
              <h4 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#0f172a', marginBottom: '8px' }}>
                3. Montaje & Postproducción
              </h4>
              <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: '1.5' }}>
                El equipo audiovisual entra en acción: <strong>Martin</strong> corta, <strong>Tomás</strong> monta, <strong>Rita</strong> anima subtítulos, <strong>Lucas</strong> agrega B-Rolls y <strong>Sara</strong> masteriza.
              </p>
            </div>

            <div className="pipeline-step">
              <div className="step-num">4</div>
              <h4 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#0f172a', marginBottom: '8px' }}>
                4. Publicación & Conversión
              </h4>
              <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: '1.5' }}>
                Tu contenido sale al aire en tiempo récord y <strong>Sofia</strong> modera comentarios y atiende los DMs para convertir visualizaciones en ventas.
              </p>
            </div>
          </div>
        </section>

        {/* 4. SECCIÓN DE CONVERSIÓN FINAL */}
        <section style={{ 
          maxWidth: '960px', 
          margin: '60px auto 90px auto', 
          padding: '0 20px' 
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #09090b 0%, #1e293b 100%)',
            borderRadius: '32px',
            padding: '50px 30px',
            color: '#ffffff',
            textAlign: 'center',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              top: '-100px',
              right: '-100px',
              width: '300px',
              height: '300px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(99, 102, 241, 0.25) 0%, transparent 70%)',
              pointerEvents: 'none'
            }}></div>

            <span style={{ 
              background: 'rgba(255, 255, 255, 0.1)', 
              color: '#facc15', 
              fontSize: '0.85rem', 
              fontWeight: '700', 
              padding: '6px 16px', 
              borderRadius: '9999px',
              border: '1px solid rgba(250, 204, 21, 0.2)',
              display: 'inline-block',
              marginBottom: '20px'
            }}>
              🚀 Oportunidad Diciembre / Enero
            </span>

            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: '850', lineHeight: '1.15', marginBottom: '16px' }}>
              No esperes a enero para empezar desde cero
            </h2>

            <p style={{ fontSize: '1.15rem', color: '#cbd5e1', maxWidth: '650px', margin: '0 auto 36px auto', lineHeight: '1.6' }}>
              Deja a tu asistente de IA y a tu equipo de 11 especialistas listos durante diciembre para arrancar el año comunicando y facturando en automático.
            </p>

            <a 
              href={whatsappUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                background: '#ffffff',
                color: '#09090b',
                padding: '18px 40px',
                borderRadius: '9999px',
                fontSize: '1.15rem',
                fontWeight: '700',
                textDecoration: 'none',
                boxShadow: '0 10px 25px rgba(255, 255, 255, 0.2)',
                transition: 'all 0.3s ease'
              }}
            >
              <span>Quiero Activar Mi Equipo por WhatsApp</span>
              <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
              </svg>
            </a>
          </div>
        </section>
      </main>

      {/* Footer minimalista */}
      <footer style={{ 
        borderTop: '1px solid #e2e8f0', 
        padding: '30px 20px', 
        textAlign: 'center', 
        color: '#64748b', 
        fontSize: '0.875rem' 
      }}>
        <p>© {new Date().getFullYear()} Marketing Xperience. Ecosistema de Agentes de Inteligencia Artificial.</p>
      </footer>
    </div>
  );
}
