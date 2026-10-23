import { useEffect, useState } from 'react'
import seed from './seed-content.json'

// Contenu des pages Actualités / Vie étudiante, géré depuis le dashboard /admin.
// Tant que rien n'a été enregistré côté serveur (ou si l'API est injoignable),
// on affiche le contenu intégré au site.
let cache = null
let pending = null

export function fetchSiteContent() {
  if (!pending) {
    pending = fetch('/api/content.php')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => data?.content ?? seed)
      .catch(() => seed)
      .then((content) => (cache = content))
  }
  return pending
}

export function useSiteContent() {
  const [content, setContent] = useState(cache)

  useEffect(() => {
    if (!cache) fetchSiteContent().then(setContent)
  }, [])

  return content
}

export const isPublished = (item) => item.published !== false

export function todayISO() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export function isUpcoming(event) {
  const last = event.endDate || event.date
  return Boolean(last) && last >= todayISO()
}

const dateFormat = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })

export function formatEventDate(date, endDate) {
  if (!date) return ''
  const start = new Date(`${date}T12:00:00`)
  if (!endDate || endDate === date) return dateFormat.format(start)
  return `Du ${dateFormat.format(start)} au ${dateFormat.format(new Date(`${endDate}T12:00:00`))}`
}

/** Découpe un texte saisi dans le dashboard en paragraphes (ligne vide = nouveau paragraphe). */
export function paragraphs(text) {
  return (text || '').split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean)
}
