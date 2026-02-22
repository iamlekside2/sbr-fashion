import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Crown, Star, Gift, Gem, Sparkles, ChevronRight, Check, ArrowRight } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
}
const stagger = { show: { transition: { staggerChildren: 0.12 } } }

const TIERS = [
  {
    id: 'bronze', icon: Star, label: 'Bronze', emoji: '🌟',
    threshold: '₦0 - ₦99,999', colour: '#CD7F32',
    perks: ['A welcome gift with your first order', '5% off your second purchase', 'Early access to new collections', 'Birthday treat (10% off!)'],
  },
  {
    id: 'silver', icon: Sparkles, label: 'Silver', emoji: '✨',
    threshold: '₦100,000 - ₦299,999', colour: '#C0C0C0',
    perks: ['All Bronze perks', '10% off all orders', 'Priority booking when you chat with us', 'Free basic alterations', 'Exclusive seasonal previews'],
  },
  {
    id: 'gold', icon: Crown, label: 'Gold', emoji: '👑',
    threshold: '₦300,000 - ₦599,999', colour: '#C9A84C',
    perks: ['All Silver perks', '15% off all orders', 'Free styling chat with Ruth', 'Free delivery within Lagos', 'VIP event invitations', 'Anniversary gift from us to you'],
  },
  {
    id: 'platinum', icon: Gem, label: 'Platinum', emoji: '💎',
    threshold: '₦600,000+', colour: '#E5E4E2',
    perks: ['All Gold perks', '20% off all orders', 'Your own personal stylist', 'Free delivery nationwide', 'First access to limited editions', 'A complimentary outfit every year!', 'Private shopping experience'],
  },
]

const HOW_IT_WORKS = [
  { step: '01', title: 'Shop & Earn', desc: 'Every Naira you spend earns you points. The more you shop, the faster you level up!' },
  { step: '02', title: 'Unlock Perks', desc: 'As you reach new tiers, your benefits kick in automatically. No stress, no wahala.' },
  { step: '03', title: 'Redeem Rewards', desc: 'Use your points for discounts, free accessories, or complimentary services. It\'s all yours!' },
  { step: '04', title: 'Stay Royal', desc: 'Keep your tier with annual spending. We always celebrate our loyal family members.' },
]

