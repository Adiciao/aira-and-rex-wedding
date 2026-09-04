import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'

const RAW_PHOTOS = [
  { img: '/couple_photo.jpg', caption: 'Rex & Aira' },
  { img: '/gallery_ceremony.jpg', caption: 'San Miguel Church' },
  { img: '/church_exterior.jpg', caption: 'Ceremony' },
  { img: '/gallery_reception.jpg', caption: 'Celebration' },
  { img: '/gallery_rings.jpg', caption: 'The Details' },
  { img: '/reception_exterior.jpg', caption: '5A\'s Resort' },
  { img: '/hero_bg.jpg', caption: 'Our Story' },
]

function generateRandomizedPhotos() {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 640
  const count = RAW_PHOTOS.length
  const stepAngle = (Math.PI * 2) / count
  const angleOffset = Math.random() * Math.PI * 2 // Random starting rotation angle

  // Shuffle photos order randomly
  const shuffled = [...RAW_PHOTOS].sort(() => Math.random() - 0.5)

  return shuffled.map((p, idx) => {
    const baseAngle = angleOffset + idx * stepAngle + (Math.random() * 0.4 - 0.2)
    const distance = isMobile 
      ? 110 + Math.random() * 70 
      : 195 + Math.random() * 110

    const x = Math.cos(baseAngle) * distance
    const startY = Math.sin(baseAngle) * distance * 0.8
    const driftDistance = isMobile ? 80 + Math.random() * 70 : 120 + Math.random() * 110
    const endY = startY + driftDistance
    const rotate = Math.random() * 44 - 22 // -22deg to +22deg
    const delay = idx * 0.06

    return {
      ...p,
      x,
      startY,
      endY,
      rotate,
      delay
    }
  })
}

