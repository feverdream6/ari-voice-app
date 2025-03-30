"use client"

import type React from "react"

import { useState } from "react"
import { X, Check, CreditCard, Calendar } from "lucide-react"
import { MinimalistButton } from "@/components/ui/minimalist-button"

interface SubscriptionModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  selectedPlan: string
}

export default function SubscriptionModal({ isOpen, onClose, onSuccess, selectedPlan }: SubscriptionModalProps) {
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    cardNumber: "",
    expiry: "",
    cvc: "",
  })
  const [error, setError] = useState<string | null>(null)

  if (!isOpen) return null

  const planDetails = {
    Free: { price: "$0", period: "forever", features: ["Basic access", "Web only", "Standard response time"] },
    Pro: {
      price: "$20",
      period: "per month",
      features: ["Advanced voice recognition", "Multi-device access", "Priority response"],
    },
    Premium: {
      price: "$49",
      period: "per month",
      features: ["Everything in Pro", "Family access (5 users)", "Household integration"],
    },
  }

  const plan = planDetails[selectedPlan as keyof typeof planDetails]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Add the trackButtonClick function
  const trackButtonClick = (buttonName: string) => {
    console.log(`Button clicked: ${buttonName}`)
    // In a real app, this would send analytics data
  }

  // Update the form submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    trackButtonClick(`Subscription Form Step ${step}`)
    setError(null)

    // Basic validation
    if (selectedPlan !== "Free" && step === 2) {
      if (!formData.cardNumber || !formData.expiry || !formData.cvc) {
        setError("Please fill in all payment details")
        return
      }
    }

    if (step === 1) {
      if (!formData.name || !formData.email) {
        setError("Please fill in all required fields")
        return
      }
      setStep(2)
      return
    }

    setIsLoading(true)

    try {
      // In a real app, this would call a subscription API
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Simulate successful subscription
      console.log("User subscribed to:", selectedPlan, formData)
      onSuccess()
    } catch (err) {
      setError("There was an error processing your subscription. Please try again.")
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
          aria-label="Close subscription modal"
        >
          <X size={20} />
        </button>

        <h2 className="text-2xl font-medium mb-2">Subscribe to {selectedPlan}</h2>
        <p className="text-gray-400 mb-6">
          {plan.price} {plan.period}
        </p>

        <div className="mb-6 bg-[#1a2234] rounded-lg p-4">
          <h3 className="text-sm font-medium mb-2">Plan includes:</h3>
          <ul className="space-y-2">
            {plan.features.map((feature, index) => (
              <li key={index} className="flex items-start text-sm">
                <Check className="w-4 h-4 text-qube-accent mr-2 flex-shrink-0 mt-0.5" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        <form onSubmit={handleSubmit}>
          {step === 1 ? (
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-[#1a2234] border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-qube-accent"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-[#1a2234] border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-qube-accent"
                  placeholder="you@example.com"
                />
              </div>
            </div>
          ) : (
            selectedPlan !== "Free" && (
              <div className="space-y-4">
                <div>
                  <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-300 mb-1">
                    Card Number
                  </label>
                  <div className="relative">
                    <input
                      id="cardNumber"
                      name="cardNumber"
                      type="text"
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-3 py-2 bg-[#1a2234] border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-qube-accent"
                      placeholder="4242 4242 4242 4242"
                    />
                    <CreditCard className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="expiry" className="block text-sm font-medium text-gray-300 mb-1">
                      Expiry Date
                    </label>
                    <div className="relative">
                      <input
                        id="expiry"
                        name="expiry"
                        type="text"
                        value={formData.expiry}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-3 py-2 bg-[#1a2234] border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-qube-accent"
                        placeholder="MM/YY"
                      />
                      <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="cvc" className="block text-sm font-medium text-gray-300 mb-1">
                      CVC
                    </label>
                    <input
                      id="cvc"
                      name="cvc"
                      type="text"
                      value={formData.cvc}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-[#1a2234] border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-qube-accent"
                      placeholder="123"
                    />
                  </div>
                </div>
              </div>
            )
          )}

          {error && <div className="mt-4 text-red-500 text-sm bg-red-500/10 p-2 rounded">{error}</div>}

          <div className="mt-6 flex space-x-4">
            {step === 2 && (
              <MinimalistButton type="button" variant="ghost" onClick={() => setStep(1)}>
                Back
              </MinimalistButton>
            )}

            <MinimalistButton
              type="submit"
              variant="accent"
              fullWidth={true}
              isLoading={isLoading}
              loadingText={step === 1 ? "Next" : "Subscribe"}
            >
              {step === 1 ? "Next" : selectedPlan === "Free" ? "Start Free Plan" : "Subscribe"}
            </MinimalistButton>
          </div>
        </form>

        {selectedPlan !== "Free" && (
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-400">Your subscription will begin immediately. You can cancel anytime.</p>
          </div>
        )}
      </div>
    </div>
  )
}

