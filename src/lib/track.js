// Compteur de visites anonyme (statistiques du dashboard admin).
let firstHit = true

export function trackPageView(path) {
  const body = JSON.stringify({ p: path, r: firstHit ? document.referrer : '' })
  firstHit = false
  fetch('/api/track.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
    keepalive: true,
  }).catch(() => {})
}
