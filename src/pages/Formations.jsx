import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  GraduationCap, BookOpen, Award, Clock,
  ChevronDown, ArrowRight, CheckCircle
} from 'lucide-react'
import maintenancePractice from '../assets/images/optimized/maintenance-practice.webp'
import securityPractice from '../assets/images/optimized/security-practice.webp'
import managementHangar from '../assets/images/optimized/management-hangar.webp'
import groupMen from '../assets/images/optimized/group-men.webp'
import './Formations.css'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
}

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } }
}

const formations = [
  {
    level: 'BTS / DTS',
    duration: '2 ans',
    icon: BookOpen,
    programs: [
      {
        name: 'Transport et Logistique',
        desc: 'Gestion des flux logistiques et chaîne d\'approvisionnement dans le secteur aérien.'
      },
      {
        name: 'Transport Aérien et Métiers Aéroportuaires',
        desc: 'Opérations au sol, assistance en escale, coordination des vols.'
      },
      {
        name: 'Maintenance Aéronautique',
        desc: 'Initiation aux techniques de maintenance des aéronefs et équipements.'
      },
      {
        name: 'Métiers Commerciaux',
        desc: 'Vente, billetterie, relation client dans le transport aérien.'
      },
    ]
  },
  {
    level: 'Licence Professionnelle',
    duration: '1 an (après BTS)',
    icon: GraduationCap,
    programs: [
      {
        name: 'Transport Aérien - Opérations',
        desc: 'Planification et coordination des opérations de vol.'
      },
      {
        name: 'Transport Aérien - Exploitation',
        desc: 'Gestion de l\'exploitation aéroportuaire et des compagnies.'
      },
      {
        name: 'Transport Aérien - Commercial & Tourisme',
        desc: 'Marketing aérien, yield management, développement commercial.'
      },
      {
        name: 'Sécurité et Sûreté Aéroportuaire',
        desc: 'Normes OACI, gestion des risques, contrôle et inspection.'
      },
      {
        name: 'Technicien de Maintenance Aéronautique',
        desc: 'Maintenance préventive et corrective des aéronefs.'
      },
    ]
  },
  {
    level: 'Master 1',
    duration: '1 an',
    icon: Award,
    programs: [
      {
        name: 'Transport Aérien',
        desc: 'Approfondissement des connaissances en gestion du transport aérien.'
      },
      {
        name: 'Management Sécurité et Sûreté',
        desc: 'Expertise en management des systèmes de sécurité aérienne.'
      },
    ]
  },
  {
    level: 'Master 2',
    duration: '1 an',
    icon: Award,
    programs: [
      {
        name: 'Management et Exploitation Aéroportuaire',
        desc: 'Direction d\'aéroports, optimisation des opérations, développement stratégique.'
      },
      {
        name: 'Management et Exploitation des Compagnies Aériennes',
        desc: 'Direction de compagnies, network planning, fleet management.'
      },
      {
        name: 'Management Sécurité et Sûreté du Transport Aérien',
        desc: 'Expert en systèmes de management de la sécurité (SMS) et sûreté.'
      },
    ]
  },
]

const formationsContinues = [
  'Certificats de spécialité aéronautique',
  'Formation qualifiante',
  'Formation de courte durée',
  'Formation avancée',
  'Formation intra-entreprise',
  'Séminaires aériens',
]

