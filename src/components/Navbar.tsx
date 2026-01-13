type Props = {
  cartCount: number
  onOpenCart: () => void
  onOpenMenu: () => void
  onOpenSearch: () => void
  onOpenAuth: () => void
}

export function Navbar({ cartCount, onOpenCart, onOpenMenu, onOpenSearch, onOpenAuth }: Props) {
  return (
    <header className="sticky top-0 z-40 bg-fg/95 backdrop-blur-md text-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Left: Menu button */}
          <button
            type="button"
            onClick={onOpenMenu}
            className="group flex items-center gap-3 hover:opacity-80 transition-all"
            aria-label="Abrir menú"
          >
            <div className="relative w-6 h-5 flex flex-col justify-between">
              <span className="block h-[1.5px] w-full bg-white transition-transform group-hover:translate-x-1" />
              <span className="block h-[1.5px] w-4 bg-white transition-transform group-hover:w-full" />
              <span className="block h-[1.5px] w-full bg-white transition-transform group-hover:-translate-x-1" />
            </div>
          </button>

          {/* Center: Logo + Brand Name */}
          <a href="/" className="absolute left-1/2 -translate-x-1/2 flex items-center gap-3 transition-transform hover:scale-[1.02]">
            <img
              src="/splementos.png"
              alt="Muñek Suplementos"
              className="h-16 w-auto"
            />
            <div className="hidden sm:flex flex-col leading-none">
              <span className="text-xl font-black tracking-tight">
                MUÑEK
              </span>
              <span className="text-[10px] font-medium tracking-[0.3em] text-accent">
                SUPLEMENTOS
              </span>
            </div>
          </a>

          {/* Right: Icons */}
          <div className="flex items-center gap-5">
            <button
              type="button"
              onClick={onOpenSearch}
              className="hover:opacity-70 transition-opacity p-1"
              aria-label="Buscar"
            >
              <svg className="w-5.5 h-5.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            
            <button
              type="button"
              onClick={onOpenAuth}
              className="hover:opacity-70 transition-opacity p-1 hidden sm:block"
              aria-label="Mi cuenta"
            >
              <svg className="w-5.5 h-5.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </button>

            <button
              type="button"
              onClick={onOpenCart}
              className="relative hover:opacity-70 transition-opacity p-1"
              aria-label="Carrito"
            >
              <svg className="w-5.5 h-5.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 bg-accent text-[10px] font-semibold rounded-full flex items-center justify-center">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
