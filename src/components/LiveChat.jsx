import { useState, useEffect, useRef } from 'react'
import { collection, doc, addDoc, onSnapshot, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore'
import { db } from '../firebase'

export default function LiveChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [chatId, setChatId] = useState(() => localStorage.getItem('guest_chat_id'))
  const [guestName, setGuestName] = useState(() => localStorage.getItem('guest_chat_name') || '')
  
  const [nameInput, setNameInput] = useState('')
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)

  const messagesEndRef = useRef(null)

  // 1. Listen to messages in the active thread (if chatId exists)
  useEffect(() => {
    if (!chatId) return

    const msgsRef = collection(db, 'chats', chatId, 'messages')
    const unsub = onSnapshot(msgsRef, (snap) => {
      const list = snap.docs.map(d => ({ id: d.id, ...d.data() }))
      // Sort chronologically
      list.sort((a, b) => {
        const ta = a.created_at?.toMillis?.() ?? 0
        const tb = b.created_at?.toMillis?.() ?? 0
        return ta - tb
      })
      setMessages(list)

      // Reactive auto-completion: If hosts approved an invitation form card in this thread, automatically mark RSVP as complete!
      const hasApproved = list.some(m => m.type === 'invitation_form' && m.status === 'approved')
      if (hasApproved && localStorage.getItem('rsvp_completed') !== 'true') {
        localStorage.setItem('rsvp_completed', 'true')
        window.dispatchEvent(new Event('rsvp_updated'))
      }
      
      // Auto scroll to bottom
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
    })

    // Reset unread_guest flag since guest has opened the chat
    const chatDocRef = doc(db, 'chats', chatId)
    updateDoc(chatDocRef, { unread_guest: false }).catch(() => {})

    return unsub
  }, [chatId, isOpen])

  // 2. Listen to unread state from the main chat document (if closed)
  useEffect(() => {
    if (!chatId || isOpen) {
      setUnreadCount(0)
      return
    }
    const chatDocRef = doc(db, 'chats', chatId)
    const unsub = onSnapshot(chatDocRef, (snap) => {
      if (snap.exists() && snap.data().unread_guest) {
        setUnreadCount(1) // Simple trigger
      } else {
        setUnreadCount(0)
      }
    })
    return unsub
  }, [chatId, isOpen])

  // Start chat session (save name to start)
  const handleStartChat = async (e) => {
    e.preventDefault()
    const name = nameInput.trim()
    if (!name) return

    setGuestName(name)
    localStorage.setItem('guest_chat_name', name)
  }

  // Send regular text message
  const handleSend = async (e) => {
    e.preventDefault()
    const text = message.trim()
    if (!text) return

    let activeId = chatId

    try {
      // Create new chat room if first message
      if (!activeId) {
        const newChatRef = doc(collection(db, 'chats'))
        activeId = newChatRef.id
        await setDoc(newChatRef, {
          guest_name: guestName,
          last_message: text,
          updated_at: serverTimestamp(),
          unread_admin: true,
          unread_guest: false,
          created_at: serverTimestamp(),
        })
        setChatId(activeId)
        localStorage.setItem('guest_chat_id', activeId)
      } else {
        // Update existing chat room details
        await updateDoc(doc(db, 'chats', activeId), {
          last_message: text,
          updated_at: serverTimestamp(),
          unread_admin: true,
          unread_guest: false,
        })
      }

      // Add message to subcollection
      await addDoc(collection(db, 'chats', activeId, 'messages'), {
        text,
        sender: 'guest',
        created_at: serverTimestamp(),
      })

      setMessage('')
    } catch (err) {
      console.error(err)
      alert('Failed to send message: ' + err.message)
    }
  }

  return (
    <div className="live-chat-container" style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 9999, fontFamily: 'var(--ff-sans)' }}>
      {/* Floating Toggle Button */}
      <button
        className="floating-widget-btn"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: 60, height: 60,
          borderRadius: '50%',
          background: 'var(--taupe)',
          border: 'none',
          boxShadow: '0 8px 30px rgba(0,0,0,0.18)',
          cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1.6rem', color: 'white',
          position: 'relative',
          transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.08)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
      >
        {isOpen ? '✕' : '💬'}

        {/* Unread badge */}
        {unreadCount > 0 && (
          <span style={{
            position: 'absolute', top: -3, right: -3,
            width: 18, height: 18,
            borderRadius: '50%',
            background: '#e07070',
            color: 'white',
            fontSize: '0.65rem',
            fontWeight: 'bold',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 0 3px var(--cream-light)',
          }}>
            !
          </span>
        )}
      </button>

      {/* Chat Widget Window */}
      {isOpen && (
        <div className="live-chat-window" style={{
          position: 'absolute', bottom: 76, right: 0,
          width: 'clamp(300px, 90vw, 360px)',
          height: 480,
          background: 'var(--cream-light)',
          border: '1px solid var(--blush)',
          borderRadius: 12,
          boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
          overflow: 'hidden',
          display: 'flex', flexDirection: 'column',
        }}>
          {/* Header */}
          <div style={{ background: 'var(--taupe)', color: 'white', padding: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '1.4rem' }}>💬</span>
            <div>
              <p style={{ fontWeight: 600, fontSize: '0.9rem', lineHeight: 1.2 }}>Chat with the Hosts</p>
              <p style={{ fontSize: '0.7rem', opacity: 0.8, letterSpacing: '0.04em' }}>We're here to help you RSVP</p>
            </div>
          </div>

          {/* Body */}
          <div style={{ flex: 1, padding: '1rem', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
            {!guestName ? (
              /* Name setup screen */
              <form onSubmit={handleStartChat} style={{ margin: 'auto 0', textAlign: 'center', padding: '1rem' }}>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-soft)', marginBottom: '1.5rem', lineHeight: 1.5 }}>
                  Names not matching? Or have questions? Enter your name to chat with Rex & Aira's team.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <input
                    type="text"
                    required
                    placeholder="Enter your full name..."
                    value={nameInput}
                    onChange={e => setNameInput(e.target.value)}
                    style={{
                      width: '100%', padding: '0.8rem 1rem',
                      border: '1px solid var(--blush)', borderRadius: 6,
                      outline: 'none', background: 'var(--cream)', fontSize: '0.9rem'
                    }}
                  />
                  <button
                    type="submit"
                    style={{
                      padding: '0.8rem', background: 'var(--taupe)', color: 'white',
                      border: 'none', borderRadius: 6, fontWeight: 500, cursor: 'pointer',
                      fontSize: '0.85rem', letterSpacing: '0.05em'
                    }}
                  >
                    Start Chatting
                  </button>
                </div>
              </form>
            ) : (
              /* Active Chat screen */
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1 }}>
                {messages.length === 0 && (
                  <div style={{ margin: 'auto 0', textAlign: 'center', padding: '0 1rem', color: 'var(--text-soft)', fontSize: '0.82rem' }}>
                    👋 Hi <strong>{guestName}</strong>! Send a message below and the admin will reply shortly.
                  </div>
                )}

                {messages.map((m) => {
                  const isAdmin = m.sender === 'admin'

                  // Render special invitation request form card
                  if (m.type === 'invitation_form') {
                    return (
                      <InChatForm 
                        key={m.id} 
                        msg={m} 
                        chatId={chatId} 
                      />
                    )
                  }

                  // Render regular messages
                  return (
                    <div
                      key={m.id}
                      style={{
                        alignSelf: isAdmin ? 'flex-start' : 'flex-end',
                        maxWidth: '80%',
                        padding: '0.65rem 0.9rem',
                        borderRadius: 12,
                        background: isAdmin ? 'var(--cream)' : 'var(--taupe)',
                        color: isAdmin ? 'var(--text)' : 'white',
                        border: isAdmin ? '1px solid var(--blush)' : 'none',
                        fontSize: '0.86rem',
                        lineHeight: 1.5,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                      }}
                    >
                      {m.text}
                    </div>
                  )
                })}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Footer Input Area */}
          {guestName && (
            <form onSubmit={handleSend} style={{ padding: '0.75rem 1rem 1rem', borderTop: '1px solid var(--blush)', display: 'flex', gap: '0.5rem', background: 'var(--cream)' }}>
              <input
                type="text"
                placeholder="Type your message here..."
                value={message}
                onChange={e => setMessage(e.target.value)}
                style={{
                  flex: 1, padding: '0.65rem 0.9rem',
                  border: '1px solid var(--blush)', borderRadius: 20,
                  outline: 'none', background: 'var(--cream-light)', fontSize: '0.88rem'
                }}
              />
              <button
                type="submit"
                style={{
                  width: 36, height: 36, borderRadius: '50%',
                  background: 'var(--taupe)', border: 'none', color: 'white',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1rem', flexShrink: 0
                }}
              >
                ➔
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  )
}

/* Sub-component to manage interactive form state locally */
function InChatForm({ msg, chatId }) {
  const [firstName, setFirstName] = useState(() => {
    const raw = localStorage.getItem('guest_chat_name') || ''
    const parts = raw.trim().split(/\s+/)
    return parts.length > 1 ? parts.slice(0, -1).join(' ') : raw
  })
  const [lastName, setLastName] = useState(() => {
    const raw = localStorage.getItem('guest_chat_name') || ''
    const parts = raw.trim().split(/\s+/)
    return parts.length > 1 ? parts.pop() : ''
  })
  const [email, setEmail] = useState('')
  const [guests, setGuests] = useState('1')
  const [relationship, setRelationship] = useState("Bride's Friend")
  const [note, setNote] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!firstName.trim() || !lastName.trim() || !email.trim()) return

    setSubmitting(true)
    try {
      const msgRef = doc(db, 'chats', chatId, 'messages', msg.id)
      // Update form card document fields
      await updateDoc(msgRef, {
        status: 'submitted',
        request_data: {
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          email: email.trim(),
          guests,
          relationship,
          message: note.trim(),
        }
      })

      // Update chat meta last message to alert admin
      await updateDoc(doc(db, 'chats', chatId), {
        last_message: 'Submitted invitation request form.',
        unread_admin: true,
      })
    } catch (err) {
      alert('Failed to submit form: ' + err.message)
    } finally {
      setSubmitting(false)
    }
  }

  // Styles
  const cardStyle = {
    alignSelf: 'flex-start',
    width: '90%',
    background: 'var(--cream)',
    border: '1px solid var(--blush)',
    borderRadius: 8,
    padding: '1rem',
    fontSize: '0.82rem',
    color: 'var(--text)',
    boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.6rem',
  }

  const inputStyle = {
    width: '100%',
    padding: '0.5rem',
    border: '1px solid var(--blush)',
    borderRadius: 4,
    outline: 'none',
    background: 'white',
    fontSize: '0.8rem',
  }

  if (msg.status === 'pending') {
    return (
      <div style={cardStyle}>
        <p style={{ fontWeight: 600, color: 'var(--taupe)', borderBottom: '1px solid var(--blush)', paddingBottom: '0.3rem' }}>
          📄 Invitation Request Form
        </p>
        <p style={{ fontSize: '0.74rem', color: 'var(--text-soft)', lineHeight: 1.4 }}>
          The hosts have sent you an invitation request form. Please submit your details below for review.
        </p>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem' }}>
            <div>
              <label style={{ fontSize: '0.65rem', color: 'var(--text-soft)', display: 'block', marginBottom: '0.15rem' }}>First Name</label>
              <input 
                type="text" 
                required 
                value={firstName} 
                onChange={e => setFirstName(e.target.value)} 
                style={inputStyle} 
                placeholder="First"
              />
            </div>
            <div>
              <label style={{ fontSize: '0.65rem', color: 'var(--text-soft)', display: 'block', marginBottom: '0.15rem' }}>Last Name</label>
              <input 
                type="text" 
                required 
                value={lastName} 
                onChange={e => setLastName(e.target.value)} 
                style={inputStyle} 
                placeholder="Last"
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.65rem', color: 'var(--text-soft)', display: 'block', marginBottom: '0.15rem' }}>Email Address</label>
            <input 
              type="email" 
              required 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              style={inputStyle} 
              placeholder="name@example.com"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem' }}>
            <div>
              <label style={{ fontSize: '0.65rem', color: 'var(--text-soft)', display: 'block', marginBottom: '0.15rem' }}>Guests</label>
              <select 
                value={guests} 
                onChange={e => setGuests(e.target.value)} 
                style={inputStyle}
              >
                {['1','2','3','4','5'].map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: '0.65rem', color: 'var(--text-soft)', display: 'block', marginBottom: '0.15rem' }}>Relationship</label>
              <select 
                value={relationship} 
                onChange={e => setRelationship(e.target.value)} 
                style={inputStyle}
              >
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
            <label style={{ fontSize: '0.65rem', color: 'var(--text-soft)', display: 'block', marginBottom: '0.15rem' }}>Note/Reason (optional)</label>
            <textarea 
              rows={2} 
              value={note} 
              onChange={e => setNote(e.target.value)} 
              style={{ ...inputStyle, resize: 'vertical' }} 
              placeholder="Who are you / relative to whom?"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            style={{
              padding: '0.6rem', background: 'var(--taupe)', color: 'white',
              border: 'none', borderRadius: 4, cursor: submitting ? 'not-allowed' : 'pointer',
              fontWeight: 500, fontSize: '0.78rem', marginTop: '0.2rem'
            }}
          >
            {submitting ? 'Submitting...' : 'Submit Request'}
          </button>
        </form>
      </div>
    )
  }

  if (msg.status === 'submitted') {
    return (
      <div style={{ ...cardStyle, background: 'rgba(139,115,85,0.05)' }}>
        <p style={{ fontWeight: 600, color: 'var(--taupe)' }}>
          ✓ Request Form Submitted
        </p>
        <p style={{ fontSize: '0.76rem', color: 'var(--text-soft)', lineHeight: 1.4 }}>
          Your details are submitted. The hosts are reviewing your request to whitelist your name. You can continue chatting below.
        </p>
      </div>
    )
  }

  if (msg.status === 'approved') {
    return (
      <div style={{ ...cardStyle, background: 'rgba(126,200,154,0.08)', border: '1px solid rgba(126,200,154,0.25)' }}>
        <p style={{ fontWeight: 600, color: '#68ad82' }}>
          ✓ Request Approved!
        </p>
        <p style={{ fontSize: '0.76rem', color: 'var(--text-soft)', lineHeight: 1.4 }}>
          Your request was approved. Your name has been whitelisted! You are now allowed to fill out and submit your RSVP on the page.
        </p>
      </div>
    )
  }

  if (msg.status === 'declined') {
    return (
      <div style={{ ...cardStyle, background: 'rgba(224,112,112,0.05)', border: '1px solid rgba(224,112,112,0.2)' }}>
        <p style={{ fontWeight: 600, color: '#cc6666' }}>
          ✕ Request Declined
        </p>
        <p style={{ fontSize: '0.76rem', color: 'var(--text-soft)', lineHeight: 1.4 }}>
          The hosts declined the request. Feel free to send a message to ask for more info.
        </p>
      </div>
    )
  }

  return null
}
