import { useMemo, useState } from 'react'
import type { Product } from '../app/catalog'
import { formatMXN } from '../app/money'

type Props = {
  product: Product
  onAdd: (variantId: string, qty: number) => void
}

function clampInt(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, Math.floor(value)))
}

export function ProductCard({ product, onAdd }: Props) {
  const defaultVariant = product.variants.find((v) => v.inStock) ?? product.variants[0]
  const [variantId, setVariantId] = useState(defaultVariant?.id ?? '')
  const [qty, setQty] = useState(1)

  const hit = useMemo(() => {
    return product.variants.find((v) => v.id === variantId) ?? defaultVariant
  }, [product.variants, variantId, defaultVariant])

  const inStock = !!hit?.inStock

  // Get unique sizes and flavors
  const sizes = [...new Set(product.variants.map((v) => v.size))]
  const flavors = [...new Set(product.variants.filter((v) => v.flavor).map((v) => v.flavor))]

  return (
    <article 
      id={`product-${product.id}`}
      className="group bg-white rounded-2xl overflow-hidden border border-hairline hover:shadow-lg transition-all duration-300"
    >
      {/* Image area with gradient */}
      <div className="relative aspect-square bg-linear-to-br from-gray-100 to-gray-50 overflow-hidden">
        <div
          className="absolute inset-0 opacity-90"
          style={{
            background: `linear-gradient(135deg, ${product.image.a} 0%, ${product.image.b} 100%)`,
          }}
        />
        
        {/* Category badge */}
        <div className="absolute top-4 left-4">
          <span className="inline-block bg-white/90 backdrop-blur text-fg text-xs font-medium px-3 py-1.5 rounded-full">
            {product.category}
          </span>
        </div>

        {/* Discount badge if applicable */}
        {hit?.compareAt && (
          <div className="absolute top-4 right-4">
            <span className="inline-block bg-accent text-white text-xs font-bold px-2 py-1 rounded">
              -{Math.round((1 - hit.price / hit.compareAt) * 100)}%
            </span>
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="text-xs text-muted tracking-widest mb-1">
          {product.brand}
        </div>
        <h3 className="font-semibold text-fg leading-tight mb-2">
          {product.name}
        </h3>
        
        {/* Price */}
        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-xl font-bold text-fg">
            {hit ? formatMXN(hit.price) : '—'}
          </span>
          {hit?.compareAt && (
            <span className="text-sm text-muted line-through">
              {formatMXN(hit.compareAt)}
            </span>
          )}
        </div>

        {/* Flavor selector (if multiple flavors) */}
        {flavors.length > 1 && (
          <div className="mb-4">
            <label className="block text-xs text-muted tracking-widest mb-2">
              SABOR
            </label>
            <div className="flex flex-wrap gap-2">
              {product.variants.map((v) => (
                <button
                  key={v.id}
                  type="button"
                  disabled={!v.inStock}
                  onClick={() => setVariantId(v.id)}
                  className={
                    'px-3 py-2 text-sm rounded-lg border transition-colors ' +
                    (v.id === variantId
                      ? 'border-fg bg-fg text-white'
                      : v.inStock
                      ? 'border-hairline hover:border-fg'
                      : 'border-hairline opacity-40 cursor-not-allowed')
                  }
                  title={v.label}
                >
                  {v.flavor || v.size}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Size selector (if single flavor or no flavors) */}
        {flavors.length <= 1 && sizes.length > 1 && (
          <div className="mb-4">
            <label className="block text-xs text-muted tracking-widest mb-2">
              TAMAÑO
            </label>
            <div className="flex flex-wrap gap-2">
              {product.variants.map((v) => (
                <button
                  key={v.id}
                  type="button"
                  disabled={!v.inStock}
                  onClick={() => setVariantId(v.id)}
                  className={
                    'px-3 py-2 text-sm rounded-lg border transition-colors ' +
                    (v.id === variantId
                      ? 'border-fg bg-fg text-white'
                      : v.inStock
                      ? 'border-hairline hover:border-fg'
                      : 'border-hairline opacity-40 cursor-not-allowed')
                  }
                >
                  {v.size}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Quantity + Add to cart */}
        <div className="flex items-center gap-3">
          <div className="flex items-center border border-hairline rounded-lg">
            <button
              type="button"
              onClick={() => setQty((q) => clampInt(q - 1, 1, 99))}
              className="w-10 h-10 flex items-center justify-center text-lg text-muted hover:text-fg transition-colors"
              aria-label="Disminuir cantidad"
            >
              −
            </button>
            <span className="w-8 text-center font-medium">{qty}</span>
            <button
              type="button"
              onClick={() => setQty((q) => clampInt(q + 1, 1, 99))}
              className="w-10 h-10 flex items-center justify-center text-lg text-muted hover:text-fg transition-colors"
              aria-label="Aumentar cantidad"
            >
              +
            </button>
          </div>

          <button
            type="button"
            disabled={!hit || !inStock}
            onClick={() => hit && onAdd(hit.id, qty)}
            className={
              'flex-1 py-3 px-4 text-sm font-semibold tracking-wide rounded-lg transition-colors ' +
              (!hit || !inStock
                ? 'bg-gray-100 text-muted cursor-not-allowed'
                : 'bg-fg text-white hover:bg-fg/90 active:scale-[0.98]')
            }
          >
            {inStock ? 'AGREGAR' : 'AGOTADO'}
          </button>
        </div>
      </div>
    </article>
  )
}
