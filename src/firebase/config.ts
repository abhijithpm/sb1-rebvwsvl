import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyBvOkBwRdtlAsAZzmPiIl13XhijOAWdTAg",
  authDomain: "illam-mafia-demo.firebaseapp.com",
  databaseURL: "https://illam-mafia-demo-default-rtdb.firebaseio.com",
  projectId: "illam-mafia-demo",
  storageBucket: "illam-mafia-demo.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:0123456789abcdef"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database and get a reference to the service
export const database = getDatabase(app);

export default app;