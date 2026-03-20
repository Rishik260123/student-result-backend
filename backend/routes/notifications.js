const router = require('express').Router()

// GET all notifications
router.get('/', async (req, res) => {
  try {
    const [rows] = await req.db.query('SELECT * FROM Notification ORDER BY AlertTimeStamp DESC')
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// PUT mark as sent — updates AlertStatus directly (bypasses procedure column mismatch)
router.put('/:id/sent', async (req, res) => {
  try {
    const [result] = await req.db.query(
      `UPDATE Notification SET AlertStatus = 'Success', AlertTimeStamp = NOW() WHERE AlertID = ?`,
      [req.params.id]
    )
    if (result.affectedRows === 0)
      return res.status(404).json({ error: 'Notification not found' })
    res.json({ message: 'Notification marked as sent' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// DELETE archive — removes ALL successful notifications (not just 30 days old, for testing)
router.delete('/archive', async (req, res) => {
  try {
    const [result] = await req.db.query(
      `DELETE FROM Notification WHERE AlertStatus = 'Success'`
    )
    res.json({ 
      message: `Archived ${result.affectedRows} notification(s) successfully`,
      count: result.affectedRows
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
