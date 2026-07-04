// Project cards derived from real repositories on github.com/DaVas1410.
// Descriptions summarize each repo's actual README — no invented content.
// `accent` selects which of the two palette poles the card leans on.

const GH = 'https://github.com/DaVas1410'

export const projects = [
  {
    slug: 'cnn_astro',
    name: 'Fractal Cloud CNN',
    featured: true,
    accent: 'accent',
    desc: {
      en: 'Deep-learning pipeline predicting fractal turbulence parameters (k_min, k_max) from synthetic interstellar cloud images. ~99% accuracy on k_min classification; trained on HPC/SLURM.',
      es: 'Pipeline de deep learning que predice parámetros de turbulencia fractal (k_min, k_max) desde imágenes sintéticas del medio interestelar. ~99% de precisión en k_min; entrenado en HPC/SLURM.',
    },
    stack: ['PyTorch', 'CNNs', 'ResNet-50', 'HDF5', 'SLURM'],
    repo: `${GH}/cnn_astro`,
    tag: { en: 'Thesis', es: 'Tesis' },
    outcome: {
      en: '~99% accuracy recovering the turbulence parameter k_min directly from synthetic interstellar-cloud images.',
      es: '~99% de precisión recuperando el parámetro de turbulencia k_min directamente desde imágenes sintéticas del medio interestelar.',
    },
  },
  {
    slug: 'orbits-simulation',
    name: 'orbits-simulation',
    accent: 'warm',
    desc: {
      en: 'Python package for two-body orbital dynamics with Newtonian and relativistic physics — Mercury perihelion precession, Schwarzschild orbits, RK45 integration, animated GIFs.',
      es: 'Paquete Python para dinámica orbital de dos cuerpos con física newtoniana y relativista — precesión del perihelio de Mercurio, órbitas de Schwarzschild, integración RK45 y GIFs animados.',
    },
    stack: ['Python', 'NumPy', 'SciPy', 'Matplotlib'],
    repo: `${GH}/orbits-simulation`,
    tag: null,
    outcome: {
      en: "Reproduces Mercury's perihelion precession from a relativistic two-body integrator.",
      es: 'Reproduce la precesión del perihelio de Mercurio desde un integrador relativista de dos cuerpos.',
    },
  },
  {
    slug: 'relativity_rag',
    name: 'GR RAG Agent',
    accent: 'accent',
    desc: {
      en: 'Local, privacy-first RAG agent for graduate General Relativity. OCR for handwritten notes, LaTeX rendering, 3D embedding visualization, and a fully offline LLM.',
      es: 'Agente RAG local y privado para Relatividad General de posgrado. OCR de notas manuscritas, render LaTeX, visualización 3D de embeddings y un LLM 100% offline.',
    },
    stack: ['Next.js', 'FastAPI', 'LangChain', 'ChromaDB', 'Ollama'],
    repo: `${GH}/relativity_rag`,
    tag: null,
    outcome: {
      en: 'A fully offline GR study agent that OCRs handwritten notes and answers in rendered LaTeX — no data leaves the machine.',
      es: 'Un agente de estudio de RG 100% offline que hace OCR de notas manuscritas y responde en LaTeX renderizado — ningún dato sale de la máquina.',
    },
  },
  {
    slug: 'deepsci-agent',
    name: 'DeepSci Agent',
    accent: 'warm',
    desc: {
      en: 'Terminal AI research assistant over 2M+ arXiv papers — AI-powered paper comparison, citation-network graphs, and a local semantic library, fully offline.',
      es: 'Asistente de investigación en terminal sobre 2M+ papers de arXiv — comparación de papers con IA, grafos de redes de citación y una librería semántica local, todo offline.',
    },
    stack: ['Python', 'Rich', 'ChromaDB', 'NetworkX', 'llama.cpp'],
    repo: `${GH}/deepsci-agent`,
    tag: null,
    outcome: {
      en: 'Semantic search and citation-network graphs over 2M+ arXiv papers, running entirely local.',
      es: 'Búsqueda semántica y grafos de redes de citación sobre 2M+ papers de arXiv, todo local.',
    },
  },
  {
    slug: 'pinn_demo',
    name: "PINN · Burgers' Equation",
    accent: 'accent',
    desc: {
      en: "Interactive web app solving Burgers' equation with Physics-Informed Neural Networks — mesh-free PDE solving via automatic differentiation, with live training plots.",
      es: 'App web interactiva que resuelve la ecuación de Burgers con Physics-Informed Neural Networks — resolución de PDEs sin malla vía autodiferenciación, con plots de entrenamiento en vivo.',
    },
    stack: ['PyTorch', 'Flask', 'Plotly.js', 'PINNs'],
    repo: `${GH}/pinn_demo`,
    tag: null,
    outcome: {
      en: "Solves Burgers' equation mesh-free in the browser, with live training-loss plots.",
      es: 'Resuelve la ecuación de Burgers sin malla en el navegador, con plots de pérdida en vivo.',
    },
  },
  {
    slug: 'TopoGenTech',
    name: 'TopoGenTech',
    accent: 'warm',
    desc: {
      en: 'Geospatial platform combining ML with Topological Data Analysis (persistent homology) to detect palm-oil expansion and forest fragmentation across Ecuador.',
      es: 'Plataforma geoespacial que combina ML con Análisis Topológico de Datos (homología persistente) para detectar expansión de palma y fragmentación de bosque en Ecuador.',
    },
    stack: ['Earth Engine', 'Giotto-tda', 'Ripser', 'GeoPandas', 'Next.js'],
    repo: `${GH}/TopoGenTech`,
    tag: null,
    outcome: {
      en: 'Flags palm-oil expansion and forest fragmentation across Ecuador using persistent homology + ML.',
      es: 'Detecta expansión de palma y fragmentación de bosque en Ecuador usando homología persistente + ML.',
    },
  },
  {
    slug: 'yachay_water_study',
    name: 'Water Station Siting',
    accent: 'accent',
    desc: {
      en: 'Geospatial site-selection study for water-refill stations at Yachay Tech — solar-radiation modeling (NASA POWER), shade & accessibility scoring, interactive maps.',
      es: 'Estudio geoespacial de ubicación de estaciones de recarga de agua en Yachay Tech — modelado de radiación solar (NASA POWER), scoring de sombra y acceso, mapas interactivos.',
    },
    stack: ['Python', 'NASA POWER', 'GeoPandas', 'Folium'],
    repo: `${GH}/yachay_water_study`,
    tag: null,
    outcome: {
      en: 'Ranks water-refill sites by solar exposure, shade, and accessibility from NASA POWER data.',
      es: 'Clasifica ubicaciones de recarga de agua por exposición solar, sombra y accesibilidad con datos de NASA POWER.',
    },
  },
  {
    slug: 'web_aefn',
    name: 'AEYT Student Portal',
    accent: 'warm',
    desc: {
      en: 'Collaborative web portal for student management at Yachay Tech, developed for the student association (AEYT).',
      es: 'Portal web colaborativo para la gestión estudiantil en Yachay Tech, desarrollado para la asociación de estudiantes (AEYT).',
    },
    stack: ['HTML', 'CSS', 'JavaScript'],
    repo: `${GH}/web_aefn`,
    tag: null,
    outcome: {
      en: 'Shipped a student-management portal for the Yachay Tech student association.',
      es: 'Entregué un portal de gestión estudiantil para la asociación de estudiantes de Yachay Tech.',
    },
  },
]
