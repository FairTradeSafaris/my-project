import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'hero',
  title: 'Hero Section',
  type: 'document',
  fields: [
    defineField({
      name: 'headline',
      title: 'Headline',
      type: 'string',
    }),
    defineField({
      name: 'subheadline',
      title: 'Subheadline',
      type: 'string',
    }),
    defineField({
      name: 'backgroundImages',
      title: 'Background Images',
      type: 'array',
      of: [
        {
          type: 'image',
          options: {hotspot: true},
          fields: [
            defineField({
              name: 'alt',
              title: 'Alt Text',
              type: 'string',
              description: 'Describe the image for screen readers and SEO.',
              validation: (Rule) =>
                Rule.required().error('Alt text is required for accessibility.'),
            }),
          ],
        },
      ],
    }),
    defineField({
      name: 'primaryCTA',
      title: 'Primary Button Text',
      type: 'string',
    }),
    defineField({
      name: 'secondaryCTA',
      title: 'Secondary Button Text',
      type: 'string',
    }),
    // ✅ Meta tags
    defineField({
      name: 'metaTitle',
      title: 'Meta Title (for browser tab & SEO)',
      type: 'string',
      description: 'Appears in browser tab and search engines.',
    }),
    defineField({
      name: 'metaDescription',
      title: 'Meta Description',
      type: 'text',
      description: 'Used in search engine snippets.',
    }),
  ],
})
