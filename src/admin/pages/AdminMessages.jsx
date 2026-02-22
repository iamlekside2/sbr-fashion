import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import toast from 'react-hot-toast'
import { Mail, MailOpen, Trash2, MessageCircle, X } from 'lucide-react'

export default function AdminMessages() {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)
  const [filter, setFilter] = useState('all')

  const load = async () => {
    let q = supabase.from('messages').select('*').order('created_at', { ascending: false })
    if (filter === 'unread') q = q.eq('read', false)
    if (filter === 'read') q = q.eq('read', true)
    const { data } = await q
    if (data) setMessages(data)
    setLoading(false)
  }

  useEffect(() => { load() }, [filter])

  const openMessage = async (msg) => {
    setSelected(msg)
    if (!msg.read) {
      await supabase.from('messages').update({ read: true }).eq('id', msg.id)
      setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, read: true } : m))
    }
  }

  const deleteMessage = async (id) => {
    if (!window.confirm('Delete this message?')) return
    await supabase.from('messages').delete().eq('id', id)
    toast.success('Message deleted')
    setSelected(null)
    load()
  }

  const unreadCount = messages.filter(m => !m.read).length

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 32, fontWeight: 300, color: '#F9F4EC', marginBottom: 4 }}>Messages</h1>
        <p style={{ fontSize: 13, color: '#8A7A5A' }}>{unreadCount} unread · {messages.length} total</p>
      </div>

      {/* Filter */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {['all', 'unread', 'read'].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{ fontFamily: 'Cinzel,serif', fontSize: 8, letterSpacing: '0.15em', textTransform: 'uppercase', padding: '8px 16px', border: '1px solid', borderColor: filter === f ? '#C9A84C' : 'rgba(201,168,76,0.2)', background: filter === f ? 'rgba(201,168,76,0.1)' : 'transparent', color: filter === f ? '#C9A84C' : '#8A7A5A', cursor: 'pointer', transition: 'all 0.2s' }}>
            {f}{f === 'unread' && unreadCount > 0 ? ` (${unreadCount})` : ''}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 1fr' : '1fr', gap: 16 }}>
        {/* List */}
        <div style={{ background: '#111009', border: '1px solid rgba(201,168,76,0.12)', overflow: 'hidden' }}>
          {loading ? (
            <div style={{ padding: 32, color: '#8A7A5A', fontSize: 13, textAlign: 'center' }}>Loading...</div>
          ) : messages.length === 0 ? (
            <div style={{ padding: 48, textAlign: 'center' }}>
              <Mail size={32} color="#8A7A5A" style={{ marginBottom: 12 }} />
              <div style={{ color: '#8A7A5A', fontSize: 13 }}>No messages yet</div>
            </div>
          ) : (
            messages.map(msg => (
              <div key={msg.id} onClick={() => openMessage(msg)} style={{ padding: '16px 20px', borderBottom: '1px solid rgba(201,168,76,0.06)', cursor: 'pointer', background: selected?.id === msg.id ? 'rgba(201,168,76,0.08)' : !msg.read ? 'rgba(201,168,76,0.04)' : 'transparent', transition: 'background 0.2s', display: 'flex', alignItems: 'center', gap: 14 }}
                onMouseEnter={e => { if (selected?.id !== msg.id) e.currentTarget.style.background = 'rgba(201,168,76,0.04)' }}
                onMouseLeave={e => { if (selected?.id !== msg.id) e.currentTarget.style.background = !msg.read ? 'rgba(201,168,76,0.04)' : 'transparent' }}>
                <div style={{ color: msg.read ? '#8A7A5A' : '#C9A84C', flexShrink: 0 }}>
                  {msg.read ? <MailOpen size={16} /> : <Mail size={16} />}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 }}>
                    <div style={{ fontSize: 13, fontWeight: msg.read ? 300 : 500, color: msg.read ? '#EDE3D0' : '#F9F4EC', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{msg.name}</div>
                    <div style={{ fontSize: 10, color: '#8A7A5A', flexShrink: 0, marginLeft: 8 }}>{new Date(msg.created_at).toLocaleDateString()}</div>
                  </div>
                  <div style={{ fontSize: 12, color: '#8A7A5A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{msg.subject}</div>
                </div>
                {!msg.read && <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#C9A84C', flexShrink: 0 }} />}
              </div>
            ))
          )}
        </div>

        {/* Detail */}
        {selected && (
          <div style={{ background: '#111009', border: '1px solid rgba(201,168,76,0.12)', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(201,168,76,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 18, fontWeight: 300, color: '#F9F4EC' }}>{selected.subject}</div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => deleteMessage(selected.id)} style={{ background: 'none', border: 'none', color: '#FF6B6B', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                  <Trash2 size={15} />
                </button>
                <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', color: '#8A7A5A', cursor: 'pointer' }}>
                  <X size={18} />
                </button>
              </div>
            </div>
            <div style={{ padding: 20, flex: 1 }}>
              <div style={{ display: 'flex', gap: 32, marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid rgba(201,168,76,0.08)' }}>
                {[['From', selected.name], ['Email', selected.email], ['WhatsApp', selected.whatsapp || '—'], ['Date', new Date(selected.created_at).toLocaleString()]].map(([k, v]) => (
                  <div key={k}>
                    <div style={{ fontFamily: 'Cinzel,serif', fontSize: 7, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#8A7A5A', marginBottom: 3 }}>{k}</div>
                    <div style={{ fontSize: 12, color: '#EDE3D0' }}>{v}</div>
                  </div>
                ))}
              </div>
              <div style={{ fontSize: 14, color: '#EDE3D0', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>{selected.message}</div>
            </div>
            <div style={{ padding: '16px 20px', borderTop: '1px solid rgba(201,168,76,0.1)', display: 'flex', gap: 10 }}>
              {selected.whatsapp && (
                <a href={`https://wa.me/${selected.whatsapp.replace(/\D/g, '')}?text=Hello ${selected.name}, thank you for reaching out to Stitches by Ruthchinos!`} target="_blank" rel="noreferrer" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, background: '#25D366', color: '#fff', padding: '10px', textDecoration: 'none', fontFamily: 'Cinzel,serif', fontSize: 8, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                  <MessageCircle size={13} /> Reply on WhatsApp
                </a>
              )}
              <a href={`mailto:${selected.email}?subject=Re: ${selected.subject}`} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.3)', color: '#C9A84C', padding: '10px', textDecoration: 'none', fontFamily: 'Cinzel,serif', fontSize: 8, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                <Mail size={13} /> Reply by Email
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
