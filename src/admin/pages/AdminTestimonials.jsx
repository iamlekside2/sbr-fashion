import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import toast from 'react-hot-toast'
import { Plus, Pencil, Trash2, X, Eye, EyeOff, Quote } from 'lucide-react'

const inp = (extra) => ({ width:'100%', background:'#1A1710', border:'1px solid rgba(201,168,76,0.2)', color:'#F9F4EC', padding:'12px 14px', fontFamily:'Jost,sans-serif', fontSize:13, fontWeight:300, outline:'none', ...extra })

export default function AdminTestimonials() {
  const [testimonials, setTestimonials] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [filter, setFilter] = useState('all')
  const [form, setForm] = useState({ name:'', client_title:'', text:'', rating:5, published:true })

  const load = async () => {
    const { data } = await supabase.from('testimonials').select('*').order('created_at', { ascending: false })
    if (data) setTestimonials(data)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const openAdd = () => {
    setEditing(null)
    setForm({ name:'', client_title:'', text:'', rating:5, published:true })
    setShowModal(true)
  }

  const openEdit = (t) => {
    setEditing(t)
    setForm({ name:t.name, client_title:t.client_title||'', text:t.text, rating:t.rating||5, published:t.published })
    setShowModal(true)
  }

  const handleSave = async () => {
    if (!form.name || !form.text) return toast.error('Name and testimonial text are required')
    const initials = form.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    const payload = { name:form.name, client_title:form.client_title, text:form.text, rating:Number(form.rating), published:form.published, initials }

    if (editing) {
      const { error } = await supabase.from('testimonials').update(payload).eq('id', editing.id)
      if (error) return toast.error('Failed to update testimonial')
      toast.success('Testimonial updated!')
    } else {
      const { error } = await supabase.from('testimonials').insert(payload)
      if (error) return toast.error('Failed to add testimonial')
      toast.success('Testimonial added!')
    }
    setShowModal(false)
    load()
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this testimonial?')) return
    await supabase.from('testimonials').delete().eq('id', id)
    toast.success('Testimonial deleted')
    load()
  }

  const togglePublished = async (t) => {
    await supabase.from('testimonials').update({ published: !t.published }).eq('id', t.id)
    toast.success(t.published ? 'Testimonial unpublished' : 'Testimonial published')
    load()
  }

  const publishedCount = testimonials.filter(t => t.published).length
  const filtered = filter === 'all' ? testimonials : filter === 'published' ? testimonials.filter(t => t.published) : testimonials.filter(t => !t.published)

  const labelStyle = { fontFamily:'Cinzel,serif', fontSize:8, letterSpacing:'0.2em', textTransform:'uppercase', color:'#8A7A5A', display:'block', marginBottom:8 }

  return (
    <div>
      {/* Header */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:32 }}>
        <div>
          <h1 style={{ fontFamily:'Cormorant Garamond,serif', fontSize:32, fontWeight:300, color:'#F9F4EC', marginBottom:4 }}>Testimonials</h1>
          <p style={{ fontSize:13, color:'#8A7A5A' }}>{publishedCount} published · {testimonials.length} total</p>
        </div>
        <button onClick={openAdd} style={{ display:'flex', alignItems:'center', gap:8, background:'linear-gradient(135deg,#E8C97A,#C9A84C)', color:'#0A0806', border:'none', padding:'12px 24px', fontFamily:'Cinzel,serif', fontSize:9, fontWeight:600, letterSpacing:'0.2em', textTransform:'uppercase', cursor:'pointer' }}>
          <Plus size={15}/> Add Testimonial
        </button>
      </div>

      {/* Filters */}
      <div style={{ display:'flex', gap:8, marginBottom:24 }}>
        {['all','published','drafts'].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{ fontFamily:'Cinzel,serif', fontSize:8, letterSpacing:'0.15em', textTransform:'uppercase', padding:'8px 16px', border:'1px solid', borderColor: filter===f ? '#C9A84C' : 'rgba(201,168,76,0.2)', background: filter===f ? 'rgba(201,168,76,0.1)' : 'transparent', color: filter===f ? '#C9A84C' : '#8A7A5A', cursor:'pointer', transition:'all 0.2s' }}>
            {f === 'all' ? `All (${testimonials.length})` : f === 'published' ? `Published (${publishedCount})` : `Drafts (${testimonials.length - publishedCount})`}
          </button>
        ))}
      </div>

      {/* Grid */}
      {loading ? (
        <div style={{ color:'#8A7A5A', fontSize:13 }}>Loading testimonials...</div>
      ) : filtered.length === 0 ? (
        <div style={{ padding:48, textAlign:'center', background:'#111009', border:'1px solid rgba(201,168,76,0.12)' }}>
          <Quote size={32} color="#8A7A5A" style={{ marginBottom:12 }} />
          <div style={{ color:'#8A7A5A', fontSize:13 }}>
            {filter === 'all' ? 'No testimonials yet — add your first one!' : filter === 'published' ? 'No published testimonials' : 'No draft testimonials'}
          </div>
        </div>
      ) : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(340px,1fr))', gap:16 }}>
          {filtered.map(t => (
            <div key={t.id} style={{ background:'#111009', border:'1px solid rgba(201,168,76,0.12)', overflow:'hidden', position:'relative' }}>
              {/* Published badge */}
              <div style={{ position:'absolute', top:12, right:12, display:'flex', gap:6, zIndex:1 }}>
                <button onClick={() => togglePublished(t)} style={{ width:28, height:28, background: t.published ? 'rgba(105,210,160,0.15)' : 'rgba(255,107,107,0.15)', border:'1px solid', borderColor: t.published ? 'rgba(105,210,160,0.3)' : 'rgba(255,107,107,0.3)', borderRadius:4, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', color: t.published ? '#69D2A0' : '#FF6B6B' }}>
                  {t.published ? <Eye size={12}/> : <EyeOff size={12}/>}
                </button>
              </div>

              {/* Testimonial content */}
              <div style={{ padding:'24px 20px', minHeight:180, display:'flex', flexDirection:'column' }}>
                {/* Quote mark */}
                <div style={{ fontFamily:'Cormorant Garamond,serif', fontSize:48, color:'#C9A84C', opacity:0.2, lineHeight:1, marginBottom:4 }}>"</div>

                {/* Stars */}
                <div style={{ color:'#FFD600', fontSize:11, letterSpacing:2, marginBottom:12 }}>
                  {'★'.repeat(t.rating || 5)}{'☆'.repeat(5 - (t.rating || 5))}
                </div>

                {/* Text */}
                <p style={{ fontFamily:'Cormorant Garamond,serif', fontSize:15, fontStyle:'italic', fontWeight:300, color:'#EDE3D0', lineHeight:1.7, marginBottom:20, flex:1 }}>
                  "{t.text.length > 150 ? t.text.slice(0, 150) + '...' : t.text}"
                </p>

                {/* Client info */}
                <div style={{ display:'flex', alignItems:'center', gap:12, paddingTop:16, borderTop:'1px solid rgba(201,168,76,0.08)' }}>
                  <div style={{ width:36, height:36, borderRadius:'50%', background:'#C9A84C', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'Cormorant Garamond,serif', fontSize:15, color:'#0A0806', flexShrink:0 }}>
                    {t.initials || t.name?.charAt(0)}
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontFamily:'Cinzel,serif', fontSize:10, letterSpacing:'0.1em', color:'#F9F4EC' }}>{t.name}</div>
                    {t.client_title && <div style={{ fontSize:11, color:'#8A7A5A', marginTop:2 }}>{t.client_title}</div>}
                  </div>
                  <div style={{ background: t.published ? 'rgba(105,210,160,0.9)' : 'rgba(255,107,107,0.9)', padding:'2px 8px', borderRadius:2, fontSize:8, fontFamily:'Cinzel,serif', letterSpacing:'0.1em', textTransform:'uppercase', color:'#0A0806' }}>
                    {t.published ? 'Live' : 'Draft'}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div style={{ display:'flex', borderTop:'1px solid rgba(201,168,76,0.08)' }}>
                <button onClick={() => openEdit(t)} style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', gap:6, background:'rgba(201,168,76,0.06)', border:'none', borderRight:'1px solid rgba(201,168,76,0.08)', color:'#C9A84C', padding:'10px', cursor:'pointer', fontSize:12, fontFamily:'Jost,sans-serif', transition:'background 0.2s' }}
                  onMouseEnter={e => (e.currentTarget.style.background='rgba(201,168,76,0.12)')}
                  onMouseLeave={e => (e.currentTarget.style.background='rgba(201,168,76,0.06)')}>
                  <Pencil size={13}/> Edit
                </button>
                <button onClick={() => handleDelete(t.id)} style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', gap:6, background:'rgba(255,107,107,0.06)', border:'none', color:'#FF6B6B', padding:'10px', cursor:'pointer', fontSize:12, fontFamily:'Jost,sans-serif', transition:'background 0.2s' }}
                  onMouseEnter={e => (e.currentTarget.style.background='rgba(255,107,107,0.12)')}
                  onMouseLeave={e => (e.currentTarget.style.background='rgba(255,107,107,0.06)')}>
                  <Trash2 size={13}/> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.85)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000, padding:24 }}>
          <div style={{ background:'#111009', border:'1px solid rgba(201,168,76,0.2)', width:'100%', maxWidth:600, maxHeight:'90vh', overflowY:'auto' }}>
            <div style={{ padding:'24px 28px', borderBottom:'1px solid rgba(201,168,76,0.1)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <div style={{ fontFamily:'Cormorant Garamond,serif', fontSize:24, fontWeight:300, color:'#F9F4EC' }}>
                {editing ? 'Edit Testimonial' : 'Add New Testimonial'}
              </div>
              <button onClick={() => setShowModal(false)} style={{ background:'none', border:'none', color:'#8A7A5A', cursor:'pointer' }}><X size={20}/></button>
            </div>

            <div style={{ padding:28 }}>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:16 }}>
                <div>
                  <label style={labelStyle}>Client Name *</label>
                  <input style={inp()} value={form.name} onChange={e => setForm({...form, name:e.target.value})} placeholder="e.g. Adaeze Okonkwo"
                    onFocus={e => (e.target.style.borderColor='#C9A84C')} onBlur={e => (e.target.style.borderColor='rgba(201,168,76,0.2)')} />
                </div>
                <div>
                  <label style={labelStyle}>Title / Location</label>
                  <input style={inp()} value={form.client_title} onChange={e => setForm({...form, client_title:e.target.value})} placeholder="e.g. Bride · Lagos"
                    onFocus={e => (e.target.style.borderColor='#C9A84C')} onBlur={e => (e.target.style.borderColor='rgba(201,168,76,0.2)')} />
                </div>
              </div>

              <div style={{ marginBottom:16 }}>
                <label style={labelStyle}>Testimonial Text *</label>
                <textarea style={inp({ height:120, resize:'none' })} value={form.text} onChange={e => setForm({...form, text:e.target.value})} placeholder="What did the client say about their experience with Stitches by Ruthchinos?"
                  onFocus={e => (e.target.style.borderColor='#C9A84C')} onBlur={e => (e.target.style.borderColor='rgba(201,168,76,0.2)')} />
              </div>

              <div style={{ marginBottom:16 }}>
                <label style={labelStyle}>Rating</label>
                <div style={{ display:'flex', gap:4 }}>
                  {[1,2,3,4,5].map(n => (
                    <button key={n} onClick={() => setForm({...form, rating:n})} style={{ width:36, height:36, background: n <= form.rating ? 'rgba(201,168,76,0.15)' : '#1A1710', border:'1px solid', borderColor: n <= form.rating ? '#C9A84C' : 'rgba(201,168,76,0.2)', color: n <= form.rating ? '#FFD600' : '#8A7A5A', cursor:'pointer', fontSize:16, display:'flex', alignItems:'center', justifyContent:'center', transition:'all 0.2s' }}>
                      ★
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display:'flex', gap:24, marginBottom:28 }}>
                <label style={{ display:'flex', alignItems:'center', gap:8, cursor:'pointer', fontSize:13, color:'#EDE3D0' }}>
                  <input type="checkbox" checked={form.published} onChange={e => setForm({...form, published:e.target.checked})} style={{ accentColor:'#C9A84C', width:16, height:16 }} />
                  Publish to website
                </label>
              </div>

              <button onClick={handleSave} style={{ width:'100%', background:'linear-gradient(135deg,#E8C97A,#C9A84C)', color:'#0A0806', border:'none', padding:'16px', fontFamily:'Cinzel,serif', fontSize:10, fontWeight:600, letterSpacing:'0.2em', textTransform:'uppercase', cursor:'pointer' }}>
                {editing ? 'Update Testimonial' : 'Add Testimonial'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
