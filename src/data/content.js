// All bilingual copy for the site, keyed by { en, es }.
// Links: LinkedIn and CV are placeholders you can swap later (see README).

export const links = {
  github: 'https://github.com/DaVas1410',
  linkedin: 'https://www.linkedin.com/', // TODO: replace with your profile URL
  email: 'juan.vasconezvela@gmail.com',
  cv: '/cv.pdf',
}

export const nav = [
  { id: 'about', label: { en: 'About', es: 'Sobre mí' } },
  { id: 'projects', label: { en: 'Projects', es: 'Proyectos' } },
  { id: 'research', label: { en: 'Research', es: 'Investigación' } },
  { id: 'experience', label: { en: 'Experience', es: 'Experiencia' } },
  { id: 'skills', label: { en: 'Skills', es: 'Skills' } },
  { id: 'contact', label: { en: 'Contact', es: 'Contacto' } },
]

export const hero = {
  greeting: { en: "Hi, I'm", es: 'Hola, soy' },
  name: 'Juan Vásconez',
  role: { en: 'Physics student & Data Scientist', es: 'Estudiante de física y Data Scientist' },
  tagline: {
    en: 'I work where physics meets data and AI — from fractal turbulence in the interstellar medium to language models that serve real people.',
    es: 'Trabajo donde la física se encuentra con los datos y la IA — desde la turbulencia fractal del medio interestelar hasta modelos de lenguaje al servicio de personas reales.',
  },
  location: { en: 'Yachay Tech University · Ecuador', es: 'Yachay Tech University · Ecuador' },
  ctaGithub: { en: 'View GitHub', es: 'Ver GitHub' },
  ctaContact: { en: 'Get in touch', es: 'Contacto' },
  ctaCv: { en: 'CV', es: 'CV' },
}

export const about = {
  eyebrow: { en: 'about', es: 'sobre mí' },
  title: { en: 'Physics, data, and things that compute', es: 'Física, datos, y cosas que computan' },
  body: {
    en: [
      "I'm Juan, a physics student at Yachay Tech University in Ecuador. My curiosity lives at the intersection of complex systems, dynamical systems, general relativity, and data science applied to physics.",
      'As a Data Scientist at Diversa, a consultancy, I collaborate on NLP, AI governance, humanitarian technology, and data visualization — including a RAG chatbot built to support Venezuelan migrants.',
      'Outside the lab I organize the Yachay Open Science Week (YOSW) 2026 and stay active in university student government. I care a lot about making science legible — good visualization and clear writing included.',
    ],
    es: [
      'Soy Juan, estudiante de física en Yachay Tech University, en Ecuador. Mi curiosidad vive en la intersección de los sistemas complejos, los sistemas dinámicos, la relatividad general y la ciencia de datos aplicada a la física.',
      'Como Data Scientist en Diversa, una consultora, colaboro en proyectos de NLP, gobernanza de IA, tecnología humanitaria y visualización de datos — incluyendo un chatbot RAG para apoyar a migrantes venezolanos.',
      'Fuera del laboratorio organizo la Yachay Open Science Week (YOSW) 2026 y participo en el gobierno estudiantil universitario. Me importa hacer la ciencia legible — buena visualización y escritura clara incluidas.',
    ],
  },
  facts: [
    { k: { en: 'Focus', es: 'Enfoque' }, v: { en: 'Computational physics · ML', es: 'Física computacional · ML' } },
    { k: { en: 'Currently', es: 'Ahora' }, v: { en: 'Data Scientist @ Diversa', es: 'Data Scientist @ Diversa' } },
    { k: { en: 'Organizing', es: 'Organizando' }, v: { en: 'Yachay Open Science Week 2026', es: 'Yachay Open Science Week 2026' } },
  ],
}

export const projectsSection = {
  eyebrow: { en: 'projects', es: 'proyectos' },
  title: { en: 'Selected work', es: 'Trabajo seleccionado' },
  intro: {
    en: 'Real repositories, pulled straight from GitHub. Physics simulations, ML research, and applied-AI tools.',
    es: 'Repositorios reales, tomados directo de GitHub. Simulaciones de física, investigación en ML y herramientas de IA aplicada.',
  },
  viewRepo: { en: 'Repository', es: 'Repositorio' },
  more: { en: 'More on GitHub', es: 'Más en GitHub' },
}