const btn = { fontFamily: 'Cinzel,serif', fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.3s' }
const inp = {
  width: '100%', padding: '14px 18px', background: '#111009',
  border: '1px solid rgba(201,168,76,0.2)', color: '#F9F4EC',
  fontFamily: 'Jost,sans-serif', fontSize: 14, outline: 'none',
}
const labelStyle = { fontFamily: 'Cinzel,serif', fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: 8, display: 'block' }

export default function LoyaltyProgramme() {
  const [showJoin, setShowJoin] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', whatsapp: '' })
  const [sending, setSending] = useState(false)
  const [, setContact] = useState({})

  useEffect(() => { window.scrollTo(0, 0) }, [])

  useEffect(() => {
    supabase.from('site_content').select('*').then(({ data }) => {
      if (data) { const m = {}; data.forEach(d => { m[d.key] = d.value }); setContact(m) }
    })
  }, [])

  const joinProgramme = async () => {
    if (!form.name || !form.whatsapp) {
      toast.error('Please enter your name and WhatsApp number')
      return
    }
    setSending(true)
    try {
      const { error } = await supabase.from('messages').insert([{
        name: form.name,
        email: form.email || '',
        whatsapp: form.whatsapp,
        subject: 'Loyalty Programme Registration',
        message: `New loyalty programme registration:\nName: ${form.name}\nEmail: ${form.email}\nWhatsApp: ${form.whatsapp}`,
      }])
      if (error) throw error
      toast.success('Welcome to the SBR Loyalty Programme! 🎉')
      setShowJoin(false)
      setForm({ name: '', email: '', whatsapp: '' })
    } catch (err) {
      toast.error('Failed to register. Please try again.')
    }
    setSending(false)
  }

  return (
    <div>
      <Navbar />
      <div style={{ minHeight: '100vh', background: '#0A0806', paddingTop: 120, paddingBottom: 80 }}>
        <div className="sbr-page-pad" style={{ padding: '0 60px', maxWidth: 1100, margin: '0 auto' }}>

          {/* ── HERO ── */}
          <motion.div initial="hidden" animate="show" variants={stagger}
            style={{ textAlign: 'center', marginBottom: 80 }}>
            <motion.div variants={fadeUp} style={{ fontSize: 48, marginBottom: 12 }}>👑</motion.div>
            <motion.div variants={fadeUp} style={{ fontFamily: 'Cinzel,serif', fontSize: 9, letterSpacing: '0.4em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: 16 }}>
              Exclusive Rewards
            </motion.div>
            <motion.h1 variants={fadeUp} style={{
              fontFamily: 'Cormorant Garamond,serif', fontSize: 'clamp(36px,5vw,60px)',
              fontWeight: 300, color: '#F9F4EC', margin: '0 0 16px',
            }}>
              The SBR <em style={{ fontStyle: 'italic', color: '#C9A84C' }}>Loyalty</em> Programme
            </motion.h1>
            <motion.p variants={fadeUp} style={{ fontSize: 16, color: '#8A7A5A', maxWidth: 560, margin: '0 auto 32px', lineHeight: 1.9 }}>
              Because our favourite people deserve more than beautiful clothes — you deserve beautiful experiences too. Earn rewards every time you shop with us!
            </motion.p>
            <motion.button variants={fadeUp} onClick={() => setShowJoin(true)}
              style={{ ...btn, background: 'linear-gradient(135deg, #C9A84C, #8B6914)', border: 'none', color: '#0A0806', padding: '16px 40px', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <Crown size={14} /> Join Now — It's Free
            </motion.button>
          </motion.div>

          {/* ── TIERS ── */}
          <div style={{ marginBottom: 80 }}>
            <div style={{ textAlign: 'center', marginBottom: 40 }}>
              <div style={labelStyle}>Membership Tiers</div>
              <h2 style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 32, fontWeight: 300, color: '#F9F4EC' }}>
                Rise Through the Ranks
              </h2>
            </div>

            <motion.div variants={stagger} initial="hidden" animate="show"
              className="sbr-loyalty-tiers"
              style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
              {TIERS.map((tier) => {
                const Icon = tier.icon
                return (
                  <motion.div key={tier.id} variants={fadeUp}
                    style={{
                      background: '#111009', border: '1px solid rgba(201,168,76,0.12)',
                      padding: '32px 24px', position: 'relative', overflow: 'hidden',
                      transition: 'border-color 0.3s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = `${tier.colour}50`}
                    onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(201,168,76,0.12)'}>
                    {/* Tier glow */}
                    <div style={{ position: 'absolute', top: -30, right: -30, width: 80, height: 80, borderRadius: '50%', background: `${tier.colour}10`, filter: 'blur(20px)' }} />

                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                      <div style={{
                        width: 40, height: 40, borderRadius: '50%',
                        background: `${tier.colour}15`, border: `1px solid ${tier.colour}30`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <Icon size={18} color={tier.colour} />
                      </div>
                      <div>
                        <div style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 22, color: tier.colour, fontWeight: 400 }}>{tier.label}</div>
                      </div>
                    </div>

                    <div style={{ fontFamily: 'Cinzel,serif', fontSize: 8, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#8A7A5A', marginBottom: 20 }}>
                      {tier.threshold}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {tier.perks.map((perk, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                          <Check size={12} color={tier.colour} style={{ marginTop: 3, flexShrink: 0 }} />
                          <span style={{ fontSize: 12, color: '#EDE3D0', lineHeight: 1.5 }}>{perk}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )
              })}
            </motion.div>
          </div>

          {/* ── HOW IT WORKS ── */}
          <div style={{ marginBottom: 80 }}>
            <div style={{ textAlign: 'center', marginBottom: 40 }}>
              <div style={labelStyle}>Simple & Rewarding</div>
              <h2 style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 32, fontWeight: 300, color: '#F9F4EC' }}>
                How It Works
              </h2>
            </div>

            <div className="sbr-loyalty-steps" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}>
              {HOW_IT_WORKS.map((item, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0, transition: { delay: i * 0.15 } }}
                  style={{ textAlign: 'center' }}>
                  <div style={{
                    fontFamily: 'Cormorant Garamond,serif', fontSize: 48, fontWeight: 200,
                    color: 'rgba(201,168,76,0.2)', marginBottom: 12,
                  }}>
                    {item.step}
                  </div>
                  <div style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 20, color: '#F9F4EC', marginBottom: 8 }}>{item.title}</div>
                  <p style={{ fontSize: 13, color: '#8A7A5A', lineHeight: 1.7 }}>{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* ── FAQ ── */}
          <div style={{ marginBottom: 60 }}>
            <div style={{ textAlign: 'center', marginBottom: 32 }}>
              <div style={labelStyle}>Common Questions</div>
            </div>
            <div style={{ maxWidth: 700, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 2 }}>
              {[
                ['Is the loyalty programme free?', 'Yes o! Totally free to join. You start earning from your very first purchase with us.'],
                ['How are points calculated?', 'You earn 1 point for every ₦100 spent. We track everything through your WhatsApp number — nice and easy.'],
                ['Do points expire?', 'Points are valid for 12 months from when you earned them. We review tier status once a year.'],
                ['Can I combine loyalty discounts with other offers?', 'Yes! You can stack your loyalty discount with seasonal promos. Just not with other coupon codes.'],
                ['How do I check my tier status?', 'Just send us a message on WhatsApp and we\'ll share your current points and tier status right away.'],
              ].map(([q, a], i) => (
                <details key={i} style={{ background: '#111009', border: '1px solid rgba(201,168,76,0.08)', padding: '0 24px' }}>
                  <summary style={{
                    padding: '18px 0', cursor: 'pointer', fontSize: 14, color: '#EDE3D0',
                    listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  }}>
                    {q}
                    <ChevronRight size={14} color="#C9A84C" style={{ transition: 'transform 0.2s' }} />
                  </summary>
                  <p style={{ fontSize: 13, color: '#8A7A5A', lineHeight: 1.8, paddingBottom: 18 }}>{a}</p>
                </details>
              ))}
            </div>
          </div>

          {/* ── BOTTOM CTA ── */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(201,168,76,0.08), rgba(201,168,76,0.02))',
            border: '1px solid rgba(201,168,76,0.2)', padding: '48px 40px', textAlign: 'center',
          }}>
            <Gift size={32} color="#C9A84C" style={{ marginBottom: 16 }} />
            <h3 style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 28, fontWeight: 300, color: '#F9F4EC', marginBottom: 12 }}>
              Ready to Start Earning?
            </h3>
            <p style={{ fontSize: 14, color: '#8A7A5A', marginBottom: 28, maxWidth: 400, margin: '0 auto 28px' }}>
              Join our growing family of SBR clients who enjoy exclusive rewards with every purchase.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button onClick={() => setShowJoin(true)}
                style={{ ...btn, background: 'linear-gradient(135deg, #C9A84C, #8B6914)', border: 'none', color: '#0A0806', padding: '14px 32px', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Crown size={14} /> Join the Programme
              </button>
              <Link to="/collections"
                style={{ ...btn, background: 'transparent', border: '1px solid rgba(201,168,76,0.3)', color: '#C9A84C', padding: '14px 32px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
                Start Shopping <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── JOIN MODAL ── */}
      {showJoin && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 600, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          onClick={() => setShowJoin(false)}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)' }} />
          <div onClick={e => e.stopPropagation()}
            style={{ position: 'relative', background: '#111009', border: '1px solid rgba(201,168,76,0.2)', width: '90%', maxWidth: 440, padding: 36 }}>
            <button onClick={() => setShowJoin(false)} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', color: '#8A7A5A', cursor: 'pointer', fontSize: 20 }}>×</button>

            <div style={{ textAlign: 'center', marginBottom: 28 }}>
              <Crown size={28} color="#C9A84C" style={{ marginBottom: 12 }} />
              <div style={labelStyle}>Join the Programme</div>
              <h3 style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 24, fontWeight: 300, color: '#F9F4EC' }}>Welcome to the SBR Family</h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 24 }}>
              <div>
                <label style={labelStyle}>Your Name *</label>
                <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  placeholder="Full name" style={inp}
                  onFocus={e => e.target.style.borderColor = 'rgba(201,168,76,0.5)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(201,168,76,0.2)'} />
              </div>
              <div>
                <label style={labelStyle}>Email</label>
                <input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                  placeholder="your@email.com" style={inp}
                  onFocus={e => e.target.style.borderColor = 'rgba(201,168,76,0.5)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(201,168,76,0.2)'} />
              </div>
              <div>
                <label style={labelStyle}>WhatsApp Number *</label>
                <input value={form.whatsapp} onChange={e => setForm(p => ({ ...p, whatsapp: e.target.value }))}
                  placeholder="+234 801 234 5678" style={inp}
                  onFocus={e => e.target.style.borderColor = 'rgba(201,168,76,0.5)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(201,168,76,0.2)'} />
              </div>
            </div>

            <button onClick={joinProgramme} disabled={sending}
              style={{ ...btn, width: '100%', background: 'linear-gradient(135deg, #C9A84C, #8B6914)', border: 'none', color: '#0A0806', padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              {sending ? 'Registering...' : <><Crown size={14} /> Join Now</>}
            </button>

            <p style={{ fontSize: 10, color: '#8A7A5A', textAlign: 'center', marginTop: 14, lineHeight: 1.6 }}>
              By joining, you'll receive exclusive offers via WhatsApp. You start at Bronze tier and earn your way up!
            </p>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}
