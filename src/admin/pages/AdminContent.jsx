import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import toast from 'react-hot-toast'
import { Save, RefreshCw, Upload, Trash2 } from 'lucide-react'

const FIELDS = [
  { key: 'hero_tagline', label: 'Hero Tagline', type: 'text', section: 'Hero Section', placeholder: 'Where African heritage meets contemporary luxury fashion' },
  { key: 'hero_eyebrow', label: 'Hero Eyebrow Text', type: 'text', section: 'Hero Section', placeholder: 'Lagos · Nigeria · Est. 2020' },
  { key: 'about_title', label: 'About Title', type: 'text', section: 'About Section', placeholder: 'Rooted in Africa. Dressed for the World.' },
  { key: 'about_body_1', label: 'About Paragraph 1', type: 'textarea', section: 'About Section' },
  { key: 'about_body_2', label: 'About Paragraph 2', type: 'textarea', section: 'About Section' },
  { key: 'about_stat_1_num', label: 'Stat 1 — Number', type: 'text', section: 'About Stats', placeholder: '500+' },
  { key: 'about_stat_1_label', label: 'Stat 1 — Label', type: 'text', section: 'About Stats', placeholder: 'Happy Clients' },
  { key: 'about_stat_2_num', label: 'Stat 2 — Number', type: 'text', section: 'About Stats', placeholder: '4+' },
  { key: 'about_stat_2_label', label: 'Stat 2 — Label', type: 'text', section: 'About Stats', placeholder: 'Years of Excellence' },
  { key: 'about_stat_3_num', label: 'Stat 3 — Number', type: 'text', section: 'About Stats', placeholder: '100%' },
  { key: 'about_stat_3_label', label: 'Stat 3 — Label', type: 'text', section: 'About Stats', placeholder: 'Bespoke Crafted' },
  { key: 'contact_whatsapp', label: 'WhatsApp Number', type: 'text', section: 'Contact Info', placeholder: '+234 801 234 5678' },
  { key: 'contact_instagram', label: 'Instagram Handle', type: 'text', section: 'Contact Info', placeholder: '@stitchesbyruthchinos' },
  { key: 'contact_email', label: 'Email Address', type: 'text', section: 'Contact Info', placeholder: 'info@sbr.com' },
  { key: 'contact_location', label: 'Location', type: 'text', section: 'Contact Info', placeholder: 'Lagos, Nigeria · Home visits available' },
  { key: 'cta_title', label: 'CTA Banner Title', type: 'text', section: 'CTA Banner', placeholder: 'Every Great Outfit Starts With a Conversation.' },
  { key: 'cta_subtitle', label: 'CTA Subtitle', type: 'text', section: 'CTA Banner', placeholder: 'Book your private consultation with Ruthchinos today.' },
]

