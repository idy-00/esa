import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  Target, Eye, Users, Award, Building2, Globe,
  TrendingUp, BookOpen, ArrowRight, Star, Heart, Handshake,
  GraduationCap, UserCheck, Briefcase, Plane
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

const objectifs = [
  'Faire connaître l\'évolution continue des exigences et pratiques de l\'industrie aéronautique',
  'Préparer les futurs cadres du transport aérien à mieux répondre aux exigences et tendances de l\'industrie aéronautique dans un contexte de mondialisation',
  'Informer les managers sur les nouvelles évolutions et actualités juridiques du transport aérien ainsi que sur les applications des instruments juridiques et légaux internationaux',
  'Comprendre et s\'adapter aux interactions d\'une activité de transport aérien complexe et sensible avec les effets de la concurrence mondiale et une compétition commerciale de plus en plus forte',
  'Relever les défis d\'un secteur de plus en plus rigoureux où notamment la sécurité et la sûreté demeurent deux éléments cruciaux parmi les critères de qualité de 1er plan',
]

const valeurs = [
  {
    icon: Award,
    title: 'Professionnalisme et Excellence',
    desc: 'Un engagement constant vers les plus hauts standards de qualité dans tous nos programmes.'
  },
  {
    icon: TrendingUp,
    title: 'Recherche du Perfectible',
    desc: 'L\'idéal de la recherche permanente du perfectible guide notre démarche pédagogique.'
  },
  {
    icon: Heart,
    title: 'Intégrité et Autodiscipline',
    desc: 'Intégrité, respect et engagement envers l\'autodiscipline dans toutes nos actions.'
  },
  {
    icon: Star,
    title: 'Innovation et Partage',
    desc: 'Institution d\'apprentissage ayant pour objectif l\'amélioration continue de la qualité, l\'innovation et le partage des connaissances.'
  },
  {
    icon: Handshake,
    title: 'Satisfaction Partenaires',
    desc: 'La satisfaction de nos partenaires est au cœur de notre mission et de nos engagements.'
  },
]

