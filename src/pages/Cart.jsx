import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft, CreditCard, MessageCircle, ChevronRight } from 'lucide-react'
import { usePaystackPayment } from 'react-paystack'
import toast from 'react-hot-toast'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useCart } from '../context/CartContext'
import { supabase } from '../lib/supabase'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
}

const PAYSTACK_KEY = process.env.REACT_APP_PAYSTACK_PUBLIC_KEY || ''

const inp = {
  width: '100%', padding: '14px 16px', background: '#111009',
  border: '1px solid rgba(201,168,76,0.2)', color: '#F9F4EC',
  fontFamily: 'Jost,sans-serif', fontSize: 14, fontWeight: 300,
  outline: 'none', transition: 'border-color 0.3s',
}

const labelStyle = {
  fontFamily: 'Cinzel,serif', fontSize: 8, letterSpacing: '0.2em',
  textTransform: 'uppercase', color: '#8A7A5A', marginBottom: 8, display: 'block',
}

function generateOrderNumber() {
  const d = new Date()
  const prefix = 'SBR'
  const ts = `${d.getFullYear()}${String(d.getMonth()+1).padStart(2,'0')}${String(d.getDate()).padStart(2,'0')}`
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `${prefix}-${ts}-${rand}`
}

// Paystack button wrapper component
function PaystackBtn({ config, onSuccess, onClose, disabled, children }) {
  const initPayment = usePaystackPayment(config)
  return (
    <button
      onClick={() => { if (!disabled) initPayment(onSuccess, onClose) }}
      disabled={disabled}
      style={{
        width: '100%', fontFamily: 'Cinzel,serif', fontSize: 10, fontWeight: 600,
        letterSpacing: '0.2em', textTransform: 'uppercase',
        color: disabled ? '#8A7A5A' : '#0A0806',
        background: disabled ? '#2A2010' : 'linear-gradient(135deg,#E8C97A,#C9A84C)',
        padding: '18px 24px', border: 'none', cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'opacity 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
      }}
      onMouseEnter={e => { if (!disabled) e.currentTarget.style.opacity = '0.9' }}
      onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}>
      {children}
    </button>
  )
}

