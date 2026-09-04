import { useEffect, useRef, useState } from 'react'

export default function MusicPlayer({ play }) {
  const audioRef = useRef(null)
  const [muted, setMuted] = useState(false)
  const [visible, setVisible] = useState(false)

  // Start / stop music based on `play` prop
  useEffect(() => {
    if (!audioRef.current) return
    if (play) {
      audioRef.current.volume = 0.45
      audioRef.current.play().catch(() => {
        // Autoplay blocked — show button so user can enable manually
      })
      setVisible(true)
    }
  }, [play])

  // Sync mute state
  useEffect(() => {
    if (audioRef.current) audioRef.current.muted = muted
  }, [muted])

  if (!visible) return null

  return (
    <>
      <audio ref={audioRef} src="/palagi.mp3" loop preload="auto" />

      {/* Floating music button */}
      <button
        onClick={() => setMuted(m => !m)}
        title={muted ? 'Unmute music' : 'Mute music'}
        style={{
          position: 'fixed',
          bottom: '1.5rem',
          right: '1.5rem',
          zIndex: 9999,
          width: '3.2rem',
          height: '3.2rem',
          borderRadius: '50%',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, rgba(30,12,6,0.85), rgba(80,40,20,0.85))',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.4), 0 0 0 1.5px rgba(212,175,105,0.35)',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = 'scale(1.12)'
          e.currentTarget.style.boxShadow = '0 6px 28px rgba(0,0,0,0.55), 0 0 0 2px rgba(212,175,105,0.6)'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = 'scale(1)'
          e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.4), 0 0 0 1.5px rgba(212,175,105,0.35)'
        }}
      >
        {muted ? <MutedIcon /> : <PlayingIcon />}
      </button>
    </>
  )
}

/* Animated music note icon */
function PlayingIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <style>{`
        @keyframes noteBounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
        .note1 { animation: noteBounce 1.1s ease-in-out infinite; }
        .note2 { animation: noteBounce 1.1s ease-in-out infinite 0.35s; }
      `}</style>
      <g className="note1">
        <path d="M9 18V5l12-2v13" stroke="#d4af69" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="6" cy="18" r="3" fill="#d4af69"/>
      </g>
      <g className="note2">
        <circle cx="18" cy="16" r="3" fill="#d4af69"/>
      </g>
    </svg>
  )
}

function MutedIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9 18V5l12-2v13" stroke="rgba(212,175,105,0.45)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="6" cy="18" r="3" fill="rgba(212,175,105,0.45)"/>
      <circle cx="18" cy="16" r="3" fill="rgba(212,175,105,0.45)"/>
      <line x1="4" y1="4" x2="20" y2="20" stroke="#e07070" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  )
}
