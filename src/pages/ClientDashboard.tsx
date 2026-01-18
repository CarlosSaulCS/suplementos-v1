import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../app/useAuth'
import { getOrdersByUser, getStatusLabel, getStatusColor, type Order } from '../app/orders'
import { formatMXN } from '../app/money'

type Tab = 'orders' | 'profile'

export function ClientDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('orders')
  const { user, logout, updateProfile, deleteAccount } = useAuth()
  const navigate = useNavigate()

  const orders = user ? getOrdersByUser(user.id) : []

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const handleDeleteAccount = () => {
    if (confirm('¿Estás seguro de eliminar tu cuenta? Se borrarán todos tus datos permanentemente. Esta acción no se puede deshacer.')) {
      deleteAccount()
      navigate('/')
    }
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-hairline sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img src="/splementos.png" alt="MUÑEK" className="h-10 w-10 object-contain" />
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight text-fg">MUÑEK</span>
              <span className="text-[8px] tracking-[0.15em] text-accent font-medium">SUPLEMENTOS</span>
            </div>
          </Link>

          <div className="flex items-center gap-4">
            <Link to="/" className="text-sm text-muted hover:text-fg transition-colors">
              ← Volver a la tienda
            </Link>
            <button
              onClick={handleLogout}
              className="text-sm text-red-600 hover:text-red-700 font-medium"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-fg">¡Hola, {user.name.split(' ')[0]}! 👋</h1>
          <p className="text-muted">Bienvenido a tu panel de cliente</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
              activeTab === 'orders'
                ? 'bg-accent text-white'
                : 'bg-white text-muted hover:text-fg'
            }`}
          >
            Mis Pedidos
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
              activeTab === 'profile'
                ? 'bg-accent text-white'
                : 'bg-white text-muted hover:text-fg'
            }`}
          >
            Mi Perfil
          </button>
        </div>

        {/* Content */}
        {activeTab === 'orders' && <OrdersTab orders={orders} />}
        {activeTab === 'profile' && <ProfileTab user={user} updateProfile={updateProfile} onDeleteAccount={handleDeleteAccount} />}
      </div>
    </div>
  )
}

function OrdersTab({ orders }: { orders: Order[] }) {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-12 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-fg mb-2">No tienes pedidos aún</h3>
        <p className="text-muted mb-6">¡Empieza a comprar y verás tus pedidos aquí!</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-accent hover:bg-accent-dark text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          Explorar productos
        </Link>
      </div>
    )
  }

  return (
    <>
      <div className="bg-white rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-hairline">
              <tr>
                <th className="text-left text-xs font-semibold text-muted uppercase tracking-wider px-6 py-4">Pedido</th>
                <th className="text-left text-xs font-semibold text-muted uppercase tracking-wider px-6 py-4">Fecha</th>
                <th className="text-left text-xs font-semibold text-muted uppercase tracking-wider px-6 py-4">Productos</th>
                <th className="text-left text-xs font-semibold text-muted uppercase tracking-wider px-6 py-4">Total</th>
                <th className="text-left text-xs font-semibold text-muted uppercase tracking-wider px-6 py-4">Estado</th>
                <th className="text-right text-xs font-semibold text-muted uppercase tracking-wider px-6 py-4">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-hairline">
              {orders.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <span className="font-mono text-sm font-medium">{order.id}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted">
                    {order.createdAt.toLocaleDateString('es-MX', { 
                      day: 'numeric', 
                      month: 'short', 
                      year: 'numeric' 
                    })}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {order.items.length} producto{order.items.length !== 1 ? 's' : ''}
                  </td>
                  <td className="px-6 py-4 font-semibold">
                    {formatMXN(order.total)}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {getStatusLabel(order.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="text-accent hover:text-accent-dark text-sm font-medium"
                    >
                      Ver detalle
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <OrderDetailModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
      )}
    </>
  )
}

