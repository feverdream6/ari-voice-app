"use client"

import type React from "react"

import { useState } from "react"
import { X } from "lucide-react"
import { MinimalistButton } from "@/components/ui/minimalist-button"

interface SignInModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  onRegister: () => void
}

export default function SignInModal({ isOpen, onClose, onSuccess, onRegister }: SignInModalProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!isOpen) return null

  // Add the trackButtonClick function
  const trackButtonClick = (buttonName: string) => {
    console.log(`Button clicked: ${buttonName}`)
    // In a real app, this would send analytics data
  }

  // Update the form submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    trackButtonClick("Sign In Submit")
    setError(null)

    if (!email || !password) {
      setError("Please enter both email and password")
      return
    }

    setIsLoading(true)

    try {
      // In a real app, this would call an authentication API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Simulate successful login
      console.log("User signed in:", email)
      onSuccess()
    } catch (err) {
      setError("Invalid email or password. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-[#121826] rounded-xl p-6 shadow-xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white focus-ring rounded-full p-1"
          aria-label="Close sign in modal"
        >
          <X size={20} />
        </button>

        <h2 className="text-2xl font-medium mb-6">Sign In</h2>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 bg-[#1a2234] border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-qube-accent"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 bg-[#1a2234] border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-qube-accent"
                placeholder="••••••••"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  className="h-4 w-4 bg-[#1a2234] border border-gray-700 rounded focus:ring-qube-accent"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-300">
                  Remember me
                </label>
              </div>

              <button
                type="button"
                className="text-sm text-qube-accent hover:text-qube-accent/80 focus-ring rounded px-2 py-1"
              >
                Forgot password?
              </button>
            </div>

            {error && <div className="text-red-500 text-sm bg-red-500/10 p-2 rounded">{error}</div>}

            <div className="pt-2">
              <MinimalistButton
                type="submit"
                variant="accent"
                fullWidth={true}
                isLoading={isLoading}
                loadingText="Signing in..."
              >
                Sign In
              </MinimalistButton>
            </div>
          </div>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-400">
            Don't have an account?{" "}
            <button
              type="button"
              onClick={() => {
                trackButtonClick("Register Now")
                onRegister()
              }}
              className="text-qube-accent hover:text-qube-accent/80 focus-ring rounded px-2 py-1"
            >
              Register now
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

