"use client"

export function setupRippleEffect() {
  if (typeof window === "undefined") return

  document.addEventListener("click", (e) => {
    const target = e.target as HTMLElement
    const button = target.closest("button")

    if (button) {
      const rippleContainer = button.querySelector(".ripple-container")

      if (rippleContainer) {
        const rect = rippleContainer.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top

        // Create ripple element
        const ripple = document.createElement("span")
        ripple.className = "ripple"
        ripple.style.position = "absolute"
        ripple.style.borderRadius = "50%"
        ripple.style.transform = "scale(0)"
        ripple.style.backgroundColor = "rgba(255, 255, 255, 0.3)"
        ripple.style.width = "100px"
        ripple.style.height = "100px"
        ripple.style.left = `${x - 50}px`
        ripple.style.top = `${y - 50}px`
        ripple.style.animation = "ripple 0.6s linear"
        ripple.style.opacity = "0"

        rippleContainer.appendChild(ripple)

        // Remove ripple after animation
        setTimeout(() => {
          ripple.remove()
        }, 700)
      }
    }
  })
}

