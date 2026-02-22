import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'
import { MapPin, Phone, Instagram, Mail, Send } from 'lucide-react'

export default function Contact() {
  const [form, setForm] = useState({ name:'', email:'', whatsapp:'', subject:'General Enquiry', message:'' })
  const [saving, setSaving] = useState(false)
  const [contact, setContact] = useState({})

  useEffect(() => {
    supabase.from('site_content').select('*').then(({ data }) => {
      if (data) {
        const map = {}
        data.forEach(d => { map[d.key] = d.value })
        setContact(map)
      }
    })
  }, [])

  const whatsapp = contact.contact_whatsapp || '+234 801 234 5678'
  const instagram = contact.contact_instagram || '@stitchesbyruthchinos'
  const email = contact.contact_email || 'info@sbr.com'
  const location = contact.contact_location || 'Lagos, Nigeria'
  const waNumber = whatsapp.replace(/\D/g, '')
  const igHandle = instagram.replace(/^@/, '')

  const inp = { width:'100%', background:'#1A1710', border:'1px solid rgba(201,168,76,0.2)', color:'#F9F4EC', padding:'14px 16px', fontFamily:'Jost,sans-serif', fontSize:13, fontWeight:300, outline:'none', transition:'border-color 0.3s' }
  const label = { fontFamily:'Cinzel,serif', fontSize:8, letterSpacing:'0.2em', textTransform:'uppercase', color:'#8A7A5A', display:'block', marginBottom:8 }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) return toast.error('Please fill in your name, email and message')
    setSaving(true)
    const { error } = await supabase.from('messages').insert({ name: form.name, email: form.email, whatsapp: form.whatsapp, subject: form.subject, message: form.message, read: false })
    if (error) toast.error('Something went wrong. Please try again.')
    else { toast.success('Message sent! We\'ll get back to you soon.'); setForm({ name:'', email:'', whatsapp:'', subject:'General Enquiry', message:'' }) }
    setSaving(false)
  }

  const subjects = ['General Enquiry', 'Pricing & Quotes', 'Order Status', 'Collaboration', 'Wholesale / Bulk', 'Other']

  return (
    <div>
      <Navbar />
      <div style={{ minHeight:'100vh', background:'#0A0806', paddingTop:120, paddingBottom:80 }}>
        <div style={{ maxWidth:1100, margin:'0 auto', padding:'0 24px' }}>
          <div style={{ textAlign:'center', marginBottom:60 }}>
            <div style={{ fontFamily:'Cinzel,serif', fontSize:9, letterSpacing:'0.4em', textTransform:'uppercase', color:'#C9A84C', marginBottom:16 }}>Get In Touch</div>
            <h1 style={{ fontFamily:'Cormorant Garamond,serif', fontSize:'clamp(36px,5vw,60px)', fontWeight:300, color:'#F9F4EC', marginBottom:16 }}>
              We'd Love to <em style={{ fontStyle:'italic', color:'#C9A84C' }}>Hear From You</em>
            </h1>
            <p style={{ fontFamily:'Cormorant Garamond,serif', fontStyle:'italic', fontSize:16, color:'#8A7A5A' }}>Whether it's a question, a custom order, or just to say hello.</p>
          </div>

          <div className="sbr-contact-grid" style={{ display:'grid', gridTemplateColumns:'1fr 380px', gap:48, alignItems:'start' }}>
            {/* Form */}
            <div className="sbr-form-box" style={{ background:'#111009', border:'1px solid rgba(201,168,76,0.15)', padding:48 }}>
              <form onSubmit={handleSubmit}>
                <div className="sbr-form-row" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:16 }}>
                  <div>
                    <label style={label}>Your Name *</label>
                    <input style={inp} value={form.name} onChange={e => setForm({...form, name:e.target.value})} placeholder="Amaka Obi"
                      onFocus={e => (e.target.style.borderColor='#C9A84C')} onBlur={e => (e.target.style.borderColor='rgba(201,168,76,0.2)')} />
                  </div>
                  <div>
                    <label style={label}>Email Address *</label>
                    <input style={inp} type="email" value={form.email} onChange={e => setForm({...form, email:e.target.value})} placeholder="amaka@email.com"
                      onFocus={e => (e.target.style.borderColor='#C9A84C')} onBlur={e => (e.target.style.borderColor='rgba(201,168,76,0.2)')} />
                  </div>
                </div>
                <div className="sbr-form-row" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:16 }}>
                  <div>
                    <label style={label}>WhatsApp (Optional)</label>
                    <input style={inp} value={form.whatsapp} onChange={e => setForm({...form, whatsapp:e.target.value})} placeholder="+234 801 234 5678"
                      onFocus={e => (e.target.style.borderColor='#C9A84C')} onBlur={e => (e.target.style.borderColor='rgba(201,168,76,0.2)')} />
                  </div>
                  <div>
                    <label style={label}>Subject</label>
                    <select style={{...inp, appearance:'none'}} value={form.subject} onChange={e => setForm({...form, subject:e.target.value})}>
                      {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
                <div style={{ marginBottom:32 }}>
                  <label style={label}>Your Message *</label>
                  <textarea style={{...inp, height:150, resize:'none'}} value={form.message} onChange={e => setForm({...form, message:e.target.value})} placeholder="Tell us what you need — we're here to help..."
                    onFocus={e => (e.target.style.borderColor='#C9A84C')} onBlur={e => (e.target.style.borderColor='rgba(201,168,76,0.2)')} />
                </div>
                <button type="submit" disabled={saving} style={{ width:'100%', display:'flex', alignItems:'center', justifyContent:'center', gap:10, background:'linear-gradient(135deg,#E8C97A,#C9A84C)', color:'#0A0806', border:'none', padding:'18px', fontFamily:'Cinzel,serif', fontSize:10, fontWeight:600, letterSpacing:'0.3em', textTransform:'uppercase', cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1 }}>
                  <Send size={14} /> {saving ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>

            {/* Contact Info Sidebar */}
            <div>
              <div style={{ background:'#111009', border:'1px solid rgba(201,168,76,0.15)', padding:32, marginBottom:16 }}>
                <div style={{ fontFamily:'Cinzel,serif', fontSize:9, letterSpacing:'0.25em', textTransform:'uppercase', color:'#C9A84C', marginBottom:24 }}>Contact Info</div>
                {[
                  { icon: MapPin, label: 'Visit Us', value: location, href: `https://maps.google.com/?q=${encodeURIComponent(location)}` },
                  { icon: Phone, label: 'WhatsApp', value: whatsapp, href: `https://wa.me/${waNumber}` },
                  { icon: Instagram, label: 'Instagram', value: instagram, href: `https://instagram.com/${igHandle}` },
                  { icon: Mail, label: 'Email', value: email, href: `mailto:${email}` },
                ].map(({ icon: Icon, label: lbl, value, href }) => (
                  <a key={lbl} href={href} target="_blank" rel="noreferrer" style={{ display:'flex', alignItems:'flex-start', gap:14, textDecoration:'none', marginBottom:20, paddingBottom:20, borderBottom:'1px solid rgba(201,168,76,0.08)' }}
                    onMouseEnter={e => { const el = e.currentTarget.querySelector('.cval'); if (el) el.style.color = '#C9A84C' }}
                    onMouseLeave={e => { const el = e.currentTarget.querySelector('.cval'); if (el) el.style.color = '#EDE3D0' }}>
                    <div style={{ width:36, height:36, background:'rgba(201,168,76,0.1)', border:'1px solid rgba(201,168,76,0.2)', display:'flex', alignItems:'center', justifyContent:'center', color:'#C9A84C', flexShrink:0 }}>
                      <Icon size={15} />
                    </div>
                    <div>
                      <div style={{ fontFamily:'Cinzel,serif', fontSize:7, letterSpacing:'0.2em', textTransform:'uppercase', color:'#8A7A5A', marginBottom:4 }}>{lbl}</div>
                      <div className="cval" style={{ fontSize:13, color:'#EDE3D0', transition:'color 0.2s' }}>{value}</div>
                    </div>
                  </a>
                ))}
              </div>

              {/* Quick CTA */}
              <div style={{ background:'#111009', border:'1px solid rgba(201,168,76,0.15)', padding:32, textAlign:'center' }}>
                <div style={{ fontFamily:'Cormorant Garamond,serif', fontSize:20, fontWeight:300, color:'#F9F4EC', marginBottom:8 }}>Need something custom?</div>
                <p style={{ fontSize:12, color:'#8A7A5A', marginBottom:20 }}>Book a private consultation for bespoke orders and styling.</p>
                <a href="/book" style={{ fontFamily:'Cinzel,serif', fontSize:9, letterSpacing:'0.2em', textTransform:'uppercase', color:'#0A0806', background:'#C9A84C', padding:'12px 24px', textDecoration:'none', display:'inline-block', transition:'background 0.2s' }}
                  onMouseEnter={e => (e.currentTarget.style.background='#E8C97A')}
                  onMouseLeave={e => (e.currentTarget.style.background='#C9A84C')}>
                  Book Consultation
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
