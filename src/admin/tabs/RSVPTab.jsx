import { useState } from 'react'
import { useWedding } from '../../context/WeddingContext'

function exportCSV(rsvps) {
  const headers = ['Name','Email','Guests','Attending','Dietary','Message','Submitted']
  const rows = rsvps.map(r => [
    `${r.first_name} ${r.last_name}`,
    r.email,
    r.guests,
    r.attending,
    r.dietary || '—',
    (r.message || '—').replace(/,/g,'；'),
    new Date(r.submitted_at).toLocaleString(),
  ])
  const csv = [headers, ...rows].map(r => r.join(',')).join('\n')
  const a = document.createElement('a')
  a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv)
  a.download = 'rsvps.csv'
  a.click()
}

export default function RSVPTab() {
  const { rsvps, deleteRsvp, bride, groom } = useWedding()
  const [filter, setFilter] = useState('all') // all | yes | no
  const [search, setSearch] = useState('')

  const filtered = rsvps.filter(r => {
    const matchAttend = filter === 'all' || r.attending === filter
    const q = search.toLowerCase()
    const matchSearch = !q || `${r.first_name} ${r.last_name} ${r.email}`.toLowerCase().includes(q)
    return matchAttend && matchSearch
  })

  const totalGuests = rsvps.filter(r => r.attending === 'yes').reduce((sum, r) => sum + parseInt(r.guests || 1), 0)
  const attending   = rsvps.filter(r => r.attending === 'yes').length
  const declining   = rsvps.filter(r => r.attending === 'no').length

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '2rem', gap: '1rem', flexWrap: 'wrap' }}>
        <div>
          <h2 className="admin-page-title">RSVP Responses</h2>
          <p className="admin-page-sub" style={{ marginBottom: 0 }}>All guest responses for {groom} &amp; {bride}'s wedding.</p>
        </div>
        <button className="admin-btn admin-btn-ghost" onClick={() => exportCSV(rsvps)} disabled={rsvps.length === 0}>
          ↓ Export CSV
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
        <div className="admin-stat">
          <div className="admin-stat-val">{rsvps.length}</div>
          <div className="admin-stat-label">Total Responses</div>
        </div>
        <div className="admin-stat">
          <div className="admin-stat-val" style={{ color: 'var(--a-success)' }}>{totalGuests}</div>
          <div className="admin-stat-label">Guests Attending</div>
        </div>
        <div className="admin-stat">
          <div className="admin-stat-val" style={{ color: 'var(--a-danger)' }}>{declining}</div>
          <div className="admin-stat-label">Declined</div>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          className="admin-input"
          style={{ width: 220, flex: 'none' }}
          placeholder="Search name or email..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        {['all','yes','no'].map(f => (
          <button key={f} className={`admin-btn ${filter === f ? 'admin-btn-primary' : 'admin-btn-ghost'} admin-btn-sm`} onClick={() => setFilter(f)}>
            {f === 'all' ? 'All' : f === 'yes' ? '✓ Attending' : '✗ Declined'}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
        {filtered.length === 0 ? (
          <div className="admin-empty">
            <div className="admin-empty-icon">💌</div>
            <p style={{ fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic', fontSize: '1.3rem', marginBottom: '0.5rem' }}>
              {rsvps.length === 0 ? 'No RSVPs yet' : 'No results found'}
            </p>
            <p style={{ fontSize: '0.8rem' }}>
              {rsvps.length === 0 ? 'Guest responses will appear here once they submit the form.' : 'Try adjusting your search or filter.'}
            </p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Attending</th>
                  <th>Guests</th>
                  <th>Dietary</th>
                  <th>Message</th>
                  <th>Submitted</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(r => (
                  <tr key={r.id}>
                    <td style={{ fontWeight: 500, whiteSpace: 'nowrap' }}>{r.first_name} {r.last_name}</td>
                    <td style={{ color: 'var(--a-muted)', fontSize: '0.8rem' }}>{r.email}</td>
                    <td>
                      <span className={`admin-badge ${r.attending === 'yes' ? 'admin-badge-yes' : 'admin-badge-no'}`}>
                        {r.attending === 'yes' ? '✓ Yes' : '✗ No'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'center' }}>{r.guests}</td>
                    <td style={{ color: 'var(--a-muted)', fontSize: '0.8rem', maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.dietary || '—'}</td>
                    <td style={{ maxWidth: 200 }}>
                      {r.message ? (
                        <span title={r.message} style={{ color: 'var(--a-muted)', fontSize: '0.8rem', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 180 }}>{r.message}</span>
                      ) : <span style={{ color: 'rgba(255,255,255,0.2)' }}>—</span>}
                    </td>
                    <td style={{ color: 'var(--a-muted)', fontSize: '0.78rem', whiteSpace: 'nowrap' }}>
                      {new Date(r.submitted_at).toLocaleDateString('en', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td>
                      <button className="admin-btn admin-btn-danger admin-btn-sm" onClick={() => { if (confirm(`Delete ${r.first_name}'s RSVP?`)) deleteRsvp(r.id) }}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {filtered.length > 0 && (
        <p style={{ fontSize: '0.75rem', color: 'var(--a-muted)', marginTop: '0.75rem', textAlign: 'right' }}>
          Showing {filtered.length} of {rsvps.length} responses
        </p>
      )}
    </div>
  )
}
