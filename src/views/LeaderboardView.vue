<template>
  <div class="leaderboard-view">
    <div class="header">
      <button @click="goBack" class="back-button">← Back</button>
      <h2 class="header-title">Leaderboard</h2>
      <div class="spacer"></div>
    </div>

    <div class="container">
      <!-- Tab Selector -->
      <div class="tab-selector">
        <button
          @click="leaderboardStore.currentTab = 'weekly'"
          :class="['tab-btn', { active: leaderboardStore.currentTab === 'weekly' }]"
        >
          This Week
        </button>
        <button
          @click="leaderboardStore.currentTab = 'alltime'"
          :class="['tab-btn', { active: leaderboardStore.currentTab === 'alltime' }]"
        >
          All Time
        </button>
      </div>

      <!-- Week Info (for weekly tab) -->
      <div v-if="leaderboardStore.currentTab === 'weekly'" class="week-info">
        <span class="week-label">Week: {{ currentWeekId }}</span>
        <span class="reset-info">Resets Monday 00:00 UTC</span>
      </div>

      <!-- Current User Rank Card -->
      <div v-if="authStore.user" class="user-rank-card">
        <div class="user-avatar">
          <img
            v-if="authStore.user.photoURL"
            :src="authStore.user.photoURL"
            :alt="authStore.user.displayName"
          />
          <span v-else class="avatar-placeholder">{{ userInitials }}</span>
        </div>
        <div class="user-info">
          <span class="user-name">{{ authStore.user.displayName }}</span>
          <span class="user-stats">
            {{ gameStore.totalMedals }} medals | {{ gameStore.streak }} day streak
          </span>
        </div>
        <div class="user-rank">
          <span class="rank-label">Your Rank</span>
          <span class="rank-value">
            {{ leaderboardStore.currentUserRank || '-' }}
          </span>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="leaderboardStore.loading" class="loading-state">
        <div class="spinner"></div>
        <p>Loading leaderboard...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="leaderboardStore.error" class="error-state">
        <p>{{ leaderboardStore.error }}</p>
        <button @click="refreshLeaderboard" class="btn btn-retry">Retry</button>
      </div>

      <!-- Leaderboard List -->
      <div v-else class="leaderboard-list">
        <div
          v-for="entry in leaderboardStore.currentLeaderboard"
          :key="entry.userId"
          :class="['leaderboard-entry', { 'is-current-user': entry.userId === authStore.user?.uid }]"
        >
          <div class="entry-rank">
            <span v-if="entry.rank === 1" class="medal gold">1</span>
            <span v-else-if="entry.rank === 2" class="medal silver">2</span>
            <span v-else-if="entry.rank === 3" class="medal bronze">3</span>
            <span v-else class="rank-number">{{ entry.rank }}</span>
          </div>

          <div class="entry-avatar">
            <img
              v-if="entry.photoURL"
              :src="entry.photoURL"
              :alt="entry.displayName"
            />
            <span v-else class="avatar-placeholder">
              {{ entry.displayName?.charAt(0)?.toUpperCase() || '?' }}
            </span>
          </div>

          <div class="entry-info">
            <span class="entry-name">{{ entry.displayName }}</span>
            <span class="entry-streak">{{ entry.streak }} day streak</span>
          </div>

          <div class="entry-value">
            <span class="value-number">{{ entry.value }}</span>
            <span class="value-label">medals</span>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="leaderboardStore.currentLeaderboard.length === 0" class="empty-state">
          <p>No entries yet this week.</p>
          <p>Complete quests to appear on the leaderboard!</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useGameStore } from '../stores/game'
import { useLeaderboardStore } from '../stores/leaderboard'

const router = useRouter()
const authStore = useAuthStore()
const gameStore = useGameStore()
const leaderboardStore = useLeaderboardStore()

const currentWeekId = computed(() => leaderboardStore.getCurrentWeekId())

const userInitials = computed(() => {
  const name = authStore.user?.displayName || ''
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
})

const goBack = () => {
  router.push('/quest')
}

const refreshLeaderboard = () => {
  leaderboardStore.fetchLeaderboards()
}

onMounted(() => {
  leaderboardStore.fetchLeaderboards()
})
</script>

<style scoped>
.leaderboard-view {
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
  position: sticky;
  top: 0;
  z-index: 100;
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
  padding: 20px;
}

.tab-selector {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
  background: rgba(255, 255, 255, 0.05);
  padding: 4px;
  border-radius: 12px;
}

.tab-btn {
  flex: 1;
  padding: 12px;
  background: transparent;
  border: none;
  color: #888;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.tab-btn.active {
  background: #4267B2;
  color: #fff;
}

.week-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: rgba(66, 103, 178, 0.1);
  border-radius: 8px;
  margin-bottom: 20px;
}

.week-label {
  font-size: 14px;
  font-weight: 600;
  color: #4267B2;
}

.reset-info {
  font-size: 12px;
  color: #888;
}

.user-rank-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: rgba(66, 103, 178, 0.2);
  border: 2px solid #4267B2;
  border-radius: 16px;
  margin-bottom: 24px;
}

.user-avatar img,
.entry-avatar img {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
}

.avatar-placeholder {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #4267B2;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  color: #fff;
}

.user-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.user-name {
  font-size: 16px;
  font-weight: 700;
  color: #fff;
}

.user-stats {
  font-size: 12px;
  color: #888;
}

.user-rank {
  text-align: center;
}

.rank-label {
  display: block;
  font-size: 10px;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.rank-value {
  font-size: 32px;
  font-weight: 900;
  color: #4267B2;
}

.leaderboard-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.leaderboard-entry {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  transition: all 0.3s ease;
}

.leaderboard-entry.is-current-user {
  background: rgba(66, 103, 178, 0.15);
  border: 1px solid rgba(66, 103, 178, 0.3);
}

.entry-rank {
  width: 40px;
  text-align: center;
}

.medal {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  font-weight: 900;
  font-size: 14px;
}

.medal.gold {
  background: linear-gradient(135deg, #ffd700, #ffed4e);
  color: #000;
}

.medal.silver {
  background: linear-gradient(135deg, #c0c0c0, #e0e0e0);
  color: #000;
}

.medal.bronze {
  background: linear-gradient(135deg, #cd7f32, #daa520);
  color: #000;
}

.rank-number {
  font-size: 16px;
  font-weight: 700;
  color: #888;
}

.entry-avatar img {
  width: 40px;
  height: 40px;
}

.entry-avatar .avatar-placeholder {
  width: 40px;
  height: 40px;
  font-size: 14px;
}

.entry-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.entry-name {
  font-size: 14px;
  font-weight: 600;
  color: #fff;
}

.entry-streak {
  font-size: 12px;
  color: #888;
}

.entry-value {
  text-align: right;
}

.value-number {
  display: block;
  font-size: 20px;
  font-weight: 900;
  color: #4267B2;
}

.value-label {
  font-size: 10px;
  color: #888;
  text-transform: uppercase;
}

.loading-state,
.error-state,
.empty-state {
  text-align: center;
  padding: 48px 24px;
  color: #888;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(66, 103, 178, 0.2);
  border-top-color: #4267B2;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 16px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.btn-retry {
  margin-top: 16px;
  padding: 12px 24px;
  background: #4267B2;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
}
</style>
