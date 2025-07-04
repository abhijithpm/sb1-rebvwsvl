import React from 'react';
import { Github, Linkedin, Mail, User } from 'lucide-react';

export function Hero() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8 text-center">
        <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6 sm:mb-8 border-4 border-white shadow-xl">
          <User className="w-12 h-12 sm:w-16 sm:h-16 text-white" />
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold mb-4">John Doe</h1>
        <p className="text-lg sm:text-xl text-gray-300 mb-6 sm:mb-8">Full Stack Developer</p>
        <p className="text-base sm:text-lg text-gray-400 mb-8 sm:mb-12 max-w-2xl mx-auto">
          Passionate about creating beautiful and functional web applications.
          Specialized in React, Node.js, and modern web technologies.
        </p>
        <div className="flex justify-center space-x-4 sm:space-x-6">
          <SocialLink href="https://github.com" icon={<Github />} label="GitHub" />
          <SocialLink href="https://linkedin.com" icon={<Linkedin />} label="LinkedIn" />
          <SocialLink href="mailto:john@example.com" icon={<Mail />} label="Email" />
        </div>
      </div>
    </div>
  );
}

function SocialLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <a
      href={href}
      className="text-gray-400 hover:text-white transition-colors duration-200 p-2"
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
    >
      <div className="w-6 h-6 sm:w-8 sm:h-8">
        {icon}
      </div>
    </a>
  );
}