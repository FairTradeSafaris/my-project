// journeys/journey.ts
import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'journey',
  title: 'Journey',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Journey Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'title', maxLength: 96},
    }),
    defineField({name: 'summary', title: 'Short Summary', type: 'text', rows: 3}),
    defineField({name: 'duration', title: 'Trip Duration', type: 'string'}),
    defineField({
      name: 'price',
      title: 'Price Per Person (Sharing)',
      type: 'number', // ✅ switch to number
      description: 'Enter price as a number only, e.g., 5200',
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero Image',
      type: 'image',
      options: {hotspot: true},
      description:
        'Recommended size: 785×551 or similar aspect ratio (≈1.4:1). Optimized for responsive display.',
    }),

    defineField({name: 'alt', title: 'Image Alt Text', type: 'string'}),
    defineField({
      name: 'ctaText',
      title: 'CTA Button Text',
      type: 'string',
      initialValue: 'View Itinerary',
    }),

    // filters
    defineField({
      name: 'region',
      title: 'Region',
      type: 'reference',
      to: [{type: 'region'}],
    }),

    // 🔁 CHANGED: single → multiple
    defineField({
      name: 'countries',
      title: 'Countries',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'country'}]}],
      validation: (Rule) => Rule.min(1).unique(),
    }),

    defineField({
      name: 'star',
      title: 'Star Level',
      type: 'string',
      options: {list: ['3 Star', '4 Star', '5 Star'], layout: 'radio'},
    }),
    defineField({
      name: 'starIcon',
      title: 'Custom Star Icon (SVG)',
      type: 'image',
      options: {accept: 'image/svg+xml'},
      description: 'Optional – upload an SVG to use instead of default stars.',
    }),
    defineField({
      name: 'travelStyle',
      title: 'Travel Style',
      type: 'array',
      of: [{type: 'string'}],
      options: {list: ['Luxury', 'Cultural', 'Adventure', 'Wildlife'], layout: 'tags'},
    }),
    defineField({
      name: 'travelStyleRefs',
      title: 'Travel Style (New)',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'travelInterest'}]}],
      description:
        'This is the new field using references. Use this for all new journeys going forward.',
    }),

    defineField({
      name: 'featuredOnHome',
      title: 'Feature on Homepage',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'wetuLink',
      title: 'Wetu Itinerary Link',
      type: 'url',
      validation: (Rule) => Rule.uri({scheme: ['http', 'https']}),
    }),
  ],
})
