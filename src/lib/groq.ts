// Groq API Configuration
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY || ''
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'

export type Message = {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export type ChatResponse = {
  id: string
  choices: {
    message: Message
    finish_reason: string
  }[]
}

export async function sendMessage(messages: Message[]): Promise<string> {
  try {
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages,
        temperature: 0.7,
        max_tokens: 1024,
      }),
    })

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.status}`)
    }

    const data: ChatResponse = await response.json()
    return data.choices[0]?.message?.content ?? 'Lo siento, no pude procesar tu mensaje.'
  } catch (error) {
    console.error('Error calling Groq API:', error)
    throw error
  }
}
