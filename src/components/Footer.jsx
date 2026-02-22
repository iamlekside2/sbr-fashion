import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Instagram, MessageCircle, Mail, MapPin, Phone } from 'lucide-react'
import { supabase } from '../lib/supabase'

export default function Footer() {
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

  // Clean phone number for WhatsApp link (digits only)
  const waNumber = whatsapp.replace(/\D/g, '')
  // Clean Instagram handle for URL (remove @ if present)
  const igHandle = instagram.replace(/^@/, '')

  const waLink = `https://wa.me/${waNumber}`
  const igLink = `https://instagram.com/${igHandle}`
  const emailLink = `mailto:${email}`

  const s = {
    footer: { background:'#111009', borderTop:'1px solid rgba(201,168,76,0.15)', padding:'80px 60px 40px' },
    grid: { display:'grid', gridTemplateColumns:'2fr 1fr 1fr 1fr 1fr', gap:48, marginBottom:60, paddingBottom:60, borderBottom:'1px solid rgba(201,168,76,0.1)' },
    colTitle: { fontFamily:'Cinzel,serif', fontSize:9, letterSpacing:'0.25em', textTransform:'uppercase', color:'#C9A84C', marginBottom:20 },
    link: { fontSize:13, color:'#8A7A5A', textDecoration:'none', display:'block', marginBottom:10, transition:'color 0.3s' },
    tagline: { fontFamily:'Cormorant Garamond,serif', fontStyle:'italic', fontSize:15, color:'#8A7A5A', marginBottom:24 },
    bottom: { display:'flex', justifyContent:'space-between', alignItems:'center' },
    copy: { fontSize:11, color:'#8A7A5A' },
  }

  const socials = [
    { icon: Instagram, href: igLink, label: 'Instagram' },
    { icon: MessageCircle, href: waLink, label: 'WhatsApp' },
    { icon: Mail, href: emailLink, label: 'Email' },
  ]

  return (
    <footer className="sbr-footer" style={s.footer}>
      <div className="sbr-footer-grid" style={s.grid}>
        <div>
          <img src="/logo-gold.png" alt="SBR" style={{ height:56, marginBottom:20 }} />
          <div style={s.tagline}>"We Make You Look Amazing"</div>
          <div style={{ display:'flex', gap:12 }}>
            {socials.map(({ icon: Icon, href, label }) => (
              <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={label} style={{ width:36, height:36, border:'1px solid rgba(201,168,76,0.2)', display:'flex', alignItems:'center', justifyContent:'center', color:'#8A7A5A', transition:'all 0.3s' }}
                onMouseEnter={e=>{ e.currentTarget.style.borderColor='#C9A84C'; e.currentTarget.style.color='#C9A84C' }}
                onMouseLeave={e=>{ e.currentTarget.style.borderColor='rgba(201,168,76,0.2)'; e.currentTarget.style.color='#8A7A5A' }}>
                <Icon size={14} />
              </a>
            ))}
          </div>
        </div>

        <div>
          <div style={s.colTitle}>Quick Links</div>
          {[['/', 'Home'], ['/collections', 'Collections'], ['/services', 'Services'], ['/lookbook', 'Our Work'], ['/book', 'Let\'s Talk']].map(([to, label]) => (
            <Link key={to} to={to} style={s.link}
              onMouseEnter={e=>(e.currentTarget.style.color='#C9A84C')}
              onMouseLeave={e=>(e.currentTarget.style.color='#8A7A5A')}>
              {label}
            </Link>
          ))}
        </div>

        <div>
          <div style={s.colTitle}>Services</div>
          {[
            ['/collections?cat=bespoke', 'Custom-Made Outfits'],
            ['/collections?cat=ready-to-wear', 'Ready-to-Wear'],
            ['/collections?cat=ankara', 'Ankara Pieces'],
            ['/collections?cat=accessories', 'Accessories'],
            ['/collections?cat=aso-ebi', 'Aso-Ebi Styles'],
          ].map(([to, label]) => (
            <Link key={label} to={to} style={s.link}
              onMouseEnter={e=>(e.currentTarget.style.color='#C9A84C')}
              onMouseLeave={e=>(e.currentTarget.style.color='#8A7A5A')}>
              {label}
            </Link>
          ))}
        </div>

        <div>
          <div style={s.colTitle}>Explore</div>
          {[
            ['/style-quiz', 'Style Quiz'],
            ['/dress-my-occasion', 'Dress My Occasion'],
            ['/outfit-builder', 'Outfit Builder'],
            ['/fabrics', 'Fabric Swatches'],
            ['/spotlight', 'Client Spotlight'],
            ['/loyalty', 'Loyalty Programme'],
            ['/aso-ebi', 'Aso-Ebi Coordinator'],
          ].map(([to, label]) => (
            <Link key={to} to={to} style={s.link}
              onMouseEnter={e=>(e.currentTarget.style.color='#C9A84C')}
              onMouseLeave={e=>(e.currentTarget.style.color='#8A7A5A')}>
              {label}
            </Link>
          ))}
        </div>

        <div>
          <div style={s.colTitle}>Contact</div>
          <a href={`https://maps.google.com/?q=${encodeURIComponent(location)}`} target="_blank" rel="noreferrer" style={{ ...s.link, display:'flex', alignItems:'center', gap:8 }}
            onMouseEnter={e=>(e.currentTarget.style.color='#C9A84C')}
            onMouseLeave={e=>(e.currentTarget.style.color='#8A7A5A')}>
            <MapPin size={13} style={{ flexShrink:0 }} /> {location}
          </a>
          <a href={waLink} target="_blank" rel="noreferrer" style={{ ...s.link, display:'flex', alignItems:'center', gap:8 }}
            onMouseEnter={e=>(e.currentTarget.style.color='#C9A84C')}
            onMouseLeave={e=>(e.currentTarget.style.color='#8A7A5A')}>
            <Phone size={13} style={{ flexShrink:0 }} /> {whatsapp}
          </a>
          <a href={igLink} target="_blank" rel="noreferrer" style={{ ...s.link, display:'flex', alignItems:'center', gap:8 }}
            onMouseEnter={e=>(e.currentTarget.style.color='#C9A84C')}
            onMouseLeave={e=>(e.currentTarget.style.color='#8A7A5A')}>
            <Instagram size={13} style={{ flexShrink:0 }} /> {instagram}
          </a>
          <a href={emailLink} style={{ ...s.link, display:'flex', alignItems:'center', gap:8 }}
            onMouseEnter={e=>(e.currentTarget.style.color='#C9A84C')}
            onMouseLeave={e=>(e.currentTarget.style.color='#8A7A5A')}>
            <Mail size={13} style={{ flexShrink:0 }} /> {email}
          </a>
        </div>
      </div>

      <div className="sbr-footer-bottom" style={s.bottom}>
        <div style={s.copy}>© {new Date().getFullYear()} <span style={{color:'#C9A84C'}}>Stitches by Ruthchinos</span>. All rights reserved.</div>
        <div style={s.copy}>Made with love in Lagos, Nigeria</div>
      </div>
    </footer>
  )
}
