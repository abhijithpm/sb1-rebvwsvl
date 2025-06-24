import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Dashboard } from './components/dashboard/Dashboard';
import { MafiaHomePage } from './components/mafia/HomePage';
import { MafiaGame } from './components/mafia/MafiaGame';
import { GameProvider } from './components/mafia/GameContext';

import { ref, set, get, child } from 'firebase/database';
import { database } from './firebase/database'; // make sure this is the correct path to your firebase config

function App() {
  const handleLogout = () => {
    console.log('Logout clicked');
  };

  useEffect(() => {
    const testFirebaseConnection = async () => {
      try {
        const testRef = ref(database, 'connectionTest');
        await set(testRef, { status: 'connected', timestamp: Date.now() });
        console.log('✅ Firebase write succeeded');

        const snapshot = await get(child(ref(database), 'connectionTest'));
        if (snapshot.exists()) {
          console.log('✅ Firebase read succeeded:', snapshot.val());
        } else {
          console.log('⚠️ Firebase read: No data found');
        }
      } catch (error) {
        console.error('❌ Firebase connection failed:', error.message);
      }
    };

    testFirebaseConnection();
  }, []); // Runs once on component mount

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Routes>
          <Route path="/" element={<Dashboard onLogout={handleLogout} />} />
          <Route path="/mafia-home" element={<MafiaHomePage />} />
          <Route 
            path="/mafia" 
            element={
              <GameProvider>
                <MafiaGame />
              </GameProvider>
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
