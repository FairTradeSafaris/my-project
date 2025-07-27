import {defineType, defineField} from 'sanity'

// 🔁 Shared helper type for image asset validation
type SanityImageValue = {
  asset?: {
    _ref?: string
  }
}

export default defineType({
  name: 'smartCarousel',
  title: 'Smart Carousel',
  type: 'object',
  fields: [
    defineField({
      name: 'slides',
      title: 'Slides',
      type: 'array',
      of: [
        {
          type: 'object',
          title: 'Slide',
          fields: [
            {
              name: 'image',
              title: 'Image',
              type: 'image',
              options: {hotspot: true},
              fields: [
                {
                  name: 'alt',
                  title: 'Alt Text',
                  type: 'string',
                  validation: (Rule) =>
                    Rule.required().error('Alt text is required for every slide image.'),
                },
              ],
              validation: (Rule) =>
                Rule.custom((image: SanityImageValue | undefined) => {
                  const ref = image?.asset?._ref || ''
                  if (ref && !ref.endsWith('.webp')) {
                    return 'Please upload images in WebP format.'
                  }
                  return true
                }),
            },
            {
              name: 'caption',
              title: 'Caption',
              type: 'string',
            },
            {
              name: 'buttonText',
              title: 'Button Text',
              type: 'string',
            },
            {
              name: 'buttonLink',
              title: 'Button Link',
              type: 'url',
              validation: (Rule) =>
                Rule.uri({scheme: ['http', 'https']}).error('Must be a valid URL'),
            },
          ],
        },
      ],
      validation: (Rule) => Rule.min(2).error('Add at least two slides.'),
    }),
    defineField({
      name: 'autoplay',
      title: 'Autoplay',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'interval',
      title: 'Autoplay Interval (ms)',
      type: 'number',
      initialValue: 5000,
      validation: (Rule) => Rule.min(1000).max(20000),
    }),
  ],
})
