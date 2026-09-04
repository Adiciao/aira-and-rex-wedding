import { useEffect, useRef, useState } from 'react'

export default function MusicPlayer({ play }) {
  const audioRef = useRef(null)
  const [muted, setMuted] = useState(false)
  const [volume, setVolume] = useState(0.45)
  const [showVolume, setShowVolume] = useState(false)
  const [visible, setVisible] = useState(false)
  const startedRef = useRef(false)

  // Always in DOM so browser can preload. Plays on envelope reveal click (user gesture).
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
      setVisible(true)
    })
  }, [play])

  useEffect(() => {
    if (audioRef.current) audioRef.current.muted = muted
  }, [muted])

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
          // Bottom-LEFT corner — away from the chat button (bottom-right)
          bottom: '2rem',
          left: '2rem',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: '0.5rem',
        }}>
          {/* Volume slider — shown on hover */}
          {showVolume && (
            <div style={{
              background: 'rgba(45, 31, 64, 0.93)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              borderRadius: '1.2rem',
              padding: '0.55rem 0.9rem',
              boxShadow: '0 4px 20px rgba(0,0,0,0.3), 0 0 0 1.5px rgba(158,135,189,0.4)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              minWidth: '9rem',
            }}>
              <span style={{ fontSize: '0.8rem' }}>
                {muted || volume === 0 ? '🔇' : volume < 0.35 ? '🔈' : '🔊'}
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
                  setMuted(v === 0)
                }}
                style={{
                  flex: 1,
                  accentColor: '#b7a0d8',
                  cursor: 'pointer',
                }}
              />
              <span style={{ fontSize: '0.7rem', color: '#c2b1d8', minWidth: '2rem', textAlign: 'right' }}>
                {muted ? '0%' : Math.round(volume * 100) + '%'}
              </span>
            </div>
          )}

          {/* Music toggle button — matches palette (taupe purple) */}
          <button
            onClick={handleButtonClick}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'scale(1.08)'
              setShowVolume(true)
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'scale(1)'
              setShowVolume(false)
            }}
            title={muted ? 'Unmute music' : 'Mute / adjust volume'}
            style={{
              width: 60,
              height: 60,
              borderRadius: '50%',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#9e87bd',
              boxShadow: '0 8px 30px rgba(0,0,0,0.18)',
              transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
              fontSize: '1.5rem',
            }}
          >
            {muted || volume === 0 ? '🔇' : '🎵'}
          </button>
        </div>
      )}
    </>
  )
}
