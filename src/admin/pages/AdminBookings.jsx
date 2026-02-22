import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import toast from 'react-hot-toast'
import { MessageCircle, X } from 'lucide-react'

const STATUS_COLORS = { pending:'#FFD600', confirmed:'#69D2A0', completed:'#C9A84C', cancelled:'#FF6B6B' }

export default function AdminBookings() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [selected, setSelected] = useState(null)
  const [notes, setNotes] = useState('')

  const load = async () => {
    const q = supabase.from('bookings').select('*').order('created_at',{ascending:false})
    const { data } = filter==='all' ? await q : await q.eq('status',filter)
    if(data) setBookings(data)
    setLoading(false)
  }

  useEffect(() => { load() }, [filter]) // eslint-disable-line react-hooks/exhaustive-deps

  const updateStatus = async (id, status) => {
    const { error } = await supabase.from('bookings').update({status,notes}).eq('id',id)
    if(error) return toast.error('Failed to update')
    toast.success(`Booking ${status}!`)
    setSelected(null)
    load()
  }

  const whatsappLink = (b) =>
    `https://wa.me/${b.whatsapp.replace(/\D/g,'')}?text=Hello ${b.first_name}, thank you for booking with Stitches by Ruthchinos! We're confirming your appointment for ${b.service}.`

  const filtered = bookings

  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:32 }}>
        <div>
          <h1 style={{ fontFamily:'Cormorant Garamond,serif', fontSize:32, fontWeight:300, color:'#F9F4EC', marginBottom:4 }}>Bookings</h1>
          <p style={{ fontSize:13, color:'#8A7A5A' }}>{bookings.length} appointments</p>
        </div>
      </div>

      {/* Status filter */}
      <div style={{ display:'flex', gap:8, marginBottom:24 }}>
        {['all','pending','confirmed','completed','cancelled'].map(s => (
          <button key={s} onClick={()=>setFilter(s)} style={{ fontFamily:'Cinzel,serif', fontSize:8, letterSpacing:'0.15em', textTransform:'uppercase', padding:'8px 16px', border:'1px solid', borderColor: filter===s?(STATUS_COLORS[s]||'#C9A84C'):'rgba(201,168,76,0.2)', background: filter===s?`${STATUS_COLORS[s]||'#C9A84C'}15`:'transparent', color: filter===s?(STATUS_COLORS[s]||'#C9A84C'):'#8A7A5A', cursor:'pointer', transition:'all 0.2s' }}>
            {s}
          </button>
        ))}
      </div>

      {/* Table */}
      <div style={{ background:'#111009', border:'1px solid rgba(201,168,76,0.12)', overflow:'hidden' }}>
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead>
            <tr style={{ borderBottom:'1px solid rgba(201,168,76,0.1)' }}>
              {['Client','Service','Date','Budget','WhatsApp','Status','Actions'].map(h => (
                <th key={h} style={{ fontFamily:'Cinzel,serif', fontSize:8, letterSpacing:'0.15em', textTransform:'uppercase', color:'#8A7A5A', padding:'14px 16px', textAlign:'left', fontWeight:400 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} style={{ padding:32, textAlign:'center', color:'#8A7A5A', fontSize:13 }}>Loading...</td></tr>
            ) : filtered.length===0 ? (
              <tr><td colSpan={7} style={{ padding:32, textAlign:'center', color:'#8A7A5A', fontSize:13 }}>No bookings found</td></tr>
            ) : filtered.map((b,i) => (
              <tr key={b.id} style={{ borderBottom:'1px solid rgba(201,168,76,0.06)', background: i%2===0?'transparent':'rgba(201,168,76,0.02)' }}>
                <td style={{ padding:'14px 16px' }}>
                  <div style={{ fontSize:13, fontWeight:400, color:'#EDE3D0' }}>{b.first_name} {b.last_name}</div>
                  <div style={{ fontSize:11, color:'#8A7A5A', marginTop:2 }}>{new Date(b.created_at).toLocaleDateString()}</div>
                </td>
                <td style={{ padding:'14px 16px', fontSize:12, color:'#C9A84C' }}>{b.service}</td>
                <td style={{ padding:'14px 16px', fontSize:12, color:'#8A7A5A' }}>{b.preferred_date || '—'}</td>
                <td style={{ padding:'14px 16px', fontSize:12, color:'#8A7A5A' }}>{b.budget_range || '—'}</td>
                <td style={{ padding:'14px 16px' }}>
                  <a href={whatsappLink(b)} target="_blank" rel="noreferrer" style={{ display:'inline-flex', alignItems:'center', gap:4, color:'#25D366', fontSize:12, textDecoration:'none' }}>
                    <MessageCircle size={13}/> Chat
                  </a>
                </td>
                <td style={{ padding:'14px 16px' }}>
                  <span style={{ fontSize:9, fontFamily:'Cinzel,serif', letterSpacing:'0.1em', textTransform:'uppercase', color:STATUS_COLORS[b.status]||'#8A7A5A', background:`${STATUS_COLORS[b.status]||'#8A7A5A'}15`, padding:'4px 10px' }}>
                    {b.status}
                  </span>
                </td>
                <td style={{ padding:'14px 16px' }}>
                  <button onClick={()=>{ setSelected(b); setNotes(b.notes||'') }} style={{ fontSize:11, color:'#C9A84C', background:'none', border:'1px solid rgba(201,168,76,0.3)', padding:'5px 12px', cursor:'pointer', fontFamily:'Jost,sans-serif' }}>
                    Manage
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Detail Modal */}
      {selected && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.85)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000, padding:24 }}>
          <div style={{ background:'#111009', border:'1px solid rgba(201,168,76,0.2)', width:'100%', maxWidth:540 }}>
            <div style={{ padding:'20px 24px', borderBottom:'1px solid rgba(201,168,76,0.1)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <div style={{ fontFamily:'Cormorant Garamond,serif', fontSize:22, fontWeight:300, color:'#F9F4EC' }}>Booking Details</div>
              <button onClick={()=>setSelected(null)} style={{ background:'none', border:'none', color:'#8A7A5A', cursor:'pointer' }}><X size={18}/></button>
            </div>
            <div style={{ padding:24 }}>
              {[['Client',`${selected.first_name} ${selected.last_name}`],['WhatsApp',selected.whatsapp],['Service',selected.service],['Date',selected.preferred_date||'Not specified'],['Budget',selected.budget_range||'Not specified']].map(([k,v])=>(
                <div key={k} style={{ display:'flex', marginBottom:12 }}>
                  <div style={{ fontFamily:'Cinzel,serif', fontSize:8, letterSpacing:'0.15em', textTransform:'uppercase', color:'#8A7A5A', width:90, flexShrink:0, marginTop:2 }}>{k}</div>
                  <div style={{ fontSize:13, color:'#EDE3D0' }}>{v}</div>
                </div>
              ))}
              {selected.vision && (
                <div style={{ background:'#1A1710', border:'1px solid rgba(201,168,76,0.1)', padding:14, marginBottom:16 }}>
                  <div style={{ fontFamily:'Cinzel,serif', fontSize:8, letterSpacing:'0.15em', textTransform:'uppercase', color:'#8A7A5A', marginBottom:6 }}>Their Vision</div>
                  <div style={{ fontSize:13, color:'#EDE3D0', lineHeight:1.7 }}>{selected.vision}</div>
                </div>
              )}
              <div style={{ marginBottom:20 }}>
                <label style={{ fontFamily:'Cinzel,serif', fontSize:8, letterSpacing:'0.15em', textTransform:'uppercase', color:'#8A7A5A', display:'block', marginBottom:8 }}>Internal Notes</label>
                <textarea value={notes} onChange={e=>setNotes(e.target.value)} style={{ width:'100%', background:'#1A1710', border:'1px solid rgba(201,168,76,0.2)', color:'#F9F4EC', padding:'12px', fontFamily:'Jost,sans-serif', fontSize:13, outline:'none', resize:'none', height:80 }} placeholder="Add notes..." />
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:8 }}>
                {['pending','confirmed','completed','cancelled'].map(s=>(
                  <button key={s} onClick={()=>updateStatus(selected.id,s)} style={{ padding:'10px', border:`1px solid ${STATUS_COLORS[s]}44`, background:selected.status===s?`${STATUS_COLORS[s]}20`:'transparent', color:STATUS_COLORS[s], cursor:'pointer', fontFamily:'Cinzel,serif', fontSize:7, letterSpacing:'0.1em', textTransform:'uppercase', transition:'all 0.2s' }}>
                    {s}
                  </button>
                ))}
              </div>
              <a href={whatsappLink(selected)} target="_blank" rel="noreferrer" style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:8, marginTop:12, background:'#25D366', color:'#fff', padding:'12px', textDecoration:'none', fontFamily:'Cinzel,serif', fontSize:9, letterSpacing:'0.15em', textTransform:'uppercase' }}>
                <MessageCircle size={15}/> Open WhatsApp Chat
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
