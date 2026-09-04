import { motion } from 'framer-motion'
import { useRef } from 'react'
import { useInView } from 'framer-motion'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }
  })
}

export default function DressCode() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <div
      ref={ref}
      id="dresscode"
      style={{
        position: 'relative',
        width: '100%',
        marginTop: '4rem',
      }}
    >
      <div style={{ maxWidth: 1040, margin: '0 auto', position: 'relative', zIndex: 1 }}>

        {/* ── DRESS CODE HEADER ── */}
        <motion.p
          custom={0} variants={fadeUp} initial="hidden" animate={inView ? 'visible' : 'hidden'}
          style={{ textAlign: 'center', fontFamily: 'var(--ff-sans)', fontSize: '0.62rem', letterSpacing: '0.28em', textTransform: 'uppercase', color: 'var(--champagne)', opacity: 0.5, marginBottom: '0.5rem' }}
        >
          Attire & Details
        </motion.p>

        <motion.h2
          custom={1} variants={fadeUp} initial="hidden" animate={inView ? 'visible' : 'hidden'}
          style={{ textAlign: 'center', fontFamily: 'var(--ff-serif)', fontSize: 'clamp(2rem, 5vw, 3.2rem)', fontWeight: 300, color: 'rgba(253,250,245,0.95)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.6rem' }}
        >
          Dress Code
        </motion.h2>

        {/* Gold divider */}
        <svg width="100" height="20" viewBox="0 0 100 20" style={{ display: 'block', margin: '0 auto 3rem' }}>
          <path d="M 5 10 L 45 10" stroke="#c9a96e" strokeWidth="0.8" />
          <circle cx="50" cy="10" r="3" fill="none" stroke="#c9a96e" strokeWidth="0.8" />
          <path d="M 55 10 L 95 10" stroke="#c9a96e" strokeWidth="0.8" />
        </svg>

        {/* Side-by-Side Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2.5rem',
          justifyContent: 'center',
          alignItems: 'stretch',
          marginBottom: '5rem',
        }}>

          {/* Card 1: Principal Sponsors Card */}
          <motion.div
            custom={2} variants={fadeUp} initial="hidden" animate={inView ? 'visible' : 'hidden'}
            style={{
              background: 'rgba(255,255,255,0.06)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '16px',
              padding: '2.5rem 2rem',
              textAlign: 'center',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
            }}
          >
            <div>
              <h3 style={{
                fontFamily: 'var(--ff-sans)',
                fontSize: '1.65rem',
                fontWeight: 800,
                color: '#f5e5c9',
                marginBottom: '1.2rem',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
              }}>
                For Principal Sponsors
              </h3>
              <p style={{ fontFamily: 'var(--ff-serif)', fontStyle: 'italic', fontSize: '1.05rem', color: 'rgba(255,255,255,0.9)', lineHeight: 1.8, marginBottom: '2rem' }}>
                Men: Barong &amp; Black Pants<br />
                Women: Beige Long Dress
              </p>
            </div>
            {/* Attire illustration image */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', marginTop: 'auto' }}>
              <img
                src="/dresscode_attire.png"
                alt="Men: Barong & Black Pants, Women: Beige Long Dress"
                style={{
                  width: '100%',
                  maxWidth: '240px',
                  height: 'auto',
                  display: 'block',
                  margin: '0 auto',
                  filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.3))'
                }}
              />
            </div>
          </motion.div>

          {/* Card 2: Guest Outfit Color Palette Card */}
          <motion.div
            custom={3} variants={fadeUp} initial="hidden" animate={inView ? 'visible' : 'hidden'}
            style={{
              background: 'rgba(255,255,255,0.06)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '16px',
              padding: '2.5rem 2rem',
              textAlign: 'center',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
            }}
          >
            <div>
              <h3 style={{
                fontFamily: 'var(--ff-sans)',
                fontSize: '1.65rem',
                fontWeight: 800,
                color: '#f5e5c9',
                marginBottom: '1.2rem',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
              }}>
                Guest Outfit Color Palette
              </h3>
              <p style={{ fontFamily: 'var(--ff-serif)', fontStyle: 'italic', fontSize: '1.05rem', color: 'rgba(255,255,255,0.9)', lineHeight: 1.8, marginBottom: '2rem' }}>
                Please wear semi-formal attire matching our color palette
              </p>
            </div>
            {/* Guest Palette illustration image */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 'auto' }}>
              <img
                src="/guest_outfit_palette.png"
                alt="Guest Outfit Color Palette"
                style={{
                  width: '100%',
                  maxWidth: '320px',
                  height: 'auto',
                  display: 'block',
                  margin: '0 auto',
                  filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.3))'
                }}
              />
            </div>
          </motion.div>

        </div>

      </div>
    </div>
  )
}
