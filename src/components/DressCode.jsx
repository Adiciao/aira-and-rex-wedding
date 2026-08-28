import { motion } from 'framer-motion'
import { useRef } from 'react'
import { useInView } from 'framer-motion'

/* ─── Color Palette swatches matching the image ─── */
const PALETTE = [
  { color: '#D4788A', label: 'Rose' },
  { color: '#C26E89', label: 'Mauve Rose' },
  { color: '#B89EC4', label: 'Lavender' },
  { color: '#9B72B0', label: 'Lilac' },
  { color: '#6B3F7A', label: 'Deep Plum' },
]


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
    <section
      ref={ref}
      id="dresscode"
      style={{
        background: 'linear-gradient(180deg, var(--blush) 0%, var(--cream-light) 100%)',
        padding: 'clamp(4rem, 8vw, 8rem) clamp(1rem, 4vw, 3rem)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Subtle background floral watermark */}
      <div style={{
        position: 'absolute', bottom: 0, right: 0,
        width: 320, height: 320,
        backgroundImage: 'radial-gradient(circle, rgba(162,137,185,0.15) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />

      <div style={{ maxWidth: 820, margin: '0 auto', position: 'relative', zIndex: 1 }}>

        {/* ── DRESS CODE ── */}
        <motion.p
          custom={0} variants={fadeUp} initial="hidden" animate={inView ? 'visible' : 'hidden'}
          style={{ textAlign: 'center', fontFamily: 'var(--ff-sans)', fontSize: '0.62rem', letterSpacing: '0.28em', textTransform: 'uppercase', color: 'var(--taupe)', marginBottom: '0.5rem' }}
        >
          Attire & Details
        </motion.p>

        <motion.h2
          custom={1} variants={fadeUp} initial="hidden" animate={inView ? 'visible' : 'hidden'}
          style={{ textAlign: 'center', fontFamily: 'var(--ff-serif)', fontSize: 'clamp(2rem, 5vw, 3.2rem)', fontWeight: 300, color: 'var(--text)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.6rem' }}
        >
          Dress Code
        </motion.h2>

        {/* Gold divider */}
        <svg width="100" height="20" viewBox="0 0 100 20" style={{ display: 'block', margin: '0 auto 3rem' }}>
          <path d="M 5 10 L 45 10" stroke="#c9a96e" strokeWidth="0.8" />
          <circle cx="50" cy="10" r="3" fill="none" stroke="#c9a96e" strokeWidth="0.8" />
          <path d="M 55 10 L 95 10" stroke="#c9a96e" strokeWidth="0.8" />
        </svg>

        {/* Two columns: Principal Sponsors | Dear Guests */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr auto 1fr',
          gap: '2rem',
          alignItems: 'start',
          marginBottom: '5rem',
        }} className="dresscode-grid">

          {/* Left — Principal Sponsors */}
          <motion.div
            custom={2} variants={fadeUp} initial="hidden" animate={inView ? 'visible' : 'hidden'}
            style={{
              background: 'rgba(255,255,255,0.55)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(194,177,216,0.4)',
              borderRadius: '16px',
              padding: '2rem 1.5rem',
              textAlign: 'center',
              position: 'relative',
            }}
          >
            <div style={{
              position: 'absolute', top: '-14px', left: '50%', transform: 'translateX(-50%)',
              background: 'var(--cream-light)', padding: '0 1rem',
              fontFamily: 'var(--ff-sans)', fontSize: '0.58rem', letterSpacing: '0.22em',
              textTransform: 'uppercase', color: '#7a5f8a', whiteSpace: 'nowrap'
            }}>
              For Principal Sponsors
            </div>
            <p style={{ fontFamily: 'var(--ff-serif)', fontStyle: 'italic', fontSize: '0.95rem', color: 'var(--text)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
              Men: Barong &amp; Black Pants<br />
              Women: Beige Long Dress
            </p>
            {/* Attire illustration image */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end' }}>
              <img
                src="/dresscode_attire.png"
                alt="Men: Barong & Black Pants, Women: Beige Long Dress"
                style={{
                  width: '100%',
                  maxWidth: '220px',
                  height: 'auto',
                  display: 'block',
                  margin: '0 auto',
                  filter: 'drop-shadow(0 4px 12px rgba(100,78,136,0.1))'
                }}
              />
            </div>

          </motion.div>

          {/* Center vertical divider */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '3rem' }}>
            <div style={{ width: 1, height: 260, background: 'linear-gradient(to bottom, transparent, rgba(194,177,216,0.6), transparent)' }} />
            <div style={{ fontFamily: 'var(--ff-serif)', fontStyle: 'italic', fontSize: '1rem', color: 'var(--taupe)', margin: '0.6rem 0', whiteSpace: 'nowrap' }}>&amp;</div>
            <div style={{ width: 1, height: 60, background: 'linear-gradient(to bottom, rgba(194,177,216,0.6), transparent)' }} />
          </div>

          {/* Right — Dear Guest */}
          <motion.div
            custom={3} variants={fadeUp} initial="hidden" animate={inView ? 'visible' : 'hidden'}
            style={{
              background: 'rgba(255,255,255,0.55)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(194,177,216,0.4)',
              borderRadius: '16px',
              padding: '2rem 1.5rem',
              textAlign: 'center',
              position: 'relative',
            }}
          >
            <div style={{
              position: 'absolute', top: '-14px', left: '50%', transform: 'translateX(-50%)',
              background: 'var(--cream-light)', padding: '0 1rem',
              fontFamily: 'var(--ff-sans)', fontSize: '0.58rem', letterSpacing: '0.22em',
              textTransform: 'uppercase', color: '#7a5f8a', whiteSpace: 'nowrap'
            }}>
              For Dear Guest
            </div>
            <p style={{ fontFamily: 'var(--ff-serif)', fontStyle: 'italic', fontSize: '0.95rem', color: 'var(--text)', lineHeight: 1.7, marginBottom: '2rem' }}>
              Please wear formal or semi-formal attire matching the color palette below.
            </p>
            {/* Color swatches in petal arrangement */}
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0.5rem', maxWidth: 180, margin: '0 auto' }}>
              {/* Top row — 2 */}
              <div style={{ display: 'flex', gap: '0.5rem', width: '100%', justifyContent: 'center' }}>
                {PALETTE.slice(0, 2).map(({ color, label }) => (
                  <motion.div
                    key={label}
                    whileHover={{ scale: 1.15, y: -3 }}
                    title={label}
                    style={{
                      width: 52, height: 52, borderRadius: '50%',
                      background: color,
                      boxShadow: `0 4px 14px ${color}55`,
                      border: '2px solid rgba(255,255,255,0.6)',
                      cursor: 'default',
                      transition: 'box-shadow 0.3s ease'
                    }}
                  />
                ))}
              </div>
              {/* Bottom row — 3 */}
              <div style={{ display: 'flex', gap: '0.5rem', width: '100%', justifyContent: 'center' }}>
                {PALETTE.slice(2).map(({ color, label }) => (
                  <motion.div
                    key={label}
                    whileHover={{ scale: 1.15, y: -3 }}
                    title={label}
                    style={{
                      width: 52, height: 52, borderRadius: '50%',
                      background: color,
                      boxShadow: `0 4px 14px ${color}55`,
                      border: '2px solid rgba(255,255,255,0.6)',
                      cursor: 'default',
                      transition: 'box-shadow 0.3s ease'
                    }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* ── A NOTE ON GIFT ── */}
        <motion.div
          custom={5} variants={fadeUp} initial="hidden" animate={inView ? 'visible' : 'hidden'}
          style={{
            textAlign: 'center',
            background: 'rgba(255,255,255,0.55)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(194,177,216,0.4)',
            borderRadius: '16px',
            padding: '2.5rem 2rem',
            marginBottom: '3.5rem',
            position: 'relative',
          }}
        >
          <div style={{
            position: 'absolute', top: '-18px', left: '50%', transform: 'translateX(-50%)',
            background: 'var(--cream-light)', padding: '0 1.2rem',
            fontFamily: 'var(--ff-serif)', fontStyle: 'italic', fontSize: '1.4rem',
            color: 'var(--taupe-dark)', whiteSpace: 'nowrap'
          }}>
            A Note on Gift
          </div>

          {/* Gift envelope icon */}
          <div style={{ marginBottom: '1.2rem' }}>
            <svg width="44" height="34" viewBox="0 0 44 34" fill="none">
              <rect x="1" y="1" width="42" height="32" rx="4" fill="none" stroke="#c9a96e" strokeWidth="1.2" />
              <path d="M1 5 L22 19 L43 5" stroke="#c9a96e" strokeWidth="1.2" fill="none" />
              <path d="M1 33 L16 18" stroke="#c9a96e" strokeWidth="1" />
              <path d="M43 33 L28 18" stroke="#c9a96e" strokeWidth="1" />
            </svg>
          </div>

          <p style={{
            fontFamily: 'var(--ff-serif)', fontStyle: 'italic',
            fontSize: 'clamp(1rem, 2.2vw, 1.15rem)',
            color: 'var(--text)', lineHeight: 1.85,
            maxWidth: 520, margin: '0 auto'
          }}>
            Your presence on our wedding is enough. However, if you wish to give us something, monetary gift will be greatly appreciated.
          </p>
        </motion.div>

        {/* ── SNAP AND SHARE ── */}
        <motion.div
          custom={6} variants={fadeUp} initial="hidden" animate={inView ? 'visible' : 'hidden'}
          style={{
            textAlign: 'center',
            background: 'rgba(255,255,255,0.55)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(194,177,216,0.4)',
            borderRadius: '16px',
            padding: '2.5rem 2rem',
            position: 'relative',
          }}
        >
          <div style={{
            position: 'absolute', top: '-18px', left: '50%', transform: 'translateX(-50%)',
            background: 'var(--cream-light)', padding: '0 1.2rem',
            fontFamily: 'var(--ff-serif)', fontStyle: 'italic', fontSize: '1.4rem',
            color: 'var(--taupe-dark)', whiteSpace: 'nowrap'
          }}>
            Snap and Share
          </div>

          {/* Camera icon */}
          <div style={{ marginBottom: '1.2rem' }}>
            <svg width="44" height="38" viewBox="0 0 44 38" fill="none">
              <rect x="1" y="8" width="42" height="28" rx="4" fill="none" stroke="#c9a96e" strokeWidth="1.2" />
              <circle cx="22" cy="22" r="8" fill="none" stroke="#c9a96e" strokeWidth="1.2" />
              <circle cx="22" cy="22" r="4" fill="none" stroke="#c9a96e" strokeWidth="1" />
              <path d="M15 8 L17 3 L27 3 L29 8" fill="none" stroke="#c9a96e" strokeWidth="1.2" />
              <circle cx="35" cy="14" r="2" fill="#c9a96e" />
            </svg>
          </div>

          <p style={{
            fontFamily: 'var(--ff-serif)', fontStyle: 'italic',
            fontSize: 'clamp(0.95rem, 2vw, 1.05rem)',
            color: 'var(--text)', lineHeight: 1.8,
            marginBottom: '1.2rem'
          }}>
            Help us document our special day by sharing our captured moments using our official hashtag
          </p>

          <motion.p
            whileHover={{ scale: 1.04 }}
            style={{
              fontFamily: 'var(--ff-serif)',
              fontStyle: 'italic',
              fontSize: 'clamp(1.3rem, 3.5vw, 1.9rem)',
              fontWeight: 600,
              background: 'linear-gradient(135deg, #9B72B0, #c9a96e)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              letterSpacing: '-0.01em',
              cursor: 'default',
              userSelect: 'all',
            }}
          >
            #oREXnaparapakasalansiAIRA
          </motion.p>
        </motion.div>

      </div>

      <style>{`
        @media (max-width: 680px) {
          .dresscode-grid {
            grid-template-columns: 1fr !important;
            gap: 2.5rem !important;
          }
          .dresscode-divider {
            display: none !important;
          }
        }
      `}</style>
    </section>
  )
}
