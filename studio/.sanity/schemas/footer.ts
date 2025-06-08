import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'footer',
  title: 'Footer',
  type: 'document',
  fields: [
    defineField({
      name: 'facts',
      title: 'Safari Facts',
      type: 'array',
      of: [{type: 'string'}],
    }),
    defineField({
      name: 'lineArt',
      title: 'Line Art Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'logo',
      title: 'Logo Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'contactEmail',
      title: 'Contact Email',
      type: 'string',
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social Links',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {name: 'platform', type: 'string', title: 'Platform'},
            {name: 'icon', type: 'image', title: 'Icon'},
            {name: 'url', type: 'url', title: 'URL'},
          ],
        },
      ],
    }),
    defineField({
      name: 'connectLinks',
      title: 'Connect Links',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {name: 'label', title: 'Label', type: 'string'},
            {name: 'href', title: 'URL', type: 'string'},
          ],
        },
      ],
    }),

    defineField({
      name: 'exploreLinks',
      title: 'Explore Links',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {name: 'label', title: 'Label', type: 'string'},
            {name: 'href', title: 'URL', type: 'string'},
          ],
        },
      ],
    }),
  ],
})
