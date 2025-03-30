"use client"

import { useState } from "react"
import { X, AlertTriangle } from "lucide-react"

interface WorkInProgressBannerProps {
  dismissable?: boolean
}

export default function WorkInProgressBanner({ dismissable = true }: WorkInProgressBannerProps) {
  const [isDismissed, setIsDismissed] = useState(false)

  if (isDismissed) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-qube-accent text-white py-2 px-4 flex items-center justify-center">
      <div className="container mx-auto flex items-center justify-center">
        <AlertTriangle className="w-5 h-5 mr-2 flex-shrink-0" aria-hidden="true" />
        <p className="text-sm font-medium">Work in Progress - Please Do Not Share</p>
        {dismissable && (
          <button
            onClick={() => setIsDismissed(true)}
            className="ml-4 text-white hover:text-white/80 focus-ring rounded-full p-1"
            aria-label="Dismiss banner"
          >
            <X size={16} />
          </button>
        )}
      </div>
    </div>
  )
}

