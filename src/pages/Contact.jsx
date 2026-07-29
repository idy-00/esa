import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  MapPin, Phone, Mail, Clock, Send, CheckCircle
} from 'lucide-react'
import './Contact.css'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
}

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } }
}

const contactInfo = [
  {
    icon: MapPin,
    title: 'Adresse',
    lines: ['HLM Grand Yoff, Villa N° 723', 'BP: 13952 – CP 11500', 'Dakar, Sénégal']
  },
  {
    icon: Phone,
    title: 'Téléphone',
    lines: ['+221 33 858 00 04', '+221 77 726 12 33']
  },
  {
    icon: Mail,
    title: 'Email',
    lines: ['contact@esa.sn', 'information@esa.sn']
  },
  {
    icon: Clock,
    title: 'Horaires',
    lines: ['Lundi - Vendredi', '08h00 - 18h00']
  },
]

export default function Contact() {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    formation: '',
    message: ''
  })
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <>
      {/* Hero simple */}
      <section className="hero-simple">
        <div className="container">
          <motion.div
            className="hero-simple-content"
            initial="hidden"
            animate="visible"
            variants={stagger}
          >
            <motion.span className="hero-eyebrow" variants={fadeUp}>Contact</motion.span>
            <motion.h1 variants={fadeUp}>Parlons de votre projet</motion.h1>
            <motion.p variants={fadeUp}>
              Une question sur nos formations ? Une demande d'inscription ?
              Notre équipe est à votre disposition.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Contact section */}
      <section className="section">
        <div className="container">
          <div className="contact-grid">
            {/* Info */}
            <motion.div
              className="contact-info"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={stagger}
            >
              <motion.h2 variants={fadeUp}>Informations de contact</motion.h2>
              <motion.p className="text-soft mb-4" variants={fadeUp}>
                Venez nous rencontrer sur le campus ou contactez-nous
                par téléphone ou email.
              </motion.p>

              <motion.div className="info-cards" variants={stagger}>
                {contactInfo.map((info, i) => (
                  <motion.div key={i} className="info-card" variants={fadeUp}>
                    <div className="info-icon">
                      <info.icon size={20} strokeWidth={1.5} />
                    </div>
                    <div>
                      <h4>{info.title}</h4>
                      {info.lines.map((line, j) => (
                        <p key={j}>{line}</p>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            {/* Form */}
            <motion.div
              className="contact-form-wrapper"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              {submitted ? (
                <div className="form-success">
                  <CheckCircle size={48} />
                  <h3>Message envoyé !</h3>
                  <p>
                    Merci pour votre message. Notre équipe vous répondra
                    dans les plus brefs délais.
                  </p>
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      setSubmitted(false)
                      setFormData({
                        nom: '', prenom: '', email: '',
                        telephone: '', formation: '', message: ''
                      })
                    }}
                  >
                    Envoyer un autre message
                  </button>
                </div>
              ) : (
                <>
                  <h3>Demande d'information</h3>
                  <p className="text-soft mb-3">
                    Remplissez le formulaire ci-dessous et nous vous répondrons rapidement.
                  </p>
                  <form onSubmit={handleSubmit} className="contact-form">
                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="nom">Nom *</label>
                        <input
                          type="text"
                          id="nom"
                          name="nom"
                          value={formData.nom}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="prenom">Prénom *</label>
                        <input
                          type="text"
                          id="prenom"
                          name="prenom"
                          value={formData.prenom}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="email">Email *</label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="telephone">Téléphone</label>
                        <input
                          type="tel"
                          id="telephone"
                          name="telephone"
                          value={formData.telephone}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="formation">Formation souhaitée</label>
                      <select
                        id="formation"
                        name="formation"
                        value={formData.formation}
                        onChange={handleChange}
                      >
                        <option value="">Sélectionnez une formation</option>
                        <option value="bts">BTS / DTS</option>
                        <option value="licence">Licence Professionnelle</option>
                        <option value="master1">Master 1</option>
                        <option value="master2">Master 2</option>
                        <option value="continue">Formation Continue</option>
                        <option value="autre">Autre / Information générale</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label htmlFor="message">Message *</label>
                      <textarea
                        id="message"
                        name="message"
                        rows="5"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        placeholder="Décrivez votre demande..."
                      />
                    </div>

                    <button type="submit" className="btn btn-primary btn-block">
                      <Send size={18} />
                      Envoyer le message
                    </button>
                  </form>
                </>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Map placeholder */}
      <section className="map-section">
        <div className="map-placeholder">
          <MapPin size={48} strokeWidth={1} />
          <p>HLM Grand Yoff, Villa N° 723, Dakar</p>
          <a
            href="https://maps.google.com/?q=HLM+Grand+Yoff+Dakar"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline"
          >
            Voir sur Google Maps
          </a>
        </div>
      </section>
    </>
  )
}
