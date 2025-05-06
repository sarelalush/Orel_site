import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className="bg-gray-50 py-3 mb-6">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-2">
          <Link 
            to="/"
            className="text-gray-500 hover:text-primary transition-colors p-1 rounded-full hover:bg-white"
          >
            <Home className="w-5 h-5" />
          </Link>

          {items.map((item, index) => (
            <React.Fragment key={`breadcrumb-${index}-${item.label}`}>
              <ChevronLeft className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <Link
                to={item.href}
                className={`text-sm whitespace-nowrap ${
                  index === items.length - 1
                    ? 'text-primary font-medium'
                    : 'text-gray-500 hover:text-primary transition-colors'
                }`}
              >
                {item.label}
              </Link>
            </React.Fragment>
          ))}
        </div>
      </div>
    </nav>
  );
}