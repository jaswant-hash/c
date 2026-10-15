import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { app } from './firebase.js'

// Set up Firebase Auth
export const auth = getAuth(app)

// Set up Google login
const googleProvider = new GoogleAuthProvider()

// Sign up with email and password
export async function signUpWithEmail(email, password) {
  const result = await createUserWithEmailAndPassword(auth, email, password)
  return result.user
}

// Log in with email and password
export async function signInWithEmail(email, password) {
  const result = await signInWithEmailAndPassword(auth, email, password)
  return result.user
}

// Log in with Google
export async function signInWithGoogle() {
  const result = await signInWithPopup(auth, googleProvider)
  return result.user
}

// Log out
export async function signOutUser() {
  await signOut(auth)
}