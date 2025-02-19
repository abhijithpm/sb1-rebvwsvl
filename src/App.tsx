import React, { useState } from 'react';
import { LoginForm } from './components/auth/LoginForm';
import { Dashboard } from './components/dashboard/Dashboard';
import { auth } from './utils/auth';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(auth.isAuthenticated);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = async () => {
    await auth.logout();
    setIsAuthenticated(false);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {isAuthenticated ? (
        <Dashboard onLogout={handleLogout} />
      ) : (
        <LoginForm onSuccess={handleLoginSuccess} />
      )}
    </div>
  );
}

export default App;

const customTooltip = ({ payload, label, active }) => {
  if (active && payload && payload.length) {
    console.log('Payload:', payload); // Debugging: Log payload to console

    return (
      <div style={{ backgroundColor: '#fff', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}>
        <p>{`Year: ${label}`}</p>
        {payload.map((item, index) => {
          if (!item.dataKey) return null; // Ensure dataKey exists

          const dataKey = item.dataKey.split('.')[0]; // Extract customer key
          const data = item.payload[dataKey]; // Access customer data

          if (!data) return null; // Ensure valid data

          const { value, bookedBy, dateTime } = data;

          return (
            <div key={index} style={{ marginBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ backgroundColor: item.color, width: 10, height: 10, marginRight: 5 }}></div>
                <p>{`${dataKey.replace('cust', 'Customer ')}: ${item.name}`}</p>
              </div>
              <p>{`Capacity: ${value}%`}</p>
              <p>{`Booked By: ${bookedBy}`}</p>
              <p>{`Date & Time: ${dateTime}`}</p>
            </div>
          );
        })}
      </div>
    );
  }

  return null;
};
