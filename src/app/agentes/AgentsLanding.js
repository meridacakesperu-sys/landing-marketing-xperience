'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

// Datos de Ari (Coordinadora que está arriba de todos)
const COORDINATOR = {
  id: 'ari',
  name: 'Ari',
  role: 'Coordinadora General & Directora de Operaciones',
  department: 'Orquestación & Estrategia',
  badge: '👑 Coordinadora del Equipo',
  image: '/agentes/12_Ari_Coordinadora_Equipo.png',
  gradient: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #4338ca 100%)',
  colorTheme: '#6366f1',
  description: 'Recibe tus metas de negocio en notas de voz o texto. Desglosa la estrategia mensual, asigna automáticamente las tareas a los 11 especialistas y supervisa cada entrega para que nunca te detengas.',
  connectedTo: 'Enlace directo con los 11 especialistas',
  status: 'Orquestando equipo 24/7',
  sampleMessage: '🎯 Campaña de diciembre orquestada: Guiones asignados a Marco, creativos con Dalia y montaje de video con Tomás y Rita. El calendario avanza en automático.',
  time: '10:05 AM',
};

// Los 11 Agentes Especialistas que van en el carrusel en movimiento
const AGENTS = [
  {
    id: 'sofia',
    name: 'Sofia',
    role: 'Community Manager',
    category: 'Comunidad & Ventas',
    image: '/agentes/01_Sofia_Community_Manager.png',
    coverBg: 'linear-gradient(180deg, #f3e8ff 0%, #fae8ff 100%)',
    accentColor: '#a855f7',
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
    image: '/agentes/02_Dalia_Disenadora.png',
    coverBg: 'linear-gradient(180deg, #ecfdf5 0%, #ccfbf1 100%)',
    accentColor: '#10b981',
    description: 'Diseña portadas llamativas, carruseles de alto valor y piezas publicitarias consistentes con la paleta de colores y tipografía de tu marca.',
    connectedTo: 'Ari & Pluma',
    sampleMessage: '🎨 5 portadas de reels y 2 carruseles listos con tipografía bold y contraste para el post de hoy.',
    time: '10:24 AM'
  },
  {
    id: 'nova',
    name: 'Nova',
    role: 'Investigador de Contenido',
    category: 'Tendencias & Nicho',
    image: '/agentes/03_Nova_Investigador_Contenido.png',
    coverBg: 'linear-gradient(180deg, #e0f2fe 0%, #dbeafe 100%)',
    accentColor: '#0284c7',
    description: 'Rastrea en tiempo real qué formatos y temas están explotando en tu nicho en TikTok, Instagram y YouTube para no improvisar nunca.',
    connectedTo: 'Ari & Valeria',
    sampleMessage: '🔍 Analicé 45 videos virales de tu sector: este ángulo de automatización tiene 3.8x más engagement.',
    time: '10:31 AM'
  },
  {
    id: 'valeria',
    name: 'Valeria',
    role: 'Ganchos Virales & Retención',
    category: 'Retención & Hooks',
    image: '/agentes/04_Valeria_Ganchos_Virales.png',
    coverBg: 'linear-gradient(180deg, #fef3c7 0%, #ffedd5 100%)',
    accentColor: '#ea580c',
    description: 'Transforma cualquier idea en ganchos psicológicos de alta retención para atrapar la atención en los primeros 3 segundos del video.',
    connectedTo: 'Nova & Marco',
    sampleMessage: '⚡ Creé 10 variaciones de ganchos de alta curiosidad negativa para el guion de Nova. Recomiendo el #2.',
    time: '10:45 AM'
  },
  {
    id: 'marco',
    name: 'Marco',
    role: 'Guionista Audiovisual',
    category: 'Estructura & Storytelling',
    image: '/agentes/05_Marco_Guionista.png',
    coverBg: 'linear-gradient(180deg, #eff6ff 0%, #e0e7ff 100%)',
    accentColor: '#2563eb',
    description: 'Redacta los guiones completos palabra por palabra listos para leer en teleprónter o cámara: apertura, cuerpo dinámico y llamado a la acción.',
    connectedTo: 'Valeria & Pluma',
    sampleMessage: '📝 Guion de 48 segundos terminado: estructura de 3 puntos sin rodeos y CTA claro al enlace.',
    time: '10:52 AM'
  },
  {
    id: 'pluma',
    name: 'Pluma',
    role: 'Copywriting de Conversión',
    category: 'Persuasión & Captions',
    image: '/agentes/06_Pluma_Copywriting.png',
    coverBg: 'linear-gradient(180deg, #fae8ff 0%, #fce7f3 100%)',
    accentColor: '#c026d3',
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
    image: '/agentes/07_Martin_Montaje_Edicion.png',
    coverBg: 'linear-gradient(180deg, #e0f2fe 0%, #e0e7ff 100%)',
    accentColor: '#0ea5e9',
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
    image: '/agentes/08_Tomas_Montaje_Video.png',
    coverBg: 'linear-gradient(180deg, #e0e7ff 0%, #ede9fe 100%)',
    accentColor: '#4f46e5',
    description: 'Aplica zooms de énfasis (punch-ins), transiciones cinematográficas y movimientos de cámara en sincronía con el tono de voz.',
    connectedTo: 'Martin & Rita',
    sampleMessage: '🎥 Zooms dinámicos y transiciones sincronizadas con los cambios de argumento del audio.',
    time: '11:28 AM'
  },
  {
    id: 'rita',
    name: 'Rita',
    role: 'Movimiento & Kinetic Text',
    category: 'Motion & Subtítulos',
    image: '/agentes/09_Rita_Movimiento.png',
    coverBg: 'linear-gradient(180deg, #fef9c3 0%, #fef3c7 100%)',
    accentColor: '#d97706',
    description: 'Crea subtítulos animados palabra por palabra estilo viral, destaca palabras clave con colores llamativos y añade stickers cinéticos.',
    connectedTo: 'Tomas & Lucas',
    sampleMessage: '✨ Subtítulos animados aplicados con tracking preciso y palabras clave en amarillo y blanco.',
    time: '11:39 AM'
  },
  {
    id: 'lucas',
    name: 'Lucas',
    role: 'Tomas de Apoyo & B-Roll',
    category: 'B-Roll & Visuales',
    image: '/agentes/10_Lucas_Tomas_de_Apoyo.png',
    coverBg: 'linear-gradient(180deg, #dcfce7 0%, #d1fae5 100%)',
    accentColor: '#059669',
    description: 'Selecciona e inserta clips de apoyo (B-rolls), capturas y metáforas visuales cada 3-4 segundos para que el video mantenga el interés visual.',
    connectedTo: 'Rita & Sara',
    sampleMessage: '🎞️ 6 tomas de apoyo B-Roll en alta definición insertadas en los momentos clave del concepto.',
    time: '11:47 AM'
  },
  {
    id: 'sara',
    name: 'Sara',
    role: 'Acabado & Master Final',
    category: 'Color, Audio & Master',
    image: '/agentes/11_Sara_Acabado.png',
    coverBg: 'linear-gradient(180deg, #ffe4e6 0%, #fee2e2 100%)',
    accentColor: '#e11d48',
    description: 'Realiza el pulido final de audio (ecualización y reducción de ruido), gradación de color cinematográfico y exporta en 4K listo para publicar.',
    connectedTo: 'Lucas & Ari',
    sampleMessage: '🎬 Audio calibrado a -14 LUFS con música de fondo sutil. Video exportado y listo para programar.',
    time: '11:58 AM'
  }
];

