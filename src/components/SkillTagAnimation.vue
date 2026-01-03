<template>
  <Teleport to="body">
    <div v-if="show" class="skilltag-overlay" @click="close">
      <div class="sparkle-container">
        <div v-for="n in 30" :key="n" class="sparkle" :style="getSparkleStyle(n)"></div>
      </div>

      <div class="skilltag-animation" :class="{ 'zoom-in': animationPhase === 'zoom-in', 'zoom-out': animationPhase === 'zoom-out' }">
        <div class="dogtag">
          <div class="tag-hole"></div>
          <div class="tag-content">
            <div class="tag-icon">{{ tagIcon }}</div>
            <div class="tag-title">{{ tagTitle }}</div>
            <div class="tag-number">#{{ tagNumber }}</div>
          </div>
          <div class="tag-shine"></div>
        </div>
      </div>

      <div class="earned-text" :class="{ visible: animationPhase === 'zoom-out' }">
        <span class="earned-label">SKILL TAG EARNED</span>
        <span class="tap-hint">Tap to continue</span>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'

const props = defineProps({
  show: Boolean,
  tagTitle: String,
  tagNumber: Number,
  tagIcon: {
    type: String,
    default: '⚔️'
  }
})

const emit = defineEmits(['close'])

const animationPhase = ref('zoom-in')

const getSparkleStyle = (n) => {
  const angle = (n / 30) * 360
  const distance = 100 + Math.random() * 200
  const delay = Math.random() * 2
  const duration = 1 + Math.random() * 2
  const size = 4 + Math.random() * 8

  return {
    '--angle': `${angle}deg`,
    '--distance': `${distance}px`,
    '--delay': `${delay}s`,
    '--duration': `${duration}s`,
    '--size': `${size}px`
  }
}

const close = () => {
  emit('close')
}

watch(() => props.show, (newVal) => {
  if (newVal) {
    animationPhase.value = 'zoom-in'
    setTimeout(() => {
      animationPhase.value = 'zoom-out'
    }, 1500)
  }
})

onMounted(() => {
  if (props.show) {
    animationPhase.value = 'zoom-in'
    setTimeout(() => {
      animationPhase.value = 'zoom-out'
    }, 1500)
  }
})
</script>

<style scoped>
.skilltag-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  z-index: 9999;
  cursor: pointer;
}

.sparkle-container {
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;
}

.sparkle {
  position: absolute;
  top: 50%;
  left: 50%;
  width: var(--size);
  height: var(--size);
  background: radial-gradient(circle, #fff 0%, #4267B2 50%, transparent 70%);
  border-radius: 50%;
  animation: sparkle-burst var(--duration) ease-out var(--delay) infinite;
  opacity: 0;
}

@keyframes sparkle-burst {
  0% {
    transform: translate(-50%, -50%) rotate(var(--angle)) translateX(0);
    opacity: 1;
    scale: 0;
  }
  50% {
    opacity: 1;
    scale: 1;
  }
  100% {
    transform: translate(-50%, -50%) rotate(var(--angle)) translateX(var(--distance));
    opacity: 0;
    scale: 0.5;
  }
}

.skilltag-animation {
  transition: transform 1.5s cubic-bezier(0.34, 1.56, 0.64, 1);
  z-index: 10;
}

.skilltag-animation.zoom-in {
  transform: scale(0) rotate(-30deg);
  animation: zoom-in-anim 1.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

.skilltag-animation.zoom-out {
  transform: scale(1) rotate(-5deg);
}

@keyframes zoom-in-anim {
  0% {
    transform: scale(0) rotate(-30deg);
    opacity: 0;
  }
  50% {
    transform: scale(1.2) rotate(5deg);
    opacity: 1;
  }
  100% {
    transform: scale(1) rotate(-5deg);
    opacity: 1;
  }
}

.dogtag {
  width: 180px;
  height: 100px;
  background: linear-gradient(145deg, #b8b8b8 0%, #8a8a8a 30%, #a0a0a0 50%, #7a7a7a 70%, #909090 100%);
  border-radius: 12px 12px 24px 24px;
  position: relative;
  box-shadow:
    0 4px 20px rgba(0, 0, 0, 0.5),
    inset 0 2px 4px rgba(255, 255, 255, 0.3),
    inset 0 -2px 4px rgba(0, 0, 0, 0.2);
  border: 2px solid #666;
}

.tag-hole {
  position: absolute;
  top: 12px;
  left: 50%;
  transform: translateX(-50%);
  width: 16px;
  height: 16px;
  background: #000;
  border-radius: 50%;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.8);
  border: 2px solid #555;
}

.tag-content {
  position: absolute;
  top: 35px;
  left: 0;
  right: 0;
  text-align: center;
  font-family: 'Courier New', monospace;
}

.tag-icon {
  font-size: 24px;
  margin-bottom: 4px;
}

.tag-title {
  font-size: 11px;
  font-weight: 900;
  color: #333;
  text-transform: uppercase;
  letter-spacing: 1px;
  text-shadow: 0 1px 0 rgba(255, 255, 255, 0.5);
  padding: 0 8px;
  line-height: 1.2;
}

.tag-number {
  font-size: 10px;
  color: #555;
  margin-top: 4px;
  font-weight: 700;
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
    rgba(255, 255, 255, 0.4) 45%,
    rgba(255, 255, 255, 0.1) 50%,
    transparent 55%,
    transparent 100%
  );
  border-radius: 12px 12px 24px 24px;
  pointer-events: none;
  animation: shine 3s ease-in-out infinite;
}

@keyframes shine {
  0%, 100% {
    opacity: 0.5;
  }
  50% {
    opacity: 1;
  }
}

.earned-text {
  margin-top: 40px;
  text-align: center;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.5s ease;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.earned-text.visible {
  opacity: 1;
  transform: translateY(0);
}

.earned-label {
  font-size: 24px;
  font-weight: 900;
  color: #4267B2;
  letter-spacing: 4px;
  text-shadow: 0 0 20px rgba(66, 103, 178, 0.5);
}

.tap-hint {
  font-size: 14px;
  color: #666;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 0.5;
  }
  50% {
    opacity: 1;
  }
}
</style>
