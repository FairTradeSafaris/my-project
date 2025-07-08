import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'videoEmbed',
  title: 'Video Embed',
  type: 'object',
  fields: [
    defineField({
      name: 'url',
      title: 'Video URL',
      type: 'url',
      validation: (Rule) =>
        Rule.uri({
          scheme: ['http', 'https'],
        }).required(),
    }),
    defineField({
      name: 'caption',
      title: 'Caption (optional)',
      type: 'string',
    }),
  ],
})
