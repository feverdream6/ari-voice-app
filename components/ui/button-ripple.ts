"use client"

export function setupRippleEffect() {
  // Add event listener to all buttons with ripple-container
  document.addEventListener("click", (e) => {
    const target = e.target as HTMLElement
    const rippleContainer = target.closest(".ripple-container")

    if (rippleContainer) {
      const rect = rippleContainer.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      const ripple = document.createElement("span")
      ripple.className = "ripple"
      ripple.style.left = x + "px"
      ripple.style.top = y + "px"

      rippleContainer.appendChild(ripple)

      setTimeout(() => {
        ripple.remove()
      }, 600)
    }
  })
}

