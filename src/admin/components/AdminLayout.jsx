import { useState } from 'react'
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Package, Calendar, Image, FileText, MessageSquare, Users, LogOut, Menu, X, ChevronRight, Quote, ShoppingCart, Palette } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'

const NAV = [
  { to:'/admin/dashboard', icon:LayoutDashboard, label:'Dashboard' },
  { to:'/admin/products', icon:Package, label:'Products' },
  { to:'/admin/bookings', icon:Calendar, label:'Bookings' },
  { to:'/admin/orders', icon:ShoppingCart, label:'Orders' },
  { to:'/admin/aso-ebi', icon:Palette, label:'Aso-Ebi' },
  { to:'/admin/gallery', icon:Image, label:'Gallery' },
  { to:'/admin/content', icon:FileText, label:'Site Content' },
  { to:'/admin/messages', icon:MessageSquare, label:'Messages' },
  { to:'/admin/testimonials', icon:Quote, label:'Testimonials' },
  { to:'/admin/staff', icon:Users, label:'Staff' },
]

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { signOut, user } = useAuth()

  const handleSignOut = async () => {
    await signOut()
    toast.success('Signed out successfully')
    navigate('/admin/login')
  }

  const sideW = collapsed ? 72 : 240

  return (
    <div style={{ display:'flex', minHeight:'100vh', background:'#0D0B08', fontFamily:'Jost,sans-serif', cursor:'default' }}>

      {/* ── SIDEBAR ── */}
      <aside style={{ width:sideW, background:'#111009', borderRight:'1px solid rgba(201,168,76,0.15)', display:'flex', flexDirection:'column', position:'fixed', top:0, left:0, bottom:0, zIndex:100, transition:'width 0.3s ease', overflow:'hidden' }}>

        {/* Logo */}
        <div style={{ padding:'24px 20px', borderBottom:'1px solid rgba(201,168,76,0.1)', display:'flex', alignItems:'center', justifyContent:'space-between', minHeight:80 }}>
          {!collapsed && (
            <div>
              <div style={{ fontFamily:'Cinzel,serif', fontSize:13, fontWeight:600, color:'#C9A84C', letterSpacing:'0.1em' }}>SBR</div>
              <div style={{ fontFamily:'Cinzel,serif', fontSize:7, letterSpacing:'0.2em', textTransform:'uppercase', color:'#8A7A5A', marginTop:2 }}>Admin Panel</div>
            </div>
          )}
          {collapsed && <img src="/logo-gold.png" alt="SBR" style={{ height:28, width:'auto' }} />}
          <button onClick={()=>setCollapsed(!collapsed)} style={{ background:'none', border:'none', color:'#8A7A5A', cursor:'pointer', padding:4, display:'flex', alignItems:'center', justifyContent:'center' }}>
            {collapsed ? <Menu size={18}/> : <X size={18}/>}
          </button>
        </div>

        {/* Nav Links */}
        <nav style={{ flex:1, padding:'16px 0', overflowY:'auto' }}>
          {NAV.map(({ to, icon:Icon, label }) => {
            const active = location.pathname === to
            return (
              <Link key={to} to={to} style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 20px', textDecoration:'none', color: active ? '#C9A84C' : '#8A7A5A', background: active ? 'rgba(201,168,76,0.08)' : 'transparent', borderLeft: active ? '2px solid #C9A84C' : '2px solid transparent', transition:'all 0.2s', marginBottom:2, whiteSpace:'nowrap', overflow:'hidden' }}
                onMouseEnter={e=>{ if(!active) e.currentTarget.style.color='#C9A84C' }}
                onMouseLeave={e=>{ if(!active) e.currentTarget.style.color='#8A7A5A' }}>
                <Icon size={18} style={{ flexShrink:0 }} />
                {!collapsed && <span style={{ fontSize:13, fontWeight:400 }}>{label}</span>}
                {!collapsed && active && <ChevronRight size={14} style={{ marginLeft:'auto' }} />}
              </Link>
            )
          })}
        </nav>

        {/* User + Signout */}
        <div style={{ padding:'16px 20px', borderTop:'1px solid rgba(201,168,76,0.1)' }}>
          {!collapsed && (
            <div style={{ marginBottom:12 }}>
              <div style={{ fontSize:12, fontWeight:500, color:'#EDE3D0', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{user?.email}</div>
              <div style={{ fontSize:10, color:'#8A7A5A', marginTop:2 }}>Administrator</div>
            </div>
          )}
          <button onClick={handleSignOut} style={{ display:'flex', alignItems:'center', gap:10, background:'none', border:'none', color:'#8A7A5A', cursor:'pointer', fontSize:13, padding:'8px 0', width:'100%', transition:'color 0.2s' }}
            onMouseEnter={e=>(e.currentTarget.style.color='#FF6B6B')}
            onMouseLeave={e=>(e.currentTarget.style.color='#8A7A5A')}>
            <LogOut size={16} />
            {!collapsed && 'Sign Out'}
          </button>
        </div>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <main style={{ flex:1, marginLeft:sideW, transition:'margin-left 0.3s ease', minHeight:'100vh', background:'#0D0B08' }}>
        {/* Top bar */}
        <div style={{ height:64, background:'#111009', borderBottom:'1px solid rgba(201,168,76,0.1)', display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 32px', position:'sticky', top:0, zIndex:50 }}>
          <div style={{ fontFamily:'Cinzel,serif', fontSize:11, letterSpacing:'0.15em', textTransform:'uppercase', color:'#8A7A5A' }}>
            {NAV.find(n=>n.to===location.pathname)?.label || 'Dashboard'}
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:16 }}>
            <Link to="/" target="_blank" style={{ fontFamily:'Cinzel,serif', fontSize:9, letterSpacing:'0.2em', textTransform:'uppercase', color:'#C9A84C', textDecoration:'none', padding:'8px 16px', border:'1px solid rgba(201,168,76,0.3)' }}>
              View Site →
            </Link>
          </div>
        </div>

        <div style={{ padding:32 }}>
          <Outlet />
        </div>
      </main>
    </div>
  )
}
