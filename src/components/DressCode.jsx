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

/* ─── Silhouette SVGs ─── */
function ManSilhouette() {
  return (
    <svg width="90" height="180" viewBox="0 0 90 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Head */}
      <ellipse cx="45" cy="22" rx="14" ry="16" fill="#4a3728" />
      {/* Neck */}
      <rect x="40" y="36" width="10" height="10" fill="#4a3728" />
      {/* Barong body */}
      <path d="M20 50 Q45 44 70 50 L75 110 Q45 118 15 110 Z" fill="#e8dcc8" />
      {/* Barong collar details */}
      <path d="M40 50 L45 75 L50 50" fill="none" stroke="#c8b89a" strokeWidth="1.5" />
      {/* Arms */}
      <path d="M20 55 L5 105" stroke="#4a3728" strokeWidth="12" strokeLinecap="round" />
      <path d="M70 55 L85 105" stroke="#4a3728" strokeWidth="12" strokeLinecap="round" />
      {/* Black pants */}
      <path d="M22 108 L35 178 L45 178 L45 135 L45 135 L45 178 L55 178 L68 108 Z" fill="#2a2a2a" />
      {/* Shoes */}
      <ellipse cx="35" cy="182" rx="11" ry="6" fill="#1a1a1a" />
      <ellipse cx="55" cy="182" rx="11" ry="6" fill="#1a1a1a" />
    </svg>
  )
}

function WomanSilhouette() {
  return (
    <svg width="90" height="190" viewBox="0 0 90 210" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Head */}
      <ellipse cx="45" cy="20" rx="13" ry="16" fill="#4a3728" />
      {/* Hair */}
      <path d="M32 14 Q28 5 38 3 Q45 0 52 3 Q62 5 58 14" fill="#2a1a10" />
      <path d="M32 14 Q25 22 28 34" fill="#2a1a10" stroke="#2a1a10" strokeWidth="3" />
      <path d="M58 14 Q65 22 62 34" fill="#2a1a10" stroke="#2a1a10" strokeWidth="3" />
      {/* Neck */}
      <rect x="40" y="34" width="10" height="10" fill="#4a3728" />
      {/* Beige dress bodice */}
      <path d="M25 46 Q45 40 65 46 L68 95 Q45 100 22 95 Z" fill="#d4c4a0" />
      {/* Dress skirt flare */}
      <path d="M22 95 Q10 130 8 185 Q45 195 82 185 Q80 130 68 95 Q45 100 22 95 Z" fill="#c8b48a" />
      {/* Dress details — waist band */}
      <path d="M22 95 Q45 100 68 95" stroke="#b8a47a" strokeWidth="2" fill="none" />
      {/* Arms */}
      <path d="M25 50 L8 92" stroke="#4a3728" strokeWidth="10" strokeLinecap="round" />
      <path d="M65 50 L82 92" stroke="#4a3728" strokeWidth="10" strokeLinecap="round" />
      {/* Shoes */}
      <ellipse cx="32" cy="190" rx="10" ry="5" fill="#8a7460" />
      <ellipse cx="58" cy="190" rx="10" ry="5" fill="#8a7460" />
    </svg>
  )
}

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
            {/* Silhouettes side by side */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: '0.5rem' }}>
              <ManSilhouette />
              <WomanSilhouette />
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
