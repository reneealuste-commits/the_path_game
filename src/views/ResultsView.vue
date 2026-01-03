<template>
  <div class="results-view">
    <div class="container">
      <!-- Confetti trigger -->
      <div ref="confettiCanvas" class="confetti-container"></div>

      <!-- Success Animation -->
      <div v-if="showResults" class="results-content">
        <div class="success-badge">
          <div class="medal">🏅</div>
          <h2 class="success-title">MISSION COMPLETE</h2>
        </div>

        <!-- Evaluation Scores -->
        <div class="evaluation-section">
          <h3 class="section-title">Your Evaluation</h3>

          <div class="score-grid">
            <div class="score-card">
              <div class="score-label">Discipline</div>
              <div class="score-value" :style="{ color: getScoreColor(evaluation.discipline) }">
                {{ evaluation.discipline }}
              </div>
              <div class="score-bar">
                <div class="score-fill" :style="{ width: evaluation.discipline + '%' }"></div>
              </div>
            </div>

            <div class="score-card">
              <div class="score-label">Strategy</div>
              <div class="score-value" :style="{ color: getScoreColor(evaluation.strategy) }">
                {{ evaluation.strategy }}
              </div>
              <div class="score-bar">
                <div class="score-fill" :style="{ width: evaluation.strategy + '%' }"></div>
              </div>
            </div>

            <div class="score-card">
              <div class="score-label">Communication</div>
              <div class="score-value" :style="{ color: getScoreColor(evaluation.communication) }">
                {{ evaluation.communication }}
              </div>
              <div class="score-bar">
                <div class="score-fill" :style="{ width: evaluation.communication + '%' }"></div>
              </div>
            </div>
          </div>

          <div class="overall-score">
            <div class="overall-label">Overall</div>
            <div class="overall-value">{{ evaluation.overall }}</div>
          </div>
        </div>

        <!-- Feedback Section -->
        <div v-if="feedback" class="feedback-section">
          <h3 class="section-title">Mission Feedback</h3>

          <div class="feedback-card success-feedback">
            <div class="feedback-header">
              <span class="feedback-icon">✓</span>
              <h4 class="feedback-title">What You Did Well</h4>
            </div>
            <ul class="feedback-list">
              <li v-for="(item, index) in feedback.whatYouDidWell" :key="'well-' + index">
                {{ item }}
              </li>
            </ul>
          </div>

          <div class="feedback-card improve-feedback">
            <div class="feedback-header">
              <span class="feedback-icon">→</span>
              <h4 class="feedback-title">Where To Improve</h4>
            </div>
            <ul class="feedback-list">
              <li v-for="(item, index) in feedback.whereToImprove" :key="'improve-' + index">
                {{ item }}
              </li>
            </ul>
          </div>
        </div>

        <!-- Badge Award -->
        <div class="badge-award">
          <div class="badge-icon">🎖️</div>
          <div class="badge-name">{{ gameStore.currentQuest.title }}</div>
          <div class="badge-subtitle">Quest {{ gameStore.currentWeek - 1 }} Complete</div>
        </div>

        <!-- Streak Info -->
        <div class="streak-section">
          <div class="streak-card">
            <div class="streak-icon">🔥</div>
            <div class="streak-number">{{ gameStore.streak }}</div>
            <div class="streak-label">Day Streak</div>
          </div>

          <div class="rank-card">
            <div class="rank-icon">📈</div>
            <div class="rank-number">{{ gameStore.globalRank }}</div>
            <div class="rank-label">Global Rank</div>
          </div>
        </div>

        <!-- Continue Button -->
        <button @click="continueToQuest" class="btn btn-primary btn-large">
          CONTINUE
        </button>

        <div class="motivational-message">
          <p>"GOOD. Now do it again tomorrow."</p>
          <p class="author">— Jocko</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useGameStore } from '../stores/game'
import confetti from 'canvas-confetti'

const router = useRouter()
const gameStore = useGameStore()

const showResults = ref(false)
const confettiCanvas = ref(null)

// Get last medal evaluation
const evaluation = ref({
  discipline: 0,
  strategy: 0,
  communication: 0,
  overall: 0
})

// Get feedback from last medal
const feedback = ref(null)

const getScoreColor = (score) => {
  if (score >= 90) return '#44ff44'
  if (score >= 70) return '#ffd700'
  return '#ff8844'
}

const triggerConfetti = () => {
  const duration = 3000
  const animationEnd = Date.now() + duration

  const randomInRange = (min, max) => {
    return Math.random() * (max - min) + min
  }

  const interval = setInterval(() => {
    const timeLeft = animationEnd - Date.now()

    if (timeLeft <= 0) {
      return clearInterval(interval)
    }

    const particleCount = 50 * (timeLeft / duration)

    confetti({
      particleCount,
      startVelocity: 30,
      spread: 360,
      origin: {
        x: randomInRange(0.1, 0.9),
        y: Math.random() - 0.2
      },
      colors: ['#ffd700', '#ffed4e', '#ffffff', '#ff8844']
    })
  }, 250)
}

