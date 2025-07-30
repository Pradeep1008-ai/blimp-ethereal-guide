// src/lib/firebase.ts

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// TODO: Replace this with your own Firebase project's configuration object
const firebaseConfig = {
  apiKey: "AIzaSyDQ74LEhmZ4kBDyo7LLt5dXoBEF1MQOrV0",
  authDomain: "blimp-chat.firebaseapp.com",
  projectId: "blimp-chat",
  storageBucket: "blimp-chat.firebasestorage.app",
  messagingSenderId: "484882635087",
  appId: "1:484882635087:web:d9d6a7e1f9e0ebd4bbcd3a"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export the Firebase auth instance to be used in other files
export const auth = getAuth(app);