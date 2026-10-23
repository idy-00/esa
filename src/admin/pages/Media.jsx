import { useCallback, useEffect, useState } from 'react'
import { Trash2, Copy, Loader2, PlayCircle } from 'lucide-react'
import { api, post, formatBytes, formatDateTime } from '../api'
import { useConfirm, useToast } from '../context'

export default function Media() {
  const confirm = useConfirm()
  const toast = useToast()
  const [data, setData] = useState(null)
  const [filter, setFilter] = useState('all')

  const load = useCallback(() => {
    api('media').then(setData).catch((err) => toast.error(err.message))
  }, [toast])

  useEffect(load, [load])

  const remove = async (item) => {
    if (!(await confirm({ title: 'Supprimer définitivement ce fichier ?', message: 'Cette action est irréversible.', confirmLabel: 'Supprimer', danger: true }))) return
    try {
      await post('delete_media', { url: item.url })
      toast.success('Fichier supprimé.')
      load()
    } catch (err) {
      toast.error(err.message)
    }
  }

  const removeUnused = async () => {
    const unused = data.items.filter((i) => !i.used)
    if (!(await confirm({
      title: `Supprimer les ${unused.length} fichiers inutilisés ?`,
      message: 'Ces fichiers ne sont affichés nulle part sur le site. Cette action est irréversible.',
      confirmLabel: 'Tout supprimer', danger: true,
    }))) return
    for (const item of unused) {
      await post('delete_media', { url: item.url }).catch(() => {})
    }
    toast.success('Fichiers inutilisés supprimés.')
    load()
  }

  const copy = (url) => {
    navigator.clipboard?.writeText(window.location.origin + url)
    toast.success('Lien copié.')
  }

  if (!data) return <div className="adm-center"><Loader2 className="adm-spin" /></div>

  const items = data.items.filter((i) => filter === 'all' || (filter === 'unused' ? !i.used : i.used))
  const totalSize = data.items.reduce((n, i) => n + i.size, 0)
  const unusedCount = data.items.filter((i) => !i.used).length

  return (
    <div className="adm-page">
      <div className="adm-page-head">
        <div>
          <h1>Médiathèque</h1>
          <p className="adm-muted">
            Tous les fichiers envoyés depuis le dashboard : {data.items.length} fichiers, {formatBytes(totalSize)}.
            Taille maximale par envoi autorisée par le serveur : {data.limits.upload}.
          </p>
        </div>
        {unusedCount > 0 && (
          <button className="adm-btn adm-btn-danger-outline" onClick={removeUnused}><Trash2 size={16} /> Supprimer les {unusedCount} inutilisés</button>
        )}
      </div>

      <div className="adm-segmented adm-mb">
        <button className={filter === 'all' ? 'is-active' : ''} onClick={() => setFilter('all')}>Tous</button>
        <button className={filter === 'used' ? 'is-active' : ''} onClick={() => setFilter('used')}>Utilisés sur le site</button>
        <button className={filter === 'unused' ? 'is-active' : ''} onClick={() => setFilter('unused')}>Inutilisés ({unusedCount})</button>
      </div>

      {items.length === 0 ? (
        <div className="adm-card adm-empty"><p>Aucun fichier.</p></div>
      ) : (
        <div className="adm-media-grid">
          {items.map((item) => (
            <div key={item.url} className="adm-media-item">
              <div className="adm-media-preview">
                {item.type === 'video' ? <PlayCircle size={32} /> : <img src={item.url} alt="" loading="lazy" />}
                <span className={`adm-badge ${item.used ? 'is-green' : ''}`}>{item.used ? 'Utilisé' : 'Inutilisé'}</span>
              </div>
              <div className="adm-media-info">
                <small>{formatBytes(item.size)} · {formatDateTime(item.date)}</small>
                <div>
                  <button className="adm-icon-btn" title="Copier le lien" aria-label="Copier le lien" onClick={() => copy(item.url)}><Copy size={16} /></button>
                  {!item.used && (
                    <button className="adm-icon-btn is-danger" title="Supprimer" aria-label="Supprimer" onClick={() => remove(item)}><Trash2 size={16} /></button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <p className="adm-muted adm-small">
        Les photos d'origine du site (dossier /media) ne figurent pas ici. Un fichier « utilisé » ne peut pas être supprimé :
        retirez-le d'abord de l'événement ou de l'album concerné.
      </p>
    </div>
  )
}
