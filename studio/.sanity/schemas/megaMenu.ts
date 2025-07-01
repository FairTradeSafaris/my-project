// schemas/megaMenu.ts
export default {
  name: 'megaMenu',
  title: 'Mega Menu',
  type: 'document',
  fields: [
    {
      name: 'navLinks',
      title: 'Navigation Links',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {name: 'title', type: 'string'},
            {name: 'href', type: 'string'},
          ],
        },
      ],
    },
    {
      name: 'featureCards',
      title: 'Feature Cards',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {name: 'title', type: 'string'},
            {name: 'description', type: 'text'},
            {name: 'image', type: 'image'},
            {name: 'alt', type: 'string'},
            {name: 'link', type: 'string'},
          ],
        },
      ],
    },
  ],
}
