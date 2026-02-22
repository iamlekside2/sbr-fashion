import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { Package, Calendar, Image, MessageSquare, TrendingUp, CheckCircle, AlertCircle, ShoppingCart } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Dashboard() {
  const [stats, setStats] = useState({ products:0, bookings:0, gallery:0, messages:0, pending:0, unread:0, orders:0, newOrders:0 })
  const [recentBookings, setRecentBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const [p, b, g, m, pb, um, o, no] = await Promise.all([
        supabase.from('products').select('id', {count:'exact'}),
        supabase.from('bookings').select('id', {count:'exact'}),
        supabase.from('gallery').select('id', {count:'exact'}),
        supabase.from('messages').select('id', {count:'exact'}),
        supabase.from('bookings').select('id', {count:'exact'}).eq('status','pending'),
        supabase.from('messages').select('id', {count:'exact'}).eq('read',false),
        supabase.from('orders').select('id', {count:'exact'}),
        supabase.from('orders').select('id', {count:'exact'}).eq('order_status','new'),
      ])
      setStats({ products:p.count||0, bookings:b.count||0, gallery:g.count||0, messages:m.count||0, pending:pb.count||0, unread:um.count||0, orders:o.count||0, newOrders:no.count||0 })

      const { data } = await supabase.from('bookings').select('*').order('created_at',{ascending:false}).limit(5)
      if(data) setRecentBookings(data)
      setLoading(false)
    }
    load()
  }, [])

  const statCards = [
    { label:'Total Products', value:stats.products, icon:Package, color:'#C9A84C', bg:'rgba(201,168,76,0.1)', to:'/admin/products' },
    { label:'Total Orders', value:stats.orders, icon:ShoppingCart, color:'#4CAF50', bg:'rgba(76,175,80,0.1)', to:'/admin/orders' },
    { label:'Total Bookings', value:stats.bookings, icon:Calendar, color:'#69D2A0', bg:'rgba(105,210,160,0.1)', to:'/admin/bookings' },
    { label:'Messages', value:stats.messages, icon:MessageSquare, color:'#E07B9F', bg:'rgba(224,123,159,0.1)', to:'/admin/messages' },
  ]

  const statusColor = (s) => s==='pending'?'#FFD600':s==='confirmed'?'#69D2A0':s==='completed'?'#C9A84C':'#FF6B6B'

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom:32 }}>
        <h1 style={{ fontFamily:'Cormorant Garamond,serif', fontSize:36, fontWeight:300, color:'#F9F4EC', marginBottom:6 }}>
          Good day, <em style={{fontStyle:'italic',color:'#C9A84C'}}>Ruthchinos</em> 👋
        </h1>
        <p style={{ fontSize:13, color:'#8A7A5A' }}>Here's what's happening with your fashion house today.</p>
      </div>

      {/* Alert badges */}
      {(stats.pending > 0 || stats.unread > 0 || stats.newOrders > 0) && (
        <div style={{ display:'flex', gap:12, marginBottom:24, flexWrap:'wrap' }}>
          {stats.newOrders > 0 && (
            <Link to="/admin/orders" style={{ display:'flex', alignItems:'center', gap:8, background:'rgba(76,175,80,0.1)', border:'1px solid rgba(76,175,80,0.3)', padding:'10px 16px', textDecoration:'none', color:'#4CAF50', fontSize:12 }}>
              <ShoppingCart size={14} />
              {stats.newOrders} new order{stats.newOrders!==1?'s':''} to process
            </Link>
          )}
          {stats.pending > 0 && (
            <Link to="/admin/bookings" style={{ display:'flex', alignItems:'center', gap:8, background:'rgba(255,214,0,0.1)', border:'1px solid rgba(255,214,0,0.3)', padding:'10px 16px', textDecoration:'none', color:'#FFD600', fontSize:12 }}>
              <AlertCircle size={14} />
              {stats.pending} pending booking{stats.pending!==1?'s':''} need attention
            </Link>
          )}
          {stats.unread > 0 && (
            <Link to="/admin/messages" style={{ display:'flex', alignItems:'center', gap:8, background:'rgba(224,123,159,0.1)', border:'1px solid rgba(224,123,159,0.3)', padding:'10px 16px', textDecoration:'none', color:'#E07B9F', fontSize:12 }}>
              <MessageSquare size={14} />
              {stats.unread} unread message{stats.unread!==1?'s':''}
            </Link>
          )}
        </div>
      )}

      {/* Stat Cards */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16, marginBottom:32 }}>
        {statCards.map(c => (
          <Link key={c.label} to={c.to} style={{ background:'#111009', border:'1px solid rgba(201,168,76,0.12)', padding:24, textDecoration:'none', transition:'border-color 0.2s', display:'block' }}
            onMouseEnter={e=>(e.currentTarget.style.borderColor='rgba(201,168,76,0.4)')}
            onMouseLeave={e=>(e.currentTarget.style.borderColor='rgba(201,168,76,0.12)')}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:16 }}>
              <div style={{ width:40, height:40, background:c.bg, display:'flex', alignItems:'center', justifyContent:'center', color:c.color }}>
                <c.icon size={18} />
              </div>
              <TrendingUp size={14} color="#8A7A5A" />
            </div>
            <div style={{ fontFamily:'Cormorant Garamond,serif', fontSize:36, fontWeight:300, color:c.color, lineHeight:1, marginBottom:4 }}>
              {loading ? '—' : c.value}
            </div>
            <div style={{ fontFamily:'Cinzel,serif', fontSize:8, letterSpacing:'0.15em', textTransform:'uppercase', color:'#8A7A5A' }}>{c.label}</div>
          </Link>
        ))}
      </div>

      {/* Recent Bookings */}
      <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr', gap:24 }}>
        <div style={{ background:'#111009', border:'1px solid rgba(201,168,76,0.12)', padding:24 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24 }}>
            <div style={{ fontFamily:'Cinzel,serif', fontSize:11, letterSpacing:'0.15em', textTransform:'uppercase', color:'#C9A84C' }}>Recent Bookings</div>
            <Link to="/admin/bookings" style={{ fontSize:11, color:'#8A7A5A', textDecoration:'none' }}>View all →</Link>
          </div>

          {loading ? (
            <div style={{ color:'#8A7A5A', fontSize:13 }}>Loading...</div>
          ) : recentBookings.length === 0 ? (
            <div style={{ color:'#8A7A5A', fontSize:13, textAlign:'center', padding:'32px 0' }}>No bookings yet</div>
          ) : (
            <div>
              {recentBookings.map(b => (
                <div key={b.id} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 0', borderBottom:'1px solid rgba(201,168,76,0.08)' }}>
                  <div>
                    <div style={{ fontSize:13, fontWeight:400, color:'#EDE3D0', marginBottom:2 }}>{b.first_name} {b.last_name}</div>
                    <div style={{ fontSize:11, color:'#8A7A5A' }}>{b.service} · {new Date(b.created_at).toLocaleDateString()}</div>
                  </div>
                  <div style={{ fontSize:10, fontFamily:'Cinzel,serif', letterSpacing:'0.1em', textTransform:'uppercase', color:statusColor(b.status), background:`${statusColor(b.status)}15`, padding:'4px 10px' }}>
                    {b.status}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div style={{ background:'#111009', border:'1px solid rgba(201,168,76,0.12)', padding:24 }}>
          <div style={{ fontFamily:'Cinzel,serif', fontSize:11, letterSpacing:'0.15em', textTransform:'uppercase', color:'#C9A84C', marginBottom:24 }}>Quick Actions</div>
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {[
              ['/admin/products', Package, 'Add New Product'],
              ['/admin/orders', ShoppingCart, 'Manage Orders'],
              ['/admin/gallery', Image, 'Upload to Gallery'],
              ['/admin/bookings', Calendar, 'View Bookings'],
              ['/admin/messages', MessageSquare, 'Read Messages'],
              ['/admin/content', CheckCircle, 'Edit Site Content'],
            ].map(([to, Icon, label]) => (
              <Link key={label} to={to} style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 16px', background:'rgba(201,168,76,0.05)', border:'1px solid rgba(201,168,76,0.12)', textDecoration:'none', color:'#EDE3D0', fontSize:13, transition:'all 0.2s' }}
                onMouseEnter={e=>{ e.currentTarget.style.background='rgba(201,168,76,0.1)'; e.currentTarget.style.color='#C9A84C' }}
                onMouseLeave={e=>{ e.currentTarget.style.background='rgba(201,168,76,0.05)'; e.currentTarget.style.color='#EDE3D0' }}>
                <Icon size={15} />
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
