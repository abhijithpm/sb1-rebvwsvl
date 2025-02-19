import React from 'react';
import { LogOut, Gamepad2 } from 'lucide-react';
import { auth } from '../../utils/auth';

interface HeaderProps {
  onLogout: () => void;
}

export function Header({ onLogout }: HeaderProps) {
  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <Gamepad2 className="w-8 h-8 text-indigo-600" />
            <h1 className="text-2xl font-bold text-gray-900">Home Game Center</h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-gray-600">
              Welcome, {auth.user?.username}
            </span>
            <button
              onClick={onLogout}
              className="flex items-center px-3 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <LogOut className="w-5 h-5 mr-1" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}