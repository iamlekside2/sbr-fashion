import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CheckCircle, MessageCircle, ShoppingBag } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { supabase } from '../lib/supabase'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
}
const stagger = { show: { transition: { staggerChildren: 0.12 } } }

export default function OrderConfirmation() {
  const [searchParams] = useSearchParams()
  const orderNum = searchParams.get('order') || ''
  const method = searchParams.get('method') || 'whatsapp'
  const [order, setOrder] = useState(null)

  useEffect(() => {
    window.scrollTo(0, 0)
    if (orderNum) {
      supabase.from('orders').select('*').eq('order_number', orderNum).single()
        .then(({ data }) => { if (data) setOrder(data) })
    }
  }, [orderNum])

  return (
    <div>
      <Navbar />
      <div style={{ minHeight: '100vh', background: '#0A0806', paddingTop: 120, paddingBottom: 80 }}>
        <div className="sbr-page-pad" style={{ padding: '0 60px', maxWidth: 700, margin: '0 auto' }}>
          <motion.div initial="hidden" animate="show" variants={stagger} style={{ textAlign: 'center' }}>

            {/* Success icon */}
            <motion.div variants={fadeUp} style={{ marginBottom: 32 }}>
              <div style={{ width: 100, height: 100, borderRadius: '50%', border: '2px solid #C9A84C', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>
                <CheckCircle size={48} strokeWidth={1} style={{ color: '#C9A84C' }} />
              </div>
            </motion.div>

            <motion.div variants={fadeUp} style={{ fontFamily: 'Cinzel,serif', fontSize: 9, letterSpacing: '0.4em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
              <span style={{ width: 30, height: 1, background: '#C9A84C', display: 'inline-block' }} />
              {method === 'paystack' ? 'Payment Successful' : 'Order Placed'}
              <span style={{ width: 30, height: 1, background: '#C9A84C', display: 'inline-block' }} />
            </motion.div>

            <motion.h1 variants={fadeUp} style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 'clamp(36px,4vw,56px)', fontWeight: 300, color: '#F9F4EC', marginBottom: 12 }}>
              Thank You{order ? `, ${order.customer_name.split(' ')[0]}` : ''}!
            </motion.h1>

            <motion.p variants={fadeUp} style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 18, fontStyle: 'italic', color: '#8A7A5A', marginBottom: 48 }}>
              {method === 'paystack'
                ? 'Your payment has been received. We\'ll start preparing your order.'
                : 'Your order has been submitted. Please complete payment via WhatsApp.'}
            </motion.p>

            {/* Order details card */}
            <motion.div variants={fadeUp} style={{ background: '#111009', border: '1px solid rgba(201,168,76,0.15)', padding: 40, marginBottom: 32, textAlign: 'left' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28, paddingBottom: 20, borderBottom: '1px solid rgba(201,168,76,0.12)' }}>
                <div>
                  <div style={{ fontFamily: 'Cinzel,serif', fontSize: 8, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#8A7A5A', marginBottom: 6 }}>Order Number</div>
                  <div style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 24, fontWeight: 300, color: '#C9A84C' }}>{orderNum}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: 'Cinzel,serif', fontSize: 8, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#8A7A5A', marginBottom: 6 }}>Status</div>
                  <span style={{ fontFamily: 'Cinzel,serif', fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#0A0806', background: method === 'paystack' ? '#4CAF50' : '#C9A84C', padding: '6px 14px', display: 'inline-block' }}>
                    {method === 'paystack' ? 'Paid' : 'Pending Payment'}
                  </span>
                </div>
              </div>

              {order && (
                <>
                  {/* Items */}
                  <div style={{ marginBottom: 24 }}>
                    <div style={{ fontFamily: 'Cinzel,serif', fontSize: 8, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#8A7A5A', marginBottom: 12 }}>Items Ordered</div>
                    {(order.items || []).map((item, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: i < order.items.length - 1 ? '1px solid rgba(201,168,76,0.06)' : 'none' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          {item.image && (
                            <div style={{ width: 40, height: 50, background: '#1A1710', border: '1px solid rgba(201,168,76,0.12)', overflow: 'hidden', flexShrink: 0 }}>
                              <img src={item.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                          )}
                          <div>
                            <div style={{ fontSize: 14, color: '#EDE3D0' }}>{item.name}</div>
                            <div style={{ fontSize: 11, color: '#8A7A5A' }}>Qty: {item.qty}</div>
                          </div>
                        </div>
                        <div style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 16, color: '#C9A84C' }}>
                          ₦{(item.price * item.qty).toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Total */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', paddingTop: 16, borderTop: '1px solid rgba(201,168,76,0.15)' }}>
                    <span style={{ fontFamily: 'Cinzel,serif', fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#EDE3D0' }}>Total</span>
                    <span style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 28, fontWeight: 300, color: '#C9A84C' }}>₦{Number(order.total).toLocaleString()}</span>
                  </div>
                </>
              )}
            </motion.div>

            {/* What's next */}
            <motion.div variants={fadeUp} style={{ background: '#1A1710', border: '1px solid rgba(201,168,76,0.12)', padding: 32, marginBottom: 40, textAlign: 'left' }}>
              <div style={{ fontFamily: 'Cinzel,serif', fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: 20 }}>What Happens Next</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {[
                  ['1', 'We\'ll confirm item availability and reach out via WhatsApp within 24 hours.'],
                  ['2', method === 'paystack' ? 'Your order will be prepared and packaged with care.' : 'Complete your payment via WhatsApp or bank transfer.'],
                  ['3', 'We\'ll arrange delivery to your preferred location in Lagos (or ship nationwide).'],
                ].map(([n, text]) => (
                  <div key={n} style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                    <div style={{ width: 28, height: 28, borderRadius: '50%', border: '1px solid rgba(201,168,76,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Cormorant Garamond,serif', fontSize: 14, color: '#C9A84C', flexShrink: 0 }}>{n}</div>
                    <p style={{ fontSize: 13, color: '#8A7A5A', lineHeight: 1.7, paddingTop: 4 }}>{text}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* CTA buttons */}
            <motion.div variants={fadeUp} style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/collections" style={{ fontFamily: 'Cinzel,serif', fontSize: 10, fontWeight: 500, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#0A0806', background: 'linear-gradient(135deg,#E8C97A,#C9A84C)', padding: '16px 32px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                <ShoppingBag size={14} /> Continue Shopping
              </Link>
              <a href="https://wa.me/" target="_blank" rel="noreferrer"
                style={{ fontFamily: 'Cinzel,serif', fontSize: 10, fontWeight: 500, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#C9A84C', border: '1px solid rgba(201,168,76,0.4)', padding: '16px 32px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8, transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(201,168,76,0.1)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}>
                <MessageCircle size={14} /> Contact on WhatsApp
              </a>
            </motion.div>

          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
