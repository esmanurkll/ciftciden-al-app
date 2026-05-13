import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAZXHe7CH8AuREn56iKHaP_T1jB8QIRFsg",
  authDomain: "ciftciden-al-c2f66.firebaseapp.com",
  projectId: "ciftciden-al-c2f66",
  storageBucket: "ciftciden-al-c2f66.firebasestorage.app",
  messagingSenderId: "572361742203",
  appId: "1:572361742203:web:0c0b2e811aa45340740fde",
  measurementId: "G-NTLHNRBC9W"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);