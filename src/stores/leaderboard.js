import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { db } from '../firebase/config'
import { useAuthStore } from './auth'

export const useLeaderboardStore = defineStore('leaderboard', () => {
  const authStore = useAuthStore()

  const weeklyLeaderboard = ref([])
  const allTimeLeaderboard = ref([])
  const userWeeklyRank = ref(null)
  const userAllTimeRank = ref(null)
  const loading = ref(false)
  const error = ref(null)

  const currentTab = ref('weekly') // 'weekly' | 'alltime'

  // Get current week ID
  const getCurrentWeekId = () => {
    const now = new Date()
    const d = new Date(now)
    d.setHours(0, 0, 0, 0)
    d.setDate(d.getDate() + 4 - (d.getDay() || 7))
    const yearStart = new Date(d.getFullYear(), 0, 1)
    const weekNo = Math.ceil(((d - yearStart) / 86400000 + 1) / 7)
    return `${d.getFullYear()}-W${String(weekNo).padStart(2, '0')}`
  }

  // Fetch weekly leaderboard
  const fetchWeeklyLeaderboard = async () => {
    loading.value = true
    error.value = null

    try {
      const weekId = getCurrentWeekId()

      // Query weeklyProgress for current week
      const snapshot = await db.collection('weeklyProgress')
        .where('weekId', '==', weekId)
        .orderBy('medalCount', 'desc')
        .limit(100)
        .get()

      const entries = []
      let rank = 1

      snapshot.forEach((doc) => {
        const data = doc.data()
        entries.push({
          rank: rank++,
          userId: data.userId,
          displayName: data.displayName || 'Anonymous',
          photoURL: data.photoURL || null,
          value: data.medalCount || 0,
          streak: data.streakContribution || 0
        })
      })

      weeklyLeaderboard.value = entries

      // Find current user's rank
      if (authStore.user?.uid) {
        const userEntry = entries.find(e => e.userId === authStore.user.uid)
        userWeeklyRank.value = userEntry?.rank || null
      }
    } catch (err) {
      console.error('Error fetching weekly leaderboard:', err)
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  // Fetch all-time leaderboard
  const fetchAllTimeLeaderboard = async () => {
    loading.value = true
    error.value = null

    try {
      const snapshot = await db.collection('users')
        .orderBy('totalMedals', 'desc')
        .limit(100)
        .get()

      const entries = []
      let rank = 1

      snapshot.forEach((doc) => {
        const data = doc.data()
        entries.push({
          rank: rank++,
          userId: doc.id,
          displayName: data.displayName || 'Anonymous',
          photoURL: data.photoURL || null,
          value: data.totalMedals || 0,
          streak: data.streak || 0
        })
      })

      allTimeLeaderboard.value = entries

      // Find current user's rank
      if (authStore.user?.uid) {
        const userEntry = entries.find(e => e.userId === authStore.user.uid)
        userAllTimeRank.value = userEntry?.rank || null
      }
    } catch (err) {
      console.error('Error fetching all-time leaderboard:', err)
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  // Fetch both leaderboards
  const fetchLeaderboards = async () => {
    await Promise.all([
      fetchWeeklyLeaderboard(),
      fetchAllTimeLeaderboard()
    ])
  }

  const currentLeaderboard = computed(() => {
    return currentTab.value === 'weekly'
      ? weeklyLeaderboard.value
      : allTimeLeaderboard.value
  })

  const currentUserRank = computed(() => {
    return currentTab.value === 'weekly'
      ? userWeeklyRank.value
      : userAllTimeRank.value
  })

  return {
    weeklyLeaderboard,
    allTimeLeaderboard,
    userWeeklyRank,
    userAllTimeRank,
    loading,
    error,
    currentTab,
    currentLeaderboard,
    currentUserRank,
    fetchWeeklyLeaderboard,
    fetchAllTimeLeaderboard,
    fetchLeaderboards,
    getCurrentWeekId
  }
})
