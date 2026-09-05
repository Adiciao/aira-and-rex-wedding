import { useRef, useState } from 'react'
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion'
import { useWedding } from '../context/WeddingContext'

export default function OurStory() {
  const { bride, groom, brideStory, groomStory, acrosticPoem, images, weddingDate } = useWedding()
  const [activeTab, setActiveTab] = useState('bride') // 'bride' | 'groom'
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const imageY = useTransform(scrollYProgress, [0, 1], ['-5%', '5%'])

  const dateObj = new Date(weddingDate || '2026-10-17')
  const day   = dateObj.getDate()
  const month = dateObj.toLocaleString('en', { month: 'short' }).toUpperCase()
  const year  = dateObj.getFullYear()

  // Fallback defaults if context not yet hydrated
  const currentStory = activeTab === 'bride' 
    ? (brideStory || []) 
    : (groomStory || [])

  const poemData = acrosticPoem || [
    {
      letter: 'A',
      lines: [
        "Akong isang manlalakbay na walang kahihinatnan.",
        "At ikaw ang destinansyon na matagal ko nang nais paroonan.",
        "Ang makilala ka ay batid ng langit."
      ]
    },
    {
      letter: 'I',
      lines: [
        "Ikaw ang nais kong makapiling.",
        "Kahit na ang bukas ay aking huli nang pag gising.",
        "Wala nakong gustong masilayan sa umaga.",
        "Kundi ang mukha mo aking asawa."
      ]
    },
    {
      letter: 'R',
      lines: [
        "Rason kung bakit ako'y umiral",
        "Malamang ay dahil sayo aking mahal",
        "Hanggang sa katapusan ng ating kwento.",
        "Mananatiling ikaw ang simula at katapusan nito."
      ]
    },
    {
      letter: 'A',
      lines: [
        "Ating litrato kaylan man ay di kukupas.",
        "Mananatiling nandito ngayon at bukas.",
        "Kwento nati'y hindi mag wawakas.",
        "Patuloy kong uulit utilin hanggang bukas."
      ]
    }
  ]

  return (
    <section id="story" ref={ref} style={{ padding: 'clamp(5rem, 10vw, 9rem) 2rem', background: 'var(--cream-light)', overflow: 'hidden' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        
        {/* Main Grid: Story Text & Couple Photo */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(3rem, 6vw, 6rem)', alignItems: 'flex-start', marginBottom: '5rem' }}>

          <div>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay: 0.1 }} style={{ fontFamily: 'var(--ff-sans)', fontSize: '0.65rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--taupe)', marginBottom: '0.8rem' }}>Our Love Story</motion.p>
            <motion.h2 initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }} style={{ fontFamily: 'var(--ff-serif)', fontStyle: 'italic', fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 300, lineHeight: 1.05, color: 'var(--text)', marginBottom: '2rem' }}>
              How it all<br /><span style={{ color: 'var(--taupe)' }}>began</span>
            </motion.h2>

            {/* Story Perspective Switcher Tabs */}
            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem' }}>
              <button
                onClick={() => setActiveTab('bride')}
                style={{
                  padding: '0.6rem 1.4rem',
                  borderRadius: '25px',
                  border: activeTab === 'bride' ? '1.5px solid var(--taupe)' : '1px solid var(--blush)',
                  background: activeTab === 'bride' ? 'var(--taupe)' : 'var(--cream)',
                  color: activeTab === 'bride' ? 'white' : 'var(--text)',
                  fontFamily: 'var(--ff-serif)',
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: activeTab === 'bride' ? '0 4px 15px rgba(158, 135, 189, 0.3)' : 'none',
                }}
              >
                🌸 Story of the Bride (Aira)
              </button>
              <button
                onClick={() => setActiveTab('groom')}
                style={{
                  padding: '0.6rem 1.4rem',
                  borderRadius: '25px',
                  border: activeTab === 'groom' ? '1.5px solid var(--taupe)' : '1px solid var(--blush)',
                  background: activeTab === 'groom' ? 'var(--taupe)' : 'var(--cream)',
                  color: activeTab === 'groom' ? 'white' : 'var(--text)',
                  fontFamily: 'var(--ff-serif)',
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: activeTab === 'groom' ? '0 4px 15px rgba(158, 135, 189, 0.3)' : 'none',
                }}
              >
                🤵 Story of the Groom (Rex)
              </button>
            </div>

            {/* Animated Story Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4 }}
              >
                {currentStory.map((p, i) => (
                  <p key={i} style={{ color: 'var(--text-soft)', fontSize: '0.95rem', lineHeight: 1.95, marginBottom: '1.2rem', textAlign: 'justify' }}>
                    {p}
                  </p>
                ))}
              </motion.div>
            </AnimatePresence>

            <motion.div initial={{ opacity: 0, scaleX: 0 }} animate={inView ? { opacity: 1, scaleX: 1 } : {}} transition={{ duration: 1, delay: 0.7 }} style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--blush)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ fontFamily: 'var(--ff-serif)', fontStyle: 'italic', fontSize: '1.8rem', fontWeight: 300, color: 'var(--taupe)' }}>{groom || 'Rex'} &amp; {bride || 'Aira'}</span>
              <div style={{ width: 40, height: 1, background: 'var(--champagne)' }} />
              <span style={{ fontFamily: 'var(--ff-sans)', fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--text-soft)', fontWeight: 300 }}>{year}</span>
            </motion.div>
          </div>

          {/* Couple Image & Date Badge */}
          <motion.div initial={{ opacity: 0, x: 60 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }} style={{ position: 'relative', marginTop: '1rem' }}>
            <TiltCard>
              <div style={{ position: 'relative', overflow: 'hidden', borderRadius: '4px', boxShadow: '0 30px 80px rgba(0,0,0,0.15)', border: '1px solid var(--blush)' }}>
                <motion.img src={images?.couple || '/couple_photo.jpg'} alt={`${groom} and ${bride}`} style={{ width: '100%', height: 'clamp(420px, 62vh, 640px)', objectFit: 'cover', display: 'block', y: imageY }} />
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

        {/* 📜 Dedicated Acrostic Poem Card ("A-I-R-A") */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.5 }}
          style={{
            position: 'relative',
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.85) 0%, rgba(245, 238, 252, 0.95) 100%)',
            border: '1.5px solid rgba(201, 169, 110, 0.55)',
            borderRadius: '20px',
            padding: '3rem clamp(1.5rem, 4vw, 3.5rem)',
            boxShadow: '0 15px 45px rgba(100, 78, 136, 0.1)',
            maxWidth: 920,
            margin: '0 auto',
            textAlign: 'center',
          }}
        >
          {/* Inner double border outline in gold */}
          <div style={{
            position: 'absolute',
            inset: '6px',
            border: '1px solid rgba(201, 169, 110, 0.35)',
            borderRadius: '15px',
            pointerEvents: 'none'
          }} />

          {/* Header Title */}
          <p style={{ fontFamily: 'var(--ff-sans)', fontSize: '0.65rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#a38144', marginBottom: '0.4rem', fontWeight: 600 }}>
            Acrostic Poem
          </p>
          <h3 style={{ fontFamily: 'var(--ff-serif)', fontStyle: 'italic', fontSize: 'clamp(2rem, 4vw, 3rem)', color: 'var(--taupe-dark)', marginBottom: '2.5rem', fontWeight: 400 }}>
            A Poem for <span style={{ color: '#a38144', fontWeight: 600 }}>A I R A</span>
          </h3>

          {/* Stanzas Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '2rem', textAlign: 'left' }}>
            {poemData.map((stanza, sIdx) => {
              const firstLine = stanza.lines[0] || ''
              const firstChar = stanza.letter || firstLine.charAt(0)
              const restFirstLine = firstLine.startsWith(firstChar) ? firstLine.slice(firstChar.length) : firstLine

              return (
                <div 
                  key={sIdx}
                  style={{
                    background: 'rgba(255,255,255,0.7)',
                    border: '1px solid rgba(194, 177, 216, 0.4)',
                    borderRadius: '12px',
                    padding: '1.5rem',
                    position: 'relative',
                    boxShadow: '0 4px 15px rgba(100,78,136,0.05)',
                  }}
                >
                  <p style={{ fontFamily: 'var(--ff-serif)', fontSize: '1rem', color: 'var(--text)', lineHeight: 1.85, fontStyle: 'italic' }}>
                    <span style={{
                      display: 'inline-block',
                      fontFamily: 'var(--ff-serif)',
                      fontSize: '2.2rem',
                      fontWeight: 800,
                      color: '#a38144',
                      lineHeight: 1,
                      marginRight: '2px',
                      float: 'left',
                      fontStyle: 'normal'
                    }}>
                      {firstChar}
                    </span>
                    {restFirstLine}
                  </p>
                  {stanza.lines.slice(1).map((line, lIdx) => (
                    <p key={lIdx} style={{ fontFamily: 'var(--ff-serif)', fontSize: '1rem', color: 'var(--text-soft)', lineHeight: 1.85, fontStyle: 'italic', marginTop: 4 }}>
                      {line}
                    </p>
                  ))}
                </div>
              )
            })}
          </div>

          <div style={{ marginTop: '2.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: '#a38144', fontSize: '0.8rem' }}>
            <span>✦</span>
            <span style={{ fontFamily: 'var(--ff-serif)', fontStyle: 'italic', fontSize: '1rem', color: 'var(--taupe-dark)' }}>Written with love by Rex</span>
            <span>✦</span>
          </div>
        </motion.div>

      </div>
      <style>{`@media (max-width: 800px) { #story > div:first-child { grid-template-columns: 1fr !important; } }`}</style>
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
