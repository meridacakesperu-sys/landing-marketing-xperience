import AgentsLanding from './AgentsLanding';

export const metadata = {
  title: 'Si no tienes tiempo y quieres crear contenido AQUÍ ES | Master IA',
  description: 'Crea tu ecosistema de Agentes de IA interconectados. Empieza en Diciembre y llega a Enero con tu asistente personal de IA y tu equipo de marketing en marcha.',
  openGraph: {
    title: 'Si no tienes tiempo y quieres crear contenido AQUÍ ES | Master IA',
    description: 'Crea tu ecosistema de Agentes de IA interconectados. Empieza en Diciembre y llega a Enero con tu asistente personal de IA y tu equipo de marketing en marcha.',
    url: 'https://landing-marketing-xperience.vercel.app/agentes',
    siteName: 'Marketing Xperience',
    locale: 'es_LA',
    type: 'website',
  },
};

export default function AgentesPage() {
  return <AgentsLanding />;
}
