import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { addWatermark } from '../../lib/watermark'
import toast from 'react-hot-toast'
import { Plus, Pencil, Trash2, Upload, X, Star } from 'lucide-react'

const CATS = ['ready-to-wear','bespoke','ankara','accessories','aso-ebi']
const inp = (extra) => ({ width:'100%', background:'#1A1710', border:'1px solid rgba(201,168,76,0.2)', color:'#F9F4EC', padding:'12px 14px', fontFamily:'Jost,sans-serif', fontSize:13, fontWeight:300, outline:'none', ...extra })

export default function AdminProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [form, setForm] = useState({ name:'', category:'ready-to-wear', price:'', description:'', in_stock:true, featured:false })
  const [images, setImages] = useState([])
  const [filter, setFilter] = useState('all')

  const load = async () => {
    const { data } = await supabase.from('products').select('*').order('created_at',{ascending:false})
    if(data) setProducts(data)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const openAdd = () => { setEditing(null); setForm({name:'',category:'ready-to-wear',price:'',description:'',in_stock:true,featured:false}); setImages([]); setShowModal(true) }
  const openEdit = (p) => { setEditing(p); setForm({name:p.name,category:p.category,price:String(p.price),description:p.description,in_stock:p.in_stock,featured:p.featured}); setImages(p.images||[]); setShowModal(true) }

  const handleImageUpload = async (e) => {
    const files = e.target.files
    if(!files) return
    setUploading(true)
    for(const file of Array.from(files)) {
      const ext = file.name.split('.').pop()
      const path = `products/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
      const watermarked = await addWatermark(file)
      const { error, data } = await supabase.storage.from('sbr-media').upload(path, watermarked, { cacheControl:'3600', upsert:false })
      if(!error && data) {
        const { data: urlData } = supabase.storage.from('sbr-media').getPublicUrl(data.path)
        setImages(prev => [...prev, urlData.publicUrl])
      }
    }
    setUploading(false)
    toast.success('Image uploaded!')
  }

  const handleSave = async () => {
    if(!form.name || !form.price) return toast.error('Please fill required fields')
    const payload = { name:form.name, category:form.category, price:Number(form.price), description:form.description, in_stock:form.in_stock, featured:form.featured, images }

    if(editing) {
      const { error } = await supabase.from('products').update(payload).eq('id', editing.id)
      if(error) return toast.error('Failed to update product')
      toast.success('Product updated!')
    } else {
      const { error } = await supabase.from('products').insert(payload)
      if(error) return toast.error('Failed to add product')
      toast.success('Product added!')
    }
    setShowModal(false); load()
  }

  const handleDelete = async (id) => {
    if(!window.confirm('Delete this product?')) return
    await supabase.from('products').delete().eq('id', id)
    toast.success('Product deleted')
    load()
  }

  const toggleFeatured = async (p) => {
    await supabase.from('products').update({featured:!p.featured}).eq('id',p.id)
    load()
  }

  const filtered = filter==='all' ? products : products.filter(p=>p.category===filter)

  const labelStyle = { fontFamily:'Cinzel,serif', fontSize:8, letterSpacing:'0.2em', textTransform:'uppercase', color:'#8A7A5A', display:'block', marginBottom:8 }

  return (
    <div>
      {/* Header */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:32 }}>
        <div>
          <h1 style={{ fontFamily:'Cormorant Garamond,serif', fontSize:32, fontWeight:300, color:'#F9F4EC', marginBottom:4 }}>Products</h1>
          <p style={{ fontSize:13, color:'#8A7A5A' }}>{products.length} items in your catalogue</p>
        </div>
        <button onClick={openAdd} style={{ display:'flex', alignItems:'center', gap:8, background:'linear-gradient(135deg,#E8C97A,#C9A84C)', color:'#0A0806', border:'none', padding:'12px 24px', fontFamily:'Cinzel,serif', fontSize:9, fontWeight:600, letterSpacing:'0.2em', textTransform:'uppercase', cursor:'pointer' }}>
          <Plus size={15}/> Add Product
        </button>
      </div>

      {/* Filters */}
      <div style={{ display:'flex', gap:8, marginBottom:24 }}>
        {['all',...CATS].map(c => (
          <button key={c} onClick={()=>setFilter(c)} style={{ fontFamily:'Cinzel,serif', fontSize:8, letterSpacing:'0.15em', textTransform:'uppercase', padding:'8px 16px', border:'1px solid', borderColor: filter===c?'#C9A84C':'rgba(201,168,76,0.2)', background: filter===c?'rgba(201,168,76,0.1)':'transparent', color: filter===c?'#C9A84C':'#8A7A5A', cursor:'pointer', transition:'all 0.2s' }}>
            {c==='all'?'All':c}
          </button>
        ))}
      </div>

      {/* Grid */}
      {loading ? (
        <div style={{ color:'#8A7A5A', fontSize:13 }}>Loading products...</div>
      ) : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:16 }}>
          {filtered.map(p => (
            <div key={p.id} style={{ background:'#111009', border:'1px solid rgba(201,168,76,0.12)', overflow:'hidden' }}>
              {/* Image */}
              <div style={{ height:200, background:'#1A1710', position:'relative', display:'flex', alignItems:'center', justifyContent:'center' }}>
                {p.images?.[0] ? (
                  <img src={p.images[0]} alt={p.name} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                ) : (
                  <div style={{ fontSize:48, opacity:0.3 }}>👗</div>
                )}
                <div style={{ position:'absolute', top:10, right:10, display:'flex', gap:6 }}>
                  <button onClick={()=>toggleFeatured(p)} style={{ width:28, height:28, background: p.featured?'#C9A84C':'rgba(0,0,0,0.5)', border:'none', borderRadius:4, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', color: p.featured?'#0A0806':'#F9F4EC' }}>
                    <Star size={12} fill={p.featured?'currentColor':'none'} />
                  </button>
                  <div style={{ background: p.in_stock?'rgba(105,210,160,0.9)':'rgba(255,107,107,0.9)', padding:'2px 8px', borderRadius:2, fontSize:9, fontFamily:'Cinzel,serif', letterSpacing:'0.1em', textTransform:'uppercase', color:'#0A0806', display:'flex', alignItems:'center' }}>
                    {p.in_stock?'In Stock':'Out'}
                  </div>
                </div>
              </div>
              {/* Info */}
              <div style={{ padding:16 }}>
                <div style={{ fontFamily:'Cinzel,serif', fontSize:8, letterSpacing:'0.15em', textTransform:'uppercase', color:'#C9A84C', marginBottom:4 }}>{p.category}</div>
                <div style={{ fontFamily:'Cormorant Garamond,serif', fontSize:18, fontWeight:400, color:'#F9F4EC', marginBottom:4 }}>{p.name}</div>
                <div style={{ fontSize:15, fontWeight:500, color:'#C9A84C', marginBottom:12 }}>₦{Number(p.price).toLocaleString()}</div>
                <div style={{ display:'flex', gap:8 }}>
                  <button onClick={()=>openEdit(p)} style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', gap:6, background:'rgba(201,168,76,0.1)', border:'1px solid rgba(201,168,76,0.2)', color:'#C9A84C', padding:'8px', cursor:'pointer', fontSize:12, fontFamily:'Jost,sans-serif' }}>
                    <Pencil size={13}/> Edit
                  </button>
                  <button onClick={()=>handleDelete(p.id)} style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', gap:6, background:'rgba(255,107,107,0.1)', border:'1px solid rgba(255,107,107,0.2)', color:'#FF6B6B', padding:'8px', cursor:'pointer', fontSize:12, fontFamily:'Jost,sans-serif' }}>
                    <Trash2 size={13}/> Delete
                  </button>
                </div>
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
                {editing ? 'Edit Product' : 'Add New Product'}
              </div>
              <button onClick={()=>setShowModal(false)} style={{ background:'none', border:'none', color:'#8A7A5A', cursor:'pointer' }}><X size={20}/></button>
            </div>

            <div style={{ padding:28 }}>
              {/* Image Upload */}
              <div style={{ marginBottom:24 }}>
                <label style={labelStyle}>Product Images</label>
                <div style={{ display:'flex', gap:10, flexWrap:'wrap', marginBottom:12 }}>
                  {images.map((img,i) => (
                    <div key={i} style={{ position:'relative', width:80, height:80 }}>
                      <img src={img} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                      <button onClick={()=>setImages(images.filter((_,j)=>j!==i))} style={{ position:'absolute', top:-6, right:-6, background:'#FF6B6B', border:'none', borderRadius:'50%', width:18, height:18, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', color:'#fff', fontSize:10 }}>×</button>
                    </div>
                  ))}
                  <label style={{ width:80, height:80, background:'#1A1710', border:'1px dashed rgba(201,168,76,0.3)', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', color:'#C9A84C' }}>
                    {uploading ? '...' : <Upload size={20}/>}
                    <input type="file" accept="image/*" multiple onChange={handleImageUpload} style={{ display:'none' }} />
                  </label>
                </div>
              </div>

              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:16 }}>
                <div>
                  <label style={labelStyle}>Product Name *</label>
                  <input style={inp()} value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="e.g. Ankara Wrap Dress"
                    onFocus={e=>(e.target.style.borderColor='#C9A84C')} onBlur={e=>(e.target.style.borderColor='rgba(201,168,76,0.2)')} />
                </div>
                <div>
                  <label style={labelStyle}>Price (₦) *</label>
                  <input style={inp()} type="number" value={form.price} onChange={e=>setForm({...form,price:e.target.value})} placeholder="45000"
                    onFocus={e=>(e.target.style.borderColor='#C9A84C')} onBlur={e=>(e.target.style.borderColor='rgba(201,168,76,0.2)')} />
                </div>
              </div>

              <div style={{ marginBottom:16 }}>
                <label style={labelStyle}>Category</label>
                <select style={inp({appearance:'none'})} value={form.category} onChange={e=>setForm({...form,category:e.target.value})}>
                  {CATS.map(c=><option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div style={{ marginBottom:16 }}>
                <label style={labelStyle}>Description</label>
                <textarea style={inp({height:100,resize:'none'})} value={form.description} onChange={e=>setForm({...form,description:e.target.value})} placeholder="Describe this piece..."
                  onFocus={e=>(e.target.style.borderColor='#C9A84C')} onBlur={e=>(e.target.style.borderColor='rgba(201,168,76,0.2)')} />
              </div>

              <div style={{ display:'flex', gap:24, marginBottom:28 }}>
                {[['in_stock','In Stock'],['featured','Featured on Homepage']].map(([key,label]) => (
                  <label key={key} style={{ display:'flex', alignItems:'center', gap:8, cursor:'pointer', fontSize:13, color:'#EDE3D0' }}>
                    <input type="checkbox" checked={form[key]} onChange={e=>setForm({...form,[key]:e.target.checked})} style={{ accentColor:'#C9A84C', width:16, height:16 }} />
                    {label}
                  </label>
                ))}
              </div>

              <button onClick={handleSave} style={{ width:'100%', background:'linear-gradient(135deg,#E8C97A,#C9A84C)', color:'#0A0806', border:'none', padding:'16px', fontFamily:'Cinzel,serif', fontSize:10, fontWeight:600, letterSpacing:'0.2em', textTransform:'uppercase', cursor:'pointer' }}>
                {editing ? 'Update Product' : 'Add Product'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
