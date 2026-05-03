import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'featuredJourneysSection',
  title: 'Featured Journeys Section',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Section Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'description',
      title: 'Section Description',
      type: 'array',
      of: [
        {
          type: 'block',
          marks: {
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'Link',
                fields: [
                  {
                    name: 'href',
                    type: 'string',
                    title: 'URL',
                  },
                ],
              },
            ],
          },
        },
      ],
    }),

    defineField({
      name: 'ctaText',
      title: 'CTA Text',
      type: 'string',
    }),

    defineField({
      name: 'ctaLink',
      title: 'CTA Link',
      type: 'string',
    }),

    defineField({
      name: 'showCustomCard',
      title: 'Show Custom Card',
      type: 'boolean',
      initialValue: true,
    }),

    defineField({
      name: 'customCard',
      title: 'Custom Card',
      type: 'object',
      fields: [
        defineField({
          name: 'eyebrow',
          title: 'Eyebrow Text',
          type: 'string',
        }),
        defineField({
          name: 'title',
          title: 'Card Title',
          type: 'string',
        }),
        defineField({
          name: 'description',
          title: 'Card Description',
          type: 'text',
        }),
        defineField({
          name: 'buttonText',
          title: 'Button Text',
          type: 'string',
        }),
        defineField({
          name: 'buttonLink',
          title: 'Button Link',
          type: 'string',
        }),
        defineField({
          name: 'image',
          title: 'Card Image',
          type: 'image',
          options: {hotspot: true},
        }),
      ],
    }),
  ],
})
