import type { ButtonHTMLAttributes } from 'react';
import { forwardRef } from 'react';
import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';
import type { HTMLMotionProps } from 'framer-motion';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

type MotionButtonProps = HTMLMotionProps<"button"> & ButtonProps;

export const Button = forwardRef<HTMLButtonElement, MotionButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className={cn(
          'inline-flex items-center justify-center rounded-2xl font-sans font-medium tracking-wider transition-colors duration-300',
          {
            'bg-charcoal text-beige hover:bg-charcoal-light shadow-soft': variant === 'primary',
            'bg-gold text-white hover:bg-gold-light shadow-glow': variant === 'secondary',
            'border border-charcoal/20 bg-transparent text-charcoal hover:border-charcoal/50': variant === 'outline',
            'bg-transparent text-charcoal hover:bg-charcoal/5': variant === 'ghost',
            'px-5 py-2.5 text-sm': size === 'sm',
            'px-7 py-3.5 text-base': size === 'md',
            'px-10 py-5 text-lg': size === 'lg',
          },
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';
