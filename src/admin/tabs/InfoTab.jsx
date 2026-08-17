import { useState, useEffect } from 'react'
import { useWedding } from '../../context/WeddingContext'

export default function InfoTab() {
  const ctx = useWedding()

  // ── Local Draft States ──────────────────────────────────────────────
  const [bride, setBride] = useState('')
  const [groom, setGroom] = useState('')
  const [weddingDate, setWeddingDate] = useState('')
  const [location, setLocation] = useState('')
  const [heroSubtitle, setHeroSubtitle] = useState('')
  const [rsvpDeadline, setRsvpDeadline] = useState('')
  const [adminPassword, setAdminPassword] = useState('')

  // Our Story paragraphs
  const [story, setStory] = useState(['', '', ''])

  // Venues details
  const [ceremonyVenueName, setCeremonyVenueName]       = useState('')
  const [ceremonyVenueAddress, setCeremonyVenueAddress] = useState('')
  const [receptionVenueName, setReceptionVenueName]     = useState('')
  const [receptionVenueAddress, setReceptionVenueAddress] = useState('')
  const [gettingThereText, setGettingThereText]         = useState('')
  const [accommodationText, setAccommodationText]       = useState('')
  const [parkingText, setParkingText]                   = useState('')

  // Schedule program
  const [schedule, setSchedule] = useState([])

  // Status & states
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [isDirty, setIsDirty] = useState(false)

  // ── Sync local state when context data finishes loading ─────────────
  useEffect(() => {
    if (ctx.loading) return
    setBride(ctx.bride ?? '')
    setGroom(ctx.groom ?? '')
    setWeddingDate(ctx.weddingDate ? ctx.weddingDate.slice(0, 16) : '')
    setLocation(ctx.location ?? '')
    setHeroSubtitle(ctx.heroSubtitle ?? '')
    setRsvpDeadline(ctx.rsvpDeadline ?? '')
    setAdminPassword(ctx.adminPassword ?? '')

    setStory(ctx.story ? [...ctx.story] : ['', '', ''])

    setCeremonyVenueName(ctx.ceremonyVenueName ?? '')
    setCeremonyVenueAddress(ctx.ceremonyVenueAddress ?? '')
    setReceptionVenueName(ctx.receptionVenueName ?? '')
    setReceptionVenueAddress(ctx.receptionVenueAddress ?? '')
    setGettingThereText(ctx.gettingThereText ?? '')
    setAccommodationText(ctx.accommodationText ?? '')
    setParkingText(ctx.parkingText ?? '')

    setSchedule(ctx.schedule ? ctx.schedule.map(s => ({ ...s })) : [])
    setIsDirty(false)
  }, [
    ctx.loading, ctx.bride, ctx.groom, ctx.weddingDate, ctx.location,
    ctx.heroSubtitle, ctx.rsvpDeadline, ctx.adminPassword, ctx.story,
    ctx.ceremonyVenueName, ctx.ceremonyVenueAddress, ctx.receptionVenueName,
    ctx.receptionVenueAddress, ctx.gettingThereText, ctx.accommodationText,
    ctx.parkingText, ctx.schedule
  ])

  // Helper to mark dirty state
  const onChange = (updaterFn) => {
    updaterFn()
    setIsDirty(true)
  }

  // ── Save all changes to Firebase at once ───────────────────────────
  const handleSave = async () => {
    setSaving(true)
    setSaved(false)
    try {
      await ctx.updateBulk({
        bride,
        groom,
        weddingDate: weddingDate ? `${weddingDate}:00` : '',
        location,
        heroSubtitle,
        rsvpDeadline,
        adminPassword,
        story,
        ceremonyVenueName,
        ceremonyVenueAddress,
        receptionVenueName,
        receptionVenueAddress,
        gettingThereText,
        accommodationText,
        parkingText,
        schedule,
      })
      setSaved(true)
      setIsDirty(false)
      setTimeout(() => setSaved(false), 3000)
    } catch (e) {
      console.error(e)
      alert('Failed to save to Firebase: ' + e.message)
    } finally {
      setSaving(false)
    }
  }

  if (ctx.loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '50vh', color: 'var(--a-muted)' }}>
        Loading wedding data...
      </div>
    )
  }

  return (
    <div style={{ paddingBottom: '5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2 className="admin-page-title">Wedding Info</h2>
          <p className="admin-page-sub" style={{ marginBottom: 0 }}>Edit wedding details below. Click "Save Changes" to publish.</p>
        </div>
      </div>

      {ctx.error && (
        <div style={{
          background: 'rgba(224,112,112,0.1)',
          border: '1px solid rgba(224,112,112,0.25)',
          color: 'var(--a-danger)',
          padding: '1rem 1.25rem',
          borderRadius: 6,
          marginBottom: '2.5rem',
          fontSize: '0.88rem',
          lineHeight: 1.5,
        }}>
          ⚠️ <strong>Firebase connection issue:</strong> {ctx.error}
          <div style={{ fontSize: '0.78rem', color: 'var(--a-muted)', marginTop: '0.4rem' }}>
            Check your Firebase console settings. You can still test edits locally, but they won't save to the cloud.
          </div>
        </div>
      )}

      {/* Names & Date */}
      <div className="admin-card">
        <p className="admin-card-title">👥 Names & Date</p>
        <div className="admin-grid-2" style={{ gap: '1rem', marginBottom: '1rem' }}>
          <div className="admin-field">
            <label className="admin-label">Bride's Name</label>
            <input className="admin-input" value={bride} onChange={e => onChange(() => setBride(e.target.value))} placeholder="Aira" />
          </div>
          <div className="admin-field">
            <label className="admin-label">Groom's Name</label>
            <input className="admin-input" value={groom} onChange={e => onChange(() => setGroom(e.target.value))} placeholder="Rex" />
          </div>
        </div>
        <div className="admin-grid-2" style={{ gap: '1rem', marginBottom: '1rem' }}>
          <div className="admin-field">
            <label className="admin-label">Wedding Date & Time</label>
            <input className="admin-input" type="datetime-local" value={weddingDate} onChange={e => onChange(() => setWeddingDate(e.target.value))} />
          </div>
          <div className="admin-field">
            <label className="admin-label">Location (short, for hero)</label>
            <input className="admin-input" value={location} onChange={e => onChange(() => setLocation(e.target.value))} placeholder="San Miguel, Bulacan" />
          </div>
        </div>
        <div className="admin-field">
          <label className="admin-label">Hero Subtitle (full text under names)</label>
          <input className="admin-input" value={heroSubtitle} onChange={e => onChange(() => setHeroSubtitle(e.target.value))} placeholder="October 17, 2026  ·  San Miguel, Bulacan" />
        </div>
        <div className="admin-field">
          <label className="admin-label">RSVP Deadline</label>
          <input className="admin-input" value={rsvpDeadline} onChange={e => onChange(() => setRsvpDeadline(e.target.value))} placeholder="September 1, 2026" />
        </div>
      </div>

      {/* Our Story */}
      <div className="admin-card">
        <p className="admin-card-title">💌 Our Story Paragraphs</p>
        {story.map((p, i) => (
          <div key={i} className="admin-field">
            <label className="admin-label">Paragraph {i + 1}</label>
            <textarea
              className="admin-textarea"
              value={p}
              onChange={e => onChange(() => {
                const s = [...story]
                s[i] = e.target.value
                setStory(s)
              })}
              rows={3}
            />
          </div>
        ))}
      </div>

      {/* Venues */}
      <div className="admin-card">
        <p className="admin-card-title">📍 Venues</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div>
            <p style={{ fontSize: '0.72rem', color: 'var(--a-accent)', marginBottom: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Ceremony</p>
            <div className="admin-field">
              <label className="admin-label">Venue Name</label>
              <input className="admin-input" value={ceremonyVenueName} onChange={e => onChange(() => setCeremonyVenueName(e.target.value))} />
            </div>
            <div className="admin-field">
              <label className="admin-label">Address</label>
              <input className="admin-input" value={ceremonyVenueAddress} onChange={e => onChange(() => setCeremonyVenueAddress(e.target.value))} />
            </div>
          </div>
          <div>
            <p style={{ fontSize: '0.72rem', color: 'var(--a-accent)', marginBottom: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Reception</p>
            <div className="admin-field">
              <label className="admin-label">Venue Name</label>
              <input className="admin-input" value={receptionVenueName} onChange={e => onChange(() => setReceptionVenueName(e.target.value))} />
            </div>
            <div className="admin-field">
              <label className="admin-label">Address</label>
              <input className="admin-input" value={receptionVenueAddress} onChange={e => onChange(() => setReceptionVenueAddress(e.target.value))} />
            </div>
          </div>
        </div>
        <hr className="admin-divider" />
        <div className="admin-field">
          <label className="admin-label">Getting There</label>
          <textarea className="admin-textarea" value={gettingThereText} onChange={e => onChange(() => setGettingThereText(e.target.value))} rows={2} />
        </div>
        <div className="admin-field">
          <label className="admin-label">Accommodation</label>
          <textarea className="admin-textarea" value={accommodationText} onChange={e => onChange(() => setAccommodationText(e.target.value))} rows={2} />
        </div>
        <div className="admin-field">
          <label className="admin-label">Parking</label>
          <textarea className="admin-textarea" value={parkingText} onChange={e => onChange(() => setParkingText(e.target.value))} rows={2} />
        </div>
      </div>

      {/* Schedule */}
      <div className="admin-card">
        <p className="admin-card-title">🗓 Schedule of Events</p>
        {schedule.map((ev, i) => (
          <div key={i} style={{ borderBottom: i < schedule.length - 1 ? '1px solid var(--a-border)' : 'none', paddingBottom: i < schedule.length - 1 ? '1.5rem' : 0, marginBottom: i < schedule.length - 1 ? '1.5rem' : 0 }}>
            <p style={{ fontSize: '0.72rem', color: 'var(--a-accent)', marginBottom: '0.75rem' }}>Event {i + 1}</p>
            <div className="admin-grid-2" style={{ gap: '1rem', marginBottom: '0.75rem' }}>
              <div className="admin-field" style={{ marginBottom: 0 }}>
                <label className="admin-label">Time</label>
                <input className="admin-input" value={ev.time} onChange={e => onChange(() => {
                  const s = [...schedule]; s[i].time = e.target.value; setSchedule(s)
                })} placeholder="9:00 AM" />
              </div>
              <div className="admin-field" style={{ marginBottom: 0 }}>
                <label className="admin-label">Attire</label>
                <input className="admin-input" value={ev.attire} onChange={e => onChange(() => {
                  const s = [...schedule]; s[i].attire = e.target.value; setSchedule(s)
                })} placeholder="Formal Attire" />
              </div>
            </div>
            <div className="admin-grid-2" style={{ gap: '1rem', marginBottom: '0.75rem' }}>
              <div className="admin-field" style={{ marginBottom: 0 }}>
                <label className="admin-label">Event Title</label>
                <input className="admin-input" value={ev.title} onChange={e => onChange(() => {
                  const s = [...schedule]; s[i].title = e.target.value; setSchedule(s)
                })} />
              </div>
              <div className="admin-field" style={{ marginBottom: 0 }}>
                <label className="admin-label">Venue</label>
                <input className="admin-input" value={ev.venue} onChange={e => onChange(() => {
                  const s = [...schedule]; s[i].venue = e.target.value; setSchedule(s)
                })} />
              </div>
            </div>
            <div className="admin-field" style={{ marginBottom: 0 }}>
              <label className="admin-label">Description</label>
              <textarea className="admin-textarea" value={ev.desc} onChange={e => onChange(() => {
                const s = [...schedule]; s[i].desc = e.target.value; setSchedule(s)
              })} rows={2} />
            </div>
          </div>
        ))}
      </div>

      {/* Admin Password */}
      <div className="admin-card">
        <p className="admin-card-title">🔐 Admin Password</p>
        <div className="admin-field">
          <label className="admin-label">Change Password</label>
          <input className="admin-input" type="text" value={adminPassword} onChange={e => onChange(() => setAdminPassword(e.target.value))} />
        </div>
        <p style={{ fontSize: '0.75rem', color: 'var(--a-muted)' }}>⚠ You'll need the new password next time you log in.</p>
      </div>

      {/* Danger zone */}
      <div className="admin-card" style={{ border: '1px solid rgba(224,112,112,0.2)' }}>
        <p className="admin-card-title" style={{ color: 'var(--a-danger)' }}>⚠ Danger Zone</p>
        <p style={{ fontSize: '0.82rem', color: 'var(--a-muted)', marginBottom: '1rem' }}>Reset all wedding info to the original defaults. This cannot be undone.</p>
        <button className="admin-btn admin-btn-danger" onClick={() => ctx.resetToDefaults()}>Reset to Defaults</button>
      </div>

      {/* ── Sticky Bottom Bar for Save Button ─────────────────────────── */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 240, // Match sidebar width
        right: 0,
        background: '#141822',
        borderTop: '1px solid var(--a-border)',
        padding: '1rem 2.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        zIndex: 99,
        boxShadow: '0 -10px 30px rgba(0,0,0,0.3)',
      }}>
        <div>
          {isDirty ? (
            <span style={{ fontSize: '0.85rem', color: 'var(--a-accent)' }}>● You have unsaved changes</span>
          ) : (
            <span style={{ fontSize: '0.85rem', color: 'var(--a-muted)' }}>All changes saved in Firebase</span>
          )}
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          {saved && (
            <span style={{ fontSize: '0.85rem', color: 'var(--a-success)', transition: 'all 0.3s' }}>
              ✓ Saved successfully!
            </span>
          )}
          <button
            className="admin-btn admin-btn-primary"
            disabled={saving || !isDirty}
            onClick={handleSave}
            style={{
              opacity: isDirty ? 1 : 0.5,
              cursor: isDirty ? 'pointer' : 'not-allowed',
              minWidth: 150,
              justifyContent: 'center',
            }}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Responsive adjustments for sticky bar */}
      <style>{`
        @media (max-width: 768px) {
          div[style*="position: fixed"] {
            left: 0 !important;
          }
        }
      `}</style>
    </div>
  )
}
