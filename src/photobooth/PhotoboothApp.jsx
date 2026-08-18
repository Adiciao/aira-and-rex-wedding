import { useState, useEffect, useRef } from 'react'
import { db, storage } from '../firebase'
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import './photobooth.css'

const THEMES = [
  { id: 'cloud-white', bg: '#fbfbfb', border: '#e2e8f0', text: '#1e293b', label: 'Cloud White' },
  { id: 'charcoal', bg: '#1c1f26', border: '#2d3748', text: '#f3f4f6', label: 'Charcoal' },
  { id: 'pastel-butter', bg: '#faf6e8', border: '#e8dcba', text: '#8c6d23', label: 'Pastel Butter' },
  { id: 'soft-matcha', bg: '#eef7f2', border: '#cce6d6', text: '#2d6a4f', label: 'Soft Matcha' },
  { id: 'soft-lavender', bg: '#f6f2fb', border: '#e4d6f3', text: '#623193', label: 'Soft Lavender' },
  { id: 'silvery', bg: '#eef1f6', border: '#cbd5e1', text: '#475569', label: 'Silvery' },
]

export default function PhotoboothApp() {
  const [tab, setTab] = useState('camera') // 'camera', 'gallery', 'live-wall'
  const [guestName, setGuestName] = useState('')
  const [isCapturing, setIsCapturing] = useState(false)
  const [countdown, setCountdown] = useState(null)
  const [capturedPhotos, setCapturedPhotos] = useState([])
  const [currentSlot, setCurrentSlot] = useState(0)
  const [flashActive, setFlashActive] = useState(false)
  const [frameTheme, setFrameTheme] = useState(THEMES[0])
  const [finalizedStrip, setFinalizedStrip] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [recentStrips, setRecentStrips] = useState([])
  const [galleryStrips, setGalleryStrips] = useState([])
  const [cameraBlocked, setCameraBlocked] = useState(false)
  const [simulatorMode, setSimulatorMode] = useState(false)
  
  const videoRef = useRef(null)
  const streamRef = useRef(null)
  const canvasRef = useRef(null)
  const previewCanvasRef = useRef(null)

  // Fetch strips for gallery and live wall
  useEffect(() => {
    const q = query(collection(db, 'photostrips'), orderBy('created_at', 'desc'))
    const unsub = onSnapshot(q, (snap) => {
      const list = snap.docs.map(d => ({ id: d.id, ...d.data() }))
      setGalleryStrips(list)
      // Limit recent to first 5 items
      setRecentStrips(list.slice(0, 5))
    }, (err) => console.error(err))

    return unsub
  }, [])

  // Start/Stop Camera stream depending on tab and state
  useEffect(() => {
    if (tab === 'camera' && !finalizedStrip && !simulatorMode) {
      startCamera()
    } else {
      stopCamera()
    }
    return () => stopCamera()
  }, [tab, finalizedStrip, simulatorMode])

  const startCamera = async () => {
    stopCamera()
    try {
      setCameraBlocked(false)
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: 'user' },
        audio: false
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch (err) {
      console.warn('Camera access blocked/unsupported:', err)
      setCameraBlocked(true)
      setSimulatorMode(true) // Fallback to simulator mode immediately
    }
  }

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
  }

  // Generate Simulated photo poses on canvas helper
  const drawSimulatedPose = (index) => {
    const canvas = document.createElement('canvas')
    canvas.width = 640
    canvas.height = 480
    const ctx = canvas.getContext('2d')

    // Create a beautiful modern gradient
    const grad = ctx.createLinearGradient(0, 0, 640, 480)
    const gradients = [
      ['#ff9a9e', '#fecfef'], // Pink
      ['#a1c4fd', '#c2e9fb'], // Blue
      ['#d4fc79', '#96e6a1'], // Green
      ['#cfd9df', '#e2ebf0']  // Silver
    ]
    const colors = gradients[index % gradients.length]
    grad.addColorStop(0, colors[0])
    grad.addColorStop(1, colors[1])
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, 640, 480)

    // Emojis mapping
    const emojis = ['🧀', '🥰', '✌️', '💖']
    const prompts = [
      'Say Cheese!',
      'Blow a Kiss!',
      'Gimme Peace!',
      'Double Heart!'
    ]

    // Draw Emoji
    ctx.font = '80px sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(emojis[index], 320, 200)

    // Draw prompts
    ctx.fillStyle = '#0f172a'
    ctx.font = 'bold 24px sans-serif'
    ctx.fillText(`Pose ${index + 1}: ${prompts[index]}`, 320, 310)

    ctx.fillStyle = 'rgba(15, 23, 42, 0.4)'
    ctx.font = 'italic 16px serif'
    ctx.fillText('Aira & Rex Wedding Photobooth Simulator', 320, 360)

    return canvas.toDataURL('image/jpeg')
  }

  // Camera snap photo trigger
  const capturePhoto = () => {
    if (simulatorMode) {
      const dataUrl = drawSimulatedPose(capturedPhotos.length)
      setCapturedPhotos(prev => [...prev, dataUrl])
      triggerFlash()
      return
    }

    if (videoRef.current) {
      const canvas = document.createElement('canvas')
      canvas.width = 640
      canvas.height = 480
      const ctx = canvas.getContext('2d')
      
      // Draw video frame to canvas
      ctx.translate(640, 0)
      ctx.scale(-1, 1) // Mirror effect for natural feel
      ctx.drawImage(videoRef.current, 0, 0, 640, 480)
      
      const dataUrl = canvas.toDataURL('image/jpeg')
      setCapturedPhotos(prev => [...prev, dataUrl])
      triggerFlash()
    }
  }

  const triggerFlash = () => {
    setFlashActive(true)
    setTimeout(() => setFlashActive(false), 200)
  }

  // Capture loop logic (sequentially snap 4 photos)
  const handleStartCapture = () => {
    if (!guestName.trim()) {
      alert("Please enter your name/nickname before snapping photos!")
      return
    }
    setIsCapturing(true)
    setCapturedPhotos([])
    setCurrentSlot(0)
    runCaptureCycle(0)
  }

  const runCaptureCycle = (slotIndex) => {
    let count = 3
    setCountdown(count)
    
    const interval = setInterval(() => {
      count--
      if (count > 0) {
        setCountdown(count)
      } else {
        clearInterval(interval)
        setCountdown(null)
        // Capture photo
        capturePhoto()
        
        const nextSlot = slotIndex + 1
        if (nextSlot < 4) {
          setCurrentSlot(nextSlot)
          setTimeout(() => runCaptureCycle(nextSlot), 800) // Delay before starting next capture countdown
        } else {
          // Finished snapping all 4 photos!
          setTimeout(() => {
            setIsCapturing(false)
            setCountdown(null)
          }, 1000)
        }
      }
    }, 1000)
  }

  // Dynamic Photo Strip compilation canvas renderer
  useEffect(() => {
    if (capturedPhotos.length === 4 && previewCanvasRef.current) {
      const canvas = previewCanvasRef.current
      canvas.width = 400
      canvas.height = 1200
      const ctx = canvas.getContext('2d')

      // Draw background
      ctx.fillStyle = frameTheme.bg
      ctx.fillRect(0, 0, 400, 1200)

      // Draw photos
      let loadedCount = 0
      capturedPhotos.forEach((src, idx) => {
        const img = new Image()
        img.onload = () => {
          // Photo dimensions: 360 x 240 (leaves 20px padding left/right)
          const y = 20 + idx * 265 // 20px padding top + spacing
          ctx.drawImage(img, 20, y, 360, 250)
          
          // Draw thin frame border around photo
          ctx.strokeStyle = frameTheme.border
          ctx.lineWidth = 2
          ctx.strokeRect(20, y, 360, 250)

          loadedCount++
          if (loadedCount === 4) {
            // Once all photos are drawn, render the bottom text + barcode
            drawStripTextAndBarcode(ctx)
          }
        }
        img.src = src
      })
    }
  }, [capturedPhotos, frameTheme])

  const drawStripTextAndBarcode = (ctx) => {
    const themeText = frameTheme.text
    
    // Draw Wedding title
    ctx.fillStyle = themeText
    ctx.textAlign = 'center'
    
    ctx.font = 'bold 22px "Cormorant Garamond", serif'
    ctx.fillText('AIRA & REX', 200, 1095)
    
    ctx.font = '11px sans-serif'
    ctx.letterSpacing = '3px'
    ctx.fillText('OUR WEDDING DAY', 200, 1118)

    ctx.font = '10px sans-serif'
    ctx.fillText('OCTOBER 17, 2026', 200, 1135)

    // Draw simulated Barcode
    const barcodeY = 1150
    const barcodeHeight = 25
    ctx.fillStyle = themeText

    // Draw 30 random-looking barcode lines
    let xOffset = 90
    const lineWeights = [1, 2, 4, 1, 3, 1, 4, 2, 1, 2, 3, 1, 4, 1, 2, 1, 3, 4, 1, 2, 1, 4, 2, 1, 3, 1, 2, 4, 1, 2]
    lineWeights.forEach((w) => {
      ctx.fillRect(xOffset, barcodeY, w, barcodeHeight)
      xOffset += w + 2 // width plus spacing
    })

    // Barcode Text
    ctx.font = '9px sans-serif'
    ctx.letterSpacing = '1px'
    ctx.fillText('AIRA-REX-2026', 200, 1188)
  }

  // Handle finalize and upload to Firebase
  const handleFinalizeAndUpload = async () => {
    if (!previewCanvasRef.current) return
    setUploading(true)
    
    try {
      const barcodeId = 'AR-' + Math.floor(1000 + Math.random() * 9000)
      const canvas = previewCanvasRef.current
      
      // 1. Convert canvas to blob
      const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'))
      
      // 2. Upload to Firebase Storage
      const storagePath = `photostrips/strip_${Date.now()}_${barcodeId}.png`
      const storageRef = ref(storage, storagePath)
      await uploadBytes(storageRef, blob)
      const downloadUrl = await getDownloadURL(storageRef)

      // 3. Save reference metadata to Firestore
      await addDoc(collection(db, 'photostrips'), {
        guest_name: guestName.trim(),
        image_url: downloadUrl,
        storage_path: storagePath,
        barcode_id: barcodeId,
        theme_id: frameTheme.id,
        created_at: serverTimestamp(),
        approved: true, // Default to true so it immediately shows up on projector
      })

      setFinalizedStrip({
        url: downloadUrl,
        barcode: barcodeId
      })
    } catch (err) {
      alert('Upload failed: ' + err.message)
    } finally {
      setUploading(false)
    }
  }

  // Download locally
  const handleDownloadLocally = () => {
    if (!previewCanvasRef.current) return
    const url = previewCanvasRef.current.toDataURL('image/png')
    const link = document.createElement('a')
    link.download = `aira_rex_photostrip_${guestName || 'guest'}.png`
    link.href = url
    link.click()
  }

  const handleStartNew = () => {
    setCapturedPhotos([])
    setFinalizedStrip(null)
    setTab('camera')
  }

  return (
    <div className="photobooth-shell">
      {/* Sidebar Navigation */}
      <aside className="pb-sidebar">
        <div className="pb-logo">
          <h1>Aira &amp; Rex</h1>
          <p>Wedding Photobooth</p>
        </div>

        <nav className="pb-nav">
          <button 
            className={`pb-nav-btn ${tab === 'camera' ? 'active' : ''}`}
            onClick={() => { setTab('camera'); if (finalizedStrip) handleStartNew(); }}
          >
            <span className="icon">📷</span>
            <span>Photobooth</span>
          </button>
          <button 
            className={`pb-nav-btn ${tab === 'gallery' ? 'active' : ''}`}
            onClick={() => setTab('gallery')}
          >
            <span className="icon">🖼</span>
            <span>Gallery</span>
          </button>
          <button 
            className={`pb-nav-btn ${tab === 'live-wall' ? 'active' : ''}`}
            onClick={() => setTab('live-wall')}
          >
            <span className="icon">📺</span>
            <span>Live Wall</span>
          </button>
        </nav>

        <div className="pb-sidebar-footer">
          <button className="pb-btn pb-btn-secondary pb-btn-ghost" onClick={handleStartNew}>
            <span>+ Start New</span>
          </button>
          <a href="/" style={{ textDecoration: 'none', color: 'var(--pb-muted)', fontSize: '0.72rem', textAlign: 'center', marginTop: '0.5rem' }}>
            ← Back to Invitation
          </a>
        </div>
      </aside>

      {/* Main Panel Content */}
      <main className="pb-main">
        {/* Gallery Tab */}
        {tab === 'gallery' && (
          <>
            <div className="pb-title-bar">
              <h2>Guest Photo Strips</h2>
              <p>Flip through all the photo strips captured by wedding guests.</p>
            </div>

            {galleryStrips.length === 0 ? (
              <div style={{ textAlign: 'center', color: 'var(--pb-muted)', padding: '5rem 0' }}>
                <span style={{ fontSize: '3rem', display: 'block', marginBottom: '1rem', opacity: 0.3 }}>🎞</span>
                <p>No photostrips captured yet. Be the first to snap poses!</p>
              </div>
            ) : (
              <div className="pb-gallery-grid">
                {galleryStrips.map(strip => (
                  <div key={strip.id} className="pb-gallery-card" onClick={() => window.open(strip.image_url, '_blank')}>
                    <div className="pb-gallery-img-container">
                      <img src={strip.image_url} alt={`Photostrip by ${strip.guest_name}`} />
                    </div>
                    <p>{strip.guest_name}</p>
                    <span>{strip.barcode_id || 'AR-2026'}</span>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Live Wall Tab */}
        {tab === 'live-wall' && (
          <LiveWallView 
            strips={galleryStrips} 
            onClose={() => setTab('camera')} 
          />
        )}

        {/* Camera/Interactive Capture Tab */}
        {tab === 'camera' && (
          <>
            <div className="pb-title-bar">
              <h2>Memory Capturer</h2>
              <p>Take 4 shots and print your customized wedding photostrip!</p>
            </div>

            {/* If finalized, show Download Screen */}
            {finalizedStrip ? (
              <div className="pb-grid-2">
                <div className="pb-card">
                  <h3 className="pb-card-title">Success Panel</h3>
                  <div style={{ textAlign: 'center', padding: '1.5rem 0', display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
                    <div style={{ fontSize: '3rem', color: 'var(--pb-success)' }}>✓</div>
                    <h4 style={{ fontSize: '1.2rem', margin: 0 }}>Photo Strip Saved!</h4>
                    <p style={{ fontSize: '0.88rem', color: 'var(--pb-muted)', maxWidth: '280px', margin: '0 auto' }}>
                      Your photostrip is successfully uploaded to the wedding gallery and cast to the Live Wall!
                    </p>
                    
                    <button className="pb-btn pb-btn-primary" onClick={handleDownloadLocally} style={{ width: '100%', marginTop: '1.5rem' }}>
                      📥 Download My E-Copy
                    </button>
                    
                    <button className="pb-btn pb-btn-secondary" onClick={handleStartNew} style={{ width: '100%' }}>
                      📷 Back to Camera
                    </button>
                  </div>
                </div>

                <div className="pb-card" style={{ alignItems: 'center' }}>
                  <h3 className="pb-card-title">Your Digital Strip</h3>
                  <div style={{ marginTop: '1rem' }}>
                    <img src={finalizedStrip.url} style={{ maxHeight: '420px', borderRadius: '4px', boxShadow: '0 8px 24px rgba(0,0,0,0.3)' }} alt="Finalized Strip" />
                  </div>
                </div>
              </div>
            ) : (
              /* If capturing/configuring camera */
              <div className="pb-grid-2">
                {/* Left Side Capture Box */}
                <div className="pb-card">
                  <h3 className="pb-card-title">1. Guest Interaction Zone</h3>
                  
                  {/* Camera view */}
                  <div className="pb-camera-zone">
                    <div className="pb-camera-viewport">
                      <div className={`pb-camera-flash ${flashActive ? 'flash-active' : ''}`} />
                      
                      {isCapturing && countdown !== null && (
                        <div className="pb-camera-overlay-countdown">{countdown}</div>
                      )}

                      {simulatorMode ? (
                        <div className="pb-camera-placeholder" style={{ background: '#1c1f26' }}>
                          <span style={{ fontSize: '2.5rem' }}>🤖</span>
                          <div>
                            <p style={{ fontWeight: 600, margin: '0 0 0.25rem 0', color: 'var(--pb-accent)' }}>Simulator Active</p>
                            <p style={{ fontSize: '0.72rem', margin: 0, color: 'var(--pb-muted)', maxWidth: '240px' }}>
                              {cameraBlocked ? 'Hardware blocked. Simulated poses will trigger cheese frames.' : 'Click to take a mocked test run.'}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <video ref={videoRef} className="pb-camera-video" autoPlay playsInline muted />
                      )}
                    </div>

                    {/* Captures Slots Preview */}
                    <div className="pb-sidebar-thumbs">
                      {[0, 1, 2, 3].map(idx => (
                        <div key={idx} className="pb-thumb-slot" style={{ borderColor: currentSlot === idx && isCapturing ? 'var(--pb-accent)' : '' }}>
                          {capturedPhotos[idx] ? (
                            <img src={capturedPhotos[idx]} alt={`Pose ${idx + 1}`} />
                          ) : (
                            <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', opacity: 0.25 }}>📷</div>
                          )}
                          <span className="slot-num">{idx + 1}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions footer */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                      <input 
                        type="text"
                        className="admin-input" 
                        placeholder="Enter your name/nickname..."
                        value={guestName}
                        onChange={e => setGuestName(e.target.value)}
                        disabled={isCapturing}
                        style={{ flex: 1, height: '44px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--pb-border)', borderRadius: '8px', padding: '0 1rem', color: '#fff', outline: 'none' }}
                      />
                      <button 
                        className="pb-btn pb-btn-primary" 
                        onClick={handleStartCapture} 
                        disabled={isCapturing || !guestName.trim()}
                        style={{ height: '44px' }}
                      >
                        {isCapturing ? 'Snapping...' : 'Tap to Snap Poses'}
                      </button>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.72rem', color: 'var(--pb-muted)' }}>
                      <span>Status: {simulatorMode ? 'Simulator fallback active' : 'Device camera ready'}</span>
                      {!cameraBlocked && (
                        <button 
                          onClick={() => setSimulatorMode(!simulatorMode)}
                          style={{ background: 'none', border: 'none', color: 'var(--pb-accent)', cursor: 'pointer', fontSize: '0.72rem', textDecoration: 'underline' }}
                        >
                          Switch to {simulatorMode ? 'Real Camera' : 'Simulator'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Side Review Strip & Customizer */}
                <div className="pb-card">
                  <h3 className="pb-card-title">2. Review &amp; Customize</h3>

                  {capturedPhotos.length < 4 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', height: '360px', alignItems: 'center', justifyContent: 'center', color: 'var(--pb-muted)', textAlign: 'center', opacity: 0.7 }}>
                      <span style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🎞</span>
                      <p style={{ margin: 0, fontSize: '0.88rem' }}>Take all 4 snaps in the Interaction Zone to customize your photo strip.</p>
                    </div>
                  ) : (
                    <>
                      {/* Theme swatches selection */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--pb-muted)', fontWeight: 500 }}>Frame Color Theme</label>
                        <div className="swatch-group">
                          {THEMES.map(theme => (
                            <button
                              key={theme.id}
                              className={`swatch-circle ${frameTheme.id === theme.id ? 'selected' : ''}`}
                              style={{ background: theme.bg }}
                              onClick={() => setFrameTheme(theme)}
                              title={theme.label}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Compiled preview canvas */}
                      <div className="pb-strip-preview-box">
                        <canvas ref={previewCanvasRef} className="pb-strip-canvas" />
                      </div>

                      {/* Finalize Action buttons */}
                      <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                        <button 
                          className="pb-btn pb-btn-primary" 
                          onClick={handleFinalizeAndUpload}
                          disabled={uploading}
                          style={{ flex: 1 }}
                        >
                          {uploading ? 'Finalizing...' : 'Upload & Cast to Live Wall'}
                        </button>
                        <button 
                          className="pb-btn pb-btn-secondary" 
                          onClick={handleDownloadLocally}
                          disabled={uploading}
                        >
                          📥 Download Strip
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Bottom Panel: Recently Uploaded photostrips */}
            <div className="pb-card" style={{ marginTop: '1.5rem' }}>
              <h3 className="pb-card-title">Recently Uploaded Strips</h3>
              {recentStrips.length === 0 ? (
                <p style={{ fontSize: '0.85rem', color: 'var(--pb-muted)', margin: 0, fontStyle: 'italic' }}>No strips uploaded recently.</p>
              ) : (
                <div className="pb-recent-strips-list">
                  {recentStrips.map(strip => (
                    <div key={strip.id} className="pb-recent-item">
                      <img src={strip.image_url} alt="Strip Thumbnail" />
                      <div className="pb-recent-info">
                        <h4>{strip.guest_name}</h4>
                        <p>Uploaded: {strip.created_at ? new Date(strip.created_at.toMillis()).toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' }) : 'just now'}</p>
                      </div>
                      <span style={{ fontSize: '0.72rem', color: 'var(--pb-accent)', background: 'rgba(201,169,110,0.1)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontWeight: 600 }}>{strip.barcode_id || 'AR-2026'}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  )
}

/* Projection View designed for Reception Screens */
function LiveWallView({ strips, onClose }) {
  const [index, setIndex] = useState(0)

  // Cycle strips every 5 seconds
  useEffect(() => {
    if (strips.length <= 3) return
    const interval = setInterval(() => {
      setIndex(prev => (prev + 3 >= strips.length ? 0 : prev + 3))
    }, 5000)
    return () => clearInterval(interval)
  }, [strips])

  const visibleStrips = strips.slice(index, index + 3)

  return (
    <div className="pb-live-wall-container">
      <button className="pb-live-wall-close" onClick={onClose}>✕</button>
      
      <div className="pb-live-wall-header">
        <h2>AIRA &amp; REX'S LIVE WALL</h2>
        <p>Live photostrips broadcast • Scan QR code to snap yours!</p>
      </div>

      <div className="pb-live-wall-display">
        {strips.length === 0 ? (
          <div className="pb-live-wall-empty">
            <span style={{ fontSize: '4rem' }}>🎞</span>
            <p>Waiting for guests to capture photostrips...</p>
          </div>
        ) : (
          visibleStrips.map(strip => (
            <div key={strip.id} className="pb-live-strip-card">
              <img src={strip.image_url} alt="Projector Live Strip" />
            </div>
          ))
        )}
      </div>
    </div>
  )
}
