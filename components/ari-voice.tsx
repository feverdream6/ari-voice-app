"use client"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { Mic, MicOff, Loader2 } from "lucide-react"
import { MinimalistButton } from "@/components/ui/minimalist-button"

export default function AriVoice() {
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([
    { role: "assistant", content: "Hi, I'm Ari. How can I help with your wellness today?" },
  ])
  const [isListening, setIsListening] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [permissionGranted, setPermissionGranted] = useState<boolean | null>(null)

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Check for microphone permission
  useEffect(() => {
    const checkMicPermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        stream.getTracks().forEach((track) => track.stop())
        setPermissionGranted(true)
      } catch (err) {
        console.log("Microphone permission not granted:", err)
        setPermissionGranted(false)
      }
    }

    checkMicPermission()
  }, [])

  const handleVoiceCommand = async (command: string) => {
    if (!command.trim() || isProcessing) return

    // Add user message
    setMessages((prev) => [...prev, { role: "user", content: command }])
    setIsProcessing(true)
    setIsListening(false)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Sample responses based on keywords
    let response = "I'm here to help with your wellness journey. Could you tell me more about your goals?"

    const lowerCommand = command.toLowerCase()

    if (lowerCommand.includes("workout") || lowerCommand.includes("exercise")) {
      response =
        "I can help you create a personalized workout plan. What's your current fitness level and what equipment do you have access to?"
    } else if (lowerCommand.includes("stress") || lowerCommand.includes("anxiety")) {
      response =
        "I understand managing stress can be challenging. Would you like to try a quick breathing exercise or meditation to help you relax?"
    } else if (lowerCommand.includes("sleep") || lowerCommand.includes("tired")) {
      response =
        "Quality sleep is essential for wellness. I can suggest a bedtime routine and help track your sleep patterns to improve your rest."
    } else if (lowerCommand.includes("diet") || lowerCommand.includes("nutrition") || lowerCommand.includes("eat")) {
      response =
        "Nutrition is a key part of wellness. I can help you create balanced meal plans based on your dietary preferences and goals."
    }

    // Add assistant response
    setMessages((prev) => [...prev, { role: "assistant", content: response }])
    setIsProcessing(false)

    // Simulate voice speaking
    setIsSpeaking(true)
    await new Promise((resolve) => setTimeout(resolve, 3000))
    setIsSpeaking(false)
  }

  const toggleListening = () => {
    if (isListening) {
      setIsListening(false)
    } else {
      setIsListening(true)

      // Simulate voice recognition after 2 seconds
      setTimeout(() => {
        handleVoiceCommand("I want to improve my sleep quality")
      }, 2000)
    }
  }

  const requestMicrophonePermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      stream.getTracks().forEach((track) => track.stop())
      setPermissionGranted(true)
    } catch (err) {
      console.log("Failed to get microphone permission:", err)
      setPermissionGranted(false)
    }
  }

  return (
    <div className="bg-gray-900 rounded-md border border-gray-800 overflow-hidden">
      <div className="p-4 border-b border-gray-800 flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center mr-3">
            <span className="text-black font-medium">A</span>
          </div>
          <span className="font-medium">Ari Voice</span>
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
                message.role === "user" ? "bg-white text-black" : "bg-gray-800 text-gray-100"
              }`}
            >
              {message.content}
            </div>
          </motion.div>
        ))}

        {isProcessing && (
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
        <div className="flex flex-col items-center">
          {permissionGranted === false ? (
            <div className="text-center mb-4">
              <p className="text-sm text-gray-400 mb-2">Microphone access is needed for voice interaction</p>
              <MinimalistButton variant="primary" onClick={requestMicrophonePermission}>
                Allow Microphone Access
              </MinimalistButton>
            </div>
          ) : (
            <>
              <div className="relative">
                <MinimalistButton
                  variant={isListening ? "primary" : "secondary"}
                  size="icon"
                  className={`w-16 h-16 rounded-full ${isListening ? "bg-white text-black hover:bg-gray-200" : ""}`}
                  onClick={toggleListening}
                  disabled={isProcessing || isSpeaking}
                  aria-label={isListening ? "Stop listening" : "Start listening"}
                >
                  {isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                </MinimalistButton>

                {/* Voice waveform animation */}
                {(isListening || isSpeaking) && (
                  <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 w-32">
                    <div className="flex items-center justify-center h-6 gap-[2px]">
                      {Array.from({ length: 9 }).map((_, i) => (
                        <motion.div
                          key={i}
                          className={`w-1 rounded-full ${isListening ? "bg-white" : "bg-gray-400"}`}
                          animate={{
                            height: [4, Math.random() * 12 + 4, 4],
                          }}
                          transition={{
                            duration: 0.8,
                            repeat: Number.POSITIVE_INFINITY,
                            repeatType: "reverse",
                            delay: i * 0.05,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-6 text-center">
                {isListening ? (
                  <span className="text-white">Listening... speak now</span>
                ) : isSpeaking ? (
                  <span className="text-white">Ari is speaking...</span>
                ) : (
                  <span className="text-gray-400">Say "Hey Ari" or tap the microphone</span>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