export const research = {
  eyebrow: { en: 'research · thesis', es: 'investigación · tesis' },
  title: {
    en: 'Reading turbulence in synthetic skies',
    es: 'Leyendo la turbulencia en cielos sintéticos',
  },
  supervisor: {
    en: 'Undergraduate thesis · supervised by Prof. Wladimir Banda-Barragán',
    es: 'Tesis de pregrado · supervisada por el Prof. Wladimir Banda-Barragán',
  },
  body: {
    en: [
      'The interstellar medium is turbulent, and that turbulence leaves a fractal fingerprint on the clouds of gas between the stars. My thesis asks a direct question: can a neural network recover the physical parameters of that turbulence just by looking at an image of the cloud?',
      'I generate large sets of synthetic cloud images with known fractal parameters, then train convolutional neural networks to predict them. The work progresses from classification to regression, and into transfer learning with pretrained backbones like ResNet-50 and DINOv2 — letting features learned on natural images bootstrap a genuinely astrophysical task.',
    ],
    es: [
      'El medio interestelar es turbulento, y esa turbulencia deja una huella fractal en las nubes de gas entre las estrellas. Mi tesis plantea una pregunta directa: ¿puede una red neuronal recuperar los parámetros físicos de esa turbulencia con solo mirar una imagen de la nube?',
      'Genero grandes conjuntos de imágenes sintéticas de nubes con parámetros fractales conocidos y entreno redes neuronales convolucionales para predecirlos. El trabajo avanza de clasificación a regresión, y hacia transfer learning con backbones preentrenados como ResNet-50 y DINOv2 — dejando que características aprendidas en imágenes naturales impulsen una tarea genuinamente astrofísica.',
    ],
  },
  pipeline: [
    { en: 'Synthetic data', es: 'Datos sintéticos' },
    { en: 'Classification', es: 'Clasificación' },
    { en: 'Regression', es: 'Regresión' },
    { en: 'Transfer learning', es: 'Transfer learning' },
  ],
  repoLabel: { en: 'Thesis repository', es: 'Repositorio de la tesis' },
  repo: 'https://github.com/DaVas1410/cnn_astro',
}

export const experience = {
  eyebrow: { en: 'experience', es: 'experiencia' },
  title: { en: 'Where I put this to work', es: 'Dónde lo llevo a la práctica' },
  items: [
    {
      role: { en: 'Data Scientist', es: 'Data Scientist' },
      org: 'Diversa',
      period: { en: 'Present', es: 'Actualidad' },
      desc: {
        en: 'NLP, AI governance, humanitarian technology, and data visualization. Contributed to a RAG chatbot supporting Venezuelan migrants, plus applied ML and geospatial work.',
        es: 'NLP, gobernanza de IA, tecnología humanitaria y visualización de datos. Contribuí a un chatbot RAG para migrantes venezolanos, además de ML aplicado y trabajo geoespacial.',
      },
      accent: 'accent',
    },
    {
      role: { en: 'Undergraduate Researcher', es: 'Investigador de pregrado' },
      org: 'Yachay Tech University',
      period: { en: 'Thesis', es: 'Tesis' },
      desc: {
        en: 'Fractal turbulence parameter prediction from synthetic interstellar-medium images using CNNs and transfer learning, supervised by Prof. Wladimir Banda-Barragán.',
        es: 'Predicción de parámetros de turbulencia fractal a partir de imágenes sintéticas del medio interestelar usando CNNs y transfer learning, supervisada por el Prof. Wladimir Banda-Barragán.',
      },
      accent: 'warm',
    },
    {
      role: { en: 'Organizer', es: 'Organizador' },
      org: 'Yachay Open Science Week (YOSW) 2026',
      period: { en: '2026', es: '2026' },
      desc: {
        en: 'Organizing a university-wide open-science event, and active in university student government.',
        es: 'Organizo un evento universitario de ciencia abierta, y participo activamente en el gobierno estudiantil universitario.',
      },
      accent: 'accent',
    },
  ],
}

export const skills = {
  eyebrow: { en: 'skills', es: 'skills' },
  title: { en: 'Toolbox', es: 'Herramientas' },
  groups: [
    {
      title: { en: 'Python & ML', es: 'Python & ML' },
      accent: 'accent',
      items: ['PyTorch', 'scikit-learn', 'HuggingFace', 'CNNs', 'ResNet-50 / DINOv2', 'LangChain', 'ChromaDB'],
    },
    {
      title: { en: 'Computational Physics', es: 'Física computacional' },
      accent: 'warm',
      items: ['Numerical integration', 'Orbital dynamics', 'PINNs', 'General Relativity', 'Turbulence / fractals', 'HPC · SLURM'],
    },
    {
      title: { en: 'Web & Data Viz', es: 'Web & Data Viz' },
      accent: 'accent',
      items: ['React', 'Next.js', 'TailwindCSS', 'FastAPI / Flask', 'Plotly', 'Matplotlib', 'GeoPandas / Folium'],
    },
    {
      title: { en: 'Tools & Infra', es: 'Herramientas & Infra' },
      accent: 'warm',
      items: ['Git', 'Linux', 'Conda / uv', 'LaTeX', 'HDF5', 'Google Earth Engine'],
    },
  ],
}

export const contact = {
  eyebrow: { en: 'contact', es: 'contacto' },
  title: { en: "Let's talk", es: 'Hablemos' },
  body: {
    en: "Open to research collaborations, data-science work, and conversations about physics, complex systems, or science communication. The fastest way to reach me is email.",
    es: 'Abierto a colaboraciones de investigación, trabajo de ciencia de datos y conversaciones sobre física, sistemas complejos o divulgación científica. La forma más rápida de contactarme es por correo.',
  },
  emailCta: { en: 'Send an email', es: 'Enviar correo' },
}

export const footer = {
  built: {
    en: 'Built with React, Vite & TailwindCSS.',
    es: 'Hecho con React, Vite y TailwindCSS.',
  },
  note: {
    en: 'Project cards reflect real repositories.',
    es: 'Las tarjetas de proyectos reflejan repositorios reales.',
  },
}
