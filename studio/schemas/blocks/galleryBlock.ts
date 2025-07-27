import {defineType, defineField} from 'sanity'

// ✅ Helper type for image asset validation
type SanityImageValue = {
  asset?: {
    _ref?: string
  }
}

export default defineType({
  name: 'galleryBlock',
  title: 'Image Gallery',
  type: 'object',
  fields: [
    defineField({
      name: 'images',
      title: 'Gallery Images',
      type: 'array',
      of: [
        {
          type: 'image',
          options: {hotspot: true},
          fields: [
            {
              name: 'alt',
              title: 'Alt Text',
              type: 'string',
              validation: (Rule) => Rule.required().error('Alt text is required for every image.'),
            },
          ],
        },
      ],
      validation: (Rule) =>
        Rule.custom((images: SanityImageValue[] | undefined) => {
          if (!Array.isArray(images)) return true

          for (const image of images) {
            const ref = image.asset?._ref || ''
            if (ref && !ref.endsWith('.webp')) {
              return 'All images must be in WebP format.'
            }
          }

          return true
        })
          .min(2)
          .error('Add at least two images.'),
    }),
    defineField({
      name: 'layout',
      title: 'Gallery Layout',
      type: 'string',
      options: {
        list: [
          {title: 'Grid', value: 'grid'},
          {title: 'Carousel', value: 'carousel'},
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      initialValue: 'grid',
    }),
  ],
})
