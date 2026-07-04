import { createContext, useContext, useEffect, useRef, useState } from 'react'

const ScrollContext = createContext(null)

const SECTION_IDS = ['about', 'projects', 'research', 'experience', 'skills', 'contact']

export function ScrollProvider({ children }) {
  const progressRef = useRef(0)
  const [activeSection, setActiveSection] = useState('about')

  // Scroll progress: cache the max on resize so the per-frame handler reads
  // only window.scrollY (no synchronous layout during scroll).
  useEffect(() => {
    const doc = document.documentElement
    let max = doc.scrollHeight - window.innerHeight
    let raf = 0
    const update = () => {
      progressRef.current = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0
      raf = 0
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    const onResize = () => {
      max = doc.scrollHeight - window.innerHeight
      onScroll()
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize)
    update()
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  // Active section via IntersectionObserver — no per-frame getBoundingClientRect.
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActiveSection(e.target.id)
        })
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )
    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id)
      if (el) io.observe(el)
    })
    return () => io.disconnect()
  }, [])

  return (
    <ScrollContext.Provider value={{ progressRef, activeSection }}>
      {children}
    </ScrollContext.Provider>
  )
}

export const useScroll = () => useContext(ScrollContext)
export { SECTION_IDS }
