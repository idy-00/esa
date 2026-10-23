import { useCallback, useEffect, useState } from 'react'
import { RotateCcw, Loader2 } from 'lucide-react'
import { api, post, formatDateTime } from '../api'
import { useConfirm, useContent, useToast } from '../context'

export default function HistoryPage() {
  const { version, replace } = useContent()
  const confirm = useConfirm()
  const toast = useToast()
  const [activity, setActivity] = useState(null)
  const [backups, setBackups] = useState(null)

  const load = useCallback(() => {
    api('activity').then((d) => setActivity(d.items)).catch((err) => toast.error(err.message))
    api('backups').then((d) => setBackups(d.items)).catch((err) => toast.error(err.message))
  }, [toast])

  useEffect(load, [load])

  const restore = async (backup) => {
    const ok = await confirm({
      title: 'Restaurer cette version ?',
      message: `Le contenu des pages Actualités et Vie étudiante redeviendra celui du ${formatDateTime(backup.updatedAt)}. La version actuelle restera disponible dans cette liste.`,
      confirmLabel: 'Restaurer',
    })
    if (!ok) return
    try {
      const data = await post('restore_backup', { name: backup.name, baseVersion: version })
      replace(data)
      toast.success('Version restaurée.')
      load()
    } catch (err) {
      toast.error(err.message)
    }
  }

  return (
    <div className="adm-page">
      <div className="adm-page-head">
        <div>
          <h1>Historique</h1>
          <p className="adm-muted">Qui a modifié quoi, et possibilité de revenir à une version précédente en cas d'erreur.</p>
        </div>
      </div>

      <div className="adm-grid-2">
        <section className="adm-card">
          <h2>Versions précédentes</h2>
          <p className="adm-muted adm-small">Une copie est gardée avant chaque enregistrement (les 40 dernières).</p>
          {!backups ? <Loader2 className="adm-spin" /> : backups.length === 0 ? (
            <p className="adm-muted">Aucune version précédente pour l'instant.</p>
          ) : (
            <ul className="adm-timeline">
              {backups.map((b) => (
                <li key={b.name}>
                  <div>
                    <strong>{formatDateTime(b.updatedAt)}</strong>
                    <small>État juste après : {b.summary || 'modification'}{b.updatedBy ? ` (${b.updatedBy})` : ''}</small>
                  </div>
                  <button className="adm-btn adm-btn-sm" onClick={() => restore(b)}><RotateCcw size={15} /> Restaurer</button>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="adm-card">
          <h2>Journal d'activité</h2>
          {!activity ? <Loader2 className="adm-spin" /> : activity.length === 0 ? (
            <p className="adm-muted">Aucune activité enregistrée.</p>
          ) : (
            <ul className="adm-timeline">
              {activity.slice(0, 100).map((a, i) => (
                <li key={i}>
                  <div>
                    <strong>{a.action}</strong>
                    <small>{a.user} · {formatDateTime(a.at)}</small>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  )
}
