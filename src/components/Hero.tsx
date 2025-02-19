import React from 'react';
import { Github, Linkedin, Mail } from 'lucide-react';

export function Hero() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8 text-center">
        <img
          src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150"
          alt="Profile"
          className="w-32 h-32 rounded-full mx-auto mb-8 border-4 border-white shadow-xl"
        />
        <h1 className="text-5xl font-bold mb-4">John Doe</h1>
        <p className="text-xl text-gray-300 mb-8">Full Stack Developer</p>
        <p className="text-lg text-gray-400 mb-12 max-w-2xl mx-auto">
          Passionate about creating beautiful and functional web applications.
          Specialized in React, Node.js, and modern web technologies.
        </p>
        <div className="flex justify-center space-x-6">
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
      className="text-gray-400 hover:text-white transition-colors duration-200"
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
    >
      {icon}
    </a>
  );
}