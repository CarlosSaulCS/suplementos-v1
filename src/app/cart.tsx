import React, { useEffect, useMemo, useState } from 'react'
import { catalogLookup } from './catalog'
import { CartContext, type CartState } from './CartContext'

export type CartLine = {
  variantId: string
  qty: number
}

const STORAGE_KEY = 'munek.cart.v1'

function clampInt(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, Math.floor(value)))
}

function readStoredLines(): CartLine[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return []
    return parsed
      .map((x: unknown) => {
        if (!x || typeof x !== 'object') return null
        const record = x as Record<string, unknown>
        const v = record.variantId
        const q = record.qty
        if (typeof v !== 'string') return null
        if (typeof q !== 'number') return null
        if (!catalogLookup.byVariantId[v]) return null
        return { variantId: v, qty: clampInt(q, 1, 99) } satisfies CartLine
      })
      .filter(Boolean) as CartLine[]
  } catch {
    return []
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartOpen, setCartOpen] = useState(false)
  const [lines, setLines] = useState<CartLine[]>(() => {
    if (typeof window === 'undefined') return []
    return readStoredLines()
  })

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lines))
    } catch {
      // ignore
    }
  }, [lines])

  const totalItems = useMemo(
    () => lines.reduce((sum, l) => sum + l.qty, 0),
    [lines],
  )

  const subtotal = useMemo(() => {
    return lines.reduce((sum, l) => {
      const hit = catalogLookup.byVariantId[l.variantId]
      if (!hit) return sum
      return sum + hit.variant.price * l.qty
    }, 0)
  }, [lines])

  const api: CartState = useMemo(
    () => ({
      cartOpen,
      setCartOpen,
      lines,
      totalItems,
      subtotal,
      add: (variantId, qty = 1) => {
        const hit = catalogLookup.byVariantId[variantId]
        if (!hit || !hit.variant.inStock) return
        const addQty = clampInt(qty, 1, 99)
        setLines((prev) => {
          const i = prev.findIndex((l) => l.variantId === variantId)
          if (i === -1) return [...prev, { variantId, qty: addQty }]
          const next = prev.slice()
          next[i] = { ...next[i], qty: clampInt(next[i].qty + addQty, 1, 99) }
          return next
        })
        setCartOpen(true)
      },
      remove: (variantId) => {
        setLines((prev) => prev.filter((l) => l.variantId !== variantId))
      },
      setQty: (variantId, qty) => {
        const nextQty = clampInt(qty, 1, 99)
        setLines((prev) =>
          prev.map((l) => (l.variantId === variantId ? { ...l, qty: nextQty } : l)),
        )
      },
      clear: () => setLines([]),
    }),
    [cartOpen, lines, subtotal, totalItems],
  )

  return <CartContext.Provider value={api}>{children}</CartContext.Provider>
}
