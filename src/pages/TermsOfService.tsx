import React from 'react';

export default function TermsOfService() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center text-secondary mb-12">תנאי שימוש</h1>

      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-8">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-secondary mb-4">הסכמה לתנאים</h2>
          <p className="text-secondary-light mb-4">
            השימוש באתר PRO ATV כפוף לתנאי השימוש המפורטים להלן. גלישה באתר או ביצוע רכישה מהווים הסכמה לתנאים אלו.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-secondary mb-4">מדיניות הזמנות ותשלומים</h2>
          <ul className="list-disc list-inside text-secondary-light space-y-2">
            <li>המחירים באתר כוללים מע"מ</li>
            <li>התשלום מתבצע באמצעות כרטיס אשראי או העברה בנקאית</li>
            <li>ההזמנה תטופל רק לאחר אישור התשלום</li>
            <li>זמני אספקה משוערים יימסרו בעת ביצוע ההזמנה</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-secondary mb-4">מדיניות החזרות וביטולים</h2>
          <ul className="list-disc list-inside text-secondary-light space-y-2">
            <li>ניתן לבטל עסקה תוך 14 יום מיום קבלת המוצר</li>
            <li>המוצר חייב להיות במצב חדש ובאריזתו המקורית</li>
            <li>דמי משלוח החזרה יחולו על הלקוח</li>
            <li>הזיכוי יבוצע באמצעי התשלום המקורי</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-secondary mb-4">אחריות</h2>
          <p className="text-secondary-light mb-4">
            כל המוצרים באתר מגיעים עם אחריות יצרן. תנאי האחריות המלאים מפורטים בדף המוצר.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-secondary mb-4">קניין רוחני</h2>
          <p className="text-secondary-light mb-4">
            כל התכנים באתר, לרבות תמונות, טקסטים ולוגו, הם קניינה הרוחני של PRO ATV ואין לעשות בהם שימוש ללא אישור.
          </p>
        </section>
      </div>
    </div>
  );
}