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

    defineField({
      name: 'padding',
      title: 'Section Padding',
      type: 'string',
      options: {
        list: [
          {title: 'Default (Top & Bottom)', value: 'default'},
          {title: 'Top Only', value: 'top'},
          {title: 'Bottom Only', value: 'bottom'},
          {title: 'No Padding', value: 'none'},
        ],
        layout: 'radio',
      },
      initialValue: 'default',
      description: 'Control vertical spacing for this section.',
    }),
  ],
})
