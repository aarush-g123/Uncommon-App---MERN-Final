import '../Dashboard.css'

const STATUS_META = {
  'Not Started': { bg: '#f1f5f9', color: '#475569' },
  'In Progress': { bg: '#fef3c7', color: '#92400e' },
  'Applied':     { bg: '#dbeafe', color: '#1d4ed8' },
  'Accepted':    { bg: '#d1fae5', color: '#065f46' },
  'Rejected':    { bg: '#fee2e2', color: '#991b1b' },
  'Waitlisted':  { bg: '#ffedd5', color: '#c2410c' },
}

const TYPE_META = {
  EA:   { bg: '#ede9fe', color: '#6d28d9' },
  ED:   { bg: '#fce7f3', color: '#9d174d' },
  RD:   { bg: '#cffafe', color: '#155e75' },
  None: { bg: '#f1f5f9', color: '#64748b' },
}

const INTEREST_META = {
  Safety: { bg: '#d1fae5', color: '#065f46' },
  Match:  { bg: '#dbeafe', color: '#1d4ed8' },
  Reach:  { bg: '#ffedd5', color: '#c2410c' },
}

function Badge({ label, meta }) {
  if (!meta) return null
  return (
    <span className="badge" style={{ background: meta.bg, color: meta.color }}>
      {label}
    </span>
  )
}

export default function CollegeCard({ college, onEdit, onDelete }) {
  const { name, type, status, interest, essays, fee, satAct, notes } = college

  return (
    <article className="college-card">
      <div className="card-top">
        <h3 className="card-name">{name}</h3>
        <div className="card-badges">
          <Badge label={status} meta={STATUS_META[status]} />
          {type !== 'None' && <Badge label={type} meta={TYPE_META[type]} />}
        </div>
      </div>

      <div className="card-interest">
        <Badge label={interest} meta={INTEREST_META[interest]} />
      </div>

      <div className="card-meta">
        {fee != null && (
          <span className="meta-item">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.2"/>
              <path d="M7 4v6M5 5.5h2.5c.83 0 1.5.67 1.5 1.5S8.33 8.5 7.5 8.5H5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
            ${fee} fee
          </span>
        )}
        {essays != null && (
          <span className="meta-item">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <rect x="2" y="1" width="10" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.2"/>
              <path d="M4 4.5h6M4 7h6M4 9.5h4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
            {essays} {essays === 1 ? 'essay' : 'essays'}
          </span>
        )}
        {satAct && (
          <span className="meta-item meta-check">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M2 7l3.5 3.5L12 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            SAT/ACT
          </span>
        )}
      </div>

      {notes && <p className="card-notes">{notes}</p>}

      <div className="card-actions">
        <button className="card-btn edit-btn" onClick={() => onEdit(college)}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M9.5 2.5l2 2L4 12H2v-2L9.5 2.5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
          </svg>
          Edit
        </button>
        <button className="card-btn delete-btn" onClick={() => onDelete(college.id)}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M2 3.5h10M5 3.5V2h4v1.5M5.5 6v4M8.5 6v4M3.5 3.5l.5 8h6l.5-8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Delete
        </button>
      </div>
    </article>
  )
}
