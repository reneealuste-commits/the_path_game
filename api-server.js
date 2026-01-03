import express from 'express'
import cors from 'cors'
import multer from 'multer'
import fs from 'fs'

const app = express()
const upload = multer({ dest: 'uploads/' })

app.use(cors())
app.use(express.json())

// Speech-to-Text has been removed to reduce disk usage
// Using fallback mode for instant responses
let speechClient = null
console.log('⚡ Fast mode: Using instant fallback (Speech-to-Text removed)')

// Analyze transcription and generate feedback using AI-like logic
function analyzeMissionDebrief(transcription, questTitle) {
  const feedback = {
    whatYouDidWell: [],
    whereToImprove: []
  }

  const wordCount = transcription.split(/\s+/).length
  const hasSpecificExamples = /situation|moment|when|today|example/i.test(transcription)
  const hasReflection = /learned|realized|understood|noticed|observed/i.test(transcription)
  const hasAction = /did|tried|practiced|applied|used/i.test(transcription)
  const mentionsDetachment = /detach|step back|perspective|observe|distance/i.test(transcription)
  const mentionsOwnership = /responsibility|my fault|I should|could have|ownership/i.test(transcription)
  const mentionsHumility = /wrong|mistake|learn|feedback|listen|don't know/i.test(transcription)

  // Length evaluation
  if (wordCount >= 40) {
    feedback.whatYouDidWell.push("Good detail. You took the time to explain your experience thoroughly.")
  } else if (wordCount >= 20) {
    feedback.whatYouDidWell.push("You provided a clear account of what happened.")
  } else {
    feedback.whereToImprove.push("More detail needed. Explain what happened and what you learned.")
  }

  // Specificity
  if (hasSpecificExamples) {
    feedback.whatYouDidWell.push("Excellent. You gave specific examples from real situations.")
  } else {
    feedback.whereToImprove.push("Be more specific. Give concrete examples of when you applied this principle.")
  }

  // Self-reflection
  if (hasReflection) {
    feedback.whatYouDidWell.push("Strong self-awareness. You reflected on what you learned.")
  } else {
    feedback.whereToImprove.push("Add reflection. What did you learn? How did it change your perspective?")
  }

  // Action-oriented
  if (hasAction) {
    feedback.whatYouDidWell.push("You took action. That's what matters. You didn't just think about it—you did it.")
  } else {
    feedback.whereToImprove.push("Focus on action. What did you actually do? Don't just explain the concept.")
  }

  // Quest-specific feedback
  if (questTitle === 'Detach' && mentionsDetachment) {
    feedback.whatYouDidWell.push("You clearly understood detachment and applied it to a real situation.")
  }
  if (questTitle === 'Extreme Ownership' && mentionsOwnership) {
    feedback.whatYouDidWell.push("You took ownership. No excuses. That's the mindset.")
  }
  if (questTitle === 'Arrogance and Humility' && mentionsHumility) {
    feedback.whatYouDidWell.push("You showed humility. You admitted what you didn't know or where you were wrong.")
  }

  // Ensure at least one item in each category
  if (feedback.whatYouDidWell.length === 0) {
    feedback.whatYouDidWell.push("You showed up and completed the debrief. That's the first step.")
  }

  if (feedback.whereToImprove.length === 0) {
    feedback.whereToImprove.push("Keep pushing. There's always room to get better.")
  }

  return feedback
}

// Generate evaluation scores based on transcription quality
function evaluateTranscription(transcription, questTitle) {
  const wordCount = transcription.split(/\s+/).length
  const hasExamples = /situation|moment|when|today|example/i.test(transcription)
  const hasReflection = /learned|realized|understood|noticed|observed/i.test(transcription)
  const hasAction = /did|tried|practiced|applied|used/i.test(transcription)

  let discipline = 70
  let strategy = 70
  let communication = 70

  // Discipline score (based on follow-through)
  if (wordCount >= 40) discipline += 15
  else if (wordCount >= 20) discipline += 10
  if (hasAction) discipline += 10

  // Strategy score (based on thinking/reflection)
  if (hasReflection) strategy += 15
  if (hasExamples) strategy += 10

  // Communication score (based on clarity)
  if (wordCount >= 30 && hasExamples) communication += 15
  else if (wordCount >= 20) communication += 10
  if (hasReflection) communication += 5

  // Cap at 100
  discipline = Math.min(100, discipline)
  strategy = Math.min(100, strategy)
  communication = Math.min(100, communication)

  const overall = Math.floor((discipline + strategy + communication) / 3)

  return { discipline, strategy, communication, overall }
}

// AI Evaluation endpoint
app.post('/api/evaluate', upload.single('audio'), async (req, res) => {
  const audioFile = req.file?.path

  try {
    const questTitle = req.body.questTitle || 'Unknown Quest'
    const browserTranscription = req.body.transcription || ''
    let transcription = ''
    let usedFallback = true

    // Use browser transcription if provided
    if (browserTranscription.trim()) {
      transcription = browserTranscription.trim()
      usedFallback = false
      console.log('Using browser transcription:', transcription)
    }
    // Otherwise use fallback transcription (instant response)
    else {
      transcription = "I practiced detachment today in a stressful meeting. When the client started criticizing our work, I felt defensive at first. But then I stepped back mentally, like I was watching from above. I observed the situation objectively. I realized the client had valid concerns. I was able to respond calmly and we found a solution together."
      console.log('Using fallback transcription')
    }

    // Analyze transcription and generate feedback
    const evaluation = evaluateTranscription(transcription, questTitle)
    const feedback = analyzeMissionDebrief(transcription, questTitle)

    // Clean up uploaded file
    if (audioFile) {
      fs.unlinkSync(audioFile)
    }

    res.json({
      success: true,
      evaluation,
      feedback,
      transcription: usedFallback ? null : transcription, // Only return if real
      usedFallback
    })
  } catch (error) {
    console.error('Evaluation error:', error)

    // Clean up file on error
    if (audioFile && fs.existsSync(audioFile)) {
      fs.unlinkSync(audioFile)
    }

    res.status(500).json({
      success: false,
      error: error.message
    })
  }
})

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    speechToText: speechClient ? 'enabled' : 'disabled'
  })
})

const PORT = process.env.API_PORT || 3001

app.listen(PORT, () => {
  console.log(`API server running on port ${PORT}`)
  console.log(`Speech-to-Text: DISABLED (using fallback mode to save disk space)`)
})
