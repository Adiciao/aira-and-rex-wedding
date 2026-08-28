import { useState, useEffect, useRef } from 'react'
import { useWedding } from '../context/WeddingContext'

export default function Countdown() {
  const { weddingDate, bride, groom } = useWedding()
  const WEDDING = new Date(weddingDate)
  const [time, setTime] = useState({ d: 0, h: 0, m: 0, s: 0 })

  useEffect(() => {
    const tick = () => {
      const diff = new Date(weddingDate) - new Date()
      if (diff <= 0) return
      setTime({ d: Math.floor(diff / 86400000), h: Math.floor((diff % 86400000) / 3600000), m: Math.floor((diff % 3600000) / 60000), s: Math.floor((diff % 60000) / 1000) })
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [weddingDate])

  const pad = n => String(n).padStart(2, '0')
  const units = [
    { label: 'Days',    val: pad(time.d) },
    { label: 'Hours',   val: pad(time.h) },
    { label: 'Minutes', val: pad(time.m) },
    { label: 'Seconds', val: pad(time.s) },
  ]

  return (
    <section style={{ background: 'var(--cream)', padding: '5rem 2rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '1px', height: '60px', background: 'linear-gradient(to bottom, transparent, var(--champagne))' }} />
      <p style={{ fontFamily: 'var(--ff-sans)', fontSize: 'clamp(0.95rem, 2.2vw, 1.2rem)', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--taupe-dark)', marginBottom: '3rem', marginTop: '1rem' }}>
        Until {groom} &amp; {bride} Say I Do
      </p>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'clamp(0.5rem, 2vw, 3.5rem)', flexWrap: 'wrap' }}>
        {units.map((u, i) => (
          <div key={u.label} className="countdown-item-container" style={{ display: 'flex', alignItems: 'center', gap: 'clamp(0.5rem, 2vw, 3.5rem)' }}>
            <FlipUnit val={u.val} label={u.label} />
            {i < units.length - 1 && (
              <span className="countdown-colon" style={{ fontFamily: 'var(--ff-serif)', fontSize: 'clamp(1.5rem, 5vw, 5rem)', color: 'var(--champagne)', lineHeight: 1, marginBottom: '1.4rem', fontWeight: 300 }}>:</span>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}

function FlipUnit({ val, label }) {
  const prevRef = useRef(val)
  const [flipping, setFlipping] = useState(false)
  useEffect(() => {
    if (prevRef.current !== val) {
      setFlipping(true)
      const t = setTimeout(() => { setFlipping(false); prevRef.current = val }, 300)
      return () => clearTimeout(t)
    }
  }, [val])
  return (
    <div style={{ textAlign: 'center' }}>
      <span style={{ display: 'block', fontFamily: 'var(--ff-serif)', fontSize: 'clamp(2rem, 8vw, 7rem)', fontWeight: 300, color: 'var(--text)', lineHeight: 1, letterSpacing: '-0.03em', transition: 'transform 0.3s ease, opacity 0.3s ease', transform: flipping ? 'translateY(-8px)' : 'translateY(0)', opacity: flipping ? 0 : 1, fontVariantNumeric: 'tabular-nums' }}>{val}</span>
      <span style={{ display: 'block', fontFamily: 'var(--ff-sans)', fontSize: '0.62rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--text-soft)', marginTop: '0.5rem', fontWeight: 300 }}>{label}</span>
    </div>
  )
}
