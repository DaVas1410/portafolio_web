import Nav from './components/Nav.jsx'
import Hero from './components/Hero.jsx'
import About from './components/About.jsx'
import Projects from './components/Projects.jsx'
import Research from './components/Research.jsx'
import Experience from './components/Experience.jsx'
import Skills from './components/Skills.jsx'
import Contact from './components/Contact.jsx'
import Footer from './components/Footer.jsx'
import SceneCanvas from './three/SceneCanvas.jsx'

export default function App() {
  return (
    <div className="min-h-screen">
      <SceneCanvas />
      <Nav />
      <main>
        <Hero />
        <About />
        <Projects />
        <Research />
        <Experience />
        <Skills />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}
