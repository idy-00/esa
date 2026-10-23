import { useEffect, useState } from 'react'
import { NavLink, Route, Routes, Navigate, useLocation } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import {
  LayoutDashboard, CalendarDays, Clapperboard, Users, Newspaper, Images, History,
  UserCog, LogOut, ExternalLink, Menu, X, Loader2,
} from 'lucide-react'
import { AuthProvider, ContentProvider, ConfirmProvider, ToastProvider, useAuth, useContent } from './context'
import Login from './Login'
import Dashboard from './pages/Dashboard'
import Events from './pages/Events'
import EventEditor from './pages/EventEditor'
import Videos from './pages/Videos'
import StudentLife from './pages/StudentLife'
import NewsPage from './pages/NewsPage'
import Media from './pages/Media'
import HistoryPage from './pages/History'
import Accounts from './pages/Accounts'
import logo from '../assets/logo.jpg'
import './admin.css'

const NAV = [
  { to: '/admin', label: 'Tableau de bord', icon: LayoutDashboard, end: true },
  { to: '/admin/evenements', label: 'Événements', icon: CalendarDays },
  { to: '/admin/videos', label: 'Vidéos', icon: Clapperboard },
  { to: '/admin/vie-etudiante', label: 'Vie étudiante', icon: Users },
  { to: '/admin/page-actualites', label: 'Page Actualités', icon: Newspaper },
  { to: '/admin/mediatheque', label: 'Médiathèque', icon: Images },
  { to: '/admin/historique', label: 'Historique', icon: History },
  { to: '/admin/comptes', label: 'Mon compte', icon: UserCog },
]

function Shell() {
  const { user, logout } = useAuth()
  const { loading, error, reload } = useContent()
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const [lastPath, setLastPath] = useState(location.pathname)
  if (lastPath !== location.pathname) {
    setLastPath(location.pathname)
    setMenuOpen(false)
  }

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  return (
    <div className="adm-shell">
      <aside className={`adm-sidebar ${menuOpen ? 'is-open' : ''}`}>
        <div className="adm-brand">
          <img src={logo} alt="" />
          <div>
            <strong>ESA</strong>
            <span>Administration</span>
          </div>
          <button className="adm-menu-close" onClick={() => setMenuOpen(false)} aria-label="Fermer le menu"><X size={22} /></button>
        </div>
        <nav className="adm-nav">
          {NAV.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end}>
              <Icon size={19} />
              {to === '/admin/comptes' && user.role === 'admin' ? 'Comptes' : label}
            </NavLink>
          ))}
        </nav>
        <div className="adm-sidebar-foot">
          <a href="/" target="_blank" rel="noreferrer"><ExternalLink size={17} /> Voir le site</a>
          <button onClick={logout}><LogOut size={17} /> Se déconnecter</button>
        </div>
      </aside>
      {menuOpen && <div className="adm-sidebar-backdrop" onClick={() => setMenuOpen(false)} />}

      <div className="adm-main">
        <header className="adm-topbar">
          <button className="adm-menu-btn" onClick={() => setMenuOpen(true)} aria-label="Ouvrir le menu"><Menu size={22} /></button>
          <span className="adm-topbar-title">Tableau d'administration du site ESA</span>
          <span className="adm-user">
            <span className="adm-avatar">{user.name.slice(0, 1).toUpperCase()}</span>
            <span className="adm-user-name">{user.name}</span>
          </span>
        </header>

        <main className="adm-content">
          {loading ? (
            <div className="adm-center"><Loader2 className="adm-spin" size={32} /></div>
          ) : error ? (
            <div className="adm-card adm-center-card">
              <p>{error}</p>
              <button className="adm-btn adm-btn-primary" onClick={reload}>Réessayer</button>
            </div>
          ) : (
            <Routes>
              <Route index element={<Dashboard />} />
              <Route path="evenements" element={<Events />} />
              <Route path="evenements/:id" element={<EventEditor />} />
              <Route path="videos" element={<Videos />} />
              <Route path="vie-etudiante" element={<StudentLife />} />
              <Route path="page-actualites" element={<NewsPage />} />
              <Route path="mediatheque" element={<Media />} />
              <Route path="historique" element={<HistoryPage />} />
              <Route path="comptes" element={<Accounts />} />
              <Route path="*" element={<Navigate to="/admin" replace />} />
            </Routes>
          )}
        </main>
      </div>
    </div>
  )
}

function Gate() {
  const { user } = useAuth()
  if (user === undefined) return <div className="adm-center adm-fullscreen"><Loader2 className="adm-spin" size={32} /></div>
  if (!user) return <Login />
  return (
    <ContentProvider>
      <Shell />
    </ContentProvider>
  )
}

export default function AdminApp() {
  return (
    <div className="adm-root">
      <Helmet>
        <title>Administration | ESA</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <ToastProvider>
        <ConfirmProvider>
          <AuthProvider>
            <Routes>
              <Route path="/admin/*" element={<Gate />} />
            </Routes>
          </AuthProvider>
        </ConfirmProvider>
      </ToastProvider>
    </div>
  )
}
