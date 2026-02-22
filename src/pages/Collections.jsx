import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { Link, useSearchParams } from 'react-router-dom'
import { ShoppingBag, Heart } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'

export default function Collections() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const catParam = searchParams.get('cat')
  const [filter, setFilter] = useState(catParam || 'all')
  const { addItem } = useCart()
  const { toggleItem, isWishlisted } = useWishlist()

  useEffect(() => {
    supabase.from('products').select('*').eq('in_stock', true).order('created_at', { ascending: false })
      .then(({ data }) => { if (data) setProducts(data); setLoading(false) })
  }, [])

  // Sync filter when URL changes (e.g. back/forward navigation)
  useEffect(() => {
    const cat = searchParams.get('cat')
    setFilter(cat || 'all')
  }, [searchParams])

  const handleFilter = (c) => {
    setFilter(c)
    if (c === 'all') setSearchParams({})
    else setSearchParams({ cat: c })
  }

  const cats = ['all', 'ready-to-wear', 'bespoke', 'ankara', 'accessories', 'aso-ebi']
  const filtered = filter === 'all' ? products : products.filter(p => p.category === filter)

  return (
    <div>
      <Navbar />
      <div style={{ minHeight: '100vh', background: '#0A0806', paddingTop: 120, paddingBottom: 80 }}>
        <div className="sbr-page-pad" style={{ padding: '0 60px' }}>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <div style={{ fontFamily: 'Cinzel,serif', fontSize: 9, letterSpacing: '0.4em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: 16 }}>Shop Our Collection</div>
            <h1 style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 'clamp(40px,5vw,64px)', fontWeight: 300, color: '#F9F4EC' }}>
              Our <em style={{ fontStyle: 'italic', color: '#C9A84C' }}>Collection</em>
            </h1>
          </div>

          {/* Filters */}
          <div className="sbr-filter-bar" style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 48 }}>
            {cats.map(c => (
              <button key={c} onClick={() => handleFilter(c)} style={{ fontFamily: 'Cinzel,serif', fontSize: 8, letterSpacing: '0.15em', textTransform: 'uppercase', padding: '9px 18px', border: '1px solid', borderColor: filter === c ? '#C9A84C' : 'rgba(201,168,76,0.25)', background: filter === c ? 'rgba(201,168,76,0.1)' : 'transparent', color: filter === c ? '#C9A84C' : '#8A7A5A', cursor: 'pointer', transition: 'all 0.2s' }}>
                {c === 'all' ? 'Everything' : c}
              </button>
            ))}
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', color: '#8A7A5A', padding: 60 }}>Loading...</div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 80 }}>
              <div style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 24, fontWeight: 300, color: '#8A7A5A', marginBottom: 16 }}>Nothing here yet</div>
              <p style={{ fontSize: 13, color: '#8A7A5A' }}>Check back soon — we're always adding new pieces.</p>
            </div>
          ) : (
            <div className="sbr-collection-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 24 }}>
              {filtered.map(p => (
                <Link key={p.id} to={`/collections/${p.id}`} style={{ textDecoration: 'none', background: '#111009', border: '1px solid rgba(201,168,76,0.12)', overflow: 'hidden', transition: 'border-color 0.3s', display: 'block' }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(201,168,76,0.4)')}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(201,168,76,0.12)')}>
                  <div style={{ height: 340, background: '#1A1710', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {p.images?.[0] ? (
                      <img src={p.images[0]} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                        onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.05)')}
                        onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')} />
                    ) : (
                      <div style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 48, color: '#C9A84C', opacity: 0.2 }}>SBR</div>
                    )}
                  </div>
                  <div style={{ padding: '20px 20px 24px' }}>
                    <div style={{ fontFamily: 'Cinzel,serif', fontSize: 8, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: 6 }}>{p.category}</div>
                    <div style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 20, fontWeight: 400, color: '#F9F4EC', marginBottom: 8 }}>{p.name}</div>
                    {p.description && <p style={{ fontSize: 12, color: '#8A7A5A', lineHeight: 1.7, marginBottom: 16 }}>{p.description}</p>}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 22, fontWeight: 300, color: '#C9A84C' }}>₦{Number(p.price).toLocaleString()}</div>
                      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                        <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleItem(p); }}
                          style={{ width: 36, height: 36, background: isWishlisted(p.id) ? 'rgba(201,168,76,0.15)' : 'transparent', border: '1px solid rgba(201,168,76,0.2)', color: '#C9A84C', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}>
                          <Heart size={14} fill={isWishlisted(p.id) ? '#C9A84C' : 'none'} />
                        </button>
                        <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); addItem(p); }}
                          style={{ width: 36, height: 36, background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.3)', color: '#C9A84C', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
                          onMouseEnter={e => { e.currentTarget.style.background = '#C9A84C'; e.currentTarget.style.color = '#0A0806' }}
                          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(201,168,76,0.1)'; e.currentTarget.style.color = '#C9A84C' }}>
                          <ShoppingBag size={14} />
                        </button>
                        <span style={{ fontFamily: 'Cinzel,serif', fontSize: 8, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#0A0806', background: '#C9A84C', padding: '10px 18px' }}>
                          See More →
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  )
}
