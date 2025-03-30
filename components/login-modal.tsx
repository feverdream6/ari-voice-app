"use client"

import type React from "react"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MinimalistButton } from "@/components/ui/minimalist-button"

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  onSignUp: () => void
}

export default function LoginModal({ isOpen, onClose, onSuccess, onSignUp }: LoginModalProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      // In a real app, this would be an API call to authenticate
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Simulate successful login
      console.log("User logged in:", { email })

      // Call the success callback
      onSuccess()
    } catch (err) {
      setError("Invalid email or password. Please try again.")
      console.error("Login error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-black text-white border-gray-800">
        <DialogHeader>
          <DialogTitle className="text-2xl font-medium">Sign In</DialogTitle>
          <DialogDescription className="text-gray-400">Sign in to your Ari account</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-gray-900 border-gray-700"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-gray-900 border-gray-700"
                required
              />
            </div>

            <Button type="button" variant="link" className="text-purple-400 justify-start p-0 h-auto">
              Forgot password?
            </Button>

            {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
          </div>

          <DialogFooter className="flex-col sm:flex-col gap-2">
            <MinimalistButton
              type="submit"
              variant="primary"
              fullWidth={true}
              isLoading={isLoading}
              loadingText="Signing In..."
            >
              Sign In
            </MinimalistButton>

            <div className="text-center mt-4">
              <span className="text-gray-400">Don't have an account?</span>{" "}
              <Button type="button" variant="link" className="text-purple-400 p-0" onClick={onSignUp}>
                Sign up
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

