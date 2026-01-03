<template>
  <div class="skilltags-view">
    <div class="header">
      <button @click="goBack" class="back-button">← Back</button>
      <h2 class="header-title">Skill Tags</h2>
      <div class="spacer"></div>
    </div>

    <div class="container">
      <div class="stats-banner">
        <div class="stat-item">
          <span class="stat-value">{{ earnedCount }}</span>
          <span class="stat-label">Collected</span>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <span class="stat-value">{{ 100 - earnedCount }}</span>
          <span class="stat-label">Remaining</span>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <span class="stat-value">{{ progressPercent }}%</span>
          <span class="stat-label">Complete</span>
        </div>
      </div>

      <div class="tags-grid">
        <div
          v-for="quest in allQuests"
          :key="quest.id"
          class="dogtag-wrapper"
          :class="{ earned: isEarned(quest.id), locked: !isEarned(quest.id) }"
          @click="selectTag(quest)"
        >
          <div class="dogtag">
            <div class="tag-hole"></div>
            <div class="tag-content">
              <div class="tag-number">#{{ quest.id }}</div>
              <div class="tag-title">{{ quest.title }}</div>
              <div class="tag-phase">Phase {{ quest.phase }}</div>
            </div>
            <div class="tag-shine" v-if="isEarned(quest.id)"></div>
            <div class="lock-overlay" v-if="!isEarned(quest.id)">
              <span class="lock-icon">🔒</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Tag Detail Modal -->
    <div v-if="selectedTag" class="tag-modal" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-dogtag" :class="{ earned: isEarned(selectedTag.id) }">
          <div class="tag-hole"></div>
          <div class="tag-chain">
            <div class="chain-link" v-for="n in 5" :key="n"></div>
          </div>
          <div class="tag-content">
            <div class="tag-number">#{{ selectedTag.id }}</div>
            <div class="tag-title">{{ selectedTag.title }}</div>
            <div class="tag-phase">Phase {{ selectedTag.phase }}</div>
          </div>
          <div class="tag-shine" v-if="isEarned(selectedTag.id)"></div>
        </div>

        <div class="modal-info">
          <h3>{{ selectedTag.title }}</h3>
          <p class="phase-name">{{ selectedTag.phaseName }}</p>
          <p class="description">{{ selectedTag.description }}</p>

          <div v-if="isEarned(selectedTag.id)" class="earned-info">
            <span class="earned-badge">✓ EARNED</span>
            <span class="earned-date">{{ getEarnedDate(selectedTag.id) }}</span>
          </div>
          <div v-else class="locked-info">
            <span class="locked-badge">🔒 LOCKED</span>
            <p class="locked-hint">Complete Quest #{{ selectedTag.id }} to earn this tag</p>
          </div>
        </div>

        <button @click="closeModal" class="close-btn">Close</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useGameStore } from '../stores/game'
import { QUESTS } from '../data/quests'

const router = useRouter()
const gameStore = useGameStore()

const selectedTag = ref(null)

const allQuests = computed(() => QUESTS)

const earnedCount = computed(() => gameStore.skillTags?.length || 0)

const progressPercent = computed(() => Math.round((earnedCount.value / 100) * 100))

const isEarned = (questId) => {
  return gameStore.skillTags?.some(tag => tag.questNumber === questId)
}

const getEarnedDate = (questId) => {
  const tag = gameStore.skillTags?.find(t => t.questNumber === questId)
  if (tag?.earnedAt) {
    return new Date(tag.earnedAt).toLocaleDateString()
  }
  return ''
}

const selectTag = (quest) => {
  selectedTag.value = quest
}

const closeModal = () => {
  selectedTag.value = null
}

const goBack = () => {
  router.push('/quest')
}
</script>

