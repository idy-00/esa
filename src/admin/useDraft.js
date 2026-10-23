import { useCallback, useEffect, useState } from 'react'
import { resolve } from './fields'

/**
 * Brouillon local d'un formulaire : rien n'est envoyé tant qu'on n'a pas cliqué sur « Enregistrer ».
 * Prévient le navigateur si on quitte la page avec des modifications non enregistrées.
 */
export function useDraft(initial) {
  const [original, setOriginal] = useState(initial)
  const [draft, setDraft] = useState(initial)
  const dirty = JSON.stringify(draft) !== JSON.stringify(original)

  useEffect(() => {
    if (!dirty) return
    const warn = (e) => {
      e.preventDefault()
      e.returnValue = ''
    }
    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [dirty])

  const setField = useCallback((key, value) => {
    setDraft((d) => ({ ...d, [key]: resolve(value, d[key]) }))
  }, [])

  /** À appeler après un enregistrement réussi (ou pour repartir d'une nouvelle valeur). */
  const reset = useCallback((value) => {
    setOriginal(value)
    setDraft(value)
  }, [])

  return { draft, setDraft, setField, dirty, reset }
}
