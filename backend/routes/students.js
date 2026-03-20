const router = require('express').Router()

router.get('/', async (req, res) => {
  try {
    const [rows] = await req.db.query('SELECT * FROM Student ORDER BY StudentID DESC')
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.post('/', async (req, res) => {
  const { name, phone, email } = req.body
  if (!name || !email) return res.status(400).json({ error: 'Name and email are required' })
  try {
    await req.db.query('CALL AddStudent(?, ?, ?)', [name, phone || null, email])
    res.status(201).json({ message: 'Student added successfully' })
  } catch (err) {
    res.status(400).json({ error: err.sqlMessage || err.message })
  }
})

router.get('/:id/report', async (req, res) => {
  try {
    const [rows] = await req.db.query('CALL GetStudentReport(?)', [req.params.id])
    res.json(rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const [result] = await req.db.query('DELETE FROM Student WHERE StudentID = ?', [req.params.id])
    if (result.affectedRows === 0)
      return res.status(404).json({ error: 'Student not found' })
    res.json({ message: 'Student deleted successfully' })
  } catch (err) {
    res.status(500).json({ error: err.sqlMessage || err.message })
  }
})

module.exports = router
