import { Loader2, Save, Undo2 } from 'lucide-react'

/** Barre d'enregistrement collée en bas de l'écran pour les formulaires longs. */
export default function SaveBar({ dirty, busy, onUndo }) {
  return (
    <div className={`adm-savebar ${dirty ? 'is-dirty' : ''}`}>
      <span>{dirty ? 'Vous avez des modifications non enregistrées.' : 'Tout est enregistré.'}</span>
      <div>
        {dirty && (
          <button type="button" className="adm-btn adm-btn-ghost" onClick={onUndo} disabled={busy}>
            <Undo2 size={16} /> Annuler les changements
          </button>
        )}
        <button className="adm-btn adm-btn-primary" disabled={!dirty || busy}>
          {busy ? <Loader2 size={18} className="adm-spin" /> : <Save size={18} />} Enregistrer
        </button>
      </div>
    </div>
  )
}
