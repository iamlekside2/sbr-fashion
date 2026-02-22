import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, ChevronLeft, Check, Users, Palette, Calendar, Ruler, Send, Plus, Trash2 } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { supabase } from '../lib/supabase'
import { notifyRuth } from '../lib/notifyRuth'
import toast from 'react-hot-toast'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
}

const EVENT_TYPES = [
  { id: 'wedding', image: 'https://source.unsplash.com/120x120/?nigerian-bride', label: 'Wedding' },
  { id: 'engagement', image: 'https://source.unsplash.com/120x120/?african-lace-dress', label: 'Engagement / Introduction' },
  { id: 'naming', image: 'https://source.unsplash.com/120x120/?aso-ebi', label: 'Naming Ceremony' },
  { id: 'birthday', image: 'https://source.unsplash.com/120x120/?ankara-fashion', label: 'Birthday Celebration' },
  { id: 'funeral', image: 'https://source.unsplash.com/120x120/?yoruba-fashion', label: 'Funeral / Remembrance' },
  { id: 'reunion', image: 'https://source.unsplash.com/120x120/?west-african-fashion', label: 'Family Reunion' },
  { id: 'church', image: 'https://source.unsplash.com/120x120/?kente-fashion', label: 'Church / Group Event' },
  { id: 'other', image: 'https://source.unsplash.com/120x120/?owambe', label: 'Other Event' },
]

const FABRIC_OPTIONS = [
  { id: 'ankara', label: 'Ankara Print', price: 'From ₦5,000/yard' },
  { id: 'aso-oke', label: 'Aso-Oke', price: 'From ₦15,000/yard' },
  { id: 'lace', label: 'French / Swiss Lace', price: 'From ₦12,000/yard' },
  { id: 'brocade', label: 'Brocade / Jacquard', price: 'From ₦8,000/yard' },
  { id: 'silk', label: 'Silk / Satin', price: 'From ₦10,000/yard' },
  { id: 'own', label: 'We have our own fabric', price: 'Sewing only' },
]

const COLOUR_PALETTES = [
  { id: 'gold-wine', colors: ['#C9A84C', '#722F37'], label: 'Gold & Wine' },
  { id: 'royal-gold', colors: ['#1A237E', '#C9A84C'], label: 'Royal Blue & Gold' },
  { id: 'coral-cream', colors: ['#FF6B6B', '#FFFDD0'], label: 'Coral & Cream' },
  { id: 'emerald-gold', colors: ['#046307', '#C9A84C'], label: 'Emerald & Gold' },
  { id: 'burgundy-blush', colors: ['#800020', '#FFB6C1'], label: 'Burgundy & Blush' },
  { id: 'teal-bronze', colors: ['#008080', '#CD7F32'], label: 'Teal & Bronze' },
  { id: 'custom', colors: ['#666', '#999'], label: 'Custom Colour' },
]

const STEP_ICONS = [Calendar, Palette, Users, Ruler, Send]
const STEP_LABELS = ['Event', 'Fabric', 'Guests', 'Details', 'Submit']

const labelStyle = { fontFamily: 'Cinzel,serif', fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: 8, display: 'block' }
const inp = {
  width: '100%', padding: '14px 18px', background: '#111009',
  border: '1px solid rgba(201,168,76,0.2)', color: '#F9F4EC',
  fontFamily: 'Jost,sans-serif', fontSize: 14, outline: 'none',
  transition: 'border-color 0.3s',
}

