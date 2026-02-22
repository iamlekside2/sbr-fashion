import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import toast from 'react-hot-toast'
import { MessageCircle, X, Users, Eye } from 'lucide-react'

const STATUS_COLORS = {
  new: '#FFD600', contacted: '#69B3D2', in_progress: '#E8C97A',
  fabric_sourced: '#CD7F32', tailoring: '#C9A84C', completed: '#69D2A0', cancelled: '#FF6B6B',
}

const th = { fontFamily: 'Cinzel,serif', fontSize: 8, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#8A7A5A', padding: '14px 16px', textAlign: 'left', fontWeight: 400 }
const td = { padding: '14px 16px', fontSize: 12 }

export default function AdminAsoEbi() {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [selected, setSelected] = useState(null)
  const [notes, setNotes] = useState('')

  const load = async () => {
    const q = supabase.from('aso_ebi_requests').select('*').order('created_at', { ascending: false })
    const { data } = filter === 'all' ? await q : await q.eq('status', filter)
    if (data) setRequests(data)
    setLoading(false)
  }

  useEffect(() => { load() }, [filter]) // eslint-disable-line react-hooks/exhaustive-deps

  const updateStatus = async (id, status) => {
    const upd = { status }
    if (notes) upd.admin_notes = notes
    const { error } = await supabase.from('aso_ebi_requests').update(upd).eq('id', id)
    if (error) return toast.error('Failed to update')
    toast.success(`Status updated to ${status}`)
    setSelected(null)
    setNotes('')
    load()
  }

  const waLink = (r) => {
    const num = r.coordinator_whatsapp?.replace(/\D/g, '')
    return `https://wa.me/${num}?text=Hi ${r.coordinator_name}! Thank you for your aso-ebi request for ${r.event_name}. I'm reaching out from Stitches by Ruthchinos to discuss the details.`
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <div>
          <h1 style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 32, fontWeight: 300, color: '#F9F4EC', marginBottom: 4 }}>Aso-Ebi Requests</h1>
          <p style={{ fontSize: 13, color: '#8A7A5A' }}>{requests.length} group coordination requests</p>
        </div>
      </div>

      {/* Filter */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
        {['all', 'new', 'contacted', 'in_progress', 'fabric_sourced', 'tailoring', 'completed', 'cancelled'].map(s => (
          <button key={s} onClick={() => setFilter(s)} style={{
            fontFamily: 'Cinzel,serif', fontSize: 8, letterSpacing: '0.15em', textTransform: 'uppercase',
            padding: '8px 16px', border: '1px solid',
            borderColor: filter === s ? (STATUS_COLORS[s] || '#C9A84C') : 'rgba(201,168,76,0.2)',
            background: filter === s ? `${STATUS_COLORS[s] || '#C9A84C'}15` : 'transparent',
            color: filter === s ? (STATUS_COLORS[s] || '#C9A84C') : '#8A7A5A',
            cursor: 'pointer', transition: 'all 0.2s',
          }}>
            {s.replace(/_/g, ' ')}
          </button>
        ))}
      </div>

      {/* Table */}
      <div style={{ background: '#111009', border: '1px solid rgba(201,168,76,0.12)', overflow: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 800 }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(201,168,76,0.1)' }}>
              {['Event', 'Coordinator', 'Fabric', 'Guests', 'Budget', 'Status', 'Date', 'Actions'].map(h => (
                <th key={h} style={th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={8} style={{ padding: 32, textAlign: 'center', color: '#8A7A5A', fontSize: 13 }}>Loading...</td></tr>
            ) : requests.length === 0 ? (
              <tr><td colSpan={8} style={{ padding: 32, textAlign: 'center', color: '#8A7A5A', fontSize: 13 }}>No requests found</td></tr>
            ) : requests.map((r, i) => (
              <tr key={r.id} style={{ borderBottom: '1px solid rgba(201,168,76,0.06)', background: i % 2 === 0 ? 'transparent' : 'rgba(201,168,76,0.02)' }}>
                <td style={td}>
                  <div style={{ color: '#EDE3D0', fontWeight: 400, fontSize: 13 }}>{r.event_name}</div>
                  <div style={{ color: '#8A7A5A', fontSize: 10, marginTop: 2 }}>{r.event_type}</div>
                </td>
                <td style={td}>
                  <div style={{ color: '#EDE3D0' }}>{r.coordinator_name}</div>
                  <div style={{ color: '#8A7A5A', fontSize: 10, marginTop: 2 }}>{r.coordinator_whatsapp}</div>
                </td>
                <td style={{ ...td, color: '#C9A84C' }}>{r.fabric_type?.replace(/-/g, ' ')}</td>
                <td style={td}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#EDE3D0' }}>
                    <Users size={12} color="#8A7A5A" /> {r.guest_count}
                  </div>
                </td>
                <td style={{ ...td, color: '#8A7A5A' }}>{r.budget_per_person?.replace(/-/g, ' - ').replace('k', ',000') || '—'}</td>
                <td style={td}>
                  <span style={{
                    display: 'inline-block', padding: '4px 10px', fontSize: 9,
                    fontFamily: 'Cinzel,serif', letterSpacing: '0.1em', textTransform: 'uppercase',
                    background: `${STATUS_COLORS[r.status] || '#8A7A5A'}15`,
                    color: STATUS_COLORS[r.status] || '#8A7A5A',
                    border: `1px solid ${STATUS_COLORS[r.status] || '#8A7A5A'}30`,
                  }}>
                    {r.status?.replace(/_/g, ' ')}
                  </span>
                </td>
                <td style={{ ...td, color: '#8A7A5A' }}>
                  {r.event_date ? new Date(r.event_date).toLocaleDateString() : '—'}
                </td>
                <td style={td}>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => { setSelected(r); setNotes(r.admin_notes || '') }}
                      style={{ background: 'none', border: 'none', color: '#C9A84C', cursor: 'pointer', padding: 4 }} title="View details">
                      <Eye size={16} />
                    </button>
                    <a href={waLink(r)} target="_blank" rel="noreferrer"
                      style={{ display: 'flex', alignItems: 'center', color: '#25D366', padding: 4 }} title="WhatsApp">
                      <MessageCircle size={16} />
                    </a>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Detail Modal */}
      {selected && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 600, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          onClick={() => setSelected(null)}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)' }} />
          <div onClick={e => e.stopPropagation()}
            style={{ position: 'relative', background: '#111009', border: '1px solid rgba(201,168,76,0.2)', width: '90%', maxWidth: 600, maxHeight: '85vh', overflow: 'auto', padding: 32 }}>
            <button onClick={() => setSelected(null)} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', color: '#8A7A5A', cursor: 'pointer' }}>
              <X size={20} />
            </button>

            <div style={{ fontFamily: 'Cinzel,serif', fontSize: 9, letterSpacing: '0.3em', color: '#C9A84C', textTransform: 'uppercase', marginBottom: 8 }}>Aso-Ebi Request</div>
            <h2 style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 26, fontWeight: 300, color: '#F9F4EC', marginBottom: 24 }}>{selected.event_name}</h2>

            {/* Info grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
              {[
                ['Event Type', selected.event_type],
                ['Event Date', selected.event_date ? new Date(selected.event_date).toLocaleDateString() : 'TBD'],
                ['Fabric', selected.fabric_type?.replace(/-/g, ' ')],
                ['Colour', selected.colour_palette],
                ['Guest Count', selected.guest_count],
                ['Style', selected.uniform_style === 'same' ? 'Uniform' : 'Varied'],
                ['Budget/Person', selected.budget_per_person?.replace(/-/g, ' - ').replace('k', ',000') || '—'],
                ['Submitted', new Date(selected.created_at).toLocaleString()],
              ].map(([k, v]) => (
                <div key={k}>
                  <div style={{ fontSize: 10, color: '#8A7A5A', marginBottom: 2, fontFamily: 'Cinzel,serif', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{k}</div>
                  <div style={{ fontSize: 14, color: '#EDE3D0', textTransform: 'capitalize' }}>{v}</div>
                </div>
              ))}
            </div>

            {/* Coordinator */}
            <div style={{ background: '#0A0806', border: '1px solid rgba(201,168,76,0.1)', padding: '16px 20px', marginBottom: 20 }}>
              <div style={{ fontSize: 10, color: '#8A7A5A', marginBottom: 8, fontFamily: 'Cinzel,serif', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Coordinator</div>
              <div style={{ fontSize: 14, color: '#EDE3D0' }}>{selected.coordinator_name}</div>
              <div style={{ fontSize: 12, color: '#8A7A5A', marginTop: 4 }}>{selected.coordinator_email || '—'} · {selected.coordinator_whatsapp}</div>
            </div>

            {/* Guest list */}
            {selected.guests && selected.guests.length > 0 && selected.guests.some(g => g.name) && (
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 10, color: '#8A7A5A', marginBottom: 8, fontFamily: 'Cinzel,serif', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Guest List</div>
                <div style={{ background: '#0A0806', border: '1px solid rgba(201,168,76,0.1)', padding: '12px 16px' }}>
                  {selected.guests.filter(g => g.name).map((g, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: i < selected.guests.filter(g2 => g2.name).length - 1 ? '1px solid rgba(201,168,76,0.06)' : 'none' }}>
                      <span style={{ fontSize: 12, color: '#EDE3D0' }}>{g.name}</span>
                      <span style={{ fontSize: 11, color: '#8A7A5A' }}>{g.role || '—'} · {g.phone || '—'}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Notes */}
            {(selected.style_notes || selected.additional_notes) && (
              <div style={{ marginBottom: 20 }}>
                {selected.style_notes && (
                  <div style={{ marginBottom: 12 }}>
                    <div style={{ fontSize: 10, color: '#8A7A5A', marginBottom: 4, fontFamily: 'Cinzel,serif', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Style Notes</div>
                    <p style={{ fontSize: 13, color: '#EDE3D0', lineHeight: 1.7 }}>{selected.style_notes}</p>
                  </div>
                )}
                {selected.additional_notes && (
                  <div>
                    <div style={{ fontSize: 10, color: '#8A7A5A', marginBottom: 4, fontFamily: 'Cinzel,serif', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Additional Notes</div>
                    <p style={{ fontSize: 13, color: '#EDE3D0', lineHeight: 1.7 }}>{selected.additional_notes}</p>
                  </div>
                )}
              </div>
            )}

            {/* Admin notes */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 10, color: '#8A7A5A', marginBottom: 8, fontFamily: 'Cinzel,serif', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Admin Notes</div>
              <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3}
                placeholder="Internal notes..."
                style={{
                  width: '100%', padding: '12px 16px', background: '#0A0806',
                  border: '1px solid rgba(201,168,76,0.2)', color: '#F9F4EC',
                  fontFamily: 'Jost,sans-serif', fontSize: 13, resize: 'vertical', outline: 'none',
                }} />
            </div>

            {/* Status actions */}
            <div>
              <div style={{ fontSize: 10, color: '#8A7A5A', marginBottom: 8, fontFamily: 'Cinzel,serif', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Update Status</div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {['new', 'contacted', 'in_progress', 'fabric_sourced', 'tailoring', 'completed', 'cancelled'].map(s => (
                  <button key={s} onClick={() => updateStatus(selected.id, s)}
                    style={{
                      fontFamily: 'Cinzel,serif', fontSize: 8, letterSpacing: '0.1em', textTransform: 'uppercase',
                      padding: '8px 14px', cursor: 'pointer', transition: 'all 0.2s',
                      background: selected.status === s ? `${STATUS_COLORS[s]}20` : 'transparent',
                      border: `1px solid ${selected.status === s ? STATUS_COLORS[s] : 'rgba(201,168,76,0.15)'}`,
                      color: STATUS_COLORS[s] || '#8A7A5A',
                    }}>
                    {s.replace(/_/g, ' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* WhatsApp */}
            <a href={waLink(selected)} target="_blank" rel="noreferrer"
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                background: '#25D366', color: '#fff', padding: '14px 24px', marginTop: 20,
                textDecoration: 'none', fontFamily: 'Cinzel,serif', fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase',
              }}>
              <MessageCircle size={14} /> Message Coordinator
            </a>
          </div>
        </div>
      )}
    </div>
  )
}
