import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, X, Palette, Search, MessageCircle } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}
const stagger = { show: { transition: { staggerChildren: 0.06 } } }

const CATEGORIES = [
  { id: 'all', label: 'All Fabrics' },
  { id: 'ankara', label: 'Ankara' },
  { id: 'aso-oke', label: 'Aso-Oke' },
  { id: 'lace', label: 'Lace' },
  { id: 'silk', label: 'Silk & Satin' },
  { id: 'brocade', label: 'Brocade' },
  { id: 'cotton', label: 'Cotton & Linen' },
  { id: 'chiffon', label: 'Chiffon & Crepe' },
]

/* Default swatches shown when no DB records exist */
const DEFAULT_SWATCHES = [
  { id: 'd1', name: 'Royal Blue Ankara', category: 'ankara', colour: 'Blue', price_per_yard: 5000, description: 'Bold royal blue with traditional motifs. This one is perfect for turning heads at any event!', image_url: '' },
  { id: 'd2', name: 'Gold Brocade Imperial', category: 'brocade', colour: 'Gold', price_per_yard: 8000, description: 'Rich gold brocade with woven patterns. A top pick for agbada and senator styles.', image_url: '' },
  { id: 'd3', name: 'Ivory Swiss Lace', category: 'lace', colour: 'Ivory', price_per_yard: 12000, description: 'Premium Swiss voile lace with intricate embroidery. A favourite for weddings — you\'ll love the feel!', image_url: '' },
  { id: 'd4', name: 'Emerald Silk Charmeuse', category: 'silk', colour: 'Green', price_per_yard: 10000, description: 'Luxurious silk charmeuse with a gorgeous drape. Perfect for evening gowns that make a statement.', image_url: '' },
  { id: 'd5', name: 'Coral Aso-Oke', category: 'aso-oke', colour: 'Coral', price_per_yard: 15000, description: 'Hand-woven Yoruba prestige cloth in stunning coral. A must-have for ceremonies!', image_url: '' },
  { id: 'd6', name: 'White Cotton Poplin', category: 'cotton', colour: 'White', price_per_yard: 3500, description: 'Crisp cotton poplin — breathable, versatile, and great for everyday wear.', image_url: '' },
]

