import { Link } from 'react-router-dom'
import { MapPin, Phone, Mail, Clock } from 'lucide-react'
import logo from '../assets/logo.jpg'
import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <img src={logo} alt="ESA" className="footer-logo" />
            <p className="footer-tagline">
              Partenaire de l'Industrie du Transport Aérien
            </p>
            <p className="footer-desc">
              École d'enseignement supérieur spécialisée dans la formation
              et la recherche en transport aérien depuis 2018.
            </p>
          </div>

          <div className="footer-links">
            <h4>Navigation</h4>
            <ul>
              <li><Link to="/">Accueil</Link></li>
              <li><Link to="/a-propos">À propos</Link></li>
              <li><Link to="/formations">Formations</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>

          <div className="footer-links">
            <h4>Formations</h4>
            <ul>
              <li><Link to="/formations">BTS / DTS</Link></li>
              <li><Link to="/formations">Licence Professionnelle</Link></li>
              <li><Link to="/formations">Master 1 & 2</Link></li>
              <li><Link to="/formations">Formations Continues</Link></li>
            </ul>
          </div>

          <div className="footer-contact">
            <h4>Contact</h4>
            <ul>
              <li>
                <MapPin size={18} />
                <a href="https://maps.google.com/?q=HLM+Grand+Yoff+Villa+723+Dakar" target="_blank" rel="noopener noreferrer">
                  HLM Grand Yoff, Villa N° 723<br />BP: 13952 – CP 11500, Dakar
                </a>
              </li>
              <li>
                <Phone size={18} />
                <span>
                  <a href="tel:+221338580004">+221 33 858 00 04</a><br />
                  <a href="tel:+221777261233">+221 77 726 12 33</a>
                </span>
              </li>
              <li>
                <Mail size={18} />
                <a href="mailto:contact@esa.sn">contact@esa.sn</a>
              </li>
              <li>
                <Clock size={18} />
                <span>Lun - Ven : 8h - 18h</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} École Supérieure Aéronautique. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  )
}
