import React from 'react';
import { cn } from '../../lib/utils';

export const Button = React.forwardRef(
  ({ variant = 'primary', size = 'md', className, children, ...props }, ref) => {
    const sizeClass = {
      sm: 'btn-sm',
      md: '',
      lg: 'btn-lg'
    }[size];

    return (
      <button
        ref={ref}
        className={cn(`btn btn-${variant} ${sizeClass}`, className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';
