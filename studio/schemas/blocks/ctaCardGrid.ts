import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'ctaCardGrid',
  title: 'CTA Card Grid',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Section Title',
      type: 'string',
    }),
    defineField({
      name: 'intro',
      title: 'Intro Text',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'cards',
      title: 'Cards',
      type: 'array',
      of: [{type: 'ctaCard'}],
      validation: (Rule) =>
        Rule.required().min(1).max(4).error('You can add between 1 and 4 cards'),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      cards: 'cards',
    },
    prepare({title, cards}) {
      return {
        title: title || 'CTA Card Grid',
        subtitle: `${cards?.length || 0} cards`,
      }
    },
  },
})
