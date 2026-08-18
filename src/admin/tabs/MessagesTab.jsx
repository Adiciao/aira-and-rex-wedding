import { useState, useEffect, useRef } from 'react'
import { useWedding } from '../../context/WeddingContext'
import { collection, doc, query, onSnapshot, addDoc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../../firebase'

export default function MessagesTab() {
  const [threads, setThreads] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeId, setActiveId] = useState(null)
  
  const [messages, setMessages] = useState([])
  const [replyText, setReplyText] = useState('')
  const [sending, setSending] = useState(false)

  const chatEndRef = useRef(null)

  const GUESTS_REF = collection(db, 'invited_guests')
  const RSVPS_REF  = collection(db, 'rsvps')

  // 1. Listen to active chat rooms in real-time
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'chats'), (snap) => {
      const list = snap.docs.map(d => ({ id: d.id, ...d.data() }))
      list.sort((a, b) => {
        const ta = a.updated_at?.toMillis?.() ?? 0
        const tb = b.updated_at?.toMillis?.() ?? 0
        return tb - ta
      })
      setThreads(list)
      setLoading(false)
    }, (err) => {
      console.error(err)
      setLoading(false)
    })
    return unsub
  }, [])

  // 2. Listen to messages for the active Chat thread
  useEffect(() => {
    if (!activeId) {
      setMessages([])
      return
    }

    const msgsRef = collection(db, 'chats', activeId, 'messages')
    const unsub = onSnapshot(msgsRef, (snap) => {
      const list = snap.docs.map(d => ({ id: d.id, ...d.data() }))
      list.sort((a, b) => {
        const ta = a.created_at?.toMillis?.() ?? 0
        const tb = b.created_at?.toMillis?.() ?? 0
        return ta - tb
      })
      setMessages(list)
      
      // Auto scroll
      setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
    })

    // Reset unread flag for admin
    const chatDocRef = doc(db, 'chats', activeId)
    updateDoc(chatDocRef, { unread_admin: false }).catch(() => {})

    return unsub
  }, [activeId])

  // Send regular reply message
  const handleSendReply = async (e) => {
    e.preventDefault()
    const text = replyText.trim()
    if (!text || !activeId) return

    setSending(true)
    try {
      await addDoc(collection(db, 'chats', activeId, 'messages'), {
        text,
        sender: 'admin',
        created_at: serverTimestamp(),
      })

      await updateDoc(doc(db, 'chats', activeId), {
        last_message: text,
        updated_at: serverTimestamp(),
        unread_admin: false,
        unread_guest: true,
      })

      setReplyText('')
    } catch (err) {
      alert('Failed to send reply: ' + err.message)
    } finally {
      setSending(false)
    }
  }

  // Send interactive invitation request form card
  const handleSendFormCard = async () => {
    if (!activeId) return
    try {
      await addDoc(collection(db, 'chats', activeId, 'messages'), {
        text: 'Invitation Request Form sent.',
        sender: 'admin',
        type: 'invitation_form',
        status: 'pending',
        created_at: serverTimestamp(),
      })

      await updateDoc(doc(db, 'chats', activeId), {
        last_message: 'Sent an invitation request form.',
        updated_at: serverTimestamp(),
        unread_admin: false,
        unread_guest: true,
      })
    } catch (err) {
      alert('Failed to send form: ' + err.message)
    }
  }

  // Delete chat thread
  const handleDeleteThread = async (id, name) => {
    if (!confirm(`Delete chat thread with ${name}? All conversation history will be lost.`)) return
    try {
      if (activeId === id) setActiveId(null)
      await deleteDoc(doc(db, 'chats', id))
    } catch (err) {
      alert('Failed to delete thread: ' + err.message)
    }
  }

  // Approve guest inside the conversation card
  const handleApproveInChat = async (msgDocId, finalData) => {
    const firstName = finalData.first_name?.trim() || ''
    const lastName = finalData.last_name?.trim() || ''
    const email = finalData.email?.trim() || ''
    const guests = finalData.guests || '1'
    const note = finalData.message?.trim() || ''

    if (!firstName || !lastName || !email) {
      alert('First name, Last name, and Email are required to approve.')
      return
    }

    try {
      // 1. Whitelist the guest
      await addDoc(GUESTS_REF, {
        first_name: firstName,
        last_name: lastName,
        name_lowercase: `${firstName.toLowerCase()} ${lastName.toLowerCase()}`,
        added_at: new Date().toISOString()
      })

      // 2. Automatically submit an RSVP for them (so it reflects in the RSVP tab!)
      await addDoc(RSVPS_REF, {
        first_name: firstName,
        last_name: lastName,
        email: email.toLowerCase().trim(),
        guests: guests,
        attending: 'yes',
        dietary: '',
        message: note || 'Approved via live chat request.',
        submitted_at: serverTimestamp()
      })

      // 3. Update message card state to 'approved'
      const msgRef = doc(db, 'chats', activeId, 'messages', msgDocId)
      await updateDoc(msgRef, { 
        status: 'approved',
        request_data: finalData // Store the edited/final details inside the card
      })

      // 4. Send automated follow-up system message
      await addDoc(collection(db, 'chats', activeId, 'messages'), {
        text: `✓ Invitation request approved! "${firstName} ${lastName}" is now whitelisted and RSVP'd (Attending: Yes, guests: ${guests}).`,
        sender: 'admin',
        created_at: serverTimestamp(),
      })

      // 5. Update thread last message
      await updateDoc(doc(db, 'chats', activeId), {
        last_message: 'Request approved & RSVP submitted.',
        updated_at: serverTimestamp(),
        unread_admin: false,
        unread_guest: true,
      })

      alert(`Approved! "${firstName} ${lastName}" is now whitelisted and RSVP'd successfully.`)
    } catch (err) {
      alert('Approve failed: ' + err.message)
    }
  }

  // Decline/Reject guest request inside the conversation card
  const handleRejectInChat = async (msgDocId) => {
    if (!confirm('Decline this invitation request?')) return
    try {
      // 1. Update message status to 'declined'
      const msgRef = doc(db, 'chats', activeId, 'messages', msgDocId)
      await updateDoc(msgRef, { status: 'declined' })

      // 2. Send automated follow-up message
      await addDoc(collection(db, 'chats', activeId, 'messages'), {
        text: '✕ Invitation request declined by the hosts.',
        sender: 'admin',
        created_at: serverTimestamp(),
      })

      // 3. Update thread last message
      await updateDoc(doc(db, 'chats', activeId), {
        last_message: 'Request declined.',
        updated_at: serverTimestamp(),
        unread_admin: false,
        unread_guest: true,
      })
    } catch (err) {
      alert('Decline failed: ' + err.message)
    }
  }

  const activeChat = threads.find(t => t.id === activeId)

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div className="admin-messages-header">
        <h2 className="admin-page-title">Guest Messages</h2>
        <p className="admin-page-sub">Chat in real-time with guests. Edit and approve invitation request forms directly in the timeline.</p>
      </div>

      {loading ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1, color: 'var(--a-muted)' }}>
          Loading guest messages inbox...
        </div>
      ) : (
        <div className={`admin-messenger-container ${activeId ? 'has-active-thread' : ''}`} style={{
          flex: 1,
          display: 'grid',
          gridTemplateColumns: '300px 1fr',
          background: 'var(--a-surface)',
          border: '1px solid var(--a-border)',
          borderRadius: 8,
          overflow: 'hidden',
          minHeight: 400,
        }}>
          {/* Thread List Sidebar */}
          <div className="messenger-threads-sidebar" style={{ borderRight: '1px solid var(--a-border)', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '1rem', borderBottom: '1px solid var(--a-border)', fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--a-muted)', fontWeight: 500 }}>
              Inbox ({threads.length})
            </div>

            {threads.length === 0 ? (
              <div style={{ margin: 'auto 0', textAlign: 'center', padding: '2rem', color: 'var(--a-muted)', fontSize: '0.85rem' }}>
                No active conversations.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {threads.map(t => (
                  <div
                    key={t.id}
                    onClick={() => setActiveId(t.id)}
                    style={{
                      padding: '1.25rem 1rem',
                      borderBottom: '1px solid rgba(255,255,255,0.03)',
                      cursor: 'pointer',
                      background: activeId === t.id ? 'rgba(255,255,255,0.03)' : 'transparent',
                      transition: 'background 0.2s',
                      position: 'relative',
                    }}
                  >
                    {t.unread_admin && (
                      <span style={{ position: 'absolute', top: '1.45rem', right: '1rem', width: 8, height: 8, borderRadius: '50%', background: 'var(--a-accent)' }} />
                    )}

                    <p style={{ fontWeight: t.unread_admin ? 600 : 500, fontSize: '0.9rem', color: t.unread_admin ? 'var(--a-accent)' : 'var(--a-text)', marginBottom: '0.2rem' }}>
                      {t.guest_name || 'Guest'}
                    </p>
                    
                    <p style={{
                      fontSize: '0.76rem',
                      color: 'var(--a-muted)',
                      textOverflow: 'ellipsis',
                      overflow: 'hidden',
                      whiteSpace: 'nowrap',
                      maxWidth: '85%',
                    }}>
                      {t.last_message}
                    </p>
                    
                    <span style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.2)', marginTop: '0.4rem', display: 'block' }}>
                      {t.updated_at ? new Date(t.updated_at.toMillis()).toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' }) : ''}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Active Chat Pane */}
          <div className="messenger-chat-pane" style={{ display: 'flex', flexDirection: 'column', background: '#11141c' }}>
            {activeChat ? (
              <>
                {/* Header */}
                <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--a-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--a-surface)' }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <button
                      className="admin-mobile-back-btn"
                      onClick={() => setActiveId(null)}
                      style={{
                        display: 'none',
                        background: 'none',
                        border: 'none',
                        color: 'var(--a-accent)',
                        fontSize: '1.4rem',
                        marginRight: '0.8rem',
                        cursor: 'pointer',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '32px',
                        height: '32px',
                        lineHeight: 1,
                      }}
                    >
                      ←
                    </button>
                    <div>
                      <h3 style={{ fontSize: '1rem', fontWeight: 500 }}>{activeChat.guest_name}</h3>
                      <p style={{ fontSize: '0.72rem', color: 'var(--a-muted)' }}>Real-time chat session</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.55rem' }}>
                    <button
                      className="admin-btn admin-btn-ghost admin-btn-sm admin-header-desktop-btn"
                      style={{ color: 'var(--a-accent)', borderColor: 'var(--a-border)' }}
                      onClick={handleSendFormCard}
                    >
                      📄 Send Request Form
                    </button>
                    <button 
                      className="admin-btn admin-btn-danger admin-btn-sm"
                      onClick={() => handleDeleteThread(activeChat.id, activeChat.guest_name)}
                    >
                      <span className="btn-label-desktop">Clear Chat</span>
                      <span className="btn-label-mobile">🗑</span>
                    </button>
                  </div>
                </div>

                {/* Messages List */}
                <div style={{ flex: 1, padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {messages.map(m => {
                    const isAdmin = m.sender === 'admin'
                    
                    // Render special Invitation Form type
                    if (m.type === 'invitation_form') {
                      return (
                        <div
                          key={m.id}
                          style={{
                            alignSelf: 'center',
                            width: '100%',
                            maxWidth: '480px',
                            background: '#1c202d',
                            border: '1px dashed var(--a-border)',
                            borderRadius: 8,
                            padding: '1.25rem',
                            boxShadow: '0 4px 15px rgba(0,0,0,0.15)',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.75rem',
                          }}
                        >
                          <span style={{ fontSize: '0.7rem', color: 'var(--a-accent)', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600 }}>
                            📋 Invitation Request Form Card
                          </span>

                          {m.status === 'pending' && (
                            <p style={{ fontSize: '0.84rem', color: 'var(--a-muted)', fontStyle: 'italic' }}>
                              Waiting for guest to fill out and submit the invitation request form...
                            </p>
                          )}

                          {m.status === 'submitted' && (
                            <AdminFormCard 
                              msgId={m.id} 
                              initialData={m.request_data} 
                              onApprove={handleApproveInChat} 
                              onReject={handleRejectInChat} 
                            />
                          )}

                          {m.status === 'approved' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                              <p style={{ fontSize: '0.84rem', color: '#7ec89a', fontWeight: 500 }}>
                                ✓ Approved, Whitelisted &amp; RSVP'd
                              </p>
                              <div style={{ background: 'rgba(255,255,255,0.01)', padding: '0.6rem 0.8rem', borderRadius: 4, fontSize: '0.78rem', color: 'var(--a-muted)' }}>
                                <p><strong>Name:</strong> {m.request_data?.first_name} {m.request_data?.last_name}</p>
                                <p><strong>Email:</strong> {m.request_data?.email}</p>
                                <p><strong>Guests:</strong> {m.request_data?.guests || '1'}</p>
                              </div>
                            </div>
                          )}

                          {m.status === 'declined' && (
                            <p style={{ fontSize: '0.84rem', color: 'var(--a-danger)', fontWeight: 500 }}>
                              ✕ Invitation Request Declined
                            </p>
                          )}
                        </div>
                      )
                    }

                    // Render regular text messages
                    return (
                      <div
                        key={m.id}
                        className={isAdmin ? 'chat-bubble-admin' : 'chat-bubble-guest'}
                        style={{
                          alignSelf: isAdmin ? 'flex-end' : 'flex-start',
                          maxWidth: '75%',
                          background: isAdmin ? 'var(--a-accent)' : 'var(--a-surface)',
                          color: isAdmin ? '#0f1117' : 'var(--a-text)',
                          border: isAdmin ? 'none' : '1px solid var(--a-border)',
                          padding: '0.65rem 0.9rem',
                          borderRadius: isAdmin ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                          fontSize: '0.88rem',
                          lineHeight: 1.55,
                          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                        }}
                      >
                        {m.text}
                      </div>
                    )
                  })}
                  <div ref={chatEndRef} />
                </div>

                {/* Reply Input Form Footer */}
                <form onSubmit={handleSendReply} style={{ padding: '1rem', borderTop: '1px solid var(--a-border)', display: 'flex', gap: '0.75rem', background: 'var(--a-surface)', alignItems: 'center' }}>
                  <button
                    type="button"
                    className="admin-btn admin-btn-ghost"
                    style={{ color: 'var(--a-accent)', borderColor: 'var(--a-border)', height: '42px', display: 'flex', alignItems: 'center', gap: '0.4rem', whiteSpace: 'nowrap' }}
                    onClick={handleSendFormCard}
                  >
                    <span className="btn-label-desktop">Send Form</span>
                    <span className="btn-label-mobile">📄</span>
                  </button>
                  <input
                    className="admin-input"
                    placeholder="Type your reply to the guest..."
                    value={replyText}
                    onChange={e => setReplyText(e.target.value)}
                    disabled={sending}
                    style={{ flex: 1 }}
                  />
                  <button type="submit" className="admin-btn admin-btn-primary" style={{ height: '42px' }} disabled={sending || !replyText.trim()}>
                    <span className="btn-label-desktop">{sending ? 'Sending...' : 'Send Reply'}</span>
                    <span className="btn-label-mobile">➔</span>
                  </button>
                </form>
              </>
            ) : (
              <div style={{ margin: 'auto', textAlign: 'center', color: 'var(--a-muted)', padding: '2rem' }}>
                <span style={{ fontSize: '3rem', display: 'block', marginBottom: '1rem', opacity: 0.35 }}>💬</span>
                <p style={{ fontSize: '1rem', fontStyle: 'italic', fontFamily: 'Cormorant Garamond, serif', color: 'var(--a-text)' }}>
                  No Active Conversation Selected
                </p>
                <p style={{ fontSize: '0.78rem', marginTop: '0.25rem' }}>Select a guest chat from the inbox sidebar to start messaging.</p>
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        .admin-main:has(.admin-messenger-container) {
          height: 100vh !important;
          overflow: hidden !important;
          display: flex !important;
          flex-direction: column !important;
          padding: 2rem 2.5rem 1.5rem !important;
        }
        
        .admin-messenger-container {
          flex: 1;
          min-height: 0;
          height: 100%;
        }

        .messenger-threads-sidebar {
          height: 100% !important;
          overflow-y: auto !important;
        }

        .messenger-chat-pane {
          height: 100% !important;
          overflow: hidden !important;
        }

        .btn-label-mobile {
          display: none;
        }

        .chat-bubble-admin {
          border-radius: 18px 18px 4px 18px !important;
          background: var(--a-accent) !important;
          color: #0f1117 !important;
          box-shadow: 0 4px 12px rgba(0,0,0,0.06);
        }

        .chat-bubble-guest {
          border-radius: 18px 18px 18px 4px !important;
          background: #232836 !important;
          color: var(--a-text) !important;
          border: 1px solid rgba(255,255,255,0.03) !important;
          box-shadow: 0 4px 12px rgba(0,0,0,0.06);
        }

        @media (max-width: 768px) {
          .admin-messages-header {
            display: none !important;
          }

          .admin-main:has(.admin-messenger-container) {
            padding: 0 !important;
            height: calc(100vh - 60px) !important;
          }

          .admin-messenger-container {
            grid-template-columns: 1fr !important;
            height: 100% !important;
          }
          
          .messenger-threads-sidebar {
            display: flex !important;
            width: 100% !important;
          }
          
          .messenger-chat-pane {
            display: none !important;
            width: 100% !important;
          }
          
          .admin-messenger-container.has-active-thread .messenger-threads-sidebar {
            display: none !important;
          }
          
          .admin-messenger-container.has-active-thread .messenger-chat-pane {
            display: flex !important;
          }
          
          .admin-mobile-back-btn {
            display: flex !important;
          }
          
          .btn-label-desktop {
            display: none !important;
          }
          
          .btn-label-mobile {
            display: inline-block !important;
          }
          
          .admin-header-desktop-btn {
            display: none !important;
          }
        }
      `}</style>
    </div>
  )
}

/* Sub-component to manage interactive form card fields locally inside the admin console messages */
function AdminFormCard({ msgId, initialData, onApprove, onReject }) {
  const [firstName, setFirstName] = useState(initialData?.first_name || '')
  const [lastName, setLastName] = useState(initialData?.last_name || '')
  const [email, setEmail] = useState(initialData?.email || '')
  const [relationship, setRelationship] = useState(initialData?.relationship || "Bride's Friend")
  const [guests, setGuests] = useState(initialData?.guests || '1')
  const [note, setNote] = useState(initialData?.message || '')
  const [processing, setProcessing] = useState(false)

  const handleApproveClick = async () => {
    setProcessing(true)
    await onApprove(msgId, {
      first_name: firstName,
      last_name: lastName,
      email: email,
      relationship: relationship,
      guests: guests,
      message: note,
    })
    setProcessing(false)
  }

  const labelStyle = {
    fontSize: '0.62rem',
    color: 'var(--a-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    display: 'block',
    marginBottom: '0.15rem',
  }

  const inputStyle = {
    width: '100%',
    padding: '0.4rem',
    background: '#11141c',
    border: '1px solid var(--a-border)',
    borderRadius: 4,
    color: 'var(--a-text)',
    fontSize: '0.78rem',
    outline: 'none',
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
      <p style={{ fontSize: '0.8rem', color: 'var(--a-text)', fontWeight: 500 }}>
        Guest submitted details (you can edit these before whitelisting):
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
        <div>
          <label style={labelStyle}>First Name</label>
          <input style={inputStyle} value={firstName} onChange={e => setFirstName(e.target.value)} />
        </div>
        <div>
          <label style={labelStyle}>Last Name</label>
          <input style={inputStyle} value={lastName} onChange={e => setLastName(e.target.value)} />
        </div>
      </div>

      <div>
        <label style={labelStyle}>Email Address</label>
        <input style={inputStyle} type="email" value={email} onChange={e => setEmail(e.target.value)} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
        <div>
          <label style={labelStyle}>Guests/Companions</label>
          <select style={inputStyle} value={guests} onChange={e => setGuests(e.target.value)}>
            {['1','2','3','4','5'].map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
        <div>
          <label style={labelStyle}>Relationship</label>
          <select style={inputStyle} value={relationship} onChange={e => setRelationship(e.target.value)}>
            <option value="Bride's Friend">Bride's Friend</option>
            <option value="Groom's Friend">Groom's Friend</option>
            <option value="Bride's Family">Bride's Family</option>
            <option value="Groom's Family">Groom's Family</option>
            <option value="Mutual Friend">Mutual Friend</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      <div>
        <label style={labelStyle}>Note / Message</label>
        <textarea style={{ ...inputStyle, resize: 'vertical' }} rows={2} value={note} onChange={e => setNote(e.target.value)} />
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.4rem' }}>
        <button
          className="admin-btn admin-btn-sm"
          style={{ background: '#7ec89a', color: '#0f1117', border: 'none', fontWeight: 600 }}
          onClick={handleApproveClick}
          disabled={processing}
        >
          {processing ? 'Processing...' : 'Approve & RSVP'}
        </button>
        <button
          className="admin-btn admin-btn-danger admin-btn-sm"
          onClick={() => onReject(msgId)}
          disabled={processing}
        >
          Decline
        </button>
      </div>
    </div>
  )
}
