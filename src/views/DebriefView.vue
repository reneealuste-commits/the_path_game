<template>
  <div class="debrief-view">
    <div class="header">
      <button @click="goBack" class="back-button">← Back</button>
      <h2 class="header-title">Mission Debrief</h2>
      <div class="spacer"></div>
    </div>

    <div class="container">
      <div class="debrief-content">
        <div class="instruction">
          <h3>Record Your Outcome</h3>
          <p>Speak for up to 45 seconds about what you observed and learned.</p>
        </div>

        <div class="recorder-section">
          <div class="timer" v-if="isRecording || recordingDuration > 0">
            <span class="time">{{ formattedTime }}</span>
            <span class="max-time">/ 45s</span>
          </div>

          <div class="mic-button-container">
            <button
              @click="toggleRecording"
              class="mic-button"
              :class="{ recording: isRecording, recorded: hasRecording }"
              :disabled="recordingDuration >= 45 && !isRecording"
            >
              <span v-if="!isRecording && !hasRecording" class="mic-icon">🎤</span>
              <span v-else-if="isRecording" class="recording-icon">⏺</span>
              <span v-else class="check-icon">✓</span>
            </button>
          </div>

          <div class="recorder-status">
            <p v-if="!isRecording && !hasRecording" class="status-text">
              Tap to start recording
            </p>
            <p v-else-if="isRecording" class="status-text recording-text">
              Recording... Tap to stop
            </p>
            <p v-else class="status-text">
              Recording complete
            </p>
          </div>

          <div v-if="hasRecording" class="audio-preview">
            <button @click="playRecording" class="btn btn-secondary">
              <span v-if="!isPlaying">▶ Play Recording</span>
              <span v-else>⏸ Playing...</span>
            </button>
            <button @click="resetRecording" class="btn btn-text">
              🔄 Re-record
            </button>
          </div>
        </div>

        <button
          @click="submitDebrief"
          class="btn btn-primary btn-large"
          :disabled="!hasRecording || isSubmitting"
        >
          <span v-if="!isSubmitting">SUBMIT DEBRIEF</span>
          <span v-else>ANALYZING...</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useGameStore } from '../stores/game'

const router = useRouter()
const gameStore = useGameStore()

const isRecording = ref(false)
const hasRecording = ref(false)
const recordingDuration = ref(0)
const isPlaying = ref(false)
const isSubmitting = ref(false)

let recordingInterval = null
let mediaRecorder = null
let audioChunks = []
let recordedBlob = null

const formattedTime = computed(() => {
  return recordingDuration.value.toString().padStart(2, '0')
})

const goBack = () => {
  if (mediaRecorder && isRecording.value) {
    stopRecording()
  }
  router.push('/quest')
}

const toggleRecording = async () => {
  if (isRecording.value) {
    stopRecording()
  } else {
    startRecording()
  }
}

const startRecording = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    mediaRecorder = new MediaRecorder(stream)
    audioChunks = []

    mediaRecorder.ondataavailable = (event) => {
      audioChunks.push(event.data)
    }

    mediaRecorder.onstop = () => {
      recordedBlob = new Blob(audioChunks, { type: 'audio/webm' })
      hasRecording.value = true

      // Stop all tracks
      stream.getTracks().forEach(track => track.stop())
    }

    mediaRecorder.start()
    isRecording.value = true
    recordingDuration.value = 0

    // Start timer
    recordingInterval = setInterval(() => {
      recordingDuration.value++

      // Auto-stop at 45 seconds
      if (recordingDuration.value >= 45) {
        stopRecording()
      }
    }, 1000)
  } catch (error) {
    console.error('Error accessing microphone:', error)
    alert('Could not access microphone. Please grant permission.')
  }
}

const stopRecording = () => {
  if (mediaRecorder && mediaRecorder.state !== 'inactive') {
    mediaRecorder.stop()
  }

  isRecording.value = false

  if (recordingInterval) {
    clearInterval(recordingInterval)
    recordingInterval = null
  }
}

