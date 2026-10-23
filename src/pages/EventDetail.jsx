import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import SEOMeta from '../seo/SEOMeta'
import { breadcrumbSchema } from '../seo/schemas'
import PhotoViewer from '../components/PhotoViewer'
import PageLoader from '../components/PageLoader'
import { EventCard, EventMeta } from './Actualites'
import { useSiteContent, isPublished, paragraphs } from '../content/siteContent'

import './Actualites.css'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
}

const stagger = {
  visible: { transition: { staggerChildren: 0.06 } }
}

export default function EventDetail() {
  const { id } = useParams()
  const content = useSiteContent()
  const [viewerIndex, setViewerIndex] = useState(null)

  if (!content) return <PageLoader />

  const events = content.actualites.events.filter(isPublished)
  const event = events.find((e) => e.id === id)

  if (!event) {
    return (
      <section className="container event-not-found">
        <h1>Événement introuvable</h1>
        <p>Cet événement n'existe pas ou n'est plus en ligne.</p>
        <Link to="/actualites" className="btn btn-primary">Voir toutes les actualités</Link>
      </section>
    )
  }

  const others = events.filter((e) => e.id !== event.id).slice(0, 3)

  return (
    <>
      <SEOMeta
        title={`${event.title} - Actualités ESA`}
        description={event.summary || paragraphs(event.body)[0]?.slice(0, 160) || event.title}
        canonical={`/actualites/${event.id}`}
        ogImage={event.cover ? `https://esa.sn${event.cover}` : undefined}
        schemas={[
          breadcrumbSchema([
            { name: 'Accueil', path: '/' },
            { name: 'Actualités', path: '/actualites' },
            { name: event.title, path: `/actualites/${event.id}` }
          ])
        ]}
      />

      <section className="hero-simple">
        <div className="container hero-simple-content">
          <motion.div initial="hidden" animate="visible" variants={stagger}>
            <motion.div variants={fadeUp}><EventMeta event={event} /></motion.div>
            <motion.h1 variants={fadeUp}>{event.title}</motion.h1>
            {event.summary && <motion.p variants={fadeUp}>{event.summary}</motion.p>}
          </motion.div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <Link to="/actualites" className="event-back">
            <ArrowLeft size={16} /> Toutes les actualités
          </Link>

          {paragraphs(event.body).length > 0 && (
            <div className="event-detail-body">
              {paragraphs(event.body).map((p, i) => <p key={i}>{p}</p>)}
            </div>
          )}

          {event.photos.length > 0 ? (
            <motion.div
              className="cocktail-gallery mt-4"
              initial="hidden"
              animate="visible"
              variants={stagger}
            >
              {event.photos.map((photo, i) => (
                <motion.button
                  key={photo.src + i}
                  className="gallery-item"
                  variants={fadeUp}
                  onClick={() => setViewerIndex(i)}
                >
                  <img src={photo.src} alt={photo.alt || `${event.title} ${i + 1}`} loading="lazy" />
                </motion.button>
              ))}
            </motion.div>
          ) : event.cover && (
            <img src={event.cover} alt={event.title} className="event-detail-cover" />
          )}
        </div>
      </section>

      {others.length > 0 && (
        <section className="section section-gray">
          <div className="container">
            <div className="section-header center">
              <h2>Autres actualités</h2>
            </div>
            <motion.div
              className="events-grid mt-4"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={stagger}
            >
              {others.map((e) => <EventCard key={e.id} event={e} />)}
            </motion.div>
          </div>
        </section>
      )}

      {viewerIndex !== null && (
        <PhotoViewer
          title={event.title}
          photos={event.photos}
          startIndex={viewerIndex}
          onClose={() => setViewerIndex(null)}
        />
      )}
    </>
  )
}
