import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'
import { ChevronRight, ChevronLeft, Check, Scissors, Palette, Ruler, User, Sparkles } from 'lucide-react'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
}

/* ── STEP DATA ── */
const GARMENTS = [
  { id: 'dress', emoji: '👗', label: 'Dress / Gown', desc: 'Elegant dresses, evening gowns, and midi styles' },
  { id: 'suit', emoji: '🤵', label: 'Suit / Two-Piece', desc: 'Tailored suits, senator styles, and matching sets' },
  { id: 'agbada', emoji: '👑', label: 'Agbada / Kaftan', desc: 'Grand Agbada, flowing kaftans, and traditional robes' },
  { id: 'blouse-skirt', emoji: '✨', label: 'Blouse & Skirt', desc: 'Peplum blouses, iro and buba, skirt combinations' },
  { id: 'jumpsuit', emoji: '💫', label: 'Jumpsuit / Playsuit', desc: 'Chic jumpsuits and modern playsuits' },
  { id: 'bridal', emoji: '💍', label: 'Bridal Outfit', desc: 'Wedding dresses, engagement outfits, aso-oke sets' },
]

const STYLES = [
  { id: 'modern', emoji: '🌟', label: 'Modern & Contemporary', desc: 'Clean lines, modern cuts, minimal embellishments' },
  { id: 'traditional', emoji: '🌺', label: 'Traditional African', desc: 'Classic Nigerian silhouettes, cultural richness' },
  { id: 'fusion', emoji: '🎨', label: 'Afro-Fusion', desc: 'Blending African heritage with global fashion trends' },
  { id: 'glamour', emoji: '💎', label: 'Full Glamour', desc: 'Heavy embellishments, beadwork, stones, luxe finish' },
  { id: 'minimalist', emoji: '🕊️', label: 'Elegant Minimalist', desc: 'Understated luxury, quality over ornamentation' },
]

const FABRICS = [
  { id: 'ankara', emoji: '🎭', label: 'Ankara Print', desc: 'Bold African wax prints in vibrant patterns', price: '₦45,000+' },
  { id: 'aso-oke', emoji: '👑', label: 'Aso-Oke', desc: 'Hand-woven Yoruba prestige cloth', price: '₦85,000+' },
  { id: 'lace', emoji: '✨', label: 'French / Swiss Lace', desc: 'Premium imported lace with intricate detailing', price: '₦70,000+' },
  { id: 'silk', emoji: '🌙', label: 'Silk & Satin', desc: 'Luxurious silk and satin for a flowing finish', price: '₦60,000+' },
  { id: 'brocade', emoji: '💫', label: 'Brocade / Jacquard', desc: 'Rich textured fabrics with woven patterns', price: '₦55,000+' },
  { id: 'crepe', emoji: '🕊️', label: 'Crepe / Chiffon', desc: 'Lightweight, elegant draping fabrics', price: '₦50,000+' },
  { id: 'own-fabric', emoji: '📦', label: 'I Have My Own Fabric', desc: 'Send us your fabric and we\'ll craft the outfit', price: 'Sewing only' },
]

const OCCASIONS = [
  'Wedding', 'Engagement / Introduction', 'Owambe / Party', 'Corporate / Office',
  'Church / Sunday Best', 'Birthday Celebration', 'Naming Ceremony', 'Graduation',
  'Date Night', 'Everyday Luxury', 'Other',
]

const STEP_ICONS = [Scissors, Sparkles, Palette, Ruler, User]
const STEP_LABELS = ['Garment', 'Style', 'Fabric', 'Details', 'Contact']

