"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { CheckIcon, ChevronRightIcon, MenuIcon, XIcon } from "lucide-react"
import AvatarAnimation from "@/components/avatar-animation"
import Link from "next/link"
import { useRouter } from "next/navigation"
import SignUpModal from "@/components/sign-up-modal"
import LoginModal from "@/components/login-modal"
import DemoModal from "@/components/demo-modal"
import { MinimalistButton } from "@/components/ui/minimalist-button"

export default function LandingPage() {
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [isSignUpOpen, setIsSignUpOpen] = useState(false)
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [isDemoOpen, setIsDemoOpen] = useState(false)
  const [signupPlan, setSignupPlan] = useState<string | null>(null)

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  const handleTryFree = () => {
    setSignupPlan("Free")
    setIsSignUpOpen(true)
  }

  const handleSubscribe = (planName: string) => {
    setSignupPlan(planName)
    setIsSignUpOpen(true)
  }

  const handleDemoRequest = () => {
    setIsDemoOpen(true)
  }

  const handleSignIn = () => {
    setIsLoginOpen(true)
  }

  const handleSeeHowItWorks = () => {
    // Scroll to features section
    document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })

    // After a short delay, open the demo modal
    setTimeout(() => {
      setIsDemoOpen(true)
    }, 800)
  }

  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      description: "Basic access to Ari's capabilities",
      features: ["5 conversations per day", "Basic voice interactions", "Standard response time", "Web access only"],
      cta: "Get Started",
      highlighted: false,
    },
    {
      name: "Pro",
      price: "$20",
      period: "per month",
      description: "Enhanced capabilities for regular users",
      features: [
        "Unlimited conversations",
        "Advanced voice recognition",
        "Faster response time",
        "Web and mobile access",
        "Custom voice settings",
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
        "Priority processing",
        "API access",
        "Custom training",
        "Dedicated support",
        "Early access to new features",
      ],
      cta: "Go Premium",
      highlighted: false,
    },
  ]

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-10 h-10 mr-3">
              <AvatarAnimation isListening={false} isSpeaking={false} />
            </div>
            <span className="text-2xl font-medium text-white">Ari</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="#features" className="text-gray-300 hover:text-white transition-colors">
              Features
            </Link>
            <Link href="#pricing" className="text-gray-300 hover:text-white transition-colors">
              Pricing
            </Link>
            <Link href="#faq" className="text-gray-300 hover:text-white transition-colors">
              FAQ
            </Link>
            <MinimalistButton variant="ghost" onClick={handleSignIn}>
              Sign In
            </MinimalistButton>
            <MinimalistButton variant="primary" onClick={handleTryFree}>
              Try for Free
            </MinimalistButton>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-white focus:outline-none"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMenuOpen ? <XIcon size={24} /> : <MenuIcon size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 bg-gray-900 rounded-md p-4">
            <div className="flex flex-col space-y-4">
              <Link href="#features" className="text-gray-300 hover:text-white transition-colors" onClick={toggleMenu}>
                Features
              </Link>
              <Link href="#pricing" className="text-gray-300 hover:text-white transition-colors" onClick={toggleMenu}>
                Pricing
              </Link>
              <Link href="#faq" className="text-gray-300 hover:text-white transition-colors" onClick={toggleMenu}>
                FAQ
              </Link>
              <MinimalistButton
                variant="ghost"
                fullWidth={true}
                onClick={() => {
                  handleSignIn()
                  toggleMenu()
                }}
              >
                Sign In
              </MinimalistButton>
              <MinimalistButton
                variant="primary"
                fullWidth={true}
                onClick={() => {
                  handleTryFree()
                  toggleMenu()
                }}
              >
                Try for Free
              </MinimalistButton>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-16 md:py-24">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <motion.h1
              className="text-4xl md:text-5xl lg:text-6xl font-medium leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Meet Ari,
              <br />
              Your Digital Thought Partner
            </motion.h1>
            <motion.p
              className="mt-6 text-xl text-gray-400 max-w-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Experience the future of AI interaction with Ari. Engage in natural conversations, get instant answers,
              and unlock your productivity potential.
            </motion.p>
            <motion.div
              className="mt-8 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <MinimalistButton variant="primary" size="xl" onClick={handleTryFree}>
                Try Ari for Free
              </MinimalistButton>
              <MinimalistButton
                variant="outline"
                size="xl"
                icon={<ChevronRightIcon />}
                iconPosition="right"
                onClick={handleSeeHowItWorks}
              >
                See How It Works
              </MinimalistButton>
            </motion.div>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <motion.div
              className="w-64 h-64 md:w-80 md:h-80"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
            >
              <AvatarAnimation isListening={false} isSpeaking={true} />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-6 py-16 md:py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-medium">Why Choose Ari?</h2>
          <p className="mt-4 text-xl text-gray-400">Discover the features that make Ari your ideal digital companion</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              title: "Natural Conversations",
              description:
                "Engage in fluid, human-like conversations with advanced voice recognition and natural language processing.",
              icon: "🗣️",
            },
            {
              title: "Instant Responses",
              description:
                "Get immediate, accurate answers to your questions without the wait time of traditional search methods.",
              icon: "⚡",
            },
            {
              title: "Voice-First Design",
              description: "Interact hands-free with Ari's intuitive voice interface, perfect for multitasking.",
              icon: "🎙️",
            },
            {
              title: "Personalized Experience",
              description: "Ari learns your preferences and adapts to your unique needs over time.",
              icon: "👤",
            },
            {
              title: "Cross-Platform Access",
              description: "Use Ari seamlessly across all your devices, with perfect synchronization.",
              icon: "📱",
            },
            {
              title: "Privacy Focused",
              description: "Your conversations stay private with end-to-end encryption and strict data protection.",
              icon: "🔒",
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              className="bg-gray-900 rounded-md p-6 hover:bg-gray-800 transition-colors"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-medium mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="container mx-auto px-6 py-16 md:py-24 bg-gray-950">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-medium">Choose Your Plan</h2>
          <p className="mt-4 text-xl text-gray-400">Start with our free tier or upgrade for premium features</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              className={`rounded-md overflow-hidden ${
                plan.highlighted ? "border border-purple-500 bg-gray-900" : "border border-gray-800 bg-gray-900"
              }`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              {plan.highlighted && (
                <div className="bg-purple-600 text-white text-center py-1 text-sm font-medium">MOST POPULAR</div>
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
                      <CheckIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-8">
                  <MinimalistButton
                    variant={plan.highlighted ? "primary" : "secondary"}
                    size="lg"
                    fullWidth={true}
                    onClick={() => handleSubscribe(plan.name)}
                  >
                    {plan.cta}
                  </MinimalistButton>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="container mx-auto px-6 py-16 md:py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-medium">What Our Users Say</h2>
          <p className="mt-4 text-xl text-gray-400">Join thousands of satisfied Ari users</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              quote:
                "Ari has completely transformed how I manage my daily tasks. The voice interface is incredibly intuitive.",
              author: "Sarah J.",
              role: "Marketing Director",
            },
            {
              quote:
                "As a developer, I appreciate how Ari helps me think through complex problems. It's like having a second brain.",
              author: "Michael T.",
              role: "Software Engineer",
            },
            {
              quote:
                "The Pro subscription is worth every penny. Ari's advanced features have boosted my productivity tenfold.",
              author: "Elena R.",
              role: "Entrepreneur",
            },
          ].map((testimonial, index) => (
            <motion.div
              key={index}
              className="bg-gray-900 rounded-md p-6 border border-gray-800"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="text-2xl text-purple-500 mb-4">"</div>
              <p className="text-gray-300 mb-6">{testimonial.quote}</p>
              <div>
                <p className="font-medium">{testimonial.author}</p>
                <p className="text-gray-400 text-sm">{testimonial.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="container mx-auto px-6 py-16 md:py-24 bg-gray-950">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-medium">Frequently Asked Questions</h2>
          <p className="mt-4 text-xl text-gray-400">Find answers to common questions about Ari</p>
        </div>

        <div className="max-w-3xl mx-auto space-y-6">
          {[
            {
              question: "What makes Ari different from other AI assistants?",
              answer:
                "Ari combines advanced voice recognition with natural language processing to create truly conversational interactions. Unlike other assistants, Ari is designed to be a thought partner, not just a command responder.",
            },
            {
              question: "Can I use Ari on multiple devices?",
              answer:
                "Yes! With our Pro and Premium plans, you can use Ari seamlessly across all your devices with perfect synchronization. The Free plan is limited to web access only.",
            },
            {
              question: "How does the Free plan work?",
              answer:
                "The Free plan gives you access to Ari's basic capabilities with a limit of 5 conversations per day. It's perfect for trying out the service before committing to a subscription.",
            },
            {
              question: "Can I cancel my subscription anytime?",
              answer:
                "Absolutely. You can cancel your subscription at any time, and you'll continue to have access until the end of your billing period.",
            },
            {
              question: "Is my data private and secure?",
              answer:
                "Yes, we take privacy very seriously. All conversations with Ari are encrypted end-to-end, and we have strict data protection policies in place. We never sell your data to third parties.",
            },
          ].map((faq, index) => (
            <motion.div
              key={index}
              className="bg-gray-900 rounded-md p-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <h3 className="text-xl font-medium mb-3">{faq.question}</h3>
              <p className="text-gray-400">{faq.answer}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-16 md:py-24">
        <motion.div
          className="bg-gray-900 rounded-md p-8 md:p-12 text-center border border-gray-800"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-medium mb-6">Ready to Experience Ari?</h2>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            Start with our free tier today and discover how Ari can transform your digital experience.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <MinimalistButton variant="primary" size="xl" onClick={handleTryFree}>
              Get Started for Free
            </MinimalistButton>
            <MinimalistButton variant="outline" size="xl" onClick={handleDemoRequest}>
              Schedule a Demo
            </MinimalistButton>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-black py-12 border-t border-gray-800">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 mr-2">
                  <AvatarAnimation isListening={false} isSpeaking={false} />
                </div>
                <span className="text-xl font-medium text-white">Ari</span>
              </div>
              <p className="text-gray-400">Your digital thought partner, powered by advanced AI.</p>
              <div className="mt-4 flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <span className="sr-only">GitHub</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
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
                  <Link href="#features" className="text-gray-400 hover:text-white">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#pricing" className="text-gray-400 hover:text-white">
                    Pricing
                  </Link>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    API
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Integrations
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-4">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Guides
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Support
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    API Status
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-4">Company</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>© 2023 Ari. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <SignUpModal
        isOpen={isSignUpOpen}
        onClose={() => setIsSignUpOpen(false)}
        selectedPlan={signupPlan}
        onSuccess={() => {
          setIsSignUpOpen(false)
          router.push("/app")
        }}
      />

      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onSuccess={() => {
          setIsLoginOpen(false)
          router.push("/app")
        }}
        onSignUp={() => {
          setIsLoginOpen(false)
          setIsSignUpOpen(true)
        }}
      />

      <DemoModal
        isOpen={isDemoOpen}
        onClose={() => setIsDemoOpen(false)}
        onTryFree={() => {
          setIsDemoOpen(false)
          handleTryFree()
        }}
      />
    </div>
  )
}

