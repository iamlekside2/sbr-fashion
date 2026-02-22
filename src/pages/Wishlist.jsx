import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useWishlist } from '../context/WishlistContext'
import { useCart } from '../context/CartContext'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}
const stagger = { show: { transition: { staggerChildren: 0.08 } } }

const btn = {
  fontFamily: 'Cinzel,serif', fontSize: 9, letterSpacing: '0.2em',
  textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.3s',
}

export default function Wishlist() {
  const { items, removeItem, clearWishlist } = useWishlist()
  const { addItem: addToCart } = useCart()

  const moveToCart = (item) => {
    addToCart({ id: item.id, name: item.name, price: item.price, images: [item.image], category: item.category })
    removeItem(item.id)
  }

  return (
    <div>
      <Navbar />
      <div style={{ minHeight: '100vh', background: '#0A0806', paddingTop: 120, paddingBottom: 80 }}>
        <div className="sbr-page-pad" style={{ padding: '0 60px', maxWidth: 1100, margin: '0 auto' }}>

          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 48, flexWrap: 'wrap', gap: 16 }}>
            <div>
              <div style={{ fontFamily: 'Cinzel,serif', fontSize: 9, letterSpacing: '0.4em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: 12 }}>Your Collection</div>
              <h1 style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 'clamp(36px,5vw,52px)', fontWeight: 300, color: '#F9F4EC' }}>
                Wishlist <span style={{ fontFamily: 'Jost,sans-serif', fontSize: 20, color: '#8A7A5A', fontWeight: 300 }}>({items.length})</span>
              </h1>
            </div>
            {items.length > 0 && (
              <button onClick={clearWishlist}
                style={{ ...btn, background: 'none', border: '1px solid rgba(201,168,76,0.2)', color: '#8A7A5A', padding: '10px 20px' }}
                onMouseEnter={e => e.currentTarget.style.color = '#FF6B6B'}
                onMouseLeave={e => e.currentTarget.style.color = '#8A7A5A'}>
                Clear All
              </button>
            )}
          </div>

          {items.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              style={{ textAlign: 'center', padding: '60px 0' }}>
              <Heart size={48} color="#8A7A5A" style={{ marginBottom: 20, opacity: 0.5 }} />
              <h2 style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 28, fontWeight: 300, color: '#F9F4EC', marginBottom: 12 }}>
                Your wishlist is empty
              </h2>
              <p style={{ fontSize: 14, color: '#8A7A5A', marginBottom: 32, lineHeight: 1.7 }}>
                Browse our collections and tap the heart icon to save pieces you love.
              </p>
              <Link to="/collections"
                style={{ ...btn, background: 'linear-gradient(135deg, #C9A84C, #8B6914)', border: 'none', color: '#0A0806', padding: '14px 32px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                Browse Collections <ArrowRight size={14} />
              </Link>
            </motion.div>
          ) : (
            <motion.div variants={stagger} initial="hidden" animate="show"
              className="sbr-wishlist-grid"
              style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 20 }}>
              {items.map(item => (
                <motion.div key={item.id} variants={fadeUp}
                  style={{ background: '#111009', border: '1px solid rgba(201,168,76,0.1)', overflow: 'hidden', position: 'relative' }}>

                  {/* Remove button */}
                  <button onClick={() => removeItem(item.id)}
                    style={{
                      position: 'absolute', top: 12, right: 12, zIndex: 5,
                      width: 32, height: 32, borderRadius: '50%', background: 'rgba(10,8,6,0.8)',
                      border: '1px solid rgba(201,168,76,0.2)', color: '#FF6B6B',
                      cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,107,107,0.15)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(10,8,6,0.8)'}>
                    <Trash2 size={14} />
                  </button>

                  {/* Wishlisted heart */}
                  <div style={{
                    position: 'absolute', top: 12, left: 12, zIndex: 5,
                    width: 32, height: 32, borderRadius: '50%', background: 'rgba(201,168,76,0.15)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Heart size={14} color="#C9A84C" fill="#C9A84C" />
                  </div>

                  <Link to={`/collections/${item.id}`} style={{ textDecoration: 'none' }}>
                    <div style={{ aspectRatio: '3/4', overflow: 'hidden', background: '#1A1710' }}>
                      {item.image ? (
                        <img src={item.image} alt={item.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }}
                          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'} />
                      ) : (
                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8A7A5A', fontSize: 12 }}>No Image</div>
                      )}
                    </div>
                  </Link>

                  <div style={{ padding: '16px 18px 20px' }}>
                    <div style={{ fontFamily: 'Cinzel,serif', fontSize: 8, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#8A7A5A', marginBottom: 6 }}>
                      {item.category?.replace(/-/g, ' ')}
                    </div>
                    <Link to={`/collections/${item.id}`} style={{ textDecoration: 'none' }}>
                      <div style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 18, color: '#F9F4EC', marginBottom: 6, lineHeight: 1.3 }}>{item.name}</div>
                    </Link>
                    <div style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 19, color: '#C9A84C', marginBottom: 14 }}>
                      ₦{Number(item.price).toLocaleString()}
                    </div>
                    <button onClick={() => moveToCart(item)}
                      style={{
                        ...btn, width: '100%', background: 'linear-gradient(135deg, #C9A84C, #8B6914)',
                        border: 'none', color: '#0A0806', padding: '12px 16px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                      }}>
                      <ShoppingBag size={13} /> Move to Cart
                    </button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  )
}
