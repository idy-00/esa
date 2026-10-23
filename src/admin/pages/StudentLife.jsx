import { useState } from 'react'
import { Plus, Trash2, ArrowUp, ArrowDown, ChevronDown } from 'lucide-react'
import { useConfirm, useContent, useToast } from '../context'
import { useDraft } from '../useDraft'
import { TextField, Toggle, ImageField, PhotosField, Field, resolve } from '../fields'
import { slugify, uniqueId } from '../api'
import SaveBar from '../SaveBar'

export default function StudentLife() {
  const { content, save } = useContent()
  const confirm = useConfirm()
  const toast = useToast()
  const { draft, setDraft, dirty, reset } = useDraft(content.vieEtudiante)
  const [busy, setBusy] = useState(false)
  const [open, setOpen] = useState(() => new Set())

  const setSection = (section, key, value) => setDraft((d) => ({ ...d, [section]: { ...d[section], [key]: value } }))
  const setAlbum = (index, key, value) => setDraft((d) => ({
    ...d,
    albums: d.albums.map((a, i) => (i === index ? { ...a, [key]: resolve(value, a[key]) } : a)),
  }))

  const toggleOpen = (id) => setOpen((s) => {
    const next = new Set(s)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    return next
  })

  const addAlbum = () => {
    const id = `tmp-${Date.now()}`
    setDraft((d) => ({ ...d, albums: [{ id, published: true, layout: 'grid', title: '', subtitle: '', photos: [] }, ...d.albums] }))
    setOpen((s) => new Set(s).add(id))
  }

  const moveAlbum = (index, dir) => setDraft((d) => {
    const albums = [...d.albums]
    const [item] = albums.splice(index, 1)
    albums.splice(index + dir, 0, item)
    return { ...d, albums }
  })

  const removeAlbum = async (album, index) => {
    const ok = await confirm({
      title: 'Supprimer cet album ?',
      message: `« ${album.title || 'Album sans titre'} » et ses ${album.photos.length} photos seront retirés de la page (après enregistrement).`,
      confirmLabel: 'Supprimer', danger: true,
    })
    if (ok) setDraft((d) => ({ ...d, albums: d.albums.filter((_, i) => i !== index) }))
  }

  const submit = async (e) => {
    e.preventDefault()
    const untitled = draft.albums.findIndex((a) => !a.title.trim())
    if (untitled !== -1) {
      setOpen((s) => new Set(s).add(draft.albums[untitled].id))
      return toast.error('Chaque album doit avoir un titre avant d\'enregistrer.')
    }
    setBusy(true)
    const ids = draft.albums.filter((a) => !a.id.startsWith('tmp-')).map((a) => a.id)
    const next = {
      ...draft,
      albums: draft.albums.map((a) => {
        if (!a.id.startsWith('tmp-')) return a
        const id = uniqueId(slugify(a.title), ids)
        ids.push(id)
        return { ...a, id }
      }),
    }
    const ok = await save((c) => { c.vieEtudiante = next }, 'Page Vie étudiante modifiée')
    setBusy(false)
    if (ok) reset(next)
  }

  return (
    <form className="adm-page adm-page-with-savebar" onSubmit={submit}>
      <div className="adm-page-head">
        <div>
          <h1>Vie étudiante</h1>
          <p className="adm-muted">Modifiez les textes, l'Amicale et les albums photos de la page Vie étudiante, puis cliquez sur « Enregistrer ».</p>
        </div>
        <a className="adm-btn" href="/vie-etudiante" target="_blank" rel="noreferrer">Voir la page</a>
      </div>

      <section className="adm-card">
        <div className="adm-card-head">
          <h2>Albums photos</h2>
          <button type="button" className="adm-btn adm-btn-primary" onClick={addAlbum}><Plus size={18} /> Nouvel album</button>
        </div>
        <p className="adm-muted">Exemples : « Sortie pédagogique à l'AIBD », « Journée d'intégration 2026 ». Les albums s'affichent dans cet ordre.</p>

        <div className="adm-albums">
          {draft.albums.map((album, index) => {
            const isOpen = open.has(album.id)
            return (
              <div key={album.id} className={`adm-album ${isOpen ? 'is-open' : ''} ${album.published ? '' : 'is-muted'}`}>
                <div className="adm-album-head">
                  <button type="button" className="adm-album-toggle" onClick={() => toggleOpen(album.id)} aria-expanded={isOpen}>
                    <ChevronDown size={18} />
                    <span className="adm-album-thumbs">
                      {album.photos.slice(0, 3).map((p) => <img key={p.src} src={p.src} alt="" />)}
                    </span>
                    <span>
                      <strong>{album.title || 'Nouvel album (sans titre)'}</strong>
                      <small>{album.photos.length} photo{album.photos.length > 1 ? 's' : ''}{album.published ? '' : ' · masqué'}</small>
                    </span>
                  </button>
                  <div className="adm-list-actions">
                    <button type="button" className="adm-icon-btn" title="Monter" aria-label="Monter" disabled={index === 0} onClick={() => moveAlbum(index, -1)}><ArrowUp size={17} /></button>
                    <button type="button" className="adm-icon-btn" title="Descendre" aria-label="Descendre" disabled={index === draft.albums.length - 1} onClick={() => moveAlbum(index, 1)}><ArrowDown size={17} /></button>
                    <button type="button" className="adm-icon-btn is-danger" title="Supprimer l'album" aria-label="Supprimer l'album" onClick={() => removeAlbum(album, index)}><Trash2 size={17} /></button>
                  </div>
                </div>

                {isOpen && (
                  <div className="adm-album-body">
                    <div className="adm-row">
                      <TextField label="Titre de l'album" required value={album.title} onChange={(v) => setAlbum(index, 'title', v)} maxLength={200} />
                      <TextField label="Sous-titre (facultatif)" value={album.subtitle} onChange={(v) => setAlbum(index, 'subtitle', v)} maxLength={300} />
                    </div>
                    <div className="adm-row">
                      <Field label="Présentation des photos">
                        {(fid) => (
                          <select id={fid} className="adm-input" value={album.layout} onChange={(e) => setAlbum(index, 'layout', e.target.value)}>
                            <option value="grid">Grille régulière</option>
                            <option value="mosaic">Mosaïque (1 grande photo + petites)</option>
                          </select>
                        )}
                      </Field>
                      <Toggle label="En ligne" hint="Décochez pour masquer l'album sans le supprimer." checked={album.published} onChange={(v) => setAlbum(index, 'published', v)} />
                    </div>
                    <PhotosField photos={album.photos} onChange={(v) => setAlbum(index, 'photos', v)} hint="Utilisez les flèches pour changer l'ordre. En mosaïque, la 1re photo est affichée en grand." />
                  </div>
                )}
              </div>
            )
          })}
          {draft.albums.length === 0 && <p className="adm-muted">Aucun album. Cliquez sur « Nouvel album » pour commencer.</p>}
        </div>
      </section>

      <section className="adm-card">
        <h2>L'Amicale des Étudiants</h2>
        <div className="adm-row adm-row-wide">
          <div>
            <TextField label="Titre" value={draft.amicale.title} onChange={(v) => setSection('amicale', 'title', v)} maxLength={200} />
            <TextField label="Texte" hint="Laissez une ligne vide entre deux paragraphes." multiline rows={8} value={draft.amicale.text} onChange={(v) => setSection('amicale', 'text', v)} maxLength={5000} />
          </div>
          <ImageField label="Photo" value={draft.amicale.image} onChange={(v) => setSection('amicale', 'image', v)} />
        </div>
      </section>

      <section className="adm-card">
        <h2>En-tête de la page</h2>
        <div className="adm-row adm-row-wide">
          <div>
            <TextField label="Petit titre" value={draft.hero.eyebrow} onChange={(v) => setSection('hero', 'eyebrow', v)} maxLength={80} />
            <TextField label="Grand titre" value={draft.hero.title} onChange={(v) => setSection('hero', 'title', v)} maxLength={200} />
            <TextField label="Texte d'introduction" multiline rows={3} value={draft.hero.text} onChange={(v) => setSection('hero', 'text', v)} maxLength={600} />
          </div>
          <ImageField label="Image de fond" value={draft.hero.image} onChange={(v) => setSection('hero', 'image', v)} />
        </div>
      </section>

      <SaveBar dirty={dirty} busy={busy} onUndo={() => reset(content.vieEtudiante)} />
    </form>
  )
}
