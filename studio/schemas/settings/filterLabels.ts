// schemas/settings/filterLabels.ts
import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'filterLabels',
  title: 'Filter Labels',
  type: 'document',
  fields: [
    defineField({
      name: 'signature',
      title: 'Signature Safari Label',
      type: 'string',
    }),
    defineField({
      name: 'style',
      title: 'Travel Style Label',
      type: 'string',
    }),
    defineField({
      name: 'feature',
      title: 'Trip Feature Label',
      type: 'string',
    }),
  ],
})
