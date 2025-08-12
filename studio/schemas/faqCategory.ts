import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'faqCategory',
  title: 'FAQ Category',
  type: 'document',
  fields: [
    defineField({name: 'title', type: 'string', validation: (r) => r.required()}),
    defineField({
      name: 'slug',
      type: 'slug',
      options: {source: 'title'},
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'questions',
      title: 'Questions (optional manual curation)',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'faqQuestion'}]}],
    }),
    defineField({name: 'order', type: 'number', initialValue: 0}),
  ],
  orderings: [{title: 'Order', name: 'orderAsc', by: [{field: 'order', direction: 'asc'}]}],
})
