"use client"

import { useRef } from "react"
import { motion } from "framer-motion"

interface VoiceWaveformProps {
  isListening: boolean
  isSpeaking: boolean
}

export default function VoiceWaveform({ isListening, isSpeaking }: VoiceWaveformProps) {
  const waveformRef = useRef<HTMLDivElement>(null)

  // Generate bars for the waveform
  const bars = Array.from({ length: 30 }, (_, i) => i)

  // Animation variants for the bars
  const barVariants = {
    listening: (i: number) => ({
      height: [4, 10, 20, 10, 4],
      transition: {
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "reverse" as const,
        duration: 1.2,
        delay: i * 0.03,
      },
    }),
    speaking: (i: number) => ({
      height: [4, 15, 8, 23, 4, 16, 4],
      transition: {
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "reverse" as const,
        duration: 1.5,
        delay: i * 0.02,
        times: [0, 0.2, 0.4, 0.6, 0.8, 0.9, 1],
      },
    }),
    idle: {
      height: 4,
      transition: {
        duration: 0.3,
      },
    },
  }

  return (
    <div ref={waveformRef} className="flex items-center justify-center h-12 gap-[2px]">
      {bars.map((bar) => (
        <motion.div
          key={bar}
          custom={bar}
          variants={barVariants}
          animate={isListening ? "listening" : isSpeaking ? "speaking" : "idle"}
          className={`w-1 rounded-full ${isListening ? "bg-purple-500" : isSpeaking ? "bg-pink-500" : "bg-gray-500"}`}
          style={{ minHeight: 4 }}
        />
      ))}
    </div>
  )
}

