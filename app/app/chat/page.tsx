"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { useVoiceRecognition } from "@/hooks/use-voice-recognition"
import { useSpeechSynthesis } from "@/hooks/use-speech-synthesis"
import AvatarAnimation from "@/components/avatar-animation"
import VoiceWaveform from "@/components/voice-waveform"
import { Button } from "@/components/ui/button"
import { Mic, MicOff, ArrowLeft, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

export default function ChatPage() {
  const router = useRouter()
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([])
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [micPermission, setMicPermission] = useState<boolean | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const welcomeMessageSent = useRef(false)

  // Callbacks for speech events
  const handleSpeechStart = useCallback(() => {
    setIsSpeaking(true)
  }, [])

  const handleSpeechEnd = useCallback(() => {
    setIsSpeaking(false)
    if (isListening) {
      // Small delay before starting to listen again
      setTimeout(() => {
        startListening()
      }, 500)
    }
  }, [isListening])

  const { transcript, resetTranscript, startListening, stopListening, browserSupportsSpeechRecognition } =
    useVoiceRecognition({
      onResult: (result) => {
        if (result && !isSpeaking) {
          handleUserMessage(result)
        }
      },
    })

  const { speak, cancel, speaking } = useSpeechSynthesis({
    onStart: handleSpeechStart,
    onEnd: handleSpeechEnd,
  })

  // Effect to check microphone permission and set welcome message
  useEffect(() => {
    // Check for microphone permission
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then(() => setMicPermission(true))
      .catch(() => setMicPermission(false))

    // Add welcome message
    const welcomeMessage = "Hi, I'm Ari. How can I help you today?"
    setMessages([{ role: "assistant", content: welcomeMessage }])

    return () => {
      cancel()
      stopListening()
    }
  }, [cancel, stopListening])

  // Separate effect for speaking the welcome message
  useEffect(() => {
    if (welcomeMessageSent.current) return

    const welcomeMessage = "Hi, I'm Ari. How can I help you today?"

    // Small delay before speaking to ensure speech synthesis is ready
    const timer = setTimeout(() => {
      try {
        speak(welcomeMessage)
        welcomeMessageSent.current = true
      } catch (error) {
        console.error("Error speaking welcome message:", error)
        // Try again with a longer delay if it fails
        const retryTimer = setTimeout(() => {
          try {
            speak(welcomeMessage)
            welcomeMessageSent.current = true
          } catch (retryError) {
            console.error("Retry error speaking welcome message:", retryError)
          }
        }, 2000)

        return () => clearTimeout(retryTimer)
      }
    }, 1500)

    return () => clearTimeout(timer)
  }, [speak])

  // Effect to scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Effect to sync speaking state
  useEffect(() => {
    if (speaking !== isSpeaking) {
      setIsSpeaking(speaking)
    }
  }, [speaking, isSpeaking])

  const handleUserMessage = async (message: string) => {
    if (!message.trim() || isLoading) return

    // Stop listening while processing
    stopListening()
    resetTranscript()
    setIsLoading(true)

    // Add user message
    setMessages((prev) => [...prev, { role: "user", content: message }])

    try {
      // Call API to get AI response
      const response = await fetch("/api/voice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      })

      if (!response.ok) throw new Error("Failed to get response")

      const data = await response.json()
      const aiResponse = data.message

      // Add AI message
      setMessages((prev) => [...prev, { role: "assistant", content: aiResponse }])

      // Speak the response
      speak(aiResponse)
    } catch (error) {
      console.error("Error getting AI response:", error)
      const errorMessage = "Sorry, I couldn't process your request. Please try again."
      setMessages((prev) => [...prev, { role: "assistant", content: errorMessage }])
      speak(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const toggleListening = () => {
    if (isListening) {
      stopListening()
      setIsListening(false)
    } else {
      if (!isSpeaking && !isLoading) {
        startListening()
      }
      setIsListening(true)
    }
  }

  if (!browserSupportsSpeechRecognition) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-b from-gray-900 to-black text-white">
        <h1 className="text-3xl font-bold mb-4">Browser Not Supported</h1>
        <p className="text-center max-w-md">
          Sorry, your browser doesn't support speech recognition. Please try using Chrome, Edge, or Safari.
        </p>
      </div>
    )
  }

  return (
    <main className="flex flex-col min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <header className="border-b border-gray-800 bg-gray-900/50">
        <div className="container mx-auto px-6 py-4 flex items-center">
          <Button
            variant="ghost"
            className="mr-4 text-gray-300 hover:text-white hover:bg-gray-800"
            onClick={() => router.push("/app")}
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back
          </Button>

          <h1 className="text-xl font-bold">Chat with Ari</h1>
        </div>
      </header>

      <div className="flex-1 flex flex-col items-center p-4 sm:p-8">
        <div className="w-full max-w-4xl flex flex-col items-center">
          <div className="relative w-32 h-32 mb-8">
            <AvatarAnimation
              isListening={isListening && !isSpeaking && !isLoading}
              isSpeaking={isSpeaking}
              isLoading={isLoading}
            />

            {(isListening || isSpeaking || isLoading) && (
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full">
                <VoiceWaveform
                  isListening={isListening && !isSpeaking && !isLoading}
                  isSpeaking={isSpeaking}
                  isLoading={isLoading}
                />
              </div>
            )}
          </div>

          <div className="w-full max-h-[calc(100vh-300px)] overflow-y-auto rounded-lg bg-gray-800/50 backdrop-blur-sm p-4 mb-4">
            <AnimatePresence>
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`mb-3 ${message.role === "user" ? "text-right" : "text-left"}`}
                >
                  <span
                    className={`inline-block rounded-lg px-4 py-2 ${
                      message.role === "user" ? "bg-purple-600 text-white" : "bg-gray-700 text-gray-100"
                    }`}
                  >
                    {message.content}
                  </span>
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </AnimatePresence>
          </div>

          <div className="w-full flex justify-center mt-4">
            <div className="relative">
              <Button
                onClick={toggleListening}
                disabled={micPermission === false || isLoading}
                className={`rounded-full w-16 h-16 flex items-center justify-center transition-all ${
                  isLoading
                    ? "bg-yellow-500 cursor-wait"
                    : isListening
                      ? "bg-red-500 hover:bg-red-600"
                      : "bg-purple-600 hover:bg-purple-700"
                }`}
                aria-label={isLoading ? "Processing..." : isListening ? "Stop listening" : "Start listening"}
              >
                {isLoading ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : isListening ? (
                  <MicOff className="h-6 w-6" />
                ) : (
                  <Mic className="h-6 w-6" />
                )}
              </Button>

              {transcript && isListening && !isSpeaking && !isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute top-full left-1/2 transform -translate-x-1/2 mt-4 bg-gray-800 rounded-lg px-4 py-2 text-sm text-gray-200 min-w-[200px] text-center"
                >
                  {transcript}
                </motion.div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-center mt-8 text-gray-400 text-sm">
            <div className="flex items-center mr-4">
              <div className={`w-2 h-2 rounded-full mr-2 ${micPermission ? "bg-green-500" : "bg-red-500"}`}></div>
              <span>Microphone: {micPermission ? "Enabled" : "Disabled"}</span>
            </div>
            <div className="flex items-center mr-4">
              <div className={`w-2 h-2 rounded-full mr-2 ${isSpeaking ? "bg-green-500" : "bg-gray-500"}`}></div>
              <span>Speaking: {isSpeaking ? "Yes" : "No"}</span>
            </div>
            <div className="flex items-center">
              <div className={`w-2 h-2 rounded-full mr-2 ${isLoading ? "bg-yellow-500" : "bg-gray-500"}`}></div>
              <span>API: {isLoading ? "Processing" : "Ready"}</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

