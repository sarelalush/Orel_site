import React from 'react';
import { Link } from 'react-router-dom';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionText?: string;
  actionLink?: string;
}

export default function EmptyState({ icon: Icon, title, description, actionText, actionLink }: EmptyStateProps) {
  return (
    <div className="text-center py-12">
      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
        <Icon className="w-8 h-8 text-primary" />
      </div>
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <p className="text-gray-600 mb-6">{description}</p>
      {actionText && actionLink && (
        <Link
          to={actionLink}
          className="btn-primary inline-flex items-center"
        >
          {actionText}
        </Link>
      )}
    </div>
  );
}