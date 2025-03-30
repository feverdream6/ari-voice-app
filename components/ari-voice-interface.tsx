"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Mic, MicOff, Loader2 } from "lucide-react"
import { MinimalistButton } from "@/components/ui/minimalist-button"
import AudioPermissionButton from "@/components/audio-permission-button"
import { useMobile } from "@/hooks/use-mobile"

export default function AriVoiceInterface() {
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([
    { role: "assistant", content: "Hi, I'm Ari. How can I help with your wellness today?" },
  ])
  const [isListening, setIsListening] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [permissionGranted, setPermissionGranted] = useState<boolean | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const isMobile = useMobile()

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Lock body scroll when listening on mobile
  useEffect(() => {
    if (isMobile) {
      if (isListening || isSpeaking || isProcessing) {
        document.body.style.overflow = "hidden"
      } else {
        document.body.style.overflow = ""
      }

      return () => {
        document.body.style.overflow = ""
      }
    }
  }, [isListening, isSpeaking, isProcessing, isMobile])

  // Ensure the container is visible when active
  useEffect(() => {
    if ((isListening || isSpeaking || isProcessing) && containerRef.current && isMobile) {
      containerRef.current.scrollIntoView({ behavior: "smooth", block: "center" })
    }
  }, [isListening, isSpeaking, isProcessing, isMobile])

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

  const handlePermissionGranted = () => {
    setPermissionGranted(true)
  }

  const handlePermissionDenied = () => {
    setPermissionGranted(false)
  }

  return (
    <div
      ref={containerRef}
      className={`w-full max-w-md mx-auto overflow-hidden shadow-xl rounded-xl ${
        (isListening || isSpeaking || isProcessing) && isMobile ? "sticky top-20 z-30" : ""
      } ${isListening ? "accent-glow" : ""}`}
    >
      <div className="p-4 border-b border-gray-800 flex items-center justify-between bg-black">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-[#121826] rounded-full flex items-center justify-center mr-3">
            <span className="text-xl" role="img" aria-label="Ari">
              🤖
            </span>
          </div>
          <span className="font-medium text-white">Ari</span>
        </div>
        <span className="text-xs text-gray-400 px-2 py-1 rounded-full bg-[#121826]">Voice Assistant</span>
      </div>

      <div className="h-64 sm:h-80 overflow-y-auto p-4 bg-black">
        <AnimatePresence>
          {messages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className={`mb-4 flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {message.role === "assistant" && (
                <div className="w-6 h-6 bg-[#121826] rounded-full flex items-center justify-center mr-2 flex-shrink-0">
                  <span className="text-xs" role="img" aria-label="Ari">
                    🤖
                  </span>
                </div>
              )}
              <div
                className={`max-w-[80%] rounded-lg px-4 py-2 ${
                  message.role === "user" ? "bg-qube-accent text-white" : "bg-[#121826] text-white"
                }`}
              >
                {message.content}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isProcessing && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex justify-start mb-4"
          >
            <div className="w-6 h-6 bg-[#121826] rounded-full flex items-center justify-center mr-2 flex-shrink-0">
              <span className="text-xs" role="img" aria-label="Ari">
                🤖
              </span>
            </div>
            <div className="bg-[#121826] rounded-lg px-4 py-2 flex items-center">
              <Loader2 className="w-4 h-4 animate-spin mr-2 text-qube-accent" aria-hidden="true" />
              <span>Ari is thinking...</span>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-gray-800 bg-black">
        <div className="flex flex-col items-center">
          {permissionGranted === false ? (
            <div className="w-full">
              <AudioPermissionButton
                onPermissionGranted={handlePermissionGranted}
                onPermissionDenied={handlePermissionDenied}
              />
            </div>
          ) : (
            <>
              <div className="relative">
                <MinimalistButton
                  variant={isListening ? "white" : "accent"}
                  size="icon"
                  animation={isListening ? "pulse" : "none"}
                  onClick={toggleListening}
                  disabled={isProcessing || isSpeaking}
                  aria-label={isListening ? "Stop listening" : "Start listening"}
                >
                  {isListening ? <MicOff className="w-6 h-6 text-black" /> : <Mic className="w-6 h-6" />}
                </MinimalistButton>

                {/* Voice waveform animation */}
                {(isListening || isSpeaking) && (
                  <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 w-32 h-6">
                    <div className="flex items-center justify-center h-6 gap-[2px]">
                      {Array.from({ length: 9 }).map((_, i) => (
                        <motion.div
                          key={i}
                          className={`w-1 rounded-full ${isListening ? "bg-white" : "bg-qube-accent"}`}
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

              <div className="mt-8 text-center">
                {isListening ? (
                  <span className="text-white">Listening... speak now</span>
                ) : isSpeaking ? (
                  <span className="text-qube-accent">Ari is speaking...</span>
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

