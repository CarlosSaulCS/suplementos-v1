import { type User } from './AuthContext'

export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'

export type OrderItem = {
  productId: string
  variantId: string
  productName: string
  variantLabel: string
  price: number
  quantity: number
  image: string
}

export type Order = {
  id: string
  userId: string
  userName: string
  userEmail: string
  items: OrderItem[]
  subtotal: number
  shipping: number
  total: number
  status: OrderStatus
  shippingAddress: string
  phone: string
  notes?: string
  createdAt: Date
  updatedAt: Date
}

const ORDERS_KEY = 'munek.orders'

export function getOrders(): Order[] {
  try {
    const stored = localStorage.getItem(ORDERS_KEY)
    if (stored) {
      return JSON.parse(stored).map((o: Order) => ({
        ...o,
        createdAt: new Date(o.createdAt),
        updatedAt: new Date(o.updatedAt),
      }))
    }
  } catch {
    // ignore
  }
  return []
}

export function getOrdersByUser(userId: string): Order[] {
  return getOrders().filter(o => o.userId === userId)
}

export function saveOrder(order: Order): void {
  const orders = getOrders()
  const idx = orders.findIndex(o => o.id === order.id)
  if (idx !== -1) {
    orders[idx] = order
  } else {
    orders.push(order)
  }
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders))
}

export function createOrder(
  user: User,
  items: OrderItem[],
  shippingAddress: string,
  phone: string,
  notes?: string
): Order {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = subtotal >= 999 ? 0 : 99

  const order: Order = {
    id: `ORD-${Date.now()}`,
    userId: user.id,
    userName: user.name,
    userEmail: user.email,
    items,
    subtotal,
    shipping,
    total: subtotal + shipping,
    status: 'pending',
    shippingAddress,
    phone,
    notes,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  saveOrder(order)
  return order
}

export function updateOrderStatus(orderId: string, status: OrderStatus): Order | null {
  const orders = getOrders()
  const order = orders.find(o => o.id === orderId)
  if (order) {
    order.status = status
    order.updatedAt = new Date()
    saveOrder(order)
    return order
  }
  return null
}

export function getStatusLabel(status: OrderStatus): string {
  const labels: Record<OrderStatus, string> = {
    pending: 'Pendiente',
    confirmed: 'Confirmado',
    shipped: 'Enviado',
    delivered: 'Entregado',
    cancelled: 'Cancelado',
  }
  return labels[status]
}

export function getStatusColor(status: OrderStatus): string {
  const colors: Record<OrderStatus, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    shipped: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  }
  return colors[status]
}
