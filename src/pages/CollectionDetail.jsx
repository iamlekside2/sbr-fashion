import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { supabase } from '../lib/supabase'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { ChevronLeft, ChevronRight, ShoppingBag, Check } from 'lucide-react'
import { useCart } from '../context/CartContext'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
}
const stagger = { show: { transition: { staggerChildren: 0.12 } } }

export default function CollectionDetail() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [related, setRelated] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeImage, setActiveImage] = useState(0)
  const [justAdded, setJustAdded] = useState(false)
  const { addItem, items } = useCart()
  const inCart = items.some(i => i.id === id)

  useEffect(() => {
    window.scrollTo(0, 0)
    setLoading(true)
    setActiveImage(0)
    supabase.from('products').select('*').eq('id', id).single()
      .then(({ data }) => {
        if (data) {
          setProduct(data)
          // Fetch related products from same category
          supabase.from('products').select('*')
            .eq('category', data.category)
            .eq('in_stock', true)
            .neq('id', data.id)
            .order('created_at', { ascending: false })
            .limit(4)
            .then(({ data: relData }) => {
              if (relData) setRelated(relData)
            })
        }
        setLoading(false)
      })
  }, [id])

  if (loading) {
    return (
      <div>
        <Navbar />
        <div style={{ minHeight: '100vh', background: '#0A0806', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ color: '#C9A84C', fontFamily: 'Cinzel,serif', fontSize: 12, letterSpacing: '0.3em' }}>LOADING...</div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div>
        <Navbar />
        <div style={{ minHeight: '100vh', background: '#0A0806', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 24 }}>
          <div style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 32, fontWeight: 300, color: '#F9F4EC' }}>Product Not Found</div>
          <Link to="/collections" style={{ fontFamily: 'Cinzel,serif', fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#0A0806', background: '#C9A84C', padding: '14px 28px', textDecoration: 'none' }}>
            Back to Collections
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  const images = product.images?.length > 0 ? product.images : []
  const hasMultipleImages = images.length > 1

  const prevImage = () => setActiveImage(prev => prev === 0 ? images.length - 1 : prev - 1)
  const nextImage = () => setActiveImage(prev => prev === images.length - 1 ? 0 : prev + 1)

  return (
    <div>
      <Navbar />
      <div style={{ minHeight: '100vh', background: '#0A0806', paddingTop: 120, paddingBottom: 80 }}>
        <div className="sbr-page-pad" style={{ padding: '0 60px' }}>

          {/* Breadcrumb */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}
            style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 48 }}>
            <Link to="/collections" style={{ fontFamily: 'Cinzel,serif', fontSize: 8, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#8A7A5A', textDecoration: 'none', transition: 'color 0.3s' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#C9A84C')}
              onMouseLeave={e => (e.currentTarget.style.color = '#8A7A5A')}>
              Collections
            </Link>
            <span style={{ color: '#8A7A5A', fontSize: 10 }}>›</span>
            <Link to={`/collections?cat=${product.category}`} style={{ fontFamily: 'Cinzel,serif', fontSize: 8, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#8A7A5A', textDecoration: 'none', transition: 'color 0.3s' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#C9A84C')}
              onMouseLeave={e => (e.currentTarget.style.color = '#8A7A5A')}>
              {product.category}
            </Link>
            <span style={{ color: '#8A7A5A', fontSize: 10 }}>›</span>
            <span style={{ fontFamily: 'Cinzel,serif', fontSize: 8, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#C9A84C' }}>
              {product.name}
            </span>
          </motion.div>

          {/* Product Layout */}
          <div className="sbr-detail-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'start' }}>

            {/* Images */}
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
              {images.length > 0 ? (
                <div>
                  {/* Main image */}
                  <div style={{ position: 'relative', aspectRatio: '3/4', background: '#1A1710', border: '1px solid rgba(201,168,76,0.2)', overflow: 'hidden', marginBottom: 12 }}>
                    <img src={images[activeImage]} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    {hasMultipleImages && (
                      <>
                        <button onClick={prevImage} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', width: 40, height: 40, background: 'rgba(10,8,6,0.7)', border: '1px solid rgba(201,168,76,0.3)', color: '#C9A84C', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s' }}
                          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(10,8,6,0.9)')}
                          onMouseLeave={e => (e.currentTarget.style.background = 'rgba(10,8,6,0.7)')}>
                          <ChevronLeft size={18} />
                        </button>
                        <button onClick={nextImage} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', width: 40, height: 40, background: 'rgba(10,8,6,0.7)', border: '1px solid rgba(201,168,76,0.3)', color: '#C9A84C', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s' }}
                          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(10,8,6,0.9)')}
                          onMouseLeave={e => (e.currentTarget.style.background = 'rgba(10,8,6,0.7)')}>
                          <ChevronRight size={18} />
                        </button>
                      </>
                    )}
                    <div style={{ position: 'absolute', inset: 12, border: '1px solid rgba(201,168,76,0.1)', pointerEvents: 'none' }} />
                  </div>
                  {/* Thumbnails */}
                  {hasMultipleImages && (
                    <div style={{ display: 'flex', gap: 8 }}>
                      {images.map((img, i) => (
                        <button key={i} onClick={() => setActiveImage(i)} style={{ width: 72, height: 72, padding: 0, background: '#1A1710', border: '2px solid', borderColor: i === activeImage ? '#C9A84C' : 'rgba(201,168,76,0.15)', overflow: 'hidden', cursor: 'pointer', transition: 'border-color 0.2s' }}>
                          <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: i === activeImage ? 1 : 0.6, transition: 'opacity 0.2s' }} />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div style={{ aspectRatio: '3/4', background: '#1A1710', border: '1px solid rgba(201,168,76,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 64, color: '#C9A84C', opacity: 0.2 }}>SBR</div>
                </div>
              )}
            </motion.div>

            {/* Product Info */}
            <motion.div initial="hidden" animate="show" variants={stagger} style={{ paddingTop: 20 }}>
              <motion.div variants={fadeUp} style={{ fontFamily: 'Cinzel,serif', fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ width: 24, height: 1, background: '#C9A84C', display: 'inline-block' }} />
                {product.category}
              </motion.div>

              <motion.h1 variants={fadeUp} style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 'clamp(36px,4vw,52px)', fontWeight: 300, color: '#F9F4EC', lineHeight: 1.15, marginBottom: 20 }}>
                {product.name}
              </motion.h1>

              <motion.div variants={fadeUp} style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 36, fontWeight: 300, color: '#C9A84C', marginBottom: 32 }}>
                ₦{Number(product.price).toLocaleString()}
              </motion.div>

              <motion.div variants={fadeUp} style={{ width: 40, height: 1, background: 'rgba(201,168,76,0.3)', marginBottom: 32 }} />

              {product.description && (
                <motion.p variants={fadeUp} style={{ fontSize: 15, lineHeight: 1.9, color: '#8A7A5A', marginBottom: 40 }}>
                  {product.description}
                </motion.p>
              )}

              {/* Details */}
              <motion.div variants={fadeUp} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 40, padding: 24, background: '#111009', border: '1px solid rgba(201,168,76,0.12)' }}>
                {[
                  ['Category', product.category],
                  ['Availability', product.in_stock ? 'In Stock' : 'Made to Order'],
                  ['Type', product.category === 'bespoke' ? 'Custom-Made' : 'Ready to Wear'],
                  ['Collection', 'Current Season'],
                ].map(([label, value]) => (
                  <div key={label}>
                    <div style={{ fontFamily: 'Cinzel,serif', fontSize: 7, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#8A7A5A', marginBottom: 6 }}>{label}</div>
                    <div style={{ fontSize: 13, color: '#EDE3D0', textTransform: 'capitalize' }}>{value}</div>
                  </div>
                ))}
              </motion.div>

              {/* Add to Cart */}
              {product.in_stock && (
                <motion.div variants={fadeUp} style={{ marginBottom: 12 }}>
                  <button
                    onClick={() => {
                      addItem(product)
                      setJustAdded(true)
                      setTimeout(() => setJustAdded(false), 2000)
                    }}
                    style={{ width: '100%', fontFamily: 'Cinzel,serif', fontSize: 10, fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: justAdded || inCart ? '#C9A84C' : '#0A0806', background: justAdded || inCart ? 'transparent' : 'linear-gradient(135deg,#E8C97A,#C9A84C)', border: justAdded || inCart ? '1px solid #C9A84C' : 'none', padding: '18px 24px', cursor: 'pointer', transition: 'all 0.3s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                    {justAdded ? <><Check size={16} /> Added to Cart</> : inCart ? <><ShoppingBag size={16} /> In Cart — Add Another</> : <><ShoppingBag size={16} /> Add to Cart</>}
                  </button>
                </motion.div>
              )}

              {/* CTA Buttons */}
              <motion.div variants={fadeUp} className="sbr-detail-cta" style={{ display: 'flex', gap: 12 }}>
                <Link to="/book" style={{ flex: 1, fontFamily: 'Cinzel,serif', fontSize: 10, fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: inCart ? '#C9A84C' : '#0A0806', background: inCart ? 'transparent' : 'linear-gradient(135deg,#E8C97A,#C9A84C)', border: inCart ? '1px solid rgba(201,168,76,0.4)' : 'none', padding: '18px 24px', textDecoration: 'none', textAlign: 'center', transition: 'all 0.2s' }}
                  onMouseEnter={e => { if (inCart) { e.currentTarget.style.background = 'rgba(201,168,76,0.1)' } else { e.currentTarget.style.opacity = '0.9' } }}
                  onMouseLeave={e => { if (inCart) { e.currentTarget.style.background = 'transparent' } else { e.currentTarget.style.opacity = '1' } }}>
                  Let's Chat About This
                </Link>
                <a href={`https://wa.me/?text=${encodeURIComponent(`Hi, I'm interested in the ${product.name} (₦${Number(product.price).toLocaleString()}) from Stitches by Ruthchinos.`)}`} target="_blank" rel="noreferrer"
                  style={{ flex: 1, fontFamily: 'Cinzel,serif', fontSize: 10, fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#C9A84C', background: 'transparent', border: '1px solid rgba(201,168,76,0.4)', padding: '18px 24px', textDecoration: 'none', textAlign: 'center', transition: 'all 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(201,168,76,0.1)'; e.currentTarget.style.borderColor = '#C9A84C' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(201,168,76,0.4)' }}>
                  Message Us on WhatsApp
                </a>
              </motion.div>
            </motion.div>
          </div>

          {/* Related Products */}
          {related.length > 0 && (
            <div style={{ marginTop: 120 }}>
              <div style={{ textAlign: 'center', marginBottom: 48 }}>
                <div style={{ fontFamily: 'Cinzel,serif', fontSize: 9, letterSpacing: '0.4em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: 12 }}>You'll Love These Too</div>
                <h2 style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 'clamp(28px,3vw,40px)', fontWeight: 300, color: '#F9F4EC' }}>
                  More from <em style={{ fontStyle: 'italic', color: '#C9A84C', textTransform: 'capitalize' }}>{product.category}</em>
                </h2>
              </div>
              <div className="sbr-related-grid" style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(related.length, 4)}, 1fr)`, gap: 24 }}>
                {related.map(p => (
                  <Link key={p.id} to={`/collections/${p.id}`} style={{ textDecoration: 'none', background: '#111009', border: '1px solid rgba(201,168,76,0.12)', overflow: 'hidden', transition: 'border-color 0.3s' }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(201,168,76,0.4)')}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(201,168,76,0.12)')}>
                    <div style={{ height: 280, background: '#1A1710', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {p.images?.[0] ? (
                        <img src={p.images[0]} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }}
                          onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.05)')}
                          onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')} />
                      ) : (
                        <div style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 36, color: '#C9A84C', opacity: 0.2 }}>SBR</div>
                      )}
                    </div>
                    <div style={{ padding: '16px 18px 20px' }}>
                      <div style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 17, fontWeight: 400, color: '#F9F4EC', marginBottom: 6 }}>{p.name}</div>
                      <div style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 18, fontWeight: 300, color: '#C9A84C' }}>₦{Number(p.price).toLocaleString()}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  )
}
