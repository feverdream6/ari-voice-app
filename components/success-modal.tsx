"use client"

import { CheckCircle } from "lucide-react"
import { MinimalistButton } from "@/components/ui/minimalist-button"

interface SuccessModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  message: string
  actionLabel?: string
  onAction?: () => void
}

export default function SuccessModal({
  isOpen,
  onClose,
  title,
  message,
  actionLabel = "Continue",
  onAction,
}: SuccessModalProps) {
  if (!isOpen) return null

  // Add the trackButtonClick function
  const trackButtonClick = (buttonName: string) => {
    console.log(`Button clicked: ${buttonName}`)
    // In a real app, this would send analytics data
  }

  // Update the action handler
  const handleAction = () => {
    trackButtonClick(`Success Modal Action: ${actionLabel}`)
    onClose()
    if (onAction) onAction()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-[#121826] rounded-xl p-6 shadow-xl">
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-qube-accent/20 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-qube-accent" />
          </div>

          <h2 className="text-2xl font-medium mb-2">{title}</h2>
          <p className="text-gray-400 mb-6">{message}</p>

          <MinimalistButton variant="accent" onClick={handleAction}>
            {actionLabel}
          </MinimalistButton>
        </div>
      </div>
    </div>
  )
}

