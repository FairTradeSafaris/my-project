// country.ts
import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'country',
  title: 'Country',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Country Name',
      type: 'string',
    }),
    defineField({
      name: 'flag',
      title: 'Flag Icon',
      type: 'image',
      options: {hotspot: true},
    }),
  ],
})
