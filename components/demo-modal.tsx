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
import AvatarAnimation from "./avatar-animation"
import { MinimalistButton } from "@/components/ui/minimalist-button"

interface DemoModalProps {
  isOpen: boolean
  onClose: () => void
  onTryFree: () => void
}

export default function DemoModal({ isOpen, onClose, onTryFree }: DemoModalProps) {
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [company, setCompany] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      // In a real app, this would be an API call to schedule a demo
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Simulate successful submission
      console.log("Demo requested:", { email, name, company })

      // Show success message
      setIsSubmitted(true)
    } catch (err) {
      setError("An error occurred. Please try again.")
      console.error("Demo request error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setIsSubmitted(false)
    setEmail("")
    setName("")
    setCompany("")
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={isSubmitted ? resetForm : onClose}>
      <DialogContent className="sm:max-w-[500px] bg-black text-white border-gray-800">
        {!isSubmitted ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl font-medium">Schedule a Demo</DialogTitle>
              <DialogDescription className="text-gray-400">
                See Ari in action with a personalized demo from our team
              </DialogDescription>
            </DialogHeader>

            <div className="flex items-center justify-center py-4">
              <div className="w-24 h-24">
                <AvatarAnimation isListening={false} isSpeaking={false} />
              </div>
            </div>

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
                  <Label htmlFor="email">Work Email</Label>
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
                  <Label htmlFor="company">Company</Label>
                  <Input
                    id="company"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="bg-gray-900 border-gray-700"
                    required
                  />
                </div>

                {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
              </div>

              <DialogFooter>
                <MinimalistButton type="button" variant="ghost" onClick={onClose} disabled={isLoading}>
                  Cancel
                </MinimalistButton>
                <MinimalistButton type="submit" variant="primary" isLoading={isLoading} loadingText="Submitting...">
                  Request Demo
                </MinimalistButton>
              </DialogFooter>
            </form>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl text-center font-medium">Demo Request Submitted!</DialogTitle>
            </DialogHeader>

            <div className="flex flex-col items-center justify-center py-8">
              <div className="w-24 h-24 mb-6">
                <AvatarAnimation isListening={false} isSpeaking={true} />
              </div>

              <p className="text-center text-gray-300 mb-6">
                Thank you for your interest in Ari! Our team will contact you within 24 hours to schedule your
                personalized demo.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 w-full">
                <MinimalistButton onClick={resetForm} variant="ghost" className="flex-1">
                  Close
                </MinimalistButton>
                <MinimalistButton onClick={onTryFree} variant="primary" className="flex-1">
                  Try Ari for Free
                </MinimalistButton>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

