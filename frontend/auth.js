// auth.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// 🔑 PASTE YOUR FIREBASE CONFIG HERE
const firebaseConfig = {
  apiKey: "AIzaSyD4qI2KyTkejdE4t9JNPjeGrUaEukrSUCQ",
  authDomain: "bharat-explore-dc5a0.firebaseapp.com",
  projectId: "bharat-explore-dc5a0",
  storageBucket: "bharat-explore-dc5a0.firebasestorage.app",
  messagingSenderId: "283960863250",
  appId: "1:283960863250:web:94b38eb7ff3f2d183bc6cb"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// EXPORT
export {
  auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged
};