"use client"

import { X } from "lucide-react"
import { MinimalistButton } from "@/components/ui/minimalist-button"

interface DemoVideoModalProps {
  isOpen: boolean
  onClose: () => void
  onTryFree: () => void
}

export default function DemoVideoModal({ isOpen, onClose, onTryFree }: DemoVideoModalProps) {
  if (!isOpen) return null

  // Add the trackButtonClick function
  const trackButtonClick = (buttonName: string) => {
    console.log(`Button clicked: ${buttonName}`)
    // In a real app, this would send analytics data
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl bg-[#121826] rounded-xl shadow-xl overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white bg-black/50 hover:bg-black/70 focus-ring rounded-full p-1 z-10"
          aria-label="Close demo video"
        >
          <X size={20} />
        </button>

        <div className="aspect-video bg-black">
          {/* In a real app, this would be a video player */}
          <div className="w-full h-full flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-[#1a2234] rounded-full flex items-center justify-center mb-4">
              <span className="text-4xl" role="img" aria-label="Ari">
                🤖
              </span>
            </div>
            <h3 className="text-xl font-medium mb-2">Ari Demo Video</h3>
            <p className="text-gray-400 mb-4 text-center max-w-md px-4">
              See how Ari can transform your wellness journey with voice-guided assistance.
            </p>

            {/* Simulated video controls */}
            <div className="flex space-x-4 mt-4">
              <div className="w-12 h-12 bg-qube-accent rounded-full flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polygon points="5 3 19 12 5 21 5 3"></polygon>
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <MinimalistButton
              variant="ghost"
              onClick={() => {
                trackButtonClick("Close Demo")
                onClose()
              }}
            >
              Close
            </MinimalistButton>
            <MinimalistButton
              variant="accent"
              onClick={() => {
                trackButtonClick("Try Ari Free - From Demo")
                onTryFree()
              }}
            >
              Try Ari Free
            </MinimalistButton>
          </div>
        </div>
      </div>
    </div>
  )
}