// Conversación cotidiana interactiva de WhatsApp (Asistente Personal de IA)
const WHATSAPP_CONVERSATION = [
  // 1. Mensaje del usuario sobre su agenda
  {
    id: 'msg-1',
    sender: 'user',
    text: '¡Hola Mia! 👋 ¿Qué reuniones y pendientes tengo para hoy en mi calendario?',
    time: '9:15 AM'
  },
  // 2. Respuesta con recordatorio y link de Google Meet
  {
    id: 'msg-2',
    sender: 'assistant',
    text: '¡Buenos días! 🗓️ Tienes 2 compromisos programados para hoy:\n\n• 11:30 AM — Revisión de copies con Pluma y Sofía.\n• 3:30 PM — Reunión con María para afinar el lanzamiento.',
    meetCard: {
      title: 'Reunión con María (Lanzamiento)',
      time: 'Hoy, 3:30 PM • Google Meet',
      link: 'meet.google.com/mar-ia-meet'
    },
    footerNote: '🔔 Te avisaré 10 minutos antes. ¿Quieres que prepare algo?',
    time: '9:15 AM'
  },
  // 3. Usuario reporta un gasto
  {
    id: 'msg-3',
    sender: 'user',
    text: 'Anota $45 que acabo de pagar en el almuerzo de trabajo con un cliente.',
    time: '9:16 AM'
  },
  // 4. Asistente registra el gasto en tiempo real
  {
    id: 'msg-4',
    sender: 'assistant',
    text: '✅ Registrado de inmediato en tu control financiero de este mes:',
    expenseCard: {
      amount: '$45.00 USD',
      category: 'Alimentación & Reuniones de Negocio',
      monthTotal: '$310.00 USD acumulados en el mes',
      status: 'Sincronizado en Google Sheets en vivo 📊'
    },
    footerNote: 'Tu presupuesto mensual sigue en orden.',
    time: '9:16 AM'
  },
  // 5. Usuario solicita resumen de artículo
  {
    id: 'msg-5',
    sender: 'user',
    text: '¿Pudiste revisar el artículo de tendencias de IA que te mandé? Sácame los 3 puntos clave.',
    time: '9:17 AM'
  },
  // 6. Asistente entrega el resumen ejecutivo
  {
    id: 'msg-6',
    sender: 'assistant',
    text: '📄 ¡Revisado! Aquí tienes los 3 puntos clave resumidos:',
    summaryPoints: [
      'La automatización sin código creció 4x este año en negocios digitales.',
      'Los videos cortos con ganchos psicológicos duplican la retención de audiencia.',
      'Empresas con asistentes IA responden en < 1 min y cierran 60% más ventas.'
    ],
    footerNote: '¿Quieres que le pida a Marco que arme un guion para video con el punto #2? 🚀',
    time: '9:17 AM'
  }
];

