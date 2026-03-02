import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'sitePages',
  title: 'Site Pages',
  type: 'document',
  fields: [
    defineField({
      name: 'slug',
      title: 'Page Slug',
      type: 'slug',
      options: {
        source: 'metaTitle',
        slugify: (input) =>
          input
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9-]/g, '')
            .slice(0, 96),
      },
      validation: (Rule) =>
        Rule.required().custom((slug) =>
          slug?.current ? true : 'Slug must have a `.current` value',
        ),
    }),
    defineField({
      name: 'metaTitle',
      title: 'Meta Title',
      type: 'string',
      description: 'Clickable title in Google search. Max ~60 characters.',
      validation: (Rule) => Rule.required().max(60),
    }),
    defineField({
      name: 'pageHeading',
      title: 'Page Heading (H1)',
      type: 'string',
      description: 'Visible H1 heading on the page. Must be different from the meta title.',
      validation: (Rule) =>
        Rule.required()
          .max(80)
          .custom((value, context) => {
            const parent = context?.parent as {metaTitle?: string}
            const metaTitle = parent?.metaTitle

            if (value && metaTitle && value.trim() === metaTitle.trim()) {
              return 'Heading must be different from the Meta Title'
            }
            return true
          }),
    }),

    defineField({
      name: 'metaDescription',
      title: 'Meta Description',
      type: 'text',
      description: 'Shown under the title in search results. 150–160 characters ideal.',
      rows: 3,
      validation: (Rule) => Rule.required().max(160),
    }),
    defineField({
      name: 'canonicalUrl',
      title: 'Canonical URL (Optional override)',
      type: 'url',
      description: 'Used only if you want to override the auto-generated canonical.',
    }),
    defineField({
      name: 'aiSummary',
      title: 'AI Summary',
      type: 'text',
      rows: 3,
      description: 'Short factual summary optimized for AI systems.',
    }),
    defineField({
      name: 'seoKeywords',
      title: 'SEO Keywords / Topics',
      type: 'array',
      of: [{type: 'string'}],
      description: 'Optional: keywords or topics this page covers.',
    }),
    defineField({
      name: 'pageType',
      title: 'Page Type',
      type: 'string',
      description: 'Used to generate the correct AI & SEO Schema.',
      options: {
        list: [
          {title: 'Standard Web Page', value: 'webPage'},
          {title: 'Article / Blog Post', value: 'article'},
          {title: 'FAQ Page', value: 'faq'},
          {title: 'Video Page', value: 'video'},
          {title: 'Review / Testimonial Page', value: 'review'},
          {title: 'Tour / Safari Page', value: 'tour'},
          {title: 'Location Page', value: 'location'},
          {title: 'Contact Page', value: 'contact'},
          {title: 'About Page', value: 'about'},
          {title: 'Collection / Category Page', value: 'collection'},
        ],
        layout: 'dropdown',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'ogImage',
      title: 'Open Graph Image',
      type: 'image',
      description: 'Used for social shares. Recommended size: 1200x630.',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
          description: 'Describes the image for SEO.',
          validation: (Rule) => Rule.max(100),
        }),
      ],
    }),
    defineField({
      name: 'noIndex',
      title: 'Hide from Search Engines (noindex)?',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'articleAuthor',
      title: 'Article Author',
      type: 'string',
      hidden: ({parent}) => parent?.pageType !== 'article',
    }),
    defineField({
      name: 'datePublished',
      title: 'Date Published',
      type: 'date',
      hidden: ({parent}) => parent?.pageType !== 'article',
    }),
    defineField({
      name: 'faqItems',
      title: 'FAQ Items',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({name: 'question', title: 'Question', type: 'string'}),
            defineField({name: 'answer', title: 'Answer', type: 'text'}),
          ],
        },
      ],
      hidden: ({parent}) => parent?.pageType !== 'faq',
    }),
    defineField({
      name: 'videoUrl',
      title: 'Video URL',
      type: 'url',
      hidden: ({parent}) => parent?.pageType !== 'video',
    }),
    defineField({
      name: 'videoDuration',
      title: 'Video Duration (ISO8601)',
      type: 'string',
      hidden: ({parent}) => parent?.pageType !== 'video',
    }),
    defineField({
      name: 'reviewRating',
      title: 'Average Rating (1-5)',
      type: 'number',
      validation: (Rule) => Rule.min(1).max(5),
      hidden: ({parent}) => parent?.pageType !== 'review',
    }),
    defineField({
      name: 'tourLocation',
      title: 'Tour Location',
      type: 'string',
      hidden: ({parent}) => parent?.pageType !== 'tour',
    }),
    defineField({
      name: 'tourDuration',
      title: 'Tour Duration (e.g. 7 Days)',
      type: 'string',
      hidden: ({parent}) => parent?.pageType !== 'tour',
    }),
    defineField({
      name: 'structuredData',
      title: 'Structured Data (JSON-LD Override)',
      type: 'text',
      description:
        'Optional: paste custom JSON-LD. If present, it will override auto-generated schema.',
      rows: 10,
    }),
    defineField({
      name: 'organization',
      title: 'Organization Schema (Optional Override)',
      type: 'reference',
      to: [{type: 'organization'}],
      description:
        'Defaults to site-wide organization data, but can be overridden for specific pages if needed.',
    }),
    defineField({
      name: 'top10List',
      title: 'Show in Top 10 Schema?',
      type: 'boolean',
      initialValue: false,
      description: 'If checked, this journey will appear in SEO/AI Top 10 structured data.',
    }),
  ],
})
