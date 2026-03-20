require('dotenv').config()
// just for checking 
console.log('🚀 Server file loaded')

const express = require('express')
const cors = require('cors')
const mysql = require('mysql2/promise')

const app = express()
app.use(cors())
app.use(express.json())



const pool = mysql.createPool({
  uri: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// const pool = mysql.createPool({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
//   port: process.env.DB_PORT,
//   waitForConnections: true,
//   connectionLimit: 10,
//   ssl: {
//     minVersion: 'TLSv1.2',
//     rejectUnauthorized: false
//   }
// });

// Test DB connection on startup
pool.getConnection()
  .then(conn => {
    console.log('✅ MySQL connected successfully')
    conn.release()
  })
  .catch(err => {
    console.error('❌ MySQL connection failed:', err.message)
    process.exit(1)
  })

// Attach pool to every request
app.use((req, _res, next) => {
  req.db = pool
  next()
})
//checking for routes
console.log('Loading routes...')
// Routes
app.use('/api/students',      require('./routes/students'))
app.use('/api/subjects',      require('./routes/subjects'))
app.use('/api/admins',        require('./routes/admins'))
app.use('/api/results',       require('./routes/results'))
app.use('/api/notifications', require('./routes/notifications'))
app.use('/api/dashboard',     require('./routes/dashboard'))

app.get('/', (req, res) => {
  res.send('🚀 Student Result Backend is running')
})

// Health check
app.get('/api/health', (_req, res) => res.json({ status: 'ok', time: new Date() }))

// Global error handler
app.use((err, _req, res, _next) => {
  console.error('Unhandled error:', err)
  res.status(500).json({ error: err.message || 'Internal server error' })
})

// const PORT = process.env.PORT || 5000
// app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`))

const PORT = process.env.PORT || 5000

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`)
})