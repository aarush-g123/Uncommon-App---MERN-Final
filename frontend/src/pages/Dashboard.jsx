import { useEffect, useState } from 'react'

const TOKEN_KEY = 'uncommon_token'

const STATUSES = ['planning', 'applying', 'submitted', 'accepted', 'rejected', 'waitlisted']

const STATUS_META = {
  planning:   { label: 'Planning',   bg: 'rgba(88,85,107,0.1)',    color: '#58556b' },
  applying:   { label: 'Applying',   bg: 'rgba(29,78,216,0.1)',    color: '#1d4ed8' },
  submitted:  { label: 'Submitted',  bg: 'rgba(217,119,6,0.12)',   color: '#b45309' },
  accepted:   { label: 'Accepted',   bg: 'rgba(22,163,74,0.12)',   color: '#15803d' },
  rejected:   { label: 'Rejected',   bg: 'rgba(220,38,38,0.1)',    color: '#b91c1c' },
  waitlisted: { label: 'Waitlisted', bg: 'rgba(124,58,237,0.1)',   color: '#6d28d9' },
}

const token = () => localStorage.getItem(TOKEN_KEY)
const authHeaders = () => ({ Authorization: `Bearer ${token()}`, 'Content-Type': 'application/json' })

function StatusBadge({ status }) {
  const meta = STATUS_META[status] || STATUS_META.planning
  return (
    <span
      className="status-badge"
      style={{ background: meta.bg, color: meta.color }}
    >
      {meta.label}
    </span>
  )
}

