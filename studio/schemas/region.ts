// region.ts
import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'region',
  title: 'Region',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Region Name',
      type: 'string',
    }),
  ],
})
