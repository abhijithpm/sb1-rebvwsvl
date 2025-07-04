import React from 'react';
import { Code2, Palette, Terminal } from 'lucide-react';

export function About() {
  return (
    <section className="py-12 sm:py-20 bg-white" id="about">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12">About Me</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          <FeatureCard
            icon={<Code2 className="w-6 h-6 sm:w-8 sm:h-8" />}
            title="Frontend Development"
            description="Crafting responsive and intuitive user interfaces using modern frameworks and tools."
          />
          <FeatureCard
            icon={<Terminal className="w-6 h-6 sm:w-8 sm:h-8" />}
            title="Backend Development"
            description="Building scalable server-side applications and RESTful APIs."
          />
          <FeatureCard
            icon={<Palette className="w-6 h-6 sm:w-8 sm:h-8" />}
            title="UI/UX Design"
            description="Creating beautiful and user-friendly designs that enhance user experience."
          />
        </div>
      </div>
    </section>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="p-4 sm:p-6 bg-gray-50 rounded-lg">
      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600 mb-3 sm:mb-4">
        {icon}
      </div>
      <h3 className="text-lg sm:text-xl font-semibold mb-2">{title}</h3>
      <p className="text-sm sm:text-base text-gray-600">{description}</p>
    </div>
  );
}