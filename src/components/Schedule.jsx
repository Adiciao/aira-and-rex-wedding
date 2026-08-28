import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { useWedding } from '../context/WeddingContext'

export default function Schedule() {
  const { schedule } = useWedding()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="schedule" ref={ref} style={{ padding: 'clamp(5rem, 10vw, 10rem) 2rem', background: 'linear-gradient(135deg, var(--blush) 0%, var(--cream) 50%, var(--blush) 100%)', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontFamily: 'var(--ff-serif)', fontStyle: 'italic', fontSize: 'clamp(8rem, 20vw, 18rem)', fontWeight: 300, color: 'rgba(139,115,85,0.04)', whiteSpace: 'nowrap', userSelect: 'none', pointerEvents: 'none', lineHeight: 1 }}>Today</div>
      
      {/* Drifting background color waves to enhance glassmorphism refraction */}
      <motion.div 
        animate={{
          x: [0, 40, -20, 0],
          y: [0, -30, 40, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{
          position: 'absolute',
          top: '10%',
          left: '5%',
          width: '350px',
          height: '350px',
          borderRadius: '50%',
          background: 'var(--champagne)',
          filter: 'blur(90px)',
          opacity: 0.4,
          pointerEvents: 'none',
          zIndex: 0,
        }} 
      />
      <motion.div 
        animate={{
          x: [0, -30, 40, 0],
          y: [0, 40, -30, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{
          position: 'absolute',
          bottom: '15%',
          right: '5%',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'var(--taupe)',
          filter: 'blur(100px)',
          opacity: 0.3,
          pointerEvents: 'none',
          zIndex: 0,
        }} 
      />
      <div style={{ maxWidth: 1000, margin: '0 auto', position: 'relative' }}>
        <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} style={{ textAlign: 'center', fontFamily: 'var(--ff-sans)', fontSize: '0.65rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--taupe)', marginBottom: '1rem' }}>The Day's Programme</motion.p>
        <motion.h2 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }} style={{ textAlign: 'center', fontFamily: 'var(--ff-serif)', fontStyle: 'italic', fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 300, color: 'var(--text)', marginBottom: '5rem' }}>
          Schedule <span style={{ color: 'var(--taupe)' }}>of Events</span>
        </motion.h2>
        <div style={{ position: 'relative' }}>
          <motion.div className="schedule-timeline-line" initial={{ scaleY: 0 }} whileInView={{ scaleY: 1 }} viewport={{ once: true, margin: '-100px' }} transition={{ duration: 1.5, delay: 0.4, ease: [0.16, 1, 0.3, 1] }} style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 1, background: 'linear-gradient(to bottom, transparent, var(--champagne) 15%, var(--champagne) 85%, transparent)', transformOrigin: 'top', zIndex: 0 }} />
          {schedule.map((ev, i) => <ScheduleItem key={i} event={ev} index={i} />)}
        </div>
      </div>
    </section>
  )
}

function ScheduleItem({ event, index }) {
  const isLeft = index % 2 === 0
  return (
    <motion.div 
      className={`schedule-row ${isLeft ? 'is-left-row' : 'is-right-row'}`} 
      initial={{ opacity: 0, x: isLeft ? -40 : 40 }} 
      whileInView={{ opacity: 1, x: 0 }} 
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} 
      style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '2rem', alignItems: 'center', marginBottom: '4rem', position: 'relative', zIndex: 1 }}
    >
      <div className="schedule-left-side" style={{ textAlign: isLeft ? 'right' : 'left', order: isLeft ? 0 : 2 }}>{isLeft ? <EventCard event={event} /> : <TimeTag time={event.time} attire={event.attire} />}</div>
      <div className="schedule-timeline-node" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', order: 1 }}>
        <motion.div 
          initial={{ scale: 0 }} 
          whileInView={{ scale: 1 }} 
          viewport={{ once: true, margin: '-80px' }}
          transition={{ type: 'spring', stiffness: 100, damping: 15, delay: 0.15 }} 
          style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--blush)', border: '1px solid var(--champagne)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--ff-serif)', fontSize: '0.75rem', color: 'var(--taupe)', boxShadow: '0 0 0 6px var(--blush), 0 0 0 7px rgba(100, 78, 136, 0.25)', flexShrink: 0 }}
        >
          {event.icon}
        </motion.div>
      </div>
      <div className="schedule-right-side" style={{ textAlign: isLeft ? 'left' : 'right', order: isLeft ? 2 : 0 }}>{isLeft ? <TimeTag time={event.time} attire={event.attire} /> : <EventCard event={event} />}</div>
    </motion.div>
  )
}

function EventCard({ event }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div 
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ 
        background: hovered ? 'rgba(255, 255, 255, 0.7)' : 'rgba(255, 255, 255, 0.42)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: hovered ? '1px solid rgba(100, 78, 136, 0.25)' : '1px solid rgba(255, 255, 255, 0.65)',
        borderRadius: '16px', 
        padding: '1.8rem 2rem', 
        transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
        boxShadow: hovered 
          ? 'inset 0 1px 1px rgba(255, 255, 255, 0.5), 0 12px 24px rgba(100, 78, 136, 0.1)' 
          : 'inset 0 1px 1px rgba(255, 255, 255, 0.35), 0 6px 16px rgba(100, 78, 136, 0.04)',
        transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
      }}
    >
      <h3 style={{ fontFamily: 'var(--ff-serif)', fontSize: '1.6rem', fontWeight: 400, color: 'var(--text)', marginBottom: '0.3rem' }}>{event.title}</h3>
      <p style={{ color: 'var(--taupe)', fontSize: '0.78rem', letterSpacing: '0.06em', marginBottom: '0.8rem' }}>{event.venue}</p>
      <p style={{ color: 'var(--text-soft)', fontSize: '0.87rem', lineHeight: 1.7 }}>{event.desc}</p>
    </div>
  )
}

function TimeTag({ time, attire }) {
  return (
    <div>
      <p style={{ fontFamily: 'var(--ff-serif)', fontStyle: 'italic', fontSize: '1.2rem', color: 'var(--taupe)', marginBottom: '0.5rem' }}>{time}</p>
      <span style={{ display: 'inline-block', fontFamily: 'var(--ff-sans)', fontSize: '0.6rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--text-soft)', border: '1px solid rgba(255, 255, 255, 0.5)', background: 'rgba(255, 255, 255, 0.2)', backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)', borderRadius: '20px', padding: '0.25rem 0.75rem' }}>{attire}</span>
    </div>
  )
}
