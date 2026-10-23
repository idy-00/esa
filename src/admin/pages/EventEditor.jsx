import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Save, Loader2, ExternalLink } from 'lucide-react'
import { useConfirm, useContent } from '../context'
import { useDraft } from '../useDraft'
import { TextField, Toggle, ImageField, PhotosField, Field } from '../fields'
import { slugify, uniqueId } from '../api'

const EMPTY_EVENT = {
  id: '', published: true, featured: false, date: '', endDate: '', location: '',
  title: '', summary: '', body: '', cover: '', photos: [],
}

export default function EventEditor() {
  const { id } = useParams()
  const isNew = id === 'nouveau'
  const { content } = useContent()
  const existing = content.actualites.events.find((e) => e.id === id)

  if (!isNew && !existing) {
    return (
      <div className="adm-page">
        <div className="adm-card adm-empty">
          <p>Cet événement n'existe plus.</p>
          <Link to="/admin/evenements" className="adm-btn">Retour à la liste</Link>
        </div>
      </div>
    )
  }

  return <EventForm key={id} isNew={isNew} initial={existing ? { ...EMPTY_EVENT, ...existing } : EMPTY_EVENT} />
}

function EventForm({ isNew, initial }) {
  const { content, save } = useContent()
  const confirm = useConfirm()
  const navigate = useNavigate()
  const { draft, setField, dirty, reset } = useDraft(initial)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    if (!draft.title.trim()) return setError('Le titre est obligatoire.')
    if (draft.endDate && !draft.date) return setError('Indiquez aussi la date de début.')
    if (draft.endDate && draft.endDate < draft.date) return setError('La date de fin doit être après la date de début.')
    setError('')
    setBusy(true)

    const event = { ...draft, title: draft.title.trim(), cover: draft.cover || draft.photos[0]?.src || '' }
    const ok = await save((c) => {
      const list = c.actualites.events
      if (isNew) {
        event.id = uniqueId(slugify(event.title), list.map((x) => x.id))
        list.unshift(event)
      } else {
        const index = list.findIndex((x) => x.id === initial.id)
        if (index === -1) list.unshift(event)
        else list[index] = event
      }
    }, `${isNew ? 'Événement ajouté' : 'Événement modifié'} : ${event.title}`)
    setBusy(false)
    if (ok) {
      reset(event)
      navigate('/admin/evenements')
    }
  }

  const cancel = async () => {
    if (dirty && !(await confirm({ title: 'Abandonner les modifications ?', message: 'Les changements non enregistrés seront perdus.', confirmLabel: 'Abandonner', danger: true }))) return
    navigate('/admin/evenements')
  }

  const published = content.actualites.events.some((e) => e.id === initial.id && e.published)

  return (
    <form className="adm-page" onSubmit={submit}>
      <div className="adm-page-head">
        <div>
          <button type="button" className="adm-back" onClick={cancel}><ArrowLeft size={16} /> Événements</button>
          <h1>{isNew ? 'Nouvel événement' : 'Modifier l\'événement'}</h1>
        </div>
        {!isNew && published && (
          <a className="adm-btn" href={`/actualites/${initial.id}`} target="_blank" rel="noreferrer"><ExternalLink size={16} /> Voir sur le site</a>
        )}
      </div>

      <div className="adm-editor">
        <div className="adm-editor-main">
          <section className="adm-card">
            <h2>Informations</h2>
            <TextField label="Titre" required value={draft.title} onChange={(v) => setField('title', v)} maxLength={200} placeholder="Ex. : Cérémonie de remise des diplômes 2026" />
            <div className="adm-row">
              <Field label="Date" hint="Laissez vide si l'événement n'a pas de date précise.">
                {(fid) => <input id={fid} type="date" className="adm-input" value={draft.date} onChange={(e) => setField('date', e.target.value)} />}
              </Field>
              <Field label="Date de fin (facultatif)" hint="Pour un événement sur plusieurs jours.">
                {(fid) => <input id={fid} type="date" className="adm-input" value={draft.endDate} min={draft.date || undefined} onChange={(e) => setField('endDate', e.target.value)} />}
              </Field>
            </div>
            <TextField label="Lieu (facultatif)" value={draft.location} onChange={(v) => setField('location', v)} maxLength={200} placeholder="Ex. : Campus ESA, Dakar" />
            <TextField label="Résumé" hint="Une ou deux phrases affichées sur la carte de l'événement." multiline rows={2} value={draft.summary} onChange={(v) => setField('summary', v)} maxLength={600} />
            <TextField label="Description complète" hint="Laissez une ligne vide entre deux paragraphes." multiline rows={9} value={draft.body} onChange={(v) => setField('body', v)} maxLength={20000} />
          </section>

          <section className="adm-card">
            <h2>Photos</h2>
            <PhotosField
              photos={draft.photos}
              onChange={(v) => setField('photos', v)}
              cover={draft.cover}
              onSetCover={(src) => setField('cover', src)}
              hint="Cliquez sur l'étoile ★ d'une photo pour en faire la photo de couverture."
            />
          </section>
        </div>

        <aside className="adm-editor-side">
          <section className="adm-card">
            <h2>Publication</h2>
            <Toggle label="En ligne" hint="Décochez pour garder l'événement en brouillon (invisible sur le site)." checked={draft.published} onChange={(v) => setField('published', v)} />
            <Toggle label="Mettre en avant" hint="Affiche l'événement en grande section avec sa galerie sur la page Actualités." checked={draft.featured} onChange={(v) => setField('featured', v)} />
          </section>

          <section className="adm-card">
            <ImageField label="Photo de couverture" hint="Si vide, la première photo de la galerie est utilisée." value={draft.cover} onChange={(v) => setField('cover', v)} />
          </section>

          <div className="adm-sticky-actions">
            {error && <div className="adm-alert adm-alert-error">{error}</div>}
            <button className="adm-btn adm-btn-primary adm-btn-block" disabled={busy || (!dirty && !isNew)}>
              {busy ? <Loader2 size={18} className="adm-spin" /> : <Save size={18} />}
              {isNew ? 'Créer l\'événement' : 'Enregistrer'}
            </button>
            <button type="button" className="adm-btn adm-btn-block" onClick={cancel}>Annuler</button>
            {dirty && <p className="adm-unsaved">Modifications non enregistrées</p>}
          </div>
        </aside>
      </div>
    </form>
  )
}
