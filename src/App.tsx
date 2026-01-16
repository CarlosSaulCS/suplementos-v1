import { useMemo, useState } from 'react'
import { CartDrawer } from './components/CartDrawer'
import { Navbar } from './components/Navbar'
import { ProductCard } from './components/ProductCard'
import { CategoryMenu } from './components/CategoryMenu.tsx'
import { SearchModal } from './components/SearchModal'
import { AuthModal } from './components/AuthModal'
import { AIAssistant } from './components/AIAssistant'
import { CartProvider } from './app/cart'
import { useCart } from './app/useCart'
import { catalog, type Category } from './app/catalog'

const CATEGORIES: Category[] = [
  'Proteína',
  'Creatina',
  'Pre-entreno',
  'Aminoácidos',
  'Ganador',
]

function AppInner() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [authOpen, setAuthOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState<Category | null>(null)
  const cart = useCart()

  const filtered = useMemo(() => {
    if (!activeCategory) return catalog
    return catalog.filter((p) => p.category === activeCategory)
  }, [activeCategory])

  return (
    <div className="min-h-dvh">
      <Navbar
        cartCount={cart.totalItems}
        onOpenCart={() => cart.setCartOpen(true)}
        onOpenMenu={() => setMenuOpen(true)}
        onOpenSearch={() => setSearchOpen(true)}
        onOpenAuth={() => setAuthOpen(true)}
      />

      <CategoryMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        categories={CATEGORIES}
        active={activeCategory}
        onSelect={(cat: Category | null) => {
          setActiveCategory(cat)
          setMenuOpen(false)
        }}
      />

      {/* Hero Section - Minimal & Dynamic */}
      <section className="relative bg-fg text-white overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-b from-black/30 via-transparent to-black/50 z-10" />
        <div className="absolute inset-0 bg-[url('/splementos.png')] bg-center bg-no-repeat opacity-[0.04] scale-150" />
        
        <div className="relative z-20 max-w-6xl mx-auto px-6 py-20 md:py-32">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 text-xs tracking-widest text-white/70 mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              ENVÍO GRATIS +$999
            </div>
            
            <h1 className="text-4xl md:text-7xl font-bold leading-[1.1] tracking-tight">
              ELEVA TUS LÍMITES
            </h1>
            <p className="mt-6 text-white/50 text-lg md:text-xl max-w-xl mx-auto">
              Suplementos premium para atletas que buscan resultados reales.
            </p>
            
            <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
              <button
                type="button"
                onClick={() => {
                  setActiveCategory(null)
                  document.getElementById('productos')?.scrollIntoView({ behavior: 'smooth' })
                }}
                className="group bg-white text-fg font-medium px-8 py-4 rounded-full transition-all hover:bg-white/90 hover:scale-105"
              >
                <span className="flex items-center justify-center gap-2">
                  Explorar
                  <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </button>
              <button
                type="button"
                onClick={() => setMenuOpen(true)}
                className="font-medium px-8 py-4 rounded-full border border-white/20 hover:border-white/40 transition-all hover:bg-white/5"
              >
                Categorías
              </button>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20">
          <div className="w-6 h-10 rounded-full border border-white/20 flex justify-center pt-2">
            <div className="w-1 h-2 bg-white/40 rounded-full animate-bounce" />
          </div>
        </div>
      </section>

      {/* Features strip - elegant & minimal */}
      <section className="bg-white border-b border-hairline">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 text-sm text-muted">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span>Pago seguro</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                </svg>
              </div>
              <span>Envío 24-72h</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <span>100% Original</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <span>Soporte 24/7</span>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <main id="productos" className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">
              {activeCategory ?? 'Todos los productos'}
            </h2>
            <p className="mt-2 text-muted">
              {filtered.length} producto{filtered.length !== 1 ? 's' : ''} disponible{filtered.length !== 1 ? 's' : ''}
            </p>
          </div>
          {activeCategory && (
            <button
              type="button"
              onClick={() => setActiveCategory(null)}
              className="text-sm text-accent hover:underline"
            >
              ← Ver todos los productos
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAdd={(variantId, qty) => cart.add(variantId, qty)}
            />
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-fg text-white">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            <div>
              <img
                src="/splementos.png"
                alt="Muñek Suplementos"
                className="h-16 w-auto brightness-0 invert mb-4"
              />
              <p className="text-white/60 text-sm leading-relaxed">
                Tu tienda de confianza en suplementos deportivos de alta calidad.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 tracking-wide">CATEGORÍAS</h4>
              <ul className="space-y-2 text-sm text-white/60">
                {CATEGORIES.map((cat) => (
                  <li key={cat}>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveCategory(cat)
                        document.getElementById('productos')?.scrollIntoView({ behavior: 'smooth' })
                      }}
                      className="hover:text-white transition-colors"
                    >
                      {cat}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 tracking-wide">INFORMACIÓN</h4>
              <ul className="space-y-2 text-sm text-white/60">
                <li>
                  <a href="#sobre-nosotros" className="hover:text-white transition-colors">
                    Sobre nosotros
                  </a>
                </li>
                <li>
                  <a href="#envios" className="hover:text-white transition-colors">
                    Envíos y devoluciones
                  </a>
                </li>
                <li>
                  <a href="#terminos" className="hover:text-white transition-colors">
                    Términos y condiciones
                  </a>
                </li>
                <li>
                  <a href="#privacidad" className="hover:text-white transition-colors">
                    Política de privacidad
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 tracking-wide">CONTACTO</h4>
              <ul className="space-y-2 text-sm text-white/60">
                <li>
                  <a href="mailto:contacto@muneksuplementos.com" className="hover:text-white transition-colors">
                    contacto@muneksuplementos.com
                  </a>
                </li>
                <li>Zacatelco, Tlaxcala</li>
              </ul>
              <div className="flex gap-4 mt-6">
                <a 
                  href="https://facebook.com/muneksuplementos" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
                <a 
                  href="https://instagram.com/muneksuplementos" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                </a>
                <a 
                  href="https://tiktok.com/@muneksuplementos" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  aria-label="TikTok"
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/></svg>
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-white/10 mt-10 pt-8 text-center text-sm text-white/40">
            © {new Date().getFullYear()} MUÑEK SUPLEMENTOS. Todos los derechos reservados.
          </div>
        </div>
      </footer>

      <CartDrawer
        open={cart.cartOpen}
        onClose={() => cart.setCartOpen(false)}
      />

      <SearchModal
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        onSelectProduct={(productId) => {
          setActiveCategory(null)
          setTimeout(() => {
            const el = document.getElementById(`product-${productId}`)
            el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
            el?.classList.add('ring-2', 'ring-accent')
            setTimeout(() => el?.classList.remove('ring-2', 'ring-accent'), 2000)
          }, 100)
        }}
      />

      <AuthModal
        open={authOpen}
        onClose={() => setAuthOpen(false)}
      />

      {/* AI Assistant */}
      <AIAssistant />

      {/* WhatsApp Button */}
      <a
        href="https://wa.me/521234567890"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center shadow-lg transition-colors"
        aria-label="Contactar por WhatsApp"
      >
        <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>
    </div>
  )
}

export default function App() {
  return (
    <CartProvider>
      <AppInner />
    </CartProvider>
  )
}
