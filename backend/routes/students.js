const router = require('express').Router()

// ✅ GET all students
router.get('/', async (req, res) => {
  try {
    const [rows] = await req.db.query(
      'SELECT * FROM Student ORDER BY StudentID DESC'
    )
    res.json(rows)
  } catch (err) {
    console.error("GET STUDENTS ERROR:", err)
    res.status(500).json({ error: err.message })
  }
})


// ✅ ADD student
router.post('/', async (req, res) => {
  const { name, phone, email } = req.body

  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' })
  }

  try {
    await req.db.query(
      'CALL AddStudent(?, ?, ?)', 
      [name, phone || null, email]
    )

    res.status(201).json({ message: 'Student added successfully' })

  } catch (err) {
    console.error("ADD STUDENT ERROR:", err)
    res.status(400).json({ error: err.sqlMessage || err.message })
  }
})


// ✅ GET student report
router.get('/:id/report', async (req, res) => {
  try {
    const [rows] = await req.db.query(
      'CALL GetStudentReport(?)', 
      [req.params.id]
    )

    res.json(rows[0])

  } catch (err) {
    console.error("REPORT ERROR:", err)
    res.status(500).json({ error: err.message })
  }
})


// ✅ DELETE student (FIXED PROPERLY)
router.delete('/:id', async (req, res) => {
  const id = req.params.id

  console.log("DELETE STUDENT:", id) // 🔥 DEBUG LOG

  try {
    // 1️⃣ delete notifications
    await req.db.query(`
      DELETE FROM Notification 
      WHERE ResultID IN (
        SELECT ResultID FROM Result WHERE StudentID = ?
      )
    `, [id])

    // 2️⃣ delete results
    await req.db.query(
      'DELETE FROM Result WHERE StudentID = ?', 
      [id]
    )

    // 3️⃣ delete student
    const [result] = await req.db.query(
      'DELETE FROM Student WHERE StudentID = ?', 
      [id]
    )

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Student not found' })
    }

    res.json({ message: 'Student deleted successfully' })

  } catch (err) {
    console.error("DELETE ERROR:", err) // 🔥 VERY IMPORTANT
    res.status(500).json({ error: err.message })
  }
})


module.exports = router