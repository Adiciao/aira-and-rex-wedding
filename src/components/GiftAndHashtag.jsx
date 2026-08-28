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

export default function GiftAndHashtag() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <div
      ref={ref}
      style={{
        background: 'linear-gradient(180deg, var(--cream-light) 0%, #ffffff 100%)',
        padding: '3rem clamp(1rem, 4vw, 2rem) 5rem clamp(1rem, 4vw, 2rem)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div style={{ maxWidth: 640, margin: '0 auto', position: 'relative', zIndex: 1 }}>

        {/* ── A NOTE ON GIFT ── */}
        <motion.div
          custom={0} variants={fadeUp} initial="hidden" animate={inView ? 'visible' : 'hidden'}
          style={{
            textAlign: 'center',
            background: 'rgba(255,255,255,0.55)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(194,177,216,0.4)',
            borderRadius: '16px',
            padding: '2.5rem 2rem',
            marginBottom: '4.5rem',
            position: 'relative',
            boxShadow: '0 8px 32px rgba(100, 78, 136, 0.03)',
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
          custom={1} variants={fadeUp} initial="hidden" animate={inView ? 'visible' : 'hidden'}
          style={{
            textAlign: 'center',
            background: 'rgba(255,255,255,0.55)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(194,177,216,0.4)',
            borderRadius: '16px',
            padding: '2.5rem 2rem',
            position: 'relative',
            boxShadow: '0 8px 32px rgba(100, 78, 136, 0.03)',
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
    </div>
  )
}
