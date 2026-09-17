'use client';

import { useState } from 'react';
import html2canvas from 'html2canvas';

export default function DownloadButton({ targetId, fileName, isVIP }) {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    try {
      setDownloading(true);
      const element = document.getElementById(targetId);
      if (!element) return;
      
      // We use html2canvas to capture the element
      const canvas = await html2canvas(element, {
        scale: 2, // High resolution
        backgroundColor: '#0f172a', // Match the card's theme roughly
        useCORS: true,
      });
      
      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = image;
      link.download = fileName;
      link.click();
    } catch (error) {
      console.error('Error downloading ticket:', error);
      alert('Hubo un error al descargar la entrada.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <button 
      onClick={handleDownload}
      disabled={downloading}
      style={{ 
        background: isVIP ? '#c19845' : '#3b82f6', 
        color: '#fff', 
        padding: '10px 20px', 
        borderRadius: '8px', 
        border: 'none',
        fontWeight: 'bold', 
        display: 'inline-block',
        cursor: downloading ? 'not-allowed' : 'pointer',
        opacity: downloading ? 0.7 : 1,
        fontFamily: 'inherit',
        fontSize: '1rem'
      }}
    >
      {downloading ? 'Descargando...' : '⬇️ Guardar Entrada'}
    </button>
  );
}
