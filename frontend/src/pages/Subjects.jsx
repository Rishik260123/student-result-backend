// import { useEffect, useState } from 'react'
// import { getSubjects, addSubject, getSubjectReport } from '../api'
// import { BookPlus, X, BarChart2 } from 'lucide-react'

// function Modal({ onClose, children }) {
//   return (
//     <div className="modal-overlay" onClick={onClose}>
//       <div className="modal fade-up" onClick={e => e.stopPropagation()}>{children}</div>
//     </div>
//   )
// }

// export default function Subjects() {
//   const [subjects, setSubjects] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [showAdd, setShowAdd] = useState(false)
//   const [report, setReport] = useState(null)
//   const [reportSubject, setReportSubject] = useState(null)
//   const [form, setForm] = useState({ code: '', name: '' })
//   const [msg, setMsg] = useState(null)
//   const [submitting, setSubmitting] = useState(false)

//   const load = () => getSubjects().then(r => setSubjects(r.data)).finally(() => setLoading(false))
//   useEffect(() => { load() }, [])

//   const handleAdd = async (e) => {
//     e.preventDefault()
//     setSubmitting(true); setMsg(null)
//     try {
//       await addSubject({ code: form.code, name: form.name })
//       setMsg({ type: 'success', text: 'Subject added!' })
//       setForm({ code: '', name: '' })
//       load()
//       setTimeout(() => setShowAdd(false), 1200)
//     } catch (err) {
//       setMsg({ type: 'error', text: err.response?.data?.error || 'Error adding subject' })
//     } finally { setSubmitting(false) }
//   }

//   const viewReport = async (sub) => {
//     setReportSubject(sub)
//     const r = await getSubjectReport(sub.SubjectCode)
//     setReport(r.data[0] || null)
//   }

//   return (
//     <>
//       <div className="topbar">
//         <div><h2>Subjects</h2><p>{subjects.length} subjects available</p></div>
//         <button className="btn btn-primary" onClick={() => setShowAdd(true)}><BookPlus /> Add Subject</button>
//       </div>
//       <div className="page-content fade-up">
//         <div className="card">
//           {loading ? <div className="loading"><div className="spinner" />Loading...</div> : (
//             <div className="table-wrap">
//               <table>
//                 <thead><tr><th>Code</th><th>Subject Name</th><th>Actions</th></tr></thead>
//                 <tbody>
//                   {subjects.map(s => (
//                     <tr key={s.SubjectCode}>
//                       <td><span className="badge badge-teal">{s.SubjectCode}</span></td>
//                       <td>{s.SubjectName}</td>
//                       <td>
//                         <button className="btn btn-ghost" style={{padding:'5px 10px',fontSize:12}} onClick={() => viewReport(s)}>
//                           <BarChart2 size={12}/> Report
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                   {subjects.length === 0 && <tr><td colSpan="3" style={{textAlign:'center',padding:'24px',color:'var(--text3)'}}>No subjects yet</td></tr>}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>
//       </div>

//       {showAdd && (
//         <Modal onClose={() => { setShowAdd(false); setMsg(null) }}>
//           <div className="flex-between mb-4">
//             <h3>Add New Subject</h3>
//             <button className="btn btn-ghost" style={{padding:'4px 8px'}} onClick={() => { setShowAdd(false); setMsg(null) }}><X size={14}/></button>
//           </div>
//           {msg && <div className={`alert alert-${msg.type}`}>{msg.text}</div>}
//           <form onSubmit={handleAdd}>
//             <div className="form-grid single" style={{gap:14}}>
//               <div className="form-group">
//                 <label>Subject Code *</label>
//                 <input required placeholder="CS101" value={form.code} onChange={e => setForm({...form, code: e.target.value})} />
//               </div>
//               <div className="form-group">
//                 <label>Subject Name *</label>
//                 <input required placeholder="Data Structures" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
//               </div>
//             </div>
//             <div className="flex-gap" style={{marginTop:20,justifyContent:'flex-end'}}>
//               <button type="button" className="btn btn-ghost" onClick={() => setShowAdd(false)}>Cancel</button>
//               <button type="submit" className="btn btn-primary" disabled={submitting}>{submitting ? 'Saving...' : 'Add Subject'}</button>
//             </div>
//           </form>
//         </Modal>
//       )}

//       {report !== undefined && reportSubject && (
//         <Modal onClose={() => { setReport(undefined); setReportSubject(null) }}>
//           <div className="flex-between mb-4">
//             <div>
//               <h3>{reportSubject.SubjectName}</h3>
//               <p style={{color:'var(--text3)',fontSize:13,marginTop:2}}>Subject Analytics</p>
//             </div>
//             <button className="btn btn-ghost" style={{padding:'4px 8px'}} onClick={() => { setReport(undefined); setReportSubject(null) }}><X size={14}/></button>
//           </div>
//           {!report ? (
//             <div className="empty"><p>No results for this subject yet</p></div>
//           ) : (
//             <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:12}}>
//               <div className="stat-card teal" style={{padding:'16px'}}>
//                 <div className="stat-label">Average</div>
//                 <div className="stat-value" style={{fontSize:22}}>{Math.round(report.AverageMarks)}</div>
//               </div>
//               <div className="stat-card purple" style={{padding:'16px'}}>
//                 <div className="stat-label">Top Score</div>
//                 <div className="stat-value" style={{fontSize:22}}>{report.TopScore}</div>
//               </div>
//               <div className="stat-card amber" style={{padding:'16px'}}>
//                 <div className="stat-label">Students</div>
//                 <div className="stat-value" style={{fontSize:22}}>{report.TotalStudents}</div>
//               </div>
//             </div>
//           )}
//         </Modal>
//       )}
//     </>
//   )
// }