function OrderDetailModal({ order, onClose }: { order: Order; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-hairline px-6 py-4 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-lg">Pedido {order.id}</h3>
            <p className="text-sm text-muted">
              {order.createdAt.toLocaleDateString('es-MX', { 
                day: 'numeric', 
                month: 'long', 
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-gray-100 rounded-lg"
            title="Cerrar"
            aria-label="Cerrar detalle del pedido"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Status */}
          <div className="flex items-center gap-3">
            <span className={`inline-flex px-3 py-1.5 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
              {getStatusLabel(order.status)}
            </span>
          </div>

          {/* Products */}
          <div>
            <h4 className="font-semibold mb-3">Productos</h4>
            <div className="space-y-3">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                  <img src={item.image} alt={item.productName} className="w-16 h-16 object-cover rounded-lg" />
                  <div className="flex-1">
                    <p className="font-medium text-sm">{item.productName}</p>
                    <p className="text-xs text-muted">{item.variantLabel}</p>
                    <p className="text-sm mt-1">
                      {item.quantity} x {formatMXN(item.price)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Address */}
          <div>
            <h4 className="font-semibold mb-2">Dirección de envío</h4>
            <p className="text-sm text-muted">{order.shippingAddress}</p>
            <p className="text-sm text-muted">Tel: {order.phone}</p>
          </div>

          {/* Totals */}
          <div className="border-t border-hairline pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted">Subtotal</span>
              <span>{formatMXN(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted">Envío</span>
              <span>{order.shipping === 0 ? 'Gratis' : formatMXN(order.shipping)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg pt-2 border-t border-hairline">
              <span>Total</span>
              <span>{formatMXN(order.total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ProfileTab({ user, updateProfile, onDeleteAccount }: { 
  user: NonNullable<ReturnType<typeof useAuth>['user']>
  updateProfile: (data: Partial<typeof user>) => void
  onDeleteAccount: () => void 
}) {
  const [name, setName] = useState(user.name)
  const [phone, setPhone] = useState(user.phone || '')
  const [address, setAddress] = useState(user.address || '')
  const [isSaved, setIsSaved] = useState(false)

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    updateProfile({ name, phone, address })
    setIsSaved(true)
    setTimeout(() => setIsSaved(false), 2000)
  }

  return (
    <div className="bg-white rounded-2xl p-6 max-w-xl">
      <h2 className="text-lg font-bold mb-6">Información personal</h2>

      <form onSubmit={handleSave} className="space-y-4">
        <div>
          <label htmlFor="profile-name" className="block text-sm font-medium text-fg mb-1">
            Nombre completo
          </label>
          <input
            id="profile-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 border border-hairline rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
          />
        </div>

        <div>
          <label htmlFor="profile-email" className="block text-sm font-medium text-fg mb-1">
            Correo electrónico
          </label>
          <input
            id="profile-email"
            type="email"
            value={user.email}
            disabled
            className="w-full px-4 py-3 border border-hairline rounded-lg bg-gray-50 text-muted cursor-not-allowed"
          />
          <p className="text-xs text-muted mt-1">El correo no se puede cambiar</p>
        </div>

        <div>
          <label htmlFor="profile-phone" className="block text-sm font-medium text-fg mb-1">
            Teléfono
          </label>
          <input
            id="profile-phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-4 py-3 border border-hairline rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
            placeholder="222 123 4567"
          />
        </div>

        <div>
          <label htmlFor="profile-address" className="block text-sm font-medium text-fg mb-1">
            Dirección de envío predeterminada
          </label>
          <textarea
            id="profile-address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            rows={3}
            className="w-full px-4 py-3 border border-hairline rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent resize-none"
            placeholder="Calle, número, colonia, ciudad, CP"
          />
        </div>

        <div className="pt-4 flex items-center gap-4">
          <button
            type="submit"
            className="bg-accent hover:bg-accent-dark text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Guardar cambios
          </button>
          {isSaved && (
            <span className="text-green-600 text-sm font-medium">✓ Guardado</span>
          )}
        </div>
      </form>

      {/* Account info */}
      <div className="mt-8 pt-6 border-t border-hairline">
        <h3 className="font-semibold mb-2">Información de la cuenta</h3>
        <p className="text-sm text-muted">
          Miembro desde: {user.createdAt.toLocaleDateString('es-MX', { month: 'long', year: 'numeric' })}
        </p>
      </div>

      {/* Danger zone */}
      <div className="mt-8 pt-6 border-t border-red-200">
        <h3 className="font-semibold text-red-600 mb-2">Zona de peligro</h3>
        <p className="text-sm text-muted mb-4">
          Al eliminar tu cuenta, se borrarán permanentemente todos tus datos. Esta acción no se puede deshacer.
        </p>
        <button
          type="button"
          onClick={onDeleteAccount}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm"
        >
          Eliminar mi cuenta
        </button>
      </div>
    </div>
  )
}
