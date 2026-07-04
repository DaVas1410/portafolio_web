import { createContext, useContext, useEffect, useState } from 'react'

const MotionContext = createContext({ reduced: false, manualReduced: false, setManualReduced: () => {} })

const KEY = 'prefers-reduced-motion-manual'

export function MotionProvider({ children }) {
  const [systemReduced, setSystemReduced] = useState(false)
  const [manualReduced, setManualReduced] = useState(() => {
    if (typeof localStorage === 'undefined') return false
    return localStorage.getItem(KEY) === '1'
  })

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setSystemReduced(mq.matches)
    const onChange = (e) => setSystemReduced(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    localStorage.setItem(KEY, manualReduced ? '1' : '0')
  }, [manualReduced])

  const reduced = systemReduced || manualReduced

  return (
    <MotionContext.Provider value={{ reduced, manualReduced, setManualReduced }}>
      {children}
    </MotionContext.Provider>
  )
}

export const useMotion = () => useContext(MotionContext)
