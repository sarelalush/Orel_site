import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';

const brands = [
  {
    name: 'BF Goodrich',
    logo: 'https://www.bfgoodrichtires.com/-/media/bfgoodrich/logos/bfg-logo-white.png'
  },
  {
    name: 'ARB',
    logo: 'https://arbusa.com/wp-content/uploads/2019/03/arb-logo.png'
  },
  {
    name: 'Warn',
    logo: 'https://www.warn.com/on/demandware.static/Sites-warn-Site/-/default/dw3a645d07/images/warn-logo.png'
  },
  {
    name: 'Fox Racing',
    logo: 'https://www.foxracing.com/on/demandware.static/Sites-fox-us-Site/-/default/dw3b5f9d9c/images/fox-logo.png'
  },
  {
    name: 'Rigid Industries',
    logo: 'https://www.rigidindustries.com/on/demandware.static/Sites-rigid-Site/-/default/dw8b5f9d9c/images/rigid-logo.png'
  },
  {
    name: 'Method Race Wheels',
    logo: 'https://www.methodracewheels.com/on/demandware.static/Sites-method-Site/-/default/dw3b5f9d9c/images/method-logo.png'
  }
];

export default function BrandsSlider() {
  return (
    <Swiper
      modules={[Autoplay]}
      slidesPerView={2}
      spaceBetween={30}
      autoplay={{ delay: 3000, disableOnInteraction: false }}
      loop={true}
      breakpoints={{
        640: { slidesPerView: 3 },
        768: { slidesPerView: 4 },
        1024: { slidesPerView: 6 }
      }}
      className="py-8"
    >
      {brands.map((brand, index) => (
        <SwiperSlide key={index}>
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex items-center justify-center h-32">
            <img 
              src={brand.logo} 
              alt={brand.name} 
              className="max-h-full max-w-full object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
            />
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}