import React from 'react';

interface CardProps {
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  headerClassName?: string;
  bodyClassName?: string;
  footerClassName?: string;
  hoverable?: boolean;
  bordered?: boolean;
  compact?: boolean;
}

const Card: React.FC<CardProps> = ({
  title,
  children,
  footer,
  className = '',
  headerClassName = '',
  bodyClassName = '',
  footerClassName = '',
  hoverable = false,
  bordered = true,
  compact = false,
}) => {
  const cardClasses = [
    'bg-white rounded-lg overflow-hidden',
    bordered ? 'border border-neutral-200' : '',
    hoverable ? 'transition-shadow duration-200 hover:shadow-lg' : 'shadow',
    className,
  ].join(' ');

  const headerClasses = [
    'px-6 py-4 border-b border-neutral-200 font-medium text-lg',
    compact ? 'py-3' : '',
    headerClassName,
  ].join(' ');

  const bodyClasses = [
    'px-6 py-4',
    compact ? 'py-3' : '',
    bodyClassName,
  ].join(' ');

  const footerClasses = [
    'px-6 py-4 bg-neutral-50 border-t border-neutral-200',
    compact ? 'py-3' : '',
    footerClassName,
  ].join(' ');

  return (
    <div className={cardClasses}>
      {title && <div className={headerClasses}>{title}</div>}
      <div className={bodyClasses}>{children}</div>
      {footer && <div className={footerClasses}>{footer}</div>}
    </div>
  );
};

export default Card;