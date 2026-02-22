import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../../lib/supabase'
import toast from 'react-hot-toast'
import { Upload, Trash2, Star, X } from 'lucide-react'

export default function AdminGallery() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [dragging, setDragging] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ title: '', category: 'lookbook' })
  const [pendingFile, setPendingFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)

  const load = async () => {
    const { data } = await supabase.from('gallery').select('*').order('created_at', { ascending: false })
    if (data) setItems(data)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) {
      setPendingFile(file)
      setPreviewUrl(URL.createObjectURL(file))
      setShowModal(true)
    }
  }, [])

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setPendingFile(file)
      setPreviewUrl(URL.createObjectURL(file))
      setShowModal(true)
    }
  }

  const handleUpload = async () => {
    if (!pendingFile) return
    setUploading(true)
    const ext = pendingFile.name.split('.').pop()
    const path = `gallery/${Date.now()}.${ext}`
    const { error, data } = await supabase.storage.from('sbr-media').upload(path, pendingFile)
    if (error) { toast.error('Upload failed'); setUploading(false); return }
    const { data: urlData } = supabase.storage.from('sbr-media').getPublicUrl(data.path)
    await supabase.from('gallery').insert({ title: form.title, category: form.category, image_url: urlData.publicUrl, featured: false })
    toast.success('Photo added to gallery!')
    setShowModal(false)
    setForm({ title: '', category: 'lookbook' })
    setPendingFile(null)
    setPreviewUrl(null)
    setUploading(false)
    load()
  }

  const handleDelete = async (item) => {
    if (!window.confirm('Remove this photo?')) return
    await supabase.from('gallery').delete().eq('id', item.id)
    toast.success('Photo removed')
    load()
  }

  const toggleFeatured = async (item) => {
    await supabase.from('gallery').update({ featured: !item.featured }).eq('id', item.id)
    load()
  }

  const labelStyle = {
    fontFamily: 'Cinzel,serif', fontSize: 8, letterSpacing: '0.2em',
    textTransform: 'uppercase', color: '#8A7A5A', display: 'block', marginBottom: 8
  }
  const inpStyle = {
    width: '100%', background: '#1A1710', border: '1px solid rgba(201,168,76,0.2)',
    color: '#F9F4EC', padding: '12px 14px', fontFamily: 'Jost,sans-serif', fontSize: 13, outline: 'none'
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <div>
          <h1 style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 32, fontWeight: 300, color: '#F9F4EC', marginBottom: 4 }}>Gallery & Lookbook</h1>
          <p style={{ fontSize: 13, color: '#8A7A5A' }}>{items.length} photos in your lookbook</p>
        </div>
      </div>

      {/* Drop Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={e => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        style={{ border: `2px dashed ${dragging ? '#C9A84C' : 'rgba(201,168,76,0.3)'}`, background: dragging ? 'rgba(201,168,76,0.05)' : 'transparent', padding: '48px 24px', textAlign: 'center', marginBottom: 32, transition: 'all 0.3s', cursor: 'pointer' }}>
        <Upload size={32} color={dragging ? '#C9A84C' : '#8A7A5A'} style={{ marginBottom: 12 }} />
        <div style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 20, fontWeight: 300, color: '#F9F4EC', marginBottom: 8 }}>
          Drag & drop photos here
        </div>
        <p style={{ fontSize: 12, color: '#8A7A5A', marginBottom: 16 }}>or click to browse from your device</p>
        <label style={{ fontFamily: 'Cinzel,serif', fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#0A0806', background: '#C9A84C', padding: '10px 24px', cursor: 'pointer', display: 'inline-block' }}>
          Choose Photos
          <input type="file" accept="image/*" onChange={handleFileSelect} style={{ display: 'none' }} />
        </label>
      </div>

      {/* Gallery Grid */}
      {loading ? (
        <div style={{ color: '#8A7A5A', fontSize: 13 }}>Loading gallery...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 8 }}>
          {items.map(item => (
            <div key={item.id} style={{ position: 'relative', aspectRatio: '3/4', overflow: 'hidden', background: '#1A1710' }}
              onMouseEnter={e => { const el = e.currentTarget.querySelector('.overlay'); if (el) el.style.opacity = '1' }}
              onMouseLeave={e => { const el = e.currentTarget.querySelector('.overlay'); if (el) el.style.opacity = '0' }}>
              <img src={item.image_url} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div className="overlay" style={{ position: 'absolute', inset: 0, background: 'rgba(10,8,6,0.7)', opacity: 0, transition: 'opacity 0.3s', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                <div style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 15, color: '#F9F4EC', textAlign: 'center', padding: '0 12px' }}>{item.title}</div>
                <div style={{ fontSize: 10, fontFamily: 'Cinzel,serif', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#C9A84C' }}>{item.category}</div>
                <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                  <button onClick={() => toggleFeatured(item)} style={{ width: 36, height: 36, background: item.featured ? '#C9A84C' : 'rgba(255,255,255,0.1)', border: 'none', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: item.featured ? '#0A0806' : '#F9F4EC' }}>
                    <Star size={14} fill={item.featured ? 'currentColor' : 'none'} />
                  </button>
                  <button onClick={() => handleDelete(item)} style={{ width: 36, height: 36, background: 'rgba(255,107,107,0.2)', border: 'none', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#FF6B6B' }}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              {item.featured && (
                <div style={{ position: 'absolute', top: 8, left: 8, background: '#C9A84C', padding: '3px 8px', fontFamily: 'Cinzel,serif', fontSize: 7, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#0A0806' }}>
                  Featured
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 24 }}>
          <div style={{ background: '#111009', border: '1px solid rgba(201,168,76,0.2)', width: '100%', maxWidth: 500 }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(201,168,76,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 22, fontWeight: 300, color: '#F9F4EC' }}>Add to Gallery</div>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: '#8A7A5A', cursor: 'pointer' }}><X size={18} /></button>
            </div>
            <div style={{ padding: 24 }}>
              {previewUrl && <img src={previewUrl} alt="Preview" style={{ width: '100%', height: 200, objectFit: 'cover', marginBottom: 20 }} />}
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>Photo Title</label>
                <input style={inpStyle} value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="e.g. Ankara Royale — Campaign 2025"
                  onFocus={e => (e.target.style.borderColor = '#C9A84C')} onBlur={e => (e.target.style.borderColor = 'rgba(201,168,76,0.2)')} />
              </div>
              <div style={{ marginBottom: 24 }}>
                <label style={labelStyle}>Category</label>
                <select style={{ ...inpStyle, appearance: 'none' }} value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                  {['lookbook', 'bridal', 'ankara', 'accessories', 'bespoke', 'campaign'].map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <button onClick={handleUpload} disabled={uploading} style={{ width: '100%', background: 'linear-gradient(135deg,#E8C97A,#C9A84C)', color: '#0A0806', border: 'none', padding: '14px', fontFamily: 'Cinzel,serif', fontSize: 10, fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', cursor: uploading ? 'not-allowed' : 'pointer', opacity: uploading ? 0.7 : 1 }}>
                {uploading ? 'Uploading...' : 'Add to Gallery'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
