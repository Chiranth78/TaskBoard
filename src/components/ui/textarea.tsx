
import * as React from 'react';

import {cn} from '@/lib/utils';

const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<'textarea'>>(
  ({className, ...props}, ref) => {
    return (
      <textarea
        className={cn(
          // Base styles, allow flexible height, remove default ring on focus
          'flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
          // Removed md:text-sm (use text-sm always or as needed via className)
          // Removed focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 to allow custom focus styles
          className // Allows overriding defaults, e.g., border-none, bg-transparent
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = 'Textarea';

export {Textarea};
