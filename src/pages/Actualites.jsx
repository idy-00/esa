import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Calendar, MapPin, ArrowRight, Images } from 'lucide-react'
import SEOMeta from '../seo/SEOMeta'
import { breadcrumbSchema } from '../seo/schemas'
import PhotoViewer from '../components/PhotoViewer'
import PageLoader from '../components/PageLoader'
import { useSiteContent, isPublished, isUpcoming, formatEventDate, paragraphs } from '../content/siteContent'

import './Actualites.css'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
}

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } }
}

const FEATURED_PREVIEW = 8

function SectionHeader({ title, subtitle }) {
  return (
    <motion.div
      className="section-header center"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={fadeUp}
    >
      <h2>{title}</h2>
      {subtitle && <p className="text-soft">{subtitle}</p>}
    </motion.div>
  )
}

export function VideoBlock({ video }) {
  return (
    <motion.div
      className="video-interview mt-4"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={fadeUp}
    >
      {video.youtube ? (
        <div className="video-embed">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${video.youtube}`}
            title={video.title}
            loading="lazy"
            allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      ) : (
        <video controls preload="metadata" poster={video.poster || undefined} className="interview-video">
          <source src={video.src} type={video.src.endsWith('.webm') ? 'video/webm' : 'video/mp4'} />
          Votre navigateur ne supporte pas la lecture de vidéos.
        </video>
      )}
      {video.description && (
        <div className="interview-caption">
          {paragraphs(video.description).map((p, i) => <p key={i}>{p}</p>)}
        </div>
      )}
    </motion.div>
  )
}

export function EventMeta({ event }) {
  if (!event.date && !event.location) return null
  return (
    <div className="event-meta">
      {event.date && <span><Calendar size={14} /> {formatEventDate(event.date, event.endDate)}</span>}
      {event.location && <span><MapPin size={14} /> {event.location}</span>}
    </div>
  )
}

export function EventCard({ event }) {
  const photoCount = event.photos.length
  return (
    <motion.div className="event-card" variants={fadeUp}>
      <Link to={`/actualites/${event.id}`} className="event-card-link">
        {event.cover && <img src={event.cover} alt={event.title} loading="lazy" />}
        <div className="event-info">
          <EventMeta event={event} />
          <h4>{event.title}</h4>
          {event.summary && <p>{event.summary}</p>}
          <span className="gallery-btn">
            {photoCount > 0 ? <><Images size={16} /> Voir les photos ({photoCount})</> : <>Lire la suite <ArrowRight size={14} /></>}
          </span>
        </div>
      </Link>
    </motion.div>
  )
}

export default function Actualites() {
  const content = useSiteContent()
  const [viewer, setViewer] = useState(null)

  const seo = (
    <SEOMeta
      title="Actualités - Événements et Vie de l'ESA"
      description="Suivez l'actualité de l'École Supérieure Aéronautique : événements étudiants, cérémonies, 72H d'activités socio-éducatives, réunions d'agrément BTS. Vie dynamique du campus à Dakar."
      canonical="/actualites"
      schemas={[
        breadcrumbSchema([
          { name: 'Accueil', path: '/' },
          { name: 'Actualités', path: '/actualites' }
        ])
      ]}
    />
  )

  if (!content) return <>{seo}<PageLoader /></>

  const page = content.actualites
  const events = page.events.filter(isPublished)
  const upcoming = events.filter(isUpcoming).sort((a, b) => a.date.localeCompare(b.date))
  const featured = events.filter((e) => e.featured && !isUpcoming(e))
  const videos = page.videos.filter(isPublished)

  return (
    <>
      {seo}

      {/* Hero */}
      <section className="hero-simple">
        <div className="container hero-simple-content">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
          >
            {page.hero.eyebrow && <motion.span className="hero-eyebrow" variants={fadeUp}>{page.hero.eyebrow}</motion.span>}
            <motion.h1 variants={fadeUp}>
              {page.hero.title}
            </motion.h1>
            {page.hero.text && <motion.p variants={fadeUp}>{page.hero.text}</motion.p>}
          </motion.div>
        </div>
      </section>

      {/* Événements à venir */}
      {upcoming.length > 0 && (
        <section className="section section-upcoming">
          <div className="container">
            <SectionHeader title="Événements à venir" subtitle="Ne manquez pas les prochains rendez-vous de l'ESA" />
            <motion.div
              className="upcoming-list mt-4"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={stagger}
            >
              {upcoming.map((event) => {
                const d = new Date(`${event.date}T12:00:00`)
                return (
                  <motion.div key={event.id} variants={fadeUp}>
                    <Link to={`/actualites/${event.id}`} className="upcoming-item">
                      <div className="upcoming-date">
                        <span className="upcoming-day">{d.getDate()}</span>
                        <span className="upcoming-month">{d.toLocaleDateString('fr-FR', { month: 'short' })}</span>
                      </div>
                      <div className="upcoming-body">
                        <h4>{event.title}</h4>
                        <EventMeta event={event} />
                        {event.summary && <p>{event.summary}</p>}
                      </div>
                      <ArrowRight size={20} className="upcoming-arrow" />
                    </Link>
                  </motion.div>
                )
              })}
            </motion.div>
          </div>
        </section>
      )}

      {/* Notre Communauté */}
      {page.community.photos.length > 0 && (
        <section className="section">
          <div className="container">
            <SectionHeader title={page.community.title} subtitle={page.community.subtitle} />

            <motion.div
              className="community-grid mt-4"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={stagger}
            >
              {page.community.photos.map((photo, i) => (
                <motion.div key={photo.src + i} className={`community-item ${i === 0 ? 'community-wide' : ''}`} variants={fadeUp}>
                  <img src={photo.src} alt={photo.alt} loading="lazy" />
                  {photo.alt && <div className="community-label">{photo.alt}</div>}
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* Vidéos */}
      {videos.map((video) => (
        <section key={video.id} className="section section-gray">
          <div className="container">
            <SectionHeader title={video.title} subtitle={video.subtitle} />
            <VideoBlock video={video} />
          </div>
        </section>
      ))}

      {/* Événements mis en avant */}
      {featured.map((event, n) => (
        <section key={event.id} className={`section ${n % 2 === 0 ? 'section-gray' : ''}`}>
          <div className="container">
            <SectionHeader title={event.title} subtitle={event.summary} />

            {paragraphs(event.body).slice(0, 1).map((p, i) => (
              <motion.div
                key={i}
                className="cocktail-intro mt-4"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
              >
                <p>{p}</p>
              </motion.div>
            ))}

            {event.photos.length > 0 && (
              <motion.div
                className="cocktail-gallery mt-4"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={stagger}
              >
                {event.photos.slice(0, FEATURED_PREVIEW).map((photo, i) => (
                  <motion.button
                    key={photo.src + i}
                    className="gallery-item"
                    variants={fadeUp}
                    onClick={() => setViewer({ title: event.title, photos: event.photos, index: i })}
                  >
                    <img src={photo.src} alt={photo.alt || `${event.title} ${i + 1}`} loading="lazy" />
                  </motion.button>
                ))}
              </motion.div>
            )}

            {paragraphs(event.body).slice(1).map((p, i) => (
              <motion.div
                key={i}
                className="cocktail-intro mt-4"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
              >
                <p>{p}</p>
              </motion.div>
            ))}

            <div className="featured-more mt-4">
              <Link to={`/actualites/${event.id}`} className="gallery-btn">
                {event.photos.length > FEATURED_PREVIEW
                  ? <><Images size={16} /> Voir les {event.photos.length} photos</>
                  : <>Voir l'événement <ArrowRight size={14} /></>}
              </Link>
            </div>
          </div>
        </section>
      ))}

      {/* Événements et Cérémonies */}
      {events.length > 0 && (
        <section className="section">
          <div className="container">
            <SectionHeader title={page.eventsSection.title} subtitle={page.eventsSection.subtitle} />

            <motion.div
              className="events-grid mt-4"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={stagger}
            >
              {events.map((event) => <EventCard key={event.id} event={event} />)}
            </motion.div>
          </div>
        </section>
      )}

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
              Découvrez la vie étudiante
            </motion.h2>
            <motion.p variants={fadeUp} style={{ color: 'rgba(255,255,255,0.9)', marginBottom: '2rem' }}>
              Rejoignez une communauté dynamique et épanouissante.
            </motion.p>
            <motion.div variants={fadeUp}>
              <Link to="/vie-etudiante" className="btn btn-white">
                Vie étudiante
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
