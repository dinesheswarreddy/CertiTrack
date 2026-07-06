import React from 'react';
import { cn } from '../../lib/utils';

export const Badge = ({ variant = 'primary', className, children, ...props }) => {
  return (
    <span className={cn(`badge bg-${variant}`, className)} {...props}>
      {children}
    </span>
  );
};
