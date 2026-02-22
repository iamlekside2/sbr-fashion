import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, ChevronLeft, Sparkles, ShoppingBag } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { supabase } from '../lib/supabase'
import { useCart } from '../context/CartContext'

// Animation variants available for future use

/* ── QUIZ QUESTIONS ── */
const QUESTIONS = [
  {
    id: 'body',
    title: 'What\'s your body shape like?',
    subtitle: 'This helps us find the most flattering styles for you.',
    options: [
      { id: 'hourglass', image: 'https://images.unsplash.com/photo-1753549839764-c7f0b02bd693?w=120&h=120&fit=crop', label: 'Hourglass', desc: 'Balanced bust and hips with a defined waist' },
      { id: 'pear', image: 'https://images.unsplash.com/photo-1568805778734-f0a5a77d7272?w=120&h=120&fit=crop', label: 'Pear', desc: 'Wider hips with a narrower upper body' },
      { id: 'apple', image: 'https://images.unsplash.com/photo-1680878903102-92692799ef36?w=120&h=120&fit=crop', label: 'Apple', desc: 'Fuller midsection with slimmer legs' },
      { id: 'rectangle', image: 'https://images.unsplash.com/photo-1660839244478-5fe816485e1b?w=120&h=120&fit=crop', label: 'Rectangle', desc: 'Similar measurements throughout with less defined waist' },
      { id: 'inverted', image: 'https://images.unsplash.com/photo-1552162864-987ac51d1177?w=120&h=120&fit=crop', label: 'Inverted Triangle', desc: 'Broader shoulders with narrower hips' },
    ]
  },
  {
    id: 'vibe',
    title: 'How would you describe your style?',
    subtitle: 'Pick the one that feels most like you.',
    options: [
      { id: 'classic', image: 'https://images.unsplash.com/photo-1752343943163-0d9e9ae728c5?w=120&h=120&fit=crop', label: 'Classic & Timeless', desc: 'Clean lines, neutral palettes, structured pieces' },
      { id: 'bold', image: 'https://images.unsplash.com/photo-1760907949955-294e28bf058d?w=120&h=120&fit=crop', label: 'Bold & Expressive', desc: 'Statement prints, vivid colours, eye-catching details' },
      { id: 'minimalist', image: 'https://images.unsplash.com/photo-1594435763464-05f0624e04c9?w=120&h=120&fit=crop', label: 'Modern Minimalist', desc: 'Less is more — simple, sleek, and effortless' },
      { id: 'eclectic', image: 'https://images.unsplash.com/photo-1656424692994-736ccef90d8e?w=120&h=120&fit=crop', label: 'Eclectic & Creative', desc: 'Mix of patterns, textures, and unexpected combinations' },
      { id: 'glamorous', image: 'https://images.unsplash.com/photo-1757140448528-332c4fa2a8a6?w=120&h=120&fit=crop', label: 'Glamorous & Luxe', desc: 'Over-the-top sparkle, embellishments, and drama' },
    ]
  },
  {
    id: 'occasion',
    title: 'Where do you dress up for the most?',
    subtitle: 'This helps us recommend pieces that fit your lifestyle.',
    options: [
      { id: 'owambe', image: 'https://images.unsplash.com/photo-1752343809373-0600ccb3bcd2?w=120&h=120&fit=crop', label: 'Owambe & Parties', desc: 'Weddings, birthdays, and social celebrations' },
      { id: 'corporate', image: 'https://images.unsplash.com/photo-1609505848912-b7c3b8b4beda?w=120&h=120&fit=crop', label: 'Corporate & Work', desc: 'Office, meetings, and professional settings' },
      { id: 'church', image: 'https://images.unsplash.com/photo-1601210668663-20c0239bd77d?w=120&h=120&fit=crop', label: 'Church & Spiritual', desc: 'Worship, special services, and religious events' },
      { id: 'casual', image: 'https://images.unsplash.com/photo-1598122666068-59b41e0a3193?w=120&h=120&fit=crop', label: 'Casual & Everyday', desc: 'Brunch, shopping, outings, and travel' },
      { id: 'special', image: 'https://images.unsplash.com/photo-1661332517932-2d441bfb2994?w=120&h=120&fit=crop', label: 'Special Events', desc: 'Galas, red carpet, once-in-a-lifetime moments' },
    ]
  },
  {
    id: 'colour',
    title: 'What colours do you love wearing?',
    subtitle: 'Your colour choices say a lot about your personality!',
    options: [
      { id: 'earth', image: 'https://images.unsplash.com/photo-1552256382-3daa2711d0f6?w=120&h=120&fit=crop', label: 'Earth Tones', desc: 'Browns, greens, terracotta, cream', colors: ['#8B6914','#2D5016','#CD6839','#EDE3D0'] },
      { id: 'jewel', image: 'https://images.unsplash.com/photo-1757140448448-90ed1f18fcbb?w=120&h=120&fit=crop', label: 'Jewel Tones', desc: 'Emerald, sapphire, ruby, amethyst', colors: ['#046307','#1A237E','#9B111E','#6A0DAD'] },
      { id: 'neutral', image: 'https://images.unsplash.com/photo-1594435763464-05f0624e04c9?w=120&h=120&fit=crop', label: 'Neutrals', desc: 'Black, white, grey, beige, navy', colors: ['#1A1710','#F9F4EC','#666','#0A2647'] },
      { id: 'bright', image: 'https://images.unsplash.com/photo-1760907949955-294e28bf058d?w=120&h=120&fit=crop', label: 'Bright & Vibrant', desc: 'Yellow, coral, fuchsia, electric blue', colors: ['#FFD700','#FF6B6B','#FF1493','#00BFFF'] },
      { id: 'pastel', image: 'https://images.unsplash.com/photo-1656424692994-736ccef90d8e?w=120&h=120&fit=crop', label: 'Pastels & Soft', desc: 'Blush, lavender, mint, powder blue', colors: ['#FFB6C1','#DDA0DD','#98FB98','#B0E0E6'] },
    ]
  },
  {
    id: 'fabric',
    title: 'What fabric makes you feel your best?',
    subtitle: 'The right fabric changes everything — trust us on this one!',
    options: [
      { id: 'ankara', image: 'https://images.unsplash.com/photo-1680878903102-92692799ef36?w=120&h=120&fit=crop', label: 'Ankara / African Print', desc: 'Bold, cultural, and statement-making' },
      { id: 'lace', image: 'https://images.unsplash.com/photo-1753549839764-c7f0b02bd693?w=120&h=120&fit=crop', label: 'Lace & Embroidery', desc: 'Delicate, feminine, and detailed' },
      { id: 'silk', image: 'https://images.unsplash.com/photo-1609505848912-b7c3b8b4beda?w=120&h=120&fit=crop', label: 'Silk & Satin', desc: 'Flowing, luxurious, and glamorous' },
      { id: 'cotton', image: 'https://images.unsplash.com/photo-1552162864-987ac51d1177?w=120&h=120&fit=crop', label: 'Cotton & Linen', desc: 'Comfortable, breathable, and natural' },
      { id: 'aso-oke', image: 'https://images.unsplash.com/photo-1752343943163-0d9e9ae728c5?w=120&h=120&fit=crop', label: 'Aso-Oke & Traditional', desc: 'Heritage woven fabrics with prestige' },
    ]
  },
]

