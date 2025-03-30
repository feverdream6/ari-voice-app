"use client"

import { useState } from "react"
import { X, AlertTriangle } from "lucide-react"
import { MinimalistButton } from "@/components/ui/minimalist-button"

export default function WorkInProgressOverlay() {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="bg-[#121826] rounded-xl p-8 max-w-md text-center relative">
        <button
          onClick={() => setIsVisible(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-white focus-ring rounded-full p-1"
          aria-label="Close overlay"
        >
          <X size={20} />
        </button>

        <div className="w-16 h-16 bg-qube-accent/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-8 h-8 text-qube-accent" />
        </div>

        <h2 className="text-2xl font-medium mb-4">Work in Progress</h2>
        <p className="text-gray-300 mb-6">
          This is a development version of the Qube landing page. All features are being tested and may not represent
          the final product.
        </p>
        <p className="text-qube-accent font-medium mb-6">Please Do Not Share</p>

        <MinimalistButton variant="accent" onClick={() => setIsVisible(false)}>
          I Understand
        </MinimalistButton>
      </div>
    </div>
  )
}

