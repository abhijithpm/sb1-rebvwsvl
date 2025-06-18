import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Dashboard } from './components/dashboard/Dashboard';
import { MafiaHomePage } from './components/mafia/HomePage';
import { MafiaGame } from './components/mafia/MafiaGame';
import { GameProvider } from './components/mafia/GameContext';

function App() {
  const handleLogout = () => {
    console.log('Logout clicked');
  };

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