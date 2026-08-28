import React, { useRef, useState, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'

const ENTOURAGE = {
  parents: {
    groom: ['Mr. Gregorio Parungao', 'Mrs. Pacita Parungao'],
    bride: ['Mr. Ferdinand Bernardo', 'Mrs. Amalia Bernardo']
  },
  principalSponsors: [
    {
      left: { name: 'Mr. Emmanuel Magtalas', initial: 'E' },
      right: { name: 'Mrs. Daisy Buenavista', initial: 'D' }
    },
    {
      left: { name: 'Mr. Conrado Sanchez', initial: 'C' },
      right: { name: 'Mrs. Marietta De Jesus', initial: 'M' }
    },
    {
      left: { name: 'Mr. Niño Sarmiento', initial: 'N' },
      right: { name: 'Mrs. Ludy Ventanilla', initial: 'L' }
    },
    {
      left: { name: 'Mr. Christian Lingad', initial: 'C' },
      right: { name: 'Mrs. Cristina Dizon', initial: 'C' }
    },
    {
      left: { name: 'Mr. Artemio Calaguas', initial: 'A' },
      right: { name: 'Mrs. Mercy Gulapa', initial: 'M' }
    },
    {
      left: { name: 'Mr. Danilo Dizon', initial: 'D' },
      right: { name: 'Mrs. Miguela Quilantang', initial: 'M' }
    },
    {
      left: { name: 'Mr. Renato Parungao', initial: 'R' },
      right: { name: 'Mrs. Corazon Arcega', initial: 'C' }
    },
    {
      left: { name: 'Mr. Alberto Mallari', initial: 'A' },
      right: { name: 'Mrs. Alma Hugo', initial: 'A' }
    },
    {
      left: { name: 'Mr. Bernardo Quintero', initial: 'B' },
      right: { name: 'Mrs. Dolores Pantaleon', initial: 'D' }
    },
    {
      left: { name: 'Mr. Homer Quilantang', initial: 'H' },
      right: { name: 'Mrs. Mary Ann Detiquez', initial: 'M' }
    },
    {
      left: { name: 'Mr. Eduardo Reyes', initial: 'E' },
      right: { name: 'Mrs. Leonor Sunga', initial: 'L' }
    },
    {
      left: { name: 'Mr. Pedrito Flores', initial: 'P' },
      right: { name: 'Mrs. Lorena Vigonte', initial: 'L' }
    }
  ],
  maidOfHonor: { name: 'Janine Cao', role: 'Maid of Honor', initial: 'J' },
  matronOfHonor: { name: 'Almira De Jesus', role: 'Matron of Honor', initial: 'A' },
  bestMen: [
    { name: 'Jonas Mellona', role: 'Best Man', initial: 'J' },
    { name: 'Angelo De Jesus', role: 'Best Man', initial: 'A' }
  ],
  groomsmen: [
    { name: 'Rod Christian Dizon', role: 'Groomsman', initial: 'R' },
    { name: 'John Patrik Cao', role: 'Groomsman', initial: 'J' },
    { name: 'Reymart Bajande', role: 'Groomsman', initial: 'R' }
  ],
  bridesmaids: [
    { name: 'Trisha Dizon', role: 'Bridesmaid', initial: 'T' },
    { name: 'Rachelle Parungao', role: 'Bridesmaid', initial: 'R' },
    { name: 'Ruscel Joy Dizon', role: 'Bridesmaid', initial: 'R' }
  ],
  secondarySponsors: {
    candle: {
      subhead: 'To light our path',
      couples: [
        {
          left: { name: 'John Paolo Balabbo', role: 'Candle Sponsor', initial: 'J' },
          right: { name: 'Shandy Shanine Del Rosario', role: 'Candle Sponsor', initial: 'S' }
        },
        {
          left: { name: 'John Bryan Javier', role: 'Candle Sponsor', initial: 'J' },
          right: { name: 'Ninna Balabbo', role: 'Candle Sponsor', initial: 'N' }
        }
      ]
    },
    veil: {
      subhead: 'To clothe us as one',
      couples: [
        {
          left: { name: 'Adrian Bernardo', role: 'Veil Sponsor', initial: 'A' },
          right: { name: 'Rhaine Danielle Caling', role: 'Veil Sponsor', initial: 'R' }
        },
        {
          left: { name: 'John Louie Dizon', role: 'Veil Sponsor', initial: 'J' },
          right: { name: 'Jilian Leigh Linao', role: 'Veil Sponsor', initial: 'J' }
        }
      ]
    },
    cord: {
      subhead: 'To bind us together',
      couples: [
        {
          left: { name: 'Aldrich Salas', role: 'Cord Sponsor', initial: 'A' },
          right: { name: 'Robinett Caling', role: 'Cord Sponsor', initial: 'R' }
        },
        {
          left: { name: 'Bryan Quintero', role: 'Cord Sponsor', initial: 'B' },
          right: { name: 'Elaine Quintero', role: 'Cord Sponsor', initial: 'E' }
        }
      ]
    }
  }
}

// Play synthetic wedding arpeggio notes (Pachelbel's Canon in D major scale arpeggios)
const playWeddingNote = (index) => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    
    if (!window.weddingAudioCtx) {
      window.weddingAudioCtx = new AudioContext();
    }
    const ctx = window.weddingAudioCtx;
    
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const notes = [
      293.66, // D4
      329.63, // E4
      369.99, // F#4
      440.00, // A4
      493.88, // B4
      587.33, // D5
      659.25, // E5
      739.99, // F#5
      880.00, // A5
      987.77, // B5
      1174.66 // D6
    ];

    const freq = notes[index % notes.length];
    
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    
    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 0.03); 
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8); 
    
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1200, ctx.currentTime);
    
    osc.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.8);
  } catch (e) {
    console.warn("Audio Context playback blocked:", e);
  }
}

