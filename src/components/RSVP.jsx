import { useRef, useState, useEffect } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { useWedding } from '../context/WeddingContext'
import { collection, addDoc } from 'firebase/firestore'
import { db } from '../firebase'

const FIELD = {
  width: '100%', padding: '1rem 1.1rem', border: '1px solid var(--blush)', background: 'var(--cream)',
  color: 'var(--text)', fontFamily: 'var(--ff-sans)', fontSize: '0.93rem', outline: 'none',
  borderRadius: '1px', transition: 'border-color 0.3s, box-shadow 0.3s', WebkitAppearance: 'none',
}
const focus = e => { e.target.style.borderColor = 'var(--taupe)'; e.target.style.boxShadow = '0 0 0 3px rgba(139,115,85,0.1)' }
const blur  = e => { e.target.style.borderColor = 'var(--blush)';  e.target.style.boxShadow = 'none' }

export default function RSVP() {
  const { bride, groom, rsvpDeadline, submitRsvp } = useWedding()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  
  // RSVP Form States
  const [form, setForm] = useState({ first_name: '', last_name: '', email: '', guests: '1', attending: 'yes', message: '' })
  const [status, setStatus] = useState(() => {
    return localStorage.getItem('rsvp_completed') === 'true' ? 'success' : 'idle'
  })
  const upd = (k, v) => setForm(f => ({ ...f, [k]: v }))

  // React to in-chat request approvals in real-time
  useEffect(() => {
    const checkRsvp = () => {
      if (localStorage.getItem('rsvp_completed') === 'true') {
        setStatus('success')
      }
    }
    window.addEventListener('rsvp_updated', checkRsvp)
    window.addEventListener('storage', checkRsvp)
    return () => {
      window.removeEventListener('rsvp_updated', checkRsvp)
      window.removeEventListener('storage', checkRsvp)
    }
  }, [])

  // Whitelist Request Modal States
  const [showRequestModal, setShowRequestModal] = useState(false)
  const [reqForm, setReqForm] = useState({ first_name: '', last_name: '', email: '', relationship: "Bride's Friend", message: '' })
  const [reqStatus, setReqStatus] = useState('idle') // idle | loading | success
  const updReq = (k, v) => setReqForm(f => ({ ...f, [k]: v }))

  // Handle main RSVP submit
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.first_name || !form.last_name || !form.email) return
    setStatus('loading')
    try {
      await submitRsvp(form)
      localStorage.setItem('rsvp_completed', 'true')
      setStatus('success')
    } catch (err) {
      console.error('RSVP submit error:', err)
      setStatus('idle')

      // Check if blocked by whitelist
      if (err.message.includes('not on the guest list')) {
        if (localStorage.getItem('invitation_request_sent') === 'true') {
          alert('You have already submitted an invitation request. The couple is currently reviewing it.')
          setStatus('idle')
          return
        }
        // Pre-populate name & email into the request form
        setReqForm({
          first_name: form.first_name,
          last_name: form.last_name,
          email: form.email,
          relationship: "Bride's Friend",
          message: ''
        })
        setShowRequestModal(true)
      } else {
        alert(err.message || 'Could not submit RSVP. Please try again.')
      }
    }
  }

  // Handle invitation request submit
  const handleRequestSubmit = async (e) => {
    e.preventDefault()
    if (!reqForm.first_name || !reqForm.last_name || !reqForm.email) return
    setReqStatus('loading')
    try {
      await addDoc(collection(db, 'invitation_requests'), {
        first_name: reqForm.first_name,
        last_name: reqForm.last_name,
        email: reqForm.email,
        relationship: reqForm.relationship,
        message: reqForm.message,
        submitted_at: new Date().toISOString(),
      })
      localStorage.setItem('invitation_request_sent', 'true')
      setReqStatus('success')
    } catch (err) {
      alert('Failed to send request: ' + err.message)
      setReqStatus('idle')
    }
  }

  return (
    <section id="rsvp" ref={ref} style={{ padding: 'clamp(5rem, 10vw, 10rem) 2rem', background: 'var(--cream)', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: 0, right: 0, width: '40%', height: '100%', background: 'linear-gradient(to left, var(--blush), transparent)', opacity: 0.25, pointerEvents: 'none' }} />
      <div style={{ maxWidth: 700, margin: '0 auto', position: 'relative' }}>
        <motion.p initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} style={{ textAlign: 'center', fontFamily: 'var(--ff-sans)', fontSize: '0.65rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--taupe)', marginBottom: '1rem' }}>You Are Cordially Invited</motion.p>
        <motion.h2 initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }} style={{ textAlign: 'center', fontFamily: 'var(--ff-serif)', fontStyle: 'italic', fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 300, color: 'var(--text)', marginBottom: '0.5rem' }}>
          Kindly <span style={{ color: 'var(--taupe)' }}>RSVP</span>
        </motion.h2>

        <motion.p initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.2 }} style={{ textAlign: 'center', fontFamily: 'var(--ff-sans)', fontSize: '0.8rem', color: 'var(--text-soft)', marginBottom: '3.5rem', letterSpacing: '0.04em' }}>
          Please respond by {rsvpDeadline} to help us prepare.
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }} style={{ background: 'var(--cream-light)', padding: 'clamp(2rem, 5vw, 4rem)', border: '1px solid rgba(201,185,160,0.35)', boxShadow: '0 30px 100px rgba(139,115,85,0.08)' }}>
          <AnimatePresence mode="wait">
            {status === 'success' ? (
              <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} style={{ textAlign: 'center', padding: '2rem 0' }}>
                <span style={{ fontSize: '3rem', display: 'block', marginBottom: '1.5rem' }}>🕊</span>
                <h3 style={{ fontFamily: 'var(--ff-serif)', fontStyle: 'italic', fontSize: '2rem', color: 'var(--text)', marginBottom: '1rem', fontWeight: 300 }}>Thank You</h3>
                <p style={{ fontFamily: 'var(--ff-sans)', fontSize: '0.88rem', color: 'var(--text-soft)', lineHeight: 1.8, maxWidth: 450, margin: '0 auto' }}>
                  Your response has been received and saved successfully. We look forward to celebrating our special day with you!
                </p>
              </motion.div>
            ) : (
              <motion.form key="form" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div className="rsvp-form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                  <Label text="First Name" id="rsvp-first"><input id="rsvp-first" type="text" required value={form.first_name} onChange={e=>upd('first_name',e.target.value)} placeholder="Aira" style={FIELD} onFocus={focus} onBlur={blur}/></Label>
                  <Label text="Last Name" id="rsvp-last"><input id="rsvp-last" type="text" required value={form.last_name} onChange={e=>upd('last_name',e.target.value)} placeholder="Dela Cruz" style={FIELD} onFocus={focus} onBlur={blur}/></Label>
                </div>
                <Label text="Email Address" id="rsvp-email"><input id="rsvp-email" type="email" required value={form.email} onChange={e=>upd('email',e.target.value)} placeholder="you@example.com" style={FIELD} onFocus={focus} onBlur={blur}/></Label>
                
                <div className="rsvp-form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', alignItems: 'center' }}>
                  <Label text="Number of Guests" id="rsvp-guests">
                    <select id="rsvp-guests" value={form.guests} onChange={e=>upd('guests',e.target.value)} style={FIELD} onFocus={focus} onBlur={blur}>
                      {['1','2','3','4','5'].map(n => <option key={n} value={n}>{n}</option>)}
                    </select>
                  </Label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
                    <span style={{ fontFamily: 'var(--ff-sans)', fontSize: '0.68rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--text-soft)', fontWeight: 400 }}>Attending?</span>
                    <div style={{ display: 'flex', gap: '1.5rem', height: 47, alignItems: 'center' }}>
                      {[{val:'yes',label:'Accepts'},{val:'no',label:'Declines'}].map(opt => (
                        <label key={opt.val} style={{ display:'flex',alignItems:'center',gap:'0.6rem',cursor:'pointer',fontSize:'0.9rem',color:form.attending===opt.val?'var(--taupe)':'var(--text-soft)' }}>
                          <input type="radio" name="attending" value={opt.val} checked={form.attending===opt.val} onChange={()=>upd('attending',opt.val)} style={{display:'none'}}/>
                          <span style={{ width:18,height:18,borderRadius:'50%',border:`1.5px solid ${form.attending===opt.val?'var(--taupe)':'var(--champagne)'}`,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0 }}>
                            {form.attending===opt.val && <span style={{width:8,height:8,borderRadius:'50%',background:'var(--taupe)',display:'block'}}/>}
                          </span>
                          {opt.label}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
                <Label text="Message to the Couple" id="rsvp-message"><textarea id="rsvp-message" rows={3} value={form.message} onChange={e=>upd('message',e.target.value)} placeholder="Share your well-wishes..." style={{...FIELD,resize:'vertical',minHeight:90}} onFocus={focus} onBlur={blur}/></Label>
                <motion.button id="rsvp-submit-btn" type="submit" disabled={status==='loading'} whileHover={status!=='loading'?{scale:1.02,y:-1}:{}} whileTap={status!=='loading'?{scale:0.98}:{}} style={{ width:'100%',padding:'1.1rem',background:status==='loading'?'var(--champagne)':'var(--taupe)',color:'white',border:'none',fontFamily:'var(--ff-sans)',fontSize:'0.7rem',letterSpacing:'0.2em',textTransform:'uppercase',fontWeight:400,cursor:status==='loading'?'not-allowed':'pointer',transition:'background 0.3s',borderRadius:'1px',marginTop:'0.5rem' }}>
                  {status==='loading'?'Sending...':'Send Your RSVP ✦'}
                </motion.button>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* ── INVITATION REQUEST MODAL ───────────────────────────────────── */}
      <AnimatePresence>
        {showRequestModal && (
          <div style={{
            position: 'fixed', inset: 0,
            background: 'rgba(15,17,23,0.7)',
            backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 99999, padding: '1rem',
          }}>
            {/* Backdrop click closer */}
            <div style={{ position: 'absolute', inset: 0 }} onClick={() => reqStatus !== 'loading' && setShowRequestModal(false)} />
            
            {/* Modal Body */}
            <motion.div
              className="rsvp-modal-body"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              style={{
                position: 'relative',
                background: 'var(--cream-light)',
                border: '1px solid var(--blush)',
                borderRadius: 4,
                padding: '2.5rem',
                width: '100%', maxWidth: 500,
                boxShadow: '0 25px 60px rgba(0,0,0,0.2)',
                display: 'flex', flexDirection: 'column',
              }}
            >
              {/* Close Button */}
              {reqStatus !== 'loading' && (
                <button
                  onClick={() => setShowRequestModal(false)}
                  style={{
                    position: 'absolute', top: '1rem', right: '1.25rem',
                    border: 'none', background: 'none', fontSize: '1.5rem',
                    cursor: 'pointer', color: 'var(--text-soft)'
                  }}
                >
                  ✕
                </button>
              )}

              {reqStatus === 'success' ? (
                <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
                  <span style={{ fontSize: '3rem', display: 'block', marginBottom: '1rem' }}>✉️</span>
                  <h4 style={{ fontFamily: 'var(--ff-serif)', fontStyle: 'italic', fontSize: '1.6rem', color: 'var(--text)', marginBottom: '0.75rem', fontWeight: 300 }}>Request Sent</h4>
                  <p style={{ fontFamily: 'var(--ff-sans)', fontSize: '0.86rem', color: 'var(--text-soft)', lineHeight: 1.7, margin: '0 auto', maxWidth: 380 }}>
                    Your invitation request has been submitted to <strong>{groom} &amp; {bride}</strong> for review. You can close this window now.
                  </p>
                  <button
                    onClick={() => { setShowRequestModal(false); setReqStatus('idle') }}
                    style={{
                      marginTop: '1.5rem', padding: '0.75rem 2rem', background: 'var(--taupe)', color: 'white',
                      border: 'none', cursor: 'pointer', fontSize: '0.76rem', letterSpacing: '0.1em', textTransform: 'uppercase'
                    }}
                  >
                    Close Window
                  </button>
                </div>
              ) : (
                <form onSubmit={handleRequestSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                  <div>
                    <h4 style={{ fontFamily: 'var(--ff-serif)', fontStyle: 'italic', fontSize: '1.6rem', color: 'var(--text)', marginBottom: '0.4rem', fontWeight: 300 }}>Request an Invitation</h4>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-soft)', lineHeight: 1.5 }}>
                      We couldn't find your name on the guest list. Fill out this form and the couple will review it to add you.
                    </p>
                  </div>

                  <div className="rsvp-form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                      <label style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-soft)' }}>First Name</label>
                      <input type="text" required value={reqForm.first_name} onChange={e=>updReq('first_name',e.target.value)} style={{ ...FIELD, padding: '0.75rem 1rem' }} onFocus={focus} onBlur={blur} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                      <label style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-soft)' }}>Last Name</label>
                      <input type="text" required value={reqForm.last_name} onChange={e=>updReq('last_name',e.target.value)} style={{ ...FIELD, padding: '0.75rem 1rem' }} onFocus={focus} onBlur={blur} />
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                    <label style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-soft)' }}>Email Address</label>
                    <input type="email" required value={reqForm.email} onChange={e=>updReq('email',e.target.value)} style={{ ...FIELD, padding: '0.75rem 1rem' }} onFocus={focus} onBlur={blur} />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                    <label style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-soft)' }}>Your Relationship to the Couple</label>
                    <select value={reqForm.relationship} onChange={e=>updReq('relationship',e.target.value)} style={{ ...FIELD, padding: '0.75rem 1rem' }} onFocus={focus} onBlur={blur}>
                      <option value="Bride's Friend">Bride's Friend</option>
                      <option value="Groom's Friend">Groom's Friend</option>
                      <option value="Bride's Family">Bride's Family</option>
                      <option value="Groom's Family">Groom's Family</option>
                      <option value="Mutual Friend">Mutual Friend</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                    <label style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-soft)' }}>Note to the Couple (optional)</label>
                    <textarea rows={2} value={reqForm.message} onChange={e=>updReq('message',e.target.value)} placeholder="e.g. Rex's cousin from Manila..." style={{ ...FIELD, padding: '0.75rem 1rem', resize: 'vertical' }} onFocus={focus} onBlur={blur} />
                  </div>

                  <button
                    type="submit"
                    disabled={reqStatus === 'loading'}
                    style={{
                      width: '100%', padding: '0.9rem', background: 'var(--taupe)', color: 'white',
                      border: 'none', cursor: reqStatus === 'loading' ? 'not-allowed' : 'pointer',
                      fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 500
                    }}
                  >
                    {reqStatus === 'loading' ? 'Submitting...' : 'Submit Request'}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  )
}

function Label({ text, id, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
      <label htmlFor={id} style={{ fontFamily: 'var(--ff-sans)', fontSize: '0.68rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--text-soft)', fontWeight: 400 }}>{text}</label>
      {children}
    </div>
  )
}
