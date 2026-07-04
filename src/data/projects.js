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
  },
]
