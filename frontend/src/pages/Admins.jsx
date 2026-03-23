import { useEffect, useState } from 'react'
import { getAdmins, addAdmin } from '../api'
import api from '../api'
import { UserCog, X, Trash2, AlertTriangle } from 'lucide-react'

function Modal({ onClose, children }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal fade-up" onClick={e => e.stopPropagation()}>{children}</div>
    </div>
  )
}

export default function Admins() {
  const [admins, setAdmins] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [form, setForm] = useState({ name: '', email: '' })
  const [msg, setMsg] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const load = () => getAdmins().then(r => setAdmins(r.data)).finally(() => setLoading(false))
  useEffect(() => { load() }, [])

  const handleAdd = async (e) => {
    e.preventDefault()
    setSubmitting(true); setMsg(null)
    try {
      await addAdmin({ name: form.name, email: form.email })
      setMsg({ type: 'success', text: 'Admin added!' })
      setForm({ name: '', email: '' })
      load()
      setTimeout(() => setShowAdd(false), 1200)
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.error || 'Error adding admin' })
    } finally { setSubmitting(false) }
  }

  // const handleDelete = async () => {
  //   setDeleting(true)
  //   try {
  //     await axios.delete(`/api/admins/${deleteTarget.AdminID}`)
  //     setDeleteTarget(null)
  //     load()
  //   } catch (err) {
  //     alert(err.response?.data?.error || 'Error deleting admin')
  //   } finally { setDeleting(false) }
  // }
  const handleDelete = async () => {
  setDeleting(true)
  try {
    await api.delete(`/admins/${deleteTarget.AdminID}`)
    setDeleteTarget(null)
    load()
  } catch (err) {
    alert(err.response?.data?.error || 'Error deleting admin')
  } finally {
    setDeleting(false)
  }
}

  return (
    <>
      <div className="topbar">
        <div><h2>Admins</h2><p>{admins.length} administrators</p></div>
        <button className="btn btn-primary" onClick={() => setShowAdd(true)}><UserCog /> Add Admin</button>
      </div>

      <div className="page-content fade-up">
        <div className="card">
          {loading ? <div className="loading"><div className="spinner" />Loading...</div> : (
            <div className="table-wrap">
              <table>
                <thead><tr><th>ID</th><th>Name</th><th>Email</th><th>Actions</th></tr></thead>
                <tbody>
                  {admins.map(a => (
                    <tr key={a.AdminID}>
                      <td>#{a.AdminID}</td>
                      <td>{a.AdminName}</td>
                      <td>{a.AdminEmail || <span style={{ color: 'var(--text3)' }}>—</span>}</td>
                      <td>
                        <button className="btn btn-danger" style={{ padding: '5px 10px', fontSize: 12 }} onClick={() => setDeleteTarget(a)}>
                          <Trash2 size={12} /> Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                  {admins.length === 0 && <tr><td colSpan="4" style={{ textAlign: 'center', padding: '24px', color: 'var(--text3)' }}>No admins yet</td></tr>}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Add Admin Modal */}
      {showAdd && (
        <Modal onClose={() => { setShowAdd(false); setMsg(null) }}>
          <div className="flex-between mb-4">
            <h3>Add New Admin</h3>
            <button className="btn btn-ghost" style={{ padding: '4px 8px' }} onClick={() => { setShowAdd(false); setMsg(null) }}><X size={14} /></button>
          </div>
          {msg && <div className={`alert alert-${msg.type}`}>{msg.text}</div>}
          <form onSubmit={handleAdd}>
            <div className="form-grid single" style={{ gap: 14 }}>
              <div className="form-group">
                <label>Admin Name *</label>
                <input required placeholder="Dr. Sharma" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input type="email" placeholder="admin@college.edu" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
              </div>
            </div>
            <div className="flex-gap" style={{ marginTop: 20, justifyContent: 'flex-end' }}>
              <button type="button" className="btn btn-ghost" onClick={() => setShowAdd(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={submitting}>{submitting ? 'Saving...' : 'Add Admin'}</button>
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
            <h3 style={{ marginBottom: 8 }}>Delete Admin?</h3>
            <p style={{ color: 'var(--text2)', fontSize: 14, marginBottom: 6 }}>
              You are about to delete <strong style={{ color: 'var(--text)' }}>{deleteTarget.AdminName}</strong>.
            </p>
            <p style={{ color: 'var(--text3)', fontSize: 13, marginBottom: 24 }}>
              This will also delete all results entered by this admin permanently.
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
    </>
  )
}
