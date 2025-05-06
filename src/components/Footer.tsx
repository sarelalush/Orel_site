import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Clock, Facebook, Instagram, Youtube, CreditCard, Shield, Truck, ArrowLeft } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-black text-white">
      {/* Newsletter Section */}
      <div className="bg-gradient-to-r from-[#FF8C00] to-[#FFA533] py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">הצטרפו למועדון PRO ATV</h2>
            <p className="text-lg mb-6">קבלו עדכונים על מבצעים והנחות ישירות למייל</p>
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <input
                type="email"
                placeholder="הזינו את כתובת המייל שלכם"
                className="w-full md:w-96 px-6 py-3 rounded-lg text-black"
              />
              <button className="bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-900 transition-colors flex items-center justify-center gap-2">
                הצטרפו עכשיו
                <ArrowLeft className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-bold mb-6">צור קשר</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-[#FF8C00]" />
                <a href="tel:052-284-4866" className="hover:text-[#FF8C00] transition-colors">
                  052-284-4866
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-[#FF8C00]" />
                <a href="mailto:info@proatv.co.il" className="hover:text-[#FF8C00] transition-colors">
                  info@proatv.co.il
                </a>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-[#FF8C00]" />
                <span>רחוב הרצל 1, תל אביב</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-[#FF8C00]" />
                <div>
                  <p>א'-ה' 9:00-19:00</p>
                  <p>ו' 9:00-14:00</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-6">ניווט מהיר</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/catalog" className="hover:text-[#FF8C00] transition-colors">
                  קטלוג מוצרים
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#FF8C00] transition-colors">
                  אודות
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#FF8C00] transition-colors">
                  צור קשר
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-[#FF8C00] transition-colors">
                  שאלות נפוצות
                </Link>
              </li>
              <li>
                <Link to="/wishlist" className="hover:text-[#FF8C00] transition-colors">
                  רשימת מועדפים
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-xl font-bold mb-6">קטגוריות פופולריות</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/catalog?category=recovery" className="hover:text-[#FF8C00] transition-colors">
                  ציוד חילוץ
                </Link>
              </li>
              <li>
                <Link to="/catalog?category=lights" className="hover:text-[#FF8C00] transition-colors">
                  תאורה
                </Link>
              </li>
              <li>
                <Link to="/catalog?category=wheels" className="hover:text-[#FF8C00] transition-colors">
                  צמיגים וגלגלים
                </Link>
              </li>
              <li>
                <Link to="/catalog?category=exterior" className="hover:text-[#FF8C00] transition-colors">
                  אבזור חיצוני
                </Link>
              </li>
              <li>
                <Link to="/catalog?category=interior" className="hover:text-[#FF8C00] transition-colors">
                  אבזור פנימי
                </Link>
              </li>
            </ul>
          </div>

          {/* Social & Payment */}
          <div>
            <h3 className="text-xl font-bold mb-6">עקבו אחרינו</h3>
            <div className="flex gap-4 mb-8">
              <a href="#" className="bg-[#FF8C00] hover:bg-[#CC7000] p-2 rounded-full transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="bg-[#FF8C00] hover:bg-[#CC7000] p-2 rounded-full transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="bg-[#FF8C00] hover:bg-[#CC7000] p-2 rounded-full transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
            <h3 className="text-xl font-bold mb-4">אמצעי תשלום</h3>
            <div className="flex gap-4">
              <CreditCard className="w-8 h-8" />
              <Shield className="w-8 h-8" />
              <Truck className="w-8 h-8" />
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400">© 2024 PRO ATV. כל הזכויות שמורות.</p>
            <div className="flex gap-6">
              <Link to="/privacy-policy" className="text-gray-400 hover:text-[#FF8C00] transition-colors">
                מדיניות פרטיות
              </Link>
              <Link to="/terms-of-service" className="text-gray-400 hover:text-[#FF8C00] transition-colors">
                תנאי שימוש
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}