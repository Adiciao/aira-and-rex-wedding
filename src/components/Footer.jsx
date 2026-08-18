import { motion } from 'framer-motion'
import { useWedding } from '../context/WeddingContext'

export default function Footer() {
  const { bride, groom, weddingDate, ceremonyVenueName, receptionVenueName } = useWedding()
  const dateObj = new Date(weddingDate)
  const formattedDate = dateObj.toLocaleDateString('en', { month: 'long', day: 'numeric', year: 'numeric' })
  const year = dateObj.getFullYear()
  const NAV = [['Our Story','story'],['Schedule','schedule'],['Venue','venue'],['Gallery','gallery'],['RSVP','rsvp']]

  return (
    <footer style={{ background: 'var(--noir)', color: 'rgba(255,255,255,0.5)' }}>
      <div style={{ padding: 'clamp(4rem, 8vw, 7rem) 2rem 3rem', textAlign: 'center', maxWidth: 800, margin: '0 auto' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 1 }} style={{ fontFamily: 'var(--ff-serif)', fontStyle: 'italic', fontSize: 'clamp(3rem, 8vw, 5.5rem)', fontWeight: 300, color: 'var(--champagne)', letterSpacing: '0.02em', marginBottom: '0.5rem' }}>
          {groom} &amp; {bride}
        </motion.div>
        <p style={{ fontFamily: 'var(--ff-sans)', fontSize: '0.68rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: '0.4rem' }}>{formattedDate}</p>
        <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.35)', marginBottom: '3rem' }}>{ceremonyVenueName} &amp; {receptionVenueName}</p>
        <div style={{ width: 60, height: 1, background: 'rgba(255,255,255,0.08)', margin: '0 auto 2.5rem' }} />
        <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' }}>
          {NAV.map(([label, id]) => (
            <button key={id} onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })} style={{ background: 'none', border: 'none', padding: 0, fontFamily: 'var(--ff-sans)', fontSize: '0.65rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', transition: 'color 0.3s', cursor: 'pointer' }} onMouseEnter={e=>e.target.style.color='var(--champagne)'} onMouseLeave={e=>e.target.style.color='rgba(255,255,255,0.35)'}>{label}</button>
          ))}
        </div>
      </div>
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', padding: '1.5rem 2rem', textAlign: 'center', fontSize: '0.75rem', color: 'rgba(255,255,255,0.2)' }}>
        Made with ♥ for {groom} &amp; {bride} · {year}
      </div>
    </footer>
  )
}
