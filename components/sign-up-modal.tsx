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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MinimalistButton } from "@/components/ui/minimalist-button"

interface SignUpModalProps {
  isOpen: boolean
  onClose: () => void
  selectedPlan: string | null
  onSuccess: () => void
}

export default function SignUpModal({ isOpen, onClose, selectedPlan, onSuccess }: SignUpModalProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      // In a real app, this would be an API call to create an account
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Simulate successful signup
      console.log("User signed up:", { email, name, selectedPlan })

      // Call the success callback
      onSuccess()
    } catch (err) {
      setError("An error occurred during sign up. Please try again.")
      console.error("Signup error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-black text-white border-gray-800">
        <DialogHeader>
          <DialogTitle className="text-2xl font-medium">Create your account</DialogTitle>
          <DialogDescription className="text-gray-400">
            {selectedPlan ? `Sign up for the ${selectedPlan} plan` : "Create an account to get started with Ari"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-gray-900 border-gray-700"
                required
              />
            </div>

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

            {selectedPlan && selectedPlan !== "Free" && (
              <div className="mt-4 p-4 bg-gray-900 rounded-md">
                <h4 className="font-medium mb-2">Selected Plan: {selectedPlan}</h4>
                <p className="text-sm text-gray-400 mb-2">{selectedPlan === "Pro" ? "$20/month" : "$49/month"}</p>
                <p className="text-sm text-gray-400">
                  You'll be asked for payment details after creating your account.
                </p>
              </div>
            )}

            {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
          </div>

          <DialogFooter>
            <MinimalistButton type="button" variant="ghost" onClick={onClose} disabled={isLoading}>
              Cancel
            </MinimalistButton>
            <MinimalistButton type="submit" variant="primary" isLoading={isLoading} loadingText="Creating Account...">
              Create Account
            </MinimalistButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

