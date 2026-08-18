import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { useWedding } from '../context/WeddingContext'

export default function Schedule() {
  const { schedule } = useWedding()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="schedule" ref={ref} style={{ padding: 'clamp(5rem, 10vw, 10rem) 2rem', background: 'var(--cream)', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontFamily: 'var(--ff-serif)', fontStyle: 'italic', fontSize: 'clamp(8rem, 20vw, 18rem)', fontWeight: 300, color: 'rgba(139,115,85,0.04)', whiteSpace: 'nowrap', userSelect: 'none', pointerEvents: 'none', lineHeight: 1 }}>Today</div>
      <div style={{ maxWidth: 1000, margin: '0 auto', position: 'relative' }}>
        <motion.p initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8 }} style={{ textAlign: 'center', fontFamily: 'var(--ff-sans)', fontSize: '0.65rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--taupe)', marginBottom: '1rem' }}>The Day's Programme</motion.p>
        <motion.h2 initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }} style={{ textAlign: 'center', fontFamily: 'var(--ff-serif)', fontStyle: 'italic', fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 300, color: 'var(--text)', marginBottom: '5rem' }}>
          Schedule <span style={{ color: 'var(--taupe)' }}>of Events</span>
        </motion.h2>
        <div style={{ position: 'relative' }}>
          <motion.div className="schedule-timeline-line" initial={{ scaleY: 0 }} animate={inView ? { scaleY: 1 } : {}} transition={{ duration: 1.5, delay: 0.4, ease: [0.16, 1, 0.3, 1] }} style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 1, background: 'linear-gradient(to bottom, transparent, var(--champagne) 15%, var(--champagne) 85%, transparent)', transformOrigin: 'top', zIndex: 0 }} />
          {schedule.map((ev, i) => <ScheduleItem key={i} event={ev} index={i} inView={inView} />)}
        </div>
      </div>
    </section>
  )
}

function ScheduleItem({ event, index, inView }) {
  const isLeft = index % 2 === 0
  return (
    <motion.div className={`schedule-row ${isLeft ? 'is-left-row' : 'is-right-row'}`} initial={{ opacity: 0, x: isLeft ? -50 : 50 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.9, delay: 0.5 + index * 0.15, ease: [0.16, 1, 0.3, 1] }} style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '2rem', alignItems: 'center', marginBottom: '4rem', position: 'relative', zIndex: 1 }}>
      <div className="schedule-left-side" style={{ textAlign: isLeft ? 'right' : 'left', order: isLeft ? 0 : 2 }}>{isLeft ? <EventCard event={event} /> : <TimeTag time={event.time} attire={event.attire} />}</div>
      <div className="schedule-timeline-node" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', order: 1 }}>
        <motion.div initial={{ scale: 0 }} animate={inView ? { scale: 1 } : {}} transition={{ delay: 0.6 + index * 0.15, duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }} style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--cream)', border: '1px solid var(--champagne)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--ff-serif)', fontSize: '0.75rem', color: 'var(--taupe)', boxShadow: '0 0 0 6px var(--cream), 0 0 0 7px rgba(201,185,160,0.3)', flexShrink: 0 }}>{event.icon}</motion.div>
      </div>
      <div className="schedule-right-side" style={{ textAlign: isLeft ? 'left' : 'right', order: isLeft ? 2 : 0 }}>{isLeft ? <TimeTag time={event.time} attire={event.attire} /> : <EventCard event={event} />}</div>
    </motion.div>
  )
}

function EventCard({ event }) {
  return (
    <div style={{ background: 'var(--cream-light)', border: '1px solid var(--blush)', padding: '1.8rem 2rem', transition: 'box-shadow 0.3s ease, border-color 0.3s ease' }} onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 20px 50px rgba(0,0,0,0.08)'; e.currentTarget.style.borderColor = 'var(--champagne)' }} onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = 'var(--blush)' }}>
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
      <span style={{ display: 'inline-block', fontFamily: 'var(--ff-sans)', fontSize: '0.6rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--text-soft)', border: '1px solid var(--blush)', padding: '0.25rem 0.7rem' }}>{attire}</span>
    </div>
  )
}
