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
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div className="flex items-center space-x-3 min-w-0 flex-1 sm:flex-none">
            <div className="relative flex-shrink-0">
              <Gamepad2 className="w-6 h-6 sm:w-8 sm:h-8 text-indigo-600" />
              <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-purple-500 absolute -top-1 -right-1" />
            </div>
            <div className="min-w-0">
              <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent truncate">
                GameSpace AR
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 hidden sm:block">Professional Game Center</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
            <div className="text-right hidden sm:block">
              <p className="text-sm text-gray-600">Welcome back</p>
              <p className="font-medium text-gray-900">Demo User</p>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center px-3 py-2 sm:px-4 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors text-sm sm:text-base"
            >
              <LogOut className="w-4 h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}