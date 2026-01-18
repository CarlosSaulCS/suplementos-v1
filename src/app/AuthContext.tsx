import { useState, useSyncExternalStore, type ReactNode } from 'react'
import { AuthContext, type User, type RegisterData } from './authTypes'

// Re-export types for backwards compatibility
export type { User, UserRole, AuthContextType, RegisterData } from './authTypes'
export { AuthContext } from './authTypes'

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

// Helper to read initial user from localStorage
function getInitialUser(): User | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      return {
        ...parsed,
        createdAt: new Date(parsed.createdAt),
      }
    }
  } catch {
    // ignore
  }
  return null
}

// Storage subscription for useSyncExternalStore
let listeners: (() => void)[] = []
function subscribe(callback: () => void) {
  listeners.push(callback)
  return () => {
    listeners = listeners.filter(l => l !== callback)
  }
}
function getSnapshot() {
  return localStorage.getItem(STORAGE_KEY)
}
function emitChange() {
  listeners.forEach(l => l())
}

export function AuthProvider({ children }: { children: ReactNode }) {
  // Use useSyncExternalStore to avoid setState in effect
  const storedUser = useSyncExternalStore(subscribe, getSnapshot, () => null)
  const [user, setUser] = useState<User | null>(() => getInitialUser())
  const [isLoading] = useState(false)

  // Sync user state when storage changes
  const syncUser = (newUser: User | null) => {
    setUser(newUser)
    if (newUser) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser))
    } else {
      localStorage.removeItem(STORAGE_KEY)
    }
    emitChange()
  }
  
  // Keep storedUser reference to track changes
  void storedUser

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

    syncUser(userToStore)

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
    syncUser(userWithoutPassword)

    return { success: true }
  }

  const logout = () => {
    syncUser(null)
  }

  const updateProfile = (data: Partial<User>) => {
    if (!user) return

    const updatedUser = { ...user, ...data }
    syncUser(updatedUser)

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
