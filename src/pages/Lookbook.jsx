import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function Lookbook() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [lightbox, setLightbox] = useState(null)

  useEffect(() => {
    supabase.from('gallery').select('*').order('created_at', { ascending: false })
      .then(({ data }) => { if (data) setItems(data); setLoading(false) })
  }, [])

  const cats = ['all', ...new Set(items.map(i => i.category))]
  const filtered = filter === 'all' ? items : items.filter(i => i.category === filter)

  return (
    <div>
      <Navbar />
      <div style={{ minHeight: '100vh', background: '#0A0806', paddingTop: 120, paddingBottom: 80 }}>
        <div className="sbr-page-pad" style={{ padding: '0 60px' }}>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <div style={{ fontFamily: 'Cinzel,serif', fontSize: 9, letterSpacing: '0.4em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: 16 }}>Our Work</div>
            <h1 style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 'clamp(40px,5vw,64px)', fontWeight: 300, color: '#F9F4EC' }}>
              The <em style={{ fontStyle: 'italic', color: '#C9A84C' }}>Lookbook</em>
            </h1>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 48 }}>
            {cats.map(c => (
              <button key={c} onClick={() => setFilter(c)} style={{ fontFamily: 'Cinzel,serif', fontSize: 8, letterSpacing: '0.15em', textTransform: 'uppercase', padding: '9px 18px', border: '1px solid', borderColor: filter === c ? '#C9A84C' : 'rgba(201,168,76,0.25)', background: filter === c ? 'rgba(201,168,76,0.1)' : 'transparent', color: filter === c ? '#C9A84C' : '#8A7A5A', cursor: 'pointer', transition: 'all 0.2s' }}>
                {c === 'all' ? 'All' : c}
              </button>
            ))}
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', color: '#8A7A5A', padding: 60 }}>Loading gallery...</div>
          ) : (
            <div className="sbr-lookbook-masonry" style={{ columns: '3 300px', gap: 8 }}>
              {filtered.map(item => (
                <div key={item.id} style={{ breakInside: 'avoid', marginBottom: 8, position: 'relative', overflow: 'hidden', cursor: 'pointer' }}
                  onClick={() => setLightbox(item)}>
                  <img src={item.image_url} alt={item.title} style={{ width: '100%', display: 'block', transition: 'transform 0.5s ease' }}
                    onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.03)')}
                    onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')} />
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(to top, rgba(10,8,6,0.8), transparent)', padding: '20px 16px 12px', opacity: 0, transition: 'opacity 0.3s' }}
                    onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
                    onMouseLeave={e => (e.currentTarget.style.opacity = '0')}>
                    <div style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 15, color: '#F9F4EC' }}>{item.title}</div>
                    <div style={{ fontFamily: 'Cinzel,serif', fontSize: 8, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#C9A84C', marginTop: 3 }}>{item.category}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div className="sbr-lookbook-lightbox" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.95)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000, padding: 24 }} onClick={() => setLightbox(null)}>
          <img src={lightbox.image_url} alt={lightbox.title} style={{ maxWidth: '80vw', maxHeight: '80vh', objectFit: 'contain' }} />
          <div style={{ position: 'absolute', bottom: 40, left: 0, right: 0, textAlign: 'center' }}>
            <div style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 18, color: '#F9F4EC' }}>{lightbox.title}</div>
            <div style={{ fontFamily: 'Cinzel,serif', fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#C9A84C', marginTop: 4 }}>{lightbox.category}</div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}
