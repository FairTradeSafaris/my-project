import {defineType, defineField} from 'sanity'

// 🔁 Reusable helper type for image asset validation
type SanityImageValue = {
  asset?: {
    _ref?: string
  }
}

export default defineType({
  name: 'textImage',
  title: 'Text & Image',
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
      title: 'Text Content',
      type: 'blockContent',
    }),
    defineField({
      name: 'align',
      title: 'Image Alignment',
      type: 'string',
      options: {
        list: [
          {title: 'Left', value: 'left'},
          {title: 'Right', value: 'right'},
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      initialValue: 'left',
    }),
    defineField({
      name: 'imageSize',
      title: 'Image Size',
      type: 'string',
      options: {
        list: [
          {title: 'Small', value: 'sm'},
          {title: 'Medium', value: 'md'},
          {title: 'Large', value: 'lg'},
          {title: 'Full Width', value: 'full'},
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      initialValue: 'md',
    }),
  ],
})
