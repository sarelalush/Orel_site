import React from 'react';
import { Car, PenTool as Tool, Award, Users } from 'lucide-react';

export default function About() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center text-secondary mb-12">אודות PRO ATV</h1>
      
      <div className="max-w-3xl mx-auto mb-12">
        <p className="text-lg text-secondary-light leading-relaxed mb-6">
          PRO ATV הוא המקום המוביל בישראל לאביזרי רכבי שטח ואופנועים. אנחנו מתמחים באספקת הציוד האיכותי ביותר לחובבי השטח והמקצוענים, עם דגש על שירות מקצועי ואמין.
        </p>
        <p className="text-lg text-secondary-light leading-relaxed">
          הצוות שלנו מורכב ממומחים בתחום רכבי השטח, עם ניסיון רב בענף ומחויבות לספק את המוצרים הטובים ביותר ללקוחותינו.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
        <div className="text-center">
          <div className="bg-primary text-white p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Car className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-semibold text-secondary mb-2">מומחיות</h3>
          <p className="text-secondary-light">מומחים ברכבי שטח עם ניסיון של שנים בתחום</p>
        </div>
        
        <div className="text-center">
          <div className="bg-primary text-white p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Tool className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-semibold text-secondary mb-2">ציוד איכותי</h3>
          <p className="text-secondary-light">מוצרים מהמותגים המובילים בעולם</p>
        </div>
        
        <div className="text-center">
          <div className="bg-primary text-white p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Award className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-semibold text-secondary mb-2">אחריות</h3>
          <p className="text-secondary-light">אחריות מלאה על כל המוצרים</p>
        </div>
        
        <div className="text-center">
          <div className="bg-primary text-white p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Users className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-semibold text-secondary mb-2">שירות אישי</h3>
          <p className="text-secondary-light">ליווי מקצועי והתאמה אישית לצרכי הלקוח</p>
        </div>
      </div>
    </div>
  );
}