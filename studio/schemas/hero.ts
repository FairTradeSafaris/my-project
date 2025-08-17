import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'hero',
  title: 'Hero',
  type: 'document',
  fields: [
    defineField({
      name: 'scope',
      title: 'Applies To',
      type: 'string',
      options: {
        list: [
          {title: 'Default (global fallback)', value: 'default'},
          {title: 'Home', value: 'home'},
          {title: 'Journeys', value: 'journeys'},
          {title: 'Blog', value: 'blog'},
          {title: 'Books', value: 'books'},
          {title: 'Custom…', value: 'custom'},
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
      description:
        'Choose which page this Hero config applies to. Create exactly ONE "Default (global fallback)" to supply shared background images and defaults.',
    }),
    defineField({
      name: 'customScope',
      title: 'Custom Page Key',
      type: 'string',
      hidden: ({document}) => document?.scope !== 'custom',
      validation: (Rule) =>
        Rule.custom((val, ctx) =>
          ctx?.document?.scope === 'custom' && !val ? 'Please enter a custom page key.' : true,
        ),
    }),
    defineField({name: 'pageLabel', title: 'Page Label (eyebrow)', type: 'string'}),
    defineField({name: 'headline', title: 'Headline', type: 'string'}),
    defineField({name: 'subheadline', title: 'Subheadline', type: 'string'}),
    defineField({
      name: 'action',
      title: 'Hero Action',
      type: 'string',
      options: {
        list: [
          {title: 'None (just text)', value: 'none'},
          {title: 'Home Filters (dropdowns)', value: 'homeFilters'},
          {title: 'Type-to-Search (Journeys)', value: 'typeSearch'},
        ],
        layout: 'radio',
      },
      initialValue: 'none',
    }),
    defineField({
      name: 'backgroundImages',
      title: 'Background Images',
      type: 'array',
      of: [
        {
          name: 'responsiveBackground',
          title: 'Responsive Background',
          type: 'object',
          fields: [
            defineField({
              name: 'desktopImage',
              title: 'Desktop Image',
              type: 'image',
              options: {hotspot: true},
            }),
            defineField({
              name: 'mobileImage',
              title: 'Mobile Image',
              type: 'image',
              options: {hotspot: true},
              description: 'Portrait crop recommended for mobile screens.',
            }),
            defineField({
              name: 'alt',
              title: 'Alt Text',
              type: 'string',
              description: 'Required for accessibility and SEO.',
              validation: (Rule) => Rule.required().error('Alt text is required.'),
            }),
          ],
          preview: {
            select: {media: 'desktopImage', title: 'alt'},
            prepare: ({media, title}) => ({media, title: title || 'Responsive background'}),
          },
          validation: (Rule) =>
            Rule.custom((val) => {
              if (!val) return true
              const bg = val as {desktopImage?: any; mobileImage?: any}
              return !bg.desktopImage && !bg.mobileImage
                ? 'Add at least a Desktop or Mobile image.'
                : true
            }),
        },
        {
          type: 'image',
          name: 'legacyImage',
          title: 'Single Image (legacy)',
          options: {hotspot: true},
          fields: [
            defineField({
              name: 'alt',
              title: 'Alt Text',
              type: 'string',
              description: 'Required for accessibility and SEO.',
              validation: (Rule) => Rule.required().error('Alt text is required.'),
            }),
          ],
        },
      ],
      description:
        'Optional. Prefer “Responsive Background” for desktop/mobile variants. If empty, this page uses the "Default" fallback.',
      validation: (Rule) => Rule.custom(() => true),
    }),
    defineField({name: 'primaryCTA', title: 'Primary Button Text', type: 'string'}),
    defineField({name: 'secondaryCTA', title: 'Secondary Button Text', type: 'string'}),
    defineField({
      name: 'metaTitle',
      title: 'Meta Title',
      type: 'string',
      description: 'Appears in browser tab and search results.',
    }),
    defineField({
      name: 'metaDescription',
      title: 'Meta Description',
      type: 'text',
      description: 'Used in search engine snippets.',
    }),
  ],
  preview: {
    select: {
      title: 'headline',
      subheadline: 'subheadline',
      scope: 'scope',
      customScope: 'customScope',
      responsive0: 'backgroundImages.0.desktopImage',
      legacy0: 'backgroundImages.0.asset',
    },
    prepare({title, subheadline, scope, customScope, responsive0, legacy0}) {
      const media = responsive0 || legacy0
      const scopeLabel = scope === 'custom' ? `custom:${customScope || '—'}` : scope || 'default'
      return {
        title: title || `Hero (${scopeLabel})`,
        subtitle: subheadline || `Scope: ${scopeLabel}`,
        media,
      }
    },
  },
})
