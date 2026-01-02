<template>
  <div class="mission-failed">
    <div class="container">
      <div class="content">
        <!-- GOOD Message -->
        <div class="good-section">
          <h1 class="good-title">GOOD</h1>
          <p class="good-message">
            You missed a day. That's a learning opportunity. Now get back to work.
          </p>
        </div>

        <!-- YouTube Video Embed -->
        <div class="video-section">
          <div class="video-container">
            <iframe
              src="https://www.youtube.com/embed/IdTMDpizis8?autoplay=1"
              title="GOOD - Jocko Willink"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
            ></iframe>
          </div>
        </div>

        <!-- Mission Failed Message -->
        <div class="failed-section">
          <div class="failed-badge">
            <span class="icon">⚠️</span>
            <h2 class="failed-title">MISSION FAILED</h2>
          </div>

          <div class="reset-info">
            <p>Your streak has been reset.</p>
            <p>Starting over from Day 1.</p>
          </div>

          <div class="stats-reset">
            <div class="stat">
              <span class="stat-label">Previous Streak</span>
              <span class="stat-value">{{ previousStreak }}</span>
            </div>
            <div class="stat">
              <span class="stat-label">New Streak</span>
              <span class="stat-value">0</span>
            </div>
          </div>
        </div>

        <!-- Back to Day 1 Button -->
        <button @click="backToOne" class="btn btn-primary btn-large">
          BACK TO DAY 1
        </button>

        <div class="motivational-footer">
          <p>"Don't let a setback turn into a surrender."</p>
          <p class="author">— Jocko Willink</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useGameStore } from '../stores/game'

const router = useRouter()
const gameStore = useGameStore()

const previousStreak = ref(0)

const backToOne = () => {
  gameStore.breakStreak()
  router.push('/quest')
}

onMounted(() => {
  previousStreak.value = gameStore.streak
})
</script>

<style scoped>
.mission-failed {
  min-height: 100vh;
  background: linear-gradient(135deg, #1a0000 0%, #0a0a0a 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.container {
  max-width: 600px;
  width: 100%;
}

.content {
  animation: fadeIn 0.8s ease;
}

.good-section {
  text-align: center;
  margin-bottom: 32px;
  padding: 32px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 16px;
}

.good-title {
  font-size: 64px;
  font-weight: 900;
  color: #ff4444;
  margin: 0 0 16px 0;
  letter-spacing: 4px;
  text-shadow: 0 0 30px rgba(255, 68, 68, 0.5);
}

.good-message {
  font-size: 18px;
  color: #ccc;
  line-height: 1.6;
  margin: 0;
}

.video-section {
  margin-bottom: 32px;
}

.video-container {
  position: relative;
  padding-bottom: 56.25%; /* 16:9 aspect ratio */
  height: 0;
  overflow: hidden;
  border-radius: 16px;
  background: #000;
}

.video-container iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 16px;
}

.failed-section {
  background: rgba(255, 68, 68, 0.1);
  border: 2px solid rgba(255, 68, 68, 0.3);
  border-radius: 16px;
  padding: 32px;
  margin-bottom: 32px;
  text-align: center;
}

.failed-badge {
  margin-bottom: 24px;
}

.icon {
  font-size: 48px;
  display: block;
  margin-bottom: 16px;
}

.failed-title {
  font-size: 28px;
  font-weight: 900;
  color: #ff4444;
  margin: 0;
  letter-spacing: 2px;
}

.reset-info {
  margin-bottom: 32px;
}

.reset-info p {
  font-size: 16px;
  color: #ccc;
  margin: 8px 0;
}

.stats-reset {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.stat {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 12px;
}

.stat-label {
  font-size: 12px;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.stat-value {
  font-size: 32px;
  font-weight: 900;
  color: #ff4444;
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
  background: linear-gradient(135deg, #ff4444 0%, #ff6666 100%);
  color: #fff;
}

.btn-large {
  width: 100%;
  padding: 20px;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(255, 68, 68, 0.4);
}

.motivational-footer {
  text-align: center;
  margin-top: 32px;
  padding: 24px;
}

.motivational-footer p {
  font-size: 16px;
  font-style: italic;
  color: #888;
  margin: 0 0 8px 0;
}

.motivational-footer .author {
  font-size: 14px;
  color: #666;
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
