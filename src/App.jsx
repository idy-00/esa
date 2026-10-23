import { lazy, Suspense, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import ScrollToTop from './components/ScrollToTop'
import Header from './components/Header'
import Footer from './components/Footer'
import PageLoader from './components/PageLoader'
import Home from './pages/Home'
import About from './pages/About'
import Formations from './pages/Formations'
import Actualites from './pages/Actualites'
import EventDetail from './pages/EventDetail'
import VieEtudiante from './pages/VieEtudiante'
import Contact from './pages/Contact'
import { organizationSchema, websiteSchema } from './seo/schemas'
import { trackPageView } from './lib/track'

// Le dashboard n'est chargé que pour les personnes qui ouvrent /admin.
const AdminApp = lazy(() => import('./admin/AdminApp'))

export default function App() {
  const { pathname } = useLocation()
  const isAdmin = pathname === '/admin' || pathname.startsWith('/admin/')

  useEffect(() => {
    if (!isAdmin) trackPageView(pathname)
  }, [pathname, isAdmin])

  if (isAdmin) {
    return (
      <Suspense fallback={<PageLoader />}>
        <AdminApp />
      </Suspense>
    )
  }

  return (
    <>
      {/* Schemas globaux injectés une seule fois */}
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(websiteSchema)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(organizationSchema)}
        </script>
      </Helmet>

      <ScrollToTop />
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/a-propos" element={<About />} />
          <Route path="/formations" element={<Formations />} />
          <Route path="/actualites" element={<Actualites />} />
          <Route path="/actualites/:id" element={<EventDetail />} />
          <Route path="/vie-etudiante" element={<VieEtudiante />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </main>
      <Footer />
    </>
  )
}
