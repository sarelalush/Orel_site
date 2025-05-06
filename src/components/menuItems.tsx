import React from 'react';
import { Car, Wrench, Droplet } from 'lucide-react';

const menuItems = {
  'שטח': {
    icon: <Car className="w-5 h-5" />,
    categories: [
      {
        title: 'ציוד חילוץ',
        items: [
          { name: 'מגבהים', link: '/catalog?category=recovery&type=jacks' },
          { name: 'כננות', link: '/catalog?category=recovery&type=winches' },
          { name: 'חבלים', link: '/catalog?category=recovery&type=ropes' },
          { name: 'שאקלים', link: '/catalog?category=recovery&type=shackles' },
          { name: 'רצועות', link: '/catalog?category=recovery&type=straps' }
        ]
      },
      {
        title: 'אבזור חיצוני',
        items: [
          { name: 'פגושים', link: '/catalog?category=exterior&type=bumpers' },
          { name: 'מיגון גחון', link: '/catalog?category=exterior&type=skid-plates' },
          { name: 'סולמות', link: '/catalog?category=exterior&type=ladders' },
          { name: 'גגונים', link: '/catalog?category=exterior&type=roof-racks' },
          { name: 'ספוילרים', link: '/catalog?category=exterior&type=spoilers' }
        ]
      },
      {
        title: 'תאורה',
        items: [
          { name: 'לדים', link: '/catalog?category=lights&type=led' },
          { name: 'פנסי דרך', link: '/catalog?category=lights&type=driving' },
          { name: 'פנסי ערפל', link: '/catalog?category=lights&type=fog' },
          { name: 'בר תאורה', link: '/catalog?category=lights&type=light-bars' },
          { name: 'קיט קסנון', link: '/catalog?category=lights&type=xenon' }
        ]
      }
    ]
  },
  'כביש': {
    icon: <Car className="w-5 h-5" />,
    categories: [
      {
        title: 'אבזור פנים',
        items: [
          { name: 'ריפודים', link: '/catalog?category=interior&type=upholstery' },
          { name: 'שטיחים', link: '/catalog?category=interior&type=mats' },
          { name: 'כיסויי הגה', link: '/catalog?category=interior&type=steering-covers' },
          { name: 'ידיות הילוכים', link: '/catalog?category=interior&type=shift-knobs' },
          { name: 'דוושות', link: '/catalog?category=interior&type=pedals' }
        ]
      },
      {
        title: 'אבזור חוץ',
        items: [
          { name: 'חישוקים', link: '/catalog?category=wheels&type=rims' },
          { name: 'צמיגים', link: '/catalog?category=wheels&type=tires' },
          { name: 'ספוילרים', link: '/catalog?category=exterior&type=spoilers' },
          { name: 'מדבקות', link: '/catalog?category=exterior&type=stickers' },
          { name: 'כיסויי מראות', link: '/catalog?category=exterior&type=mirror-covers' }
        ]
      }
    ]
  },
  'צמיגים': {
    icon: <Car className="w-5 h-5" />,
    categories: [
      {
        title: 'צמיגי שטח',
        items: [
          { name: 'All Terrain', link: '/catalog?category=tires&type=all-terrain' },
          { name: 'Mud Terrain', link: '/catalog?category=tires&type=mud-terrain' },
          { name: 'צמיגי חול', link: '/catalog?category=tires&type=sand' },
          { name: 'צמיגי סלעים', link: '/catalog?category=tires&type=rock' }
        ]
      },
      {
        title: 'צמיגי כביש',
        items: [
          { name: 'קיץ', link: '/catalog?category=tires&type=summer' },
          { name: 'חורף', link: '/catalog?category=tires&type=winter' },
          { name: 'כל העונות', link: '/catalog?category=tires&type=all-season' },
          { name: 'ספורט', link: '/catalog?category=tires&type=sport' },
          { name: 'חיסכון', link: '/catalog?category=tires&type=economy' }
        ]
      }
    ]
  },
  'ספורט ימי': {
    icon: <Droplet className="w-5 h-5" />,
    categories: [
      {
        title: 'אופנועי ים',
        items: [
          { name: 'חלקי חילוף', link: '/catalog?category=marine&type=jet-ski-parts' },
          { name: 'אביזרים', link: '/catalog?category=marine&type=jet-ski-accessories' },
          { name: 'כיסויים', link: '/catalog?category=marine&type=jet-ski-covers' },
          { name: 'ציוד בטיחות', link: '/catalog?category=marine&type=jet-ski-safety' }
        ]
      },
      {
        title: 'סירות',
        items: [
          { name: 'חלקי חילוף', link: '/catalog?category=marine&type=boat-parts' },
          { name: 'אביזרים', link: '/catalog?category=marine&type=boat-accessories' },
          { name: 'ציוד עגינה', link: '/catalog?category=marine&type=boat-docking' },
          { name: 'אלקטרוניקה', link: '/catalog?category=marine&type=boat-electronics' }
        ]
      }
    ]
  },
  'שמנים ומוספים': {
    icon: <Wrench className="w-5 h-5" />,
    categories: [
      {
        title: 'שמנים',
        items: [
          { name: 'שמן מנוע', link: '/catalog?category=oils&type=engine' },
          { name: 'שמן גיר', link: '/catalog?category=oils&type=transmission' },
          { name: 'שמן בלמים', link: '/catalog?category=oils&type=brake' },
          { name: 'שמן הגה כוח', link: '/catalog?category=oils&type=power-steering' }
        ]
      },
      {
        title: 'מוספים',
        items: [
          { name: 'מוסף דלק', link: '/catalog?category=additives&type=fuel' },
          { name: 'מוסף שמן', link: '/catalog?category=additives&type=oil' },
          { name: 'ניקוי מזרקים', link: '/catalog?category=additives&type=injector-cleaner' },
          { name: 'אטימת נזילות', link: '/catalog?category=additives&type=leak-stop' }
        ]
      }
    ]
  }
} as const;

export default menuItems;