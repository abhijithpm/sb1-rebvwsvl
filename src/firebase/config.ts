// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBryy_mbJ9qf-BBzYUHjgN9bpMxxhqUXk0",
  authDomain: "illam-mafia-demo.firebaseapp.com",
  databaseURL: "https://illam-mafia-demo-default-rtdb.firebaseio.com",
  projectId: "illam-mafia-demo",
  storageBucket: "illam-mafia-demo.firebasestorage.app",
  messagingSenderId: "243599823200",
  appId: "1:243599823200:web:455287bfc1c2aca21b8e05",
  measurementId: "G-GT7XJWN0LN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);