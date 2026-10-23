import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Plus, Pencil, Trash2, ArrowUp, ArrowDown, Eye, EyeOff, Search, ImageOff, ExternalLink } from 'lucide-react'
import { useConfirm, useContent } from '../context'
import { formatEventDate, isUpcoming } from '../../content/siteContent'

export default function Events() {
  const { content, save } = useContent()
  const confirm = useConfirm()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const events = content.actualites.events

  const q = query.trim().toLowerCase()
  const visible = events
    .map((event, index) => ({ event, index }))
    .filter(({ event }) => !q || event.title.toLowerCase().includes(q) || event.summary.toLowerCase().includes(q))

  const move = (index, dir) => save((c) => {
    const list = c.actualites.events
    const [item] = list.splice(index, 1)
    list.splice(index + dir, 0, item)
  }, `Ordre des événements modifié`)

  const togglePublished = (event, index) => save((c) => {
    c.actualites.events[index].published = !event.published
  }, `${event.published ? 'Masqué' : 'Publié'} : ${event.title}`)

  const remove = async (event, index) => {
    const ok = await confirm({
      title: 'Supprimer cet événement ?',
      message: `« ${event.title} » sera retiré du site. Vous pourrez le récupérer depuis l'Historique si besoin.`,
      confirmLabel: 'Supprimer',
      danger: true,
    })
    if (ok) await save((c) => { c.actualites.events.splice(index, 1) }, `Événement supprimé : ${event.title}`)
  }

  return (
    <div className="adm-page">
      <div className="adm-page-head">
        <div>
          <h1>Événements</h1>
          <p className="adm-muted">Les événements apparaissent sur la page Actualités, dans l'ordre ci-dessous.</p>
        </div>
        <button className="adm-btn adm-btn-primary" onClick={() => navigate('/admin/evenements/nouveau')}>
          <Plus size={18} /> Nouvel événement
        </button>
      </div>

      {events.length > 5 && (
        <div className="adm-search">
          <Search size={18} />
          <input className="adm-input" placeholder="Rechercher un événement…" value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
      )}

      {visible.length === 0 ? (
        <div className="adm-card adm-empty">
          <p>{events.length ? 'Aucun événement ne correspond à la recherche.' : 'Aucun événement pour le moment.'}</p>
          {!events.length && <Link to="/admin/evenements/nouveau" className="adm-btn adm-btn-primary"><Plus size={18} /> Créer le premier événement</Link>}
        </div>
      ) : (
        <ul className="adm-list">
          {visible.map(({ event, index }) => (
            <li key={event.id} className={`adm-list-item ${event.published ? '' : 'is-muted'}`}>
              <Link to={`/admin/evenements/${event.id}`} className="adm-list-thumb">
                {event.cover || event.photos[0]
                  ? <img src={event.cover || event.photos[0].src} alt="" loading="lazy" />
                  : <ImageOff size={22} />}
              </Link>
              <div className="adm-list-body">
                <Link to={`/admin/evenements/${event.id}`} className="adm-list-title">{event.title}</Link>
                <div className="adm-badges">
                  {event.published ? <span className="adm-badge is-green">En ligne</span> : <span className="adm-badge">Brouillon (masqué)</span>}
                  {isUpcoming(event) && <span className="adm-badge is-orange">À venir</span>}
                  {event.featured && <span className="adm-badge is-blue">Mis en avant</span>}
                  {event.date && <span className="adm-badge-text">{formatEventDate(event.date, event.endDate)}</span>}
                  <span className="adm-badge-text">{event.photos.length} photo{event.photos.length > 1 ? 's' : ''}</span>
                </div>
              </div>
              <div className="adm-list-actions">
                <button className="adm-icon-btn" title="Monter" aria-label="Monter" disabled={index === 0 || !!q} onClick={() => move(index, -1)}><ArrowUp size={17} /></button>
                <button className="adm-icon-btn" title="Descendre" aria-label="Descendre" disabled={index === events.length - 1 || !!q} onClick={() => move(index, 1)}><ArrowDown size={17} /></button>
                <button className="adm-icon-btn" title={event.published ? 'Masquer du site' : 'Mettre en ligne'} aria-label={event.published ? 'Masquer du site' : 'Mettre en ligne'} onClick={() => togglePublished(event, index)}>
                  {event.published ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
                {event.published && (
                  <a className="adm-icon-btn" href={`/actualites/${event.id}`} target="_blank" rel="noreferrer" title="Voir sur le site" aria-label="Voir sur le site"><ExternalLink size={17} /></a>
                )}
                <Link className="adm-btn adm-btn-sm" to={`/admin/evenements/${event.id}`}><Pencil size={15} /> Modifier</Link>
                <button className="adm-icon-btn is-danger" title="Supprimer" aria-label="Supprimer" onClick={() => remove(event, index)}><Trash2 size={17} /></button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
