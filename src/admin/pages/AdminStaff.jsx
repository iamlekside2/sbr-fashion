import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import toast from 'react-hot-toast'
import { Plus, Trash2, X, Shield, User } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export default function AdminStaff() {
  const [staff, setStaff] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ email: '', name: '', password: '', role: 'staff' })
  const [saving, setSaving] = useState(false)
  const { user } = useAuth()

  const load = async () => {
    const { data } = await supabase.from('staff_members').select('*').order('created_at', { ascending: false })
    if (data) setStaff(data)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const handleInvite = async () => {
    if (!form.email || !form.name || !form.password) return toast.error('Fill all fields')
    setSaving(true)
    const { data, error } = await supabase.auth.admin.createUser({ email: form.email, password: form.password, email_confirm: true })
    if (error) { toast.error(error.message); setSaving(false); return }
    await supabase.from('staff_members').insert({ id: data.user.id, email: form.email, name: form.name, role: form.role })
    toast.success(`${form.name} added as ${form.role}!`)
    setShowModal(false)
    setForm({ email: '', name: '', password: '', role: 'staff' })
    setSaving(false)
    load()
  }

  const handleRemove = async (member) => {
    if (member.email === user?.email) return toast.error("You can't remove yourself")
    if (!window.confirm(`Remove ${member.name}?`)) return
    await supabase.from('staff_members').delete().eq('id', member.id)
    toast.success('Staff member removed')
    load()
  }

  const inpStyle = { width: '100%', background: '#1A1710', border: '1px solid rgba(201,168,76,0.2)', color: '#F9F4EC', padding: '12px 14px', fontFamily: 'Jost,sans-serif', fontSize: 13, fontWeight: 300, outline: 'none' }
  const labelStyle = { fontFamily: 'Cinzel,serif', fontSize: 8, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#8A7A5A', display: 'block', marginBottom: 8 }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <div>
          <h1 style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 32, fontWeight: 300, color: '#F9F4EC', marginBottom: 4 }}>Staff Members</h1>
          <p style={{ fontSize: 13, color: '#8A7A5A' }}>{staff.length} team member{staff.length !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={() => setShowModal(true)} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'linear-gradient(135deg,#E8C97A,#C9A84C)', color: '#0A0806', border: 'none', padding: '12px 24px', fontFamily: 'Cinzel,serif', fontSize: 9, fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', cursor: 'pointer' }}>
          <Plus size={15} /> Add Staff
        </button>
      </div>

      <div style={{ background: '#111009', border: '1px solid rgba(201,168,76,0.12)' }}>
        {loading ? (
          <div style={{ padding: 32, color: '#8A7A5A', fontSize: 13, textAlign: 'center' }}>Loading...</div>
        ) : staff.length === 0 ? (
          <div style={{ padding: 48, textAlign: 'center' }}>
            <User size={32} color="#8A7A5A" style={{ marginBottom: 12 }} />
            <div style={{ color: '#8A7A5A', fontSize: 13 }}>No staff added yet</div>
          </div>
        ) : (
          staff.map((member, i) => (
            <div key={member.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', borderBottom: i < staff.length - 1 ? '1px solid rgba(201,168,76,0.06)' : 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: member.role === 'admin' ? '#C9A84C' : '#1A1710', border: member.role !== 'admin' ? '1px solid rgba(201,168,76,0.3)' : 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Cormorant Garamond,serif', fontSize: 18, color: member.role === 'admin' ? '#0A0806' : '#C9A84C' }}>
                  {member.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 400, color: '#EDE3D0', display: 'flex', alignItems: 'center', gap: 8 }}>
                    {member.name}
                    {member.email === user?.email && <span style={{ fontSize: 9, fontFamily: 'Cinzel,serif', letterSpacing: '0.1em', color: '#C9A84C', background: 'rgba(201,168,76,0.1)', padding: '2px 8px' }}>YOU</span>}
                  </div>
                  <div style={{ fontSize: 12, color: '#8A7A5A', marginTop: 2 }}>{member.email}</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 10, fontFamily: 'Cinzel,serif', letterSpacing: '0.1em', textTransform: 'uppercase', color: member.role === 'admin' ? '#C9A84C' : '#8A7A5A', background: member.role === 'admin' ? 'rgba(201,168,76,0.1)' : 'rgba(255,255,255,0.05)', padding: '5px 12px' }}>
                  {member.role === 'admin' ? <Shield size={12} /> : <User size={12} />}
                  {member.role}
                </div>
                <div style={{ fontSize: 11, color: '#8A7A5A' }}>{new Date(member.created_at).toLocaleDateString()}</div>
                {member.email !== user?.email && (
                  <button onClick={() => handleRemove(member)} style={{ background: 'none', border: 'none', color: '#8A7A5A', cursor: 'pointer', display: 'flex', alignItems: 'center', transition: 'color 0.2s' }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#FF6B6B')}
                    onMouseLeave={e => (e.currentTarget.style.color = '#8A7A5A')}>
                    <Trash2 size={15} />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 24 }}>
          <div style={{ background: '#111009', border: '1px solid rgba(201,168,76,0.2)', width: '100%', maxWidth: 440 }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(201,168,76,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 22, fontWeight: 300, color: '#F9F4EC' }}>Add Staff Member</div>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: '#8A7A5A', cursor: 'pointer' }}><X size={18} /></button>
            </div>
            <div style={{ padding: 24 }}>
              {[['Full Name', 'name', 'text', 'e.g. Amaka Obi'], ['Email Address', 'email', 'email', 'amaka@sbr.com'], ['Temporary Password', 'password', 'password', '••••••••']].map(([label, key, type, ph]) => (
                <div key={key} style={{ marginBottom: 16 }}>
                  <label style={labelStyle}>{label}</label>
                  <input type={type} value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} placeholder={ph} style={inpStyle}
                    onFocus={e => (e.target.style.borderColor = '#C9A84C')} onBlur={e => (e.target.style.borderColor = 'rgba(201,168,76,0.2)')} />
                </div>
              ))}
              <div style={{ marginBottom: 24 }}>
                <label style={labelStyle}>Role</label>
                <div style={{ display: 'flex', gap: 10 }}>
                  {['staff', 'admin'].map(r => (
                    <button key={r} onClick={() => setForm({ ...form, role: r })} style={{ flex: 1, padding: '10px', border: '1px solid', borderColor: form.role === r ? '#C9A84C' : 'rgba(201,168,76,0.2)', background: form.role === r ? 'rgba(201,168,76,0.1)' : 'transparent', color: form.role === r ? '#C9A84C' : '#8A7A5A', cursor: 'pointer', fontFamily: 'Cinzel,serif', fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                      {r === 'admin' ? <Shield size={12} /> : <User size={12} />} {r}
                    </button>
                  ))}
                </div>
                {form.role === 'admin' && <div style={{ fontSize: 11, color: '#FFD600', marginTop: 8 }}>⚠ Admin has full access to all dashboard features</div>}
              </div>
              <button onClick={handleInvite} disabled={saving} style={{ width: '100%', background: 'linear-gradient(135deg,#E8C97A,#C9A84C)', color: '#0A0806', border: 'none', padding: '14px', fontFamily: 'Cinzel,serif', fontSize: 10, fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1 }}>
                {saving ? 'Creating Account...' : 'Add Staff Member'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
