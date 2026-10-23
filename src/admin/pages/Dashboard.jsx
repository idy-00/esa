import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Eye, UserRound, Mail, CalendarDays, Plus, ImagePlus, Clapperboard, TrendingUp, TrendingDown, Loader2 } from 'lucide-react'
import { api, formatDateTime } from '../api'
import { useAuth, useContent } from '../context'
import { BarChart, RankList, fmt } from '../charts'
import { isUpcoming } from '../../content/siteContent'

const MONTHS = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre']
const MONTHS_SHORT = ['Janv.', 'Févr.', 'Mars', 'Avr.', 'Mai', 'Juin', 'Juil.', 'Août', 'Sept.', 'Oct.', 'Nov.', 'Déc.']

const PAGE_LABELS = {
  '/': 'Accueil',
  '/a-propos': 'À propos',
  '/formations': 'Formations',
  '/actualites': 'Actualités',
  '/vie-etudiante': 'Vie étudiante',
  '/contact': 'Contact',
}

function Trend({ current, previous }) {
  if (!previous) return <span className="adm-trend">—</span>
  const pct = Math.round(((current - previous) / previous) * 100)
  const up = pct >= 0
  return (
    <span className={`adm-trend ${up ? 'is-up' : 'is-down'}`}>
      {up ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
      {up ? '+' : ''}{pct} % vs mois précédent
    </span>
  )
}

function Kpi({ icon: Icon, label, value, children, tone }) {
  return (
    <div className={`adm-kpi adm-kpi-${tone}`}>
      <div className="adm-kpi-icon"><Icon size={22} /></div>
      <div>
        <span className="adm-kpi-label">{label}</span>
        <strong className="adm-kpi-value">{value}</strong>
        {children}
      </div>
    </div>
  )
}

export default function Dashboard() {
  const { user } = useAuth()
  const { content, updatedAt, updatedBy } = useContent()
  const now = new Date()
  const thisYear = now.getFullYear()
  const thisMonth = now.getMonth() + 1

  const [year, setYear] = useState(thisYear)
  const [month, setMonth] = useState(thisMonth)
  const [stats, setStats] = useState(null)
  const [current, setCurrent] = useState(null) // mois en cours + mois précédent pour les indicateurs
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    const loads = [api('stats', { params: { year: thisYear, month: thisMonth } })]
    if (thisMonth === 1) loads.push(api('stats', { params: { year: thisYear - 1 } }))
    Promise.all(loads)
      .then(([cur, prevYear]) => {
        if (cancelled) return
        const prev = thisMonth === 1 ? prevYear.months[11] : cur.months[thisMonth - 2]
        setCurrent({ month: cur.months[thisMonth - 1], prev })
      })
      .catch((err) => !cancelled && setError(err.message))
    return () => { cancelled = true }
  }, [thisYear, thisMonth])

  useEffect(() => {
    let cancelled = false
    api('stats', { params: { year, month } })
      .then((data) => !cancelled && setStats(data))
      .catch((err) => !cancelled && setError(err.message))
    return () => { cancelled = true }
  }, [year, month])

  const events = content.actualites.events
  const published = events.filter((e) => e.published)
  const upcoming = published.filter(isUpcoming)
  const photoCount = events.reduce((n, e) => n + e.photos.length, 0)
    + content.vieEtudiante.albums.reduce((n, a) => n + a.photos.length, 0)

  const yearTotals = stats?.months.reduce((t, m) => ({
    views: t.views + m.views, visitors: t.visitors + m.visitors, contacts: t.contacts + m.contacts,
  }), { views: 0, visitors: 0, contacts: 0 })

  const detail = stats?.detail
  const changeYear = (y) => {
    setYear(y)
    setMonth(y === thisYear ? thisMonth : 12)
  }

  return (
    <div className="adm-page">
      <div className="adm-page-head">
        <div>
          <h1>Bonjour {user.name.split(' ')[0]} 👋</h1>
          <p className="adm-muted">
            {now.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            {updatedAt && <> · Dernière modification du contenu : {formatDateTime(updatedAt)}{updatedBy ? ` par ${updatedBy}` : ''}</>}
          </p>
        </div>
      </div>

      {error && <div className="adm-alert adm-alert-error">{error}</div>}

      <div className="adm-kpis">
        <Kpi icon={Eye} tone="blue" label={`Pages vues en ${MONTHS[thisMonth - 1].toLowerCase()}`} value={current ? fmt(current.month.views) : '…'}>
          {current && <Trend current={current.month.views} previous={current.prev.views} />}
        </Kpi>
        <Kpi icon={UserRound} tone="green" label="Visiteurs ce mois-ci" value={current ? fmt(current.month.visitors) : '…'}>
          {current && <Trend current={current.month.visitors} previous={current.prev.visitors} />}
        </Kpi>
        <Kpi icon={Mail} tone="orange" label="Demandes de contact ce mois-ci" value={current ? fmt(current.month.contacts) : '…'}>
          {current && <Trend current={current.month.contacts} previous={current.prev.contacts} />}
        </Kpi>
        <Kpi icon={CalendarDays} tone="purple" label="Événements en ligne" value={fmt(published.length)}>
          <span className="adm-trend">{upcoming.length} à venir · {fmt(photoCount)} photos</span>
        </Kpi>
      </div>

      <div className="adm-quick">
        <Link to="/admin/evenements/nouveau" className="adm-quick-item">
          <Plus size={20} /> <span><strong>Ajouter un événement</strong><small>Annonce, cérémonie, sortie…</small></span>
        </Link>
        <Link to="/admin/vie-etudiante" className="adm-quick-item">
          <ImagePlus size={20} /> <span><strong>Ajouter des photos</strong><small>Albums de la vie étudiante</small></span>
        </Link>
        <Link to="/admin/videos" className="adm-quick-item">
          <Clapperboard size={20} /> <span><strong>Publier une vidéo</strong><small>Fichier MP4 ou lien YouTube</small></span>
        </Link>
      </div>

      <section className="adm-card">
        <div className="adm-card-head">
          <div>
            <h2>Fréquentation du site</h2>
            <p className="adm-muted">Cliquez sur un mois pour voir le détail jour par jour.</p>
          </div>
          <select className="adm-input adm-select-inline" value={year} onChange={(e) => changeYear(Number(e.target.value))} aria-label="Année">
            {(stats?.years || [thisYear]).map((y) => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>

        {!stats ? (
          <div className="adm-center"><Loader2 className="adm-spin" /></div>
        ) : (
          <>
            <BarChart
              data={stats.months.map((m) => ({ key: m.month, label: MONTHS_SHORT[m.month - 1], values: [m.views, m.visitors] }))}
              series={[{ name: 'Pages vues', className: 'is-views' }, { name: 'Visiteurs', className: 'is-visitors' }]}
              selected={month}
              onSelect={setMonth}
            />

            <div className="adm-table-wrap">
              <table className="adm-table">
                <thead>
                  <tr><th>Mois</th><th>Pages vues</th><th>Visiteurs</th><th>Demandes de contact</th></tr>
                </thead>
                <tbody>
                  {stats.months.map((m) => (
                    <tr key={m.month} className={m.month === month ? 'is-selected' : ''} onClick={() => setMonth(m.month)}>
                      <td>{MONTHS[m.month - 1]}</td>
                      <td>{fmt(m.views)}</td>
                      <td>{fmt(m.visitors)}</td>
                      <td>{fmt(m.contacts)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr><td>Total {year}</td><td>{fmt(yearTotals.views)}</td><td>{fmt(yearTotals.visitors)}</td><td>{fmt(yearTotals.contacts)}</td></tr>
                </tfoot>
              </table>
            </div>
          </>
        )}
      </section>

      {detail && (
        <section className="adm-card">
          <div className="adm-card-head">
            <div>
              <h2>{MONTHS[detail.month - 1]} {year}</h2>
              <p className="adm-muted">
                {fmt(detail.views)} pages vues · {fmt(detail.visitors)} visiteurs · {fmt(detail.contacts)} demandes de contact
              </p>
            </div>
          </div>
          <BarChart
            data={detail.days.map((d) => ({ key: d.day, label: String(d.day), values: [d.views, d.visitors] }))}
            series={[{ name: 'Pages vues', className: 'is-views' }, { name: 'Visiteurs', className: 'is-visitors' }]}
            height={180}
          />

          <div className="adm-grid-3">
            <div>
              <h3>Pages les plus vues</h3>
              <RankList items={Object.entries(detail.pages).slice(0, 8).map(([path, value]) => ({
                label: PAGE_LABELS[path] || eventLabel(path, events), value,
              }))} />
            </div>
            <div>
              <h3>D'où viennent les visiteurs</h3>
              <RankList items={Object.entries(detail.referrers).slice(0, 8).map(([label, value]) => ({ label, value }))} />
            </div>
            <div>
              <h3>Appareils utilisés</h3>
              <RankList items={Object.entries(detail.devices).map(([label, value]) => ({ label: label[0].toUpperCase() + label.slice(1), value }))} />
            </div>
          </div>
        </section>
      )}

      <p className="adm-muted adm-small">
        Les statistiques sont anonymes : un « visiteur » correspond à une personne distincte sur le mois ;
        les robots des moteurs de recherche ne sont pas comptés.
      </p>
    </div>
  )
}

function eventLabel(path, events) {
  const id = path.replace('/actualites/', '')
  const event = events.find((e) => e.id === id)
  return event ? `Événement : ${event.title}` : path
}
