// Schema.org / JSON-LD structured data for ESA

const BASE_URL = 'https://esa.sn'

export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': ['EducationalOrganization', 'LocalBusiness'],
  '@id': `${BASE_URL}/#organization`,
  name: 'École Supérieure Aéronautique',
  alternateName: 'ESA',
  url: BASE_URL,
  logo: {
    '@type': 'ImageObject',
    url: `${BASE_URL}/favicon.svg`,
    width: 200,
    height: 200
  },
  image: `${BASE_URL}/og-home.jpg`,
  description:
    'École Supérieure Aéronautique — école d\'enseignement supérieur spécialisée dans la formation et la recherche en transport aérien au Sénégal. Du BTS au Master, préparez votre carrière dans l\'industrie aéronautique.',
  foundingDate: '2018',
  numberOfEmployees: {
    '@type': 'QuantitativeValue',
    minValue: 10,
    maxValue: 50
  },
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'HLM Grand Yoff, Villa N° 723',
    addressLocality: 'Dakar',
    postalCode: '11500',
    addressCountry: 'SN',
    addressRegion: 'Dakar'
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 14.7167,
    longitude: -17.4677
  },
  contactPoint: [
    {
      '@type': 'ContactPoint',
      telephone: '+221-33-858-00-04',
      contactType: 'customer service',
      areaServed: ['SN', 'Afrique de l\'Ouest'],
      availableLanguage: ['French']
    },
    {
      '@type': 'ContactPoint',
      telephone: '+221-77-726-12-33',
      contactType: 'admissions',
      areaServed: ['SN'],
      availableLanguage: ['French']
    }
  ],
  email: 'contact@esa.sn',
  telephone: '+221338580004',
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '08:00',
      closes: '18:00'
    }
  ],
  sameAs: [],
  hasMap: 'https://maps.google.com/?q=HLM+Grand+Yoff+Villa+723+Dakar+Senegal',
  priceRange: '$$',
  currenciesAccepted: 'XOF',
  paymentAccepted: 'Cash, Transfer',
  areaServed: {
    '@type': 'GeoCircle',
    geoMidpoint: {
      '@type': 'GeoCoordinates',
      latitude: 14.7167,
      longitude: -17.4677
    },
    geoRadius: '5000000'
  },
  knowsAbout: [
    'Transport aérien',
    'Aviation civile',
    'Maintenance aéronautique',
    'Sécurité aéroportuaire',
    'Formation professionnelle aéronautique',
    'BTS Transport aérien',
    'Master aviation'
  ]
}

export const coursesSchema = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Formations ESA - École Supérieure Aéronautique',
  description: 'Programmes de formation en transport aérien du BTS au Master',
  url: `${BASE_URL}/formations`,
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      item: {
        '@type': 'Course',
        '@id': `${BASE_URL}/formations#bts`,
        name: 'BTS / DTS Transport Aérien et Métiers Aéroportuaires',
        description:
          'Formation de 2 ans en transport aérien, logistique, maintenance aéronautique et métiers commerciaux. Opérations au sol, assistance en escale, coordination des vols.',
        provider: { '@id': `${BASE_URL}/#organization` },
        timeRequired: 'P2Y',
        educationalLevel: 'BTS',
        occupationalCategory: 'Transport Aérien',
        teaches: [
          'Transport et Logistique',
          'Transport Aérien et Métiers Aéroportuaires',
          'Maintenance Aéronautique',
          'Métiers Commerciaux'
        ],
        inLanguage: 'fr',
        courseMode: 'onsite',
        availableLanguage: { '@type': 'Language', name: 'French' },
        offers: {
          '@type': 'Offer',
          category: 'Inscription',
          url: `${BASE_URL}/contact`
        }
      }
    },
    {
      '@type': 'ListItem',
      position: 2,
      item: {
        '@type': 'Course',
        '@id': `${BASE_URL}/formations#licence`,
        name: 'Licence Professionnelle Transport Aérien',
        description:
          'Licence professionnelle d\'1 an après BTS. Spécialisations : Opérations, Exploitation, Commercial & Tourisme, Sécurité et Sûreté Aéroportuaire, Maintenance.',
        provider: { '@id': `${BASE_URL}/#organization` },
        timeRequired: 'P1Y',
        educationalLevel: 'Licence Professionnelle',
        occupationalCategory: 'Transport Aérien',
        teaches: [
          'Transport Aérien - Opérations',
          'Transport Aérien - Exploitation',
          'Transport Aérien - Commercial & Tourisme',
          'Sécurité et Sûreté Aéroportuaire',
          'Technicien de Maintenance Aéronautique'
        ],
        inLanguage: 'fr',
        courseMode: 'onsite',
        offers: {
          '@type': 'Offer',
          category: 'Inscription',
          url: `${BASE_URL}/contact`
        }
      }
    },
    {
      '@type': 'ListItem',
      position: 3,
      item: {
        '@type': 'Course',
        '@id': `${BASE_URL}/formations#master1`,
        name: 'Master 1 Transport Aérien',
        description:
          'Master 1 d\'1 an en Transport Aérien ou Management Sécurité et Sûreté. Approfondissement des connaissances en gestion du transport aérien.',
        provider: { '@id': `${BASE_URL}/#organization` },
        timeRequired: 'P1Y',
        educationalLevel: 'Master 1',
        occupationalCategory: 'Transport Aérien',
        teaches: ['Transport Aérien', 'Management Sécurité et Sûreté'],
        inLanguage: 'fr',
        courseMode: 'onsite',
        offers: {
          '@type': 'Offer',
          category: 'Inscription',
          url: `${BASE_URL}/contact`
        }
      }
    },
    {
      '@type': 'ListItem',
      position: 4,
      item: {
        '@type': 'Course',
        '@id': `${BASE_URL}/formations#master2`,
        name: 'Master 2 Management Aéroportuaire',
        description:
          'Master 2 spécialisé en Management et Exploitation Aéroportuaire, Management des Compagnies Aériennes, ou Management Sécurité et Sûreté du Transport Aérien.',
        provider: { '@id': `${BASE_URL}/#organization` },
        timeRequired: 'P1Y',
        educationalLevel: 'Master 2',
        occupationalCategory: 'Transport Aérien',
        teaches: [
          'Management et Exploitation Aéroportuaire',
          'Management et Exploitation des Compagnies Aériennes',
          'Management Sécurité et Sûreté du Transport Aérien'
        ],
        inLanguage: 'fr',
        courseMode: 'onsite',
        offers: {
          '@type': 'Offer',
          category: 'Inscription',
          url: `${BASE_URL}/contact`
        }
      }
    }
  ]
}

export const breadcrumbSchema = (items) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: `${BASE_URL}${item.path}`
  }))
})

export const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${BASE_URL}/#website`,
  url: BASE_URL,
  name: 'ESA - École Supérieure Aéronautique',
  description: 'École Supérieure Aéronautique Dakar — Formation transport aérien BTS, Licence, Master.',
  inLanguage: 'fr',
  publisher: { '@id': `${BASE_URL}/#organization` },
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${BASE_URL}/?q={search_term_string}`
    },
    'query-input': 'required name=search_term_string'
  }
}
