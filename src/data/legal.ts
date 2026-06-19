import type { Locale } from '../types'

/**
 * Long-form legal content for the footer's Privacy / Terms / Accessibility pages.
 *
 * Kept here rather than in `i18n/messages.ts` on purpose: the message catalog is a flat
 * `Record<MessageKey, string>` that enforces 3-locale parity on every key — a poor fit for
 * multi-paragraph documents. Storing the docs as structured per-locale data keeps the catalog
 * lean and lets `getLegalDoc` fall back to English when a locale is incomplete.
 *
 * This is clearly-marked SAMPLE content for a product demo — not real legal text (→ ADR-0023).
 */

export type LegalDocId = 'privacy' | 'terms' | 'accessibility'

export type LegalSection = {
  heading: string
  /** One string per paragraph. */
  body: string[]
}

export type LegalDoc = {
  title: string
  /** Human label (the page prepends the localized "Last updated" chrome). */
  updated: string
  intro: string
  sections: LegalSection[]
}

export const LEGAL_DOC_IDS: LegalDocId[] = ['privacy', 'terms', 'accessibility']

const en: Record<LegalDocId, LegalDoc> = {
  privacy: {
    title: 'Privacy Policy',
    updated: 'June 2026',
    intro:
      'Sojurno connects travelers and hosts who share the same pursuits. This policy explains what we collect when you browse communities, request a stay, or host one — and the choices you have over that information.',
    sections: [
      {
        heading: 'Information we collect',
        body: [
          'We collect the details you give us directly: your name, the community you join, the messages you send a host, and the preferences that shape your search. If you host, we also collect the listing details you publish and the practical local knowledge you choose to share.',
          'Some information arrives automatically — the device and browser you use, the pages you visit, and general location inferred from your network. We use it to keep the service reliable and relevant.',
        ],
      },
      {
        heading: 'How we use your information',
        body: [
          'We use your information to match you with stays and hosts in your community, to make booking and hosting straightforward, and to keep the platform safe. We do not sell your personal information.',
        ],
      },
      {
        heading: 'Sharing within your community',
        body: [
          'Affinity is the point of Sojurno, so some details are shared by design: a host sees the context behind a request, and a guest sees a host’s profile and proof. You control what goes in your profile, and you can edit or remove it at any time.',
        ],
      },
      {
        heading: 'Your choices and rights',
        body: [
          'You can access, correct, export, or delete your personal information from your account settings. Depending on where you live, you may have additional rights — including the right to object to certain processing. We honor verified requests within a reasonable period.',
        ],
      },
      {
        heading: 'Data retention',
        body: [
          'We keep your information for as long as your account is active and for a limited period afterward to meet legal, accounting, and safety obligations. When it is no longer needed, we delete or anonymize it.',
        ],
      },
      {
        heading: 'Cookies and similar technologies',
        body: [
          'We use a small set of cookies to remember your community, your language, and your light or dark preference, and to understand how the product is used. You can clear or block cookies in your browser, though some features may not work as well without them.',
        ],
      },
      {
        heading: 'Contacting us',
        body: ['Questions about this policy can go to privacy@sojurno.example. We respond as quickly as we can.'],
      },
    ],
  },
  terms: {
    title: 'Terms of Service',
    updated: 'June 2026',
    intro:
      'These terms govern your use of Sojurno — the communities, the listings, and the tools that connect guests and hosts. By using the platform, you agree to what follows.',
    sections: [
      {
        heading: 'Accepting these terms',
        body: [
          'By creating an account or using Sojurno, you accept these terms on behalf of yourself and anyone you book for. If you do not agree, please do not use the platform.',
        ],
      },
      {
        heading: 'Your account',
        body: [
          'You are responsible for the activity under your account and for keeping your credentials secure. Provide accurate information, keep it current, and let us know promptly if you suspect unauthorized use.',
        ],
      },
      {
        heading: 'Hosting and staying',
        body: [
          'Hosts set the terms of their listing — availability, pricing, and any gear or guidance offered — and are responsible for describing them honestly. Guests agree to respect a host’s home, neighbors, and community norms. Sojurno is the venue for these arrangements, not a party to them.',
        ],
      },
      {
        heading: 'Payments and fees',
        body: [
          'Where bookings are handled on the platform, the price shown at checkout includes any applicable service fee. Some listings link out to a host’s own booking page; those transactions are governed by the host’s terms, not ours.',
        ],
      },
      {
        heading: 'Community conduct',
        body: [
          'Sojurno works because members share context and good faith. Harassment, misrepresentation, and discrimination have no place here, and they are grounds for removal. Report anything that feels off — we review reports seriously.',
        ],
      },
      {
        heading: 'Liability and disclaimers',
        body: [
          'The platform is provided “as is.” To the extent permitted by law, Sojurno is not liable for the conduct of guests or hosts or for outcomes that arise from a stay. Nothing here limits rights that cannot be limited by law.',
        ],
      },
      {
        heading: 'Changes to these terms',
        body: [
          'We may update these terms as the platform evolves. When changes are material, we will give notice in the product. Continuing to use Sojurno after an update means you accept the revised terms.',
        ],
      },
    ],
  },
  accessibility: {
    title: 'Accessibility Statement',
    updated: 'June 2026',
    intro:
      'Sojurno is built to be usable by everyone in a community, regardless of how they navigate the web. Accessibility is part of the design system, not an afterthought bolted on at the end.',
    sections: [
      {
        heading: 'Our commitment',
        body: [
          'We aim to meet or exceed the Web Content Accessibility Guidelines (WCAG) 2.1 at level AA across the platform, and we treat accessibility regressions as bugs to be fixed, not nice-to-haves.',
        ],
      },
      {
        heading: 'How we get there',
        body: [
          'Color and contrast come from a token system tested in both light and dark themes. Every interactive control is reachable by keyboard with a visible focus state, motion respects your reduced-motion setting, and components are documented with automated accessibility checks before they ship.',
        ],
      },
      {
        heading: 'Known limitations',
        body: [
          'Some third-party and map-style widgets are still being brought up to standard, and a few long-form flows are being refined. We are actively working through these and will update this statement as they land.',
        ],
      },
      {
        heading: 'Feedback',
        body: [
          'If you hit a barrier anywhere on Sojurno, tell us what happened, the page you were on, and the assistive technology you use. Reports like these are the fastest way we improve.',
        ],
      },
      {
        heading: 'Contacting us',
        body: ['Reach the accessibility team at access@sojurno.example. We take every message seriously.'],
      },
    ],
  },
}

