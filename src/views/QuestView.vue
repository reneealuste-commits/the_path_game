<template>
  <div class="quest-view">
    <div class="header">
      <div class="profile-bar">
        <div class="profile-info">
          <div class="profile-avatar" v-if="gameStore.profile.photoURL">
            <img :src="gameStore.profile.photoURL" :alt="gameStore.profile.name" />
          </div>
          <div class="profile-avatar-placeholder" v-else>
            {{ userInitials }}
          </div>
          <div class="profile-text">
            <span class="name">{{ gameStore.profile.name }}</span>
            <span class="rank">Rank: {{ gameStore.globalRank }}</span>
          </div>
        </div>
        <div class="header-actions">
          <button @click="goToLeaderboard" class="leaderboard-btn" title="Leaderboard">
            <span class="trophy-icon">🏆</span>
          </button>
          <span class="streak-badge">🔥 {{ gameStore.streak }}</span>
          <button @click="handleLogout" class="logout-btn" title="Logout">
            <span class="logout-icon">⎋</span>
          </button>
        </div>
      </div>
    </div>

    <div class="container">
      <!-- Quest Navigator -->
      <div class="quest-navigator">
        <button
          @click="toggleQuestMenu"
          class="quest-selector"
          :class="{ active: showQuestMenu }"
        >
          <span class="selector-phase">Phase {{ gameStore.currentQuest?.phase || 1 }}</span>
          <span class="selector-title">{{ gameStore.currentQuest?.title }}</span>
          <span class="selector-arrow">{{ showQuestMenu ? '▲' : '▼' }}</span>
        </button>

        <!-- Dropdown Menu -->
        <div v-if="showQuestMenu" class="quest-menu">
          <div class="menu-header">
            <h3>Quest Navigator</h3>
            <p class="menu-subtitle">{{ gameStore.currentWeek - 1 }} of 100 completed</p>
          </div>

          <div class="phases-list">
            <div
              v-for="phase in gameStore.allPhases"
              :key="phase.id"
              class="phase-group"
            >
              <div
                class="phase-header"
                :class="{
                  current: isCurrentPhase(phase.id),
                  completed: isPhaseCompleted(phase.id),
                  locked: isPhaseLocked(phase.id)
                }"
                @click="togglePhase(phase.id)"
              >
                <span class="phase-indicator">
                  <span v-if="isPhaseCompleted(phase.id)" class="check-icon">✓</span>
                  <span v-else-if="isPhaseLocked(phase.id)" class="lock-icon">🔒</span>
                  <span v-else class="phase-number">{{ phase.id }}</span>
                </span>
                <div class="phase-info">
                  <span class="phase-name">{{ phase.name }}</span>
                  <span class="phase-subtitle">{{ phase.subtitle }}</span>
                </div>
                <span class="phase-expand">{{ expandedPhases.includes(phase.id) ? '−' : '+' }}</span>
              </div>

              <div v-if="expandedPhases.includes(phase.id)" class="quests-list">
                <button
                  v-for="quest in getQuestsForPhase(phase.id)"
                  :key="quest.id"
                  class="quest-item"
                  :class="{
                    current: quest.id === gameStore.currentWeek,
                    completed: quest.id < gameStore.currentWeek,
                    locked: quest.id > gameStore.currentWeek
                  }"
                  @click="selectQuest(quest)"
                  :disabled="quest.id > gameStore.currentWeek"
                >
                  <span class="quest-status">
                    <span v-if="quest.id < gameStore.currentWeek" class="status-complete">✓</span>
                    <span v-else-if="quest.id === gameStore.currentWeek" class="status-current">●</span>
                    <span v-else class="status-locked">○</span>
                  </span>
                  <span class="quest-name">{{ quest.title }}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Progress Overview -->
      <div class="progress-overview">
        <div class="progress-bar-container">
          <div class="progress-bar" :style="{ width: progressPercent + '%' }"></div>
        </div>
        <div class="progress-text">
          <span class="progress-current">Quest {{ gameStore.currentWeek }}</span>
          <span class="progress-total">/ 100</span>
        </div>
      </div>

      <!-- Quest Content -->
      <div class="quest-content">
        <div class="phase-badge">
          PHASE {{ gameStore.currentQuest?.phase }} • {{ gameStore.currentQuest?.phaseName }}
        </div>
        <h1 class="quest-title">{{ gameStore.currentQuest?.title }}</h1>

        <!-- Lesson Content -->
        <div class="lesson-section">
          <div class="lesson-text-content">
            <p>{{ gameStore.currentQuest?.description }}</p>
          </div>
        </div>

        <!-- Watch Jocko Video -->
        <div class="video-option" v-if="gameStore.currentQuest?.videoUrl">
          <a
            :href="gameStore.currentQuest.videoUrl"
            target="_blank"
            class="btn btn-video"
          >
            📺 WATCH JOCKO'S LESSON
          </a>
          <p class="video-note">Watch Jocko explain this principle on YouTube</p>
        </div>

        <!-- Mission Brief -->
        <div class="mission-section">
          <h3 class="mission-title">YOUR MISSION</h3>
          <div class="mission-card">
            <p>{{ gameStore.currentQuest?.mission }}</p>
          </div>

          <button
            @click="goToDebrief"
            class="btn btn-primary btn-large"
            :disabled="gameStore.hasCompletedCurrent || gameStore.allQuestsComplete || gameStore.isViewingCompleted"
          >
            <span v-if="gameStore.isViewingCompleted">👁 VIEWING COMPLETED QUEST</span>
            <span v-else-if="!gameStore.hasCompletedCurrent && !gameStore.allQuestsComplete">🎯 BEGIN MISSION</span>
            <span v-else-if="gameStore.allQuestsComplete">✓ ALL QUESTS COMPLETE</span>
            <span v-else>✓ QUEST COMPLETE</span>
          </button>

          <button
            v-if="gameStore.isViewingCompleted"
            @click="returnToCurrent"
            class="btn btn-secondary btn-return"
          >
            ← Return to Current Quest
          </button>

          <p v-if="gameStore.hasCompletedCurrent && !gameStore.allQuestsComplete && !gameStore.isViewingCompleted" class="completed-message">
            Quest completed! Continue to next quest.
          </p>
          <p v-if="gameStore.allQuestsComplete" class="completed-message">
            Congratulations! You've mastered all 100 Leadership Quests!
          </p>
        </div>
      </div>

      <!-- Progress Footer -->
      <div class="progress-footer">
        <div class="stat">
          <span class="stat-label">Quest</span>
          <span class="stat-value">{{ Math.min(gameStore.currentWeek, 100) }}/100</span>
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
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useGameStore } from '../stores/game'
import { useAuthStore } from '../stores/auth'
import { getQuestsByPhase } from '../data/quests'

