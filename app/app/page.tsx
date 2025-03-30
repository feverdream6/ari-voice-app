"use client"

import { useEffect, useState } from "react"
import AvatarAnimation from "@/components/avatar-animation"
import { useRouter } from "next/navigation"
import { MinimalistButton } from "@/components/ui/minimalist-button"

export default function AppPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  // Simulate loading the app
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  const handleSignOut = () => {
    // In a real app, this would call an API to sign out
    router.push("/")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
        <div className="w-24 h-24 mb-8">
          <AvatarAnimation isListening={false} isSpeaking={false} isLoading={true} />
        </div>
        <h1 className="text-2xl font-medium mb-4">Loading Ari...</h1>
        <p className="text-gray-400">Preparing your experience</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="border-b border-gray-800">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-8 h-8 mr-2">
              <AvatarAnimation isListening={false} isSpeaking={false} />
            </div>
            <span className="text-xl font-medium text-white">Ari</span>
          </div>

          <MinimalistButton variant="ghost" onClick={handleSignOut}>
            Sign Out
          </MinimalistButton>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-medium mb-4">Welcome to Ari</h1>
            <p className="text-xl text-gray-400">Your digital thought partner is ready to assist you</p>
          </div>

          <div className="flex flex-col items-center justify-center mb-12">
            <div className="w-40 h-40 mb-8">
              <AvatarAnimation isListening={false} isSpeaking={true} />
            </div>

            <MinimalistButton variant="primary" size="xl" onClick={() => router.push("/app/chat")}>
              Start Conversation
            </MinimalistButton>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-900 rounded-md p-6 border border-gray-800">
              <h2 className="text-xl font-medium mb-4">Quick Start Guide</h2>
              <ul className="space-y-2 text-gray-300">
                <li>• Click "Start Conversation" to begin talking with Ari</li>
                <li>• Use the microphone button to speak your questions</li>
                <li>• Try asking Ari about any topic you're curious about</li>
                <li>• Explore the settings to customize your experience</li>
              </ul>
            </div>

            <div className="bg-gray-900 rounded-md p-6 border border-gray-800">
              <h2 className="text-xl font-medium mb-4">What's New</h2>
              <ul className="space-y-2 text-gray-300">
                <li>• Enhanced voice recognition for better accuracy</li>
                <li>• New knowledge domains for more comprehensive answers</li>
                <li>• Improved response time for faster interactions</li>
                <li>• Mobile app now available for Pro and Premium users</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

