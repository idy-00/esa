import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Plane, GraduationCap, Users, Building2, Award,
  Shield, Wrench, Briefcase, ArrowRight, CheckCircle
} from 'lucide-react'
import heroImage from '../assets/images/optimized/hero-classroom.webp'
import heroMobile from '../assets/images/optimized/hero-classroom-mobile.webp'
import airportWomen from '../assets/images/optimized/airport-women.webp'
import airportMen from '../assets/images/optimized/airport-men.webp'
import studentsKakemono from '../assets/images/optimized/students-kakemono.webp'
import ceremonyAward from '../assets/images/optimized/ceremony-award.webp'

import logoAfricaAir from '../assets/images/partenaires/africa-air-assistance.jpeg'
import logoHeliconia from '../assets/images/partenaires/heliconia-senegal.jpeg'
import logo2as from '../assets/images/partenaires/2as-technics.jpeg'
import logoAdepme from '../assets/images/partenaires/adepme.jpeg'
import logoLas from '../assets/images/partenaires/las.jpeg'
import logoAibd from '../assets/images/partenaires/aibd-assistance.jpeg'
import logoEcoleMil from '../assets/images/partenaires/ecole-militaire.jpeg'
import logo3fpt from '../assets/images/partenaires/3fpt.jpeg'
import logoArcEnCiel from '../assets/images/partenaires/arc-en-ciel.jpeg'
import logoArmeeAir from '../assets/images/partenaires/armee-air.jpeg'
import logoTogether from '../assets/images/partenaires/together-web.jpeg'

import './Home.css'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
}

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } }
}

const stats = [
  { value: '120+', label: 'Étudiants 2024/2025', icon: Users },
  { value: '2018', label: 'Année de création', icon: Award },
  { value: '12', label: 'Filières de formation', icon: GraduationCap },
  { value: '11', label: 'Partenaires', icon: Building2 },
]

const filieres = [
  {
    icon: Plane,
    title: 'Transport Aérien & Aviation Civile',
    desc: 'Technique des opérations aériennes et exploitation aéroportuaire'
  },
  {
    icon: Wrench,
    title: 'Maintenance Aéronautique',
    desc: 'Maintenance des aéronefs et équipements aéroportuaires'
  },
  {
    icon: Shield,
    title: 'Sécurité & Sûreté',
    desc: 'Droit aérien, réglementation et législation aéronautique'
  },
  {
    icon: Briefcase,
    title: 'Management & Commercial',
    desc: 'Exploitation des compagnies, distribution, service clients et tourisme'
  },
]

