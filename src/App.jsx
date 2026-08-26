import { useEffect } from 'react'
import { motion }    from 'framer-motion'
import { useWedding } from './context/WeddingContext'
import PetalCanvas  from './components/PetalCanvas'
import LiveChat     from './components/LiveChat'
import Hero         from './components/Hero'
import Countdown    from './components/Countdown'
import OurStory     from './components/OurStory'
import Schedule     from './components/Schedule'
import QuoteSection from './components/QuoteSection'
import Venue        from './components/Venue'
import Gallery      from './components/Gallery'
import Entourage    from './components/Entourage'
import RSVP         from './components/RSVP'
import Footer       from './components/Footer'

export default function App() {
  const { weddingDate } = useWedding()

  const shortMonthDay = new Date(weddingDate)
    .toLocaleDateString('en-US', { month: 'long', day: 'numeric' })
    .toUpperCase()

  const scrollToRSVP = (e) => {
    e.preventDefault()
    document.querySelector('#rsvp')?.scrollIntoView({ behavior: 'smooth' })
  }

  // Smooth lenis scroll feel via native smooth behavior enhancement
  useEffect(() => {
    // Detect touch / mobile — disable custom cursor
    const isMobile = window.matchMedia('(pointer: coarse)').matches
    if (isMobile) document.body.style.cursor = 'auto'
  }, [])

  return (
    <>
      {/* Global overlays */}
      <PetalCanvas />
      <LiveChat />

      {/* Sticky RSVP Pill — always above the chat bubble */}
      <motion.a
        href="#rsvp"
        onClick={scrollToRSVP}
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.8, duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
        whileHover={{ scale: 1.06, y: -2 }}
        whileTap={{ scale: 0.97 }}
        style={{
          position: 'fixed',
          bottom: '6.5rem',   /* sits above the 60px chat bubble at bottom:2rem */
          right: '2rem',
          background: 'var(--taupe-dark)',
          color: 'white',
          borderRadius: '30px',
          padding: '0.75rem 1.6rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          boxShadow: '0 8px 28px rgba(100, 78, 136, 0.32)',
          fontSize: '0.68rem',
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          fontWeight: 400,
          zIndex: 998,   /* below chat's 9999 but above everything else */
          border: '1px solid rgba(255,255,255,0.1)',
          backdropFilter: 'blur(6px)',
          cursor: 'pointer',
        }}
      >
        <span>RSVP</span>
        <span style={{ width: '1px', height: '12px', background: 'rgba(255,255,255,0.3)' }} />
        <span>{shortMonthDay}</span>
      </motion.a>

      {/* Page */}
      <main>
        <Hero />
        <Countdown />
        <OurStory />
        <Schedule />
        <QuoteSection />
        <Venue />
        <Gallery />
        <Entourage />
        <RSVP />
      </main>
      <Footer />
    </>
  )
}
