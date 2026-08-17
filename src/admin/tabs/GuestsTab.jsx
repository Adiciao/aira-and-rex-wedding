import { useState, useEffect } from 'react'
import { useWedding } from '../../context/WeddingContext'
import { collection, onSnapshot, addDoc, doc, deleteDoc, query, writeBatch } from 'firebase/firestore'
import { db } from '../../firebase'

export default function GuestsTab() {
  const { bride, groom } = useWedding()
  
  // Whitelist allowed guests list state
  const [guests, setGuests] = useState([])
  const [loading, setLoading] = useState(true)

  // Add form states
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [bulkInput, setBulkInput] = useState('')
  
  const [search, setSearch] = useState('')
  const [tab, setTab] = useState('list') // list | add | bulk

  const GUESTS_REF = collection(db, 'invited_guests')

  // Load allowed whitelist guests in real-time
  useEffect(() => {
    const unsub = onSnapshot(GUESTS_REF, (snap) => {
      const list = snap.docs.map(d => ({ id: d.id, ...d.data() }))
      list.sort((a, b) => {
        const nameA = `${a.last_name || ''} ${a.first_name || ''}`.toLowerCase()
        const nameB = `${b.last_name || ''} ${b.first_name || ''}`.toLowerCase()
        return nameA.localeCompare(nameB)
      })
      setGuests(list)
      setLoading(false)
    }, (err) => {
      console.error(err)
      setLoading(false)
    })
    return unsub
  }, [])

  // Add single guest
  const handleAddSingle = async (e) => {
    e.preventDefault()
    const fName = firstName.trim()
    const lName = lastName.trim()
    if (!fName || !lName) return

    try {
      await addDoc(GUESTS_REF, {
        first_name: fName,
        last_name: lName,
        name_lowercase: `${fName.toLowerCase()} ${lName.toLowerCase()}`,
        added_at: new Date().toISOString()
      })
      setFirstName('')
      setLastName('')
      setTab('list')
    } catch (err) {
      alert('Failed to add guest: ' + err.message)
    }
  }

  // Bulk add guests
  const handleBulkAdd = async (e) => {
    e.preventDefault()
    const lines = bulkInput.split('\n').map(l => l.trim()).filter(l => l.length > 0)
    if (lines.length === 0) return

    const parsed = lines.map(line => {
      const parts = line.split(/\s+/)
      if (parts.length === 1) {
        return { first_name: parts[0], last_name: 'Guest' }
      }
      const lName = parts.pop()
      const fName = parts.join(' ')
      return { first_name: fName, last_name: lName }
    })

    try {
      const batch = writeBatch(db)
      parsed.forEach(p => {
        const docRef = doc(collection(db, 'invited_guests'))
        batch.set(docRef, {
          first_name: p.first_name,
          last_name: p.last_name,
          name_lowercase: `${p.first_name.toLowerCase()} ${p.last_name.toLowerCase()}`,
          added_at: new Date().toISOString()
        })
      })
      await batch.commit()
      setBulkInput('')
      setTab('list')
    } catch (err) {
      alert('Bulk add failed: ' + err.message)
    }
  }

  // Remove allowed guest from whitelist
  const handleDelete = async (id, name) => {
    if (!confirm(`Remove ${name} from the invited list?`)) return
    try {
      await deleteDoc(doc(db, 'invited_guests', id))
    } catch (err) {
      alert('Delete failed: ' + err.message)
    }
  }

  const filteredGuests = guests.filter(g => {
    const q = search.toLowerCase()
    return !q || `${g.first_name} ${g.last_name}`.toLowerCase().includes(q)
  })

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', gap: '1rem', flexWrap: 'wrap' }}>
        <div>
          <h2 className="admin-page-title">Allowed Guest List</h2>
          <p className="admin-page-sub" style={{ marginBottom: 0 }}>Manage the allowed guest list whitelist. Only guests on this list can submit an RSVP.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className={`admin-btn ${tab === 'list' ? 'admin-btn-primary' : 'admin-btn-ghost'} admin-btn-sm`} onClick={() => setTab('list')}>
            📋 Whitelist ({guests.length})
          </button>
          <button className={`admin-btn ${tab === 'add' ? 'admin-btn-primary' : 'admin-btn-ghost'} admin-btn-sm`} onClick={() => setTab('add')}>
            ➕ Add Single
          </button>
          <button className={`admin-btn ${tab === 'bulk' ? 'admin-btn-primary' : 'admin-btn-ghost'} admin-btn-sm`} onClick={() => setTab('bulk')}>
            ⚡ Bulk Import
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '30vh', color: 'var(--a-muted)' }}>
          Loading Guest List Whitelist...
        </div>
      ) : (
        <>
          {/* Whitelist View */}
          {tab === 'list' && (
            <div>
              <div style={{ marginBottom: '1.5rem' }}>
                <input
                  className="admin-input"
                  style={{ width: '100%', maxWidth: 360 }}
                  placeholder="Search whitelist by name..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>

              <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
                {filteredGuests.length === 0 ? (
                  <div className="admin-empty">
                    <div className="admin-empty-icon">👥</div>
                    <p style={{ fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic', fontSize: '1.3rem', marginBottom: '0.5rem' }}>
                      {guests.length === 0 ? 'Whitelist is empty' : 'No guests matched search'}
                    </p>
                    <p style={{ fontSize: '0.8rem', maxWidth: 380, margin: '0 auto' }}>
                      {guests.length === 0 
                        ? 'If the whitelist is empty, anyone can RSVP. Add names to start blocking uninvited guests.' 
                        : 'Try adjusting your search query.'}
                    </p>
                  </div>
                ) : (
                  <div style={{ overflowX: 'auto' }}>
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>First Name</th>
                          <th>Last Name</th>
                          <th>Full Name (lowercase match key)</th>
                          <th style={{ width: 100 }}></th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredGuests.map(g => (
                          <tr key={g.id}>
                            <td style={{ fontWeight: 500 }}>{g.first_name}</td>
                            <td style={{ fontWeight: 500 }}>{g.last_name}</td>
                            <td style={{ color: 'var(--a-muted)', fontFamily: 'monospace', fontSize: '0.8rem' }}>
                              {g.name_lowercase}
                            </td>
                            <td>
                              <button 
                                className="admin-btn admin-btn-danger admin-btn-sm"
                                onClick={() => handleDelete(g.id, `${g.first_name} ${g.last_name}`)}
                              >
                                Remove
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Add Single form */}
          {tab === 'add' && (
            <div className="admin-card" style={{ maxWidth: 500 }}>
              <p className="admin-card-title">➕ Add Allowed Guest</p>
              <form onSubmit={handleAddSingle}>
                <div className="admin-grid-2">
                  <div className="admin-field">
                    <label className="admin-label">First Name</label>
                    <input className="admin-input" required value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="Juan" />
                  </div>
                  <div className="admin-field">
                    <label className="admin-label">Last Name</label>
                    <input className="admin-input" required value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Dela Cruz" />
                  </div>
                </div>
                <div style={{ marginTop: '1rem', display: 'flex', gap: '0.75rem' }}>
                  <button type="submit" className="admin-btn admin-btn-primary">Add Guest</button>
                  <button type="button" className="admin-btn admin-btn-ghost" onClick={() => setTab('list')}>Cancel</button>
                </div>
              </form>
            </div>
          )}

          {/* Bulk Import form */}
          {tab === 'bulk' && (
            <div className="admin-card" style={{ maxWidth: 600 }}>
              <p className="admin-card-title">⚡ Bulk Import Guest List</p>
              <p style={{ fontSize: '0.8rem', color: 'var(--a-muted)', marginBottom: '1.25rem', lineHeight: 1.5 }}>
                Paste a list of names below, one guest per line. <br />
                Example:<br />
                <code style={{ background: 'rgba(255,255,255,0.06)', padding: '0.2rem 0.5rem', borderRadius: 4, display: 'block', margin: '0.5rem 0', fontFamily: 'monospace' }}>
                  Juan Dela Cruz<br />
                  Maria Santos<br />
                  Pedro Penduko
                </code>
              </p>
              <form onSubmit={handleBulkAdd}>
                <div className="admin-field">
                  <label className="admin-label">Paste Names Here</label>
                  <textarea 
                    className="admin-textarea" 
                    required 
                    value={bulkInput} 
                    onChange={e => setBulkInput(e.target.value)} 
                    placeholder="Enter one full name per line..." 
                    style={{ minHeight: 180 }}
                  />
                </div>
                <div style={{ marginTop: '1rem', display: 'flex', gap: '0.75rem' }}>
                  <button type="submit" className="admin-btn admin-btn-primary">Import List</button>
                  <button type="button" className="admin-btn admin-btn-ghost" onClick={() => setTab('list')}>Cancel</button>
                </div>
              </form>
            </div>
          )}
        </>
      )}
    </div>
  )
}