export default function EnvelopeReveal({ onComplete, onFirstClick }) {
  const [step, setStep] = useState('closed') // 'closed' | 'popped' | 'unfolded' | 'disappearing' | 'completed'
  const [isShaking, setIsShaking] = useState(false)
  const [isFlapOpen, setIsFlapOpen] = useState(false)
  const [isPaperFlownOut, setIsPaperFlownOut] = useState(false)
  const [photos, setPhotos] = useState([])

  // Disable all scrolling (touch, wheel, body scroll) while envelope mode is active
  useEffect(() => {
    if (step !== 'completed') {
      document.body.style.overflow = 'hidden'
      document.documentElement.style.overflow = 'hidden'

      const preventScroll = (e) => {
        if (e.cancelable) {
          e.preventDefault()
        }
      }

      window.addEventListener('touchmove', preventScroll, { passive: false })
      window.addEventListener('wheel', preventScroll, { passive: false })

      return () => {
        document.body.style.overflow = ''
        document.documentElement.style.overflow = ''
        window.removeEventListener('touchmove', preventScroll)
        window.removeEventListener('wheel', preventScroll)
      }
    }
  }, [step])

  const triggerBirthdayPopper = () => {
    // 💥 Birthday Party Popper Confetti Burst!
    const count = 250
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

    fire(0.25, { spread: 35, startVelocity: 60 })
    fire(0.25, { spread: 75, startVelocity: 45 })
    fire(0.35, { spread: 115, decay: 0.91, scalar: 0.9 })
    fire(0.15, { spread: 135, startVelocity: 35, decay: 0.92, scalar: 1.25 })
  }

  const handleEnvelopeClick = (e) => {
    e.stopPropagation()

    if (step === 'closed') {
      // CLICK 1: Generate fresh random positions -> Shake -> Flap Opens + Birthday Popper Confetti + Photos Burst
      if (onFirstClick) onFirstClick()  // start music on first user interaction
      const randomized = generateRandomizedPhotos()
      setPhotos(randomized)
      setIsShaking(true)

      setTimeout(() => {
        setIsShaking(false)
        setIsFlapOpen(true)
        triggerBirthdayPopper()
        setStep('popped')
      }, 350)
    } else if (step === 'popped') {
      // CLICK 2: Photos disperse -> Physical Paper emerges & 3D unfolds open -> STAYS on screen
      setIsPaperFlownOut(true)
      setTimeout(() => {
        setStep('unfolded')
      }, 500)
    } else if (step === 'unfolded') {
      // CLICK 3: Disappear immediately!
      setStep('disappearing')

      setTimeout(() => {
        setStep('completed')
        if (onComplete) onComplete()
      }, 200)
    }
  }

  if (step === 'completed') return null

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 640

  return (
    <AnimatePresence>
      {step !== 'completed' && (
        <motion.div
          key="envelope-overlay"
          initial={{ opacity: 1 }}
          animate={{ opacity: step === 'disappearing' ? 0 : 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
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
          <div style={{ position: 'relative', width: 'clamp(290px, 85vw, 420px)', height: '260px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            
            {/* DYNAMICALLY RANDOMIZED POLAROID PHOTOS (Burst out & Slowly Drift Downward) */}
            <AnimatePresence>
              {step === 'popped' && !isPaperFlownOut && (
                <>
                  {photos.map((p, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ x: 0, y: 0, scale: 0.1, rotate: 0, opacity: 0 }}
                      animate={{ 
                        x: p.x, 
                        y: [p.startY, p.endY], 
                        scale: 1, 
                        rotate: [p.rotate, p.rotate + (idx % 2 === 0 ? 5 : -5)], 
                        opacity: 1 
                      }}
                      exit={{ 
                        opacity: 0, 
                        scale: 0.2, 
                        y: p.endY + 150, 
                        transition: { duration: 0.3, delay: idx * 0.03 } 
                      }}
                      transition={{ 
                        x: { type: 'spring', stiffness: 160, damping: 14, delay: p.delay },
                        y: { duration: 8.5, ease: 'easeOut', delay: p.delay }, // Slowly drift downward!
                        rotate: { duration: 8.5, ease: 'easeInOut', delay: p.delay },
                        scale: { type: 'spring', stiffness: 160, damping: 14, delay: p.delay },
                        opacity: { duration: 0.25, delay: p.delay }
                      }}
                      whileHover={{ scale: 1.12, rotate: 0, zIndex: 200, transition: { duration: 0.2 } }}
                      style={{
                        position: 'absolute',
                        top: '25%',
                        left: 'calc(50% - 55px)',
                        width: isMobile ? '105px' : '130px',
                        background: '#ffffff',
                        padding: '6px 6px 20px 6px',
                        borderRadius: '4px',
                        boxShadow: '0 12px 32px rgba(74, 32, 90, 0.25), 0 2px 8px rgba(0, 0, 0, 0.15)',
                        border: '1px solid rgba(194, 177, 216, 0.6)',
                        zIndex: 100 + idx, // Render on top of envelope
                        pointerEvents: 'auto',
                      }}
                    >
                      <div style={{ width: '100%', height: isMobile ? '75px' : '95px', overflow: 'hidden', borderRadius: '2px', background: '#f5f5f5' }}>
                        <img 
                          src={p.img} 
                          alt={p.caption} 
                          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} 
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

            {/* PHYSICAL INVITATION PAPER -> DISAPPEARS ON CLICK 3 */}
            <AnimatePresence>
              {(isPaperFlownOut || step === 'unfolded' || step === 'disappearing') && (
                <motion.div
                  initial={{ y: 80, scale: 0.7, opacity: 0, rotateX: 30 }}
                  animate={step === 'disappearing' ? {
                    opacity: 0,
                    scale: 0.95
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
                  transition={{
                    duration: step === 'disappearing' ? 0.2 : 0.6,
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
                    zIndex: 150, // High z-index so paper unfolds on top
                    transformOrigin: 'top center',
                    perspective: '1000px',
                    overflow: 'hidden'
                  }}
                >
                  {/* Top 3D Unfolding Flap */}
                  {step !== 'disappearing' && (
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
                x: [-10, 10, -8, 8, -4, 4, 0],
                rotate: [-2, 2, -1, 1, 0],
              } : {
                y: step === 'closed' ? [0, -6, 0] : 0
              }}
              transition={isShaking ? {
                duration: 0.35,
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
              {/* Envelope Back Base */}
              <div style={{
                position: 'absolute',
                inset: 0,
                background: '#f3e8da',
                borderRadius: '8px',
                border: '1px solid #d4af37',
                boxShadow: '0 20px 45px rgba(74, 32, 90, 0.16)',
                overflow: 'hidden'
              }}>
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.15) 0%, rgba(74, 32, 90, 0.08) 100%)',
                }} />
              </div>

              {/* Envelope Flap (3D Flip Top Lid) */}
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

        </motion.div>
      )}
    </AnimatePresence>
  )
}
