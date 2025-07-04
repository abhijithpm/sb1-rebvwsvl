import React from 'react';
import { MapPin, Phone, Mail } from 'lucide-react';

export function Contact() {
  return (
    <section className="py-12 sm:py-20 bg-white" id="contact">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12">Get in Touch</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          <ContactCard
            icon={<MapPin className="w-5 h-5 sm:w-6 sm:h-6" />}
            title="Location"
            detail="San Francisco, CA"
          />
          <ContactCard
            icon={<Phone className="w-5 h-5 sm:w-6 sm:h-6" />}
            title="Phone"
            detail="+1 (555) 123-4567"
          />
          <ContactCard
            icon={<Mail className="w-5 h-5 sm:w-6 sm:h-6" />}
            title="Email"
            detail="john@example.com"
          />
        </div>
      </div>
    </section>
  );
}

function ContactCard({ icon, title, detail }: { icon: React.ReactNode; title: string; detail: string }) {
  return (
    <div className="text-center p-4 sm:p-6 bg-gray-50 rounded-lg">
      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 mx-auto mb-3 sm:mb-4">
        {icon}
      </div>
      <h3 className="text-base sm:text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm sm:text-base text-gray-600">{detail}</p>
    </div>
  );
}