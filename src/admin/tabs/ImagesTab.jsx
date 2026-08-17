import { useState } from 'react'
import { useWedding } from '../../context/WeddingContext'

// ── Progress ring ─────────────────────────────────────────────────────
function ProgressRing({ pct }) {
  const r = 18, c = 2 * Math.PI * r
  const dash = (pct / 100) * c
  return (
    <svg width="48" height="48" style={{ transform: 'rotate(-90deg)' }}>
      <circle cx="24" cy="24" r={r} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="3" />
      <circle cx="24" cy="24" r={r} fill="none" stroke="var(--a-accent)" strokeWidth="3"
        strokeDasharray={`${dash} ${c}`} strokeLinecap="round"
        style={{ transition: 'stroke-dasharray 0.3s ease' }}
      />
    </svg>
  )
}

// ── Single uploader card ──────────────────────────────────────────────
function ImageUploader({ label, currentSrc, storageKey, onFile, portrait = false, hint = '' }) {
  const { uploadProgress } = useWedding()
  const pct = uploadProgress?.[storageKey]            // 0-100 while uploading, null otherwise
  const uploading = pct !== null && pct !== undefined

  const [drag,    setDrag]    = useState(false)
  const [preview, setPreview] = useState(null)
  const [done,    setDone]    = useState(false)

  const inputId = `upload-${storageKey}`

  const process = async (file) => {
    if (!file || !file.type.startsWith('image/')) {
      alert('Please select an image file (JPG, PNG, WEBP, GIF)')
      return
    }
    setPreview(URL.createObjectURL(file))
    setDone(false)
    try {
      await onFile(file)
      setDone(true)
      setTimeout(() => setDone(false), 3000)
    } catch (err) {
      console.error('Upload error:', err)
      alert('Upload failed: ' + (err.message ?? err))
      setPreview(null)
    }
  }

  const onDrop = (e) => {
    e.preventDefault(); setDrag(false)
    process(e.dataTransfer.files?.[0])
  }

  const displaySrc = preview || currentSrc

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
        <span className="admin-label" style={{ marginBottom: 0 }}>{label}</span>
        {uploading && <span style={{ fontSize: '0.7rem', color: 'var(--a-accent)' }}>Uploading {pct}%…</span>}
        {!uploading && done && <span style={{ fontSize: '0.7rem', color: 'var(--a-success)' }}>✓ Saved to Firebase!</span>}
      </div>

      {/* Drop zone — label wraps hidden input for maximum click reliability */}
      <label
        htmlFor={inputId}
        onDrop={onDrop}
        onDragOver={(e) => { e.preventDefault(); setDrag(true) }}
        onDragLeave={() => setDrag(false)}
        style={{
          display:      'block',
          cursor:       uploading ? 'not-allowed' : 'pointer',
          border:       `2px dashed ${drag ? 'var(--a-accent)' : uploading ? 'rgba(201,169,110,0.35)' : 'rgba(255,255,255,0.1)'}`,
          borderRadius: 8,
          overflow:     'hidden',
          transition:   'border-color 0.2s, background 0.2s',
          background:   drag ? 'rgba(201,169,110,0.06)' : 'transparent',
          position:     'relative',
          pointerEvents: uploading ? 'none' : 'auto',
        }}
      >
        {/* Hidden file input fills entire label area */}
        <input
          id={inputId}
          type="file"
          accept="image/*"
          disabled={uploading}
          style={{ position: 'absolute', inset: 0, opacity: 0, width: '100%', height: '100%', cursor: 'pointer' }}
          onChange={(e) => process(e.target.files?.[0])}
        />

        {displaySrc ? (
          <div style={{ position: 'relative' }}>
            <img
              src={displaySrc}
              alt={label}
              style={{
                width: '100%',
                aspectRatio: portrait ? '3/4' : '16/9',
                objectFit: 'cover',
                display: 'block',
                opacity: uploading ? 0.4 : 1,
                transition: 'opacity 0.3s',
              }}
            />

            {/* Upload progress overlay */}
            {uploading && (
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(10,12,20,0.7)', gap: '0.5rem' }}>
                <ProgressRing pct={pct} />
                <span style={{ fontSize: '0.78rem', color: 'var(--a-accent)', letterSpacing: '0.06em' }}>{pct}%</span>
              </div>
            )}

            {/* Hover — change hint */}
            {!uploading && (
              <div style={{
                position: 'absolute', inset: 0,
                background: 'rgba(0,0,0,0.52)',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                gap: '0.4rem', opacity: drag ? 1 : 0,
                transition: 'opacity 0.2s', color: 'white', fontSize: '0.78rem',
              }}>
                <span style={{ fontSize: '1.4rem' }}>📷</span>
                Drop to replace
              </div>
            )}

            {/* "Change" badge */}
            {!uploading && (
              <div style={{ position: 'absolute', bottom: '0.6rem', right: '0.6rem', background: 'rgba(0,0,0,0.65)', color: 'rgba(255,255,255,0.85)', fontSize: '0.68rem', padding: '0.25rem 0.65rem', borderRadius: 4, backdropFilter: 'blur(6px)', pointerEvents: 'none', letterSpacing: '0.05em' }}>
                Change ↑
              </div>
            )}
          </div>
        ) : (
          <div style={{ padding: '3rem 2rem', textAlign: 'center', color: 'var(--a-muted)' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem', opacity: 0.35 }}>📷</div>
            <p style={{ fontSize: '0.82rem', marginBottom: '0.3rem', color: 'var(--a-text)' }}>Click or drag & drop a photo</p>
            <p style={{ fontSize: '0.72rem', color: 'rgba(232,230,225,0.28)' }}>JPG · PNG · WEBP · GIF</p>
          </div>
        )}
      </label>

      {hint && <p style={{ fontSize: '0.72rem', color: 'var(--a-muted)', marginTop: '0.4rem', lineHeight: 1.5 }}>{hint}</p>}
    </div>
  )
}

// ── Tab ───────────────────────────────────────────────────────────────
export default function ImagesTab() {
  const { images, uploadMainImage, uploadGalleryImage, updateGalleryLabel } = useWedding()

  return (
    <div>
      <h2 className="admin-page-title">Image Manager</h2>
      <p className="admin-page-sub">
        Upload photos directly — they're stored in <strong style={{ color: 'var(--a-accent)' }}>Firebase Storage</strong> and 
        appear instantly on the live site for all visitors, everywhere.
      </p>

      {/* Hero & Couple */}
      <div className="admin-card">
        <p className="admin-card-title">🖼 Main Images</p>
        <div className="admin-grid-2" style={{ gap: '1.5rem' }}>
          <ImageUploader
            label="Hero Background"
            currentSrc={images?.hero}
            storageKey="hero"
            onFile={(f) => uploadMainImage('hero', f)}
            hint="Full-screen image behind the couple's names. Landscape works best."
          />
          <ImageUploader
            label="Couple Photo"
            currentSrc={images?.couple}
            storageKey="couple"
            onFile={(f) => uploadMainImage('couple', f)}
            portrait
            hint="Shown in the Our Story section. Portrait orientation recommended."
          />
        </div>
      </div>

      {/* Gallery */}
      <div className="admin-card">
        <p className="admin-card-title">🎞 Gallery Images</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.25rem' }}>
          {(images?.gallery ?? []).map((img, i) => (
            <div key={i} style={{ background: 'rgba(255,255,255,0.025)', borderRadius: 8, padding: '1rem', border: '1px solid var(--a-border)' }}>
              <ImageUploader
                label={`Gallery Photo ${i + 1}`}
                currentSrc={img.src}
                storageKey={`gallery_${i}`}
                onFile={(f) => uploadGalleryImage(i, f)}
              />
              <div style={{ marginTop: '0.75rem' }}>
                <label className="admin-label">Caption</label>
                <input
                  className="admin-input"
                  value={img.label}
                  onChange={(e) => updateGalleryLabel(i, e.target.value)}
                  placeholder="e.g. The Ceremony"
                />
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(201,169,110,0.05)', borderRadius: 6, border: '1px solid rgba(201,169,110,0.12)' }}>
          <p style={{ fontSize: '0.78rem', color: 'var(--a-muted)', lineHeight: 1.7 }}>
            ☁️ <strong style={{ color: 'var(--a-accent)' }}>Firebase Storage:</strong> Images are stored in the cloud 
            and available to all guests instantly — no size limit, no browser-specific storage.
          </p>
        </div>
      </div>
    </div>
  )
}
