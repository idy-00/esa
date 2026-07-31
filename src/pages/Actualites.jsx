import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Calendar, Users, ArrowRight } from 'lucide-react'

import cocktailGroupe1 from '../assets/images/cocktail/groupe-1.jpeg'
import cocktailGroupe2 from '../assets/images/cocktail/groupe-2.jpeg'
import cocktailConviv1 from '../assets/images/cocktail/convivialite-1.jpeg'
import cocktailConviv2 from '../assets/images/cocktail/convivialite-2.jpeg'
import cocktailConviv3 from '../assets/images/cocktail/convivialite-3.jpeg'
import cocktailEchange1 from '../assets/images/cocktail/echange-1.jpeg'
import cocktailEchange2 from '../assets/images/cocktail/echange-2.jpeg'
import cocktailEchange3 from '../assets/images/cocktail/echange-3.jpeg'

import groupWomen from '../assets/images/optimized/group-women.webp'
import groupMen from '../assets/images/optimized/group-men.webp'
import eventSpeech from '../assets/images/optimized/event-speech.webp'
import ceremonyGueye from '../assets/images/optimized/ceremony-gueye.webp'
import ceremonyAward from '../assets/images/optimized/ceremony-award.webp'

import './Actualites.css'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
}

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } }
}

const cocktailPhotos = [
  cocktailGroupe1, cocktailGroupe2, cocktailConviv1,
  cocktailConviv2, cocktailConviv3, cocktailEchange1,
  cocktailEchange2, cocktailEchange3
]

export default function Actualites() {
  return (
    <>
      {/* Hero */}
      <section className="hero-simple">
        <div className="container hero-simple-content">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
          >
            <motion.span className="hero-eyebrow" variants={fadeUp}>Actualités</motion.span>
            <motion.h1 variants={fadeUp}>
              La vie à l'ESA
            </motion.h1>
            <motion.p variants={fadeUp}>
              Découvrez les événements, cérémonies et moments forts
              qui rythment la vie de notre école.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Notre Communauté */}
      <section className="section">
        <div className="container">
          <motion.div
            className="section-header center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <h2>Notre Communauté</h2>
            <p className="text-soft">
              Une école dynamique avec des étudiants engagés et une équipe dévouée
            </p>
          </motion.div>

          <motion.div
            className="community-grid mt-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            <motion.div className="community-item community-wide" variants={fadeUp}>
              <img src={groupWomen} alt="Étudiantes ESA sur le campus" loading="lazy" />
              <div className="community-label">Nos étudiantes</div>
            </motion.div>
            <motion.div className="community-item" variants={fadeUp}>
              <img src={groupMen} alt="Étudiants ESA sur le campus" loading="lazy" />
              <div className="community-label">Nos étudiants</div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Cocktail Convivial */}
      <section className="section section-gray">
        <div className="container">
          <motion.div
            className="section-header center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <h2>Cocktail Convivial</h2>
            <p className="text-soft">
              Retrouvailles entre l'administration et le corps professoral
            </p>
          </motion.div>

          <motion.div
            className="cocktail-intro mt-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <p>
              Le cocktail convivial est traditionnellement organisé au sein de l'École
              Supérieure Aéronautique comme une occasion idéale de retrouvailles entre
              l'administration et le corps professoral pour échanger dans un cadre
              détendu et célébrer l'esprit d'entreprise et la bonne collaboration.
            </p>
          </motion.div>

          <motion.div
            className="cocktail-gallery mt-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            {cocktailPhotos.map((photo, i) => (
              <motion.div key={i} className="gallery-item" variants={fadeUp}>
                <img src={photo} alt={`Cocktail ESA ${i + 1}`} loading="lazy" />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Événements et Cérémonies */}
      <section className="section">
        <div className="container">
          <motion.div
            className="section-header center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <h2>Événements et Cérémonies</h2>
            <p className="text-soft">
              Des moments forts qui renforcent notre communauté
            </p>
          </motion.div>

          <motion.div
            className="events-grid mt-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            <motion.div className="event-card" variants={fadeUp}>
              <img src={ceremonyGueye} alt="Remise de distinction" loading="lazy" />
              <div className="event-info">
                <h4>Reconnaissance des Marraines</h4>
                <p>Cérémonie de remerciement aux partenaires et soutiens de l'école</p>
              </div>
            </motion.div>
            <motion.div className="event-card" variants={fadeUp}>
              <img src={eventSpeech} alt="Discours étudiant" loading="lazy" />
              <div className="event-info">
                <h4>Prise de Parole Étudiante</h4>
                <p>Nos étudiants développent leur leadership lors des événements</p>
              </div>
            </motion.div>
            <motion.div className="event-card" variants={fadeUp}>
              <img src={ceremonyAward} alt="Cérémonie de remise de prix" loading="lazy" />
              <div className="event-info">
                <h4>72H d'Activités Socio-Éducatives</h4>
                <p>L'Amicale des Étudiants organise des événements pour célébrer l'excellence</p>
              </div>
            </motion.div>
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
    </>
  )
}