import { useEffect, useState } from 'react'
import { getSubjects, addSubject, getSubjectReport } from '../api'
import api from '../api'   // ✅ IMPORTANT
import { BookPlus, X, BarChart2, Trash2, AlertTriangle } from 'lucide-react'

function Modal({ onClose, children }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal fade-up" onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>
  )
}

export default function Subjects() {
  const [subjects, setSubjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [report, setReport] = useState(null)
  const [reportSubject, setReportSubject] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null) // ✅ NEW
  const [form, setForm] = useState({ code: '', name: '' })
  const [msg, setMsg] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const load = () =>
    getSubjects()
      .then(r => setSubjects(r.data))
      .finally(() => setLoading(false))

  useEffect(() => { load() }, [])

  const handleAdd = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setMsg(null)
    try {
      await addSubject({ code: form.code, name: form.name })
      setMsg({ type: 'success', text: 'Subject added!' })
      setForm({ code: '', name: '' })
      load()
      setTimeout(() => setShowAdd(false), 1200)
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.error || 'Error adding subject' })
    } finally {
      setSubmitting(false)
    }
  }

  // ✅ DELETE FUNCTION (FIXED)
  const handleDelete = async () => {
    setDeleting(true)
    try {
      await api.delete(`/subjects/${deleteTarget.SubjectCode}`)
      setDeleteTarget(null)
      load()
    } catch (err) {
      alert(err.response?.data?.error || 'Error deleting subject')
    } finally {
      setDeleting(false)
    }
  }

  const viewReport = async (sub) => {
    setReportSubject(sub)
    const r = await getSubjectReport(sub.SubjectCode)
    setReport(r.data[0] || null)
  }

  return (
    <>
      <div className="topbar">
        <div>
          <h2>Subjects</h2>
          <p>{subjects.length} subjects available</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAdd(true)}>
          <BookPlus /> Add Subject
        </button>
      </div>

      <div className="page-content fade-up">
        <div className="card">
          {loading ? (
            <div className="loading"><div className="spinner" />Loading...</div>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Code</th>
                    <th>Subject Name</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {subjects.map(s => (
                    <tr key={s.SubjectCode}>
                      <td>
                        <span className="badge badge-teal">{s.SubjectCode}</span>
                      </td>
                      <td>{s.SubjectName}</td>
                      <td>
                        <div className="flex-gap">
                          <button
                            className="btn btn-ghost"
                            style={{ padding: '5px 10px', fontSize: 12 }}
                            onClick={() => viewReport(s)}
                          >
                            <BarChart2 size={12}/> Report
                          </button>

                          {/* ✅ DELETE BUTTON */}
                          <button
                            className="btn btn-danger"
                            style={{ padding: '5px 10px', fontSize: 12 }}
                            onClick={() => setDeleteTarget(s)}
                          >
                            <Trash2 size={12}/> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {subjects.length === 0 && (
                    <tr>
                      <td colSpan="3" style={{ textAlign: 'center', padding: '24px', color: 'var(--text3)' }}>
                        No subjects yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* ADD MODAL */}
      {showAdd && (
        <Modal onClose={() => { setShowAdd(false); setMsg(null) }}>
          <div className="flex-between mb-4">
            <h3>Add New Subject</h3>
            <button className="btn btn-ghost" onClick={() => setShowAdd(false)}>
              <X size={14}/>
            </button>
          </div>

          {msg && <div className={`alert alert-${msg.type}`}>{msg.text}</div>}

          <form onSubmit={handleAdd}>
            <div className="form-grid single">
              <input required placeholder="CS101"
                value={form.code}
                onChange={e => setForm({ ...form, code: e.target.value })} />

              <input required placeholder="Data Structures"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })} />
            </div>

            <button type="submit" disabled={submitting}>
              {submitting ? 'Saving...' : 'Add Subject'}
            </button>
          </form>
        </Modal>
      )}

      {/* ✅ DELETE MODAL */}
      {deleteTarget && (
        <Modal onClose={() => setDeleteTarget(null)}>
          <div style={{ textAlign: 'center' }}>
            <AlertTriangle size={40} style={{ color: 'red' }} />
            <h3>Delete Subject?</h3>
            <p>{deleteTarget.SubjectName}</p>

            <button onClick={() => setDeleteTarget(null)}>Cancel</button>
            <button onClick={handleDelete} disabled={deleting}>
              {deleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </Modal>
      )}
    </>
  )
}