<style scoped>
.skilltags-view {
  min-height: 100vh;
  background: linear-gradient(180deg, #0a0a0a 0%, #1a1a1a 100%);
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background: rgba(0, 0, 0, 0.8);
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
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.stats-banner {
  display: flex;
  justify-content: space-around;
  align-items: center;
  background: rgba(66, 103, 178, 0.1);
  border: 1px solid rgba(66, 103, 178, 0.3);
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 32px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.stat-value {
  font-size: 28px;
  font-weight: 900;
  color: #4267B2;
}

.stat-label {
  font-size: 12px;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.stat-divider {
  width: 1px;
  height: 40px;
  background: rgba(255, 255, 255, 0.1);
}

.tags-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 16px;
}

.dogtag-wrapper {
  cursor: pointer;
  transition: transform 0.3s ease;
}

.dogtag-wrapper:hover {
  transform: scale(1.05) rotate(-2deg);
}

.dogtag-wrapper.locked {
  opacity: 0.5;
}

.dogtag-wrapper.locked:hover {
  opacity: 0.7;
}

.dogtag {
  width: 100%;
  aspect-ratio: 1.8;
  background: linear-gradient(145deg, #b8b8b8 0%, #8a8a8a 30%, #a0a0a0 50%, #7a7a7a 70%, #909090 100%);
  border-radius: 8px 8px 16px 16px;
  position: relative;
  box-shadow:
    0 4px 12px rgba(0, 0, 0, 0.4),
    inset 0 1px 2px rgba(255, 255, 255, 0.3),
    inset 0 -1px 2px rgba(0, 0, 0, 0.2);
  border: 1px solid #666;
}

.dogtag-wrapper.locked .dogtag {
  background: linear-gradient(145deg, #4a4a4a 0%, #3a3a3a 50%, #2a2a2a 100%);
  border-color: #333;
}

.tag-hole {
  position: absolute;
  top: 8px;
  left: 50%;
  transform: translateX(-50%);
  width: 10px;
  height: 10px;
  background: #000;
  border-radius: 50%;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.8);
  border: 1px solid #555;
}

.dogtag-wrapper.locked .tag-hole {
  border-color: #222;
}

.tag-content {
  position: absolute;
  top: 22px;
  left: 0;
  right: 0;
  bottom: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-family: 'Courier New', monospace;
  padding: 0 8px;
}

.tag-number {
  font-size: 10px;
  color: #555;
  font-weight: 700;
}

.dogtag-wrapper.locked .tag-number {
  color: #444;
}

.tag-title {
  font-size: 9px;
  font-weight: 900;
  color: #333;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  text-shadow: 0 1px 0 rgba(255, 255, 255, 0.3);
  line-height: 1.2;
  max-height: 24px;
  overflow: hidden;
}

.dogtag-wrapper.locked .tag-title {
  color: #555;
  text-shadow: none;
}

.tag-phase {
  font-size: 7px;
  color: #666;
  margin-top: 2px;
}

.dogtag-wrapper.locked .tag-phase {
  color: #444;
}

.tag-shine {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    135deg,
    transparent 0%,
    transparent 40%,
    rgba(255, 255, 255, 0.3) 45%,
    rgba(255, 255, 255, 0.1) 50%,
    transparent 55%,
    transparent 100%
  );
  border-radius: 8px 8px 16px 16px;
  pointer-events: none;
}

.lock-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 8px 8px 16px 16px;
}

.lock-icon {
  font-size: 20px;
  opacity: 0.7;
}

/* Modal */
.tag-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-content {
  background: #1a1a1a;
  border-radius: 20px;
  padding: 32px;
  max-width: 400px;
  width: 100%;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.modal-dogtag {
  width: 200px;
  height: 110px;
  margin: 0 auto 24px;
  background: linear-gradient(145deg, #b8b8b8 0%, #8a8a8a 30%, #a0a0a0 50%, #7a7a7a 70%, #909090 100%);
  border-radius: 12px 12px 24px 24px;
  position: relative;
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.5),
    inset 0 2px 4px rgba(255, 255, 255, 0.3),
    inset 0 -2px 4px rgba(0, 0, 0, 0.2);
  border: 2px solid #666;
  transform: rotate(-5deg);
}

.modal-dogtag:not(.earned) {
  background: linear-gradient(145deg, #4a4a4a 0%, #3a3a3a 50%, #2a2a2a 100%);
  border-color: #333;
}

.modal-dogtag .tag-hole {
  width: 14px;
  height: 14px;
  top: 10px;
}

.modal-dogtag .tag-content {
  top: 30px;
}

.modal-dogtag .tag-number {
  font-size: 12px;
}

.modal-dogtag .tag-title {
  font-size: 12px;
  max-height: none;
}

.modal-dogtag .tag-phase {
  font-size: 9px;
}

.tag-chain {
  position: absolute;
  top: -30px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.chain-link {
  width: 8px;
  height: 12px;
  border: 2px solid #888;
  border-radius: 4px;
  margin-bottom: -4px;
}

.modal-info h3 {
  font-size: 20px;
  font-weight: 700;
  color: #fff;
  margin: 0 0 8px 0;
}

.phase-name {
  font-size: 12px;
  color: #4267B2;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin: 0 0 16px 0;
}

.description {
  font-size: 14px;
  color: #aaa;
  line-height: 1.6;
  margin: 0 0 24px 0;
}

.earned-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.earned-badge {
  display: inline-block;
  background: rgba(34, 197, 94, 0.2);
  color: #22c55e;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 700;
}

.earned-date {
  font-size: 12px;
  color: #666;
}

.locked-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.locked-badge {
  display: inline-block;
  background: rgba(255, 255, 255, 0.1);
  color: #888;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 700;
}

.locked-hint {
  font-size: 12px;
  color: #666;
  margin: 0;
}

.close-btn {
  margin-top: 24px;
  padding: 12px 32px;
  background: #4267B2;
  color: #fff;
  border: none;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
}

.close-btn:hover {
  background: #3B5998;
  transform: translateY(-2px);
}
</style>
