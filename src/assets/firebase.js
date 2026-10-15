// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB-tzcu5fxkaicxO0r8g-yIQNTp6n3UmYM",
  authDomain: "myapp-826dd.firebaseapp.com",
  projectId: "myapp-826dd",
  storageBucket: "myapp-826dd.firebasestorage.app",
  messagingSenderId: "976150294236",
  appId: "1:976150294236:web:d8dbf0c2a7319af87d8e19",
  measurementId: "G-8P8P60MSRN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

export { app, analytics, db };
