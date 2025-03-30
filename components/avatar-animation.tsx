"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { useTheme } from "next-themes"

interface AvatarAnimationProps {
  isListening: boolean
  isSpeaking: boolean
  isLoading?: boolean
}

export default function AvatarAnimation({ isListening, isSpeaking, isLoading = false }: AvatarAnimationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { theme } = useTheme()
  const isDark = theme === "dark"

  // Animation properties
  const pulseVariants = {
    listening: {
      scale: [1, 1.03, 1],
      opacity: 1,
      transition: {
        repeat: Number.POSITIVE_INFINITY,
        duration: 2,
      },
    },
    speaking: {
      scale: [1, 1.02, 1, 1.01, 1],
      opacity: 1,
      transition: {
        repeat: Number.POSITIVE_INFINITY,
        duration: 2.5,
        times: [0, 0.25, 0.5, 0.75, 1],
      },
    },
    loading: {
      scale: [1, 1.01, 1],
      opacity: 1,
      transition: {
        repeat: Number.POSITIVE_INFINITY,
        duration: 1.2,
      },
    },
    idle: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const setCanvasDimensions = () => {
      const dpr = window.devicePixelRatio || 1
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      ctx.scale(dpr, dpr)
    }

    setCanvasDimensions()
    window.addEventListener("resize", setCanvasDimensions)

    // Animation frame counter for smooth animations
    let frameCount = 0

    // Create a modern, abstract avatar animation
    const animate = () => {
      frameCount++
      requestAnimationFrame(animate)

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const centerX = canvas.width / (2 * (window.devicePixelRatio || 1))
      const centerY = canvas.height / (2 * (window.devicePixelRatio || 1))
      const size = Math.min(centerX, centerY) * 1.8

      // Define colors based on state
      let primaryColor, secondaryColor, accentColor

      if (isLoading) {
        primaryColor = "rgba(234, 179, 8, 0.8)" // Yellow
        secondaryColor = "rgba(234, 179, 8, 0.4)"
        accentColor = "rgba(234, 179, 8, 1)"
      } else if (isListening) {
        primaryColor = "rgba(147, 51, 234, 0.8)" // Purple
        secondaryColor = "rgba(147, 51, 234, 0.4)"
        accentColor = "rgba(147, 51, 234, 1)"
      } else if (isSpeaking) {
        primaryColor = "rgba(219, 39, 119, 0.8)" // Pink
        secondaryColor = "rgba(219, 39, 119, 0.4)"
        accentColor = "rgba(219, 39, 119, 1)"
      } else {
        primaryColor = "rgba(59, 130, 246, 0.8)" // Blue
        secondaryColor = "rgba(59, 130, 246, 0.4)"
        accentColor = "rgba(59, 130, 246, 1)"
      }

      // Draw outer glow
      const glowRadius = size * 0.5
      const glowGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, glowRadius)
      glowGradient.addColorStop(0, secondaryColor)
      glowGradient.addColorStop(1, "rgba(0, 0, 0, 0)")

      ctx.beginPath()
      ctx.arc(centerX, centerY, glowRadius, 0, Math.PI * 2)
      ctx.fillStyle = glowGradient
      ctx.fill()

      // Draw main circular background
      const mainRadius = size * 0.3
      ctx.beginPath()
      ctx.arc(centerX, centerY, mainRadius, 0, Math.PI * 2)

      // Create gradient for main circle
      const mainGradient = ctx.createRadialGradient(
        centerX - mainRadius * 0.3,
        centerY - mainRadius * 0.3,
        0,
        centerX,
        centerY,
        mainRadius,
      )
      mainGradient.addColorStop(0, "rgba(255, 255, 255, 0.1)")
      mainGradient.addColorStop(1, "rgba(0, 0, 0, 0.05)")

      ctx.fillStyle = mainGradient
      ctx.fill()

      // Draw border
      ctx.lineWidth = 2
      ctx.strokeStyle = primaryColor
      ctx.stroke()

      // Draw animated particles/energy waves
      const numParticles = 8
      const particleRadius = mainRadius * 1.2

      for (let i = 0; i < numParticles; i++) {
        const angle = (i / numParticles) * Math.PI * 2
        const waveOffset = Math.sin(frameCount * 0.02 + i) * 10
        const x = centerX + Math.cos(angle) * (particleRadius + waveOffset)
        const y = centerY + Math.sin(angle) * (particleRadius + waveOffset)

        ctx.beginPath()
        ctx.arc(x, y, 4, 0, Math.PI * 2)
        ctx.fillStyle = primaryColor
        ctx.fill()

        // Draw connecting lines
        ctx.beginPath()
        ctx.moveTo(centerX, centerY)
        ctx.lineTo(x, y)
        ctx.strokeStyle = `${primaryColor.slice(0, -4)}, 0.3)`
        ctx.lineWidth = 1
        ctx.stroke()
      }

      // Draw inner energy core
      const coreRadius = mainRadius * 0.6
      const coreGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, coreRadius)
      coreGradient.addColorStop(0, accentColor)
      coreGradient.addColorStop(1, primaryColor)

      ctx.beginPath()
      ctx.arc(centerX, centerY, coreRadius, 0, Math.PI * 2)
      ctx.fillStyle = coreGradient
      ctx.fill()

      // Draw pulsing rings
      const numRings = 3
      for (let i = 0; i < numRings; i++) {
        const ringProgress = (frameCount * 0.01 + i / numRings) % 1
        const ringRadius = mainRadius * ringProgress
        const ringOpacity = 1 - ringProgress

        ctx.beginPath()
        ctx.arc(centerX, centerY, ringRadius, 0, Math.PI * 2)
        ctx.strokeStyle = `${accentColor.slice(0, -4)}, ${ringOpacity})`
        ctx.lineWidth = 2
        ctx.stroke()
      }

      // Draw animated waveform/equalizer in the center
      const barWidth = 4
      const barSpacing = 3
      const numBars = 7
      const barMaxHeight = coreRadius * 0.8
      const totalBarWidth = numBars * (barWidth + barSpacing) - barSpacing

      const barStartX = centerX - totalBarWidth / 2

      for (let i = 0; i < numBars; i++) {
        let barHeight

        if (isSpeaking) {
          // Dynamic heights when speaking
          barHeight = barMaxHeight * (0.3 + 0.7 * Math.abs(Math.sin(frameCount * 0.1 + i * 0.5)))
        } else if (isListening) {
          // Subtle movement when listening
          barHeight = barMaxHeight * (0.2 + 0.3 * Math.abs(Math.sin(frameCount * 0.05 + i * 0.5)))
        } else if (isLoading) {
          // Sequential pattern when loading
          const loadingPhase = (frameCount * 0.05 + i * 0.5) % (Math.PI * 2)
          barHeight = barMaxHeight * (0.2 + 0.5 * Math.abs(Math.sin(loadingPhase)))
        } else {
          // Minimal movement when idle
          barHeight = barMaxHeight * (0.15 + 0.1 * Math.abs(Math.sin(frameCount * 0.02 + i * 0.5)))
        }

        const barX = barStartX + i * (barWidth + barSpacing)

        ctx.beginPath()
        ctx.roundRect(barX, centerY - barHeight / 2, barWidth, barHeight, 2)
        ctx.fillStyle = "rgba(255, 255, 255, 0.9)"
        ctx.fill()
      }

      // Draw subtle light reflections
      const reflectionRadius = 8
      ctx.beginPath()
      ctx.arc(centerX - coreRadius * 0.3, centerY - coreRadius * 0.3, reflectionRadius, 0, Math.PI * 2)
      ctx.fillStyle = "rgba(255, 255, 255, 0.3)"
      ctx.fill()

      // Draw smaller reflection
      ctx.beginPath()
      ctx.arc(centerX - coreRadius * 0.1, centerY - coreRadius * 0.5, reflectionRadius / 2, 0, Math.PI * 2)
      ctx.fillStyle = "rgba(255, 255, 255, 0.2)"
      ctx.fill()
    }

    animate()

    return () => {
      window.removeEventListener("resize", setCanvasDimensions)
    }
  }, [isListening, isSpeaking, isLoading, isDark])

  return (
    <motion.div
      className="w-full h-full rounded-full overflow-hidden"
      variants={pulseVariants}
      animate={isLoading ? "loading" : isListening ? "listening" : isSpeaking ? "speaking" : "idle"}
    >
      <canvas ref={canvasRef} className="w-full h-full" />
    </motion.div>
  )
}