// Background Floating Bokeh Confetti component
function FloatingConfetti() {
  const particles = [
    { left: '5%', size: 8, delay: 0, duration: 25, bg: 'rgba(162, 137, 185, 0.6)' },
    { left: '15%', size: 12, delay: 3, duration: 30, bg: 'rgba(201, 169, 110, 0.5)' },
    { left: '25%', size: 6, delay: 8, duration: 22, bg: 'rgba(162, 137, 185, 0.65)' },
    { left: '38%', size: 10, delay: 1, duration: 28, bg: 'rgba(255, 255, 255, 0.95)' },
    { left: '48%', size: 14, delay: 12, duration: 32, bg: 'rgba(201, 169, 110, 0.45)' },
    { left: '58%', size: 8, delay: 5, duration: 26, bg: 'rgba(162, 137, 185, 0.6)' },
    { left: '68%', size: 11, delay: 9, duration: 29, bg: 'rgba(255, 255, 255, 0.85)' },
    { left: '78%', size: 6, delay: 2, duration: 24, bg: 'rgba(201, 169, 110, 0.55)' },
    { left: '88%', size: 13, delay: 7, duration: 31, bg: 'rgba(162, 137, 185, 0.55)' },
    { left: '95%', size: 9, delay: 14, duration: 27, bg: 'rgba(255, 255, 255, 0.9)' },
    { left: '10%', size: 7, delay: 11, duration: 23, bg: 'rgba(201, 169, 110, 0.45)' },
    { left: '30%', size: 12, delay: 6, duration: 34, bg: 'rgba(162, 137, 185, 0.62)' },
    { left: '60%', size: 8, delay: 15, duration: 21, bg: 'rgba(255, 255, 255, 0.95)' },
    { left: '72%', size: 10, delay: 4, duration: 27, bg: 'rgba(201, 169, 110, 0.5)' },
    { left: '84%', size: 13, delay: 10, duration: 33, bg: 'rgba(162, 137, 185, 0.55)' }
  ];

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 1 }}>
      {particles.map((p, idx) => (
        <motion.div
          key={idx}
          initial={{ top: '105%', left: p.left, opacity: 0 }}
          animate={{
            top: '-5%',
            left: [p.left, `calc(${p.left} + 35px)`, `calc(${p.left} - 35px)`, p.left],
            opacity: [0, 0.8, 0.8, 0]
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: 'linear'
          }}
          style={{
            position: 'absolute',
            width: p.size,
            height: p.size,
            borderRadius: '50%',
            background: p.bg,
            filter: 'blur(1px)',
            boxShadow: p.bg.includes('201, 169, 110') ? '0 0 10px rgba(201, 169, 110, 0.6)' : 'none'
          }}
        />
      ))}
    </div>
  )
}

