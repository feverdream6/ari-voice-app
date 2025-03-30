"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowDown, Check, Menu, X } from "lucide-react"
import { MinimalistButton } from "@/components/ui/minimalist-button"
import AriVoiceInterface from "@/components/ari-voice-interface"
import WellnessSummary from "@/components/wellness-summary"
import ButtonEffectsInitializer from "@/components/button-effects-initializer"
import SignInModal from "@/components/sign-in-modal"
import SubscriptionModal from "@/components/subscription-modal"
import DemoVideoModal from "@/components/demo-video-modal"
import SuccessModal from "@/components/success-modal"
import WorkInProgressBanner from "@/components/work-in-progress-banner"
import WorkInProgressOverlay from "@/components/work-in-progress-overlay"

export default function QubeLanding() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("hero")
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false)
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false)
  const [isDemoVideoModalOpen, setIsDemoVideoModalOpen] = useState(false)
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)
  const [successModalData, setSuccessModalData] = useState({
    title: "",
    message: "",
    actionLabel: "Continue",
  })
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userSubscription, setUserSubscription] = useState<string | null>(null)
  const [showWorkInProgressOverlay, setShowWorkInProgressOverlay] = useState(true)

  const sectionsRef = useRef<{ [key: string]: HTMLElement | null }>({
    hero: null,
    features: null,
    capabilities: null,
    pricing: null,
  })

  // Intersection observer for sections
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      { threshold: 0.5 },
    )

    Object.keys(sectionsRef.current).forEach((key) => {
      if (sectionsRef.current[key]) {
        observer.observe(sectionsRef.current[key]!)
      }
    })

    return () => {
      Object.keys(sectionsRef.current).forEach((key) => {
        if (sectionsRef.current[key]) {
          observer.unobserve(sectionsRef.current[key]!)
        }
      })
      // Unlock scroll when component unmounts
      if (typeof document !== "undefined") {
        document.body.style.overflow = ""
      }
    }
  }, [])

  const scrollToSection = (sectionId: string) => {
    sectionsRef.current[sectionId]?.scrollIntoView({ behavior: "smooth" })
    setIsMenuOpen(false)
    // Ensure scroll is unlocked when navigating
    if (typeof document !== "undefined") {
      document.body.style.overflow = ""
    }
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
    if (typeof document !== "undefined") {
      document.body.style.overflow = !isMenuOpen ? "hidden" : ""
    }
  }

  // Update the handleSignIn function
  const handleSignIn = () => {
    trackButtonClick("Sign In")
    setIsSignInModalOpen(true)
  }

  // Update the handleSignOut function
  const handleSignOut = () => {
    trackButtonClick("Sign Out")
    setIsLoggedIn(false)
    setUserSubscription(null)

    setSuccessModalData({
      title: "Signed Out",
      message: "You have been successfully signed out.",
      actionLabel: "Continue",
    })
    setIsSuccessModalOpen(true)
  }

  // Update the handleRegister function
  const handleRegister = () => {
    trackButtonClick("Register")
    setIsSignInModalOpen(false)
    handlePlanSelect("Free")
  }

  // Update the handlePlanSelect function
  const handlePlanSelect = (planName: string) => {
    trackButtonClick(`Select Plan: ${planName}`)
    setSelectedPlan(planName)

    if (isLoggedIn && planName === userSubscription) {
      setSuccessModalData({
        title: "Already Subscribed",
        message: `You are already subscribed to the ${planName} plan.`,
        actionLabel: "Continue",
      })
      setIsSuccessModalOpen(true)
      return
    }

    setIsSubscriptionModalOpen(true)
  }

  // Update the handleSubscriptionSuccess function
  const handleSubscriptionSuccess = () => {
    trackButtonClick("Subscription Success")
    setIsSubscriptionModalOpen(false)
    setUserSubscription(selectedPlan)
    setIsLoggedIn(true) // Auto-login on subscription

    setSuccessModalData({
      title: "Subscription Successful!",
      message: `You have successfully subscribed to the ${selectedPlan} plan.`,
      actionLabel: "Start Using Ari",
    })
    setIsSuccessModalOpen(true)
  }

  // Update the handleWatchDemo function
  const handleWatchDemo = () => {
    trackButtonClick("Watch Demo")
    setIsDemoVideoModalOpen(true)
  }

  // Add a new function for handling the "Discover more" button
  const handleDiscoverMore = () => {
    trackButtonClick("Discover More")
    scrollToSection("features")
  }

  const trackButtonClick = (buttonName: string) => {
    console.log(`Button clicked: ${buttonName}`)
    // In a real app, this would send analytics data
  }

  const handleSignInSuccess = () => {
    setIsLoggedIn(true)
    setIsSignInModalOpen(false)
    setSuccessModalData({
      title: "Signed In",
      message: "You have successfully signed in.",
      actionLabel: "Continue",
    })
    setIsSuccessModalOpen(true)
  }

  return (
    <div className="min-h-screen bg-black text-white relative">
      <ButtonEffectsInitializer />
      <WorkInProgressBanner />
      {showWorkInProgressOverlay && <WorkInProgressOverlay />}
      <div className="absolute inset-0 noise-bg pointer-events-none"></div>

      {/* Fixed Navigation */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-black/80 backdrop-blur-sm border-b border-gray-800">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-2xl font-medium">Qube</span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <button
                onClick={() => {
                  scrollToSection("hero")
                  trackButtonClick("AriLink")
                }}
                className={`text-sm focus-ring rounded-md px-2 py-1 ${activeSection === "hero" ? "text-qube-accent" : "text-white"} hover:text-qube-accent transition-colors`}
              >
                Ari
              </button>
              <button
                onClick={() => {
                  scrollToSection("features")
                  trackButtonClick("FeaturesLink")
                }}
                className={`text-sm focus-ring rounded-md px-2 py-1 ${activeSection === "features" ? "text-qube-accent" : "text-white"} hover:text-qube-accent transition-colors`}
              >
                Features
              </button>
              <button
                onClick={() => {
                  scrollToSection("capabilities")
                  trackButtonClick("CapabilitiesLink")
                }}
                className={`text-sm focus-ring rounded-md px-2 py-1 ${activeSection === "capabilities" ? "text-qube-accent" : "text-white"} hover:text-qube-accent transition-colors`}
              >
                Capabilities
              </button>
              <button
                onClick={() => {
                  scrollToSection("pricing")
                  trackButtonClick("PricingLink")
                }}
                className={`text-sm focus-ring rounded-md px-2 py-1 ${activeSection === "pricing" ? "text-qube-accent" : "text-white"} hover:text-qube-accent transition-colors`}
              >
                Pricing
              </button>

              {isLoggedIn ? (
                <>
                  <div className="text-sm text-qube-accent px-2 py-1">
                    {userSubscription && `${userSubscription} Plan`}
                  </div>
                  <MinimalistButton
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      handleSignOut()
                      trackButtonClick("SignOutButton")
                    }}
                  >
                    Sign Out
                  </MinimalistButton>
                </>
              ) : (
                <>
                  <MinimalistButton
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      handleSignIn()
                      trackButtonClick("SignInButton")
                    }}
                  >
                    Sign In
                  </MinimalistButton>
                  <MinimalistButton
                    variant="accent"
                    size="sm"
                    onClick={() => {
                      handlePlanSelect("Free")
                      trackButtonClick("TryFreeButton")
                    }}
                  >
                    Try Free
                  </MinimalistButton>
                </>
              )}
            </nav>

            {/* Mobile menu button */}
            <button
              onClick={toggleMenu}
              className="md:hidden text-white focus-ring rounded-md p-2"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="flex flex-col h-full pt-20 px-6 pb-6">
              <nav className="flex flex-col space-y-6 text-lg">
                <button
                  onClick={() => {
                    scrollToSection("hero")
                    trackButtonClick("AriLinkMobile")
                  }}
                  className="text-white hover:text-qube-accent transition-colors text-left focus-ring rounded-md px-2 py-1"
                >
                  Ari
                </button>
                <button
                  onClick={() => {
                    scrollToSection("features")
                    trackButtonClick("FeaturesLinkMobile")
                  }}
                  className="text-white hover:text-qube-accent transition-colors text-left focus-ring rounded-md px-2 py-1"
                >
                  Features
                </button>
                <button
                  onClick={() => {
                    scrollToSection("capabilities")
                    trackButtonClick("CapabilitiesLinkMobile")
                  }}
                  className="text-white hover:text-qube-accent transition-colors text-left focus-ring rounded-md px-2 py-1"
                >
                  Capabilities
                </button>
                <button
                  onClick={() => {
                    scrollToSection("pricing")
                    trackButtonClick("PricingLinkMobile")
                  }}
                  className="text-white hover:text-qube-accent transition-colors text-left focus-ring rounded-md px-2 py-1"
                >
                  Pricing
                </button>
              </nav>
              <div className="mt-auto space-y-4 button-group-mobile">
                {isLoggedIn ? (
                  <>
                    {userSubscription && (
                      <div className="text-center text-qube-accent py-2">{userSubscription} Plan</div>
                    )}
                    <MinimalistButton
                      variant="ghost"
                      fullWidth={true}
                      onClick={() => {
                        handleSignOut()
                        trackButtonClick("SignOutButtonMobile")
                      }}
                    >
                      Sign Out
                    </MinimalistButton>
                  </>
                ) : (
                  <>
                    <MinimalistButton
                      variant="ghost"
                      fullWidth={true}
                      onClick={() => {
                        handleSignIn()
                        trackButtonClick("SignInButtonMobile")
                      }}
                    >
                      Sign In
                    </MinimalistButton>
                    <MinimalistButton
                      variant="accent"
                      fullWidth={true}
                      onClick={() => {
                        handlePlanSelect("Free")
                        trackButtonClick("TryFreeButtonMobile")
                      }}
                    >
                      Try Free
                    </MinimalistButton>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section with Ari */}
      <section
        id="hero"
        ref={(el) => (sectionsRef.current.hero = el)}
        className="min-h-screen pt-24 flex flex-col justify-center items-center relative"
      >
        <div className="container mx-auto px-6 py-12 md:py-24 flex flex-col items-center relative">
          <motion.h1
            className="text-4xl md:text-6xl font-medium text-center mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Meet <span className="text-qube-accent font-bold">Ari</span>
          </motion.h1>
          <motion.p
            className="text-xl text-gray-400 text-center max-w-2xl mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Your AI wellness companion that helps you achieve your fitness goals, maintain mental clarity, and improve
            your overall well-being.
          </motion.p>

          {/* Ari Chat Interface */}
          <motion.div
            className="w-full max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <AriVoiceInterface />
          </motion.div>

          <motion.div
            className="mt-32 sm:mt-24 md:mt-12 flex justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
          >
            <button
              onClick={handleDiscoverMore}
              className="flex flex-col items-center text-gray-400 hover:text-qube-accent transition-colors focus-ring rounded-md p-2"
              aria-label="Scroll to features"
            >
              <span className="mb-2">Discover more</span>
              <ArrowDown className="animate-bounce text-qube-accent" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        ref={(el) => (sectionsRef.current.features = el)}
        className="min-h-screen py-24 bg-black relative"
      >
        <div className="container mx-auto px-6 relative">
          <div className="max-w-4xl mx-auto">
            <motion.h2
              className="text-3xl md:text-5xl font-medium mb-12 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              Your wellness journey, <span className="text-qube-accent font-bold">simplified</span>
            </motion.h2>

            {/* Feature Blocks */}
            <div className="space-y-32">
              {/* Feature 1: Voice Interaction */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  <h3 className="text-2xl font-medium mb-4">Just use your voice</h3>
                  <p className="text-gray-400 mb-6">
                    Ari responds to natural language, making it easy to get fitness guidance, mental wellness support,
                    and health tracking—all hands-free.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <Check className="w-5 h-5 text-qube-accent mr-2 flex-shrink-0 mt-0.5" aria-hidden="true" />
                      <span>Ask for workout routines tailored to your goals</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="w-5 h-5 text-qube-accent mr-2 flex-shrink-0 mt-0.5" aria-hidden="true" />
                      <span>Request guided meditation sessions when stressed</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="w-5 h-5 text-qube-accent mr-2 flex-shrink-0 mt-0.5" aria-hidden="true" />
                      <span>Get nutrition advice and meal planning help</span>
                    </li>
                  </ul>
                </motion.div>
                <motion.div
                  className="rounded-xl overflow-hidden border border-gray-800 bg-[#121826]"
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  viewport={{ once: true }}
                >
                  <div className="aspect-video relative flex items-center justify-center bg-black">
                    <div className="w-16 h-16 bg-[#1a2234] rounded-full flex items-center justify-center z-10">
                      <span className="text-4xl" role="img" aria-label="Ari">
                        🤖
                      </span>
                    </div>
                    <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-10">
                      <div className="flex items-center justify-center gap-[3px]">
                        {Array.from({ length: 9 }).map((_, i) => (
                          <motion.div
                            key={i}
                            className="w-1 rounded-full bg-qube-accent"
                            animate={{
                              height: [4, 12 + (i % 3) * 8, 4],
                            }}
                            transition={{
                              duration: 1,
                              repeat: Number.POSITIVE_INFINITY,
                              repeatType: "reverse",
                              delay: i * 0.05,
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-center text-sm text-gray-400">
                      "Hey Ari, guide me through a 15-minute meditation"
                    </p>
                  </div>
                </motion.div>
              </div>

              {/* Feature 2: Always Available */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <motion.div
                  className="order-2 md:order-1 rounded-xl overflow-hidden border border-gray-800 bg-[#121826]"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  <div className="p-6 grid grid-cols-3 gap-4">
                    <div className="col-span-3 mb-4 text-center">
                      <div className="inline-block w-12 h-12 bg-[#1a2234] rounded-full flex items-center justify-center mb-2">
                        <span className="text-2xl" role="img" aria-label="Ari">
                          🤖
                        </span>
                      </div>
                      <p className="text-sm text-gray-400">Always listening for your command</p>
                    </div>
                    <div className="bg-[#1a2234] rounded-lg p-3 flex flex-col items-center justify-center">
                      <span className="text-2xl mb-2" role="img" aria-label="Device">
                        📱
                      </span>
                      <span className="text-xs text-gray-400">Phone</span>
                    </div>
                    <div className="bg-[#1a2234] rounded-lg p-3 flex flex-col items-center justify-center">
                      <span className="text-2xl mb-2" role="img" aria-label="Device">
                        💻
                      </span>
                      <span className="text-xs text-gray-400">Computer</span>
                    </div>
                    <div className="bg-[#1a2234] rounded-lg p-3 flex flex-col items-center justify-center">
                      <span className="text-2xl mb-2" role="img" aria-label="Device">
                        ⌚
                      </span>
                      <span className="text-xs text-gray-400">Watch</span>
                    </div>
                    <div className="bg-[#1a2234] rounded-lg p-3 flex flex-col items-center justify-center">
                      <span className="text-2xl mb-2" role="img" aria-label="Device">
                        🏠
                      </span>
                      <span className="text-xs text-gray-400">Home</span>
                    </div>
                    <div className="bg-[#1a2234] rounded-lg p-3 flex flex-col items-center justify-center">
                      <span className="text-2xl mb-2" role="img" aria-label="Device">
                        🔊
                      </span>
                      <span className="text-xs text-gray-400">Speaker</span>
                    </div>
                    <div className="bg-[#1a2234] rounded-lg p-3 flex flex-col items-center justify-center">
                      <span className="text-2xl mb-2" role="img" aria-label="Device">
                        🚗
                      </span>
                      <span className="text-xs text-gray-400">Car</span>
                    </div>
                  </div>
                </motion.div>
                <motion.div
                  className="order-1 md:order-2"
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  viewport={{ once: true }}
                >
                  <h3 className="text-2xl font-medium mb-4">Always available, everywhere</h3>
                  <p className="text-gray-400 mb-6">
                    Ari runs quietly in the background across all your devices, ready to respond whenever you need
                    assistance with your wellness journey.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <Check className="w-5 h-5 text-qube-accent mr-2 flex-shrink-0 mt-0.5" aria-hidden="true" />
                      <span>Works across phones, computers, watches, and smart home devices</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="w-5 h-5 text-qube-accent mr-2 flex-shrink-0 mt-0.5" aria-hidden="true" />
                      <span>Syncs your wellness data seamlessly between devices</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="w-5 h-5 text-qube-accent mr-2 flex-shrink-0 mt-0.5" aria-hidden="true" />
                      <span>Optimized to use minimal battery while staying alert</span>
                    </li>
                  </ul>
                </motion.div>
              </div>

              {/* Feature 3: Personalized Wellness */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  <h3 className="text-2xl font-medium mb-4">Personalized wellness journey</h3>
                  <p className="text-gray-400 mb-6">
                    Ari learns your preferences, habits, and goals to provide increasingly personalized guidance for
                    your physical and mental well-being.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <Check className="w-5 h-5 text-qube-accent mr-2 flex-shrink-0 mt-0.5" aria-hidden="true" />
                      <span>Adapts recommendations based on your progress</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="w-5 h-5 text-qube-accent mr-2 flex-shrink-0 mt-0.5" aria-hidden="true" />
                      <span>Remembers your preferences and adjusts accordingly</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="w-5 h-5 text-qube-accent mr-2 flex-shrink-0 mt-0.5" aria-hidden="true" />
                      <span>Provides insights based on your wellness patterns</span>
                    </li>
                  </ul>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  viewport={{ once: true }}
                >
                  <WellnessSummary />
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section
        id="pricing"
        ref={(el) => (sectionsRef.current.pricing = el)}
        className="min-h-screen py-24 bg-black relative"
      >
        <div className="container mx-auto px-6 relative">
          <motion.h2
            className="text-3xl md:text-5xl font-medium mb-6 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            Choose your <span className="text-qube-accent font-bold">plan</span>
          </motion.h2>
          <motion.p
            className="text-xl text-gray-400 text-center max-w-2xl mx-auto mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Start with our free tier or upgrade for premium features
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                name: "Free",
                price: "$0",
                period: "forever",
                description: "Basic access to Ari's capabilities",
                features: [
                  "Voice-activated assistance",
                  "Basic fitness tracking",
                  "Limited wellness recommendations",
                  "Web access only",
                  "Standard response time",
                ],
                cta: "Get Started",
                highlighted: false,
              },
              {
                name: "Pro",
                price: "$20",
                period: "per month",
                description: "Enhanced capabilities for serious wellness enthusiasts",
                features: [
                  "Advanced voice recognition",
                  "Personalized fitness coaching",
                  "Nutrition guidance",
                  "Mental wellness routines",
                  "Multi-device access",
                  "Priority response time",
                ],
                cta: "Subscribe Now",
                highlighted: true,
              },
              {
                name: "Premium",
                price: "$49",
                period: "per month",
                description: "Maximum capabilities for power users",
                features: [
                  "Everything in Pro",
                  "Voice recognition for 5 users",
                  "Family activity coordination",
                  "Shared goals and challenges",
                  "Family health insights",
                  "Household device integration",
                ],
                cta: "Go Premium",
                highlighted: false,
              },
            ].map((plan, index) => (
              <motion.div
                key={index}
                className={`rounded-xl overflow-hidden bg-[#121826] ${
                  plan.highlighted ? "border-2 border-qube-accent" : "border border-gray-800"
                }`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                {plan.highlighted && (
                  <div className="bg-qube-accent text-white text-center py-1 text-sm font-medium">MOST POPULAR</div>
                )}
                <div className="p-6">
                  <h3 className="text-2xl font-medium">{plan.name}</h3>
                  <div className="mt-4 flex items-baseline">
                    <span className="text-4xl font-medium">{plan.price}</span>
                    <span className="ml-2 text-gray-400">{plan.period}</span>
                  </div>
                  <p className="mt-4 text-gray-400">{plan.description}</p>

                  <ul className="mt-6 space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <Check className="w-5 h-5 text-qube-accent mr-2 flex-shrink-0 mt-0.5" aria-hidden="true" />
                        <span className="text-white">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-8">
                    <MinimalistButton
                      variant={plan.highlighted ? "accent" : "secondary"}
                      size="lg"
                      fullWidth={true}
                      onClick={() => {
                        handlePlanSelect(plan.name)
                        trackButtonClick(`${plan.name}PlanButton`)
                      }}
                      aria-label={`Select ${plan.name} plan`}
                    >
                      {plan.cta}
                    </MinimalistButton>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative">
        <div className="container mx-auto px-6 relative">
          <motion.div
            className="rounded-xl p-8 md:p-12 text-center border border-gray-800 bg-[#121826] max-w-5xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-medium mb-6">
              Ready to transform your <span className="text-qube-accent font-bold">well-being</span>?
            </h2>
            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              Start your voice-guided journey to better physical and mental health with Ari today.
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4 button-group-mobile">
              <MinimalistButton
                variant="accent"
                size="xl"
                onClick={() => {
                  trackButtonClick("Try Ari Free - CTA")
                  handlePlanSelect("Free")
                }}
                aria-label="Try Ari for free"
              >
                Try Ari Free
              </MinimalistButton>
              <MinimalistButton
                variant="outline"
                size="xl"
                onClick={() => {
                  handleWatchDemo()
                  trackButtonClick("WatchDemoButton")
                }}
                aria-label="Watch demonstration video"
              >
                Watch Demo
              </MinimalistButton>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-gray-800 relative">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <span className="text-xl font-medium">Qube</span>
              </div>
              <p className="text-gray-400">Your voice-activated wellness ecosystem, powered by Ari.</p>
              <div className="mt-4 flex space-x-4">
                <a
                  href="#"
                  className="text-gray-400 hover:text-qube-accent transition-colors focus-ring rounded-md p-2"
                  aria-label="Twitter"
                >
                  <span className="sr-only">Twitter</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-qube-accent transition-colors focus-ring rounded-md p-2"
                  aria-label="Instagram"
                >
                  <span className="sr-only">Instagram</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-4">Product</h3>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => scrollToSection("features")}
                    className="text-gray-400 hover:text-qube-accent transition-colors focus-ring rounded-md px-2 py-1"
                  >
                    Features
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection("capabilities")}
                    className="text-gray-400 hover:text-qube-accent transition-colors focus-ring rounded-md px-2 py-1"
                  >
                    Capabilities
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection("pricing")}
                    className="text-gray-400 hover:text-qube-accent transition-colors focus-ring rounded-md px-2 py-1"
                  >
                    Pricing
                  </button>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-qube-accent transition-colors focus-ring rounded-md px-2 py-1"
                  >
                    API
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-4">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-qube-accent transition-colors focus-ring rounded-md px-2 py-1"
                  >
                    Documentation
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-qube-accent transition-colors focus-ring rounded-md px-2 py-1"
                  >
                    Guides
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-qube-accent transition-colors focus-ring rounded-md px-2 py-1"
                  >
                    Support
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-qube-accent transition-colors focus-ring rounded-md px-2 py-1"
                  >
                    Community
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-4">Company</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-qube-accent transition-colors focus-ring rounded-md px-2 py-1"
                  >
                    About
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-qube-accent transition-colors focus-ring rounded-md px-2 py-1"
                  >
                    Blog
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-qube-accent transition-colors focus-ring rounded-md px-2 py-1"
                  >
                    Careers
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-qube-accent transition-colors focus-ring rounded-md px-2 py-1"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>© 2023 Qube. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <SignInModal
        isOpen={isSignInModalOpen}
        onClose={() => setIsSignInModalOpen(false)}
        onSuccess={handleSignInSuccess}
        onRegister={handleRegister}
      />

      <SubscriptionModal
        isOpen={isSubscriptionModalOpen}
        onClose={() => setIsSubscriptionModalOpen(false)}
        onSuccess={handleSubscriptionSuccess}
        selectedPlan={selectedPlan || "Free"}
      />

      <DemoVideoModal
        isOpen={isDemoVideoModalOpen}
        onClose={() => setIsDemoVideoModalOpen(false)}
        onTryFree={() => {
          setIsDemoVideoModalOpen(false)
          handlePlanSelect("Free")
        }}
      />

      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        title={successModalData.title}
        message={successModalData.message}
        actionLabel={successModalData.actionLabel}
      />
    </div>
  )
}

