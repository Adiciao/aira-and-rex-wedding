import { useEffect, useRef, useState } from 'react'

export default function MusicPlayer({ play }) {
  const audioRef = useRef(null)
  const [isOpen, setIsOpen] = useState(false)
  const [muted, setMuted] = useState(false)
  const [volume, setVolume] = useState(0.45)
  const [isPlaying, setIsPlaying] = useState(false)
  const [visible, setVisible] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isLiked, setIsLiked] = useState(true)
  const [isShuffle, setIsShuffle] = useState(false)
  const [isRepeat, setIsRepeat] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const startedRef = useRef(false)

  // Detect screen size for iPhone bottom sheet vs desktop popover
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 640)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Auto-play when user clicks envelope (user gesture requirement)
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

  // Audio event listeners for timeline & duration
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime)
    const handleLoadedMetadata = () => setDuration(audio.duration || 0)
    const handleEnded = () => {
      if (isRepeat) {
        audio.currentTime = 0
        audio.play().catch(() => {})
      } else {
        setIsPlaying(false)
      }
    }

    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('loadedmetadata', handleLoadedMetadata)
    audio.addEventListener('ended', handleEnded)

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
      audio.removeEventListener('ended', handleEnded)
    }
  }, [isRepeat])

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

  const handleSeek = (e) => {
    const audio = audioRef.current
    if (!audio) return
    const newTime = parseFloat(e.target.value)
    audio.currentTime = newTime
    setCurrentTime(newTime)
  }

  const restartTrack = () => {
    const audio = audioRef.current
    if (!audio) return
    audio.currentTime = 0
    if (!isPlaying) {
      audio.play().catch(() => {})
      setIsPlaying(true)
    }
  }

  const formatTime = (secs) => {
    if (isNaN(secs) || secs < 0) return '0:00'
    const m = Math.floor(secs / 60)
    const s = Math.floor(secs % 60)
    return `${m}:${s < 10 ? '0' : ''}${s}`
  }

  return (
    <>
      <audio ref={audioRef} src="/palagi.mp3" loop preload="auto" />

      {visible && (
        <div className="music-widget-container" style={{
          position: 'fixed',
          bottom: '2rem',
          left: '2rem',
          zIndex: 9999,
          fontFamily: 'var(--ff-sans)',
        }}>

          {/* Backdrop on mobile phone sheet */}
          {isOpen && isMobile && (
            <div
              onClick={() => setIsOpen(false)}
              style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0, 0, 0, 0.45)',
                backdropFilter: 'blur(5px)',
                WebkitBackdropFilter: 'blur(5px)',
                zIndex: 10000,
                animation: 'fadeIn 0.2s ease-out',
              }}
            />
          )}

          {/* ── Music Modal (iPhone Bottom Sheet on phone, Floating Popover on desktop) ── */}
          {isOpen && (
            <div style={isMobile ? {
              position: 'fixed',
              bottom: 0,
              left: 0,
              right: 0,
              zIndex: 10001,
              background: 'rgba(253, 250, 246, 0.96)',
              backdropFilter: 'blur(30px) saturate(180%)',
              WebkitBackdropFilter: 'blur(30px) saturate(180%)',
              borderTopLeftRadius: 28,
              borderTopRightRadius: 28,
              boxShadow: '0 -10px 40px rgba(0,0,0,0.25)',
              padding: '0.8rem 1.25rem calc(1.5rem + env(safe-area-inset-bottom, 0px))',
              animation: 'slideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
              maxHeight: '85vh',
              overflowY: 'auto',
            } : {
              position: 'absolute',
              bottom: 76,
              left: 0,
              width: 340,
              background: 'rgba(253, 250, 246, 0.96)',
              backdropFilter: 'blur(25px)',
              WebkitBackdropFilter: 'blur(25px)',
              border: '1px solid var(--blush)',
              borderRadius: 22,
              boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
              overflow: 'hidden',
              padding: '1.25rem',
              animation: 'popIn 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
            }}>

              {/* iOS Grabber Handle on phone */}
              {isMobile && (
                <div style={{
                  width: 36,
                  height: 5,
                  background: 'rgba(0,0,0,0.18)',
                  borderRadius: 3,
                  margin: '0 auto 0.8rem',
                }} />
              )}

              {/* Header Bar */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '1rem',
              }}>
                <div>
                  <p style={{
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    letterSpacing: '0.1em',
                    color: 'var(--taupe)',
                    textTransform: 'uppercase',
                  }}>
                    PLAYING FROM WEDDING PLAYLIST
                  </p>
                  <p style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-soft)' }}>
                    Aira & Rex’s Special Day
                  </p>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: '50%',
                    background: 'rgba(0,0,0,0.06)',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    color: 'var(--text-soft)',
                  }}
                >
                  ✕
                </button>
              </div>

              {/* Vinyl Album Artwork (Spotify style) */}
              <div style={{
                position: 'relative',
                width: isMobile ? 160 : 140,
                height: isMobile ? 160 : 140,
                margin: '0 auto 1.25rem',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--taupe-dark) 0%, var(--taupe) 100%)',
                boxShadow: '0 12px 35px rgba(158,135,189,0.35)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                animation: isPlaying ? 'spinRecord 12s linear infinite' : 'none',
              }}>
                {/* Vinyl grooves */}
                <div style={{
                  position: 'absolute', inset: 10, borderRadius: '50%',
                  border: '1px stroke rgba(255,255,255,0.15)',
                  boxShadow: 'inset 0 0 15px rgba(0,0,0,0.3)',
                }} />
                <div style={{
                  position: 'absolute', inset: 24, borderRadius: '50%',
                  border: '1px stroke rgba(255,255,255,0.1)',
                }} />
                {/* Center Record Label */}
                <div style={{
                  width: 54, height: 54, borderRadius: '50%',
                  background: 'var(--cream-light)',
                  border: '3px solid var(--taupe)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                  textAlign: 'center',
                  fontSize: '0.6rem',
                  fontWeight: 700,
                  color: 'var(--taupe-dark)',
                }}>
                  🎶 A&R
                </div>
              </div>

              {/* Song Title + Spotify Heart */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '0.75rem',
              }}>
                <div>
                  <h4 style={{
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    color: 'var(--text)',
                    lineHeight: 1.2,
                  }}>
                    Palagi
                  </h4>
                  <p style={{
                    fontSize: '0.82rem',
                    color: 'var(--text-soft)',
                    fontWeight: 500,
                    marginTop: 2,
                  }}>
                    TJ Monterde (Violin Cover)
                  </p>
                </div>
                <button
                  onClick={() => setIsLiked(!isLiked)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 4,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'transform 0.2s ease',
                  }}
                  onMouseDown={e => e.currentTarget.style.transform = 'scale(0.85)'}
                  onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
                >
                  <SpotifyHeartIcon liked={isLiked} />
                </button>
              </div>

              {/* Spotify Progress Bar */}
              <div style={{ marginBottom: '1rem' }}>
                <input
                  type="range"
                  min="0"
                  max={duration || 100}
                  step="0.1"
                  value={currentTime}
                  onChange={handleSeek}
                  style={{
                    width: '100%',
                    height: 4,
                    borderRadius: 2,
                    appearance: 'none',
                    background: `linear-gradient(to right, var(--taupe) ${(currentTime / (duration || 1)) * 100}%, rgba(0,0,0,0.1) ${(currentTime / (duration || 1)) * 100}%)`,
                    cursor: 'pointer',
                    outline: 'none',
                  }}
                />
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '0.7rem',
                  color: 'var(--text-soft)',
                  fontWeight: 600,
                  marginTop: 4,
                }}>
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration || 225)}</span>
                </div>
              </div>

              {/* Spotify Controls Row */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '1.25rem',
                padding: '0 0.5rem',
              }}>
                {/* Shuffle */}
                <button
                  onClick={() => setIsShuffle(!isShuffle)}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: isShuffle ? 'var(--taupe)' : 'var(--text-soft)',
                    opacity: isShuffle ? 1 : 0.6,
                    padding: 6,
                  }}
                >
                  <SpotifyShuffleIcon active={isShuffle} />
                </button>

                {/* Skip Back */}
                <button
                  onClick={restartTrack}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: 'var(--text)', padding: 6,
                  }}
                >
                  <SpotifySkipBackIcon />
                </button>

                {/* Main Play / Pause Button */}
                <button
                  onClick={togglePlay}
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: '50%',
                    background: 'var(--taupe)',
                    color: 'white',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 6px 20px rgba(158,135,189,0.4)',
                    transition: 'transform 0.2s var(--ease-spring)',
                  }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.06)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                >
                  {isPlaying ? <SpotifyPauseIcon /> : <SpotifyPlayIcon />}
                </button>

                {/* Skip Forward */}
                <button
                  onClick={restartTrack}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: 'var(--text)', padding: 6,
                  }}
                >
                  <SpotifySkipForwardIcon />
                </button>

                {/* Repeat */}
                <button
                  onClick={() => setIsRepeat(!isRepeat)}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: isRepeat ? 'var(--taupe)' : 'var(--text-soft)',
                    opacity: isRepeat ? 1 : 0.6,
                    padding: 6,
                  }}
                >
                  <SpotifyRepeatIcon active={isRepeat} />
                </button>
              </div>

              {/* Volume Slider & Mute */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                background: 'rgba(0,0,0,0.03)',
                padding: '0.5rem 0.8rem',
                borderRadius: 12,
                marginBottom: '0.8rem',
              }}>
                <button
                  onClick={toggleMute}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                >
                  <span style={{ fontSize: '0.85rem' }}>{muted || volume === 0 ? '🔇' : '🔈'}</span>
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={muted ? 0 : volume}
                  onChange={e => {
                    setVolume(parseFloat(e.target.value))
                    setMuted(false)
                  }}
                  style={{
                    flex: 1,
                    height: 4,
                    borderRadius: 2,
                    appearance: 'none',
                    background: `linear-gradient(to right, var(--taupe) ${(muted ? 0 : volume) * 100}%, rgba(0,0,0,0.1) ${(muted ? 0 : volume) * 100}%)`,
                    cursor: 'pointer',
                    outline: 'none',
                  }}
                />
                <span style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-soft)', width: 32, textAlign: 'right' }}>
                  {muted ? '0%' : Math.round(volume * 100) + '%'}
                </span>
              </div>

              {/* Spotify Device Output Footer */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '0.68rem',
                color: 'var(--taupe-dark)',
                fontWeight: 600,
                padding: '0.2rem 0.2rem 0',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <SpotifyDeviceIcon />
                  <span>iPhone Speaker • High Quality Audio</span>
                </div>
                {/* Equalizer bars */}
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2, height: 12 }}>
                  <span style={{ width: 2, height: isPlaying ? '100%' : '30%', background: 'var(--taupe)', borderRadius: 1, animation: isPlaying ? 'eq 0.8s ease-in-out infinite alternate' : 'none' }} />
                  <span style={{ width: 2, height: isPlaying ? '60%' : '20%', background: 'var(--taupe)', borderRadius: 1, animation: isPlaying ? 'eq 0.6s ease-in-out 0.2s infinite alternate' : 'none' }} />
                  <span style={{ width: 2, height: isPlaying ? '80%' : '40%', background: 'var(--taupe)', borderRadius: 1, animation: isPlaying ? 'eq 1s ease-in-out 0.4s infinite alternate' : 'none' }} />
                </div>
              </div>

            </div>
          )}

          {/* ── Floating Toggle Button (pantay to message icon) ── */}
          <button
            className="floating-widget-btn"
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
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to   { transform: translateY(0); }
        }
        @keyframes popIn {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes eq {
          0%   { height: 20%; }
          100% { height: 100%; }
        }
      `}</style>
    </>
  )
}

/* ── SVG Icons (Spotify Style) ── */

function MusicNoteIcon({ size = 24, color = 'white' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M9 18V5l12-2v13" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="6" cy="18" r="3" fill={color} />
      <circle cx="18" cy="16" r="3" fill={color} />
    </svg>
  )
}

function SpotifyPlayIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" style={{ marginLeft: 2 }}>
      <path d="M8 5v14l11-7z" />
    </svg>
  )
}

function SpotifyPauseIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
    </svg>
  )
}

function SpotifySkipBackIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
    </svg>
  )
}

function SpotifySkipForwardIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
    </svg>
  )
}

function SpotifyShuffleIcon({ active }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M16 3h5v5M4 20l16-16M21 16v5h-5M15 15l5.5 5.5M4 4l5 5" />
    </svg>
  )
}

function SpotifyRepeatIcon({ active }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M17 1l4 4-4 4M3 11V9a4 4 0 014-4h14M7 23l-4-4 4-4M21 13v2a4 4 0 01-4 4H3" />
    </svg>
  )
}

function SpotifyHeartIcon({ liked }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill={liked ? 'var(--taupe)' : 'none'} stroke={liked ? 'var(--taupe)' : 'var(--text-soft)'} strokeWidth="2">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  )
}

function SpotifyDeviceIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 1a9 9 0 00-9 9v7a3 3 0 003 3h3a1 1 0 001-1v-6a1 1 0 00-1-1H6v-2a6 6 0 1112 0v2h-3a1 1 0 00-1 1v6a1 1 0 001 1h3a3 3 0 003-3v-7a9 9 0 00-9-9z" />
    </svg>
  )
}
