export default {
  name: 'megaMenu',
  title: 'Mega Menu',
  type: 'document',
  fields: [
    // 🧭 Navigation Sections
    {
      name: 'navSections',
      title: 'Navigation Sections',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'heading',
              title: 'Section Heading',
              type: 'string',
            },
            {
              name: 'links',
              title: 'Links',
              type: 'array',
              of: [
                {
                  type: 'object',
                  fields: [
                    {name: 'title', title: 'Title', type: 'string'},
                    {name: 'href', title: 'Link URL', type: 'string'},
                  ],
                },
              ],
            },
          ],
        },
      ],
    },

    // 🎯 Feature Cards
    {
      name: 'featureCards',
      title: 'Feature Cards (Middle Column)',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {name: 'title', title: 'Title', type: 'string'},
            {name: 'description', title: 'Description', type: 'text'},
            {name: 'image', title: 'Image', type: 'image'},
            {name: 'alt', title: 'Image Alt Text', type: 'string'},
            {name: 'link', title: 'Link URL', type: 'string'},
          ],
        },
      ],
    },

    // 🚀 Promo Card
    {
      name: 'promoCard',
      title: 'Promo Card (Right Column)',
      type: 'object',
      fields: [
        {name: 'title', title: 'Title', type: 'string'},
        {name: 'description', title: 'Description', type: 'text'},
        {name: 'image', title: 'Image', type: 'image'},
        {name: 'alt', title: 'Image Alt Text', type: 'string'},
        {name: 'link', title: 'Link URL', type: 'string'},
      ],
    },
  ],

  // 👁 Preview in Sanity Studio
  preview: {
    select: {
      navSections: 'navSections',
      featureCards: 'featureCards',
      promoCard: 'promoCard',
    },
    prepare(selection: {navSections?: any[]; featureCards?: any[]; promoCard?: {title?: string}}) {
      const navSections = selection.navSections || []
      const featureCards = selection.featureCards || []
      const promoCard = selection.promoCard || {}

      const navCount = navSections.length
      const cardCount = featureCards.length
      const promoTitle = promoCard.title || 'None'

      return {
        title: 'Mega Menu',
        subtitle: `🧭 ${navCount} ${navCount === 1 ? 'Section' : 'Sections'} · 🎯 ${cardCount} Feature Cards · 🚀 Promo: ${promoTitle}`,
      }
    },
  },
}
