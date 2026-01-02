import express from 'express'
import cors from 'cors'
import multer from 'multer'

const app = express()
const upload = multer({ storage: multer.memoryStorage() })

app.use(cors())
app.use(express.json())

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

    res.json({
      success: true,
      evaluation
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
