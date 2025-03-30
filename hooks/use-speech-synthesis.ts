"use client"

import { useState, useEffect, useCallback, useRef } from "react"

interface UseSpeechSynthesisProps {
  onStart?: () => void
  onEnd?: () => void
  onError?: (error: any) => void
  voice?: SpeechSynthesisVoice | null
  rate?: number
  pitch?: number
  volume?: number
}

export function useSpeechSynthesis({
  onStart,
  onEnd,
  onError,
  voice = null,
  rate = 1,
  pitch = 1,
  volume = 1,
}: UseSpeechSynthesisProps = {}) {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])
  const [speaking, setSpeaking] = useState(false)
  const [supported, setSupported] = useState(true)
  const [initialized, setInitialized] = useState(false)
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)
  const synth = useRef<SpeechSynthesis | null>(null)

  // Initialize speech synthesis only once
  useEffect(() => {
    if (typeof window === "undefined") {
      setSupported(false)
      return
    }

    if (!("speechSynthesis" in window)) {
      setSupported(false)
      return
    }

    synth.current = window.speechSynthesis

    // Load voices
    const loadVoices = () => {
      const availableVoices = synth.current?.getVoices() || []
      setVoices(availableVoices)
      setInitialized(true)
    }

    loadVoices()

    // Chrome loads voices asynchronously
    if (synth.current.onvoiceschanged !== undefined) {
      synth.current.onvoiceschanged = loadVoices
    }

    return () => {
      try {
        if (synth.current) {
          synth.current.cancel()
        }
      } catch (e) {
        console.warn("Error canceling speech synthesis on cleanup:", e)
      }
    }
  }, []) // Empty dependency array - only run once

  // Safely cancel any ongoing speech
  const safeCancel = useCallback(() => {
    if (!supported || !synth.current) return

    try {
      synth.current.cancel()
      setSpeaking(false)
    } catch (e) {
      console.warn("Error canceling speech:", e)
    }
  }, [supported])

  // Speak function with improved error handling
  const speak = useCallback(
    (text: string) => {
      if (!supported || !initialized || !synth.current) {
        console.warn("Speech synthesis not supported or initialized")
        return
      }

      // First cancel any ongoing speech
      safeCancel()

      // Wait a small amount of time to ensure cancellation is complete
      setTimeout(() => {
        try {
          // Create new utterance
          const utterance = new SpeechSynthesisUtterance(text)
          utteranceRef.current = utterance

          // Set properties
          utterance.rate = rate
          utterance.pitch = pitch
          utterance.volume = volume

          // Select voice
          if (voice) {
            utterance.voice = voice
          } else if (voices.length > 0) {
            // Try to find a good quality voice
            // First try to find a female voice in the user's language
            const langCode = navigator.language || "en-US"
            const femaleVoice = voices.find(
              (v) =>
                (v.lang.includes(langCode.split("-")[0]) || v.lang.includes("en")) &&
                (v.name.includes("Female") || v.name.includes("Samantha") || v.name.includes("Google")),
            )

            // Or find any good quality voice
            const goodVoice = voices.find(
              (v) => v.name.includes("Google") || v.name.includes("Premium") || !v.localService,
            )

            // Or just use the first voice
            utterance.voice = femaleVoice || goodVoice || voices[0]
          }

          // Add event handlers
          utterance.onstart = () => {
            setSpeaking(true)
            if (onStart) onStart()
          }

          utterance.onend = () => {
            setSpeaking(false)
            if (onEnd) onEnd()
            utteranceRef.current = null
          }

          utterance.onerror = (event) => {
            console.warn("Speech synthesis error:", event)

            // Handle the error but don't stop the flow
            if (onError) {
              onError(event)
            }

            // Make sure we reset the speaking state
            setSpeaking(false)
            utteranceRef.current = null
          }

          // Speak
          synth.current?.speak(utterance)
        } catch (error) {
          console.error("Error in speech synthesis:", error)
          setSpeaking(false)
          if (onError) {
            onError(error)
          }
        }
      }, 100) // Small delay to ensure cancellation is complete
    },
    [supported, initialized, voices, rate, pitch, volume, voice, onStart, onEnd, onError, safeCancel],
  )

  // Cancel function
  const cancel = useCallback(() => {
    safeCancel()
    utteranceRef.current = null
  }, [safeCancel])

  return {
    speak,
    cancel,
    speaking,
    voices,
    supported,
    initialized,
  }
}

