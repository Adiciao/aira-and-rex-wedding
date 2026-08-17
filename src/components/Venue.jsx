import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { useWedding } from '../context/WeddingContext'

export default function Venue() {
  const { ceremonyVenueName, ceremonyVenueAddress, receptionVenueName, receptionVenueAddress, gettingThereText, accommodationText, parkingText } = useWedding()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  const infoItems = [
    { icon: '⬡', title: 'Getting There',  body: gettingThereText },
    { icon: '⬡', title: 'Accommodation',  body: accommodationText },
    { icon: '⬡', title: 'Parking',        body: parkingText },
  ]

  return (
    <section id="venue" ref={ref} style={{ padding: 'clamp(5rem, 10vw, 10rem) 2rem', background: 'var(--cream-light)', overflow: 'hidden' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(3rem, 6vw, 8rem)', alignItems: 'center' }}>
        <div>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} style={{ fontFamily: 'var(--ff-sans)', fontSize: '0.65rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--taupe)', marginBottom: '1rem' }}>Find Us Here</motion.p>
          <motion.h2 initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }} style={{ fontFamily: 'var(--ff-serif)', fontStyle: 'italic', fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 300, color: 'var(--text)', marginBottom: '2.5rem' }}>The <span style={{ color: 'var(--taupe)' }}>Venues</span></motion.h2>

          {[
            { tag: 'Ceremony',  name: ceremonyVenueName,  addr: ceremonyVenueAddress,  delay: 0.25 },
            { tag: 'Reception', name: receptionVenueName, addr: receptionVenueAddress, delay: 0.35 },
          ].map(v => (
            <motion.div key={v.tag} initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: v.delay }} style={{ background: 'var(--cream)', border: '1px solid var(--blush)', padding: '1.5rem 2rem', marginBottom: '1rem' }}>
              <p style={{ fontFamily: 'var(--ff-sans)', fontSize: '0.6rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--taupe)', marginBottom: '0.4rem' }}>{v.tag}</p>
              <h3 style={{ fontFamily: 'var(--ff-serif)', fontSize: '1.4rem', fontWeight: 400, marginBottom: '0.4rem' }}>{v.name}</h3>
              <p style={{ color: 'var(--text-soft)', fontSize: '0.87rem', lineHeight: 1.7 }}>{v.addr}</p>
            </motion.div>
          ))}

          {infoItems.map((item, i) => (
            <motion.div key={item.title} initial={{ opacity: 0, x: -20 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ delay: 0.45 + i * 0.1 }} style={{ display: 'flex', gap: '1rem', marginBottom: '1.4rem', alignItems: 'flex-start' }}>
              <span style={{ color: 'var(--gold)', fontSize: '0.8rem', marginTop: '0.25rem', flexShrink: 0 }}>{item.icon}</span>
              <div>
                <p style={{ fontWeight: 500, fontSize: '0.85rem', marginBottom: '0.2rem' }}>{item.title}</p>
                <p style={{ color: 'var(--text-soft)', fontSize: '0.87rem', lineHeight: 1.7 }}>{item.body}</p>
              </div>
            </motion.div>
          ))}

          <motion.a href={`https://maps.google.com/?q=${encodeURIComponent(ceremonyVenueAddress)}`} target="_blank" rel="noreferrer" initial={{ opacity: 0, y: 10 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.75 }} whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.97 }} style={{ display: 'inline-block', marginTop: '0.5rem', padding: '0.9rem 2.4rem', background: 'var(--noir)', color: 'white', fontFamily: 'var(--ff-sans)', fontSize: '0.68rem', letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 400, borderRadius: '1px', border: '1px solid var(--noir)' }}>Get Directions →</motion.a>
        </div>

        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={inView ? { opacity: 1, scale: 1 } : {}} transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}>
          <AnimatedMap />
        </motion.div>
      </div>
      <style>{`@media (max-width: 800px) { #venue > div { grid-template-columns: 1fr !important; } }`}</style>
    </section>
  )
}

function AnimatedMap() {
  return (
    <div style={{ position: 'relative', background: 'var(--cream)', border: '1px solid var(--blush)', borderRadius: '2px', overflow: 'hidden', minHeight: 420, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '3rem' }}>
      <svg viewBox="0 0 300 240" style={{ width: '100%', opacity: 0.55 }}>
        {[40,80,120,160,200].map(y => <line key={y} x1="0" y1={y} x2="300" y2={y} stroke="var(--champagne)" strokeWidth="0.8" />)}
        {[40,80,120,160,220,260].map(x => <line key={x} x1={x} y1="0" x2={x} y2="240" stroke="var(--champagne)" strokeWidth="0.8" />)}
        <line x1="0" y1="240" x2="300" y2="0" stroke="var(--champagne)" strokeWidth="1.5" opacity="0.6"/>
        {[[20,20,50,40],[120,20,60,35],[220,180,60,30],[40,150,50,35],[180,60,55,40],[30,100,45,30]].map(([x,y,w,h],i) => <rect key={i} x={x} y={y} width={w} height={h} rx="2" fill="none" stroke="var(--champagne)" strokeWidth="1" />)}
        <circle cx="120" cy="110" r="18" fill="var(--taupe)" opacity="0.15"/>
        <circle cx="120" cy="110" r="8" fill="var(--taupe)" opacity="0.6"/>
        <circle cx="200" cy="150" r="18" fill="var(--gold)" opacity="0.15"/>
        <circle cx="200" cy="150" r="8" fill="var(--gold)" opacity="0.6"/>
        <path d="M 120 110 Q 160 90 200 150" stroke="var(--champagne)" strokeWidth="2" strokeDasharray="6,3" fill="none"/>
      </svg>
      <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }} style={{ position: 'absolute', top: '37%', left: '37%', fontSize: '1.6rem', filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))' }}>⛪</motion.div>
      <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }} style={{ position: 'absolute', top: '53%', left: '62%', fontSize: '1.6rem', filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))' }}>🏡</motion.div>
      {[1,2].map(i => <motion.div key={`c${i}`} animate={{ scale: [1, 2.8], opacity: [0.35, 0] }} transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.8, ease: 'easeOut' }} style={{ position: 'absolute', top: '37%', left: '37%', transform: 'translate(-50%,-50%)', width: 24, height: 24, borderRadius: '50%', border: '1px solid var(--taupe)', pointerEvents: 'none' }} />)}
      {[1,2].map(i => <motion.div key={`r${i}`} animate={{ scale: [1, 2.8], opacity: [0.35, 0] }} transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.8 + 0.4, ease: 'easeOut' }} style={{ position: 'absolute', top: '53%', left: '62%', transform: 'translate(-50%,-50%)', width: 24, height: 24, borderRadius: '50%', border: '1px solid var(--gold)', pointerEvents: 'none' }} />)}
      <div style={{ position: 'absolute', bottom: '1.5rem', display: 'flex', gap: '2rem' }}>
        <p style={{ fontFamily: 'var(--ff-sans)', fontSize: '0.6rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--taupe)' }}>⛪ Church</p>
        <p style={{ fontFamily: 'var(--ff-sans)', fontSize: '0.6rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--taupe)' }}>🏡 Reception</p>
      </div>
    </div>
  )
}
