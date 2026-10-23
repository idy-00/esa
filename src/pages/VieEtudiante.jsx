import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Users, Heart, Plane, Camera, ArrowRight } from 'lucide-react'
import SEOMeta from '../seo/SEOMeta'
import { breadcrumbSchema } from '../seo/schemas'
import PhotoViewer from '../components/PhotoViewer'
import PageLoader from '../components/PageLoader'
import { useSiteContent, isPublished, paragraphs } from '../content/siteContent'

import './VieEtudiante.css'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
}

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } }
}

function Album({ album, gray, onOpen }) {
  const mosaic = album.layout === 'mosaic'
  return (
    <section className={`section ${gray ? 'section-gray' : ''}`}>
      <div className="container">
        <motion.div
          className="section-header center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
        >
          <h2>{album.title}</h2>
          {album.subtitle && <p className="text-soft">{album.subtitle}</p>}
        </motion.div>

        <motion.div
          className={`${mosaic ? 'immersion-gallery' : 'galerie-grid'} mt-4`}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
        >
          {album.photos.map((photo, i) => (
            <motion.button
              key={photo.src + i}
              className={mosaic ? `immersion-item ${i === 0 ? 'immersion-large' : ''}` : 'galerie-item'}
              variants={fadeUp}
              onClick={() => onOpen(album, i)}
              aria-label={photo.alt || `${album.title} - photo ${i + 1}`}
            >
              <img src={photo.src} alt={photo.alt} loading="lazy" />
              <div className={mosaic ? 'immersion-overlay' : 'galerie-overlay'}>
                <Camera size={mosaic ? 24 : 20} />
              </div>
            </motion.button>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default function VieEtudiante() {
  const content = useSiteContent()
  const [viewer, setViewer] = useState(null)

  const seo = (
    <SEOMeta
      title="Vie Étudiante - Campus et Activités ESA"
      description="Découvrez la vie étudiante à l'ESA : Amicale des Étudiants, immersions professionnelles à l'aéroport AIBD, visites de hangars, galerie photos. Une communauté dynamique à Dakar, Sénégal."
      canonical="/vie-etudiante"
      schemas={[
        breadcrumbSchema([
          { name: 'Accueil', path: '/' },
          { name: 'Vie Étudiante', path: '/vie-etudiante' }
        ])
      ]}
    />
  )

  if (!content) return <>{seo}<PageLoader /></>

  const page = content.vieEtudiante
  const albums = page.albums.filter((a) => isPublished(a) && a.photos.length > 0)

  return (
    <>
      {seo}

      {/* Hero */}
      <section className="hero-page">
        {page.hero.image && <img src={page.hero.image} alt="" className="hero-page-bg" />}
        <div className="hero-page-overlay" />
        <div className="container hero-page-content">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
          >
            {page.hero.eyebrow && <motion.span className="hero-eyebrow" variants={fadeUp}>{page.hero.eyebrow}</motion.span>}
            <motion.h1 variants={fadeUp}>
              {page.hero.title}
            </motion.h1>
            {page.hero.text && <motion.p className="hero-page-text" variants={fadeUp}>{page.hero.text}</motion.p>}
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
              <motion.h2 variants={fadeUp}>{page.amicale.title}</motion.h2>
              {paragraphs(page.amicale.text).map((p, i) => (
                <motion.p key={i} className="amicale-text" variants={fadeUp}>{p}</motion.p>
              ))}
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
            {page.amicale.image && (
              <motion.div
                className="amicale-image"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <img src={page.amicale.image} alt={page.amicale.title} />
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* Albums photos */}
      {albums.map((album, i) => (
        <Album
          key={album.id}
          album={album}
          gray={i % 2 === 0}
          onOpen={(a, index) => setViewer({ title: a.title, photos: a.photos, index })}
        />
      ))}

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

      {viewer && (
        <PhotoViewer
          title={viewer.title}
          photos={viewer.photos}
          startIndex={viewer.index}
          onClose={() => setViewer(null)}
        />
      )}
    </>
  )
}
