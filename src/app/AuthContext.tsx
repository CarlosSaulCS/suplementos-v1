import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

export type UserRole = 'admin' | 'client'

export type User = {
  id: string
  email: string
  name: string
  role: UserRole
  phone?: string
  address?: string
  createdAt: Date
}

type AuthContextType = {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  register: (data: RegisterData) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  updateProfile: (data: Partial<User>) => void
}

type RegisterData = {
  email: string
  password: string
  name: string
  phone?: string
}

const AuthContext = createContext<AuthContextType | null>(null)

const STORAGE_KEY = 'munek.auth'
const USERS_KEY = 'munek.users'

// Admin por defecto
const DEFAULT_ADMIN: User & { password: string } = {
  id: 'admin-001',
  email: 'admin@munek.com',
  password: 'admin123',
  name: 'Administrador',
  role: 'admin',
  createdAt: new Date('2024-01-01'),
}

function getStoredUsers(): (User & { password: string })[] {
  try {
    const stored = localStorage.getItem(USERS_KEY)
    if (stored) {
      const users = JSON.parse(stored)
      // Ensure admin exists
      const hasAdmin = users.some((u: User) => u.email === DEFAULT_ADMIN.email)
      if (!hasAdmin) {
        users.push(DEFAULT_ADMIN)
        localStorage.setItem(USERS_KEY, JSON.stringify(users))
      }
      return users
    }
  } catch {
    // ignore
  }
  // Initialize with admin
  localStorage.setItem(USERS_KEY, JSON.stringify([DEFAULT_ADMIN]))
  return [DEFAULT_ADMIN]
}

function saveUsers(users: (User & { password: string })[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load user from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        setUser({
          ...parsed,
          createdAt: new Date(parsed.createdAt),
        })
      }
    } catch {
      // ignore
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))

    const users = getStoredUsers()
    const foundUser = users.find(u => u.email.toLowerCase() === email.toLowerCase())

    if (!foundUser) {
      return { success: false, error: 'Usuario no encontrado' }
    }

    if (foundUser.password !== password) {
      return { success: false, error: 'Contraseña incorrecta' }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userWithoutPassword } = foundUser
    const userToStore = {
      ...userWithoutPassword,
      createdAt: new Date(foundUser.createdAt),
    }

    setUser(userToStore)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userToStore))

    return { success: true }
  }

  const register = async (data: RegisterData): Promise<{ success: boolean; error?: string }> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))

    const users = getStoredUsers()

    // Check if email exists
    if (users.some(u => u.email.toLowerCase() === data.email.toLowerCase())) {
      return { success: false, error: 'Este correo ya está registrado' }
    }

    const newUser: User & { password: string } = {
      id: `user-${Date.now()}`,
      email: data.email,
      password: data.password,
      name: data.name,
      phone: data.phone,
      role: 'client',
      createdAt: new Date(),
    }

    users.push(newUser)
    saveUsers(users)

    // Auto login
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userWithoutPassword } = newUser
    setUser(userWithoutPassword)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userWithoutPassword))

    return { success: true }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem(STORAGE_KEY)
  }

  const updateProfile = (data: Partial<User>) => {
    if (!user) return

    const updatedUser = { ...user, ...data }
    setUser(updatedUser)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser))

    // Also update in users list
    const users = getStoredUsers()
    const idx = users.findIndex(u => u.id === user.id)
    if (idx !== -1) {
      users[idx] = { ...users[idx], ...data }
      saveUsers(users)
    }
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
