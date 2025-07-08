import {defineType, defineField} from 'sanity'

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
