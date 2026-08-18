import { useState, useEffect, useRef } from 'react'
import { db, storage } from '../firebase'
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import './photobooth.css'

const THEMES = [
  { id: 'lavender-light', bg: '#f7f2fc', border: '#e9dbf7', text: '#5a2d82', label: 'Light Lavender' },
  { id: 'lilac-medium', bg: '#eee4f5', border: '#dbcaec', text: '#4e1a70', label: 'Classic Lilac' },
  { id: 'wisteria-soft', bg: '#e4d5f2', border: '#ccafe3', text: '#3c0d5c', label: 'Wisteria' },
  { id: 'amethyst-rich', bg: '#7c5295', border: '#623c78', text: '#ffffff', label: 'Rich Amethyst' },
  { id: 'plum-deep', bg: '#4d2e43', border: '#3a2032', text: '#f7f2fc', label: 'Deep Plum' },
  { id: 'midnight-purple', bg: '#23182b', border: '#170e1e', text: '#eedef7', label: 'Midnight Purple' },
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
  const [mirrorCamera, setMirrorCamera] = useState(false)
  
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
      setRecentStrips(list.slice(0, 5))
    }, (err) => console.error(err))

    return unsub
  }, [])

  // Start/Stop Camera stream
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
      setSimulatorMode(true)
    }
  }

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
  }

  // Draw simulated poses
  const drawSimulatedPose = (index) => {
    const canvas = document.createElement('canvas')
    canvas.width = 640
    canvas.height = 480
    const ctx = canvas.getContext('2d')

    const grad = ctx.createLinearGradient(0, 0, 640, 480)
    const gradients = [
      ['#fdfbfb', '#ebedee'], // Lavender Cloud
      ['#e0c3fc', '#8ec5fc'], // Lilac Blue
      ['#f093fb', '#f5576c'], // Purple Pink
      ['#a6c0fe', '#f1a7f1']  // Soft Wisteria
    ]
    const colors = gradients[index % gradients.length]
    grad.addColorStop(0, colors[0])
    grad.addColorStop(1, colors[1])
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, 640, 480)

    const emojis = ['🧀', '🥰', '✌️', '💖']
    const prompts = ['Say Cheese!', 'Blow a Kiss!', 'Peace Sign!', 'Heart Hands!']

    ctx.font = '85px sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(emojis[index], 320, 200)

    ctx.fillStyle = '#422a5c'
    ctx.font = 'bold 24px sans-serif'
    ctx.fillText(`Pose ${index + 1}: ${prompts[index]}`, 320, 310)

    ctx.fillStyle = 'rgba(66, 42, 92, 0.4)'
    ctx.font = 'italic 16px serif'
    ctx.fillText('Aira & Rex Wedding Photobooth', 320, 360)

    return canvas.toDataURL('image/jpeg')
  }

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
      
      if (mirrorCamera) {
        ctx.translate(640, 0)
        ctx.scale(-1, 1)
      }
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

  const handleStartCapture = () => {
    if (!guestName.trim()) {
      alert("Please enter your name/nickname before taking a photo!")
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
        capturePhoto()
        
        const nextSlot = slotIndex + 1
        if (nextSlot < 4) {
          setCurrentSlot(nextSlot)
          setTimeout(() => runCaptureCycle(nextSlot), 800)
        } else {
          setTimeout(() => {
            setIsCapturing(false)
            setCountdown(null)
          }, 1000)
        }
      }
    }, 1000)
  }

  // Draw final photo strip
  useEffect(() => {
    if (capturedPhotos.length === 4 && previewCanvasRef.current) {
      const canvas = previewCanvasRef.current
      canvas.width = 400
      canvas.height = 1200
      const ctx = canvas.getContext('2d')

      ctx.fillStyle = frameTheme.bg
      ctx.fillRect(0, 0, 400, 1200)

      let loadedCount = 0
      capturedPhotos.forEach((src, idx) => {
        const img = new Image()
        img.onload = () => {
          const y = 20 + idx * 265
          const w = 360;
          const h = 250;
          const targetRatio = w / h;
          const imgRatio = img.width / img.height;
          let sx = 0, sy = 0, sw = img.width, sh = img.height;
          
          if (imgRatio > targetRatio) {
            sw = img.height * targetRatio;
            sx = (img.width - sw) / 2;
          } else {
            sh = img.width / targetRatio;
            sy = (img.height - sh) / 2;
          }
          
          ctx.drawImage(img, sx, sy, sw, sh, 20, y, w, h);
          
          ctx.strokeStyle = frameTheme.border
          ctx.lineWidth = 2
          ctx.strokeRect(20, y, 360, 250)

          loadedCount++
          if (loadedCount === 4) {
            drawStripTextAndBarcode(ctx)
          }
        }
        img.src = src
      })
    }
  }, [capturedPhotos, frameTheme])

  const drawStripTextAndBarcode = (ctx) => {
    const themeText = frameTheme.text
    ctx.fillStyle = themeText
    ctx.textAlign = 'center'
    
    ctx.font = 'bold 22px "Cormorant Garamond", serif'
    ctx.fillText('AIRA & REX', 200, 1095)
    
    ctx.font = '11px sans-serif'
    ctx.letterSpacing = '3px'
    ctx.fillText('OUR WEDDING DAY', 200, 1118)

    ctx.font = '10px sans-serif'
    ctx.fillText('OCTOBER 17, 2026', 200, 1135)

    const barcodeY = 1150
    const barcodeHeight = 25
    ctx.fillStyle = themeText

    let xOffset = 90
    const lineWeights = [1, 2, 4, 1, 3, 1, 4, 2, 1, 2, 3, 1, 4, 1, 2, 1, 3, 4, 1, 2, 1, 4, 2, 1, 3, 1, 2, 4, 1, 2]
    lineWeights.forEach((w) => {
      ctx.fillRect(xOffset, barcodeY, w, barcodeHeight)
      xOffset += w + 2
    })

    ctx.font = '9px sans-serif'
    ctx.letterSpacing = '1px'
    ctx.fillText('AIRA-REX-2026', 200, 1188)
  }

  const handleFinalizeAndUpload = async () => {
    if (!previewCanvasRef.current) return
    setUploading(true)
    
    try {
      const barcodeId = 'AR-' + Math.floor(1000 + Math.random() * 9000)
      const canvas = previewCanvasRef.current
      const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'))
      
      const storagePath = `photostrips/strip_${Date.now()}_${barcodeId}.png`
      const storageRef = ref(storage, storagePath)
      await uploadBytes(storageRef, blob)
      const downloadUrl = await getDownloadURL(storageRef)

      await addDoc(collection(db, 'photostrips'), {
        guest_name: guestName.trim(),
        image_url: downloadUrl,
        storage_path: storagePath,
        barcode_id: barcodeId,
        theme_id: frameTheme.id,
        created_at: serverTimestamp(),
        approved: true,
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
    <div className="ios-shell">
      {/* iOS Status Top Bar */}
      <header className="ios-top-bar">
        <a href="/" className="ios-back-link" title="Back to invitation">
          <span className="ios-arrow">‹</span> Invitation
        </a>
        <h1 className="ios-page-title">PHOTOBOOTH</h1>
        <div style={{ width: '60px' }} /> {/* Spacer */}
      </header>

      {/* Main View Area */}
      <div className="ios-content-container">
        
        {/* Gallery Mode */}
        {tab === 'gallery' && (
          <div className="ios-gallery-panel">
            <div className="ios-gallery-header">
              <h2>Wedding Album</h2>
              <p>Captured moments by wedding guests</p>
            </div>
            {galleryStrips.length === 0 ? (
              <div className="ios-empty-state">
                <span>🎞</span>
                <p>No strips captured yet. Be the first!</p>
              </div>
            ) : (
              <div className="ios-gallery-grid">
                {galleryStrips.map(strip => (
                  <div key={strip.id} className="ios-gallery-card" onClick={() => window.open(strip.image_url, '_blank')}>
                    <div className="ios-gallery-card-img">
                      <img src={strip.image_url} alt="Strip" />
                    </div>
                    <div className="ios-gallery-card-footer">
                      <strong>{strip.guest_name}</strong>
                      <span>{strip.barcode_id || 'AR-2026'}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Live Wall Mode */}
        {tab === 'live-wall' && (
          <div className="ios-live-wall-overlay">
            <LiveWallView strips={galleryStrips} onClose={() => setTab('camera')} />
          </div>
        )}

        {/* Camera Viewfinder (PHOTOBOOTH) Mode */}
        {tab === 'camera' && (
          <div className="ios-camera-container">
            {finalizedStrip ? (
              /* Success Download Screen */
              <div className="ios-success-slide">
                <div className="ios-success-card">
                  <div className="ios-success-checkmark">✓</div>
                  <h3>Strip Finalized!</h3>
                  <p>Your photo strip is live on the projector wall and saved to the guest gallery.</p>
                  
                  <div className="ios-success-buttons">
                    <button className="ios-action-btn ios-action-primary" onClick={handleDownloadLocally}>
                      📥 Download PNG E-Copy
                    </button>
                    <button className="ios-action-btn ios-action-secondary" onClick={handleStartNew}>
                      📷 Snap Another One
                    </button>
                  </div>
                </div>

                <div className="ios-success-preview">
                  <img src={finalizedStrip.url} alt="Final Strip" />
                </div>
              </div>
            ) : (
              /* Camera / Capture Phase */
              <div className="ios-viewfinder-stack">
                
                {/* Viewfinder Window */}
                <div className="ios-viewfinder">
                  <div className={`pb-camera-flash ${flashActive ? 'flash-active' : ''}`} />
                  
                  {/* Grid Overlay lines (iPhone style!) */}
                  <div className="ios-viewfinder-grid">
                    <div className="grid-h grid-h-1" />
                    <div className="grid-h grid-h-2" />
                    <div className="grid-v grid-v-1" />
                    <div className="grid-v grid-v-2" />
                  </div>

                  {isCapturing && countdown !== null && (
                    <div className="ios-viewfinder-countdown">{countdown}</div>
                  )}

                  {/* Simulator Overlay */}
                  {simulatorMode ? (
                    <div className="pb-camera-placeholder" style={{ background: 'var(--pb-bg)' }}>
                      <span style={{ fontSize: '3rem' }}>🤖</span>
                      <div>
                        <p style={{ fontWeight: 600, margin: '0 0 0.25rem 0', color: 'var(--pb-text)' }}>Simulator Mode Active</p>
                        <p style={{ fontSize: '0.72rem', margin: 0, color: 'var(--pb-muted)', maxWidth: '220px' }}>
                          Camera is inactive. Simulated wedding poses will compile on your final photo strip.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <video 
                      ref={videoRef} 
                      className="pb-camera-video" 
                      autoPlay 
                      playsInline 
                      muted 
                      style={{ transform: mirrorCamera ? 'scaleX(-1)' : 'none' }}
                    />
                  )}

                  {/* Mini thumbnail slots overlay (iPhone live preview style!) */}
                  <div className="ios-mini-previews">
                    {[0, 1, 2, 3].map(idx => (
                      <div key={idx} className={`ios-mini-thumb ${currentSlot === idx && isCapturing ? 'active' : ''}`}>
                        {capturedPhotos[idx] ? (
                          <img src={capturedPhotos[idx]} alt="Snap" />
                        ) : (
                          <span style={{ fontSize: '0.65rem', opacity: 0.3 }}>{idx + 1}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Nickname Input Bar */}
                <div className="ios-input-bar">
                  <input 
                    type="text" 
                    placeholder="Enter guest name..." 
                    value={guestName}
                    onChange={e => setGuestName(e.target.value)}
                    disabled={isCapturing}
                    className="ios-text-input"
                  />
                </div>

                {/* Customizer Slider: Only active once 4 snaps are taken */}
                {capturedPhotos.length === 4 && (
                  <div className="ios-customizer-drawer">
                    <div className="ios-drawer-header">
                      <span>🎨 FRAME THEME</span>
                    </div>
                    
                    {/* Swatches horizontal slider */}
                    <div className="ios-swatches-slider">
                      {THEMES.map(theme => (
                        <button
                          key={theme.id}
                          className={`ios-swatch ${frameTheme.id === theme.id ? 'active' : ''}`}
                          style={{ background: theme.bg }}
                          onClick={() => setFrameTheme(theme)}
                          title={theme.label}
                        />
                      ))}
                    </div>

                    <div className="ios-drawer-compiled">
                      <canvas ref={previewCanvasRef} className="ios-drawer-canvas" />
                    </div>

                    <div className="ios-drawer-actions">
                      <button className="ios-action-btn ios-action-primary" onClick={handleFinalizeAndUpload} disabled={uploading}>
                        {uploading ? 'Processing...' : 'Upload & Cast to Live Wall'}
                      </button>
                      <button className="ios-action-btn ios-action-secondary" onClick={handleDownloadLocally}>
                        📥 Save Strip
                      </button>
                      <button className="ios-action-btn ios-action-ghost" onClick={handleStartNew}>
                        Retake Snaps
                      </button>
                    </div>
                  </div>
                )}

                {/* Bottom Camera Settings Info bar */}
                <div className="ios-camera-info-bar">
                  <span>{simulatorMode ? 'Simulator Active' : 'Real Camera Stream'}</span>
                  <div style={{ display: 'flex', gap: '0.8rem' }}>
                    {!simulatorMode && (
                      <button onClick={() => setMirrorCamera(!mirrorCamera)} className="ios-bar-link">
                        {mirrorCamera ? 'Unmirror Feed' : 'Mirror Feed'}
                      </button>
                    )}
                    {!cameraBlocked && (
                      <button onClick={() => setSimulatorMode(!simulatorMode)} className="ios-bar-link">
                        {simulatorMode ? 'Use Lens' : 'Use Simulator'}
                      </button>
                    )}
                  </div>
                </div>

              </div>
            )}
          </div>
        )}
      </div>

      {/* iOS Bottom Native Mode Selector & Shutter bar */}
      {(!finalizedStrip || tab !== 'camera') && (
        <div className="ios-shutter-bar">
          {/* Modes Switcher label slider */}
          <div className="ios-modes-switcher">
            <button className={tab === 'gallery' ? 'active' : ''} onClick={() => setTab('gallery')}>
              GALLERY
            </button>
            <button className={tab === 'camera' ? 'active' : ''} onClick={() => setTab('camera')}>
              PHOTOBOOTH
            </button>
            <button className={tab === 'live-wall' ? 'active' : ''} onClick={() => setTab('live-wall')}>
              LIVE WALL
            </button>
          </div>

          {/* Shutter row */}
          <div className="ios-shutter-row">
            {/* Shutter Left: Last taken thumbnail roll preview */}
            <div className="ios-shutter-left">
              {galleryStrips[0] ? (
                <div className="ios-roll-preview" onClick={() => setTab('gallery')}>
                  <img src={galleryStrips[0].image_url} alt="Latest strip" />
                </div>
              ) : (
                <div className="ios-roll-preview-empty" />
              )}
            </div>

            {/* Shutter Center: Double ring capture button */}
            <div className="ios-shutter-center">
              {tab === 'camera' ? (
                <button 
                  className={`ios-shutter-btn ${isCapturing ? 'capturing' : ''}`}
                  onClick={handleStartCapture}
                  disabled={isCapturing || !guestName.trim()}
                  title={guestName.trim() ? 'Snap poses!' : 'Please enter your name first'}
                >
                  <div className="ios-shutter-inner" />
                </button>
              ) : (
                <div style={{ color: 'var(--pb-muted)', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {tab === 'gallery' ? 'Viewing Album' : 'Projector Wall'}
                </div>
              )}
            </div>

            {/* Shutter Right: Toggle Simulator / Reset */}
            <div className="ios-shutter-right">
              {tab === 'camera' && (
                <button 
                  className="ios-flip-btn" 
                  onClick={handleStartNew} 
                  title="Reset and start new"
                >
                  🔄
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function LiveWallView({ strips, onClose }) {
  const [index, setIndex] = useState(0)

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
      <button className="pb-live-wall-close" onClick={onClose}>✕ Close Projector</button>
      
      <div className="pb-live-wall-header">
        <h2>AIRA &amp; REX'S LIVE WALL</h2>
        <p>Live reception photostrips • Snap yours now!</p>
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
              <img src={strip.image_url} alt="Live projection" />
            </div>
          ))
        )}
      </div>
    </div>
  )
}