export default function AgentsLanding() {
  const [isPaused, setIsPaused] = useState(false);
  const marqueeRef = useRef(null);

  // Estados para la simulación interactiva de WhatsApp en tiempo real
  const [currentStep, setCurrentStep] = useState(0);
  const [isAssistantTyping, setIsAssistantTyping] = useState(false);
  const [activeMessages, setActiveMessages] = useState([WHATSAPP_CONVERSATION[0]]);
  const [isChatPaused, setIsChatPaused] = useState(false);
  const chatBodyRef = useRef(null);

  // Simulación en tiempo real paso a paso
  useEffect(() => {
    if (isChatPaused) return;

    let timer;
    switch (currentStep) {
      case 0:
        // Mensaje inicial del usuario (pregunta por calendario)
        setActiveMessages([WHATSAPP_CONVERSATION[0]]);
        setIsAssistantTyping(false);
        timer = setTimeout(() => setCurrentStep(1), 1200);
        break;
      case 1:
        // El asistente empieza a escribir...
        setIsAssistantTyping(true);
        timer = setTimeout(() => setCurrentStep(2), 1600);
        break;
      case 2:
        // Llega la respuesta del asistente con recordatorio y link de Meet
        setIsAssistantTyping(false);
        setActiveMessages([WHATSAPP_CONVERSATION[0], WHATSAPP_CONVERSATION[1]]);
        timer = setTimeout(() => setCurrentStep(3), 3200);
        break;
      case 3:
        // El usuario pide anotar un gasto
        setActiveMessages([
          WHATSAPP_CONVERSATION[0],
          WHATSAPP_CONVERSATION[1],
          WHATSAPP_CONVERSATION[2]
        ]);
        timer = setTimeout(() => setCurrentStep(4), 1300);
        break;
      case 4:
        // El asistente escribe confirmación de gasto...
        setIsAssistantTyping(true);
        timer = setTimeout(() => setCurrentStep(5), 1500);
        break;
      case 5:
        // Llega el registro del gasto en tiempo real
        setIsAssistantTyping(false);
        setActiveMessages([
          WHATSAPP_CONVERSATION[0],
          WHATSAPP_CONVERSATION[1],
          WHATSAPP_CONVERSATION[2],
          WHATSAPP_CONVERSATION[3]
        ]);
        timer = setTimeout(() => setCurrentStep(6), 3200);
        break;
      case 6:
        // El usuario pide resumen de un artículo
        setActiveMessages([
          WHATSAPP_CONVERSATION[0],
          WHATSAPP_CONVERSATION[1],
          WHATSAPP_CONVERSATION[2],
          WHATSAPP_CONVERSATION[3],
          WHATSAPP_CONVERSATION[4]
        ]);
        timer = setTimeout(() => setCurrentStep(7), 1400);
        break;
      case 7:
        // El asistente analiza y escribe los 3 puntos...
        setIsAssistantTyping(true);
        timer = setTimeout(() => setCurrentStep(8), 1900);
        break;
      case 8:
        // Llega el resumen ejecutivo del artículo
        setIsAssistantTyping(false);
        setActiveMessages(WHATSAPP_CONVERSATION);
        // Espera 10 segundos para que el usuario pueda leer con calma antes de reiniciar
        timer = setTimeout(() => setCurrentStep(9), 10000);
        break;
      case 9:
        // Reinicio suave del bucle
        setActiveMessages([]);
        setIsAssistantTyping(false);
        timer = setTimeout(() => setCurrentStep(0), 600);
        break;
      default:
        break;
    }

    return () => clearTimeout(timer);
  }, [currentStep, isChatPaused]);

  // Auto-scroll del chat de WhatsApp cada vez que entra un mensaje o empieza a escribir
  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [activeMessages, isAssistantTyping]);

  const restartSimulation = () => {
    setActiveMessages([]);
    setIsAssistantTyping(false);
    setCurrentStep(0);
  };

  const whatsappUrl = "https://wa.me/584123060970?text=" + encodeURIComponent(
    "Hola Eduar, quiero los detalles de inscripción para el Master de Inteligencia Artificial y crear mi ecosistema de agentes."
  );

  return (
    <div className="agents-page-wrapper">
      
      {/* Estilos embebidos modernos y minimalistas */}
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
          background: rgba(255, 255, 255, 0.92);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          border-bottom: 1px solid rgba(226, 232, 240, 0.85);
          padding: 14px 24px;
        }
        .nav-inner {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        /* Hero con Fondo Neural y Foto de Eduar */
        .hero-wrapper {
          position: relative;
          overflow: hidden;
          background: #ffffff;
          border-bottom: 1px solid rgba(226, 232, 240, 0.7);
          min-height: 560px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .hero-neural-bg {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 1;
          opacity: 0.75;
        }
        .hero-eduar-bg {
          position: absolute;
          right: 0;
          bottom: 0;
          height: 112%;
          max-height: 880px;
          pointer-events: none;
          z-index: 2;
          display: flex;
          align-items: flex-end;
          opacity: 0.32;
          mask-image: linear-gradient(to left, black 70%, transparent 100%);
          -webkit-mask-image: linear-gradient(to left, black 70%, transparent 100%);
        }
        .eduar-bg-img {
          height: 100%;
          width: auto;
          max-width: 720px;
          object-fit: contain;
          object-position: right bottom;
          filter: contrast(1.1) drop-shadow(0 0 40px rgba(59, 130, 246, 0.2));
        }
        .hero-content {
          position: relative;
          z-index: 10;
          max-width: 980px;
          margin: 0 auto;
          padding: 55px 20px 45px 20px;
          text-align: center;
        }
        .hero-logo-box {
          display: inline-block;
          margin-bottom: 20px;
          max-width: 200px;
          transition: transform 0.3s ease;
        }
        .hero-logo-box:hover {
          transform: scale(1.03);
        }
        .hero-title {
          font-size: clamp(2.4rem, 5.5vw, 4.1rem);
          font-weight: 850;
          line-height: 1.12;
          letter-spacing: -0.04em;
          color: #09090b;
          margin-bottom: 16px;
        }
        .hero-subtitle {
          font-size: clamp(1.35rem, 2.8vw, 2.1rem);
          font-weight: 750;
          line-height: 1.25;
          letter-spacing: -0.025em;
          color: #1e1b4b;
          margin-bottom: 20px;
        }
        .hero-desc {
          font-size: clamp(1.05rem, 1.8vw, 1.22rem);
          color: #475569;
          line-height: 1.65;
          max-width: 800px;
          margin: 0 auto 36px auto;
          font-weight: 400;
        }

        /* Buttons */
        .btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          background: #09090b;
          color: #ffffff;
          padding: 18px 36px;
          border-radius: 9999px;
          font-size: 1.05rem;
          font-weight: 700;
          text-decoration: none;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.25);
          transition: all 0.25s ease;
        }
        .btn-primary:hover {
          background: #1e293b;
          transform: translateY(-2px);
          box-shadow: 0 15px 30px -5px rgba(0, 0, 0, 0.35);
        }

        /* Coordinator Section (Ari) */
        .coordinator-wrapper {
          max-width: 900px;
          margin: 40px auto 20px auto;
          padding: 0 20px;
          position: relative;
        }
        .coordinator-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 28px;
          overflow: hidden;
          box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(0, 0, 0, 0.02);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          display: flex;
          flex-direction: column;
        }
        .coord-top-banner {
          background: linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #4338ca 100%);
          padding: 16px 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: #ffffff;
        }
        .coord-content-row {
          display: flex;
          flex-direction: row;
          align-items: center;
          padding: 30px;
          gap: 30px;
        }
        .coord-photo-wrapper {
          width: 200px;
          height: 240px;
          position: relative;
          border-radius: 20px;
          overflow: hidden;
          background: linear-gradient(180deg, #ede9fe 0%, #dbeafe 100%);
          flex-shrink: 0;
          box-shadow: 0 12px 24px -6px rgba(99, 102, 241, 0.25);
          border: 2px solid rgba(99, 102, 241, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 8px;
        }
        .coord-info {
          flex: 1;
        }

        /* Connection connector */
        .connection-connector {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin: 25px 0 35px 0;
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
          font-size: 0.78rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          padding: 6px 16px;
          border-radius: 9999px;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.04);
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

        /* Agent Card (Estilo Perfil Moderno) */
        .agent-card {
          width: 350px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05);
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          display: flex;
          flex-direction: column;
          flex-shrink: 0;
        }
        .agent-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 35px -5px rgba(0, 0, 0, 0.1);
          border-color: #cbd5e1;
        }

        /* Escenario de personaje Pixar 3D (CERO distorsión garantizada por width: auto + height: auto + max-height) */
        .card-stage {
          height: 220px;
          width: 100%;
          position: relative;
          display: flex;
          align-items: flex-end;
          justify-content: center;
          padding: 0 16px 6px 16px;
          overflow: hidden;
        }
        .character-img {
          max-height: 205px;
          max-width: 100%;
          width: auto !important;
          height: auto !important;
          object-fit: contain !important;
          display: block;
          filter: drop-shadow(0 10px 14px rgba(0, 0, 0, 0.12));
          transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .agent-card:hover .character-img {
          transform: scale(1.05) translateY(-3px);
        }

        .card-category-pill {
          position: absolute;
          top: 14px;
          left: 14px;
          z-index: 2;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(6px);
          padding: 4px 12px;
          border-radius: 9999px;
          font-size: 0.72rem;
          font-weight: 700;
          color: #0f172a;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
          border: 1px solid rgba(226, 232, 240, 0.8);
        }

        /* Card Body */
        .card-body {
          padding: 18px 20px 22px 20px;
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        /* Perfil Header con Mini-Avatar Circular */
        .profile-header-row {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 12px;
        }
        .profile-avatar-circle {
          width: 46px;
          height: 46px;
          border-radius: 50%;
          border: 2px solid #ffffff;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
          overflow: hidden;
          position: relative;
          flex-shrink: 0;
          background: #f1f5f9;
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

        /* Sección: Asistente Personal en WhatsApp (Simulación Interactiva) */
        .assistant-section {
          max-width: 1000px;
          margin: 60px auto 80px auto;
          padding: 0 20px;
        }
        .assistant-header {
          max-width: 780px;
          margin: 0 auto 36px auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }
        .assistant-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #ecfdf5;
          color: #047857;
          border: 1px solid #a7f3d0;
          padding: 6px 16px;
          border-radius: 9999px;
          font-size: 0.82rem;
          font-weight: 750;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          width: fit-content;
          margin-bottom: 16px;
        }
        .assistant-title {
          font-size: clamp(2rem, 3.8vw, 2.75rem);
          font-weight: 850;
          color: #0f172a;
          line-height: 1.15;
          letter-spacing: -0.03em;
          margin-bottom: 16px;
        }
        .assistant-desc {
          font-size: 1.15rem;
          color: #475569;
          line-height: 1.6;
          margin-bottom: 0;
        }

        /* Maqueta del Teléfono Móvil (WhatsApp Mockup) */
        .phone-mockup-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
        .phone-chassis {
          width: 100%;
          max-width: 410px;
          background: #0f172a;
          border-radius: 46px;
          padding: 12px;
          box-shadow: 0 25px 60px -15px rgba(15, 23, 42, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.12), inset 0 0 0 2px rgba(255, 255, 255, 0.08);
          position: relative;
        }
        .phone-notch {
          position: absolute;
          top: 18px;
          left: 50%;
          transform: translateX(-50%);
          width: 95px;
          height: 22px;
          background: #0f172a;
          border-radius: 20px;
          z-index: 30;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        .phone-camera-lens {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #1e293b;
          box-shadow: inset 0 0 2px #38bdf8;
        }
        .phone-speaker {
          width: 34px;
          height: 4px;
          border-radius: 4px;
          background: #1e293b;
        }

        .phone-screen {
          background-color: #efeae2;
          background-image: radial-gradient(#d1d7db 0.8px, transparent 0.8px);
          background-size: 16px 16px;
          border-radius: 36px;
          overflow: hidden;
          height: 600px;
          display: flex;
          flex-direction: column;
          position: relative;
          box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.08);
        }

        /* Barra de WhatsApp Superior */
        .wa-header {
          background: #008069;
          color: #ffffff;
          padding: 34px 16px 12px 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-shrink: 0;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
          z-index: 10;
        }
        .wa-header-left {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .wa-back-btn {
          font-size: 1.1rem;
          color: #ffffff;
          opacity: 0.9;
        }
        .wa-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #ffffff;
          border: 2px solid rgba(255, 255, 255, 0.8);
          overflow: hidden;
          position: relative;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
        }
        .wa-user-details {
          display: flex;
          flex-direction: column;
        }
        .wa-user-name {
          font-size: 0.95rem;
          font-weight: 700;
          color: #ffffff;
          line-height: 1.2;
        }
        .wa-user-status {
          font-size: 0.72rem;
          color: #cbfbe2;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 5px;
        }
        .wa-header-icons {
          display: flex;
          align-items: center;
          gap: 16px;
          color: #ffffff;
          font-size: 0.95rem;
          opacity: 0.9;
        }

        /* Cuerpo del Chat con Mensajes */
        .wa-chat-body {
          flex: 1;
          padding: 14px 12px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 12px;
          scroll-behavior: smooth;
        }
        .wa-chat-body::-webkit-scrollbar {
          width: 4px;
        }
        .wa-chat-body::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.15);
          border-radius: 4px;
        }

        .wa-date-pill {
          align-self: center;
          background: rgba(255, 255, 255, 0.92);
          color: #54656f;
          font-size: 0.68rem;
          font-weight: 700;
          padding: 4px 12px;
          border-radius: 8px;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08);
          margin-bottom: 4px;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        /* Burbujas de chat */
        .wa-msg {
          display: flex;
          flex-direction: column;
          max-width: 86%;
          animation: waFadeIn 0.25s ease-out;
        }
        @keyframes waFadeIn {
          from {
            opacity: 0;
            transform: translateY(6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .wa-msg.user {
          align-self: flex-end;
          background: #d9fdd3;
          color: #111b21;
          border-radius: 12px 12px 2px 12px;
          padding: 9px 12px;
          box-shadow: 0 1px 1.5px rgba(0, 0, 0, 0.12);
        }
        .wa-msg.assistant {
          align-self: flex-start;
          background: #ffffff;
          color: #111b21;
          border-radius: 12px 12px 12px 2px;
          padding: 9px 12px;
          box-shadow: 0 1px 1.5px rgba(0, 0, 0, 0.12);
        }

        .wa-msg-text {
          font-size: 0.86rem;
          line-height: 1.45;
          white-space: pre-line;
        }
        .wa-msg-meta {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 4px;
          margin-top: 4px;
          font-size: 0.65rem;
          color: #667781;
        }

        /* Tarjetas interactivas dentro de los mensajes del asistente */
        .wa-card-meet {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-left: 4px solid #1a73e8;
          border-radius: 10px;
          padding: 8px 10px;
          margin: 8px 0;
        }
        .wa-card-expense {
          background: #f0fdf4;
          border: 1px solid #bbf7d0;
          border-left: 4px solid #10b981;
          border-radius: 10px;
          padding: 8px 10px;
          margin: 8px 0;
        }
        .wa-card-summary {
          background: #faf5ff;
          border: 1px solid #e9d5ff;
          border-left: 4px solid #9333ea;
          border-radius: 10px;
          padding: 8px 10px;
          margin: 8px 0;
        }

        /* Burbuja de Escribiendo... */
        .wa-typing-bubble {
          align-self: flex-start;
          background: #ffffff;
          border-radius: 12px 12px 12px 2px;
          padding: 8px 14px;
          box-shadow: 0 1px 1.5px rgba(0, 0, 0, 0.12);
          display: flex;
          align-items: center;
          gap: 5px;
          animation: waFadeIn 0.2s ease-out;
        }
        .wa-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #008069;
          animation: waBounce 1.2s infinite ease-in-out;
        }
        .wa-dot:nth-child(1) { animation-delay: 0s; }
        .wa-dot:nth-child(2) { animation-delay: 0.2s; }
        .wa-dot:nth-child(3) { animation-delay: 0.4s; }
        @keyframes waBounce {
          0%, 80%, 100% {
            transform: translateY(0);
            opacity: 0.4;
          }
          40% {
            transform: translateY(-5px);
            opacity: 1;
          }
        }

        /* Barra inferior del chat */
        .wa-footer-bar {
          background: #f0f2f5;
          padding: 8px 10px;
          display: flex;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
        }
        .wa-fake-input {
          flex: 1;
          background: #ffffff;
          border-radius: 20px;
          padding: 8px 14px;
          font-size: 0.8rem;
          color: #8696a0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border: 1px solid rgba(0, 0, 0, 0.05);
        }
        .wa-mic-btn {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: #008069;
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1rem;
          flex-shrink: 0;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
        }

        /* Controles de reproducción debajo del teléfono */
        .phone-controls {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          max-width: 410px;
          margin-top: 14px;
          padding: 0 6px;
        }
        .live-indicator {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.78rem;
          font-weight: 700;
          color: #047857;
        }
        .live-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #10b981;
          animation: pulseDot 1.5s infinite;
        }
        @keyframes pulseDot {
          0% { transform: scale(0.9); opacity: 0.8; }
          50% { transform: scale(1.3); opacity: 1; }
          100% { transform: scale(0.9); opacity: 0.8; }
        }
        .phone-ctrl-btn {
          background: #ffffff;
          border: 1px solid #cbd5e1;
          border-radius: 9999px;
          padding: 5px 12px;
          font-size: 0.75rem;
          font-weight: 600;
          color: #475569;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          transition: all 0.2s ease;
        }
        .phone-ctrl-btn:hover {
          background: #f8fafc;
          border-color: #94a3b8;
          color: #0f172a;
        }

        /* Web Developer Showcase Section */
        .dashboard-section {
          max-width: 1140px;
          margin: 70px auto 40px auto;
          padding: 0 20px;
        }

        /* Mockup de Navegador Estilo Apple Safari (Página de Muestra de Zapatos) */
        .apple-browser-mockup {
          background: #000000;
          border-radius: 28px;
          border: 1px solid #27272a;
          box-shadow: 0 30px 80px -20px rgba(0, 0, 0, 0.45), 0 0 0 1px rgba(255, 255, 255, 0.08);
          overflow: hidden;
          color: #f5f5f7;
          font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Segoe UI", Roboto, sans-serif;
        }
        .apple-browser-topbar {
          background: #18181b;
          padding: 12px 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid #27272a;
          gap: 16px;
        }
        .apple-window-dots {
          display: flex;
          gap: 8px;
        }
        .apple-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
        }
        .apple-address-bar {
          background: #27272a;
          border: 1px solid #3f3f46;
          border-radius: 10px;
          padding: 6px 18px;
          font-size: 0.8rem;
          color: #a1a1aa;
          display: flex;
          align-items: center;
          gap: 8px;
          max-width: 440px;
          width: 100%;
          justify-content: center;
        }

        /* Apple Store Navigation Bar (dentro de la web creada) */
        .apple-web-nav {
          background: rgba(22, 22, 23, 0.94);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          padding: 0 24px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.78rem;
          letter-spacing: -0.01em;
        }
        .apple-nav-brand {
          display: flex;
          align-items: center;
          gap: 6px;
          font-weight: 700;
          color: #f5f5f7;
          font-size: 0.95rem;
          letter-spacing: -0.02em;
        }
        .apple-nav-items {
          display: flex;
          align-items: center;
          gap: 26px;
          color: #a1a1a6;
          font-weight: 400;
        }
        .apple-nav-items span {
          transition: color 0.2s ease;
          cursor: pointer;
        }
        .apple-nav-items span:hover {
          color: #ffffff;
        }
        .apple-nav-actions {
          display: flex;
          align-items: center;
          gap: 16px;
          color: #a1a1a6;
          font-size: 0.95rem;
        }

        /* Main Hero Unit (AERO TITANIUM PRO - Estilo Apple) */
        .apple-hero-unit {
          background: radial-gradient(circle at 50% 30%, #1c1c1f 0%, #000000 70%);
          padding: 50px 24px 20px 24px;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        .apple-tag {
          font-size: 0.82rem;
          font-weight: 700;
          color: #f56300;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          margin-bottom: 8px;
          display: inline-block;
        }
        .apple-product-title {
          font-size: clamp(2.3rem, 5.2vw, 3.8rem);
          font-weight: 850;
          color: #f5f5f7;
          letter-spacing: -0.035em;
          line-height: 1.05;
          margin-bottom: 10px;
        }
        .apple-product-subtitle {
          font-size: clamp(1.05rem, 2vw, 1.35rem);
          color: #a1a1a6;
          font-weight: 400;
          max-width: 650px;
          margin: 0 auto 20px auto;
          line-height: 1.4;
        }
        .apple-cta-row {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          margin-bottom: 24px;
          flex-wrap: wrap;
        }
        .apple-btn-blue {
          background: #0071e3;
          color: #ffffff;
          padding: 9px 22px;
          border-radius: 9999px;
          font-size: 0.9rem;
          font-weight: 500;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          box-shadow: 0 4px 12px rgba(0, 113, 227, 0.3);
        }
        .apple-btn-outline {
          background: transparent;
          color: #2997ff;
          border: 1px solid #0071e3;
          padding: 9px 22px;
          border-radius: 9999px;
          font-size: 0.9rem;
          font-weight: 500;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }

        /* Escenario del Zapato Principal */
        .apple-shoe-stage {
          max-width: 680px;
          margin: 0 auto;
          position: relative;
          padding: 10px 0 0 0;
        }
        .apple-shoe-img {
          width: 100%;
          max-height: 350px;
          object-fit: contain;
          display: block;
          filter: drop-shadow(0 20px 30px rgba(0, 0, 0, 0.9));
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .apple-shoe-stage:hover .apple-shoe-img {
          transform: translateY(-6px) scale(1.02);
        }
        .apple-shoe-glow {
          position: absolute;
          bottom: 10px;
          left: 50%;
          transform: translateX(-50%);
          width: 75%;
          height: 30px;
          background: radial-gradient(ellipse at center, rgba(37, 99, 235, 0.3) 0%, transparent 70%);
          pointer-events: none;
        }

        /* Dual Bento Grid (Estilo Apple.com) */
        .apple-bento-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          padding: 16px;
          background: #000000;
        }
        .apple-bento-card {
          border-radius: 22px;
          padding: 34px 24px 20px 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          overflow: hidden;
          position: relative;
          min-height: 370px;
        }
        .apple-card-dark {
          background: #161617;
          color: #f5f5f7;
          border: 1px solid rgba(255, 255, 255, 0.05);
        }
        .apple-card-light {
          background: #fbfbfd;
          color: #1d1d1f;
          border: 1px solid #e5e5e7;
        }
        .apple-card-badge {
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          margin-bottom: 6px;
        }
        .apple-card-title {
          font-size: clamp(1.5rem, 2.5vw, 2.1rem);
          font-weight: 850;
          letter-spacing: -0.025em;
          line-height: 1.15;
          margin-bottom: 6px;
        }
        .apple-card-subtitle {
          font-size: 0.95rem;
          line-height: 1.4;
          max-width: 380px;
          margin-bottom: 12px;
          opacity: 0.85;
        }
        .apple-card-links {
          display: flex;
          align-items: center;
          gap: 18px;
          font-size: 0.88rem;
          font-weight: 500;
          margin-bottom: 16px;
        }
        .apple-card-img-wrap {
          width: 100%;
          max-width: 320px;
          margin-top: auto;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .apple-card-shoe-img {
          width: 100%;
          max-height: 185px;
          object-fit: contain;
          filter: drop-shadow(0 12px 18px rgba(0,0,0,0.25));
          transition: transform 0.35s ease;
        }
        .apple-bento-card:hover .apple-card-shoe-img {
          transform: translateY(-4px) scale(1.03);
        }

        /* Apple Bottom Strip */
        .apple-bottom-strip {
          background: #111113;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          padding: 16px 20px;
          display: flex;
          align-items: center;
          justify-content: space-around;
          font-size: 0.8rem;
          color: #a1a1a6;
          flex-wrap: wrap;
          gap: 14px;
        }

        /* Business Capabilities Grid */
        .systems-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 20px;
          margin-top: 36px;
        }
        .system-item {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 20px;
          padding: 24px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.02);
          transition: transform 0.25s ease;
        }
        .system-item:hover {
          transform: translateY(-4px);
        }

        /* Responsive tweaks */
        @media (max-width: 768px) {
          .hero-content {
            padding: 35px 16px 30px 16px;
          }
          .hero-eduar-bg {
            right: -30px;
            bottom: 0;
            opacity: 0.28;
            height: 92%;
            max-height: 520px;
          }
          .coord-content-row {
            flex-direction: column;
            text-align: center;
            padding: 20px;
          }
          .coord-photo-wrapper {
            width: 170px;
            height: 210px;
            margin: 0 auto;
          }
          .agent-card {
            width: 310px;
          }
          .card-stage {
            height: 200px;
          }
          .character-img {
            max-height: 185px;
          }
          .inner-features-grid {
            grid-template-columns: 1fr;
          }
          .inner-nav-links {
            display: none;
          }
          .browser-body {
            padding: 24px 16px;
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
              background: '#0f172a', 
              color: '#ffffff', 
              fontSize: '0.72rem', 
              fontWeight: '800', 
              padding: '4px 10px', 
              borderRadius: '9999px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <span>⚡</span> MASTER IA
            </span>
          </div>

          <a 
            href={whatsappUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="btn-primary"
            style={{ padding: '10px 22px', fontSize: '0.88rem' }}
          >
            Detalles de Inscripción
          </a>
        </div>
      </header>

      {/* Hero Section con Fondo de Redes Neuronales y Foto de Eduar en Transparencia */}
      <main>
        <section className="hero-wrapper">
          {/* Fondo de Redes Neuronales Azules */}
          <div className="hero-neural-bg">
            <svg 
              width="100%" 
              height="100%" 
              viewBox="0 0 1440 850" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="xMidYMid slice"
            >
              <defs>
                <linearGradient id="neuralGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity="0.1" />
                </linearGradient>
                <linearGradient id="neuralGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.45" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.05" />
                </linearGradient>
                <radialGradient id="nodeGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
                  <stop offset="60%" stopColor="#2563eb" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* Red de conexiones / sinapsis */}
              <g stroke="url(#neuralGrad1)" strokeWidth="1.2" strokeDasharray="3 3">
                <line x1="150" y1="120" x2="320" y2="240" />
                <line x1="320" y1="240" x2="480" y2="160" />
                <line x1="320" y1="240" x2="280" y2="420" />
                <line x1="480" y1="160" x2="680" y2="210" />
                <line x1="280" y1="420" x2="520" y2="480" />
                <line x1="680" y1="210" x2="820" y2="140" />
                <line x1="680" y1="210" x2="740" y2="380" />
                <line x1="740" y1="380" x2="520" y2="480" />
                <line x1="820" y1="140" x2="1040" y2="200" />
                <line x1="1040" y1="200" x2="1200" y2="110" />
                <line x1="1040" y1="200" x2="980" y2="390" />
                <line x1="1200" y1="110" x2="1360" y2="260" />
                <line x1="980" y1="390" x2="1180" y2="460" />
                <line x1="1180" y1="460" x2="1360" y2="260" />
                <line x1="740" y1="380" x2="980" y2="390" />
                <line x1="980" y1="390" x2="920" y2="580" />
                <line x1="1180" y1="460" x2="1280" y2="620" />
                <line x1="520" y1="480" x2="640" y2="660" />
                <line x1="640" y1="660" x2="920" y2="580" />
                <line x1="920" y1="580" x2="1120" y2="720" />
                <line x1="1180" y1="460" x2="1380" y2="520" />
              </g>

              {/* Conexiones secundarias continuas */}
              <g stroke="url(#neuralGrad2)" strokeWidth="0.8">
                <line x1="220" y1="280" x2="420" y2="350" />
                <line x1="600" y1="110" x2="780" y2="260" />
                <line x1="880" y1="290" x2="1080" y2="320" />
                <line x1="1120" y1="210" x2="1300" y2="380" />
                <line x1="780" y1="260" x2="950" y2="220" />
                <line x1="860" y1="450" x2="1060" y2="540" />
                <line x1="420" y1="350" x2="620" y2="420" />
              </g>

              {/* Nodos con resplandor */}
              <g fill="#2563eb">
                <circle cx="150" cy="120" r="4" fill="#3b82f6" opacity="0.6" />
                <circle cx="320" cy="240" r="5" fill="#2563eb" opacity="0.7" />
                <circle cx="480" cy="160" r="4" fill="#60a5fa" opacity="0.6" />
                <circle cx="280" cy="420" r="3.5" fill="#3b82f6" opacity="0.5" />
                <circle cx="680" cy="210" r="6" fill="#1d4ed8" opacity="0.8" />
                <circle cx="520" cy="480" r="4.5" fill="#3b82f6" opacity="0.7" />
                <circle cx="740" cy="380" r="5.5" fill="#2563eb" opacity="0.75" />
                <circle cx="820" cy="140" r="4" fill="#60a5fa" opacity="0.6" />
                <circle cx="1040" cy="200" r="7" fill="#1d4ed8" opacity="0.85" />
                <circle cx="980" cy="390" r="6.5" fill="#2563eb" opacity="0.8" />
                <circle cx="1200" cy="110" r="4.5" fill="#3b82f6" opacity="0.6" />
                <circle cx="1360" cy="260" r="5.5" fill="#2563eb" opacity="0.7" />
                <circle cx="1180" cy="460" r="6" fill="#1d4ed8" opacity="0.8" />
                <circle cx="920" cy="580" r="5" fill="#3b82f6" opacity="0.7" />
                <circle cx="640" cy="660" r="4" fill="#60a5fa" opacity="0.6" />
                <circle cx="1280" cy="620" r="4.5" fill="#3b82f6" opacity="0.65" />
                <circle cx="1120" cy="720" r="4" fill="#60a5fa" opacity="0.5" />
                <circle cx="1380" cy="520" r="3.5" fill="#3b82f6" opacity="0.5" />
              </g>

              {/* Halos de luz en nodos clave */}
              <circle cx="680" cy="210" r="28" fill="url(#nodeGlow)" />
              <circle cx="1040" cy="200" r="35" fill="url(#nodeGlow)" />
              <circle cx="980" cy="390" r="32" fill="url(#nodeGlow)" />
              <circle cx="1180" cy="460" r="30" fill="url(#nodeGlow)" />
              <circle cx="740" cy="380" r="24" fill="url(#nodeGlow)" />
            </svg>
          </div>

          {/* Foto de Eduar sonriendo de frente con desvanecimiento inferior suave y más a la derecha */}
          <div className="hero-eduar-bg">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src="/eduar_hero_faded.png" 
              alt="Eduar Peña" 
              className="eduar-bg-img"
            />
          </div>

          {/* Contenido del Hero (por encima) */}
          <div className="hero-content">
            {/* Logo del curso más pequeño */}
            <div className="hero-logo-box">
              <Image 
                src="/logo_master_ia.png" 
                alt="Master de Inteligencia Artificial" 
                width={200} 
                height={106}
                style={{ objectFit: 'contain', width: '100%', height: 'auto', maxWidth: '200px' }}
                priority
              />
            </div>

            {/* Titular Principal */}
            <h1 className="hero-title">
              Domina la IA actualizada de 2026-2027
            </h1>

            {/* Subtítulo destacado en grande */}
            <h2 className="hero-subtitle">
              Crea tu ecosistema de Agentes de IA interconectados
            </h2>

            {/* Descripción */}
            <p className="hero-desc">
              Empieza en Diciembre y llega a Enero con tu asistente personal de IA y tu equipo de marketing en marcha. Ahora podrás tener ideas ilimitadas, guiones comprobados listos, un equipo de editores y sistemas a tu medida.
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <a 
                href={whatsappUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn-primary"
              >
                <span>Ir a WhatsApp para los detalles de inscripción</span>
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
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
                  padding: '18px 28px',
                  borderRadius: '9999px',
                  fontSize: '1.05rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.04)'
                }}
              >
                <span>Ver cómo trabajan los agentes</span>
                <span>↓</span>
              </button>
            </div>
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
            <h2 style={{ fontSize: '1.85rem', fontWeight: '850', color: '#0f172a', marginTop: '6px' }}>
              Primero: La mente maestra que dirige todo
            </h2>
          </div>

          <div className="coordinator-card">
            {/* Barra superior de Ari */}
            <div className="coord-top-banner">
              <span style={{ 
                background: 'rgba(255, 255, 255, 0.15)', 
                color: '#ffffff', 
                fontSize: '0.8rem', 
                fontWeight: '800', 
                padding: '4px 14px', 
                borderRadius: '9999px',
                border: '1px solid rgba(255, 255, 255, 0.2)' 
              }}>
                {COORDINATOR.badge}
              </span>

              <span style={{ 
                color: '#ffffff', 
                fontSize: '0.85rem', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px',
                fontWeight: '600'
              }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#4ade80' }}></span>
                {COORDINATOR.status}
              </span>
            </div>

            {/* Contenido con la foto de avatar Pixar 3D de Ari (proporciones 100% naturales) */}
            <div className="coord-content-row">
              <div className="coord-photo-wrapper">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={COORDINATOR.image} 
                  alt={COORDINATOR.name} 
                  style={{
                    maxHeight: '220px',
                    maxWidth: '100%',
                    width: 'auto',
                    height: 'auto',
                    objectFit: 'contain',
                    display: 'block',
                    margin: '0 auto',
                    filter: 'drop-shadow(0 10px 14px rgba(0, 0, 0, 0.15))'
                  }}
                />
              </div>

              <div className="coord-info">
                <div style={{ marginBottom: '12px' }}>
                  <h3 style={{ fontSize: '1.85rem', fontWeight: '850', color: '#09090b', lineHeight: '1.2' }}>
                    {COORDINATOR.name} <span style={{ fontSize: '1.1rem', fontWeight: '600', color: '#6366f1' }}>• La Coordinadora</span>
                  </h3>
                  <p style={{ color: '#64748b', fontSize: '1rem', fontWeight: '600' }}>
                    {COORDINATOR.role}
                  </p>
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
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              padding: '6px 14px',
              borderRadius: '9999px',
              fontSize: '0.875rem',
              fontWeight: '600',
              color: '#334155',
              marginBottom: '12px'
            }}>
              <span>♡</span>
              <span>Especialistas en Movimiento</span>
            </div>
            <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)', fontWeight: '850', color: '#09090b', letterSpacing: '-0.03em' }}>
              Tu equipo de marketing en marcha
            </h2>
            <p style={{ color: '#64748b', fontSize: '1.1rem', maxWidth: '650px', margin: '0 auto' }}>
              Cada agente domina su rol al 100% y se pasan los entregables entre ellos de forma instantánea y automática.
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
                  padding: '6px 16px',
                  fontSize: '0.82rem',
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
                >
                  {/* Escenario de personaje Pixar 3D: CERO distorsión con width: auto y max-height */}
                  <div className="card-stage" style={{ background: agent.coverBg }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={agent.image} 
                      alt={agent.name} 
                      className="character-img"
                    />
                    <span className="card-category-pill">
                      {agent.category}
                    </span>
                  </div>

                  {/* Cuerpo del perfil del agente */}
                  <div className="card-body">
                    {/* Encabezado con Avatar de perfil circular */}
                    <div className="profile-header-row">
                      <div className="profile-avatar-circle">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img 
                          src={agent.image} 
                          alt={agent.name} 
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            objectPosition: 'center 15%'
                          }}
                        />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <h4 style={{ fontSize: '1.25rem', fontWeight: '850', color: '#0f172a' }}>
                            {agent.name}
                          </h4>
                          <span style={{ 
                            fontSize: '0.68rem', 
                            color: '#10b981', 
                            fontWeight: '700',
                            background: '#ecfdf5',
                            padding: '3px 8px',
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

        {/* SECCIÓN INTERACTIVA: ASISTENTE PERSONAL EN WHATSAPP EN TIEMPO REAL */}
        <section className="assistant-section">
          {/* Encabezado Centrado */}
          <div className="assistant-header">
            <span className="assistant-badge">
              <span>🤖</span>
              <span>Asistente Personal de IA en WhatsApp</span>
            </span>

            <h2 className="assistant-title">
              Tu asistente personal te ayudará a resolver tu día a día
            </h2>

            <p className="assistant-desc">
              No necesitas abrir herramientas complejas ni adaptarte a nuevos programas. Tu dia lo gestionas directamente desde tu WhatsApp enviando mensajes o notas de voz cotidianas, como si hablaras con tu asistente de confianza.
            </p>
          </div>

          {/* Teléfono WhatsApp con la simulación interactiva directamente */}
          <div className="phone-mockup-wrapper">
              <div className="phone-chassis">
                {/* Dynamic Island / Notch */}
                <div className="phone-notch">
                  <div className="phone-camera-lens"></div>
                  <div className="phone-speaker"></div>
                </div>

                {/* Pantalla del Celular */}
                <div className="phone-screen">
                  {/* Barra de WhatsApp Superior */}
                  <div className="wa-header">
                    <div className="wa-header-left">
                      <span className="wa-back-btn">←</span>
                      <div className="wa-avatar">
                        <img 
                          src="/agentes/12_Ari_Coordinadora_Equipo.png" 
                          alt="Mia - Asistente personal"
                          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 10%' }}
                        />
                      </div>
                      <div className="wa-user-details">
                        <span className="wa-user-name">Mia - Asistente personal</span>
                        <span className="wa-user-status">
                          {isAssistantTyping ? (
                            <span style={{ color: '#ffffff', fontWeight: '700' }}>escribiendo...</span>
                          ) : (
                            <span>● en línea</span>
                          )}
                        </span>
                      </div>
                    </div>

                    <div className="wa-header-icons">
                      <span>📹</span>
                      <span>📞</span>
                      <span>⋮</span>
                    </div>
                  </div>

                  {/* Cuerpo del Chat */}
                  <div className="wa-chat-body" ref={chatBodyRef}>
                    <div className="wa-date-pill">HOY</div>

                    {/* Mensajes activos renderizados en tiempo real */}
                    {activeMessages.map((msg) => (
                      <div key={msg.id} className={`wa-msg ${msg.sender}`}>
                        <div className="wa-msg-text">
                          {msg.text}
                        </div>

                        {/* Tarjeta de Google Meet (Reunión con María) */}
                        {msg.meetCard && (
                          <div className="wa-card-meet">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                              <span style={{ fontSize: '1.2rem' }}>📹</span>
                              <div>
                                <div style={{ fontSize: '0.8rem', fontWeight: '700', color: '#0f172a' }}>
                                  {msg.meetCard.title}
                                </div>
                                <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                                  {msg.meetCard.time}
                                </div>
                              </div>
                            </div>
                            <div style={{ 
                              background: '#1a73e8', 
                              color: '#ffffff', 
                              borderRadius: '6px', 
                              padding: '5px 10px', 
                              fontSize: '0.74rem', 
                              fontWeight: '700',
                              textAlign: 'center',
                              cursor: 'pointer'
                            }}>
                              👉 Unirse con Google Meet
                            </div>
                          </div>
                        )}

                        {/* Tarjeta de Registro de Gastos */}
                        {msg.expenseCard && (
                          <div className="wa-card-expense">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                              <span style={{ fontSize: '0.72rem', fontWeight: '700', color: '#047857' }}>
                                GASTO ANOTADO
                              </span>
                              <span style={{ fontSize: '0.95rem', fontWeight: '850', color: '#059669' }}>
                                {msg.expenseCard.amount}
                              </span>
                            </div>
                            <div style={{ fontSize: '0.75rem', color: '#334155', fontWeight: '600' }}>
                              {msg.expenseCard.category}
                            </div>
                            <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '4px' }}>
                              {msg.expenseCard.monthTotal}
                            </div>
                            <div style={{ fontSize: '0.68rem', color: '#059669', fontWeight: '700', marginTop: '4px' }}>
                              ✓ {msg.expenseCard.status}
                            </div>
                          </div>
                        )}

                        {/* Resumen de Artículo en 3 Puntos */}
                        {msg.summaryPoints && (
                          <div className="wa-card-summary">
                            <div style={{ fontSize: '0.75rem', fontWeight: '800', color: '#7e22ce', marginBottom: '6px' }}>
                              📌 PUNTOS CLAVE DEL ARTÍCULO:
                            </div>
                            {msg.summaryPoints.map((point, pIdx) => (
                              <div key={pIdx} style={{ fontSize: '0.75rem', color: '#334155', marginBottom: '4px', lineHeight: '1.4' }}>
                                <strong>{pIdx + 1}.</strong> {point}
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Nota final del mensaje */}
                        {msg.footerNote && (
                          <div style={{ fontSize: '0.8rem', color: '#475569', marginTop: '6px', fontStyle: 'italic' }}>
                            {msg.footerNote}
                          </div>
                        )}

                        {/* Metadatos (Hora y Checks) */}
                        <div className="wa-msg-meta">
                          <span>{msg.time}</span>
                          {msg.sender === 'user' && (
                            <span style={{ color: '#53bdeb', fontWeight: '800', fontSize: '0.75rem' }}>✓✓</span>
                          )}
                        </div>
                      </div>
                    ))}

                    {/* Indicador de "Escribiendo..." con 3 puntitos que saltan */}
                    {isAssistantTyping && (
                      <div className="wa-typing-bubble">
                        <div className="wa-dot"></div>
                        <div className="wa-dot"></div>
                        <div className="wa-dot"></div>
                      </div>
                    )}
                  </div>

                  {/* Barra inferior simulada de WhatsApp */}
                  <div className="wa-footer-bar">
                    <span style={{ fontSize: '1.2rem', color: '#8696a0' }}>😊</span>
                    <div className="wa-fake-input">
                      <span>Escribe un mensaje o envía un audio...</span>
                      <span style={{ fontSize: '1rem', color: '#8696a0' }}>📎</span>
                    </div>
                    <div className="wa-mic-btn">
                      🎙️
                    </div>
                  </div>
                </div>
              </div>

              {/* Barra de Controles de la simulación */}
              <div className="phone-controls">
                <div className="live-indicator">
                  <span className="live-dot"></span>
                  <span>Simulación en tiempo real</span>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button 
                    onClick={restartSimulation}
                    className="phone-ctrl-btn"
                    title="Reiniciar conversación desde el inicio"
                  >
                    <span>↺</span>
                    <span>Reiniciar</span>
                  </button>
                  <button 
                    onClick={() => setIsChatPaused(!isChatPaused)}
                    className="phone-ctrl-btn"
                    title={isChatPaused ? "Reanudar simulación" : "Pausar simulación"}
                  >
                    <span>{isChatPaused ? '▶ Reanudar' : '⏸ Pausar'}</span>
                  </button>
                </div>
              </div>

              {/* Botón WhatsApp centrado debajo del teléfono */}
              <div style={{ marginTop: '30px' }}>
                <a 
                  href={whatsappUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="btn-primary"
                >
                  <span>Ir a WhatsApp para los detalles de inscripción</span>
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
                  </svg>
                </a>
              </div>
            </div>
        </section>

        {/* 3. SECCIÓN: TU DESARROLLADOR WEB */}
        <section className="dashboard-section">
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <span style={{ 
              color: '#0284c7', 
              fontSize: '0.85rem', 
              fontWeight: '800', 
              textTransform: 'uppercase', 
              letterSpacing: '0.08em',
              background: '#e0f2fe',
              padding: '6px 16px',
              borderRadius: '9999px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <span>💻</span>
              <span>Desarrollo Web & Software Inteligente</span>
            </span>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: '850', color: '#0f172a', marginTop: '14px', letterSpacing: '-0.03em', lineHeight: '1.2' }}>
              Tu desarrollador web: Será el encargado de crearte cualquier pagina web, sistema o apps para tu negocio
            </h2>
            <p style={{ color: '#64748b', fontSize: '1.15rem', maxWidth: '780px', margin: '14px auto 0 auto', lineHeight: '1.6' }}>
              Dile exactamente lo que necesitas en texto o audio. Tu desarrollador de IA diseñará la interfaz, programará el código y publicará sitios web modernos, sistemas a la medida y aplicaciones listas para vender sin depender de programadores costosos.
            </p>
          </div>

          {/* Maqueta de Navegador Safari Estilo Apple (Tienda Oficial de Calzado AERO) */}
          <div className="apple-browser-mockup">
            {/* Topbar de Safari macOS */}
            <div className="apple-browser-topbar">
              <div className="apple-window-dots">
                <div className="apple-dot" style={{ background: '#ff5f56' }}></div>
                <div className="apple-dot" style={{ background: '#ffbd2e' }}></div>
                <div className="apple-dot" style={{ background: '#27c93f' }}></div>
              </div>

              {/* Barra de Direcciones URL */}
              <div className="apple-address-bar">
                <span style={{ fontSize: '0.75rem', color: '#a1a1aa' }}>🔒</span>
                <span style={{ fontWeight: '500' }}>aero-footwear.apple/la/titanium</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ 
                  background: 'rgba(255, 255, 255, 0.1)', 
                  color: '#e4e4e7', 
                  fontSize: '0.72rem', 
                  fontWeight: '600',
                  padding: '3px 10px',
                  borderRadius: '9999px',
                  border: '1px solid rgba(255, 255, 255, 0.15)'
                }}>
                  Tienda Oficial 2026
                </span>
              </div>
            </div>

            {/* Navegación global estilo Apple (apple.com/la) */}
            <nav className="apple-web-nav">
              <div className="apple-nav-brand">
                <span style={{ fontSize: '1.1rem' }}></span>
                <span>AERO</span>
              </div>

              <div className="apple-nav-items">
                <span>Store</span>
                <span>Calzado</span>
                <span style={{ color: '#ffffff', fontWeight: '600' }}>Aero Titanio</span>
                <span>Air Pro</span>
                <span>Innovación</span>
                <span>Soporte</span>
              </div>

              <div className="apple-nav-actions">
                <span title="Buscar" style={{ cursor: 'pointer' }}>🔍</span>
                <span title="Bolsa de compra" style={{ cursor: 'pointer' }}>🛍️</span>
              </div>
            </nav>

            {/* UNIDAD PRINCIPAL: HERO ESTILO APPLE (AERO TITANIUM PRO) */}
            <div className="apple-hero-unit">
              <span className="apple-tag">Nuevo</span>
              
              <h3 className="apple-product-title">
                AERO TITANIUM PRO
              </h3>

              <p className="apple-product-subtitle">
                Pura ingeniería aeroespacial. Amortiguación que desafía la gravedad.
              </p>

              <div className="apple-cta-row">
                <a href="#comprar" onClick={(e) => e.preventDefault()} className="apple-btn-blue">
                  Más información
                </a>
                <a href="#comprar" onClick={(e) => e.preventDefault()} className="apple-btn-outline">
                  Comprar
                </a>
              </div>

              {/* Escenario del Zapato Principal flotando */}
              <div className="apple-shoe-stage">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src="/shoes/sneaker_hero_1.jpg" 
                  alt="AERO Titanium Pro Sneaker" 
                  className="apple-shoe-img"
                />
                <div className="apple-shoe-glow"></div>
              </div>

              <div style={{ fontSize: '0.82rem', color: '#71717a', marginTop: '14px' }}>
                Desde $189 USD o $15.75/mes en 12 cuotas sin interés
              </div>
            </div>

            {/* SECCIÓN DUAL BENTO GRID (ESTILO APPLE.COM) */}
            <div className="apple-bento-grid">
              
              {/* Tarjeta 1: Dark Edition (Aero Carbon X) */}
              <div className="apple-bento-card apple-card-dark">
                <span className="apple-card-badge" style={{ color: '#60a5fa' }}>Edición Especial</span>
                <h4 className="apple-card-title">AERO CARBON X</h4>
                <p className="apple-card-subtitle" style={{ color: '#a1a1a6' }}>
                  Placa 100% de fibra de carbono. Diseñado para romper tu récord personal.
                </p>

                <div className="apple-card-links">
                  <a href="#mas" onClick={(e) => e.preventDefault()} style={{ color: '#2997ff', textDecoration: 'none' }}>
                    Más información &gt;
                  </a>
                  <a href="#comprar" onClick={(e) => e.preventDefault()} style={{ color: '#2997ff', textDecoration: 'none' }}>
                    Comprar &gt;
                  </a>
                </div>

                <div className="apple-card-img-wrap">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src="/shoes/sneaker_blue.jpg" 
                    alt="Aero Carbon X" 
                    className="apple-card-shoe-img"
                  />
                </div>
              </div>

              {/* Tarjeta 2: Light Edition Studio (Stride Cloudflow) */}
              <div className="apple-bento-card apple-card-light">
                <span className="apple-card-badge" style={{ color: '#b91c1c' }}>Lo más vendido</span>
                <h4 className="apple-card-title">STRIDE CLOUDFLOW</h4>
                <p className="apple-card-subtitle" style={{ color: '#6e6e73' }}>
                  La sensación de caminar sobre nubes. Pura comodidad para tu día a día.
                </p>

                <div className="apple-card-links">
                  <a href="#mas" onClick={(e) => e.preventDefault()} style={{ color: '#0071e3', textDecoration: 'none' }}>
                    Más información &gt;
                  </a>
                  <a href="#comprar" onClick={(e) => e.preventDefault()} style={{ color: '#0071e3', textDecoration: 'none' }}>
                    Comprar &gt;
                  </a>
                </div>

                <div className="apple-card-img-wrap">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src="/shoes/sneaker_hero_red.jpg" 
                    alt="Stride Cloudflow" 
                    className="apple-card-shoe-img"
                  />
                </div>
              </div>

            </div>

            {/* Apple Bottom Strip / Beneficios */}
            <div className="apple-bottom-strip">
              <span>🚀 <strong>Envío gratuito</strong> en todos los pedidos</span>
              <span>🔄 <strong>Devoluciones gratis</strong> por 30 días</span>
              <span>💳 <strong>12 cuotas</strong> sin interés con Apple Pay</span>
            </div>
          </div>

          {/* 4 Soluciones que tu Desarrollador Web creará para tu negocio */}
          <div className="systems-grid">
            <div className="system-item">
              <div style={{ fontSize: '1.8rem', marginBottom: '12px' }}>🌐</div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#0f172a', marginBottom: '8px' }}>
                Landing Pages de Alta Conversión
              </h3>
              <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: '1.5' }}>
                Páginas de captura y de venta directa creadas a la medida de tu oferta, listas para recibir tráfico de anuncios o redes.
              </p>
            </div>

            <div className="system-item">
              <div style={{ fontSize: '1.8rem', marginBottom: '12px' }}>📱</div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#0f172a', marginBottom: '8px' }}>
                Aplicaciones Web & Portales
              </h3>
              <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: '1.5' }}>
                Áreas de miembros para cursos, calculadoras personalizadas o plataformas de consulta privada para tus clientes.
              </p>
            </div>

            <div className="system-item">
              <div style={{ fontSize: '1.8rem', marginBottom: '12px' }}>🛒</div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#0f172a', marginBottom: '8px' }}>
                Tiendas Online & Embudos
              </h3>
              <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: '1.5' }}>
                Catálogos visuales con carritos de compra ágiles y confirmaciones automáticas de pedido enviadas a WhatsApp.
              </p>
            </div>

            <div className="system-item">
              <div style={{ fontSize: '1.8rem', marginBottom: '12px' }}>⚙️</div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#0f172a', marginBottom: '8px' }}>
                Sistemas Internos & Dashboards
              </h3>
              <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: '1.5' }}>
                Paneles para gestionar tus pedidos, clientes y métricas conectando bases de datos sin escribir una sola línea de código.
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
              🚀 Inscripciones Abiertas • Master IA
            </span>

            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: '850', lineHeight: '1.15', marginBottom: '16px' }}>
              No esperes a enero para empezar desde cero
            </h2>

            <p style={{ fontSize: '1.15rem', color: '#cbd5e1', maxWidth: '650px', margin: '0 auto 36px auto', lineHeight: '1.6' }}>
              Deja a tu asistente de IA y a tu equipo de agentes listos durante diciembre para arrancar el año comunicando y facturando en automático.
            </p>

            <a 
              href={whatsappUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '12px',
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
              <span>Ir a WhatsApp para los detalles de inscripción</span>
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
        <p>© {new Date().getFullYear()} Marketing Xperience. Master de Inteligencia Artificial.</p>
      </footer>
    </div>
  );
}
