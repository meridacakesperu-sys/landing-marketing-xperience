import { v2 as cloudinary } from 'cloudinary';
import WaitlistHero from './WaitlistHero';

export const metadata = {
  title: 'Lista de Espera 2027 | Marketing Xperience',
  description: 'Únete a la lista de espera para Marketing Xperience 2027 y obtén beneficios exclusivos.',
};

export const revalidate = 300; // Cache the page for 5 minutes

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

export default async function WaitlistPage() {
  let photos = [];
  
  try {
    const result = await cloudinary.search
      .expression('folder:samples/marketing_xperience/*')
      .sort_by('created_at', 'desc')
      .max_results(20) // Only need some for the carousel
      .execute();
      
    photos = result.resources.map(res => res.secure_url);
  } catch (error) {
    console.error("Error fetching images for waitlist:", error);
  }

  if (photos.length === 0) {
    photos = [
      'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1000',
      'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=1000',
      'https://images.unsplash.com/photo-1551818255-e6e10975bc17?q=80&w=1000',
      'https://images.unsplash.com/photo-1475721025592-7132959c1c5a?q=80&w=1000',
    ];
  }

  // Duplicate photos to ensure smooth continuous scrolling
  const carouselPhotos1 = [...photos, ...photos];
  const carouselPhotos2 = [...photos.reverse(), ...photos.reverse()];

  return <WaitlistHero carouselPhotos1={carouselPhotos1} carouselPhotos2={carouselPhotos2} />;
}
