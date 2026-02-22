import React, { createContext, useContext, useState, useEffect } from 'react'
import toast from 'react-hot-toast'

const CartContext = createContext(undefined)

const STORAGE_KEY = 'sbr_cart'

function loadCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveCart(items) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  } catch {
    // silent
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(loadCart)

  useEffect(() => {
    saveCart(items)
  }, [items])

  const addItem = (product) => {
    setItems(prev => {
      const exists = prev.find(i => i.id === product.id)
      if (exists) {
        toast.success(`Updated quantity for ${product.name}`)
        return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i)
      }
      toast.success(`${product.name} added to cart`)
      return [...prev, {
        id: product.id,
        name: product.name,
        price: Number(product.price),
        image: product.images?.[0] || '',
        category: product.category,
        qty: 1,
      }]
    })
  }

  const removeItem = (id) => {
    setItems(prev => {
      const item = prev.find(i => i.id === id)
      if (item) toast.success(`Removed ${item.name}`)
      return prev.filter(i => i.id !== id)
    })
  }

  const updateQty = (id, qty) => {
    if (qty < 1) return removeItem(id)
    setItems(prev => prev.map(i => i.id === id ? { ...i, qty } : i))
  }

  const clearCart = () => {
    setItems([])
    toast.success('Cart cleared')
  }

  const totalItems = items.reduce((sum, i) => sum + i.qty, 0)
  const totalPrice = items.reduce((sum, i) => sum + i.price * i.qty, 0)

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQty, clearCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
