import { useState } from 'react'
import CollegeCard from './CollegeCard'
import CollegeModal from './CollegeModal'
import '../Dashboard.css'

const SAMPLE = [
  { id: 1, name: 'MIT', type: 'EA', status: 'Applied', interest: 'Reach', essays: 3, fee: 75, satAct: true, notes: 'Strong CS department — highlight research experience in the additional info section.' },
  { id: 2, name: 'Stanford University', type: 'RD', status: 'Not Started', interest: 'Reach', essays: 5, fee: 90, satAct: false, notes: '' },
  { id: 3, name: 'University of Michigan', type: 'EA', status: 'Accepted', interest: 'Match', essays: 2, fee: 75, satAct: true, notes: 'Great financial aid package. Strong engineering program.' },
  { id: 4, name: 'UC Berkeley', type: 'RD', status: 'Applied', interest: 'Reach', essays: 6, fee: 80, satAct: false, notes: 'Applied to EECS major via L&S.' },
  { id: 5, name: 'Boston University', type: 'ED', status: 'Rejected', interest: 'Match', essays: 2, fee: 80, satAct: true, notes: '' },
  { id: 6, name: 'Georgia Tech', type: 'RD', status: 'Not Started', interest: 'Safety', essays: 1, fee: 75, satAct: true, notes: 'Backup option but still a great CS school.' },
]

const ALL_STATUSES = ['All', 'Not Started', 'In Progress', 'Applied', 'Accepted', 'Rejected', 'Waitlisted']
const ALL_TYPES = ['All', 'EA', 'ED', 'RD']
const ALL_SORTS = [
  { value: 'name', label: 'Name' },
  { value: 'status', label: 'Status' },
  { value: 'interest', label: 'Interest level' },
  { value: 'fee', label: 'Fee' },
]
const INTEREST_ORDER = { Safety: 0, Match: 1, Reach: 2 }

export default function Dashboard({ user, onSignOut }) {
  const [colleges, setColleges] = useState(SAMPLE)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [typeFilter, setTypeFilter] = useState('All')
  const [sortBy, setSortBy] = useState('name')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingCollege, setEditingCollege] = useState(null)

  const stats = {
    total: colleges.length,
    applied: colleges.filter((c) => ['In Progress', 'Applied'].includes(c.status)).length,
    accepted: colleges.filter((c) => c.status === 'Accepted').length,
    pending: colleges.filter((c) => c.status === 'Not Started').length,
  }

  const filtered = colleges
    .filter((c) => {
      const q = search.toLowerCase()
      return (
        c.name.toLowerCase().includes(q) &&
        (statusFilter === 'All' || c.status === statusFilter) &&
        (typeFilter === 'All' || c.type === typeFilter)
      )
    })
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name)
      if (sortBy === 'status') return a.status.localeCompare(b.status)
      if (sortBy === 'interest') return (INTEREST_ORDER[a.interest] ?? 3) - (INTEREST_ORDER[b.interest] ?? 3)
      if (sortBy === 'fee') return (a.fee ?? 0) - (b.fee ?? 0)
      return 0
    })

  const openAdd = () => { setEditingCollege(null); setModalOpen(true) }
  const openEdit = (college) => { setEditingCollege(college); setModalOpen(true) }
  const closeModal = () => { setModalOpen(false); setEditingCollege(null) }

  const handleSave = (data) => {
    if (editingCollege) {
      setColleges((prev) => prev.map((c) => (c.id === editingCollege.id ? { ...data, id: c.id } : c)))
    } else {
      setColleges((prev) => [...prev, { ...data, id: Date.now() }])
    }
    closeModal()
  }

  const handleDelete = (id) => {
    if (window.confirm('Remove this college from your list?')) {
      setColleges((prev) => prev.filter((c) => c.id !== id))
    }
  }

  return (
    <div className="dash-root">
      <header className="dash-header">
        <span className="dash-logo">UncommonApp</span>
        <div className="dash-user">
          {user.picture && <img src={user.picture} alt="" className="avatar" />}
          <span className="user-name">{user.name}</span>
          <button className="btn-ghost-sm" onClick={onSignOut}>Sign out</button>
        </div>
      </header>

      <main className="dash-main">
        <div className="dash-top">
          <div>
            <h1 className="dash-title">My Applications</h1>
            <p className="dash-sub">Track and manage every school in one place.</p>
          </div>
          <button className="btn-primary btn-add" onClick={openAdd}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            Add college
          </button>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-label">Total schools</span>
            <span className="stat-value">{stats.total}</span>
          </div>
          <div className="stat-card stat-applied">
            <span className="stat-label">Applied</span>
            <span className="stat-value">{stats.applied}</span>
          </div>
          <div className="stat-card stat-accepted">
            <span className="stat-label">Accepted</span>
            <span className="stat-value">{stats.accepted}</span>
          </div>
          <div className="stat-card stat-pending">
            <span className="stat-label">Not started</span>
            <span className="stat-value">{stats.pending}</span>
          </div>
        </div>

        <div className="toolbar">
          <div className="search-wrap">
            <svg className="search-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <circle cx="6.5" cy="6.5" r="4.5" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M10 10l3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <input
              className="search-input"
              type="search"
              placeholder="Search colleges…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="toolbar-filters">
            <select className="filter-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              {ALL_STATUSES.map((s) => (
                <option key={s} value={s}>{s === 'All' ? 'All statuses' : s}</option>
              ))}
            </select>

            <select className="filter-select" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
              {ALL_TYPES.map((t) => (
                <option key={t} value={t}>{t === 'All' ? 'All rounds' : t}</option>
              ))}
            </select>

            <select className="filter-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              {ALL_SORTS.map((s) => (
                <option key={s.value} value={s.value}>Sort by {s.label}</option>
              ))}
            </select>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="empty-state">
            {colleges.length === 0 ? (
              <>
                <div className="empty-icon">🎓</div>
                <h3>No colleges yet</h3>
                <p>Add your first school to get started tracking your applications.</p>
                <button className="btn-primary" onClick={openAdd}>Add your first college</button>
              </>
            ) : (
              <>
                <div className="empty-icon">🔍</div>
                <h3>No results</h3>
                <p>Try adjusting your search or filters.</p>
              </>
            )}
          </div>
        ) : (
          <div className="college-grid">
            {filtered.map((c) => (
              <CollegeCard key={c.id} college={c} onEdit={openEdit} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </main>

      {modalOpen && (
        <CollegeModal college={editingCollege} onSave={handleSave} onClose={closeModal} />
      )}
    </div>
  )
}
