import { initializeApp } from 'firebase/app'
import { getFirestore  } from 'firebase/firestore'
import { getStorage    } from 'firebase/storage'

const firebaseConfig = {
  apiKey:            "AIzaSyCxBzwYV4ppHKbLFpue1EYxwQYfiH2yL_k",
  authDomain:        "aira-and-rex.firebaseapp.com",
  projectId:         "aira-and-rex",
  storageBucket:     "aira-and-rex.firebasestorage.app",
  messagingSenderId: "470485844528",
  appId:             "1:470485844528:web:88cd58a3bb80157ae3a3f5",
  measurementId:     "G-RW4X1NW3P8",
}

const app = initializeApp(firebaseConfig)

export const db      = getFirestore(app)
export const storage = getStorage(app)
export default app
