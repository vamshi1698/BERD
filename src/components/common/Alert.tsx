import React from 'react';
import { AlertCircle, CheckCircle, Info, X, AlertTriangle } from 'lucide-react';

type AlertVariant = 'info' | 'success' | 'warning' | 'error';

interface AlertProps {
  variant?: AlertVariant;
  title?: string;
  message: string;
  closable?: boolean;
  onClose?: () => void;
  className?: string;
  icon?: React.ReactNode;
}

const Alert: React.FC<AlertProps> = ({
  variant = 'info',
  title,
  message,
  closable = false,
  onClose,
  className = '',
  icon,
}) => {
  const variantClasses = {
    info: 'bg-secondary-50 text-secondary-800 border-secondary-200',
    success: 'bg-success-50 text-success-800 border-success-200',
    warning: 'bg-warning-50 text-warning-800 border-warning-200',
    error: 'bg-error-50 text-error-800 border-error-200',
  };

  const variantIcons = {
    info: <Info className="h-5 w-5 text-secondary-500" />,
    success: <CheckCircle className="h-5 w-5 text-success-500" />,
    warning: <AlertTriangle className="h-5 w-5 text-warning-500" />,
    error: <AlertCircle className="h-5 w-5 text-error-500" />,
  };

  const classes = [
    'border-l-4 p-4 rounded-r',
    variantClasses[variant],
    className,
  ].join(' ');

  return (
    <div className={classes} role="alert">
      <div className="flex">
        <div className="flex-shrink-0">
          {icon || variantIcons[variant]}
        </div>
        <div className="ml-3 flex-1">
          {title && <h3 className="text-sm font-medium">{title}</h3>}
          <div className={`text-sm ${title ? 'mt-1' : ''}`}>{message}</div>
        </div>
        {closable && (
          <div className="pl-3">
            <button
              type="button"
              className="inline-flex rounded-md text-neutral-400 hover:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              onClick={onClose}
            >
              <span className="sr-only">Dismiss</span>
              <X className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Alert;