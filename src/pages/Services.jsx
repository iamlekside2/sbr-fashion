import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function Services() {
  const services = [
    { emoji: '✂️', title: 'Bespoke Tailoring', desc: 'The pinnacle of our craft. Every bespoke piece begins with an in-depth consultation where we learn your lifestyle, aesthetic preferences, and the occasion you\'re dressing for. We then create a unique design, select your fabric together, and hand-craft every detail to your exact measurements.', price: 'From ₦80,000', time: '3–6 weeks' },
    { emoji: '🎨', title: 'Styling Consultation', desc: 'A private session with Ruth herself. We\'ll analyze your wardrobe, understand your style identity, and create a plan to build a wardrobe that works for your life — whether you\'re preparing for a big event, a career change, or simply wanting to look your best every day.', price: 'From ₦25,000', time: '2–3 hours' },
    { emoji: '🌺', title: 'Ankara & African Print', desc: 'Our ready-to-wear collection of meticulously crafted Ankara and African print pieces. Each garment is designed in-house, crafted from premium fabric, and available in limited quantities. Sizes range from XS to 5XL.', price: 'From ₦45,000', time: 'Ready to ship' },
    { emoji: '💫', title: 'Occasion & Aso-Ebi', desc: 'From bridal fittings to entire family Aso-Ebi coordination, we make sure everyone looks extraordinary on your most important days. We handle fabric sourcing, uniform design, and coordinated tailoring for groups of all sizes.', price: 'From ₦60,000/person', time: '2–4 weeks' },
    { emoji: '💍', title: 'Accessories', desc: 'Hand-selected and custom-designed accessories that complete the look. From statement jewellery to custom bags, headpieces, and belts — every accessory is chosen to complement African fashion beautifully.', price: 'From ₦12,000', time: 'In stock' },
  ]

  return (
    <div>
      <Navbar />
      <div style={{ minHeight: '100vh', background: '#0A0806', paddingTop: 120, paddingBottom: 80 }}>
        <div className="sbr-page-pad" style={{ padding: '0 60px' }}>
          <div style={{ textAlign: 'center', marginBottom: 80 }}>
            <div style={{ fontFamily: 'Cinzel,serif', fontSize: 9, letterSpacing: '0.4em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: 16 }}>What We Offer</div>
            <h1 style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 'clamp(40px,5vw,64px)', fontWeight: 300, color: '#F9F4EC' }}>
              Services <em style={{ fontStyle: 'italic', color: '#C9A84C' }}>Built for You</em>
            </h1>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {services.map(sv => (
              <div key={sv.title} className="sbr-service-row" style={{ display: 'grid', gridTemplateColumns: '80px 1fr auto', gap: 40, padding: '48px 0', borderBottom: '1px solid rgba(201,168,76,0.1)', alignItems: 'start' }}>
                <div style={{ fontSize: 40 }}>{sv.emoji}</div>
                <div>
                  <div style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 28, fontWeight: 400, color: '#F9F4EC', marginBottom: 12 }}>{sv.title}</div>
                  <p style={{ fontSize: 14, color: '#8A7A5A', lineHeight: 1.9, maxWidth: 600 }}>{sv.desc}</p>
                </div>
                <div className="sbr-service-meta" style={{ textAlign: 'right', minWidth: 160 }}>
                  <div style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 22, fontWeight: 300, color: '#C9A84C', marginBottom: 4 }}>{sv.price}</div>
                  <div style={{ fontSize: 11, color: '#8A7A5A', marginBottom: 20 }}>{sv.time}</div>
                  <a href="/book" style={{ fontFamily: 'Cinzel,serif', fontSize: 8, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#0A0806', background: '#C9A84C', padding: '10px 20px', textDecoration: 'none', display: 'inline-block' }}>
                    Book Now
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
