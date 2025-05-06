import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade } from 'swiper/modules';

const slides = [
  {
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80',
    title: 'מבצעי החודש',
    subtitle: '20-50% הנחה',
    link: '/catalog/sale'
  },
  {
    image: 'https://images.unsplash.com/photo-1625047509168-a7026f36de04?auto=format&fit=crop&q=80',
    title: 'קולקציה חדשה',
    subtitle: 'ציוד חילוץ מקצועי',
    link: '/catalog/new'
  },
  {
    image: 'https://images.unsplash.com/photo-1626072778346-0ab6604d39c4?auto=format&fit=crop&q=80',
    title: 'המומלצים שלנו',
    subtitle: 'הנמכרים ביותר',
    link: '/catalog/best-sellers'
  }
];

export default function HomeSlider() {
  return (
    <div className="relative">
      <Swiper
        modules={[Autoplay, EffectFade]}
        effect="fade"
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        loop={true}
        className="h-[500px]"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div className="relative h-full">
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/50 flex items-center">
                <div className="container mx-auto px-4">
                  <div className="max-w-xl">
                    <h2 className="text-6xl font-bold mb-4 text-white">{slide.title}</h2>
                    <p className="text-3xl mb-8 text-red-500 font-bold">{slide.subtitle}</p>
                    <a
                      href={slide.link}
                      className="bg-red-500 text-white px-8 py-3 rounded-lg inline-block hover:bg-red-600 transition-colors text-xl"
                    >
                      לצפייה במוצרים
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}