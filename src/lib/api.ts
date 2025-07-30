// src/lib/api.ts

import { auth } from './firebase'; // Import our initialized auth service
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  updateProfile 
} from 'firebase/auth';

/**
 * Registers a new user using Firebase Authentication.
 * @param userData - The user's name, email, and password.
 * @returns The Firebase auth token.
 */
export const registerUser = async (userData: any) => {
  const { displayName, email, password } = userData;
  
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  
  // After creating the user, add their display name to their profile
  if (auth.currentUser) {
    await updateProfile(auth.currentUser, { displayName });
  }

  const token = await userCredential.user.getIdToken();
  return { token };
};

/**
 * Logs in an existing user using Firebase Authentication.
 * @param credentials - The user's email and password.
 * @returns The Firebase auth token.
 */
export const loginUser = async (credentials: any) => {
  const { email, password } = credentials;
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const token = await userCredential.user.getIdToken();
  return { token };
};