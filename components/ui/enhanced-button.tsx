"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const enhancedButtonVariants = cva(
  "relative overflow-hidden transition-all duration-300 active:scale-[0.98] active:duration-100",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-md hover:shadow-lg",
        outline:
          "border-2 border-purple-500 text-purple-400 hover:bg-purple-500/10 hover:text-purple-300 hover:border-purple-400",
        ghost: "hover:bg-gray-800/50 text-gray-300 hover:text-white",
        secondary: "bg-gray-800 hover:bg-gray-700 text-white shadow-md hover:shadow-lg",
        link: "text-purple-400 underline-offset-4 hover:underline hover:text-purple-300",
        destructive: "bg-red-600 hover:bg-red-700 text-white shadow-md hover:shadow-lg",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3 text-sm",
        lg: "h-12 rounded-md px-8 text-lg",
        icon: "h-10 w-10",
        hero: "h-14 px-8 py-4 text-lg rounded-md",
      },
      fullWidth: {
        true: "w-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      fullWidth: false,
    },
  },
)

export interface EnhancedButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof enhancedButtonVariants> {
  isLoading?: boolean
  loadingText?: string
  icon?: React.ReactNode
  iconPosition?: "left" | "right"
}

const EnhancedButton = React.forwardRef<HTMLButtonElement, EnhancedButtonProps>(
  (
    {
      className,
      variant,
      size,
      fullWidth,
      isLoading = false,
      loadingText,
      icon,
      iconPosition = "left",
      children,
      ...props
    },
    ref,
  ) => {
    // Determine what to display based on loading state
    const content = isLoading ? (
      <>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        {loadingText || children}
      </>
    ) : (
      <>
        {icon && iconPosition === "left" && <span className="mr-2">{icon}</span>}
        {children}
        {icon && iconPosition === "right" && <span className="ml-2">{icon}</span>}
      </>
    )

    return (
      <Button
        className={cn(enhancedButtonVariants({ variant, size, fullWidth, className }))}
        disabled={isLoading || props.disabled}
        ref={ref}
        {...props}
      >
        {/* Ripple effect overlay */}
        <span className="absolute inset-0 overflow-hidden rounded-md pointer-events-none ripple-container" />

        {/* Button content */}
        <span className="relative z-10 flex items-center justify-center">{content}</span>
      </Button>
    )
  },
)
EnhancedButton.displayName = "EnhancedButton"

export { EnhancedButton }