export default function AdminContent() {
  const [values, setValues] = useState({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [activeSection, setActiveSection] = useState('Hero Section')

  const sections = [...new Set(FIELDS.map(f => f.section))]

  const load = async () => {
    const { data } = await supabase.from('site_content').select('*')
    if (data) {
      const map = {}
      data.forEach((d) => { map[d.key] = d.value })
      setValues(map)
    }
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const handleSave = async () => {
    setSaving(true)
    const upserts = Object.entries(values).map(([key, value]) => ({ key, value }))
    const { error } = await supabase.from('site_content').upsert(upserts, { onConflict: 'key' })
    if (error) toast.error('Failed to save changes')
    else toast.success('Site content updated!')
    setSaving(false)
  }

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const ext = file.name.split('.').pop()
    const path = `about/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const { error, data } = await supabase.storage.from('sbr-media').upload(path, file, { cacheControl: '3600', upsert: false })
    if (error) { toast.error('Upload failed'); setUploading(false); return }
    const { data: urlData } = supabase.storage.from('sbr-media').getPublicUrl(data.path)
    const photoUrl = urlData.publicUrl
    setValues(prev => ({ ...prev, about_photo: photoUrl }))
    await supabase.from('site_content').upsert({ key: 'about_photo', value: photoUrl }, { onConflict: 'key' })
    toast.success('About photo uploaded!')
    setUploading(false)
  }

  const handlePhotoRemove = async () => {
    setValues(prev => ({ ...prev, about_photo: '' }))
    await supabase.from('site_content').upsert({ key: 'about_photo', value: '' }, { onConflict: 'key' })
    toast.success('About photo removed')
  }

  const sectionFields = FIELDS.filter(f => f.section === activeSection)

  const inpStyle = {
    width: '100%', background: '#1A1710', border: '1px solid rgba(201,168,76,0.2)',
    color: '#F9F4EC', padding: '12px 14px', fontFamily: 'Jost,sans-serif',
    fontSize: 13, fontWeight: 300, outline: 'none', transition: 'border-color 0.3s'
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <div>
          <h1 style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 32, fontWeight: 300, color: '#F9F4EC', marginBottom: 4 }}>Site Content</h1>
          <p style={{ fontSize: 13, color: '#8A7A5A' }}>Edit the text and information shown on your website</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={load} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: '1px solid rgba(201,168,76,0.3)', color: '#C9A84C', padding: '10px 16px', cursor: 'pointer', fontFamily: 'Cinzel,serif', fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
            <RefreshCw size={13} /> Reload
          </button>
          <button onClick={handleSave} disabled={saving} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'linear-gradient(135deg,#E8C97A,#C9A84C)', color: '#0A0806', border: 'none', padding: '10px 20px', cursor: saving ? 'not-allowed' : 'pointer', fontFamily: 'Cinzel,serif', fontSize: 9, fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', opacity: saving ? 0.7 : 1 }}>
            <Save size={13} /> {saving ? 'Saving...' : 'Save All Changes'}
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 24 }}>
        {/* Section nav */}
        <div style={{ background: '#111009', border: '1px solid rgba(201,168,76,0.12)', padding: 16, alignSelf: 'start' }}>
          <div style={{ fontFamily: 'Cinzel,serif', fontSize: 8, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#8A7A5A', marginBottom: 12 }}>Sections</div>
          {sections.map(sec => (
            <button key={sec} onClick={() => setActiveSection(sec)} style={{ display: 'block', width: '100%', textAlign: 'left', padding: '10px 12px', background: activeSection === sec ? 'rgba(201,168,76,0.1)' : 'none', border: 'none', borderLeft: activeSection === sec ? '2px solid #C9A84C' : '2px solid transparent', color: activeSection === sec ? '#C9A84C' : '#8A7A5A', cursor: 'pointer', fontSize: 12, fontFamily: 'Jost,sans-serif', marginBottom: 2, transition: 'all 0.2s' }}>
              {sec}
            </button>
          ))}
        </div>

        {/* Fields */}
        <div style={{ background: '#111009', border: '1px solid rgba(201,168,76,0.12)', padding: 28 }}>
          <div style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 24, fontWeight: 300, color: '#F9F4EC', marginBottom: 4 }}>{activeSection}</div>
          <div style={{ width: 40, height: 1, background: '#C9A84C', marginBottom: 28 }} />

          {/* About Photo Upload */}
          {activeSection === 'About Section' && !loading && (
            <div style={{ marginBottom: 28 }}>
              <label style={{ fontFamily: 'Cinzel,serif', fontSize: 8, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#8A7A5A', display: 'block', marginBottom: 12 }}>
                About Section Photo
              </label>
              {values.about_photo ? (
                <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                  <div style={{ position: 'relative', width: 200, aspectRatio: '3/4', background: '#1A1710', border: '1px solid rgba(201,168,76,0.2)', overflow: 'hidden' }}>
                    <img src={values.about_photo} alt="About section" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.3)', color: '#C9A84C', padding: '10px 16px', cursor: uploading ? 'not-allowed' : 'pointer', fontFamily: 'Cinzel,serif', fontSize: 8, letterSpacing: '0.15em', textTransform: 'uppercase', opacity: uploading ? 0.7 : 1 }}>
                      <Upload size={13} /> {uploading ? 'Uploading...' : 'Replace Photo'}
                      <input type="file" accept="image/*" onChange={handlePhotoUpload} style={{ display: 'none' }} disabled={uploading} />
                    </label>
                    <button onClick={handlePhotoRemove} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(255,107,107,0.1)', border: '1px solid rgba(255,107,107,0.2)', color: '#FF6B6B', padding: '10px 16px', cursor: 'pointer', fontFamily: 'Cinzel,serif', fontSize: 8, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                      <Trash2 size={13} /> Remove Photo
                    </button>
                    <p style={{ fontSize: 11, color: '#8A7A5A', marginTop: 4 }}>Recommended: portrait photo, 3:4 ratio</p>
                  </div>
                </div>
              ) : (
                <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', padding: '40px 24px', background: '#1A1710', border: '2px dashed rgba(201,168,76,0.3)', cursor: uploading ? 'not-allowed' : 'pointer', transition: 'border-color 0.3s', opacity: uploading ? 0.7 : 1 }}>
                  <Upload size={28} color="#8A7A5A" style={{ marginBottom: 12 }} />
                  <div style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 18, fontWeight: 300, color: '#F9F4EC', marginBottom: 6 }}>
                    {uploading ? 'Uploading...' : 'Upload About Photo'}
                  </div>
                  <p style={{ fontSize: 11, color: '#8A7A5A' }}>This photo appears next to your "Our Story" section on the homepage</p>
                  <input type="file" accept="image/*" onChange={handlePhotoUpload} style={{ display: 'none' }} disabled={uploading} />
                </label>
              )}
              <div style={{ width: '100%', height: 1, background: 'rgba(201,168,76,0.1)', marginTop: 24 }} />
            </div>
          )}

          {loading ? (
            <div style={{ color: '#8A7A5A', fontSize: 13 }}>Loading...</div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: sectionFields.some(f => f.type === 'textarea') ? '1fr' : 'repeat(2,1fr)', gap: 20 }}>
              {sectionFields.map(field => (
                <div key={field.key} style={{ gridColumn: field.type === 'textarea' ? '1 / -1' : 'auto' }}>
                  <label style={{ fontFamily: 'Cinzel,serif', fontSize: 8, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#8A7A5A', display: 'block', marginBottom: 8 }}>
                    {field.label}
                  </label>
                  {field.type === 'textarea' ? (
                    <textarea
                      value={values[field.key] || ''}
                      onChange={e => setValues({ ...values, [field.key]: e.target.value })}
                      placeholder={field.placeholder}
                      style={{ ...inpStyle, height: 100, resize: 'vertical' }}
                      onFocus={e => (e.target.style.borderColor = '#C9A84C')}
                      onBlur={e => (e.target.style.borderColor = 'rgba(201,168,76,0.2)')}
                    />
                  ) : (
                    <input
                      type={field.type}
                      value={values[field.key] || ''}
                      onChange={e => setValues({ ...values, [field.key]: e.target.value })}
                      placeholder={field.placeholder}
                      style={inpStyle}
                      onFocus={e => (e.target.style.borderColor = '#C9A84C')}
                      onBlur={e => (e.target.style.borderColor = 'rgba(201,168,76,0.2)')}
                    />
                  )}
                </div>
              ))}
            </div>
          )}

          <div style={{ marginTop: 28, paddingTop: 20, borderTop: '1px solid rgba(201,168,76,0.1)' }}>
            <button onClick={handleSave} disabled={saving} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'linear-gradient(135deg,#E8C97A,#C9A84C)', color: '#0A0806', border: 'none', padding: '14px 32px', cursor: saving ? 'not-allowed' : 'pointer', fontFamily: 'Cinzel,serif', fontSize: 10, fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', opacity: saving ? 0.7 : 1 }}>
              <Save size={14} /> {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
