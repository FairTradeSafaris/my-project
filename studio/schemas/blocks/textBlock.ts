import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'textBlock',
  title: 'Text Block',
  type: 'object',
  fields: [
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [{type: 'block'}],
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
