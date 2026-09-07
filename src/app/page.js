'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import RegistrationModal from '@/components/RegistrationModal';

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('');
  const [ticketPrice, setTicketPrice] = useState(0);
  const [purchaseStage, setPurchaseStage] = useState('');
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [pillarModalOpen, setPillarModalOpen] = useState(false);
  const [selectedPillarData, setSelectedPillarData] = useState(null);
  const [refCode, setRefCode] = useState('');

  const [currentPricing, setCurrentPricing] = useState({ 
    stage: 'Etapa Actual', 
    genPrice: 87, 
    vipPrice: 135, 
    nextGenPrice: 97, 
    nextVipPrice: 150,
    prevStage: 'PRE-VENTA (DURÓ HASTA EL 6/09/26)',
    prevGenPrice: 75,
    prevVipPrice: 120
  });

  useEffect(() => {
    // Automatic pricing logic has been removed as requested.
    // To change prices, simply edit the 'currentPricing' useState above.

    const params = new URLSearchParams(window.location.search);
    const ref = params.get('ref');
    if (ref) {
      setRefCode(ref);
    }
  }, []);

  const carouselRef = useRef(null);

  const scrollCarousel = (direction) => {
    if (carouselRef.current) {
      const scrollAmount = 320; // Width of card + gap
      carouselRef.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };

  const pillarsData = {
    marketing: { 
      title: "Marketing", 
      text: "Aprenderás a dominar las estrategias de atracción para que nunca te falten clientes. Construye embudos de venta predecibles.", 
      expert: "Eduar Peña",
      image: "/Marketing.png"
    },
    ventas: { 
      title: "Ventas", 
      text: "Descubre los secretos para cerrar más negocios con menos esfuerzo. Aprende a crear necesidad inmediata y manejar objeciones como un profesional.", 
      expert: "Juan Pinto y Jesus",
      image: "/Ventas.png"
    },
    marca: { 
      title: "Marca Personal", 
      text: "Destaca en un mercado saturado y haz que tu nombre sea sinónimo de autoridad. Conviértete en un imán de oportunidades.", 
      expert: "Joelymar Toro",
      image: "/Marca_personal.png"
    },
    ia: { 
      title: "Inteligencia Artificial", 
      text: "Optimiza tus procesos, ahorra cientos de horas y sistematiza tu negocio con las herramientas de IA más potentes del mercado.", 
      expert: "Eduar Peña",
      image: "/Inteligencia_artificial.jpg"
    },
    mentalidad: { 
      title: "Mentalidad", 
      text: "Rompe tus límites, reprograma tus creencias limitantes y adopta la psicología de los grandes referentes de la industria.", 
      expert: "Daniel Zambrano",
      image: "/Mentalidad.png"
    },
    comunicacion: { 
      title: "Comunicación en cámara", 
      text: "Transmite tu mensaje con total seguridad, conecta profundamente con tu audiencia y vende más a través del video.", 
      expert: "Próximamente",
      image: "/Comunicacion.png"
    }
  };


  const openPillarModal = (pillarKey, e) => {
    e.preventDefault();
    setSelectedPillarData(pillarsData[pillarKey]);
    setPillarModalOpen(true);
  };

  const openModal = (planName, price) => {
    setSelectedPlan(planName);
    setTicketPrice(price);
    setPurchaseStage(currentPricing.stage);
    setModalOpen(true);
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({
        x: (e.clientX - window.innerWidth / 2) / 20,
        y: (e.clientY - window.innerHeight / 2) / 20
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in-up');
        }
      });
    }, { threshold: 0.1 });

    const elements = document.querySelectorAll('.animate-on-scroll');
    elements.forEach(el => observer.observe(el));

    return () => {
      elements.forEach(el => observer.unobserve(el));
    };
  }, []);

  return (
    <main className="main-container">
      {/* Navbar */}
      <nav className="navbar">
        <div className="container nav-content">
          <div className="nav-logo">
            <Image src="/logo.png" alt="Marketing Xperience Logo" width={180} height={40} style={{ height: "40px", width: "auto" }} priority />
          </div>
          <div className="nav-progress-container" style={{ flex: 1, maxWidth: '300px', margin: '0 20px', textAlign: 'center' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#fff', marginBottom: '4px' }}>
              75% de entradas vendidas
            </div>
            <div style={{ background: 'rgba(255,255,255,0.2)', borderRadius: '10px', height: '8px', width: '100%', overflow: 'hidden' }}>
              <div style={{ background: '#e6b85c', width: '75%', height: '100%', borderRadius: '10px' }}></div>
            </div>
          </div>























          <a href="#precios" className="btn-cyan-outline" style={{ textDecoration: 'none' }}>
            Registrarme
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-bg-layer"></div>
        <div className="container hero-split">
          <div className="hero-text animate-on-scroll">
            <span className="subtitle-cyan" style={{ color: '#e6b85c' }}>Marketing Xperience 2026</span>
            <h1>El antes y después de tu marca</h1>
            <p className="subtitle" style={{ fontSize: '1.2rem', marginTop: '1rem' }}>
              Vive la experiencia multisensorial de un entrenamiento de 2 días de clases Teórico - Prácticas. Compartirás con personas con una visión y una mentalidad increíble.
            </p>
            <div className="hero-buttons">
              <button 
                className="btn-blue" 
                style={{ letterSpacing: '2px', padding: '16px 32px' }}
                onClick={() => document.getElementById('precios').scrollIntoView({behavior: 'smooth'})}
              >
                ASEGURA TU ENTRADA
              </button>
            </div>
            <div className="hero-dates-pill">
              2da edición &nbsp;|&nbsp; Mérida &nbsp;|&nbsp; 19 y 20 de Septiembre
            </div>
          </div>
          <div className="hero-image animate-on-scroll" style={{ animationDelay: '0.2s', position: 'relative', display: 'flex', justifyContent: 'center' }}>
            {/* Logos flotantes con efecto Depth of Field (blur) y parallax */}
            <Image 
              className="hero-logo-keep logo-1"
              src="/logos_rrss/3.png" 
              alt="Logo TikTok"
              width={100} height={100}
              priority
              style={{
                position: 'absolute', top: '12%', left: '-5%', width: '100px', height: '100px', zIndex: 5,
                filter: 'blur(5px)', opacity: 0.6, transform: `scale(0.8) translate(${mousePos.x * 0.5}px, ${mousePos.y * 0.5}px)`, transition: 'transform 0.1s ease-out'
              }}
            />
            <Image 
              className="hero-logo-keep logo-2"
              src="/logos_rrss/2.png" 
              alt="Logo 2"
              width={120} height={120}
              priority
              style={{
                position: 'absolute', top: '25%', right: '-5%', width: '120px', height: '120px', zIndex: 5,
                filter: 'blur(3px)', opacity: 0.7, transform: `scale(0.9) translate(${mousePos.x * 0.8}px, ${mousePos.y * 0.8}px)`, transition: 'transform 0.1s ease-out'
              }}
            />
            <Image 
              className="hero-logo-keep logo-3"
              src="/logos_rrss/1.png" 
              alt="Logo Instagram"
              width={120} height={120}
              priority
              style={{
                position: 'absolute', top: '42%', left: '-5%', width: '120px', height: '120px', zIndex: 15,
                filter: 'blur(3px)', opacity: 0.9, transform: `scale(1.3) translate(${mousePos.x * 2}px, ${mousePos.y * 2}px)`, transition: 'transform 0.1s ease-out'
              }}
            />
            <Image 
              className="hero-logo-hide logo-4"
              src="/logos_rrss/4.png" 
              alt="Logo 4"
              width={110} height={110}
              priority
              style={{
                position: 'absolute', top: '48%', right: '-5%', width: '110px', height: '110px', zIndex: 15,
                filter: 'blur(4px)', opacity: 1, transform: `scale(1.1) translate(${mousePos.x * 1.5}px, ${mousePos.y * 1.5}px)`, transition: 'transform 0.1s ease-out'
              }}
            />
            <Image 
              className="hero-logo-hide logo-5"
              src="/logos_rrss/5.png" 
              alt="Logo 5"
              width={140} height={140}
              priority
              style={{
                position: 'absolute', top: '65%', left: '-5%', width: '140px', height: '140px', zIndex: 20,
                filter: 'blur(4px)', opacity: 0.9, transform: `scale(1.4) translate(${mousePos.x * 3}px, ${mousePos.y * 3}px)`, transition: 'transform 0.1s ease-out'
              }}
            />
            <Image 
              className="hero-logo-hide logo-6"
              src="/logos_rrss/6.png" 
              alt="Logo 6"
              width={85} height={85}
              priority
              style={{
                position: 'absolute', top: '80%', right: '25%', width: '85px', height: '85px', zIndex: 4,
                filter: 'blur(5px)', opacity: 0.6, transform: `scale(0.85) translate(${mousePos.x * 0.6}px, ${mousePos.y * 0.6}px)`, transition: 'transform 0.1s ease-out'
              }}
            />
            <Image 
              className="hero-logo-keep logo-7"
              src="/logos_rrss/7.png" 
              alt="Logo 7"
              width={95} height={95}
              priority
              style={{
                position: 'absolute', top: '85%', right: '-5%', width: '95px', height: '95px', zIndex: 4,
                filter: 'blur(4px)', opacity: 0.7, transform: `scale(0.9) translate(${mousePos.x * 0.5}px, ${mousePos.y * 0.5}px)`, transition: 'transform 0.1s ease-out'
              }}
            />

            <Image 
              className="hero-rocket"
              src="/cohete.png" 
              alt="Cohete Marketing Xperience" 
              width={450} height={600}
              priority
              style={{ 
                width: '100%', 
                maxWidth: '450px', 
                height: 'auto',
                filter: 'drop-shadow(0px 20px 30px rgba(0,0,0,0.5))',
                transform: `translate(${mousePos.x}px, ${mousePos.y}px)`,
                transition: 'transform 0.1s ease-out',
                zIndex: 10,
                position: 'relative'
              }} 
            />
          </div>
        </div>
      </section>

      {/* Como Funciona / Detalles - Carrusel Dual */}
      <section id="detalles" style={{ overflow: 'hidden', paddingBottom: '100px', paddingTop: '20px' }}>
        {/* Carousel Container */}
        <div className="carousel-wrapper">
          {/* Fila 1 - Mueve Izquierda */}
          <div className="carousel-track track-left">
            <div className="carousel-inner">
              {[
                'IMG_6061.jpg', 'IMG_6063.jpg', 'IMG_6110.JPG', 'IMG_6111.JPG', 'IMG_6132.JPG', 'IMG_1060.jpg',
                'IMG_6061.jpg', 'IMG_6063.jpg', 'IMG_6110.JPG', 'IMG_6111.JPG', 'IMG_6132.JPG', 'IMG_1060.jpg'
              ].map((img, i) => (
                <div key={`row1-${i}`} className="carousel-card">
                  <Image src={`/bloque_3/${img}`} alt="Marketing Xperience" fill style={{ objectFit: 'cover' }} className="carousel-img" sizes="(max-width: 768px) 100vw, 33vw" />
                </div>
              ))}
            </div>
          </div>
          {/* Fila 2 - Mueve Derecha */}
          <div className="carousel-track track-right mt-4">
            <div className="carousel-inner inner-right">
              {[
                'IMG_1174.jpg', 'IMG_1175.jpg', 'IMG_1215.jpg', 'IMG_1224.jpg', 'IMG_6066.jpg', 'IMG_6153.JPG',
                'IMG_1174.jpg', 'IMG_1175.jpg', 'IMG_1215.jpg', 'IMG_1224.jpg', 'IMG_6066.jpg', 'IMG_6153.JPG'
              ].map((img, i) => (
                <div key={`row2-${i}`} className="carousel-card">
                  <Image src={`/bloque_3/${img}`} alt="Marketing Xperience" fill style={{ objectFit: 'cover' }} className="carousel-img" sizes="(max-width: 768px) 100vw, 33vw" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

            {/* UNIFIED INFO CARD SECTION */}
      <section className="section-light" style={{ padding: '60px 20px', background: '#f5f5f7' }}>
        <div className="container">
          <div className="unified-card animate-on-scroll">
            
            <div className="unified-card-top">
              <div className="unified-card-left">
                <h2 className="unified-card-title">Nunca antes visto en Mérida</h2>
                <p className="unified-card-desc">
                  Estarás dentro de una mesa de trabajo con emprendedores reales, resolviendo tus bloqueos en tiempo real. No vienes a mirar, vienes a ejecutar.
                </p>
                <a href="#precios" className="btn-blue card-btn">Registrarme Ahora</a>

                <div className="unified-features-grid">
                  <div className="unified-feature-item">
                    <svg className="unified-feature-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                    Mentores de alto nivel
                  </div>
                  <div className="unified-feature-item">
                    <svg className="unified-feature-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Un ambiente para crear
                  </div>
                  <div className="unified-feature-item">
                    <svg className="unified-feature-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Focus en tus ideas
                  </div>
                  <div className="unified-feature-item">
                    <svg className="unified-feature-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Crear contenido
                  </div>
                  <div className="unified-feature-item">
                    <svg className="unified-feature-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                    Respuesta a tus dudas
                  </div>
                  <div className="unified-feature-item">
                    <svg className="unified-feature-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Estrategias de IA
                  </div>
                </div>

              </div>
              <div className="unified-card-right">
                <Image src="/Bloque_3.png" alt="Participantes Marketing Xperience" width={500} height={350} style={{ width: '100%', height: 'auto', borderRadius: '15px' }} />
              </div>
            </div>

            <div className="unified-card-bottom">
              <div className="unified-metric">
                <div className="unified-metric-number">100%</div>
                <div className="unified-metric-label">Enfoque Práctico</div>
              </div>
              <div className="unified-metric">
                <div className="unified-metric-number">2 Días</div>
                <div className="unified-metric-label">Inmersión Presencial</div>
              </div>
              <div className="unified-metric">
                <div className="unified-metric-number">6</div>
                <div className="unified-metric-label">Pilares Estratégicos</div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Pilares - Bento Grid 2x2 */}
      <section id="pilares" className="section-offwhite" style={{ paddingTop: '20px' }}>
        <div className="container text-center">
          <h2 className="animate-on-scroll" style={{ fontSize: '3.5rem', marginBottom: '10px' }}>El futuro es ahora</h2>
          <p className="animate-on-scroll" style={{ fontSize: '1.8rem', marginTop: '0', marginBottom: '40px', color: 'var(--color-bg)' }}>
            6 pilares para construir una marca en el mundo moderno
          </p>
          
                    <div className="bento-grid animate-on-scroll">
            
            {/* Tarjeta 1: Marketing */}
            <div className="bento-card">
              <Image src="/Marketing.png" alt="Marketing" fill style={{ objectFit: 'cover' }} className="bento-bg-image" />
              <div className="bento-overlay"></div>
              <div className="bento-content">
                <h3>Marketing</h3>
                <p>Estrategias comprobadas para atraer clientes todos los días.</p>
                <a href="#" onClick={(e) => openPillarModal('marketing', e)} className="bento-btn">Explorar Marketing</a>
              </div>
            </div>

            {/* Tarjeta 2: Ventas */}
            <div className="bento-card">
              <Image src="/Ventas.png" alt="Ventas" fill style={{ objectFit: 'cover' }} className="bento-bg-image" />
              <div className="bento-overlay"></div>
              <div className="bento-content">
                <h3>Ventas</h3>
                <p>Aprende a crear una necesidad inmediata y acelera la decisión.</p>
                <a href="#" onClick={(e) => openPillarModal('ventas', e)} className="bento-btn">Explorar Ventas</a>
              </div>
            </div>

            {/* Tarjeta 3: Marca Personal */}
            <div className="bento-card">
              <Image src="/Marca_personal.png" alt="Marca Personal" fill style={{ objectFit: 'cover' }} className="bento-bg-image" />
              <div className="bento-overlay"></div>
              <div className="bento-content">
                <h3>Marca Personal</h3>
                <p>Destaca en un mercado saturado y haz que tu nombre sea autoridad.</p>
                <a href="#" onClick={(e) => openPillarModal('marca', e)} className="bento-btn">Explorar Marca</a>
              </div>
            </div>
            
            {/* Tarjeta 4: IA */}
            <div className="bento-card">
              <Image src="/Inteligencia_artificial.jpg" alt="IA" fill style={{ objectFit: 'cover' }} className="bento-bg-image" />
              <div className="bento-overlay"></div>
              <div className="bento-content">
                <h3>Inteligencia Artificial</h3>
                <p>Sistemas a tu medida usando IA de forma productiva.</p>
                <a href="#" onClick={(e) => openPillarModal('ia', e)} className="bento-btn">Explorar IA</a>
              </div>
            </div>

            {/* Tarjeta 5: Mentalidad */}
            <div className="bento-card">
              <Image src="/Mentalidad.png" alt="Mentalidad" fill style={{ objectFit: 'cover' }} className="bento-bg-image" />
              <div className="bento-overlay"></div>
              <div className="bento-content">
                <h3>Mentalidad</h3>
                <p>Rompe con el molde tradicional y reprograma tus sesgos.</p>
                <a href="#" onClick={(e) => openPillarModal('mentalidad', e)} className="bento-btn">Explorar Mentalidad</a>
              </div>
            </div>
            
            {/* Tarjeta 6: Comunicación */}
            <div className="bento-card">
              <Image src="/Comunicacion.png" alt="Comunicacion" fill style={{ objectFit: 'cover' }} className="bento-bg-image" />
              <div className="bento-overlay"></div>
              <div className="bento-content">
                <h3>Comunicación en Cámara</h3>
                <p>Aprende a transmitir tu mensaje con total seguridad.</p>
                <a href="#" onClick={(e) => openPillarModal('comunicacion', e)} className="bento-btn">Explorar Comunicación</a>
              </div>
            </div>

          </div>
        </div>
      </section>



      {/* Banner Mérida */}
      <section className="section-offwhite" style={{ paddingTop: '0px', paddingBottom: '60px' }}>
        <div className="container">
          <div className="bento-card animate-on-scroll" style={{ minHeight: '350px' }}>
            <Image src="/Merida.jpg" alt="Mérida Evento" fill style={{ objectFit: 'cover' }} className="bento-bg-image" />
            <div className="bento-overlay"></div>
            <div className="bento-content">
              <h3 style={{ fontSize: '2.5rem', marginBottom: '15px' }}>MÉRIDA</h3>
              <p style={{ fontSize: '1.2rem', marginBottom: '10px' }}>
                19 y 20 de Septiembre. 2 Días de inmersión intensiva.
              </p>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', marginBottom: '25px', lineHeight: '1.5' }}>
                Día 0: Reservado para los VIP<br/>
                Día 1: Sábado 9:00 AM a 7:00 PM<br/>
                Día 2: Domingo 9:00 AM a 7:00 PM
              </p>
              <a href="#precios" className="bento-btn" style={{ padding: '12px 24px', fontSize: '1rem' }}>Reservar Entrada</a>
            </div>
          </div>
        </div>
      </section>

      {/* Speakers */}
      <section id="speakers" className="section-offwhite">
        <div className="container text-center">
          <span className="subtitle-cyan" style={{ fontSize: '1rem', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--color-bg-darker)' }}>Marketing Xperience 2026</span>
          <h2 className="animate-on-scroll" style={{ fontSize: '2.5rem', marginBottom: '40px' }}>Aprende de los mejores especialistas en Mérida</h2>
          <div className="speakers-grid-gapless animate-on-scroll">
            
            <div className="speaker-card-gapless">
              <Image src="/Eduar_Pena.png" alt="Eduar Peña" fill style={{ objectFit: 'cover' }} className="speaker-bg-full" />
              <div className="speaker-overlay-gradient"></div>
              <div className="speaker-info-gapless">
                <h3>Eduar Peña</h3>
                <p>Marketing e Inteligencia artificial, ha vendido más de 100.000$ digitalmente, co-fundador de Mérida Cakes, asesor de negocios, automatizaciones y marcas personales</p>
              </div>
            </div>

            <div className="speaker-card-gapless">
              <Image src="/Juan_pinto_2.jpg" alt="Juan Pinto" fill style={{ objectFit: 'cover', objectPosition: 'center' }} className="speaker-bg-full" />
              <div className="speaker-overlay-gradient"></div>
              <div className="speaker-info-gapless">
                <h3>Juan Pinto</h3>
                <p>Ventas, oratoria y liderazgo. Reconocido orador, conferencista, consultor de marca y consultor empresarial</p>
              </div>
            </div>

            <div className="speaker-card-gapless">
              <Image src="/Joelymar_Toro.png" alt="Joelymar Toro" fill style={{ objectFit: 'cover' }} className="speaker-bg-full" />
              <div className="speaker-overlay-gradient"></div>
              <div className="speaker-info-gapless">
                <h3>Joelymar Toro</h3>
                <p>Creadora de contenido especialista en marca personal, es imagen de marcas a nivel nacional y ha construido una gran comunidad en redes sociales</p>
              </div>
            </div>

            <div className="speaker-card-gapless">
              <Image src="/Daniel_Zambrano_2.png" alt="Daniel Zambrano" fill style={{ objectFit: 'cover', objectPosition: 'center' }} className="speaker-bg-full" />
              <div className="speaker-overlay-gradient"></div>
              <div className="speaker-info-gapless">
                <h3>Daniel Zambrano</h3>
                <p>Mentalidad y energía de alto nivel, capacitado por Margarita Pasos</p>
              </div>
            </div>

            <div className="speaker-card-gapless">
              <Image src="/Proximamente.png" alt="Proximamente" fill style={{ objectFit: 'cover' }} className="speaker-bg-full" />
              <div className="speaker-overlay-gradient"></div>
              <div className="speaker-info-gapless">
                <h3>Próximamente será revelado</h3>
              </div>
            </div>

          </div>
        </div>
      </section>

      <section className="section-offwhite pt-0">
        <div className="container">
          <div className="takeaways-carousel-wrapper animate-on-scroll" style={{ animationDelay: "0.2s", position: 'relative' }}>
            <h2 className="info-box-title" style={{ textAlign: 'center', marginBottom: '30px', color: 'var(--color-bg-darker)', fontSize: '2.5rem' }}>¿QUÉ TE LLEVARÁS DEL EVENTO?</h2>
            
            <button className="carousel-nav-btn prev" onClick={() => scrollCarousel('left')}>&#10094;</button>
            <button className="carousel-nav-btn next" onClick={() => scrollCarousel('right')}>&#10095;</button>

            <div className="takeaways-carousel" ref={carouselRef}>
              {[
                "/Carrusel/1.png",
                "/Carrusel/2.png",
                "/Carrusel/3.png",
                "/Carrusel/4_v2.png",
                "/Carrusel/5.png",
                "/Carrusel/6.png",
                "/Carrusel/7_v2.png",
                "/Carrusel/8_v2.png"
              ].map((imgUrl, idx) => (
                <div key={idx} className="takeaway-card">
                  <Image src={imgUrl} alt={`Takeaway ${idx + 1}`} fill style={{ objectFit: 'cover' }} className="takeaway-bg" sizes="(max-width: 768px) 100vw, 33vw" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="precios" className="section-pricing-custom">
        <div className="pricing-bg-tickets"></div>
        <div className="container text-center">
          <h2 className="animate-on-scroll" style={{ color: '#fff', fontSize: '3rem', fontWeight: 800, marginBottom: '10px', textTransform: 'uppercase' }}>
            Elige tu experiencia
          </h2>
          <h3 className="animate-on-scroll" style={{ color: '#e6b85c', fontSize: '1.8rem', fontWeight: 600, marginBottom: '50px', letterSpacing: '2px', textTransform: 'uppercase' }}>
            Única edición del año
          </h3>
          <div className="pricing-grid-v3 mt-4 animate-on-scroll">
            
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '350px' }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                <span style={{ color: '#e6b85c', fontSize: '2rem', fontWeight: 800 }}>X</span>
                <span style={{ color: '#fff', fontSize: '1.8rem', fontWeight: 800, letterSpacing: '1px' }}>PERIENCE GENERAL</span>
              </div>
              
              <div style={{ background: '#223340', width: '80%', padding: '15px 20px 30px', borderRadius: '20px 20px 0 0', textAlign: 'center', marginBottom: '-25px', zIndex: 1, position: 'relative' }}>
                <div style={{ fontSize: '0.75rem', color: '#fff', opacity: 0.8, fontWeight: 'bold' }}>PRÓXIMO PRECIO - ULTIMA ETAPA</div>
                <div style={{ fontSize: '1.4rem', color: '#fff', fontWeight: 'bold', marginTop: '5px' }}>${currentPricing.nextGenPrice}</div>
              </div>

              <div className="price-card-v3" style={{ background: '#2b3e4d', border: 'none', borderRadius: '20px', width: '100%', zIndex: 2, padding: '40px 30px 30px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ fontSize: '1.6rem', fontWeight: 'bold', color: '#fff', textTransform: 'uppercase' }}>ETAPA ACTUAL</div>
                <div style={{ fontSize: '4.5rem', fontWeight: 800, color: '#fff', lineHeight: '1', margin: '15px 0 5px' }}>${currentPricing.genPrice}</div>
                <div style={{ fontSize: '0.85rem', color: '#fff', opacity: 0.8, marginBottom: '20px' }}>Tasa BCV</div>
                
                <div style={{ width: '100%', height: '1px', background: '#fff', opacity: 0.3, marginBottom: '20px' }}></div>
                
                <div style={{ fontWeight: 'bold', color: '#fff', marginBottom: '15px', letterSpacing: '1px' }}>INCLUYE</div>
                <div className="pricing-features-v3" style={{ display: 'flex', flexDirection: 'column', gap: '15px', color: '#fff', opacity: 0.9, textAlign: 'center', marginBottom: '30px' }}>
                  <div>Entrada general a los dos días<br/>de capacitación</div>
                  <div>Kit de bienvenida</div>
                  <div>Certificado de participación</div>
                </div>

                <button 
                  className="btn-gradient-pill" 
                  style={{ width: '100%', padding: '15px', background: '#fff', color: '#2b3e4d', boxShadow: '0 4px 15px rgba(0,0,0,0.2)' }}
                  onClick={() => window.open(`https://wa.me/584123060970?text=${encodeURIComponent('¡Hola! Me gustaría inscribirme en el Marketing Xperience con la entrada GENERAL.')}`, '_blank')}
                >
                  Inscribirse por Whatsapp
                </button>
              </div>

              <div style={{ background: '#223340', width: '80%', padding: '35px 20px 15px', borderRadius: '0 0 20px 20px', textAlign: 'center', marginTop: '-25px', zIndex: 1, position: 'relative' }}>
                <div style={{ fontSize: '0.75rem', color: '#fff', opacity: 0.8, fontWeight: 'bold', textTransform: 'uppercase' }}>{currentPricing.prevStage}</div>
                <div style={{ fontSize: '1.4rem', color: '#fff', fontWeight: 'bold', textDecoration: 'line-through', opacity: 0.8, marginTop: '5px' }}>${currentPricing.prevGenPrice}</div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '350px' }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                <span style={{ color: '#e6b85c', fontSize: '2rem', fontWeight: 800 }}>X</span>
                <span style={{ color: '#e6b85c', fontSize: '1.8rem', fontWeight: 800, letterSpacing: '1px' }}>PERIENCE VIP</span>
              </div>
              
              <div style={{ background: '#8b7147', width: '80%', padding: '15px 20px 30px', borderRadius: '20px 20px 0 0', textAlign: 'center', marginBottom: '-25px', zIndex: 1, position: 'relative' }}>
                <div style={{ fontSize: '0.75rem', color: '#fff', opacity: 0.8, fontWeight: 'bold' }}>PRÓXIMO PRECIO - ULTIMA ETAPA</div>
                <div style={{ fontSize: '1.4rem', color: '#fff', fontWeight: 'bold', marginTop: '5px' }}>${currentPricing.nextVipPrice}</div>
              </div>

              <div className="price-card-v3" style={{ background: '#bb9154', border: 'none', borderRadius: '20px', width: '100%', zIndex: 2, padding: '40px 30px 30px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ fontSize: '1.6rem', fontWeight: 'bold', color: '#fff', textTransform: 'uppercase' }}>ETAPA ACTUAL</div>
                <div style={{ fontSize: '4.5rem', fontWeight: 800, color: '#fff', lineHeight: '1', margin: '15px 0 5px' }}>${currentPricing.vipPrice}</div>
                <div style={{ fontSize: '0.85rem', color: '#fff', opacity: 0.8, marginBottom: '20px' }}>Tasa BCV</div>
                
                <div style={{ width: '100%', height: '1px', background: '#fff', opacity: 0.5, marginBottom: '20px' }}></div>
                
                <div style={{ fontWeight: 'bold', color: '#fff', marginBottom: '15px', letterSpacing: '1px' }}>INCLUYE</div>
                <div className="pricing-features-v3" style={{ display: 'flex', flexDirection: 'column', gap: '15px', color: '#fff', opacity: 0.9, textAlign: 'center', marginBottom: '30px' }}>
                  <div>Kit de bienvenida PREMIUM</div>
                  <div>Encuentro privado un día<br/>antes con los ponentes y<br/>networking de alto nivel</div>
                  <div>Masterclass de edición PRO</div>
                  <div>Entrada general a los dos días<br/>de capacitación</div>
                  <div>Certificado de participación</div>
                </div>

                <button 
                  className="btn-gradient-pill" 
                  style={{ width: '100%', padding: '15px', background: '#fff', color: '#bb9154', boxShadow: '0 4px 15px rgba(0,0,0,0.2)' }}
                  onClick={() => window.open(`https://wa.me/584123060970?text=${encodeURIComponent('¡Hola! Me gustaría inscribirme en el Marketing Xperience con la entrada VIP.')}`, '_blank')}
                >
                  Inscribirse por Whatsapp
                </button>
              </div>

              <div style={{ background: '#7b6138', width: '80%', padding: '35px 20px 15px', borderRadius: '0 0 20px 20px', textAlign: 'center', marginTop: '-25px', zIndex: 1, position: 'relative' }}>
                <div style={{ fontSize: '0.75rem', color: '#fff', opacity: 0.8, fontWeight: 'bold', textTransform: 'uppercase' }}>{currentPricing.prevStage}</div>
                <div style={{ fontSize: '1.4rem', color: '#fff', fontWeight: 'bold', textDecoration: 'line-through', opacity: 0.8, marginTop: '5px' }}>{currentPricing.prevVipPrice}$</div>
              </div>
            </div>

          </div>
          <div className="animate-on-scroll" style={{ marginTop: '70px', fontSize: '2.5rem', fontWeight: 700, fontStyle: 'italic', color: '#fff', opacity: 0.95, position: 'relative', zIndex: 2 }}>
            &quot;Trabaja por tus sueños... Si no, trabajarás por los sueños de alguien más&quot;
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="container text-center">
          <p>© 2026 Marketing Xperience. Todos los derechos reservados.</p>
        </div>
      </footer>

      
      {/* Pillar Details Modal */}
      {pillarModalOpen && selectedPillarData && (
        <div className="pillar-modal-overlay" onClick={() => setPillarModalOpen(false)}>
          <div className="pillar-modal-layout" onClick={(e) => e.stopPropagation()}>
            <div className="pillar-modal-image-col">
              <img src={selectedPillarData.image} alt={selectedPillarData.expert} className="pillar-modal-img" />
            </div>
            <div className="pillar-modal-info-col">
              <button className="pillar-modal-close" onClick={() => setPillarModalOpen(false)}>×</button>
              <span className="subtitle-cyan" style={{ letterSpacing: '2px', textTransform: 'uppercase' }}>Experto: {selectedPillarData.expert}</span>
              <h3 className="pillar-modal-title" style={{ marginTop: '10px' }}>{selectedPillarData.title}</h3>
              <p className="pillar-modal-text">{selectedPillarData.text}</p>
              <div className="pillar-modal-actions">
                <button className="btn-blue" onClick={() => { setPillarModalOpen(false); window.location.href = '#precios'; }}>Reservar Entrada</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal */}
      <RegistrationModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        selectedPlan={selectedPlan}
        ticketPrice={ticketPrice}
        purchaseStage={purchaseStage}
        refCode={refCode}
      />
    </main>
  );
}
