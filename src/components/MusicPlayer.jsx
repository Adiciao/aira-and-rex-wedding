import { useEffect, useRef, useState } from 'react'

export default function MusicPlayer({ play }) {
  const audioRef = useRef(null)
  const [isOpen, setIsOpen] = useState(false)
  const [muted, setMuted] = useState(false)
  const [volume, setVolume] = useState(0.45)
  const [isPlaying, setIsPlaying] = useState(false)
  const [visible, setVisible] = useState(false)
  const startedRef = useRef(false)

  // Always in DOM so browser can preload.
  // Plays right after envelope reveal click (user gesture).
  useEffect(() => {
    if (!play || startedRef.current) return
    startedRef.current = true

    const audio = audioRef.current
    if (!audio) return

    audio.volume = volume
    audio.muted = false

    audio.play().then(() => {
      setIsPlaying(true)
      setVisible(true)
    }).catch(() => {
      setVisible(true)
    })
  }, [play])

  useEffect(() => {
    if (audioRef.current) audioRef.current.muted = muted
  }, [muted])

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume
  }, [volume])

  const togglePlay = () => {
    const audio = audioRef.current
    if (!audio) return
    if (audio.paused) {
      audio.play().catch(() => {})
      setIsPlaying(true)
    } else {
      audio.pause()
      setIsPlaying(false)
    }
  }

  const toggleMute = () => setMuted(m => !m)

  return (
    <>
      <audio ref={audioRef} src="/palagi.mp3" loop preload="auto" />

      {visible && (
        <div style={{
          position: 'fixed',
          bottom: '2rem',
          left: '2rem',
          zIndex: 9999,
          fontFamily: 'var(--ff-sans)',
        }}>

          {/* ── Music Modal (mirrors chat window style) ── */}
          {isOpen && (
            <div style={{
              position: 'absolute',
              bottom: 76,
              left: 0,
              width: 'clamp(280px, 85vw, 320px)',
              background: 'var(--cream-light)',
              border: '1px solid var(--blush)',
              borderRadius: 12,
              boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
              overflow: 'hidden',
            }}>

              {/* Header */}
              <div style={{
                background: 'var(--taupe)',
                color: 'white',
                padding: '1.2rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
              }}>
                <MusicNoteIcon size={22} color="white" />
                <div>
                  <p style={{ fontWeight: 600, fontSize: '0.9rem', lineHeight: 1.2 }}>
                    Now Playing
                  </p>
                  <p style={{ fontSize: '0.7rem', opacity: 0.8, letterSpacing: '0.04em' }}>
                    Palagi — Violin Cover
                  </p>
                </div>
              </div>

              {/* Body */}
              <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.4rem' }}>

                {/* Song info */}
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    width: 64, height: 64, borderRadius: '50%',
                    background: 'var(--taupe)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 0.75rem',
                    boxShadow: '0 4px 16px rgba(158,135,189,0.35)',
                    animation: isPlaying ? 'spinRecord 4s linear infinite' : 'none',
                  }}>
                    <MusicNoteIcon size={28} color="white" />
                  </div>
                  <p style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text)', lineHeight: 1.3 }}>
                    Palagi (Violin Cover)
                  </p>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-soft)', marginTop: '0.2rem' }}>
                    TJ Monterde
                  </p>
                </div>

                {/* Play / Pause button */}
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <button
                    onClick={togglePlay}
                    style={{
                      width: 52, height: 52,
                      borderRadius: '50%',
                      background: 'var(--taupe)',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      boxShadow: '0 4px 16px rgba(158,135,189,0.4)',
                      transition: 'transform 0.2s ease',
                      color: 'white',
                      fontSize: '1.3rem',
                    }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                  >
                    {isPlaying ? '⏸' : '▶'}
                  </button>
                </div>

                {/* Volume control */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-soft)' }}>
                      Volume
                    </span>
                    <button
                      onClick={toggleMute}
                      style={{
                        background: 'none', border: 'none', cursor: 'pointer',
                        fontSize: '0.75rem', color: 'var(--taupe)', fontWeight: 600,
                        padding: '0.2rem 0.5rem',
                        borderRadius: 6,
                        border: '1px solid var(--blush)',
                      }}
                    >
                      {muted ? '🔇 Unmute' : '🔊 Mute'}
                    </button>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <span style={{ fontSize: '0.8rem' }}>🔈</span>
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
                        accentColor: '#9e87bd',
                        cursor: 'pointer',
                        height: '4px',
                      }}
                    />
                    <span style={{ fontSize: '0.8rem' }}>🔊</span>
                  </div>
                  <p style={{ textAlign: 'center', fontSize: '0.72rem', color: 'var(--text-soft)', marginTop: '0.4rem' }}>
                    {muted ? 'Muted' : Math.round(volume * 100) + '%'}
                  </p>
                </div>

              </div>
            </div>
          )}

          {/* ── Floating Toggle Button (same style as chat button) ── */}
          <button
            onClick={() => setIsOpen(o => !o)}
            style={{
              width: 60, height: 60,
              borderRadius: '50%',
              background: 'var(--taupe)',
              border: 'none',
              boxShadow: '0 8px 30px rgba(0,0,0,0.18)',
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white',
              fontSize: '1.5rem',
              position: 'relative',
              transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.08)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            {isOpen ? '✕' : <MusicNoteIcon size={24} color="white" />}

            {/* Playing indicator dot */}
            {!isOpen && isPlaying && !muted && (
              <span style={{
                position: 'absolute', top: -3, right: -3,
                width: 14, height: 14,
                borderRadius: '50%',
                background: '#7ec89a',
                boxShadow: '0 0 0 3px var(--cream-light)',
                animation: 'pulse 2s ease-in-out infinite',
              }} />
            )}
          </button>
        </div>
      )}

      <style>{`
        @keyframes spinRecord {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.6; transform: scale(1.3); }
        }
      `}</style>
    </>
  )
}

function MusicNoteIcon({ size = 24, color = 'white' }) {
  return (
    <svg
      width={size} height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9 18V5l12-2v13"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="6" cy="18" r="3" fill={color} />
      <circle cx="18" cy="16" r="3" fill={color} />
    </svg>
  )
}
