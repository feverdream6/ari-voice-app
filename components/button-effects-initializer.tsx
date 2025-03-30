"use client"

import { useEffect } from "react"
import { setupRippleEffect } from "@/lib/button-utils"

export default function ButtonEffectsInitializer() {
  useEffect(() => {
    setupRippleEffect()
  }, [])

  return null
}

