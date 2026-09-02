import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'

export default function EnvelopeReveal({ onComplete }) {
  const [step, setStep] = useState('closed') // 'closed' | 'popped' | 'unfolded' | 'rolling_up' | 'completed'
  const [isShaking, setIsShaking] = useState(false)
  const [isFlapOpen, setIsFlapOpen] = useState(false)
  const [isPaperFlownOut, setIsPaperFlownOut] = useState(false)

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
    const count = 240
    const defaults = {
      origin: { y: 0.52 },
      colors: ['#4a205a', '#9b72b0', '#c2b1d8', '#f5e5c9', '#e8a5b8', '#ffd700', '#ffffff']
    }

    function fire(particleRatio, opts) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio)
      })
    }

    fire(0.25, { spread: 30, startVelocity: 60 })
    fire(0.2, { spread: 70 })
    fire(0.35, { spread: 110, decay: 0.91, scalar: 0.85 })
    fire(0.1, { spread: 130, startVelocity: 30, decay: 0.92, scalar: 1.25 })
    fire(0.1, { spread: 130, startVelocity: 50 })
  }

  const handleEnvelopeClick = (e) => {
    e.stopPropagation()

    if (step === 'closed') {
      // CLICK 1: Shake -> Birthday Popper Burst -> 360 Photos Fly Out
      setIsShaking(true)
      setTimeout(() => {
        setIsShaking(false)
        setIsFlapOpen(true)
        triggerBirthdayPopper()
        setStep('popped')
      }, 420)
    } else if (step === 'popped') {
      // CLICK 2: Photos disperse -> Paper emerges & 3D unfolds -> STAYS on screen
      setIsPaperFlownOut(true)
      setTimeout(() => {
        setStep('unfolded')
      }, 550)
    } else if (step === 'unfolded') {
      // CLICK 3: Paper rolls UPWARDS like a scroll off top of screen!
      setStep('rolling_up')

      setTimeout(() => {
        setStep('completed')
        if (onComplete) onComplete()
      }, 850)
    }
  }

  if (step === 'completed') return null

  // Photos burst out in ALL 360 DEGREES (upward, sideways, and DOWNWARD!)
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 640
  const photos = [
    {
      img: '/couple_photo.jpg',
      caption: 'Rex & Aira',
      x: isMobile ? -80 : -190,
      y: isMobile ? -145 : -210,
      rotate: -15,
      delay: 0.08,
    },
    {
      img: '/gallery_ceremony.jpg',
      caption: 'San Miguel Church',
      x: isMobile ? 80 : 190,
      y: isMobile ? -145 : -210,
      rotate: 15,
      delay: 0.14,
    },
    {
      img: '/church_exterior.jpg',
      caption: 'Holy Matrimony',
      x: 0,
      y: isMobile ? -180 : -260,
      rotate: -3,
      delay: 0.2,
    },
    {
      img: '/gallery_reception.jpg',
      caption: 'Celebration',
      x: isMobile ? -100 : -230,
      y: isMobile ? -20 : -10,
      rotate: -18,
      delay: 0.26,
    },
    {
      img: '/gallery_rings.jpg',
      caption: 'The Details',
      x: isMobile ? 100 : 230,
      y: isMobile ? -20 : -10,
      rotate: 16,
      delay: 0.32,
    },
    {
      img: '/reception_exterior.jpg',
      caption: '5A\'s Resort',
      x: isMobile ? -75 : -170,
      y: isMobile ? 115 : 170,
      rotate: -12,
      delay: 0.38,
    },
    {
      img: '/hero_bg.jpg',
      caption: 'Our Story',
      x: isMobile ? 75 : 170,
      y: isMobile ? 115 : 170,
      rotate: 14,
      delay: 0.44,
    },
  ]

  return (
    <AnimatePresence>
      {step !== 'completed' && (
        <motion.div
          key="envelope-overlay"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.6, ease: 'easeInOut' } }}
          animate={{ opacity: step === 'rolling_up' ? 0 : 1 }}
          transition={{ duration: 0.6 }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99999,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            // Matching invitation background tone
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

          {/* Main Container */}
          <div style={{ position: 'relative', width: 'clamp(290px, 85vw, 420px)', height: '260px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            
            {/* SCATTERED PHOTOS (Burst out 360 degrees on Click 1) */}
            <AnimatePresence>
              {step === 'popped' && !isPaperFlownOut && (
                <>
                  {photos.map((p, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ x: 0, y: 0, scale: 0.1, rotate: 0, opacity: 0 }}
                      animate={{ 
                        x: p.x, 
                        y: p.y, 
                        scale: 1, 
                        rotate: p.rotate, 
                        opacity: 1 
                      }}
                      exit={{ 
                        opacity: 0, 
                        scale: 0.2, 
                        y: p.y > 0 ? p.y + 150 : p.y - 150, 
                        transition: { duration: 0.3, delay: idx * 0.03 } 
                      }}
                      transition={{ 
                        type: 'spring', 
                        stiffness: 170, 
                        damping: 13, 
                        delay: p.delay 
                      }}
                      whileHover={{ scale: 1.12, rotate: 0, zIndex: 60, transition: { duration: 0.2 } }}
                      style={{
                        position: 'absolute',
                        top: '25%',
                        left: 'calc(50% - 55px)',
                        width: isMobile ? '105px' : '130px',
                        background: '#ffffff',
                        padding: '6px 6px 20px 6px',
                        borderRadius: '3px',
                        boxShadow: '0 10px 28px rgba(74, 32, 90, 0.18), 0 2px 6px rgba(0, 0, 0, 0.12)',
                        border: '1px solid rgba(194, 177, 216, 0.5)',
                        zIndex: 10 + idx,
                        pointerEvents: 'auto',
                      }}
                    >
                      <div style={{ width: '100%', height: isMobile ? '75px' : '95px', overflow: 'hidden', borderRadius: '1px', background: '#f5f5f5' }}>
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
                        fontSize: isMobile ? '0.62rem' : '0.72rem', 
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

            {/* PHYSICAL INVITATION PAPER -> ROLLS UPWARDS OFF TOP OF SCREEN */}
            <AnimatePresence>
              {(isPaperFlownOut || step === 'unfolded' || step === 'rolling_up') && (
                <motion.div
                  initial={{ y: 80, scale: 0.7, opacity: 0, rotateX: 30 }}
                  animate={step === 'rolling_up' ? {
                    y: -1250,
                    rotateX: -450,
                    scaleY: 0.25,
                    scaleX: 0.85,
                    opacity: 0,
                  } : {
                    x: 0,
                    y: isMobile ? -60 : -80,
                    scale: 1,
                    scaleX: 1,
                    scaleY: 1,
                    opacity: 1,
                    rotateX: 0,
                    rotateZ: 0,
                    rotateY: 0
                  }}
                  transition={step === 'rolling_up' ? {
                    duration: 0.8,
                    ease: [0.32, 0, 0.67, 0] // Aerodynamic roll-up curve
                  } : {
                    duration: 0.6,
                    ease: [0.16, 1, 0.3, 1]
                  }}
                  style={{
                    position: 'absolute',
                    width: 'clamp(310px, 90vw, 380px)',
                    minHeight: '340px',
                    background: 'linear-gradient(135deg, #fffdfa 0%, #f7f1e5 100%)',
                    border: '1.5px solid #d4af37',
                    borderRadius: '8px',
                    boxShadow: '0 30px 70px rgba(74, 32, 90, 0.28)',
                    padding: '2.2rem 1.8rem',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 45,
                    transformOrigin: 'top center',
                    perspective: '1000px',
                    overflow: 'hidden'
                  }}
                >
                  {/* Top Unfolding Flap Animation */}
                  {step !== 'rolling_up' && (
                    <motion.div
                      initial={{ rotateX: 0 }}
                      animate={{ rotateX: -180 }}
                      transition={{ duration: 0.5, ease: 'easeOut' }}
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '50%',
                        background: 'linear-gradient(180deg, #fdfbf7 0%, #f4eae0 100%)',
                        borderBottom: '1px solid rgba(212, 175, 55, 0.3)',
                        transformOrigin: 'top center',
                        backfaceVisibility: 'hidden',
                        zIndex: 5,
                        pointerEvents: 'none'
                      }}
                    />
                  )}

                  {/* Main Unfolded Invitation Card Content */}
                  <div style={{ textAlign: 'center', zIndex: 10, width: '100%' }}>
                    <p style={{ 
                      fontFamily: 'var(--ff-sans)', 
                      fontSize: '0.62rem', 
                      letterSpacing: '0.28em', 
                      textTransform: 'uppercase', 
                      color: 'var(--taupe)', 
                      marginBottom: '0.8rem',
                      fontWeight: 600
                    }}>
                      October 17, 2026 · San Miguel, Bulacan
                    </p>

                    <h1 style={{ 
                      fontFamily: 'var(--ff-serif)', 
                      fontStyle: 'italic', 
                      fontSize: '2.6rem', 
                      color: 'var(--text)', 
                      fontWeight: 300, 
                      lineHeight: 1.1,
                      marginBottom: '0.6rem'
                    }}>
                      Rex &amp; Aira
                    </h1>

                    <p style={{
                      fontFamily: 'var(--ff-sans)',
                      fontSize: '0.95rem',
                      fontWeight: 700,
                      color: '#4a205a',
                      letterSpacing: '0.04em',
                      margin: '0.6rem 0 1rem'
                    }}>
                      #oREXnaparapakasalansiAIRA
                    </p>

                    <div style={{ width: '40px', height: '1px', background: '#d4af37', margin: '0.8rem auto' }} />

                    <p style={{ 
                      fontFamily: 'var(--ff-sans)', 
                      fontSize: '0.6rem', 
                      letterSpacing: '0.22em', 
                      textTransform: 'uppercase', 
                      color: 'var(--taupe-dark)',
                      fontWeight: 700
                    }}>
                      Until Rex &amp; Aira Say I Do
                    </p>
                  </div>
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
                duration: 0.42,
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
                background: '#f3e5d3',
                borderRadius: '8px',
                boxShadow: '0 20px 45px rgba(74, 32, 90, 0.18), 0 0 0 1px rgba(212, 175, 55, 0.4)',
                overflow: 'hidden'
              }}>
                {/* Interior Lining Texture */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.15) 0%, rgba(74, 32, 90, 0.08) 100%)',
                }} />
              </div>

              {/* Envelope Flap (Top triangle lid) */}
              <motion.div
                animate={{
                  rotateX: isFlapOpen ? 180 : 0
                }}
                transition={{
                  duration: 0.55,
                  ease: [0.16, 1, 0.3, 1]
                }}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '130px',
                  background: isFlapOpen ? '#e6d5c1' : 'linear-gradient(180deg, #faf2e6 0%, #ebd9c3 100%)',
                  transformOrigin: 'top center',
                  clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
                  zIndex: isFlapOpen ? 5 : 30,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
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
                    bottom: '12px',
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle at 35% 35%, #4a205a 0%, #32133e 70%, #1e0927 100%)',
                    boxShadow: '0 4px 12px rgba(74, 32, 90, 0.4), inset 0 2px 4px rgba(255, 255, 255, 0.3)',
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
                  background: 'linear-gradient(90deg, #f0e0cc 0%, #e2cfb7 100%)',
                  clipPath: 'polygon(0 0, 50% 50%, 0 100%)',
                }} />
                {/* Right pocket flap */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(-90deg, #f0e0cc 0%, #e2cfb7 100%)',
                  clipPath: 'polygon(100% 0, 50% 50%, 100% 100%)',
                }} />
                {/* Bottom pocket flap */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(0deg, #f6ebd9 0%, #e8d7c0 100%)',
                  clipPath: 'polygon(0 100%, 50% 48%, 100% 100%)',
                }} />
              </div>

              {/* Gold Monogram Header on Front */}
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
          <div style={{ marginTop: '3.8rem', textAlign: 'center', zIndex: 60, padding: '0 1rem' }}>
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
                  animate={{ scale: [1, 1.06, 1] }}
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

            {step === 'popped' && !isPaperFlownOut && (
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
                  color: '#4a205a',
                  fontWeight: 500
                }}>
                  Wait... there's still something inside 👀
                </p>
                <motion.div
                  animate={{ scale: [1, 1.08, 1], y: [0, -3, 0] }}
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
                    boxShadow: '0 8px 24px rgba(74, 32, 90, 0.35)'
                  }}
                >
                  ✨ Tap Envelope to Reveal Invitation ✨
                </motion.div>
              </motion.div>
            )}

            {step === 'unfolded' && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.6rem' }}
              >
                <motion.div
                  animate={{ scale: [1, 1.08, 1], y: [0, -3, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                  style={{
                    background: 'linear-gradient(135deg, #4a205a 0%, #6c2b83 100%)',
                    border: '1px solid rgba(212, 175, 55, 0.6)',
                    borderRadius: '30px',
                    padding: '0.7rem 2rem',
                    color: '#f5e5c9',
                    fontFamily: 'var(--ff-sans)',
                    fontSize: '0.78rem',
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    fontWeight: 700,
                    boxShadow: '0 8px 24px rgba(74, 32, 90, 0.35)'
                  }}
                >
                  📜 Tap Paper to Roll Up &amp; Enter ✨
                </motion.div>
              </motion.div>
            )}
          </div>

        </motion.div>
      )}
    </AnimatePresence>
  )
}
