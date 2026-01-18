import { createContext } from 'react'

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

export type AuthContextType = {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  register: (data: RegisterData) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  updateProfile: (data: Partial<User>) => void
  deleteAccount: () => void
  deleteUser: (userId: string) => boolean
}

export type RegisterData = {
  email: string
  password: string
  name: string
  phone?: string
}

export const AuthContext = createContext<AuthContextType | null>(null)
