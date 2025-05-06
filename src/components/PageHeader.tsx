import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  description?: string;
  backLink?: string;
  backText?: string;
}

export default function PageHeader({ title, description, backLink, backText }: PageHeaderProps) {
  return (
    <div className="mb-8">
      {backLink && (
        <Link 
          to={backLink}
          className="flex items-center gap-2 text-gray-500 hover:text-primary transition-colors mb-4"
        >
          <ChevronLeft className="w-5 h-5" />
          {backText || 'חזרה'}
        </Link>
      )}
      <h1 className="text-3xl font-bold mb-2">{title}</h1>
      {description && (
        <p className="text-gray-600">{description}</p>
      )}
    </div>
  );
}