import { initializeApp } from 'firebase/app';
import { getDatabase, connectDatabaseEmulator } from 'firebase/database';

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

// Initialize Realtime Database and get a reference to the service
export const database = getDatabase(app);

// Enable offline persistence
// database.goOffline();
// database.goOnline();

export default app;