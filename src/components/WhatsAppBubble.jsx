import { useState, useEffect } from 'react'
import { MessageCircle, X } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useLocation } from 'react-router-dom'

export default function WhatsAppBubble() {
  const [number, setNumber] = useState('')
  const [open, setOpen] = useState(false)
  const [visible, setVisible] = useState(false)
  const location = useLocation()

  // Hide on admin pages
  const isAdmin = location.pathname.startsWith('/admin')

  useEffect(() => {
    supabase.from('site_content').select('value').eq('key', 'contact_whatsapp').single()
      .then(({ data }) => { if (data?.value) setNumber(data.value) })
  }, [])

  // Show after 3 seconds
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 3000)
    return () => clearTimeout(t)
  }, [])

  if (isAdmin || !number || !visible) return null

  const cleanNum = number.replace(/\D/g, '')
  const waLink = `https://wa.me/${cleanNum}?text=${encodeURIComponent('Hi, I\'m interested in Stitches by Ruthchinos. Can you help me?')}`

  return (
    <>
      {/* Tooltip / mini-chat */}
      {open && (
        <div style={{
          position: 'fixed', bottom: 96, right: 24, zIndex: 998,
          width: 300, background: '#111009', border: '1px solid rgba(201,168,76,0.2)',
          boxShadow: '0 12px 40px rgba(0,0,0,0.5)',
          animation: 'waBubbleIn 0.3s ease',
        }}>
          {/* Header */}
          <div style={{ background: '#25D366', padding: '16px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img src="/logo-gold.png" alt="SBR" style={{ height: 20, width: 'auto', filter: 'brightness(10)' }} />
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 500, color: '#fff' }}>Stitches by Ruthchinos</div>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.8)' }}>Usually replies within an hour</div>
              </div>
            </div>
            <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.7)', cursor: 'pointer', padding: 4 }}>
              <X size={16} />
            </button>
          </div>

          {/* Message area */}
          <div style={{ padding: 20, background: '#0A0806' }}>
            <div style={{ background: '#1A1710', border: '1px solid rgba(201,168,76,0.1)', padding: '12px 16px', marginBottom: 16, position: 'relative' }}>
              <p style={{ fontSize: 13, color: '#EDE3D0', lineHeight: 1.6, margin: 0 }}>
                Hi there! How can we help you today? Tap below to chat with us on WhatsApp.
              </p>
              <div style={{ fontSize: 10, color: '#8A7A5A', marginTop: 6, textAlign: 'right' }}>Ruthchinos</div>
            </div>

            <a href={waLink} target="_blank" rel="noreferrer"
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                background: '#25D366', color: '#fff', padding: '14px 20px',
                textDecoration: 'none', fontFamily: 'Cinzel,serif', fontSize: 10,
                letterSpacing: '0.15em', textTransform: 'uppercase', transition: 'opacity 0.2s',
              }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '0.9')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}>
              <MessageCircle size={16} /> Start Chat
            </a>
          </div>
        </div>
      )}

      {/* Floating button */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          position: 'fixed', bottom: 24, right: 24, zIndex: 999,
          width: 56, height: 56, borderRadius: '50%',
          background: '#25D366', border: 'none',
          color: '#fff', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 20px rgba(37,211,102,0.4)',
          transition: 'transform 0.2s, box-shadow 0.2s',
          animation: 'waPulse 2s ease-in-out infinite',
        }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.1)'; e.currentTarget.style.boxShadow = '0 6px 28px rgba(37,211,102,0.5)' }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(37,211,102,0.4)' }}>
        {open ? <X size={24} /> : <MessageCircle size={24} />}
      </button>

      <style>{`
        @keyframes waBubbleIn { from { opacity:0; transform:translateY(10px) } to { opacity:1; transform:translateY(0) } }
        @keyframes waPulse { 0%,100% { box-shadow:0 4px 20px rgba(37,211,102,0.4) } 50% { box-shadow:0 4px 28px rgba(37,211,102,0.6) } }
      `}</style>
    </>
  )
}
