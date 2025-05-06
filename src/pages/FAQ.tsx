import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

export default function FAQ() {
  const [openItem, setOpenItem] = useState<number | null>(null);

  const faqItems: FAQItem[] = [
    {
      question: 'האם אתם מספקים משלוחים לכל הארץ?',
      answer: 'כן, אנחנו מספקים משלוחים לכל רחבי הארץ. משלוחים מעל 500 ₪ הם חינם. זמני המשלוח נעים בין 1-3 ימי עסקים.'
    },
    {
      question: 'מה מדיניות ההחזרות שלכם?',
      answer: 'ניתן להחזיר מוצרים תוך 14 יום מיום הקבלה, כל עוד הם במצב חדש ובאריזתם המקורית. יש ליצור קשר עם שירות הלקוחות לתיאום ההחזרה.'
    },
    {
      question: 'האם יש אחריות על המוצרים?',
      answer: 'כן, כל המוצרים שלנו מגיעים עם אחריות יצרן. תקופת האחריות משתנה בין המוצרים השונים, מ-6 חודשים ועד שנתיים.'
    },
    {
      question: 'האם אתם מציעים שירותי התקנה?',
      answer: 'כן, אנחנו מציעים שירותי התקנה מקצועיים במרכז השירות שלנו. ניתן לתאם התקנה בעת ביצוע ההזמנה.'
    },
    {
      question: 'האם ניתן לבצע הזמנה טלפונית?',
      answer: 'כן, ניתן לבצע הזמנות טלפוניות בשעות הפעילות שלנו. צרו קשר במספר 052-284-4866 ונשמח לעזור.'
    }
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center text-secondary mb-12">שאלות נפוצות</h1>

      <div className="max-w-3xl mx-auto">
        {faqItems.map((item, index) => (
          <div key={index} className="mb-4">
            <button
              className="w-full bg-white p-6 rounded-lg shadow-md flex items-center justify-between hover:bg-gray-50 transition-colors"
              onClick={() => setOpenItem(openItem === index ? null : index)}
            >
              <span className="text-lg font-semibold text-secondary">{item.question}</span>
              {openItem === index ? (
                <ChevronUp className="w-6 h-6 text-primary" />
              ) : (
                <ChevronDown className="w-6 h-6 text-primary" />
              )}
            </button>
            
            {openItem === index && (
              <div className="bg-white px-6 py-4 rounded-b-lg shadow-md border-t">
                <p className="text-secondary-light">{item.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}