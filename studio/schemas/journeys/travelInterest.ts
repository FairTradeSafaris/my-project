// schemas/travelInterest.ts
import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'travelInterest',
  title: 'Travel Interest',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'isTopInterest',
      title: 'Top Interest',
      type: 'boolean',
      initialValue: false,
      description: 'Mark this if it should show as a top interest on the homepage',
    }),
  ],
})
