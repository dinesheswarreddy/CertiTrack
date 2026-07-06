import React from 'react';
import { cn } from '../../lib/utils';

export const Card = React.forwardRef(({ className, children, ...props }, ref) => (
  <div ref={ref} className={cn('card shadow-sm', className)} {...props}>
    {children}
  </div>
));
Card.displayName = 'Card';

export const CardHeader = ({ className, children }) => (
  <div className={cn('card-header bg-white border-bottom', className)}>
    {children}
  </div>
);

export const CardTitle = ({ className, children }) => (
  <h5 className={cn('card-title mb-0', className)}>{children}</h5>
);

export const CardDescription = ({ className, children }) => (
  <p className={cn('card-text text-muted', className)}>{children}</p>
);

export const CardContent = ({ className, children }) => (
  <div className={cn('card-body', className)}>{children}</div>
);

export const CardFooter = ({ className, children }) => (
  <div className={cn('card-footer', className)}>{children}</div>
);
