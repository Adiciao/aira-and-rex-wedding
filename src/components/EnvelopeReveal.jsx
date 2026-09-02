import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'

export default function EnvelopeReveal({ onComplete }) {
  const [step, setStep] = useState('closed') // 'closed' | 'popped' | 'unfolding' | 'completed'
  const [isShaking, setIsShaking] = useState(false)
  const [isFlapOpen, setIsFlapOpen] = useState(false)

  // Disable body scroll while envelope reveal is active
  useEffect(() => {
    if (step !== 'completed') {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [step])

  const triggerBirthdayPopper = () => {
    // 💥 Birthday Party Popper Confetti Burst!
    const count = 200
    const defaults = {
      origin: { y: 0.55 },
      colors: ['#f5e5c9', '#c2b1d8', '#4a205a', '#e8a5b8', '#ffd700', '#ffffff', '#9b72b0']
    }

    function fire(particleRatio, opts) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio)
      })
    }

    fire(0.25, {
      spread: 26,
      startVelocity: 55,
    })
    fire(0.2, {
      spread: 60,
    })
    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8
    })
    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2
    })
    fire(0.1, {
      spread: 120,
      startVelocity: 45,
    })
  }

  const handleEnvelopeClick = (e) => {
    e.stopPropagation()

    if (step === 'closed') {
      // First Click: Shake -> Birthday Popper Burst -> Photos Fly Out
      setIsShaking(true)
      setTimeout(() => {
        setIsShaking(false)
        setIsFlapOpen(true)
        triggerBirthdayPopper()
        setStep('popped')
      }, 450)
    } else if (step === 'popped') {
      // Second Click: Photos disperse -> Letter emerges & unfolds -> Reveal main website
      setStep('unfolding')
      setTimeout(() => {
        setStep('completed')
        if (onComplete) onComplete()
      }, 1400)
    }
  }

  if (step === 'completed') return null

  // Offsets for scattered polaroid photos (responsive percentages / pixels)
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 640
  const photos = [
    {
      img: '/couple_photo.jpg',
      caption: 'Rex & Aira',
      x: isMobile ? -75 : -170,
      y: isMobile ? -130 : -180,
      rotate: -14,
      delay: 0.1,
    },
    {
      img: '/gallery_ceremony.jpg',
      caption: 'San Miguel Church',
      x: isMobile ? 75 : 170,
      y: isMobile ? -140 : -190,
      rotate: 15,
      delay: 0.18,
    },
    {
      img: '/gallery_reception.jpg',
      caption: 'Celebration',
      x: isMobile ? -95 : -210,
      y: isMobile ? 65 : 70,
      rotate: -18,
      delay: 0.25,
    },
    {
      img: '/gallery_rings.jpg',
      caption: 'The Details',
      x: isMobile ? 95 : 210,
      y: isMobile ? 75 : 80,
      rotate: 16,
      delay: 0.32,
    },
    {
      img: '/hero_bg.jpg',
      caption: 'Our Journey',
      x: 0,
      y: isMobile ? -190 : -260,
      rotate: -4,
      delay: 0.4,
    },
  ]

  return (
    <AnimatePresence>
      {step !== 'completed' && (
        <motion.div
          key="envelope-overlay"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.8, ease: 'easeInOut' } }}
          animate={{ opacity: step === 'unfolding' ? 0.3 : 1 }}
          transition={{ duration: 0.5 }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99999,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'radial-gradient(circle at center, rgba(30, 18, 42, 0.94) 0%, rgba(12, 7, 18, 0.98) 100%)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            userSelect: 'none',
            overflow: 'hidden',
            cursor: 'pointer',
          }}
          onClick={handleEnvelopeClick}
        >
          {/* Subtle Background Particle Sparkles */}
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.25 }}>
            <div style={{
              width: '100%',
              height: '100%',
              backgroundImage: 'radial-gradient(#f5e5c9 1px, transparent 1px)',
              backgroundSize: '32px 32px'
            }} />
          </div>

          {/* Envelope Wrapper */}
          <div style={{ position: 'relative', width: 'clamp(290px, 85vw, 420px)', height: '260px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            
            {/* SCATTERED PHOTOS (Burst out on Click 1) */}
            <AnimatePresence>
              {step === 'popped' && (
                <>
                  {photos.map((p, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ x: 0, y: 0, scale: 0.2, rotate: 0, opacity: 0 }}
                      animate={{ 
                        x: p.x, 
                        y: p.y, 
                        scale: 1, 
                        rotate: p.rotate, 
                        opacity: 1 
                      }}
                      exit={{ 
                        opacity: 0, 
                        scale: 0.4, 
                        y: p.y - 100, 
                        transition: { duration: 0.4, delay: idx * 0.05 } 
                      }}
                      transition={{ 
                        type: 'spring', 
                        stiffness: 160, 
                        damping: 14, 
                        delay: p.delay 
                      }}
                      whileHover={{ scale: 1.12, rotate: 0, zIndex: 50, transition: { duration: 0.2 } }}
                      style={{
                        position: 'absolute',
                        top: '25%',
                        left: 'calc(50% - 60px)',
                        width: isMobile ? '110px' : '135px',
                        background: '#ffffff',
                        padding: '8px 8px 24px 8px',
                        borderRadius: '4px',
                        boxShadow: '0 12px 32px rgba(0, 0, 0, 0.4), 0 2px 6px rgba(0, 0, 0, 0.2)',
                        border: '1px solid rgba(245, 229, 201, 0.4)',
                        zIndex: 10 + idx,
                        pointerEvents: 'auto',
                      }}
                    >
                      <div style={{ width: '100%', height: isMobile ? '80px' : '100px', overflow: 'hidden', borderRadius: '2px', background: '#f5f5f5' }}>
                        <img 
                          src={p.img} 
                          alt={p.caption} 
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                        />
                      </div>
                      <p style={{ 
                        textAlign: 'center', 
                        fontFamily: 'var(--ff-serif)', 
                        fontStyle: 'italic', 
                        fontSize: isMobile ? '0.65rem' : '0.75rem', 
                        color: 'var(--taupe-dark)', 
                        marginTop: '6px',
                        fontWeight: 600
                      }}>
                        {p.caption}
                      </p>
                    </motion.div>
                  ))}
                </>
              )}
            </AnimatePresence>

            {/* FOLDED INVITATION LETTER (Emerges & Unfolds on Click 2) */}
            <AnimatePresence>
              {step === 'unfolding' && (
                <motion.div
                  initial={{ y: 50, scale: 0.85, opacity: 0 }}
                  animate={{ 
                    y: -140, 
                    scale: [0.85, 1, 2.5], 
                    opacity: [0, 1, 1],
                  }}
                  transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                  style={{
                    position: 'absolute',
                    width: '90%',
                    height: '240px',
                    background: 'linear-gradient(135deg, #fffdfa 0%, #f7f1e5 100%)',
                    border: '1px solid #d4af37',
                    borderRadius: '8px',
                    boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                    padding: '2rem',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 40,
                  }}
                >
                  <p style={{ fontFamily: 'var(--ff-sans)', fontSize: '0.6rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#8b7355', marginBottom: '0.5rem' }}>
                    The Wedding of
                  </p>
                  <h2 style={{ fontFamily: 'var(--ff-serif)', fontStyle: 'italic', fontSize: '1.8rem', color: '#4a205a' }}>
                    Rex &amp; Aira
                  </h2>
                  <div style={{ width: '40px', height: '1px', background: '#d4af37', margin: '0.8rem 0' }} />
                  <p style={{ fontFamily: 'var(--ff-sans)', fontSize: '0.65rem', letterSpacing: '0.15em', color: '#555' }}>
                    OCTOBER 17, 2026
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* THE ENVELOPE BODY */}
            <motion.div
              animate={isShaking ? {
                x: [-12, 12, -10, 10, -5, 5, 0],
                rotate: [-3, 3, -2, 2, 0],
              } : {
                y: step === 'closed' ? [0, -8, 0] : 0
              }}
              transition={isShaking ? {
                duration: 0.45,
                ease: 'easeInOut'
              } : {
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
              style={{
                position: 'relative',
                width: '100%',
                height: '240px',
                perspective: '1000px',
                zIndex: 20,
              }}
            >
              {/* Envelope Back Container */}
              <div style={{
                position: 'absolute',
                inset: 0,
                background: '#eedfcb',
                borderRadius: '8px',
                boxShadow: '0 20px 50px rgba(0, 0, 0, 0.45), 0 0 0 1px rgba(212, 175, 55, 0.3)',
                overflow: 'hidden'
              }}>
                {/* Interior Lining Texture */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.15) 0%, rgba(74, 32, 90, 0.1) 100%)',
                }} />
              </div>

              {/* Envelope Flap (Top triangle lid) */}
              <motion.div
                animate={{
                  rotateX: isFlapOpen ? 180 : 0
                }}
                transition={{
                  duration: 0.6,
                  ease: [0.16, 1, 0.3, 1]
                }}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '130px',
                  background: isFlapOpen ? '#e3d2ba' : 'linear-gradient(180deg, #f7ebd9 0%, #ecdcb8 100%)',
                  transformOrigin: 'top center',
                  clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
                  zIndex: isFlapOpen ? 5 : 30,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  borderTop: '1px solid #e2cfb3',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {/* Wax Seal (Only visible when closed) */}
                {!isFlapOpen && (
                  <div style={{
                    position: 'absolute',
                    bottom: '12px',
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle at 35% 35%, #9b2c2c 0%, #6b1d1d 70%, #4a1212 100%)',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4), inset 0 2px 4px rgba(255, 255, 255, 0.3)',
                    border: '2px solid #b83232',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#f5e5c9',
                    fontFamily: 'var(--ff-serif)',
                    fontStyle: 'italic',
                    fontSize: '1rem',
                    fontWeight: 700,
                    letterSpacing: '-0.05em'
                  }}>
                    R&amp;A
                  </div>
                )}
              </motion.div>

              {/* Envelope Front Pocket (Left, Right, Bottom triangles) */}
              <div style={{
                position: 'absolute',
                inset: 0,
                pointerEvents: 'none',
                zIndex: 25,
              }}>
                {/* Left pocket flap */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(90deg, #ebd9c3 0%, #dfccb3 100%)',
                  clipPath: 'polygon(0 0, 50% 50%, 0 100%)',
                }} />
                {/* Right pocket flap */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(-90deg, #ebd9c3 0%, #dfccb3 100%)',
                  clipPath: 'polygon(100% 0, 50% 50%, 100% 100%)',
                }} />
                {/* Bottom pocket flap */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(0deg, #f3e5d3 0%, #e5d3bc 100%)',
                  clipPath: 'polygon(0 100%, 50% 48%, 100% 100%)',
                  boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.05)',
                }} />
              </div>

              {/* Gold Ribbon Accents on Front */}
              <div style={{
                position: 'absolute',
                bottom: '15px',
                left: 0,
                right: 0,
                textAlign: 'center',
                zIndex: 28,
                pointerEvents: 'none'
              }}>
                <span style={{
                  fontFamily: 'var(--ff-sans)',
                  fontSize: '0.65rem',
                  letterSpacing: '0.3em',
                  textTransform: 'uppercase',
                  color: '#4a205a',
                  fontWeight: 700,
                  opacity: 0.85
                }}>
                  Rex &amp; Aira
                </span>
              </div>

            </motion.div>
          </div>

          {/* HINT & ACTION MESSAGES AT BOTTOM */}
          <div style={{ marginTop: '3.5rem', textAlign: 'center', zIndex: 60, padding: '0 1rem' }}>
            {step === 'closed' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}
              >
                <p style={{
                  fontFamily: 'var(--ff-serif)',
                  fontStyle: 'italic',
                  fontSize: 'clamp(1.2rem, 3.5vw, 1.6rem)',
                  color: '#f5e5c9',
                  textShadow: '0 2px 8px rgba(0,0,0,0.6)'
                }}>
                  You're Invited to Rex &amp; Aira's Wedding!
                </p>
                <motion.div
                  animate={{ scale: [1, 1.06, 1] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                  style={{
                    background: 'rgba(245, 229, 201, 0.15)',
                    border: '1px solid rgba(245, 229, 201, 0.3)',
                    borderRadius: '30px',
                    padding: '0.5rem 1.4rem',
                    color: '#f5e5c9',
                    fontFamily: 'var(--ff-sans)',
                    fontSize: '0.72rem',
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    fontWeight: 600,
                    backdropFilter: 'blur(6px)'
                  }}
                >
                  ✉️ Tap Envelope to Open 💥
                </motion.div>
              </motion.div>
            )}

            {step === 'popped' && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.6rem' }}
              >
                <p style={{
                  fontFamily: 'var(--ff-serif)',
                  fontStyle: 'italic',
                  fontSize: 'clamp(1.25rem, 3.8vw, 1.7rem)',
                  color: '#ffffff',
                  textShadow: '0 2px 10px rgba(0,0,0,0.7)',
                  fontWeight: 400
                }}>
                  Wait... there's still something inside 👀
                </p>
                <motion.div
                  animate={{ scale: [1, 1.08, 1], y: [0, -3, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                  style={{
                    background: 'linear-gradient(135deg, #4a205a 0%, #7b3891 100%)',
                    border: '1px solid rgba(245, 229, 201, 0.5)',
                    borderRadius: '30px',
                    padding: '0.6rem 1.6rem',
                    color: '#f5e5c9',
                    fontFamily: 'var(--ff-sans)',
                    fontSize: '0.75rem',
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    fontWeight: 700,
                    boxShadow: '0 6px 20px rgba(74, 32, 90, 0.6)'
                  }}
                >
                  ✨ Tap Envelope to Reveal Invitation ✨
                </motion.div>
              </motion.div>
            )}
          </div>

        </motion.div>
      )}
    </AnimatePresence>
  )
}
