"use client"

import { useState, useEffect } from "react"
import { Mic, AlertCircle } from "lucide-react"
import { MinimalistButton } from "@/components/ui/minimalist-button"

interface AudioPermissionButtonProps {
  onPermissionGranted?: () => void
  onPermissionDenied?: () => void
  className?: string
}

export default function AudioPermissionButton({
  onPermissionGranted,
  onPermissionDenied,
  className,
}: AudioPermissionButtonProps) {
  const [permissionState, setPermissionState] = useState<"unknown" | "granted" | "denied" | "prompt">("unknown")
  const [isRequesting, setIsRequesting] = useState(false)

  useEffect(() => {
    // Check if browser supports permissions API
    if (navigator.permissions) {
      navigator.permissions
        .query({ name: "microphone" as PermissionName })
        .then((permissionStatus) => {
          setPermissionState(permissionStatus.state as "granted" | "denied" | "prompt")

          // Listen for changes
          permissionStatus.onchange = () => {
            const newState = permissionStatus.state as "granted" | "denied" | "prompt"
            setPermissionState(newState)

            if (newState === "granted" && onPermissionGranted) {
              onPermissionGranted()
            } else if (newState === "denied" && onPermissionDenied) {
              onPermissionDenied()
            }
          }
        })
        .catch(() => {
          // Fallback to checking if getUserMedia is available
          if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            setPermissionState("prompt")
          } else {
            setPermissionState("denied")
            if (onPermissionDenied) onPermissionDenied()
          }
        })
    } else if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      setPermissionState("prompt")
    } else {
      setPermissionState("denied")
      if (onPermissionDenied) onPermissionDenied()
    }
  }, [onPermissionGranted, onPermissionDenied])

  const requestPermission = async () => {
    if (isRequesting) return

    setIsRequesting(true)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      stream.getTracks().forEach((track) => track.stop())
      setPermissionState("granted")
      if (onPermissionGranted) onPermissionGranted()
    } catch (error) {
      console.error("Error requesting microphone permission:", error)
      setPermissionState("denied")
      if (onPermissionDenied) onPermissionDenied()
    } finally {
      setIsRequesting(false)
    }
  }

  if (permissionState === "granted") {
    return (
      <div className={`flex items-center justify-center bg-[#121826] rounded-lg py-2 px-3 text-sm ${className}`}>
        <Mic className="w-4 h-4 mr-2 text-qube-success" aria-hidden="true" />
        <span>Microphone ready</span>
      </div>
    )
  }

  if (permissionState === "denied") {
    return (
      <div className={`flex flex-col items-center bg-[#121826] rounded-lg p-3 ${className}`}>
        <div className="flex items-center text-qube-error mb-2">
          <AlertCircle className="w-4 h-4 mr-2" aria-hidden="true" />
          <span>Microphone access denied</span>
        </div>
        <p className="text-xs text-gray-400 text-center">
          Please enable microphone access in your browser settings to use voice features
        </p>
      </div>
    )
  }

  return (
    <MinimalistButton
      variant="accent"
      size="sm"
      onClick={requestPermission}
      className={`flex items-center justify-center ${className}`}
      isLoading={isRequesting}
      loadingText="Requesting access..."
      icon={<Mic className="w-4 h-4" />}
      iconPosition="left"
      aria-label="Allow microphone access"
    >
      Allow Microphone
    </MinimalistButton>
  )
}

