import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
  signInWithPopup,
  signInAnonymously as firebaseSignInAnonymously,
  signOut,
  onAuthStateChanged
} from 'firebase/auth'
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'
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
      onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
          // Fetch or create user document
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid))
          if (userDoc.exists()) {
            user.value = { uid: firebaseUser.uid, ...userDoc.data() }
            // Update last login
            await setDoc(doc(db, 'users', firebaseUser.uid), {
              lastLoginAt: serverTimestamp()
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
              createdAt: serverTimestamp(),
              lastLoginAt: serverTimestamp(),
              currentWeek: 1,
              streak: 0,
              totalMedals: 0,
              globalRank: 0,
              lastCompletionDate: null,
              hasCompletedCurrent: false
            }
            await setDoc(doc(db, 'users', firebaseUser.uid), newUser)
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
        loading.value = false
        resolve(user.value)
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
      await signInWithPopup(auth, googleProvider)
      // Wait for the auth state listener to populate user data
      await waitForAuthState()
      return user.value
    } catch (err) {
      error.value = err.message
      throw err
    }
  }

  // Sign in anonymously
  const signInAnonymously = async () => {
    error.value = null
    try {
      await firebaseSignInAnonymously(auth)
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
    await signOut(auth)
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
