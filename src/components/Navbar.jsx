import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useWedding } from '../context/WeddingContext'

export default function Navbar() {
  const { bride, groom } = useWedding()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('')

  const links = [
    { href: '#story',     label: 'Our Story' },
    { href: '#schedule',  label: 'Schedule' },
    { href: '#venue',     label: 'Venue' },
    { href: '#gallery',   label: 'Gallery' },
    { href: '#rsvp',      label: 'RSVP' },
  ]

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const navClick = (e, href) => {
    e.preventDefault()
    setMenuOpen(false)
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, delay: 2.8, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: 'fixed', top: 0, right: 0,
          zIndex: 1000,
          padding: scrolled ? '1rem 2rem' : '1.8rem 2rem',
          background: scrolled ? 'rgba(253,250,245,0.88)' : 'transparent',
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(201,185,160,0.2)' : '1px solid transparent',
          transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          maxWidth: '1300px',
          margin: '0 auto',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100%',
        }}
      >
        {/* Logo */}
        <a
          href="#hero"
          onClick={e => navClick(e, '#hero')}
          style={{
            fontFamily: 'var(--ff-serif)',
            fontStyle: 'italic',
            fontSize: '1.8rem',
            fontWeight: 300,
            color: scrolled ? 'var(--text)' : 'white',
            letterSpacing: '0.04em',
            transition: 'color 0.5s ease',
          }}
        >
          {bride[0]} &amp; {groom[0]}
        </a>

        {/* Desktop Links */}
        <div style={{ display: 'flex', gap: '2.5rem', alignItems: 'center' }}>
          {links.slice(0, -1).map(link => (
            <a
              key={link.href}
              href={link.href}
              onClick={e => navClick(e, link.href)}
              style={{
                fontSize: '0.68rem',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                fontWeight: 400,
                color: scrolled ? 'var(--text-soft)' : 'rgba(255,255,255,0.8)',
                transition: 'color 0.3s ease',
                position: 'relative',
              }}
              onMouseEnter={e => e.target.style.color = scrolled ? 'var(--taupe)' : 'white'}
              onMouseLeave={e => e.target.style.color = scrolled ? 'var(--text-soft)' : 'rgba(255,255,255,0.8)'}
            >
              {link.label}
            </a>
          ))}

          {/* RSVP CTA */}
          <motion.a
            href="#rsvp"
            onClick={e => navClick(e, '#rsvp')}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            style={{
              padding: '0.55rem 1.6rem',
              background: scrolled ? 'var(--taupe)' : 'rgba(255,255,255,0.12)',
              color: 'white',
              border: `1px solid ${scrolled ? 'var(--taupe)' : 'rgba(255,255,255,0.35)'}`,
              backdropFilter: 'blur(10px)',
              fontSize: '0.68rem',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              fontWeight: 400,
              transition: 'all 0.4s ease',
              borderRadius: '1px',
            }}
          >
            RSVP
          </motion.a>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            display: 'none',
            flexDirection: 'column',
            gap: '5px',
            padding: '6px',
            color: scrolled ? 'var(--text)' : 'white',
          }}
          id="hamburger-btn"
        >
          {[0, 1, 2].map(i => (
            <motion.span
              key={i}
              style={{
                display: 'block',
                width: 24,
                height: 1.5,
                background: 'currentColor',
                transformOrigin: 'center',
              }}
              animate={
                menuOpen
                  ? i === 0 ? { rotate: 45,  y: 6.5 }
                  : i === 1 ? { opacity: 0 }
                  :            { rotate: -45, y: -6.5 }
                  : { rotate: 0, y: 0, opacity: 1 }
              }
              transition={{ duration: 0.3 }}
            />
          ))}
        </button>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'var(--cream-light)',
              zIndex: 999,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '2.5rem',
            }}
          >
            {links.map((link, i) => (
              <motion.a
                key={link.href}
                href={link.href}
                onClick={e => navClick(e, link.href)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 + 0.15 }}
                style={{
                  fontFamily: 'var(--ff-serif)',
                  fontStyle: 'italic',
                  fontSize: '2.8rem',
                  fontWeight: 300,
                  color: 'var(--text)',
                }}
              >
                {link.label}
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 768px) {
          #hamburger-btn { display: flex !important; }
          nav > div:nth-child(2) { display: none !important; }
        }
      `}</style>
    </>
  )
}
