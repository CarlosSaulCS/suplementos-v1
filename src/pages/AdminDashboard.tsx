import { useState, useEffect, type ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../app/AuthContext'
import { catalog, type Product } from '../app/catalog'
import { getOrders, updateOrderStatus, getStatusLabel, getStatusColor, type Order, type OrderStatus } from '../app/orders'
import { formatMXN } from '../app/money'

type Tab = 'overview' | 'orders' | 'products' | 'customers'

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('overview')
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (user && user.role !== 'admin') {
      navigate('/dashboard')
    }
  }, [user, navigate])

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  if (!user || user.role !== 'admin') return null

  const tabs: { id: Tab; label: string; icon: ReactNode }[] = [
    { 
      id: 'overview', 
      label: 'Resumen',
      icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
    },
    { 
      id: 'orders', 
      label: 'Pedidos',
      icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
    },
    { 
      id: 'products', 
      label: 'Productos',
      icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
    },
    { 
      id: 'customers', 
      label: 'Clientes',
      icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
    },
  ]

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-fg text-white flex flex-col fixed h-full">
        <div className="p-6 border-b border-white/10">
          <Link to="/" className="flex items-center gap-3">
            <img src="/logo.png" alt="MUÑEK" className="h-10 w-10 object-contain" />
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight">MUÑEK</span>
              <span className="text-[8px] tracking-[0.15em] text-accent font-medium">ADMIN</span>
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-4">
          <ul className="space-y-1">
            {tabs.map((tab) => (
              <li key={tab.id}>
                <button
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-accent text-white'
                      : 'text-white/70 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {tab.icon}
                  <span className="font-medium">{tab.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 px-4 py-2">
            <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center font-bold">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{user.name}</p>
              <p className="text-xs text-white/50 truncate">{user.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full mt-3 px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-white/5 rounded-lg transition-colors text-left"
          >
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 ml-64 p-8">
        <div className="max-w-6xl">
          {activeTab === 'overview' && <OverviewTab />}
          {activeTab === 'orders' && <OrdersTab />}
          {activeTab === 'products' && <ProductsTab />}
          {activeTab === 'customers' && <CustomersTab />}
        </div>
      </main>
    </div>
  )
}

function OverviewTab() {
  const orders = getOrders()
  const totalRevenue = orders.filter(o => o.status !== 'cancelled').reduce((sum, o) => sum + o.total, 0)
  const pendingOrders = orders.filter(o => o.status === 'pending').length
  const totalProducts = catalog.length

  const stats = [
    { label: 'Ingresos totales', value: formatMXN(totalRevenue), icon: '💰', color: 'bg-green-100 text-green-800' },
    { label: 'Pedidos pendientes', value: pendingOrders.toString(), icon: '📦', color: 'bg-yellow-100 text-yellow-800' },
    { label: 'Total pedidos', value: orders.length.toString(), icon: '🛒', color: 'bg-blue-100 text-blue-800' },
    { label: 'Productos', value: totalProducts.toString(), icon: '📋', color: 'bg-purple-100 text-purple-800' },
  ]

  const recentOrders = orders.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).slice(0, 5)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-fg">Panel de Administración</h1>
        <p className="text-muted">Bienvenido al panel de control de MUÑEK SUPLEMENTOS</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <span className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center text-2xl`}>
                {stat.icon}
              </span>
              <div>
                <p className="text-2xl font-bold text-fg">{stat.value}</p>
                <p className="text-sm text-muted">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-hairline flex items-center justify-between">
          <h2 className="font-bold">Pedidos recientes</h2>
          <Link to="#" onClick={() => {}} className="text-accent text-sm font-medium hover:underline">
            Ver todos →
          </Link>
        </div>
        {recentOrders.length === 0 ? (
          <div className="p-12 text-center text-muted">
            No hay pedidos aún
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left text-xs font-semibold text-muted uppercase tracking-wider px-6 py-3">Pedido</th>
                <th className="text-left text-xs font-semibold text-muted uppercase tracking-wider px-6 py-3">Cliente</th>
                <th className="text-left text-xs font-semibold text-muted uppercase tracking-wider px-6 py-3">Total</th>
                <th className="text-left text-xs font-semibold text-muted uppercase tracking-wider px-6 py-3">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-hairline">
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-mono text-sm">{order.id}</td>
                  <td className="px-6 py-4 text-sm">{order.userName}</td>
                  <td className="px-6 py-4 font-semibold">{formatMXN(order.total)}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {getStatusLabel(order.status)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

function OrdersTab() {
  const [orders, setOrders] = useState<Order[]>(getOrders())
  const [filter, setFilter] = useState<OrderStatus | 'all'>('all')

  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(o => o.status === filter)

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    const updated = updateOrderStatus(orderId, newStatus)
    if (updated) {
      setOrders(getOrders())
    }
  }

  const statusOptions: (OrderStatus | 'all')[] = ['all', 'pending', 'confirmed', 'shipped', 'delivered', 'cancelled']

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-fg">Gestión de Pedidos</h1>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as OrderStatus | 'all')}
          className="px-4 py-2 border border-hairline rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-accent/30"
        >
          <option value="all">Todos los estados</option>
          {statusOptions.filter(s => s !== 'all').map((status) => (
            <option key={status} value={status}>{getStatusLabel(status as OrderStatus)}</option>
          ))}
        </select>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {filteredOrders.length === 0 ? (
          <div className="p-12 text-center text-muted">
            No hay pedidos {filter !== 'all' ? `con estado "${getStatusLabel(filter as OrderStatus)}"` : ''}
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-hairline">
              <tr>
                <th className="text-left text-xs font-semibold text-muted uppercase tracking-wider px-6 py-4">Pedido</th>
                <th className="text-left text-xs font-semibold text-muted uppercase tracking-wider px-6 py-4">Cliente</th>
                <th className="text-left text-xs font-semibold text-muted uppercase tracking-wider px-6 py-4">Fecha</th>
                <th className="text-left text-xs font-semibold text-muted uppercase tracking-wider px-6 py-4">Total</th>
                <th className="text-left text-xs font-semibold text-muted uppercase tracking-wider px-6 py-4">Estado</th>
                <th className="text-right text-xs font-semibold text-muted uppercase tracking-wider px-6 py-4">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-hairline">
              {filteredOrders.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <span className="font-mono text-sm font-medium">{order.id}</span>
                    <p className="text-xs text-muted">{order.items.length} producto(s)</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium">{order.userName}</p>
                    <p className="text-xs text-muted">{order.userEmail}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted">
                    {order.createdAt.toLocaleDateString('es-MX', { 
                      day: 'numeric', 
                      month: 'short', 
                      year: 'numeric' 
                    })}
                  </td>
                  <td className="px-6 py-4 font-semibold">
                    {formatMXN(order.total)}
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                      className={`text-xs font-medium px-2.5 py-1 rounded-full border-0 cursor-pointer ${getStatusColor(order.status)}`}
                    >
                      <option value="pending">Pendiente</option>
                      <option value="confirmed">Confirmado</option>
                      <option value="shipped">Enviado</option>
                      <option value="delivered">Entregado</option>
                      <option value="cancelled">Cancelado</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-accent hover:text-accent-dark text-sm font-medium">
                      Ver detalle
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

function ProductsTab() {
  const [products] = useState<Product[]>(catalog)
  const [search, setSearch] = useState('')

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.brand.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-fg">Gestión de Productos</h1>
        <button className="bg-accent hover:bg-accent-dark text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Agregar producto
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-hairline">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar productos..."
            className="w-full max-w-sm px-4 py-2 border border-hairline rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/30"
          />
        </div>

        <table className="w-full">
          <thead className="bg-gray-50 border-b border-hairline">
            <tr>
              <th className="text-left text-xs font-semibold text-muted uppercase tracking-wider px-6 py-4">Producto</th>
              <th className="text-left text-xs font-semibold text-muted uppercase tracking-wider px-6 py-4">Marca</th>
              <th className="text-left text-xs font-semibold text-muted uppercase tracking-wider px-6 py-4">Categoría</th>
              <th className="text-left text-xs font-semibold text-muted uppercase tracking-wider px-6 py-4">Variantes</th>
              <th className="text-left text-xs font-semibold text-muted uppercase tracking-wider px-6 py-4">Precio desde</th>
              <th className="text-right text-xs font-semibold text-muted uppercase tracking-wider px-6 py-4">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-hairline">
            {filteredProducts.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-12 h-12 rounded-lg"
                      style={{ background: `linear-gradient(135deg, ${product.image.a}, ${product.image.b})` }}
                    />
                    <span className="font-medium text-sm">{product.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm">{product.brand}</td>
                <td className="px-6 py-4">
                  <span className="inline-flex px-2.5 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                    {product.category}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">{product.variants.length}</td>
                <td className="px-6 py-4 font-semibold">
                  {formatMXN(Math.min(...product.variants.map(v => v.price)))}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button className="p-2 hover:bg-gray-100 rounded-lg text-muted hover:text-fg">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>
                    <button className="p-2 hover:bg-red-50 rounded-lg text-muted hover:text-red-600">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function CustomersTab() {
  const [users, setUsers] = useState<{ id: string; email: string; name: string; role: string; createdAt: Date }[]>([])

  useEffect(() => {
    try {
      const stored = localStorage.getItem('munek.users')
      if (stored) {
        const parsed = JSON.parse(stored)
        setUsers(parsed.filter((u: { role: string }) => u.role === 'client').map((u: { createdAt: string }) => ({
          ...u,
          createdAt: new Date(u.createdAt)
        })))
      }
    } catch {
      // ignore
    }
  }, [])

  const orders = getOrders()

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-fg">Gestión de Clientes</h1>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {users.length === 0 ? (
          <div className="p-12 text-center text-muted">
            No hay clientes registrados aún
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-hairline">
              <tr>
                <th className="text-left text-xs font-semibold text-muted uppercase tracking-wider px-6 py-4">Cliente</th>
                <th className="text-left text-xs font-semibold text-muted uppercase tracking-wider px-6 py-4">Email</th>
                <th className="text-left text-xs font-semibold text-muted uppercase tracking-wider px-6 py-4">Registrado</th>
                <th className="text-left text-xs font-semibold text-muted uppercase tracking-wider px-6 py-4">Pedidos</th>
                <th className="text-left text-xs font-semibold text-muted uppercase tracking-wider px-6 py-4">Total gastado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-hairline">
              {users.map((user) => {
                const userOrders = orders.filter(o => o.userId === user.id && o.status !== 'cancelled')
                const totalSpent = userOrders.reduce((sum, o) => sum + o.total, 0)
                return (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-accent/10 text-accent rounded-full flex items-center justify-center font-bold">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted">{user.email}</td>
                    <td className="px-6 py-4 text-sm text-muted">
                      {user.createdAt.toLocaleDateString('es-MX', { 
                        day: 'numeric', 
                        month: 'short', 
                        year: 'numeric' 
                      })}
                    </td>
                    <td className="px-6 py-4 text-sm">{userOrders.length}</td>
                    <td className="px-6 py-4 font-semibold">{formatMXN(totalSpent)}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