export default function Cart() {
  const { items, removeItem, updateQty, clearCart, totalItems, totalPrice } = useCart()
  const navigate = useNavigate()
  const [showCheckout, setShowCheckout] = useState(false)
  const [saving, setSaving] = useState(false)

  const [form, setForm] = useState({
    name: '', email: '', whatsapp: '',
    address: '', city: '', state: '',
  })

  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }))
  const checkoutValid = form.name && form.email && form.whatsapp

  const whatsappMsg = items.length > 0
    ? `Hi, I'd like to order the following from Stitches by Ruthchinos:\n\n${items.map(i => `• ${i.name} (x${i.qty}) — ₦${(i.price * i.qty).toLocaleString()}`).join('\n')}\n\nTotal: ₦${totalPrice.toLocaleString()}${form.name ? `\n\nName: ${form.name}` : ''}${form.whatsapp ? `\nWhatsApp: ${form.whatsapp}` : ''}`
    : ''

  const saveOrder = async (paymentMethod, paymentRef = '') => {
    const orderNumber = generateOrderNumber()
    const orderData = {
      order_number: orderNumber,
      customer_name: form.name,
      customer_email: form.email,
      customer_whatsapp: form.whatsapp,
      items: items.map(i => ({ id: i.id, name: i.name, price: i.price, qty: i.qty, image: i.image, category: i.category })),
      subtotal: totalPrice,
      delivery_fee: 0,
      total: totalPrice,
      payment_method: paymentMethod,
      payment_reference: paymentRef,
      payment_status: paymentMethod === 'paystack' ? 'paid' : 'pending',
      order_status: 'new',
      delivery_address: form.address,
      delivery_city: form.city,
      delivery_state: form.state,
    }

    const { error } = await supabase.from('orders').insert([orderData])
    if (error) {
      console.error('Order save error:', error)
      toast.error('Could not save order. Please contact us on WhatsApp.')
      return null
    }
    return orderNumber
  }

  const handlePaystackSuccess = async (reference) => {
    setSaving(true)
    const orderNum = await saveOrder('paystack', reference.reference)
    setSaving(false)
    if (orderNum) {
      clearCart()
      navigate(`/order-confirmation?order=${orderNum}&method=paystack`)
    }
  }

  const handlePaystackClose = () => {
    toast.error('Payment was cancelled')
  }

  const handleWhatsAppCheckout = async () => {
    if (!checkoutValid) {
      toast.error('Please fill in your details first')
      return
    }
    setSaving(true)
    const orderNum = await saveOrder('whatsapp')
    setSaving(false)
    if (orderNum) {
      const msg = whatsappMsg + `\n\nOrder #: ${orderNum}`
      window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank')
      clearCart()
      navigate(`/order-confirmation?order=${orderNum}&method=whatsapp`)
    }
  }

  const paystackConfig = {
    reference: `SBR_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    email: form.email || 'customer@sbr.com',
    amount: totalPrice * 100, // Paystack uses kobo
    publicKey: PAYSTACK_KEY,
    currency: 'NGN',
    metadata: {
      custom_fields: [
        { display_name: 'Customer Name', variable_name: 'customer_name', value: form.name },
        { display_name: 'WhatsApp', variable_name: 'whatsapp', value: form.whatsapp },
        { display_name: 'Items', variable_name: 'items', value: items.map(i => `${i.name} x${i.qty}`).join(', ') },
      ]
    }
  }

  const paystackReady = PAYSTACK_KEY && PAYSTACK_KEY !== 'pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'

  return (
    <div>
      <Navbar />
      <div style={{ minHeight: '100vh', background: '#0A0806', paddingTop: 120, paddingBottom: 80 }}>
        <div className="sbr-page-pad" style={{ padding: '0 60px' }}>

          {/* Header */}
          <motion.div initial="hidden" animate="show" variants={fadeUp} style={{ marginBottom: 48 }}>
            <Link to="/collections" style={{ fontFamily: 'Cinzel,serif', fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#8A7A5A', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 24, transition: 'color 0.3s' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#C9A84C')}
              onMouseLeave={e => (e.currentTarget.style.color = '#8A7A5A')}>
              <ArrowLeft size={14} /> Continue Shopping
            </Link>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 16 }}>
              <h1 style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 'clamp(36px,4vw,56px)', fontWeight: 300, color: '#F9F4EC' }}>
                Your <em style={{ fontStyle: 'italic', color: '#C9A84C' }}>Cart</em>
              </h1>
              {totalItems > 0 && (
                <span style={{ fontFamily: 'Cinzel,serif', fontSize: 9, letterSpacing: '0.15em', color: '#8A7A5A' }}>
                  ({totalItems} {totalItems === 1 ? 'item' : 'items'})
                </span>
              )}
            </div>
          </motion.div>

          {items.length === 0 ? (
            <motion.div initial="hidden" animate="show" variants={fadeUp}
              style={{ textAlign: 'center', padding: '80px 20px' }}>
              <ShoppingBag size={64} strokeWidth={0.8} style={{ color: 'rgba(201,168,76,0.25)', marginBottom: 32 }} />
              <h2 style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 28, fontWeight: 300, color: '#F9F4EC', marginBottom: 12 }}>
                Your cart is empty
              </h2>
              <p style={{ fontSize: 14, color: '#8A7A5A', marginBottom: 40, maxWidth: 400, margin: '0 auto 40px' }}>
                Discover our curated collections and find pieces that tell your story.
              </p>
              <Link to="/collections" style={{ fontFamily: 'Cinzel,serif', fontSize: 10, fontWeight: 500, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#0A0806', background: 'linear-gradient(135deg,#E8C97A,#C9A84C)', padding: '18px 40px', textDecoration: 'none', display: 'inline-block' }}>
                Shop Collections
              </Link>
            </motion.div>
          ) : (
            <div className="sbr-cart-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: 48, alignItems: 'start' }}>

              {/* Items list */}
              <div>
                <div className="sbr-cart-header" style={{ display: 'grid', gridTemplateColumns: '1fr auto auto auto', gap: 24, alignItems: 'center', paddingBottom: 16, borderBottom: '1px solid rgba(201,168,76,0.15)', marginBottom: 4 }}>
                  <span style={{ fontFamily: 'Cinzel,serif', fontSize: 8, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#8A7A5A' }}>Product</span>
                  <span style={{ fontFamily: 'Cinzel,serif', fontSize: 8, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#8A7A5A', textAlign: 'center', width: 120 }}>Quantity</span>
                  <span style={{ fontFamily: 'Cinzel,serif', fontSize: 8, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#8A7A5A', textAlign: 'right', width: 120 }}>Subtotal</span>
                  <span style={{ width: 36 }} />
                </div>

                <AnimatePresence mode="popLayout">
                  {items.map(item => (
                    <motion.div key={item.id} layout
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -40, transition: { duration: 0.3 } }}
                      className="sbr-cart-item"
                      style={{ display: 'grid', gridTemplateColumns: '1fr auto auto auto', gap: 24, alignItems: 'center', padding: '24px 0', borderBottom: '1px solid rgba(201,168,76,0.08)' }}>

                      <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
                        <Link to={`/collections/${item.id}`} style={{ width: 80, height: 100, flexShrink: 0, background: '#1A1710', border: '1px solid rgba(201,168,76,0.12)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {item.image ? (
                            <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (
                            <div style={{ fontSize: 32, opacity: 0.15 }}>👗</div>
                          )}
                        </Link>
                        <div>
                          <Link to={`/collections/${item.id}`} style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 18, fontWeight: 400, color: '#F9F4EC', textDecoration: 'none', transition: 'color 0.2s' }}
                            onMouseEnter={e => (e.currentTarget.style.color = '#C9A84C')}
                            onMouseLeave={e => (e.currentTarget.style.color = '#F9F4EC')}>
                            {item.name}
                          </Link>
                          <div style={{ fontFamily: 'Cinzel,serif', fontSize: 8, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#8A7A5A', marginTop: 4 }}>{item.category}</div>
                          <div style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 16, color: '#C9A84C', marginTop: 6 }}>₦{item.price.toLocaleString()}</div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: 0, border: '1px solid rgba(201,168,76,0.2)', width: 120 }}>
                        <button onClick={() => updateQty(item.id, item.qty - 1)} style={{ width: 36, height: 36, background: 'none', border: 'none', color: '#C9A84C', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s' }}
                          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(201,168,76,0.08)')}
                          onMouseLeave={e => (e.currentTarget.style.background = 'none')}>
                          <Minus size={14} />
                        </button>
                        <div style={{ flex: 1, textAlign: 'center', fontFamily: 'Jost,sans-serif', fontSize: 14, color: '#F9F4EC', borderLeft: '1px solid rgba(201,168,76,0.2)', borderRight: '1px solid rgba(201,168,76,0.2)', lineHeight: '36px' }}>
                          {item.qty}
                        </div>
                        <button onClick={() => updateQty(item.id, item.qty + 1)} style={{ width: 36, height: 36, background: 'none', border: 'none', color: '#C9A84C', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s' }}
                          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(201,168,76,0.08)')}
                          onMouseLeave={e => (e.currentTarget.style.background = 'none')}>
                          <Plus size={14} />
                        </button>
                      </div>

                      <div style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 20, fontWeight: 300, color: '#C9A84C', textAlign: 'right', width: 120 }}>
                        ₦{(item.price * item.qty).toLocaleString()}
                      </div>

                      <button onClick={() => removeItem(item.id)} style={{ width: 36, height: 36, background: 'none', border: 'none', color: '#8A7A5A', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'color 0.2s' }}
                        onMouseEnter={e => (e.currentTarget.style.color = '#E8505B')}
                        onMouseLeave={e => (e.currentTarget.style.color = '#8A7A5A')}>
                        <Trash2 size={16} />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>

                <div style={{ marginTop: 16, textAlign: 'right' }}>
                  <button onClick={clearCart} style={{ fontFamily: 'Cinzel,serif', fontSize: 8, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#8A7A5A', background: 'none', border: 'none', cursor: 'pointer', padding: '8px 0', transition: 'color 0.2s' }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#E8505B')}
                    onMouseLeave={e => (e.currentTarget.style.color = '#8A7A5A')}>
                    Clear Cart
                  </button>
                </div>
              </div>

              {/* Order Summary + Checkout */}
              <div className="sbr-cart-summary" style={{ position: 'sticky', top: 120 }}>
                {/* Summary */}
                <div style={{ background: '#111009', border: '1px solid rgba(201,168,76,0.15)', padding: 32 }}>
                  <h3 style={{ fontFamily: 'Cinzel,serif', fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: 28 }}>Order Summary</h3>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24, paddingBottom: 24, borderBottom: '1px solid rgba(201,168,76,0.12)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: 13, color: '#8A7A5A' }}>Subtotal ({totalItems} items)</span>
                      <span style={{ fontSize: 13, color: '#EDE3D0' }}>₦{totalPrice.toLocaleString()}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: 13, color: '#8A7A5A' }}>Delivery</span>
                      <span style={{ fontSize: 13, color: '#8A7A5A', fontStyle: 'italic' }}>Calculated later</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: showCheckout ? 0 : 32 }}>
                    <span style={{ fontFamily: 'Cinzel,serif', fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#EDE3D0' }}>Total</span>
                    <span style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 32, fontWeight: 300, color: '#C9A84C' }}>₦{totalPrice.toLocaleString()}</span>
                  </div>

                  {!showCheckout && (
                    <button onClick={() => setShowCheckout(true)}
                      style={{ width: '100%', fontFamily: 'Cinzel,serif', fontSize: 10, fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#0A0806', background: 'linear-gradient(135deg,#E8C97A,#C9A84C)', padding: '18px 24px', border: 'none', cursor: 'pointer', transition: 'opacity 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
                      onMouseEnter={e => (e.currentTarget.style.opacity = '0.9')}
                      onMouseLeave={e => (e.currentTarget.style.opacity = '1')}>
                      Proceed to Checkout <ChevronRight size={16} />
                    </button>
                  )}
                </div>

                {/* Checkout form */}
                <AnimatePresence>
                  {showCheckout && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      style={{ overflow: 'hidden' }}>
                      <div className="sbr-checkout-form" style={{ background: '#111009', border: '1px solid rgba(201,168,76,0.15)', borderTop: 'none', padding: 32 }}>
                        <h3 style={{ fontFamily: 'Cinzel,serif', fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: 24 }}>Your Details</h3>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 24 }}>
                          <div>
                            <label style={labelStyle}>Full Name *</label>
                            <input value={form.name} onChange={e => set('name', e.target.value)}
                              style={inp} placeholder="Your full name"
                              onFocus={e => (e.target.style.borderColor = '#C9A84C')}
                              onBlur={e => (e.target.style.borderColor = 'rgba(201,168,76,0.2)')} />
                          </div>
                          <div>
                            <label style={labelStyle}>Email Address *</label>
                            <input type="email" value={form.email} onChange={e => set('email', e.target.value)}
                              style={inp} placeholder="your@email.com"
                              onFocus={e => (e.target.style.borderColor = '#C9A84C')}
                              onBlur={e => (e.target.style.borderColor = 'rgba(201,168,76,0.2)')} />
                          </div>
                          <div>
                            <label style={labelStyle}>WhatsApp Number *</label>
                            <input value={form.whatsapp} onChange={e => set('whatsapp', e.target.value)}
                              style={inp} placeholder="+234..."
                              onFocus={e => (e.target.style.borderColor = '#C9A84C')}
                              onBlur={e => (e.target.style.borderColor = 'rgba(201,168,76,0.2)')} />
                          </div>

                          <div style={{ borderTop: '1px solid rgba(201,168,76,0.1)', paddingTop: 16 }}>
                            <label style={{ ...labelStyle, marginBottom: 12 }}>Delivery Address (Optional)</label>
                            <input value={form.address} onChange={e => set('address', e.target.value)}
                              style={{ ...inp, marginBottom: 8 }} placeholder="Street address"
                              onFocus={e => (e.target.style.borderColor = '#C9A84C')}
                              onBlur={e => (e.target.style.borderColor = 'rgba(201,168,76,0.2)')} />
                            <div className="sbr-form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                              <input value={form.city} onChange={e => set('city', e.target.value)}
                                style={inp} placeholder="City"
                                onFocus={e => (e.target.style.borderColor = '#C9A84C')}
                                onBlur={e => (e.target.style.borderColor = 'rgba(201,168,76,0.2)')} />
                              <input value={form.state} onChange={e => set('state', e.target.value)}
                                style={inp} placeholder="State"
                                onFocus={e => (e.target.style.borderColor = '#C9A84C')}
                                onBlur={e => (e.target.style.borderColor = 'rgba(201,168,76,0.2)')} />
                            </div>
                          </div>
                        </div>

                        {/* Payment methods */}
                        <h3 style={{ fontFamily: 'Cinzel,serif', fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: 16 }}>Pay With</h3>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                          {/* Paystack */}
                          {paystackReady ? (
                            <PaystackBtn config={paystackConfig} onSuccess={handlePaystackSuccess} onClose={handlePaystackClose} disabled={!checkoutValid || saving}>
                              <CreditCard size={16} /> {saving ? 'Processing...' : 'Pay with Card'}
                            </PaystackBtn>
                          ) : (
                            <button disabled
                              style={{ width: '100%', fontFamily: 'Cinzel,serif', fontSize: 10, fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#8A7A5A', background: '#1A1710', padding: '18px 24px', border: '1px solid rgba(201,168,76,0.12)', cursor: 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                              <CreditCard size={16} /> Card Payment (Coming Soon)
                            </button>
                          )}

                          {/* WhatsApp checkout */}
                          <button onClick={handleWhatsAppCheckout} disabled={!checkoutValid || saving}
                            style={{ width: '100%', fontFamily: 'Cinzel,serif', fontSize: 10, fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: !checkoutValid || saving ? '#8A7A5A' : '#C9A84C', background: 'transparent', border: `1px solid ${!checkoutValid || saving ? 'rgba(201,168,76,0.12)' : 'rgba(201,168,76,0.4)'}`, padding: '18px 24px', cursor: !checkoutValid || saving ? 'not-allowed' : 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}
                            onMouseEnter={e => { if (checkoutValid && !saving) { e.currentTarget.style.background = 'rgba(201,168,76,0.1)'; e.currentTarget.style.borderColor = '#C9A84C' } }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = checkoutValid && !saving ? 'rgba(201,168,76,0.4)' : 'rgba(201,168,76,0.12)' }}>
                            <MessageCircle size={16} /> {saving ? 'Processing...' : 'Order via WhatsApp'}
                          </button>
                        </div>

                        {!checkoutValid && (
                          <p style={{ fontSize: 11, color: '#8A7A5A', marginTop: 12, textAlign: 'center' }}>
                            Please fill in name, email and WhatsApp to continue.
                          </p>
                        )}

                        <p style={{ fontSize: 11, color: '#8A7A5A', lineHeight: 1.7, marginTop: 16, textAlign: 'center' }}>
                          Secure payment powered by Paystack. We'll confirm availability and arrange delivery via WhatsApp.
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  )
}
