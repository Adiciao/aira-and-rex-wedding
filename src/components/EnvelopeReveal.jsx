import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'

export default function EnvelopeReveal({ onComplete }) {
  const [step, setStep] = useState('closed') // 'closed' | 'popped' | 'closing' | 'completed'
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
    // 💥 Elegant Birthday Popper Confetti Shower
    const count = 180
    const defaults = {
      origin: { y: 0.55 },
      colors: ['#4a205a', '#9b72b0', '#c2b1d8', '#f5e5c9', '#e8a5b8', '#ffd700', '#ffffff']
    }

    function fire(particleRatio, opts) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio)
      })
    }

    fire(0.25, { spread: 35, startVelocity: 50 })
    fire(0.25, { spread: 75, startVelocity: 40 })
    fire(0.3, { spread: 100, decay: 0.91, scalar: 0.9 })
    fire(0.2, { spread: 120, startVelocity: 30 })
  }

  const handleEnvelopeClick = (e) => {
    e.stopPropagation()

    if (step === 'closed') {
      // CLICK 1: Flap Opens + Birthday Popper Confetti + Photos Burst Out
      setIsFlapOpen(true)
      triggerBirthdayPopper()
      setStep('popped')
    } else if (step === 'popped') {
      // CLICK 2: Silky Smooth Dissolve into the Invitation
      setStep('closing')
      setTimeout(() => {
        setStep('completed')
        if (onComplete) onComplete()
      }, 650)
    }
  }

  if (step === 'completed') return null

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 640

  // 4 Balanced Polaroid Photos (Top-Left, Top-Right, Bottom-Left, Bottom-Right)
  const photos = [
    {
      img: '/couple_photo.jpg',
      caption: 'Rex & Aira',
      x: isMobile ? -75 : -170,
      y: isMobile ? -130 : -170,
      rotate: -12,
      delay: 0.08,
    },
    {
      img: '/gallery_ceremony.jpg',
      caption: 'San Miguel Church',
      x: isMobile ? 75 : 170,
      y: isMobile ? -130 : -170,
      rotate: 12,
      delay: 0.14,
    },
    {
      img: '/gallery_reception.jpg',
      caption: 'Celebration',
      x: isMobile ? -75 : -170,
      y: isMobile ? 100 : 140,
      rotate: -10,
      delay: 0.2,
    },
    {
      img: '/gallery_rings.jpg',
      caption: 'The Details',
      x: isMobile ? 75 : 170,
      y: isMobile ? 100 : 140,
      rotate: 10,
      delay: 0.26,
    },
  ]

  return (
    <AnimatePresence>
      {step !== 'completed' && (
        <motion.div
          key="envelope-overlay"
          initial={{ opacity: 1 }}
          animate={{ opacity: step === 'closing' ? 0 : 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99999,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            // Warm cream backdrop matching invitation theme
            background: 'radial-gradient(circle at center, rgba(253, 251, 247, 0.98) 0%, rgba(244, 235, 224, 0.99) 100%)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            userSelect: 'none',
            overflow: 'hidden',
            cursor: 'pointer',
          }}
          onClick={handleEnvelopeClick}
        >
          {/* Subtle Background Pattern */}
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.12 }}>
            <div style={{
              width: '100%',
              height: '100%',
              backgroundImage: 'radial-gradient(#8b7355 1px, transparent 1px)',
              backgroundSize: '36px 36px'
            }} />
          </div>

          {/* Envelope & Photos Container */}
          <motion.div 
            animate={step === 'closing' ? { y: -30, scale: 0.96, opacity: 0 } : { y: 0, scale: 1, opacity: 1 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            style={{ position: 'relative', width: 'clamp(280px, 85vw, 400px)', height: '250px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            
            {/* ELEGANT POLAROID PHOTOS (Burst out on Click 1) */}
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
                        transition: { duration: 0.25 } 
                      }}
                      transition={{ 
                        type: 'spring', 
                        stiffness: 160, 
                        damping: 15, 
                        delay: p.delay 
                      }}
                      whileHover={{ scale: 1.08, rotate: 0, zIndex: 60, transition: { duration: 0.2 } }}
                      style={{
                        position: 'absolute',
                        top: '20%',
                        left: 'calc(50% - 55px)',
                        width: isMobile ? '105px' : '125px',
                        background: '#ffffff',
                        padding: '6px 6px 18px 6px',
                        borderRadius: '4px',
                        boxShadow: '0 12px 30px rgba(74, 32, 90, 0.15), 0 2px 6px rgba(0, 0, 0, 0.08)',
                        border: '1px solid rgba(194, 177, 216, 0.4)',
                        zIndex: 10 + idx,
                        pointerEvents: 'auto',
                      }}
                    >
                      <div style={{ width: '100%', height: isMobile ? '75px' : '90px', overflow: 'hidden', borderRadius: '2px', background: '#f8f8f8' }}>
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
                        fontSize: isMobile ? '0.62rem' : '0.7rem', 
                        color: 'var(--taupe-dark)', 
                        marginTop: '5px',
                        fontWeight: 600
                      }}>
                        {p.caption}
                      </p>
                    </motion.div>
                  ))}
                </>
              )}
            </AnimatePresence>

            {/* LUXURY ENVELOPE BODY */}
            <motion.div
              animate={{
                y: step === 'closed' ? [0, -6, 0] : 0
              }}
              transition={{
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
              {/* Envelope Back Base */}
              <div style={{
                position: 'absolute',
                inset: 0,
                background: '#f3e8da',
                borderRadius: '8px',
                border: '1px solid #d4af37',
                boxShadow: '0 20px 40px rgba(74, 32, 90, 0.14)',
                overflow: 'hidden'
              }}>
                {/* Inside Card Preview */}
                <div style={{
                  position: 'absolute',
                  inset: '12px 16px',
                  background: '#ffffff',
                  borderRadius: '4px',
                  border: '1px solid rgba(212, 175, 55, 0.4)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '1rem',
                  textAlign: 'center'
                }}>
                  <p style={{ fontFamily: 'var(--ff-sans)', fontSize: '0.55rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--taupe)', marginBottom: '0.2rem' }}>
                    Wedding Invitation
                  </p>
                  <h3 style={{ fontFamily: 'var(--ff-serif)', fontStyle: 'italic', fontSize: '1.4rem', color: '#4a205a', fontWeight: 400 }}>
                    Rex &amp; Aira
                  </h3>
                  <p style={{ fontFamily: 'var(--ff-sans)', fontSize: '0.6rem', color: 'var(--taupe-dark)', marginTop: '0.2rem', fontWeight: 600 }}>
                    October 17, 2026
                  </p>
                </div>
              </div>

              {/* Envelope Flap (3D Flip Top Lid) */}
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
                  height: '125px',
                  background: isFlapOpen ? '#e8d9c5' : 'linear-gradient(180deg, #fbf4e9 0%, #ebd9c3 100%)',
                  transformOrigin: 'top center',
                  clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
                  zIndex: isFlapOpen ? 5 : 30,
                  boxShadow: '0 4px 10px rgba(0,0,0,0.08)',
                  borderTop: '1px solid #e0ceb6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {/* Wax Seal (Only visible when closed) */}
                {!isFlapOpen && (
                  <div style={{
                    position: 'absolute',
                    bottom: '10px',
                    width: '46px',
                    height: '46px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle at 35% 35%, #4a205a 0%, #32133e 70%, #1e0927 100%)',
                    boxShadow: '0 4px 12px rgba(74, 32, 90, 0.35), inset 0 2px 4px rgba(255, 255, 255, 0.3)',
                    border: '2px solid #d4af37',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#f5e5c9',
                    fontFamily: 'var(--ff-serif)',
                    fontStyle: 'italic',
                    fontSize: '0.95rem',
                    fontWeight: 700,
                    letterSpacing: '-0.05em'
                  }}>
                    R&amp;A
                  </div>
                )}
              </motion.div>

              {/* Envelope Front Pocket Flaps */}
              <div style={{
                position: 'absolute',
                inset: 0,
                pointerEvents: 'none',
                zIndex: 25,
              }}>
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(90deg, #f0e0cc 0%, #e2cfb7 100%)',
                  clipPath: 'polygon(0 0, 50% 50%, 0 100%)',
                }} />
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(-90deg, #f0e0cc 0%, #e2cfb7 100%)',
                  clipPath: 'polygon(100% 0, 50% 50%, 100% 100%)',
                }} />
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(0deg, #f6ebd9 0%, #e8d7c0 100%)',
                  clipPath: 'polygon(0 100%, 50% 48%, 100% 100%)',
                }} />
              </div>

              {/* Monogram Footer */}
              <div style={{
                position: 'absolute',
                bottom: '14px',
                left: 0,
                right: 0,
                textAlign: 'center',
                zIndex: 28,
                pointerEvents: 'none'
              }}>
                <span style={{
                  fontFamily: 'var(--ff-sans)',
                  fontSize: '0.62rem',
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
          </motion.div>

          {/* ACTION BUTTONS & MESSAGES AT BOTTOM */}
          <div style={{ marginTop: '3.5rem', textAlign: 'center', zIndex: 60, padding: '0 1rem' }}>
            {step === 'closed' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.6rem' }}
              >
                <p style={{
                  fontFamily: 'var(--ff-serif)',
                  fontStyle: 'italic',
                  fontSize: 'clamp(1.2rem, 3.5vw, 1.6rem)',
                  color: '#4a205a',
                  fontWeight: 400
                }}>
                  You're Invited to Rex &amp; Aira's Wedding!
                </p>
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                  style={{
                    background: '#4a205a',
                    border: '1px solid rgba(212, 175, 55, 0.5)',
                    borderRadius: '30px',
                    padding: '0.6rem 1.6rem',
                    color: '#f5e5c9',
                    fontFamily: 'var(--ff-sans)',
                    fontSize: '0.72rem',
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    fontWeight: 600,
                    boxShadow: '0 4px 16px rgba(74, 32, 90, 0.25)'
                  }}
                >
                  ✉️ Tap Envelope to Open 💥
                </motion.div>
              </motion.div>
            )}

            {step === 'popped' && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.6rem' }}
              >
                <p style={{
                  fontFamily: 'var(--ff-serif)',
                  fontStyle: 'italic',
                  fontSize: 'clamp(1.25rem, 3.8vw, 1.65rem)',
                  color: '#4a205a',
                  fontWeight: 500
                }}>
                  Rex &amp; Aira's Special Celebration 🎉
                </p>
                <motion.div
                  animate={{ scale: [1, 1.06, 1], y: [0, -2, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                  style={{
                    background: 'linear-gradient(135deg, #4a205a 0%, #6c2b83 100%)',
                    border: '1px solid rgba(212, 175, 55, 0.6)',
                    borderRadius: '30px',
                    padding: '0.65rem 1.8rem',
                    color: '#f5e5c9',
                    fontFamily: 'var(--ff-sans)',
                    fontSize: '0.75rem',
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    fontWeight: 700,
                    boxShadow: '0 8px 24px rgba(74, 32, 90, 0.3)'
                  }}
                >
                  ✨ Tap Again to Enter Invitation ✨
                </motion.div>
              </motion.div>
            )}
          </div>

        </motion.div>
      )}
    </AnimatePresence>
  )
}
