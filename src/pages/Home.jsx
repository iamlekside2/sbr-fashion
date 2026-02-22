import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingBag, Sparkles, Palette, Shirt, Scissors, Users, Crown } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { supabase } from "../lib/supabase";
import { useCart } from "../context/CartContext";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
};
const stagger = { show: { transition: { staggerChildren: 0.12 } } };

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [featuredLoading, setFeaturedLoading] = useState(true);
  const [testimonialsLoading, setTestimonialsLoading] = useState(true);
  const [aboutPhoto, setAboutPhoto] = useState(null);
  const { addItem } = useCart();

  useEffect(() => {
    // Fetch featured products
    supabase
      .from("products")
      .select("*")
      .eq("featured", true)
      .eq("in_stock", true)
      .order("created_at", { ascending: false })
      .limit(8)
      .then(({ data }) => {
        if (data) setFeatured(data);
        setFeaturedLoading(false);
      });

    // Fetch about photo
    supabase
      .from("site_content")
      .select("value")
      .eq("key", "about_photo")
      .single()
      .then(({ data }) => {
        if (data && data.value) setAboutPhoto(data.value);
      });

    // Fetch testimonials from database
    supabase
      .from("testimonials")
      .select("*")
      .eq("published", true)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (data && data.length > 0) setTestimonials(data);
        else {
          // Fallback testimonials if none in DB yet
          setTestimonials([
            { id: 1, text: "Ruth understood exactly what I wanted for my trad wedding. The dress was even better than what I imagined!", name: "Adaeze Okonkwo", client_title: "Bride · Lagos", initials: "A" },
            { id: 2, text: "I've been getting my work outfits from SBR for two years now. The quality, the way it fits — nothing else compares.", name: "Folake Adeyemi", client_title: "Corporate Executive · Abuja", initials: "F" },
            { id: 3, text: "The Ankara set she made for my daughter's naming ceremony? Everyone was asking for her number! SBR never disappoints.", name: "Chidinma Eze", client_title: "Client · Port Harcourt", initials: "C" },
          ]);
        }
        setTestimonialsLoading(false);
      });
  }, []);

  // Fallback category cards shown when no featured products exist yet
  const collections = [
    { image: "https://images.unsplash.com/photo-1680878903102-92692799ef36?w=800&h=600&fit=crop", name: "Ankara Ready-to-Wear", cat: "Signature Line", count: "From ₦45,000", pattern: "repeating-conic-gradient(#C9A84C22 0% 25%, transparent 0% 50%)", bg: "linear-gradient(135deg,#1A0F00,#2A1800)", href: "/collections?cat=ankara" },
    { image: "https://images.unsplash.com/photo-1673201229733-69d19c5c4a87?w=800&h=600&fit=crop", name: "Custom-Made Pieces", cat: "Made to Order", count: "Made to Order", pattern: "radial-gradient(circle at 50% 50%, #C9A84C22 2px, transparent 2px)", bg: "linear-gradient(135deg,#0F0A00,#1F1400)", href: "/collections?cat=bespoke" },
    { image: "https://images.unsplash.com/photo-1757140448528-332c4fa2a8a6?w=800&h=600&fit=crop", name: "Jewellery & Pieces", cat: "Accessories", count: "From ₦12,000", pattern: "repeating-linear-gradient(60deg,#C9A84C11 0,#C9A84C11 1px,transparent 0,transparent 10px)", bg: "linear-gradient(135deg,#120800,#221200)", href: "/collections?cat=accessories" },
    { image: "https://images.unsplash.com/photo-1552162864-987ac51d1177?w=800&h=600&fit=crop", name: "African Heritage Edit", cat: "New Season", count: "From ₦65,000", pattern: "repeating-linear-gradient(45deg,#C9A84C11 0,#C9A84C11 1px,transparent 0,transparent 10px)", bg: "linear-gradient(135deg,#0A0A00,#1A1600)", href: "/collections?cat=heritage" },
    { image: "https://images.unsplash.com/photo-1661332517932-2d441bfb2994?w=800&h=600&fit=crop", name: "Aso-Ebi Styles", cat: "Occasion Wear", count: "Group Orders Welcome", pattern: "radial-gradient(circle, #C9A84C11 1px, transparent 1px)", bg: "linear-gradient(135deg,#100800,#201000)", href: "/collections?cat=aso-ebi" },
  ];

  const services = [
    { image: "https://images.unsplash.com/photo-1753549839764-c7f0b02bd693?w=400&h=300&fit=crop", title: "Custom-Made Outfits", desc: "We'll make it exactly how you want it — your size, your style, your vision. Every stitch, just for you.", href: "/book" },
    { image: "https://images.unsplash.com/photo-1568805778734-f0a5a77d7272?w=400&h=300&fit=crop", title: "Style Advice", desc: "Sit down with Ruth and figure out what works for your body, your lifestyle, and your budget.", href: "/book" },
    { image: "https://images.unsplash.com/photo-1760907949955-294e28bf058d?w=400&h=300&fit=crop", title: "Ankara & Print Ready-to-Wear", desc: "Ready-made ankara and print pieces you can grab and go. Looking fresh has never been easier.", href: "/collections" },
    { image: "https://images.unsplash.com/photo-1752343809373-0600ccb3bcd2?w=400&h=300&fit=crop", title: "Owambe & Aso-Ebi", desc: "Wedding, naming, birthday, or party — we'll make sure you and your crew show up correct.", href: "/book" },
  ];

  const interactiveFeatures = [
    { icon: Sparkles, title: "Style Quiz", desc: "Find out your style personality and get outfit ideas that match.", href: "/style-quiz", accent: "#E8C97A" },
    { icon: Shirt, title: "Dress My Occasion", desc: "Tell us where you're going and we'll pick the perfect outfit for you.", href: "/dress-my-occasion", accent: "#C9A84C" },
    { icon: Palette, title: "Outfit Builder", desc: "Put different pieces together and see how they look. Add to cart or share with friends.", href: "/outfit-builder", accent: "#D4AF37" },
    { icon: Scissors, title: "Fabric Swatches", desc: "Check out our fabrics and request samples before you decide.", href: "/fabrics", accent: "#B8960C" },
    { icon: Users, title: "Aso-Ebi Coordinator", desc: "Planning matching outfits for your event? Sort out colours, fabrics and sizes all in one place.", href: "/aso-ebi", accent: "#E8C97A" },
    { icon: Crown, title: "Loyalty Programme", desc: "Shop with us and earn points. Get discounts, early access, and VIP treatment.", href: "/loyalty", accent: "#C9A84C" },
  ]

  return (
    <div>
      <Navbar />

      {/* ── HERO ── */}
      <section className="sbr-hero" style={{ height: "100vh", minHeight: 700, position: "relative", display: "flex", alignItems: "center", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 70% 50%, rgba(201,168,76,0.08) 0%, transparent 60%), linear-gradient(135deg, #0A0806 0%, #1A1406 50%, #0A0806 100%)" }} />
        <div style={{ position: "absolute", inset: 0, opacity: 0.04, backgroundImage: "repeating-linear-gradient(45deg, #C9A84C 0, #C9A84C 1px, transparent 0, transparent 50%), repeating-linear-gradient(-45deg, #C9A84C 0, #C9A84C 1px, transparent 0, transparent 50%)", backgroundSize: "30px 30px" }} />
        <img className="sbr-hero-logo" src="/logo-gold.png" alt="" style={{ position: "absolute", right: "-80px", top: "50%", transform: "translateY(-50%)", width: "55%", opacity: 0.06, pointerEvents: "none" }} />

        <motion.div initial="hidden" animate="show" variants={stagger} className="sbr-hero-content" style={{ position: "relative", zIndex: 2, padding: "0 60px", maxWidth: 700 }}>
          <motion.div variants={fadeUp} style={{ fontFamily: "Cinzel,serif", fontSize: 10, letterSpacing: "0.4em", textTransform: "uppercase", color: "#C9A84C", marginBottom: 24, display: "flex", alignItems: "center", gap: 16 }}>
            <span style={{ width: 40, height: 1, background: "#C9A84C", display: "inline-block" }} />
            Lagos · Nigeria · Est. 2020
          </motion.div>
          <motion.h1 variants={fadeUp} style={{ fontFamily: "Cormorant Garamond,serif", fontSize: "clamp(52px,7vw,90px)", fontWeight: 300, lineHeight: 1, color: "#F9F4EC", margin: 0 }}>
            We Make You
          </motion.h1>
          <motion.h1 variants={fadeUp} style={{ fontFamily: "Cormorant Garamond,serif", fontSize: "clamp(52px,7vw,90px)", fontWeight: 300, lineHeight: 1, color: "#F9F4EC", marginBottom: 24 }}>
            Look <em style={{ fontStyle: "italic", color: "#C9A84C" }}>Amazing</em>
          </motion.h1>
          <motion.p variants={fadeUp} style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 18, fontStyle: "italic", color: "#8A7A5A", marginBottom: 48 }}>
            Beautiful clothes, made with love, right here in Lagos
          </motion.p>
          <motion.div variants={fadeUp} className="sbr-hero-cta" style={{ display: "flex", gap: 20, alignItems: "center" }}>
            <Link to="/collections" style={{ fontFamily: "Cinzel,serif", fontSize: 10, fontWeight: 500, letterSpacing: "0.2em", textTransform: "uppercase", color: "#0A0806", background: "linear-gradient(135deg,#E8C97A,#C9A84C)", padding: "18px 40px", textDecoration: "none" }}>
              See What We've Made
            </Link>
            <Link to="/services" style={{ fontFamily: "Cinzel,serif", fontSize: 10, color: "#C9A84C", textDecoration: "none", letterSpacing: "0.1em" }}>
              What We Do →
            </Link>
          </motion.div>
        </motion.div>

        <div className="sbr-hero-scroll" style={{ position: "absolute", bottom: 40, left: 60, display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 1, height: 60, background: "linear-gradient(to bottom, #C9A84C, transparent)" }} />
          <div style={{ fontFamily: "Cinzel,serif", fontSize: 8, letterSpacing: "0.3em", textTransform: "uppercase", color: "#8A7A5A", writingMode: "vertical-rl" }}>Scroll to Discover</div>
        </div>
      </section>

      {/* ── MARQUEE ── */}
      <div style={{ background: "#C9A84C", padding: "14px 0", overflow: "hidden", whiteSpace: "nowrap" }}>
        <div style={{ display: "inline-flex", animation: "marquee 22s linear infinite" }}>
          {["Ready-to-Wear", "Ankara & African Prints", "Custom-Made Outfits", "Accessories & Jewellery", "Style Advice", "Custom Orders",
            "Ready-to-Wear", "Ankara & African Prints", "Custom-Made Outfits", "Accessories & Jewellery", "Style Advice", "Custom Orders"].map((t, i) => (
            <span key={i} style={{ fontFamily: "Cinzel,serif", fontSize: 10, fontWeight: 600, letterSpacing: "0.3em", textTransform: "uppercase", color: "#0A0806", padding: "0 32px" }}>
              {t}{i % 6 !== 5 ? " ◆ " : ""}
            </span>
          ))}
        </div>
        <style>{`@keyframes marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}`}</style>
      </div>

      {/* ── ABOUT ── */}
      <section id="about" className="sbr-about" style={{ padding: "120px 60px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger}>
          <motion.div variants={fadeUp} style={{ fontFamily: "Cinzel,serif", fontSize: 9, letterSpacing: "0.4em", textTransform: "uppercase", color: "#C9A84C", marginBottom: 16, display: "flex", alignItems: "center", gap: 16 }}>
            <span style={{ width: 30, height: 1, background: "#C9A84C", display: "inline-block" }} />Meet Ruth
          </motion.div>
          <motion.h2 variants={fadeUp} style={{ fontFamily: "Cormorant Garamond,serif", fontSize: "clamp(36px,4vw,56px)", fontWeight: 300, lineHeight: 1.1, color: "#F9F4EC", marginBottom: 20 }}>
            From Lagos,<br />
            <em style={{ fontStyle: "italic", color: "#C9A84C" }}>With Love.</em>
          </motion.h2>
          <motion.div variants={fadeUp} style={{ width: 60, height: 1, background: "#C9A84C", marginBottom: 24 }} />
          <motion.p variants={fadeUp} style={{ fontSize: 15, lineHeight: 1.9, color: "#8A7A5A", marginBottom: 16 }}>
            Stitches by Ruthchinos is a <strong style={{ color: "#EDE3D0", fontWeight: 400 }}>proudly Nigerian fashion brand</strong> and every single piece we create is made with heart. We celebrate who we are — our culture, our style, our confidence.
          </motion.p>
          <motion.p variants={fadeUp} style={{ fontSize: 15, lineHeight: 1.9, color: "#8A7A5A", marginBottom: 48 }}>
            From hand-picked Ankara to custom-made outfits sewn right here in Lagos, we mix our rich <strong style={{ color: "#EDE3D0", fontWeight: 400 }}>African style</strong> with what's trending today.
          </motion.p>
          <motion.div variants={fadeUp} className="sbr-about-stats" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 32, paddingTop: 48, borderTop: "1px solid rgba(201,168,76,0.2)" }}>
            {[["500+", "Happy Clients"], ["4+", "Years Running"], ["100%", "Made With Love"]].map(([num, label]) => (
              <div key={label}>
                <div style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 44, fontWeight: 300, color: "#C9A84C", lineHeight: 1, marginBottom: 4 }}>{num}</div>
                <div style={{ fontFamily: "Cinzel,serif", fontSize: 8, letterSpacing: "0.2em", textTransform: "uppercase", color: "#8A7A5A" }}>{label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.9 }} style={{ position: "relative" }}>
          <div style={{ width: "100%", aspectRatio: "3/4", background: "#1A1710", border: "1px solid rgba(201,168,76,0.2)", position: "relative", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {aboutPhoto ? (
              <>
                <img src={aboutPhoto} alt="Stitches by Ruthchinos" style={{ width: "100%", height: "100%", objectFit: "cover", position: "absolute", inset: 0 }} />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 60%, rgba(10,8,6,0.4) 100%)", pointerEvents: "none" }} />
              </>
            ) : (
              <>
                <svg width="100%" height="100%" style={{ position: "absolute", inset: 0, opacity: 0.2 }} xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="ankara" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
                      <polygon points="40,4 76,40 40,76 4,40" fill="none" stroke="#C9A84C" strokeWidth="1.5" />
                      <polygon points="40,18 62,40 40,62 18,40" fill="none" stroke="#C9A84C" strokeWidth="1" />
                      <circle cx="40" cy="40" r="5" fill="#C9A84C" />
                      <circle cx="0" cy="0" r="6" fill="none" stroke="#C9A84C" strokeWidth="1" />
                      <circle cx="80" cy="0" r="6" fill="none" stroke="#C9A84C" strokeWidth="1" />
                      <circle cx="0" cy="80" r="6" fill="none" stroke="#C9A84C" strokeWidth="1" />
                      <circle cx="80" cy="80" r="6" fill="none" stroke="#C9A84C" strokeWidth="1" />
                      <line x1="40" y1="0" x2="40" y2="18" stroke="#C9A84C" strokeWidth="1" />
                      <line x1="40" y1="62" x2="40" y2="80" stroke="#C9A84C" strokeWidth="1" />
                      <line x1="0" y1="40" x2="18" y2="40" stroke="#C9A84C" strokeWidth="1" />
                      <line x1="62" y1="40" x2="80" y2="40" stroke="#C9A84C" strokeWidth="1" />
                    </pattern>
                    <pattern id="kente" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
                      <rect width="24" height="6" fill="#8B6914" opacity="0.25" />
                      <rect y="12" width="24" height="6" fill="#C9A84C" opacity="0.15" />
                      <rect width="6" height="24" fill="#C9A84C" opacity="0.12" />
                      <rect x="12" width="6" height="24" fill="#8B6914" opacity="0.18" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#kente)" />
                  <rect width="100%" height="100%" fill="url(#ankara)" />
                </svg>
                <div style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
                  <div style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 80, fontWeight: 300, color: "#C9A84C", opacity: 0.35, lineHeight: 1, letterSpacing: "0.05em" }}>SBR</div>
                  <div style={{ fontFamily: "Cinzel,serif", fontSize: 8, letterSpacing: "0.4em", textTransform: "uppercase", color: "#8A7A5A", marginTop: 10 }}>Add Your Photo Here</div>
                </div>
              </>
            )}
            <div style={{ position: "absolute", inset: 12, border: "1px solid rgba(201,168,76,0.15)", pointerEvents: "none" }} />
          </div>
          <div className="sbr-about-photo-badge" style={{ position: "absolute", bottom: -20, left: -20, width: 120, height: 120, background: "#C9A84C", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2 }}>
            <div className="badge-title" style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 28, fontWeight: 300, color: "#0A0806", lineHeight: 1 }}>SBR</div>
            <div className="badge-sub" style={{ fontFamily: "Cinzel,serif", fontSize: 7, letterSpacing: "0.1em", textTransform: "uppercase", color: "#0A0806", textAlign: "center" }}>Lagos<br />Fashion</div>
          </div>
        </motion.div>
      </section>

      {/* ── FEATURED PRODUCTS ── */}
      <section className="sbr-featured" style={{ padding: "120px 60px", background: "#111009" }}>
        <div className="sbr-featured-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 60 }}>
          <div>
            <div style={{ fontFamily: "Cinzel,serif", fontSize: 9, letterSpacing: "0.4em", textTransform: "uppercase", color: "#C9A84C", marginBottom: 8, display: "flex", alignItems: "center", gap: 16 }}>
              <span style={{ width: 30, height: 1, background: "#C9A84C", display: "inline-block" }} />
              {featured.length > 0 ? "Hot Right Now" : "Shop Our Collection"}
            </div>
            <h2 style={{ fontFamily: "Cormorant Garamond,serif", fontSize: "clamp(36px,4vw,56px)", fontWeight: 300, color: "#F9F4EC" }}>
              {featured.length > 0 ? <>Picked Just <em style={{ fontStyle: "italic", color: "#C9A84C" }}>for You</em></> : <>Our <em style={{ fontStyle: "italic", color: "#C9A84C" }}>Collection</em></>}
            </h2>
          </div>
          <Link to="/collections" style={{ fontFamily: "Cinzel,serif", fontSize: 10, color: "#C9A84C", textDecoration: "none", letterSpacing: "0.1em" }}>
            See Everything →
          </Link>
        </div>

        {featuredLoading ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: "#8A7A5A", fontSize: 13 }}>Loading...</div>
        ) : featured.length === 0 ? (
          /* Fallback: category cards when no featured products uploaded yet */
          <div className="sbr-featured-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 2 }}>
            {collections.map((c, i) => (
              <Link key={c.name} to={c.href} style={{ textDecoration: "none", position: "relative", aspectRatio: i === 0 ? "auto" : "3/4", gridRow: i === 0 ? "span 2" : "auto", background: c.bg, overflow: "hidden", display: "block" }}>
                <div style={{ position: "absolute", inset: 0, backgroundImage: c.pattern, backgroundSize: "20px 20px", opacity: 0.06 }} />
                <img src={c.image} alt={c.name} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.6 }} />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(10,8,6,0.95) 0%, rgba(10,8,6,0.2) 50%, transparent 100%)" }} />
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: 28 }}>
                  <div style={{ fontFamily: "Cinzel,serif", fontSize: 8, letterSpacing: "0.3em", textTransform: "uppercase", color: "#C9A84C", marginBottom: 6 }}>{c.cat}</div>
                  <div style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 22, fontWeight: 300, color: "#F9F4EC", marginBottom: 4 }}>{c.name}</div>
                  <div style={{ fontSize: 12, color: "#8A7A5A" }}>{c.count}</div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          /* Real featured products from admin */
          <div className="sbr-products-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 24 }}>
            {featured.map((p) => (
              <div key={p.id} style={{ background: "#0A0806", border: "1px solid rgba(201,168,76,0.12)", overflow: "hidden", transition: "border-color 0.3s" }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(201,168,76,0.5)")}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(201,168,76,0.12)")}>
                {/* Product image */}
                <div style={{ height: 340, background: "#1A1710", position: "relative", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {p.images && p.images[0] ? (
                    <img src={p.images[0]} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.5s ease" }}
                      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")} />
                  ) : (
                    <div style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 48, color: "#C9A84C", opacity: 0.3, letterSpacing: "0.1em" }}>SBR</div>
                  )}
                  <div style={{ position: "absolute", top: 12, left: 12, background: "#C9A84C", padding: "3px 10px", fontFamily: "Cinzel,serif", fontSize: 7, letterSpacing: "0.15em", textTransform: "uppercase", color: "#0A0806" }}>
                    Featured
                  </div>
                </div>
                {/* Product info */}
                <div style={{ padding: "20px 20px 24px" }}>
                  <div style={{ fontFamily: "Cinzel,serif", fontSize: 8, letterSpacing: "0.2em", textTransform: "uppercase", color: "#C9A84C", marginBottom: 6 }}>{p.category}</div>
                  <div style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 20, fontWeight: 400, color: "#F9F4EC", marginBottom: 6 }}>{p.name}</div>
                  {p.description && <p style={{ fontSize: 12, color: "#8A7A5A", lineHeight: 1.7, marginBottom: 16 }}>{p.description}</p>}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 22, fontWeight: 300, color: "#C9A84C" }}>
                      ₦{Number(p.price).toLocaleString()}
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); addItem(p); }}
                      style={{ fontFamily: "Cinzel,serif", fontSize: 8, letterSpacing: "0.15em", textTransform: "uppercase", color: "#0A0806", background: "#C9A84C", padding: "10px 18px", border: "none", cursor: "pointer", transition: "background 0.2s", display: "flex", alignItems: "center", gap: 6 }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "#E8C97A")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "#C9A84C")}>
                      <ShoppingBag size={12} /> Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── SERVICES ── */}
      <section className="sbr-services-home" style={{ padding: "120px 60px" }}>
        <div style={{ textAlign: "center", marginBottom: 60 }}>
          <div style={{ fontFamily: "Cinzel,serif", fontSize: 9, letterSpacing: "0.4em", textTransform: "uppercase", color: "#C9A84C", marginBottom: 16, justifyContent: "center", display: "flex", alignItems: "center", gap: 16 }}>
            <span style={{ width: 30, height: 1, background: "#C9A84C", display: "inline-block" }} />What We Do
          </div>
          <h2 style={{ fontFamily: "Cormorant Garamond,serif", fontSize: "clamp(36px,4vw,56px)", fontWeight: 300, color: "#F9F4EC" }}>
            How We Can <em style={{ fontStyle: "italic", color: "#C9A84C" }}>Help You</em>
          </h2>
        </div>
        <div className="sbr-services-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 1, background: "rgba(201,168,76,0.1)" }}>
          {services.map((sv) => (
            <div key={sv.title} style={{ background: "#0A0806", padding: "48px 32px", transition: "background 0.3s" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#1A1710")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#0A0806")}>
              <div style={{ width: 60, height: 60, borderRadius: 8, overflow: "hidden", marginBottom: 24 }}><img src={sv.image} alt={sv.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} /></div>
              <div style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 22, fontWeight: 400, color: "#F9F4EC", marginBottom: 12 }}>{sv.title}</div>
              <p style={{ fontSize: 13, color: "#8A7A5A", lineHeight: 1.8, marginBottom: 24 }}>{sv.desc}</p>
              <Link to={sv.href} style={{ fontFamily: "Cinzel,serif", fontSize: 8, letterSpacing: "0.2em", textTransform: "uppercase", color: "#C9A84C", textDecoration: "none" }}>Find Out More →</Link>
            </div>
          ))}
        </div>
      </section>

      {/* ── PROCESS ── */}
      <section className="sbr-process" style={{ padding: "120px 60px", background: "#1C1608", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(90deg, transparent, transparent 59px, rgba(201,168,76,0.04) 59px, rgba(201,168,76,0.04) 60px)", pointerEvents: "none" }} />
        <div style={{ textAlign: "center", marginBottom: 80, position: "relative" }}>
          <div style={{ fontFamily: "Cinzel,serif", fontSize: 9, letterSpacing: "0.4em", textTransform: "uppercase", color: "#C9A84C", marginBottom: 16 }}>How We Work</div>
          <h2 style={{ fontFamily: "Cormorant Garamond,serif", fontSize: "clamp(36px,4vw,56px)", fontWeight: 300, color: "#F9F4EC" }}>
            From Your Idea to Your <em style={{ fontStyle: "italic", color: "#C9A84C" }}>Outfit</em>
          </h2>
        </div>
        <div className="sbr-process-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", position: "relative" }}>
          <div className="sbr-process-line" style={{ position: "absolute", top: 28, left: "12.5%", right: "12.5%", height: 1, background: "linear-gradient(90deg,transparent,#C9A84C,#C9A84C,transparent)", opacity: 0.3 }} />
          {[["01", "Let's Talk", "Tell us what you have in mind — the occasion, the vibe, your budget. We'll take it from there."],
            ["02", "Pick Your Style & Fabric", "We'll sketch your design and help you pick the perfect fabric. The fun part!"],
            ["03", "We Get to Work", "Our tailors bring your outfit to life with serious attention to every single detail."],
            ["04", "Try It On", "Come try it on, we make sure everything fits perfectly. Then it's all yours!"]
          ].map(([n, t, d]) => (
            <div key={n} style={{ textAlign: "center", padding: "0 24px" }}>
              <div style={{ width: 56, height: 56, border: "1px solid #C9A84C", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Cormorant Garamond,serif", fontSize: 22, fontWeight: 300, color: "#C9A84C", margin: "0 auto 24px", background: "#1C1608", position: "relative", zIndex: 1 }}>{n}</div>
              <div style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 20, fontWeight: 400, color: "#F9F4EC", marginBottom: 10 }}>{t}</div>
              <p style={{ fontSize: 12, color: "#8A7A5A", lineHeight: 1.8 }}>{d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="sbr-testimonials" style={{ padding: "120px 60px", background: "#111009", textAlign: "center" }}>
        <div style={{ marginBottom: 60 }}>
          <div style={{ fontFamily: "Cinzel,serif", fontSize: 9, letterSpacing: "0.4em", textTransform: "uppercase", color: "#C9A84C", marginBottom: 16 }}>What Our Clients Say</div>
          <h2 style={{ fontFamily: "Cormorant Garamond,serif", fontSize: "clamp(36px,4vw,56px)", fontWeight: 300, color: "#F9F4EC" }}>
            Real People, Real <em style={{ fontStyle: "italic", color: "#C9A84C" }}>Reviews</em>
          </h2>
        </div>

        {testimonialsLoading ? (
          <div style={{ color: "#8A7A5A", fontSize: 13 }}>Loading...</div>
        ) : (
          <div className="sbr-testimonials-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 32 }}>
            {testimonials.map((t) => (
              <div key={t.id} style={{ background: "#1A1710", border: "1px solid rgba(201,168,76,0.15)", padding: "40px 32px", textAlign: "left", position: "relative" }}>
                <div style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 80, color: "#C9A84C", opacity: 0.2, position: "absolute", top: 16, left: 24, lineHeight: 1 }}>"</div>
                <div style={{ color: "#FFD600", fontSize: 12, letterSpacing: 2, marginBottom: 16 }}>{"★".repeat(t.rating || 5)}</div>
                <p style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 16, fontStyle: "italic", fontWeight: 300, color: "#EDE3D0", lineHeight: 1.8, marginBottom: 24, position: "relative", zIndex: 1 }}>"{t.text}"</p>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#C9A84C", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Cormorant Garamond,serif", fontSize: 18, color: "#0A0806" }}>
                    {t.initials || t.name?.charAt(0)}
                  </div>
                  <div>
                    <div style={{ fontFamily: "Cinzel,serif", fontSize: 10, letterSpacing: "0.1em", color: "#F9F4EC" }}>{t.name}</div>
                    <div style={{ fontSize: 11, color: "#8A7A5A", marginTop: 2 }}>{t.client_title}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── INTERACTIVE FEATURES ── */}
      <section className="sbr-interactive" style={{ padding: "120px 60px" }}>
        <div style={{ textAlign: "center", marginBottom: 60 }}>
          <div style={{ fontFamily: "Cinzel,serif", fontSize: 9, letterSpacing: "0.4em", textTransform: "uppercase", color: "#C9A84C", marginBottom: 16, justifyContent: "center", display: "flex", alignItems: "center", gap: 16 }}>
            <span style={{ width: 30, height: 1, background: "#C9A84C", display: "inline-block" }} />
            Fun Stuff to Try
          </div>
          <h2 style={{ fontFamily: "Cormorant Garamond,serif", fontSize: "clamp(36px,4vw,56px)", fontWeight: 300, color: "#F9F4EC" }}>
            Try These <em style={{ fontStyle: "italic", color: "#C9A84C" }}>Out</em>
          </h2>
          <p style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 17, fontStyle: "italic", color: "#8A7A5A", marginTop: 12, maxWidth: 500, margin: "12px auto 0" }}>
            We made these to help you find exactly what you're looking for.
          </p>
        </div>

        <div className="sbr-interactive-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, maxWidth: 1100, margin: "0 auto" }}>
          {interactiveFeatures.map((f) => {
            const Icon = f.icon
            return (
              <Link key={f.title} to={f.href} style={{ textDecoration: "none", background: "#111009", border: "1px solid rgba(201,168,76,0.1)", padding: "36px 28px", transition: "all 0.3s", position: "relative", overflow: "hidden", display: "block" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(201,168,76,0.35)"; e.currentTarget.style.transform = "translateY(-4px)" }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(201,168,76,0.1)"; e.currentTarget.style.transform = "translateY(0)" }}>
                <div style={{ width: 48, height: 48, borderRadius: "50%", border: `1px solid ${f.accent}33`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
                  <Icon size={22} color={f.accent} strokeWidth={1.5} />
                </div>
                <div style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 22, fontWeight: 400, color: "#F9F4EC", marginBottom: 10 }}>{f.title}</div>
                <p style={{ fontSize: 13, color: "#8A7A5A", lineHeight: 1.8, margin: "0 0 16px" }}>{f.desc}</p>
                <span style={{ fontFamily: "Cinzel,serif", fontSize: 8, letterSpacing: "0.2em", textTransform: "uppercase", color: "#C9A84C" }}>
                  Check It Out →
                </span>
              </Link>
            )
          })}
        </div>

        {/* Client Spotlight callout */}
        <div style={{ maxWidth: 1100, margin: "24px auto 0" }}>
          <Link to="/spotlight" style={{ textDecoration: "none", display: "flex", alignItems: "center", justifyContent: "space-between", background: "linear-gradient(135deg, rgba(201,168,76,0.08), rgba(201,168,76,0.03))", border: "1px solid rgba(201,168,76,0.15)", padding: "24px 32px", transition: "all 0.3s" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(201,168,76,0.4)" }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(201,168,76,0.15)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <Sparkles size={28} color="#C9A84C" />
              <div>
                <div style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 20, fontWeight: 400, color: "#F9F4EC", marginBottom: 4 }}>Client Spotlight</div>
                <div style={{ fontSize: 13, color: "#8A7A5A" }}>See real clients rocking their SBR outfits — get inspired for your own.</div>
              </div>
            </div>
            <span style={{ fontFamily: "Cinzel,serif", fontSize: 9, letterSpacing: "0.15em", textTransform: "uppercase", color: "#C9A84C", whiteSpace: "nowrap" }}>
              See the Looks →
            </span>
          </Link>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="sbr-cta-banner" style={{ padding: "100px 60px", background: "#0A0806", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(ellipse at 50% 50%, rgba(201,168,76,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ fontFamily: "Cinzel,serif", fontSize: 9, letterSpacing: "0.4em", textTransform: "uppercase", color: "#C9A84C", marginBottom: 24 }}>Ready to Get Started?</div>
        <h2 style={{ fontFamily: "Cormorant Garamond,serif", fontSize: "clamp(40px,5vw,70px)", fontWeight: 300, color: "#F9F4EC", marginBottom: 16 }}>
          Every Great Outfit Starts<br />With a <em style={{ fontStyle: "italic", color: "#C9A84C" }}>Conversation.</em>
        </h2>
        <p style={{ fontFamily: "Cormorant Garamond,serif", fontStyle: "italic", fontSize: 18, color: "#8A7A5A", marginBottom: 48 }}>
          Send us a message or book a time to chat with Ruth.
        </p>
        <Link to="/book" style={{ fontFamily: "Cinzel,serif", fontSize: 11, fontWeight: 500, letterSpacing: "0.25em", textTransform: "uppercase", color: "#0A0806", background: "linear-gradient(135deg,#E8C97A,#C9A84C)", padding: "20px 56px", textDecoration: "none", display: "inline-block" }}>
          Let's Talk
        </Link>
      </section>

      <Footer />
    </div>
  );
}