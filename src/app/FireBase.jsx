// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDXWsxHlI1Pa1jvsDDMuistpg2SymqyHMQ",
  authDomain: "jobproject-e17d3.firebaseapp.com",
  projectId: "jobproject-e17d3",
  storageBucket: "jobproject-e17d3.firebasestorage.app",
  messagingSenderId: "775774528637",
  appId: "1:775774528637:web:4530cef621291bfbc5fd14",
  measurementId: "G-8XX4H6KK3S"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);

