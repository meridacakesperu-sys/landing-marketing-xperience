"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import WaitlistForm from './WaitlistForm';

export default function WaitlistHero({ carouselPhotos1, carouselPhotos2 }) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <>
    <style jsx>{`
      @media (max-width: 768px) {
        .hero-title-group {
          text-align: center !important;
          align-items: center !important;
          margin: 15px auto !important;
        }
        .hero-title-group .subtitle-cyan {
          text-align: center !important;
        }
        .hero-title-group .hero-logo-img-wrapper {
          margin-left: 0 !important;
        }
          align-items: center !important;
          margin: 15px auto !important;
        }
        .hero-logo-wrapper {
          margin: 15px auto !important;
        }
      }
    `}</style>
    <div 
      className="hero-combined-bg" 
      style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        flexDirection: 'column',
        background: `linear-gradient(rgba(15, 23, 42, 0.4), rgba(15, 23, 42, 0.8)), url('/hero_bg_sky_new.png') center top / cover no-repeat`
      }}
    >
      {/* Hero Section */}
      <section className="hero" style={{ paddingBottom: '0' }}>
        <div 
          className="hero-bg-layer"
          style={{ 
            background: `url('/hero_bg_sky_new.png') center center / cover no-repeat`,
            opacity: 0.7,
            filter: 'blur(3px) brightness(0.7)'
          }}
        ></div>
        <div className="container hero-split">
          <div className="hero-text">
            <div className="hero-title-group" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', maxWidth: '450px', marginBottom: '15px' }}>
              <span className="subtitle-cyan" style={{ color: '#e6b85c', width: '100%', textAlign: 'left', marginBottom: '10px', paddingLeft: '2px' }}>EL ANTES Y DESPUÉS DE TU MARCA</span>
              <div className="hero-logo-img-wrapper" style={{ width: '100%', marginLeft: '-8px' }}>
                <img src="/logo.png" alt="Marketing Xperience" style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'contain', objectPosition: 'left center' }} />
              </div>
              <div className="year-2027-text" style={{ fontFamily: 'Impact, Arial Black, sans-serif', fontSize: 'clamp(4rem, 8vw, 6rem)', fontWeight: '900', color: '#ffffff', lineHeight: 1, marginTop: '-5px', letterSpacing: '4px' }}>
                2027
              </div>
            </div>
            <p className="subtitle" style={{ fontSize: '1.2rem', marginTop: '1rem' }}>
              Vive la experiencia multisensorial de un entrenamiento de 2 días de clases Teórico - Prácticas. Compartirás con personas con una visión y una mentalidad increíble.
            </p>
            <div className="hero-buttons">
              <button 
                className="btn-cyan-outline" 
                style={{ letterSpacing: '2px', padding: '16px 32px' }}
                onClick={() => document.getElementById('form-section').scrollIntoView({behavior: 'smooth'})}
              >
                LISTA DE ESPERA
              </button>
            </div>
            <div className="hero-dates-pill">
              3era edición &nbsp;|&nbsp; Mérida &nbsp;|&nbsp; Próximamente 2027
            </div>
          </div>
          
          <div className="hero-image" style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
            <Image 
              className="hero-logo-keep logo-1"
              src="/logos_rrss/3.png" alt="Logo TikTok" width={100} height={100} priority
              style={{ position: 'absolute', top: '12%', left: '-5%', width: '100px', height: '100px', zIndex: 5, filter: 'blur(5px)', opacity: 0.6, transform: `scale(0.8) translate(${mousePos.x * 0.5}px, ${mousePos.y * 0.5}px)`, transition: 'transform 0.1s ease-out' }}
            />
            <Image 
              className="hero-logo-keep logo-2"
              src="/logos_rrss/2.png" alt="Logo 2" width={120} height={120} priority
              style={{ position: 'absolute', top: '25%', right: '-5%', width: '120px', height: '120px', zIndex: 5, filter: 'blur(3px)', opacity: 0.7, transform: `scale(0.9) translate(${mousePos.x * 0.8}px, ${mousePos.y * 0.8}px)`, transition: 'transform 0.1s ease-out' }}
            />
            <Image 
              className="hero-logo-keep logo-3"
              src="/logos_rrss/1.png" alt="Logo Instagram" width={120} height={120} priority
              style={{ position: 'absolute', top: '42%', left: '-5%', width: '120px', height: '120px', zIndex: 15, filter: 'blur(3px)', opacity: 0.9, transform: `scale(1.3) translate(${mousePos.x * 2}px, ${mousePos.y * 2}px)`, transition: 'transform 0.1s ease-out' }}
            />
            <Image 
              className="hero-logo-hide logo-4"
              src="/logos_rrss/4.png" alt="Logo 4" width={110} height={110} priority
              style={{ position: 'absolute', top: '48%', right: '-5%', width: '110px', height: '110px', zIndex: 15, filter: 'blur(4px)', opacity: 1, transform: `scale(1.1) translate(${mousePos.x * 1.5}px, ${mousePos.y * 1.5}px)`, transition: 'transform 0.1s ease-out' }}
            />
            <Image 
              className="hero-logo-hide logo-5"
              src="/logos_rrss/5.png" alt="Logo 5" width={140} height={140} priority
              style={{ position: 'absolute', top: '65%', left: '-5%', width: '140px', height: '140px', zIndex: 20, filter: 'blur(5px)', opacity: 0.8, transform: `scale(1.4) translate(${mousePos.x * 2.5}px, ${mousePos.y * 2.5}px)`, transition: 'transform 0.1s ease-out' }}
            />
            <Image 
              className="hero-logo-hide logo-6"
              src="/logos_rrss/6.png" alt="Logo 6" width={90} height={90} priority
              style={{ position: 'absolute', top: '80%', right: '25%', width: '90px', height: '90px', zIndex: 20, filter: 'blur(2px)', opacity: 0.9, transform: `scale(1) translate(${mousePos.x}px, ${mousePos.y}px)`, transition: 'transform 0.1s ease-out' }}
            />
            <Image 
              className="hero-logo-hide logo-7"
              src="/logos_rrss/7.png" alt="Logo 7" width={100} height={100} priority
              style={{ position: 'absolute', top: '85%', right: '-5%', width: '100px', height: '100px', zIndex: 20, filter: 'blur(4px)', opacity: 0.7, transform: `scale(0.9) translate(${mousePos.x * 1.2}px, ${mousePos.y * 1.2}px)`, transition: 'transform 0.1s ease-out' }}
            />

            <Image 
              src="/rocket_new.png" 
              alt="Rocket"
              width={400} 
              height={600}
              className="hero-rocket"
              style={{ position: 'relative', zIndex: 10, objectFit: 'contain', filter: 'drop-shadow(0px 20px 40px rgba(230, 184, 92, 0.2))', transform: `translate(${mousePos.x * 0.5}px, ${mousePos.y * 0.5}px)`, transition: 'transform 0.1s ease-out' }}
              priority
            />
          </div>
        </div>
      </section>

      {/* Dynamic Image Carousel (from Cloudinary) */}
      <div className="carousel-wrapper" style={{ marginTop: '50px', marginBottom: '80px', zIndex: 10 }}>
        <div className="carousel-track">
          <div className="carousel-inner" style={{ animationDuration: '100s' }}>
            {carouselPhotos1.map((url, i) => (
              <div key={i} className="carousel-card">
                <Image src={url} alt={`Gallery Image ${i}`} fill style={{ objectFit: 'cover' }} sizes="(max-width: 768px) 50vw, 350px" />
              </div>
            ))}
          </div>
        </div>
        <div className="carousel-track">
          <div className="carousel-inner inner-right" style={{ animationDuration: '100s' }}>
            {carouselPhotos2.map((url, i) => (
              <div key={i} className="carousel-card">
                <Image src={url} alt={`Gallery Image ${i}`} fill style={{ objectFit: 'cover' }} sizes="(max-width: 768px) 50vw, 350px" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div id="form-section" style={{ maxWidth: '600px', margin: '0 auto 100px auto', backgroundColor: 'rgba(30, 41, 59, 0.7)', borderRadius: '24px', padding: '40px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)', border: '1px solid rgba(255,255,255,0.05)', zIndex: 10, position: 'relative' }}>
        <header style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h2 style={{ color: '#e6b85c', fontSize: '2rem', marginBottom: '15px', fontWeight: '800', lineHeight: '1.2' }}>
            Únete a la Lista de Espera
          </h2>
          <p style={{ color: '#cbd5e1', fontSize: '1.1rem', lineHeight: '1.6' }}>
            Asegura tu lugar para el evento más esperado del próximo año. Al registrarte hoy, garantizas <strong>beneficios exclusivos</strong> y el <strong>mejor precio de todos</strong> cuando abramos inscripciones.
          </p>
        </header>

        <WaitlistForm />
        
        <div style={{ marginTop: '40px', textAlign: 'center', color: '#64748b', fontSize: '0.85rem' }}>
          <p>© {new Date().getFullYear()} Marketing Xperience. Todos los derechos reservados.</p>
        </div>
      </div>
    </div>
    </>
  );
}
