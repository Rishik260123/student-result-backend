import { useEffect, useState } from 'react'
import { getStudents, addStudent, getStudentReport } from '../api'
// import axios from 'axios'
import api from '../api'
import { UserPlus, Search, Eye, Trash2, X, AlertTriangle } from 'lucide-react'

function Modal({ onClose, children }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal fade-up" onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>
  )
}

export default function Students() {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [report, setReport] = useState(null)
  const [reportStudent, setReportStudent] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [search, setSearch] = useState('')
  const [form, setForm] = useState({ name: '', phone: '', email: '' })
  const [msg, setMsg] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const load = () => getStudents().then(r => setStudents(r.data)).finally(() => setLoading(false))
  useEffect(() => { load() }, [])

  const handleAdd = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setMsg(null)
    try {
      await addStudent({ name: form.name, phone: form.phone, email: form.email })
      setMsg({ type: 'success', text: 'Student added successfully!' })
      setForm({ name: '', phone: '', email: '' })
      load()
      setTimeout(() => setShowAdd(false), 1200)
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.error || 'Error adding student' })
    } finally {
      setSubmitting(false)
    }
  }

  // const handleDelete = async () => {
  //   setDeleting(true)
  //   try {
  //     await axios.delete(`/api/students/${deleteTarget.StudentID}`)
  //     setDeleteTarget(null)
  //     load()
  //   } catch (err) {
  //     alert(err.response?.data?.error || 'Error deleting student')
  //   } finally {
  //     setDeleting(false)
  //   }
  // }
  const handleDelete = async () => {
  setDeleting(true)
  try {
    await api.delete(`/students/${deleteTarget.StudentID}`)
    setDeleteTarget(null)
    load()
  } catch (err) {
    alert(err.response?.data?.error || 'Error deleting student')
  } finally {
    setDeleting(false)
  }
}

  const viewReport = async (s) => {
    setReportStudent(s)
    const r = await getStudentReport(s.StudentID)
    setReport(r.data)
  }

  const filtered = students.filter(s =>
    s.StudentName.toLowerCase().includes(search.toLowerCase()) ||
    s.Email?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <>
      <div className="topbar">
        <div><h2>Students</h2><p>{students.length} registered students</p></div>
        <button className="btn btn-primary" onClick={() => setShowAdd(true)}>
          <UserPlus /> Add Student
        </button>
      </div>

      <div className="page-content fade-up">
        <div className="card">
          <div className="card-header">
            <div className="flex-gap">
              <Search size={14} style={{ color: 'var(--text3)' }} />
              <input
                style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 8, padding: '6px 12px', color: 'var(--text)', fontSize: 13, outline: 'none', width: 220 }}
                placeholder="Search students..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <span className="badge badge-purple">{filtered.length} shown</span>
          </div>

          {loading ? <div className="loading"><div className="spinner" />Loading...</div> : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr><th>ID</th><th>Name</th><th>Phone</th><th>Email</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  {filtered.map(s => (
                    <tr key={s.StudentID}>
                      <td>#{s.StudentID}</td>
                      <td>{s.StudentName}</td>
                      <td>{s.Phone_Number || <span style={{ color: 'var(--text3)' }}>—</span>}</td>
                      <td>{s.Email}</td>
                      <td>
                        <div className="flex-gap">
                          <button className="btn btn-ghost" style={{ padding: '5px 10px', fontSize: 12 }} onClick={() => viewReport(s)}>
                            <Eye size={12} /> Report
                          </button>
                          <button className="btn btn-danger" style={{ padding: '5px 10px', fontSize: 12 }} onClick={() => setDeleteTarget(s)}>
                            <Trash2 size={12} /> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr><td colSpan="5" style={{ textAlign: 'center', padding: '24px', color: 'var(--text3)' }}>No students found</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Add Student Modal */}
      {showAdd && (
        <Modal onClose={() => { setShowAdd(false); setMsg(null) }}>
          <div className="flex-between mb-4">
            <h3>Add New Student</h3>
            <button className="btn btn-ghost" style={{ padding: '4px 8px' }} onClick={() => { setShowAdd(false); setMsg(null) }}><X size={14} /></button>
          </div>
          {msg && <div className={`alert alert-${msg.type}`}>{msg.text}</div>}
          <form onSubmit={handleAdd}>
            <div className="form-grid single" style={{ gap: 14 }}>
              <div className="form-group">
                <label>Full Name *</label>
                <input required placeholder="John Doe" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input placeholder="+91 9876543210" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Email Address *</label>
                <input required type="email" placeholder="john@example.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
              </div>
            </div>
            <div className="flex-gap" style={{ marginTop: 20, justifyContent: 'flex-end' }}>
              <button type="button" className="btn btn-ghost" onClick={() => setShowAdd(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? 'Saving...' : 'Add Student'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <Modal onClose={() => setDeleteTarget(null)}>
          <div style={{ textAlign: 'center', padding: '8px 0' }}>
            <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'var(--red-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <AlertTriangle size={24} style={{ color: 'var(--red)' }} />
            </div>
            <h3 style={{ marginBottom: 8 }}>Delete Student?</h3>
            <p style={{ color: 'var(--text2)', fontSize: 14, marginBottom: 6 }}>
              You are about to delete <strong style={{ color: 'var(--text)' }}>{deleteTarget.StudentName}</strong>.
            </p>
            <p style={{ color: 'var(--text3)', fontSize: 13, marginBottom: 24 }}>
              This will also delete all their results and notifications permanently.
            </p>
            <div className="flex-gap" style={{ justifyContent: 'center' }}>
              <button className="btn btn-ghost" onClick={() => setDeleteTarget(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={handleDelete} disabled={deleting}>
                <Trash2 size={13} /> {deleting ? 'Deleting...' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Report Modal */}
      {report && (
        <Modal onClose={() => { setReport(null); setReportStudent(null) }}>
          <div className="flex-between mb-4">
            <div>
              <h3>{reportStudent?.StudentName}</h3>
              <p style={{ color: 'var(--text3)', fontSize: 13, marginTop: 2 }}>Student Report</p>
            </div>
            <button className="btn btn-ghost" style={{ padding: '4px 8px' }} onClick={() => setReport(null)}><X size={14} /></button>
          </div>
          {report.length === 0 ? (
            <div className="empty"><p>No results found for this student</p></div>
          ) : (
            <table>
              <thead><tr><th>Subject</th><th>Marks</th><th>Grade</th></tr></thead>
              <tbody>
                {report.map((r, i) => (
                  <tr key={i}>
                    <td>{r.SubjectName}</td>
                    <td>{r.MarksObtained}</td>
                    <td>
                      <span className={`badge ${r.Grade === 'F' ? 'badge-red' : r.Grade === 'A' ? 'badge-green' : 'badge-purple'}`}>
                        {r.Grade}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Modal>
      )}
    </>
  )
}
