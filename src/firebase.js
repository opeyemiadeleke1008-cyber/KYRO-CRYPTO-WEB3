import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCqlA4qvPRu5lAyBbzZdGp8aiFcON3RVxM",
  authDomain: "kyro-crypto.firebaseapp.com",
  projectId: "kyro-crypto",
  storageBucket: "kyro-crypto.firebasestorage.app",
  messagingSenderId: "707461567113",
  appId: "1:707461567113:web:10c056aaffaf8b1a96ec58"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);