import {defineType, defineField} from 'sanity'

// 🔁 Reusable helper type
type SanityImageValue = {
  asset?: {
    _ref?: string
  }
}

export default defineType({
  name: 'heroImage',
  title: 'Hero Image',
  type: 'object',
  fields: [
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {hotspot: true},
      fields: [
        {
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
          validation: (Rule) => Rule.required().error('Alt text is required for accessibility.'),
        },
      ],
      validation: (Rule) =>
        Rule.custom((image: SanityImageValue | undefined) => {
          const ref = image?.asset?._ref || ''
          if (ref && !ref.includes('-webp')) {
            return 'Please upload a true WebP image (not renamed).'
          }
          return true
        }),
    }),
    defineField({
      name: 'text',
      title: 'Overlay Text',
      type: 'string',
    }),
    defineField({
      name: 'alignment',
      title: 'Text Alignment',
      type: 'string',
      options: {
        list: [
          {title: 'Center', value: 'center'},
          {title: 'Left', value: 'left'},
          {title: 'Right', value: 'right'},
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      initialValue: 'center',
    }),
  ],
})
