# Stitches by Ruthchinos — Website & Admin Dashboard

A full luxury African fashion website with admin dashboard built with React + TypeScript + Supabase.

---

## 🚀 Quick Start (5 Steps)

### Step 1 — Install Node.js
Download from https://nodejs.org (LTS version)

### Step 2 — Install dependencies
```bash
cd sbr-fashion
npm install
```

### Step 3 — Set up Supabase
1. Go to https://supabase.com and create a free account
2. Click "New Project" — name it "sbr-fashion"
3. Go to **SQL Editor** and paste the entire contents of `supabase-schema.sql` and run it
4. Go to **Storage** → New Bucket → name it `sbr-media` → make it **Public**
5. Go to **Settings → API** and copy your Project URL and anon key

### Step 4 — Configure environment
```bash
cp .env.example .env
```
Open `.env` and fill in your Supabase URL and anon key.

### Step 5 — Add your logo
Place your logo files in the `public/` folder:
- `public/logo-gold.png` — gold version (for dark backgrounds)
- `public/logo-dark.png` — dark version (optional)

Then run:
```bash
npm start
```

Your site runs at **http://localhost:3000**  
Your admin runs at **http://localhost:3000/admin**

---

## 🔐 Creating Your First Admin Account

1. Go to your Supabase dashboard → **Authentication → Users**
2. Click "Add User" → fill in email and password for Ruth
3. Then go to your Supabase **SQL Editor** and run:

```sql
INSERT INTO staff_members (id, email, name, role)
SELECT id, email, 'Ruthchinos', 'admin'
FROM auth.users
WHERE email = 'your-admin-email@example.com';
```

4. Now login at `/admin/login` with those credentials

---

## 📁 Project Structure

```
sbr-fashion/
├── public/
│   ├── logo-gold.png          ← Add your logo here
│   └── index.html
├── src/
│   ├── pages/                 ← Public website pages
│   │   ├── Home.tsx           ← Full homepage
│   │   ├── Collections.tsx    ← Shop/products page
│   │   ├── Lookbook.tsx       ← Photo gallery
│   │   ├── Services.tsx       ← Services page
│   │   └── BookingPage.tsx    ← Booking form
│   ├── admin/
│   │   ├── components/
│   │   │   └── AdminLayout.tsx ← Sidebar navigation
│   │   └── pages/
│   │       ├── AdminLogin.tsx  ← Login screen
│   │       ├── Dashboard.tsx   ← Overview & stats
│   │       ├── AdminProducts.tsx ← Product CRUD + image upload
│   │       ├── AdminBookings.tsx ← Manage appointments
│   │       ├── AdminGallery.tsx  ← Drag & drop photo upload
│   │       ├── AdminContent.tsx  ← Edit site text
│   │       ├── AdminMessages.tsx ← Read customer messages
│   │       └── AdminStaff.tsx    ← Add/remove staff
│   ├── components/
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   └── Cursor.tsx         ← Custom gold cursor
│   ├── context/
│   │   └── AuthContext.tsx    ← Login state
│   ├── lib/
│   │   └── supabase.ts        ← Database client + types
│   ├── App.tsx                ← Routes
│   └── index.css              ← Global styles
├── supabase-schema.sql        ← Run this in Supabase
├── .env.example               ← Copy to .env
└── package.json
```

---

## 🌐 Deployment (Vercel — Free)

1. Push your code to GitHub
2. Go to https://vercel.com → Import your repo
3. Add environment variables (same as your .env)
4. Deploy — done!

Your site will be live at `your-project.vercel.app`

You can then connect a custom domain like `sbr.com` in Vercel settings.

---

## ✨ Admin Dashboard Features

| Feature | What it does |
|---|---|
| **Dashboard** | Stats overview, recent bookings, quick actions |
| **Products** | Add/edit/delete products with image upload, mark featured |
| **Bookings** | View all appointments, update status, open WhatsApp chat |
| **Gallery** | Drag & drop photo upload, manage lookbook |
| **Site Content** | Edit hero text, about section, contact info without touching code |
| **Messages** | Read customer enquiries, reply via WhatsApp or email |
| **Staff** | Add team members, assign admin or staff roles |

---

## 📱 Tech Stack

| Layer | Technology | Cost |
|---|---|---|
| Frontend | React + TypeScript | Free |
| Routing | React Router v6 | Free |
| Animations | Framer Motion | Free |
| Icons | Lucide React | Free |
| Backend/DB | Supabase | Free (500MB) |
| Auth | Supabase Auth | Free |
| File Storage | Supabase Storage | Free (1GB) |
| Notifications | React Hot Toast | Free |
| Hosting | Vercel | Free |
| **Total** | | **₦0/month** |

---

## 🎨 Design System

- **Primary Gold**: `#C9A84C`
- **Background**: `#0A0806`
- **Display Font**: Cormorant Garamond (elegant serif)
- **Heading Font**: Cinzel (luxury all-caps)
- **Body Font**: Jost (clean, modern)

---

Built with ♥ for Stitches by Ruthchinos
