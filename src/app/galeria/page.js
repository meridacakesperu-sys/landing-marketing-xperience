import { v2 as cloudinary } from 'cloudinary';
import GaleriaClient from './GaleriaClient';

export const metadata = {
  title: 'Galería | Marketing Xperience',
  description: 'Revive los mejores momentos del evento Marketing Xperience y descarga tus fotografías.',
};

export const revalidate = 300; // Cache the page for 5 minutes (300 seconds)

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

export default async function GaleriaPage() {
  let photos = [];
  
  try {
    // Fetch images from the 'samples/marketing_xperience' folder
    const result = await cloudinary.search
      .expression('folder:samples/marketing_xperience/*')
      .sort_by('created_at', 'desc')
      .max_results(500)
      .execute();
      
    photos = result.resources.map(res => ({
      url: res.secure_url,
      public_id: res.public_id,
      width: res.width,
      height: res.height
    }));
  } catch (error) {
    console.error("Error fetching images from Cloudinary:", error);
  }

  // Fallback to dummy images if no photos exist yet
  if (photos.length === 0) {
    photos = [
      { url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1000&auto=format&fit=crop' },
      { url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=1000&auto=format&fit=crop' },
      { url: 'https://images.unsplash.com/photo-1551818255-e6e10975bc17?q=80&w=1000&auto=format&fit=crop' },
      { url: 'https://images.unsplash.com/photo-1475721025592-7132959c1c5a?q=80&w=1000&auto=format&fit=crop' },
    ];
  }

  return <GaleriaClient initialPhotos={photos} />;
}
