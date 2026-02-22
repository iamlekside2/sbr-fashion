import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function Services() {
  const services = [
    { image: 'https://source.unsplash.com/400x400/?african-lace-dress', title: 'Custom-Made Outfits', desc: 'This is what we do best. Every custom outfit starts with a real conversation — we learn your style, your body, what you love. Then we design it, pick the fabric together, and sew every detail to your exact measurements.', price: 'From ₦80,000', time: '3–6 weeks' },
    { image: 'https://source.unsplash.com/400x400/?west-african-fashion', title: 'Style Advice Session', desc: 'Sit down with Ruth one-on-one. We\'ll go through your wardrobe, figure out what works for you, and create a plan — whether it\'s for a big event, work, or just looking your best every day.', price: 'From ₦25,000', time: '2–3 hours' },
    { image: 'https://source.unsplash.com/400x400/?ankara-fashion', title: 'Ankara & Print Pieces', desc: 'Ready-to-wear ankara and print pieces designed right here in our Lagos studio. Quality fabrics, beautiful designs, and available from XS to 5XL.', price: 'From ₦45,000', time: 'Ready to ship' },
    { image: 'https://source.unsplash.com/400x400/?owambe', title: 'Owambe & Aso-Ebi', desc: 'From wedding outfits to full Aso-Ebi coordination for your squad — we make sure everyone shows up looking amazing. We handle the fabric, the design, and the sewing for any group size.', price: 'From ₦60,000/person', time: '2–4 weeks' },
    { image: 'https://source.unsplash.com/400x400/?african-accessories', title: 'Accessories', desc: 'The finishing touches that bring everything together. Statement jewellery, custom bags, headpieces, and belts — handpicked to match your outfit perfectly.', price: 'From ₦12,000', time: 'In stock' },
  ]

  return (
    <div>
      <Navbar />
      <div style={{ minHeight: '100vh', background: '#0A0806', paddingTop: 120, paddingBottom: 80 }}>
        <div className="sbr-page-pad" style={{ padding: '0 60px' }}>
          <div style={{ textAlign: 'center', marginBottom: 80 }}>
            <div style={{ fontFamily: 'Cinzel,serif', fontSize: 9, letterSpacing: '0.4em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: 16 }}>What We Do</div>
            <h1 style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 'clamp(40px,5vw,64px)', fontWeight: 300, color: '#F9F4EC' }}>
              How We Can <em style={{ fontStyle: 'italic', color: '#C9A84C' }}>Help You</em>
            </h1>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {services.map(sv => (
              <div key={sv.title} className="sbr-service-row" style={{ display: 'grid', gridTemplateColumns: '80px 1fr auto', gap: 40, padding: '48px 0', borderBottom: '1px solid rgba(201,168,76,0.1)', alignItems: 'start' }}>
                <div style={{ width: 64, height: 64, borderRadius: 8, overflow: 'hidden' }}><img src={sv.image} alt={sv.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></div>
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
