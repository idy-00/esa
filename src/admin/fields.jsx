import { useId, useRef, useState } from 'react'
import { ImagePlus, Trash2, ChevronLeft, ChevronRight, Star, UploadCloud, Video, Loader2 } from 'lucide-react'
import { compressImage, uploadFile } from './api'
import { useToast } from './context'

export function Field({ label, hint, required, children }) {
  const id = useId()
  return (
    <div className="adm-field">
      <label htmlFor={id}>
        {label}
        {required && <span className="adm-required"> *</span>}
      </label>
      {typeof children === 'function' ? children(id) : children}
      {hint && <p className="adm-hint">{hint}</p>}
    </div>
  )
}

export function TextField({ label, hint, required, value, onChange, multiline, rows = 4, ...rest }) {
  return (
    <Field label={label} hint={hint} required={required}>
      {(id) => multiline
        ? <textarea id={id} className="adm-input" rows={rows} value={value} onChange={(e) => onChange(e.target.value)} {...rest} />
        : <input id={id} className="adm-input" value={value} onChange={(e) => onChange(e.target.value)} {...rest} />}
    </Field>
  )
}

export function Toggle({ label, hint, checked, onChange }) {
  return (
    <label className="adm-toggle">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span className="adm-toggle-track"><span className="adm-toggle-thumb" /></span>
      <span>
        <strong>{label}</strong>
        {hint && <small>{hint}</small>}
      </span>
    </label>
  )
}

/** Envoie une liste de fichiers et renvoie leurs URL, avec suivi de progression. */
function useUploader() {
  const toast = useToast()
  const [progress, setProgress] = useState(null) // { done, total, current }

  const upload = async (files) => {
    const urls = []
    const list = Array.from(files)
    for (let i = 0; i < list.length; i++) {
      setProgress({ done: i, total: list.length, current: 0 })
      try {
        const file = await compressImage(list[i])
        urls.push(await uploadFile(file, (p) => setProgress({ done: i, total: list.length, current: p })))
      } catch (err) {
        toast.error(`« ${list[i].name} » : ${err.message}`)
      }
    }
    setProgress(null)
    return urls
  }

  return { upload, progress }
}

function UploadProgress({ progress }) {
  if (!progress) return null
  const pct = Math.round(((progress.done + progress.current) / progress.total) * 100)
  return (
    <div className="adm-progress">
      <div className="adm-progress-label">
        <Loader2 size={16} className="adm-spin" />
        Envoi {progress.total > 1 ? `${progress.done + 1} / ${progress.total}` : 'en cours'}… {pct} %
      </div>
      <div className="adm-progress-bar"><span style={{ width: `${pct}%` }} /></div>
    </div>
  )
}

export function ImageField({ label, hint, value, onChange }) {
  const input = useRef(null)
  const { upload, progress } = useUploader()

  const pick = async (files) => {
    const [url] = await upload(files)
    if (url) onChange(url)
  }

  return (
    <Field label={label} hint={hint}>
      <div className="adm-image-field">
        {value
          ? <img src={value} alt="" className="adm-image-preview" />
          : <div className="adm-image-empty"><ImagePlus size={28} /><span>Aucune image</span></div>}
        <div className="adm-image-actions">
          <button type="button" className="adm-btn" onClick={() => input.current.click()} disabled={!!progress}>
            <UploadCloud size={16} /> {value ? 'Changer l\'image' : 'Choisir une image'}
          </button>
          {value && (
            <button type="button" className="adm-btn adm-btn-ghost" onClick={() => onChange('')}>
              <Trash2 size={16} /> Retirer
            </button>
          )}
          <UploadProgress progress={progress} />
        </div>
        <input ref={input} type="file" accept="image/*" hidden onChange={(e) => { pick(e.target.files); e.target.value = '' }} />
      </div>
    </Field>
  )
}

/** Applique une valeur ou une fonction de mise à jour (comme setState). */
export const resolve = (value, previous) => (typeof value === 'function' ? value(previous) : value)

/**
 * Gestion d'une galerie : ajout multiple (bouton ou glisser-déposer), légendes, ordre, suppression.
 * `onChange` reçoit soit la nouvelle liste, soit une fonction (liste actuelle → nouvelle liste).
 */
