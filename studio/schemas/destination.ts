import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'destination',
  title: 'Destination',
  type: 'document',
  groups: [
    {name: 'content', title: 'Content'},
    {name: 'seo', title: 'SEO & AI'},
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Country Name',
      type: 'string',
      group: 'content',
      validation: (Rule) => Rule.required(),
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
      title: 'Hero Image',
      type: 'imageOrGallery',
      group: 'content',
    }),
    defineField({
      name: 'travelInfo',
      title: 'Travel Information',
      type: 'array',
      of: [{type: 'block'}],
      group: 'content',
    }),
    defineField({
      name: 'didYouKnowImage',
      title: 'Did You Know Image',
      type: 'imageOrGallery',
      group: 'content',
    }),
    defineField({
      name: 'didYouKnowText',
      title: 'Did You Know Text',
      type: 'text',
      group: 'content',
    }),
    defineField({
      name: 'highlights',
      title: 'Highlights',
      type: 'array',
      of: [{type: 'block'}],
      group: 'content',
    }),
    defineField({
      name: 'practicalStuff',
      title: 'Practical Info Sections',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {name: 'title', type: 'string', title: 'Section Title'},
            {
              name: 'content',
              title: 'Content',
              type: 'array',
              of: [
                {
                  type: 'block',
                  styles: [{title: 'Normal', value: 'normal'}],
                  lists: [
                    {title: 'Bullet', value: 'bullet'},
                    {title: 'Numbered', value: 'number'},
                  ],
                  marks: {
                    decorators: [
                      {title: 'Strong', value: 'strong'},
                      {title: 'Emphasis', value: 'em'},
                    ],
                    annotations: [
                      {
                        name: 'link',
                        type: 'object',
                        title: 'External Link',
                        fields: [
                          {
                            name: 'href',
                            type: 'url',
                            title: 'URL',
                            validation: (Rule) =>
                              Rule.uri({
                                scheme: ['http', 'https', 'mailto', 'tel'],
                              }),
                          },
                        ],
                      },
                    ],
                  },
                },
              ],
            },
          ],
        },
      ],
      group: 'content',
    }),
    defineField({
      name: 'ctaLink',
      title: 'Discovery Call Link',
      type: 'url',
      group: 'content',
    }),
    defineField({
      name: 'flagImage',
      title: 'Country Flag',
      type: 'image',
      options: {hotspot: true},
      group: 'content',
    }),
    defineField({
      name: 'region',
      title: 'Region',
      type: 'string',
      group: 'content',
    }),
    defineField({
      name: 'ranking',
      title: 'Ranking Position',
      type: 'number',
      group: 'content',
    }),
    defineField({
      name: 'featured',
      title: 'Feature on Homepage?',
      type: 'boolean',
      group: 'content',
    }),
    defineField({
      name: 'mapLocation',
      title: 'Google Map Location (Optional)',
      type: 'string',
      group: 'content',
    }),
    defineField({
      name: 'tags',
      title: 'Highlights / Tags',
      type: 'array',
      of: [{type: 'string'}],
      description: 'Ex: Big 5, Migration, Luxury, etc.',
      group: 'content',
    }),
    defineField({
      name: 'gallery',
      title: 'Photo Gallery',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{type: 'galleryImage'}],
        },
      ],
      group: 'content',
    }),
    // SEO FIELDS
    defineField({
      name: 'metaTitle',
      title: 'Meta Title',
      type: 'string',
      group: 'seo',
      validation: (Rule) => Rule.required().max(60),
    }),
    defineField({
      name: 'metaDescription',
      title: 'Meta Description',
      type: 'text',
      rows: 3,
      group: 'seo',
      validation: (Rule) => Rule.required().max(160),
    }),
    defineField({
      name: 'pageType',
      title: 'Page Type',
      type: 'string',
      group: 'seo',
      initialValue: 'location',
      options: {
        list: [{title: 'Location / Destination', value: 'location'}],
        layout: 'dropdown',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'canonicalUrl',
      title: 'Canonical URL (Optional override)',
      type: 'url',
      group: 'seo',
    }),
    defineField({
      name: 'aiSummary',
      title: 'AI Summary',
      type: 'text',
      rows: 3,
      description: 'Short, factual summary optimized for AI search models.',
      group: 'seo',
    }),
    defineField({
      name: 'seoKeywords',
      title: 'SEO Keywords / Topics',
      type: 'array',
      of: [{type: 'string'}],
      group: 'seo',
    }),
    defineField({
      name: 'geoLat',
      title: 'Latitude',
      type: 'number',
      group: 'seo',
    }),
    defineField({
      name: 'geoLng',
      title: 'Longitude',
      type: 'number',
      group: 'seo',
    }),
    defineField({
      name: 'structuredData',
      title: 'Structured Data (JSON-LD Override)',
      type: 'text',
      rows: 10,
      description: 'Paste custom JSON-LD here if needed.',
      group: 'seo',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      ranking: 'ranking',
      region: 'region',
    },
    prepare({title, ranking, region}) {
      return {
        title: `${ranking != null ? `${ranking}. ` : ''}${title}`,
        subtitle: region ? `Region: ${region}` : '',
      }
    },
  },
})
