import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, ChevronRight, ShoppingBag, ArrowRight, RefreshCw } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { supabase } from '../lib/supabase'
import { useCart } from '../context/CartContext'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
}
const stagger = { show: { transition: { staggerChildren: 0.1 } } }

/* ── OCCASION DATA ── */
const OCCASIONS = [
  { id: 'wedding', image: 'https://source.unsplash.com/400x300/?nigerian-bride', label: 'Wedding', desc: 'Bridal outfits, engagement looks, and wedding guest glamour', categories: ['bespoke','aso-ebi','ready-to-wear'], tip: 'Sis, start your fittings 6–8 weeks before the big day. Aso-oke or premium lace for the ceremony, then switch to ankara or brocade for the reception. Trust me, you\'ll thank yourself later!' },
  { id: 'owambe', image: 'https://source.unsplash.com/400x300/?owambe', label: 'Owambe / Party', desc: 'Show up and show out at every celebration with head-turning aso-ebi looks', categories: ['aso-ebi','ankara','ready-to-wear'], tip: 'Owambe is where you bring your full A-game! Bold colours, statement gele, and accessories that say "I came to slay." We can source matching aso-ebi fabric for your whole crew.' },
  { id: 'church', image: 'https://source.unsplash.com/400x300/?yoruba-fashion', label: 'Church / Sunday Best', desc: 'Beautiful, modest styles perfect for worship and fellowship', categories: ['ready-to-wear','ankara','bespoke'], tip: 'Classy cuts with modest necklines always win. I love pairing structured ankara blouses with midi skirts, or a well-tailored shift dress in premium crepe. You\'ll look amazing!' },
  { id: 'corporate', image: 'https://source.unsplash.com/400x300/?ankara-fashion', label: 'Corporate / Office', desc: 'Power dressing with African flair for the modern professional', categories: ['ready-to-wear','bespoke'], tip: 'African prints in boardroom-ready cuts — think tailored ankara blazers, pencil skirts, and sharp senator styles. Subtle prints and muted palettes work beautifully for the office.' },
  { id: 'birthday', image: 'https://source.unsplash.com/400x300/?african-print-dress', label: 'Birthday Celebration', desc: 'Make your special day even more special with the perfect outfit', categories: ['ready-to-wear','ankara','bespoke'], tip: 'Your birthday outfit should be unapologetically YOU! Bold colours, daring cuts, and personal touches. We can even custom-embroider your name or date into the design.' },
  { id: 'date-night', image: 'https://source.unsplash.com/400x300/?african-lace-dress', label: 'Date Night', desc: 'Romantic, chic pieces for an unforgettable evening', categories: ['ready-to-wear','accessories'], tip: 'Less is more for date nights. A well-cut dress in a rich fabric speaks volumes. Pair it with statement earrings and a clutch from our accessories line — you\'ll love it!' },
  { id: 'naming', image: 'https://source.unsplash.com/400x300/?aso-ebi', label: 'Naming Ceremony', desc: 'Coordinated family looks for this joyful milestone', categories: ['aso-ebi','ankara','bespoke'], tip: 'Naming ceremonies call for coordinated family outfits. We\'ll source matching fabrics and create complementary designs for everyone — including the little one!' },
  { id: 'graduation', image: 'https://source.unsplash.com/400x300/?west-african-fashion', label: 'Graduation', desc: 'Celebrate your achievement in style with a look that commands attention', categories: ['ready-to-wear','ankara'], tip: 'Pick something that photographs beautifully under the gown and stands out for after-ceremony celebrations. A-line dresses and fitted jumpsuits are always a hit!' },
  { id: 'vacation', image: 'https://source.unsplash.com/400x300/?ankara', label: 'Vacation / Travel', desc: 'Effortless, packable pieces with maximum impact', categories: ['ready-to-wear','ankara','accessories'], tip: 'Go for versatile pieces that dress up or down easily. Ankara resort wear, flowy maxi dresses, and statement accessories that take you from beach to dinner — sorted!' },
  { id: 'everyday', image: 'https://source.unsplash.com/400x300/?kente-fashion', label: 'Everyday Luxury', desc: 'Elevate your daily wardrobe with beautifully made essentials', categories: ['ready-to-wear','ankara'], tip: 'Invest in well-made basics that reflect your style. A perfectly tailored ankara top, quality cotton pieces, and versatile separates that mix and match like a dream.' },
]

const btn = {
  fontFamily: 'Cinzel,serif', fontSize: 9, letterSpacing: '0.2em',
  textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.3s ease',
}

