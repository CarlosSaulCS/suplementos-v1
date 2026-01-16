import { useState, useRef, useEffect, useCallback } from 'react'
import { sendMessage, type Message } from '../lib/groq'
import { catalog } from '../app/catalog'
import { formatMXN } from '../app/money'
import { useCart } from '../app/useCart'

type ChatMessage = {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  actions?: ProductAction[]
}

type ProductAction = {
  type: 'add_to_cart'
  productId: string
  variantId: string
  productName: string
  variantLabel: string
  price: number
}

// System prompt con información del catálogo y capacidades
function buildSystemPrompt(): string {
  const productList = catalog.map(p => {
    const variants = p.variants.map(v => 
      `  - ${v.label}: ${formatMXN(v.price)} (ID: ${v.id})${v.inStock ? '' : ' [AGOTADO]'}`
    ).join('\n')
    return `• ${p.name} (${p.brand}) - Categoría: ${p.category}\n  ID Producto: ${p.id}\n${variants}`
  }).join('\n\n')

  return `Eres MUÑEK AI, el asistente virtual de MUÑEK SUPLEMENTOS, una tienda de suplementos deportivos premium en México.

## TU PERSONALIDAD
- Eres amigable, motivador y experto en fitness y nutrición
- Hablas en español mexicano de forma natural
- Usas emojis ocasionalmente para ser más cercano 💪
- Eres conciso pero informativo

## TUS CAPACIDADES
1. **Asesoría en productos**: Recomiendas suplementos según objetivos del cliente
2. **Asesoría en nutrición**: Consejos sobre alimentación para fitness
3. **Asesoría en ejercicio**: Tips de entrenamiento y rutinas
4. **Gestión de carrito**: Puedes agregar productos al carrito del cliente

## CATÁLOGO DE PRODUCTOS
${productList}

## CÓMO AGREGAR AL CARRITO
Cuando el cliente quiera comprar algo, incluye en tu respuesta un bloque JSON así:
\`\`\`json
{"action": "add_to_cart", "variantId": "ID_DE_VARIANTE", "productName": "Nombre", "variantLabel": "Variante"}
\`\`\`

## REGLAS IMPORTANTES
- Si preguntan por un producto que no tenemos, sugiere alternativas de nuestro catálogo
- Siempre menciona precios en pesos mexicanos
- Si no estás seguro de algo médico, recomienda consultar un profesional
- Envío gratis en compras mayores a $999 MXN
- Estamos en Zacatelco, Tlaxcala

¡Ayuda a los clientes a alcanzar sus metas fitness! 🏆`
}

function parseActions(content: string): { cleanContent: string; actions: ProductAction[] } {
  const actions: ProductAction[] = []
  const jsonRegex = /```json\s*(\{[\s\S]*?\})\s*```/g
  
  let match
  while ((match = jsonRegex.exec(content)) !== null) {
    try {
      const parsed = JSON.parse(match[1])
      if (parsed.action === 'add_to_cart' && parsed.variantId) {
        // Find product info
        for (const product of catalog) {
          const variant = product.variants.find(v => v.id === parsed.variantId)
          if (variant) {
            actions.push({
              type: 'add_to_cart',
              productId: product.id,
              variantId: parsed.variantId,
              productName: product.name,
              variantLabel: variant.label,
              price: variant.price,
            })
            break
          }
        }
      }
    } catch {
      // Invalid JSON, skip
    }
  }

  // Remove JSON blocks from displayed content
  const cleanContent = content.replace(/```json\s*\{[\s\S]*?\}\s*```/g, '').trim()
  
  return { cleanContent, actions }
}

