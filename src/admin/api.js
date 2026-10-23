// Client de l'API admin (public/api/admin.php).
let csrfToken = ''
let onUnauthorized = () => {}

export function setCsrf(token) {
  csrfToken = token || ''
}

export function setUnauthorizedHandler(fn) {
  onUnauthorized = fn
}

export class ApiError extends Error {
  constructor(message, status, data) {
    super(message)
    this.status = status
    this.data = data
  }
}

async function parse(res) {
  let data
  try {
    data = await res.json()
  } catch {
    data = { success: false, message: res.status === 413 ? 'Fichier trop volumineux pour le serveur.' : 'Le serveur ne répond pas correctement. Réessayez dans un instant.' }
  }
  if (!res.ok || !data.success) {
    if (res.status === 401) onUnauthorized()
    throw new ApiError(data.message || 'Une erreur est survenue.', res.status, data)
  }
  return data
}

export async function api(action, { method = 'GET', body, params } = {}) {
  const query = new URLSearchParams({ action, ...params })
  let res
  try {
    res = await fetch(`/api/admin.php?${query}`, {
      method,
      credentials: 'same-origin',
      headers: {
        ...(body ? { 'Content-Type': 'application/json' } : {}),
        ...(method !== 'GET' ? { 'X-CSRF-Token': csrfToken } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    })
  } catch {
    throw new ApiError('Connexion impossible. Vérifiez votre accès internet.', 0)
  }
  return parse(res)
}

export const post = (action, body = {}) => api(action, { method: 'POST', body })

/** Envoie un fichier avec suivi de progression (0 → 1). */
export function uploadFile(file, onProgress) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open('POST', '/api/admin.php?action=upload')
    xhr.withCredentials = true
    xhr.setRequestHeader('X-CSRF-Token', csrfToken)
    xhr.upload.onprogress = (e) => e.lengthComputable && onProgress?.(e.loaded / e.total)
    xhr.onerror = () => reject(new ApiError('Connexion interrompue pendant l\'envoi.', 0))
    xhr.onload = () => {
      parse(new Response(xhr.responseText || '{}', { status: xhr.status }))
        .then((data) => resolve(data.url))
        .catch(reject)
    }
    const form = new FormData()
    form.append('file', file)
    xhr.send(form)
  })
}

const MAX_SIDE = 2000

/** Réduit les photos (souvent 5-10 Mo depuis un téléphone) avant l'envoi. */
export async function compressImage(file) {
  if (!file.type.startsWith('image/') || file.type === 'image/gif') return file
  try {
    const bitmap = await createImageBitmap(file)
    const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height))
    if (scale === 1 && file.size < 1.5 * 1024 * 1024) return file
    const canvas = document.createElement('canvas')
    canvas.width = Math.round(bitmap.width * scale)
    canvas.height = Math.round(bitmap.height * scale)
    canvas.getContext('2d').drawImage(bitmap, 0, 0, canvas.width, canvas.height)
    const blob = await new Promise((r) => canvas.toBlob(r, 'image/webp', 0.85))
      || await new Promise((r) => canvas.toBlob(r, 'image/jpeg', 0.85))
    if (!blob) return file
    const ext = blob.type === 'image/webp' ? 'webp' : 'jpg'
    return new File([blob], file.name.replace(/\.[^.]+$/, '') + '.' + ext, { type: blob.type })
  } catch {
    // Format non lisible par le navigateur (ex. HEIC) : le serveur donnera un message clair.
    return file
  }
}

export function slugify(text) {
  return text
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60) || 'element'
}

export function uniqueId(base, existing) {
  const ids = new Set(existing)
  let id = base
  let n = 2
  while (ids.has(id)) id = `${base}-${n++}`
  return id
}

export function formatBytes(bytes) {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} Ko`
  return `${(bytes / 1024 / 1024).toFixed(1).replace('.', ',')} Mo`
}

const dateTime = new Intl.DateTimeFormat('fr-FR', { dateStyle: 'medium', timeStyle: 'short' })
export const formatDateTime = (iso) => (iso ? dateTime.format(new Date(iso)) : '—')