/* ── STYLE PROFILES ── */
const PROFILES = {
  'The Regal Matriarch': {
    match: (a) => a.vibe === 'classic' && (a.fabric === 'aso-oke' || a.fabric === 'lace'),
    image: 'https://images.unsplash.com/photo-1752343943163-0d9e9ae728c5?w=200&h=200&fit=crop', description: 'You carry yourself with timeless elegance and cultural pride. Your style commands respect — traditional silhouettes in premium fabrics, masterfully tailored. Absolute queen energy!',
    categories: ['bespoke', 'aso-ebi'],
    tips: ['Invest in quality aso-oke pieces — they never go out of style', 'A well-tailored iro and buba set is your ultimate power outfit', 'Layer with a statement gele and elegant accessories to complete the look'],
  },
  'The Modern Diva': {
    match: (a) => a.vibe === 'bold' || a.vibe === 'glamorous',
    image: 'https://images.unsplash.com/photo-1680878903102-92692799ef36?w=200&h=200&fit=crop', description: 'You live for the spotlight! Your fashion choices are fearless, dramatic, and always memorable. You know how to make an entrance and own every room.',
    categories: ['ready-to-wear', 'ankara', 'accessories'],
    tips: ['Don\'t be afraid of mixing prints and textures — go bold!', 'Statement earrings and bold clutches complete your look perfectly', 'Try our custom-made service for one-of-a-kind event outfits'],
  },
  'The Effortless Professional': {
    match: (a) => a.occasion === 'corporate' || a.vibe === 'minimalist',
    image: 'https://images.unsplash.com/photo-1568805778734-f0a5a77d7272?w=200&h=200&fit=crop', description: 'You believe in the power of simplicity. Every piece in your wardrobe is intentional, versatile, and quietly luxurious. You don\'t need to shout — your style speaks for you.',
    categories: ['ready-to-wear', 'bespoke'],
    tips: ['Build a capsule wardrobe of tailored ankara basics — game changer!', 'Neutral tones with one statement piece always creates impact', 'Structured blazers and pencil skirts are your go-to foundation'],
  },
  'The Creative Spirit': {
    match: (a) => a.vibe === 'eclectic' || a.colour === 'bright',
    image: 'https://images.unsplash.com/photo-1552162864-987ac51d1177?w=200&h=200&fit=crop', description: 'You see fashion as self-expression. You mix cultures, eras, and styles with effortless confidence — your looks are always uniquely, beautifully you.',
    categories: ['ankara', 'accessories', 'ready-to-wear'],
    tips: ['Mix ankara with denim or leather for unexpected combos — trust me, it works!', 'Our custom design service lets your imagination run free', 'Layer accessories from different collections for a look that\'s all you'],
  },
  'The Celebration Queen': {
    match: (a) => a.occasion === 'owambe' || a.occasion === 'special',
    image: 'https://images.unsplash.com/photo-1752343809373-0600ccb3bcd2?w=200&h=200&fit=crop', description: 'You dress for joy! Every outfit is a celebration of life, culture, and the moments that matter most. You\'re the life of every party and everyone knows it!',
    categories: ['aso-ebi', 'ankara', 'bespoke'],
    tips: ['Pre-plan your outfits for upcoming events — you\'ll always be ready', 'Our aso-ebi coordination service handles group orders so you don\'t have to stress', 'Have 2-3 custom-made pieces on rotation for events — you\'ll never repeat an outfit'],
  },
  'The African Heritage Queen': {
    match: () => true, // fallback
    image: 'https://images.unsplash.com/photo-1760907949955-294e28bf058d?w=200&h=200&fit=crop', description: 'You honour your roots while embracing modern fashion. Your wardrobe reflects the beauty and richness of African culture with your own personal flair.',
    categories: ['ankara', 'bespoke', 'aso-ebi'],
    tips: ['Explore different African fabrics beyond ankara — there\'s a whole world out there!', 'A custom-made piece for each season keeps your wardrobe fresh and exciting', 'Mix traditional and contemporary elements to create your own signature look'],
  },
}

