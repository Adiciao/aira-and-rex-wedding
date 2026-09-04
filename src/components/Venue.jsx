import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { useWedding } from '../context/WeddingContext'

export default function Venue() {
  const { ceremonyVenueName, ceremonyVenueAddress, receptionVenueName, receptionVenueAddress } = useWedding()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="venue" ref={ref} style={{ padding: 'clamp(5rem, 10vw, 10rem) 2rem', background: 'var(--cream-light)', overflow: 'hidden' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        {/* Centered Header */}
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} style={{ fontFamily: 'var(--ff-sans)', fontSize: '0.65rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--taupe)', marginBottom: '0.6rem' }}>Find Us Here</motion.p>
          <motion.h2 initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }} style={{ fontFamily: 'var(--ff-serif)', fontStyle: 'italic', fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 300, color: 'var(--text)', marginBottom: 0 }}>The <span style={{ color: 'var(--taupe)' }}>Venues</span></motion.h2>
        </div>

        <div className="venue-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(3rem, 6vw, 8rem)', alignItems: 'center' }}>
          <div>

          {[
            { 
              tag: 'Ceremony',  
              name: ceremonyVenueName,  
              addr: ceremonyVenueAddress,  
              delay: 0.25, 
              mainImg: '/church_exterior.jpg',    
              smallImg: '/church_qr.png',     
              smallAlt: 'QR Code – Church Directions',     
              smallLabel: 'Scan for Directions',
              mapsUrl: `https://maps.google.com/?q=${encodeURIComponent(ceremonyVenueName + ', ' + ceremonyVenueAddress)}`
            },
            { 
              tag: 'Reception', 
              name: '5A\'s Private Place & Resort', 
              addr: 'Tibagan San Miguel, Bulacan', 
              delay: 0.35, 
              mainImg: '/reception_exterior.jpg', 
              smallImg: '/reception_qr.png', 
              smallAlt: 'QR Code – Reception Directions', 
              smallLabel: 'Scan for Directions',
              mapsUrl: 'https://www.google.com/maps/place/5A+Private+Place+%26+Resort/@15.1325952,120.9937426,800m/data=!3m2!1e3!4b1!4m6!3m5!1s0x33971bc96d9eaf7b:0x7018b36d194d7709!8m2!3d15.13259!4d120.9963175!16s%2Fg%2F11s4t29tcp?entry=ttu&g_ep=EgoyMDI2MDkwMS4wIKXMDSoASAFQAw%3D%3D'
            },
          ].map(v => (
            <motion.div key={v.tag} initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: v.delay }} style={{ background: 'var(--cream)', border: '1px solid var(--blush)', padding: '1.5rem 2rem', marginBottom: '1rem', borderRadius: '4px' }}>
              <p style={{ fontFamily: 'var(--ff-sans)', fontSize: '0.6rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--taupe)', marginBottom: '0.4rem' }}>{v.tag}</p>
              
              <div style={{ display: 'flex', gap: '1.2rem', alignItems: 'flex-end', marginTop: '0.8rem', marginBottom: '1.2rem' }}>
                {/* Main exterior image styled as a polaroid with signature */}
                <div style={{ 
                  flex: 1, 
                  border: '1px solid rgba(194, 177, 216, 0.4)', 
                  padding: '6px 6px 28px 6px', 
                  background: '#ffffff', 
                  borderRadius: '2px', 
                  boxShadow: '0 4px 12px rgba(100, 78, 136, 0.06)',
                  position: 'relative'
                }}>
                  <img 
                    src={v.mainImg} 
                    alt={`${v.tag} Venue Exterior`} 
                    style={{ width: '100%', height: 'auto', display: 'block', borderRadius: '1px' }} 
                  />
                  <div style={{ 
                    position: 'absolute', 
                    bottom: '5px', 
                    left: 0, 
                    right: 0, 
                    textAlign: 'center', 
                    fontFamily: 'var(--ff-serif)', 
                    fontStyle: 'italic', 
                    fontSize: '0.74rem', 
                    color: 'var(--taupe-dark)', 
                    letterSpacing: '0.02em',
                    fontWeight: 500
                  }}>
                    Digital Art by Aldrich Salas
                  </div>
                </div>

                {/* Small image — QR code for church, interior photo for reception */}
                <a 
                  href={v.mapsUrl}
                  target="_blank" 
                  rel="noreferrer"
                  title="Click to open Google Maps directions"
                  style={{ 
                    width: '100px', 
                    flexShrink: 0, 
                    border: '1px solid rgba(194, 177, 216, 0.4)', 
                    padding: v.smallLabel ? '6px 6px 22px 6px' : '5px', 
                    background: '#ffffff', 
                    borderRadius: '2px', 
                    boxShadow: '0 4px 12px rgba(100, 78, 136, 0.06)', 
                    marginBottom: '0.4rem',
                    position: 'relative',
                    display: 'block',
                    cursor: 'pointer'
                  }}
                >
                  <img 
                    src={v.smallImg} 
                    alt={v.smallAlt} 
                    style={{ width: '100%', height: 'auto', display: 'block', borderRadius: '1px' }} 
                  />
                  {v.smallLabel && (
                    <div style={{
                      position: 'absolute',
                      bottom: '4px',
                      left: 0,
                      right: 0,
                      textAlign: 'center',
                      fontFamily: 'var(--ff-sans)',
                      fontSize: '0.52rem',
                      letterSpacing: '0.04em',
                      color: '#9B72B0',
                      fontWeight: 500
                    }}>
                      {v.smallLabel}
                    </div>
                  )}
                </a>
              </div>

              <h3 style={{ fontFamily: 'var(--ff-serif)', fontSize: '1.4rem', fontWeight: 400, marginBottom: '0.4rem' }}>{v.name}</h3>
              <p style={{ color: 'var(--text-soft)', fontSize: '0.87rem', lineHeight: 1.7, marginBottom: '0.8rem' }}>{v.addr}</p>
              
              <a 
                href={v.mapsUrl} 
                target="_blank" 
                rel="noreferrer"
                style={{
                  display: 'inline-block',
                  fontSize: '0.68rem',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  fontWeight: 600,
                  color: 'var(--taupe-dark)',
                  textDecoration: 'underline'
                }}
              >
                Open in Google Maps →
              </a>
            </motion.div>
          ))}


          <motion.a href="https://www.google.com/maps/place/5A+Private+Place+%26+Resort/@15.1325952,120.9937426,800m/data=!3m2!1e3!4b1!4m6!3m5!1s0x33971bc96d9eaf7b:0x7018b36d194d7709!8m2!3d15.13259!4d120.9963175!16s%2Fg%2F11s4t29tcp?entry=ttu&g_ep=EgoyMDI2MDkwMS4wIKXMDSoASAFQAw%3D%3D" target="_blank" rel="noreferrer" initial={{ opacity: 0, y: 10 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.45 }} whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.97 }} style={{ display: 'inline-block', marginTop: '0.5rem', padding: '0.9rem 2.4rem', background: 'var(--noir)', color: 'white', fontFamily: 'var(--ff-sans)', fontSize: '0.68rem', letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 400, borderRadius: '1px', border: '1px solid var(--noir)' }}>Get Directions →</motion.a>
        </div>

        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={inView ? { opacity: 1, scale: 1 } : {}} transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}>
          <AnimatedMap />
        </motion.div>
        </div>
      </div>
      <style>{`@media (max-width: 800px) { .venue-grid { grid-template-columns: 1fr !important; } }`}</style>
    </section>
  )
}

function AnimatedMap() {
  return (
    <div style={{ 
      position: 'relative', 
      background: '#ffffff', 
      border: '1px solid rgba(194, 177, 216, 0.4)', 
      borderRadius: '2px', 
      overflow: 'hidden', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      padding: '6px 6px 32px 6px', 
      boxShadow: '0 8px 24px rgba(100, 78, 136, 0.08)' 
    }}>
      <img 
        src="/route_map.jpg" 
        alt="Wedding Route Map from Ceremony to Reception" 
        style={{ width: '100%', height: 'auto', display: 'block', borderRadius: '2px' }} 
      />
      <div style={{ 
        position: 'absolute', 
        bottom: '8px', 
        left: 0,
        right: 0,
        textAlign: 'center', 
        fontFamily: 'var(--ff-serif)', 
        fontStyle: 'italic', 
        fontSize: '0.85rem', 
        color: 'var(--taupe-dark)', 
        letterSpacing: '0.04em',
        fontWeight: 500
      }}>
        Digital Art by Aldrich Salas
      </div>
    </div>
  )
}
