import { useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { useWedding } from '../context/WeddingContext'

export default function Gallery() {
  const { images } = useWedding()
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const [active, setActive] = useState(null)

  const GRID_AREAS = [
    'span 4 / span 4', 'span 4 / span 4', 'span 4 / span 4',
    'span 6 / span 6', 'span 6 / span 6',
    'span 4 / span 4', 'span 4 / span 4', 'span 4 / span 4',
    'span 6 / span 6', 'span 6 / span 6',
    'span 4 / span 4', 'span 4 / span 4', 'span 4 / span 4',
  ]

  return (
    <>
      <section id="gallery" ref={ref} style={{ padding: 'clamp(5rem, 10vw, 10rem) 2rem', background: 'var(--cream-light)', overflow: 'hidden' }}>
        <div style={{ maxWidth: 1300, margin: '0 auto' }}>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} style={{ textAlign: 'center', fontFamily: 'var(--ff-sans)', fontSize: '0.65rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--taupe)', marginBottom: '1rem' }}>A Glimpse</motion.p>
          <motion.h2 initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }} style={{ textAlign: 'center', fontFamily: 'var(--ff-serif)', fontStyle: 'italic', fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 300, color: 'var(--text)', marginBottom: '4rem' }}>
            Our <span style={{ color: 'var(--taupe)' }}>Gallery</span>
          </motion.h2>
          <div className="gallery-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gridTemplateRows: 'auto', gap: '1rem' }}>
            {images.gallery.map((img, i) => (
              <GalleryCard key={i} img={img} index={i} inView={inView} onClick={() => setActive(img)} gridArea={GRID_AREAS[i] ?? 'span 4 / span 4'} />
            ))}
          </div>
        </div>
      </section>

      <AnimatePresence>
        {active && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setActive(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.93)', zIndex: 9000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', backdropFilter: 'blur(20px)' }}>
            <motion.div initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ ease: [0.16, 1, 0.3, 1], duration: 0.5 }} style={{ position: 'relative', maxWidth: '90vw', maxHeight: '90vh' }} onClick={e => e.stopPropagation()}>
              <img src={active.src} alt={active.label} style={{ maxWidth: '90vw', maxHeight: '85vh', objectFit: 'contain', display: 'block', borderRadius: '2px' }} />
              <p style={{ textAlign: 'center', marginTop: '1rem', fontFamily: 'var(--ff-serif)', fontStyle: 'italic', fontSize: '1.1rem', color: 'rgba(255,255,255,0.6)' }}>{active.label}</p>
              <button onClick={() => setActive(null)} style={{ position: 'absolute', top: '-2.5rem', right: 0, background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', fontSize: '1.5rem', lineHeight: 1, padding: '0.5rem', transition: 'color 0.2s', cursor: 'pointer' }} onMouseEnter={e => e.target.style.color = 'white'} onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.6)'}>✕</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

function GalleryCard({ img, index, inView, onClick, gridArea }) {
  const [hovered, setHovered] = useState(false)
  return (
    <motion.div className="gallery-card" initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.9, delay: 0.2 + index * 0.1, ease: [0.16, 1, 0.3, 1] }} onClick={onClick} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} style={{ gridArea, position: 'relative', overflow: 'hidden', cursor: 'pointer', borderRadius: '2px', minHeight: 220 }}>
      <img src={img.src} alt={img.label} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transform: hovered ? 'scale(1.06)' : 'scale(1)', transition: 'transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%)', opacity: hovered ? 1 : 0, transition: 'opacity 0.4s ease', display: 'flex', alignItems: 'flex-end', padding: '1.5rem' }}>
        <span style={{ fontFamily: 'var(--ff-serif)', fontStyle: 'italic', fontSize: '1.2rem', fontWeight: 300, color: 'white', transform: hovered ? 'translateY(0)' : 'translateY(10px)', transition: 'transform 0.4s ease' }}>{img.label}</span>
      </div>
      <div style={{ position: 'absolute', top: '1rem', right: '1rem', width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', color: 'white', opacity: hovered ? 1 : 0, transform: hovered ? 'scale(1)' : 'scale(0.6)', transition: 'all 0.3s ease' }}>⤢</div>
    </motion.div>
  )
}
