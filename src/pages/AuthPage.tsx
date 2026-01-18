import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../app/useAuth'

type AuthMode = 'login' | 'register'

export function AuthPage() {
  const [mode, setMode] = useState<AuthMode>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const { login, register } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const from = (location.state as { from?: string })?.from || '/'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      if (mode === 'login') {
        const result = await login(email, password)
        if (result.success) {
          navigate(from, { replace: true })
        } else {
          setError(result.error || 'Error al iniciar sesión')
        }
      } else {
        if (password.length < 6) {
          setError('La contraseña debe tener al menos 6 caracteres')
          setIsLoading(false)
          return
        }
        const result = await register({ email, password, name, phone })
        if (result.success) {
          navigate(from, { replace: true })
        } else {
          setError(result.error || 'Error al registrarse')
        }
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center gap-3 mb-8">
          <img src="/splementos.png" alt="MUÑEK" className="h-12 w-12 object-contain" />
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tight text-fg">MUÑEK</span>
            <span className="text-[10px] tracking-[0.2em] text-accent font-medium">SUPLEMENTOS</span>
          </div>
        </Link>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-2xl font-bold text-fg text-center mb-2">
            {mode === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta'}
          </h1>
          <p className="text-muted text-center text-sm mb-6">
            {mode === 'login' 
              ? 'Ingresa tus credenciales para continuar' 
              : 'Regístrate para comenzar a comprar'}
          </p>

          {error && (
            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-fg mb-1">
                  Nombre completo
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-hairline rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
                  placeholder="Tu nombre"
                />
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-fg mb-1">
                Correo electrónico
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-hairline rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
                placeholder="tu@email.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-fg mb-1">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-4 py-3 border border-hairline rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
                placeholder="••••••••"
              />
            </div>

            {mode === 'register' && (
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-fg mb-1">
                  Teléfono (opcional)
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-3 border border-hairline rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
                  placeholder="222 123 4567"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-accent hover:bg-accent-dark disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition-colors"
            >
              {isLoading 
                ? 'Cargando...' 
                : mode === 'login' 
                  ? 'Iniciar Sesión' 
                  : 'Crear Cuenta'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm">
            {mode === 'login' ? (
              <p className="text-muted">
                ¿No tienes cuenta?{' '}
                <button
                  type="button"
                  onClick={() => { setMode('register'); setError('') }}
                  className="text-accent hover:underline font-medium"
                >
                  Regístrate aquí
                </button>
              </p>
            ) : (
              <p className="text-muted">
                ¿Ya tienes cuenta?{' '}
                <button
                  type="button"
                  onClick={() => { setMode('login'); setError('') }}
                  className="text-accent hover:underline font-medium"
                >
                  Inicia sesión
                </button>
              </p>
            )}
          </div>

          {/* Demo credentials */}
          {mode === 'login' && (
            <div className="mt-6 pt-6 border-t border-hairline">
              <p className="text-xs text-muted text-center mb-2">Credenciales de prueba:</p>
              <div className="bg-gray-50 rounded-lg p-3 text-xs space-y-1">
                <p><strong>Admin:</strong> admin@munek.com / admin123</p>
              </div>
            </div>
          )}
        </div>

        {/* Back to home */}
        <div className="text-center mt-6">
          <Link to="/" className="text-sm text-muted hover:text-fg transition-colors">
            ← Volver a la tienda
          </Link>
        </div>
      </div>
    </div>
  )
}
