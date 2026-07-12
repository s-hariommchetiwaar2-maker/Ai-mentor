import React from 'react';

// -----------------------------------------------------------------------------
// Helper style generator to combine classnames without full utility packages
// -----------------------------------------------------------------------------
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

// -----------------------------------------------------------------------------
// Button Component
// -----------------------------------------------------------------------------
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}) => {
  const baseStyle =
    'inline-flex items-center justify-center font-semibold rounded transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';

  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500',
    secondary:
      'bg-gray-200 hover:bg-gray-300 text-gray-800 focus:ring-gray-500',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
    ghost: 'bg-transparent hover:bg-gray-100 text-gray-700 focus:ring-gray-400',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <button
      className={cn(baseStyle, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
};

// -----------------------------------------------------------------------------
// Card Component
// -----------------------------------------------------------------------------
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  subtitle?: string;
}

export const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  className,
  children,
  ...props
}) => {
  return (
    <div
      className={cn(
        'bg-white border border-gray-200 rounded-lg shadow-sm p-5',
        className
      )}
      {...props}
    >
      {(title || subtitle) && (
        <div className="mb-4">
          {title && (
            <h3 className="text-lg font-bold text-gray-900">{title}</h3>
          )}
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
        </div>
      )}
      <div>{children}</div>
    </div>
  );
};

// -----------------------------------------------------------------------------
// Input Component
// -----------------------------------------------------------------------------
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  id,
  className,
  ...props
}) => {
  return (
    <div className="flex flex-col space-y-1 w-full">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <input
        id={id}
        className={cn(
          'px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm',
          error
            ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
            : 'border-gray-300',
          className
        )}
        {...props}
      />
      {error && <span className="text-xs text-red-500 mt-1">{error}</span>}
    </div>
  );
};

// -----------------------------------------------------------------------------
// Spinner Component
// -----------------------------------------------------------------------------
export interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg';
  color?: 'blue' | 'gray' | 'white';
}

export const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  color = 'blue',
  className,
  ...props
}) => {
  const sizes = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-3',
    lg: 'h-12 w-12 border-4',
  };

  const colors = {
    blue: 'border-blue-200 border-t-blue-600',
    gray: 'border-gray-200 border-t-gray-600',
    white: 'border-white/30 border-t-white',
  };

  return (
    <div
      className={cn(
        'animate-spin rounded-full border-solid',
        sizes[size],
        colors[color],
        className
      )}
      {...props}
    />
  );
};

// -----------------------------------------------------------------------------
// Modal Component
// -----------------------------------------------------------------------------
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" onClick={onClose}>
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen">
          &#8203;
        </span>

        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
          <div className="flex justify-between items-center pb-3 border-b border-gray-200 mb-4">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              {title}
            </h3>
            <button
              onClick={onClose}
              className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <span className="sr-only">Close</span>
              <span className="text-xl">&times;</span>
            </button>
          </div>
          <div>{children}</div>
        </div>
      </div>
    </div>
  );
};

// -----------------------------------------------------------------------------
// Toast Component
// -----------------------------------------------------------------------------
export interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose?: () => void;
}

export const Toast: React.FC<ToastProps> = ({
  message,
  type = 'info',
  onClose,
}) => {
  const bgColors = {
    success: 'bg-green-500 text-white',
    error: 'bg-red-500 text-white',
    info: 'bg-blue-500 text-white',
  };

  return (
    <div
      className={cn(
        'fixed bottom-4 right-4 flex items-center p-4 rounded-md shadow-lg space-x-3 z-50',
        bgColors[type]
      )}
    >
      <span className="text-sm font-medium">{message}</span>
      {onClose && (
        <button
          onClick={onClose}
          className="text-white hover:text-gray-200 font-bold focus:outline-none"
        >
          &times;
        </button>
      )}
    </div>
  );
};

// -----------------------------------------------------------------------------
// Responsive Navigation Component
// -----------------------------------------------------------------------------
export interface NavigationLink {
  label: string;
  href: string;
}

export interface NavigationProps {
  brandName: string;
  links: NavigationLink[];
}

export const Navigation: React.FC<NavigationProps> = ({ brandName, links }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <nav className="bg-gray-900 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 font-bold text-xl tracking-tight text-blue-400">
              {brandName}
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {links.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800 transition-all"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800 focus:outline-none"
            >
              <span className="sr-only">Open main menu</span>
              <span className="text-2xl">{isOpen ? '✕' : '☰'}</span>
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-gray-800 px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700"
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
};

// -----------------------------------------------------------------------------
// Base Layout Component
// -----------------------------------------------------------------------------
export interface BaseLayoutProps {
  brandName: string;
  links: NavigationLink[];
  children: React.ReactNode;
}

export const BaseLayout: React.FC<BaseLayoutProps> = ({
  brandName,
  links,
  children,
}) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
      <Navigation brandName={brandName} links={links} />
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      <footer className="bg-gray-100 border-t border-gray-200 py-6 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} {brandName}. All rights reserved.
      </footer>
    </div>
  );
};

// -----------------------------------------------------------------------------
// Loading Page
// -----------------------------------------------------------------------------
export const LoadingPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <Spinner size="lg" color="blue" />
      <h2 className="mt-4 text-xl font-semibold text-gray-700 animate-pulse">
        Loading AI Mentor...
      </h2>
      <p className="text-sm text-gray-400 mt-2">Getting things ready for you</p>
    </div>
  );
};

// -----------------------------------------------------------------------------
// Error Page
// -----------------------------------------------------------------------------
export interface ErrorPageProps {
  title?: string;
  message?: string;
  onReset?: () => void;
}

export const ErrorPage: React.FC<ErrorPageProps> = ({
  title = 'Something went wrong',
  message = 'An unexpected error occurred. Please try again or contact support if the issue persists.',
  onReset,
}) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="text-red-500 text-6xl font-extrabold">⚠️</div>
        <h1 className="text-2xl font-bold text-gray-950">{title}</h1>
        <p className="text-gray-600">{message}</p>
        {onReset && (
          <Button onClick={onReset} variant="primary">
            Try Again
          </Button>
        )}
      </div>
    </div>
  );
};
