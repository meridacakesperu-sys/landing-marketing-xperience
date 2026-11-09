import AgentsLanding from './AgentsLanding';

export const metadata = {
  title: 'Crea tu ecosistema de Agentes de IA interconectados | Master IA',
  description: 'Empieza en diciembre y llega a enero con tu asistente de IA y tu equipo de marketing en marcha. Crea el sistema inteligente para tu negocio.',
  openGraph: {
    title: 'Crea tu ecosistema de Agentes de IA interconectados | Master IA',
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
