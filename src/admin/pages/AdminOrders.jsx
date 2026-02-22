import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import toast from 'react-hot-toast'
import { MessageCircle, X, CreditCard, Eye } from 'lucide-react'

const STATUS_COLORS = {
  new: '#7B9FE0',
  confirmed: '#69D2A0',
  processing: '#FFD600',
  shipped: '#C9A84C',
  delivered: '#4CAF50',
  cancelled: '#FF6B6B',
}

const PAY_COLORS = {
  pending: '#FFD600',
  paid: '#4CAF50',
  failed: '#FF6B6B',
  refunded: '#7B9FE0',
}

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [selected, setSelected] = useState(null)
  const [notes, setNotes] = useState('')

  const load = async () => {
    const q = supabase.from('orders').select('*').order('created_at', { ascending: false })
    const { data } = filter === 'all' ? await q : await q.eq('order_status', filter)
    if (data) setOrders(data)
    setLoading(false)
  }

  useEffect(() => { load() }, [filter]) // eslint-disable-line react-hooks/exhaustive-deps

  const updateOrderStatus = async (id, order_status) => {
    const { error } = await supabase.from('orders').update({ order_status, admin_notes: notes }).eq('id', id)
    if (error) return toast.error('Failed to update')
    toast.success(`Order marked as ${order_status}!`)
    setSelected(null)
    load()
  }

  const updatePaymentStatus = async (id, payment_status) => {
    const { error } = await supabase.from('orders').update({ payment_status }).eq('id', id)
    if (error) return toast.error('Failed to update')
    toast.success(`Payment marked as ${payment_status}!`)
    setSelected(prev => prev ? { ...prev, payment_status } : null)
    load()
  }

  const whatsappLink = (o) =>
    `https://wa.me/${(o.customer_whatsapp || '').replace(/\D/g, '')}?text=Hello ${o.customer_name.split(' ')[0]}, regarding your order ${o.order_number} with Stitches by Ruthchinos.`

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <div>
          <h1 style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 32, fontWeight: 300, color: '#F9F4EC', marginBottom: 4 }}>Orders</h1>
          <p style={{ fontSize: 13, color: '#8A7A5A' }}>{orders.length} order{orders.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      {/* Status filter */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
        {['all', 'new', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].map(s => (
          <button key={s} onClick={() => setFilter(s)} style={{
            fontFamily: 'Cinzel,serif', fontSize: 8, letterSpacing: '0.15em', textTransform: 'uppercase',
            padding: '8px 16px', border: '1px solid',
            borderColor: filter === s ? (STATUS_COLORS[s] || '#C9A84C') : 'rgba(201,168,76,0.2)',
            background: filter === s ? `${STATUS_COLORS[s] || '#C9A84C'}15` : 'transparent',
            color: filter === s ? (STATUS_COLORS[s] || '#C9A84C') : '#8A7A5A',
            cursor: 'pointer', transition: 'all 0.2s',
          }}>
            {s}
          </button>
        ))}
      </div>

      {/* Table */}
      <div style={{ background: '#111009', border: '1px solid rgba(201,168,76,0.12)', overflow: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 800 }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(201,168,76,0.1)' }}>
              {['Order #', 'Customer', 'Items', 'Total', 'Payment', 'Status', 'Date', 'Actions'].map(h => (
                <th key={h} style={{ fontFamily: 'Cinzel,serif', fontSize: 8, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#8A7A5A', padding: '14px 16px', textAlign: 'left', fontWeight: 400 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={8} style={{ padding: 32, textAlign: 'center', color: '#8A7A5A', fontSize: 13 }}>Loading...</td></tr>
            ) : orders.length === 0 ? (
              <tr><td colSpan={8} style={{ padding: 32, textAlign: 'center', color: '#8A7A5A', fontSize: 13 }}>No orders found</td></tr>
            ) : orders.map((o, i) => (
              <tr key={o.id} style={{ borderBottom: '1px solid rgba(201,168,76,0.06)', background: i % 2 === 0 ? 'transparent' : 'rgba(201,168,76,0.02)' }}>
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ fontSize: 12, fontWeight: 500, color: '#C9A84C', fontFamily: 'monospace' }}>{o.order_number}</div>
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ fontSize: 13, fontWeight: 400, color: '#EDE3D0' }}>{o.customer_name}</div>
                  <div style={{ fontSize: 11, color: '#8A7A5A', marginTop: 2 }}>{o.customer_email}</div>
                </td>
                <td style={{ padding: '14px 16px', fontSize: 12, color: '#8A7A5A' }}>
                  {(o.items || []).length} item{(o.items || []).length !== 1 ? 's' : ''}
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 16, fontWeight: 300, color: '#C9A84C' }}>
                    ₦{Number(o.total).toLocaleString()}
                  </div>
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <span style={{ fontSize: 9, fontFamily: 'Cinzel,serif', letterSpacing: '0.1em', textTransform: 'uppercase', color: PAY_COLORS[o.payment_status] || '#8A7A5A', background: `${PAY_COLORS[o.payment_status] || '#8A7A5A'}15`, padding: '3px 8px', display: 'inline-block', width: 'fit-content' }}>
                      {o.payment_status}
                    </span>
                    <span style={{ fontSize: 10, color: '#8A7A5A' }}>
                      {o.payment_method === 'paystack' ? '💳 Card' : o.payment_method === 'whatsapp' ? '💬 WhatsApp' : '🏦 Transfer'}
                    </span>
                  </div>
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <span style={{ fontSize: 9, fontFamily: 'Cinzel,serif', letterSpacing: '0.1em', textTransform: 'uppercase', color: STATUS_COLORS[o.order_status] || '#8A7A5A', background: `${STATUS_COLORS[o.order_status] || '#8A7A5A'}15`, padding: '4px 10px' }}>
                    {o.order_status}
                  </span>
                </td>
                <td style={{ padding: '14px 16px', fontSize: 12, color: '#8A7A5A' }}>
                  {new Date(o.created_at).toLocaleDateString()}
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <button onClick={() => { setSelected(o); setNotes(o.admin_notes || '') }} style={{ fontSize: 11, color: '#C9A84C', background: 'none', border: '1px solid rgba(201,168,76,0.3)', padding: '5px 12px', cursor: 'pointer', fontFamily: 'Jost,sans-serif', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Eye size={13} /> View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Detail Modal */}
      {selected && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 24 }}>
          <div style={{ background: '#111009', border: '1px solid rgba(201,168,76,0.2)', width: '100%', maxWidth: 600, maxHeight: '90vh', overflowY: 'auto' }}>
            {/* Header */}
            <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(201,168,76,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, background: '#111009', zIndex: 1 }}>
              <div>
                <div style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 22, fontWeight: 300, color: '#F9F4EC' }}>Order Details</div>
                <div style={{ fontSize: 12, color: '#C9A84C', fontFamily: 'monospace', marginTop: 4 }}>{selected.order_number}</div>
              </div>
              <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', color: '#8A7A5A', cursor: 'pointer' }}><X size={18} /></button>
            </div>

            <div style={{ padding: 24 }}>
              {/* Customer info */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontFamily: 'Cinzel,serif', fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: 12 }}>Customer</div>
                {[
                  ['Name', selected.customer_name],
                  ['Email', selected.customer_email],
                  ['WhatsApp', selected.customer_whatsapp || '—'],
                ].map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', marginBottom: 8 }}>
                    <div style={{ fontFamily: 'Cinzel,serif', fontSize: 8, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#8A7A5A', width: 90, flexShrink: 0, marginTop: 2 }}>{k}</div>
                    <div style={{ fontSize: 13, color: '#EDE3D0' }}>{v}</div>
                  </div>
                ))}
              </div>

              {/* Delivery */}
              {(selected.delivery_address || selected.delivery_city) && (
                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontFamily: 'Cinzel,serif', fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: 12 }}>Delivery</div>
                  <div style={{ fontSize: 13, color: '#EDE3D0', lineHeight: 1.7 }}>
                    {selected.delivery_address && <div>{selected.delivery_address}</div>}
                    {(selected.delivery_city || selected.delivery_state) && (
                      <div>{[selected.delivery_city, selected.delivery_state].filter(Boolean).join(', ')}</div>
                    )}
                  </div>
                </div>
              )}

              {/* Items */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontFamily: 'Cinzel,serif', fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: 12 }}>Items</div>
                <div style={{ background: '#1A1710', border: '1px solid rgba(201,168,76,0.1)' }}>
                  {(selected.items || []).map((item, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderBottom: i < selected.items.length - 1 ? '1px solid rgba(201,168,76,0.06)' : 'none' }}>
                      {item.image && (
                        <div style={{ width: 40, height: 50, background: '#111009', border: '1px solid rgba(201,168,76,0.12)', overflow: 'hidden', flexShrink: 0 }}>
                          <img src={item.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                      )}
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, color: '#EDE3D0' }}>{item.name}</div>
                        <div style={{ fontSize: 11, color: '#8A7A5A' }}>{item.category} · Qty: {item.qty}</div>
                      </div>
                      <div style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 15, color: '#C9A84C' }}>
                        ₦{(item.price * item.qty).toLocaleString()}
                      </div>
                    </div>
                  ))}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '14px', borderTop: '1px solid rgba(201,168,76,0.15)', background: 'rgba(201,168,76,0.03)' }}>
                    <span style={{ fontFamily: 'Cinzel,serif', fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#EDE3D0' }}>Total</span>
                    <span style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 22, fontWeight: 300, color: '#C9A84C' }}>₦{Number(selected.total).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Payment info */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontFamily: 'Cinzel,serif', fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: 12 }}>Payment</div>
                <div style={{ display: 'flex', gap: 16, marginBottom: 12 }}>
                  <div>
                    <div style={{ fontFamily: 'Cinzel,serif', fontSize: 8, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#8A7A5A', marginBottom: 4 }}>Method</div>
                    <div style={{ fontSize: 13, color: '#EDE3D0', display: 'flex', alignItems: 'center', gap: 6 }}>
                      <CreditCard size={13} /> {selected.payment_method}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontFamily: 'Cinzel,serif', fontSize: 8, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#8A7A5A', marginBottom: 4 }}>Status</div>
                    <span style={{ fontSize: 9, fontFamily: 'Cinzel,serif', letterSpacing: '0.1em', textTransform: 'uppercase', color: PAY_COLORS[selected.payment_status] || '#8A7A5A', background: `${PAY_COLORS[selected.payment_status] || '#8A7A5A'}15`, padding: '4px 10px' }}>
                      {selected.payment_status}
                    </span>
                  </div>
                  {selected.payment_reference && (
                    <div>
                      <div style={{ fontFamily: 'Cinzel,serif', fontSize: 8, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#8A7A5A', marginBottom: 4 }}>Reference</div>
                      <div style={{ fontSize: 11, color: '#EDE3D0', fontFamily: 'monospace' }}>{selected.payment_reference}</div>
                    </div>
                  )}
                </div>
                {/* Payment status buttons */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 6 }}>
                  {['pending', 'paid', 'failed', 'refunded'].map(s => (
                    <button key={s} onClick={() => updatePaymentStatus(selected.id, s)} style={{
                      padding: '8px', border: `1px solid ${PAY_COLORS[s]}44`,
                      background: selected.payment_status === s ? `${PAY_COLORS[s]}20` : 'transparent',
                      color: PAY_COLORS[s], cursor: 'pointer', fontFamily: 'Cinzel,serif',
                      fontSize: 7, letterSpacing: '0.1em', textTransform: 'uppercase', transition: 'all 0.2s',
                    }}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Admin notes */}
              <div style={{ marginBottom: 20 }}>
                <label style={{ fontFamily: 'Cinzel,serif', fontSize: 8, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#8A7A5A', display: 'block', marginBottom: 8 }}>Internal Notes</label>
                <textarea value={notes} onChange={e => setNotes(e.target.value)} style={{ width: '100%', background: '#1A1710', border: '1px solid rgba(201,168,76,0.2)', color: '#F9F4EC', padding: '12px', fontFamily: 'Jost,sans-serif', fontSize: 13, outline: 'none', resize: 'none', height: 80 }} placeholder="Add notes about this order..." />
              </div>

              {/* Order status buttons */}
              <div style={{ fontFamily: 'Cinzel,serif', fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: 12 }}>Update Order Status</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, marginBottom: 16 }}>
                {['new', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].map(s => (
                  <button key={s} onClick={() => updateOrderStatus(selected.id, s)} style={{
                    padding: '10px', border: `1px solid ${STATUS_COLORS[s]}44`,
                    background: selected.order_status === s ? `${STATUS_COLORS[s]}20` : 'transparent',
                    color: STATUS_COLORS[s], cursor: 'pointer', fontFamily: 'Cinzel,serif',
                    fontSize: 7, letterSpacing: '0.1em', textTransform: 'uppercase', transition: 'all 0.2s',
                  }}>
                    {s}
                  </button>
                ))}
              </div>

              {/* WhatsApp link */}
              {selected.customer_whatsapp && (
                <a href={whatsappLink(selected)} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: '#25D366', color: '#fff', padding: '12px', textDecoration: 'none', fontFamily: 'Cinzel,serif', fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                  <MessageCircle size={15} /> Message Customer on WhatsApp
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