const cibles = [
  {
    icon: GraduationCap,
    title: 'Étudiants',
    desc: 'Jeunes bacheliers et étudiants désireux de se spécialiser aux métiers de l\'aviation.'
  },
  {
    icon: UserCheck,
    title: 'Professionnels',
    desc: 'Personnel des entreprises de transport aérien soucieux de renforcer et mettre à niveau leurs capacités sur les systèmes de l\'aviation.'
  },
  {
    icon: Building2,
    title: 'Services Aéronautiques',
    desc: 'Organisation des services aéronautiques et aéroportuaires, stratégies de gestion et d\'exploitation des compagnies aériennes.'
  },
  {
    icon: Briefcase,
    title: 'Transit & Fret',
    desc: 'Transport aérien et sociétés de consignation et de transit des marchandises, fourniture de services aériens.'
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
              <motion.span className="hero-eyebrow" variants={fadeUp}>Qui sommes-nous ?</motion.span>
              <motion.h1 variants={fadeUp}>
                Partenaire de l'industrie<br />du Transport Aérien
              </motion.h1>
              <motion.p className="hero-split-text" variants={fadeUp}>
                L'École Supérieure Aéronautique est une école d'enseignement supérieur
                spécialisée dans la formation et la recherche en transport aérien.
                En plus de ses programmes d'enseignement académique, elle offre des
                formations métiers comme réglementaires.
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

      {/* Qui sommes-nous détaillé */}
      <section className="section">
        <div className="container">
          <motion.div
            className="about-intro"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            <motion.p className="lead-text" variants={fadeUp}>
              L'École Supérieure Aéronautique forme les jeunes bacheliers et étudiants
              désireux de se spécialiser aux métiers de l'aviation. Elle a également
              vocation à former et à recycler le personnel employé dans les entreprises
              liées au transport aérien pour le renforcement de capacités.
            </motion.p>
            <motion.p className="lead-text" variants={fadeUp}>
              L'excellence et la diversité des compétences de nos enseignants nous
              offrent un haut niveau d'expertise ainsi qu'une large expérience dans
              des domaines variés de l'industrie aéronautique.
            </motion.p>
            <motion.p className="lead-text highlight" variants={fadeUp}>
              L'École Supérieure Aéronautique est un partenaire pour une industrie
              du transport aérien efficace et compétitive.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Vision & Objectif */}
      <section className="section section-gray">
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
                <Eye size={32} strokeWidth={1.5} />
              </div>
              <h3>Notre Vision</h3>
              <p>
                Notre vision est de faire de l'École Supérieure Aéronautique un centre
                de formation aéronautique d'excellence à vocation sous-régionale le plus
                compétitif et le plus important de l'Afrique de l'Ouest et du Centre.
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
                <Target size={32} strokeWidth={1.5} />
              </div>
              <h3>Notre Objectif Majeur</h3>
              <p>
                Devenir la plus grande académie de l'aviation en Afrique de l'Ouest
                et du Centre en fournissant un enseignement d'excellence et des
                programmes de formation aéronautique standardisés basés sur les
                exigences de l'aviation internationale.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Nos Missions */}
      <section className="section">
        <div className="container">
          <motion.div
            className="section-header center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <h2>Nos Missions</h2>
            <p className="text-soft">
              Former des professionnels qualifiés pour l'industrie du transport aérien
            </p>
          </motion.div>

          <motion.div
            className="missions-content mt-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <p className="mission-intro">
              Nos missions consistent principalement à proposer des formations en transport
              aérien répondant aux exigences de l'industrie, en ayant comme référentiel de
              qualité les standards internationaux et une formation de haut niveau, afin que
              nos étudiants bénéficient d'une connaissance actualisée de l'évolution du
              transport aérien et puissent bâtir leur leadership grâce à l'efficience et
              l'efficacité de notre enseignement et à la pertinence de nos programmes.
            </p>
            <p className="mission-intro">
              Nous nous assurons que les entreprises et organismes qui constituent nos
              partenaires puissent compter sur des ressources humaines qualifiées et formées
              pour faire face aux nouvelles tendances et exigences d'une industrie aéronautique
              en permanente évolution. Nous ferons en sorte que nos compétences et expériences
              enrichissent le transport aérien en Afrique et dans le monde.
            </p>
          </motion.div>

          <motion.div
            className="section-header center mt-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <h3>À travers nos missions, s'inscrivent les objectifs suivants :</h3>
          </motion.div>

          <motion.div
            className="objectifs-grid mt-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            {objectifs.map((objectif, i) => (
              <motion.div key={i} className="objectif-item" variants={fadeUp}>
                <span className="objectif-number">{String(i + 1).padStart(2, '0')}</span>
                <p>{objectif}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Formation Pluridisciplinaire */}
      <section className="section section-gray">
        <div className="container">
          <div className="formation-grid">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={stagger}
            >
              <motion.h2 variants={fadeUp}>Formation Pluridisciplinaire</motion.h2>
              <motion.p className="text-soft mb-3" variants={fadeUp}>
                Pour rester dans sa vision et réussir ses missions, l'École Supérieure
                Aéronautique a développé des programmes d'enseignement pluridisciplinaire
                dans les différentes filières du transport aérien impliquant un haut niveau
                de connaissances et de savoir-faire.
              </motion.p>
              <motion.p className="text-soft mb-3" variants={fadeUp}>
                Ceci nous permet à moyen terme d'atteindre nos objectifs de performance
                et de garantir à nos étudiants un enseignement de qualité et des compétences
                répondant aux exigences de l'industrie.
              </motion.p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={stagger}
            >
              <motion.h2 variants={fadeUp}>Formation Supérieure</motion.h2>
              <motion.p className="text-soft mb-3" variants={fadeUp}>
                L'ESA offre un format d'enseignement associant le management et les techniques
                d'exploitation — une innovation qui permet aux étudiants d'acquérir les notions
                de base de fonctionnement des opérations aériennes et aéroportuaires dès les
                deux premières années de formation post baccalauréat.
              </motion.p>
              <motion.p className="text-soft mb-3" variants={fadeUp}>
                L'intégration au programme du BTS de notions de base de l'aviation et de la
                culture aéronautique aboutit à préparer l'étudiant au début de son cursus
                universitaire à l'initiation à la gestion et l'exploitation du transport aérien.
              </motion.p>
              <motion.p className="text-soft" variants={fadeUp}>
                La Licence en Transport Aérien est une innovation et ouvre à l'étudiant des
                perspectives dans son choix jusqu'au master pour la spécialisation en
                management transport aérien.
              </motion.p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Valeurs - 5 valeurs complètes */}
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
              L'École Supérieure Aéronautique reste attachée au respect des valeurs suivantes
            </p>
          </motion.div>

          <motion.div
            className="valeurs-grid mt-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            {valeurs.map((value, i) => (
              <motion.div key={i} className="card value-card" variants={fadeUp}>
                <value.icon size={28} strokeWidth={1.5} className="value-icon" />
                <h4>{value.title}</h4>
                <p className="text-soft">{value.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Expertise & Corps Professoral */}
      <section className="section section-gray">
        <div className="container">
          <div className="expertise-grid">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={stagger}
            >
              <motion.h2 variants={fadeUp}>Notre Expertise</motion.h2>
              <motion.p className="text-soft mb-3" variants={fadeUp}>
                L'École Supérieure Aéronautique s'appuie sur le savoir-faire d'experts
                et de professionnels de haut niveau dans le domaine du transport aérien
                et jouissant d'une large expérience acquise au sein d'organismes
                aéronautiques spécialisés et internationalement reconnus.
              </motion.p>
              <motion.p className="text-soft mb-3" variants={fadeUp}>
                Le regroupement de professionnels dans des domaines variés de l'industrie
                aéronautique nous permet d'associer les compétences, de garantir des
                synergies et d'offrir des formations d'excellence.
              </motion.p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={stagger}
            >
              <motion.h2 variants={fadeUp}>Corps Professoral</motion.h2>
              <motion.p className="text-soft mb-3" variants={fadeUp}>
                Nos intervenants sont des experts et professionnels de l'aéronautique
                évoluant dans des domaines variés de l'industrie.
              </motion.p>
              <motion.div className="corps-prof-card" variants={fadeUp}>
                <UserCheck size={32} strokeWidth={1.5} />
                <p>
                  Des professionnels en activité, des experts reconnus et des formateurs
                  spécialisés qui transmettent leur expérience terrain aux étudiants.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Référentiels et Procédures */}
      <section className="section">
        <div className="container">
          <motion.div
            className="section-header center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <h2>Référentiels et Procédures</h2>
            <p className="text-soft">
              Un système de management de la qualité reconnu internationalement
            </p>
          </motion.div>

          <motion.div
            className="referentiels-content mt-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <p className="ref-intro">
              Le système documenté de management de la qualité sur lequel repose notre
              approche à l'École Supérieure Aéronautique, nous permet de contrôler
              l'efficacité des processus satisfaisant à un modèle de suivi pédagogique
              et de management de la qualité de l'enseignement pour répondre aux exigences
              du secteur aéronautique.
            </p>
          </motion.div>

          <motion.div
            className="referentiels-grid mt-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            <motion.div className="card referentiel-card" variants={fadeUp}>
              <h4>OACI</h4>
              <p className="text-soft">
                Organisation de l'Aviation Civile Internationale — 1er référentiel
                harmonisé qui répond à l'ensemble des exigences des entreprises
                de l'industrie aéronautique mondiale.
              </p>
            </motion.div>
            <motion.div className="card referentiel-card" variants={fadeUp}>
              <h4>IATA - AHM</h4>
              <p className="text-soft">
                Procédures de l'Airport Handling Manual de l'International Air
                Transport Association pour les opérations aéroportuaires.
              </p>
            </motion.div>
            <motion.div className="card referentiel-card" variants={fadeUp}>
              <h4>IOSA</h4>
              <p className="text-soft">
                Manuel des normes IOSA, en tant que Modèle de Système reconnu
                de la Qualité de l'aéronautique.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Notre Cible - détaillée */}
      <section className="section section-gray">
        <div className="container">
          <motion.div
            className="section-header center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <h2>Notre Cible</h2>
            <p className="text-soft">
              À qui s'adressent nos formations ?
            </p>
          </motion.div>

          <motion.div
            className="cibles-grid mt-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            {cibles.map((cible, i) => (
              <motion.div key={i} className="card cible-card" variants={fadeUp}>
                <cible.icon size={28} strokeWidth={1.5} className="cible-icon" />
                <h4>{cible.title}</h4>
                <p className="text-soft">{cible.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Notre communauté */}
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
            <motion.div className="community-item" variants={fadeUp}>
              <img src={classroomSmall} alt="En cours" loading="lazy" />
              <div className="community-label">En formation</div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Événements */}
      <section className="section section-gray">
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
      <section className="section">
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
              { icon: Plane, title: 'Compagnies aériennes', desc: 'Compagnies nationales et internationales' },
              { icon: Building2, title: 'Services aéroportuaires', desc: 'Organisation des services aéronautiques' },
              { icon: Globe, title: 'Gestionnaires d\'aéroports', desc: 'Stratégies de gestion et d\'exploitation' },
              { icon: BookOpen, title: 'Transit & Fret', desc: 'Sociétés de consignation et transit des marchandises' },
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
