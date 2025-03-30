"use client"

import { useState, useEffect } from "react"
import { Mic, AlertCircle } from "lucide-react"
import { MinimalistButton } from "@/components/ui/minimalist-button"

export default function AudioPermissionUI() {
  const [permissionState, setPermissionState] = useState<"unknown" | "granted" | "denied" | "prompt">("unknown")

  useEffect(() => {
    // Check if browser supports permissions API
    if (navigator.permissions) {
      navigator.permissions
        .query({ name: "microphone" as PermissionName })
        .then((permissionStatus) => {
          setPermissionState(permissionStatus.state as "granted" | "denied" | "prompt")

          // Listen for changes
          permissionStatus.onchange = () => {
            setPermissionState(permissionStatus.state as "granted" | "denied" | "prompt")
          }
        })
        .catch(() => {
          // Fallback to checking if getUserMedia is available
          if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            setPermissionState("prompt")
          } else {
            setPermissionState("denied")
          }
        })
    } else if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      setPermissionState("prompt")
    } else {
      setPermissionState("denied")
    }
  }, [])

  const requestPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      stream.getTracks().forEach((track) => track.stop())
      setPermissionState("granted")
    } catch (error) {
      console.error("Error requesting microphone permission:", error)
      setPermissionState("denied")
    }
  }

  if (permissionState === "granted") {
    return (
      <div className="flex items-center justify-center bg-[#121826] rounded-lg py-2 px-3 text-sm">
        <Mic className="w-4 h-4 mr-2 text-qube-success" />
        <span>Microphone ready</span>
      </div>
    )
  }

  if (permissionState === "denied") {
    return (
      <div className="flex flex-col items-center bg-[#121826] rounded-lg p-3">
        <div className="flex items-center text-qube-error mb-2">
          <AlertCircle className="w-4 h-4 mr-2" />
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
      className="flex items-center justify-center"
    >
      <Mic className="w-4 h-4 mr-2" />
      <span>Allow Microphone</span>
    </MinimalistButton>
  )
}

