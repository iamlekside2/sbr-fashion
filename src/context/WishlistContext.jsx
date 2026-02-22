import { createContext, useContext, useState, useEffect } from 'react'
import toast from 'react-hot-toast'

const WishlistContext = createContext()
export const useWishlist = () => useContext(WishlistContext)

const KEY = 'sbr_wishlist'
const load = () => { try { return JSON.parse(localStorage.getItem(KEY)) || [] } catch { return [] } }
const save = (items) => localStorage.setItem(KEY, JSON.stringify(items))

export function WishlistProvider({ children }) {
  const [items, setItems] = useState(load)

  useEffect(() => { save(items) }, [items])

  const addItem = (product) => {
    setItems(prev => {
      if (prev.find(i => i.id === product.id)) {
        toast('Already in wishlist', { icon: '❤️' })
        return prev
      }
      toast.success('Added to wishlist')
      return [...prev, { id: product.id, name: product.name, price: product.price, image: product.images?.[0] || '', category: product.category }]
    })
  }

  const removeItem = (id) => {
    setItems(prev => prev.filter(i => i.id !== id))
    toast.success('Removed from wishlist')
  }

  const isWishlisted = (id) => items.some(i => i.id === id)

  const toggleItem = (product) => {
    if (isWishlisted(product.id)) {
      removeItem(product.id)
    } else {
      addItem(product)
    }
  }

  const clearWishlist = () => {
    setItems([])
    toast.success('Wishlist cleared')
  }

  return (
    <WishlistContext.Provider value={{ items, addItem, removeItem, isWishlisted, toggleItem, clearWishlist, totalItems: items.length }}>
      {children}
    </WishlistContext.Provider>
  )
}
