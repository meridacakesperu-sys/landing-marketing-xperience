"use client";

import { useState } from 'react';
import Image from 'next/image';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

export default function GaleriaClient({ initialPhotos }) {
  const [selectedPhotos, setSelectedPhotos] = useState([]);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadingSingle, setDownloadingSingle] = useState(null); // Track which photo is downloading

  const toggleSelection = (photoUrl, e) => {
    // Prevent toggling selection when clicking the download button
    if (e && e.target.closest('button')) return;

    if (selectedPhotos.includes(photoUrl)) {
      setSelectedPhotos(selectedPhotos.filter(url => url !== photoUrl));
    } else {
      setSelectedPhotos([...selectedPhotos, photoUrl]);
    }
  };

  const handleDownloadSingle = async (url, index, e) => {
    e.stopPropagation(); // Don't trigger the photo selection
    setDownloadingSingle(url);
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const urlObj = new URL(url, window.location.href);
      const filename = urlObj.pathname.split('/').pop() || `foto_${index + 1}.jpg`;
      saveAs(blob, filename);
    } catch (error) {
      console.error("Error al descargar la foto:", error);
      alert("Hubo un error al descargar la foto.");
    } finally {
      setDownloadingSingle(null);
    }
  };

  const handleDownloadZip = async () => {
    if (selectedPhotos.length === 0) return;
    setIsDownloading(true);
    
    try {
      const zip = new JSZip();
      const folder = zip.folder("Marketing_Xperience_Fotos");
      
      // Fetch all selected images as blobs
      for (let i = 0; i < selectedPhotos.length; i++) {
        const url = selectedPhotos[i];
        const response = await fetch(url);
        const blob = await response.blob();
        
        // Extract a filename from the URL, or generate one
        const urlObj = new URL(url, window.location.href);
        const filename = urlObj.pathname.split('/').pop() || `foto_${i+1}.jpg`;
        
        folder.file(filename, blob);
      }
      
      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, "Marketing_Xperience_Fotos.zip");
      
      // Clear selection after download
      setSelectedPhotos([]);
    } catch (error) {
      console.error("Error al descargar:", error);
      alert("Hubo un error al descargar las fotos. Por favor, intenta de nuevo.");
    } finally {
      setIsDownloading(false);
    }
  };

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
          <p style={{ color: '#94a3b8', fontSize: '1.1rem' }}>Revive los mejores momentos de Marketing Xperience. Selecciona las fotos en las que apareces para descargarlas todas juntas, o descarga cada una individualmente.</p>
        </header>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
          gap: '20px',
          paddingBottom: '120px' // Space for the fixed bottom bar
        }}>
          {initialPhotos.map((photo, index) => {
            const isSelected = selectedPhotos.includes(photo.url);
            const isDownloadingThis = downloadingSingle === photo.url;
            return (
              <div 
                key={index} 
                onClick={(e) => toggleSelection(photo.url, e)}
                style={{
                  position: 'relative',
                  aspectRatio: '3/2',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  border: isSelected ? '4px solid #e6b85c' : '4px solid transparent',
                  transition: 'all 0.2s ease-in-out',
                  transform: isSelected ? 'scale(0.98)' : 'scale(1)',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
                }}
              >
                <Image 
                  src={photo.url}
                  alt={`Marketing Xperience Foto ${index + 1}`}
                  fill
                  style={{ objectFit: 'cover' }}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  loading="lazy"
                />
                
                {/* Download Single Icon */}
                <button
                  onClick={(e) => handleDownloadSingle(photo.url, index, e)}
                  disabled={isDownloadingThis}
                  title="Descargar solo esta foto"
                  style={{
                    position: 'absolute',
                    bottom: '10px',
                    right: '10px',
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(15, 23, 42, 0.7)',
                    border: '1px solid rgba(255,255,255,0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    cursor: isDownloadingThis ? 'not-allowed' : 'pointer',
                    zIndex: 10,
                    backdropFilter: 'blur(4px)',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e6b85c'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(15, 23, 42, 0.7)'}
                >
                  {isDownloadingThis ? '⌛' : '⬇️'}
                </button>

                {/* Selection Overlay */}
                <div style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  width: '30px',
                  height: '30px',
                  borderRadius: '50%',
                  backgroundColor: isSelected ? '#e6b85c' : 'rgba(15, 23, 42, 0.6)',
                  border: isSelected ? 'none' : '2px solid white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: isSelected ? '#0f172a' : 'white',
                  fontWeight: 'bold',
                  zIndex: 10
                }}>
                  {isSelected && '✓'}
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Fixed Bottom Action Bar */}
      {selectedPhotos.length > 0 && (
        <div style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.95)',
          backdropFilter: 'blur(10px)',
          borderTop: '1px solid #1e293b',
          padding: '15px 20px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 100,
          animation: 'slideUp 0.3s ease-out'
        }}>
          <style>{`
            @keyframes slideUp {
              from { transform: translateY(100%); }
              to { transform: translateY(0); }
            }
          `}</style>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '8px' }}>
            <span style={{ color: '#fff', fontSize: '1.1rem' }}>
              <strong style={{ color: '#e6b85c' }}>{selectedPhotos.length}</strong> {selectedPhotos.length === 1 ? 'foto seleccionada' : 'fotos seleccionadas'}
            </span>
            
            <button 
              onClick={handleDownloadZip}
              disabled={isDownloading}
              style={{
                backgroundColor: '#e6b85c',
                color: '#0f172a',
                border: 'none',
                padding: '10px 25px',
                borderRadius: '50px',
                fontWeight: 'bold',
                fontSize: '1rem',
                cursor: isDownloading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                boxShadow: '0 4px 15px rgba(230, 184, 92, 0.3)',
                transition: 'background-color 0.2s',
                opacity: isDownloading ? 0.7 : 1
              }}
            >
              {isDownloading ? 'Empaquetando...' : `⬇️ Descargar ${selectedPhotos.length} en ZIP`}
            </button>

            <button 
              onClick={() => setSelectedPhotos([])}
              style={{
                backgroundColor: 'transparent',
                color: '#94a3b8',
                border: '1px solid #334155',
                padding: '8px 16px',
                borderRadius: '50px',
                cursor: 'pointer',
                fontSize: '0.9rem'
              }}
            >
              Cancelar
            </button>
          </div>
          <p style={{ color: '#64748b', fontSize: '0.85rem', margin: 0, textAlign: 'center' }}>
            💡 <strong>Tip desde tu celular:</strong> Las fotos en ZIP se guardarán en tu app de <i>Descargas</i> o <i>Archivos</i>. Tócalo para extraerlas.
          </p>
        </div>
      )}
    </div>
  );
}