const inp = {
  width: '100%', padding: '12px 16px', background: '#111009',
  border: '1px solid rgba(201,168,76,0.2)', color: '#F9F4EC',
  fontFamily: 'Jost,sans-serif', fontSize: 13, outline: 'none',
  transition: 'border-color 0.3s',
}
const labelStyle = { fontFamily: 'Cinzel,serif', fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: 6, display: 'block' }
const btn = { fontFamily: 'Cinzel,serif', fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.3s' }

export default function FabricSwatches() {
  const [swatches, setSwatches] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)
  const [requestOpen, setRequestOpen] = useState(false)
  const [requestItems, setRequestItems] = useState([])
  const [contact, setContact] = useState({})
  const [form, setForm] = useState({ name: '', email: '', whatsapp: '', notes: '' })
  const [sending, setSending] = useState(false)

  useEffect(() => { window.scrollTo(0, 0) }, [])

  useEffect(() => {
    const fetchSwatches = async () => {
      const { data } = await supabase.from('fabric_swatches').select('*').eq('available', true).order('created_at', { ascending: false })
      setSwatches(data && data.length > 0 ? data : DEFAULT_SWATCHES)
      setLoading(false)
    }
    fetchSwatches()

    supabase.from('site_content').select('*').then(({ data }) => {
      if (data) { const m = {}; data.forEach(d => { m[d.key] = d.value }); setContact(m) }
    })
  }, [])

  const filtered = swatches.filter(s => {
    if (filter !== 'all' && s.category !== filter) return false
    if (search && !s.name.toLowerCase().includes(search.toLowerCase()) && !s.colour?.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const toggleRequest = (swatch) => {
    setRequestItems(prev =>
      prev.find(i => i.id === swatch.id)
        ? prev.filter(i => i.id !== swatch.id)
        : [...prev, swatch]
    )
  }

  const isRequested = (id) => requestItems.some(i => i.id === id)

  const submitRequest = async () => {
    if (!form.name || !form.whatsapp) {
      toast.error('Please enter your name and WhatsApp number')
      return
    }
    if (requestItems.length === 0) {
      toast.error('Please select at least one swatch')
      return
    }
    setSending(true)
    try {
      const { error } = await supabase.from('messages').insert([{
        name: form.name,
        email: form.email || '',
        whatsapp: form.whatsapp,
        subject: 'Fabric Swatch Request',
        message: `Swatch samples requested:\n${requestItems.map(s => `- ${s.name} (${s.category})`).join('\n')}\n\nNotes: ${form.notes || 'None'}`,
      }])
      if (error) throw error
      toast.success('Request sent! We\'ll be in touch soon with your samples.')
      setRequestOpen(false)
      setRequestItems([])
      setForm({ name: '', email: '', whatsapp: '', notes: '' })
    } catch (err) {
      toast.error('Failed to send. Please try again.')
    }
    setSending(false)
  }

  const cleanNum = (contact.contact_whatsapp || '').replace(/\D/g, '')

  return (
    <div>
      <Navbar />
      <div style={{ minHeight: '100vh', background: '#0A0806', paddingTop: 120, paddingBottom: 80 }}>
        <div className="sbr-page-pad" style={{ padding: '0 60px', maxWidth: 1200, margin: '0 auto' }}>

          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ fontFamily: 'Cinzel,serif', fontSize: 9, letterSpacing: '0.4em', color: '#C9A84C', textTransform: 'uppercase', marginBottom: 16 }}>Explore Our Materials</div>
            <h1 style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 'clamp(36px,5vw,56px)', fontWeight: 300, color: '#F9F4EC', margin: '0 0 12px' }}>
              Fabric <em style={{ fontStyle: 'italic', color: '#C9A84C' }}>Swatches</em>
            </h1>
            <p style={{ fontSize: 15, color: '#8A7A5A', maxWidth: 520, margin: '0 auto', lineHeight: 1.8 }}>
              Browse our beautiful collection of premium fabrics. Pick your favourites and we'll send you physical samples — it's that easy!
            </p>
          </div>

          {/* Toolbar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
            {/* Search */}
            <div style={{ position: 'relative', width: 280 }}>
              <Search size={16} color="#8A7A5A" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search fabrics..."
                style={{ ...inp, paddingLeft: 40, width: '100%' }}
                onFocus={e => e.target.style.borderColor = 'rgba(201,168,76,0.5)'}
                onBlur={e => e.target.style.borderColor = 'rgba(201,168,76,0.2)'} />
            </div>

            {/* Request samples button */}
            {requestItems.length > 0 && (
              <button onClick={() => setRequestOpen(true)}
                style={{ ...btn, background: 'linear-gradient(135deg, #C9A84C, #8B6914)', border: 'none', color: '#0A0806', padding: '12px 24px', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Send size={14} /> Request {requestItems.length} Sample{requestItems.length > 1 ? 's' : ''}
              </button>
            )}
          </div>

          {/* Category filter */}
          <div className="sbr-swatch-filters" style={{ display: 'flex', gap: 8, marginBottom: 32, flexWrap: 'wrap' }}>
            {CATEGORIES.map(c => (
              <button key={c.id} onClick={() => setFilter(c.id)}
                style={{
                  ...btn, padding: '8px 16px',
                  background: filter === c.id ? 'rgba(201,168,76,0.1)' : 'transparent',
                  border: `1px solid ${filter === c.id ? '#C9A84C' : 'rgba(201,168,76,0.15)'}`,
                  color: filter === c.id ? '#C9A84C' : '#8A7A5A',
                }}>
                {c.label}
              </button>
            ))}
          </div>

          {/* Swatch grid */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: '#8A7A5A' }}>Loading swatches...</div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <Palette size={40} color="#8A7A5A" style={{ marginBottom: 16, opacity: 0.5 }} />
              <p style={{ fontSize: 14, color: '#8A7A5A' }}>No fabrics match your search.</p>
            </div>
          ) : (
            <motion.div variants={stagger} initial="hidden" animate="show"
              className="sbr-swatch-grid"
              style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
              {filtered.map(s => (
                <motion.div key={s.id} variants={fadeUp}
                  style={{
                    background: '#111009', border: `1px solid ${isRequested(s.id) ? '#C9A84C' : 'rgba(201,168,76,0.1)'}`,
                    overflow: 'hidden', cursor: 'pointer', transition: 'border-color 0.3s', position: 'relative',
                  }}
                  onClick={() => setSelected(s)}>
                  {/* Selection check */}
                  <button onClick={e => { e.stopPropagation(); toggleRequest(s) }}
                    style={{
                      position: 'absolute', top: 10, right: 10, zIndex: 3,
                      width: 28, height: 28, borderRadius: '50%',
                      background: isRequested(s.id) ? '#C9A84C' : 'rgba(10,8,6,0.7)',
                      border: `1px solid ${isRequested(s.id) ? '#C9A84C' : 'rgba(201,168,76,0.3)'}`,
                      color: isRequested(s.id) ? '#0A0806' : '#C9A84C',
                      cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'all 0.2s',
                    }}>
                    {isRequested(s.id) ? '✓' : <Plus size={14} />}
                  </button>

                  {/* Swatch image */}
                  <div style={{ aspectRatio: '1', overflow: 'hidden', background: '#1A1710' }}>
                    {s.image_url ? (
                      <img src={s.image_url} alt={s.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }}
                        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'} />
                    ) : (
                      <div style={{
                        width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
                        alignItems: 'center', justifyContent: 'center', gap: 8,
                        background: `linear-gradient(135deg, rgba(201,168,76,0.08), rgba(201,168,76,0.02))`,
                      }}>
                        <Palette size={28} color="#8A7A5A" style={{ opacity: 0.3 }} />
                        <span style={{ fontSize: 10, color: '#8A7A5A' }}>Image coming soon</span>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div style={{ padding: '14px 16px 18px' }}>
                    <div style={{ fontFamily: 'Cinzel,serif', fontSize: 8, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#8A7A5A', marginBottom: 4 }}>
                      {s.category?.replace(/-/g, ' ')} {s.colour ? `· ${s.colour}` : ''}
                    </div>
                    <div style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 17, color: '#F9F4EC', marginBottom: 6, lineHeight: 1.3 }}>{s.name}</div>
                    <div style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 16, color: '#C9A84C' }}>₦{Number(s.price_per_yard || 0).toLocaleString()}/yard</div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>

      {/* Detail modal */}
      <AnimatePresence>
        {selected && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, zIndex: 600, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            onClick={() => setSelected(null)}>
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)' }} />
            <motion.div initial={{ y: 30 }} animate={{ y: 0 }}
              onClick={e => e.stopPropagation()}
              style={{ position: 'relative', background: '#111009', border: '1px solid rgba(201,168,76,0.2)', width: '90%', maxWidth: 560, maxHeight: '80vh', overflow: 'auto', padding: 0 }}>
              <button onClick={() => setSelected(null)} style={{ position: 'absolute', top: 16, right: 16, zIndex: 5, background: 'rgba(10,8,6,0.7)', border: 'none', color: '#EDE3D0', cursor: 'pointer', padding: 6, borderRadius: '50%' }}>
                <X size={18} />
              </button>
              <div style={{ aspectRatio: '4/3', background: '#1A1710', overflow: 'hidden' }}>
                {selected.image_url ? (
                  <img src={selected.image_url} alt={selected.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Palette size={48} color="#8A7A5A" style={{ opacity: 0.2 }} />
                  </div>
                )}
              </div>
              <div style={{ padding: '24px 28px 28px' }}>
                <div style={{ fontFamily: 'Cinzel,serif', fontSize: 8, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#8A7A5A', marginBottom: 8 }}>
                  {selected.category?.replace(/-/g, ' ')} {selected.colour ? `· ${selected.colour}` : ''}
                </div>
                <h3 style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 28, fontWeight: 300, color: '#F9F4EC', marginBottom: 8 }}>{selected.name}</h3>
                <div style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 22, color: '#C9A84C', marginBottom: 16 }}>₦{Number(selected.price_per_yard || 0).toLocaleString()}/yard</div>
                {selected.description && <p style={{ fontSize: 14, color: '#8A7A5A', lineHeight: 1.8, marginBottom: 24 }}>{selected.description}</p>}
                <div style={{ display: 'flex', gap: 10 }}>
                  <button onClick={() => { toggleRequest(selected); setSelected(null) }}
                    style={{ ...btn, flex: 1, background: isRequested(selected.id) ? 'transparent' : 'linear-gradient(135deg, #C9A84C, #8B6914)', border: isRequested(selected.id) ? '1px solid rgba(201,168,76,0.3)' : 'none', color: isRequested(selected.id) ? '#C9A84C' : '#0A0806', padding: '14px 20px', textAlign: 'center' }}>
                    {isRequested(selected.id) ? 'Remove from Request' : '+ Add to Sample Request'}
                  </button>
                  <a href={`https://wa.me/${cleanNum}?text=${encodeURIComponent(`Hi, I'm interested in the ${selected.name} fabric. Is it available?`)}`}
                    target="_blank" rel="noreferrer"
                    style={{ ...btn, background: '#25D366', border: 'none', color: '#fff', padding: '14px 20px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <MessageCircle size={14} />
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Request modal */}
      <AnimatePresence>
        {requestOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, zIndex: 600, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            onClick={() => setRequestOpen(false)}>
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)' }} />
            <motion.div initial={{ y: 30 }} animate={{ y: 0 }}
              onClick={e => e.stopPropagation()}
              style={{ position: 'relative', background: '#111009', border: '1px solid rgba(201,168,76,0.2)', width: '90%', maxWidth: 500, maxHeight: '85vh', overflow: 'auto', padding: 32 }}>
              <button onClick={() => setRequestOpen(false)} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', color: '#8A7A5A', cursor: 'pointer' }}>
                <X size={18} />
              </button>

              <div style={{ fontFamily: 'Cinzel,serif', fontSize: 9, letterSpacing: '0.3em', color: '#C9A84C', textTransform: 'uppercase', marginBottom: 8 }}>Request Samples</div>
              <h3 style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 24, fontWeight: 300, color: '#F9F4EC', marginBottom: 24 }}>Your Selected Swatches</h3>

              {/* Selected items */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
                {requestItems.map(s => (
                  <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: '#0A0806', border: '1px solid rgba(201,168,76,0.08)' }}>
                    <div>
                      <div style={{ fontSize: 13, color: '#EDE3D0' }}>{s.name}</div>
                      <div style={{ fontSize: 10, color: '#8A7A5A' }}>{s.category?.replace(/-/g, ' ')}</div>
                    </div>
                    <button onClick={() => toggleRequest(s)} style={{ background: 'none', border: 'none', color: '#8A7A5A', cursor: 'pointer' }}>
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Contact form */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 24 }}>
                <div>
                  <label style={labelStyle}>Your Name *</label>
                  <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Full name" style={inp}
                    onFocus={e => e.target.style.borderColor = 'rgba(201,168,76,0.5)'}
                    onBlur={e => e.target.style.borderColor = 'rgba(201,168,76,0.2)'} />
                </div>
                <div>
                  <label style={labelStyle}>WhatsApp Number *</label>
                  <input value={form.whatsapp} onChange={e => setForm(p => ({ ...p, whatsapp: e.target.value }))} placeholder="+234 801 234 5678" style={inp}
                    onFocus={e => e.target.style.borderColor = 'rgba(201,168,76,0.5)'}
                    onBlur={e => e.target.style.borderColor = 'rgba(201,168,76,0.2)'} />
                </div>
                <div>
                  <label style={labelStyle}>Email (Optional)</label>
                  <input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} placeholder="your@email.com" style={inp}
                    onFocus={e => e.target.style.borderColor = 'rgba(201,168,76,0.5)'}
                    onBlur={e => e.target.style.borderColor = 'rgba(201,168,76,0.2)'} />
                </div>
                <div>
                  <label style={labelStyle}>Notes (Optional)</label>
                  <textarea value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} rows={2} placeholder="What are you making? Any specific things you'd like us to know?" style={{ ...inp, resize: 'vertical' }}
                    onFocus={e => e.target.style.borderColor = 'rgba(201,168,76,0.5)'}
                    onBlur={e => e.target.style.borderColor = 'rgba(201,168,76,0.2)'} />
                </div>
              </div>

              <button onClick={submitRequest} disabled={sending}
                style={{ ...btn, width: '100%', background: 'linear-gradient(135deg, #C9A84C, #8B6914)', border: 'none', color: '#0A0806', padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                <Send size={14} /> {sending ? 'Sending...' : 'Submit Request'}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  )
}

function Plus({ size }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
}
