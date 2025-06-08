import React from 'react';
import { Dashboard } from './components/dashboard/Dashboard';

function App() {
  const handleLogout = () => {
    // In a real app, this would handle logout logic
    console.log('Logout clicked');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Dashboard onLogout={handleLogout} />
    </div>
  );
}

export default App;