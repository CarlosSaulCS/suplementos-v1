import { createContext } from 'react'
import type { CartLine } from './cart'

export type CartState = {
  cartOpen: boolean
  setCartOpen: (open: boolean) => void

  lines: CartLine[]
  totalItems: number
  subtotal: number

  add: (variantId: string, qty?: number) => void
  remove: (variantId: string) => void
  setQty: (variantId: string, qty: number) => void
  clear: () => void
}

export const CartContext = createContext<CartState | null>(null)