export function PhotosField({ label = 'Photos', hint, photos, onChange, cover, onSetCover }) {
  const input = useRef(null)
  const [dragOver, setDragOver] = useState(false)
  const { upload, progress } = useUploader()

  const add = async (files) => {
    const images = Array.from(files).filter((f) => f.type.startsWith('image/') || /\.(heic|heif)$/i.test(f.name))
    if (!images.length) return
    const urls = await upload(images)
    // Mise à jour fonctionnelle : les légendes saisies pendant l'envoi sont conservées.
    if (urls.length) onChange((current) => [...current, ...urls.map((src) => ({ src, alt: '' }))])
  }

  const move = (i, dir) => {
    const next = [...photos]
    const j = i + dir
    if (j < 0 || j >= next.length) return
    ;[next[i], next[j]] = [next[j], next[i]]
    onChange(next)
  }

  const update = (i, patch) => onChange(photos.map((p, k) => (k === i ? { ...p, ...patch } : p)))
  const remove = (i) => onChange(photos.filter((_, k) => k !== i))

  return (
    <Field label={`${label} (${photos.length})`} hint={hint}>
      <div
        className={`adm-dropzone ${dragOver ? 'is-over' : ''}`}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); add(e.dataTransfer.files) }}
      >
        <UploadCloud size={28} />
        <p>Glissez vos photos ici ou</p>
        <button type="button" className="adm-btn adm-btn-primary" onClick={() => input.current.click()} disabled={!!progress}>
          <ImagePlus size={16} /> Ajouter des photos
        </button>
        <small>Vous pouvez en sélectionner plusieurs à la fois. Elles sont automatiquement allégées.</small>
        <UploadProgress progress={progress} />
        <input ref={input} type="file" accept="image/*" multiple hidden onChange={(e) => { add(e.target.files); e.target.value = '' }} />
      </div>

      {photos.length > 0 && (
        <div className="adm-photos">
          {photos.map((photo, i) => (
            <div key={photo.src + i} className={`adm-photo ${cover === photo.src ? 'is-cover' : ''}`}>
              <div className="adm-photo-img">
                <img src={photo.src} alt="" loading="lazy" />
                {cover === photo.src && <span className="adm-photo-badge">Couverture</span>}
              </div>
              <input
                className="adm-input adm-input-sm"
                placeholder="Légende (facultatif)"
                value={photo.alt}
                onChange={(e) => update(i, { alt: e.target.value })}
              />
              <div className="adm-photo-tools">
                <button type="button" title="Déplacer avant" aria-label="Déplacer avant" onClick={() => move(i, -1)} disabled={i === 0}><ChevronLeft size={16} /></button>
                <button type="button" title="Déplacer après" aria-label="Déplacer après" onClick={() => move(i, 1)} disabled={i === photos.length - 1}><ChevronRight size={16} /></button>
                {onSetCover && (
                  <button type="button" title="Utiliser comme photo de couverture" aria-label="Utiliser comme couverture" onClick={() => onSetCover(photo.src)}>
                    <Star size={16} fill={cover === photo.src ? 'currentColor' : 'none'} />
                  </button>
                )}
                <button type="button" className="is-danger" title="Retirer la photo" aria-label="Retirer la photo" onClick={() => remove(i)}><Trash2 size={16} /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </Field>
  )
}

export function VideoFileField({ value, onChange }) {
  const input = useRef(null)
  const { upload, progress } = useUploader()

  const pick = async (files) => {
    const [url] = await upload(files)
    if (url) onChange(url)
  }

  return (
    <Field label="Fichier vidéo" hint="Format MP4. Pour les vidéos longues ou lourdes, préférez un lien YouTube.">
      <div className="adm-image-field">
        {value
          ? <video src={value} controls preload="metadata" className="adm-image-preview" />
          : <div className="adm-image-empty"><Video size={28} /><span>Aucune vidéo</span></div>}
        <div className="adm-image-actions">
          <button type="button" className="adm-btn" onClick={() => input.current.click()} disabled={!!progress}>
            <UploadCloud size={16} /> {value ? 'Changer la vidéo' : 'Choisir une vidéo'}
          </button>
          <UploadProgress progress={progress} />
        </div>
        <input ref={input} type="file" accept="video/mp4,video/webm" hidden onChange={(e) => { pick(e.target.files); e.target.value = '' }} />
      </div>
    </Field>
  )
}
