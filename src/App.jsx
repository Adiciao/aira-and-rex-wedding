import { useEffect } from 'react'
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
import DressCode    from './components/DressCode'
import Footer       from './components/Footer'

export default function App() {
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

      {/* Page */}
      <main>
        <Hero />
        <Countdown />
        <OurStory />
        <Entourage />
        <Schedule />
        <DressCode />
        <QuoteSection />
        <Venue />
        <Gallery />
        <RSVP />
      </main>
      <Footer />
    </>
  )
}
