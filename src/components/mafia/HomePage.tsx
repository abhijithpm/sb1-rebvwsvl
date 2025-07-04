import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Skull, Users, Clock, Shield } from 'lucide-react';

export function MafiaHomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-gray-900 to-black text-white">
      {/* Hero Banner */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
          <div className="text-center">
            <div className="flex justify-center mb-6 sm:mb-8">
              <div className="relative">
                <Skull className="w-16 h-16 sm:w-24 sm:h-24 text-red-500 animate-pulse" />
                <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-4 h-4 sm:w-6 sm:h-6 bg-red-600 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold">!</span>
                </div>
              </div>
            </div>
            
            <h1 className="text-4xl sm:text-6xl md:text-8xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 bg-clip-text text-transparent">
              ILLAM MAFIA
            </h1>
            
            <p className="text-lg sm:text-xl md:text-2xl text-gray-300 mb-6 sm:mb-8 max-w-3xl mx-auto px-4">
              Enter the shadows of deception. Trust no one. Survive the night.
            </p>
            
            <button
              onClick={() => navigate('/mafia')}
              className="group relative inline-flex items-center px-8 sm:px-12 py-4 sm:py-6 text-xl sm:text-2xl font-bold text-white bg-gradient-to-r from-red-600 to-red-800 rounded-xl sm:rounded-2xl hover:from-red-700 hover:to-red-900 transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-red-500/25"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-red-500 to-red-700 rounded-xl sm:rounded-2xl blur opacity-75 group-hover:opacity-100 transition-opacity"></span>
              <span className="relative flex items-center">
                <Skull className="w-6 h-6 sm:w-8 sm:h-8 mr-3 sm:mr-4 group-hover:animate-bounce" />
                PLAY MAFIA
                <Skull className="w-6 h-6 sm:w-8 sm:h-8 ml-3 sm:ml-4 group-hover:animate-bounce" />
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-12 sm:py-20 bg-black/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 sm:mb-16 text-white">
            Game Features
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <FeatureCard
              icon={<Users className="w-8 h-8 sm:w-12 sm:h-12" />}
              title="Illam Gang Lobby"
              description="Join the exclusive Illam Gang room. One host, multiple players. Real-time lobby with live player list."
              color="from-blue-600 to-blue-800"
            />
            
            <FeatureCard
              icon={<Shield className="w-8 h-8 sm:w-12 sm:h-12" />}
              title="Secret Roles"
              description="Mafia, Detective, Doctor, Villager. Each role has unique abilities. Keep your identity hidden."
              color="from-green-600 to-green-800"
            />
            
            <FeatureCard
              icon={<Clock className="w-8 h-8 sm:w-12 sm:h-12" />}
              title="Timed Rounds"
              description="Host-controlled timer for discussions and voting. Intense pressure builds as time runs out."
              color="from-purple-600 to-purple-800"
            />
          </div>
        </div>
      </div>

      {/* How to Play */}
      <div className="py-12 sm:py-20 bg-gradient-to-r from-gray-900 to-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-8 sm:mb-12 text-white">How to Play</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-white/20">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <span className="text-xl sm:text-2xl font-bold">1</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Join the Game</h3>
              <p className="text-gray-300 text-sm sm:text-base">
                Enter the Illam Gang lobby. Choose to be the Host (game master) or join as a Player with your name.
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-white/20">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <span className="text-xl sm:text-2xl font-bold">2</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Get Your Role</h3>
              <p className="text-gray-300 text-sm sm:text-base">
                Once the host starts the game, you'll receive a secret role. Study it carefully - your survival depends on it.
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-white/20">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <span className="text-xl sm:text-2xl font-bold">3</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Survive & Deceive</h3>
              <p className="text-gray-300 text-sm sm:text-base">
                Use discussion time wisely. Mafia members eliminate players, while others try to identify the threats.
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-white/20">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <span className="text-xl sm:text-2xl font-bold">4</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Win the Game</h3>
              <p className="text-gray-300 text-sm sm:text-base">
                Mafia wins by eliminating all villagers. Villagers win by identifying and eliminating all mafia members.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ 
  icon, 
  title, 
  description, 
  color 
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string; 
  color: string; 
}) {
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-white/20 hover:bg-white/20 transition-all duration-300 group">
      <div className={`w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r ${color} rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:scale-110 transition-transform`}>
        <div className="text-white">
          {icon}
        </div>
      </div>
      <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-white">{title}</h3>
      <p className="text-gray-300 leading-relaxed text-sm sm:text-base">{description}</p>
    </div>
  );
}