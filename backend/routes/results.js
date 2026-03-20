const router = require('express').Router()
const nodemailer = require('nodemailer')

// Email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  }
})

async function sendResultEmail(studentEmail, studentName, subjectName, marks, grade) {
  const gradeColor = {
    A: '#10b981', B: '#7c6dfa', C: '#f59e0b', D: '#f97316', F: '#f43f5e'
  }
  const color = gradeColor[grade] || '#7c6dfa'
  const passed = grade !== 'F'

  const html = `
  <!DOCTYPE html>
  <html>
  <head><meta charset="UTF-8"/></head>
  <body style="margin:0;padding:0;background:#f4f4f8;font-family:'Segoe UI',Arial,sans-serif;">
    <div style="max-width:560px;margin:40px auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
      
      <!-- Header -->
      <div style="background:linear-gradient(135deg,#7c6dfa,#a78bfa);padding:36px 40px;text-align:center;">
        <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:700;letter-spacing:-0.5px;">
          Result Notification
        </h1>
        <p style="margin:8px 0 0;color:rgba(255,255,255,0.85);font-size:14px;">
          Student Result System
        </p>
      </div>

      <!-- Body -->
      <div style="padding:36px 40px;">
        <p style="margin:0 0 8px;color:#555;font-size:15px;">Hello <strong style="color:#1a1a2e;">${studentName}</strong>,</p>
        <p style="margin:0 0 28px;color:#555;font-size:15px;">
          Your result for <strong>${subjectName}</strong> has been published.
        </p>

        <!-- Result Card -->
        <div style="background:#f8f8ff;border:1px solid #e8e8f0;border-radius:12px;padding:28px;margin-bottom:28px;text-align:center;">
          <p style="margin:0 0 6px;font-size:12px;text-transform:uppercase;letter-spacing:1px;color:#999;">Marks Obtained</p>
          <p style="margin:0 0 20px;font-size:48px;font-weight:700;color:#1a1a2e;line-height:1;">${marks}<span style="font-size:20px;color:#999;">/100</span></p>
          
          <div style="display:inline-block;background:${color}18;border:2px solid ${color};border-radius:50%;width:64px;height:64px;line-height:64px;text-align:center;">
            <span style="font-size:26px;font-weight:700;color:${color};">${grade}</span>
          </div>
          
          <p style="margin:16px 0 0;font-size:15px;font-weight:600;color:${color};">
            ${passed ? '🎉 Congratulations, you passed!' : '📚 Please work harder next time.'}
          </p>
        </div>

        <!-- Details Table -->
        <table style="width:100%;border-collapse:collapse;font-size:14px;">
          <tr style="border-bottom:1px solid #f0f0f0;">
            <td style="padding:12px 0;color:#999;width:40%;">Student Name</td>
            <td style="padding:12px 0;color:#1a1a2e;font-weight:500;">${studentName}</td>
          </tr>
          <tr style="border-bottom:1px solid #f0f0f0;">
            <td style="padding:12px 0;color:#999;">Subject</td>
            <td style="padding:12px 0;color:#1a1a2e;font-weight:500;">${subjectName}</td>
          </tr>
          <tr style="border-bottom:1px solid #f0f0f0;">
            <td style="padding:12px 0;color:#999;">Marks</td>
            <td style="padding:12px 0;color:#1a1a2e;font-weight:500;">${marks} / 100</td>
          </tr>
          <tr>
            <td style="padding:12px 0;color:#999;">Grade</td>
            <td style="padding:12px 0;font-weight:600;color:${color};">${grade} — ${passed ? 'Pass' : 'Fail'}</td>
          </tr>
        </table>
      </div>

      <!-- Footer -->
      <div style="background:#f8f8ff;padding:20px 40px;text-align:center;border-top:1px solid #f0f0f0;">
        <p style="margin:0;font-size:12px;color:#aaa;">
          This is an automated notification from the Student Result System.<br/>
          Please do not reply to this email.
        </p>
      </div>
    </div>
  </body>
  </html>
  `

  await transporter.sendMail({
    from: `"Student Result System" <${process.env.EMAIL_USER}>`,
    to: studentEmail,
    subject: `Your Result for ${subjectName} — Grade ${grade}`,
    html,
  })
}

// GET all results
router.get('/', async (req, res) => {
  try {
    const [rows] = await req.db.query(`
      SELECT
        r.ResultID, r.MarksObtained, r.Grade,
        r.StudentID, r.SubjectCode, r.AdminID,
        s.StudentName, sub.SubjectName
      FROM result r
      JOIN student      s   ON r.StudentID   = s.StudentID
      JOIN subject      sub ON r.SubjectCode = sub.SubjectCode
      ORDER BY r.ResultID DESC
    `)
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST add result — saves to DB then sends email
router.post('/', async (req, res) => {
  const { marks, grade, studentId, subCode, adminId } = req.body
  if (!marks || !grade || !studentId || !subCode || !adminId)
    return res.status(400).json({ error: 'All fields are required' })

  try {
    // 1. Insert result (trigger auto-creates notification with Pending)
    await req.db.query('CALL AddResult(?, ?, ?, ?, ?)', [marks, grade, studentId, subCode, adminId])

    // 2. Get the new ResultID + student email + subject name for the email
    const [rows] = await req.db.query(`
  SELECT
    r.ResultID, r.MarksObtained, r.Grade,
    r.StudentID, r.SubjectCode, r.AdminID,
    s.StudentName, sub.SubjectName
  FROM result r
  JOIN student s   ON r.StudentID   = s.StudentID
  JOIN subject sub ON r.SubjectCode = sub.SubjectCode
  ORDER BY r.ResultID DESC
`)
    // const [[result]] = await req.db.query(`
    //   SELECT r.ResultID, s.StudentName, s.Email, sub.SubjectName
    //   FROM result r
    //   JOIN student s      ON r.StudentID   = s.StudentID
    //   JOIN subject sub    ON r.SubjectCode = sub.SubjectCode
    //   WHERE r.StudentID = ? AND r.SubjectCode = ?
    //   ORDER BY r.ResultID DESC LIMIT 1
    // `, [studentId, subCode])

    // 3. Try to send email
    if (result.Email) {
      try {
        await sendResultEmail(result.Email, result.StudentName, result.SubjectName, marks, grade)
        // Mark notification as Success
        await req.db.query(`
          UPDATE notification SET AlertStatus = 'Success', AlertTimeStamp = NOW()
          WHERE ResultID = ? ORDER BY AlertID DESC LIMIT 1
        `, [result.ResultID])
        res.status(201).json({ message: 'Result added and email sent successfully!' })
      } catch (emailErr) {
        // Email failed — mark as Failed in notification
        await req.db.query(`
          UPDATE notification SET AlertStatus = 'Failed', AlertTimeStamp = NOW()
          WHERE ResultID = ? ORDER BY AlertID DESC LIMIT 1
        `, [result.ResultID])
        console.error('Email error:', emailErr.message)
        res.status(201).json({ message: 'Result saved but email failed to send.', emailError: emailErr.message })
      }
    } else {
      res.status(201).json({ message: 'Result saved. No email on file for this student.' })
    }

  } catch (err) {
    res.status(400).json({ error: err.sqlMessage || err.message })
  }
})

// GET failing students
router.get('/failing', async (req, res) => {
  try {
    const [rows] = await req.db.query('CALL GetFailingStudents()')
    res.json(rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
