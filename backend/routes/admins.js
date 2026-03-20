// const router = require('express').Router()

// router.get('/', async (req, res) => {
//   try {
//     const [rows] = await req.db.query(
//       'SELECT AdminID, Name AS AdminName, Email AS AdminEmail FROM Administrator ORDER BY AdminID DESC'
//     )
//     res.json(rows)
//   } catch (err) {
//     res.status(500).json({ error: err.message })
//   }
// })

// router.post('/', async (req, res) => {
//   const { name, email } = req.body
//   if (!name) return res.status(400).json({ error: 'Admin name is required' })
//   try {
//     await req.db.query('CALL AddAdmin(?, ?)', [name, email || null])
//     res.status(201).json({ message: 'Admin added successfully' })
//   } catch (err) {
//     res.status(400).json({ error: err.sqlMessage || err.message })
//   }
// })

// router.delete('/:id', async (req, res) => {
//   try {
//     const [result] = await req.db.query('DELETE FROM Administrator WHERE AdminID = ?', [req.params.id])
//     if (result.affectedRows === 0)
//       return res.status(404).json({ error: 'Admin not found' })
//     res.json({ message: 'Admin deleted successfully' })
//   } catch (err) {
//     res.status(500).json({ error: err.sqlMessage || err.message })
//   }
// })

// router.get('/faculty', async (req, res) => {
//   try {
//     const [rows] = await req.db.query('SELECT * FROM faculty ORDER BY FacultyID DESC')
//     res.json(rows)
//   } catch (err) {
//     res.status(500).json({ error: err.message })
//   }
// })

// router.post('/faculty', async (req, res) => {
//   const { name, email } = req.body
//   if (!name) return res.status(400).json({ error: 'Faculty name is required' })
//   try {
//     await req.db.query('CALL AddFaculty(?, ?)', [name, email || null])
//     res.status(201).json({ message: 'Faculty added successfully' })
//   } catch (err) {
//     res.status(400).json({ error: err.sqlMessage || err.message })
//   }
// })

// module.exports = router

const router = require('express').Router()

// GET all admins
router.get('/', async (req, res) => {
  try {
    const [rows] = await req.db.query(
      'SELECT AdminID, AdminName, AdminEmail FROM Admin ORDER BY AdminID DESC'
    )
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ADD admin
router.post('/', async (req, res) => {
  const { name, email } = req.body
  if (!name) return res.status(400).json({ error: 'Admin name is required' })

  try {
    await req.db.query('CALL AddAdmin(?, ?)', [name, email || null])
    res.status(201).json({ message: 'Admin added successfully' })
  } catch (err) {
    res.status(400).json({ error: err.sqlMessage || err.message })
  }
})

// DELETE admin
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await req.db.query(
      'DELETE FROM Admin WHERE AdminID = ?',
      [req.params.id]
    )

    if (result.affectedRows === 0)
      return res.status(404).json({ error: 'Admin not found' })

    res.json({ message: 'Admin deleted successfully' })
  } catch (err) {
    res.status(500).json({ error: err.sqlMessage || err.message })
  }
})

module.exports = router
