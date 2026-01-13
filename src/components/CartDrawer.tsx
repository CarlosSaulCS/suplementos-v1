import { useMemo } from 'react'
import { catalogLookup } from '../app/catalog'
import { useCart } from '../app/useCart'
import { formatMXN } from '../app/money'

type Props = {
  open: boolean
  onClose: () => void
}

function clampInt(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, Math.floor(value)))
}

export function CartDrawer({ open, onClose }: Props) {
  const cart = useCart()

  const lines = useMemo(() => {
    return cart.lines
      .map((l) => {
        const hit = catalogLookup.byVariantId[l.variantId]
        if (!hit) return null
        return { ...l, product: hit.product, variant: hit.variant }
      })
      .filter(Boolean)
  }, [cart.lines]) as Array<{
    variantId: string
    qty: number
    product: (typeof catalogLookup.byVariantId)[string]['product']
    variant: (typeof catalogLookup.byVariantId)[string]['variant']
  }>

  return (
    <>
      {/* Backdrop */}
      <div
        className={
          'fixed inset-0 z-50 bg-black/50 transition-opacity duration-300 ' +
          (open ? 'opacity-100' : 'pointer-events-none opacity-0')
        }
        onClick={onClose}
        role="button"
        tabIndex={-1}
        aria-label="Cerrar carrito"
      />

      {/* Drawer */}
      <aside
        className={
          'fixed right-0 top-0 z-50 h-dvh w-[min(440px,92vw)] bg-white shadow-2xl transform transition-transform duration-300 ' +
          (open ? 'translate-x-0' : 'translate-x-full')
        }
        aria-label="Carrito de compras"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-hairline">
            <div>
              <h2 className="text-lg font-semibold">Carrito</h2>
              <p className="text-sm text-muted">
                {cart.totalItems} artículo{cart.totalItems === 1 ? '' : 's'}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Cerrar carrito"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Items */}
          <div className="flex-1 overflow-auto p-6">
            {lines.length === 0 ? (
              <div className="text-center py-12">
                <svg className="w-16 h-16 mx-auto text-gray-200 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <p className="text-muted">Tu carrito está vacío</p>
                <button
                  type="button"
                  onClick={onClose}
                  className="mt-4 text-sm font-semibold text-accent hover:underline"
                >
                  Continuar comprando
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {lines.map((l) => (
                  <div
                    key={l.variantId}
                    className="flex gap-4 p-4 bg-gray-50 rounded-xl"
                  >
                    {/* Product color swatch */}
                    <div
                      className="w-20 h-20 rounded-lg shrink-0"
                      style={{
                        background: `linear-gradient(135deg, ${l.product.image.a}, ${l.product.image.b})`,
                      }}
                    />

                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-muted tracking-widest">
                        {l.product.brand}
                      </div>
                      <h4 className="font-medium text-sm leading-tight truncate">
                        {l.product.name}
                      </h4>
                      <p className="text-xs text-muted mt-0.5">
                        {l.variant.label}
                      </p>

                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center border border-hairline rounded-lg bg-white">
                          <button
                            type="button"
                            onClick={() => {
                              if (l.qty <= 1) {
                                cart.remove(l.variantId)
                              } else {
                                cart.setQty(l.variantId, clampInt(l.qty - 1, 1, 99))
                              }
                            }}
                            className="w-8 h-8 flex items-center justify-center text-muted hover:text-fg"
                            aria-label="Disminuir"
                          >
                            −
                          </button>
                          <span className="w-6 text-center text-sm font-medium">
                            {l.qty}
                          </span>
                          <button
                            type="button"
                            onClick={() => cart.setQty(l.variantId, clampInt(l.qty + 1, 1, 99))}
                            className="w-8 h-8 flex items-center justify-center text-muted hover:text-fg"
                            aria-label="Aumentar"
                          >
                            +
                          </button>
                        </div>

                        <div className="text-right">
                          <div className="font-semibold">
                            {formatMXN(l.variant.price * l.qty)}
                          </div>
                          {l.qty > 1 && (
                            <div className="text-xs text-muted">
                              {formatMXN(l.variant.price)} c/u
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => cart.remove(l.variantId)}
                      className="self-start p-1 text-muted hover:text-fg"
                      aria-label="Eliminar producto"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {lines.length > 0 && (
            <div className="p-6 border-t border-hairline bg-gray-50">
              <div className="flex items-center justify-between mb-4">
                <span className="text-muted">Subtotal</span>
                <span className="text-xl font-bold">{formatMXN(cart.subtotal)}</span>
              </div>
              <p className="text-xs text-muted mb-4">
                Envío calculado al finalizar la compra
              </p>
              <button
                type="button"
                className="w-full bg-fg text-white font-semibold py-4 rounded-lg hover:bg-fg/90 transition-colors tracking-wide"
                onClick={() => alert('Checkout: conecta Stripe/MercadoPago aquí.')}
              >
                FINALIZAR COMPRA
              </button>
              <button
                type="button"
                onClick={() => cart.clear()}
                className="w-full mt-2 text-sm text-muted hover:text-fg transition-colors py-2"
              >
                Vaciar carrito
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  )
}
