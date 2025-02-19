import React from 'react';
import { MapPin, Phone, Mail } from 'lucide-react';

export function Contact() {
  return (
    <section className="py-20 bg-white" id="contact">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12">Get in Touch</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <ContactCard
            icon={<MapPin className="w-6 h-6" />}
            title="Location"
            detail="San Francisco, CA"
          />
          <ContactCard
            icon={<Phone className="w-6 h-6" />}
            title="Phone"
            detail="+1 (555) 123-4567"
          />
          <ContactCard
            icon={<Mail className="w-6 h-6" />}
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
    <div className="text-center p-6 bg-gray-50 rounded-lg">
      <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 mx-auto mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{detail}</p>
    </div>
  );
}