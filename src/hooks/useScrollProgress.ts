import { useEffect, useState } from 'react'

function clamp01(value: number) {
  return Math.min(1, Math.max(0, value))
}

/**
 * Returns a 0..1 progress value based on scrollY up to `distance` pixels.
 */
export function useScrollProgress(distance: number) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY || 0
      setProgress(clamp01(y / Math.max(1, distance)))
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [distance])

  return progress
}
