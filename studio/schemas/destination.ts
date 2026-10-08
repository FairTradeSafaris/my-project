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
    /*
    =========================================
    CORE
    =========================================
    */

    defineField({
      name: 'title',
      title: 'Country Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
      group: 'content',
    }),

    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
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

    /*
    =========================================
    HERO
    =========================================
    */

    defineField({
      name: 'heroImage',
      title: 'Hero Image',
      type: 'imageOrGallery',
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
      name: 'heroIntro',
      title: 'Hero Intro',
      type: 'text',
      rows: 3,
      description: 'Short emotional introduction below hero section.',
      group: 'content',
    }),

    /*
    =========================================
    EXISTING CONTENT
    KEEP ALL
    =========================================
    */

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
            {
              name: 'title',
              title: 'Section Title',
              type: 'string',
            },
            {
              name: 'content',
              title: 'Content',
              type: 'array',
              of: [{type: 'block'}],
            },
          ],
        },
      ],
      group: 'content',
    }),

    /*
    =========================================
    NEW STRUCTURED FIELDS
    =========================================
    */

    defineField({
      name: 'stats',
      title: 'Destination Stats',
      type: 'array',
      group: 'content',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'label',
              title: 'Label',
              type: 'string',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'value',
              title: 'Value',
              type: 'string',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'icon',
              title: 'Icon',
              type: 'string',
              options: {
                list: [
                  {title: 'Users', value: 'users'},
                  {title: 'Bird', value: 'bird'},
                  {title: 'Trees', value: 'trees'},
                  {title: 'Paw Print', value: 'paw'},
                  {title: 'Calendar', value: 'calendar'},
                  {title: 'Mountain', value: 'mountain'},
                  {title: 'Map Pin', value: 'map-pin'},
                  {title: 'Globe', value: 'globe'},
                  {title: 'Binoculars', value: 'binoculars'},
                  {title: 'Camera', value: 'camera'},
                ],
                layout: 'dropdown',
              },
            },
          ],

          preview: {
            select: {
              title: 'label',
              subtitle: 'value',
              icon: 'icon',
            },

            prepare({title, subtitle, icon}) {
              return {
                title,
                subtitle: `${subtitle || ''}${icon ? ` • ${icon}` : ''}`,
              }
            },
          },
        },
      ],
    }),

    defineField({
      name: 'wildlifeHighlights',
      title: 'Wildlife Highlights',
      type: 'array',
      of: [{type: 'string'}],
      description: 'Examples: Gorillas, Big Five, Chimpanzees, Flamingos',
      group: 'content',
    }),

    defineField({
      name: 'featuredParks',
      title: 'Featured Parks & Regions',
      type: 'array',
      group: 'content',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'name',
              title: 'Park / Region Name',
              type: 'string',
            },
            {
              name: 'description',
              title: 'Description',
              type: 'text',
              rows: 3,
            },
            {
              name: 'image',
              title: 'Image',
              type: 'image',
              options: {
                hotspot: true,
              },
              fields: [
                {
                  name: 'alt',
                  title: 'Alt Text',
                  type: 'string',
                  validation: (Rule) => Rule.required(),
                },
              ],
            },
            {
              name: 'bestFor',
              title: 'Best For',
              type: 'array',
              of: [{type: 'string'}],
            },
          ],
        },
      ],
    }),

    defineField({
      name: 'bestTimeToVisit',
      title: 'Best Time To Visit',
      type: 'object',
      group: 'content',
      fields: [
        {
          name: 'summary',
          title: 'Summary',
          type: 'text',
          rows: 3,
        },
        {
          name: 'peakSeason',
          title: 'Peak Season',
          type: 'string',
        },
        {
          name: 'greenSeason',
          title: 'Green Season',
          type: 'string',
        },
        {
          name: 'bestWildlifeMonths',
          title: 'Best Wildlife Months',
          type: 'string',
        },
      ],
    }),

    defineField({
      name: 'conservationSection',
      title: 'Conservation & Impact',
      type: 'object',
      group: 'content',
      fields: [
        {
          name: 'title',
          title: 'Section Title',
          type: 'string',
        },
        {
          name: 'content',
          title: 'Content',
          type: 'array',
          of: [{type: 'block'}],
        },
        {
          name: 'image',
          title: 'Image',
          type: 'image',
          options: {
            hotspot: true,
          },
          fields: [
            {
              name: 'alt',
              title: 'Alt Text',
              type: 'string',
              validation: (Rule) => Rule.required(),
            },
          ],
        },
      ],
    }),

    defineField({
      name: 'travelTips',
      title: 'Travel Tips',
      type: 'array',
      group: 'content',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'title',
              title: 'Tip Title',
              type: 'string',
            },
            {
              name: 'content',
              title: 'Tip Content',
              type: 'text',
              rows: 3,
            },
          ],
        },
      ],
    }),

    /*
    =========================================
    CTA
    =========================================
    */

    defineField({
      name: 'ctaLink',
      title: 'Discovery Call Link',
      type: 'url',
      group: 'content',
    }),

    /*
    =========================================
    TAGS / MAP
    =========================================
    */

    defineField({
      name: 'mapLocation',
      title: 'Google Map Location',
      type: 'string',
      group: 'content',
    }),

    defineField({
      name: 'tags',
      title: 'Highlights / Tags',
      type: 'array',
      of: [{type: 'string'}],
      group: 'content',
    }),

    /*
    =========================================
    GALLERY
    =========================================
    */

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

    /*
    =========================================
    SEO
    =========================================
    */

    defineField({
      name: 'metaTitle',
      title: 'Meta Title',
      type: 'string',
      validation: (Rule) => Rule.required().max(60),
      group: 'seo',
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
      name: 'metaDescription',
      title: 'Meta Description',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.required().max(160),
      group: 'seo',
    }),

    defineField({
      name: 'canonicalUrl',
      title: 'Canonical URL',
      type: 'url',
      group: 'seo',
    }),

    defineField({
      name: 'aiSummary',
      title: 'AI Summary',
      type: 'text',
      rows: 3,
      group: 'seo',
    }),

    defineField({
      name: 'seoKeywords',
      title: 'SEO Keywords',
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
      title: 'Structured Data JSON-LD',
      type: 'text',
      rows: 10,
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
