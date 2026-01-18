import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { catalog } from '../app/catalog'
import { useCart } from '../app/useCart'
import { formatMXN } from '../app/money'
import { CartDrawer } from '../components/CartDrawer'
import { Navbar } from '../components/Navbar'

export function ProductPage() {
  const { productId } = useParams<{ productId: string }>()
  const navigate = useNavigate()
  const cart = useCart()
  
  const product = catalog.find(p => p.id === productId)
  
  const [selectedVariant, setSelectedVariant] = useState(product?.variants[0] ?? null)
  const [quantity, setQuantity] = useState(1)
  const [addedToCart, setAddedToCart] = useState(false)

  if (!product) {
    return (
      <div className="min-h-dvh flex flex-col">
        <Navbar
          cartCount={cart.totalItems}
          onOpenCart={() => cart.setCartOpen(true)}
          onOpenMenu={() => {}}
          onOpenSearch={() => {}}
        />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Producto no encontrado</h1>
            <Link to="/" className="text-accent hover:underline">
              ← Volver al catálogo
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const handleAddToCart = () => {
    if (selectedVariant && selectedVariant.inStock) {
      cart.add(selectedVariant.id, quantity)
      setAddedToCart(true)
      setTimeout(() => setAddedToCart(false), 2000)
    }
  }

  const handleBuyNow = () => {
    if (selectedVariant && selectedVariant.inStock) {
      cart.add(selectedVariant.id, quantity)
      navigate('/checkout')
    }
  }

  // Get related products (same category)
  const relatedProducts = catalog
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4)

  return (
    <div className="min-h-dvh bg-white">
      <Navbar
        cartCount={cart.totalItems}
        onOpenCart={() => cart.setCartOpen(true)}
        onOpenMenu={() => {}}
        onOpenSearch={() => {}}
      />

      {/* Breadcrumb */}
      <div className="max-w-6xl mx-auto px-6 py-4">
        <nav className="text-sm text-muted">
          <Link to="/" className="hover:text-fg">Inicio</Link>
          <span className="mx-2">/</span>
          <Link to={`/?categoria=${product.category}`} className="hover:text-fg">{product.category}</Link>
          <span className="mx-2">/</span>
          <span className="text-fg">{product.name}</span>
        </nav>
      </div>

      {/* Product Detail */}
      <main className="max-w-6xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="aspect-square rounded-2xl overflow-hidden">
            <div 
              className="w-full h-full bg-linear-to-br from-gray-200 to-gray-50"
            />
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <div className="text-sm text-muted tracking-widest mb-2">{product.brand}</div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{product.name}</h1>
            
            {/* Rating placeholder */}
            <div className="flex items-center gap-2 mb-6">
              <div className="flex text-yellow-400">
                {'★★★★★'.split('').map((star, i) => (
                  <span key={i}>{star}</span>
                ))}
              </div>
              <span className="text-sm text-muted">(24 reseñas)</span>
            </div>

            {/* Price */}
            <div className="mb-6">
              <span className="text-3xl font-bold text-accent">
                {selectedVariant ? formatMXN(selectedVariant.price) : formatMXN(product.variants[0].price)}
              </span>
              {selectedVariant && !selectedVariant.inStock && (
                <span className="ml-3 text-sm text-red-500">Agotado</span>
              )}
            </div>

            {/* Variants */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-3">Presentación</label>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((variant) => (
                  <button
                    key={variant.id}
                    type="button"
                    onClick={() => setSelectedVariant(variant)}
                    className={`px-4 py-2 rounded-lg border transition-all ${
                      selectedVariant?.id === variant.id
                        ? 'border-accent bg-accent/10 text-accent'
                        : 'border-hairline hover:border-gray-300'
                    } ${!variant.inStock ? 'opacity-50 line-through' : ''}`}
                  >
                    {variant.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="mb-8">
              <label className="block text-sm font-medium mb-3">Cantidad</label>
              <div className="flex items-center border border-hairline rounded-lg w-fit">
                <button
                  type="button"
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="w-12 h-12 flex items-center justify-center text-muted hover:text-fg text-xl"
                >
                  −
                </button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(q => Math.min(10, q + 1))}
                  className="w-12 h-12 flex items-center justify-center text-muted hover:text-fg text-xl"
                >
                  +
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={!selectedVariant?.inStock}
                className={`flex-1 py-4 px-6 rounded-lg font-semibold transition-all ${
                  selectedVariant?.inStock
                    ? 'bg-fg text-white hover:bg-fg/90'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                {addedToCart ? '✓ Agregado al carrito' : 'Agregar al carrito'}
              </button>
              <button
                type="button"
                onClick={handleBuyNow}
                disabled={!selectedVariant?.inStock}
                className={`flex-1 py-4 px-6 rounded-lg font-semibold transition-all ${
                  selectedVariant?.inStock
                    ? 'bg-accent text-white hover:bg-accent/90'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                Comprar ahora
              </button>
            </div>

            {/* Features */}
            <div className="border-t border-hairline pt-6 space-y-4">
              <div className="flex items-center gap-3 text-sm">
                <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Envío gratis en pedidos mayores a $999</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Producto 100% original</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Entrega en 24-72 horas</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Description */}
        <section className="mt-16 border-t border-hairline pt-12">
          <h2 className="text-2xl font-bold mb-6">Descripción del producto</h2>
          <div className="prose max-w-none text-muted">
            <p>
              {product.name} de {product.brand} es uno de los suplementos más populares en su categoría. 
              Formulado con ingredientes de alta calidad para ayudarte a alcanzar tus objetivos fitness.
            </p>
            <p className="mt-4">
              Ideal para {product.category === 'Proteína' ? 'la recuperación muscular y el crecimiento' :
                product.category === 'Creatina' ? 'aumentar la fuerza y potencia muscular' :
                product.category === 'Pre-entreno' ? 'maximizar tu rendimiento en el gimnasio' :
                product.category === 'Aminoácidos' ? 'la recuperación y síntesis proteica' :
                'aumentar tu masa muscular de forma efectiva'}.
            </p>
          </div>
        </section>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-16 border-t border-hairline pt-12">
            <h2 className="text-2xl font-bold mb-8">Productos relacionados</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <Link
                  key={p.id}
                  to={`/producto/${p.id}`}
                  className="group"
                >
                  <div 
                    className="aspect-square rounded-xl mb-3 transition-transform group-hover:scale-105 bg-linear-to-br from-gray-200 to-gray-50"
                  />
                  <div className="text-xs text-muted">{p.brand}</div>
                  <div className="font-medium text-sm truncate">{p.name}</div>
                  <div className="text-accent font-semibold">{formatMXN(p.variants[0].price)}</div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Footer mini */}
      <footer className="bg-fg text-white py-8">
        <div className="max-w-6xl mx-auto px-6 text-center text-white/60 text-sm">
          © {new Date().getFullYear()} MUÑEK SUPLEMENTOS. Todos los derechos reservados.
        </div>
      </footer>

      <CartDrawer
        open={cart.cartOpen}
        onClose={() => cart.setCartOpen(false)}
      />
    </div>
  )
}