export function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const cart = useCart()

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  // Welcome message when first opened
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{
        id: 'welcome',
        role: 'assistant',
        content: '¡Hola! 👋 Soy **MUÑEK AI**, tu asistente de suplementos y fitness.\n\nPuedo ayudarte a:\n- 🛒 Elegir y agregar productos al carrito\n- 💪 Consejos de ejercicio y rutinas\n- 🥗 Asesoría nutricional\n- ❓ Resolver cualquier duda\n\n¿En qué te puedo ayudar hoy?',
        timestamp: new Date(),
      }])
    }
  }, [isOpen, messages.length])

  const handleAddToCart = (action: ProductAction) => {
    cart.add(action.variantId, 1)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      // Build conversation history for API
      const apiMessages: Message[] = [
        { role: 'system', content: buildSystemPrompt() },
        ...messages.filter(m => m.id !== 'welcome').map(m => ({
          role: m.role as 'user' | 'assistant',
          content: m.content,
        })),
        { role: 'user', content: userMessage.content },
      ]

      const response = await sendMessage(apiMessages)
      const { cleanContent, actions } = parseActions(response)

      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: cleanContent,
        timestamp: new Date(),
        actions: actions.length > 0 ? actions : undefined,
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Error:', error)
      setMessages(prev => [...prev, {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: 'Lo siento, hubo un error al procesar tu mensaje. Por favor intenta de nuevo. 🙏',
        timestamp: new Date(),
      }])
    } finally {
      setIsLoading(false)
    }
  }

  const formatContent = (content: string) => {
    // Simple markdown-like formatting
    return content
      .split('\n')
      .map((line, i) => {
        // Bold
        line = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        // Lists
        if (line.startsWith('- ')) {
          return `<li key="${i}">${line.slice(2)}</li>`
        }
        return line
      })
      .join('<br/>')
  }

  return (
    <>
      {/* Chat Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-24 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${
          isOpen 
            ? 'bg-fg text-white rotate-0' 
            : 'bg-accent hover:bg-accent-dark text-white hover:scale-110'
        }`}
        aria-label={isOpen ? 'Cerrar asistente' : 'Abrir asistente MUÑEK AI'}
      >
        {isOpen ? (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
          </svg>
        )}
      </button>

      {/* Chat Window */}
      <div
        className={`fixed bottom-24 right-6 z-50 w-[min(400px,calc(100vw-3rem))] transition-all duration-300 ${
          isOpen 
            ? 'opacity-100 translate-y-0 pointer-events-auto' 
            : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[min(600px,calc(100vh-12rem))]">
          {/* Header */}
          <div className="bg-fg text-white p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="font-bold">MUÑEK AI</h3>
              <p className="text-xs text-white/70">Tu asistente de fitness</p>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors"
              aria-label="Cerrar"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                    msg.role === 'user'
                      ? 'bg-accent text-white rounded-br-md'
                      : 'bg-white shadow-sm rounded-bl-md'
                  }`}
                >
                  <div 
                    className="text-sm leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: formatContent(msg.content) }}
                  />
                  
                  {/* Product Actions */}
                  {msg.actions && msg.actions.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-100 space-y-2">
                      {msg.actions.map((action, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleAddToCart(action)}
                          className="w-full flex items-center justify-between gap-2 bg-accent/10 hover:bg-accent/20 text-accent rounded-lg px-3 py-2 text-sm font-medium transition-colors"
                        >
                          <span className="flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Agregar {action.productName}
                          </span>
                          <span className="text-xs">{formatMXN(action.price)}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white shadow-sm rounded-2xl rounded-bl-md px-4 py-3">
                  <div className="flex items-center gap-2 text-muted">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-muted/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 bg-muted/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 bg-muted/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                    <span className="text-xs">Pensando...</span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="p-4 bg-white border-t border-hairline">
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Escribe tu mensaje..."
                disabled={isLoading}
                className="flex-1 px-4 py-3 bg-gray-100 rounded-full text-sm outline-none focus:ring-2 focus:ring-accent/30 disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="w-11 h-11 bg-accent hover:bg-accent-dark disabled:opacity-50 disabled:hover:bg-accent text-white rounded-full flex items-center justify-center transition-colors"
                aria-label="Enviar mensaje"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
            <p className="text-[10px] text-muted text-center mt-2">
              Powered by MUÑEK AI • Pregunta lo que quieras
            </p>
          </form>
        </div>
      </div>
    </>
  )
}
