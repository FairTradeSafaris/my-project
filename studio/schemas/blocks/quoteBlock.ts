import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'quoteBlock',
  title: 'Quote Block',
  type: 'object',
  fields: [
    defineField({
      name: 'quote',
      title: 'Quote Text',
      type: 'text',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'attribution',
      title: 'Author / Source',
      type: 'string',
    }),
    defineField({
      name: 'backgroundStyle',
      title: 'Background Style',
      type: 'string',
      options: {
        list: [
          {title: 'Default (White)', value: 'default'},
          {title: 'Soft Neutral', value: 'neutral'},
        ],
      },
      initialValue: 'default',
    }),
  ],
})
