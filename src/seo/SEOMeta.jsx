import { Helmet } from 'react-helmet-async'

const BASE_URL = 'https://esa.sn'
const DEFAULT_IMAGE = `${BASE_URL}/og-home.jpg`

/**
 * SEOMeta - Composant meta tags dynamique par page
 *
 * Props:
 *   title        - Titre de la page (sera suffixé avec " | ESA")
 *   description  - Meta description (max 160 caractères)
 *   canonical    - Chemin canonique (ex: "/formations")
 *   ogImage      - URL absolue de l'image Open Graph
 *   schemas      - Tableau de schemas JSON-LD à injecter
 *   noIndex      - true pour noindex (pages utilitaires)
 */
export default function SEOMeta({
  title,
  description,
  canonical,
  ogImage = DEFAULT_IMAGE,
  schemas = [],
  noIndex = false
}) {
  const fullTitle = title
    ? `${title} | ESA - École Supérieure Aéronautique`
    : 'ESA - École Supérieure Aéronautique | Dakar, Sénégal'

  const canonicalUrl = canonical ? `${BASE_URL}${canonical}` : BASE_URL

  return (
    <Helmet>
      {/* Basiques */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />
      {noIndex && <meta name="robots" content="noindex, nofollow" />}

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="ESA - École Supérieure Aéronautique" />
      <meta property="og:locale" content="fr_SN" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* JSON-LD schemas */}
      {schemas.map((schema, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  )
}