const es: Record<LegalDocId, LegalDoc> = {
  privacy: {
    title: 'Política de privacidad',
    updated: 'Junio de 2026',
    intro:
      'Sojurno conecta a viajeros y anfitriones que comparten las mismas pasiones. Esta política explica qué información recopilamos cuando exploras comunidades, solicitas una estancia o alojas a alguien, y las opciones que tienes sobre esa información.',
    sections: [
      {
        heading: 'Información que recopilamos',
        body: [
          'Recopilamos los datos que nos das directamente: tu nombre, la comunidad a la que te unes, los mensajes que envías a un anfitrión y las preferencias que orientan tu búsqueda. Si eres anfitrión, también recopilamos los detalles del alojamiento que publicas y el conocimiento local que decides compartir.',
          'Parte de la información llega automáticamente: el dispositivo y el navegador que usas, las páginas que visitas y una ubicación general inferida de tu red. La usamos para que el servicio sea fiable y relevante.',
        ],
      },
      {
        heading: 'Cómo usamos tu información',
        body: [
          'Usamos tu información para conectarte con estancias y anfitriones de tu comunidad, facilitar la reserva y el alojamiento, y mantener la plataforma segura. No vendemos tu información personal.',
        ],
      },
      {
        heading: 'Compartir dentro de tu comunidad',
        body: [
          'La afinidad es la esencia de Sojurno, así que algunos detalles se comparten por diseño: un anfitrión ve el contexto de una solicitud y un huésped ve el perfil y las referencias del anfitrión. Tú controlas lo que aparece en tu perfil y puedes editarlo o eliminarlo cuando quieras.',
        ],
      },
      {
        heading: 'Tus opciones y derechos',
        body: [
          'Puedes acceder, corregir, exportar o eliminar tu información personal desde la configuración de tu cuenta. Según dónde vivas, puedes tener derechos adicionales, incluido el de oponerte a ciertos tratamientos. Atendemos las solicitudes verificadas en un plazo razonable.',
        ],
      },
      {
        heading: 'Conservación de datos',
        body: [
          'Conservamos tu información mientras tu cuenta esté activa y durante un periodo limitado después para cumplir obligaciones legales, contables y de seguridad. Cuando deja de ser necesaria, la eliminamos o la anonimizamos.',
        ],
      },
      {
        heading: 'Cookies y tecnologías similares',
        body: [
          'Usamos un pequeño conjunto de cookies para recordar tu comunidad, tu idioma y tu preferencia de tema claro u oscuro, y para entender cómo se usa el producto. Puedes borrar o bloquear las cookies en tu navegador, aunque algunas funciones podrían no funcionar igual de bien.',
        ],
      },
      {
        heading: 'Cómo contactarnos',
        body: ['Las preguntas sobre esta política pueden dirigirse a privacy@sojurno.example. Respondemos lo antes posible.'],
      },
    ],
  },
  terms: {
    title: 'Términos de servicio',
    updated: 'Junio de 2026',
    intro:
      'Estos términos rigen tu uso de Sojurno: las comunidades, los alojamientos y las herramientas que conectan a huéspedes y anfitriones. Al usar la plataforma, aceptas lo siguiente.',
    sections: [
      {
        heading: 'Aceptación de estos términos',
        body: [
          'Al crear una cuenta o usar Sojurno, aceptas estos términos en tu nombre y en el de cualquier persona para la que reserves. Si no estás de acuerdo, no uses la plataforma.',
        ],
      },
      {
        heading: 'Tu cuenta',
        body: [
          'Eres responsable de la actividad de tu cuenta y de mantener tus credenciales seguras. Proporciona información veraz, mantenla actualizada y avísanos enseguida si sospechas de un uso no autorizado.',
        ],
      },
      {
        heading: 'Alojar y hospedarse',
        body: [
          'Los anfitriones fijan las condiciones de su alojamiento —disponibilidad, precio y cualquier equipo o guía que ofrezcan— y deben describirlas con honestidad. Los huéspedes se comprometen a respetar el hogar, los vecinos y las normas de la comunidad del anfitrión. Sojurno es el espacio para estos acuerdos, no una parte de ellos.',
        ],
      },
      {
        heading: 'Pagos y tarifas',
        body: [
          'Cuando las reservas se gestionan en la plataforma, el precio que se muestra al pagar incluye cualquier tarifa de servicio aplicable. Algunos alojamientos enlazan a la página de reserva propia del anfitrión; esas transacciones se rigen por los términos del anfitrión, no por los nuestros.',
        ],
      },
      {
        heading: 'Conducta en la comunidad',
        body: [
          'Sojurno funciona porque sus miembros comparten contexto y buena fe. El acoso, la tergiversación y la discriminación no tienen cabida aquí y son motivo de expulsión. Informa de cualquier cosa que no encaje: revisamos los reportes con seriedad.',
        ],
      },
      {
        heading: 'Responsabilidad y descargos',
        body: [
          'La plataforma se ofrece «tal cual». En la medida en que lo permita la ley, Sojurno no es responsable de la conducta de huéspedes o anfitriones ni de los resultados derivados de una estancia. Nada de lo aquí expuesto limita derechos que la ley no permite limitar.',
        ],
      },
      {
        heading: 'Cambios en estos términos',
        body: [
          'Podemos actualizar estos términos a medida que la plataforma evoluciona. Cuando los cambios sean importantes, lo avisaremos en el producto. Seguir usando Sojurno tras una actualización significa que aceptas los términos revisados.',
        ],
      },
    ],
  },
  accessibility: {
    title: 'Declaración de accesibilidad',
    updated: 'Junio de 2026',
    intro:
      'Sojurno está pensado para que cualquier persona de una comunidad pueda usarlo, sin importar cómo navegue por la web. La accesibilidad forma parte del sistema de diseño, no es un añadido de última hora.',
    sections: [
      {
        heading: 'Nuestro compromiso',
        body: [
          'Nuestro objetivo es cumplir o superar las Pautas de Accesibilidad para el Contenido Web (WCAG) 2.1 en el nivel AA en toda la plataforma, y tratamos las regresiones de accesibilidad como errores que hay que corregir.',
        ],
      },
      {
        heading: 'Cómo lo logramos',
        body: [
          'El color y el contraste provienen de un sistema de tokens probado en temas claro y oscuro. Todos los controles interactivos son accesibles con el teclado y tienen un foco visible, el movimiento respeta tu ajuste de movimiento reducido y los componentes se documentan con comprobaciones de accesibilidad automáticas antes de publicarse.',
        ],
      },
      {
        heading: 'Limitaciones conocidas',
        body: [
          'Algunos widgets de terceros y de tipo mapa todavía se están adaptando al estándar, y se están refinando algunos flujos extensos. Estamos trabajando en ello y actualizaremos esta declaración a medida que avancemos.',
        ],
      },
      {
        heading: 'Comentarios',
        body: [
          'Si encuentras una barrera en Sojurno, cuéntanos qué pasó, en qué página estabas y qué tecnología de asistencia usas. Estos reportes son la forma más rápida de mejorar.',
        ],
      },
      {
        heading: 'Cómo contactarnos',
        body: ['Escribe al equipo de accesibilidad en access@sojurno.example. Tomamos en serio cada mensaje.'],
      },
    ],
  },
}

