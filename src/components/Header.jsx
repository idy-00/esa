import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Phone, Mail } from 'lucide-react'
import logo from '../assets/logo.jpg'
import './Header.css'

const navItems = [
  { path: '/', label: 'Accueil' },
  { path: '/a-propos', label: 'À propos' },
  { path: '/formations', label: 'Formations' },
  { path: '/actualites', label: 'Actualités' },
  { path: '/vie-etudiante', label: 'Vie étudiante' },
  { path: '/contact', label: 'Contact' },
]

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <div className="topbar">
        <div className="container topbar-content">
          <div className="topbar-right">
            <a href="tel:+221338580004" className="topbar-item">
              <Phone size={13} />
              <span>+221 33 858 00 04</span>
            </a>
            <span className="topbar-divider" />
            <a href="mailto:contact@esa.sn" className="topbar-item">
              <Mail size={13} />
              <span>contact@esa.sn</span>
            </a>
          </div>
        </div>
      </div>

      <header className="header">
        <div className="container header-content">
          <Link to="/" className="logo">
            <img src={logo} alt="ESA" />
          </Link>

          <nav className="nav-desktop">
            {navItems.map(item => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
              >
                {item.label}
              </NavLink>
            ))}
            <Link to="/contact" className="btn btn-cta">
              Candidater
            </Link>
          </nav>

          <button
            className="menu-toggle"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.nav
              className="nav-mobile"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              {navItems.map(item => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </NavLink>
              ))}
              <Link to="/contact" className="btn btn-cta" onClick={() => setIsOpen(false)}>
                Candidater
              </Link>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>
    </>
  )
}
