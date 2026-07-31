import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Users, Heart, Plane, Camera, ArrowRight, X } from 'lucide-react'

import hangarGroupe from '../assets/images/immersion/hangar-groupe.jpeg'
import maintenanceAvion from '../assets/images/immersion/maintenance-avion.jpeg'
import visiteAvion from '../assets/images/immersion/visite-avion.jpeg'
import aeroportDeparts from '../assets/images/immersion/aeroport-departs.jpeg'
import cockpit from '../assets/images/immersion/cockpit.jpeg'
import aibdHall from '../assets/images/immersion/aibd-hall.jpeg'
import hangarMarche from '../assets/images/immersion/hangar-marche.jpeg'

import groupWomen from '../assets/images/optimized/group-women.webp'
import groupMen from '../assets/images/optimized/group-men.webp'
import ceremonyAward from '../assets/images/optimized/ceremony-award.webp'
import studentsKakemono from '../assets/images/optimized/students-kakemono.webp'
import airportWomen from '../assets/images/optimized/airport-women.webp'
import airportMen from '../assets/images/optimized/airport-men.webp'

import './VieEtudiante.css'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
}

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } }
}

const immersionPhotos = [
  { src: aibdHall, alt: 'Étudiants dans le hall de l\'aéroport AIBD' },
  { src: aeroportDeparts, alt: 'Étudiants devant les départs' },
  { src: hangarGroupe, alt: 'Groupe d\'étudiants dans le hangar' },
  { src: hangarMarche, alt: 'Étudiants visitant le hangar' },
  { src: visiteAvion, alt: 'Visite d\'un avion' },
  { src: cockpit, alt: 'Découverte du cockpit' },
  { src: maintenanceAvion, alt: 'Pratique maintenance avion' },
]

const galeriePhotos = [
  { src: groupWomen, alt: 'Étudiantes ESA' },
  { src: groupMen, alt: 'Étudiants ESA' },
  { src: studentsKakemono, alt: 'Étudiants devant kakémono' },
  { src: airportWomen, alt: 'Visite aéroport - étudiantes' },
  { src: airportMen, alt: 'Visite aéroport - étudiants' },
  { src: ceremonyAward, alt: 'Cérémonie de remise de prix' },
  ...immersionPhotos,
]

export default function VieEtudiante() {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [currentPhoto, setCurrentPhoto] = useState(0)

  const openLightbox = (index) => {
    setCurrentPhoto(index)
    setLightboxOpen(true)
  }

  return (
    <>
      {/* Hero */}
      <section className="hero-page">
        <img src={ceremonyAward} alt="Vie étudiante ESA" className="hero-page-bg" />
        <div className="hero-page-overlay" />
        <div className="container hero-page-content">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
          >
            <motion.span className="hero-eyebrow" variants={fadeUp}>Vie étudiante</motion.span>
            <motion.h1 variants={fadeUp}>
              Une communauté<br />dynamique et solidaire
            </motion.h1>
            <motion.p className="hero-page-text" variants={fadeUp}>
              Découvrez l'environnement épanouissant et les activités
              qui rythment le quotidien de nos étudiants.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Amicale des Étudiants */}
      <section className="section">
        <div className="container">
          <div className="amicale-grid">
            <motion.div
              className="amicale-content"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={stagger}
            >
              <motion.h2 variants={fadeUp}>L'Amicale des Étudiants</motion.h2>
              <motion.p className="amicale-text" variants={fadeUp}>
                L'Amicale des étudiants de l'ESA a été créée pour le renforcement
                des liens fraternels et relationnels dans un environnement de travail
                avec un même objectif de travail et de réussite.
              </motion.p>
              <motion.p className="amicale-text" variants={fadeUp}>
                Avec ses différents programmes socio-éducatifs, elle offre un cadre
                à la fois studieux et jovial de communion et de solidarité propice
                à l'épanouissement de nos étudiants au sein du campus mais également
                à l'extérieur.
              </motion.p>
              <motion.div className="amicale-features" variants={stagger}>
                <motion.div className="feature-item" variants={fadeUp}>
                  <Users size={24} />
                  <span>Liens fraternels</span>
                </motion.div>
                <motion.div className="feature-item" variants={fadeUp}>
                  <Heart size={24} />
                  <span>Solidarité</span>
                </motion.div>
                <motion.div className="feature-item" variants={fadeUp}>
                  <Plane size={24} />
                  <span>Épanouissement</span>
                </motion.div>
              </motion.div>
            </motion.div>
            <motion.div
              className="amicale-image"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <img src={studentsKakemono} alt="Étudiants ESA" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Immersion Professionnelle */}
      <section className="section section-gray">
        <div className="container">
          <motion.div
            className="section-header center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <h2>Immersion Professionnelle</h2>
            <p className="text-soft">
              Nos étudiants découvrent le terrain : aéroport AIBD, hangars, avions
            </p>
          </motion.div>

          <motion.div
            className="immersion-gallery mt-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            {immersionPhotos.map((photo, i) => (
              <motion.div
                key={i}
                className={`immersion-item ${i === 0 ? 'immersion-large' : ''}`}
                variants={fadeUp}
                onClick={() => openLightbox(i + 6)}
              >
                <img src={photo.src} alt={photo.alt} loading="lazy" />
                <div className="immersion-overlay">
                  <Camera size={24} />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Galerie Photos & Vidéos */}
      <section className="section">
        <div className="container">
          <motion.div
            className="section-header center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <h2>Galerie Photos</h2>
            <p className="text-soft">
              Les moments forts de la vie à l'ESA
            </p>
          </motion.div>

          <motion.div
            className="galerie-grid mt-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            {galeriePhotos.map((photo, i) => (
              <motion.div
                key={i}
                className="galerie-item"
                variants={fadeUp}
                onClick={() => openLightbox(i)}
              >
                <img src={photo.src} alt={photo.alt} loading="lazy" />
                <div className="galerie-overlay">
                  <Camera size={20} />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta">
        <div className="container text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            <motion.h2 variants={fadeUp} style={{ color: 'white' }}>
              Rejoignez notre communauté
            </motion.h2>
            <motion.p variants={fadeUp} style={{ color: 'rgba(255,255,255,0.9)', marginBottom: '2rem' }}>
              Devenez membre de la famille ESA et vivez une expérience unique.
            </motion.p>
            <motion.div variants={fadeUp}>
              <Link to="/contact" className="btn btn-white">
                S'inscrire maintenant
                <ArrowRight size={18} />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Lightbox */}
      {lightboxOpen && (
        <div className="lightbox" onClick={() => setLightboxOpen(false)}>
          <button className="lightbox-close" onClick={() => setLightboxOpen(false)}>
            <X size={32} />
          </button>
          <img src={galeriePhotos[currentPhoto].src} alt={galeriePhotos[currentPhoto].alt} />
        </div>
      )}
    </>
  )
}
