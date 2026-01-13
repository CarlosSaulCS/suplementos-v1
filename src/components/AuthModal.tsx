import { useState } from 'react'

type Props = {
  open: boolean
  onClose: () => void
}

type AuthMode = 'login' | 'register' | 'forgot'

export function AuthModal({ open, onClose }: Props) {
  const [mode, setMode] = useState<AuthMode>('login')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // Form fields
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const resetForm = () => {
    setEmail('')
    setPassword('')
    setName('')
    setConfirmPassword('')
    setMessage(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    // Simulación de API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    if (mode === 'login') {
      if (email && password) {
        setMessage({ type: 'success', text: '¡Bienvenido! Iniciando sesión...' })
        setTimeout(() => {
          onClose()
          resetForm()
        }, 1500)
      } else {
        setMessage({ type: 'error', text: 'Por favor completa todos los campos' })
      }
    } else if (mode === 'register') {
      if (!name || !email || !password || !confirmPassword) {
        setMessage({ type: 'error', text: 'Por favor completa todos los campos' })
      } else if (password !== confirmPassword) {
        setMessage({ type: 'error', text: 'Las contraseñas no coinciden' })
      } else if (password.length < 6) {
        setMessage({ type: 'error', text: 'La contraseña debe tener al menos 6 caracteres' })
      } else {
        setMessage({ type: 'success', text: '¡Cuenta creada! Revisa tu correo para verificar.' })
        setTimeout(() => {
          setMode('login')
          resetForm()
        }, 2000)
      }
    } else if (mode === 'forgot') {
      if (email) {
        setMessage({ type: 'success', text: 'Te enviamos un correo para restablecer tu contraseña.' })
      } else {
        setMessage({ type: 'error', text: 'Ingresa tu correo electrónico' })
      }
    }

    setLoading(false)
  }

  const switchMode = (newMode: AuthMode) => {
    setMode(newMode)
    setMessage(null)
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className={
          'fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ' +
          (open ? 'opacity-100' : 'pointer-events-none opacity-0')
        }
        onClick={onClose}
        onKeyDown={(e) => e.key === 'Escape' && onClose()}
        role="button"
        tabIndex={open ? 0 : -1}
        aria-label="Cerrar"
      />

      {/* Modal */}
      <div
        className={
          'fixed left-1/2 top-1/2 z-50 w-[min(440px,95vw)] -translate-x-1/2 -translate-y-1/2 transform transition-all duration-300 ' +
          (open ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none')
        }
      >
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="relative bg-fg text-white p-6 text-center">
            <button
              type="button"
              onClick={onClose}
              className="absolute right-4 top-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
              aria-label="Cerrar"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <img src="/splementos.png" alt="Muñek" className="h-12 mx-auto mb-3" />
            <h2 className="text-xl font-bold">
              {mode === 'login' && 'Iniciar Sesión'}
              {mode === 'register' && 'Crear Cuenta'}
              {mode === 'forgot' && 'Recuperar Contraseña'}
            </h2>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {message && (
              <div
                className={
                  'p-3 rounded-lg text-sm ' +
                  (message.type === 'success'
                    ? 'bg-green-50 text-green-700 border border-green-200'
                    : 'bg-red-50 text-red-700 border border-red-200')
                }
              >
                {message.text}
              </div>
            )}

            {mode === 'register' && (
              <div>
                <label htmlFor="name" className="block text-xs text-muted mb-1.5 tracking-wide">
                  NOMBRE COMPLETO
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 border border-hairline rounded-lg focus:outline-none focus:border-fg transition-colors"
                  placeholder="Tu nombre"
                />
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-xs text-muted mb-1.5 tracking-wide">
                CORREO ELECTRÓNICO
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-hairline rounded-lg focus:outline-none focus:border-fg transition-colors"
                placeholder="tu@email.com"
              />
            </div>

            {mode !== 'forgot' && (
              <div>
                <label htmlFor="password" className="block text-xs text-muted mb-1.5 tracking-wide">
                  CONTRASEÑA
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-hairline rounded-lg focus:outline-none focus:border-fg transition-colors"
                  placeholder="••••••••"
                />
              </div>
            )}

            {mode === 'register' && (
              <div>
                <label htmlFor="confirmPassword" className="block text-xs text-muted mb-1.5 tracking-wide">
                  CONFIRMAR CONTRASEÑA
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-hairline rounded-lg focus:outline-none focus:border-fg transition-colors"
                  placeholder="••••••••"
                />
              </div>
            )}

            {mode === 'login' && (
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => switchMode('forgot')}
                  className="text-sm text-accent hover:underline"
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-fg text-white font-medium py-3.5 rounded-lg hover:bg-fg/90 transition-colors disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Procesando...
                </span>
              ) : (
                <>
                  {mode === 'login' && 'Iniciar Sesión'}
                  {mode === 'register' && 'Crear Cuenta'}
                  {mode === 'forgot' && 'Enviar Correo'}
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="px-6 pb-6 text-center text-sm text-muted">
            {mode === 'login' && (
              <p>
                ¿No tienes cuenta?{' '}
                <button type="button" onClick={() => switchMode('register')} className="text-accent hover:underline font-medium">
                  Regístrate
                </button>
              </p>
            )}
            {mode === 'register' && (
              <p>
                ¿Ya tienes cuenta?{' '}
                <button type="button" onClick={() => switchMode('login')} className="text-accent hover:underline font-medium">
                  Inicia sesión
                </button>
              </p>
            )}
            {mode === 'forgot' && (
              <p>
                <button type="button" onClick={() => switchMode('login')} className="text-accent hover:underline font-medium">
                  ← Volver a iniciar sesión
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
