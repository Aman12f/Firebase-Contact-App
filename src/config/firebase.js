// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCP05Oo8nByo_H-niw8q3kR-RM-nka9pYY",
  authDomain: "vite-contact-8fc20.firebaseapp.com",
  projectId: "vite-contact-8fc20",
  storageBucket: "vite-contact-8fc20.appspot.com",
  messagingSenderId: "723065586568",
  appId: "1:723065586568:web:86bf747267777ca963303d",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
