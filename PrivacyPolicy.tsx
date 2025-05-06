import React from 'react';

export default function PrivacyPolicy() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center text-secondary mb-12">מדיניות פרטיות</h1>

      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-8">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-secondary mb-4">כללי</h2>
          <p className="text-secondary-light mb-4">
            אנו ב-PRO ATV מכבדים את פרטיותך ומחויבים להגן על המידע האישי שלך. מדיניות זו מתארת כיצד אנו אוספים, משתמשים ומגנים על המידע שלך.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-secondary mb-4">איסוף מידע</h2>
          <p className="text-secondary-light mb-4">
            אנו אוספים מידע שאתה מספק לנו באופן ישיר בעת:
          </p>
          <ul className="list-disc list-inside text-secondary-light space-y-2">
            <li>יצירת חשבון באתר</li>
            <li>ביצוע הזמנה</li>
            <li>הרשמה לניוזלטר</li>
            <li>יצירת קשר עם שירות הלקוחות</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-secondary mb-4">שימוש במידע</h2>
          <p className="text-secondary-light mb-4">
            אנו משתמשים במידע שנאסף כדי:
          </p>
          <ul className="list-disc list-inside text-secondary-light space-y-2">
            <li>לספק את השירותים שביקשת</li>
            <li>לעבד את הזמנותיך</li>
            <li>לשלוח עדכונים על הזמנותיך</li>
            <li>לשפר את השירותים שלנו</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-secondary mb-4">אבטחת מידע</h2>
          <p className="text-secondary-light mb-4">
            אנו נוקטים באמצעי אבטחה מתקדמים כדי להגן על המידע שלך מפני גישה, שימוש או חשיפה בלתי מורשים.
          </p>
        </section>
      </div>
    </div>
  );
}