import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'hero',
  title: 'Hero',
  type: 'document',
  fields: [
    // Which page this hero applies to
    defineField({
      name: 'scope',
      title: 'Applies To',
      type: 'string',
      description:
        'Choose which page this Hero config applies to. Create exactly ONE "Default (global fallback)" to supply shared background images and defaults.',
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
    }),

    // For pages not listed above (e.g. "about", "contact")
    defineField({
      name: 'customScope',
      title: 'Custom Page Key',
      type: 'string',
      description:
        'When "Custom…" is selected above, enter a simple key/slug here (e.g. "about", "contact").',
      hidden: ({document}) => document?.scope !== 'custom',
      validation: (Rule) =>
        Rule.custom((val, ctx) => {
          const scope = (ctx?.document as any)?.scope
          if (scope === 'custom' && !val) {
            return 'Please enter a custom page key.'
          }
          return true
        }),
    }),

    // Small eyebrow above the headline (optional)
    defineField({
      name: 'pageLabel',
      title: 'Page Label (eyebrow)',
      type: 'string',
      description: 'Optional small label above the headline, e.g. “Journeys”.',
    }),

    // Main copy
    defineField({
      name: 'headline',
      title: 'Headline',
      type: 'string',
      description: 'Main hero headline for this page.',
    }),
    defineField({
      name: 'subheadline',
      title: 'Subheadline',
      type: 'string',
      description: 'Optional supporting line under the headline.',
    }),

    // What controls appear inside the hero on this page
    defineField({
      name: 'action',
      title: 'Hero Action',
      type: 'string',
      description:
        'Controls what appears in the hero: none (just text), Home dropdown filters, or Journeys type-to-search.',
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

    // Background images for THIS page (optional)
    // If left empty (or on non-override pages), the frontend should fall back to the "Default" doc's images.
    defineField({
      name: 'backgroundImages',
      title: 'Background Images (optional)',
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
      description:
        'Optional. If empty, this page will use the images from the "Default (global fallback)" hero document.',
    }),

    // Optional buttons (kept for flexibility even if many pages don’t use them)
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

    // Meta (optional)
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

  preview: {
    select: {
      title: 'headline',
      subheadline: 'subheadline',
      scope: 'scope',
      customScope: 'customScope',
      media: 'backgroundImages.0',
    },
    prepare({title, subheadline, scope, customScope, media}) {
      const scopeLabel = scope === 'custom' ? `custom:${customScope || '—'}` : scope || 'default'
      return {
        title: title || `Hero (${scopeLabel})`,
        subtitle: subheadline || `Scope: ${scopeLabel}`,
        media,
      }
    },
  },
})
