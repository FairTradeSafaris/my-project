import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'pillarPage',
  title: 'Pillar / Core Page',
  type: 'document',
  groups: [
    {name: 'content', title: 'Content'},
    {name: 'seo', title: 'SEO & AI'},
  ],

  fields: [
    // -------------------------
    // BASIC INFO
    // -------------------------

    defineField({
      name: 'title',
      title: 'Page Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
      group: 'content',
    }),

    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'title', maxLength: 96},
      validation: (Rule) => Rule.required(),
      group: 'content',
    }),
    // -------------------------
    // PREMIUM HERO SECTION
    // -------------------------

    defineField({
      name: 'heroVideo',
      title: 'Hero Background Video (MP4)',
      type: 'file',
      options: {
        accept: 'video/mp4',
      },
      description: 'Upload optimized MP4 (8–15s, under 8MB, 1080p max).',
      group: 'content',
    }),

    defineField({
      name: 'heroPoster',
      title: 'Hero Poster Image',
      type: 'image',
      options: {hotspot: true},
      description: 'Fallback image while video loads.',
      group: 'content',
    }),

    defineField({
      name: 'heroHeadline',
      title: 'Hero Headline (H1)',
      type: 'string',
      group: 'content',
    }),

    defineField({
      name: 'heroSubheadline',
      title: 'Hero Subheadline',
      type: 'text',
      rows: 2,
      group: 'content',
    }),
    defineField({
      name: 'heroCTA',
      title: 'Hero CTA Button',
      type: 'object',
      fields: [
        {
          name: 'text',
          title: 'Button Text',
          type: 'string',
        },
        {
          name: 'link',
          title: 'Button Link',
          type: 'string',
        },
      ],
      group: 'content',
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero Banner',
      type: 'heroBlock',
      group: 'content',
    }),

    defineField({
      name: 'intro',
      title: 'Intro Section',
      type: 'array',
      of: [{type: 'block'}],
      description: 'Opening section below hero',
      group: 'content',
    }),

    // -------------------------
    // MODULAR CONTENT BLOCKS
    // -------------------------

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
        {type: 'safariBuilderBlock'}, // 👈 ADD THIS LINE
        {type: 'bestTimeBlock'},
      ],
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
      description: 'Used for internal linking and clustering.',
      group: 'content',
    }),

    defineField({
      name: 'faq',
      title: 'FAQ Section',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{type: 'faqQuestion'}],
        },
      ],
      group: 'content',
    }),

    // -------------------------
    // SEO SECTION
    // -------------------------

    defineField({
      name: 'seoTitle',
      title: 'SEO Title',
      type: 'string',
      validation: (Rule) => Rule.required().max(60).warning('Keep under 60 characters.'),
      group: 'seo',
    }),

    defineField({
      name: 'metaDescription',
      title: 'Meta Description',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.required().max(200).warning('Keep under 160–200 characters.'),
      group: 'seo',
    }),

    defineField({
      name: 'aiSummary',
      title: 'AI Summary',
      type: 'text',
      rows: 4,
      description: 'Short factual summary optimized for AI understanding.',
      group: 'seo',
    }),

    defineField({
      name: 'seoKeywords',
      title: 'SEO Keywords / Topics',
      type: 'array',
      of: [{type: 'string'}],
      validation: (Rule) => Rule.min(3).max(10),
      group: 'seo',
    }),

    defineField({
      name: 'canonicalUrl',
      title: 'Canonical URL (optional)',
      type: 'url',
      group: 'seo',
    }),

    defineField({
      name: 'structuredData',
      title: 'Structured Data Override (JSON-LD)',
      type: 'text',
      rows: 10,
      group: 'seo',
    }),

    defineField({
      name: 'noIndex',
      title: 'Prevent Indexing (noindex)',
      type: 'boolean',
      group: 'seo',
    }),

    defineField({
      name: 'ogImage',
      title: 'Open Graph Image',
      type: 'image',
      options: {hotspot: true},
      group: 'seo',
    }),
  ],
})
