import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// Quest data for Phase 1: The Foundation
const QUESTS = {
  week1: {
    phase: 'THE FOUNDATION',
    title: 'Detach',
    description: 'When you are in the middle of a problem, when you are in the heat of battle, you need to detach. Pull yourself away from the immediate situation, from the emotions, from the noise. Step back. Look around. See the battlefield from a different perspective. See it from above. Detachment is the key. Detachment allows you to see the bigger picture. It allows you to make better decisions. Relax. Look around. Make a call.',
    mission: 'Today, in your next stressful situation—a meeting, a difficult conversation, a problem—practice detachment. Mentally step outside yourself. Observe from above like you are watching a movie. See the situation clearly. Then make your decision. Record what you observed and how detachment changed your perspective.',
    lesson: `Listen up. This is about detachment. When you're in the middle of a problem, when chaos is surrounding you, when emotions are running high—that's exactly when you need to detach.

Pull yourself away from the immediate situation. Step back. Look around. See the battlefield from a different perspective. See it from above.

Detachment is not about being cold or uncaring. It's about gaining perspective. It's about seeing the bigger picture so you can make better decisions.

When you're emotionally invested in the moment, you can't see the holes in your plan. You can't see the danger you're walking into. But when you detach, suddenly everything becomes clear.

Here's your tactical mantra: Relax. Look around. Make a call.

That's it. Detach from your emotions. Observe the situation objectively. Then execute.

Now get out there and practice this. Good.`,
    videoUrl: 'https://www.youtube.com/watch?v=fKcpxmtTDyU', // Jocko on detachment
    duration: 7 // days
  },
  // Future weeks will be added here
}

export const useGameStore = defineStore('game', () => {
  // Profile
  const profile = ref({
    name: '',
    createdAt: null
  })

  // Progress tracking
  const currentWeek = ref(1)
  const currentDay = ref(1)
  const streak = ref(0)
  const totalMedals = ref(0)
  const globalRank = ref(0)

  // Quest state
  const questStartTime = ref(null)
  const hasCompletedToday = ref(false)
  const lastCompletionDate = ref(null)

  // Medals and badges
  const medals = ref([])
  const badges = ref([])

  // Audio recording
  const currentRecording = ref(null)

  // Initialize from localStorage
  const initialize = () => {
    const saved = localStorage.getItem('the-path-game')
    if (saved) {
      const data = JSON.parse(saved)
      profile.value = data.profile || profile.value
      currentWeek.value = data.currentWeek || 1
      currentDay.value = data.currentDay || 1
      streak.value = data.streak || 0
      totalMedals.value = data.totalMedals || 0
      globalRank.value = data.globalRank || 0
      medals.value = data.medals || []
      badges.value = data.badges || []
      lastCompletionDate.value = data.lastCompletionDate || null
      questStartTime.value = data.questStartTime || null

      // Check if streak is broken
      checkStreakIntegrity()
    }
  }

  // Save to localStorage
  const save = () => {
    const data = {
      profile: profile.value,
      currentWeek: currentWeek.value,
      currentDay: currentDay.value,
      streak: streak.value,
      totalMedals: totalMedals.value,
      globalRank: globalRank.value,
      medals: medals.value,
      badges: badges.value,
      lastCompletionDate: lastCompletionDate.value,
      questStartTime: questStartTime.value
    }
    localStorage.setItem('the-path-game', JSON.stringify(data))
  }

  // Set profile name
  const setProfile = (name) => {
    profile.value = {
      name,
      createdAt: Date.now()
    }
    questStartTime.value = Date.now()
    save()
  }

  // Get current quest
  const currentQuest = computed(() => {
    return QUESTS[`week${currentWeek.value}`]
  })

  // Check if current week is unlocked
  const isWeekUnlocked = computed(() => {
    if (!questStartTime.value) return false

    const weeksSinceStart = Math.floor(
      (Date.now() - questStartTime.value) / (7 * 24 * 60 * 60 * 1000)
    )

    return weeksSinceStart >= currentWeek.value - 1
  })

  // Time until next week unlocks
  const timeUntilNextWeek = computed(() => {
    if (!questStartTime.value) return 0

    const nextWeekTime = questStartTime.value + (currentWeek.value * 7 * 24 * 60 * 60 * 1000)
    const remaining = nextWeekTime - Date.now()

    return Math.max(0, remaining)
  })

  // Check if streak is broken
  const checkStreakIntegrity = () => {
    if (!lastCompletionDate.value) return

    const lastDate = new Date(lastCompletionDate.value)
    const today = new Date()
    lastDate.setHours(0, 0, 0, 0)
    today.setHours(0, 0, 0, 0)

    const daysDiff = Math.floor((today - lastDate) / (24 * 60 * 60 * 1000))

    if (daysDiff > 1) {
      // Streak broken
      return true
    }

    // Check if already completed today
    if (daysDiff === 0) {
      hasCompletedToday.value = true
    }

    return false
  }

  // Complete daily quest
  const completeQuest = async (audioBlob, evaluation) => {
    // Save recording
    currentRecording.value = audioBlob

    // Update streak
    streak.value += 1
    currentDay.value += 1

    // Award medal
    const medal = {
      name: currentQuest.value.title,
      day: currentDay.value,
      week: currentWeek.value,
      earnedAt: Date.now(),
      evaluation
    }
    medals.value.push(medal)
    totalMedals.value += 1

    // Update global rank (simple increment for now)
    globalRank.value += Math.floor(Math.random() * 10) + 5

    // Check if week is complete
    if (currentDay.value > currentQuest.value.duration) {
      // Award badge
      badges.value.push({
        name: currentQuest.value.title,
        week: currentWeek.value,
        earnedAt: Date.now()
      })

      // Move to next week
      currentWeek.value += 1
      currentDay.value = 1
    }

    // Mark as completed today
    lastCompletionDate.value = Date.now()
    hasCompletedToday.value = true

    save()
  }

  // Break streak - reset to day 1
  const breakStreak = () => {
    streak.value = 0
    currentDay.value = 1
    hasCompletedToday.value = false
    save()
  }

  // Reset game
  const resetGame = () => {
    localStorage.removeItem('the-path-game')
    profile.value = { name: '', createdAt: null }
    currentWeek.value = 1
    currentDay.value = 1
    streak.value = 0
    totalMedals.value = 0
    globalRank.value = 0
    medals.value = []
    badges.value = []
    questStartTime.value = null
    lastCompletionDate.value = null
    hasCompletedToday.value = false
  }

  return {
    // State
    profile,
    currentWeek,
    currentDay,
    streak,
    totalMedals,
    globalRank,
    medals,
    badges,
    questStartTime,
    hasCompletedToday,
    lastCompletionDate,
    currentRecording,

    // Computed
    currentQuest,
    isWeekUnlocked,
    timeUntilNextWeek,

    // Actions
    initialize,
    save,
    setProfile,
    completeQuest,
    breakStreak,
    checkStreakIntegrity,
    resetGame
  }
})
