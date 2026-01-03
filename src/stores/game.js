import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  serverTimestamp
} from 'firebase/firestore'
import { db } from '../firebase/config'
import { useAuthStore } from './auth'
import { QUESTS, PHASES, getQuestById, getQuestsByPhase, getTotalQuests, getPhaseProgress } from '../data/quests'

export const useGameStore = defineStore('game', () => {
  const authStore = useAuthStore()

  // Profile - now comes from auth store
  const profile = computed(() => ({
    name: authStore.user?.displayName || '',
    photoURL: authStore.user?.photoURL || '',
    createdAt: authStore.user?.createdAt || null
  }))

  // Progress tracking - synced with Firestore
  const currentWeek = ref(1)
  const viewingQuest = ref(null) // Quest being viewed (null = current quest)
  const streak = ref(0)
  const totalSkillTags = ref(0)
  const globalRank = ref(0)

  // Quest state
  const questStartTime = ref(null)
  const hasCompletedCurrent = ref(false)
  const lastCompletionDate = ref(null)

  // SkillTags and badges
  const skillTags = ref([])
  const badges = ref([])

  // Audio recording
  const currentRecording = ref(null)

  // Helper: Get ISO week ID
  const getISOWeekId = (date) => {
    const d = new Date(date)
    d.setHours(0, 0, 0, 0)
    d.setDate(d.getDate() + 4 - (d.getDay() || 7))
    const yearStart = new Date(d.getFullYear(), 0, 1)
    const weekNo = Math.ceil(((d - yearStart) / 86400000 + 1) / 7)
    return `${d.getFullYear()}-W${String(weekNo).padStart(2, '0')}`
  }

  // Initialize from Firestore
  const initialize = async () => {
    if (!authStore.user?.uid) return

    try {
      const userDoc = await getDoc(doc(db, 'users', authStore.user.uid))
      if (userDoc.exists()) {
        const data = userDoc.data()
        currentWeek.value = data.currentWeek || 1
        streak.value = data.streak || 0
        totalSkillTags.value = data.totalSkillTags || data.totalMedals || 0
        globalRank.value = data.globalRank || 0
        lastCompletionDate.value = data.lastCompletionDate?.toDate() || null
        hasCompletedCurrent.value = data.hasCompletedCurrent || false
      }

      // Fetch skillTags from subcollection (try skillTags first, fall back to medals)
      let tagsQuery = query(
        collection(db, 'users', authStore.user.uid, 'skillTags'),
        orderBy('earnedAt', 'asc')
      )
      let tagsSnapshot = await getDocs(tagsQuery)

      // Fallback to medals collection for backwards compatibility
      if (tagsSnapshot.empty) {
        tagsQuery = query(
          collection(db, 'users', authStore.user.uid, 'medals'),
          orderBy('earnedAt', 'asc')
        )
        tagsSnapshot = await getDocs(tagsQuery)
      }

      skillTags.value = tagsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        earnedAt: doc.data().earnedAt?.toDate() || null
      }))

      // Fetch badges from subcollection
      const badgesQuery = query(
        collection(db, 'users', authStore.user.uid, 'badges'),
        orderBy('earnedAt', 'asc')
      )
      const badgesSnapshot = await getDocs(badgesQuery)
      badges.value = badgesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        earnedAt: doc.data().earnedAt?.toDate() || null
      }))

      checkStreakIntegrity()
    } catch (error) {
      console.error('Error initializing game store:', error)
    }
  }

  // Save to Firestore
  const save = async () => {
    if (!authStore.user?.uid) return

    try {
      await updateDoc(doc(db, 'users', authStore.user.uid), {
        currentWeek: currentWeek.value,
        streak: streak.value,
        totalSkillTags: totalSkillTags.value,
        globalRank: globalRank.value,
        lastCompletionDate: lastCompletionDate.value,
        hasCompletedCurrent: hasCompletedCurrent.value,
        lastLoginAt: serverTimestamp()
      })
    } catch (error) {
      console.error('Error saving to Firestore:', error)
    }
  }

  // Get current quest (or viewed quest)
  const currentQuest = computed(() => {
    if (viewingQuest.value !== null) {
      return getQuestById(viewingQuest.value) || QUESTS[0]
    }
    return getQuestById(currentWeek.value) || QUESTS[0]
  })

  // Get actual progress quest (ignores viewing)
  const actualQuest = computed(() => {
    return getQuestById(currentWeek.value) || QUESTS[0]
  })

  // Check if viewing a completed quest
  const isViewingCompleted = computed(() => {
    return viewingQuest.value !== null && viewingQuest.value < currentWeek.value
  })

  // Check if all quests are complete
  const allQuestsComplete = computed(() => {
    return currentWeek.value > getTotalQuests()
  })

  // Get all phases for UI
  const allPhases = computed(() => PHASES)

  // Get all quests for navigation
  const allQuests = computed(() => QUESTS)

  // Get completed quests (all quests before current)
  const completedQuests = computed(() => {
    return QUESTS.filter(q => q.id < currentWeek.value)
  })

  // Navigate to specific quest (only completed ones) - for viewing
  const goToQuest = (questId) => {
    if (questId < currentWeek.value) {
      viewingQuest.value = questId
    } else if (questId === currentWeek.value) {
      viewingQuest.value = null // Back to current quest
    }
  }

  // Return to current (actual) quest
  const returnToCurrent = () => {
    viewingQuest.value = null
  }

  // Check if streak is broken
  const checkStreakIntegrity = () => {
    if (!lastCompletionDate.value) return false

    const lastDate = new Date(lastCompletionDate.value)
    const today = new Date()
    lastDate.setHours(0, 0, 0, 0)
    today.setHours(0, 0, 0, 0)

    const daysDiff = Math.floor((today - lastDate) / (24 * 60 * 60 * 1000))

    if (daysDiff > 1) {
      return true
    }

    return false
  }

  // Update weekly progress for leaderboard
  const updateWeeklyProgress = async () => {
    if (!authStore.user?.uid) return

    try {
      const now = new Date()
      const weekId = getISOWeekId(now)
      const docId = `${weekId}_${authStore.user.uid}`

      await setDoc(doc(db, 'weeklyProgress', docId), {
        userId: authStore.user.uid,
        weekId,
        weekStart: serverTimestamp(),
        skillTagCount: totalSkillTags.value,
        streakContribution: streak.value,
        displayName: authStore.user.displayName,
        photoURL: authStore.user.photoURL
      }, { merge: true })
    } catch (error) {
      console.error('Error updating weekly progress:', error)
    }
  }

  // Complete daily quest
  const completeQuest = async (audioBlob, evaluation, feedback = null) => {
    if (!authStore.user?.uid) return

    // Save recording locally
    currentRecording.value = audioBlob

    // Update streak
    streak.value += 1

    // Add medal to Firestore subcollection
    const medalData = {
      name: currentQuest.value.title,
      questNumber: currentWeek.value,
      earnedAt: serverTimestamp(),
      evaluation,
      feedback
    }

    try {
      const medalRef = await addDoc(
        collection(db, 'users', authStore.user.uid, 'medals'),
        medalData
      )
      medals.value.push({ id: medalRef.id, ...medalData, earnedAt: new Date() })
      totalMedals.value += 1

      // Update global rank
      globalRank.value += Math.floor(Math.random() * 10) + 5

      // Check if this completes a phase
      const quest = getQuestById(currentWeek.value)
      const phaseQuests = getQuestsByPhase(quest.phase)
      const lastQuestInPhase = phaseQuests[phaseQuests.length - 1]

      if (currentWeek.value === lastQuestInPhase.id) {
        const phase = PHASES.find(p => p.id === quest.phase)
        const badgeData = {
          name: `Phase ${quest.phase}: ${phase.name} - Complete`,
          phase: quest.phase,
          earnedAt: serverTimestamp()
        }
        const badgeRef = await addDoc(
          collection(db, 'users', authStore.user.uid, 'badges'),
          badgeData
        )
        badges.value.push({ id: badgeRef.id, ...badgeData, earnedAt: new Date() })
      }

      // Move to next quest
      currentWeek.value += 1
      hasCompletedCurrent.value = false

      // Mark as completed
      lastCompletionDate.value = new Date()

      // Save progress to Firestore
      await save()

      // Update weekly progress for leaderboard
      await updateWeeklyProgress()
    } catch (error) {
      console.error('Error completing quest:', error)
    }
  }

  // Break streak - reset progress
  const breakStreak = async () => {
    streak.value = 0
    currentWeek.value = 1
    hasCompletedCurrent.value = false
    await save()
  }

  // Reset game
  const resetGame = async () => {
    currentWeek.value = 1
    streak.value = 0
    totalMedals.value = 0
    globalRank.value = 0
    medals.value = []
    badges.value = []
    questStartTime.value = null
    lastCompletionDate.value = null
    hasCompletedCurrent.value = false
    await save()
  }

  return {
    // State
    profile,
    currentWeek,
    viewingQuest,
    streak,
    totalMedals,
    globalRank,
    medals,
    badges,
    questStartTime,
    hasCompletedCurrent,
    lastCompletionDate,
    currentRecording,

    // Computed
    currentQuest,
    actualQuest,
    isViewingCompleted,
    allQuestsComplete,
    allPhases,
    allQuests,
    completedQuests,

    // Actions
    initialize,
    save,
    completeQuest,
    breakStreak,
    checkStreakIntegrity,
    resetGame,
    goToQuest,
    returnToCurrent
  }
})
