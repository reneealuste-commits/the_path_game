import { createRouter, createWebHistory } from 'vue-router'
import { useGameStore } from '../stores/game'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/ProfileSetup.vue'),
    meta: { requiresAuth: false }
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
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const gameStore = useGameStore()

  if (to.meta.requiresAuth && !gameStore.profile.name) {
    next('/')
  } else if (to.path === '/' && gameStore.profile.name) {
    next('/quest')
  } else {
    next()
  }
})

export default router
