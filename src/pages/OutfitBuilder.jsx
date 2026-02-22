import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingBag, RefreshCw, Share2, Plus, X, Check, Sparkles } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { supabase } from '../lib/supabase'
import { useCart } from '../context/CartContext'
import toast from 'react-hot-toast'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

const SLOTS = [
  { id: 'main', label: 'Main Piece', desc: 'Dress, top, or primary garment', categories: ['ready-to-wear', 'bespoke', 'ankara'] },
  { id: 'accent', label: 'Accent / Layer', desc: 'Jacket, wrapper, or complementary piece', categories: ['ready-to-wear', 'ankara'] },
  { id: 'accessory', label: 'Accessories', desc: 'Jewellery, bags, headpieces', categories: ['accessories'] },
]

const btn = {
  fontFamily: 'Cinzel,serif', fontSize: 9, letterSpacing: '0.2em',
  textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.3s',
}

export default function OutfitBuilder() {
  const [products, setProducts] = useState({})
  const [loading, setLoading] = useState(true)
  const [outfit, setOutfit] = useState({ main: null, accent: null, accessory: null })
  const [activeSlot, setActiveSlot] = useState(null) // which slot is being picked
  const [contact, setContact] = useState({})
  const { addItem } = useCart()

  useEffect(() => { window.scrollTo(0, 0) }, [])

  useEffect(() => {
    const fetchAll = async () => {
      const result = {}
      for (const slot of SLOTS) {
        const { data } = await supabase
          .from('products').select('*')
          .in('category', slot.categories)
          .eq('in_stock', true)
          .order('featured', { ascending: false })
          .order('created_at', { ascending: false })
          .limit(20)
        result[slot.id] = data || []
      }
      setProducts(result)
      setLoading(false)
    }
    fetchAll()

    supabase.from('site_content').select('*').then(({ data }) => {
      if (data) { const m = {}; data.forEach(d => { m[d.key] = d.value }); setContact(m) }
    })
  }, [])

  const selectProduct = (slotId, product) => {
    setOutfit(prev => ({ ...prev, [slotId]: product }))
    setActiveSlot(null)
  }

  const removeFromSlot = (slotId) => {
    setOutfit(prev => ({ ...prev, [slotId]: null }))
  }

  const clearOutfit = () => {
    setOutfit({ main: null, accent: null, accessory: null })
  }

  const addAllToCart = () => {
    let count = 0
    Object.values(outfit).forEach(p => {
      if (p) { addItem(p); count++ }
    })
    if (count > 0) toast.success(`Added ${count} piece${count > 1 ? 's' : ''} to cart`)
  }

  const shareOnWhatsApp = () => {
    const cleanNum = (contact.contact_whatsapp || '').replace(/\D/g, '')
    const pieces = Object.entries(outfit)
      .filter(([, p]) => p)
      .map(([slot, p]) => `${slot}: ${p.name} (₦${Number(p.price).toLocaleString()})`)
      .join('\n')
    const total = Object.values(outfit).filter(Boolean).reduce((s, p) => s + Number(p.price), 0)
    const msg = `Hi! I've put together an outfit on your site:\n\n${pieces}\n\nTotal: ₦${total.toLocaleString()}\n\nCan I proceed with this combination?`
    window.open(`https://wa.me/${cleanNum}?text=${encodeURIComponent(msg)}`, '_blank')
  }

  const outfitTotal = Object.values(outfit).filter(Boolean).reduce((s, p) => s + Number(p.price), 0)
  const outfitCount = Object.values(outfit).filter(Boolean).length

  const labelStyle = { fontFamily: 'Cinzel,serif', fontSize: 9, letterSpacing: '0.4em', textTransform: 'uppercase', color: '#C9A84C' }

  return (
    <div>
      <Navbar />
      <div style={{ minHeight: '100vh', background: '#0A0806', paddingTop: 120, paddingBottom: 80 }}>
        <div className="sbr-page-pad" style={{ padding: '0 60px', maxWidth: 1100, margin: '0 auto' }}>

          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={labelStyle}>Mix & Match</div>
            <h1 style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 'clamp(36px,5vw,56px)', fontWeight: 300, color: '#F9F4EC', margin: '12px 0' }}>
              Outfit <em style={{ fontStyle: 'italic', color: '#C9A84C' }}>Builder</em>
            </h1>
            <p style={{ fontSize: 15, color: '#8A7A5A', maxWidth: 500, margin: '0 auto', lineHeight: 1.8 }}>
              Create your perfect outfit by combining pieces from our collection. Pick a main piece, add layers, and top it off with accessories.
            </p>
          </div>

          {/* Builder area */}
          <div className="sbr-outfit-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 40 }}>

            {/* Slots */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {SLOTS.map(slot => {
                const selected = outfit[slot.id]
                return (
                  <motion.div key={slot.id} layout
                    style={{ background: '#111009', border: `1px solid ${selected ? 'rgba(201,168,76,0.3)' : 'rgba(201,168,76,0.1)'}`, overflow: 'hidden', transition: 'border-color 0.3s' }}>
                    <div style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div>
                        <div style={labelStyle}>{slot.label}</div>
                        <div style={{ fontSize: 12, color: '#8A7A5A', marginTop: 4 }}>{slot.desc}</div>
                      </div>
                      {selected && (
                        <button onClick={() => removeFromSlot(slot.id)}
                          style={{ background: 'none', border: 'none', color: '#8A7A5A', cursor: 'pointer', padding: 4 }}>
                          <X size={16} />
                        </button>
                      )}
                    </div>

                    {selected ? (
                      <div style={{ display: 'flex', borderTop: '1px solid rgba(201,168,76,0.08)', padding: '16px 24px', gap: 16, alignItems: 'center' }}>
                        <div style={{ width: 72, height: 96, background: '#1A1710', flexShrink: 0, overflow: 'hidden' }}>
                          {selected.images?.[0] && <img src={selected.images[0]} alt={selected.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 18, color: '#F9F4EC', marginBottom: 4 }}>{selected.name}</div>
                          <div style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 17, color: '#C9A84C' }}>₦{Number(selected.price).toLocaleString()}</div>
                        </div>
                        <button onClick={() => setActiveSlot(slot.id)}
                          style={{ ...btn, background: 'none', border: '1px solid rgba(201,168,76,0.2)', color: '#C9A84C', padding: '8px 14px', fontSize: 8 }}>
                          Change
                        </button>
                      </div>
                    ) : (
                      <button onClick={() => setActiveSlot(slot.id)}
                        style={{
                          width: '100%', padding: '32px 24px', background: 'rgba(201,168,76,0.03)',
                          border: 'none', borderTop: '1px solid rgba(201,168,76,0.08)',
                          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                          color: '#8A7A5A', fontSize: 13, transition: 'all 0.2s',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(201,168,76,0.06)'; e.currentTarget.style.color = '#C9A84C' }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(201,168,76,0.03)'; e.currentTarget.style.color = '#8A7A5A' }}>
                        <Plus size={16} /> Choose a piece
                      </button>
                    )}
                  </motion.div>
                )
              })}
            </div>

            {/* Summary panel */}
            <div className="sbr-outfit-summary" style={{ position: 'sticky', top: 100, alignSelf: 'start' }}>
              <div style={{ background: '#111009', border: '1px solid rgba(201,168,76,0.15)', padding: '28px 24px' }}>
                <div style={{ ...labelStyle, marginBottom: 20 }}>Your Outfit</div>

                {outfitCount === 0 ? (
                  <div style={{ textAlign: 'center', padding: '24px 0' }}>
                    <Sparkles size={24} color="#8A7A5A" style={{ marginBottom: 12, opacity: 0.5 }} />
                    <p style={{ fontSize: 13, color: '#8A7A5A', lineHeight: 1.6 }}>Start building your outfit by selecting pieces from each category.</p>
                  </div>
                ) : (
                  <>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
                      {Object.entries(outfit).filter(([, p]) => p).map(([slot, p]) => (
                        <div key={slot} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 12, borderBottom: '1px solid rgba(201,168,76,0.06)' }}>
                          <div>
                            <div style={{ fontSize: 10, color: '#8A7A5A', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{slot}</div>
                            <div style={{ fontSize: 13, color: '#EDE3D0', marginTop: 2 }}>{p.name}</div>
                          </div>
                          <div style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 16, color: '#C9A84C' }}>₦{Number(p.price).toLocaleString()}</div>
                        </div>
                      ))}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 16, borderTop: '1px solid rgba(201,168,76,0.15)', marginBottom: 24 }}>
                      <span style={labelStyle}>Total</span>
                      <span style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 24, color: '#C9A84C' }}>₦{outfitTotal.toLocaleString()}</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      <button onClick={addAllToCart}
                        style={{ ...btn, width: '100%', background: 'linear-gradient(135deg, #C9A84C, #8B6914)', border: 'none', color: '#0A0806', padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                        <ShoppingBag size={14} /> Add All to Cart
                      </button>
                      <button onClick={shareOnWhatsApp}
                        style={{ ...btn, width: '100%', background: '#25D366', border: 'none', color: '#fff', padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                        <Share2 size={14} /> Share on WhatsApp
                      </button>
                      <button onClick={clearOutfit}
                        style={{ ...btn, width: '100%', background: 'transparent', border: '1px solid rgba(201,168,76,0.2)', color: '#8A7A5A', padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                        <RefreshCw size={12} /> Start Over
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product picker modal */}
      <AnimatePresence>
        {activeSlot && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, zIndex: 600, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            onClick={() => setActiveSlot(null)}>
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)' }} />
            <motion.div initial={{ y: 30 }} animate={{ y: 0 }} exit={{ y: 30 }}
              onClick={e => e.stopPropagation()}
              style={{ position: 'relative', background: '#111009', border: '1px solid rgba(201,168,76,0.2)', width: '90%', maxWidth: 800, maxHeight: '80vh', overflow: 'auto', padding: 32 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <div>
                  <div style={labelStyle}>Choose {SLOTS.find(s => s.id === activeSlot)?.label}</div>
                  <p style={{ fontSize: 12, color: '#8A7A5A', marginTop: 4 }}>{SLOTS.find(s => s.id === activeSlot)?.desc}</p>
                </div>
                <button onClick={() => setActiveSlot(null)} style={{ background: 'none', border: 'none', color: '#8A7A5A', cursor: 'pointer' }}>
                  <X size={20} />
                </button>
              </div>

              {loading ? (
                <div style={{ textAlign: 'center', padding: 40, color: '#8A7A5A' }}>Loading pieces...</div>
              ) : (
                <div className="sbr-outfit-picker" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12 }}>
                  {(products[activeSlot] || []).map(p => {
                    const isSelected = outfit[activeSlot]?.id === p.id
                    return (
                      <button key={p.id} onClick={() => selectProduct(activeSlot, p)}
                        style={{
                          background: isSelected ? 'rgba(201,168,76,0.1)' : '#0A0806',
                          border: `1px solid ${isSelected ? '#C9A84C' : 'rgba(201,168,76,0.1)'}`,
                          cursor: 'pointer', overflow: 'hidden', textAlign: 'left', padding: 0,
                          transition: 'all 0.2s', position: 'relative',
                        }}>
                        {isSelected && (
                          <div style={{ position: 'absolute', top: 8, right: 8, width: 24, height: 24, borderRadius: '50%', background: '#C9A84C', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2 }}>
                            <Check size={14} color="#0A0806" />
                          </div>
                        )}
                        <div style={{ aspectRatio: '3/4', overflow: 'hidden', background: '#1A1710' }}>
                          {p.images?.[0] ? (
                            <img src={p.images[0]} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (
                            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8A7A5A', fontSize: 10 }}>No Image</div>
                          )}
                        </div>
                        <div style={{ padding: '10px 12px' }}>
                          <div style={{ fontSize: 12, color: '#F9F4EC', marginBottom: 2, lineHeight: 1.3 }}>{p.name}</div>
                          <div style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 14, color: '#C9A84C' }}>₦{Number(p.price).toLocaleString()}</div>
                        </div>
                      </button>
                    )
                  })}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  )
}