const fr: Record<LegalDocId, LegalDoc> = {
  privacy: {
    title: 'Politique de confidentialité',
    updated: 'Juin 2026',
    intro:
      'Sojurno met en relation des voyageurs et des hôtes qui partagent les mêmes passions. Cette politique explique ce que nous collectons lorsque vous explorez des communautés, demandez un séjour ou en proposez un, ainsi que les choix dont vous disposez.',
    sections: [
      {
        heading: 'Informations que nous collectons',
        body: [
          'Nous collectons les informations que vous nous fournissez directement : votre nom, la communauté que vous rejoignez, les messages que vous envoyez à un hôte et les préférences qui orientent votre recherche. Si vous êtes hôte, nous collectons aussi les détails de l’annonce que vous publiez et les conseils locaux que vous choisissez de partager.',
          'Certaines informations nous parviennent automatiquement : l’appareil et le navigateur que vous utilisez, les pages que vous consultez et une localisation générale déduite de votre réseau. Nous les utilisons pour que le service reste fiable et pertinent.',
        ],
      },
      {
        heading: 'Comment nous utilisons vos informations',
        body: [
          'Nous utilisons vos informations pour vous mettre en relation avec des séjours et des hôtes de votre communauté, simplifier la réservation et l’accueil, et assurer la sécurité de la plateforme. Nous ne vendons pas vos données personnelles.',
        ],
      },
      {
        heading: 'Le partage au sein de votre communauté',
        body: [
          'L’affinité est la raison d’être de Sojurno : certains éléments sont donc partagés par conception. Un hôte voit le contexte d’une demande, et un voyageur voit le profil et les références d’un hôte. Vous maîtrisez ce que contient votre profil et pouvez le modifier ou le supprimer à tout moment.',
        ],
      },
      {
        heading: 'Vos choix et vos droits',
        body: [
          'Vous pouvez consulter, corriger, exporter ou supprimer vos données personnelles depuis les paramètres de votre compte. Selon votre lieu de résidence, vous pouvez disposer de droits supplémentaires, dont celui de vous opposer à certains traitements. Nous traitons les demandes vérifiées dans un délai raisonnable.',
        ],
      },
      {
        heading: 'Conservation des données',
        body: [
          'Nous conservons vos informations tant que votre compte est actif, puis pendant une période limitée afin de respecter nos obligations légales, comptables et de sécurité. Lorsqu’elles ne sont plus nécessaires, nous les supprimons ou les anonymisons.',
        ],
      },
      {
        heading: 'Cookies et technologies similaires',
        body: [
          'Nous utilisons un petit nombre de cookies pour mémoriser votre communauté, votre langue et votre préférence de thème clair ou sombre, et pour comprendre l’usage du produit. Vous pouvez effacer ou bloquer les cookies dans votre navigateur, même si certaines fonctionnalités pourraient alors moins bien fonctionner.',
        ],
      },
      {
        heading: 'Nous contacter',
        body: ['Pour toute question sur cette politique, écrivez à privacy@sojurno.example. Nous répondons dès que possible.'],
      },
    ],
  },
  terms: {
    title: 'Conditions d’utilisation',
    updated: 'Juin 2026',
    intro:
      'Ces conditions régissent votre utilisation de Sojurno : les communautés, les annonces et les outils qui relient voyageurs et hôtes. En utilisant la plateforme, vous acceptez ce qui suit.',
    sections: [
      {
        heading: 'Acceptation de ces conditions',
        body: [
          'En créant un compte ou en utilisant Sojurno, vous acceptez ces conditions en votre nom et au nom de toute personne pour laquelle vous réservez. Si vous n’êtes pas d’accord, n’utilisez pas la plateforme.',
        ],
      },
      {
        heading: 'Votre compte',
        body: [
          'Vous êtes responsable de l’activité de votre compte et de la sécurité de vos identifiants. Fournissez des informations exactes, tenez-les à jour et prévenez-nous rapidement en cas d’utilisation non autorisée.',
        ],
      },
      {
        heading: 'Héberger et séjourner',
        body: [
          'Les hôtes fixent les conditions de leur annonce — disponibilité, tarifs et tout équipement ou conseil proposé — et doivent les décrire honnêtement. Les voyageurs s’engagent à respecter le logement, le voisinage et les usages de la communauté de l’hôte. Sojurno est le cadre de ces arrangements, pas une partie à ceux-ci.',
        ],
      },
      {
        heading: 'Paiements et frais',
        body: [
          'Lorsque les réservations sont gérées sur la plateforme, le prix affiché au paiement inclut tout frais de service applicable. Certaines annonces renvoient vers la page de réservation propre à l’hôte ; ces transactions sont régies par les conditions de l’hôte, et non par les nôtres.',
        ],
      },
      {
        heading: 'Conduite au sein de la communauté',
        body: [
          'Sojurno fonctionne parce que ses membres partagent un contexte et de la bonne foi. Le harcèlement, la tromperie et la discrimination n’y ont pas leur place et justifient une exclusion. Signalez tout ce qui vous semble anormal : nous examinons les signalements avec sérieux.',
        ],
      },
      {
        heading: 'Responsabilité et avertissements',
        body: [
          'La plateforme est fournie « en l’état ». Dans la mesure permise par la loi, Sojurno n’est pas responsable de la conduite des voyageurs ou des hôtes, ni des conséquences d’un séjour. Rien ici ne limite des droits que la loi ne permet pas de limiter.',
        ],
      },
      {
        heading: 'Modifications de ces conditions',
        body: [
          'Nous pouvons mettre à jour ces conditions à mesure que la plateforme évolue. En cas de changement important, nous vous en informerons dans le produit. Continuer à utiliser Sojurno après une mise à jour vaut acceptation des conditions révisées.',
        ],
      },
    ],
  },
  accessibility: {
    title: 'Déclaration d’accessibilité',
    updated: 'Juin 2026',
    intro:
      'Sojurno est conçu pour être utilisable par chacun au sein d’une communauté, quelle que soit sa façon de naviguer sur le web. L’accessibilité fait partie du système de design, ce n’est pas une option ajoutée à la fin.',
    sections: [
      {
        heading: 'Notre engagement',
        body: [
          'Nous visons à atteindre ou dépasser les Règles pour l’accessibilité des contenus web (WCAG) 2.1 au niveau AA sur l’ensemble de la plateforme, et nous traitons les régressions d’accessibilité comme des anomalies à corriger.',
        ],
      },
      {
        heading: 'Comment nous y parvenons',
        body: [
          'Les couleurs et les contrastes proviennent d’un système de tokens testé en thèmes clair et sombre. Chaque commande interactive est accessible au clavier avec un focus visible, les animations respectent votre réglage de mouvement réduit, et les composants sont documentés avec des tests d’accessibilité automatiques avant leur publication.',
        ],
      },
      {
        heading: 'Limites connues',
        body: [
          'Certains widgets tiers et de type carte sont encore en cours de mise aux normes, et quelques parcours longs sont en cours d’affinage. Nous y travaillons activement et mettrons cette déclaration à jour au fur et à mesure.',
        ],
      },
      {
        heading: 'Vos retours',
        body: [
          'Si vous rencontrez un obstacle sur Sojurno, dites-nous ce qui s’est passé, la page concernée et la technologie d’assistance que vous utilisez. Ces retours sont le moyen le plus rapide de nous améliorer.',
        ],
      },
      {
        heading: 'Nous contacter',
        body: ['Contactez l’équipe accessibilité à access@sojurno.example. Nous prenons chaque message au sérieux.'],
      },
    ],
  },
}

const LEGAL: Record<Locale, Record<LegalDocId, LegalDoc>> = { en, es, fr }

/** Returns the requested doc in `locale`, falling back to English for incomplete locales. */
export function getLegalDoc(locale: Locale, id: LegalDocId): LegalDoc {
  return LEGAL[locale]?.[id] ?? LEGAL.en[id]
}

/** Type guard for the `:docId` route param. */
export function isLegalDocId(value: string | undefined): value is LegalDocId {
  return value === 'privacy' || value === 'terms' || value === 'accessibility'
}