export default function Entourage() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  // Pre-initialize audio context on first scroll interaction to prevent browser blocking
  useEffect(() => {
    const handleGesture = () => {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext && !window.weddingAudioCtx) {
        window.weddingAudioCtx = new AudioContext();
      }
    };
    window.addEventListener('scroll', handleGesture, { once: true });
    window.addEventListener('click', handleGesture, { once: true });
    return () => {
      window.removeEventListener('scroll', handleGesture);
      window.removeEventListener('click', handleGesture);
    };
  }, []);

  return (
    <section id="entourage" ref={ref} style={{
      padding: 'clamp(4rem, 8vw, 8rem) clamp(1rem, 3vw, 2rem)',
      background: 'var(--cream-light)',
      overflow: 'hidden',
      position: 'relative'
    }}>
      {/* Background Floating Bokeh Confetti */}
      <FloatingConfetti />

      <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative', zIndex: 2 }}>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          style={{
            textAlign: 'center',
            fontFamily: 'var(--ff-sans)',
            fontSize: '0.62rem',
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
            color: 'var(--taupe)',
            marginBottom: '0.8rem',
            position: 'relative',
            zIndex: 1
          }}
        >
          Our Beloved
        </motion.p>
        
        <motion.h2
          initial={{ opacity: 0, y: 25 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          style={{
            textAlign: 'center',
            fontFamily: 'var(--ff-serif)',
            fontSize: 'clamp(2.5rem, 5vw, 4.2rem)',
            fontWeight: 300,
            color: 'var(--text)',
            marginBottom: '0.5rem',
            position: 'relative',
            zIndex: 1
          }}
        >
          Wedding <span style={{ color: 'var(--taupe)', fontStyle: 'italic' }}>Party</span>
        </motion.h2>

        {/* Decorative calligraphic loops in elegant gold */}
        <svg width="120" height="24" viewBox="0 0 120 24" style={{ display: 'block', margin: '0 auto 3.5rem auto', opacity: 0.8, position: 'relative', zIndex: 1 }}>
          <path d="M 10 12 C 40 12, 50 2, 60 12 C 70 22, 80 12, 110 12" fill="none" stroke="#c9a96e" strokeWidth="1" />
          <path d="M 40 12 C 45 22, 55 22, 60 12 C 65 2, 75 2, 80 12" fill="none" stroke="#c9a96e" strokeWidth="1" />
        </svg>

        {/* Parents Section - Box Container */}
        <div style={{ 
          border: '1px solid rgba(194, 177, 216, 0.45)', 
          borderRadius: '16px', 
          padding: '2.5rem clamp(1rem, 3vw, 2rem) clamp(1.5rem, 3vw, 2.5rem) clamp(1rem, 3vw, 2rem)', 
          background: 'rgba(255,255,255,0.12)', 
          position: 'relative', 
          marginTop: '2rem',
          marginBottom: '3.5rem',
          zIndex: 1
        }}>
          {/* Arched Top Header Frame */}
          <div style={{ 
            position: 'absolute', 
            top: '-18px', 
            left: '50%', 
            transform: 'translateX(-50%)', 
            background: 'var(--cream-light)', 
            padding: '0 1.2rem', 
            fontFamily: 'var(--ff-serif)', 
            fontStyle: 'italic', 
            fontSize: '1.35rem', 
            color: 'var(--taupe-dark)',
            whiteSpace: 'nowrap'
          }}>
            Beloved Parents
          </div>

          <div className="parents-desktop-grid" style={{ 
            maxWidth: '820px', 
            margin: '0 auto'
          }}>
            <div>
              <h3 style={{ fontFamily: 'var(--ff-serif)', textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '1.25rem', color: 'var(--taupe)', marginBottom: '0.6rem', fontWeight: 500 }}>Parents of the Groom</h3>
              {ENTOURAGE.parents.groom.map((name, idx) => (
                <ParentName key={name} name={name} index={idx} />
              ))}
            </div>
            <div>
              <h3 style={{ fontFamily: 'var(--ff-serif)', textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '1.25rem', color: 'var(--taupe)', marginBottom: '0.6rem', fontWeight: 500 }}>Parents of the Bride</h3>
              {ENTOURAGE.parents.bride.map((name, idx) => (
                <ParentName key={name} name={name} index={idx + 2} />
              ))}
            </div>
          </div>
        </div>

        {/* Principal Sponsors Section - Box Container */}
        <div style={{ 
          border: '1px solid rgba(194, 177, 216, 0.45)', 
          borderRadius: '16px', 
          padding: '2.5rem clamp(1rem, 3vw, 2rem) 3.5rem clamp(1rem, 3vw, 2rem)', 
          background: 'rgba(255,255,255,0.12)', 
          position: 'relative', 
          marginBottom: '3.5rem',
          zIndex: 1
        }}>
          {/* Arched Top Header Frame */}
          <div style={{ 
            position: 'absolute', 
            top: '-18px', 
            left: '50%', 
            transform: 'translateX(-50%)', 
            background: 'var(--cream-light)', 
            padding: '0 1.2rem', 
            fontFamily: 'var(--ff-serif)', 
            fontStyle: 'italic', 
            fontSize: '1.35rem', 
            color: 'var(--taupe-dark)',
            whiteSpace: 'nowrap'
          }}>
            Principal Sponsors
          </div>

          <p style={{ 
            textAlign: 'center',
            fontFamily: 'var(--ff-serif)', 
            fontStyle: 'italic', 
            fontSize: '0.95rem', 
            color: 'var(--text-soft)', 
            marginBottom: '2.8rem' 
          }}>To stand as principal witnesses in our exchange of vows</p>
          
          <div className="sponsors-desktop-grid" style={{ 
            maxWidth: '820px',
            margin: '0 auto',
            padding: '0 1rem'
          }}>
            {ENTOURAGE.principalSponsors.map((pair, idx) => (
              <SponsorCouple key={idx} pair={pair} index={idx} />
            ))}
          </div>
        </div>

        {/* Honor Section ("To assist us in our needs") - Box Container */}
        <div style={{ 
          border: '1px solid rgba(194, 177, 216, 0.45)', 
          borderRadius: '16px', 
          padding: '2.5rem clamp(1rem, 3vw, 2rem) 3.5rem clamp(1rem, 3vw, 2rem)', 
          background: 'rgba(255,255,255,0.12)', 
          position: 'relative', 
          marginBottom: '3.5rem',
          zIndex: 1
        }}>
          {/* Arched Top Header Frame */}
          <div style={{ 
            position: 'absolute', 
            top: '-18px', 
            left: '50%', 
            transform: 'translateX(-50%)', 
            background: 'var(--cream-light)', 
            padding: '0 1.2rem', 
            fontFamily: 'var(--ff-serif)', 
            fontStyle: 'italic', 
            fontSize: '1.35rem', 
            color: 'var(--taupe-dark)',
            whiteSpace: 'nowrap'
          }}>
            To assist us in our needs
          </div>

          {/* Best Men Centered Row */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '2.5rem' }}>
            <h3 style={{ fontFamily: 'var(--ff-serif)', textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '1.25rem', color: 'var(--taupe)', marginBottom: '0.8rem', fontWeight: 500 }}>Best Men</h3>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center', maxWidth: '640px', width: '100%' }}>
              {ENTOURAGE.bestMen.map((p, idx) => (
                <PersonCard key={p.name} person={p} index={idx + 28} inView={inView} delay={0.3} />
              ))}
            </div>
          </div>

          {/* Maid of Honor & Matron of Honor Row */}
          <div className="parents-desktop-grid" style={{ maxWidth: '820px', margin: '0 auto' }}>
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontFamily: 'var(--ff-serif)', textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '1.25rem', color: 'var(--taupe)', marginBottom: '0.8rem', fontWeight: 500 }}>Maid of Honor</h3>
              <PersonCard person={ENTOURAGE.maidOfHonor} index={30} inView={inView} delay={0.4} />
            </div>
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontFamily: 'var(--ff-serif)', textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '1.25rem', color: 'var(--taupe)', marginBottom: '0.8rem', fontWeight: 500 }}>Matron of Honor</h3>
              <PersonCard person={ENTOURAGE.matronOfHonor} index={31} inView={inView} delay={0.5} />
            </div>
          </div>
        </div>

        {/* Groomsmen & Bridesmaids section - Box Container */}
        <div style={{ 
          border: '1px solid rgba(194, 177, 216, 0.45)', 
          borderRadius: '16px', 
          padding: '2.5rem clamp(1rem, 3vw, 2rem) 3.5rem clamp(1rem, 3vw, 2rem)', 
          background: 'rgba(255,255,255,0.12)', 
          position: 'relative', 
          marginBottom: '3.5rem',
          zIndex: 1
        }}>
          {/* Arched Top Header Frame */}
          <div style={{ 
            position: 'absolute', 
            top: '-18px', 
            left: '50%', 
            transform: 'translateX(-50%)', 
            background: 'var(--cream-light)', 
            padding: '0 1.2rem', 
            fontFamily: 'var(--ff-serif)', 
            fontStyle: 'italic', 
            fontSize: '1.35rem', 
            color: 'var(--taupe-dark)',
            whiteSpace: 'nowrap'
          }}>
            Wedding Attendants
          </div>

          <div className="entourage-grid" style={{
            display: 'grid',
            gridTemplateColumns: '1fr auto 1fr',
            gap: '2.5rem',
            alignItems: 'start'
          }}>
            {/* Groomsmen / Left Column */}
            <div>
              <h3 style={{
                fontFamily: 'var(--ff-serif)',
                fontStyle: 'italic',
                fontSize: '1.4rem',
                fontWeight: 400,
                color: 'var(--taupe)',
                textAlign: 'center',
                marginBottom: '1.2rem',
              }}>
                Groomsmen
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                {ENTOURAGE.groomsmen.map((p, i) => (
                  <PersonCard key={p.name} person={p} index={i + 32} inView={inView} delay={0.4} />
                ))}
              </div>
            </div>

            {/* Center Monogram Branch Divider with Gold Accents */}
            <div className="entourage-monogram" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', minHeight: '300px' }}>
              {/* Upper vine */}
              <div style={{ flex: 1, backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='150' viewBox='0 0 60 150'%3E%3Cpath d='M 30 150 C 20 120, 20 120, 30 90 C 40 60, 40 60, 30 30 C 20 0, 20 0, 30 -30' fill='none' stroke='%23c2b1d8' stroke-width='1.5'/%3E%3Cpath d='M 27 100 C 18 95, 15 85, 22 85 C 27 85, 30 95, 27 100 Z' fill='%23c2b1d8'/%3E%3Cpath d='M 33 50 C 42 45, 45 35, 38 35 C 33 35, 30 45, 33 50 Z' fill='%23c2b1d8'/%3E%3Cpath d='M 22 115 Q 12 120 18 128' fill='none' stroke='%23c2b1d8' stroke-width='1'/%3E%3Cpath d='M 38 65 Q 48 70 42 78' fill='none' stroke='%23c2b1d8' stroke-width='1'/%3E%3C/svg%3E")`, backgroundRepeat: 'repeat-y', width: 40, opacity: 0.7 }} />
              
              {/* R&A Monogram Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.6 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.4, duration: 0.8, ease: [0.34, 1.56, 0.64, 1] }}
                style={{ margin: '1rem 0', position: 'relative', width: 80, height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2 }}
              >
                <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 80 80">
                  <circle cx="40" cy="40" r="38" fill="none" stroke="#c9a96e" strokeWidth="0.8" strokeDasharray="3,3" opacity="0.6" />
                  <circle cx="40" cy="40" r="34" fill="none" stroke="#c9a96e" strokeWidth="1.2" />
                  <path d="M 18 40 C 16 30, 24 20, 35 17" fill="none" stroke="#c9a96e" strokeWidth="1" />
                  <path d="M 62 40 C 64 30, 56 20, 45 17" fill="none" stroke="#c9a96e" strokeWidth="1" />
                  <path d="M 18 40 C 16 50, 24 60, 35 63" fill="none" stroke="#c9a96e" strokeWidth="1" />
                  <path d="M 62 40 C 64 50, 56 60, 45 63" fill="none" stroke="#c9a96e" strokeWidth="1" />
                </svg>
                <span style={{ fontFamily: 'var(--ff-serif)', fontStyle: 'italic', fontSize: '1.45rem', fontWeight: 300, color: '#a38144' }}>R&A</span>
              </motion.div>

              {/* Lower vine */}
              <div style={{ flex: 1, backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='150' viewBox='0 0 60 150'%3E%3Cpath d='M 30 0 C 20 30, 20 30, 30 60 C 40 90, 40 90, 30 120 C 20 150, 20 150, 30 180' fill='none' stroke='%23c2b1d8' stroke-width='1.5'/%3E%3Cpath d='M 27 40 C 18 35, 15 25, 22 25 C 27 25, 30 35, 27 40 Z' fill='%23c2b1d8'/%3E%3Cpath d='M 33 100 C 42 95, 45 85, 38 85 C 33 85, 30 95, 33 100 Z' fill='%23c2b1d8'/%3E%3Cpath d='M 22 55 Q 12 60 18 68' fill='none' stroke='%23c2b1d8' stroke-width='1'/%3E%3Cpath d='M 38 115 Q 48 120 42 128' fill='none' stroke='%23c2b1d8' stroke-width='1'/%3E%3C/svg%3E")`, backgroundRepeat: 'repeat-y', width: 40, opacity: 0.7 }} />
            </div>

            {/* Bridesmaids / Right Column */}
            <div>
              <h3 style={{
                fontFamily: 'var(--ff-serif)',
                fontStyle: 'italic',
                fontSize: '1.4rem',
                fontWeight: 400,
                color: 'var(--taupe)',
                textAlign: 'center',
                marginBottom: '1.2rem',
              }}>
                Bridesmaids
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                {ENTOURAGE.bridesmaids.map((p, i) => (
                  <PersonCard key={p.name} person={p} index={i + 35} inView={inView} delay={0.5} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Secondary Sponsors section - Box Container */}
        <div style={{ 
          border: '1px solid rgba(194, 177, 216, 0.45)', 
          borderRadius: '16px', 
          padding: '2.5rem clamp(1rem, 3vw, 2rem) clamp(1.2rem, 3vw, 2rem) clamp(1rem, 3vw, 2rem)', 
          background: 'rgba(255,255,255,0.12)', 
          position: 'relative', 
          marginBottom: '3.5rem',
          zIndex: 1
        }}>
          {/* Arched Top Header Frame */}
          <div style={{ 
            position: 'absolute', 
            top: '-18px', 
            left: '50%', 
            transform: 'translateX(-50%)', 
            background: 'var(--cream-light)', 
            padding: '0 1.2rem', 
            fontFamily: 'var(--ff-serif)', 
            fontStyle: 'italic', 
            fontSize: '1.35rem', 
            color: 'var(--taupe-dark)',
            whiteSpace: 'nowrap'
          }}>
            Secondary Sponsors
          </div>
          
          {/* Map through each category: Candle, Veil, Cord */}
          {Object.entries(ENTOURAGE.secondarySponsors).map(([key, category], catIdx) => (
            <div key={key} style={{ marginBottom: catIdx < 2 ? '3.5rem' : 0 }}>
              <p style={{ 
                textAlign: 'center',
                fontFamily: 'var(--ff-serif)', 
                fontStyle: 'italic', 
                fontSize: '1.1rem', 
                color: 'var(--text-soft)', 
                marginBottom: '1.8rem' 
              }}>{category.subhead}</p>

              <div className="secondary-sponsors-grid" style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr 1fr', 
                gap: '2rem',
                maxWidth: '720px',
                margin: '0 auto'
              }}>
                {category.couples.map((couple, cIdx) => (
                  <div key={cIdx} style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', alignItems: 'center', width: '100%' }}>
                    <PersonCard person={couple.left} index={catIdx * 4 + cIdx * 2 + 38} inView={inView} delay={0.4} />
                    <PersonCard person={couple.right} index={catIdx * 4 + cIdx * 2 + 39} inView={inView} delay={0.5} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bearers & Flower Girls Section - Box Container */}
        <div style={{ 
          border: '1px solid rgba(194, 177, 216, 0.45)', 
          borderRadius: '16px', 
          padding: '2.5rem clamp(1rem, 3vw, 2rem) 3.5rem clamp(1rem, 3vw, 2rem)', 
          background: 'rgba(255,255,255,0.12)', 
          position: 'relative', 
          zIndex: 1 
        }}>
          {/* Arched Top Header Frame */}
          <div style={{ 
            position: 'absolute', 
            top: '-18px', 
            left: '50%', 
            transform: 'translateX(-50%)', 
            background: 'var(--cream-light)', 
            padding: '0 1.2rem', 
            fontFamily: 'var(--ff-serif)', 
            fontStyle: 'italic', 
            fontSize: '1.35rem', 
            color: 'var(--taupe-dark)',
            whiteSpace: 'nowrap'
          }}>
            To carry our symbol of Love, Treasure and Faith
          </div>

          {/* Bearers Section Header */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <p style={{
              fontFamily: 'var(--ff-serif)',
              fontStyle: 'italic',
              fontSize: '1.4rem',
              color: 'var(--taupe)',
              letterSpacing: '0.03em',
            }}>Bearers</p>
          </div>

          {/* Bearers Grid */}
          <div className="bearers-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '2rem',
            marginBottom: '4rem',
          }}>
            {[
              { title: 'Ring Bearer', name: 'Ram Chester Caling', initial: 'R' },
              { title: 'Bible Bearer', name: 'King Santiago', initial: 'K' },
              { title: 'Coin Bearer', name: 'Paulo Gyle Ponco', initial: 'P' }
            ].map((bearer, idx) => (
              <BearerCard key={bearer.title} bearer={bearer} index={idx + 50} inView={inView} />
            ))}
          </div>

          {/* Flower Girls Section */}
          <div style={{ textAlign: 'center' }}>
            <p style={{
              fontFamily: 'var(--ff-serif)',
              fontStyle: 'italic',
              fontSize: '1.4rem',
              color: 'var(--taupe)',
              marginBottom: '2rem',
              letterSpacing: '0.03em',
            }}>Flower Girls</p>
            <div className="flower-girls-grid" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '2rem',
              paddingBottom: '1.5rem'
            }}>
              {[
                { name: 'Celine Iris Meriballes', initial: 'C' },
                { name: 'Ashrielle Kaye Dizon', initial: 'A' },
                { name: 'Ayesha Jay Dizon', initial: 'A' }
              ].map((girl, idx) => (
                <BearerCard key={girl.name} bearer={{ title: 'Flower Girl', name: girl.name, initial: girl.initial }} index={idx + 53} inView={inView} />
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        /* Desktop parents & honor grids: side-by-side columns */
        .parents-desktop-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem 4rem;
          text-align: center;
        }

        /* Desktop sponsors grid layout: two clean text columns */
        .sponsors-desktop-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.8rem 4rem;
          text-align: left;
        }

        .sponsor-couple-container {
          display: contents;
        }

        .sponsor-couple-card {
          display: contents;
        }

        /* Desktop column text alignments */
        .sponsor-male {
          text-align: right;
        }

        .sponsor-female {
          text-align: left;
        }

        @media (max-width: 700px) {
          .entourage-grid {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
          }
          .entourage-monogram {
            display: none !important;
          }
        }

        @media (max-width: 850px) {
          /* Mobile parents & honor layout stacks vertically */
          .parents-desktop-grid {
            grid-template-columns: 1fr !important;
            gap: 2.5rem !important;
          }

          .bearers-grid,
          .flower-girls-grid {
            grid-template-columns: 1fr !important;
            gap: 1.5rem !important;
            max-width: 320px;
            margin: 0 auto 3rem !important;
          }
          .flower-girls-grid {
            margin-bottom: 0 !important;
          }

          /* Mobile grid layout: single column of cards */
          .sponsors-desktop-grid {
            grid-template-columns: 1fr !important;
            gap: 1rem !important;
            max-width: 320px !important;
            margin: 0 auto !important;
          }

          .sponsor-couple-container {
            display: block !important;
          }

          .sponsor-couple-card {
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            gap: 0.4rem !important;
            padding: 1rem !important;
            background: rgba(224, 215, 237, 0.45) !important;
            border: 1px solid rgba(162, 137, 185, 0.55) !important;
            border-radius: 10px !important;
            position: relative !important;
            transition: all 0.3s ease !important;
            box-shadow: none !important;
          }

          .sponsor-couple-card:hover {
            transform: translateY(-2px) !important;
            box-shadow: 0 6px 18px rgba(100, 78, 136, 0.08) !important;
            border-color: rgba(162, 137, 185, 0.9) !important;
          }

          /* Golden inner border outline for sponsor cards on mobile only */
          .sponsor-couple-card::after {
            content: '';
            position: absolute;
            inset: 3px;
            border: 1px solid rgba(201, 169, 110, 0.25);
            border-radius: 7px;
            pointerEvents: none;
          }

          .sponsor-male,
          .sponsor-female {
            text-align: center !important;
            width: 100% !important;
          }

          /* Mobile secondary sponsors grid layout stacks */
          .secondary-sponsors-grid {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
            max-width: 320px !important;
            margin: 0 auto !important;
          }
        }
      `}</style>
    </section>
  )
}

function ParentName({ name, index }) {
  const [hovered, setHovered] = useState(false)
  return (
    <motion.p
      onMouseEnter={() => {
        setHovered(true)
        playWeddingNote(index)
      }}
      onMouseLeave={() => setHovered(false)}
      style={{
        fontFamily: 'var(--ff-serif)',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        fontSize: '0.98rem',
        color: hovered ? '#c9a96e' : 'var(--text)',
        margin: '0.35rem 0',
        transition: 'color 0.25s ease',
        cursor: 'default'
      }}
    >
      {name}
    </motion.p>
  )
}

function SponsorCouple({ pair, index }) {
  const [hoveredMale, setHoveredMale] = useState(false)
  const [hoveredFemale, setHoveredFemale] = useState(false)
  
  return (
    <div className="sponsor-couple-container">
      <div className="sponsor-couple-card">
        <motion.div 
          className="sponsor-male"
          onMouseEnter={() => {
            setHoveredMale(true)
            playWeddingNote(index * 2 + 4)
          }}
          onMouseLeave={() => setHoveredMale(false)}
          style={{
            fontFamily: 'var(--ff-serif)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            fontSize: '0.95rem',
            color: hoveredMale ? '#c9a96e' : 'var(--text)',
            transition: 'color 0.25s ease',
            cursor: 'default'
          }}
        >
          {pair.left.name}
        </motion.div>
        
        <motion.div 
          className="sponsor-female"
          onMouseEnter={() => {
            setHoveredFemale(true)
            playWeddingNote(index * 2 + 5)
          }}
          onMouseLeave={() => setHoveredFemale(false)}
          style={{
            fontFamily: 'var(--ff-serif)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            fontSize: '0.95rem',
            color: hoveredFemale ? '#c9a96e' : 'var(--text)',
            transition: 'color 0.25s ease',
            cursor: 'default'
          }}
        >
          {pair.right.name}
        </motion.div>
      </div>
    </div>
  )
}

function PersonCard({ person, index, inView, delay }) {
  const [hovered, setHovered] = useState(false)

  // Trigger wedding note chime arpeggio on staggered scroll entrance animation
  useEffect(() => {
    if (inView) {
      const timer = setTimeout(() => {
        if (window.weddingAudioCtx && window.weddingAudioCtx.state === 'running') {
          playWeddingNote(index)
        }
      }, (delay + (index % 12) * 0.08) * 1000)
      return () => clearTimeout(timer)
    }
  }, [inView])

  const handleMouseEnter = () => {
    setHovered(true)
    playWeddingNote(index)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 35, rotateX: -15, scale: 0.95 }}
      animate={inView ? { opacity: 1, y: 0, rotateX: 0, scale: 1 } : {}}
      whileHover={{ scale: 1.02, y: -4, rotateX: 6, zIndex: 5 }}
      transition={{ 
        type: 'spring', 
        stiffness: 110, 
        damping: 14, 
        delay: delay + (index % 12) * 0.08 
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1.2rem',
        padding: '0.8rem 1.4rem',
        background: 'rgba(224, 215, 237, 0.45)', 
        border: `1px solid ${hovered ? 'rgba(162, 137, 185, 0.9)' : 'rgba(162, 137, 185, 0.55)'}`, 
        borderRadius: '10px',
        position: 'relative',
        transformOrigin: 'bottom center',
        perspective: 1000,
        boxShadow: hovered ? '0 8px 24px rgba(100, 78, 136, 0.12)' : 'none',
        width: '100%',
        maxWidth: '320px',
        margin: '0 auto'
      }}
    >
      {/* Inner double border outline in gold */}
      <div style={{
        position: 'absolute',
        inset: '3px',
        border: '1px solid rgba(201, 169, 110, 0.25)',
        borderRadius: '7px',
        pointerEvents: 'none'
      }} />

      {/* Circle Initial Badge with Ornamental Rings in Gold */}
      <div style={{ position: 'relative', width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 44 44">
          <circle cx="22" cy="22" r="19" fill="none" stroke="#c9a96e" strokeWidth="0.8" strokeDasharray="2,2" />
          <circle cx="22" cy="22" r="16" fill="none" stroke="#c9a96e" strokeWidth="1.2" />
          <path d="M 10 22 C 9 17, 13 13, 18 11" fill="none" stroke="#c9a96e" strokeWidth="0.8" />
          <path d="M 34 22 C 35 17, 31 13, 26 11" fill="none" stroke="#c9a96e" strokeWidth="0.8" />
        </svg>
        <span style={{ fontFamily: 'var(--ff-serif)', fontStyle: 'italic', fontSize: '1.15rem', color: '#a38144', position: 'relative', zIndex: 1, top: '-1px' }}>{person.initial}</span>
      </div>

      {/* Name and Role text */}
      <div style={{ textAlign: 'left', position: 'relative', zIndex: 1 }}>
        <p style={{ fontFamily: 'var(--ff-sans)', fontWeight: 500, fontSize: '0.88rem', color: 'var(--text)', marginBottom: '0.15rem' }}>{person.name}</p>
        <p style={{ fontFamily: 'var(--ff-sans)', fontSize: '0.72rem', color: 'var(--text-soft)', letterSpacing: '0.04em' }}>{person.role}</p>
      </div>
    </motion.div>
  )
}

function BearerCard({ bearer, index, inView }) {
  const [hovered, setHovered] = useState(false)

  // Trigger wedding note chime arpeggio on staggered scroll entrance animation
  useEffect(() => {
    if (inView) {
      const timer = setTimeout(() => {
        if (window.weddingAudioCtx && window.weddingAudioCtx.state === 'running') {
          playWeddingNote(index)
        }
      }, (0.2 + (index % 12) * 0.08) * 1000)
      return () => clearTimeout(timer)
    }
  }, [inView])

  const handleMouseEnter = () => {
    setHovered(true)
    playWeddingNote(index)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 35, rotateX: -15, scale: 0.95 }}
      animate={inView ? { opacity: 1, y: 0, rotateX: 0, scale: 1 } : {}}
      whileHover={{ scale: 1.02, y: -4, rotateX: 6, zIndex: 5 }}
      transition={{ 
        type: 'spring', 
        stiffness: 110, 
        damping: 14, 
        delay: 0.2 + (index % 12) * 0.08 
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1.2rem',
        padding: '1rem 1.4rem',
        background: 'rgba(224, 215, 237, 0.45)',
        border: `1px solid ${hovered ? 'rgba(162, 137, 185, 0.9)' : 'rgba(162, 137, 185, 0.55)'}`,
        borderRadius: '10px',
        position: 'relative',
        transformOrigin: 'bottom center',
        perspective: 1000,
        boxShadow: hovered ? '0 8px 24px rgba(100, 78, 136, 0.12)' : 'none',
        width: '100%',
        maxWidth: '320px',
        margin: '0 auto'
      }}
    >
      {/* Inner double border outline in gold */}
      <div style={{
        position: 'absolute',
        inset: '3px',
        border: '1px solid rgba(201, 169, 110, 0.25)',
        borderRadius: '7px',
        pointerEvents: 'none'
      }} />

      {/* Top Gold Foliage Deco Border */}
      <div style={{ position: 'absolute', top: '3px', left: '10px', right: '10px', height: '6px', backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='6' viewBox='0 0 60 6'%3E%3Cpath d='M 0 3 Q 15 1, 30 3 Q 45 5, 60 3' fill='none' stroke='%23c9a96e' stroke-width='0.8'/%3E%3Ccircle cx='15' cy='2.5' r='1.5' fill='%23c9a96e'/%3E%3Ccircle cx='45' cy='3.5' r='1.5' fill='%23c9a96e'/%3E%3C/svg%3E")`, backgroundRepeat: 'repeat-x', opacity: 0.8 }} />

      {/* Circle Initial Badge with Ornamental Rings in Gold */}
      <div style={{ position: 'relative', width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 44 44">
          <circle cx="22" cy="22" r="19" fill="none" stroke="#c9a96e" strokeWidth="0.8" strokeDasharray="2,2" />
          <circle cx="22" cy="22" r="16" fill="none" stroke="#c9a96e" strokeWidth="1.2" />
          <path d="M 10 22 C 9 17, 13 13, 18 11" fill="none" stroke="#c9a96e" strokeWidth="0.8" />
          <path d="M 34 22 C 35 17, 31 13, 26 11" fill="none" stroke="#c9a96e" strokeWidth="0.8" />
        </svg>
        <span style={{ fontFamily: 'var(--ff-serif)', fontStyle: 'italic', fontSize: '1.15rem', color: '#a38144', position: 'relative', zIndex: 1, top: '-1px' }}>{bearer.initial}</span>
      </div>

      {/* Name and Role text */}
      <div style={{ textAlign: 'left', position: 'relative', zIndex: 1 }}>
        <p style={{ fontFamily: 'var(--ff-sans)', fontWeight: 500, fontSize: '0.88rem', color: 'var(--text)', marginBottom: '0.15rem' }}>{bearer.name}</p>
        <p style={{ fontFamily: 'var(--ff-sans)', fontSize: '0.72rem', color: 'var(--text-soft)', letterSpacing: '0.04em' }}>{bearer.title}</p>
      </div>

      {/* Bottom Rings Emblem for middle flower girl (Ashrielle Kaye Dizon) */}
      {bearer.title === 'Flower Girl' && index === 4 && (
        <div style={{ position: 'absolute', bottom: '-10px', left: '50%', transform: 'translateX(-50%)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--cream-light)', padding: '0 6px', borderRadius: '10px', border: '1px solid var(--blush)', zIndex: 2 }}>
          <svg width="28" height="14" viewBox="0 0 28 14">
            <circle cx="10" cy="7" r="5" fill="none" stroke="var(--gold)" strokeWidth="1" />
            <circle cx="18" cy="7" r="5" fill="none" stroke="var(--gold)" strokeWidth="1" />
          </svg>
        </div>
      )}
    </motion.div>
  )
}
