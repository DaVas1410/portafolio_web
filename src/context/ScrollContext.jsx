import { createContext, useContext, useEffect, useRef, useState } from 'react'

const ScrollContext = createContext(null)

const SECTION_IDS = ['about', 'projects', 'research', 'publications', 'experience', 'skills', 'contact']

export function ScrollProvider({ children }) {
  const progressRef = useRef(0)
  const [activeSection, setActiveSection] = useState('about')

  useEffect(() => {
    let raf = 0
    const update = () => {
      const doc = document.documentElement
      const max = doc.scrollHeight - window.innerHeight
      progressRef.current = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0

      // active section = last section whose top has passed 45% of viewport
      const mid = window.innerHeight * 0.45
      let current = 'about'
      for (const id of SECTION_IDS) {
        const el = document.getElementById(id)
        if (el && el.getBoundingClientRect().top <= mid) current = id
      }
      setActiveSection((prev) => (prev === current ? prev : current))
      raf = 0
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    update()
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <ScrollContext.Provider value={{ progressRef, activeSection }}>
      {children}
    </ScrollContext.Provider>
  )
}

export const useScroll = () => useContext(ScrollContext)
export { SECTION_IDS }
