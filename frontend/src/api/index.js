import axios from 'axios'

const api = axios.create({ baseURL: 'https://student-result-backend-w1l0.onrender.com/api' })

// Students
export const getStudents = () => api.get('/students')
export const addStudent = (data) => api.post('/students', data)
export const getStudentReport = (id) => api.get(`/students/${id}/report`)

// Subjects
export const getSubjects = () => api.get('/subjects')
export const addSubject = (data) => api.post('/subjects', data)
export const getSubjectReport = (code) => api.get(`/subjects/${code}/report`)

// Admins
export const getAdmins = () => api.get('/admins')
export const addAdmin = (data) => api.post('/admins', data)

// Results
export const getResults = () => api.get('/results')
export const addResult = (data) => api.post('/results', data)
export const getFailingStudents = () => api.get('/results/failing')

// Dashboard
export const getDashboard = () => api.get('/dashboard')

// Notifications
export const getNotifications = () => api.get('/notifications')
export const markNotificationSent = (id) => api.put(`/notifications/${id}/sent`)
export const archiveOldNotifications = () => api.delete('/notifications/archive')

export default api
