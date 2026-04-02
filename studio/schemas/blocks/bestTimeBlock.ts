import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'bestTimeBlock',
  title: 'Best Time Section',
  type: 'object',
  fields: [
    defineField({
      name: 'section',
      title: 'Select Best Time Section',
      type: 'reference',
      to: [{type: 'bestTimeSection'}],
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'section.title',
    },
    prepare({title}) {
      return {
        title: title || 'Best Time Section',
      }
    },
  },
})
