'use client';

import { useState } from 'react';
import * as htmlToImage from 'html-to-image';
import jsPDF from 'jspdf';

export default function DownloadCertButton({ targetId, userName }) {
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [downloadingImg, setDownloadingImg] = useState(false);

  const handleDownloadPdf = async () => {
    try {
      setDownloadingPdf(true);
      const element = document.getElementById(targetId);
      if (!element) return;
      
      const dataUrl = await htmlToImage.toPng(element, {
        quality: 1.0,
        pixelRatio: 3, // Very high quality for PDF
      });
      
      // Certificate is landscape. Let's use A4 landscape.
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [element.offsetWidth, element.offsetHeight]
      });
      
      pdf.addImage(dataUrl, 'PNG', 0, 0, element.offsetWidth, element.offsetHeight);
      pdf.save(`Certificado_${userName.replace(/\\s+/g, '_')}.pdf`);
    } catch (error) {
      console.error('Error downloading certificate:', error);
      alert('Hubo un error al descargar el certificado.');
    } finally {
      setDownloadingPdf(false);
    }
  };

  const handleDownloadImg = async () => {
    try {
      setDownloadingImg(true);
      const element = document.getElementById(targetId);
      if (!element) return;
      
      const dataUrl = await htmlToImage.toPng(element, {
        quality: 1.0,
        pixelRatio: 3, // Very high quality for image
      });
      
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `Certificado_${userName.replace(/\\s+/g, '_')}.png`;
      link.click();
    } catch (error) {
      console.error('Error downloading certificate:', error);
      alert('Hubo un error al descargar el certificado.');
    } finally {
      setDownloadingImg(false);
    }
  };

  return (
    <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginTop: '30px' }}>
      <button 
        onClick={handleDownloadPdf}
        disabled={downloadingPdf || downloadingImg}
        style={{ 
          background: '#ef4444', 
          color: '#fff', 
          padding: '12px 24px', 
          borderRadius: '8px', 
          border: 'none',
          fontWeight: 'bold', 
          cursor: downloadingPdf ? 'not-allowed' : 'pointer',
          opacity: (downloadingPdf || downloadingImg) ? 0.7 : 1,
          fontFamily: 'inherit',
          fontSize: '1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}
      >
        {downloadingPdf ? 'Generando PDF...' : '📄 Descargar PDF'}
      </button>
      
      <button 
        onClick={handleDownloadImg}
        disabled={downloadingPdf || downloadingImg}
        style={{ 
          background: '#3b82f6', 
          color: '#fff', 
          padding: '12px 24px', 
          borderRadius: '8px', 
          border: 'none',
          fontWeight: 'bold', 
          cursor: downloadingImg ? 'not-allowed' : 'pointer',
          opacity: (downloadingPdf || downloadingImg) ? 0.7 : 1,
          fontFamily: 'inherit',
          fontSize: '1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}
      >
        {downloadingImg ? 'Guardando...' : '🖼️ Guardar como Imagen'}
      </button>
    </div>
  );
}