const router = useRouter()
const gameStore = useGameStore()
const authStore = useAuthStore()

const showQuestMenu = ref(false)
const expandedPhases = ref([])

const userInitials = computed(() => {
  const name = gameStore.profile.name || ''
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?'
})

const progressPercent = computed(() => {
  return Math.min(((gameStore.currentWeek - 1) / 100) * 100, 100)
})

const isCurrentPhase = (phaseId) => {
  return gameStore.actualQuest?.phase === phaseId
}

const isPhaseCompleted = (phaseId) => {
  const phaseQuests = getQuestsByPhase(phaseId)
  const lastQuest = phaseQuests[phaseQuests.length - 1]
  return gameStore.currentWeek > lastQuest.id
}

const isPhaseLocked = (phaseId) => {
  const phaseQuests = getQuestsByPhase(phaseId)
  const firstQuest = phaseQuests[0]
  return gameStore.currentWeek < firstQuest.id
}

const getQuestsForPhase = (phaseId) => {
  return getQuestsByPhase(phaseId)
}

const toggleQuestMenu = () => {
  showQuestMenu.value = !showQuestMenu.value
  if (showQuestMenu.value && gameStore.actualQuest) {
    // Auto-expand current phase
    if (!expandedPhases.value.includes(gameStore.actualQuest.phase)) {
      expandedPhases.value.push(gameStore.actualQuest.phase)
    }
  }
}

const togglePhase = (phaseId) => {
  if (expandedPhases.value.includes(phaseId)) {
    expandedPhases.value = expandedPhases.value.filter(id => id !== phaseId)
  } else {
    expandedPhases.value.push(phaseId)
  }
}

const selectQuest = (quest) => {
  if (quest.id <= gameStore.currentWeek) {
    gameStore.goToQuest(quest.id)
    showQuestMenu.value = false
  }
}

const returnToCurrent = () => {
  gameStore.returnToCurrent()
}

const goToDebrief = () => {
  router.push('/debrief')
}

const goToLeaderboard = () => {
  router.push('/leaderboard')
}

const handleLogout = async () => {
  await authStore.logout()
  router.push('/login')
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
  background: linear-gradient(180deg, #0a0a0a 0%, #111 100%);
  padding-bottom: 80px;
}

.header {
  background: rgba(0, 0, 0, 0.8);
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
  align-items: center;
  gap: 12px;
}

.profile-avatar img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #4267B2;
}

.profile-avatar-placeholder {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #4267B2;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  color: #fff;
  font-size: 14px;
  border: 2px solid #4267B2;
}

.profile-text {
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

.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.leaderboard-btn,
.logout-btn {
  background: rgba(255, 255, 255, 0.1);
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.leaderboard-btn:hover,
.logout-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.1);
}

.trophy-icon {
  font-size: 18px;
}

.logout-icon {
  font-size: 18px;
  color: #888;
}

.streak-badge {
  font-size: 18px;
  font-weight: 700;
  background: rgba(67, 103, 178, 0.2);
  padding: 8px 16px;
  border-radius: 20px;
  color: #4267B2;
}

.container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