const partenaires = [
  { name: 'Africa Air Assistance', logo: logoAfricaAir },
  { name: 'Arc en Ciel Airlines', logo: logoArcEnCiel },
  { name: 'Heliconia Senegal', logo: logoHeliconia },
  { name: '2AS Technics', logo: logo2as },
  { name: 'LAS', logo: logoLas },
  { name: 'AIBD Assistance Services', logo: logoAibd },
  { name: 'Armée de l\'Air Sénégal', logo: logoArmeeAir },
  { name: 'École Militaire', logo: logoEcoleMil },
  { name: '3FPT', logo: logo3fpt },
  { name: 'ADEPME', logo: logoAdepme },
  { name: 'Together Web Solutions', logo: logoTogether },
]

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="hero">
        <picture className="hero-bg">
          <source media="(max-width: 768px)" srcSet={heroMobile} />
          <img src={heroImage} alt="Étudiants ESA en salle de classe" loading="eager" />
        </picture>
        <div className="hero-overlay" />
        <div className="container hero-content">
          <motion.div
            className="hero-text"
            initial="hidden"
            animate="visible"
            variants={stagger}
          >
            <motion.p className="hero-tagline" variants={fadeUp}>
              Partenaire de l'Industrie du Transport Aérien
            </motion.p>
            <motion.h1 variants={fadeUp}>
              École Supérieure<br />Aéronautique
            </motion.h1>
            <motion.p className="hero-subtitle" variants={fadeUp}>
              École d'enseignement supérieur spécialisée dans la formation
              et la recherche en transport aérien. Du BTS au Master,
              devenez acteur de l'industrie aéronautique.
            </motion.p>
            <motion.div className="hero-actions" variants={fadeUp}>
              <Link to="/formations" className="btn btn-white">
                Découvrir nos formations
                <ArrowRight size={18} />
              </Link>
              <Link to="/contact" className="btn btn-outline">
                Demander une inscription
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="stats">
        <div className="container">
          <motion.div
            className="stats-grid"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
          >
            {stats.map((stat, i) => (
              <motion.div key={i} className="stat-item" variants={fadeUp}>
                <stat.icon size={32} strokeWidth={1.5} />
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Filières */}
      <section className="section">
        <div className="container">
          <motion.div
            className="section-header center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <div className="horizon" />
            <h2>Nos Filières de Formation</h2>
            <p className="text-soft">
              Des programmes adaptés aux besoins de l'industrie aéronautique
            </p>
          </motion.div>

          <motion.div
            className="grid grid-4 mt-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            {filieres.map((filiere, i) => (
              <motion.div key={i} className="card filiere-card" variants={fadeUp}>
                <div className="filiere-icon">
                  <filiere.icon size={28} strokeWidth={1.5} />
                </div>
                <h4>{filiere.title}</h4>
                <p className="text-soft">{filiere.desc}</p>
              </motion.div>
            ))}
          </motion.div>

          <div className="text-center mt-4">
            <Link to="/formations" className="btn btn-primary">
              Voir toutes les formations
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Visites terrain */}
      <section className="section section-gray">
        <div className="container">
          <motion.div
            className="section-header center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <h2>Formation Pratique sur le Terrain</h2>
            <p className="text-soft">
              Nos étudiants bénéficient de visites régulières dans les installations aéroportuaires
            </p>
          </motion.div>

          <motion.div
            className="gallery-2 mt-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            <motion.div className="gallery-item" variants={fadeUp}>
              <img src={airportWomen} alt="Étudiantes en visite à l'aéroport" loading="lazy" />
            </motion.div>
            <motion.div className="gallery-item" variants={fadeUp}>
              <img src={airportMen} alt="Étudiants en visite à l'aéroport" loading="lazy" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Why ESA */}
      <section className="section">
        <div className="container">
          <div className="why-grid">
            <motion.div
              className="why-content"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={stagger}
            >
              <motion.h2 variants={fadeUp}>Pourquoi choisir l'ESA ?</motion.h2>
              <motion.p className="text-soft mb-3" variants={fadeUp}>
                L'excellence et la diversité des compétences de nos enseignants nous offrent
                un haut niveau d'expertise dans les domaines variés de l'industrie aéronautique.
              </motion.p>
              <motion.ul className="why-list" variants={stagger}>
                {[
                  'Référentiels OACI, IATA et normes IOSA',
                  'Corps professoral d\'experts et professionnels de l\'aéronautique',
                  'Formations répondant aux exigences de l\'industrie',
                  'Programmes basés sur les standards internationaux',
                  'Vocation sous-régionale Afrique de l\'Ouest et du Centre',
                  'Campus à Dakar - HLM Grand Yoff Villa N° 723'
                ].map((item, i) => (
                  <motion.li key={i} variants={fadeUp}>
                    <CheckCircle size={20} />
                    <span>{item}</span>
                  </motion.li>
                ))}
              </motion.ul>
              <motion.div variants={fadeUp}>
                <Link to="/a-propos" className="btn btn-primary mt-2">
                  En savoir plus
                </Link>
              </motion.div>
            </motion.div>
            <motion.div
              className="why-image"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <img src={studentsKakemono} alt="Étudiants ESA devant kakémono" loading="lazy" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Vie étudiante */}
      <section className="section section-gray">
        <div className="container">
          <motion.div
            className="section-header center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <h2>Vie Étudiante</h2>
            <p className="text-soft">
              Des événements et activités pour une communauté dynamique
            </p>
          </motion.div>

          <motion.div
            className="event-highlight mt-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <img src={ceremonyAward} alt="Cérémonie de remise de prix ESA" loading="lazy" />
            <div className="event-caption">
              <h4>72H d'Activités Socio-Éducatives</h4>
              <p>L'Amicale des Étudiants organise chaque année des événements pour renforcer les liens et célébrer l'excellence.</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Partenaires */}
      <section className="section">
        <div className="container">
          <motion.div
            className="section-header center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <h2>Nos Partenaires</h2>
            <p className="text-soft">
              Un réseau solide pour votre réussite professionnelle
            </p>
          </motion.div>

          <motion.div
            className="partenaires-logos mt-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            {partenaires.map((p, i) => (
              <motion.div key={i} className="partenaire-logo" variants={fadeUp}>
                <img src={p.logo} alt={p.name} title={p.name} loading="lazy" />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta">
        <div className="container">
          <motion.div
            className="cta-content text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            <motion.h2 variants={fadeUp}>
              Prêt à décoller vers votre avenir ?
            </motion.h2>
            <motion.p variants={fadeUp}>
              Rejoignez l'ESA et faites partie de la prochaine génération
              de professionnels du transport aérien.
            </motion.p>
            <motion.div className="cta-actions" variants={fadeUp}>
              <Link to="/contact" className="btn btn-white">
                S'inscrire maintenant
              </Link>
              <Link to="/formations" className="btn btn-ghost">
                Voir les formations
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  )
}