const getProfile = (answers) => {
  for (const [name, profile] of Object.entries(PROFILES)) {
    if (profile.match(answers)) return { name, ...profile }
  }
  return { name: 'The African Heritage Queen', ...PROFILES['The African Heritage Queen'] }
}

const btn = {
  fontFamily: 'Cinzel,serif', fontSize: 9, letterSpacing: '0.2em',
  textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.3s',
}

export default function StyleQuiz() {
  const [step, setStep] = useState(-1) // -1 = intro
  const [answers, setAnswers] = useState({})
  const [profile, setProfile] = useState(null)
  const [products, setProducts] = useState([])
  const { addItem } = useCart()

  useEffect(() => { window.scrollTo(0, 0) }, [])

  const selectAnswer = (questionId, optionId) => {
    setAnswers(p => ({ ...p, [questionId]: optionId }))
    // Auto-advance after a short delay
    setTimeout(() => {
      if (step < QUESTIONS.length - 1) {
        setStep(s => s + 1)
        window.scrollTo({ top: 200, behavior: 'smooth' })
      }
    }, 400)
  }

  const finishQuiz = async () => {
    const p = getProfile(answers)
    setProfile(p)
    setStep(QUESTIONS.length) // results step
    window.scrollTo({ top: 0, behavior: 'smooth' })

    // Fetch recommended products
    const { data } = await supabase
      .from('products')
      .select('*')
      .in('category', p.categories)
      .eq('in_stock', true)
      .order('featured', { ascending: false })
      .limit(8)
    setProducts(data || [])
  }

  const restart = () => {
    setStep(-1)
    setAnswers({})
    setProfile(null)
    setProducts([])
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const labelStyle = { fontFamily: 'Cinzel,serif', fontSize: 9, letterSpacing: '0.4em', textTransform: 'uppercase', color: '#C9A84C' }
  const q = QUESTIONS[step]

  return (
    <div>
      <Navbar />
      <div style={{ minHeight: '100vh', background: '#0A0806', paddingTop: 120, paddingBottom: 80 }}>
        <div className="sbr-page-pad" style={{ padding: '0 60px', maxWidth: 900, margin: '0 auto' }}>

          <AnimatePresence mode="wait">

            {/* ── INTRO ── */}
            {step === -1 && (
              <motion.div key="intro" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                style={{ textAlign: 'center', paddingTop: 40 }}>
                <Sparkles size={60} color="#C9A84C" style={{ marginBottom: 20, opacity: 0.7 }} />
                <div style={labelStyle}>Discover Your Style</div>
                <h1 style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 'clamp(36px,5vw,56px)', fontWeight: 300, color: '#F9F4EC', margin: '16px 0 16px' }}>
                  Style <em style={{ fontStyle: 'italic', color: '#C9A84C' }}>Quiz</em>
                </h1>
                <p style={{ fontSize: 15, color: '#8A7A5A', maxWidth: 500, margin: '0 auto 40px', lineHeight: 1.8 }}>
                  Answer 5 quick questions and discover your unique fashion personality. We'll pick out pieces that match your style perfectly!
                </p>
                <button onClick={() => setStep(0)}
                  style={{
                    ...btn, background: 'linear-gradient(135deg, #C9A84C, #8B6914)',
                    border: 'none', color: '#0A0806', padding: '16px 40px',
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                  }}>
                  <Sparkles size={14} /> Take the Quiz
                </button>
                <p style={{ fontSize: 11, color: '#8A7A5A', marginTop: 16 }}>Takes about 1 minute</p>
              </motion.div>
            )}

            {/* ── QUESTIONS ── */}
            {step >= 0 && step < QUESTIONS.length && (
              <motion.div key={`q-${step}`} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>

                {/* Progress bar */}
                <div style={{ marginBottom: 40 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ fontSize: 11, color: '#8A7A5A' }}>Question {step + 1} of {QUESTIONS.length}</span>
                    <span style={{ fontSize: 11, color: '#C9A84C' }}>{Math.round(((step + 1) / QUESTIONS.length) * 100)}%</span>
                  </div>
                  <div style={{ height: 2, background: 'rgba(201,168,76,0.15)', position: 'relative' }}>
                    <motion.div
                      initial={{ width: `${(step / QUESTIONS.length) * 100}%` }}
                      animate={{ width: `${((step + 1) / QUESTIONS.length) * 100}%` }}
                      style={{ height: '100%', background: 'linear-gradient(90deg, #C9A84C, #E8C97A)', position: 'absolute', top: 0, left: 0 }}
                    />
                  </div>
                </div>

                <div style={{ textAlign: 'center', marginBottom: 36 }}>
                  <h2 style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 28, fontWeight: 300, color: '#F9F4EC', marginBottom: 8 }}>{q.title}</h2>
                  <p style={{ fontSize: 13, color: '#8A7A5A' }}>{q.subtitle}</p>
                </div>

                <div className="sbr-quiz-options" style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 600, margin: '0 auto' }}>
                  {q.options.map(opt => {
                    const selected = answers[q.id] === opt.id
                    return (
                      <motion.button key={opt.id}
                        whileHover={{ x: 4 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => selectAnswer(q.id, opt.id)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 16, padding: '20px 24px',
                          background: selected ? 'rgba(201,168,76,0.1)' : '#111009',
                          border: `1px solid ${selected ? '#C9A84C' : 'rgba(201,168,76,0.12)'}`,
                          cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s',
                        }}>
                        <div style={{ width: 44, height: 44, borderRadius: 8, overflow: 'hidden', flexShrink: 0 }}>
                          <img src={opt.image} alt={opt.label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 15, fontWeight: 400, color: selected ? '#C9A84C' : '#F9F4EC', marginBottom: 2 }}>{opt.label}</div>
                          <div style={{ fontSize: 12, color: '#8A7A5A', lineHeight: 1.5 }}>{opt.desc}</div>
                        </div>
                        {opt.colors && (
                          <div style={{ display: 'flex', gap: 3 }}>
                            {opt.colors.map((c, i) => (
                              <div key={i} style={{ width: 16, height: 16, borderRadius: '50%', background: c, border: '1px solid rgba(255,255,255,0.1)' }} />
                            ))}
                          </div>
                        )}
                        {selected && <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#C9A84C', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <span style={{ color: '#0A0806', fontSize: 12, fontWeight: 600 }}>✓</span>
                        </div>}
                      </motion.button>
                    )
                  })}
                </div>

                {/* Nav buttons */}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 36, maxWidth: 600, margin: '36px auto 0' }}>
                  <button onClick={() => setStep(s => s - 1)}
                    style={{ ...btn, background: 'none', border: '1px solid rgba(201,168,76,0.2)', color: '#C9A84C', padding: '12px 24px', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <ChevronLeft size={14} /> Back
                  </button>
                  {step === QUESTIONS.length - 1 && answers[q.id] ? (
                    <button onClick={finishQuiz}
                      style={{ ...btn, background: 'linear-gradient(135deg, #C9A84C, #8B6914)', border: 'none', color: '#0A0806', padding: '12px 28px', display: 'flex', alignItems: 'center', gap: 6 }}>
                      See My Results <Sparkles size={14} />
                    </button>
                  ) : answers[q.id] ? (
                    <button onClick={() => setStep(s => s + 1)}
                      style={{ ...btn, background: 'linear-gradient(135deg, #C9A84C, #8B6914)', border: 'none', color: '#0A0806', padding: '12px 24px', display: 'flex', alignItems: 'center', gap: 6 }}>
                      Next <ChevronRight size={14} />
                    </button>
                  ) : <div />}
                </div>
              </motion.div>
            )}

            {/* ── RESULTS ── */}
            {step === QUESTIONS.length && profile && (
              <motion.div key="results" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>

                {/* Profile reveal */}
                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1, transition: { delay: 0.2 } }}
                  style={{ textAlign: 'center', marginBottom: 48, paddingTop: 20 }}>
                  <div style={{ width: 100, height: 100, borderRadius: '50%', overflow: 'hidden', margin: '0 auto 16px', border: '2px solid rgba(201,168,76,0.3)' }}>
                    <img src={profile.image} alt={profile.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div style={labelStyle}>Your Style Profile</div>
                  <h2 style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 'clamp(32px,4vw,48px)', fontWeight: 300, color: '#F9F4EC', margin: '12px 0 16px' }}>
                    {profile.name}
                  </h2>
                  <p style={{ fontSize: 15, color: '#EDE3D0', maxWidth: 520, margin: '0 auto', lineHeight: 1.8 }}>
                    {profile.description}
                  </p>
                </motion.div>

                {/* Style tips */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.4 } }}
                  style={{
                    background: 'linear-gradient(135deg, rgba(201,168,76,0.08) 0%, rgba(201,168,76,0.02) 100%)',
                    border: '1px solid rgba(201,168,76,0.2)', padding: '28px 32px', marginBottom: 48,
                  }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                    <Sparkles size={18} color="#C9A84C" />
                    <span style={labelStyle}>Ruth's Tips for You</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {profile.tips.map((tip, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                        <span style={{ color: '#C9A84C', fontSize: 14, marginTop: 2, flexShrink: 0 }}>✦</span>
                        <p style={{ fontSize: 14, color: '#EDE3D0', lineHeight: 1.7, margin: 0 }}>{tip}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Recommended products */}
                {products.length > 0 && (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.6 } }}>
                    <div style={{ ...labelStyle, marginBottom: 24 }}>Handpicked for You</div>
                    <div className="sbr-quiz-products" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16, marginBottom: 48 }}>
                      {products.map(p => (
                        <div key={p.id} style={{ background: '#111009', border: '1px solid rgba(201,168,76,0.1)', overflow: 'hidden' }}>
                          <Link to={`/collections/${p.id}`} style={{ textDecoration: 'none' }}>
                            <div style={{ aspectRatio: '3/4', overflow: 'hidden', background: '#1A1710' }}>
                              {p.images?.[0] ? (
                                <img src={p.images[0]} alt={p.name}
                                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }}
                                  onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                                  onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'} />
                              ) : (
                                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8A7A5A', fontSize: 11 }}>No Image</div>
                              )}
                            </div>
                          </Link>
                          <div style={{ padding: '14px 16px 18px' }}>
                            <Link to={`/collections/${p.id}`} style={{ textDecoration: 'none' }}>
                              <div style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 16, color: '#F9F4EC', marginBottom: 4, lineHeight: 1.3 }}>{p.name}</div>
                            </Link>
                            <div style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 17, color: '#C9A84C', marginBottom: 12 }}>₦{Number(p.price).toLocaleString()}</div>
                            <button onClick={() => addItem(p)}
                              style={{ ...btn, width: '100%', background: 'transparent', border: '1px solid rgba(201,168,76,0.3)', color: '#C9A84C', padding: '10px 14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
                              onMouseEnter={e => { e.currentTarget.style.background = '#C9A84C'; e.currentTarget.style.color = '#0A0806' }}
                              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#C9A84C' }}>
                              <ShoppingBag size={12} /> Add to Cart
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* CTAs */}
                <div className="sbr-quiz-ctas" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                  <button onClick={restart}
                    style={{ ...btn, background: 'transparent', border: '1px solid rgba(201,168,76,0.3)', color: '#C9A84C', padding: '16px 20px' }}>
                    Retake Quiz
                  </button>
                  <Link to="/collections" style={{ ...btn, background: 'linear-gradient(135deg, #C9A84C, #8B6914)', border: 'none', color: '#0A0806', padding: '16px 20px', textDecoration: 'none', textAlign: 'center' }}>
                    Browse Collections
                  </Link>
                  <Link to="/bespoke" style={{ ...btn, background: 'transparent', border: '1px solid rgba(201,168,76,0.3)', color: '#C9A84C', padding: '16px 20px', textDecoration: 'none', textAlign: 'center' }}>
                    Design Custom Piece
                  </Link>
                </div>

              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <Footer />
    </div>
  )
}
