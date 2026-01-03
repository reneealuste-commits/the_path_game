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

        <!-- Mission Reminder -->
        <div class="mission-reminder">
          <h4 class="mission-label">YOUR MISSION</h4>
          <p class="mission-text">{{ gameStore.currentQuest.mission }}</p>
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
            <p v-if="!isRecording && !hasRecording && !permissionError" class="status-text">
              Tap to start recording
            </p>
            <p v-else-if="isRecording" class="status-text recording-text">
              Recording... Tap to stop
            </p>
            <p v-else-if="hasRecording" class="status-text">
              Recording complete
            </p>
          </div>

          <!-- Permission Error Message -->
          <div v-if="permissionError" class="error-message">
            <div class="error-icon">⚠️</div>
            <p class="error-text">{{ errorMessage }}</p>
            <button @click="toggleRecording" class="btn btn-retry">
              Try Again
            </button>
            <div class="permission-help">
              <p class="help-title">How to fix:</p>
              <ol class="help-steps">
                <li>Look for a 🎤 or 🔒 icon in your browser's address bar</li>
                <li>Click it and select "Allow" for microphone access</li>
                <li>Refresh the page if needed</li>
                <li>Click "Try Again" above</li>
              </ol>
            </div>
          </div>

          <div v-if="hasRecording" class="audio-preview">
            <button @click="playRecording" class="btn btn-secondary">
              <span v-if="!isPlaying">▶ Play Recording</span>
              <span v-else>⏸ Pause</span>
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
const permissionError = ref(false)
const errorMessage = ref('')

let recordingInterval = null
let mediaRecorder = null
let audioChunks = []
let recordedBlob = null
let audioElement = null

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

const checkMicrophonePermission = async () => {
  try {
    const result = await navigator.permissions.query({ name: 'microphone' })
    return result.state // 'granted', 'denied', or 'prompt'
  } catch (error) {
    // Fallback if permissions API not supported
    return 'prompt'
  }
}

const startRecording = async () => {
  try {
    // Clear any previous errors
    permissionError.value = false
    errorMessage.value = ''

    // Check permission first
    const permissionState = await checkMicrophonePermission()
    console.log('Microphone permission state:', permissionState)

    const stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true
      }
    })

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
    permissionError.value = true

    if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
      errorMessage.value = 'Microphone access was denied. Click "Try Again" and allow microphone access when your browser asks. Check your browser address bar for a blocked microphone icon 🎤'
    } else if (error.name === 'NotFoundError') {
      errorMessage.value = 'No microphone found. Please connect a microphone and try again.'
    } else if (error.name === 'NotReadableError') {
      errorMessage.value = 'Microphone is being used by another application. Please close other apps using your microphone and try again.'
    } else {
      errorMessage.value = 'Could not access microphone. Please check your browser permissions and try again.'
    }
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

  // If audio is already playing, pause it
  if (isPlaying.value && audioElement) {
    audioElement.pause()
    isPlaying.value = false
    return
  }

  // Create new audio element if it doesn't exist or was ended
  if (!audioElement) {
    audioElement = new Audio(URL.createObjectURL(recordedBlob))

    audioElement.onended = () => {
      isPlaying.value = false
      audioElement = null
    }
  }

  // Play the audio
  audioElement.play()
  isPlaying.value = true
}

const resetRecording = () => {
  // Stop and clean up audio if it's playing
  if (audioElement) {
    audioElement.pause()
    audioElement = null
  }

  hasRecording.value = false
  recordingDuration.value = 0
  recordedBlob = null
  audioChunks = []
  isPlaying.value = false
}

const submitDebrief = async () => {
  if (!recordedBlob) return

  isSubmitting.value = true

  try {
    // Send audio to backend for AI evaluation
    const formData = new FormData()
    formData.append('audio', recordedBlob, 'debrief.webm')
    formData.append('questTitle', gameStore.currentQuest.title)

    const response = await fetch('/api/evaluate', {
      method: 'POST',
      body: formData
    })

    const result = await response.json()

    if (result.success) {
      // Complete quest with evaluation and feedback
      await gameStore.completeQuest(recordedBlob, result.evaluation, result.feedback)

      isSubmitting.value = false

      // Navigate to results
      router.push('/results')
    } else {
      throw new Error('Evaluation failed')
    }
  } catch (error) {
    console.error('Submission error:', error)
    // Fallback to simulated evaluation if API fails
    const evaluation = {
      discipline: Math.floor(Math.random() * 30) + 70,
      strategy: Math.floor(Math.random() * 30) + 70,
      communication: Math.floor(Math.random() * 30) + 70,
      overall: 0
    }

    evaluation.overall = Math.floor(
      (evaluation.discipline + evaluation.strategy + evaluation.communication) / 3
    )

    const feedback = {
      whatYouDidWell: ["You showed up and completed the mission."],
      whereToImprove: ["Keep pushing. There's always room to improve."]
    }

    await gameStore.completeQuest(recordedBlob, evaluation, feedback)

    isSubmitting.value = false
    router.push('/results')
  }
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
  background: #000000;
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
  color: #4267B2;
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
  color: #4267B2;
  margin: 0 0 12px 0;
}

.instruction p {
  font-size: 16px;
  color: #ccc;
  margin: 0;
  line-height: 1.6;
}

.mission-reminder {
  background: rgba(66, 103, 178, 0.1);
  border: 2px solid rgba(66, 103, 178, 0.3);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 32px;
}

.mission-label {
  font-size: 12px;
  font-weight: 700;
  color: #4267B2;
  letter-spacing: 2px;
  text-transform: uppercase;
  margin: 0 0 12px 0;
}

.mission-text {
  font-size: 15px;
  line-height: 1.6;
  color: #e0e0e0;
  margin: 0;
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
  color: #4267B2;
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
  border: 4px solid #4267B2;
  background: #4267B2;
  font-size: 48px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.mic-button:hover:not(:disabled) {
  transform: scale(1.1);
  box-shadow: 0 8px 32px rgba(66, 103, 178, 0.5);
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
  background: #4267B2;
  color: #fff;
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
  box-shadow: 0 8px 24px rgba(66, 103, 178, 0.4);
  background: #3B5998;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.error-message {
  margin-top: 24px;
  padding: 24px;
  background: rgba(255, 68, 68, 0.1);
  border: 2px solid rgba(255, 68, 68, 0.3);
  border-radius: 12px;
  text-align: center;
  animation: fadeIn 0.3s ease;
}

.error-icon {
  font-size: 48px;
  margin-bottom: 12px;
}

.error-text {
  font-size: 14px;
  color: #ff8888;
  line-height: 1.6;
  margin: 0 0 16px 0;
}

.btn-retry {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.btn-retry:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateY(-2px);
}

.permission-help {
  margin-top: 20px;
  padding: 16px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  text-align: left;
}

.help-title {
  font-size: 13px;
  font-weight: 700;
  color: #4267B2;
  margin: 0 0 12px 0;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.help-steps {
  margin: 0;
  padding-left: 20px;
  color: #ccc;
}

.help-steps li {
  font-size: 13px;
  line-height: 1.8;
  margin-bottom: 8px;
}

.help-steps li:last-child {
  margin-bottom: 0;
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
