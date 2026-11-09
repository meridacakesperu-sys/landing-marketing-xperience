import AgentsLanding from './AgentsLanding';

export const metadata = {
  title: 'Tu Asistente de IA y Equipo de Marketing | Marketing Xperience',
  description: 'Empieza en diciembre y llega a enero con tu asistente de IA y tu equipo de marketing en marcha. Ideas ilimitadas, guiones comprobados y edición en automático.',
  openGraph: {
    title: 'Tu Asistente de IA y Equipo de Marketing | Marketing Xperience',
    description: 'Empieza en diciembre y llega a enero con tu asistente de IA y tu equipo de marketing en marcha.',
    url: 'https://landing-marketing-xperience.vercel.app/agentes',
    siteName: 'Marketing Xperience',
    locale: 'es_LA',
    type: 'website',
  },
};

export default function AgentesPage() {
  return <AgentsLanding />;
}