function AccordionItem({ formation, isOpen, onToggle }) {
  return (
    <div className={`accordion-item ${isOpen ? 'open' : ''}`}>
      <button className="accordion-header" onClick={onToggle}>
        <div className="accordion-title">
          <formation.icon size={24} strokeWidth={1.5} />
          <div>
            <h3>{formation.level}</h3>
            <span className="accordion-duration">
              <Clock size={14} />
              {formation.duration}
            </span>
          </div>
        </div>
        <ChevronDown size={20} className="accordion-chevron" />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="accordion-content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="programs-grid">
              {formation.programs.map((program, i) => (
                <div key={i} className="program-card">
                  <h4>{program.name}</h4>
                  <p className="text-soft">{program.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function Formations() {
  const [openIndex, setOpenIndex] = useState(0)

  return (
    <>
      {/* Hero fullscreen */}
      <section className="hero-page">
        <img src={groupMen} alt="Étudiants ESA" className="hero-page-bg" />
        <div className="hero-page-overlay" />
        <div className="container hero-page-content">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
          >
            <motion.span className="hero-eyebrow" variants={fadeUp}>Formations</motion.span>
            <motion.h1 variants={fadeUp}>
              Du BTS au Master,<br />votre parcours aviation
            </motion.h1>
            <motion.p className="hero-page-text" variants={fadeUp}>
              Formation supérieure universitaire et professionnelle associant
              le management et les techniques d'exploitation aéronautique.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Formations académiques */}
      <section className="section">
        <div className="container">
          <motion.div
            className="section-header"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <h2>Formations Académiques</h2>
            <p className="text-soft">
              Programmes diplômants reconnus par l'État
            </p>
          </motion.div>

          <motion.div
            className="accordion mt-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            {formations.map((formation, i) => (
              <motion.div key={i} variants={fadeUp}>
                <AccordionItem
                  formation={formation}
                  isOpen={openIndex === i}
                  onToggle={() => setOpenIndex(openIndex === i ? -1 : i)}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Formations continues */}
      <section className="section section-gray">
        <div className="container">
          <div className="continues-grid">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={stagger}
            >
              <motion.h2 variants={fadeUp}>Formations Continues</motion.h2>
              <motion.p className="text-soft mb-3" variants={fadeUp}>
                Des formations pour les entreprises et professionnels souhaitant
                renforcer et mettre à niveau leurs capacités sur les systèmes de l'aviation.
              </motion.p>
              <motion.ul className="continues-list" variants={stagger}>
                {formationsContinues.map((item, i) => (
                  <motion.li key={i} variants={fadeUp}>
                    <CheckCircle size={20} />
                    <span>{item}</span>
                  </motion.li>
                ))}
              </motion.ul>
              <motion.div variants={fadeUp} className="mt-4">
                <Link to="/contact" className="btn btn-primary">
                  Demander un devis
                  <ArrowRight size={18} />
                </Link>
              </motion.div>
            </motion.div>

            <motion.div
              className="continues-info"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="card">
                <h4>Formations sur mesure</h4>
                <p className="text-soft">
                  Nous concevons des programmes adaptés aux besoins spécifiques
                  de votre entreprise ou organisation.
                </p>
                <ul className="info-list">
                  <li>Audit des besoins</li>
                  <li>Programme personnalisé</li>
                  <li>Formation sur site ou à l'ESA</li>
                  <li>Certification à l'issue</li>
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Formation pratique */}
      <section className="section">
        <div className="container">
          <motion.div
            className="section-header center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <h2>Formation Pratique</h2>
            <p className="text-soft">
              Nos étudiants apprennent sur de vrais équipements aéronautiques
            </p>
          </motion.div>

          <motion.div
            className="practice-grid mt-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            <motion.div className="practice-card" variants={fadeUp}>
              <img src={maintenancePractice} alt="Pratique maintenance aéronautique" loading="lazy" />
              <div className="practice-info">
                <h4>Maintenance Aéronautique</h4>
                <p>Manipulation et entretien des équipements avion</p>
              </div>
            </motion.div>
            <motion.div className="practice-card" variants={fadeUp}>
              <img src={securityPractice} alt="Formation sécurité" loading="lazy" />
              <div className="practice-info">
                <h4>Sécurité & Sûreté</h4>
                <p>Techniques de contrôle et procédures de sécurité</p>
              </div>
            </motion.div>
            <motion.div className="practice-card" variants={fadeUp}>
              <img src={managementHangar} alt="Visite hangar" loading="lazy" />
              <div className="practice-info">
                <h4>Management & Escale</h4>
                <p>Immersion dans les opérations aéroportuaires</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Filières détaillées */}
      <section className="section section-gray">
        <div className="container">
          <motion.div
            className="section-header center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <h2>Nos 12 Filières</h2>
            <p className="text-soft">
              Formation pluridisciplinaire dans les différentes filières du transport aérien
            </p>
          </motion.div>

          <motion.div
            className="filieres-list mt-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            {[
              'Transport Aérien et Aviation Civile',
              'Technique des Opérations Aériennes',
              'Technique de l\'Exploitation Aéroportuaire',
              'Technique de Maintenance Aéronautique',
              'Management et Exploitation des Compagnies Aériennes',
              'Management et Exploitation Aéroportuaire',
              'Métiers Aéroportuaires et de l\'Escale',
              'Métiers Commercial / Distribution / Service Clients & Tourisme',
              'Métiers de Maintenance des Équipements Aéroportuaires',
              'Sécurité & Sûreté de l\'Aviation',
              'Droit Aérien & Spatial',
              'Réglementation & Législation Aéronautique',
            ].map((filiere, i) => (
              <motion.div key={i} className="filiere-item" variants={fadeUp}>
                <span className="filiere-number">{String(i + 1).padStart(2, '0')}</span>
                <span>{filiere}</span>
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
              Prêt à vous inscrire ?
            </motion.h2>
            <motion.p variants={fadeUp} style={{ color: 'rgba(255,255,255,0.9)', marginBottom: '2rem' }}>
              Contactez-nous pour obtenir plus d'informations sur nos programmes
              et les modalités d'inscription.
            </motion.p>
            <motion.div variants={fadeUp}>
              <Link to="/contact" className="btn btn-white">
                Demander une inscription
                <ArrowRight size={18} />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  )
}
