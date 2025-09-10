// /schemas/documents/sitePages.ts

import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'sitePages',
  title: 'Site Pages',
  type: 'document',
  fields: [
    defineField({
      name: 'slug',
      title: 'Page Slug',
      type: 'string',
      description:
        "Use path names like 'home', 'contact', 'privacy'. Do not include leading or trailing slashes.",
      validation: (Rule) =>
        Rule.required()
          .regex(/^[a-z0-9-]+$/, {name: 'slug'})
          .error('Slug should be lowercase and use hyphens only.'),
    }),

    defineField({
      name: 'metaTitle',
      title: 'Meta Title',
      type: 'string',
      description: 'Displayed as the clickable link in Google search. Max ~60 characters.',
      validation: (Rule) => Rule.required().max(60),
    }),

    defineField({
      name: 'metaDescription',
      title: 'Meta Description',
      type: 'text',
      description: 'Shown under the title in search results. Ideal length: 150–160 characters.',
      rows: 3,
      validation: (Rule) => Rule.required().max(160),
    }),

    defineField({
      name: 'ogImage',
      title: 'Open Graph Image',
      type: 'image',
      description: 'Used in social shares (Facebook, LinkedIn, etc). Recommended size: 1200x630px.',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
          description: 'Describes the OG image for SEO and accessibility.',
          validation: (Rule) => Rule.max(100),
        }),
      ],
    }),

    defineField({
      name: 'noIndex',
      title: 'Hide from Search Engines (noindex)?',
      type: 'boolean',
      initialValue: false,
      description: 'If enabled, this page will NOT be indexed by Google or other search engines.',
    }),

    defineField({
      name: 'structuredData',
      title: 'Structured Data (JSON-LD)',
      type: 'text',
      description:
        'Paste valid JSON-LD here for advanced SEO (Organization, FAQ, Breadcrumbs, etc).',
      rows: 10,
    }),
  ],
})