const continueToQuest = () => {
  router.push('/quest')
}

onMounted(() => {
  // Get last medal
  const medals = gameStore.medals
  if (medals.length > 0) {
    const lastMedal = medals[medals.length - 1]
    evaluation.value = lastMedal.evaluation
    feedback.value = lastMedal.feedback || null
  }

  // Trigger confetti after a short delay
  setTimeout(() => {
    showResults.value = true
    triggerConfetti()
  }, 300)
})
</script>

<style scoped>
.results-view {
  min-height: 100vh;
  background: #000000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  position: relative;
  overflow: hidden;
}

.confetti-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1000;
}

.container {
  max-width: 600px;
  width: 100%;
  position: relative;
  z-index: 1;
}

.results-content {
  animation: slideUp 0.6s ease;
}

.success-badge {
  text-align: center;
  margin-bottom: 40px;
}

.medal {
  font-size: 80px;
  animation: bounce 1s ease infinite;
}

.success-title {
  font-size: 32px;
  font-weight: 900;
  color: #4267B2;
  margin: 16px 0 0 0;
  letter-spacing: 2px;
}

.evaluation-section {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 32px 24px;
  margin-bottom: 24px;
}

.section-title {
  font-size: 18px;
  font-weight: 700;
  color: #4267B2;
  text-align: center;
  margin: 0 0 24px 0;
  letter-spacing: 1px;
  text-transform: uppercase;
}

.score-grid {
  display: grid;
  gap: 20px;
  margin-bottom: 32px;
}

.score-card {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.score-label {
  font-size: 14px;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.score-value {
  font-size: 32px;
  font-weight: 900;
}

.score-bar {
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;
}

.score-fill {
  height: 100%;
  background: #4267B2;
  transition: width 1s ease;
}

.overall-score {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  background: rgba(67, 103, 178, 0.1);
  border-radius: 12px;
  border: 2px solid rgba(67, 103, 178, 0.3);
}

.overall-label {
  font-size: 18px;
  font-weight: 700;
  color: #4267B2;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.overall-value {
  font-size: 48px;
  font-weight: 900;
  color: #4267B2;
}

.badge-award {
  text-align: center;
  padding: 32px;
  background: rgba(67, 103, 178, 0.05);
  border-radius: 16px;
  margin-bottom: 24px;
}

.badge-icon {
  font-size: 64px;
  margin-bottom: 16px;
}

.badge-name {
  font-size: 24px;
  font-weight: 900;
  color: #fff;
  margin-bottom: 8px;
}

.badge-subtitle {
  font-size: 14px;
  color: #888;
}

.streak-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 32px;
}

.streak-card,
.rank-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 24px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
}

.streak-icon,
.rank-icon {
  font-size: 32px;
}

.streak-number,
.rank-number {
  font-size: 36px;
  font-weight: 900;
  color: #4267B2;
}

.streak-label,
.rank-label {
  font-size: 12px;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.btn {
  padding: 16px 32px;
  font-size: 16px;
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

.btn-large {
  width: 100%;
  padding: 20px;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(66, 103, 178, 0.4);
  background: #3B5998;
}

.motivational-message {
  text-align: center;
  margin-top: 32px;
  padding: 24px;
}

.motivational-message p {
  font-size: 16px;
  font-style: italic;
  color: #888;
  margin: 0 0 8px 0;
}

.motivational-message .author {
  font-size: 14px;
  color: #666;
}

.feedback-section {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 32px 24px;
  margin-bottom: 24px;
}

.feedback-card {
  background: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 16px;
}

.feedback-card:last-child {
  margin-bottom: 0;
}

.success-feedback {
  border-left: 4px solid #44ff44;
}

.improve-feedback {
  border-left: 4px solid #4267B2;
}

.feedback-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.feedback-icon {
  font-size: 24px;
  font-weight: 900;
}

.success-feedback .feedback-icon {
  color: #44ff44;
}

.improve-feedback .feedback-icon {
  color: #ffd700;
}

.feedback-title {
  font-size: 16px;
  font-weight: 700;
  color: #fff;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.feedback-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.feedback-list li {
  font-size: 15px;
  line-height: 1.8;
  color: #e0e0e0;
  margin-bottom: 12px;
  padding-left: 24px;
  position: relative;
}

.feedback-list li:last-child {
  margin-bottom: 0;
}

.feedback-list li::before {
  content: "•";
  position: absolute;
  left: 8px;
  color: #ffd700;
  font-weight: 900;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}
</style>
