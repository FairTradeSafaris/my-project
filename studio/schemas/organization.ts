import {defineType, defineField} from 'sanity'
import type {Rule} from 'sanity'

export default defineType({
  name: 'organization',
  title: 'Organization',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Organization Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
      options: {hotspot: true},
    }),
    defineField({
      name: 'image',
      title: 'Organization Image (Optional)',
      type: 'image',
      options: {hotspot: true},
    }),
    defineField({
      name: 'website',
      title: 'Website URL',
      type: 'url',
    }),
    defineField({
      name: 'telephone',
      title: 'Telephone',
      type: 'string',
    }),
    defineField({
      name: 'priceRange',
      title: 'Price Range',
      type: 'object',
      fields: [
        {name: 'min', title: 'Min Price (USD)', type: 'number'},
        {name: 'max', title: 'Max Price (USD)', type: 'number'},
        {
          name: 'symbol',
          title: 'Price Symbol',
          type: 'string',
          description: 'e.g. $, $$, $$$, $$$$',
        },
      ],
    }),
    defineField({
      name: 'address',
      title: 'Address',
      type: 'object',
      fields: [
        {name: 'streetAddress', title: 'Street Address', type: 'string'},
        {name: 'addressLocality', title: 'City', type: 'string'},
        {name: 'addressRegion', title: 'State / Region', type: 'string'},
        {name: 'postalCode', title: 'Postal Code', type: 'string'},
        {name: 'addressCountry', title: 'Country', type: 'string'},
      ],
    }),
    defineField({
      name: 'socials',
      title: 'Social Links',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({name: 'platform', title: 'Platform', type: 'string'}),
            defineField({name: 'url', title: 'URL', type: 'url'}),
          ],
        },
      ],
    }),
    defineField({
      name: 'location',
      title: 'Location (Optional Label)',
      type: 'string',
    }),
  ],
})
