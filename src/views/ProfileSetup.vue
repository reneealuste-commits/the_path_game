<template>
  <div class="profile-setup">
    <div class="container">
      <div class="logo">
        <h1 class="title">THE PATH</h1>
        <p class="subtitle">Leadership Training</p>
      </div>

      <div class="intro-section">
        <div class="jocko-message">
          <p class="quote">"There is no shortcut. There is no hack. There's only one way. So get after it."</p>
          <p class="author">— Jocko Willink</p>
        </div>

        <form @submit.prevent="handleSubmit" class="profile-form">
          <label for="name" class="label">Enter your name, leader:</label>
          <input
            id="name"
            v-model="name"
            type="text"
            class="input"
            placeholder="Your name"
            autocomplete="off"
            maxlength="30"
            required
          />
          <button type="submit" class="btn btn-primary" :disabled="!name.trim()">
            BEGIN THE PATH
          </button>
        </form>
      </div>

      <div class="phase-info">
        <h3>Phase I: THE FOUNDATION</h3>
        <p>15 weeks. 5 phases. One mission: Master leadership.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useGameStore } from '../stores/game'

const router = useRouter()
const gameStore = useGameStore()
const name = ref('')

const handleSubmit = () => {
  if (name.value.trim()) {
    gameStore.setProfile(name.value.trim())
    router.push('/quest')
  }
}
</script>

<style scoped>
.profile-setup {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #000000;
  padding: 20px;
}

.container {
  max-width: 500px;
  width: 100%;
}

.logo {
  text-align: center;
  margin-bottom: 40px;
}

.title {
  font-size: 48px;
  font-weight: 900;
  letter-spacing: 4px;
  color: #fff;
  margin: 0;
  text-shadow: 0 0 20px rgba(66, 103, 178, 0.3);
}

.subtitle {
  font-size: 14px;
  color: #888;
  letter-spacing: 2px;
  margin-top: 8px;
  text-transform: uppercase;
}

.intro-section {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 32px;
  margin-bottom: 32px;
}

.jocko-message {
  margin-bottom: 32px;
  text-align: center;
}

.quote {
  font-size: 18px;
  font-style: italic;
  color: #4267B2;
  line-height: 1.6;
  margin-bottom: 12px;
}

.author {
  font-size: 14px;
  color: #888;
}

.profile-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.label {
  font-size: 14px;
  color: #ccc;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.input {
  width: 100%;
  padding: 16px;
  font-size: 16px;
  background: rgba(255, 255, 255, 0.08);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  color: #fff;
  transition: all 0.3s ease;
}

.input:focus {
  outline: none;
  border-color: #ffd700;
  background: rgba(255, 255, 255, 0.12);
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

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(66, 103, 178, 0.4);
  background: #3B5998;
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.phase-info {
  text-align: center;
  padding: 24px;
  background: rgba(67, 103, 178, 0.05);
  border-radius: 12px;
  border: 1px solid rgba(67, 103, 178, 0.2);
}

.phase-info h3 {
  font-size: 18px;
  color: #4267B2;
  margin: 0 0 8px 0;
  letter-spacing: 2px;
}

.phase-info p {
  font-size: 14px;
  color: #888;
  margin: 0;
}
</style>
