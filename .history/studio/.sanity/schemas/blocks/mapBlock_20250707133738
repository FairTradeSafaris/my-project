import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'mapBlock',
  title: 'Map Embed',
  type: 'object',
  fields: [
    defineField({
      name: 'mapUrl',
      title: 'Map Embed URL',
      type: 'url',
      validation: (Rule) => Rule.uri({scheme: ['http', 'https']}).required(),
    }),
    defineField({
      name: 'caption',
      title: 'Caption (optional)',
      type: 'string',
    }),
  ],
})
