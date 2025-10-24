import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
const firebaseConfig = {
  apiKey: "AIzaSyDPdL2y9_vuFia5OsfMJD8BYa1quUW5ykM",
  authDomain: "wikiclicky-c2990.firebaseapp.com",
  projectId: "wikiclicky-c2990",
  storageBucket: "wikiclicky-c2990.firebasestorage.app",
  messagingSenderId: "179888437751",
  appId: "1:179888437751:web:1fdd5fc66dc807d5c016f2",
  measurementId: "G-YE9RJDV3M9"
};
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
