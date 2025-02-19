import { User } from '../types';

// Simulated authentication - in a real app, use proper authentication service
const MOCK_USER: User = {
  id: '1',
  username: 'demo_user',
  email: 'demo@example.com',
};

export const auth = {
  isAuthenticated: false,
  user: null as User | null,

  login(email: string, password: string): Promise<User> {
    return new Promise((resolve, reject) => {
      // Simulate API call
      setTimeout(() => {
        if (email === 'demo@example.com' && password === 'password') {
          this.isAuthenticated = true;
          this.user = MOCK_USER;
          resolve(MOCK_USER);
        } else {
          reject(new Error('Invalid credentials'));
        }
      }, 500);
    });
  },

  logout(): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.isAuthenticated = false;
        this.user = null;
        resolve();
      }, 500);
    });
  },
};