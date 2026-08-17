import { useEffect, useRef } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export default function CustomCursor() {
  const cursorX = useMotionValue(-100)
  const cursorY = useMotionValue(-100)
  const trailX  = useMotionValue(-100)
  const trailY  = useMotionValue(-100)

  const springConfig = { damping: 25, stiffness: 250 }
  const springX = useSpring(trailX, springConfig)
  const springY = useSpring(trailY, springConfig)

  const isHovering = useRef(false)

  useEffect(() => {
    const move = (e) => {
      cursorX.set(e.clientX)
      cursorY.set(e.clientY)
      trailX.set(e.clientX)
      trailY.set(e.clientY)
    }
    const enter = () => { isHovering.current = true }
    const leave = () => { isHovering.current = false }

    window.addEventListener('mousemove', move)
    document.querySelectorAll('a, button, [data-cursor]').forEach(el => {
      el.addEventListener('mouseenter', enter)
      el.addEventListener('mouseleave', leave)
    })
    return () => window.removeEventListener('mousemove', move)
  }, [])

  return (
    <>
      {/* Main dot */}
      <motion.div
        style={{
          position: 'fixed', top: 0, left: 0,
          width: 8, height: 8,
          borderRadius: '50%',
          background: 'var(--gold)',
          pointerEvents: 'none',
          zIndex: 99999,
          translateX: '-50%',
          translateY: '-50%',
          x: cursorX,
          y: cursorY,
          mixBlendMode: 'difference',
        }}
      />
      {/* Trailing ring */}
      <motion.div
        style={{
          position: 'fixed', top: 0, left: 0,
          width: 36, height: 36,
          borderRadius: '50%',
          border: '1px solid rgba(201,169,110,0.6)',
          pointerEvents: 'none',
          zIndex: 99998,
          translateX: '-50%',
          translateY: '-50%',
          x: springX,
          y: springY,
        }}
      />
    </>
  )
}
