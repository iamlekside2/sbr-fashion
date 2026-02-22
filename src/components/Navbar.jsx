import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, ShoppingBag, Heart } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'

const LOGO_GOLD = '/logo-gold.png'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const { totalItems } = useCart()
  const { totalItems: wishlistCount } = useWishlist()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => { setOpen(false) }, [location])

  const links = [
    { to: '/#about', label: 'About' },
    { to: '/collections', label: 'Collections' },
    { to: '/services', label: 'Services' },
    { to: '/bespoke', label: 'Custom-Made' },
    { to: '/lookbook', label: 'Our Work' },
    { to: '/style-quiz', label: 'Style Quiz' },
    { to: '/contact', label: 'Contact' },
    { to: '/book', label: 'Book' },
  ]

  return (
    <>
      <nav className="sbr-nav" style={{
        position:'fixed', top:0, left:0, right:0, zIndex:500,
        padding: scrolled ? '14px 60px' : '24px 60px',
        display:'flex', alignItems:'center', justifyContent:'space-between',
        transition:'all 0.4s ease',
        background: scrolled ? 'rgba(10,8,6,0.96)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(201,168,76,0.15)' : 'none',
      }}>
        <Link to="/" style={{ textDecoration:'none', position:'relative', zIndex:502 }}>
          <img src={LOGO_GOLD} alt="SBR" style={{ height:48, width:'auto' }} />
        </Link>

        {/* Desktop links */}
        <ul className="sbr-nav-links" style={{ display:'flex', gap:36, listStyle:'none', margin:0, padding:0 }}>
          {links.map(l => (
            <li key={l.to}>
              <Link to={l.to} style={{
                fontFamily:'Cinzel,serif', fontSize:10, fontWeight:400,
                letterSpacing:'0.2em', textTransform:'uppercase',
                color:'#EDE3D0', textDecoration:'none', transition:'color 0.3s'
              }}
              onMouseEnter={e => (e.currentTarget.style.color='#C9A84C')}
              onMouseLeave={e => (e.currentTarget.style.color='#EDE3D0')}>
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Wishlist + Cart icons */}
        <div style={{ display:'flex', alignItems:'center', gap:16 }}>
          <Link to="/wishlist" style={{ position:'relative', color:'#EDE3D0', textDecoration:'none', transition:'color 0.3s', display:'flex', alignItems:'center' }}
            onMouseEnter={e => (e.currentTarget.style.color='#C9A84C')}
            onMouseLeave={e => (e.currentTarget.style.color='#EDE3D0')}>
            <Heart size={20} strokeWidth={1.5} />
            {wishlistCount > 0 && (
              <span style={{ position:'absolute', top:-6, right:-8, width:18, height:18, borderRadius:'50%', background:'#C9A84C', color:'#0A0806', fontFamily:'Cinzel,serif', fontSize:9, fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center', lineHeight:1 }}>
                {wishlistCount > 9 ? '9+' : wishlistCount}
              </span>
            )}
          </Link>
          <Link to="/cart" style={{ position:'relative', color:'#EDE3D0', textDecoration:'none', transition:'color 0.3s', display:'flex', alignItems:'center' }}
            onMouseEnter={e => (e.currentTarget.style.color='#C9A84C')}
            onMouseLeave={e => (e.currentTarget.style.color='#EDE3D0')}>
            <ShoppingBag size={20} strokeWidth={1.5} />
            {totalItems > 0 && (
              <span style={{ position:'absolute', top:-6, right:-8, width:18, height:18, borderRadius:'50%', background:'#C9A84C', color:'#0A0806', fontFamily:'Cinzel,serif', fontSize:9, fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center', lineHeight:1 }}>
                {totalItems > 9 ? '9+' : totalItems}
              </span>
            )}
          </Link>
        </div>

        <Link to="/book" className="sbr-nav-cta" style={{
          fontFamily:'Cinzel,serif', fontSize:9, fontWeight:500,
          letterSpacing:'0.2em', textTransform:'uppercase',
          color:'#0A0806', background:'#C9A84C',
          padding:'12px 24px', textDecoration:'none', transition:'all 0.3s'
        }}
        onMouseEnter={e => (e.currentTarget.style.background='#E8C97A')}
        onMouseLeave={e => (e.currentTarget.style.background='#C9A84C')}>
          Let's Talk
        </Link>

        {/* Mobile hamburger */}
        <button className="sbr-nav-burger" onClick={() => setOpen(!open)} style={{ display:'none', background:'none', border:'none', color:'#C9A84C', cursor:'pointer', padding:4, position:'relative', zIndex:502 }}>
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile menu overlay */}
      {open && (
        <div className="sbr-mobile-menu" style={{
          position:'fixed', inset:0, zIndex:501,
          background:'rgba(10,8,6,0.98)', backdropFilter:'blur(20px)',
          display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:8
        }}>
          {links.map(l => (
            <Link key={l.to} to={l.to} onClick={() => setOpen(false)} style={{
              fontFamily:'Cinzel,serif', fontSize:14, fontWeight:400,
              letterSpacing:'0.25em', textTransform:'uppercase',
              color:'#EDE3D0', textDecoration:'none', padding:'16px 0',
              transition:'color 0.3s'
            }}
            onMouseEnter={e => (e.currentTarget.style.color='#C9A84C')}
            onMouseLeave={e => (e.currentTarget.style.color='#EDE3D0')}>
              {l.label}
            </Link>
          ))}
          <Link to="/book" onClick={() => setOpen(false)} style={{
            fontFamily:'Cinzel,serif', fontSize:11, fontWeight:500,
            letterSpacing:'0.2em', textTransform:'uppercase',
            color:'#0A0806', background:'linear-gradient(135deg,#E8C97A,#C9A84C)',
            padding:'16px 40px', textDecoration:'none', marginTop:16
          }}>
            Let's Talk
          </Link>
        </div>
      )}
    </>
  )
}
