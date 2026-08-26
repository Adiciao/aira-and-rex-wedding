import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import { useWedding } from '../context/WeddingContext'
import heroBg from '../assets/wedding-hero-bg.png'

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

function scrambleText(el, finalText, duration = 1.2) {
  let iterations = 0
  const total = Math.floor(duration * 60)
  const interval = setInterval(() => {
    el.textContent = finalText.split('').map((char, i) => {
      if (char === ' ') return ' '
      if (iterations / total > i / finalText.length) return char
      return CHARS[Math.floor(Math.random() * CHARS.length)]
    }).join('')
    if (iterations >= total) { el.textContent = finalText; clearInterval(interval) }
    iterations++
  }, 1000 / 60)
}

export default function Hero() {
  const { bride, groom, weddingDate, location, heroSubtitle } = useWedding()
  const dateRef   = useRef(null)
  const scrollRef = useRef(null)

  // Generate dynamic date/location subtitle
  const dateObj = new Date(weddingDate)
  const formattedDate = dateObj.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
  const shortMonthDay = dateObj.toLocaleDateString('en-US', { month: 'long', day: 'numeric' }).toUpperCase()
  const subtitleText = location ? `${formattedDate}  ·  ${location}` : heroSubtitle

  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.3 })
    tl.fromTo('.hero-eyebrow',
      { opacity: 0, y: 15 },
      { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }
    )
    .fromTo('.hero-name-groom',
      { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 1.2, ease: 'power3.out' }, '-=0.6'
    )
    .fromTo('.hero-amp',
      { opacity: 0, scale: 0.5 }, { opacity: 1, scale: 1, duration: 0.8, ease: 'power3.out' }, '-=0.9'
    )
    .fromTo('.hero-name-bride',
      { opacity: 0, x: 30 }, { opacity: 1, x: 0, duration: 1.2, ease: 'power3.out' }, '-=1.0'
    )
    .fromTo('.hero-divider',
      { opacity: 0, scaleX: 0 }, { opacity: 1, scaleX: 1, duration: 1, ease: 'power3.out' }, '-=0.5'
    )
    .fromTo('.hero-info-col',
      { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }, '-=0.6'
    )
    .call(() => { if (dateRef.current) scrambleText(dateRef.current, subtitleText, 1.4) }, null, '-=0.5')
    .fromTo('.hero-scroll', { opacity: 0 }, { opacity: 1, duration: 0.8 }, '-=0.3')
    .fromTo('.hero-rsvp-pill', { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.8, ease: 'back.out(1.5)' }, '-=0.4')

    gsap.to(scrollRef.current, { y: 8, repeat: -1, yoyo: true, duration: 1.5, ease: 'sine.inOut', delay: 2 })
  }, [subtitleText])

  const scrollTo = (href) => (e) => {
    e.preventDefault()
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section id="hero" style={{ position: 'relative', height: '100svh', minHeight: 650, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', background: '#eae5f0' }}>
      {/* Background Image */}
      <motion.div
        initial={{ scale: 1.05 }} animate={{ scale: 1 }}
        transition={{ duration: 2, ease: 'easeOut' }}
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(${heroBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center 40%',
          opacity: 0.9
        }}
      />
      {/* Soft atmospheric misty purple-white overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(to bottom, rgba(255,255,255,0.05) 0%, rgba(234,229,240,0.3) 40%, rgba(255,255,255,0.85) 85%, #ffffff 100%)'
      }} />

      <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', padding: '0 2rem', width: '100%', maxWidth: 1000 }}>
        {/* Eyebrow */}
        <p className="hero-eyebrow" style={{
          fontFamily: 'var(--ff-sans)',
          fontSize: 'clamp(0.8rem, 1.5vw, 1rem)',
          fontWeight: 400,
          letterSpacing: '0.35em',
          textTransform: 'uppercase',
          color: 'var(--text-soft)',
          marginBottom: '2rem',
          opacity: 0
        }}>
          Joining for the Union of
        </p>

        {/* Names */}
        <h1 style={{
          fontFamily: 'var(--ff-serif)',
          fontStyle: 'italic',
          fontWeight: 300,
          fontSize: 'clamp(4rem, 10vw, 8.5rem)',
          color: 'var(--text)',
          lineHeight: 1.0,
          marginBottom: '2rem',
          letterSpacing: '-0.02em',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '0.15em',
          flexWrap: 'wrap'
        }}>
          <span className="hero-name-groom" style={{ opacity: 0 }}>{groom}</span>
          <span className="hero-amp" style={{ opacity: 0, color: 'var(--taupe)', margin: '0 0.2em', fontSize: '0.6em', fontWeight: 300, alignSelf: 'center' }}>&amp;</span>
          <span className="hero-name-bride" style={{ opacity: 0 }}>{bride}</span>
        </h1>

        {/* Horizontal Divider Line */}
        <div className="hero-divider" style={{
          width: '160px',
          height: '1px',
          background: 'rgba(100, 78, 136, 0.3)',
          margin: '0 auto 2.5rem',
          opacity: 0,
          transformOrigin: 'center'
        }} />

        {/* Date and Location Subtitle */}
        <p ref={dateRef} className="hero-info-col" style={{
          fontFamily: 'var(--ff-sans)',
          fontSize: 'clamp(0.95rem, 2vw, 1.2rem)',
          fontWeight: 400,
          letterSpacing: '0.18em',
          color: 'var(--text-soft)',
          opacity: 0,
          marginTop: '0.5rem',
          fontVariantNumeric: 'tabular-nums'
        }}>
          &nbsp;
        </p>
      </div>

      {/* Floating RSVP Pill Button */}
      <motion.a
        href="#rsvp"
        onClick={scrollTo('#rsvp')}
        className="hero-rsvp-pill"
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.98 }}
        style={{
          position: 'absolute',
          bottom: '2.5rem',
          right: '2.5rem',
          background: 'var(--taupe-dark)',
          color: 'white',
          borderRadius: '30px',
          padding: '0.8rem 1.8rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.85rem',
          boxShadow: '0 8px 25px rgba(100, 78, 136, 0.18)',
          fontSize: '0.7rem',
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          fontWeight: 400,
          zIndex: 10,
          opacity: 0,
          border: '1px solid rgba(255,255,255,0.05)'
        }}
      >
        <span>RSVP</span>
        <span style={{ width: '1px', height: '12px', background: 'rgba(255, 255, 255, 0.3)' }} />
        <span>{shortMonthDay}</span>
      </motion.a>

      {/* Scroll indicator */}
      <div ref={scrollRef} className="hero-scroll" style={{ position: 'absolute', bottom: '2rem', left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', opacity: 0, zIndex: 2 }}>
        <span style={{ fontSize: '0.58rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(41, 31, 59, 0.45)', fontWeight: 400 }}>Scroll</span>
        <div style={{ width: 1, height: 40, background: 'linear-gradient(to bottom, rgba(100, 78, 136, 0.4), transparent)' }} />
      </div>
    </section>
  )
}
