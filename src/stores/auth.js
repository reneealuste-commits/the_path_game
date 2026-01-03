import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { auth, db, googleProvider } from '../firebase/config'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const loading = ref(true)
  const error = ref(null)
  let authStateResolver = null

  const isAuthenticated = computed(() => !!user.value)

  // Initialize auth listener
  const initAuth = () => {
    return new Promise((resolve) => {
      // Add timeout to prevent infinite loading
      const timeout = setTimeout(() => {
        console.warn('Auth initialization timeout - setting loading to false')
        loading.value = false
        resolve(null)
      }, 5000) // 5 second timeout

      // Check for redirect result first
      auth.getRedirectResult().catch((err) => {
        console.error('Redirect result error:', err)
        error.value = err.message
      })

      auth.onAuthStateChanged(async (firebaseUser) => {
        clearTimeout(timeout) // Clear timeout if auth state changes
        try {
          if (firebaseUser) {
            // Fetch or create user document
            const userDoc = await db.collection('users').doc(firebaseUser.uid).get()
            if (userDoc.exists) {
              user.value = { uid: firebaseUser.uid, ...userDoc.data() }
              // Update last login
              await db.collection('users').doc(firebaseUser.uid).set({
                lastLoginAt: firebase.firestore.FieldValue.serverTimestamp()
              }, { merge: true })
            } else {
              // Create new user document
              const isAnonymous = firebaseUser.isAnonymous
              const newUser = {
                uid: firebaseUser.uid,
                displayName: firebaseUser.displayName || (isAnonymous ? 'Anonymous User' : 'User'),
                email: firebaseUser.email || null,
                photoURL: firebaseUser.photoURL || null,
                provider: firebaseUser.providerData[0]?.providerId || (isAnonymous ? 'anonymous' : 'unknown'),
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                lastLoginAt: firebase.firestore.FieldValue.serverTimestamp(),
                currentWeek: 1,
                streak: 0,
                totalMedals: 0,
                globalRank: 0,
                lastCompletionDate: null,
                hasCompletedCurrent: false
              }
              await db.collection('users').doc(firebaseUser.uid).set(newUser)
              user.value = { uid: firebaseUser.uid, ...newUser }
            }

            // Resolve any pending auth state promise
            if (authStateResolver) {
              authStateResolver(user.value)
              authStateResolver = null
            }
          } else {
            user.value = null
          }
        } catch (err) {
          console.error('Error in auth state handler:', err)
          error.value = err.message
          // Still set user to null on error to allow app to load
          user.value = null
        } finally {
          loading.value = false
          resolve(user.value)
        }
      })
    })
  }

  // Wait for user state to be populated
  const waitForAuthState = () => {
    return new Promise((resolve) => {
      if (user.value) {
        resolve(user.value)
      } else {
        authStateResolver = resolve
      }
    })
  }

  // Sign in with Google
  const signInWithGoogle = async () => {
    error.value = null
    try {
      // Try popup first (works in most browsers)
      await auth.signInWithPopup(googleProvider)
      // Wait for the auth state listener to populate user data
      await waitForAuthState()
      return user.value
    } catch (err) {
      console.error('Google sign-in error:', err.code, err.message)
      // If popup blocked or failed, try redirect
      if (err.code === 'auth/popup-blocked' ||
          err.code === 'auth/popup-closed-by-user' ||
          err.code === 'auth/cancelled-popup-request') {
        try {
          await auth.signInWithRedirect(googleProvider)
          // Page will redirect, won't reach here
        } catch (redirectErr) {
          error.value = redirectErr.message
          throw redirectErr
        }
      } else {
        error.value = err.message
        throw err
      }
    }
  }

  // Sign in anonymously
  const signInAnonymously = async () => {
    error.value = null
    try {
      await auth.signInAnonymously()
      // Wait for the auth state listener to populate user data
      await waitForAuthState()
      return user.value
    } catch (err) {
      error.value = err.message
      throw err
    }
  }

  // Sign out
  const logout = async () => {
    await auth.signOut()
    user.value = null
  }

  return {
    user,
    loading,
    error,
    isAuthenticated,
    initAuth,
    signInWithGoogle,
    signInAnonymously,
    logout
  }
})
