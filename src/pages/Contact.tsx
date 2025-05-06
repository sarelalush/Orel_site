import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // כאן יהיה הטיפול בשליחת הטופס
    console.log('Form submitted:', formData);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center text-secondary mb-12">צור קשר</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-semibold text-secondary mb-6">פרטי התקשרות</h2>
            
            <div className="space-y-6">
              <div className="flex items-center">
                <Phone className="w-6 h-6 text-primary ml-4" />
                <div>
                  <h3 className="font-semibold text-secondary">טלפון</h3>
                  <p className="text-secondary-light">052-284-4866</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <Mail className="w-6 h-6 text-primary ml-4" />
                <div>
                  <h3 className="font-semibold text-secondary">אימייל</h3>
                  <p className="text-secondary-light">info@proatv.co.il</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <MapPin className="w-6 h-6 text-primary ml-4" />
                <div>
                  <h3 className="font-semibold text-secondary">כתובת</h3>
                  <p className="text-secondary-light">רחוב הרצל 1, תל אביב</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <Clock className="w-6 h-6 text-primary ml-4" />
                <div>
                  <h3 className="font-semibold text-secondary">שעות פעילות</h3>
                  <p className="text-secondary-light">א'-ה' 9:00-19:00</p>
                  <p className="text-secondary-light">ו' 9:00-14:00</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-semibold text-secondary mb-6">שלח הודעה</h2>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-secondary font-medium mb-1">שם מלא</label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-secondary font-medium mb-1">אימייל</label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-secondary font-medium mb-1">טלפון</label>
                <input
                  type="tel"
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-secondary font-medium mb-1">הודעה</label>
                <textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                ></textarea>
              </div>
              
              <button
                type="submit"
                className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors"
              >
                שלח הודעה
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}