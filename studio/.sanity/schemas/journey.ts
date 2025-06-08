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
      options: {
        source: 'title',
        maxLength: 96,
      },
    }),
    defineField({
      name: 'summary',
      title: 'Short Summary',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'duration',
      title: 'Trip Duration',
      type: 'string',
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'alt',
      title: 'Image Alt Text',
      type: 'string',
    }),
    defineField({
      name: 'ctaText',
      title: 'CTA Button Text',
      type: 'string',
      initialValue: 'View Itinerary',
    }),

    // 🎯 Filters
    defineField({
      name: 'region',
      title: 'Region',
      type: 'string',
      options: {
        list: [
          {title: 'East Africa', value: 'East Africa'},
          {title: 'Southern Africa', value: 'Southern Africa'},
          {title: 'West Africa', value: 'West Africa'},
          {title: 'Indian Ocean', value: 'Indian Ocean'},
          {title: 'North Africa', value: 'North Africa'},
        ],
        layout: 'dropdown',
      },
    }),
    defineField({
      name: 'country',
      title: 'Country',
      type: 'string',
      options: {
        list: [
          {title: 'Kenya', value: 'Kenya'},
          {title: 'Tanzania', value: 'Tanzania'},
          {title: 'South Africa', value: 'South Africa'},
          {title: 'Botswana', value: 'Botswana'},
          {title: 'Zambia', value: 'Zambia'},
          {title: 'Namibia', value: 'Namibia'},
        ],
        layout: 'dropdown',
      },
    }),
    defineField({
      name: 'star',
      title: 'Star Level',
      type: 'string',
      options: {
        list: ['3 Star', '4 Star', '5 Star'],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'travelStyle',
      title: 'Travel Style',
      type: 'array',
      of: [{type: 'string'}],
      options: {
        list: ['Luxury', 'Cultural', 'Adventure', 'Wildlife'],
        layout: 'tags',
      },
    }),

    // 🔗 Wetu link for itinerary preview
    defineField({
      name: 'wetuLink',
      title: 'Wetu Itinerary Link',
      type: 'url',
      validation: (Rule) => Rule.uri({scheme: ['http', 'https']}),
    }),
  ],
})
