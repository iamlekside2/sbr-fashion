import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import { WishlistProvider } from './context/WishlistContext'
import './index.css'

// Public pages
import Home from './pages/Home'
import Collections from './pages/Collections'
import CollectionDetail from './pages/CollectionDetail'
import Lookbook from './pages/Lookbook'
import Services from './pages/Services'
import BookingPage from './pages/BookingPage'
import Contact from './pages/Contact'
import BespokeConfigurator from './pages/BespokeConfigurator'
import Cart from './pages/Cart'
import OrderConfirmation from './pages/OrderConfirmation'
import DressMyOccasion from './pages/DressMyOccasion'
import AsoEbiCoordinator from './pages/AsoEbiCoordinator'
import StyleQuiz from './pages/StyleQuiz'
import Wishlist from './pages/Wishlist'
import OutfitBuilder from './pages/OutfitBuilder'
import FabricSwatches from './pages/FabricSwatches'
import ClientSpotlight from './pages/ClientSpotlight'
import LoyaltyProgramme from './pages/LoyaltyProgramme'

// Admin pages
import AdminLogin from './admin/pages/AdminLogin'
import AdminLayout from './admin/components/AdminLayout'
import Dashboard from './admin/pages/Dashboard'
import AdminProducts from './admin/pages/AdminProducts'
import AdminBookings from './admin/pages/AdminBookings'
import AdminGallery from './admin/pages/AdminGallery'
import AdminContent from './admin/pages/AdminContent'
import AdminMessages from './admin/pages/AdminMessages'
import AdminStaff from './admin/pages/AdminStaff'
import AdminTestimonials from './admin/pages/AdminTestimonials'
import AdminOrders from './admin/pages/AdminOrders'
import AdminAsoEbi from './admin/pages/AdminAsoEbi'

// Cursor component
import Cursor from './components/Cursor'
import WhatsAppBubble from './components/WhatsAppBubble'

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return (
    <div style={{ display:'flex',alignItems:'center',justifyContent:'center',height:'100vh',background:'#0A0806' }}>
      <div style={{ color:'#C9A84C',fontFamily:'Cinzel,serif',fontSize:'12px',letterSpacing:'0.3em' }}>LOADING...</div>
    </div>
  )
  return user ? <>{children}</> : <Navigate to="/admin/login" replace />
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
      <WishlistProvider>
      <BrowserRouter>
        <Cursor />
        <WhatsAppBubble />
        <Toaster
          position="top-right"
          toastOptions={{
            style: { background: '#1A1710', color: '#F9F4EC', border: '1px solid rgba(201,168,76,0.3)', fontFamily: 'Jost, sans-serif', fontSize: '13px' },
            success: { iconTheme: { primary: '#C9A84C', secondary: '#0A0806' } },
          }}
        />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/collections" element={<Collections />} />
          <Route path="/collections/:id" element={<CollectionDetail />} />
          <Route path="/lookbook" element={<Lookbook />} />
          <Route path="/services" element={<Services />} />
          <Route path="/book" element={<BookingPage />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/bespoke" element={<BespokeConfigurator />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/order-confirmation" element={<OrderConfirmation />} />
          <Route path="/dress-my-occasion" element={<DressMyOccasion />} />
          <Route path="/aso-ebi" element={<AsoEbiCoordinator />} />
          <Route path="/style-quiz" element={<StyleQuiz />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/outfit-builder" element={<OutfitBuilder />} />
          <Route path="/fabrics" element={<FabricSwatches />} />
          <Route path="/spotlight" element={<ClientSpotlight />} />
          <Route path="/loyalty" element={<LoyaltyProgramme />} />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="bookings" element={<AdminBookings />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="gallery" element={<AdminGallery />} />
            <Route path="content" element={<AdminContent />} />
            <Route path="messages" element={<AdminMessages />} />
            <Route path="testimonials" element={<AdminTestimonials />} />
            <Route path="aso-ebi" element={<AdminAsoEbi />} />
            <Route path="staff" element={<AdminStaff />} />
          </Route>
        </Routes>
      </BrowserRouter>
      </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  )
}

export default App