export default function DressMyOccasion() {
  const [selected, setSelected] = useState(null)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [contact, setContact] = useState({})
  const { addItem } = useCart()

  useEffect(() => { window.scrollTo(0, 0) }, [])

  useEffect(() => {
    supabase.from('site_content').select('*').then(({ data }) => {
      if (data) {
        const m = {}
        data.forEach(d => { m[d.key] = d.value })
        setContact(m)
      }
    })
  }, [])

  const selectOccasion = async (occ) => {
    setSelected(occ)
    setLoading(true)
    setProducts([])
    window.scrollTo({ top: 400, behavior: 'smooth' })

    // Fetch products matching the occasion's categories
    const { data } = await supabase
      .from('products')
      .select('*')
      .in('category', occ.categories)
      .eq('in_stock', true)
      .order('featured', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(12)

    setProducts(data || [])
    setLoading(false)
  }

  const resetSelection = () => {
    setSelected(null)
    setProducts([])
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const cleanNum = (contact.contact_whatsapp || '').replace(/\D/g, '')

  const labelStyle = { fontFamily: 'Cinzel,serif', fontSize: 9, letterSpacing: '0.4em', textTransform: 'uppercase', color: '#C9A84C' }

  return (
    <div>
      <Navbar />
      <div style={{ minHeight: '100vh', background: '#0A0806', paddingTop: 120, paddingBottom: 80 }}>

        {/* ── HEADER ── */}
        <motion.div initial="hidden" animate="show" variants={stagger}
          className="sbr-page-pad" style={{ padding: '0 60px', textAlign: 'center', marginBottom: 60 }}>
          <motion.div variants={fadeUp} style={labelStyle}>Find Your Perfect Look</motion.div>
          <motion.h1 variants={fadeUp} style={{
            fontFamily: 'Cormorant Garamond,serif', fontSize: 'clamp(36px,5vw,60px)',
            fontWeight: 300, color: '#F9F4EC', margin: '16px 0 12px',
          }}>
            Dress My <em style={{ fontStyle: 'italic', color: '#C9A84C' }}>Occasion</em>
          </motion.h1>
          <motion.p variants={fadeUp} style={{ fontSize: 15, color: '#8A7A5A', maxWidth: 520, margin: '0 auto', lineHeight: 1.8 }}>
            Tell us where you're headed and we'll pick out the perfect pieces for you.
          </motion.p>
        </motion.div>

        <div className="sbr-page-pad" style={{ padding: '0 60px', maxWidth: 1200, margin: '0 auto' }}>

          {/* ── OCCASION GRID ── */}
          <AnimatePresence mode="wait">
            {!selected && (
              <motion.div key="grid"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -20 }}
                className="sbr-occasion-grid"
                style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
                {OCCASIONS.map((occ, i) => (
                  <motion.button key={occ.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0, transition: { delay: i * 0.05 } }}
                    whileHover={{ y: -4, borderColor: 'rgba(201,168,76,0.5)' }}
                    onClick={() => selectOccasion(occ)}
                    style={{
                      background: '#111009', border: '1px solid rgba(201,168,76,0.15)',
                      padding: '28px 24px', cursor: 'pointer', textAlign: 'left',
                      transition: 'all 0.3s ease', position: 'relative', overflow: 'hidden',
                    }}>
                    <div style={{ width: 56, height: 56, borderRadius: 8, overflow: 'hidden', marginBottom: 12 }}>
                      <img src={occ.image} alt={occ.label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 20, fontWeight: 400, color: '#F9F4EC', marginBottom: 8 }}>{occ.label}</div>
                    <p style={{ fontSize: 12, color: '#8A7A5A', lineHeight: 1.7, margin: 0 }}>{occ.desc}</p>
                    <div style={{ position: 'absolute', bottom: 16, right: 16 }}>
                      <ChevronRight size={16} color="#C9A84C" style={{ opacity: 0.4 }} />
                    </div>
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── RESULTS ── */}
          <AnimatePresence mode="wait">
            {selected && (
              <motion.div key="results"
                initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>

                {/* Back + occasion header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 40, flexWrap: 'wrap', gap: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <button onClick={resetSelection} style={{ ...btn, background: 'none', border: '1px solid rgba(201,168,76,0.3)', color: '#C9A84C', padding: '10px 18px', display: 'flex', alignItems: 'center', gap: 6 }}>
                      <RefreshCw size={12} /> Change Occasion
                    </button>
                    <div>
                      <div style={{ width: 40, height: 40, borderRadius: 6, overflow: 'hidden', display: 'inline-block', marginRight: 10, verticalAlign: 'middle' }}>
                        <img src={selected.image} alt={selected.label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                      <span style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 28, color: '#F9F4EC' }}>{selected.label}</span>
                    </div>
                  </div>
                </div>

                {/* Styling tip */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.2 } }}
                  style={{
                    background: 'linear-gradient(135deg, rgba(201,168,76,0.08) 0%, rgba(201,168,76,0.02) 100%)',
                    border: '1px solid rgba(201,168,76,0.2)', padding: '28px 32px', marginBottom: 48,
                  }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                    <Sparkles size={20} color="#C9A84C" style={{ marginTop: 2, flexShrink: 0 }} />
                    <div>
                      <div style={{ ...labelStyle, marginBottom: 10 }}>Ruth's Styling Tip</div>
                      <p style={{ fontSize: 14, color: '#EDE3D0', lineHeight: 1.9, margin: 0 }}>{selected.tip}</p>
                    </div>
                  </div>
                </motion.div>

                {/* Products grid */}
                {loading ? (
                  <div style={{ textAlign: 'center', padding: '60px 0' }}>
                    <div style={{ ...labelStyle, color: '#8A7A5A' }}>Finding your perfect looks...</div>
                  </div>
                ) : products.length > 0 ? (
                  <>
                    <div style={{ ...labelStyle, marginBottom: 24 }}>Recommended for You — {products.length} Pieces</div>
                    <motion.div variants={stagger} initial="hidden" animate="show"
                      className="sbr-occasion-products"
                      style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 20, marginBottom: 48 }}>
                      {products.map((p) => (
                        <motion.div key={p.id} variants={fadeUp}
                          style={{ background: '#111009', border: '1px solid rgba(201,168,76,0.1)', overflow: 'hidden', transition: 'border-color 0.3s' }}
                          onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(201,168,76,0.35)'}
                          onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(201,168,76,0.1)'}>
                          <Link to={`/collections/${p.id}`} style={{ textDecoration: 'none' }}>
                            <div style={{ aspectRatio: '3/4', overflow: 'hidden', background: '#1A1710' }}>
                              {p.images?.[0] ? (
                                <img src={p.images[0]} alt={p.name}
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
                              {p.category?.replace(/-/g, ' ')}
                            </div>
                            <Link to={`/collections/${p.id}`} style={{ textDecoration: 'none' }}>
                              <div style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 17, color: '#F9F4EC', marginBottom: 8, lineHeight: 1.3 }}>{p.name}</div>
                            </Link>
                            <div style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 18, color: '#C9A84C', marginBottom: 14 }}>
                              ₦{Number(p.price).toLocaleString()}
                            </div>
                            <button onClick={() => addItem(p)}
                              style={{
                                ...btn, width: '100%', background: 'transparent',
                                border: '1px solid rgba(201,168,76,0.4)', color: '#C9A84C',
                                padding: '10px 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                              }}
                              onMouseEnter={e => { e.currentTarget.style.background = '#C9A84C'; e.currentTarget.style.color = '#0A0806' }}
                              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#C9A84C' }}>
                              <ShoppingBag size={13} /> Add to Cart
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  </>
                ) : (
                  <div style={{ textAlign: 'center', padding: '60px 0' }}>
                    <Sparkles size={40} color="#C9A84C" style={{ marginBottom: 16, opacity: 0.5 }} />
                    <div style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 24, color: '#F9F4EC', marginBottom: 12 }}>No pieces in stock for this occasion yet</div>
                    <p style={{ fontSize: 13, color: '#8A7A5A', marginBottom: 32 }}>But don't worry — we can create a custom-made piece tailored perfectly for your {selected.label.toLowerCase()}.</p>
                  </div>
                )}

                {/* CTAs */}
                <div className="sbr-occasion-ctas" style={{
                  display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 8,
                }}>
                  <Link to="/bespoke" style={{
                    background: 'linear-gradient(135deg, #C9A84C, #8B6914)', color: '#0A0806',
                    padding: '24px 32px', textDecoration: 'none', textAlign: 'center',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
                    transition: 'opacity 0.3s',
                  }}
                    onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
                    onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
                    <div style={{ ...labelStyle, color: '#0A0806' }}>Want Something Custom?</div>
                    <div style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 22, fontWeight: 400 }}>Design a Custom-Made Piece</div>
                    <ArrowRight size={16} style={{ marginTop: 4 }} />
                  </Link>

                  <a href={`https://wa.me/${cleanNum}?text=${encodeURIComponent(`Hi! I'm looking for an outfit for a ${selected.label}. Can you help me?`)}`}
                    target="_blank" rel="noreferrer"
                    style={{
                      background: '#111009', border: '1px solid rgba(201,168,76,0.3)', color: '#F9F4EC',
                      padding: '24px 32px', textDecoration: 'none', textAlign: 'center',
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
                      transition: 'border-color 0.3s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(201,168,76,0.6)'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(201,168,76,0.3)'}>
                    <div style={labelStyle}>Need Help Choosing?</div>
                    <div style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 22, fontWeight: 400 }}>Let's Chat on WhatsApp</div>
                    <ArrowRight size={16} color="#C9A84C" style={{ marginTop: 4 }} />
                  </a>
                </div>

              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <Footer />
    </div>
  )
}
