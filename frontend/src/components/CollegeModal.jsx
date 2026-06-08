import { useEffect, useState } from 'react'
import '../Dashboard.css'

const STATUSES = ['Not Started', 'In Progress', 'Applied', 'Accepted', 'Rejected', 'Waitlisted']
const TYPES = ['EA', 'ED', 'RD', 'None']
const INTERESTS = ['Safety', 'Match', 'Reach']

const empty = {
  name: '',
  type: 'RD',
  status: 'Not Started',
  interest: 'Match',
  essays: '',
  fee: '',
  satAct: false,
  notes: '',
}

export default function CollegeModal({ college, onSave, onClose }) {
  const [form, setForm] = useState(college ? { ...college } : { ...empty })
  const [nameError, setNameError] = useState('')

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const set = (field, value) => setForm((f) => ({ ...f, [field]: value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.name.trim()) { setNameError('College name is required.'); return }
    onSave({
      ...form,
      name: form.name.trim(),
      essays: form.essays === '' ? null : Number(form.essays),
      fee: form.fee === '' ? null : Number(form.fee),
    })
  }

  return (
    <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" role="dialog" aria-modal="true">
        <div className="modal-header">
          <h2>{college ? 'Edit college' : 'Add college'}</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M2 2l14 14M16 2L2 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        <form className="modal-body" onSubmit={handleSubmit}>
          <div className="field field-full">
            <label htmlFor="college-name">College name <span className="required">*</span></label>
            <input
              id="college-name"
              type="text"
              placeholder="e.g. MIT, Stanford University"
              value={form.name}
              onChange={(e) => { set('name', e.target.value); setNameError('') }}
              autoFocus
            />
            {nameError && <span className="field-error">{nameError}</span>}
          </div>

          <div className="field-row">
            <div className="field">
              <label htmlFor="app-type">Application round</label>
              <select id="app-type" value={form.type} onChange={(e) => set('type', e.target.value)}>
                {TYPES.map((t) => <option key={t} value={t}>{t === 'None' ? 'Not set' : t}</option>)}
              </select>
            </div>
            <div className="field">
              <label htmlFor="status">Status</label>
              <select id="status" value={form.status} onChange={(e) => set('status', e.target.value)}>
                {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div className="field-row">
            <div className="field">
              <label htmlFor="interest">Level of interest</label>
              <select id="interest" value={form.interest} onChange={(e) => set('interest', e.target.value)}>
                {INTERESTS.map((i) => <option key={i} value={i}>{i}</option>)}
              </select>
            </div>
            <div className="field">
              <label htmlFor="fee">Application fee ($)</label>
              <input
                id="fee"
                type="number"
                min="0"
                placeholder="e.g. 75"
                value={form.fee}
                onChange={(e) => set('fee', e.target.value)}
              />
            </div>
          </div>

          <div className="field-row">
            <div className="field">
              <label htmlFor="essays">Number of essays</label>
              <input
                id="essays"
                type="number"
                min="0"
                placeholder="e.g. 3"
                value={form.essays}
                onChange={(e) => set('essays', e.target.value)}
              />
            </div>
            <div className="field field-check">
              <label className="check-label">
                <input
                  type="checkbox"
                  checked={form.satAct}
                  onChange={(e) => set('satAct', e.target.checked)}
                />
                <span>SAT / ACT required</span>
              </label>
            </div>
          </div>

          <div className="field field-full">
            <label htmlFor="notes">Notes</label>
            <textarea
              id="notes"
              rows={3}
              placeholder="Anything you want to remember about this school…"
              value={form.notes}
              onChange={(e) => set('notes', e.target.value)}
            />
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary">
              {college ? 'Save changes' : 'Add college'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
