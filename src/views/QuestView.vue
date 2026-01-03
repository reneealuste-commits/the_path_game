<template>
  <div class="quest-view">
    <div class="header">
      <div class="profile-bar">
        <div class="profile-info">
          <span class="name">{{ gameStore.profile.name }}</span>
          <span class="rank">Rank: {{ gameStore.globalRank }}</span>
        </div>
        <div class="streak-info">
          <span class="streak-badge">🔥 {{ gameStore.streak }}</span>
        </div>
      </div>
    </div>

    <div class="container">
      <!-- Quest Unlocked Banner -->
      <div class="unlock-banner">
        <h2 class="unlock-title">Quest {{ gameStore.currentWeek }} / 15</h2>
        <div class="quest-day">{{ gameStore.currentQuest.phase }}</div>
      </div>

      <!-- Quest Content -->
      <div class="quest-content">
        <div class="phase-badge">{{ gameStore.currentQuest.phase }}</div>
        <h1 class="quest-title">{{ gameStore.currentQuest.title }}</h1>

        <!-- Lesson Content -->
        <div class="lesson-section">
          <div class="lesson-text-content">
            <p>{{ gameStore.currentQuest.description }}</p>
          </div>
        </div>

        <!-- Watch Jocko Video -->
        <div class="video-option">
          <a
            :href="gameStore.currentQuest.videoUrl"
            target="_blank"
            class="btn btn-video"
          >
            📺 WATCH JOCKO'S LESSON
          </a>
          <p class="video-note">Watch Jocko explain detachment on YouTube</p>
        </div>

        <!-- Mission Brief -->
        <div class="mission-section">
          <h3 class="mission-title">YOUR MISSION</h3>
          <div class="mission-card">
            <p>{{ gameStore.currentQuest.mission }}</p>
          </div>

          <button
            @click="goToDebrief"
            class="btn btn-primary btn-large"
            :disabled="gameStore.hasCompletedCurrent || gameStore.allQuestsComplete"
          >
            <span v-if="!gameStore.hasCompletedCurrent && !gameStore.allQuestsComplete">🎯 BEGIN MISSION</span>
            <span v-else-if="gameStore.allQuestsComplete">✓ ALL QUESTS COMPLETE</span>
            <span v-else>✓ QUEST COMPLETE</span>
          </button>

          <p v-if="gameStore.hasCompletedCurrent && !gameStore.allQuestsComplete" class="completed-message">
            Quest completed! Continue to next quest.
          </p>
          <p v-if="gameStore.allQuestsComplete" class="completed-message">
            Congratulations! You've completed Phase 1: The Foundation
          </p>
        </div>
      </div>

      <!-- Progress Footer -->
      <div class="progress-footer">
        <div class="stat">
          <span class="stat-label">Quest</span>
          <span class="stat-value">{{ gameStore.currentWeek }}/15</span>
        </div>
        <div class="stat">
          <span class="stat-label">Medals</span>
          <span class="stat-value">{{ gameStore.totalMedals }}</span>
        </div>
        <div class="stat">
          <span class="stat-label">Streak</span>
          <span class="stat-value">{{ gameStore.streak }}</span>
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

const goToDebrief = () => {
  router.push('/debrief')
}

onMounted(() => {
  // Check if streak is broken
  if (gameStore.checkStreakIntegrity()) {
    router.push('/mission-failed')
  }
})
</script>

<style scoped>
.quest-view {
  min-height: 100vh;
  background: #000000;
  padding-bottom: 80px;
}

.header {
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding: 16px 20px;
  position: sticky;
  top: 0;
  z-index: 100;
}

.profile-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 600px;
  margin: 0 auto;
}

.profile-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.name {
  font-size: 16px;
  font-weight: 700;
  color: #fff;
}

.rank {
  font-size: 12px;
  color: #888;
}

.streak-badge {
  font-size: 18px;
  font-weight: 700;
  background: rgba(255, 215, 0, 0.2);
  padding: 8px 16px;
  border-radius: 20px;
  color: #ffd700;
}

.container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.unlock-banner {
  text-align: center;
  padding: 40px 20px;
  animation: fadeIn 0.6s ease;
}

.unlock-title {
  font-size: 32px;
  font-weight: 900;
  color: #ffd700;
  margin: 0 0 12px 0;
  letter-spacing: 2px;
  text-transform: uppercase;
}

.quest-day {
  font-size: 14px;
  color: #888;
  letter-spacing: 1px;
}

.quest-content {
  animation: slideUp 0.6s ease;
}

.phase-badge {
  display: inline-block;
  background: rgba(255, 215, 0, 0.2);
  color: #ffd700;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 1px;
  margin-bottom: 16px;
}

.quest-title {
  font-size: 36px;
  font-weight: 900;
  color: #fff;
  margin: 0 0 32px 0;
  letter-spacing: 1px;
}

.lesson-section {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 32px;
  margin-bottom: 24px;
}

.lesson-text-content p {
  font-size: 17px;
  line-height: 1.8;
  color: #e0e0e0;
  margin: 0;
}

.video-option {
  margin-top: 24px;
  margin-bottom: 24px;
  text-align: center;
  padding: 24px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.btn-video {
  display: inline-block;
  padding: 16px 32px;
  font-size: 16px;
  font-weight: 700;
  background: linear-gradient(135deg, #ff0000 0%, #cc0000 100%);
  color: #fff;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 1px;
  text-decoration: none;
  user-select: none;
}

.btn-video:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(255, 0, 0, 0.4);
}

.video-note {
  margin-top: 12px;
  font-size: 13px;
  color: #888;
  font-style: italic;
}

.mission-section {
  animation: slideUp 0.6s ease;
}

.mission-title {
  font-size: 14px;
  font-weight: 700;
  color: #ffd700;
  letter-spacing: 2px;
  text-transform: uppercase;
  margin: 0 0 16px 0;
}

.mission-card {
  background: rgba(255, 215, 0, 0.1);
  border: 2px solid rgba(255, 215, 0, 0.3);
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
}

.mission-card p {
  font-size: 16px;
  line-height: 1.6;
  color: #fff;
  margin: 0;
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
  background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
  color: #000;
}

.btn-large {
  width: 100%;
  padding: 20px;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(255, 215, 0, 0.4);
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background: #333;
  color: #666;
}

.completed-message {
  text-align: center;
  margin-top: 16px;
  color: #888;
  font-size: 14px;
}

.progress-footer {
  display: flex;
  justify-content: space-around;
  margin-top: 40px;
  padding: 24px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
}

.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.stat-label {
  font-size: 12px;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.stat-value {
  font-size: 24px;
  font-weight: 900;
  color: #ffd700;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
