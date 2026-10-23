import { useState } from 'react'
import { Plus, Pencil, Trash2, ArrowUp, ArrowDown, Save, Loader2, PlayCircle } from 'lucide-react'
import { useConfirm, useContent } from '../context'
import { useDraft } from '../useDraft'
import { TextField, Toggle, ImageField, VideoFileField, Field } from '../fields'
import { slugify, uniqueId } from '../api'

const EMPTY_VIDEO = { id: '', published: true, title: '', subtitle: '', description: '', src: '', poster: '', youtube: '' }

function youtubeId(value) {
  const m = value.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/)
  return m ? m[1] : /^[A-Za-z0-9_-]{11}$/.test(value.trim()) ? value.trim() : ''
}

function VideoForm({ initial, isNew, onDone }) {
  const { save } = useContent()
  const { draft, setField } = useDraft({ ...initial, youtube: initial.youtube ? `https://youtu.be/${initial.youtube}` : '' })
  const [source, setSource] = useState(initial.youtube ? 'youtube' : 'file')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    const yt = source === 'youtube' ? youtubeId(draft.youtube) : ''
    if (!draft.title.trim()) return setError('Le titre est obligatoire.')
    if (source === 'youtube' && !yt) return setError('Lien YouTube non reconnu. Copiez l\'adresse de la vidéo (ex. https://youtu.be/…).')
    if (source === 'file' && !draft.src) return setError('Choisissez un fichier vidéo.')
    setError('')
    setBusy(true)
    const video = { ...draft, title: draft.title.trim(), youtube: yt, src: source === 'file' ? draft.src : '' }
    const ok = await save((c) => {
      const list = c.actualites.videos
      if (isNew) {
        video.id = uniqueId(slugify(video.title), list.map((v) => v.id))
        list.push(video)
      } else {
        const index = list.findIndex((v) => v.id === initial.id)
        if (index === -1) list.push(video)
        else list[index] = video
      }
    }, `${isNew ? 'Vidéo ajoutée' : 'Vidéo modifiée'} : ${video.title}`)
    setBusy(false)
    if (ok) onDone()
  }

  const yt = youtubeId(draft.youtube)

  return (
    <form className="adm-card adm-inline-form" onSubmit={submit}>
      <h2>{isNew ? 'Nouvelle vidéo' : 'Modifier la vidéo'}</h2>
      <TextField label="Titre de la section" required value={draft.title} onChange={(v) => setField('title', v)} maxLength={200} placeholder="Ex. : Interview du Directeur" />
      <TextField label="Sous-titre (facultatif)" value={draft.subtitle} onChange={(v) => setField('subtitle', v)} maxLength={300} />
      <TextField label="Description (facultatif)" multiline rows={3} value={draft.description} onChange={(v) => setField('description', v)} maxLength={3000} />

      <Field label="Source de la vidéo">
        <div className="adm-segmented">
          <button type="button" className={source === 'file' ? 'is-active' : ''} onClick={() => setSource('file')}>Fichier MP4</button>
          <button type="button" className={source === 'youtube' ? 'is-active' : ''} onClick={() => setSource('youtube')}>Lien YouTube</button>
        </div>
      </Field>

      {source === 'file' ? (
        <div className="adm-row">
          <VideoFileField value={draft.src} onChange={(v) => setField('src', v)} />
          <ImageField label="Image d'aperçu (facultatif)" hint="Affichée avant la lecture." value={draft.poster} onChange={(v) => setField('poster', v)} />
        </div>
      ) : (
        <>
          <TextField label="Lien YouTube" value={draft.youtube} onChange={(v) => setField('youtube', v)} placeholder="https://www.youtube.com/watch?v=…" />
          {yt && <img className="adm-yt-preview" src={`https://i.ytimg.com/vi/${yt}/hqdefault.jpg`} alt="Aperçu YouTube" />}
        </>
      )}

      <Toggle label="En ligne" checked={draft.published} onChange={(v) => setField('published', v)} />

      {error && <div className="adm-alert adm-alert-error">{error}</div>}
      <div className="adm-form-actions">
        <button type="button" className="adm-btn" onClick={onDone}>Annuler</button>
        <button className="adm-btn adm-btn-primary" disabled={busy}>
          {busy ? <Loader2 size={18} className="adm-spin" /> : <Save size={18} />} Enregistrer
        </button>
      </div>
    </form>
  )
}

export default function Videos() {
  const { content, save } = useContent()
  const confirm = useConfirm()
  const [editing, setEditing] = useState(null) // id, 'new' ou null
  const videos = content.actualites.videos

  const move = (index, dir) => save((c) => {
    const [item] = c.actualites.videos.splice(index, 1)
    c.actualites.videos.splice(index + dir, 0, item)
  }, 'Ordre des vidéos modifié')

  const remove = async (video, index) => {
    if (await confirm({ title: 'Supprimer cette vidéo ?', message: `« ${video.title} » sera retirée de la page Actualités.`, confirmLabel: 'Supprimer', danger: true })) {
      await save((c) => { c.actualites.videos.splice(index, 1) }, `Vidéo supprimée : ${video.title}`)
    }
  }

  return (
    <div className="adm-page">
      <div className="adm-page-head">
        <div>
          <h1>Vidéos</h1>
          <p className="adm-muted">Chaque vidéo s'affiche dans sa propre section sur la page Actualités.</p>
        </div>
        {editing === null && (
          <button className="adm-btn adm-btn-primary" onClick={() => setEditing('new')}><Plus size={18} /> Ajouter une vidéo</button>
        )}
      </div>

      {editing === 'new' && <VideoForm isNew initial={EMPTY_VIDEO} onDone={() => setEditing(null)} />}

      {videos.length === 0 && editing !== 'new' && (
        <div className="adm-card adm-empty"><p>Aucune vidéo pour le moment.</p></div>
      )}

      <ul className="adm-list">
        {videos.map((video, index) => editing === video.id ? (
          <li key={video.id}><VideoForm initial={{ ...EMPTY_VIDEO, ...video }} onDone={() => setEditing(null)} /></li>
        ) : (
          <li key={video.id} className={`adm-list-item ${video.published ? '' : 'is-muted'}`}>
            <div className="adm-list-thumb">
              {video.youtube
                ? <img src={`https://i.ytimg.com/vi/${video.youtube}/mqdefault.jpg`} alt="" />
                : video.poster ? <img src={video.poster} alt="" /> : <PlayCircle size={24} />}
            </div>
            <div className="adm-list-body">
              <span className="adm-list-title">{video.title}</span>
              <div className="adm-badges">
                {video.published ? <span className="adm-badge is-green">En ligne</span> : <span className="adm-badge">Masquée</span>}
                <span className="adm-badge-text">{video.youtube ? 'YouTube' : 'Fichier vidéo'}</span>
              </div>
            </div>
            <div className="adm-list-actions">
              <button className="adm-icon-btn" title="Monter" aria-label="Monter" disabled={index === 0} onClick={() => move(index, -1)}><ArrowUp size={17} /></button>
              <button className="adm-icon-btn" title="Descendre" aria-label="Descendre" disabled={index === videos.length - 1} onClick={() => move(index, 1)}><ArrowDown size={17} /></button>
              <button className="adm-btn adm-btn-sm" onClick={() => setEditing(video.id)} disabled={editing !== null}><Pencil size={15} /> Modifier</button>
              <button className="adm-icon-btn is-danger" title="Supprimer" aria-label="Supprimer" onClick={() => remove(video, index)}><Trash2 size={17} /></button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
