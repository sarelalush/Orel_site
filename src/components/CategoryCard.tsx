import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

interface CategoryCardProps {
  title: string;
  description: string;
  image: string;
  link: string;
  icon: React.ReactNode;
}

export default function CategoryCard({ title, description, image, link, icon }: CategoryCardProps) {
  return (
    <Link 
      to={link}
      className="group relative overflow-hidden rounded-lg shadow-dynamic hover:shadow-xl transition-all duration-500"
    >
      <div className="aspect-[4/3]">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-90 group-hover:opacity-100 transition-opacity" />
        <div className="absolute inset-0 p-6 flex flex-col justify-between text-white">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <div className="bg-primary p-2 rounded-lg">
                {icon}
              </div>
              <h3 className="text-2xl font-bold drop-shadow-lg">{title}</h3>
            </div>
            <div className="bg-white/20 rounded-full p-2 backdrop-blur-sm opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-300">
              <ArrowLeft className="w-5 h-5 text-white" />
            </div>
          </div>
          <p className="text-white/90 mt-2 line-clamp-2">{description}</p>
        </div>
      </div>
    </Link>
  );
}