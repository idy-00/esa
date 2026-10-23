import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useContent } from '../context'
import { useDraft } from '../useDraft'
import { TextField, PhotosField, resolve } from '../fields'
import SaveBar from '../SaveBar'

const pick = ({ hero, community, eventsSection }) => ({ hero, community, eventsSection })

export default function NewsPage() {
  const { content, save } = useContent()
  const { draft, setDraft, dirty, reset } = useDraft(pick(content.actualites))
  const [busy, setBusy] = useState(false)

  const set = (section, key, value) => setDraft((d) => ({
    ...d,
    [section]: { ...d[section], [key]: resolve(value, d[section][key]) },
  }))

  const submit = async (e) => {
    e.preventDefault()
    setBusy(true)
    const ok = await save((c) => { Object.assign(c.actualites, draft) }, 'Textes de la page Actualités modifiés')
    setBusy(false)
    if (ok) reset(draft)
  }

  return (
    <form className="adm-page adm-page-with-savebar" onSubmit={submit}>
      <div className="adm-page-head">
        <div>
          <h1>Page Actualités</h1>
          <p className="adm-muted">
            Textes généraux de la page. Les événements se gèrent dans <Link to="/admin/evenements">Événements</Link> et
            les vidéos dans <Link to="/admin/videos">Vidéos</Link>.
          </p>
        </div>
        <a className="adm-btn" href="/actualites" target="_blank" rel="noreferrer">Voir la page</a>
      </div>

      <section className="adm-card">
        <h2>En-tête de la page</h2>
        <TextField label="Petit titre" value={draft.hero.eyebrow} onChange={(v) => set('hero', 'eyebrow', v)} maxLength={80} />
        <TextField label="Grand titre" value={draft.hero.title} onChange={(v) => set('hero', 'title', v)} maxLength={200} />
        <TextField label="Texte d'introduction" multiline rows={3} value={draft.hero.text} onChange={(v) => set('hero', 'text', v)} maxLength={600} />
      </section>

      <section className="adm-card">
        <h2>Section « Notre Communauté »</h2>
        <div className="adm-row">
          <TextField label="Titre" value={draft.community.title} onChange={(v) => set('community', 'title', v)} maxLength={200} />
          <TextField label="Sous-titre" value={draft.community.subtitle} onChange={(v) => set('community', 'subtitle', v)} maxLength={300} />
        </div>
        <PhotosField
          label="Photos (2 conseillées)"
          hint="La légende de chaque photo s'affiche sur l'image. Retirez toutes les photos pour masquer cette section."
          photos={draft.community.photos}
          onChange={(v) => set('community', 'photos', v)}
        />
      </section>

      <section className="adm-card">
        <h2>Section « Événements et Cérémonies »</h2>
        <div className="adm-row">
          <TextField label="Titre" value={draft.eventsSection.title} onChange={(v) => set('eventsSection', 'title', v)} maxLength={200} />
          <TextField label="Sous-titre" value={draft.eventsSection.subtitle} onChange={(v) => set('eventsSection', 'subtitle', v)} maxLength={300} />
        </div>
      </section>

      <SaveBar dirty={dirty} busy={busy} onUndo={() => reset(pick(content.actualites))} />
    </form>
  )
}
