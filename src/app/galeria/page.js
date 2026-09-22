import GaleriaClient from './GaleriaClient';

export const metadata = {
  title: 'Galería | Marketing Xperience',
  description: 'Revive los mejores momentos del evento Marketing Xperience y descarga tus fotografías.',
};

export default function GaleriaPage() {
  // Temporary dummy photos for testing the UI
  // Later, you can fetch these from Cloudinary, Vercel Blob, or a database
  const dummyPhotos = [
    { url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1000&auto=format&fit=crop' }, // Event audience
    { url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=1000&auto=format&fit=crop' }, // Stage
    { url: 'https://images.unsplash.com/photo-1551818255-e6e10975bc17?q=80&w=1000&auto=format&fit=crop' }, // People talking
    { url: 'https://images.unsplash.com/photo-1475721025592-7132959c1c5a?q=80&w=1000&auto=format&fit=crop' }, // Smiling
    { url: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=1000&auto=format&fit=crop' }, // Tech event
    { url: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=1000&auto=format&fit=crop' }, // Networking
    { url: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?q=80&w=1000&auto=format&fit=crop' }, // Conference
    { url: 'https://images.unsplash.com/photo-1523580494112-071dcb85170d?q=80&w=1000&auto=format&fit=crop' }, // Group
  ];

  return <GaleriaClient initialPhotos={dummyPhotos} />;
}
