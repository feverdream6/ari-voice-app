"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

const minimalistButtonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-qube-accent focus-visible:ring-offset-2 focus-visible:ring-offset-black disabled:pointer-events-none disabled:opacity-50 select-none",
  {
    variants: {
      variant: {
        default: "bg-white text-black hover:bg-gray-100 active:bg-gray-200 shadow-sm hover:shadow-md",
        primary: "bg-qube-accent text-white hover:bg-qube-accent/90 active:bg-qube-accent/80 shadow-sm hover:shadow-md",
        secondary:
          "bg-[#121826] text-white hover:bg-[#1a2234] active:bg-[#232d42] border border-gray-800 shadow-sm hover:shadow-md",
        outline:
          "border-2 border-qube-accent bg-transparent text-qube-accent hover:bg-qube-accent/10 active:bg-qube-accent/20",
        ghost: "bg-transparent text-gray-300 hover:bg-[#121826] hover:text-white active:bg-[#1a2234]",
        link: "text-qube-accent underline-offset-4 hover:underline p-0 h-auto",
        accent: "bg-qube-accent text-white hover:bg-qube-accent/90 active:bg-qube-accent/80 shadow-sm hover:shadow-md",
        white: "bg-white text-black hover:bg-gray-100 active:bg-gray-200 shadow-sm hover:shadow-md",
        black:
          "bg-black text-white border border-gray-700 hover:bg-gray-900 active:bg-gray-800 shadow-sm hover:shadow-md",
      },
      size: {
        default: "h-10 px-4 py-2 text-sm",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-11 rounded-md px-6 text-base",
        xl: "h-12 rounded-md px-8 text-base",
        icon: "h-14 w-14 sm:h-16 sm:w-16 rounded-full", // Make microphone button larger for better touch target
      },
      fullWidth: {
        true: "w-full",
      },
      animation: {
        pulse: "animate-pulse",
        none: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      fullWidth: false,
      animation: "none",
    },
  },
)

export interface MinimalistButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof minimalistButtonVariants> {
  isLoading?: boolean
  loadingText?: string
  icon?: React.ReactNode
  iconPosition?: "left" | "right"
  animation?: "pulse" | "none"
}

const MinimalistButton = React.forwardRef<HTMLButtonElement, MinimalistButtonProps>(
  (
    {
      className,
      variant,
      size,
      fullWidth,
      animation,
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
        <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
        <span>{loadingText || children}</span>
      </>
    ) : (
      <>
        {icon && iconPosition === "left" && (
          <span className="mr-2" aria-hidden="true">
            {icon}
          </span>
        )}
        <span>{children}</span>
        {icon && iconPosition === "right" && (
          <span className="ml-2" aria-hidden="true">
            {icon}
          </span>
        )}
      </>
    )

    return (
      <button
        className={cn(minimalistButtonVariants({ variant, size, fullWidth, animation, className }))}
        disabled={isLoading || props.disabled}
        ref={ref}
        aria-busy={isLoading}
        {...props}
      >
        {/* Ripple effect container */}
        <span
          className="absolute inset-0 overflow-hidden rounded-md pointer-events-none ripple-container"
          aria-hidden="true"
        />

        {/* Button content */}
        <span className="relative z-10 flex items-center justify-center">{content}</span>
      </button>
    )
  },
)
MinimalistButton.displayName = "MinimalistButton"

export { MinimalistButton, minimalistButtonVariants }

