import { useEffect, useRef, useState } from 'react'

export default function MusicPlayer({ play }) {
  const audioRef = useRef(null)
  const [muted, setMuted] = useState(false)
  const [volume, setVolume] = useState(0.45)
  const [showVolume, setShowVolume] = useState(false)
  const [visible, setVisible] = useState(false)
  const startedRef = useRef(false)

  // Always in DOM so browser can preload. Play fires on envelope reveal click (user gesture).
  useEffect(() => {
    if (!play || startedRef.current) return
    startedRef.current = true

    const audio = audioRef.current
    if (!audio) return

    audio.volume = volume
    audio.muted = false

    audio.play().then(() => {
      setVisible(true)
    }).catch(() => {
      // Autoplay still blocked — still show button so user can tap
      setVisible(true)
    })
  }, [play])

  // Sync mute
  useEffect(() => {
    if (audioRef.current) audioRef.current.muted = muted
  }, [muted])

  // Sync volume
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume
  }, [volume])

  const handleButtonClick = () => {
    const audio = audioRef.current
    if (!audio) return
    if (audio.paused) {
      audio.play().catch(() => {})
      setMuted(false)
    } else {
      setMuted(m => !m)
    }
  }

  return (
    <>
      <audio ref={audioRef} src="/palagi.mp3" loop preload="auto" />

      {visible && (
        <div style={{
          position: 'fixed',
          // Sit above the chat button: chat is bottom:2rem height:60px + gap
          bottom: 'calc(2rem + 60px + 0.75rem)',
          right: '2rem',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: '0.5rem',
        }}>
          {/* Volume slider panel — shown on hover/click */}
          {showVolume && (
            <div style={{
              background: 'linear-gradient(135deg, rgba(30,12,6,0.92), rgba(80,40,20,0.92))',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              borderRadius: '1.2rem',
              padding: '0.6rem 0.85rem',
              boxShadow: '0 4px 20px rgba(0,0,0,0.4), 0 0 0 1.5px rgba(212,175,105,0.35)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              minWidth: '9rem',
            }}>
              <span style={{ fontSize: '0.75rem', color: '#d4af69' }}>
                {muted ? '🔇' : volume < 0.3 ? '🔈' : '🔊'}
              </span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={muted ? 0 : volume}
                onChange={e => {
                  const v = parseFloat(e.target.value)
                  setVolume(v)
                  if (v === 0) setMuted(true)
                  else setMuted(false)
                }}
                style={{
                  flex: 1,
                  accentColor: '#d4af69',
                  cursor: 'pointer',
                  height: '3px',
                }}
              />
              <span style={{ fontSize: '0.7rem', color: 'rgba(212,175,105,0.8)', minWidth: '2rem', textAlign: 'right' }}>
                {muted ? '0%' : Math.round(volume * 100) + '%'}
              </span>
            </div>
          )}

          {/* Music toggle button */}
          <button
            onClick={handleButtonClick}
            onMouseEnter={() => setShowVolume(true)}
            onMouseLeave={() => setShowVolume(false)}
            title={muted ? 'Unmute music' : 'Mute music'}
            style={{
              width: '3.2rem',
              height: '3.2rem',
              borderRadius: '50%',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'linear-gradient(135deg, rgba(30,12,6,0.88), rgba(80,40,20,0.88))',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.4), 0 0 0 1.5px rgba(212,175,105,0.35)',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            }}
            onFocus={() => setShowVolume(true)}
            onBlur={() => setShowVolume(false)}
          >
            {muted ? <MutedIcon /> : <PlayingIcon />}
          </button>
        </div>
      )}
    </>
  )
}

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
