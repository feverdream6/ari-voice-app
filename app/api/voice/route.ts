import { NextResponse } from "next/server"

// Mock responses for the AI assistant
const responses = [
  "I'm here to help. What can I do for you today?",
  "That's an interesting question. Let me think about it.",
  "I understand what you're asking. Here's what I know about that.",
  "I'd be happy to assist with that request.",
  "I'm processing your question. Here's what I found.",
  "Thanks for asking. I can definitely help with that.",
  "I'm Ari, your voice assistant. I'm designed to make your life easier.",
  "I'm constantly learning to better assist you.",
  "Is there anything else you'd like to know?",
  "I appreciate your patience while I process that request.",
]

export async function POST(request: Request) {
  try {
    const { message } = await request.json()

    // In a real application, you would send the message to an AI service
    // For this demo, we'll just return a random response

    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Get a random response
    const responseIndex = Math.floor(Math.random() * responses.length)
    const aiResponse = responses[responseIndex]

    return NextResponse.json({ message: aiResponse })
  } catch (error) {
    console.error("Error processing voice request:", error)
    return NextResponse.json({ error: "Failed to process your request" }, { status: 500 })
  }
}

