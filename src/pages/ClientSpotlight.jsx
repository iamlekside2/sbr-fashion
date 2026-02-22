import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight, Instagram, Quote } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { supabase } from '../lib/supabase'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
}
const stagger = { show: { transition: { staggerChildren: 0.1 } } }

/* Default spotlights when no DB records */
const DEFAULTS = [
  { id: 'd1', client_name: 'Chioma A.', location: 'Lagos', occasion: 'Wedding Guest', quote: 'Every time I wear SBR, I feel like royalty. The attention to detail is unmatched.', image_url: '', product_link: '' },
  { id: 'd2', client_name: 'Adaeze N.', location: 'Abuja', occasion: 'Birthday Celebration', quote: 'Ruth understood my vision before I even finished explaining. The dress was perfection.', image_url: '', product_link: '' },
  { id: 'd3', client_name: 'Toyin O.', location: 'London', occasion: 'Owambe', quote: 'I get stopped everywhere asking who made my outfit. SBR every single time.', image_url: '', product_link: '' },
]

export default function ClientSpotlight() {
  const [spotlights, setSpotlights] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)
  const [selectedIdx, setSelectedIdx] = useState(0)

  useEffect(() => { window.scrollTo(0, 0) }, [])

  useEffect(() => {
    supabase.from('client_spotlights').select('*')
      .eq('published', true)
      .order('featured', { ascending: false })
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setSpotlights(data && data.length > 0 ? data : DEFAULTS)
        setLoading(false)
      })
  }, [])

  const openSpotlight = (s, idx) => {
    setSelected(s)
    setSelectedIdx(idx)
  }

  const navigate = (dir) => {
    const newIdx = selectedIdx + dir
    if (newIdx >= 0 && newIdx < spotlights.length) {
      setSelected(spotlights[newIdx])
      setSelectedIdx(newIdx)
    }
  }

  const labelStyle = { fontFamily: 'Cinzel,serif', fontSize: 9, letterSpacing: '0.4em', textTransform: 'uppercase', color: '#C9A84C' }

  return (
    <div>
      <Navbar />
      <div style={{ minHeight: '100vh', background: '#0A0806', paddingTop: 120, paddingBottom: 80 }}>
        <div className="sbr-page-pad" style={{ padding: '0 60px', maxWidth: 1200, margin: '0 auto' }}>

          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <div style={labelStyle}>Real Clients, Real Style</div>
            <h1 style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 'clamp(36px,5vw,56px)', fontWeight: 300, color: '#F9F4EC', margin: '16px 0 12px' }}>
              Client <em style={{ fontStyle: 'italic', color: '#C9A84C' }}>Spotlight</em>
            </h1>
            <p style={{ fontSize: 15, color: '#8A7A5A', maxWidth: 520, margin: '0 auto', lineHeight: 1.8 }}>
              Celebrating the incredible women (and men) who wear Stitches by Ruthchinos with pride and confidence.
            </p>
          </div>

          {/* Spotlight grid */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: '#8A7A5A' }}>Loading spotlights...</div>
          ) : (
            <motion.div variants={stagger} initial="hidden" animate="show"
              className="sbr-spotlight-grid"
              style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
              {spotlights.map((s, idx) => (
                <motion.div key={s.id} variants={fadeUp}
                  onClick={() => openSpotlight(s, idx)}
                  style={{
                    background: '#111009', border: '1px solid rgba(201,168,76,0.1)',
                    overflow: 'hidden', cursor: 'pointer', transition: 'border-color 0.3s, transform 0.3s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(201,168,76,0.35)'; e.currentTarget.style.transform = 'translateY(-4px)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(201,168,76,0.1)'; e.currentTarget.style.transform = 'translateY(0)' }}>
                  {/* Image */}
                  <div style={{ aspectRatio: '3/4', background: '#1A1710', overflow: 'hidden', position: 'relative' }}>
                    {s.image_url ? (
                      <img src={s.image_url} alt={s.client_name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }} />
                    ) : (
                      <div style={{
                        width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
                        alignItems: 'center', justifyContent: 'center', gap: 12,
                        background: 'linear-gradient(135deg, rgba(201,168,76,0.06), rgba(201,168,76,0.02))',
                      }}>
                        <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(201,168,76,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <span style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 28, color: '#C9A84C' }}>
                            {s.client_name?.charAt(0)}
                          </span>
                        </div>
                      </div>
                    )}
                    {/* Gradient overlay */}
                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '50%', background: 'linear-gradient(transparent, rgba(10,8,6,0.9))' }} />
                    {/* Name overlay */}
                    <div style={{ position: 'absolute', bottom: 16, left: 20, right: 20 }}>
                      <div style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 22, color: '#F9F4EC', marginBottom: 4 }}>{s.client_name}</div>
                      <div style={{ fontFamily: 'Cinzel,serif', fontSize: 8, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#C9A84C' }}>
                        {s.occasion} {s.location ? `· ${s.location}` : ''}
                      </div>
                    </div>
                  </div>

                  {/* Quote */}
                  <div style={{ padding: '20px 24px 24px' }}>
                    <Quote size={16} color="#C9A84C" style={{ opacity: 0.4, marginBottom: 8 }} />
                    <p style={{ fontSize: 14, color: '#EDE3D0', lineHeight: 1.7, fontStyle: 'italic', margin: 0 }}>
                      "{s.quote?.substring(0, 120)}{s.quote?.length > 120 ? '...' : ''}"
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* CTA */}
          <div style={{ textAlign: 'center', marginTop: 60 }}>
            <div style={{ ...labelStyle, marginBottom: 16 }}>Want to be Featured?</div>
            <p style={{ fontSize: 14, color: '#8A7A5A', marginBottom: 24 }}>Share your SBR story with us on Instagram and tag @stitchesbyruthchinos</p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/book" style={{
                fontFamily: 'Cinzel,serif', fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase',
                background: 'linear-gradient(135deg, #C9A84C, #8B6914)', color: '#0A0806',
                padding: '14px 32px', textDecoration: 'none',
              }}>
                Book Your Outfit
              </Link>
              <Link to="/collections" style={{
                fontFamily: 'Cinzel,serif', fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase',
                background: 'transparent', border: '1px solid rgba(201,168,76,0.3)', color: '#C9A84C',
                padding: '14px 32px', textDecoration: 'none',
              }}>
                Browse Collections
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Detail lightbox */}
      <AnimatePresence>
        {selected && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, zIndex: 600, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            onClick={() => setSelected(null)}>
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.85)' }} />

            {/* Nav arrows */}
            {selectedIdx > 0 && (
              <button onClick={e => { e.stopPropagation(); navigate(-1) }}
                style={{ position: 'absolute', left: 24, top: '50%', transform: 'translateY(-50%)', background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.2)', color: '#C9A84C', width: 44, height: 44, borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 5 }}>
                <ChevronLeft size={20} />
              </button>
            )}
            {selectedIdx < spotlights.length - 1 && (
              <button onClick={e => { e.stopPropagation(); navigate(1) }}
                style={{ position: 'absolute', right: 24, top: '50%', transform: 'translateY(-50%)', background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.2)', color: '#C9A84C', width: 44, height: 44, borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 5 }}>
                <ChevronRight size={20} />
              </button>
            )}

            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }}
              onClick={e => e.stopPropagation()}
              className="sbr-spotlight-detail"
              style={{ position: 'relative', background: '#111009', border: '1px solid rgba(201,168,76,0.2)', display: 'grid', gridTemplateColumns: '1fr 1fr', width: '90%', maxWidth: 800, maxHeight: '85vh', overflow: 'hidden' }}>
              <button onClick={() => setSelected(null)} style={{ position: 'absolute', top: 16, right: 16, zIndex: 5, background: 'rgba(10,8,6,0.7)', border: 'none', color: '#EDE3D0', cursor: 'pointer', padding: 6, borderRadius: '50%' }}>
                <X size={18} />
              </button>

              {/* Image */}
              <div style={{ aspectRatio: '3/4', background: '#1A1710', overflow: 'hidden' }}>
                {selected.image_url ? (
                  <img src={selected.image_url} alt={selected.client_name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(201,168,76,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 36, color: '#C9A84C' }}>{selected.client_name?.charAt(0)}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Content */}
              <div style={{ padding: '36px 32px', display: 'flex', flexDirection: 'column', justifyContent: 'center', overflow: 'auto' }}>
                <div style={labelStyle}>{selected.occasion}</div>
                <h3 style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 28, fontWeight: 300, color: '#F9F4EC', margin: '8px 0 4px' }}>{selected.client_name}</h3>
                {selected.location && <div style={{ fontSize: 12, color: '#8A7A5A', marginBottom: 24 }}>{selected.location}</div>}

                <Quote size={20} color="#C9A84C" style={{ opacity: 0.3, marginBottom: 12 }} />
                <p style={{ fontSize: 16, color: '#EDE3D0', lineHeight: 1.9, fontStyle: 'italic', margin: '0 0 24px' }}>
                  "{selected.quote}"
                </p>

                {selected.instagram && (
                  <a href={`https://instagram.com/${selected.instagram.replace('@', '')}`} target="_blank" rel="noreferrer"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#C9A84C', fontSize: 12, textDecoration: 'none', marginBottom: 24 }}>
                    <Instagram size={14} /> {selected.instagram}
                  </a>
                )}

                {selected.product_link && (
                  <Link to={selected.product_link} onClick={() => setSelected(null)}
                    style={{
                      fontFamily: 'Cinzel,serif', fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase',
                      background: 'linear-gradient(135deg, #C9A84C, #8B6914)', color: '#0A0806',
                      padding: '12px 24px', textDecoration: 'none', textAlign: 'center', display: 'inline-block',
                    }}>
                    Shop This Look
                  </Link>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  )
}
