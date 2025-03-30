"use client"

import { useState, useEffect, useCallback, useRef } from "react"

interface UseVoiceRecognitionProps {
  onResult?: (result: string) => void
  continuous?: boolean
  interimResults?: boolean
  lang?: string
}

// Declare SpeechRecognition interface
declare global {
  interface Window {
    SpeechRecognition: any
    webkitSpeechRecognition: any
  }
  interface SpeechRecognition extends EventTarget {
    continuous: boolean
    interimResults: boolean
    lang: string
    onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null
    onend: ((this: SpeechRecognition, ev: Event) => any) | null
    onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null
    start: () => void
    stop: () => void
    abort: () => void
  }

  interface SpeechRecognitionEvent extends Event {
    results: SpeechRecognitionResultList
    resultIndex: number
  }

  interface SpeechRecognitionResultList {
    [index: number]: SpeechRecognitionResult
    length: number
  }

  interface SpeechRecognitionResult {
    [index: number]: SpeechRecognitionAlternative
    isFinal: boolean
  }

  interface SpeechRecognitionAlternative {
    transcript: string
    confidence: number
  }

  interface SpeechRecognitionErrorEvent extends Event {
    error: SpeechRecognitionErrorCode
  }

  type SpeechRecognitionErrorCode =
    | "no-speech"
    | "aborted"
    | "audio-capture"
    | "network"
    | "not-allowed"
    | "service-not-allowed"
    | "bad-grammar"
    | "language-not-supported"
}

export function useVoiceRecognition({
  onResult,
  continuous = false,
  interimResults = true,
  lang = "en-US",
}: UseVoiceRecognitionProps = {}) {
  const [transcript, setTranscript] = useState("")
  const [isListening, setIsListening] = useState(false)
  const [browserSupportsSpeechRecognition, setBrowserSupportsSpeechRecognition] = useState(true)
  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const isListeningRef = useRef(isListening)

  // Keep the ref in sync with the state
  useEffect(() => {
    isListeningRef.current = isListening
  }, [isListening])

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Check browser support
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

      if (!SpeechRecognition) {
        console.error("Speech recognition not supported in this browser")
        setBrowserSupportsSpeechRecognition(false)
        return
      }

      // Initialize recognition
      const recognitionInstance = new SpeechRecognition()
      recognitionInstance.continuous = continuous
      recognitionInstance.interimResults = interimResults
      recognitionInstance.lang = lang

      // Set up event handlers
      recognitionInstance.onresult = (event) => {
        let interimTranscript = ""
        let finalTranscript = ""

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript

          if (event.results[i].isFinal) {
            finalTranscript += transcript
          } else {
            interimTranscript += transcript
          }
        }

        const currentTranscript = finalTranscript || interimTranscript
        setTranscript(currentTranscript)

        if (finalTranscript && onResult) {
          onResult(finalTranscript)
        }
      }

      recognitionInstance.onerror = (event) => {
        console.error("Speech recognition error", event.error)
        if (event.error === "not-allowed") {
          console.error("Microphone permission denied")
        }
        setIsListening(false)
      }

      recognitionInstance.onend = () => {
        if (isListeningRef.current) {
          // Restart if we're supposed to be listening
          try {
            recognitionInstance.start()
          } catch (e) {
            console.warn("Error restarting speech recognition:", e)
            setIsListening(false)
          }
        } else {
          setIsListening(false)
        }
      }

      recognitionRef.current = recognitionInstance
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.onresult = null
          recognitionRef.current.onend = null
          recognitionRef.current.onerror = null

          if (isListeningRef.current) {
            recognitionRef.current.abort()
          }
        } catch (e) {
          console.warn("Error cleaning up speech recognition:", e)
        }
      }
    }
  }, [continuous, interimResults, lang, onResult])

  const startListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.start()
        setIsListening(true)
      } catch (error) {
        console.error("Error starting speech recognition:", error)
      }
    }
  }, [])

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop()
        setIsListening(false)
      } catch (error) {
        console.error("Error stopping speech recognition:", error)
      }
    }
  }, [])

  const resetTranscript = useCallback(() => {
    setTranscript("")
  }, [])

  return {
    transcript,
    isListening,
    startListening,
    stopListening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  }
}