const playRecording = () => {
  if (!recordedBlob) return

  const audio = new Audio(URL.createObjectURL(recordedBlob))
  isPlaying.value = true

  audio.onended = () => {
    isPlaying.value = false
  }

  audio.play()
}

const resetRecording = () => {
  hasRecording.value = false
  recordingDuration.value = 0
  recordedBlob = null
  audioChunks = []
}

const submitDebrief = async () => {
  if (!recordedBlob) return

  isSubmitting.value = true

  // Simulate AI evaluation
  // In production, send audio to backend for analysis
  await new Promise(resolve => setTimeout(resolve, 2000))

  const evaluation = {
    discipline: Math.floor(Math.random() * 30) + 70,
    strategy: Math.floor(Math.random() * 30) + 70,
    communication: Math.floor(Math.random() * 30) + 70,
    overall: 0
  }

  evaluation.overall = Math.floor(
    (evaluation.discipline + evaluation.strategy + evaluation.communication) / 3
  )

  // Complete quest
  await gameStore.completeQuest(recordedBlob, evaluation)

  isSubmitting.value = false

  // Navigate to results
  router.push('/results')
}

onUnmounted(() => {
  if (recordingInterval) {
    clearInterval(recordingInterval)
  }
  if (mediaRecorder && isRecording.value) {
    stopRecording()
  }
})
</script>

<style scoped>
.debrief-view {
  min-height: 100vh;
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.back-button {
  background: none;
  border: none;
  color: #ffd700;
  font-size: 16px;
  cursor: pointer;
  padding: 8px;
}

.header-title {
  font-size: 18px;
  font-weight: 700;
  color: #fff;
  margin: 0;
}

.spacer {
  width: 60px;
}

.container {
  max-width: 600px;
  margin: 0 auto;
  padding: 40px 20px;
}

.debrief-content {
  animation: fadeIn 0.6s ease;
}

.instruction {
  text-align: center;
  margin-bottom: 40px;
}

.instruction h3 {
  font-size: 24px;
  font-weight: 900;
  color: #ffd700;
  margin: 0 0 12px 0;
}

.instruction p {
  font-size: 16px;
  color: #ccc;
  margin: 0;
  line-height: 1.6;
}

.recorder-section {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 40px 24px;
  margin-bottom: 32px;
  text-align: center;
}

.timer {
  margin-bottom: 24px;
}

.time {
  font-size: 48px;
  font-weight: 900;
  color: #ffd700;
}

.max-time {
  font-size: 20px;
  color: #666;
  margin-left: 8px;
}

.mic-button-container {
  margin-bottom: 24px;
}

.mic-button {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 4px solid #ffd700;
  background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
  font-size: 48px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.mic-button:hover:not(:disabled) {
  transform: scale(1.1);
  box-shadow: 0 8px 32px rgba(255, 215, 0, 0.5);
}

.mic-button.recording {
  background: #ff4444;
  border-color: #ff4444;
  animation: pulse 1.5s infinite;
}

.mic-button.recorded {
  background: #44ff44;
  border-color: #44ff44;
}

.mic-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.recorder-status {
  margin-bottom: 24px;
}

.status-text {
  font-size: 14px;
  color: #888;
  margin: 0;
}

.recording-text {
  color: #ff4444;
  font-weight: 700;
}

.audio-preview {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
}

.btn {
  padding: 12px 24px;
  font-size: 14px;
  font-weight: 700;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.btn-primary {
  background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
  color: #000;
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.btn-text {
  background: none;
  color: #888;
}

.btn-large {
  width: 100%;
  padding: 20px;
  font-size: 16px;
}

.btn:hover:not(:disabled) {
  transform: translateY(-2px);
}

.btn-primary:hover:not(:disabled) {
  box-shadow: 0 8px 24px rgba(255, 215, 0, 0.4);
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
