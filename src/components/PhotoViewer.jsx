import { useEffect, useRef, useState } from 'react'
import { X } from 'lucide-react'
import './PhotoViewer.css'

/** Visionneuse plein écran : flèches, clavier (← → Échap) et miniatures. */
export default function PhotoViewer({ title, photos, startIndex = 0, onClose }) {
  const [index, setIndex] = useState(startIndex)
  const count = photos.length
  const closeRef = useRef(onClose)
  closeRef.current = onClose

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') closeRef.current()
      if (e.key === 'ArrowRight') setIndex((i) => (i + 1) % count)
      if (e.key === 'ArrowLeft') setIndex((i) => (i - 1 + count) % count)
    }
    window.addEventListener('keydown', onKey)
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = overflow
    }
  }, [count])

  if (!count) return null
  const photo = photos[index]

  return (
    <div className="gallery-modal" onClick={onClose} role="dialog" aria-modal="true" aria-label={title}>
      <div className="gallery-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="gallery-close" onClick={onClose} aria-label="Fermer">
          <X size={24} />
        </button>
        <div className="gallery-header">
          <h3>{title}</h3>
          <span className="gallery-counter">{index + 1} / {count}</span>
        </div>
        <div className="gallery-main">
          {count > 1 && (
            <button className="gallery-nav gallery-prev" onClick={() => setIndex((index - 1 + count) % count)} aria-label="Photo précédente">‹</button>
          )}
          <img src={photo.src} alt={photo.alt || `${title} - Photo ${index + 1}`} />
          {count > 1 && (
            <button className="gallery-nav gallery-next" onClick={() => setIndex((index + 1) % count)} aria-label="Photo suivante">›</button>
          )}
        </div>
        {photo.alt && <p className="gallery-caption">{photo.alt}</p>}
        {count > 1 && (
          <div className="gallery-thumbs">
            {photos.map((p, i) => (
              <button
                key={p.src + i}
                className={`gallery-thumb ${i === index ? 'active' : ''}`}
                onClick={() => setIndex(i)}
                aria-label={`Photo ${i + 1}`}
              >
                <img src={p.src} alt="" loading="lazy" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
