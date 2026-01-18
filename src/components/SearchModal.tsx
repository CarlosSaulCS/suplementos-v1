import { useEffect, useRef, useState } from 'react'
import { catalog, type Product } from '../app/catalog'
import { formatMXN } from '../app/money'

type Props = {
  open: boolean
  onClose: () => void
  onSelectProduct: (productId: string) => void
}

export function SearchModal({ open, onClose, onSelectProduct }: Props) {
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const results = query.trim().length > 0
    ? catalog.filter((p) =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.brand.toLowerCase().includes(query.toLowerCase()) ||
        p.category.toLowerCase().includes(query.toLowerCase())
      )
    : []

  // Reset query and focus input when modal opens
  useEffect(() => {
    if (open) {
      // Clear query when opening
      setQuery('')
      const timer = setTimeout(() => inputRef.current?.focus(), 100)
      return () => clearTimeout(timer)
    }
  }, [open])
  
  // Clear query when closing
  const handleClose = () => {
    setQuery('')
    onClose()
  }

  useEffect(() => {
    const onEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        setQuery('')
        onClose()
      }
    }
    window.addEventListener('keydown', onEscape)
    return () => window.removeEventListener('keydown', onEscape)
  }, [open, onClose])

  const handleSelect = (product: Product) => {
    onSelectProduct(product.id)
    handleClose()
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className={
          'fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ' +
          (open ? 'opacity-100' : 'pointer-events-none opacity-0')
        }
        onClick={handleClose}
        onKeyDown={(e) => e.key === 'Escape' && handleClose()}
        role="button"
        tabIndex={open ? 0 : -1}
        aria-label="Cerrar búsqueda"
      />

      {/* Modal */}
      <div
        className={
          'fixed left-1/2 top-4 md:top-20 z-50 w-[min(600px,95vw)] -translate-x-1/2 transform transition-all duration-300 ' +
          (open ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none')
        }
      >
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Search input */}
          <div className="flex items-center gap-4 p-4 border-b border-hairline">
            <svg className="w-5 h-5 text-muted shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar productos, marcas..."
              className="flex-1 text-lg outline-none placeholder:text-muted/50"
            />
            <button
              type="button"
              onClick={handleClose}
              className="text-xs text-muted hover:text-fg px-2 py-1 rounded bg-gray-100"
            >
              ESC
            </button>
          </div>

          {/* Results */}
          <div className="max-h-[60vh] overflow-y-auto">
            {query.trim().length === 0 ? (
              <div className="p-8 text-center text-muted">
                <svg className="w-12 h-12 mx-auto mb-4 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <p>Escribe para buscar productos</p>
              </div>
            ) : results.length === 0 ? (
              <div className="p-8 text-center text-muted">
                <p>No se encontraron resultados para "{query}"</p>
              </div>
            ) : (
              <div className="p-2">
                <p className="px-3 py-2 text-xs text-muted">
                  {results.length} resultado{results.length !== 1 ? 's' : ''}
                </p>
                {results.map((product) => (
                  <button
                    key={product.id}
                    type="button"
                    onClick={() => handleSelect(product)}
                    className="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors text-left"
                  >
                    <div
                      className="w-14 h-14 rounded-lg shrink-0 bg-gradient-to-br"
                      style={{ backgroundImage: `linear-gradient(135deg, ${product.image.a}, ${product.image.b})` }}
                      aria-hidden="true"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-muted">{product.brand}</p>
                      <p className="font-medium truncate">{product.name}</p>
                      <p className="text-sm text-accent font-semibold">
                        {formatMXN(product.variants[0]?.price ?? 0)}
                      </p>
                    </div>
                    <span className="text-xs text-muted bg-gray-100 px-2 py-1 rounded">
                      {product.category}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
