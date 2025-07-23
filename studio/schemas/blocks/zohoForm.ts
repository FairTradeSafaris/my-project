import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'zohoForm',
  title: 'Zoho Form Embed',
  type: 'object',
  fields: [
    defineField({
      name: 'iframeUrl',
      title: 'Iframe Embed URL',
      type: 'url',
      validation: (Rule) => Rule.uri({scheme: ['http', 'https']}).required(),
    }),
    defineField({
      name: 'height',
      title: 'Iframe Height (px)',
      type: 'number',
      initialValue: 600,
    }),
  ],
})
