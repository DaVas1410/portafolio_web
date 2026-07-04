// Cited contributions to the Diversa org (github.com/DiversaStudio).
const ORG = 'https://github.com/DiversaStudio'

export const diversaContributions = [
  {
    slug: 'feminist-urban-design',
    name: {
      en: 'AI + Feminist Urban Design',
      es: 'IA + Diseño Urbano Feminista',
    },
    accent: 'accent',
    role: { en: 'Co-author', es: 'Coautor' },
    desc: {
      en: 'Comparative study of public spaces in South America and Southeast Asia. Street-level imagery enhanced with Real-ESRGAN super-resolution, YOLO-World object detection, and OSMnx spatial data, scored against six feminist design principles (safety, proximity, diversity, autonomy, vitality, representativeness).',
      es: 'Estudio comparativo de espacios públicos en Sudamérica y el Sudeste Asiático. Imágenes a nivel de calle mejoradas con super-resolución Real-ESRGAN, detección de objetos con YOLO-World y datos espaciales OSMnx, evaluadas según seis principios de diseño feminista (seguridad, proximidad, diversidad, autonomía, vitalidad, representatividad).',
    },
    stack: ['PyTorch', 'YOLO-World', 'Real-ESRGAN', 'OSMnx', 'Street View'],
    repo: `${ORG}/A-comparative-AI-approach-to-feminist-urban-design-of-public-spaces-of-the-GlobalSouth`,
  },
  {
    slug: 'radar-agent',
    name: { en: 'Radar Agent', es: 'Radar Agent' },
    accent: 'warm',
    role: { en: 'Contributor', es: 'Colaborador' },
    desc: {
      en: 'Fullstack research agent that generates search queries, reflects on knowledge gaps, and iteratively refines web research into well-cited answers.',
      es: 'Agente de investigación fullstack que genera consultas de búsqueda, detecta vacíos de conocimiento y refina iterativamente la investigación web en respuestas con citas.',
    },
    stack: ['React', 'LangGraph', 'FastAPI', 'Gemini', 'Docker'],
    repo: `${ORG}/radar_agent`,
  },
]
