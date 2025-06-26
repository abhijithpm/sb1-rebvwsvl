// In your firebase/gameService.ts file

import { database } from './firebase/database'; // Adjust path if your config file is elsewhere
import { ref, onValue } from 'firebase/database'; // Import ref and onValue

// ... other imports and gameService functions

export const gameService = {
  // ... other functions in gameService

  testConnection: async (): Promise<boolean> => {
    return new Promise((resolve) => {
      // Create a reference to the special .info/connected path
      const connectedRef = ref(database, '.info/connected');

      // Listen for a value change on this path, but only once
      const unsubscribe = onValue(connectedRef, (snapshot) => {
        const isConnected = snapshot.val(); // snapshot.val() will be true or false
        unsubscribe(); // Important: unsubscribe immediately after getting the value
        resolve(isConnected); // Resolve the promise with the connection status
      }, { onlyOnce: true }); // Option to listen only once
    });
  },

  // ... rest of your gameService functions like initializeRoom, etc.
};
