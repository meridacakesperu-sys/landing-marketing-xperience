"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function GaleriaClient({ initialPhotos }) {
  const [activePhoto, setActivePhoto] = useState(null);
  const [isMobile, setIsMobile] = useState(true); // Default to mobile to be safe

  useEffect(() => {
    // Check if device supports touch or has a small screen
    const checkDevice = () => {
      const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      setIsMobile(isTouch || window.innerWidth < 1024);
    };
    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  // Prevent scrolling when lightbox is open
  if (typeof window !== 'undefined') {
    document.body.style.overflow = activePhoto ? 'hidden' : 'auto';
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f172a', padding: '40px 20px', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        <header style={{ textAlign: 'center', marginBottom: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ position: 'relative', width: '200px', height: '100px', marginBottom: '10px' }}>
            <Image 
              src="/logo.png" 
              alt="Marketing Xperience Logo" 
              fill 
              style={{ objectFit: 'contain' }}
              priority
            />
          </div>
          <h1 style={{ color: '#e6b85c', fontSize: '2.5rem', marginBottom: '10px' }}>Galería Oficial</h1>
          <p style={{ color: '#94a3b8', fontSize: '1.1rem' }}>Revive los mejores momentos de Marketing Xperience. Toca cualquier foto para verla en grande.</p>
        </header>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
          gap: '20px',
          paddingBottom: '40px'
        }}>
          {initialPhotos.map((photo, index) => (
            <div 
              key={index} 
              onClick={() => setActivePhoto(photo.url)}
              style={{
                position: 'relative',
                aspectRatio: '3/2',
                borderRadius: '12px',
                overflow: 'hidden',
                cursor: 'zoom-in',
                transition: 'all 0.2s ease-in-out',
                boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
                border: '1px solid #1e293b'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <Image 
                src={photo.url}
                alt={`Marketing Xperience Foto ${index + 1}`}
                fill
                style={{ objectFit: 'cover' }}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Full Screen Lightbox */}
      {activePhoto && (
        <div 
          onClick={() => setActivePhoto(null)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.95)',
            backdropFilter: 'blur(10px)',
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            animation: 'fadeIn 0.2s ease-out'
          }}
        >
          <style>{`
            @keyframes fadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
          `}</style>
          
          <button 
            onClick={(e) => { e.stopPropagation(); setActivePhoto(null); }}
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              background: 'rgba(0,0,0,0.5)',
              color: 'white',
              border: '2px solid white',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              fontSize: '1.2rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              zIndex: 1001,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            ✕
          </button>

          <div style={{
            position: 'absolute',
            top: '30px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(230, 184, 92, 0.9)',
            color: '#0f172a',
            padding: '10px 20px',
            borderRadius: '50px',
            fontWeight: 'bold',
            fontSize: '0.95rem',
            textAlign: 'center',
            zIndex: 1001,
            boxShadow: '0 4px 15px rgba(0,0,0,0.5)',
            pointerEvents: 'none', // Allows clicking through the text to the image if needed
            width: '80%',
            maxWidth: '500px'
          }}>
            {isMobile 
              ? '💡 Mantén presionada la foto para guardarla en tu galería' 
              : '💡 Haz clic derecho sobre la foto y selecciona "Guardar imagen como..."'}
          </div>

          <div 
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking the image itself
            style={{ 
              position: 'relative', 
              width: '90%', 
              height: '80%', 
              maxWidth: '1200px',
              maxHeight: '80vh',
              marginTop: '40px'
            }}
          >
            <Image 
              src={activePhoto}
              alt="Foto ampliada"
              fill
              style={{ objectFit: 'contain' }}
              sizes="100vw"
              priority // Load the full res image immediately
            />
          </div>
        </div>
      )}
    </div>
  );
}
