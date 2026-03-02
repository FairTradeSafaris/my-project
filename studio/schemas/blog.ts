import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'blog',
  title: 'Blog Post',
  type: 'document',
  groups: [
    {name: 'content', title: 'Content'},
    {name: 'seo', title: 'SEO & AI'},
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
      group: 'content',
    }),
    defineField({
      name: 'relatedDestinations',
      title: 'Related Destinations',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{type: 'destination'}],
        },
      ],
      description:
        'Select one or more destinations this blog post relates to. Used for internal linking and SEO clustering.',
      group: 'content',
    }),
    defineField({
      name: 'seoTitle',
      title: 'SEO Title',
      type: 'string',
      description: 'Required: Title used for SEO. Must be different from the main Title.',
      group: 'seo',
      validation: (Rule) =>
        Rule.custom((seoTitle, context) => {
          const title = (context.parent as {title?: string})?.title
          if (!seoTitle) return 'SEO Title is required.'
          if (seoTitle.trim() === title?.trim())
            return 'SEO Title must be different from the main Title.'
          return true
        })
          .max(60)
          .warning('Keep under 60 characters for the best search result display.'),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'title', maxLength: 96},
      validation: (Rule) => Rule.required(),
      group: 'content',
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero Banner',
      type: 'heroBlock',
      group: 'content',
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
      group: 'content',
    }),
    defineField({
      name: 'updatedAt',
      title: 'Updated At (Modified Date)',
      type: 'datetime',
      description: 'Used for Google Article schema & SEO freshness.',
      group: 'seo',
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
          validation: (Rule) => Rule.max(120),
        }),
      ],
      validation: (Rule) => Rule.required(),
      group: 'content',
    }),
    defineField({
      name: 'summary',
      title: 'Summary',
      type: 'text',
      rows: 3,
      group: 'content',
      validation: (Rule) => Rule.required().max(200),
    }),
    defineField({
      name: 'content',
      title: 'Content Blocks',
      type: 'array',
      of: [
        {type: 'heroBlock'},
        {type: 'textImage'},
        {type: 'quoteBlock'},
        {type: 'galleryBlock'},
        {type: 'videoEmbed'},
        {type: 'textBlock'},
        {type: 'ctaBlock'},
        {type: 'mapBlock'},
        {type: 'table'},
        {type: 'zohoForm'},
        {type: 'smartCarousel'},
      ],
      group: 'content',
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: [{type: 'author'}],
      validation: (Rule) => Rule.required(),
      group: 'seo',
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{type: 'category'}],
      group: 'content',
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'tag'}]}],
      validation: (Rule) =>
        Rule.required().min(1).warning('Assign at least one tag for discoverability.'),
      group: 'seo',
    }),
    defineField({
      name: 'isFeatured',
      title: 'Feature this post',
      type: 'boolean',
      description: 'Show on the blog landing page.',
      group: 'seo',
    }),
    defineField({
      name: 'canonicalUrl',
      title: 'Canonical URL (optional override)',
      type: 'url',
      description: 'Only use if this article exists elsewhere or is syndicated.',
      group: 'seo',
    }),
    defineField({
      name: 'readingTime',
      title: 'Reading Time (minutes)',
      type: 'number',
      description: 'Optional: Auto-generated if not set.',
      group: 'seo',
    }),
    defineField({
      name: 'aiSummary',
      title: 'AI Summary',
      type: 'text',
      rows: 4,
      description: 'Short, factual summary optimized for AI models, not marketing text.',
      group: 'seo',
    }),
    defineField({
      name: 'seoKeywords',
      title: 'SEO Keywords / Topics',
      type: 'array',
      of: [{type: 'string'}],
      description: 'Helps AI classify and understand the main concepts of this post.',
      validation: (Rule) =>
        Rule.required().min(3).max(10).warning('Include 3–8 SEO keywords for best classification.'),
      group: 'seo',
    }),
    defineField({
      name: 'structuredData',
      title: 'Structured Data (JSON-LD Override)',
      type: 'text',
      description: 'Optional: paste custom JSON-LD to override auto-generated schema.',
      rows: 10,
      group: 'seo',
    }),
    defineField({
      name: 'views',
      title: 'Views',
      type: 'number',
      initialValue: 0,
      readOnly: true,
      group: 'content',
    }),
    defineField({
      name: 'likes',
      title: 'Likes',
      type: 'number',
      initialValue: 0,
      group: 'content',
    }),
    defineField({
      name: 'metaDescription',
      title: 'Meta Description (Short)',
      type: 'text',
      rows: 3,
      description: 'Used for SEO and search engine snippets.',
      validation: (Rule) =>
        Rule.required().max(200).warning('Keep under 160–200 characters for best display.'),
      group: 'seo',
    }),
    defineField({
      name: 'extendedDescription',
      title: 'Extended Description (Long)',
      type: 'text',
      rows: 6,
      description: 'Used for social previews or structured data.',
      group: 'seo',
    }),
    defineField({
      name: 'noIndex',
      title: 'Prevent Indexing (noindex)',
      type: 'boolean',
      description: 'If checked, this page will be hidden from search engines.',
      group: 'seo',
    }),
    defineField({
      name: 'ogImage',
      title: 'Open Graph Image',
      type: 'image',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
        }),
      ],
      group: 'seo',
    }),
  ],
})
