import { useRef } from 'react'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import { useWedding } from '../context/WeddingContext'

export default function OurStory() {
  const { bride, groom, story, images, weddingDate } = useWedding()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const imageY = useTransform(scrollYProgress, [0, 1], ['-5%', '5%'])

  const dateObj = new Date(weddingDate)
  const day   = dateObj.getDate()
  const month = dateObj.toLocaleString('en', { month: 'short' }).toUpperCase()
  const year  = dateObj.getFullYear()

  return (
    <section id="story" ref={ref} style={{ padding: 'clamp(5rem, 10vw, 10rem) 2rem', background: 'var(--cream-light)', overflow: 'hidden' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(3rem, 6vw, 8rem)', alignItems: 'center' }}>

        <div>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay: 0.1 }} style={{ fontFamily: 'var(--ff-sans)', fontSize: '0.65rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--taupe)', marginBottom: '1.2rem' }}>Our Love Story</motion.p>
          <motion.h2 initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }} style={{ fontFamily: 'var(--ff-serif)', fontStyle: 'italic', fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', fontWeight: 300, lineHeight: 1.05, color: 'var(--text)', marginBottom: '2.5rem' }}>
            How it all<br /><span style={{ color: 'var(--taupe)' }}>began</span>
          </motion.h2>
          {story.map((p, i) => (
            <motion.p key={i} initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay: 0.3 + i * 0.12, ease: [0.16, 1, 0.3, 1] }} style={{ color: 'var(--text-soft)', fontSize: '0.97rem', lineHeight: 1.9, marginBottom: '1.4rem' }}>{p}</motion.p>
          ))}
          <motion.div initial={{ opacity: 0, scaleX: 0 }} animate={inView ? { opacity: 1, scaleX: 1 } : {}} transition={{ duration: 1, delay: 0.7 }} style={{ marginTop: '2.5rem', paddingTop: '2rem', borderTop: '1px solid var(--blush)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontFamily: 'var(--ff-serif)', fontStyle: 'italic', fontSize: '2rem', fontWeight: 300, color: 'var(--taupe)' }}>{bride} &amp; {groom}</span>
            <div style={{ width: 40, height: 1, background: 'var(--champagne)' }} />
            <span style={{ fontFamily: 'var(--ff-sans)', fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--text-soft)', fontWeight: 300 }}>{year}</span>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, x: 60 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }} style={{ position: 'relative' }}>
          <TiltCard>
            <div style={{ position: 'relative', overflow: 'hidden', borderRadius: '2px', boxShadow: '0 40px 100px rgba(0,0,0,0.18)' }}>
              <motion.img src={images.couple} alt={`${bride} and ${groom}`} style={{ width: '100%', height: 'clamp(400px, 60vh, 620px)', objectFit: 'cover', display: 'block', y: imageY }} />
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '40%', background: 'linear-gradient(to top, rgba(15,13,11,0.6), transparent)' }} />
            </div>
          </TiltCard>

          <motion.div className="story-date-badge" initial={{ opacity: 0, scale: 0.7, rotate: -10 }} animate={inView ? { opacity: 1, scale: 1, rotate: 0 } : {}} transition={{ duration: 0.8, delay: 0.9, ease: [0.34, 1.56, 0.64, 1] }} style={{ position: 'absolute', bottom: '-2rem', left: '-2.5rem', background: 'var(--cream-light)', border: '1px solid var(--blush)', padding: '1.4rem 1.8rem', textAlign: 'center', boxShadow: '0 20px 50px rgba(0,0,0,0.1)', zIndex: 2 }}>
            <span style={{ display: 'block', fontFamily: 'var(--ff-serif)', fontSize: '3rem', fontWeight: 300, lineHeight: 1 }}>{day}</span>
            <span style={{ display: 'block', fontFamily: 'var(--ff-sans)', fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--taupe)', marginTop: '0.2rem' }}>{month} {year}</span>
          </motion.div>

          <div style={{ position: 'absolute', top: '-12px', left: '-12px', width: 60, height: 60, borderTop: '1px solid var(--champagne)', borderLeft: '1px solid var(--champagne)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: '-12px', right: '-12px', width: 60, height: 60, borderBottom: '1px solid var(--champagne)', borderRight: '1px solid var(--champagne)', pointerEvents: 'none' }} />
        </motion.div>
      </div>
      <style>{`@media (max-width: 800px) { #story > div { grid-template-columns: 1fr !important; } }`}</style>
    </section>
  )
}

function TiltCard({ children }) {
  const ref = useRef(null)
  const handleMouseMove = (e) => {
    const card = ref.current; if (!card) return
    const { left, top, width, height } = card.getBoundingClientRect()
    const x = (e.clientX - left - width / 2) / (width / 2)
    const y = (e.clientY - top - height / 2) / (height / 2)
    card.style.transform = `perspective(1000px) rotateY(${x * 4}deg) rotateX(${-y * 4}deg) scale(1.01)`
  }
  const handleMouseLeave = () => { if (ref.current) ref.current.style.transform = 'perspective(1000px) rotateY(0) rotateX(0) scale(1)' }
  return <div ref={ref} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} style={{ transition: 'transform 0.4s ease', transformStyle: 'preserve-3d' }}>{children}</div>
}