export default function AsoEbiCoordinator() {
  const [step, setStep] = useState(0)
  const [saving, setSaving] = useState(false)
  const [done, setDone] = useState(false)
  const [contact, setContact] = useState({})
  const [form, setForm] = useState({
    event_type: '',
    event_name: '',
    event_date: '',
    fabric_type: '',
    colour_palette: '',
    custom_colour: '',
    guest_count: '',
    guests: [{ name: '', role: '', phone: '' }],
    uniform_style: 'same', // same | varied
    style_notes: '',
    budget_per_person: '',
    coordinator_name: '',
    coordinator_email: '',
    coordinator_whatsapp: '',
    additional_notes: '',
  })

  useEffect(() => { window.scrollTo(0, 0) }, [])

  useEffect(() => {
    supabase.from('site_content').select('*').then(({ data }) => {
      if (data) { const m = {}; data.forEach(d => { m[d.key] = d.value }); setContact(m) }
    })
  }, [])

  const u = (key, val) => setForm(p => ({ ...p, [key]: val }))

  const addGuest = () => {
    if (form.guests.length < 50) {
      setForm(p => ({ ...p, guests: [...p.guests, { name: '', role: '', phone: '' }] }))
    }
  }

  const removeGuest = (idx) => {
    setForm(p => ({ ...p, guests: p.guests.filter((_, i) => i !== idx) }))
  }

  const updateGuest = (idx, key, val) => {
    setForm(p => ({
      ...p,
      guests: p.guests.map((g, i) => i === idx ? { ...g, [key]: val } : g),
    }))
  }

  const canNext = () => {
    if (step === 0) return form.event_type && form.event_name
    if (step === 1) return form.fabric_type && form.colour_palette
    if (step === 2) return form.guest_count
    if (step === 3) return true
    if (step === 4) return form.coordinator_name && form.coordinator_whatsapp
    return true
  }

  const submit = async () => {
    if (!form.coordinator_name || !form.coordinator_whatsapp) {
      toast.error('Please fill in your contact details')
      return
    }
    setSaving(true)
    try {
      const { error } = await supabase.from('aso_ebi_requests').insert([{
        event_type: form.event_type,
        event_name: form.event_name,
        event_date: form.event_date || null,
        fabric_type: form.fabric_type,
        colour_palette: form.colour_palette === 'custom' ? form.custom_colour : form.colour_palette,
        guest_count: parseInt(form.guest_count) || 0,
        guests: form.guests.filter(g => g.name),
        uniform_style: form.uniform_style,
        style_notes: form.style_notes,
        budget_per_person: form.budget_per_person,
        coordinator_name: form.coordinator_name,
        coordinator_email: form.coordinator_email,
        coordinator_whatsapp: form.coordinator_whatsapp,
        additional_notes: form.additional_notes,
      }])
      if (error) throw error
      setDone(true)
      toast.success('Your aso-ebi request is in! We\'ll be in touch soon.')
      notifyRuth('booking', { first_name: form.coordinator_name, whatsapp: form.coordinator_whatsapp, service: `Aso-Ebi: ${form.event_type} — ${form.event_name || 'No name'}`, email: form.coordinator_email, vision: `${form.guest_count} guests, ${form.fabric_type} fabric, ${form.colour_palette} palette` })
    } catch (err) {
      toast.error('Failed to submit. Please try again.')
    }
    setSaving(false)
  }

  const cleanNum = (contact.contact_whatsapp || '').replace(/\D/g, '')

  // ── SUCCESS ──
  if (done) {
    return (
      <div>
        <Navbar />
        <div style={{ minHeight: '100vh', background: '#0A0806', paddingTop: 120, paddingBottom: 80, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            style={{ textAlign: 'center', maxWidth: 500, padding: '0 24px' }}>
            <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(201,168,76,0.1)', border: '2px solid #C9A84C', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
              <Check size={32} color="#C9A84C" />
            </div>
            <div style={{ fontFamily: 'Cinzel,serif', fontSize: 9, letterSpacing: '0.4em', color: '#C9A84C', marginBottom: 12, textTransform: 'uppercase' }}>Request Received</div>
            <h2 style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 32, fontWeight: 300, color: '#F9F4EC', marginBottom: 16 }}>
              We're on It!
            </h2>
            <p style={{ fontSize: 14, color: '#8A7A5A', lineHeight: 1.8, marginBottom: 32 }}>
              We've got your request! We'll reach out within 24 hours with fabric samples, pricing, and a coordination plan for your {form.event_name || 'event'}. You're in good hands!
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href={`https://wa.me/${cleanNum}?text=${encodeURIComponent(`Hi! I just submitted an aso-ebi coordination request for ${form.event_name}. My name is ${form.coordinator_name}.`)}`}
                target="_blank" rel="noreferrer"
                style={{ fontFamily: 'Cinzel,serif', fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase', background: '#25D366', color: '#fff', padding: '14px 28px', textDecoration: 'none' }}>
                Chat on WhatsApp
              </a>
              <a href="/"
                style={{ fontFamily: 'Cinzel,serif', fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase', background: 'transparent', border: '1px solid rgba(201,168,76,0.3)', color: '#C9A84C', padding: '14px 28px', textDecoration: 'none' }}>
                Back to Home
              </a>
            </div>
          </motion.div>
        </div>
        <Footer />
      </div>
    )
  }

  // ── STEPS ──
  const renderStep = () => {
    switch (step) {
      case 0: return (
        <motion.div key="step0" variants={fadeUp} initial="hidden" animate="show" exit="exit">
          <h3 style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 26, fontWeight: 300, color: '#F9F4EC', marginBottom: 24 }}>Tell Us About Your Event</h3>

          <div style={{ marginBottom: 20 }}>
            <label style={labelStyle}>Event Type</label>
            <div className="sbr-aso-event-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
              {EVENT_TYPES.map(ev => (
                <button key={ev.id} onClick={() => u('event_type', ev.id)}
                  style={{
                    background: form.event_type === ev.id ? 'rgba(201,168,76,0.12)' : '#111009',
                    border: `1px solid ${form.event_type === ev.id ? '#C9A84C' : 'rgba(201,168,76,0.15)'}`,
                    padding: '16px 12px', cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s',
                  }}>
                  <div style={{ width: 40, height: 40, borderRadius: 6, overflow: 'hidden', marginBottom: 6 }}>
                    <img src={ev.image} alt={ev.label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div style={{ fontSize: 11, color: form.event_type === ev.id ? '#C9A84C' : '#8A7A5A' }}>{ev.label}</div>
                </button>
              ))}
            </div>
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={labelStyle}>Event Name</label>
            <input value={form.event_name} onChange={e => u('event_name', e.target.value)}
              placeholder="e.g. Chioma & Emeka's Wedding" style={inp}
              onFocus={e => e.target.style.borderColor = 'rgba(201,168,76,0.5)'}
              onBlur={e => e.target.style.borderColor = 'rgba(201,168,76,0.2)'} />
          </div>
          <div>
            <label style={labelStyle}>Event Date</label>
            <input type="date" value={form.event_date} onChange={e => u('event_date', e.target.value)}
              style={{ ...inp, colorScheme: 'dark' }} />
          </div>
        </motion.div>
      )
      case 1: return (
        <motion.div key="step1" variants={fadeUp} initial="hidden" animate="show" exit="exit">
          <h3 style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 26, fontWeight: 300, color: '#F9F4EC', marginBottom: 24 }}>Fabric & Colour</h3>
          <div style={{ marginBottom: 24 }}>
            <label style={labelStyle}>Fabric Type</label>
            <div className="sbr-aso-fabric-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
              {FABRIC_OPTIONS.map(f => (
                <button key={f.id} onClick={() => u('fabric_type', f.id)}
                  style={{
                    background: form.fabric_type === f.id ? 'rgba(201,168,76,0.12)' : '#111009',
                    border: `1px solid ${form.fabric_type === f.id ? '#C9A84C' : 'rgba(201,168,76,0.15)'}`,
                    padding: '18px 14px', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s',
                  }}>
                  <div style={{ fontSize: 13, color: form.fabric_type === f.id ? '#F9F4EC' : '#EDE3D0', marginBottom: 4 }}>{f.label}</div>
                  <div style={{ fontSize: 11, color: '#8A7A5A' }}>{f.price}</div>
                </button>
              ))}
            </div>
          </div>
          <div>
            <label style={labelStyle}>Colour Palette</label>
            <div className="sbr-aso-colour-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: form.colour_palette === 'custom' ? 16 : 0 }}>
              {COLOUR_PALETTES.map(c => (
                <button key={c.id} onClick={() => u('colour_palette', c.id)}
                  style={{
                    background: form.colour_palette === c.id ? 'rgba(201,168,76,0.12)' : '#111009',
                    border: `1px solid ${form.colour_palette === c.id ? '#C9A84C' : 'rgba(201,168,76,0.15)'}`,
                    padding: '16px 12px', cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s',
                  }}>
                  <div style={{ display: 'flex', gap: 4, justifyContent: 'center', marginBottom: 8 }}>
                    {c.colors.map((col, i) => (
                      <div key={i} style={{ width: 20, height: 20, borderRadius: '50%', background: col, border: '1px solid rgba(255,255,255,0.1)' }} />
                    ))}
                  </div>
                  <div style={{ fontSize: 10, color: form.colour_palette === c.id ? '#C9A84C' : '#8A7A5A' }}>{c.label}</div>
                </button>
              ))}
            </div>
            {form.colour_palette === 'custom' && (
              <input value={form.custom_colour} onChange={e => u('custom_colour', e.target.value)}
                placeholder="Describe your desired colours" style={inp}
                onFocus={e => e.target.style.borderColor = 'rgba(201,168,76,0.5)'}
                onBlur={e => e.target.style.borderColor = 'rgba(201,168,76,0.2)'} />
            )}
          </div>
        </motion.div>
      )
      case 2: return (
        <motion.div key="step2" variants={fadeUp} initial="hidden" animate="show" exit="exit">
          <h3 style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 26, fontWeight: 300, color: '#F9F4EC', marginBottom: 24 }}>Who's Rocking the Outfits?</h3>
          <div style={{ marginBottom: 24 }}>
            <label style={labelStyle}>Number of Guests</label>
            <input type="number" value={form.guest_count} onChange={e => u('guest_count', e.target.value)}
              placeholder="How many people are we dressing?" style={inp} min="1"
              onFocus={e => e.target.style.borderColor = 'rgba(201,168,76,0.5)'}
              onBlur={e => e.target.style.borderColor = 'rgba(201,168,76,0.2)'} />
          </div>
          <div style={{ marginBottom: 24 }}>
            <label style={labelStyle}>Outfit Style</label>
            <div style={{ display: 'flex', gap: 10 }}>
              {[
                { v: 'same', l: 'Same Design for Everyone', d: 'Uniform look — same style, same fabric' },
                { v: 'varied', l: 'Varied Styles', d: 'Same fabric, different styles per person' },
              ].map(opt => (
                <button key={opt.v} onClick={() => u('uniform_style', opt.v)}
                  style={{
                    flex: 1, background: form.uniform_style === opt.v ? 'rgba(201,168,76,0.12)' : '#111009',
                    border: `1px solid ${form.uniform_style === opt.v ? '#C9A84C' : 'rgba(201,168,76,0.15)'}`,
                    padding: '18px 16px', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s',
                  }}>
                  <div style={{ fontSize: 13, color: form.uniform_style === opt.v ? '#F9F4EC' : '#EDE3D0', marginBottom: 4 }}>{opt.l}</div>
                  <div style={{ fontSize: 11, color: '#8A7A5A' }}>{opt.d}</div>
                </button>
              ))}
            </div>
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <label style={{ ...labelStyle, marginBottom: 0 }}>Guest List (Optional)</label>
              <button onClick={addGuest} style={{ background: 'none', border: 'none', color: '#C9A84C', cursor: 'pointer', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}>
                <Plus size={14} /> Add Guest
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {form.guests.map((g, i) => (
                <div key={i} className="sbr-aso-guest-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 36px', gap: 8, alignItems: 'center' }}>
                  <input value={g.name} onChange={e => updateGuest(i, 'name', e.target.value)}
                    placeholder="Guest name" style={{ ...inp, padding: '10px 14px', fontSize: 12 }}
                    onFocus={e => e.target.style.borderColor = 'rgba(201,168,76,0.5)'}
                    onBlur={e => e.target.style.borderColor = 'rgba(201,168,76,0.2)'} />
                  <input value={g.role} onChange={e => updateGuest(i, 'role', e.target.value)}
                    placeholder="Role (e.g. Bride's friend)" style={{ ...inp, padding: '10px 14px', fontSize: 12 }}
                    onFocus={e => e.target.style.borderColor = 'rgba(201,168,76,0.5)'}
                    onBlur={e => e.target.style.borderColor = 'rgba(201,168,76,0.2)'} />
                  <input value={g.phone} onChange={e => updateGuest(i, 'phone', e.target.value)}
                    placeholder="Phone number" style={{ ...inp, padding: '10px 14px', fontSize: 12 }}
                    onFocus={e => e.target.style.borderColor = 'rgba(201,168,76,0.5)'}
                    onBlur={e => e.target.style.borderColor = 'rgba(201,168,76,0.2)'} />
                  {form.guests.length > 1 && (
                    <button onClick={() => removeGuest(i)} style={{ background: 'none', border: 'none', color: '#8A7A5A', cursor: 'pointer', padding: 4 }}>
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )
      case 3: return (
        <motion.div key="step3" variants={fadeUp} initial="hidden" animate="show" exit="exit">
          <h3 style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 26, fontWeight: 300, color: '#F9F4EC', marginBottom: 24 }}>Style Details</h3>
          <div style={{ marginBottom: 20 }}>
            <label style={labelStyle}>Budget Per Person</label>
            <select value={form.budget_per_person} onChange={e => u('budget_per_person', e.target.value)}
              style={{ ...inp, cursor: 'pointer' }}>
              <option value="">Select budget range</option>
              <option value="30-50k">₦30,000 - ₦50,000</option>
              <option value="50-80k">₦50,000 - ₦80,000</option>
              <option value="80-120k">₦80,000 - ₦120,000</option>
              <option value="120-200k">₦120,000 - ₦200,000</option>
              <option value="200k+">₦200,000+</option>
              <option value="flexible">Flexible / Open Budget</option>
            </select>
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={labelStyle}>Style Notes / Inspiration</label>
            <textarea value={form.style_notes} onChange={e => u('style_notes', e.target.value)}
              rows={4} placeholder="Tell us the look you're going for — share any reference images or design ideas you have in mind..."
              style={{ ...inp, resize: 'vertical' }}
              onFocus={e => e.target.style.borderColor = 'rgba(201,168,76,0.5)'}
              onBlur={e => e.target.style.borderColor = 'rgba(201,168,76,0.2)'} />
          </div>
          <div>
            <label style={labelStyle}>Additional Notes</label>
            <textarea value={form.additional_notes} onChange={e => u('additional_notes', e.target.value)}
              rows={3} placeholder="Anything else we should know? E.g. matching accessories, children's sizes, etc."
              style={{ ...inp, resize: 'vertical' }}
              onFocus={e => e.target.style.borderColor = 'rgba(201,168,76,0.5)'}
              onBlur={e => e.target.style.borderColor = 'rgba(201,168,76,0.2)'} />
          </div>
        </motion.div>
      )
      case 4: return (
        <motion.div key="step4" variants={fadeUp} initial="hidden" animate="show" exit="exit">
          <h3 style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 26, fontWeight: 300, color: '#F9F4EC', marginBottom: 24 }}>Your Contact Details</h3>
          <div className="sbr-aso-contact-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
            <div>
              <label style={labelStyle}>Your Name *</label>
              <input value={form.coordinator_name} onChange={e => u('coordinator_name', e.target.value)}
                placeholder="Full name" style={inp}
                onFocus={e => e.target.style.borderColor = 'rgba(201,168,76,0.5)'}
                onBlur={e => e.target.style.borderColor = 'rgba(201,168,76,0.2)'} />
            </div>
            <div>
              <label style={labelStyle}>Email</label>
              <input type="email" value={form.coordinator_email} onChange={e => u('coordinator_email', e.target.value)}
                placeholder="your@email.com" style={inp}
                onFocus={e => e.target.style.borderColor = 'rgba(201,168,76,0.5)'}
                onBlur={e => e.target.style.borderColor = 'rgba(201,168,76,0.2)'} />
            </div>
          </div>
          <div style={{ marginBottom: 32 }}>
            <label style={labelStyle}>WhatsApp Number *</label>
            <input value={form.coordinator_whatsapp} onChange={e => u('coordinator_whatsapp', e.target.value)}
              placeholder="+234 801 234 5678" style={inp}
              onFocus={e => e.target.style.borderColor = 'rgba(201,168,76,0.5)'}
              onBlur={e => e.target.style.borderColor = 'rgba(201,168,76,0.2)'} />
          </div>

          {/* Summary */}
          <div style={{ background: '#111009', border: '1px solid rgba(201,168,76,0.15)', padding: '24px 28px', marginBottom: 24 }}>
            <div style={{ ...labelStyle, marginBottom: 16 }}>Order Summary</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {[
                ['Event', form.event_name || '—'],
                ['Type', EVENT_TYPES.find(e => e.id === form.event_type)?.label || '—'],
                ['Date', form.event_date || 'TBD'],
                ['Fabric', FABRIC_OPTIONS.find(f => f.id === form.fabric_type)?.label || '—'],
                ['Colour', form.colour_palette === 'custom' ? form.custom_colour : COLOUR_PALETTES.find(c => c.id === form.colour_palette)?.label || '—'],
                ['Guests', form.guest_count || '—'],
                ['Style', form.uniform_style === 'same' ? 'Uniform' : 'Varied'],
                ['Budget/person', form.budget_per_person?.replace(/-/g, ' - ').replace('k', ',000') || '—'],
              ].map(([k, v]) => (
                <div key={k}>
                  <div style={{ fontSize: 10, color: '#8A7A5A', marginBottom: 2 }}>{k}</div>
                  <div style={{ fontSize: 13, color: '#EDE3D0' }}>{v}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )
      default: return null
    }
  }

  return (
    <div>
      <Navbar />
      <div style={{ minHeight: '100vh', background: '#0A0806', paddingTop: 120, paddingBottom: 80 }}>

        {/* Header */}
        <div className="sbr-page-pad" style={{ padding: '0 60px', textAlign: 'center', marginBottom: 48 }}>
          <div style={{ fontFamily: 'Cinzel,serif', fontSize: 9, letterSpacing: '0.4em', color: '#C9A84C', textTransform: 'uppercase', marginBottom: 16 }}>We Handle the Stress for You</div>
          <h1 style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 'clamp(36px,5vw,56px)', fontWeight: 300, color: '#F9F4EC', margin: '0 0 12px' }}>
            Aso-Ebi <em style={{ fontStyle: 'italic', color: '#C9A84C' }}>Coordinator</em>
          </h1>
          <p style={{ fontSize: 15, color: '#8A7A5A', maxWidth: 560, margin: '0 auto', lineHeight: 1.8 }}>
            Coordinating matching outfits for a group event? Relax — we'll handle the fabric sourcing, design, and tailoring so you can focus on celebrating.
          </p>
        </div>

        <div className="sbr-page-pad" style={{ padding: '0 60px', maxWidth: 800, margin: '0 auto' }}>

          {/* Step progress */}
          <div className="sbr-bespoke-progress" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 24, marginBottom: 48 }}>
            {STEP_LABELS.map((label, i) => {
              const Icon = STEP_ICONS[i]
              const active = i === step
              const completed = i < step
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, opacity: active ? 1 : completed ? 0.6 : 0.3 }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: '50%',
                    background: active ? 'rgba(201,168,76,0.15)' : completed ? 'rgba(201,168,76,0.08)' : 'transparent',
                    border: `1px solid ${active ? '#C9A84C' : completed ? 'rgba(201,168,76,0.3)' : 'rgba(201,168,76,0.15)'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {completed ? <Check size={14} color="#C9A84C" /> : <Icon size={14} color={active ? '#C9A84C' : '#8A7A5A'} />}
                  </div>
                  <span style={{ fontFamily: 'Cinzel,serif', fontSize: 8, letterSpacing: '0.15em', textTransform: 'uppercase', color: active ? '#C9A84C' : '#8A7A5A', display: 'none' }}>{label}</span>
                  {i < STEP_LABELS.length - 1 && <div style={{ width: 24, height: 1, background: 'rgba(201,168,76,0.2)' }} />}
                </div>
              )
            })}
          </div>

          {/* Form content */}
          <div style={{ background: '#0D0B07', border: '1px solid rgba(201,168,76,0.1)', padding: '40px 44px' }}>
            <AnimatePresence mode="wait">
              {renderStep()}
            </AnimatePresence>

            {/* Navigation */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 40, gap: 16 }}>
              {step > 0 ? (
                <button onClick={() => setStep(s => s - 1)}
                  style={{
                    fontFamily: 'Cinzel,serif', fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase',
                    background: 'none', border: '1px solid rgba(201,168,76,0.2)', color: '#C9A84C',
                    padding: '14px 28px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
                  }}>
                  <ChevronLeft size={14} /> Previous
                </button>
              ) : <div />}

              {step < 4 ? (
                <button onClick={() => canNext() && setStep(s => s + 1)}
                  style={{
                    fontFamily: 'Cinzel,serif', fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase',
                    background: canNext() ? 'linear-gradient(135deg, #C9A84C, #8B6914)' : '#333',
                    border: 'none', color: canNext() ? '#0A0806' : '#666',
                    padding: '14px 28px', cursor: canNext() ? 'pointer' : 'not-allowed',
                    display: 'flex', alignItems: 'center', gap: 6,
                  }}>
                  Next <ChevronRight size={14} />
                </button>
              ) : (
                <button onClick={submit} disabled={saving || !canNext()}
                  style={{
                    fontFamily: 'Cinzel,serif', fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase',
                    background: canNext() ? 'linear-gradient(135deg, #C9A84C, #8B6914)' : '#333',
                    border: 'none', color: canNext() ? '#0A0806' : '#666',
                    padding: '14px 32px', cursor: canNext() && !saving ? 'pointer' : 'not-allowed',
                    display: 'flex', alignItems: 'center', gap: 6,
                  }}>
                  {saving ? 'Submitting...' : <><Send size={14} /> Submit Request</>}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
