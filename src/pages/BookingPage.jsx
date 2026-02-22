import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { supabase } from '../lib/supabase'
import { notifyRuth } from '../lib/notifyRuth'
import { useState } from 'react'
import toast from 'react-hot-toast'

export default function BookingPage() {
  const [form, setForm] = useState({ first_name:'', last_name:'', whatsapp:'', email:'', service:'', preferred_date:'', budget_range:'', vision:'' })
  const [saving, setSaving] = useState(false)

  const inp = { width:'100%', background:'#1A1710', border:'1px solid rgba(201,168,76,0.2)', color:'#F9F4EC', padding:'14px 16px', fontFamily:'Jost,sans-serif', fontSize:13, fontWeight:300, outline:'none', transition:'border-color 0.3s' }
  const label = { fontFamily:'Cinzel,serif', fontSize:8, letterSpacing:'0.2em', textTransform:'uppercase', color:'#8A7A5A', display:'block', marginBottom:8 }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.first_name || !form.whatsapp || !form.service) return toast.error('Please fill required fields')
    setSaving(true)
    const { error } = await supabase.from('bookings').insert({ ...form, status: 'pending' })
    if (error) toast.error('Something went wrong. Please try again.')
    else { toast.success('Request sent! We\'ll reach out to you within 24 hours.'); notifyRuth('booking', form); setForm({ first_name:'', last_name:'', whatsapp:'', email:'', service:'', preferred_date:'', budget_range:'', vision:'' }) }
    setSaving(false)
  }

  return (
    <div>
      <Navbar />
      <div style={{ minHeight:'100vh', background:'#0A0806', paddingTop:120, paddingBottom:80 }}>
        <div style={{ maxWidth:760, margin:'0 auto', padding:'0 24px' }}>
          <div style={{ textAlign:'center', marginBottom:60 }}>
            <div style={{ fontFamily:'Cinzel,serif', fontSize:9, letterSpacing:'0.4em', textTransform:'uppercase', color:'#C9A84C', marginBottom:16 }}>Let's Get Started</div>
            <h1 style={{ fontFamily:'Cormorant Garamond,serif', fontSize:'clamp(36px,5vw,60px)', fontWeight:300, color:'#F9F4EC', marginBottom:16 }}>
              Book a Chat with <em style={{fontStyle:'italic',color:'#C9A84C'}}>Ruth</em>
            </h1>
            <p style={{ fontFamily:'Cormorant Garamond,serif', fontStyle:'italic', fontSize:16, color:'#8A7A5A' }}>Every amazing outfit starts with a conversation.</p>
          </div>

          <div className="sbr-booking-box" style={{ background:'#111009', border:'1px solid rgba(201,168,76,0.15)', padding:48 }}>
            <form onSubmit={handleSubmit}>
              <div className="sbr-form-row" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:16 }}>
                <div><label style={label}>First Name *</label><input style={inp} value={form.first_name} onChange={e=>setForm({...form,first_name:e.target.value})} placeholder="Amaka" onFocus={e=>(e.target.style.borderColor='#C9A84C')} onBlur={e=>(e.target.style.borderColor='rgba(201,168,76,0.2)')} /></div>
                <div><label style={label}>Last Name</label><input style={inp} value={form.last_name} onChange={e=>setForm({...form,last_name:e.target.value})} placeholder="Obi" onFocus={e=>(e.target.style.borderColor='#C9A84C')} onBlur={e=>(e.target.style.borderColor='rgba(201,168,76,0.2)')} /></div>
              </div>
              <div className="sbr-form-row" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:16 }}>
                <div><label style={label}>WhatsApp *</label><input style={inp} value={form.whatsapp} onChange={e=>setForm({...form,whatsapp:e.target.value})} placeholder="+234 801 234 5678" onFocus={e=>(e.target.style.borderColor='#C9A84C')} onBlur={e=>(e.target.style.borderColor='rgba(201,168,76,0.2)')} /></div>
                <div><label style={label}>Email</label><input style={inp} type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="amaka@email.com" onFocus={e=>(e.target.style.borderColor='#C9A84C')} onBlur={e=>(e.target.style.borderColor='rgba(201,168,76,0.2)')} /></div>
              </div>
              <div style={{ marginBottom:16 }}>
                <label style={label}>Service Interested In *</label>
                <select style={{...inp,appearance:'none'}} value={form.service} onChange={e=>setForm({...form,service:e.target.value})}>
                  <option value="">Select a service</option>
                  {['Custom-Made Outfit','Ready-to-Wear Purchase','Style Advice Session','Ankara & African Print','Occasion / Aso-Ebi Order','Accessories'].map(s=><option key={s}>{s}</option>)}
                </select>
              </div>
              <div className="sbr-form-row" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:16 }}>
                <div><label style={label}>Preferred Date</label><input style={inp} type="date" value={form.preferred_date} onChange={e=>setForm({...form,preferred_date:e.target.value})} /></div>
                <div>
                  <label style={label}>Budget Range</label>
                  <select style={{...inp,appearance:'none'}} value={form.budget_range} onChange={e=>setForm({...form,budget_range:e.target.value})}>
                    <option value="">Select range</option>
                    {['₦20,000 – ₦50,000','₦50,000 – ₦150,000','₦150,000 – ₦300,000','₦300,000+'].map(b=><option key={b}>{b}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ marginBottom:32 }}>
                <label style={label}>Tell Us What You Have in Mind</label>
                <textarea style={{...inp,height:120,resize:'none'}} value={form.vision} onChange={e=>setForm({...form,vision:e.target.value})} placeholder="What's the occasion? What style are you thinking? Any pictures for inspiration? Tell us everything!" onFocus={e=>(e.target.style.borderColor='#C9A84C')} onBlur={e=>(e.target.style.borderColor='rgba(201,168,76,0.2)')} />
              </div>
              <button type="submit" disabled={saving} style={{ width:'100%', background:'linear-gradient(135deg,#E8C97A,#C9A84C)', color:'#0A0806', border:'none', padding:'18px', fontFamily:'Cinzel,serif', fontSize:10, fontWeight:600, letterSpacing:'0.3em', textTransform:'uppercase', cursor:saving?'not-allowed':'pointer', opacity:saving?0.7:1 }}>
                {saving ? 'Sending...' : 'Send Request ◆ We\'ll Get Back to You Within 24hrs'}
              </button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
