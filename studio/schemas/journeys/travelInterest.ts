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
    defineField({
      name: 'sortOrder',
      title: 'Sort Order',
      type: 'number',
      description: 'Unique number for ordering Top Interests. Lower = higher.',
      validation: (Rule) => Rule.min(0).integer(),
    }),
    defineField({
      name: 'category',
      title: 'Filter Category',
      type: 'string',
      options: {
        list: [
          {title: 'Signature Safari Experience', value: 'signature'},
          {title: 'Travel Style', value: 'style'},
          {title: 'Trip Feature', value: 'feature'},
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      isTopInterest: 'isTopInterest',
      category: 'category',
      sortOrder: 'sortOrder',
    },
    prepare({title, isTopInterest, category, sortOrder}) {
      const label = isTopInterest ? '⭐' : ''
      const order = typeof sortOrder === 'number' ? `#${sortOrder}` : ''
      return {
        title: `${label} ${title} ${order}`.trim(),
        subtitle: category ? `Category: ${category}` : undefined,
      }
    },
  },
})
