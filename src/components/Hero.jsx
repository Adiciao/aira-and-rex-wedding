import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import { useWedding } from '../context/WeddingContext'

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
  const { bride, groom, weddingDate, location, heroSubtitle, images } = useWedding()
  const dateRef   = useRef(null)
  const scrollRef = useRef(null)

  // Generate dynamic date/location subtitle
  const dateObj = new Date(weddingDate)
  const formattedDate = dateObj.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
  const subtitleText = location ? `${formattedDate}  ·  ${location}` : heroSubtitle

  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.3 })
    tl.fromTo('.hero-eyebrow',
      { opacity: 0, y: 20, letterSpacing: '0.5em' },
      { opacity: 1, y: 0, letterSpacing: '0.25em', duration: 1.2, ease: 'power3.out' }
    )
    .fromTo('.hero-name-bride',
      { opacity: 0, x: -60 }, { opacity: 1, x: 0, duration: 1.4, ease: 'expo.out' }, '-=0.6'
    )
    .fromTo('.hero-amp',
      { opacity: 0, scale: 0.3, rotate: -30 }, { opacity: 1, scale: 1, rotate: 0, duration: 1, ease: 'back.out(1.7)' }, '-=0.9'
    )
    .fromTo('.hero-name-groom',
      { opacity: 0, x: 60 }, { opacity: 1, x: 0, duration: 1.4, ease: 'expo.out' }, '-=1.1'
    )
    .call(() => { if (dateRef.current) scrambleText(dateRef.current, subtitleText, 1.4) }, null, '-=0.4')
    .fromTo('.hero-buttons', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }, '-=0.3')
    .fromTo('.hero-scroll', { opacity: 0 }, { opacity: 1, duration: 1 }, '-=0.2')

    gsap.to(scrollRef.current, { y: 12, repeat: -1, yoyo: true, duration: 1.8, ease: 'sine.inOut', delay: 3.5 })
  }, [subtitleText])

  const scrollTo = (href) => (e) => {
    e.preventDefault()
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section id="hero" style={{ position: 'relative', height: '100svh', minHeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
      <motion.div
        initial={{ scale: 1.15 }} animate={{ scale: 1.05 }}
        transition={{ duration: 2.5, ease: 'easeOut' }}
        style={{ position: 'absolute', inset: '-10%', backgroundImage: `url(${images.hero})`, backgroundSize: 'cover', backgroundPosition: 'center 35%' }}
      />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(10,7,5,0.55) 0%, rgba(10,7,5,0.25) 45%, rgba(10,7,5,0.65) 100%)' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 60%, transparent 40%, rgba(0,0,0,0.4) 100%)' }} />

      <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', padding: '0 1.5rem', width: '100%' }}>
        <div className="hero-eyebrow" style={{ display: 'inline-block', fontFamily: 'var(--ff-sans)', fontSize: '0.65rem', fontWeight: 300, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(201,185,160,0.9)', marginBottom: '1.8rem', opacity: 0, border: '1px solid rgba(201,185,160,0.25)', padding: '0.5rem 1.8rem', backdropFilter: 'blur(8px)', background: 'rgba(255,255,255,0.04)' }}>
          You Are Invited
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'clamp(0.4rem, 2vw, 1.5rem)', flexWrap: 'wrap', marginBottom: '1.8rem' }}>
          <span className="hero-name-groom" style={{ fontFamily: 'var(--ff-serif)', fontStyle: 'italic', fontWeight: 300, fontSize: 'clamp(4rem, 10vw, 9.5rem)', color: 'white', lineHeight: 0.9, opacity: 0, textShadow: '0 4px 40px rgba(0,0,0,0.4)', letterSpacing: '-0.02em' }}>{groom}</span>
          <span className="hero-amp" style={{ fontFamily: 'var(--ff-serif)', fontStyle: 'italic', fontSize: 'clamp(2.5rem, 6vw, 5.5rem)', color: 'var(--gold)', opacity: 0, lineHeight: 1, marginTop: '0.3em' }}>&amp;</span>
          <span className="hero-name-bride" style={{ fontFamily: 'var(--ff-serif)', fontStyle: 'italic', fontWeight: 300, fontSize: 'clamp(4rem, 10vw, 9.5rem)', color: 'white', lineHeight: 0.9, opacity: 0, textShadow: '0 4px 40px rgba(0,0,0,0.4)', letterSpacing: '-0.02em' }}>{bride}</span>
        </div>
        <p ref={dateRef} style={{ fontFamily: 'var(--ff-sans)', fontSize: 'clamp(0.7rem, 1.5vw, 0.85rem)', fontWeight: 300, letterSpacing: '0.16em', color: 'rgba(255,255,255,0.65)', marginBottom: '3rem', fontVariantNumeric: 'tabular-nums' }}>&nbsp;</p>
        <div className="hero-buttons" style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', opacity: 0 }}>
          <motion.a href="#rsvp" onClick={scrollTo('#rsvp')} whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }} transition={{ type: 'spring', stiffness: 400, damping: 20 }} style={{ padding: '0.9rem 2.8rem', fontFamily: 'var(--ff-sans)', fontSize: '0.68rem', fontWeight: 400, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'white', background: 'var(--taupe)', border: '1px solid var(--taupe)', borderRadius: '1px', display: 'inline-block' }}>RSVP Now</motion.a>
          <motion.a href="#story" onClick={scrollTo('#story')} whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }} transition={{ type: 'spring', stiffness: 400, damping: 20 }} style={{ padding: '0.9rem 2.8rem', fontFamily: 'var(--ff-sans)', fontSize: '0.68rem', fontWeight: 400, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'white', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.3)', backdropFilter: 'blur(12px)', borderRadius: '1px', display: 'inline-block' }}>Our Story</motion.a>
        </div>
      </div>

      <div ref={scrollRef} className="hero-scroll" style={{ position: 'absolute', bottom: '2.5rem', left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.6rem', opacity: 0, zIndex: 2 }}>
        <span style={{ fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', fontWeight: 300 }}>Scroll</span>
        <div style={{ width: 1, height: 50, background: 'linear-gradient(to bottom, rgba(201,169,110,0.7), transparent)', borderRadius: 1 }} />
      </div>
    </section>
  )
}
