'use client'

import { useState, forwardRef } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { cn } from '@/lib/utils'

interface GlassInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
}

export const GlassInput = forwardRef<HTMLInputElement, GlassInputProps>(
  ({ label, error, type, className, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false)
    const [isFocused, setIsFocused] = useState(false)
    const isPassword = type === 'password'
    const inputType = isPassword && showPassword ? 'text' : type

    return (
      <div className="flex flex-col gap-1.5">
        <label
          className={cn(
            'text-[13px] font-medium tracking-wide transition-colors duration-200',
            isFocused ? 'text-primary' : 'text-muted-foreground',
            error && 'text-destructive'
          )}
        >
          {label}
        </label>
        <div
          className={cn(
            'relative flex items-center rounded-xl transition-all duration-300',
            'bg-glass-bg/60 backdrop-blur-xl',
            'border',
            isFocused
              ? 'border-primary/50 shadow-[0_0_0_3px_var(--ring),inset_0_1px_0_var(--glass-highlight)]'
              : 'border-glass-border shadow-[inset_0_1px_0_var(--glass-highlight)]',
            error && 'border-destructive/50 shadow-[0_0_0_3px_oklch(0.6_0.22_25/0.15)]'
          )}
        >
          <input
            ref={ref}
            type={inputType}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className={cn(
              'text-foreground flex-1 bg-transparent px-4 py-3 text-[15px]',
              'placeholder:text-muted-foreground/40 outline-none',
              isPassword && 'pr-11',
              className
            )}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-muted-foreground/50 hover:text-muted-foreground absolute right-3 flex items-center justify-center transition-colors"
              tabIndex={-1}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="size-[18px]" /> : <Eye className="size-[18px]" />}
            </button>
          )}
        </div>
        {error && <p className="text-destructive animate-slide-up text-[12px]">{error}</p>}
      </div>
    )
  }
)

GlassInput.displayName = 'GlassInput'