export default function BespokeConfigurator() {
  const [step, setStep] = useState(0)
  const [saving, setSaving] = useState(false)
  const [done, setDone] = useState(false)
  const [config, setConfig] = useState({
    garment: '',
    style: '',
    fabric: '',
    occasion: '',
    deadline: '',
    budget: '',
    notes: '',
    bust: '', waist: '', hips: '', shoulder: '', arm_length: '', outfit_length: '',
    name: '', email: '', whatsapp: '', has_reference_images: false,
  })

  const [contact, setContact] = useState({})

  useEffect(() => {
    window.scrollTo(0, 0)
    supabase.from('site_content').select('*').then(({ data }) => {
      if (data) {
        const map = {}
        data.forEach(d => { map[d.key] = d.value })
        setContact(map)
      }
    })
  }, [])

  const set = (key, val) => setConfig(prev => ({ ...prev, [key]: val }))

  const inp = { width: '100%', background: '#1A1710', border: '1px solid rgba(201,168,76,0.2)', color: '#F9F4EC', padding: '14px 16px', fontFamily: 'Jost,sans-serif', fontSize: 13, fontWeight: 300, outline: 'none', transition: 'border-color 0.3s' }
  const labelStyle = { fontFamily: 'Cinzel,serif', fontSize: 8, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#8A7A5A', display: 'block', marginBottom: 8 }

  const canNext = () => {
    if (step === 0) return !!config.garment
    if (step === 1) return !!config.style
    if (step === 2) return !!config.fabric
    if (step === 3) return !!config.occasion
    if (step === 4) return !!config.name && !!config.whatsapp
    return false
  }

  const handleSubmit = async () => {
    if (!config.name || !config.whatsapp) return toast.error('Please enter your name and WhatsApp number')
    setSaving(true)

    // Build the order payload
    const payload = {
      garment_type: config.garment,
      style_preference: config.style,
      fabric_choice: config.fabric,
      occasion: config.occasion,
      deadline: config.deadline || null,
      budget_range: config.budget || null,
      special_notes: config.notes || '',
      measurements: {
        bust: config.bust, waist: config.waist, hips: config.hips,
        shoulder: config.shoulder, arm_length: config.arm_length, outfit_length: config.outfit_length,
      },
      has_reference_images: config.has_reference_images,
      client_name: config.name,
      client_email: config.email || '',
      client_whatsapp: config.whatsapp,
      status: 'new',
    }

    const { error } = await supabase.from('bespoke_orders').insert(payload)
    if (error) {
      console.error(error)
      toast.error('Something went wrong. Please try again or contact us on WhatsApp.')
    } else {
      setDone(true)
      toast.success('Your bespoke order has been submitted!')
    }
    setSaving(false)
  }

  /* ── CARD PICKER COMPONENT ── */
  const CardPicker = ({ items, selected, onSelect, showPrice }) => (
    <div className="sbr-bespoke-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
      {items.map(item => {
        const active = selected === item.id
        return (
          <button key={item.id} onClick={() => onSelect(item.id)} style={{
            background: active ? 'rgba(201,168,76,0.08)' : '#111009',
            border: `2px solid ${active ? '#C9A84C' : 'rgba(201,168,76,0.12)'}`,
            padding: '24px 16px', cursor: 'pointer', textAlign: 'left',
            transition: 'all 0.3s', position: 'relative', overflow: 'hidden',
          }}
            onMouseEnter={e => { if (!active) e.currentTarget.style.borderColor = 'rgba(201,168,76,0.4)' }}
            onMouseLeave={e => { if (!active) e.currentTarget.style.borderColor = 'rgba(201,168,76,0.12)' }}>
            {active && (
              <div style={{ position: 'absolute', top: 8, right: 8, width: 20, height: 20, background: '#C9A84C', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Check size={12} color="#0A0806" strokeWidth={3} />
              </div>
            )}
            <div style={{ fontSize: 28, marginBottom: 10 }}>{item.emoji}</div>
            <div style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 17, fontWeight: 400, color: active ? '#C9A84C' : '#F9F4EC', marginBottom: 4 }}>{item.label}</div>
            <div style={{ fontSize: 11, color: '#8A7A5A', lineHeight: 1.5 }}>{item.desc}</div>
            {showPrice && item.price && (
              <div style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 14, color: '#C9A84C', marginTop: 8, fontWeight: 300 }}>{item.price}</div>
            )}
          </button>
        )
      })}
    </div>
  )

  /* ── STEP CONTENT ── */
  const renderStep = () => {
    switch (step) {
      case 0: // Garment Type
        return (
          <motion.div key="step0" variants={fadeUp} initial="hidden" animate="show" exit="exit">
            <div style={{ marginBottom: 32 }}>
              <h2 style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 'clamp(28px,3vw,40px)', fontWeight: 300, color: '#F9F4EC', marginBottom: 8 }}>
                What are we making <em style={{ fontStyle: 'italic', color: '#C9A84C' }}>for you?</em>
              </h2>
              <p style={{ fontSize: 14, color: '#8A7A5A' }}>Pick the type of outfit you want.</p>
            </div>
            <CardPicker items={GARMENTS} selected={config.garment} onSelect={v => set('garment', v)} />
          </motion.div>
        )

      case 1: // Style
        return (
          <motion.div key="step1" variants={fadeUp} initial="hidden" animate="show" exit="exit">
            <div style={{ marginBottom: 32 }}>
              <h2 style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 'clamp(28px,3vw,40px)', fontWeight: 300, color: '#F9F4EC', marginBottom: 8 }}>
                What's your <em style={{ fontStyle: 'italic', color: '#C9A84C' }}>style?</em>
              </h2>
              <p style={{ fontSize: 14, color: '#8A7A5A' }}>Which vibe matches what you're going for?</p>
            </div>
            <CardPicker items={STYLES} selected={config.style} onSelect={v => set('style', v)} />
          </motion.div>
        )

      case 2: // Fabric
        return (
          <motion.div key="step2" variants={fadeUp} initial="hidden" animate="show" exit="exit">
            <div style={{ marginBottom: 32 }}>
              <h2 style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 'clamp(28px,3vw,40px)', fontWeight: 300, color: '#F9F4EC', marginBottom: 8 }}>
                Pick your <em style={{ fontStyle: 'italic', color: '#C9A84C' }}>fabric</em>
              </h2>
              <p style={{ fontSize: 14, color: '#8A7A5A' }}>Choose a fabric type — we'll pick the perfect one together when we chat.</p>
            </div>
            <CardPicker items={FABRICS} selected={config.fabric} onSelect={v => set('fabric', v)} showPrice />
          </motion.div>
        )

      case 3: // Details: occasion, deadline, budget, measurements, notes
        return (
          <motion.div key="step3" variants={fadeUp} initial="hidden" animate="show" exit="exit">
            <div style={{ marginBottom: 32 }}>
              <h2 style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 'clamp(28px,3vw,40px)', fontWeight: 300, color: '#F9F4EC', marginBottom: 8 }}>
                Give us the <em style={{ fontStyle: 'italic', color: '#C9A84C' }}>details</em>
              </h2>
              <p style={{ fontSize: 14, color: '#8A7A5A' }}>What's the occasion? And if you know your measurements, even better.</p>
            </div>

            {/* Occasion */}
            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>Occasion *</label>
              <div className="sbr-bespoke-occasions" style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {OCCASIONS.map(o => (
                  <button key={o} onClick={() => set('occasion', o)} style={{
                    fontFamily: 'Cinzel,serif', fontSize: 8, letterSpacing: '0.1em', textTransform: 'uppercase',
                    padding: '8px 14px', border: '1px solid',
                    borderColor: config.occasion === o ? '#C9A84C' : 'rgba(201,168,76,0.2)',
                    background: config.occasion === o ? 'rgba(201,168,76,0.1)' : 'transparent',
                    color: config.occasion === o ? '#C9A84C' : '#8A7A5A',
                    cursor: 'pointer', transition: 'all 0.2s',
                  }}>
                    {o}
                  </button>
                ))}
              </div>
            </div>

            {/* Deadline + Budget */}
            <div className="sbr-form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
              <div>
                <label style={labelStyle}>When Do You Need It?</label>
                <input type="date" style={inp} value={config.deadline} onChange={e => set('deadline', e.target.value)}
                  onFocus={e => (e.target.style.borderColor = '#C9A84C')} onBlur={e => (e.target.style.borderColor = 'rgba(201,168,76,0.2)')} />
              </div>
              <div>
                <label style={labelStyle}>Budget Range</label>
                <select style={{ ...inp, appearance: 'none' }} value={config.budget} onChange={e => set('budget', e.target.value)}>
                  <option value="">Select range</option>
                  {['₦50,000 – ₦100,000', '₦100,000 – ₦200,000', '₦200,000 – ₦400,000', '₦400,000 – ₦700,000', '₦700,000+'].map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
            </div>

            {/* Measurements */}
            <div style={{ background: '#111009', border: '1px solid rgba(201,168,76,0.12)', padding: 24, marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <Ruler size={16} color="#C9A84C" />
                <span style={{ ...labelStyle, marginBottom: 0 }}>Measurements (in inches) — optional, we can measure at fitting</span>
              </div>
              <div className="sbr-bespoke-measures" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                {[
                  ['bust', 'Bust'], ['waist', 'Waist'], ['hips', 'Hips'],
                  ['shoulder', 'Shoulder'], ['arm_length', 'Arm Length'], ['outfit_length', 'Outfit Length'],
                ].map(([key, lbl]) => (
                  <div key={key}>
                    <label style={{ ...labelStyle, fontSize: 7 }}>{lbl}</label>
                    <input style={inp} type="number" placeholder="—" value={config[key]} onChange={e => set(key, e.target.value)}
                      onFocus={e => (e.target.style.borderColor = '#C9A84C')} onBlur={e => (e.target.style.borderColor = 'rgba(201,168,76,0.2)')} />
                  </div>
                ))}
              </div>
            </div>

            {/* Special Notes */}
            <div>
              <label style={labelStyle}>Anything Else We Should Know?</label>
              <textarea style={{ ...inp, height: 90, resize: 'none' }} value={config.notes} onChange={e => set('notes', e.target.value)}
                placeholder="Tell us everything — sleeve style, neckline, colour ideas, or share your Pinterest board..."
                onFocus={e => (e.target.style.borderColor = '#C9A84C')} onBlur={e => (e.target.style.borderColor = 'rgba(201,168,76,0.2)')} />
            </div>
          </motion.div>
        )

      case 4: // Contact
        return (
          <motion.div key="step4" variants={fadeUp} initial="hidden" animate="show" exit="exit">
            <div style={{ marginBottom: 32 }}>
              <h2 style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 'clamp(28px,3vw,40px)', fontWeight: 300, color: '#F9F4EC', marginBottom: 8 }}>
                Last step — <em style={{ fontStyle: 'italic', color: '#C9A84C' }}>how do we reach you?</em>
              </h2>
              <p style={{ fontSize: 14, color: '#8A7A5A' }}>Drop your details so we can chat about your outfit.</p>
            </div>

            <div className="sbr-form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
              <div>
                <label style={labelStyle}>Full Name *</label>
                <input style={inp} value={config.name} onChange={e => set('name', e.target.value)} placeholder="Amaka Obi"
                  onFocus={e => (e.target.style.borderColor = '#C9A84C')} onBlur={e => (e.target.style.borderColor = 'rgba(201,168,76,0.2)')} />
              </div>
              <div>
                <label style={labelStyle}>WhatsApp Number *</label>
                <input style={inp} value={config.whatsapp} onChange={e => set('whatsapp', e.target.value)} placeholder="+234 801 234 5678"
                  onFocus={e => (e.target.style.borderColor = '#C9A84C')} onBlur={e => (e.target.style.borderColor = 'rgba(201,168,76,0.2)')} />
              </div>
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>Email (Optional)</label>
              <input style={inp} type="email" value={config.email} onChange={e => set('email', e.target.value)} placeholder="amaka@email.com"
                onFocus={e => (e.target.style.borderColor = '#C9A84C')} onBlur={e => (e.target.style.borderColor = 'rgba(201,168,76,0.2)')} />
            </div>

            {/* Reference images checkbox */}
            <label style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', marginBottom: 24, padding: '16px 20px', background: '#111009', border: '1px solid rgba(201,168,76,0.12)' }}>
              <div onClick={() => set('has_reference_images', !config.has_reference_images)} style={{
                width: 22, height: 22, border: '2px solid', flexShrink: 0,
                borderColor: config.has_reference_images ? '#C9A84C' : 'rgba(201,168,76,0.3)',
                background: config.has_reference_images ? '#C9A84C' : 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s',
              }}>
                {config.has_reference_images && <Check size={14} color="#0A0806" strokeWidth={3} />}
              </div>
              <div>
                <div style={{ fontSize: 13, color: '#EDE3D0' }}>I have reference images / inspiration photos</div>
                <div style={{ fontSize: 11, color: '#8A7A5A', marginTop: 2 }}>We'll ask you to share them via WhatsApp after submission</div>
              </div>
            </label>

            {/* Summary */}
            <div style={{ background: '#111009', border: '1px solid rgba(201,168,76,0.15)', padding: 24 }}>
              <div style={{ fontFamily: 'Cinzel,serif', fontSize: 9, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: 16 }}>Your Order Summary</div>
              {[
                ['Garment', GARMENTS.find(g => g.id === config.garment)?.label],
                ['Style', STYLES.find(s => s.id === config.style)?.label],
                ['Fabric', FABRICS.find(f => f.id === config.fabric)?.label],
                ['Occasion', config.occasion],
                ['Deadline', config.deadline || 'Flexible'],
                ['Budget', config.budget || 'Not specified'],
              ].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', marginBottom: 8, fontSize: 13 }}>
                  <div style={{ fontFamily: 'Cinzel,serif', fontSize: 8, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#8A7A5A', width: 90, flexShrink: 0, marginTop: 2 }}>{k}</div>
                  <div style={{ color: '#EDE3D0' }}>{v || '—'}</div>
                </div>
              ))}
            </div>
          </motion.div>
        )

      default:
        return null
    }
  }

  /* ── SUCCESS STATE ── */
  if (done) {
    const waNumber = (contact.contact_whatsapp || '+234 801 234 5678').replace(/\D/g, '')
    const waText = encodeURIComponent(`Hi! I just submitted a bespoke order on your website.\n\nName: ${config.name}\nGarment: ${GARMENTS.find(g => g.id === config.garment)?.label}\nStyle: ${STYLES.find(s => s.id === config.style)?.label}\nFabric: ${FABRICS.find(f => f.id === config.fabric)?.label}\nOccasion: ${config.occasion}\n\nI'd love to discuss the details!`)

    return (
      <div>
        <Navbar />
        <div style={{ minHeight: '100vh', background: '#0A0806', paddingTop: 120, paddingBottom: 80, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }}
            style={{ maxWidth: 560, textAlign: 'center', padding: '0 24px' }}>
            <div style={{ width: 80, height: 80, background: 'linear-gradient(135deg,#E8C97A,#C9A84C)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 32px' }}>
              <Check size={36} color="#0A0806" strokeWidth={2.5} />
            </div>
            <h1 style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 'clamp(32px,4vw,48px)', fontWeight: 300, color: '#F9F4EC', marginBottom: 16 }}>
              Order <em style={{ fontStyle: 'italic', color: '#C9A84C' }}>Received!</em>
            </h1>
            <p style={{ fontSize: 15, color: '#8A7A5A', lineHeight: 1.8, marginBottom: 40 }}>
              Thank you, {config.name}! Your order has been submitted! Our team will go through everything and reach out within 24 hours to set up a chat.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href={`https://wa.me/${waNumber}?text=${waText}`} target="_blank" rel="noreferrer"
                style={{ fontFamily: 'Cinzel,serif', fontSize: 10, fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#0A0806', background: 'linear-gradient(135deg,#E8C97A,#C9A84C)', padding: '16px 32px', textDecoration: 'none', transition: 'opacity 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.opacity = '0.9')} onMouseLeave={e => (e.currentTarget.style.opacity = '1')}>
                Chat on WhatsApp
              </a>
              <Link to="/collections"
                style={{ fontFamily: 'Cinzel,serif', fontSize: 10, fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#C9A84C', border: '1px solid rgba(201,168,76,0.4)', padding: '16px 32px', textDecoration: 'none', transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(201,168,76,0.1)'; e.currentTarget.style.borderColor = '#C9A84C' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(201,168,76,0.4)' }}>
                See Our Collection
              </Link>
            </div>
          </motion.div>
        </div>
        <Footer />
      </div>
    )
  }

  /* ── MAIN RENDER ── */
  return (
    <div>
      <Navbar />
      <div style={{ minHeight: '100vh', background: '#0A0806', paddingTop: 120, paddingBottom: 80 }}>
        <div className="sbr-page-pad" style={{ maxWidth: 900, margin: '0 auto', padding: '0 24px' }}>

          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ fontFamily: 'Cinzel,serif', fontSize: 9, letterSpacing: '0.4em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: 16 }}>Design Your Perfect Outfit</div>
            <h1 style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 'clamp(36px,5vw,60px)', fontWeight: 300, color: '#F9F4EC', marginBottom: 16 }}>
              Custom Outfit <em style={{ fontStyle: 'italic', color: '#C9A84C' }}>Builder</em>
            </h1>
            <p style={{ fontFamily: 'Cormorant Garamond,serif', fontStyle: 'italic', fontSize: 16, color: '#8A7A5A' }}>Build your dream outfit in five easy steps.</p>
          </div>

          {/* Progress Bar */}
          <div className="sbr-bespoke-progress" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0, marginBottom: 48 }}>
            {STEP_LABELS.map((label, i) => {
              const Icon = STEP_ICONS[i]
              const isActive = i === step
              const isDone = i < step
              return (
                <div key={label} style={{ display: 'flex', alignItems: 'center' }}>
                  <div onClick={() => { if (isDone) setStep(i) }} style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                    cursor: isDone ? 'pointer' : 'default', opacity: isActive || isDone ? 1 : 0.35,
                    transition: 'opacity 0.3s',
                  }}>
                    <div style={{
                      width: 40, height: 40, borderRadius: '50%',
                      border: `2px solid ${isDone ? '#C9A84C' : isActive ? '#C9A84C' : 'rgba(201,168,76,0.3)'}`,
                      background: isDone ? '#C9A84C' : 'transparent',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'all 0.3s',
                    }}>
                      {isDone ? <Check size={16} color="#0A0806" strokeWidth={3} /> : <Icon size={16} color={isActive ? '#C9A84C' : '#8A7A5A'} />}
                    </div>
                    <span style={{ fontFamily: 'Cinzel,serif', fontSize: 7, letterSpacing: '0.15em', textTransform: 'uppercase', color: isActive ? '#C9A84C' : isDone ? '#C9A84C' : '#8A7A5A' }}>{label}</span>
                  </div>
                  {i < STEP_LABELS.length - 1 && (
                    <div style={{ width: 48, height: 1, background: i < step ? '#C9A84C' : 'rgba(201,168,76,0.15)', margin: '0 8px', marginBottom: 20, transition: 'background 0.3s' }} />
                  )}
                </div>
              )
            })}
          </div>

          {/* Step Content */}
          <div style={{ background: '#0A0806', minHeight: 380 }}>
            <AnimatePresence mode="wait">
              {renderStep()}
            </AnimatePresence>
          </div>

          {/* Navigation Buttons */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 40, paddingTop: 32, borderTop: '1px solid rgba(201,168,76,0.1)' }}>
            {step > 0 ? (
              <button onClick={() => setStep(step - 1)} style={{
                display: 'flex', alignItems: 'center', gap: 8,
                fontFamily: 'Cinzel,serif', fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase',
                color: '#8A7A5A', background: 'none', border: '1px solid rgba(201,168,76,0.2)',
                padding: '14px 24px', cursor: 'pointer', transition: 'all 0.2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#C9A84C'; e.currentTarget.style.color = '#C9A84C' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(201,168,76,0.2)'; e.currentTarget.style.color = '#8A7A5A' }}>
                <ChevronLeft size={14} /> Back
              </button>
            ) : <div />}

            {step < 4 ? (
              <button onClick={() => { if (canNext()) setStep(step + 1) }} disabled={!canNext()} style={{
                display: 'flex', alignItems: 'center', gap: 8,
                fontFamily: 'Cinzel,serif', fontSize: 10, fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase',
                color: '#0A0806', background: canNext() ? 'linear-gradient(135deg,#E8C97A,#C9A84C)' : 'rgba(201,168,76,0.2)',
                border: 'none', padding: '16px 32px',
                cursor: canNext() ? 'pointer' : 'not-allowed', transition: 'all 0.2s',
              }}>
                Continue <ChevronRight size={14} />
              </button>
            ) : (
              <button onClick={handleSubmit} disabled={!canNext() || saving} style={{
                display: 'flex', alignItems: 'center', gap: 8,
                fontFamily: 'Cinzel,serif', fontSize: 10, fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase',
                color: '#0A0806', background: canNext() && !saving ? 'linear-gradient(135deg,#E8C97A,#C9A84C)' : 'rgba(201,168,76,0.2)',
                border: 'none', padding: '16px 32px',
                cursor: canNext() && !saving ? 'pointer' : 'not-allowed', transition: 'all 0.2s',
              }}>
                {saving ? 'Submitting...' : 'Submit Your Order'} <Sparkles size={14} />
              </button>
            )}
          </div>

        </div>
      </div>
      <Footer />
    </div>
  )
}
