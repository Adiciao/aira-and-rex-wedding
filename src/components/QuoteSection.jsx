import { useRef } from 'react'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'

export default function QuoteSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const bgY = useTransform(scrollYProgress, [0, 1], ['-8%', '8%'])

  const PALETTE = [
    { color: '#D4788A', name: 'Rose'       },
    { color: '#C26E89', name: 'Mauve Rose' },
    { color: '#B89EC4', name: 'Lavender'   },
    { color: '#9B72B0', name: 'Lilac'      },
    { color: '#6B3F7A', name: 'Deep Plum'  },
  ]


  return (
    <section ref={ref} style={{
      position: 'relative',
      padding: 'clamp(6rem, 12vw, 12rem) 2rem',
      overflow: 'hidden',
      background: 'var(--noir)',
    }}>
      {/* Parallax background */}
      <motion.div
        style={{
          position: 'absolute',
          inset: '-10%',
          backgroundImage: 'url(/hero_bg.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          y: bgY,
          opacity: 0.12,
        }}
      />

      {/* Noise texture overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E")`,
        opacity: 0.4,
        pointerEvents: 'none',
      }} />

      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: 820, margin: '0 auto' }}>
        {/* Giant quote mark */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1 }}
          style={{
            fontFamily: 'var(--ff-serif)',
            fontSize: 'clamp(6rem, 16vw, 12rem)',
            lineHeight: 0.6,
            color: 'var(--gold)',
            marginBottom: '2rem',
            opacity: 0.5,
          }}
        >
          "
        </motion.div>

        {/* Quote */}
        <motion.blockquote
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          style={{
            fontFamily: 'var(--ff-serif)',
            fontStyle: 'italic',
            fontSize: 'clamp(1.5rem, 3.5vw, 2.5rem)',
            fontWeight: 300,
            color: 'rgba(253,250,245,0.92)',
            lineHeight: 1.5,
            marginBottom: '2rem',
          }}
        >
          I would rather spend one lifetime with you,<br />
          than face all the ages of this world alone.
        </motion.blockquote>

        <motion.cite
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 0.6 }}
          style={{
            fontFamily: 'var(--ff-sans)',
            fontStyle: 'normal',
            fontSize: '0.68rem',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: 'var(--champagne)',
            opacity: 0.7,
          }}
        >
          — J.R.R. Tolkien
        </motion.cite>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : {}}
          transition={{ duration: 1.2, delay: 0.7 }}
          style={{
            width: 80,
            height: 1,
            background: 'linear-gradient(to right, transparent, var(--gold), transparent)',
            margin: '3rem auto',
          }}
        />

        {/* Palette */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.9 }}
        >
          <p style={{
            fontFamily: 'var(--ff-sans)',
            fontSize: '0.6rem',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.3)',
            marginBottom: '1.2rem',
          }}>
            Color Palette
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', alignItems: 'center' }}>
            {PALETTE.map((p, i) => (
              <motion.div
                key={p.name}
                title={p.name}
                initial={{ scale: 0, opacity: 0 }}
                animate={inView ? { scale: 1, opacity: 1 } : {}}
                transition={{ delay: 1 + i * 0.07, type: 'spring', stiffness: 300, damping: 20 }}
                whileHover={{ scale: 1.3, y: -4 }}
                style={{
                  width: 36, height: 36,
                  borderRadius: '50%',
                  background: p.color,
                  border: '2px solid rgba(255,255,255,0.08)',
                  boxShadow: '0 6px 20px rgba(0,0,0,0.4)',
                  cursor: 'default',
                }}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
