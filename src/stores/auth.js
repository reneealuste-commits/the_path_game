import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged
} from 'firebase/auth'
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db, googleProvider, facebookProvider } from '../firebase/config'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const loading = ref(true)
  const error = ref(null)

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
            const newUser = {
              uid: firebaseUser.uid,
              displayName: firebaseUser.displayName,
              email: firebaseUser.email,
              photoURL: firebaseUser.photoURL,
              provider: firebaseUser.providerData[0]?.providerId || 'unknown',
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
        } else {
          user.value = null
        }
        loading.value = false
        resolve(user.value)
      })
    })
  }

  // Sign in with Google
  const signInWithGoogle = async () => {
    error.value = null
    try {
      const result = await signInWithPopup(auth, googleProvider)
      return result.user
    } catch (err) {
      error.value = err.message
      throw err
    }
  }

  // Sign in with Facebook
  const signInWithFacebook = async () => {
    error.value = null
    try {
      const result = await signInWithPopup(auth, facebookProvider)
      return result.user
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
    signInWithFacebook,
    logout
  }
})
