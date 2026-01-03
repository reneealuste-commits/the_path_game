import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/LoginView.vue'),
    meta: { requiresAuth: false, guestOnly: true }
  },
  {
    path: '/quest',
    name: 'Quest',
    component: () => import('../views/QuestView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/debrief',
    name: 'Debrief',
    component: () => import('../views/DebriefView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/results',
    name: 'Results',
    component: () => import('../views/ResultsView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/mission-failed',
    name: 'MissionFailed',
    component: () => import('../views/MissionFailed.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/leaderboard',
    name: 'Leaderboard',
    component: () => import('../views/LeaderboardView.vue'),
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation guard
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  // Wait for auth to initialize if still loading
  if (authStore.loading) {
    await authStore.initAuth()
  }

  const isAuthenticated = authStore.isAuthenticated

  // Redirect to login if route requires auth and user not authenticated
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login')
  }
  // Redirect to quest if authenticated user tries to access guest-only routes
  else if (to.meta.guestOnly && isAuthenticated) {
    next('/quest')
  }
  else {
    next()
  }
})

export default router
