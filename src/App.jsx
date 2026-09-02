import { useState, useEffect } from 'react'
import PetalCanvas    from './components/PetalCanvas'
import LiveChat       from './components/LiveChat'
import EnvelopeReveal from './components/EnvelopeReveal'
import Hero           from './components/Hero'
import Countdown      from './components/Countdown'
import OurStory       from './components/OurStory'
import Schedule       from './components/Schedule'
import QuoteSection   from './components/QuoteSection'
import GiftAndHashtag from './components/GiftAndHashtag'
import Venue          from './components/Venue'
import Gallery        from './components/Gallery'
import Entourage      from './components/Entourage'
import RSVP           from './components/RSVP'
import Footer         from './components/Footer'

export default function App() {
  const [showPetals, setShowPetals] = useState(false)

  useEffect(() => {
    // Detect touch / mobile — disable custom cursor
    const isMobile = window.matchMedia('(pointer: coarse)').matches
    if (isMobile) document.body.style.cursor = 'auto'
  }, [])

  return (
    <>
      {/* Interactive Birthday Envelope Reveal Overlay */}
      <EnvelopeReveal onComplete={() => setShowPetals(true)} />

      {/* Global overlays (Petals start popping when envelope sequence finishes) */}
      <PetalCanvas active={showPetals} />
      <LiveChat />

      {/* Existing Invitation Page (Preserved 100%) */}
      <main>
        <Hero />
        <Countdown />
        <OurStory />
        <Entourage />
        <Schedule />
        <QuoteSection />
        <GiftAndHashtag />
        <Venue />
        <Gallery />
        <RSVP />
      </main>
      <Footer />
    </>
  )
}