function CollegeModal({ college, onSave, onClose }) {
  const isEdit = Boolean(college?.id)
  const [form, setForm] = useState({
    name: college?.name ?? '',
    status: college?.status ?? 'planning',
    deadline: college?.deadline ?? '',
    notes: college?.notes ?? '',
  })
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const update = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    if (!form.name.trim()) { setError('School name is required.'); return }
    setSaving(true)
    setError('')

    const payload = {
      name: form.name.trim(),
      status: form.status,
      deadline: form.deadline || null,
      notes: form.notes.trim() || null,
    }

    try {
      const url = isEdit ? `/api/colleges/${college.id}` : '/api/colleges'
      const res = await fetch(url, {
        method: isEdit ? 'PUT' : 'POST',
        headers: authHeaders(),
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to save.')
      onSave(data.data)
    } catch (err) {
      setError(err.message)
      setSaving(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h2>{isEdit ? 'Edit school' : 'Add school'}</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>
        </div>

        <form className="modal-form" onSubmit={submit}>
          <label>
            School name
            <input
              name="name"
              value={form.name}
              onChange={update}
              placeholder="e.g. MIT"
              autoFocus
            />
          </label>

          <label>
            Status
            <select name="status" value={form.status} onChange={update}>
              {STATUSES.map((s) => (
                <option key={s} value={s}>{STATUS_META[s].label}</option>
              ))}
            </select>
          </label>

          <label>
            Application deadline
            <input
              name="deadline"
              type="date"
              value={form.deadline ?? ''}
              onChange={update}
            />
          </label>

          <label>
            Notes
            <textarea
              name="notes"
              value={form.notes}
              onChange={update}
              placeholder="Essays, requirements, fees…"
              rows={3}
            />
          </label>

          {error && <div className="error">{error}</div>}

          <div className="modal-actions">
            <button className="ghost" type="button" onClick={onClose}>Cancel</button>
            <button className="primary-button" type="submit" disabled={saving}>
              {saving ? 'Saving…' : isEdit ? 'Save changes' : 'Add school'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function Dashboard({ user, onSignOut }) {
  const [colleges, setColleges] = useState([])
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [modal, setModal] = useState(null) // null | { college?: object }
  const [deletingId, setDeletingId] = useState(null)

  useEffect(() => {
    fetch('/api/colleges', { headers: authHeaders() })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => setColleges(data.data))
      .catch(() => setError('Failed to load colleges.'))
      .finally(() => setLoading(false))
  }, [])

  const handleSave = (saved) => {
    setColleges((prev) => {
      const exists = prev.find((c) => c.id === saved.id)
      return exists
        ? prev.map((c) => (c.id === saved.id ? saved : c))
        : [...prev, saved]
    })
    setModal(null)
  }

  const handleDelete = async (id) => {
    setDeletingId(id)
    try {
      const res = await fetch(`/api/colleges/${id}`, {
        method: 'DELETE',
        headers: authHeaders(),
      })
      if (res.ok || res.status === 204) {
        setColleges((prev) => prev.filter((c) => c.id !== id))
      }
    } finally {
      setDeletingId(null)
    }
  }

  const counts = colleges.reduce((acc, c) => {
    acc[c.status] = (acc[c.status] || 0) + 1
    return acc
  }, {})

  const visible =
    filter === 'all' ? colleges : colleges.filter((c) => c.status === filter)

  const formatDeadline = (dateStr) => {
    if (!dateStr) return null
    const [y, m, d] = dateStr.split('-').map(Number)
    return new Date(y, m - 1, d).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const isUrgent = (dateStr) => {
    if (!dateStr) return false
    const [y, m, d] = dateStr.split('-').map(Number)
    const deadline = new Date(y, m - 1, d)
    const diff = (deadline - Date.now()) / (1000 * 60 * 60 * 24)
    return diff >= 0 && diff <= 14
  }

  return (
    <div className="dash-root">
      <nav className="dash-nav">
        <span className="dash-logo">UncommonApp</span>
        <div className="dash-nav-right">
          <span className="muted">{user.name}</span>
          <button className="ghost" type="button" onClick={onSignOut}>Sign out</button>
        </div>
      </nav>

      <main className="dash-main">
        <div className="dash-header">
          <div>
            <h2>My Applications</h2>
            <p>{colleges.length} {colleges.length === 1 ? 'school' : 'schools'} tracked</p>
          </div>
          <button className="primary-button" onClick={() => setModal({})}>
            + Add school
          </button>
        </div>

        {colleges.length > 0 && (
          <div className="stats-row">
            {STATUSES.filter((s) => counts[s]).map((s) => (
              <div key={s} className="stat-chip" style={{ borderColor: STATUS_META[s].color + '44' }}>
                <span className="stat-count" style={{ color: STATUS_META[s].color }}>{counts[s]}</span>
                <span className="stat-label">{STATUS_META[s].label}</span>
              </div>
            ))}
          </div>
        )}

        {colleges.length > 0 && (
          <div className="filter-row">
            <button
              className={`filter-pill ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All ({colleges.length})
            </button>
            {STATUSES.filter((s) => counts[s]).map((s) => (
              <button
                key={s}
                className={`filter-pill ${filter === s ? 'active' : ''}`}
                onClick={() => setFilter(s)}
                style={filter === s ? { background: STATUS_META[s].bg, color: STATUS_META[s].color, borderColor: STATUS_META[s].color + '44' } : {}}
              >
                {STATUS_META[s].label} ({counts[s]})
              </button>
            ))}
          </div>
        )}

        {error && <div className="error">{error}</div>}

        {loading ? (
          <p className="muted" style={{ padding: '32px 0' }}>Loading…</p>
        ) : visible.length === 0 ? (
          <div className="empty-state">
            <p>
              {filter === 'all'
                ? 'No schools added yet.'
                : `No schools with status "${STATUS_META[filter]?.label}".`}
            </p>
            {filter === 'all' && (
              <button className="primary-button" onClick={() => setModal({})}>
                Add your first school
              </button>
            )}
          </div>
        ) : (
          <div className="college-list">
            {visible.map((c) => (
              <div key={c.id} className="college-card">
                <div className="college-main">
                  <div className="college-name-row">
                    <h3 className="college-name">{c.name}</h3>
                    <StatusBadge status={c.status} />
                  </div>
                  <div className="college-meta">
                    {c.deadline && (
                      <span className={`college-deadline ${isUrgent(c.deadline) ? 'urgent' : ''}`}>
                        {isUrgent(c.deadline) ? '⚠ ' : ''}Due {formatDeadline(c.deadline)}
                      </span>
                    )}
                    {c.notes && (
                      <span className="college-notes">{c.notes}</span>
                    )}
                  </div>
                </div>
                <div className="college-actions">
                  <button
                    className="icon-btn"
                    title="Edit"
                    onClick={() => setModal({ college: c })}
                  >
                    ✏
                  </button>
                  <button
                    className="icon-btn icon-btn--danger"
                    title="Delete"
                    disabled={deletingId === c.id}
                    onClick={() => {
                      if (window.confirm(`Remove ${c.name}?`)) handleDelete(c.id)
                    }}
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {modal !== null && (
        <CollegeModal
          college={modal.college}
          onSave={handleSave}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  )
}
