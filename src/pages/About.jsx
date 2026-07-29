import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  Target, Eye, Users, Award, Building2, Globe,
  TrendingUp, BookOpen, ArrowRight
} from 'lucide-react'
import groupWomen from '../assets/images/optimized/group-women.webp'
import groupMen from '../assets/images/optimized/group-men.webp'
import classroomTeacher from '../assets/images/optimized/classroom-teacher.webp'
import eventSpeech from '../assets/images/optimized/event-speech.webp'
import ceremonyGueye from '../assets/images/optimized/ceremony-gueye.webp'
import classroomSmall from '../assets/images/optimized/classroom-small.webp'
import './About.css'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
}

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } }
}

const timeline = [
  { year: '2018', event: 'Création de l\'ESA à Dakar' },
  { year: '2020', event: 'Autorisation officielle MEFPA N° 00000059' },
  { year: '2021', event: 'Première promotion - 6 étudiants' },
  { year: '2022', event: '15 étudiants - Expansion des programmes' },
  { year: '2023', event: '45 étudiants - Partenariats internationaux' },
  { year: '2024', event: '120+ étudiants - Reconnaissance sous-régionale' },
]

const values = [
  {
    icon: Award,
    title: 'Excellence',
    desc: 'Des standards de formation alignés sur les exigences internationales du secteur aérien.'
  },
  {
    icon: Users,
    title: 'Professionnalisme',
    desc: 'Un corps enseignant composé d\'experts et de praticiens du transport aérien.'
  },
  {
    icon: Globe,
    title: 'Ouverture',
    desc: 'Une vocation sous-régionale avec des partenariats en Afrique et en Europe.'
  },
  {
    icon: TrendingUp,
    title: 'Innovation',
    desc: 'Des programmes constamment mis à jour pour répondre aux évolutions du secteur.'
  },
]

export default function About() {
  return (
    <>
      {/* Hero split */}
      <section className="hero-split">
        <div className="hero-split-content">
          <div className="container">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={stagger}
            >
              <motion.span className="hero-eyebrow" variants={fadeUp}>À propos</motion.span>
              <motion.h1 variants={fadeUp}>
                Former les talents<br />de l'aviation africaine
              </motion.h1>
              <motion.p className="hero-split-text" variants={fadeUp}>
                Depuis 2018, l'ESA accompagne les futurs professionnels du transport
                aérien avec des programmes reconnus et une pédagogie terrain.
              </motion.p>
            </motion.div>
          </div>
        </div>
        <motion.div
          className="hero-split-image"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <img src={classroomTeacher} alt="Cours à l'ESA" />
        </motion.div>
      </section>

      {/* Mission & Vision */}
      <section className="section">
        <div className="container">
          <div className="mission-grid">
            <motion.div
              className="card mission-card"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
            >
              <div className="mission-icon">
                <Target size={32} strokeWidth={1.5} />
              </div>
              <h3>Notre Mission</h3>
              <p>
                Former des professionnels qualifiés pour l'industrie du transport
                aérien, en offrant des programmes d'enseignement académique et
                des formations métiers répondant aux standards internationaux.
              </p>
            </motion.div>

            <motion.div
              className="card mission-card"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
            >
              <div className="mission-icon">
                <Eye size={32} strokeWidth={1.5} />
              </div>
              <h3>Notre Vision</h3>
              <p>
                Devenir l'école de référence en formation aéronautique en Afrique
                de l'Ouest et du Centre, reconnue pour l'excellence de ses
                programmes et l'employabilité de ses diplômés.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Notre communauté */}
      <section className="section section-gray">
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
            <motion.div className="community-item" variants={fadeUp}>
              <img src={classroomSmall} alt="En cours" loading="lazy" />
              <div className="community-label">En formation</div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="section">
        <div className="container">
          <motion.div
            className="section-header center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <h2>Nos Valeurs</h2>
            <p className="text-soft">
              Les principes qui guident notre engagement envers nos étudiants
            </p>
          </motion.div>

          <motion.div
            className="grid grid-4 mt-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            {values.map((value, i) => (
              <motion.div key={i} className="card value-card" variants={fadeUp}>
                <value.icon size={28} strokeWidth={1.5} className="value-icon" />
                <h4>{value.title}</h4>
                <p className="text-soft">{value.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Histoire — grid cards */}
      <section className="section section-gray">
        <div className="container">
          <motion.div
            className="section-header center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <h2>Notre Histoire</h2>
            <p className="text-soft">
              Une croissance continue depuis notre création
            </p>
          </motion.div>

          <motion.div
            className="history-grid mt-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            {timeline.map((item, i) => (
              <motion.div key={i} className="history-card" variants={fadeUp}>
                <span className="history-year">{item.year}</span>
                <p>{item.event}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Événements */}
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
          </motion.div>
        </div>
      </section>

      {/* Débouchés */}
      <section className="section section-gray">
        <div className="container">
          <motion.div
            className="section-header center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <h2>Débouchés Professionnels</h2>
            <p className="text-soft">
              Nos diplômés intègrent les acteurs majeurs du transport aérien
            </p>
          </motion.div>

          <motion.div
            className="debouches-grid mt-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            {[
              { icon: Building2, title: 'Compagnies aériennes', desc: 'Compagnies nationales et internationales' },
              { icon: Users, title: 'Sociétés de handling', desc: 'Assistance aéroportuaire et services au sol' },
              { icon: Globe, title: 'Gestionnaires d\'aéroports', desc: 'Exploitation et gestion des infrastructures' },
              { icon: BookOpen, title: 'Autorités de l\'aviation', desc: 'Organismes de régulation et contrôle' },
            ].map((item, i) => (
              <motion.div key={i} className="card debouche-card" variants={fadeUp}>
                <item.icon size={24} strokeWidth={1.5} />
                <div>
                  <h4>{item.title}</h4>
                  <p className="text-soft">{item.desc}</p>
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
              Rejoignez l'aventure ESA
            </motion.h2>
            <motion.p variants={fadeUp} style={{ color: 'rgba(255,255,255,0.9)', marginBottom: '2rem' }}>
              Découvrez nos programmes de formation et construisez votre avenir dans l'aviation.
            </motion.p>
            <motion.div variants={fadeUp}>
              <Link to="/formations" className="btn btn-white">
                Voir nos formations
                <ArrowRight size={18} />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  )
}