/* Quest Navigator */
.quest-navigator {
  position: relative;
  margin-bottom: 24px;
}

.quest-selector {
  width: 100%;
  background: linear-gradient(135deg, rgba(66, 103, 178, 0.2) 0%, rgba(66, 103, 178, 0.1) 100%);
  border: 2px solid rgba(66, 103, 178, 0.4);
  border-radius: 16px;
  padding: 16px 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 12px;
  text-align: left;
}

.quest-selector:hover,
.quest-selector.active {
  border-color: #4267B2;
  background: linear-gradient(135deg, rgba(66, 103, 178, 0.3) 0%, rgba(66, 103, 178, 0.15) 100%);
}

.selector-phase {
  font-size: 12px;
  font-weight: 700;
  color: #4267B2;
  background: rgba(66, 103, 178, 0.2);
  padding: 4px 8px;
  border-radius: 6px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.selector-title {
  flex: 1;
  font-size: 18px;
  font-weight: 700;
  color: #fff;
}

.selector-arrow {
  color: #4267B2;
  font-size: 12px;
}

/* Quest Menu Dropdown */
.quest-menu {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: #1a1a1a;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  margin-top: 8px;
  max-height: 60vh;
  overflow-y: auto;
  z-index: 200;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
}

.menu-header {
  padding: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  position: sticky;
  top: 0;
  background: #1a1a1a;
}

.menu-header h3 {
  font-size: 18px;
  font-weight: 700;
  color: #fff;
  margin: 0 0 4px 0;
}

.menu-subtitle {
  font-size: 13px;
  color: #888;
  margin: 0;
}

.phases-list {
  padding: 8px;
}

.phase-group {
  margin-bottom: 4px;
}

.phase-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.phase-header:hover {
  background: rgba(255, 255, 255, 0.05);
}

.phase-header.current {
  background: rgba(66, 103, 178, 0.2);
}

.phase-header.completed {
  opacity: 0.8;
}

.phase-header.locked {
  opacity: 0.4;
}

.phase-indicator {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 700;
  color: #fff;
}

.phase-header.completed .phase-indicator {
  background: #22c55e;
}

.phase-header.current .phase-indicator {
  background: #4267B2;
}

.check-icon {
  color: #fff;
}

.lock-icon {
  font-size: 12px;
}

.phase-number {
  color: #fff;
}

.phase-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.phase-name {
  font-size: 14px;
  font-weight: 700;
  color: #fff;
}

.phase-subtitle {
  font-size: 11px;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.phase-expand {
  color: #666;
  font-size: 16px;
}

.quests-list {
  padding: 4px 0 4px 44px;
}

.quest-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: none;
  border: none;
  width: 100%;
  text-align: left;
}

.quest-item:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.05);
}

.quest-item.current {
  background: rgba(66, 103, 178, 0.2);
}

.quest-item.locked {
  opacity: 0.4;
  cursor: not-allowed;
}

.quest-item:disabled {
  cursor: not-allowed;
}

.quest-status {
  font-size: 14px;
}

.status-complete {
  color: #22c55e;
}

.status-current {
  color: #4267B2;
}

.status-locked {
  color: #444;
}

.quest-name {
  font-size: 14px;
  color: #ccc;
}

.quest-item.completed .quest-name {
  color: #888;
}

.quest-item.current .quest-name {
  color: #fff;
  font-weight: 600;
}

/* Progress Overview */
.progress-overview {
  margin-bottom: 32px;
}

.progress-bar-container {
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 8px;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #4267B2 0%, #22c55e 100%);
  border-radius: 4px;
  transition: width 0.5s ease;
}

.progress-text {
  display: flex;
  justify-content: center;
  gap: 4px;
}

.progress-current {
  font-size: 14px;
  font-weight: 700;
  color: #4267B2;
}

.progress-total {
  font-size: 14px;
  color: #666;
}

/* Quest Content */
.quest-content {
  animation: slideUp 0.6s ease;
}

.phase-badge {
  display: inline-block;
  background: rgba(67, 103, 178, 0.2);
  color: #4267B2;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 1.5px;
  margin-bottom: 16px;
  text-transform: uppercase;
}

.quest-title {
  font-size: 36px;
  font-weight: 900;
  color: #fff;
  margin: 0 0 32px 0;
  letter-spacing: 1px;
  line-height: 1.2;
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
  color: #4267B2;
  letter-spacing: 2px;
  text-transform: uppercase;
  margin: 0 0 16px 0;
}

.mission-card {
  background: rgba(67, 103, 178, 0.1);
  border: 2px solid rgba(67, 103, 178, 0.3);
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
  background: #4267B2;
  color: #fff;
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.btn-large {
  width: 100%;
  padding: 20px;
}

.btn-return {
  width: 100%;
  margin-top: 12px;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(66, 103, 178, 0.4);
  background: #3B5998;
}

.btn-secondary:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.15);
  transform: translateY(-2px);
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
  color: #4267B2;
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
