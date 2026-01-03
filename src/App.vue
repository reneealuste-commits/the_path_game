<template>
  <div id="app" class="app">
    <!-- Loading screen while auth initializes -->
    <div v-if="authStore.loading" class="loading-screen">
      <div class="spinner"></div>
      <p>Loading...</p>
    </div>

    <!-- Main app content -->
    <router-view v-else v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<script setup>
import { onMounted, watch } from 'vue'
import { useAuthStore } from './stores/auth'
import { useGameStore } from './stores/game'

const authStore = useAuthStore()
const gameStore = useGameStore()

onMounted(async () => {
  // Initialize Firebase Auth listener
  await authStore.initAuth()
})

// Watch for auth state changes and initialize game store
watch(() => authStore.user, async (newUser) => {
  if (newUser) {
    await gameStore.initialize()
  }
}, { immediate: true })
</script>

<style>
.loading-screen {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #000;
  color: #888;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(66, 103, 178, 0.2);
  border-top-color: #4267B2;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
