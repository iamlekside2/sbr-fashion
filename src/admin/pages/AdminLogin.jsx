import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'
import { Eye, EyeOff, Lock } from 'lucide-react'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const { signIn } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await signIn(email, password)
    if (error) {
      toast.error('Invalid credentials. Please try again.')
    } else {
      toast.success('Welcome back!')
      navigate('/admin/dashboard')
    }
    setLoading(false)
  }

  const inp = { width:'100%', background:'#1A1710', border:'1px solid rgba(201,168,76,0.2)', color:'#F9F4EC', padding:'14px 16px', fontFamily:'Jost,sans-serif', fontSize:14, fontWeight:300, outline:'none', transition:'border-color 0.3s' }

  return (
    <div style={{ minHeight:'100vh', background:'#0A0806', display:'flex', alignItems:'center', justifyContent:'center', position:'relative', overflow:'hidden' }}>
      <div style={{ position:'absolute', inset:0, backgroundImage:'radial-gradient(ellipse at 50% 40%, rgba(201,168,76,0.06) 0%, transparent 70%)', pointerEvents:'none' }} />
      <div style={{ position:'absolute', inset:0, opacity:0.03, backgroundImage:'repeating-linear-gradient(45deg,#C9A84C 0,#C9A84C 1px,transparent 0,transparent 50%),repeating-linear-gradient(-45deg,#C9A84C 0,#C9A84C 1px,transparent 0,transparent 50%)', backgroundSize:'30px 30px' }} />

      <div style={{ position:'relative', width:'100%', maxWidth:420, padding:'0 24px' }}>
        <div style={{ textAlign:'center', marginBottom:48 }}>
          <img src="/logo-gold.png" alt="SBR" style={{ height:64, marginBottom:24 }} />
          <div style={{ fontFamily:'Cinzel,serif', fontSize:9, letterSpacing:'0.3em', textTransform:'uppercase', color:'#8A7A5A', marginBottom:8 }}>Admin Portal</div>
          <h1 style={{ fontFamily:'Cormorant Garamond,serif', fontSize:32, fontWeight:300, color:'#F9F4EC' }}>
            Welcome <em style={{fontStyle:'italic',color:'#C9A84C'}}>Back</em>
          </h1>
        </div>

        <div style={{ background:'#111009', border:'1px solid rgba(201,168,76,0.15)', padding:40 }}>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom:20 }}>
              <label style={{ fontFamily:'Cinzel,serif', fontSize:8, letterSpacing:'0.2em', textTransform:'uppercase', color:'#8A7A5A', display:'block', marginBottom:8 }}>Email Address</label>
              <input type="email" value={email} onChange={e=>setEmail(e.target.value)} style={inp} placeholder="admin@sbr.com" required
                onFocus={e=>(e.target.style.borderColor='#C9A84C')}
                onBlur={e=>(e.target.style.borderColor='rgba(201,168,76,0.2)')} />
            </div>

            <div style={{ marginBottom:32 }}>
              <label style={{ fontFamily:'Cinzel,serif', fontSize:8, letterSpacing:'0.2em', textTransform:'uppercase', color:'#8A7A5A', display:'block', marginBottom:8 }}>Password</label>
              <div style={{ position:'relative' }}>
                <input type={showPw?'text':'password'} value={password} onChange={e=>setPassword(e.target.value)} style={{...inp, paddingRight:48}} placeholder="••••••••" required
                  onFocus={e=>(e.target.style.borderColor='#C9A84C')}
                  onBlur={e=>(e.target.style.borderColor='rgba(201,168,76,0.2)')} />
                <button type="button" onClick={()=>setShowPw(!showPw)} style={{ position:'absolute', right:14, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', color:'#8A7A5A', cursor:'pointer', display:'flex', alignItems:'center' }}>
                  {showPw ? <EyeOff size={16}/> : <Eye size={16}/>}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} style={{ width:'100%', background: loading?'#8B6914':'linear-gradient(135deg,#E8C97A,#C9A84C)', color:'#0A0806', border:'none', padding:'16px', fontFamily:'Cinzel,serif', fontSize:10, fontWeight:600, letterSpacing:'0.3em', textTransform:'uppercase', cursor: loading?'not-allowed':'pointer', transition:'all 0.3s', display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
              <Lock size={14} />
              {loading ? 'Signing In...' : 'Sign In to Admin'}
            </button>
          </form>
        </div>

        <div style={{ textAlign:'center', marginTop:24 }}>
          <a href="/" style={{ fontFamily:'Cinzel,serif', fontSize:9, letterSpacing:'0.2em', textTransform:'uppercase', color:'#8A7A5A', textDecoration:'none' }}>← Back to Website</a>
        </div>
      </div>
    </div>
  )
}
