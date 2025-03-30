"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { Send, Mic, MicOff, Loader2 } from "lucide-react"
import { MinimalistButton } from "@/components/ui/minimalist-button"

export default function AriChat() {
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([
    { role: "assistant", content: "Hi, I'm Ari. How can I help with your wellness today?" },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Focus input on load
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return

    // Add user message
    setMessages((prev) => [...prev, { role: "user", content: input }])
    setInput("")
    setIsLoading(true)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Sample responses based on keywords
    let response = "I'm here to help with your wellness journey. Could you tell me more about your goals?"

    const lowerInput = input.toLowerCase()

    if (lowerInput.includes("workout") || lowerInput.includes("exercise")) {
      response =
        "I can help you create a personalized workout plan. What's your current fitness level and what equipment do you have access to?"
    } else if (lowerInput.includes("stress") || lowerInput.includes("anxiety")) {
      response =
        "I understand managing stress can be challenging. Would you like to try a quick breathing exercise or meditation to help you relax?"
    } else if (lowerInput.includes("sleep") || lowerInput.includes("tired")) {
      response =
        "Quality sleep is essential for wellness. I can suggest a bedtime routine and help track your sleep patterns to improve your rest."
    } else if (lowerInput.includes("diet") || lowerInput.includes("nutrition") || lowerInput.includes("eat")) {
      response =
        "Nutrition is a key part of wellness. I can help you create balanced meal plans based on your dietary preferences and goals."
    }

    // Add assistant response
    setMessages((prev) => [...prev, { role: "assistant", content: response }])
    setIsLoading(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const toggleListening = () => {
    setIsListening(!isListening)

    if (!isListening) {
      // Simulate voice recognition after 2 seconds
      setTimeout(() => {
        setInput("I want to improve my sleep quality")
        setIsListening(false)
      }, 2000)
    }
  }

  return (
    <div className="bg-gray-900 rounded-md border border-gray-800 overflow-hidden">
      <div className="p-4 border-b border-gray-800 flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center mr-3">
            <span className="text-white font-medium">A</span>
          </div>
          <span className="font-medium">Ari Chat</span>
        </div>
        <span className="text-xs text-gray-400">Free Version</span>
      </div>

      <div className="h-80 overflow-y-auto p-4">
        {messages.map((message, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`mb-4 flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] rounded-lg px-4 py-2 ${
                message.role === "user" ? "bg-purple-600 text-white" : "bg-gray-800 text-gray-100"
              }`}
            >
              {message.content}
            </div>
          </motion.div>
        ))}

        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start mb-4"
          >
            <div className="bg-gray-800 rounded-lg px-4 py-2 flex items-center">
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              <span>Ari is thinking...</span>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about fitness, nutrition, sleep, or stress management..."
            className="flex-1 bg-gray-800 border border-gray-700 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
            disabled={isLoading}
          />
          <MinimalistButton
            variant="ghost"
            size="icon"
            onClick={toggleListening}
            className="ml-2"
            aria-label={isListening ? "Stop listening" : "Start listening"}
          >
            {isListening ? <MicOff className="w-5 h-5 text-red-500" /> : <Mic className="w-5 h-5" />}
          </MinimalistButton>
          <MinimalistButton
            variant="primary"
            size="icon"
            onClick={handleSendMessage}
            disabled={!input.trim() || isLoading}
            className="ml-2"
            aria-label="Send message"
          >
            <Send className="w-5 h-5" />
          </MinimalistButton>
        </div>
        <div className="mt-2 text-xs text-gray-400 text-center">
          {isListening ? (
            <span className="text-purple-400">Listening... speak now</span>
          ) : (
            <span>Try asking: "How can I improve my sleep quality?"</span>
          )}
        </div>
      </div>
    </div>
  )
}

