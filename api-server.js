import express from 'express'
import cors from 'cors'
import multer from 'multer'

const app = express()
const upload = multer({ storage: multer.memoryStorage() })

app.use(cors())
app.use(express.json())

// Generate personalized feedback based on evaluation scores
function generateFeedback(evaluation) {
  const { discipline, strategy, communication, overall } = evaluation

  const feedback = {
    whatYouDidWell: [],
    whereToImprove: []
  }

  // Discipline feedback
  if (discipline >= 85) {
    feedback.whatYouDidWell.push("Your discipline shines through. You took ownership and executed without hesitation.")
  } else if (discipline >= 75) {
    feedback.whatYouDidWell.push("Good discipline. You stayed focused on the mission.")
  } else {
    feedback.whereToImprove.push("Discipline: Push harder. No excuses. Take full ownership of the situation.")
  }

  // Strategy feedback
  if (strategy >= 85) {
    feedback.whatYouDidWell.push("Excellent strategic thinking. You detached and saw the battlefield clearly.")
  } else if (strategy >= 75) {
    feedback.whatYouDidWell.push("Solid strategy. You stepped back and assessed the situation.")
  } else {
    feedback.whereToImprove.push("Strategy: Detach more. Pull back from the emotions and see the bigger picture.")
  }

  // Communication feedback
  if (communication >= 85) {
    feedback.whatYouDidWell.push("Outstanding communication. Clear, concise, and direct. That's how leaders talk.")
  } else if (communication >= 75) {
    feedback.whatYouDidWell.push("Good communication. You articulated your observations clearly.")
  } else {
    feedback.whereToImprove.push("Communication: Be more direct. Cut the fluff. Say what needs to be said.")
  }

  // Overall performance feedback
  if (overall >= 90) {
    feedback.whatYouDidWell.push("Exceptional performance. You're locked in. Keep this intensity.")
  } else if (overall >= 80) {
    feedback.whatYouDidWell.push("Strong execution. You're on the right path.")
  }

  // Ensure we have at least one item in each category
  if (feedback.whatYouDidWell.length === 0) {
    feedback.whatYouDidWell.push("You showed up. That's the first step. Now build on it.")
  }

  if (feedback.whereToImprove.length === 0) {
    feedback.whereToImprove.push("Keep pushing. Don't get complacent. There's always room to get better.")
  }

  return feedback
}

// AI Evaluation endpoint
app.post('/api/evaluate', upload.single('audio'), async (req, res) => {
  try {
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Simulate AI evaluation scores
    // In production, this would use Llama 3.2 3b fine-tuned model
    const evaluation = {
      discipline: Math.floor(Math.random() * 30) + 70,
      strategy: Math.floor(Math.random() * 30) + 70,
      communication: Math.floor(Math.random() * 30) + 70
    }

    evaluation.overall = Math.floor(
      (evaluation.discipline + evaluation.strategy + evaluation.communication) / 3
    )

    // Generate personalized feedback based on scores
    const feedback = generateFeedback(evaluation)

    res.json({
      success: true,
      evaluation,
      feedback
    })
  } catch (error) {
    console.error('Evaluation error:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to evaluate audio'
    })
  }
})

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' })
})

const PORT = process.env.API_PORT || 3001

app.listen(PORT, () => {
  console.log(`API server running on port ${PORT}`)
})
