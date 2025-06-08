import React from 'react';
import { LogOut, Gamepad2, Sparkles } from 'lucide-react';
import { auth } from '../../utils/auth';

interface HeaderProps {
  onLogout: () => void;
}

export function Header({ onLogout }: HeaderProps) {
  return (
    <header className="bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Gamepad2 className="w-8 h-8 text-indigo-600" />
              <Sparkles className="w-4 h-4 text-purple-500 absolute -top-1 -right-1" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                GameSpace AR
              </h1>
              <p className="text-sm text-gray-500">Professional Game Center</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm text-gray-600">Welcome back</p>
              <p className="font-medium text-gray-900">Demo User</p>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}